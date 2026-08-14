import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Check, X, BadgeCheck } from 'lucide-react';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { WithdrawalStatus, WithdrawalMethod } from '@/types';

interface Row {
  id: string; user: string; points: number; pkr: number; method: WithdrawalMethod;
  account: string; status: WithdrawalStatus; date: string;
}

const initial: Row[] = [
  { id: 'w1', user: 'Ayesha Khan', points: 1200, pkr: 600, method: 'easypaisa', account: '0300-1234567', status: 'pending', date: '2026-08-11' },
  { id: 'w2', user: 'Bilal Raza', points: 2000, pkr: 1000, method: 'jazzcash', account: '0301-7654321', status: 'pending', date: '2026-08-12' },
  { id: 'w3', user: 'Sana Malik', points: 1500, pkr: 750, method: 'bank_transfer', account: 'HBL - 01234567890123', status: 'approved', date: '2026-08-08' },
  { id: 'w4', user: 'Usman Tariq', points: 900, pkr: 450, method: 'easypaisa', account: '0333-1112223', status: 'paid', date: '2026-08-01' },
];

const statusStyle: Record<WithdrawalStatus, string> = {
  pending: 'bg-brand-amber/10 text-amber-700',
  approved: 'bg-brand-blue/10 text-brand-blue',
  paid: 'bg-brand-green/10 text-brand-green-dark',
  rejected: 'bg-red-100 text-red-700',
};

export function AdminWithdrawals() {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState<WithdrawalStatus | 'all'>('pending');
  const { confirm, dialog } = useConfirmDialog();

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const { data } = await supabase
        .from('withdrawals')
        // withdrawals has two FKs into profiles (user_id, processed_by), so
        // the embed must name the constraint explicitly.
        .select('id, amount_points, amount_pkr, method, account_name, account_number, status, requested_at, profiles!withdrawals_user_id_fkey(full_name)')
        .order('requested_at', { ascending: false });
      if (data) {
        setRows(data.map((r: any) => ({
          id: r.id, user: r.profiles?.full_name ?? 'Unknown', points: r.amount_points,
          pkr: r.amount_pkr, method: r.method, account: r.account_number,
          status: r.status, date: new Date(r.requested_at).toLocaleDateString(),
        })));
      }
    })();
  }, []);

  const filtered = filter === 'all' ? rows : rows.filter((r) => r.status === filter);

  async function setStatus(id: string, status: WithdrawalStatus) {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('withdrawals').update({
        status, processed_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) { toast.error(error.message); return; }
    }
    toast.success(`Marked as ${status}`);
  }

  function markPaid(r: Row) {
    confirm({
      title: 'Mark as paid', description: `Confirm you have actually transferred PKR ${r.pkr.toLocaleString()} to ${r.user} via ${r.method.replace('_', ' ')} before marking this paid.`,
      confirmLabel: 'Confirm paid',
      onConfirm: () => setStatus(r.id, 'paid'),
    });
  }

  return (
    <div className="space-y-6">
      {dialog}
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Withdrawals</h1>
        <p className="text-sm text-navy-500">Every request must be manually reviewed. Never auto-mark as paid.</p>
      </div>

      <div className="flex gap-2">
        {(['pending', 'approved', 'paid', 'rejected', 'all'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-navy-900 text-white' : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
            }`}>
            {f}
          </button>
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
                <td className="px-5 py-3 text-navy-600 capitalize">{r.method.replace('_', ' ')}<br /><span className="font-mono text-xs">{r.account}</span></td>
                <td className="px-5 py-3"><span className={`badge capitalize ${statusStyle[r.status]}`}>{r.status}</span></td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    {r.status === 'pending' && (
                      <>
                        <button onClick={() => setStatus(r.id, 'approved')} className="rounded-lg bg-brand-blue/10 p-1.5 text-brand-blue" title="Approve"><Check size={15} /></button>
                        <button onClick={() => setStatus(r.id, 'rejected')} className="rounded-lg bg-red-50 p-1.5 text-red-600" title="Reject"><X size={15} /></button>
                      </>
                    )}
                    {r.status === 'approved' && (
                      <button onClick={() => markPaid(r)} className="btn-success !px-3 !py-1.5 text-xs"><BadgeCheck size={14} /> Mark paid</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
