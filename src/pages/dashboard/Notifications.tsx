import { useEffect, useState } from 'react';
import { Bell, Briefcase, ListChecks, Wallet, Users, GraduationCap, Megaphone } from 'lucide-react';
import { DEMO_NOTIFICATIONS } from '@/data/demoData';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { AppNotification, NotificationType } from '@/types';

const icons: Record<NotificationType, any> = {
  new_task: ListChecks, new_opportunity: Briefcase, reward_approved: Wallet,
  withdrawal_status: Wallet, referral_reward: Users, new_course: GraduationCap,
  admin_announcement: Megaphone,
};

export function Notifications() {
  const { user } = useAuth();
  const [items, setItems] = useState<AppNotification[]>(isSupabaseConfigured ? [] : DEMO_NOTIFICATIONS);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured || !user) {
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) {
        console.error('[Notifications] load failed:', error.message);
        setItems([]);
      } else {
        setItems((data ?? []) as AppNotification[]);
      }
      setLoading(false);
    })();
  }, [user]);

  async function markRead(id: string) {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    if (isSupabaseConfigured && user) {
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id).eq('user_id', user.id);
      if (error) console.error('[Notifications] mark read failed:', error.message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-navy-900">Notifications</h1>
        <p className="text-sm text-navy-500">Stay up to date with tasks, rewards, and referrals.</p>
      </div>

      {loading ? (
        <div className="card p-6 text-sm text-navy-500">Loading notifications…</div>
      ) : items.length === 0 ? (
        <EmptyState icon={<Bell size={22} />} title="No notifications yet" description="You'll see updates about tasks, rewards, and more here." />
      ) : (
        <div className="card divide-y divide-navy-100">
          {items.map((n) => {
            const Icon = icons[n.type] ?? Bell;
            return (
              <button
                key={n.id} onClick={() => markRead(n.id)}
                className={`flex w-full gap-3 p-4 text-left ${!n.is_read ? 'bg-brand-blue/5' : ''}`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-100 text-navy-500">
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy-900">{n.title}</p>
                  <p className="text-sm text-navy-500">{n.message}</p>
                  <p className="mt-1 text-xs text-navy-400">{new Date(n.created_at).toLocaleDateString()}</p>
                </div>
                {!n.is_read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-blue" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
