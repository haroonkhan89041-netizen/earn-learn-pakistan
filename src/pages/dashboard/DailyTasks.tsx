import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FileText, Video, HelpCircle, Sparkles, ClipboardList, Megaphone, Clock, CheckCircle2 } from 'lucide-react';
import { DEMO_TASKS } from '@/data/demoData';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { DailyTask, TaskType, CompletionStatus } from '@/types';

const typeIcon: Record<TaskType, any> = {
  article: FileText, video: Video, quiz: HelpCircle,
  skill_lesson: Sparkles, survey: ClipboardList, sponsored: Megaphone,
};

export function DailyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<DailyTask[]>(DEMO_TASKS);
  const [statuses, setStatuses] = useState<Record<string, CompletionStatus | 'not_started'>>({});

  useEffect(() => {
    if (!isSupabaseConfigured || !user) return;
    (async () => {
      const { data: taskRows } = await supabase.from('tasks').select('*').eq('is_active', true).order('created_at', { ascending: false });
      if (taskRows) setTasks(taskRows as DailyTask[]);

      const { data: completions } = await supabase
        .from('task_completions')
        .select('task_id, status')
        .eq('user_id', user.id);
      if (completions) {
        const map: Record<string, CompletionStatus> = {};
        completions.forEach((c: any) => { map[c.task_id] = c.status; });
        setStatuses(map);
      }
    })();
  }, [user]);

  async function start(id: string) {
    setStatuses((s) => ({ ...s, [id]: 'in_progress' }));
    if (isSupabaseConfigured && user) {
      await supabase.from('task_completions').upsert(
        { task_id: id, user_id: user.id, status: 'in_progress' },
        { onConflict: 'task_id,user_id' }
      );
    }
  }

  async function submit(id: string, points: number) {
    setStatuses((s) => ({ ...s, [id]: 'submitted' }));
    if (isSupabaseConfigured && user) {
      await supabase.from('task_completions').upsert(
        { task_id: id, user_id: user.id, status: 'submitted', submitted_at: new Date().toISOString() },
        { onConflict: 'task_id,user_id' }
      );
    }
    toast.success(`Submitted! ${points} points will be credited once an admin verifies it.`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Daily tasks</h1>
        <p className="text-sm text-navy-500">
          Points are credited only after your completion is verified — never instantly.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map((t) => {
          const Icon = typeIcon[t.task_type];
          const status = statuses[t.id] ?? 'not_started';
          return (
            <div key={t.id} className="card p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                  <Icon size={18} />
                </div>
                <span className="font-mono text-sm font-bold text-brand-green-dark">+{t.reward_points} pts</span>
              </div>
              <p className="font-display text-base font-bold text-navy-900">{t.title}</p>
              <p className="mt-1 text-sm text-navy-500">{t.description}</p>
              <p className="mt-3 flex items-center gap-1 text-xs text-navy-400">
                <Clock size={13} /> {t.estimated_minutes} min · {t.task_type.replace('_', ' ')}
              </p>

              <div className="mt-4">
                {status === 'not_started' && (
                  <button className="btn-primary w-full" onClick={() => start(t.id)}>Start task</button>
                )}
                {status === 'in_progress' && (
                  <button className="btn-success w-full" onClick={() => submit(t.id, t.reward_points)}>
                    Mark complete &amp; submit for review
                  </button>
                )}
                {(status === 'submitted') && (
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-brand-amber/10 py-2.5 text-sm font-semibold text-amber-700">
                    <CheckCircle2 size={16} /> Submitted — awaiting verification
                  </div>
                )}
                {status === 'verified' && (
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-brand-green/10 py-2.5 text-sm font-semibold text-brand-green-dark">
                    <CheckCircle2 size={16} /> Verified — points credited
                  </div>
                )}
                {status === 'rejected' && (
                  <div className="rounded-xl bg-red-50 py-2.5 text-center text-sm font-semibold text-red-600">
                    Not approved — try again
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
