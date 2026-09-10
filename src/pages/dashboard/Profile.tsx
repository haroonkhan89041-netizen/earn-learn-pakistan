import { useEffect, useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { User, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export function Profile() {
  const { profile, user, signOut } = useAuth();
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [skills, setSkills] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? '');
    setCity(profile.city ?? '');
    setSkills((profile.skills ?? []).join(', '));
  }, [profile]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (isSupabaseConfigured && user) {
      const { error } = await supabase.from('profiles').update({ full_name: fullName.trim(), city: city.trim() || null, skills: skills.split(',').map((s) => s.trim()).filter(Boolean) }).eq('id', user.id);
      setSaving(false);
      if (error) { toast.error(error.message); return; }
    } else { await new Promise((r) => setTimeout(r, 500)); setSaving(false); }
    toast.success('Profile updated');
  }

  return (
    <div className="max-w-3xl space-y-7">
      <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-white to-blue-50/70 p-6 shadow-[0_18px_60px_rgba(30,64,175,0.08)] md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"><User size={34} /></div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700"><ShieldCheck size={13} /> Account profile</div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-navy-900 md:text-3xl">{profile?.full_name || 'Your profile'}</h1>
            <p className="mt-1 truncate text-sm text-navy-500">{profile?.email}</p>
          </div>
          <span className="badge-verified self-start sm:self-center">{profile?.account_status ?? 'active'}</span>
        </div>
      </section>

      <div className="card overflow-hidden">
        <div className="border-b border-navy-100 bg-navy-50/50 px-6 py-4"><div className="flex items-center gap-2"><Sparkles size={16} className="text-blue-600" /><h2 className="font-display font-bold text-navy-900">Personal details</h2></div><p className="mt-1 text-xs text-navy-500">Keep your information up to date so your account stays complete.</p></div>
        <form onSubmit={onSubmit} className="grid gap-5 p-6 sm:grid-cols-2">
          <div><label className="label">Full name</label><input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required /></div>
          <div><label className="label">Email</label><input className="input bg-navy-50" value={profile?.email ?? ''} disabled /></div>
          <div><label className="label flex items-center gap-1"><MapPin size={13} /> City</label><input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Karachi" /></div>
          <div><label className="label">Referral code</label><input className="input bg-navy-50" value={profile?.referral_code ?? ''} disabled /></div>
          <div className="sm:col-span-2"><label className="label">Skills <span className="font-normal text-navy-400">(comma separated)</span></label><input className="input" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Content Writing, Canva Design, Web Development" /></div>
          <div className="flex flex-col gap-3 border-t border-navy-100 pt-5 sm:col-span-2 sm:flex-row"><button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button><button type="button" onClick={signOut} className="btn-outline">Log out</button></div>
        </form>
      </div>
    </div>
  );
}
