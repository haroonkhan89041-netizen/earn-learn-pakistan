import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ShieldCheck, BookOpen, ListChecks, TrendingUp, Users, Wallet, ChevronDown, CheckCircle2, Globe2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DEMO_OPPORTUNITIES, DEMO_COURSES } from '@/data/demoData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { VerifiedBadge } from '@/components/ui/Badge';

const steps = [
  { icon: Users, no: '01', title: 'Create your account', text: 'Join free and build your profile in less than a minute.' },
  { icon: BookOpen, no: '02', title: 'Learn useful skills', text: 'Follow practical lessons designed for beginners.' },
  { icon: ListChecks, no: '03', title: 'Complete tasks', text: 'Put your skills to work with verified activities.' },
  { icon: Wallet, no: '04', title: 'Request rewards', text: 'Turn eligible points into a reviewed withdrawal.' },
];

const faqs = [
  { q: 'Is Earn & Learn Pakistan free?', a: 'Yes. Creating an account, browsing opportunities and accessing our core learning resources is free.' },
  { q: 'Do you guarantee income?', a: 'No. Earnings depend on available opportunities, task completion and your own activity. We never promise a fixed income.' },
  { q: 'How do withdrawals work?', a: 'When your eligible balance reaches the configured threshold, you can request a withdrawal through the available payment methods.' },
  { q: 'Are opportunities verified?', a: 'Public opportunities are reviewed and approved by the admin team before appearing on the platform.' },
];

const heroImage = 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85';
const globalHeroImage = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2200&q=85';
const learningImage = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=85';
const workImage = 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=85';

interface OpportunityCard { id: string; title: string; description: string; earning_estimate: string | null; }
interface CourseCard { id: string; title: string; description: string | null; level: string; }

