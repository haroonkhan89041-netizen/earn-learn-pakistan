import { NavLink, Outlet, Link, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, ListChecks, GraduationCap, Wallet, Users,
  Trophy, Bell, User, LifeBuoy, LogOut, GraduationCap as Logo, ShieldCheck,
  ChevronRight, Sparkles,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ADMIN_EMAIL = 'hk0870614@gmail.com';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', description: 'Your overview', icon: LayoutDashboard, tone: 'blue', end: true },
  { to: '/dashboard/opportunities', label: 'Opportunities', description: 'Find ways to earn', icon: Briefcase, tone: 'violet' },
  { to: '/dashboard/tasks', label: 'Daily Tasks', description: 'Complete & earn', icon: ListChecks, tone: 'emerald' },
  { to: '/dashboard/learn', label: 'Learn Skills', description: 'Grow your skills', icon: GraduationCap, tone: 'cyan' },
  { to: '/dashboard/rewards', label: 'Rewards', description: 'Track your earnings', icon: Wallet, tone: 'amber' },
  { to: '/dashboard/referrals', label: 'Referrals', description: 'Invite & earn', icon: Users, tone: 'orange' },
  { to: '/dashboard/leaderboard', label: 'Leaderboard', description: 'See top earners', icon: Trophy, tone: 'gold' },
  { to: '/dashboard/notifications', label: 'Notifications', description: 'Stay up to date', icon: Bell, tone: 'rose', badge: '3' },
  { to: '/dashboard/profile', label: 'Profile', description: 'Manage your account', icon: User, tone: 'indigo' },
  { to: '/dashboard/support', label: 'Support', description: 'We are here to help', icon: LifeBuoy, tone: 'teal' },
];

const mobileNavItems = navItems.slice(0, 5);

export function DashboardLayout() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-navy-400">Loading…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;

  const isAdmin = user.email?.toLowerCase() === ADMIN_EMAIL || profile?.role === 'admin';
  const memberName = profile?.full_name || 'Member';
  const memberInitial = memberName.charAt(0).toUpperCase();

  return (
    <div className="dashboard-shell min-h-screen md:flex">
      <aside className="dashboard-sidebar hidden w-[290px] shrink-0 flex-col md:flex">
        <div className="sidebar-top">
          <Link to="/" className="sidebar-brand" aria-label="Earn & Learn Pakistan home">
            <span className="sidebar-brand-mark"><Logo size={20} strokeWidth={2.5} /></span>
            <span className="sidebar-brand-copy">
              <span className="sidebar-brand-title">Earn &amp; Learn</span>
              <span className="sidebar-brand-subtitle">PAKISTAN</span>
            </span>
            <span className="sidebar-brand-spark"><Sparkles size={14} /></span>
          </Link>

          <div className="sidebar-member-card">
            <div className="sidebar-member-avatar">{memberInitial}</div>
            <div className="sidebar-member-copy">
              <span className="sidebar-member-eyebrow">WELCOME BACK</span>
              <strong>{memberName}</strong>
              <span>{user.email || 'Earn & Learn member'}</span>
            </div>
            <span className="sidebar-member-status" title="Active member" />
          </div>
        </div>

        <div className="sidebar-scroll">
          <div className="sidebar-section-label"><span>01</span> Workspace</div>
          <nav className="sidebar-nav" aria-label="Dashboard navigation">
            {navItems.slice(0, 7).map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `dashboard-nav-item ${isActive ? 'is-active' : ''}`}>
                {({ isActive }) => (
                  <>
                    <span className={`dashboard-nav-icon tone-${item.tone}`}><item.icon size={18} strokeWidth={isActive ? 2.5 : 2} /></span>
                    <span className="dashboard-nav-copy">
                      <span className="dashboard-nav-label">{item.label}</span>
                      <span className="dashboard-nav-description">{item.description}</span>
                    </span>
                    <span className="dashboard-nav-arrow"><ChevronRight size={15} /></span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-section-label sidebar-section-account"><span>02</span> Account</div>
          <nav className="sidebar-nav" aria-label="Account navigation">
            {navItems.slice(7).map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `dashboard-nav-item ${isActive ? 'is-active' : ''}`}>
                {({ isActive }) => (
                  <>
                    <span className={`dashboard-nav-icon tone-${item.tone}`}><item.icon size={18} strokeWidth={isActive ? 2.5 : 2} /></span>
                    <span className="dashboard-nav-copy">
                      <span className="dashboard-nav-label">{item.label}</span>
                      <span className="dashboard-nav-description">{item.description}</span>
                    </span>
                    {item.badge && <span className="dashboard-nav-badge">{item.badge}</span>}
                    <span className="dashboard-nav-arrow"><ChevronRight size={15} /></span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-bottom">
          {isAdmin && (
            <NavLink to="/admin" className="admin-nav-item">
              <span className="admin-nav-icon"><ShieldCheck size={16} /></span>
              <span><strong>Admin Panel</strong><small>Manage platform</small></span>
              <ChevronRight size={15} />
            </NavLink>
          )}
          <button onClick={signOut} className="logout-nav-item">
            <span className="logout-nav-icon"><LogOut size={16} /></span>
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="dashboard-mobile-header md:hidden">
          <Link to="/" className="flex items-center gap-2 font-display text-sm font-extrabold text-navy-900">
            <span className="sidebar-brand-mark mobile-brand-mark"><Logo size={15} /></span>
            <span>Earn &amp; Learn PK</span>
          </Link>
          <Link to="/dashboard/profile" className="mobile-profile-button">{memberInitial}</Link>
        </header>
        <main className="container-app w-full flex-1 py-6 pb-24 md:py-8 md:pb-8"><Outlet /></main>

        <nav className="dashboard-mobile-nav fixed inset-x-0 bottom-0 z-30 md:hidden" aria-label="Mobile dashboard navigation">
          {mobileNavItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `mobile-nav-item ${isActive ? 'is-active' : ''}`}>
              <span className={`mobile-nav-icon tone-${item.tone}`}><item.icon size={18} /></span>
              <span>{item.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
