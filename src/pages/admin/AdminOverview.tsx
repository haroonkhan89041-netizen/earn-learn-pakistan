import { useEffect, useState } from 'react';
import { Users, ListChecks, TrendingUp, Wallet, Link2, Megaphone } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Stat { label: string; value: string; icon: any; }

const DEMO_STATS: Stat[] = [
  { label: 'Total users', value: '3,482', icon: Users },
  { label: 'Active users (30d)', value: '1,120', icon: TrendingUp },
  { label: 'New users (7d)', value: '96', icon: Users },
  { label: 'Completed tasks', value: '18,204', icon: ListChecks },
  { label: 'Points issued', value: '412,900', icon: TrendingUp },
  { label: 'Pending withdrawals', value: '14', icon: Wallet },
  { label: 'Paid withdrawals (30d)', value: 'PKR 186,500', icon: Wallet },
  { label: 'Opportunity clicks (30d)', value: '2,910', icon: Link2 },
];

export function AdminOverview() {
  const [stats, setStats] = useState<Stat[]>(DEMO_STATS);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const [
        totalUsers, newUsers, activeCompletions, verifiedTasks,
        positivePoints, pendingWithdrawals, paidWithdrawals30d, opportunities,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', since7d),
        supabase.from('task_completions').select('user_id').gte('created_at', since30d),
        supabase.from('task_completions').select('id', { count: 'exact', head: true }).eq('status', 'verified'),
        supabase.from('points_transactions').select('amount').gt('amount', 0),
        supabase.from('withdrawals').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('withdrawals').select('amount_pkr').eq('status', 'paid').gte('processed_at', since30d),
        supabase.from('opportunities').select('click_count'),
      ]);

      const activeUserCount = new Set((activeCompletions.data ?? []).map((r: any) => r.user_id)).size;
      const pointsIssued = (positivePoints.data ?? []).reduce((sum: number, r: any) => sum + r.amount, 0);
      const paidPkr = (paidWithdrawals30d.data ?? []).reduce((sum: number, r: any) => sum + Number(r.amount_pkr), 0);
      const totalClicks = (opportunities.data ?? []).reduce((sum: number, r: any) => sum + r.click_count, 0);

      setStats([
        { label: 'Total users', value: (totalUsers.count ?? 0).toLocaleString(), icon: Users },
        { label: 'Active users (30d)', value: activeUserCount.toLocaleString(), icon: TrendingUp },
        { label: 'New users (7d)', value: (newUsers.count ?? 0).toLocaleString(), icon: Users },
        { label: 'Completed tasks', value: (verifiedTasks.count ?? 0).toLocaleString(), icon: ListChecks },
        { label: 'Points issued', value: pointsIssued.toLocaleString(), icon: TrendingUp },
        { label: 'Pending withdrawals', value: (pendingWithdrawals.count ?? 0).toLocaleString(), icon: Wallet },
        { label: 'Paid withdrawals (30d)', value: `PKR ${paidPkr.toLocaleString()}`, icon: Wallet },
        { label: 'Opportunity clicks (all time)', value: totalClicks.toLocaleString(), icon: Link2 },
      ]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Overview</h1>
        <p className="text-sm text-navy-500">
          {isSupabaseConfigured ? 'Live platform-wide analytics.' : 'Demo snapshot — connect Supabase for live data.'}
        </p>
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
          <p className="text-sm text-navy-500">
            Review pending withdrawals and opportunity submissions regularly — nothing is
            auto-approved. Configure reward rates under Settings.
          </p>
        </div>
      </div>
    </div>
  );
}
