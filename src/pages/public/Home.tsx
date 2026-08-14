import { Link } from 'react-router-dom';
import {
  ArrowRight, ShieldCheck, BookOpen, ListChecks, Compass, TrendingUp,
  Users, Wallet, ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { DEMO_OPPORTUNITIES, DEMO_COURSES } from '@/data/demoData';
import { VerifiedBadge, DifficultyBadge } from '@/components/ui/Badge';

const steps = [
  { icon: Users, title: 'Create a free account', text: 'Sign up in under a minute — no fees, ever.' },
  { icon: BookOpen, title: 'Learn a skill', text: 'Work through beginner-friendly courses at your own pace.' },
  { icon: ListChecks, title: 'Complete verified tasks', text: 'Earn points for tasks that are reviewed before rewards are paid.' },
  { icon: Wallet, title: 'Request a reward', text: 'Cash out via Easypaisa, JazzCash, or bank transfer once you hit the threshold.' },
];

const faqs = [
  { q: 'Is Earn & Learn Pakistan free to join?', a: 'Yes. Creating an account and browsing opportunities, tasks, and courses is completely free.' },
  { q: 'Do you guarantee income?', a: 'No. Earnings depend entirely on available opportunities, task completion, and your own effort. We never promise a fixed income — see our Earnings Disclaimer.' },
  { q: 'How do withdrawals work?', a: 'Once your points balance reaches the configured minimum, you can request a withdrawal via Easypaisa, JazzCash, or bank transfer. Every request is manually reviewed by our team before being marked paid.' },
  { q: 'Are the opportunities verified?', a: 'Every opportunity shown publicly has been reviewed and approved by our admin team before it appears on the platform.' },
];

export function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-blue/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-brand-green/20 blur-3xl" />
        <div className="container-app relative py-20 md:py-28">
          <span className="badge bg-white/10 text-white">🇵🇰 Built for Pakistan</span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
            Learn Skills. Complete Tasks.
            <br />
            <span className="text-brand-green">Discover</span> Earning Opportunities.
          </h1>
          <p className="mt-5 max-w-xl text-base text-navy-200 md:text-lg">
            A free platform to build digital skills, complete verified tasks, and browse
            admin-approved online earning opportunities — with no guarantees, no gimmicks,
            just real resources.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="btn-success text-base">
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link to="/opportunities" className="btn bg-white/10 text-white hover:bg-white/20 text-base">
              Explore Opportunities
            </Link>
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-navy-300">
            <ShieldCheck size={14} className="text-brand-green" />
            We never guarantee income — earnings depend on your activity and available opportunities.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="container-app py-16 md:py-20">
        <h2 className="font-display text-2xl font-extrabold text-navy-900 md:text-3xl">How it works</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="card p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                <s.icon size={19} />
              </div>
              <p className="mb-1 text-xs font-semibold text-navy-400">Step {i + 1}</p>
              <p className="font-display text-base font-bold text-navy-900">{s.title}</p>
              <p className="mt-1 text-sm text-navy-500">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured opportunities */}
      <section className="bg-navy-50/60 py-16 md:py-20">
        <div className="container-app">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-navy-900 md:text-3xl">Featured opportunities</h2>
              <p className="mt-1 text-sm text-navy-500">Admin-verified. Pay and availability vary.</p>
            </div>
            <Link to="/opportunities" className="hidden text-sm font-semibold text-brand-blue sm:block">View all →</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {DEMO_OPPORTUNITIES.filter((o) => o.is_featured).map((op) => (
              <div key={op.id} className="card flex flex-col p-5">
                <div className="mb-2 flex items-center gap-2">
                  {op.is_verified && <VerifiedBadge />}
                  <DifficultyBadge level={op.difficulty} />
                </div>
                <p className="font-display text-base font-bold text-navy-900">{op.title}</p>
                <p className="mt-1 flex-1 text-sm text-navy-500">{op.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-navy-400">
                  <span>{op.time_required}</span>
                  <span className="font-mono font-semibold text-brand-green-dark">{op.estimated_earning}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular skills */}
      <section className="container-app py-16 md:py-20">
        <h2 className="font-display text-2xl font-extrabold text-navy-900 md:text-3xl">Popular skills to learn</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {DEMO_COURSES.slice(0, 6).map((c) => (
            <div key={c.id} className="card flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green-dark">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-navy-900">{c.title}</p>
                <p className="text-xs text-navy-500">{c.lesson_count} lessons · {c.difficulty}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Daily tasks teaser */}
      <section className="bg-navy-900 py-16 text-white md:py-20">
        <div className="container-app grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-extrabold md:text-3xl">Daily tasks, real points</h2>
            <p className="mt-3 max-w-md text-navy-300">
              Short articles, videos, quizzes, and skill lessons — each one rewards points
              only after your completion is verified.
            </p>
            <Link to="/signup" className="btn-success mt-6 inline-flex">Start earning points <ArrowRight size={16} /></Link>
          </div>
          <div className="card bg-white p-5 text-navy-900">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy-500">
              <Compass size={16} /> Today's tasks (example)
            </p>
            <ul className="space-y-3">
              {['Quiz: Digital Marketing Basics — 30 pts', 'Video: Writing a Winning Proposal — 25 pts', 'Article: Spotting Freelance Scams — 20 pts'].map((t) => (
                <li key={t} className="flex items-center justify-between rounded-xl bg-navy-50 px-3 py-2.5 text-sm">
                  <span>{t.split(' — ')[0]}</span>
                  <span className="font-mono font-semibold text-brand-blue">{t.split(' — ')[1]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="container-app py-16 md:py-20">
        <h2 className="font-display text-2xl font-extrabold text-navy-900 md:text-3xl">Why choose Earn &amp; Learn Pakistan</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, t: 'Admin-verified listings', d: 'Every opportunity is manually reviewed before it goes live.' },
            { icon: TrendingUp, t: 'Transparent points ledger', d: 'Every point earned or spent is logged as a traceable transaction.' },
            { icon: Wallet, t: 'Manual withdrawal review', d: 'A real person checks every withdrawal before it is marked paid.' },
            { icon: BookOpen, t: 'Free skill-building', d: 'Core courses are free — no paywall to start learning.' },
          ].map((f) => (
            <div key={f.t} className="card p-5">
              <f.icon size={20} className="mb-3 text-brand-blue" />
              <p className="font-display text-sm font-bold text-navy-900">{f.t}</p>
              <p className="mt-1 text-sm text-navy-500">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-navy-50/60 py-16 md:py-20">
        <div className="container-app max-w-3xl">
          <h2 className="font-display text-2xl font-extrabold text-navy-900 md:text-3xl">Frequently asked questions</h2>
          <div className="mt-6 space-y-2">
            {faqs.map((f) => <FaqItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-app py-16 md:py-20">
        <div className="card flex flex-col items-center gap-4 bg-gradient-to-br from-navy-900 to-navy-700 p-10 text-center text-white">
          <h2 className="font-display text-2xl font-extrabold md:text-3xl">Ready to start learning and earning?</h2>
          <p className="max-w-lg text-navy-200">Join for free. No hidden fees, no guaranteed income promises — just real opportunities and a clear points system.</p>
          <Link to="/signup" className="btn-success">Create Free Account <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-5 py-4 text-left">
        <span className="font-display text-sm font-bold text-navy-900">{q}</span>
        <ChevronDown size={18} className={`shrink-0 text-navy-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="border-t border-navy-100 px-5 py-4 text-sm text-navy-600">{a}</p>}
    </div>
  );
}
