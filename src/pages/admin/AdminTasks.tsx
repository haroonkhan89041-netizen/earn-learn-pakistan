import { useEffect, useState, FormEvent } from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import type { DailyTask, TaskSubmission } from '@/types';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export function AdminTasks() {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [submissions, setSubmissions] = useState<(TaskSubmission & { userName: string; taskTitle: string })[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [defaultReward, setDefaultReward] = useState('20');
  const { confirm, dialog } = useConfirmDialog();

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const [{ data: taskRows }, { data: pending }, { data: rewardSetting }] = await Promise.all([
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('task_submissions').select('*, profiles!task_submissions_user_id_fkey(full_name), tasks(title)').eq('status', 'pending').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('value').eq('key', 'default_task_reward_points').maybeSingle(),
      ]);
      if (taskRows) setTasks(taskRows as DailyTask[]);
      if (pending) setSubmissions(pending.map((s: any) => ({ ...s, userName: s.profiles?.full_name ?? 'Unknown', taskTitle: s.tasks?.title ?? 'Task' })) as any);
      if (rewardSetting?.value !== null && rewardSetting?.value !== undefined) setDefaultReward(String(rewardSetting.value));
    })();
  }, []);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const points = Number(fd.get('points') || 0);
    if (!Number.isInteger(points) || points < 1) { toast.error('Reward points must be a positive whole number'); return; }
    const payload = {
      title: String(fd.get('title') || ''),
      description: String(fd.get('description') || ''),
      instructions: String(fd.get('instructions') || ''),
      reward_points: points,
      proof_required: true,
      proof_type: 'text',
      status: 'published',
      starts_at: null,
      ends_at: null,
      max_completions: null,
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('tasks').insert(payload).select().single();
      if (error) { toast.error(error.message); return; }
      setTasks((prev) => [data as DailyTask, ...prev]);
    }
    setShowForm(false);
    form.reset();
    toast.success('Task created');
  }

  function remove(t: DailyTask) {
    confirm({ title: 'Delete task', description: `Delete "${t.title}"?`, confirmLabel: 'Delete', danger: true, onConfirm: async () => {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('tasks').delete().eq('id', t.id);
        if (error) { toast.error(error.message); return; }
      }
      setTasks((prev) => prev.filter((x) => x.id !== t.id));
      toast.success('Deleted');
    }});
  }

  async function verify(id: string) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.rpc('admin_verify_task_completion', { submission_id: id });
      if (error) { toast.error(error.message); return; }
    }
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    toast.success('Completion verified — points credited to user');
  }

  return (
    <div className="space-y-6">
      {dialog}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-navy-900">Tasks</h1>
          <p className="text-sm text-navy-500">Create tasks and verify user completions.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}><Plus size={16} /> New task</button>
      </div>
      {showForm && (
        <form onSubmit={onCreate} className="card grid gap-3 p-5 sm:grid-cols-2">
          <input name="title" required placeholder="Title" className="input sm:col-span-2" />
          <textarea name="description" required placeholder="Description" className="input sm:col-span-2" rows={2} />
          <textarea name="instructions" required placeholder="Instructions" className="input sm:col-span-2" rows={2} />
          <div>
            <label className="label">Reward points</label>
            <input name="points" required type="number" min="1" step="1" value={defaultReward} onChange={(e) => setDefaultReward(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Estimated minutes (optional)</label>
            <input name="minutes" type="number" min="1" placeholder="e.g. 10" className="input" />
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <button className="btn-primary">Create task</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
          </div>
        </form>
      )}
      <div className="card p-5">
        <h2 className="mb-4 font-display text-base font-bold text-navy-900">Pending verifications</h2>
        {submissions.length === 0 ? <p className="text-sm text-navy-400">No submissions waiting for review.</p> : <div className="divide-y divide-navy-100">{submissions.map((s) => <div key={s.id} className="flex items-center justify-between py-3"><div><p className="text-sm font-medium text-navy-900">{s.taskTitle}</p><p className="text-xs text-navy-400">{s.userName} · submitted {new Date(s.created_at).toLocaleString()}</p></div><button onClick={() => verify(s.id)} className="btn-success !px-3 !py-1.5 text-xs"><CheckCircle2 size={14} /> Verify &amp; award points</button></div>)}</div>}
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-left text-xs font-semibold uppercase text-navy-500"><tr><th className="px-5 py-3">Title</th><th className="px-5 py-3">Reward</th><th className="px-5 py-3">Status</th><th className="px-5 py-3"></th></tr></thead>
          <tbody className="divide-y divide-navy-100">{tasks.map((t) => <tr key={t.id}><td className="px-5 py-3 font-medium text-navy-900">{t.title}</td><td className="px-5 py-3 font-mono text-brand-green-dark">+{t.reward_points}</td><td className="px-5 py-3 capitalize">{t.status}</td><td className="px-5 py-3"><button onClick={() => remove(t)} className="rounded-lg bg-navy-50 p-1.5 text-navy-500"><Trash2 size={15} /></button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
