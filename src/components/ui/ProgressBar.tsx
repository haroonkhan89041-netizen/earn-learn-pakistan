export function ProgressBar({ value, max = 100, color = 'blue' }: { value: number; max?: number; color?: 'blue' | 'green' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const barColor = color === 'green' ? 'bg-brand-green' : 'bg-brand-blue';
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-navy-100">
      <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}
