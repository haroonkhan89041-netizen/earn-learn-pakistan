import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Copy, Users, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const DEMO_HISTORY = [
  { name: 'Sana M.', status: 'active', reward: 50, date: '2026-08-01' },
  { name: 'Usman T.', status: 'active', reward: 50, date: '2026-07-22' },
  { name: 'Bilal R.', status: 'pending', reward: 0, date: '2026-08-11' },
];

export function Referrals() {
  const { profile } = useAuth();
  const code = profile?.referral_code ?? 'ELP-DEMO01';
  const link = `${window.location.origin}/signup?ref=${code}`;
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState(DEMO_HISTORY);
  const [counts, setCounts] = useState({ total: 6, active: 4, rewardPoints: 200 });

  useEffect(() => {
    if (!isSupabaseConfigured || !profile) return;
    (async () => {
      const { data } = await supabase
        .from('referrals')
        .select('status, reward_points, created_at, referred:profiles!referrals_referred_id_fkey(full_name)')
        .eq('referrer_id', profile.id)
        .order('created_at', { ascending: false });
      if (data) {
        const rows = data.map((r: any) => ({
          name: r.referred?.full_name || 'New user', status: r.status,
          reward: r.reward_points, date: new Date(r.created_at).toLocaleDateString(),
        }));
        setHistory(rows);
        setCounts({
          total: rows.length,
          active: rows.filter((r) => r.status === 'active').length,
          rewardPoints: rows.reduce((sum, r) => sum + r.reward, 0),
        });
      }
    })();
  }, [profile]);

  function copy() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Referral link copied');
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Referrals</h1>
        <p className="text-sm text-navy-500">Invite friends and earn points when they become active.</p>
      </div>

      <div className="card p-5">
        <p className="mb-2 text-xs font-semibold text-navy-500">Your referral link</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input readOnly value={link} className="input flex-1 font-mono text-xs" />
          <button className="btn-primary shrink-0" onClick={copy}>
            <Copy size={15} /> {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
        <p className="mt-2 font-mono text-sm text-navy-500">Code: <span className="font-semibold text-navy-900">{code}</span></p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5"><p className="text-xs text-navy-500">Total referrals</p><p className="font-mono text-xl font-bold text-navy-900">{counts.total}</p></div>
        <div className="card p-5"><p className="text-xs text-navy-500">Active referrals</p><p className="font-mono text-xl font-bold text-navy-900">{counts.active}</p></div>
        <div className="card p-5"><p className="text-xs text-navy-500">Referral rewards</p><p className="font-mono text-xl font-bold text-brand-green-dark">{counts.rewardPoints} pts</p></div>
      </div>

      <div className="card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-navy-900">
          <Users size={16} /> Referral history
        </h2>
        <div className="divide-y divide-navy-100">
          {history.map((h) => (
            <div key={h.name} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-navy-800">{h.name}</p>
                <p className="text-xs text-navy-400">{h.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${h.status === 'active' ? 'bg-brand-green/10 text-brand-green-dark' : 'bg-navy-100 text-navy-500'} capitalize`}>{h.status}</span>
                <span className="font-mono text-sm font-semibold text-navy-700">{h.reward ? `+${h.reward}` : '—'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card flex items-start gap-3 border-brand-amber/30 bg-brand-amber/5 p-4">
        <ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="text-xs text-amber-800">
          Self-referrals, duplicate accounts, and repeated abuse of the referral system are
          automatically flagged and reviewed — accounts found abusing referrals may be suspended.
        </p>
      </div>
    </div>
  );
}
