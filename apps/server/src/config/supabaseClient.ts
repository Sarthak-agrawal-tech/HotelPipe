import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// 1. Force load the .env file FIRST
dotenv.config({ path: path.join(process.cwd(), '.env') });

// 2. Read the keys
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

// 3. Safety check to warn you if it still fails
if (!supabaseUrl || !supabaseKey) {
  console.error('🔥 Missing Supabase credentials! Check your apps/server/.env file.');
}

// 4. Initialize and export
export const supabase = createClient(supabaseUrl, supabaseKey);