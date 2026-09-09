import { useEffect, useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { User } from 'lucide-react';
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
      const { error } = await supabase.from('profiles').update({
        full_name: fullName.trim(),
        city: city.trim() || null,
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      }).eq('id', user.id);
      setSaving(false);
      if (error) { toast.error(error.message); return; }
    } else {
      await new Promise((r) => setTimeout(r, 500));
      setSaving(false);
    }
    toast.success('Profile updated');
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Profile</h1>
        <p className="text-sm text-navy-500">Manage your account details.</p>
      </div>

      <div className="card p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-100 text-navy-400">
            <User size={28} />
          </div>
          <div className="min-w-0">
            <p className="font-display text-base font-bold text-navy-900 truncate">{profile?.full_name || 'Your profile'}</p>
            <p className="text-sm text-navy-500 truncate">{profile?.email}</p>
            <span className="badge-verified mt-1">{profile?.account_status ?? 'active'}</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Full name</label>
            <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input bg-navy-50" value={profile?.email ?? ''} disabled />
          </div>
          <div>
            <label className="label">City</label>
            <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Karachi" />
          </div>
          <div>
            <label className="label">Referral code</label>
            <input className="input bg-navy-50" value={profile?.referral_code ?? ''} disabled />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Skills (comma separated)</label>
            <input className="input" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Content Writing, Canva Design" />
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
            <button type="button" onClick={signOut} className="btn-outline">Log out</button>
          </div>
        </form>
      </div>
    </div>
  );
}
