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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextValue['user']>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('[Auth] profile fetch failed:', error.message);
      setProfile(null);
    } else if (data) {
      setProfile(data as Profile);
    } else {
      setProfile(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const u = data.session?.user;
      if (u) {
        setUser({ id: u.id, email: u.email ?? '' });
        void fetchProfile(u.id);
      } else {
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      if (u) {
        setUser({ id: u.id, email: u.email ?? '' });
        // Supabase warns against making async Supabase calls directly inside
        // onAuthStateChange because it can deadlock the client. Defer the
        // profile query so the auth event can finish first.
        window.setTimeout(() => {
          if (active) void fetchProfile(u.id);
        }, 0);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signUp(email: string, password: string, fullName: string, referralCode?: string) {
    if (!isSupabaseConfigured) return { error: 'Connect Supabase to enable real sign-up.' };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, referred_by_code: referralCode ?? null } },
    });
    return { error: error ? error.message : null };
  }

  async function signIn(email: string, password: string) {
    if (!isSupabaseConfigured) return { error: 'Connect Supabase to enable real login.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  }

  async function signOut() {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  async function requestPasswordReset(email: string) {
    if (!isSupabaseConfigured) return { error: 'Connect Supabase to enable password reset.' };
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error: error ? error.message : null };
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, requestPasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
