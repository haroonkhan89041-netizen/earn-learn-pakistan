import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '@/contexts/AuthContext';

export function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await requestPasswordReset(email);
    setLoading(false);
    if (error) { setError(error); return; }
    setSent(true);
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a reset link."
      footer={<Link to="/login" className="font-semibold text-brand-blue">Back to log in</Link>}
    >
      {sent ? (
        <p className="rounded-xl bg-brand-green/10 px-3 py-2.5 text-sm text-brand-green-dark">
          If an account exists for {email}, a reset link is on its way.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</button>
        </form>
      )}
    </AuthLayout>
  );
}
