import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MessageSquare, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { SupportTicket, TicketStatus } from '@/types';

const filters: Array<TicketStatus | 'all'> = ['open', 'in_progress', 'resolved', 'closed', 'all'];

export function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filter, setFilter] = useState<TicketStatus | 'all'>('open');
  const [reply, setReply] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('support_tickets')
      .select('id,user_id,category,message,status,admin_reply,created_at,updated_at,resolved_at')
      .order('created_at', { ascending: false });
    if (error) toast.error('Unable to load support tickets');
    else setTickets((data ?? []) as SupportTicket[]);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function updateTicket(ticket: SupportTicket, nextStatus: TicketStatus) {
    const nextReply = reply[ticket.id]?.trim();
    setSaving(ticket.id);
    const { error } = await supabase.from('support_tickets').update({
      status: nextStatus,
      ...(nextReply ? { admin_reply: nextReply } : {}),
    }).eq('id', ticket.id);
    if (error) toast.error(error.message);
    else { toast.success('Support ticket updated'); await load(); setReply((current) => ({ ...current, [ticket.id]: '' })); }
    setSaving(null);
  }

  const visible = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-navy-900">Support</h1>
          <p className="text-sm text-navy-500">Review user tickets, reply, and update their status.</p>
        </div>
        <button onClick={() => void load()} className="btn-secondary"><RefreshCw size={15} /> Refresh</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${filter === f ? 'bg-navy-900 text-white' : 'bg-navy-100 text-navy-600'}`}>{f.replace('_', ' ')}</button>)}
      </div>
      {loading ? <div className="card p-5 text-sm text-navy-500">Loading support tickets…</div> : visible.length === 0 ? (
        <div className="card p-8 text-center"><MessageSquare className="mx-auto mb-2 text-navy-300" size={28} /><p className="text-sm text-navy-500">No {filter === 'all' ? '' : filter.replace('_', ' ')} tickets.</p></div>
      ) : (
        <div className="space-y-4">
          {visible.map((ticket) => (
            <div key={ticket.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div><span className="font-semibold text-navy-900">{ticket.category}</span><p className="text-xs text-navy-400">{new Date(ticket.created_at).toLocaleString('en-PK')}</p></div>
                <span className="badge capitalize">{ticket.status.replace('_', ' ')}</span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-navy-700">{ticket.message}</p>
              {ticket.admin_reply && <div className="mt-3 rounded-lg bg-navy-50 p-3 text-sm text-navy-700"><span className="font-semibold">Current reply:</span> {ticket.admin_reply}</div>}
              <textarea className="input mt-4" rows={3} value={reply[ticket.id] ?? ''} onChange={(e) => setReply((current) => ({ ...current, [ticket.id]: e.target.value }))} placeholder="Write a reply (optional)…" />
              <div className="mt-3 flex flex-wrap gap-2">
                {(['in_progress', 'resolved', 'closed', 'open'] as TicketStatus[]).map((status) => <button key={status} disabled={saving === ticket.id} onClick={() => void updateTicket(ticket, status)} className="btn-secondary !px-3 !py-1.5 text-xs capitalize">{status.replace('_', ' ')}</button>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
