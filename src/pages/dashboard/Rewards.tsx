import { useEffect, useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Wallet, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { WithdrawalMethod, WithdrawalStatus, Withdrawal } from '@/types';

const DEFAULT_SETTINGS = { points_to_pkr_rate: 0.5, minimum_withdrawal_points: 1000 };

const statusStyle: Record<WithdrawalStatus, string> = {
  pending: 'bg-brand-amber/10 text-amber-700',
  approved: 'bg-brand-blue/10 text-brand-blue',
  rejected: 'bg-red-100 text-red-700',
};

export function Rewards() {
  const { profile } = useAuth();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<Withdrawal[]>([]);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<WithdrawalMethod>('easypaisa');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const balance = profile?.points ?? 0;

  useEffect(() => {
    if (!isSupabaseConfigured || !profile) return;
    (async () => {
      const { data: settingRows } = await supabase.from('site_settings').select('key, value');
      if (settingRows) {
        const map = Object.fromEntries(settingRows.map((r) => [r.key, r.value]));
        setSettings({
          points_to_pkr_rate: Number(map.points_to_pkr_rate ?? DEFAULT_SETTINGS.points_to_pkr_rate),
          minimum_withdrawal_points: Number(map.minimum_withdrawal_points ?? DEFAULT_SETTINGS.minimum_withdrawal_points),
        });
      }
      const { data: withdrawals } = await supabase.from('withdrawals').select('*').eq('user_id', profile.id).order('created_at', { ascending: false });
      if (withdrawals) setHistory(withdrawals as Withdrawal[]);
    })();
  }, [profile]);

  const eligible = balance >= settings.minimum_withdrawal_points;
  const pkrValue = Number(amount || 0) * settings.points_to_pkr_rate;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!profile) return toast.error('Please sign in first.');
    const pts = Number(amount);
    if (!pts || pts < settings.minimum_withdrawal_points) return toast.error(`Minimum withdrawal is ${settings.minimum_withdrawal_points} points.`);
    if (pts > balance) return toast.error("You don't have enough points.");
    if (!accountName.trim() || !accountNumber.trim()) return toast.error('Please enter your payment account details.');
    setSubmitting(true);
    const { error } = await supabase.rpc('request_withdrawal', { p_points: pts, p_method: method, p_account_name: accountName.trim(), p_account_number: accountNumber.trim() });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success('Withdrawal request submitted — pending admin review.');
    setAmount(''); setAccountName(''); setAccountNumber('');
    const { data } = await supabase.from('withdrawals').select('*').eq('user_id', profile.id).order('created_at', { ascending: false });
    if (data) setHistory(data as Withdrawal[]);
  }

  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-2xl font-extrabold text-navy-900">Rewards</h1><p className="text-sm text-navy-500">Request a withdrawal once you reach the minimum threshold.</p></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5"><p className="text-xs text-navy-500">Points balance</p><p className="font-mono text-2xl font-bold text-navy-900">{balance.toLocaleString()}</p></div>
        <div className="card p-5"><p className="text-xs text-navy-500">Estimated value</p><p className="font-mono text-2xl font-bold text-brand-green-dark">PKR {(balance * settings.points_to_pkr_rate).toLocaleString()}</p></div>
        <div className="card p-5"><p className="text-xs text-navy-500">Minimum to withdraw</p><p className="font-mono text-2xl font-bold text-navy-900">{settings.minimum_withdrawal_points.toLocaleString()} pts</p></div>
      </div>
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2"><Wallet size={17} className="text-brand-blue" /><h2 className="font-display text-base font-bold text-navy-900">Request a withdrawal</h2></div>
        {!eligible && <p className="mb-4 flex items-start gap-2 rounded-xl bg-brand-amber/10 p-3 text-xs text-amber-700"><Info size={14} className="mt-0.5 shrink-0" />You need at least {settings.minimum_withdrawal_points.toLocaleString()} points to request a withdrawal.</p>}
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Points to redeem</label><input className="input" type="number" min={settings.minimum_withdrawal_points} max={balance} value={amount} onChange={(e) => setAmount(e.target.value)} disabled={!eligible || submitting} required />{amount && <p className="mt-1 text-xs text-navy-400">≈ PKR {pkrValue.toLocaleString()}</p>}</div>
          <div><label className="label">Payment method</label><select className="input" value={method} onChange={(e) => setMethod(e.target.value as WithdrawalMethod)} disabled={!eligible || submitting}><option value="easypaisa">Easypaisa</option><option value="jazzcash">JazzCash</option><option value="bank_transfer">Bank Transfer</option></select></div>
          <div><label className="label">Account name</label><input className="input" required value={accountName} onChange={(e) => setAccountName(e.target.value)} disabled={!eligible || submitting} /></div>
          <div><label className="label">Account number</label><input className="input" required value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} disabled={!eligible || submitting} /></div>
          <div className="sm:col-span-2"><button className="btn-primary w-full sm:w-auto" disabled={!eligible || submitting}>{submitting ? 'Submitting…' : 'Submit request'}</button><p className="mt-2 text-xs text-navy-400">Every request is reviewed manually. Admin approval is required before payment.</p></div>
        </form>
      </div>
      <div className="card p-5"><h2 className="mb-4 font-display text-base font-bold text-navy-900">Withdrawal history</h2><div className="divide-y divide-navy-100">{history.length === 0 ? <p className="py-4 text-sm text-navy-400">No withdrawal requests yet.</p> : history.map((h) => <div key={h.id} className="flex items-center justify-between py-3"><div><p className="text-sm font-medium text-navy-800">{h.amount.toLocaleString()} pts · {h.method.replace('_', ' ')}</p><p className="text-xs text-navy-400">{new Date(h.created_at).toLocaleDateString()}</p></div><span className={`badge ${statusStyle[h.status]} capitalize`}>{h.status}</span></div>)}</div></div>
    </div>
  );
}
