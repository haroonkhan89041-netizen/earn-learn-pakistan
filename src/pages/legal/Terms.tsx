import { SimplePage } from '../public/SimplePage';

export function Terms() {
  return (
    <SimplePage title="Terms & Conditions" subtitle="Last updated: August 2026">
      <p>By creating an account, you agree to use Earn &amp; Learn Pakistan honestly: one account per person, no fraudulent task submissions, and no abuse of the referral system.</p>
      <h3 className="font-display font-bold text-navy-900">Points and rewards</h3>
      <p>Points have no cash value until a withdrawal is approved and paid by an admin. The points-to-PKR conversion rate is configurable and may change; the current rate is always shown before you request a withdrawal.</p>
      <h3 className="font-display font-bold text-navy-900">Account suspension</h3>
      <p>We may suspend accounts found to be engaging in fraud, duplicate registrations, or abuse of the referral or task system.</p>
      <h3 className="font-display font-bold text-navy-900">Third-party opportunities</h3>
      <p>Opportunities link to third-party platforms. We review listings before publishing, but we are not responsible for the terms, payment, or conduct of external platforms.</p>
    </SimplePage>
  );
}
