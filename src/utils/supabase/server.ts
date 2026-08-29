import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function createServerClient() {
  return createClient(supabaseUrl, supabaseKey);
}

export function createAdminClient() {
  if (!serviceRoleKey) {
    console.warn("[supabase] SUPABASE_SERVICE_ROLE_KEY not set, using anon key");
    return createClient(supabaseUrl, supabaseKey);
  }
  return createClient(supabaseUrl, serviceRoleKey);
}
