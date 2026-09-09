import { useEffect, useState } from 'react';
import { Trophy, EyeOff } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

type Period = 'weekly' | 'monthly' | 'alltime';
type Row = { id: string; name: string; points: number; tasks: number };

function startOfPeriod(period: Period) {
  const now = new Date();
  if (period === 'alltime') return null;
  const d = new Date(now);
  if (period === 'weekly') {
    const day = d.getDay();
    d.setDate(d.getDate() - day);
  } else {
    d.setDate(1);
  }
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function Leaderboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>('weekly');
  const [hideMe, setHideMe] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) { setRows([]); setLoading(false); return; }
    (async () => {
      setLoading(true);
      const since = startOfPeriod(period);
      let query = supabase.from('profiles').select('id, full_name, username, points').order('points', { ascending: false }).limit(100);
      if (since) {
        const { data: transactions } = await supabase.from('reward_transactions').select('user_id, points').gte('created_at', since);
        const earned = new Map<string, number>();
        (transactions ?? []).forEach((t) => earned.set(t.user_id, (earned.get(t.user_id) ?? 0) + Math.max(0, t.points)));
        const { data: profiles } = await query;
        const ids = (profiles ?? []).map((p) => p.id);
        const { data: submissions } = ids.length ? await supabase.from('task_submissions').select('user_id, reviewed_at').eq('status', 'approved').in('user_id', ids).gte('reviewed_at', since) : { data: [] };
        const taskCounts = new Map<string, number>();
        (submissions ?? []).forEach((s) => taskCounts.set(s.user_id, (taskCounts.get(s.user_id) ?? 0) + 1));
        setRows((profiles ?? []).map((p) => ({ id: p.id, name: p.id === user?.id && hideMe ? 'You' : (p.full_name || p.username || 'Learner'), points: earned.get(p.id) ?? 0, tasks: taskCounts.get(p.id) ?? 0 })).filter((r) => r.points > 0).sort((a, b) => b.points - a.points));
      } else {
        const { data: profiles } = await query;
        const ids = (profiles ?? []).map((p) => p.id);
        const { data: submissions } = ids.length ? await supabase.from('task_submissions').select('user_id').eq('status', 'approved').in('user_id', ids) : { data: [] };
        const taskCounts = new Map<string, number>();
        (submissions ?? []).forEach((s) => taskCounts.set(s.user_id, (taskCounts.get(s.user_id) ?? 0) + 1));
        setRows((profiles ?? []).map((p) => ({ id: p.id, name: p.id === user?.id && hideMe ? 'You' : (p.full_name || p.username || 'Learner'), points: p.points ?? 0, tasks: taskCounts.get(p.id) ?? 0 })).sort((a, b) => b.points - a.points));
      }
      setLoading(false);
    })();
  }, [period, user, hideMe]);

  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-2xl font-extrabold text-navy-900">Leaderboard</h1><p className="text-sm text-navy-500">See how you rank against other learners.</p></div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">{(['weekly', 'monthly', 'alltime'] as const).map((p) => <button key={p} onClick={() => setPeriod(p)} className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${period === p ? 'bg-navy-900 text-white' : 'bg-navy-100 text-navy-600 hover:bg-navy-200'}`}>{p === 'alltime' ? 'All-time' : p}</button>)}</div>
        <label className="flex items-center gap-2 text-xs text-navy-500"><input type="checkbox" checked={hideMe} onChange={(e) => setHideMe(e.target.checked)} /><EyeOff size={13} /> Hide my name from public leaderboard</label>
      </div>
      <div className="card overflow-hidden">{loading ? <p className="p-8 text-center text-sm text-navy-500">Loading leaderboard…</p> : rows.length === 0 ? <p className="p-8 text-center text-sm text-navy-500">No leaderboard activity yet.</p> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-navy-50 text-left text-xs font-semibold uppercase text-navy-500"><tr><th className="px-5 py-3">Rank</th><th className="px-5 py-3">User</th><th className="px-5 py-3">Points</th><th className="px-5 py-3">Tasks completed</th></tr></thead><tbody className="divide-y divide-navy-100">{rows.map((row, i) => <tr key={row.id}><td className="px-5 py-3 font-mono font-semibold text-navy-700">{i < 3 ? <Trophy size={15} className="inline text-brand-amber" /> : `#${i + 1}`}</td><td className="px-5 py-3 font-medium text-navy-900">{row.id === user?.id && hideMe ? 'You' : row.name}</td><td className="px-5 py-3 font-mono text-brand-green-dark">{row.points.toLocaleString()}</td><td className="px-5 py-3 text-navy-600">{row.tasks}</td></tr>)}</tbody></table></div>}</div>
    </div>
  );
}
