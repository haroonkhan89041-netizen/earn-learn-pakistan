import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { DEMO_OPPORTUNITIES } from '@/data/demoData';
import { VerifiedBadge, DifficultyBadge } from '@/components/ui/Badge';

export function PublicOpportunities() {
  return (
    <div className="container-app py-14 md:py-20">
      <h1 className="font-display text-3xl font-extrabold text-navy-900 md:text-4xl">Opportunities</h1>
      <p className="mt-2 max-w-xl text-navy-500">
        A preview of admin-verified opportunities. <Link to="/signup" className="font-semibold text-brand-blue">Create a free account</Link> to filter, search, and track which ones you've explored.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DEMO_OPPORTUNITIES.map((op) => (
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
            <Link to="/signup" className="btn-outline mt-4 w-full">
              Sign up to view <ExternalLink size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
