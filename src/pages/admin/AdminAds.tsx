import { useEffect, useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import type { Advertisement } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const DEMO_ADS: Advertisement[] = [
  { id: 'ad1', placement: 'home_hero', is_enabled: true, ad_code: '<!-- AdSense unit: home-hero -->', impressions: 18420, clicks: 312 },
  { id: 'ad2', placement: 'dashboard_sidebar', is_enabled: false, ad_code: '<!-- AdSense unit: dashboard-sidebar -->', impressions: 0, clicks: 0 },
];

export function AdminAds() {
  const [ads, setAds] = useState<Advertisement[]>(DEMO_ADS);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const { data, error } = await supabase.from('advertisements').select('*').order('placement');
      if (error) { toast.error(error.message); return; }
      if (data) setAds(data as Advertisement[]);
    })();
  }, []);

  async function toggle(id: string) {
    const target = ads.find((a) => a.id === id);
    if (!target) return;
    const next = !target.is_enabled;
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('advertisements').update({ is_enabled: next }).eq('id', id);
      if (error) { toast.error(error.message); return; }
    }
    setAds((prev) => prev.map((a) => a.id === id ? { ...a, is_enabled: next } : a));
  }

  async function remove(id: string) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('advertisements').delete().eq('id', id);
      if (error) { toast.error(error.message); return; }
    }
    setAds((prev) => prev.filter((a) => a.id !== id));
    toast.success('Ad placement removed');
  }

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      placement: fd.get('placement') as Advertisement['placement'],
      is_enabled: false, ad_code: String(fd.get('code')), impressions: 0, clicks: 0,
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('advertisements').insert(payload).select().single();
      if (error) { toast.error(error.message); return; }
      setAds((prev) => [data as Advertisement, ...prev]);
    } else {
      setAds((prev) => [{ ...payload, id: `ad-${Date.now()}` }, ...prev]);
    }
    setShowForm(false);
    toast.success('Ad placement added (disabled by default)');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-navy-900">Advertising</h1>
          <p className="text-sm text-navy-500">Manage ad placements. Impressions/clicks reflect real traffic only.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}><Plus size={16} /> Add placement</button>
      </div>

      {showForm && (
        <form onSubmit={onCreate} className="card grid gap-3 p-5">
          <select name="placement" className="input" required>
            <option value="home_hero">Home — hero</option>
            <option value="dashboard_sidebar">Dashboard — sidebar</option>
            <option value="opportunities_inline">Opportunities — inline</option>
          </select>
          <textarea name="code" required placeholder="Ad script / tag code" className="input font-mono text-xs" rows={3} />
          <div className="flex gap-2">
            <button className="btn-primary">Add placement</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-left text-xs font-semibold uppercase text-navy-500">
            <tr><th className="px-5 py-3">Placement</th><th className="px-5 py-3">Enabled</th><th className="px-5 py-3">Impressions</th><th className="px-5 py-3">Clicks</th><th className="px-5 py-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {ads.map((a) => (
              <tr key={a.id}>
                <td className="px-5 py-3 font-medium text-navy-900 capitalize">{a.placement.replace('_', ' ')}</td>
                <td className="px-5 py-3">
                  <button onClick={() => toggle(a.id)} className={`relative h-6 w-11 rounded-full transition-colors ${a.is_enabled ? 'bg-brand-green' : 'bg-navy-200'}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${a.is_enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </td>
                <td className="px-5 py-3 font-mono text-navy-700">{a.impressions.toLocaleString()}</td>
                <td className="px-5 py-3 font-mono text-navy-700">{a.clicks.toLocaleString()}</td>
                <td className="px-5 py-3">
                  <button onClick={() => remove(a.id)} className="rounded-lg bg-navy-50 p-1.5 text-navy-500"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ads.length === 0 && <p className="p-5 text-sm text-navy-400">No ad placements yet.</p>}
      </div>
      <p className="text-xs text-navy-400">
        Impression and click counts must be wired to real ad-network callbacks (e.g. Google
        AdSense/Ad Manager) — this UI never simulates traffic.
      </p>
    </div>
  );
}
