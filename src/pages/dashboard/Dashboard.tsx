import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ListChecks, Users, TrendingUp, ArrowRight, Briefcase, Megaphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { VerifiedBadge } from '@/components/ui/Badge';

const statStyles = [
  { label: 'Total Points', icon: TrendingUp, color: 'text-brand-blue bg-brand-blue/10' },
  { label: 'Available Reward', icon: Wallet, color: 'text-brand-green-dark bg-brand-green/10' },
  { label: 'Completed Tasks', icon: ListChecks, color: 'text-amber-700 bg-brand-amber/10' },
  { label: 'Referrals', icon: Users, color: 'text-navy-700 bg-navy-100' },
];

type DashboardTask = { id: string; title: string; reward_points: number; instructions: string | null };
type DashboardOpportunity = { id: string; title: string; verification_status: string; platform_name: string | null };
type DashboardTransaction = { id: string; description: string | null; transaction_type: string; points: number; created_at: string };

function formatDate(value: string) {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  if (diff < 24 * 60 * 60 * 1000) return 'Today';
  if (diff < 48 * 60 * 60 * 1000) return 'Yesterday';
  return date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });
}

export function Dashboard() {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [opportunities, setOpportunities] = useState<DashboardOpportunity[]>([]);
  const [transactions, setTransactions] = useState<DashboardTransaction[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const [completedTasks, setCompletedTasks] = useState(0);
  const [referrals, setReferrals] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !profile?.id) {
      setLoading(false);
      return;
    }

    let active = true;
    (async () => {
      const [tasksResult, opportunitiesResult, transactionResult, submissionsResult, referralsResult, announcementResult] = await Promise.all([
        supabase.from('tasks').select('id,title,reward_points,instructions').eq('status', 'published').order('created_at', { ascending: false }).limit(3),
        supabase.from('opportunities').select('id,title,verification_status,platform_name').eq('status', 'published').eq('verification_status', 'verified').order('featured', { ascending: false }).order('created_at', { ascending: false }).limit(3),
        supabase.from('reward_transactions').select('id,description,transaction_type,points,created_at').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('task_submissions').select('id', { count: 'exact', head: true }).eq('user_id', profile.id).eq('status', 'approved'),
        supabase.from('referrals').select('id', { count: 'exact', head: true }).eq('referrer_id', profile.id),
        supabase.from('site_settings').select('value').eq('key', 'platform_announcement').maybeSingle(),
      ]);

      if (!active) return;
      if (tasksResult.data) setTasks(tasksResult.data as DashboardTask[]);
      if (opportunitiesResult.data) setOpportunities(opportunitiesResult.data as DashboardOpportunity[]);
      if (transactionResult.data) setTransactions(transactionResult.data as DashboardTransaction[]);
      if (typeof announcementResult.data?.value === 'string') setAnnouncement(announcementResult.data.value);
      else setAnnouncement('');
      setCompletedTasks(submissionsResult.count ?? 0);
      setReferrals(referralsResult.count ?? 0);
      setLoading(false);
    })();

    return () => { active = false; };
  }, [profile?.id]);

  const stats = [
    { ...statStyles[0], value: (profile?.points ?? 0).toLocaleString() },
    { ...statStyles[1], value: `PKR ${(profile?.balance ?? 0).toLocaleString()}` },
    { ...statStyles[2], value: completedTasks.toLocaleString() },
    { ...statStyles[3], value: referrals.toLocaleString() },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">
          Welcome back, {profile?.full_name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="text-sm text-navy-500">Here's what's happening with your account.</p>
      </div>

      {announcement && (
        <div className="flex items-start gap-3 rounded-2xl border border-brand-blue/15 bg-brand-blue/5 p-4">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue"><Megaphone size={17} /></div>
          <div><p className="text-xs font-bold uppercase tracking-wide text-brand-blue">Platform announcement</p><p className="mt-1 text-sm text-navy-700">{announcement}</p></div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${s.color}`}><s.icon size={17} /></div>
            <p className="font-mono text-xl font-bold text-navy-900">{s.value}</p>
            <p className="text-xs text-navy-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-navy-900">Today's tasks</h2>
            <Link to="/dashboard/tasks" className="text-xs font-semibold text-brand-blue">View all →</Link>
          </div>
          <div className="space-y-3">
            {loading ? <p className="py-4 text-sm text-navy-400">Loading tasks...</p> : tasks.length === 0 ? <p className="py-4 text-sm text-navy-400">No active tasks right now.</p> : tasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl border border-navy-100 px-4 py-3">
                <div className="min-w-0 pr-4"><p className="text-sm font-semibold text-navy-900 line-clamp-1">{t.title}</p><p className="text-xs text-navy-400 line-clamp-1">{t.instructions || 'Complete this task and submit your proof.'}</p></div>
                <span className="shrink-0 font-mono text-sm font-bold text-brand-green-dark">+{t.reward_points}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-navy-900">Recommended</h2>
            <Link to="/dashboard/opportunities" className="text-xs font-semibold text-brand-blue">View all →</Link>
          </div>
          <div className="space-y-3">
            {loading ? <p className="py-4 text-sm text-navy-400">Loading...</p> : opportunities.length === 0 ? <p className="py-4 text-sm text-navy-400">No verified opportunities yet.</p> : opportunities.map((op) => (
              <div key={op.id} className="rounded-xl border border-navy-100 p-3">
                <div className="mb-1 flex items-center gap-1.5"><Briefcase size={13} className="text-navy-400" /><p className="text-sm font-semibold text-navy-900 line-clamp-1">{op.title}</p></div>
                {op.platform_name && <p className="mb-2 text-xs text-navy-400">{op.platform_name}</p>}
                <VerifiedBadge />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="mb-4 font-display text-base font-bold text-navy-900">Recent transactions</h2>
        <div className="divide-y divide-navy-100">
          {loading ? <p className="py-4 text-sm text-navy-400">Loading transactions...</p> : transactions.length === 0 ? <p className="py-4 text-sm text-navy-400">No transactions yet.</p> : transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-3">
              <div><p className="text-sm font-medium text-navy-800">{t.description || t.transaction_type.replace('_', ' ')}</p><p className="text-xs capitalize text-navy-400">{t.transaction_type.replace('_', ' ')} · {formatDate(t.created_at)}</p></div>
              <span className={`font-mono text-sm font-semibold ${t.points >= 0 ? 'text-brand-green-dark' : 'text-red-600'}`}>{t.points >= 0 ? '+' : ''}{t.points} pts</span>
            </div>
          ))}
        </div>
        <Link to="/dashboard/rewards" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue">View full ledger <ArrowRight size={13} /></Link>
      </div>
    </div>
  );
}
