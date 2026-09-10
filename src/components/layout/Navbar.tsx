import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ArrowUpRight, GraduationCap } from 'lucide-react';
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
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#f7f7f2]/90 backdrop-blur-xl">
      <div className="container-app flex h-[78px] items-center justify-between">
        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10110f] text-white transition-transform duration-300 group-hover:rotate-6">
            <GraduationCap size={19} strokeWidth={2.2} />
          </span>
          <span className="font-display text-[15px] font-black tracking-[-0.04em] text-[#10110f] sm:text-[17px]">
            Earn <span className="text-[#6f8f5b]">&amp;</span> Learn <span className="text-[#6f8f5b]">PK</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) =>
              `relative py-2 text-[13px] font-semibold transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:bg-[#10110f] after:transition-all ${isActive ? 'text-[#10110f] after:w-full' : 'text-black/50 after:w-0 hover:text-[#10110f] hover:after:w-full'}`
            }>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          {user ? (
            <Link to="/dashboard" className="group inline-flex items-center gap-2 rounded-full bg-[#10110f] px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#252823]">
              Dashboard <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="rounded-full px-4 py-2.5 text-[13px] font-bold text-[#10110f] transition-colors hover:bg-black/5">Log in</Link>
              <Link to="/signup" className="group inline-flex items-center gap-2 rounded-full bg-[#10110f] px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#252823]">
                Join free <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </>
          )}
        </div>

        <button className="rounded-full border border-black/10 p-2.5 text-[#10110f] md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-black/[0.06] bg-[#f7f7f2] md:hidden">
          <div className="container-app flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="rounded-xl px-3 py-3 text-sm font-semibold text-black/70 hover:bg-black/5 hover:text-black" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-black/[0.06] pt-4">
              {user ? (
                <Link to="/dashboard" className="btn-secondary w-full">Go to Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="btn-outline w-full">Log in</Link>
                  <Link to="/signup" className="btn-secondary w-full">Join free</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
