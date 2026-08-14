import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Row { id: string; name: string; email: string; city: string; points: number; status: 'active' | 'suspended'; }

const initialUsers: Row[] = [
  { id: '1', name: 'Ayesha Khan', email: 'ayesha@example.com', city: 'Lahore', points: 4820, status: 'active' },
  { id: '2', name: 'Bilal Raza', email: 'bilal@example.com', city: 'Karachi', points: 4510, status: 'active' },
  { id: '3', name: 'Zainab Ali', email: 'zainab@example.com', city: 'Islamabad', points: 220, status: 'suspended' },
  { id: '4', name: 'Sana Malik', email: 'sana@example.com', city: 'Multan', points: 3990, status: 'active' },
];

export function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [q, setQ] = useState('');
  const { confirm, dialog } = useConfirmDialog();

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, email, city, points_balance, account_status')
        .order('created_at', { ascending: false });
      if (data) {
        setUsers(data.map((u: any) => ({
          id: u.id, name: u.full_name, email: u.email, city: u.city ?? '—',
          points: u.points_balance, status: u.account_status === 'suspended' ? 'suspended' : 'active',
        })));
      }
    })();
  }, []);

  const filtered = users.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));

  function toggleStatus(u: Row) {
    const suspending = u.status === 'active';
    confirm({
      title: suspending ? 'Suspend user' : 'Activate user',
      description: `${suspending ? 'Suspend' : 'Re-activate'} ${u.name}'s account?`,
      confirmLabel: suspending ? 'Suspend' : 'Activate',
      danger: suspending,
      onConfirm: async () => {
        const newStatus = suspending ? 'suspended' : 'active';
        if (isSupabaseConfigured) {
          const { error } = await supabase.from('profiles').update({ account_status: newStatus }).eq('id', u.id);
          if (error) { toast.error(error.message); return; }
        }
        setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, status: newStatus } : x));
        toast.success(`User ${newStatus}`);
      },
    });
  }

  return (
    <div className="space-y-6">
      {dialog}
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Users</h1>
        <p className="text-sm text-navy-500">Search, suspend, or reactivate accounts.</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
        <input className="input pl-9" placeholder="Search users…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-left text-xs font-semibold uppercase text-navy-500">
            <tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">City</th><th className="px-5 py-3">Points</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3 font-medium text-navy-900">{u.name}</td>
                <td className="px-5 py-3 text-navy-600">{u.email}</td>
                <td className="px-5 py-3 text-navy-600">{u.city}</td>
                <td className="px-5 py-3 font-mono text-navy-700">{u.points.toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className={`badge capitalize ${u.status === 'active' ? 'bg-brand-green/10 text-brand-green-dark' : 'bg-red-100 text-red-700'}`}>{u.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleStatus(u)} className={u.status === 'active' ? 'btn bg-red-50 text-red-700 hover:bg-red-100 !px-3 !py-1.5 text-xs' : 'btn-success !px-3 !py-1.5 text-xs'}>
                    {u.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
