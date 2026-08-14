import { useEffect, useMemo, useState } from 'react';
import { Search, ExternalLink, Briefcase } from 'lucide-react';
import { DEMO_OPPORTUNITIES } from '@/data/demoData';
import { VerifiedBadge, DifficultyBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Opportunity, OpportunityCategory, Difficulty } from '@/types';

const categories: { value: OpportunityCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All categories' },
  { value: 'freelancing', label: 'Freelancing' },
  { value: 'remote_jobs', label: 'Remote Jobs' },
  { value: 'ai_tools', label: 'AI Tools' },
  { value: 'digital_marketing', label: 'Digital Marketing' },
  { value: 'content_creation', label: 'Content Creation' },
  { value: 'affiliate_marketing', label: 'Affiliate Marketing' },
  { value: 'micro_tasks', label: 'Micro Tasks' },
  { value: 'digital_services', label: 'Digital Services' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'student', label: 'Student Opportunities' },
];

export function Opportunities() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<OpportunityCategory | 'all'>('all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [sort, setSort] = useState<'newest' | 'popular'>('newest');
  const [items, setItems] = useState<Opportunity[]>(DEMO_OPPORTUNITIES);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (!cancelled) {
        if (!error && data) setItems(data as Opportunity[]);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function trackClick(id: string) {
    if (!isSupabaseConfigured) return;
    // Uses the increment_opportunity_click RPC (supabase/schema.sql) rather
    // than a direct table update, since opportunities can only be edited by
    // admins under RLS — the RPC is the one narrow exception for click counts.
    await supabase.rpc('increment_opportunity_click', { p_opportunity_id: id });
  }

  const filtered = useMemo(() => {
    let list = items.filter((o) => o.status === 'approved');
    if (query) list = list.filter((o) => o.title.toLowerCase().includes(query.toLowerCase()));
    if (category !== 'all') list = list.filter((o) => o.category === category);
    if (difficulty !== 'all') list = list.filter((o) => o.difficulty === difficulty);
    list = [...list].sort((a, b) =>
      sort === 'popular'
        ? b.click_count - a.click_count
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return list;
  }, [items, query, category, difficulty, sort]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Opportunities</h1>
        <p className="text-sm text-navy-500">Admin-approved listings only. Pay and availability vary by client.</p>
      </div>

      <div className="card flex flex-col gap-3 p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
          <input className="input pl-9" placeholder="Search opportunities…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="input md:w-52" value={category} onChange={(e) => setCategory(e.target.value as any)}>
          {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select className="input md:w-40" value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}>
          <option value="all">Any difficulty</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select className="input md:w-36" value={sort} onChange={(e) => setSort(e.target.value as any)}>
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={22} />}
          title="No opportunities match your filters"
          description="Try a different category, difficulty, or search term."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((op) => (
            <div key={op.id} className="card flex flex-col p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {op.is_verified && <VerifiedBadge />}
                <DifficultyBadge level={op.difficulty} />
              </div>
              <p className="font-display text-base font-bold text-navy-900">{op.title}</p>
              <p className="mt-1 flex-1 text-sm text-navy-500">{op.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-navy-400">
                <span>{op.time_required}</span>
                <span className="font-mono font-semibold text-brand-green-dark">{op.estimated_earning}</span>
              </div>
              <a
                href={op.external_url} target="_blank" rel="noopener noreferrer"
                className="btn-outline mt-4 w-full"
                onClick={() => trackClick(op.id)}
              >
                View Opportunity <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
