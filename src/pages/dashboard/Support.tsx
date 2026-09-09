import { useEffect, useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { LifeBuoy } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { SupportCategory, SupportTicket } from '@/types';

const categories: SupportCategory[] = ['Account', 'Withdrawal', 'Task verification', 'Opportunity report', 'Other'];

const statusStyle = {
  open: 'bg-brand-blue/10 text-brand-blue',
  in_progress: 'bg-brand-amber/10 text-amber-700',
  resolved: 'bg-brand-green/10 text-brand-green-dark',
  closed: 'bg-navy-100 text-navy-500',
} as const;

export function Support() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [category, setCategory] = useState<SupportCategory>('Account');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const userId = user?.id;
    if (!userId) { setTickets([]); setLoading(false); return; }
    let active = true;
    async function loadTickets() {
      setLoading(true);
      const { data, error } = await supabase
        .from('support_tickets')
        .select('id,user_id,category,message,status,admin_reply,created_at,updated_at,resolved_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!active) return;
      if (error) toast.error('Unable to load support tickets');
      else setTickets((data ?? []) as SupportTicket[]);
      setLoading(false);
    }
    void loadTickets();
    return () => { active = false; };
  }, [user?.id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!user || !trimmed || submitting) return;
    const userId = user.id;
    setSubmitting(true);
    const { data, error } = await supabase
      .from('support_tickets')
      .insert({ user_id: userId, category, message: trimmed })
      .select('id,user_id,category,message,status,admin_reply,created_at,updated_at,resolved_at')
      .single();
    if (error) {
      toast.error('Could not create support ticket');
    } else {
      setTickets((current) => [data as SupportTicket, ...current]);
      setMessage('');
      toast.success('Support ticket created');
    }
    setSubmitting(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Support</h1>
        <p className="mb-6 text-sm text-navy-500">Create a ticket and our team will respond here.</p>
        <form onSubmit={onSubmit} className="card space-y-4 p-5">
          <div><label className="label">Category</label><select className="input" value={category} onChange={(e) => setCategory(e.target.value as SupportCategory)}>{categories.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">Message</label><textarea className="input" rows={5} required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue…" /></div>
          <button className="btn-primary w-full" disabled={submitting}>{submitting ? 'Creating…' : 'Create ticket'}</button>
        </form>
      </div>
      <div>
        <h2 className="mb-4 font-display text-base font-bold text-navy-900 lg:mt-14">Your tickets</h2>
        {loading ? <div className="card p-5 text-sm text-navy-500">Loading your tickets…</div> : tickets.length === 0 ? <EmptyState icon={<LifeBuoy size={22} />} title="No tickets yet" description="Created tickets will appear here with their status." /> : <div className="card divide-y divide-navy-100">{tickets.map((t) => <div key={t.id} className="p-4"><div className="mb-1 flex items-center justify-between gap-3"><span className="text-sm font-semibold text-navy-900">{t.category}</span><span className={`badge ${statusStyle[t.status]} capitalize`}>{t.status.replace('_', ' ')}</span></div><p className="text-sm text-navy-600">{t.message}</p>{t.admin_reply && <div className="mt-3 rounded-lg bg-navy-50 p-3 text-sm text-navy-700"><span className="font-semibold">Support reply:</span> {t.admin_reply}</div>}<p className="mt-1 text-xs text-navy-400">{new Date(t.created_at).toLocaleDateString()}</p></div>)}</div>}
      </div>
    </div>
  );
}
