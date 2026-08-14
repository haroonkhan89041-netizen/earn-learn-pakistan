import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const links = [
  { to: '/opportunities', label: 'Opportunities' },
  { to: '/learn', label: 'Learn Skills' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/90 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold text-navy-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 text-white">
            <GraduationCap size={18} />
          </span>
          Earn <span className="text-brand-blue">&amp;</span> Learn <span className="text-brand-green">PK</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive ? 'text-brand-blue' : 'text-navy-600 hover:text-navy-900'}`
            }>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Log in</Link>
              <Link to="/signup" className="btn-primary">Create Free Account</Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-navy-100 bg-white md:hidden">
          <div className="container-app flex flex-col gap-4 py-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm font-medium text-navy-700" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              {user ? (
                <Link to="/dashboard" className="btn-primary w-full">Go to Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="btn-outline w-full">Log in</Link>
                  <Link to="/signup" className="btn-primary w-full">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
