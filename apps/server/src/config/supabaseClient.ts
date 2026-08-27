import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// We use the Service Role Key here to bypass Row Level Security (RLS) on the backend
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);