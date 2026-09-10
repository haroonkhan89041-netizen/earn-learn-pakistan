import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight, Bell, Briefcase, CheckCircle2, ChevronRight, Clock3,
  Coins, ListChecks, Megaphone, Plus, Search, TrendingUp, Users, Wallet,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { VerifiedBadge } from '@/components/ui/Badge';

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
        supabase.from('tasks').select('id,title,reward_points,instructions').eq('status', 'published').order('created_at', { ascending: false }).limit(5),
        supabase.from('opportunities').select('id,title,verification_status,platform_name').eq('status', 'published').eq('verification_status', 'verified').order('featured', { ascending: false }).order('created_at', { ascending: false }).limit(4),
        supabase.from('reward_transactions').select('id,description,transaction_type,points,created_at').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('task_submissions').select('id', { count: 'exact', head: true }).eq('user_id', profile.id).eq('status', 'approved'),
        supabase.from('referrals').select('id', { count: 'exact', head: true }).eq('referrer_id', profile.id),
        supabase.from('site_settings').select('value').eq('key', 'platform_announcement').maybeSingle(),
      ]);
      if (!active) return;
      if (tasksResult.data) setTasks(tasksResult.data as DashboardTask[]);
      if (opportunitiesResult.data) setOpportunities(opportunitiesResult.data as DashboardOpportunity[]);
      if (transactionResult.data) setTransactions(transactionResult.data as DashboardTransaction[]);
      setAnnouncement(typeof announcementResult.data?.value === 'string' ? announcementResult.data.value : '');
      setCompletedTasks(submissionsResult.count ?? 0);
      setReferrals(referralsResult.count ?? 0);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [profile?.id]);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';
  const points = profile?.points ?? 0;
  const balance = profile?.balance ?? 0;
  const completion = Math.min(100, completedTasks > 0 ? Math.round((completedTasks / Math.max(completedTasks + tasks.length, 1)) * 100) : 0);
  const transactionBars = useMemo(() => {
    const base = transactions.slice(0, 7).map((item) => Math.max(10, Math.min(100, Math.abs(item.points) / Math.max(1, points) * 700)));
    return base.length ? base.reverse() : [22, 34, 28, 48, 40, 66, 54];
  }, [transactions, points]);

  return (
    <div className="member-dashboard">
      <header className="member-dashboard-topbar">
        <div className="member-dashboard-title-wrap">
          <div className="member-dashboard-kicker">MEMBER WORKSPACE</div>
          <h1>Good morning, {firstName} <span>👋</span></h1>
          <p>Here is your earning and learning activity at a glance.</p>
        </div>
        <div className="member-dashboard-actions">
          <label className="dashboard-search"><Search size={17} /><input placeholder="Search anything..." aria-label="Search dashboard" /><kbd>⌘ K</kbd></label>
          <Link to="/dashboard/notifications" className="dashboard-icon-button" aria-label="Notifications"><Bell size={18} /><span /></Link>
          <Link to="/dashboard/profile" className="dashboard-avatar">{firstName.charAt(0).toUpperCase()}</Link>
        </div>
      </header>

      {announcement && (
        <div className="dashboard-announcement"><Megaphone size={17} /><div><strong>Platform update</strong><span>{announcement}</span></div><button aria-label="Dismiss announcement">×</button></div>
      )}

      <section className="dashboard-welcome-grid">
        <div className="dashboard-hero-card">
          <div>
            <span className="dashboard-hero-label">YOUR BALANCE</span>
            <strong>PKR {balance.toLocaleString()}</strong>
            <p><TrendingUp size={14} /> Keep completing tasks to grow your balance.</p>
          </div>
          <div className="dashboard-hero-orb"><Coins size={32} /></div>
          <Link to="/dashboard/rewards" className="dashboard-hero-link">View rewards <ArrowUpRight size={16} /></Link>
        </div>
        <div className="dashboard-progress-card">
          <div className="dashboard-card-heading"><div><span className="dashboard-eyebrow">THIS WEEK</span><h2>Your progress</h2></div><span className="dashboard-progress-percent">{completion}%</span></div>
          <div className="dashboard-progress-track"><span style={{ width: `${Math.max(completion, 8)}%` }} /></div>
          <div className="dashboard-progress-meta"><span>{completedTasks} tasks completed</span><span>{tasks.length} available</span></div>
          <Link to="/dashboard/tasks" className="dashboard-inline-link">Open daily tasks <ChevronRight size={15} /></Link>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        <div className="dashboard-stat-card"><span className="dashboard-stat-icon stat-blue"><TrendingUp size={18} /></span><div><small>Total points</small><strong>{points.toLocaleString()}</strong><em>+12% this month</em></div></div>
        <div className="dashboard-stat-card"><span className="dashboard-stat-icon stat-green"><Wallet size={18} /></span><div><small>Available reward</small><strong>PKR {balance.toLocaleString()}</strong><em>Ready to withdraw</em></div></div>
        <div className="dashboard-stat-card"><span className="dashboard-stat-icon stat-violet"><CheckCircle2 size={18} /></span><div><small>Completed tasks</small><strong>{completedTasks}</strong><em>Keep the streak going</em></div></div>
        <div className="dashboard-stat-card"><span className="dashboard-stat-icon stat-orange"><Users size={18} /></span><div><small>Referrals</small><strong>{referrals}</strong><em>Invite friends & earn</em></div></div>
      </section>

      <section className="dashboard-main-grid">
        <div className="dashboard-panel dashboard-activity-panel">
          <div className="dashboard-panel-header"><div><span className="dashboard-eyebrow">ACTIVITY</span><h2>Recent earnings</h2></div><Link to="/dashboard/rewards">View all <ArrowUpRight size={14} /></Link></div>
          <div className="dashboard-chart">
            <div className="dashboard-chart-labels"><span>Points earned</span><strong>{points.toLocaleString()} pts</strong></div>
            <div className="dashboard-bars">{transactionBars.map((height, index) => <div className="dashboard-bar-wrap" key={`${height}-${index}`}><span className="dashboard-bar" style={{ height: `${height}%` }} /></div>)}</div>
            <div className="dashboard-chart-days"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
          </div>
          <div className="dashboard-transactions">
            {loading ? <div className="dashboard-empty">Loading activity...</div> : transactions.length === 0 ? <div className="dashboard-empty">No transactions yet. Complete a task to start earning.</div> : transactions.slice(0, 3).map((transaction) => (
              <div className="dashboard-transaction" key={transaction.id}><span className="transaction-icon"><Coins size={15} /></span><div><strong>{transaction.description || transaction.transaction_type.replace('_', ' ')}</strong><small>{transaction.transaction_type.replace('_', ' ')} · {formatDate(transaction.created_at)}</small></div><b className={transaction.points < 0 ? 'negative' : ''}>{transaction.points >= 0 ? '+' : ''}{transaction.points} pts</b></div>
            ))}
          </div>
        </div>

        <div className="dashboard-panel dashboard-task-panel">
          <div className="dashboard-panel-header"><div><span className="dashboard-eyebrow">WORK QUEUE</span><h2>Daily tasks</h2></div><Link to="/dashboard/tasks">See all <ArrowUpRight size={14} /></Link></div>
          <div className="dashboard-task-list">
            {loading ? <div className="dashboard-empty">Loading tasks...</div> : tasks.length === 0 ? <div className="dashboard-empty">No active tasks right now.</div> : tasks.slice(0, 4).map((task, index) => (
              <Link to="/dashboard/tasks" className="dashboard-task-row" key={task.id}>
                <span className={`task-number ${index === 0 ? 'active' : ''}`}>{index + 1}</span>
                <span className="task-row-copy"><strong>{task.title}</strong><small><Clock3 size={12} /> {index === 0 ? 'Ready to start' : 'Available now'}</small></span>
                <b>+{task.reward_points}</b>
              </Link>
            ))}
          </div>
          <Link to="/dashboard/tasks" className="dashboard-create-button"><Plus size={17} /> Explore more tasks</Link>
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <div className="dashboard-panel dashboard-opportunity-panel">
          <div className="dashboard-panel-header"><div><span className="dashboard-eyebrow">OPPORTUNITIES</span><h2>Recommended for you</h2></div><Link to="/dashboard/opportunities">Browse all <ArrowUpRight size={14} /></Link></div>
          <div className="dashboard-opportunity-list">
            {loading ? <div className="dashboard-empty">Loading opportunities...</div> : opportunities.length === 0 ? <div className="dashboard-empty">No verified opportunities yet.</div> : opportunities.map((opportunity) => (
              <Link to="/dashboard/opportunities" className="dashboard-opportunity-row" key={opportunity.id}><span className="opportunity-logo"><Briefcase size={17} /></span><span><strong>{opportunity.title}</strong><small>{opportunity.platform_name || 'Verified opportunity'}</small></span><VerifiedBadge /><ChevronRight size={16} /></Link>
            ))}
          </div>
        </div>
        <div className="dashboard-panel dashboard-quick-panel">
          <div className="dashboard-panel-header"><div><span className="dashboard-eyebrow">QUICK ACTIONS</span><h2>Keep moving</h2></div></div>
          <div className="dashboard-quick-grid"><Link to="/dashboard/learn"><span>Learn</span><strong>Build a new skill</strong><ArrowUpRight size={15} /></Link><Link to="/dashboard/referrals"><span>Refer</span><strong>Invite & earn</strong><ArrowUpRight size={15} /></Link><Link to="/dashboard/rewards"><span>Withdraw</span><strong>Manage rewards</strong><ArrowUpRight size={15} /></Link><Link to="/dashboard/profile"><span>Profile</span><strong>Complete your profile</strong><ArrowUpRight size={15} /></Link></div>
        </div>
      </section>

      <div className="dashboard-footer-note"><ListChecks size={15} /> Your dashboard updates automatically as you complete tasks and earn points.</div>
    </div>
  );
}
