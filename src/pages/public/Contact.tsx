import { SimplePage } from './SimplePage';

export function Contact() {
  return (
    <SimplePage title="Contact us" subtitle="We usually reply within 1–2 business days.">
      <div className="card p-6">
        <h2 className="font-display text-lg font-bold text-navy-900">Need help?</h2>
        <p className="mt-2 text-sm leading-6 text-navy-600">
          For account-specific issues, please use the in-app Support ticket system after logging in.
          Our team can review your account, task verification, opportunity reports, and withdrawal questions there.
        </p>
        <p className="mt-4 text-xs text-navy-400">
          The public contact form is currently unavailable. We do not want to pretend a message was sent when no delivery system is connected yet.
        </p>
      </div>
    </SimplePage>
  );
}
