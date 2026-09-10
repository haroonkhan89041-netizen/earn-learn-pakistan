import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      title="Welcome back"
      subtitle="Log in to continue learning, earning and tracking your progress."
      footer={<>Don't have an account? <Link to="/signup" className="font-bold text-[#4a3aff] hover:underline">Create one</Link></>}
    >
      {!isSupabaseConfigured && <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700">Account login is temporarily unavailable because the authentication service is not configured.</div>}
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Email address</label>
          <div className="relative">
            <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input h-14 rounded-2xl border-slate-200 bg-slate-50 pl-11 pr-4 transition focus:border-[#4a3aff] focus:bg-white focus:ring-4 focus:ring-[#4a3aff]/10" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between"><label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Password</label><Link to="/forgot-password" className="text-xs font-bold text-[#4a3aff] hover:underline">Forgot password?</Link></div>
          <div className="relative">
            <LockKeyhole size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input h-14 rounded-2xl border-slate-200 bg-slate-50 pl-11 pr-12 transition focus:border-[#4a3aff] focus:bg-white focus:ring-4 focus:ring-[#4a3aff]/10" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
        </div>
        {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}
        <button className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#4a3aff] text-sm font-bold text-white shadow-[0_12px_28px_rgba(74,58,255,0.24)] transition hover:-translate-y-0.5 hover:bg-[#3928e8] disabled:cursor-not-allowed disabled:opacity-60" disabled={loading || !isSupabaseConfigured}>{loading ? 'Logging in…' : <>Log in <span className="transition group-hover:translate-x-0.5">→</span></>}</button>
      </form>
    </AuthLayout>
  );
}
