import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Profile } from '@/types';

interface AuthContextValue {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, referralCode?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Demo profile used only when no Supabase project is connected, so the
// dashboard can be previewed end-to-end without a backend.
const DEMO_PROFILE: Profile = {
  id: 'demo-user',
  full_name: 'Demo User',
  email: 'demo@earnlearn.pk',
  avatar_url: null,
  city: 'Karachi',
  skills: ['Content Writing', 'Canva Design'],
  referral_code: 'ELP-DEMO01',
  referred_by: null,
  points_balance: 1250,
  account_status: 'active',
  is_admin: false,
  hide_from_leaderboard: false,
  created_at: '2026-07-01T00:00:00Z',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextValue['user']>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Demo mode: no persisted session, dashboard routes still work with
      // sample data so the UI/UX can be reviewed pre-integration.
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const sUser = data.session?.user;
      if (sUser) {
        setUser({ id: sUser.id, email: sUser.email ?? '' });
        fetchProfile(sUser.id);
      } else {
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const sUser = session?.user;
      if (sUser) {
        setUser({ id: sUser.id, email: sUser.email ?? '' });
        fetchProfile(sUser.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!error && data) setProfile(data as Profile);
    setLoading(false);
  }

  async function signUp(email: string, password: string, fullName: string, referralCode?: string) {
    if (!isSupabaseConfigured) return { error: 'Connect Supabase to enable real sign-up (see README).' };
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, referred_by_code: referralCode ?? null } },
    });
    if (error) return { error: error.message };
    if (data.user) {
      // The `profiles` row is created automatically by the
      // `handle_new_user` trigger defined in supabase/schema.sql.
    }
    return { error: null };
  }

  async function signIn(email: string, password: string) {
    if (!isSupabaseConfigured) return { error: 'Connect Supabase to enable real login (see README).' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  }

  async function signOut() {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  async function requestPasswordReset(email: string) {
    if (!isSupabaseConfigured) return { error: 'Connect Supabase to enable password reset (see README).' };
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error: error ? error.message : null };
  }

  // In demo mode, expose a read-only demo profile so dashboard pages render.
  const effectiveProfile = isSupabaseConfigured ? profile : DEMO_PROFILE;
  const effectiveUser = isSupabaseConfigured ? user : { id: 'demo-user', email: 'demo@earnlearn.pk' };

  return (
    <AuthContext.Provider value={{
      user: effectiveUser, profile: effectiveProfile, loading,
      signUp, signIn, signOut, requestPasswordReset,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
