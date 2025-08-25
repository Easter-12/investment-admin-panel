import { createClient } from '@supabase/supabase-js';

// Read the secret variables from Replit's environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a single, exportable Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);