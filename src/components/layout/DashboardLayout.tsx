import { NavLink, Outlet, Link, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, ListChecks, GraduationCap, Wallet, Users,
  Trophy, Bell, User, LifeBuoy, LogOut, GraduationCap as Logo, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ADMIN_EMAIL = 'hk0870614@gmail.com';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tone: 'blue', end: true },
  { to: '/dashboard/opportunities', label: 'Opportunities', icon: Briefcase, tone: 'violet' },
  { to: '/dashboard/tasks', label: 'Daily Tasks', icon: ListChecks, tone: 'emerald' },
  { to: '/dashboard/learn', label: 'Learn Skills', icon: GraduationCap, tone: 'cyan' },
  { to: '/dashboard/rewards', label: 'Rewards', icon: Wallet, tone: 'amber' },
  { to: '/dashboard/referrals', label: 'Referrals', icon: Users, tone: 'orange' },
  { to: '/dashboard/leaderboard', label: 'Leaderboard', icon: Trophy, tone: 'gold' },
  { to: '/dashboard/notifications', label: 'Notifications', icon: Bell, tone: 'rose', badge: '3' },
  { to: '/dashboard/profile', label: 'Profile', icon: User, tone: 'indigo' },
  { to: '/dashboard/support', label: 'Support', icon: LifeBuoy, tone: 'teal' },
];

const mobileNavItems = navItems.slice(0, 5);

export function DashboardLayout() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-navy-400">Loading…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;

  const isAdmin = user.email?.toLowerCase() === ADMIN_EMAIL || profile?.role === 'admin';

  return (
    <div className="dashboard-shell min-h-screen md:flex">
      <aside className="dashboard-sidebar hidden w-72 shrink-0 flex-col md:flex">
        <div className="sidebar-brand-wrap">
          <Link to="/" className="sidebar-brand" aria-label="Earn & Learn Pakistan home">
            <span className="sidebar-brand-mark"><Logo size={19} strokeWidth={2.4} /></span>
            <span>
              <span className="sidebar-brand-title">Earn &amp; Learn</span>
              <span className="sidebar-brand-subtitle">Pakistan</span>
            </span>
          </Link>
        </div>

        <div className="sidebar-section-label">Workspace</div>
        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          {navItems.slice(0, 7).map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `dashboard-nav-item ${isActive ? 'is-active' : ''}`}>
              {({ isActive }) => (
                <>
                  <span className={`dashboard-nav-icon tone-${item.tone}`}><item.icon size={18} strokeWidth={isActive ? 2.5 : 2} /></span>
                  <span className="dashboard-nav-label">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-section-label sidebar-section-account">Account</div>
        <nav className="sidebar-nav" aria-label="Account navigation">
          {navItems.slice(7).map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `dashboard-nav-item ${isActive ? 'is-active' : ''}`}>
              {({ isActive }) => (
                <>
                  <span className={`dashboard-nav-icon tone-${item.tone}`}><item.icon size={18} strokeWidth={isActive ? 2.5 : 2} /></span>
                  <span className="dashboard-nav-label">{item.label}</span>
                  {item.badge && <span className="dashboard-nav-badge">{item.badge}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {isAdmin && (
            <NavLink to="/admin" className="admin-nav-item">
              <span className="admin-nav-icon"><ShieldCheck size={17} /></span>
              <span>Admin Panel</span>
            </NavLink>
          )}
          <button onClick={signOut} className="logout-nav-item">
            <span className="logout-nav-icon"><LogOut size={17} /></span>
            <span>Log out</span>
          </button>
          <div className="sidebar-user-card">
            <span className="sidebar-user-avatar">{(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}</span>
            <span className="sidebar-user-copy">
              <strong>{profile?.full_name || 'Member'}</strong>
              <small>Earn &amp; Learn member</small>
            </span>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="dashboard-mobile-header md:hidden">
          <Link to="/" className="flex items-center gap-2 font-display text-sm font-extrabold text-navy-900">
            <span className="sidebar-brand-mark mobile-brand-mark"><Logo size={15} /></span>
            <span>Earn &amp; Learn PK</span>
          </Link>
          <Link to="/dashboard/profile" className="mobile-profile-button"><User size={16} /></Link>
        </header>
        <main className="container-app w-full flex-1 py-6 pb-24 md:pb-8"><Outlet /></main>

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
