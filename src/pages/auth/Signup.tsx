import { useState, FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
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
      title="Create your account"
      subtitle="Join for free and start building skills and opportunities."
      footer={<>Already have an account? <Link to="/login" className="font-bold text-[#4a3aff] hover:underline">Log in</Link></>}
    >
      {!isSupabaseConfigured && <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700">Account creation is temporarily unavailable because the authentication service is not configured.</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Full name</label>
          <div className="relative"><UserRound size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input className="input h-14 rounded-2xl border-slate-200 bg-slate-50 pl-11 pr-4 transition focus:border-[#4a3aff] focus:bg-white focus:ring-4 focus:ring-[#4a3aff]/10" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" /></div>
        </div>
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Email address</label>
          <div className="relative"><Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input className="input h-14 rounded-2xl border-slate-200 bg-slate-50 pl-11 pr-4 transition focus:border-[#4a3aff] focus:bg-white focus:ring-4 focus:ring-[#4a3aff]/10" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
        </div>
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Password</label>
          <div className="relative"><LockKeyhole size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input className="input h-14 rounded-2xl border-slate-200 bg-slate-50 pl-11 pr-12 transition focus:border-[#4a3aff] focus:bg-white focus:ring-4 focus:ring-[#4a3aff]/10" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
        </div>
        {refCode && <div><label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Referral code</label><input className="input h-12 rounded-2xl bg-slate-100" value={refCode} disabled /></div>}
        <label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3 text-xs leading-5 text-slate-500"><input type="checkbox" className="mt-1 h-4 w-4 accent-[#4a3aff]" checked={agree} onChange={(e) => setAgree(e.target.checked)} /><span>I agree to the <Link to="/legal/terms" className="font-semibold text-[#4a3aff]">Terms</Link> and understand the <Link to="/legal/earnings-disclaimer" className="font-semibold text-[#4a3aff]">Earnings Disclaimer</Link> — no income is guaranteed.</span></label>
        {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}
        <button className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#4a3aff] text-sm font-bold text-white shadow-[0_12px_28px_rgba(74,58,255,0.24)] transition hover:-translate-y-0.5 hover:bg-[#3928e8] disabled:cursor-not-allowed disabled:opacity-60" disabled={loading || !isSupabaseConfigured}>{loading ? 'Creating account…' : <>Create free account <span className="transition group-hover:translate-x-0.5">→</span></>}</button>
      </form>
    </AuthLayout>
  );
}
