import { createClient } from '@supabase/supabase-js';

// ── INTEGRATION POINT ────────────────────────────────────────────────────
// Fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file
// (copy .env.example -> .env). See README.md "Supabase setup" for the
// full walkthrough, and /supabase/schema.sql for the table definitions.
// ──────────────────────────────────────────────────────────────────────────

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // The app still runs in "demo mode" using local sample data so the UI
  // can be reviewed before a Supabase project is connected.
  console.warn(
    '[Earn & Learn PK] Supabase env vars are missing — running in demo mode with sample data. ' +
    'See README.md to connect a real Supabase project.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co',
  supabaseAnonKey || 'demo-anon-key'
);
