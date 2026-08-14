import { useState, FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';

export function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const refCode = params.get('ref') ?? '';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!agree) { setError('Please accept the Terms and Earnings Disclaimer to continue.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setError(null);
    const { error } = await signUp(email, password, fullName, refCode || undefined);
    setLoading(false);
    if (error) { setError(error); return; }
    toast.success('Account created — check your email to verify.');
    navigate('/login');
  }

  return (
    <AuthLayout
      title="Create your free account"
      subtitle="No fees. Start learning and earning today."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-brand-blue">Log in</Link></>}
    >
      {!isSupabaseConfigured && (
        <div className="mb-4 rounded-xl bg-brand-amber/10 px-3 py-2 text-xs text-amber-700">
          Demo mode: connect Supabase (see README) to enable real sign-up.
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">Full name</label>
          <input className="input" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
        </div>
        {refCode && (
          <div>
            <label className="label">Referral code</label>
            <input className="input bg-navy-50" value={refCode} disabled />
          </div>
        )}
        <label className="flex items-start gap-2 text-xs text-navy-500">
          <input type="checkbox" className="mt-0.5" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          I agree to the <Link to="/legal/terms" className="text-brand-blue">Terms</Link> and understand the{' '}
          <Link to="/legal/earnings-disclaimer" className="text-brand-blue">Earnings Disclaimer</Link> — no income is guaranteed.
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating account…' : 'Create Free Account'}</button>
      </form>
    </AuthLayout>
  );
}
