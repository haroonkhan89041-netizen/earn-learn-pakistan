import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import { ArrowUpRight, GraduationCap, Sparkles } from 'lucide-react';

export function AuthLayout({ title, subtitle, children, footer }: {
  title: string; subtitle: string; children: ReactNode; footer: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f5f5f3] p-3 sm:p-5 lg:p-7">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1500px] overflow-hidden rounded-[30px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.14)] lg:grid-cols-[1.08fr_0.92fr] lg:min-h-[calc(100vh-3.5rem)]">
        <section className="relative hidden overflow-hidden lg:block">
          <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=85" alt="Students learning together" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-slate-950/10" />
          <div className="absolute left-8 top-8 flex items-center gap-3 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xl ring-1 ring-white/20"><GraduationCap size={21} /></span>
            <span className="font-display text-lg font-extrabold tracking-tight">Earn &amp; Learn PK</span>
          </div>
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-xl"><Sparkles size={14} /> Learn skills. Find opportunities. Grow.</div>
            <h2 className="max-w-xl font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] xl:text-6xl">Build skills today. Create better opportunities tomorrow.</h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/75">A simple place to learn, complete useful tasks, discover opportunities and track your progress.</p>
          </div>
          <div className="absolute right-7 top-7 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl"><ArrowUpRight size={20} /></div>
        </section>
        <section className="flex min-h-[calc(100vh-1.5rem)] items-center justify-center px-5 py-8 sm:px-10 lg:min-h-0 lg:px-14 xl:px-20">
          <div className="w-full max-w-[440px]">
            <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white"><GraduationCap size={19} /></span>
              <span className="font-display text-lg font-extrabold text-slate-950">Earn &amp; Learn PK</span>
            </Link>
            <div className="mb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Welcome</p>
              <h1 className="font-display text-4xl font-extrabold tracking-[-0.035em] text-slate-950 sm:text-[46px]">{title}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">{subtitle}</p>
            </div>
            {children}
            <p className="mt-7 text-center text-sm text-slate-500">{footer}</p>
            <p className="mt-8 text-center text-[11px] text-slate-400">© {new Date().getFullYear()} Earn &amp; Learn Pakistan</p>
          </div>
        </section>
      </div>
    </div>
  );
}
