import { useEffect, useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export function AdminSettings() {
  const [pointsRate, setPointsRate] = useState('0.5');
  const [minWithdrawal, setMinWithdrawal] = useState('1000');
  const [referralReward, setReferralReward] = useState('50');
  const [taskReward, setTaskReward] = useState('20');
  const [announcement, setAnnouncement] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const { data } = await supabase.from('admin_settings').select('*').single();
      if (data) {
        setPointsRate(String(data.points_to_pkr_rate));
        setMinWithdrawal(String(data.minimum_withdrawal_points));
        setReferralReward(String(data.referral_reward_points));
        setTaskReward(String(data.default_task_reward_points));
        setAnnouncement(data.platform_announcement ?? '');
      }
    })();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('admin_settings').update({
        points_to_pkr_rate: Number(pointsRate),
        minimum_withdrawal_points: Number(minWithdrawal),
        referral_reward_points: Number(referralReward),
        default_task_reward_points: Number(taskReward),
        platform_announcement: announcement || null,
      }).eq('id', true);
      setSaving(false);
      if (error) { toast.error(error.message); return; }
    } else {
      await new Promise((r) => setTimeout(r, 400));
      setSaving(false);
    }
    toast.success('Settings saved');
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Settings</h1>
        <p className="text-sm text-navy-500">Platform-wide configuration — nothing here is hardcoded in the app.</p>
      </div>

      <form onSubmit={onSubmit} className="card space-y-5 p-6">
        <div>
          <label className="label">Points → PKR conversion rate</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-navy-500">1 point =</span>
            <input className="input w-32" type="number" step="0.01" value={pointsRate} onChange={(e) => setPointsRate(e.target.value)} />
            <span className="text-sm text-navy-500">PKR</span>
          </div>
        </div>
        <div>
          <label className="label">Minimum withdrawal (points)</label>
          <input className="input" type="number" value={minWithdrawal} onChange={(e) => setMinWithdrawal(e.target.value)} />
        </div>
        <div>
          <label className="label">Default referral reward (points)</label>
          <input className="input" type="number" value={referralReward} onChange={(e) => setReferralReward(e.target.value)} />
        </div>
        <div>
          <label className="label">Default task reward (points)</label>
          <input className="input" type="number" value={taskReward} onChange={(e) => setTaskReward(e.target.value)} />
        </div>
        <div>
          <label className="label">Platform announcement (shown to all users)</label>
          <textarea className="input" rows={3} value={announcement} onChange={(e) => setAnnouncement(e.target.value)} placeholder="Optional banner message…" />
        </div>
        <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</button>
      </form>
    </div>
  );
}
