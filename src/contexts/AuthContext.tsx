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
    console.warn('[Auth] No profile found for user:', userId);
    setProfile(null);
  }

  setLoading(false);
}
