import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Copy, Users, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export function Referrals() {
  const { profile } = useAuth();
  const code = profile?.referral_code ?? '';
  const link = code ? `${window.location.origin}/signup?ref=${encodeURIComponent(code)}` : '';
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<Array<{ id: string; name: string; status: string; reward: number; date: string }>>([]);
  const [counts, setCounts] = useState({ total: 0, active: 0, rewardPoints: 0 });

  useEffect(() => {
    if (!isSupabaseConfigured || !profile) return;
    (async () => {
      const { data, error } = await supabase
        .from('referrals')
        .select('id, status, reward_points, created_at, referred_user_id')
        .eq('referrer_id', profile.id)
        .order('created_at', { ascending: false });
      if (error || !data) return;
      const ids = data.map((r) => r.referred_user_id);
      const { data: people } = ids.length ? await supabase.from('profiles').select('id, full_name').in('id', ids) : { data: [] };
      const names = new Map((people ?? []).map((p) => [p.id, p.full_name || 'New user']));
      const rows = data.map((r) => ({ id: r.id, name: names.get(r.referred_user_id) || 'New user', status: r.status, reward: r.reward_points, date: new Date(r.created_at).toLocaleDateString() }));
      setHistory(rows);
      setCounts({ total: rows.length, active: rows.filter((r) => r.status === 'qualified' || r.status === 'rewarded').length, rewardPoints: rows.reduce((sum, r) => sum + r.reward, 0) });
    })();
  }, [profile]);

  function copy() {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Referral link copied');
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-2xl font-extrabold text-navy-900">Referrals</h1><p className="text-sm text-navy-500">Invite friends and earn points when they qualify.</p></div>
      <div className="card p-5"><p className="mb-2 text-xs font-semibold text-navy-500">Your referral link</p><div className="flex flex-col gap-2 sm:flex-row"><input readOnly value={link || 'Referral code is not available yet'} className="input flex-1 font-mono text-xs" /><button className="btn-primary shrink-0" onClick={copy} disabled={!link}><Copy size={15} /> {copied ? 'Copied!' : 'Copy link'}</button></div><p className="mt-2 font-mono text-sm text-navy-500">Code: <span className="font-semibold text-navy-900">{code || '—'}</span></p></div>
      <div className="grid grid-cols-3 gap-4"><div className="card p-5"><p className="text-xs text-navy-500">Total referrals</p><p className="font-mono text-xl font-bold text-navy-900">{counts.total}</p></div><div className="card p-5"><p className="text-xs text-navy-500">Qualified referrals</p><p className="font-mono text-xl font-bold text-navy-900">{counts.active}</p></div><div className="card p-5"><p className="text-xs text-navy-500">Referral rewards</p><p className="font-mono text-xl font-bold text-brand-green-dark">{counts.rewardPoints} pts</p></div></div>
      <div className="card p-5"><h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-navy-900"><Users size={16} /> Referral history</h2><div className="divide-y divide-navy-100">{history.length === 0 ? <p className="py-4 text-sm text-navy-400">No referrals yet.</p> : history.map((h) => <div key={h.id} className="flex items-center justify-between py-3"><div><p className="text-sm font-medium text-navy-800">{h.name}</p><p className="text-xs text-navy-400">{h.date}</p></div><div className="flex items-center gap-3"><span className="badge bg-navy-100 text-navy-500 capitalize">{h.status}</span><span className="font-mono text-sm font-semibold text-navy-700">{h.reward ? `+${h.reward}` : '—'}</span></div></div>)}</div></div>
      <div className="card flex items-start gap-3 border-brand-amber/30 bg-brand-amber/5 p-4"><ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber-600" /><p className="text-xs text-amber-800">Self-referrals and duplicate-account abuse can be reviewed by an administrator.</p></div>
    </div>
  );
}
