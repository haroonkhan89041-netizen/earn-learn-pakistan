import { SimplePage } from '../public/SimplePage';

export function Privacy() {
  return (
    <SimplePage title="Privacy Policy" subtitle="Last updated: August 2026">
      <p>We collect only the information needed to run the platform: your name, email, city, skills, and activity data (tasks completed, points earned, withdrawal requests).</p>
      <h3 className="font-display font-bold text-navy-900">What we don't do</h3>
      <p>We never sell your personal data. We never share your withdrawal account details with anyone outside the payment verification process.</p>
      <h3 className="font-display font-bold text-navy-900">Your data, your control</h3>
      <p>You can request an export or deletion of your account data at any time via Support. Row Level Security ensures only you (and authorized admins) can access your private information.</p>
      <h3 className="font-display font-bold text-navy-900">Cookies</h3>
      <p>We use essential cookies for authentication sessions only. Any advertising integrations are opt-in and disclosed on the relevant page.</p>
    </SimplePage>
  );
}
