import { useEffect, useState } from 'react';
import { Users, ListChecks, TrendingUp, Wallet, Megaphone } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Stat { label: string; value: string; icon: any; }

export function AdminOverview() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    (async () => {
      const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const [totalUsers, newUsers, activeSubmissions, verifiedSubmissions, positivePoints, pendingWithdrawals, paidWithdrawals30d] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', since7d),
        supabase.from('task_submissions').select('user_id').gte('created_at', since30d),
        supabase.from('task_submissions').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('reward_transactions').select('points').gt('points', 0),
        supabase.from('withdrawals').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('withdrawals').select('amount').eq('status', 'paid').gte('created_at', since30d),
      ]);
      const activeUserCount = new Set((activeSubmissions.data ?? []).map((r) => r.user_id)).size;
      const pointsIssued = (positivePoints.data ?? []).reduce((sum, r) => sum + Number(r.points), 0);
      const paidPkr = (paidWithdrawals30d.data ?? []).reduce((sum, r) => sum + Number(r.amount), 0);
      setStats([
        { label: 'Total users', value: (totalUsers.count ?? 0).toLocaleString(), icon: Users },
        { label: 'Active users (30d)', value: activeUserCount.toLocaleString(), icon: TrendingUp },
        { label: 'New users (7d)', value: (newUsers.count ?? 0).toLocaleString(), icon: Users },
        { label: 'Verified task submissions', value: (verifiedSubmissions.count ?? 0).toLocaleString(), icon: ListChecks },
        { label: 'Points issued', value: pointsIssued.toLocaleString(), icon: TrendingUp },
        { label: 'Pending withdrawals', value: (pendingWithdrawals.count ?? 0).toLocaleString(), icon: Wallet },
        { label: 'Paid withdrawals (30d)', value: `PKR ${paidPkr.toLocaleString()}`, icon: Wallet },
      ]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Overview</h1>
        <p className="text-sm text-navy-500">{isSupabaseConfigured ? 'Live platform-wide analytics.' : 'Supabase is not configured for this environment.'}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <s.icon size={17} className="mb-2 text-brand-blue" />
            <p className="font-mono text-lg font-bold text-navy-900">{loading ? '…' : s.value}</p>
            <p className="text-xs text-navy-500">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="card flex items-start gap-3 p-5">
        <Megaphone size={18} className="mt-0.5 shrink-0 text-brand-blue" />
        <div>
          <p className="font-display text-sm font-bold text-navy-900">Reminder</p>
          <p className="text-sm text-navy-500">Review pending withdrawals and task submissions regularly — nothing is auto-approved. Configure reward rates under Settings.</p>
        </div>
      </div>
    </div>
  );
}
