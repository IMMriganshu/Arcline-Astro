import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Retrieve Supabase environment variables
export const getSupabaseConfig = () => {
  // Support both Astro public env vars and Vite env vars
  const url =
    (import.meta.env.PUBLIC_SUPABASE_URL as string) ||
    (typeof process !== 'undefined' ? process.env.PUBLIC_SUPABASE_URL : '') ||
    '';
  const anonKey =
    (import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string) ||
    (typeof process !== 'undefined' ? process.env.PUBLIC_SUPABASE_ANON_KEY : '') ||
    '';

  const isConfigured = Boolean(url && anonKey && url.startsWith('http'));
  return { url, anonKey, isConfigured };
};

let cachedClient: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (cachedClient) return cachedClient;

  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) {
    return null;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return cachedClient;
  } catch (err) {
    console.warn('[CMS] Failed to initialize Supabase client:', err);
    return null;
  }
};
