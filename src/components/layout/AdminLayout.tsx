import { NavLink, Outlet, Link, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Briefcase, ListChecks, GraduationCap, Wallet,
  Settings, BarChart3, Megaphone, ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const items = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/opportunities', label: 'Opportunities', icon: Briefcase },
  { to: '/admin/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/admin/courses', label: 'Courses', icon: GraduationCap },
  { to: '/admin/withdrawals', label: 'Withdrawals', icon: Wallet },
  { to: '/admin/ads', label: 'Advertising', icon: Megaphone },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout() {
  const { user, profile, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-navy-400">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  // INTEGRATION POINT: once Supabase is connected, profile.is_admin comes
  // from the `profiles` table and is enforced again by RLS policies on the
  // server side — this client check is a UX convenience only.
  if (!profile?.is_admin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-navy-50/50 md:flex">
      <aside className="w-full shrink-0 border-b border-navy-100 bg-navy-900 md:h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="px-5 py-5">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-navy-300 hover:text-white">
            <ArrowLeft size={15} /> Back to app
          </Link>
          <p className="mt-3 font-display text-base font-extrabold text-white">Admin Panel</p>
        </div>
        <nav className="flex flex-wrap gap-1 px-3 pb-4 md:flex-col">
          {items.map((item) => (
            <NavLink
              key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-white text-navy-900' : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                }`
              }
            >
              <item.icon size={17} /> {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="container-app flex-1 py-6">
        <Outlet />
      </main>
    </div>
  );
}
