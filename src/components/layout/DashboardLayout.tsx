import { NavLink, Outlet, Link, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, ListChecks, GraduationCap, Wallet, Users,
  Trophy, Bell, User, LifeBuoy, LogOut, GraduationCap as Logo, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/opportunities', label: 'Opportunities', icon: Briefcase },
  { to: '/dashboard/tasks', label: 'Daily Tasks', icon: ListChecks },
  { to: '/dashboard/learn', label: 'Learn Skills', icon: GraduationCap },
  { to: '/dashboard/rewards', label: 'Rewards', icon: Wallet },
  { to: '/dashboard/referrals', label: 'Referrals', icon: Users },
  { to: '/dashboard/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
  { to: '/dashboard/support', label: 'Support', icon: LifeBuoy },
];

const mobileNavItems = navItems.slice(0, 5);

export function DashboardLayout() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-navy-400">Loading…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-navy-50/50 md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-navy-100 bg-white md:flex">
        <Link to="/" className="flex items-center gap-2 px-6 py-5 font-display text-base font-extrabold text-navy-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-white"><Logo size={16} /></span>
          Earn &amp; Learn PK
        </Link>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-blue/10 text-brand-blue' : 'text-navy-600 hover:bg-navy-50'
                }`
              }
            >
              <item.icon size={18} /> {item.label}
            </NavLink>
          ))}
          {profile?.is_admin && (
            <NavLink to="/admin" className="mt-2 flex items-center gap-3 rounded-xl bg-navy-900 px-3 py-2.5 text-sm font-medium text-white">
              <ShieldCheck size={18} /> Admin Panel
            </NavLink>
          )}
        </nav>
        <button onClick={signOut} className="m-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-navy-500 hover:bg-navy-50">
          <LogOut size={18} /> Log out
        </button>
      </aside>

      <div className="flex-1">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-navy-100 bg-white px-4 py-3 md:hidden">
          <Link to="/" className="flex items-center gap-2 font-display text-sm font-extrabold text-navy-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy-900 text-white"><Logo size={14} /></span>
            Earn &amp; Learn PK
          </Link>
          <Link to="/dashboard/profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-100 text-navy-600">
            <User size={16} />
          </Link>
        </header>

        <main className="container-app py-6 pb-24 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-navy-100 bg-white md:hidden">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                  isActive ? 'text-brand-blue' : 'text-navy-400'
                }`
              }
            >
              <item.icon size={19} />
              {item.label.split(' ')[0]}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
