import { useState } from 'react';
import toast from 'react-hot-toast';
import { SimplePage } from './SimplePage';

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <SimplePage title="Contact us" subtitle="We usually reply within 1–2 business days.">
      {sent ? (
        <div className="card bg-brand-green/5 p-6 text-brand-green-dark">Thanks — your message has been sent.</div>
      ) : (
        <form
          className="not-prose space-y-4"
          onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success('Message sent'); }}
        >
          <div>
            <label className="label">Name</label>
            <input className="input" required placeholder="Your name" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" required placeholder="you@example.com" />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea className="input" rows={5} required placeholder="How can we help?" />
          </div>
          <button className="btn-primary" type="submit">Send message</button>
          <p className="text-xs text-navy-400">
            For account-specific issues, please use the in-app Support ticket system after logging in.
          </p>
        </form>
      )}
    </SimplePage>
  );
}
