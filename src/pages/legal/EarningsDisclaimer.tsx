import { SimplePage } from '../public/SimplePage';
import { AlertTriangle } from 'lucide-react';

export function EarningsDisclaimer() {
  return (
    <SimplePage title="Earnings Disclaimer">
      <div className="not-prose mb-2 flex items-start gap-3 rounded-2xl border border-brand-amber/30 bg-brand-amber/5 p-4">
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800">
          <strong>Earn &amp; Learn Pakistan does not guarantee any level of income.</strong> All
          figures shown are estimates based on publicly available information about third-party
          platforms and opportunities.
        </p>
      </div>
      <p>Actual earnings depend on factors outside our control, including: the availability of opportunities, client demand, your skill level, time invested, and the policies of third-party platforms.</p>
      <p>Task reward points are fixed and disclosed before you start a task. Opportunity earning ranges are estimates only, not promises.</p>
      <p>Any testimonials or example figures shown on the platform are illustrative and do not represent typical or guaranteed results.</p>
    </SimplePage>
  );
}
