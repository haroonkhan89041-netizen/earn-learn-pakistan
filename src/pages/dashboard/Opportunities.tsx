import { useEffect, useMemo, useState } from 'react';
import { Search, ExternalLink, Briefcase, Sparkles } from 'lucide-react';
import { VerifiedBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Opportunity, OpportunityCategory } from '@/types';

export function Opportunities() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [categories, setCategories] = useState<OpportunityCategory[]>([]);
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    (async () => {
      const [{ data: opportunities }, { data: categoryRows }] = await Promise.all([
        supabase.from('opportunities').select('*').eq('status', 'published').order('featured', { ascending: false }).order('created_at', { ascending: false }),
        supabase.from('opportunity_categories').select('*').order('name'),
      ]);
      if (opportunities) setItems(opportunities as Opportunity[]);
      if (categoryRows) setCategories(categoryRows as OpportunityCategory[]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => items.filter((o) => {
    const matchesQuery = !query || `${o.title} ${o.description} ${o.platform_name || ''}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'all' || o.category_id === category;
    return matchesQuery && matchesCategory;
  }), [items, query, category]);

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-white to-blue-50/70 p-6 shadow-[0_18px_60px_rgba(30,64,175,0.08)] md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm"><Sparkles size={14} /> Fresh opportunities</div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-navy-900">Find your next opportunity</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-navy-500">Explore verified ways to learn, earn, and grow. Always check the platform's current terms before applying.</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-white/80 px-5 py-3 text-left shadow-sm md:text-right"><p className="text-2xl font-extrabold text-navy-900">{items.length}</p><p className="text-xs font-medium text-navy-500">published opportunities</p></div>
        </div>
      </section>

      <div className="card flex flex-col gap-3 p-4 md:flex-row md:items-center">
        <div className="relative flex-1"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" /><input className="input pl-10" placeholder="Search opportunities, platforms…" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
        <select className="input md:w-64" value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      </div>

      {loading ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div> : filtered.length === 0 ? <EmptyState icon={<Briefcase size={22} />} title="No opportunities available" description="There are no published opportunities matching your search." /> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((op) => <article key={op.id} className="card group flex min-h-[270px] flex-col overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_45px_rgba(30,64,175,0.12)]">
        <div className="mb-4 flex items-center justify-between gap-2"><div className="flex flex-wrap items-center gap-2">{op.verification_status === 'verified' && <VerifiedBadge />} {op.platform_name && <span className="badge bg-blue-50 text-blue-700">{op.platform_name}</span>}</div><Briefcase size={18} className="text-blue-500 opacity-70 transition-transform group-hover:scale-110" /></div>
        <h2 className="font-display text-lg font-bold leading-snug text-navy-900">{op.title}</h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-navy-500">{op.description}</p>
        {op.requirements && <p className="mt-3 rounded-xl bg-navy-50 px-3 py-2 text-xs leading-5 text-navy-500"><strong className="text-navy-700">Requirements:</strong> {op.requirements}</p>}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-navy-100 pt-4"><span className="text-xs font-medium text-navy-400">{op.earning_estimate || 'Earnings vary by platform'}</span>{op.application_url && <a href={op.application_url} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0 px-4 py-2 text-sm">View <ExternalLink size={14} /></a>}</div>
      </article>)}</div>}
    </div>
  );
}
