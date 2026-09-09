import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Row {
  id: string;
  name: string;
  username: string;
  points: number;
  balance: number;
  role: 'user' | 'admin';
}

const initialUsers: Row[] = [];

export function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [q, setQ] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, points, balance, role')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setUsers(data.map((u) => ({
          id: u.id,
          name: u.full_name || u.username || 'Unnamed user',
          username: u.username || '—',
          points: Number(u.points ?? 0),
          balance: Number(u.balance ?? 0),
          role: u.role === 'admin' ? 'admin' : 'user',
        })));
      }
    })();
  }, []);

  const filtered = users.filter((u) =>
    `${u.name} ${u.username}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Users</h1>
        <p className="text-sm text-navy-500">View registered accounts, balances, points, and roles.</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
        <input
          className="input pl-9"
          placeholder="Search users…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-left text-xs font-semibold uppercase text-navy-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Username</th>
              <th className="px-5 py-3">Points</th>
              <th className="px-5 py-3">Balance</th>
              <th className="px-5 py-3">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3 font-medium text-navy-900">{u.name}</td>
                <td className="px-5 py-3 text-navy-600">{u.username}</td>
                <td className="px-5 py-3 font-mono text-navy-700">{u.points.toLocaleString()}</td>
                <td className="px-5 py-3 font-mono text-navy-700">PKR {u.balance.toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className="badge capitalize bg-navy-100 text-navy-700">{u.role}</span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-navy-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
