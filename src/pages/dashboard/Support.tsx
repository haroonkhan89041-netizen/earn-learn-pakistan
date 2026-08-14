import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { LifeBuoy } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import type { TicketStatus } from '@/types';

const categories = ['Account', 'Withdrawal', 'Task verification', 'Opportunity report', 'Other'];

const statusStyle: Record<TicketStatus, string> = {
  open: 'bg-brand-blue/10 text-brand-blue',
  in_progress: 'bg-brand-amber/10 text-amber-700',
  resolved: 'bg-brand-green/10 text-brand-green-dark',
  closed: 'bg-navy-100 text-navy-500',
};

const initialTickets = [
  { id: 't1', category: 'Withdrawal', message: 'My withdrawal has been pending for 5 days.', status: 'in_progress' as TicketStatus, date: '2026-08-09' },
];

export function Support() {
  const [tickets, setTickets] = useState(initialTickets);
  const [category, setCategory] = useState(categories[0]);
  const [message, setMessage] = useState('');

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setTickets((t) => [{ id: String(Date.now()), category, message, status: 'open', date: new Date().toISOString().slice(0, 10) }, ...t]);
    setMessage('');
    toast.success('Support ticket created');
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Support</h1>
        <p className="mb-6 text-sm text-navy-500">Create a ticket and our team will respond here.</p>
        <form onSubmit={onSubmit} className="card space-y-4 p-5">
          <div>
            <label className="label">Category</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Message</label>
            <textarea className="input" rows={5} required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue…" />
          </div>
          <button className="btn-primary w-full">Create ticket</button>
        </form>
      </div>

      <div>
        <h2 className="mb-4 font-display text-base font-bold text-navy-900 lg:mt-14">Your tickets</h2>
        {tickets.length === 0 ? (
          <EmptyState icon={<LifeBuoy size={22} />} title="No tickets yet" description="Created tickets will appear here with their status." />
        ) : (
          <div className="card divide-y divide-navy-100">
            {tickets.map((t) => (
              <div key={t.id} className="p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-navy-900">{t.category}</span>
                  <span className={`badge ${statusStyle[t.status]} capitalize`}>{t.status.replace('_', ' ')}</span>
                </div>
                <p className="text-sm text-navy-600">{t.message}</p>
                <p className="mt-1 text-xs text-navy-400">{t.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
