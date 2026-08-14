import { Link } from 'react-router-dom';
import { Wallet, ListChecks, Users, TrendingUp, ArrowRight, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DEMO_OPPORTUNITIES, DEMO_TASKS } from '@/data/demoData';
import { VerifiedBadge } from '@/components/ui/Badge';

const stats = [
  { label: 'Total Points', value: '1,250', icon: TrendingUp, color: 'text-brand-blue bg-brand-blue/10' },
  { label: 'Available Reward', value: 'PKR 625', icon: Wallet, color: 'text-brand-green-dark bg-brand-green/10' },
  { label: 'Completed Tasks', value: '48', icon: ListChecks, color: 'text-amber-700 bg-brand-amber/10' },
  { label: 'Referrals', value: '6', icon: Users, color: 'text-navy-700 bg-navy-100' },
];

const recentTransactions = [
  { desc: 'Quiz: Digital Marketing Basics', type: 'Task reward', amount: '+30', date: 'Today' },
  { desc: 'Referral bonus — Sana M.', type: 'Referral reward', amount: '+50', date: 'Yesterday' },
  { desc: 'Withdrawal request', type: 'Withdrawal deduction', amount: '-500', date: '3 days ago' },
  { desc: 'Video: Writing a Winning Proposal', type: 'Task reward', amount: '+25', date: '4 days ago' },
];

export function Dashboard() {
  const { profile } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">
          Welcome back, {profile?.full_name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="text-sm text-navy-500">Here's what's happening with your account.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${s.color}`}>
              <s.icon size={17} />
            </div>
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
            {DEMO_TASKS.slice(0, 3).map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl border border-navy-100 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-navy-900">{t.title}</p>
                  <p className="text-xs text-navy-400">{t.estimated_minutes} min · {t.task_type.replace('_', ' ')}</p>
                </div>
                <span className="font-mono text-sm font-bold text-brand-green-dark">+{t.reward_points}</span>
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
            {DEMO_OPPORTUNITIES.slice(0, 3).map((op) => (
              <div key={op.id} className="rounded-xl border border-navy-100 p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <Briefcase size={13} className="text-navy-400" />
                  <p className="text-sm font-semibold text-navy-900 line-clamp-1">{op.title}</p>
                </div>
                {op.is_verified && <VerifiedBadge />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="mb-4 font-display text-base font-bold text-navy-900">Recent transactions</h2>
        <div className="divide-y divide-navy-100">
          {recentTransactions.map((t, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-navy-800">{t.desc}</p>
                <p className="text-xs text-navy-400">{t.type} · {t.date}</p>
              </div>
              <span className={`font-mono text-sm font-semibold ${t.amount.startsWith('+') ? 'text-brand-green-dark' : 'text-red-600'}`}>
                {t.amount} pts
              </span>
            </div>
          ))}
        </div>
        <Link to="/dashboard/rewards" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue">
          View full ledger <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
