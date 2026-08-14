import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { setError(error); return; }
    toast.success('Welcome back!');
    navigate('/dashboard');
  }

  return (
    <AuthLayout
      title="Log in"
      subtitle="Welcome back — continue earning points."
      footer={<>Don't have an account? <Link to="/signup" className="font-semibold text-brand-blue">Sign up</Link></>}
    >
      {!isSupabaseConfigured && (
        <div className="mb-4 rounded-xl bg-brand-amber/10 px-3 py-2 text-xs text-amber-700">
          Demo mode: Supabase isn't connected yet, so you can preview the dashboard without logging in.{' '}
          <Link to="/dashboard" className="font-semibold underline">Preview dashboard →</Link>
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="label mb-0">Password</label>
            <Link to="/forgot-password" className="text-xs font-semibold text-brand-blue">Forgot password?</Link>
          </div>
          <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</button>
      </form>
    </AuthLayout>
  );
}
