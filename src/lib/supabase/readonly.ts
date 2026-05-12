import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

function publicSupabaseUrl(): string | undefined {
  const v = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  return v || undefined;
}

function publicSupabaseAnonKey(): string | undefined {
  const v = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return v || undefined;
}

/** True when both public URL and anon key are set (e.g. in `.env.local`). */
export function isSupabaseConfigured(): boolean {
  return Boolean(publicSupabaseUrl() && publicSupabaseAnonKey());
}

/**
 * A cookie-free Supabase client for use inside `use cache` scopes.
 * Safe for read-only queries against public/anon-accessible tables.
 * Returns `null` if env vars are missing so pages can render without crashing.
 */
export function createReadonlyClient(): SupabaseClient<Database> | null {
  const url = publicSupabaseUrl();
  const key = publicSupabaseAnonKey();
  if (!url || !key) return null;
  return createSupabaseClient<Database>(url, key);
}
