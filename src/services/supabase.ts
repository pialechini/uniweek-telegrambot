import { env } from '@/providers';
import { Database } from '@/types';
import { createClient } from '@supabase/supabase-js';

function createSupabaseClient() {
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_KEY);
}

export default createSupabaseClient;
