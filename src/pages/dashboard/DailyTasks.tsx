import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ClipboardList, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { DailyTask, SubmissionStatus } from '@/types';

export function DailyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [statuses, setStatuses] = useState<Record<string, SubmissionStatus>>({});
  const [proofs, setProofs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !user) { setLoading(false); return; }
    (async () => {
      const { data: taskRows } = await supabase.from('tasks').select('*').eq('status', 'published').order('created_at', { ascending: false });
      if (taskRows) setTasks(taskRows as DailyTask[]);
      const { data: submissions } = await supabase.from('task_submissions').select('task_id, status').eq('user_id', user.id);
      if (submissions) {
        const map: Record<string, SubmissionStatus> = {};
        submissions.forEach((s) => { map[s.task_id] = s.status as SubmissionStatus; });
        setStatuses(map);
      }
      setLoading(false);
    })();
  }, [user]);

  async function submit(task: DailyTask) {
    if (!user) return toast.error('Please sign in first.');
    if (task.proof_required && !proofs[task.id]?.trim()) return toast.error('Please provide the required proof.');
    setSubmitting(task.id);
    const { error } = await supabase.from('task_submissions').insert({
      task_id: task.id,
      user_id: user.id,
      proof_text: task.proof_type === 'text' || task.proof_type === 'image' ? (proofs[task.id]?.trim() || null) : null,
      proof_url: task.proof_type === 'url' ? (proofs[task.id]?.trim() || null) : null,
    });
    setSubmitting(null);
    if (error) return toast.error(error.message);
    setStatuses((s) => ({ ...s, [task.id]: 'pending' }));
    toast.success('Task submitted. Points will be added only after admin approval.');
  }

  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-2xl font-extrabold text-navy-900">Daily tasks</h1><p className="text-sm text-navy-500">Complete tasks and submit proof. Rewards are credited after verification.</p></div>
      {loading ? <p className="text-sm text-navy-500">Loading tasks…</p> : tasks.length === 0 ? <div className="card p-8 text-center text-sm text-navy-500">No published tasks are available right now.</div> : <div className="grid gap-4 md:grid-cols-2">{tasks.map((t) => {
        const status = statuses[t.id];
        return <div key={t.id} className="card p-5">
          <div className="mb-3 flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue"><ClipboardList size={18} /></div><span className="font-mono text-sm font-bold text-brand-green-dark">+{t.reward_points} pts</span></div>
          <p className="font-display text-base font-bold text-navy-900">{t.title}</p><p className="mt-1 text-sm text-navy-500">{t.description}</p>
          <p className="mt-3 whitespace-pre-line text-sm text-navy-600">{t.instructions}</p>
          {t.ends_at && <p className="mt-3 flex items-center gap-1 text-xs text-navy-400"><Clock size={13} /> Ends {new Date(t.ends_at).toLocaleString()}</p>}
          {!status && <div className="mt-4 space-y-2">{t.proof_required && <input className="input" placeholder={t.proof_type === 'url' ? 'Paste proof URL' : 'Enter your proof'} value={proofs[t.id] || ''} onChange={(e) => setProofs((p) => ({ ...p, [t.id]: e.target.value }))} />}<button className="btn-primary w-full" onClick={() => submit(t)} disabled={submitting === t.id}>{submitting === t.id ? 'Submitting…' : 'Submit task'}</button></div>}
          {status === 'pending' && <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand-amber/10 py-2.5 text-sm font-semibold text-amber-700"><CheckCircle2 size={16} /> Pending admin review</div>}
          {status === 'approved' && <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand-green/10 py-2.5 text-sm font-semibold text-brand-green-dark"><CheckCircle2 size={16} /> Approved — points credited</div>}
          {status === 'rejected' && <div className="mt-4 rounded-xl bg-red-50 py-2.5 text-center text-sm font-semibold text-red-600">Rejected — check your proof and try again</div>}
        </div>;
      })}</div>}
    </div>
  );
}
