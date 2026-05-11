import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * A cookie-free Supabase client for use inside `use cache` scopes.
 * Safe for read-only queries against public/anon-accessible tables.
 */
export function createReadonlyClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
