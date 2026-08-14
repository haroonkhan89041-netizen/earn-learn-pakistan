import { CheckCircle2, FlaskConical } from 'lucide-react';

export function VerifiedBadge() {
  return (
    <span className="badge-verified">
      <CheckCircle2 size={13} strokeWidth={2.5} /> Verified
    </span>
  );
}

export function DemoBadge() {
  return (
    <span className="badge-demo">
      <FlaskConical size={13} strokeWidth={2.5} /> Demo content
    </span>
  );
}

export function DifficultyBadge({ level }: { level: 'beginner' | 'intermediate' | 'advanced' }) {
  const styles = {
    beginner: 'bg-brand-green/10 text-brand-green-dark',
    intermediate: 'bg-brand-amber/10 text-amber-700',
    advanced: 'bg-red-100 text-red-700',
  }[level];
  const label = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }[level];
  return <span className={`badge ${styles}`}>{label}</span>;
}
