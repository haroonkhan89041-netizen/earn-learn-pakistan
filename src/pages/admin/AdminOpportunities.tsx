import { useEffect, useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Plus, Star, Check, X, Trash2 } from 'lucide-react';
import { DEMO_OPPORTUNITIES } from '@/data/demoData';
import type { Opportunity } from '@/types';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export function AdminOpportunities() {
  const [items, setItems] = useState<Opportunity[]>([
    ...DEMO_OPPORTUNITIES,
    { id: 'pending-1', title: 'New Content Writing Gig — TrustPen', description: 'Submitted by a partner, awaiting review.', category: 'content_creation', difficulty: 'beginner', estimated_earning: 'PKR 8,000 - 20,000 / month', time_required: '2-3 hrs/day', external_url: 'https://example.com', is_verified: false, is_featured: false, status: 'pending', click_count: 0, created_at: '2026-08-12T00:00:00Z' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const { confirm, dialog } = useConfirmDialog();

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const { data } = await supabase.from('opportunities').select('*').order('created_at', { ascending: false });
      if (data) setItems(data as Opportunity[]);
    })();
  }, []);

  async function updateStatus(id: string, status: Opportunity['status']) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('opportunities')
        .update({ status, is_verified: status === 'approved' }).eq('id', id);
      if (error) { toast.error(error.message); return; }
    }
    setItems((prev) => prev.map((o) => o.id === id ? { ...o, status, is_verified: status === 'approved' } : o));
    toast.success(`Opportunity ${status}`);
  }
  async function toggleFeature(id: string) {
    const target = items.find((o) => o.id === id);
    const next = !target?.is_featured;
    if (isSupabaseConfigured) await supabase.from('opportunities').update({ is_featured: next }).eq('id', id);
    setItems((prev) => prev.map((o) => o.id === id ? { ...o, is_featured: next } : o));
  }
  function remove(o: Opportunity) {
    confirm({
      title: 'Delete opportunity', description: `Delete "${o.title}"? This can't be undone.`,
      confirmLabel: 'Delete', danger: true,
      onConfirm: async () => {
        if (isSupabaseConfigured) {
          const { error } = await supabase.from('opportunities').delete().eq('id', o.id);
          if (error) { toast.error(error.message); return; }
        }
        setItems((prev) => prev.filter((x) => x.id !== o.id));
        toast.success('Deleted');
      },
    });
  }

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get('title')), description: String(fd.get('description')),
      category: 'freelancing' as const, difficulty: 'beginner' as const,
      estimated_earning: String(fd.get('earning')), time_required: String(fd.get('time')),
      external_url: String(fd.get('url')), is_verified: false, is_featured: false,
      status: 'pending' as const, click_count: 0,
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('opportunities').insert(payload).select().single();
      if (error) { toast.error(error.message); return; }
      setItems((prev) => [data as Opportunity, ...prev]);
    } else {
      setItems((prev) => [{ ...payload, id: `new-${Date.now()}`, created_at: new Date().toISOString() }, ...prev]);
    }
    setShowForm(false);
    toast.success('Opportunity added — pending approval');
  }

  return (
    <div className="space-y-6">
      {dialog}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-navy-900">Opportunities</h1>
          <p className="text-sm text-navy-500">Add, approve, feature, or remove listings.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}><Plus size={16} /> Add opportunity</button>
      </div>

      {showForm && (
        <form onSubmit={onCreate} className="card grid gap-3 p-5 sm:grid-cols-2">
          <input name="title" required placeholder="Title" className="input sm:col-span-2" />
          <textarea name="description" required placeholder="Description" className="input sm:col-span-2" rows={2} />
          <input name="earning" required placeholder="Estimated earning (e.g. PKR 10,000 - 25,000/mo)" className="input" />
          <input name="time" required placeholder="Time required (e.g. 2-4 hrs/day)" className="input" />
          <input name="url" required type="url" placeholder="External URL" className="input sm:col-span-2" />
          <div className="sm:col-span-2 flex gap-2">
            <button className="btn-primary">Save as pending</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-left text-xs font-semibold uppercase text-navy-500">
            <tr><th className="px-5 py-3">Title</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Featured</th><th className="px-5 py-3">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {items.map((o) => (
              <tr key={o.id}>
                <td className="px-5 py-3 font-medium text-navy-900">{o.title}</td>
                <td className="px-5 py-3 text-navy-600">{o.category.replace('_', ' ')}</td>
                <td className="px-5 py-3">
                  <span className={`badge capitalize ${o.status === 'approved' ? 'bg-brand-green/10 text-brand-green-dark' : o.status === 'pending' ? 'bg-brand-amber/10 text-amber-700' : 'bg-red-100 text-red-700'}`}>{o.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleFeature(o.id)}>
                    <Star size={16} className={o.is_featured ? 'fill-brand-amber text-brand-amber' : 'text-navy-300'} />
                  </button>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    {o.status !== 'approved' && (
                      <button onClick={() => updateStatus(o.id, 'approved')} className="rounded-lg bg-brand-green/10 p-1.5 text-brand-green-dark" title="Approve"><Check size={15} /></button>
                    )}
                    {o.status !== 'rejected' && (
                      <button onClick={() => updateStatus(o.id, 'rejected')} className="rounded-lg bg-red-50 p-1.5 text-red-600" title="Reject"><X size={15} /></button>
                    )}
                    <button onClick={() => remove(o)} className="rounded-lg bg-navy-50 p-1.5 text-navy-500" title="Delete"><Trash2 size={15} /></button>
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
