import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import { ArrowUpRight, GraduationCap, Sparkles } from 'lucide-react';

export function AuthLayout({ title, subtitle, children, footer }: {
  title: string; subtitle: string; children: ReactNode; footer: ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] lg:p-4">
      <div className="relative mx-auto min-h-screen max-w-[1600px] overflow-hidden bg-[#030712] lg:min-h-[calc(100vh-2rem)] lg:rounded-[32px]">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2200&q=90"
          alt="Students learning together"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,.94)_0%,rgba(3,7,18,.72)_43%,rgba(3,7,18,.35)_72%,rgba(2,6,23,.75)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_45%,rgba(74,58,255,.28),transparent_34%),radial-gradient(circle_at_20%_80%,rgba(37,99,235,.18),transparent_35%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-transparent to-[#020617]/30" />

        <div className="relative z-10 flex min-h-screen items-center lg:min-h-[calc(100vh-2rem)]">
          <section className="hidden w-[58%] self-stretch p-8 text-white lg:flex lg:flex-col xl:p-12">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-[0_0_30px_rgba(74,58,255,.22)] backdrop-blur-xl">
                  <GraduationCap size={22} />
                </span>
                <span className="font-display text-xl font-extrabold tracking-tight">Earn &amp; Learn PK</span>
              </Link>
              <Link to="/" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl transition hover:bg-white/20">
                <ArrowUpRight size={20} />
              </Link>
            </div>

            <div className="mt-auto max-w-2xl pb-8 xl:pb-12">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-4 py-2 text-xs font-bold tracking-wide text-indigo-100 backdrop-blur-xl">
                <Sparkles size={14} /> Learn. Earn. Grow.
              </div>
              <h2 className="font-display text-5xl font-black leading-[.98] tracking-[-0.045em] xl:text-7xl">
                Turn your skills into better opportunities.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/70 xl:text-lg">
                Learn practical skills, complete useful tasks and discover opportunities — all from one place.
              </p>
              <div className="mt-8 flex items-center gap-3 text-xs font-semibold text-white/60">
                <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_14px_rgba(96,165,250,.9)]" />
                Built for learners in Pakistan
              </div>
            </div>
          </section>

          <section className="ml-auto flex min-h-screen w-full items-center justify-center px-5 py-7 sm:px-8 lg:min-h-0 lg:w-[42%] lg:px-8 lg:py-8 xl:px-12">
            <div className="relative w-full max-w-[470px] overflow-hidden rounded-[30px] border border-white/10 bg-[#080d1c]/90 p-6 shadow-[0_30px_100px_rgba(0,0,0,.55),0_0_70px_rgba(74,58,255,.12)] backdrop-blur-2xl sm:p-9 xl:p-10">
              <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#4a3aff]/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 -left-24 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="relative">
                <Link to="/" className="mb-7 flex items-center gap-2.5 lg:hidden">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white"><GraduationCap size={19} /></span>
                  <span className="font-display text-lg font-extrabold text-white">Earn &amp; Learn PK</span>
                </Link>
                <div className="mb-7">
                  <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-indigo-300">Welcome to Earn &amp; Learn</p>
                  <h1 className="font-display text-4xl font-black tracking-[-0.04em] text-white sm:text-[44px]">{title}</h1>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{subtitle}</p>
                </div>
                {children}
                <p className="mt-7 text-center text-sm text-slate-400">{footer}</p>
                <p className="mt-7 text-center text-[11px] text-slate-500">© {new Date().getFullYear()} Earn &amp; Learn Pakistan</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
