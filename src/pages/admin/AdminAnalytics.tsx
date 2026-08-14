import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Row { metric: string; value: string; }

const DEMO_ROWS: Row[] = [
  { metric: 'Total users', value: '3,482' },
  { metric: 'New users (7d)', value: '96' },
  { metric: 'Active users (30d, task activity)', value: '1,120' },
  { metric: 'Completed tasks (verified, all time)', value: '18,204' },
  { metric: 'Points issued (all time)', value: '412,900' },
  { metric: 'Pending withdrawal requests', value: '14' },
  { metric: 'Paid withdrawals (30d)', value: 'PKR 186,500' },
  { metric: 'Referral sign-ups (30d)', value: '211' },
  { metric: 'Opportunity clicks (all time)', value: '2,910' },
];

export function AdminAnalytics() {
  const [rows, setRows] = useState<Row[]>(DEMO_ROWS);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const [
        totalUsers, newUsers, activeCompletions, verifiedTasks,
        positivePoints, pendingWithdrawals, paidWithdrawals30d,
        referrals30d, opportunities,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', since7d),
        supabase.from('task_completions').select('user_id').gte('created_at', since30d),
        supabase.from('task_completions').select('id', { count: 'exact', head: true }).eq('status', 'verified'),
        supabase.from('points_transactions').select('amount').gt('amount', 0),
        supabase.from('withdrawals').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('withdrawals').select('amount_pkr').eq('status', 'paid').gte('processed_at', since30d),
        supabase.from('referrals').select('id', { count: 'exact', head: true }).gte('created_at', since30d),
        supabase.from('opportunities').select('click_count'),
      ]);

      const activeUserCount = new Set((activeCompletions.data ?? []).map((r: any) => r.user_id)).size;
      const pointsIssued = (positivePoints.data ?? []).reduce((sum: number, r: any) => sum + r.amount, 0);
      const paidPkr = (paidWithdrawals30d.data ?? []).reduce((sum: number, r: any) => sum + Number(r.amount_pkr), 0);
      const totalClicks = (opportunities.data ?? []).reduce((sum: number, r: any) => sum + r.click_count, 0);

      setRows([
        { metric: 'Total users', value: (totalUsers.count ?? 0).toLocaleString() },
        { metric: 'New users (7d)', value: (newUsers.count ?? 0).toLocaleString() },
        { metric: 'Active users (30d, task activity)', value: activeUserCount.toLocaleString() },
        { metric: 'Completed tasks (verified, all time)', value: (verifiedTasks.count ?? 0).toLocaleString() },
        { metric: 'Points issued (all time)', value: pointsIssued.toLocaleString() },
        { metric: 'Pending withdrawal requests', value: (pendingWithdrawals.count ?? 0).toLocaleString() },
        { metric: 'Paid withdrawals (30d)', value: `PKR ${paidPkr.toLocaleString()}` },
        { metric: 'Referral sign-ups (30d)', value: (referrals30d.count ?? 0).toLocaleString() },
        { metric: 'Opportunity clicks (all time)', value: totalClicks.toLocaleString() },
      ]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Analytics</h1>
        <p className="text-sm text-navy-500">
          {isSupabaseConfigured
            ? 'Computed live from your Supabase tables.'
            : 'Demo values shown — connect Supabase to compute these live.'}
        </p>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-navy-100">
            {rows.map((r) => (
              <tr key={r.metric}>
                <td className="px-5 py-3 text-navy-600">{r.metric}</td>
                <td className="px-5 py-3 text-right font-mono font-semibold text-navy-900">
                  {loading ? '…' : r.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-navy-400">
        "Active users" approximates activity via task completions in the last 30 days —
        add a `last_active_at` column on `profiles` for a more precise session-based metric.
      </p>
    </div>
  );
}
