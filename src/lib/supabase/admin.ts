import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/** Supabase client with service role — use only on the server (never expose the key). */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY (and URL) for admin auth. Set it in .env.local and on Vercel.",
    );
  }
  return createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
