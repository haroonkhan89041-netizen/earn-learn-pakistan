import { Link } from 'react-router-dom';
import { ExternalLink, BriefcaseBusiness } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DEMO_OPPORTUNITIES } from '@/data/demoData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { VerifiedBadge } from '@/components/ui/Badge';

const opportunityImages = [
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85',
];

interface OpportunityCard {
  id: string;
  title: string;
  platform_name: string | null;
  description: string | null;
  earning_estimate: string | null;
  country_eligibility: string | null;
}

export function PublicOpportunities() {
  const [opportunities, setOpportunities] = useState<OpportunityCard[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setOpportunities(DEMO_OPPORTUNITIES.map((op) => ({
        id: op.id,
        title: op.title,
        platform_name: null,
        description: op.description,
        earning_estimate: op.estimated_earning,
        country_eligibility: 'Pakistan',
      })));
      return;
    }

    const loadOpportunities = async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('id,title,platform_name,description,earning_estimate,country_eligibility')
        .eq('status', 'published')
        .eq('verification_status', 'verified')
        .order('created_at', { ascending: false });

      if (!error && data) setOpportunities(data as OpportunityCard[]);
    };
    void loadOpportunities();
  }, []);

  return (
    <div className="container-app py-14 md:py-20">
      <div className="mb-8 max-w-2xl">
        <span className="badge bg-brand-green/10 text-brand-green-dark">Admin-verified opportunities</span>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-navy-900 md:text-4xl">Opportunities</h1>
        <p className="mt-2 text-navy-500">Browse opportunities that have been reviewed and published by our admin team. Earnings and availability can vary.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {opportunities.map((op, i) => (
          <div key={op.id} className="card group flex flex-col overflow-hidden">
            <div className="relative">
              <img src={opportunityImages[i % opportunityImages.length]} alt="Professional online work" className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              <div className="absolute left-3 top-3"><VerifiedBadge /></div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-2 text-xs text-navy-400"><BriefcaseBusiness size={14} />{op.platform_name || 'Online opportunity'}</div>
              <p className="mt-2 font-display text-base font-bold text-navy-900">{op.title}</p>
              {op.description && <p className="mt-2 line-clamp-3 flex-1 text-sm text-navy-500">{op.description}</p>}
              <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                <span className="text-navy-400">{op.country_eligibility || 'Eligibility varies'}</span>
                <span className="font-mono font-semibold text-brand-green-dark">{op.earning_estimate || 'Varies'}</span>
              </div>
              <Link to="/signup" className="btn-outline mt-4 w-full">Sign up to view <ExternalLink size={14} /></Link>
            </div>
          </div>
        ))}
      </div>

      {opportunities.length === 0 && <div className="card mt-6 p-10 text-center text-sm text-navy-500">No verified opportunities are available yet. Check back soon.</div>}
    </div>
  );
}
