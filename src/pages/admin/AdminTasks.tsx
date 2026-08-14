import { useEffect, useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { DEMO_TASKS } from '@/data/demoData';
import type { DailyTask } from '@/types';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const pendingSubmissions = [
  { id: 's1', user: 'Ayesha Khan', task: 'Skill Lesson: Canva for Social Media Graphics', submittedAt: '2 hrs ago' },
  { id: 's2', user: 'Bilal Raza', task: 'Quiz: Digital Marketing Basics', submittedAt: '5 hrs ago' },
];

export function AdminTasks() {
  const [tasks, setTasks] = useState<DailyTask[]>(DEMO_TASKS);
  const [submissions, setSubmissions] = useState(pendingSubmissions);
  const [showForm, setShowForm] = useState(false);
  const { confirm, dialog } = useConfirmDialog();

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const { data: taskRows } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (taskRows) setTasks(taskRows as DailyTask[]);

      const { data: pending } = await supabase
        .from('task_completions')
        // task_completions has two FKs into profiles (user_id, verified_by),
        // so the embed must name the constraint explicitly to avoid an
        // "ambiguous relationship" error from PostgREST.
        .select('id, submitted_at, tasks(title), profiles!task_completions_user_id_fkey(full_name)')
        .eq('status', 'submitted')
        .order('submitted_at', { ascending: false });
      if (pending) {
        setSubmissions(pending.map((s: any) => ({
          id: s.id, user: s.profiles?.full_name ?? 'Unknown', task: s.tasks?.title ?? 'Task',
          submittedAt: s.submitted_at ? new Date(s.submitted_at).toLocaleString() : '',
        })));
      }
    })();
  }, []);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const t: DailyTask = {
      id: `t-${Date.now()}`, title: String(fd.get('title')), description: String(fd.get('description')),
      instructions: String(fd.get('instructions')), task_type: 'article',
      reward_points: Number(fd.get('points')), estimated_minutes: Number(fd.get('minutes')),
      is_active: true, created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured) {
      const { id, ...payload } = t;
      const { data, error } = await supabase.from('tasks').insert(payload).select().single();
      if (error) { toast.error(error.message); return; }
      setTasks((prev) => [data as DailyTask, ...prev]);
    } else {
      setTasks((prev) => [t, ...prev]);
    }
    setShowForm(false);
    toast.success('Task created');
  }

  function remove(t: DailyTask) {
    confirm({
      title: 'Delete task', description: `Delete "${t.title}"?`, confirmLabel: 'Delete', danger: true,
      onConfirm: async () => {
        if (isSupabaseConfigured) {
          const { error } = await supabase.from('tasks').delete().eq('id', t.id);
          if (error) { toast.error(error.message); return; }
        }
        setTasks((prev) => prev.filter((x) => x.id !== t.id));
        toast.success('Deleted');
      },
    });
  }

  async function verify(id: string) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.rpc('admin_verify_task_completion', { completion_id: id });
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
          <input name="points" required type="number" placeholder="Reward points" className="input" />
          <input name="minutes" required type="number" placeholder="Estimated minutes" className="input" />
          <div className="sm:col-span-2 flex gap-2">
            <button className="btn-primary">Create task</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
          </div>
        </form>
      )}

      <div className="card p-5">
        <h2 className="mb-4 font-display text-base font-bold text-navy-900">Pending verifications</h2>
        {submissions.length === 0 ? (
          <p className="text-sm text-navy-400">No submissions waiting for review.</p>
        ) : (
          <div className="divide-y divide-navy-100">
            {submissions.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-navy-900">{s.task}</p>
                  <p className="text-xs text-navy-400">{s.user} · submitted {s.submittedAt}</p>
                </div>
                <button onClick={() => verify(s.id)} className="btn-success !px-3 !py-1.5 text-xs"><CheckCircle2 size={14} /> Verify &amp; award points</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-left text-xs font-semibold uppercase text-navy-500">
            <tr><th className="px-5 py-3">Title</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Reward</th><th className="px-5 py-3">Active</th><th className="px-5 py-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {tasks.map((t) => (
              <tr key={t.id}>
                <td className="px-5 py-3 font-medium text-navy-900">{t.title}</td>
                <td className="px-5 py-3 text-navy-600 capitalize">{t.task_type.replace('_', ' ')}</td>
                <td className="px-5 py-3 font-mono text-brand-green-dark">+{t.reward_points}</td>
                <td className="px-5 py-3">
                  <span className={`badge ${t.is_active ? 'bg-brand-green/10 text-brand-green-dark' : 'bg-navy-100 text-navy-500'}`}>{t.is_active ? 'Active' : 'Inactive'}</span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => remove(t)} className="rounded-lg bg-navy-50 p-1.5 text-navy-500"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
