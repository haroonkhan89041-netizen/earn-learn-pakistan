import { useEffect, useMemo, useState } from 'react';
import { Search, ExternalLink, Briefcase } from 'lucide-react';
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
    <div className="space-y-6">
      <div><h1 className="font-display text-2xl font-extrabold text-navy-900">Opportunities</h1><p className="text-sm text-navy-500">Verified and published opportunities. Always check the platform's current terms before applying.</p></div>
      <div className="card flex flex-col gap-3 p-4 md:flex-row md:items-center"><div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" /><input className="input pl-9" placeholder="Search opportunities…" value={query} onChange={(e) => setQuery(e.target.value)} /></div><select className="input md:w-64" value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      {loading ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div> : filtered.length === 0 ? <EmptyState icon={<Briefcase size={22} />} title="No opportunities available" description="There are no published opportunities matching your search." /> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filtered.map((op) => <div key={op.id} className="card flex flex-col p-5"><div className="mb-2 flex flex-wrap items-center gap-2">{op.verification_status === 'verified' && <VerifiedBadge />} {op.platform_name && <span className="badge bg-navy-100 text-navy-600">{op.platform_name}</span>}</div><p className="font-display text-base font-bold text-navy-900">{op.title}</p><p className="mt-1 flex-1 text-sm text-navy-500">{op.description}</p>{op.requirements && <p className="mt-3 text-xs text-navy-500"><strong>Requirements:</strong> {op.requirements}</p>}<div className="mt-4 text-xs text-navy-400">{op.earning_estimate || 'Earnings vary by platform'}</div>{op.application_url && <a href={op.application_url} target="_blank" rel="noopener noreferrer" className="btn-outline mt-4 w-full">View Opportunity <ExternalLink size={14} /></a>}</div>)}</div>}
    </div>
  );
}