export function Home() {
  const [opportunities, setOpportunities] = useState<OpportunityCard[]>([]);
  const [courses, setCourses] = useState<CourseCard[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setOpportunities(DEMO_OPPORTUNITIES.filter((o) => o.is_featured).slice(0, 3).map((o) => ({ id: o.id, title: o.title, description: o.description, earning_estimate: o.estimated_earning })));
      setCourses(DEMO_COURSES.slice(0, 6).map((c) => ({ id: c.id, title: c.title, description: null, level: c.difficulty })));
      return;
    }
    const loadContent = async () => {
      const [opportunitiesResult, coursesResult] = await Promise.all([
        supabase.from('opportunities').select('id,title,description,earning_estimate').eq('status', 'published').eq('verification_status', 'verified').eq('featured', true).order('created_at', { ascending: false }).limit(3),
        supabase.from('courses').select('id,title,description,level').eq('status', 'published').order('created_at', { ascending: false }).limit(6),
      ]);
      if (!opportunitiesResult.error && opportunitiesResult.data) setOpportunities(opportunitiesResult.data as OpportunityCard[]);
      if (!coursesResult.error && coursesResult.data) setCourses(coursesResult.data as CourseCard[]);
    };
    void loadContent();
  }, []);

  return (
    <div className="bg-[#f7f7f2] text-[#10110f]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#10110f] text-white">
        <div className="pointer-events-none absolute left-[-115px] top-[70px] h-[500px] w-[500px] rounded-full sm:left-[-90px] sm:top-[80px] sm:h-[610px] sm:w-[610px]" aria-hidden="true">
          <Globe2 size="100%" strokeWidth={0.7} className="h-full w-full text-[#4f8cff] opacity-[0.14]" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_42%_38%,rgba(79,140,255,0.18),transparent_48%,rgba(16,17,15,0.55)_76%,rgba(16,17,15,0.95)_100%)]" />
          <img src={globalHeroImage} alt="" className="absolute inset-[15%] h-[70%] w-[70%] rounded-full object-cover opacity-[0.08] mix-blend-screen" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_40%,rgba(79,140,255,0.10),transparent_30%),linear-gradient(90deg,rgba(16,17,15,0.98)_0%,rgba(16,17,15,0.88)_48%,rgba(16,17,15,0.70)_100%)]" />
        <div className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-[#718d5d]/20 blur-3xl" />
        <div className="absolute -bottom-48 left-1/3 h-[420px] w-[420px] rounded-full bg-white/[0.05] blur-3xl" />
        <div className="container-app relative py-14 sm:py-20 lg:py-24">
          <div className="grid items-end gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
            <div className="relative z-10 max-w-3xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-[#91b477]" /> Built for Pakistan
              </div>
              <h1 className="font-display text-[clamp(3.2rem,8vw,7.4rem)] font-black leading-[.87] tracking-[-0.065em]">
                Learn.<br /><span className="text-[#91b477]">Work.</span><br />Grow.
              </h1>
              <p className="mt-8 max-w-xl text-base leading-7 text-white/60 sm:text-lg">
                Build practical digital skills, discover verified opportunities and complete useful tasks — all in one simple platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/signup" className="group inline-flex items-center gap-3 rounded-full bg-[#91b477] px-6 py-3.5 text-sm font-black text-[#10110f] transition-all hover:-translate-y-0.5 hover:bg-[#a5c38b]">
                  Create free account <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link to="/opportunities" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10">
                  Explore opportunities <ArrowRight size={16} />
                </Link>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-semibold text-white/40">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#91b477]" /> Free to join</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#91b477]" /> Verified listings</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#91b477]" /> No income guarantees</span>
              </div>
            </div>

            <div className="relative z-10 lg:mb-2">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
                <img src={heroImage} alt="Professionals learning and working online" className="h-[360px] w-full object-cover grayscale-[15%] sm:h-[440px]" loading="eager" />
              </div>
              <div className="absolute -bottom-5 -left-3 rounded-2xl border border-black/10 bg-[#f7f7f2] p-4 text-[#10110f] shadow-2xl sm:-left-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10110f] text-[#91b477]"><TrendingUp size={20} /></div>
                  <div><p className="text-sm font-black">Progress, not promises.</p><p className="mt-0.5 text-[10px] font-semibold text-black/45">Skills first. Opportunities next.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-app relative flex items-center justify-between border-t border-white/10 py-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
          <span>Earn &amp; Learn Pakistan</span><span>Skills / Tasks / Opportunities</span>
        </div>
      </section>

      {/* INTRO */}
      <section className="container-app py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[.65fr_1.35fr] lg:gap-20">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#718d5d]">A better starting point</p>
          <div>
            <h2 className="font-display text-4xl font-black leading-[.98] tracking-[-0.05em] sm:text-6xl">Everything you need to make your next step <span className="text-black/25">more practical.</span></h2>
            <p className="mt-7 max-w-2xl text-base leading-7 text-black/50">Instead of chasing unrealistic promises, use one place to learn, practice and discover legitimate opportunities that fit your skills.</p>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-y border-black/[0.07] bg-white">
        <div className="container-app py-20 sm:py-24">
          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-black/35">The process</p><h2 className="mt-2 font-display text-4xl font-black tracking-[-0.05em] sm:text-5xl">Four simple moves.</h2></div><span className="text-sm font-semibold text-black/40">Start at zero. Build from there.</span></div>
          <div className="grid border-l border-t border-black/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => <div key={s.no} className="group border-b border-r border-black/[0.08] p-6 sm:p-7"><div className="flex items-start justify-between"><span className="font-mono text-xs text-black/30">{s.no}</span><s.icon size={21} strokeWidth={1.7} className="text-black/35 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-6" /></div><h3 className="mt-16 font-display text-xl font-black tracking-[-0.03em]">{s.title}</h3><p className="mt-2 text-sm leading-6 text-black/45">{s.text}</p></div>)}
          </div>
        </div>
      </section>

      {/* LEARNING */}
      <section className="container-app py-20 sm:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div className="overflow-hidden rounded-[2rem] bg-black"><img src={learningImage} alt="People learning digital skills" className="h-[380px] w-full object-cover grayscale-[20%] sm:h-[480px]" loading="lazy" /></div>
          <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#718d5d]">Learn first</p><h2 className="mt-4 font-display text-4xl font-black leading-[.98] tracking-[-0.05em] sm:text-6xl">Skills that move with you.</h2><p className="mt-6 max-w-lg text-base leading-7 text-black/50">From beginner-friendly digital lessons to practical tasks, build a foundation you can actually use.</p><div className="mt-8 space-y-3 text-sm font-bold"><div className="flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10110f] text-white"><CheckCircle2 size={14} /></span> Beginner-friendly courses</div><div className="flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10110f] text-white"><CheckCircle2 size={14} /></span> Learn at your own pace</div><div className="flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10110f] text-white"><CheckCircle2 size={14} /></span> Put skills into practice</div></div><Link to="/learn" className="group mt-9 inline-flex items-center gap-2 border-b border-black pb-2 text-sm font-black">Explore free courses <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link></div>
        </div>
      </section>

      {/* OPPORTUNITIES */}
      <section className="bg-[#10110f] py-20 text-white sm:py-24">
        <div className="container-app">
          <div className="mb-10 flex items-end justify-between gap-6"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#91b477]">Live opportunities</p><h2 className="mt-3 font-display text-4xl font-black tracking-[-0.05em] sm:text-5xl">Find your next move.</h2></div><Link to="/opportunities" className="hidden items-center gap-2 text-sm font-bold text-white/55 hover:text-white sm:flex">View all <ArrowUpRight size={15} /></Link></div>
          <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 md:grid-cols-3">
            {opportunities.map((op, i) => <div key={op.id} className="group bg-[#161814] p-5 transition-colors hover:bg-[#1d201b]"><div className="mb-5 h-40 overflow-hidden rounded-xl"><img src={[workImage, heroImage, learningImage][i % 3]} alt="Professional online work" className="h-full w-full object-cover grayscale-[15%] transition duration-500 group-hover:scale-105" loading="lazy" /></div><div className="flex items-center gap-2"><VerifiedBadge /><span className="text-[10px] font-bold text-white/35">Verified</span></div><h3 className="mt-3 font-display text-lg font-black">{op.title}</h3><p className="mt-1 line-clamp-2 text-sm leading-6 text-white/45">{op.description}</p><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><span className="text-[10px] uppercase tracking-wider text-white/30">Estimated</span><span className="font-mono text-sm font-bold text-[#91b477]">{op.earning_estimate || 'Varies'}</span></div></div>)}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="border-b border-black/[0.07] bg-white py-20 sm:py-24"><div className="container-app"><div className="mb-10 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-black/35">Popular skills</p><h2 className="mt-2 font-display text-4xl font-black tracking-[-0.05em] sm:text-5xl">Keep learning.</h2></div><Link to="/learn" className="hidden text-sm font-bold text-black/50 hover:text-black sm:block">All courses →</Link></div><div className="grid gap-px overflow-hidden rounded-2xl border border-black/[0.08] bg-black/[0.08] sm:grid-cols-2 lg:grid-cols-3">{courses.map((c, i) => <Link to={`/learn/${c.id}`} key={c.id} className="group bg-white p-5 transition hover:bg-[#f7f7f2]"><div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10110f] text-[#91b477]"><BookOpen size={19} /></div><span className="font-mono text-[10px] text-black/30">0{i + 1}</span></div><p className="mt-8 font-display text-lg font-black tracking-[-0.025em]">{c.title}</p><p className="mt-1 text-xs font-semibold capitalize text-black/40">{c.level} level</p><ArrowUpRight size={16} className="mt-5 text-black/25 transition group-hover:-translate-y-1 group-hover:translate-x-1" /></Link>)}</div></div></section>

      {/* TRUST */}
      <section className="container-app py-20 sm:py-28"><div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#718d5d]">Built on clarity</p><h2 className="mt-4 font-display text-4xl font-black leading-[.98] tracking-[-0.05em] sm:text-6xl">No gimmicks.<br />Just a clear system.</h2></div><div className="grid gap-px overflow-hidden rounded-2xl border border-black/[0.08] bg-black/[0.08] sm:grid-cols-2">{[{ icon: ShieldCheck, t: 'Admin-verified listings', d: 'Opportunities are reviewed before publication.' }, { icon: TrendingUp, t: 'Transparent points', d: 'Transactions are recorded in your points ledger.' }, { icon: Wallet, t: 'Reviewed withdrawals', d: 'Withdrawal requests go through a manual review.' }, { icon: BookOpen, t: 'Free learning', d: 'Core learning resources are available without a paywall.' }].map((f) => <div key={f.t} className="bg-white p-6"><f.icon size={21} className="text-[#718d5d]" /><h3 className="mt-12 font-display text-base font-black">{f.t}</h3><p className="mt-2 text-sm leading-6 text-black/45">{f.d}</p></div>)}</div></div></section>

      {/* FAQ */}
      <section className="border-y border-black/[0.07] bg-white py-20 sm:py-24"><div className="container-app max-w-4xl"><div className="mb-10"><p className="text-xs font-black uppercase tracking-[0.2em] text-black/35">Questions</p><h2 className="mt-2 font-display text-4xl font-black tracking-[-0.05em] sm:text-5xl">Before you start.</h2></div><div className="space-y-2">{faqs.map((f) => <FaqItem key={f.q} {...f} />)}</div></div></section>

      {/* CTA */}
      <section className="container-app py-20 sm:py-28"><div className="relative overflow-hidden rounded-[2rem] bg-[#10110f] px-6 py-16 text-center text-white sm:px-12 sm:py-20"><div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#718d5d]/20 blur-3xl" /><div className="relative"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#91b477]">Your next chapter</p><h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-black leading-[.95] tracking-[-0.05em] sm:text-6xl">Start with one skill. Build from there.</h2><p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/45">Join for free and explore the platform at your own pace.</p><Link to="/signup" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#91b477] px-7 py-3.5 text-sm font-black text-[#10110f] transition hover:bg-[#a5c38b]">Create free account <ArrowUpRight size={16} /></Link></div></div></section>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white"><button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"><span className="font-display text-sm font-black sm:text-base">{q}</span><ChevronDown size={18} className={`shrink-0 text-black/35 transition-transform ${open ? 'rotate-180' : ''}`} /></button>{open && <p className="border-t border-black/[0.07] px-5 py-5 text-sm leading-6 text-black/50 sm:px-6">{a}</p>}</div>;
}
