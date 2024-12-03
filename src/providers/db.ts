import { env } from '@/providers';
import { Database } from '@/types';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

function setupDb() {
  db = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
}

let db: SupabaseClient<Database>;

export { db, setupDb };
