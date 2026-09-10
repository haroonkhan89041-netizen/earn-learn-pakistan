import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import { ArrowUpRight, GraduationCap, Sparkles } from 'lucide-react';

export function AuthLayout({ title, subtitle, children, footer }: {
  title: string; subtitle: string; children: ReactNode; footer: ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#111116] lg:p-4">
      <div className="relative mx-auto min-h-screen max-w-[1600px] overflow-hidden bg-slate-950 lg:min-h-[calc(100vh-2rem)] lg:rounded-[32px]">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2200&q=90"
          alt="Students learning together"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,20,.82)_0%,rgba(12,12,28,.48)_43%,rgba(12,12,28,.12)_72%,rgba(5,7,20,.28)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/15" />

        <div className="relative z-10 flex min-h-screen items-center lg:min-h-[calc(100vh-2rem)]">
          <section className="hidden w-[58%] self-stretch p-8 text-white lg:flex lg:flex-col xl:p-12">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-xl">
                  <GraduationCap size={22} />
                </span>
                <span className="font-display text-xl font-extrabold tracking-tight">Earn &amp; Learn PK</span>
              </Link>
              <Link to="/" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl transition hover:bg-white/20">
                <ArrowUpRight size={20} />
              </Link>
            </div>

            <div className="mt-auto max-w-2xl pb-8 xl:pb-12">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-white backdrop-blur-xl">
                <Sparkles size={14} /> Learn. Earn. Grow.
              </div>
              <h2 className="font-display text-5xl font-black leading-[.98] tracking-[-0.045em] xl:text-7xl">
                Turn your skills into better opportunities.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/75 xl:text-lg">
                Learn practical skills, complete useful tasks and discover opportunities — all from one place.
              </p>
              <div className="mt-8 flex items-center gap-3 text-xs font-semibold text-white/70">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.8)]" />
                Built for learners in Pakistan
              </div>
            </div>
          </section>

          <section className="ml-auto flex min-h-screen w-full items-center justify-center px-5 py-7 sm:px-8 lg:min-h-0 lg:w-[42%] lg:px-8 lg:py-8 xl:px-12">
            <div className="w-full max-w-[470px] rounded-[30px] border border-white/60 bg-white/95 p-6 shadow-[0_30px_100px_rgba(0,0,0,.28)] backdrop-blur-2xl sm:p-9 xl:p-10">
              <Link to="/" className="mb-7 flex items-center gap-2.5 lg:hidden">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white"><GraduationCap size={19} /></span>
                <span className="font-display text-lg font-extrabold text-slate-950">Earn &amp; Learn PK</span>
              </Link>
              <div className="mb-7">
                <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#4a3aff]">Welcome to Earn &amp; Learn</p>
                <h1 className="font-display text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-[44px]">{title}</h1>
                <p className="mt-3 text-sm leading-6 text-slate-500">{subtitle}</p>
              </div>
              {children}
              <p className="mt-7 text-center text-sm text-slate-500">{footer}</p>
              <p className="mt-7 text-center text-[11px] text-slate-400">© {new Date().getFullYear()} Earn &amp; Learn Pakistan</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
