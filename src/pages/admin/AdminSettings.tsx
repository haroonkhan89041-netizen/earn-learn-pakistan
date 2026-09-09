import { useEffect, useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const defaults = {
  points_to_pkr_rate: '0.5',
  minimum_withdrawal_points: '1000',
  referral_reward_points: '100',
  default_task_reward_points: '20',
  platform_announcement: '',
};

function readValue<T>(value: unknown, fallback: T): T {
  return value === null || value === undefined ? fallback : (value as T);
}

export function AdminSettings() {
  const [pointsRate, setPointsRate] = useState(defaults.points_to_pkr_rate);
  const [minWithdrawal, setMinWithdrawal] = useState(defaults.minimum_withdrawal_points);
  const [referralReward, setReferralReward] = useState(defaults.referral_reward_points);
  const [taskReward, setTaskReward] = useState(defaults.default_task_reward_points);
  const [announcement, setAnnouncement] = useState(defaults.platform_announcement);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key,value')
        .in('key', Object.keys(defaults));

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      const settings = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));
      setPointsRate(String(readValue(settings.points_to_pkr_rate, defaults.points_to_pkr_rate)));
      setMinWithdrawal(String(readValue(settings.minimum_withdrawal_points, defaults.minimum_withdrawal_points)));
      setReferralReward(String(readValue(settings.referral_reward_points, defaults.referral_reward_points)));
      setTaskReward(String(readValue(settings.default_task_reward_points, defaults.default_task_reward_points)));
      setAnnouncement(String(readValue(settings.platform_announcement, defaults.platform_announcement)));
      setLoading(false);
    })();
  }, []);

  async function saveSetting(key: string, value: unknown, userId: string) {
    const { error } = await supabase.from('site_settings').upsert(
      { key, value, updated_by: userId, updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    );
    return error;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const rate = Number(pointsRate);
    const minimum = Number(minWithdrawal);
    const referral = Number(referralReward);
    const task = Number(taskReward);

    if (!Number.isFinite(rate) || rate <= 0) { toast.error('Conversion rate must be greater than 0'); return; }
    if (!Number.isInteger(minimum) || minimum < 1) { toast.error('Minimum withdrawal must be a positive whole number'); return; }
    if (!Number.isInteger(referral) || referral < 0) { toast.error('Referral reward must be 0 or more'); return; }
    if (!Number.isInteger(task) || task < 1) { toast.error('Task reward must be a positive whole number'); return; }

    setSaving(true);
    if (isSupabaseConfigured) {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        setSaving(false);
        toast.error('Admin session not found');
        return;
      }

      const settings = [
        ['points_to_pkr_rate', rate],
        ['minimum_withdrawal_points', minimum],
        ['referral_reward_points', referral],
        ['default_task_reward_points', task],
        ['platform_announcement', announcement.trim() || null],
      ] as const;

      for (const [key, value] of settings) {
        const error = await saveSetting(key, value, userData.user.id);
        if (error) {
          setSaving(false);
          toast.error(error.message);
          return;
        }
      }
    } else {
      await new Promise((r) => setTimeout(r, 400));
    }

    setSaving(false);
    toast.success('Settings saved');
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Settings</h1>
        <p className="text-sm text-navy-500">Live platform configuration stored in Supabase.</p>
      </div>

      <form onSubmit={onSubmit} className="card space-y-5 p-6">
        <div>
          <label className="label">Points → PKR conversion rate</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-navy-500">1 point =</span>
            <input className="input w-32" type="number" min="0.01" step="0.01" value={pointsRate} onChange={(e) => setPointsRate(e.target.value)} disabled={loading || saving} />
            <span className="text-sm text-navy-500">PKR</span>
          </div>
        </div>
        <div>
          <label className="label">Minimum withdrawal (points)</label>
          <input className="input" type="number" min="1" step="1" value={minWithdrawal} onChange={(e) => setMinWithdrawal(e.target.value)} disabled={loading || saving} />
        </div>
        <div>
          <label className="label">Referral reward (points)</label>
          <input className="input" type="number" min="0" step="1" value={referralReward} onChange={(e) => setReferralReward(e.target.value)} disabled={loading || saving} />
        </div>
        <div>
          <label className="label">Default task reward (points)</label>
          <input className="input" type="number" min="1" step="1" value={taskReward} onChange={(e) => setTaskReward(e.target.value)} disabled={loading || saving} />
        </div>
        <div>
          <label className="label">Platform announcement (shown to all users)</label>
          <textarea className="input" rows={3} value={announcement} onChange={(e) => setAnnouncement(e.target.value)} placeholder="Optional banner message…" disabled={loading || saving} />
        </div>
        <button className="btn-primary" disabled={loading || saving}>{loading ? 'Loading…' : saving ? 'Saving…' : 'Save settings'}</button>
      </form>
    </div>
  );
}
