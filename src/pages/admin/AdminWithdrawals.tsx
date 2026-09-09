import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Check, X, BadgeCheck } from 'lucide-react';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { WithdrawalStatus, WithdrawalMethod } from '@/types';

interface Row {
  id: string;
  user: string;
  points: number;
  pkr: number;
  method: WithdrawalMethod;
  account: string;
  status: WithdrawalStatus;
  date: string;
}

const statusStyle: Record<WithdrawalStatus, string> = {
  pending: 'bg-brand-amber/10 text-amber-700',
  approved: 'bg-brand-blue/10 text-brand-blue',
  paid: 'bg-brand-green/10 text-brand-green-dark',
  rejected: 'bg-red-100 text-red-700',
};

export function AdminWithdrawals() {
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState<WithdrawalStatus | 'all'>('pending');
  const { confirm, dialog } = useConfirmDialog();

  async function load() {
    if (!isSupabaseConfigured) return;
    const { data, error } = await supabase
      .from('withdrawals')
      .select('id, amount, method, account_details, status, created_at, profiles!withdrawals_user_id_fkey(full_name)')
      .order('created_at', { ascending: false });
    if (error) { toast.error(error.message); return; }
    setRows((data ?? []).map((r: any) => ({
      id: r.id,
      user: r.profiles?.full_name ?? 'Unknown user',
      points: Number(r.amount),
      pkr: Number(r.amount),
      method: r.method,
      account: r.account_details?.account_number ?? '—',
      status: r.status,
      date: new Date(r.created_at).toLocaleDateString('en-PK'),
    })));
  }

  useEffect(() => { void load(); }, []);

  const filtered = filter === 'all' ? rows : rows.filter((r) => r.status === filter);

  async function setStatus(id: string, status: WithdrawalStatus) {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.rpc('admin_review_withdrawal', {
      p_withdrawal_id: id,
      p_status: status,
      p_rejection_reason: status === 'rejected' ? 'Rejected by administrator' : null,
    });
    if (error) { toast.error(error.message); return; }
    await load();
    toast.success(`Withdrawal ${status}`);
  }

  function review(id: string, status: WithdrawalStatus) {
    const r = rows.find((item) => item.id === id);
    if (!r) return;
    if (status === 'paid') {
      confirm({
        title: 'Mark as paid',
        description: `Confirm you have actually transferred PKR ${r.pkr.toLocaleString()} to ${r.user} via ${r.method.replace('_', ' ')} before marking this paid.`,
        confirmLabel: 'Confirm paid',
        onConfirm: () => void setStatus(id, status),
      });
      return;
    }
    if (status === 'rejected') {
      confirm({
        title: 'Reject withdrawal',
        description: `Reject this PKR ${r.pkr.toLocaleString()} withdrawal? The user's points will be returned automatically.`,
        confirmLabel: 'Reject',
        danger: true,
        onConfirm: () => void setStatus(id, status),
      });
      return;
    }
    void setStatus(id, status);
  }

  return (
    <div className="space-y-6">
      {dialog}
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Withdrawals</h1>
        <p className="text-sm text-navy-500">Review requests, approve or reject them, then mark approved payments as paid after the transfer is actually completed.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(['pending', 'approved', 'paid', 'rejected', 'all'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${filter === f ? 'bg-navy-900 text-white' : 'bg-navy-100 text-navy-600'}`}>{f}</button>
        ))}
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-left text-xs font-semibold uppercase text-navy-500">
            <tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Method / Account</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="px-5 py-3 font-medium text-navy-900">{r.user}<br /><span className="text-xs font-normal text-navy-400">{r.date}</span></td>
                <td className="px-5 py-3 font-mono text-navy-700">{r.points.toLocaleString()} pts<br /><span className="text-xs text-brand-green-dark">PKR {r.pkr.toLocaleString()}</span></td>
                <td className="px-5 py-3 capitalize text-navy-600">{r.method.replace('_', ' ')}<br /><span className="font-mono text-xs">{r.account}</span></td>
                <td className="px-5 py-3"><span className={`badge capitalize ${statusStyle[r.status]}`}>{r.status}</span></td>
                <td className="px-5 py-3"><div className="flex gap-2">
                  {r.status === 'pending' && <><button onClick={() => review(r.id, 'approved')} className="rounded-lg bg-brand-blue/10 p-1.5 text-brand-blue" title="Approve"><Check size={15} /></button><button onClick={() => review(r.id, 'rejected')} className="rounded-lg bg-red-50 p-1.5 text-red-600" title="Reject"><X size={15} /></button></>}
                  {r.status === 'approved' && <button onClick={() => review(r.id, 'paid')} className="btn-success !px-3 !py-1.5 text-xs"><BadgeCheck size={14} /> Mark paid</button>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
