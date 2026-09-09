import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Row { metric: string; value: string; }

export function AdminAnalytics() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    (async () => {
      const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const [totalUsers, newUsers, activeSubmissions, verifiedSubmissions, positivePoints, pendingWithdrawals, paidWithdrawals30d, referrals30d] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', since7d),
        supabase.from('task_submissions').select('user_id').gte('created_at', since30d),
        supabase.from('task_submissions').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('reward_transactions').select('points').gt('points', 0),
        supabase.from('withdrawals').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('withdrawals').select('amount').eq('status', 'paid').gte('created_at', since30d),
        supabase.from('referrals').select('id', { count: 'exact', head: true }).gte('created_at', since30d),
      ]);
      const activeUserCount = new Set((activeSubmissions.data ?? []).map((r) => r.user_id)).size;
      const pointsIssued = (positivePoints.data ?? []).reduce((sum, r) => sum + Number(r.points), 0);
      const paidPkr = (paidWithdrawals30d.data ?? []).reduce((sum, r) => sum + Number(r.amount), 0);
      setRows([
        { metric: 'Total users', value: (totalUsers.count ?? 0).toLocaleString() },
        { metric: 'New users (7d)', value: (newUsers.count ?? 0).toLocaleString() },
        { metric: 'Active users (30d, task activity)', value: activeUserCount.toLocaleString() },
        { metric: 'Verified task submissions', value: (verifiedSubmissions.count ?? 0).toLocaleString() },
        { metric: 'Points issued (all time)', value: pointsIssued.toLocaleString() },
        { metric: 'Pending withdrawal requests', value: (pendingWithdrawals.count ?? 0).toLocaleString() },
        { metric: 'Paid withdrawals (30d)', value: `PKR ${paidPkr.toLocaleString()}` },
        { metric: 'Referral sign-ups (30d)', value: (referrals30d.count ?? 0).toLocaleString() },
      ]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Analytics</h1>
        <p className="text-sm text-navy-500">{isSupabaseConfigured ? 'Computed live from your production Supabase tables.' : 'Supabase is not configured for this environment.'}</p>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-navy-100">
            {rows.map((r) => (
              <tr key={r.metric}>
                <td className="px-5 py-3 text-navy-600">{r.metric}</td>
                <td className="px-5 py-3 text-right font-mono font-semibold text-navy-900">{loading ? '…' : r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-navy-400">Active users are approximated by task-submission activity in the last 30 days.</p>
    </div>
  );
}
