import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pxzikfwejlncbwcrsujv.supabase.co';
const supabaseUrl = rawUrl.replace(/\/+$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4emlrZndlamxuY2J3Y3JzdWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NDc1NzQsImV4cCI6MjEwNTMyMzU3NH0.ltZjZ5KjEVS02VVP_KxENB0QB4XymnC5WGcU8XteJYs';

// Detect if real Supabase credentials are provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder.supabase.co') &&
  !supabaseAnonKey.includes('placeholder') &&
  supabaseUrl.startsWith('https://')
);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase is not configured. To enable live database auth, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env.'
  );
}

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key'
);

// Roles supported by the auth system
export type UserRole = 'farmer' | 'seller' | 'admin';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone_number: string | null;
  is_verified: boolean;
  business_name: string | null;
  gstin_or_license: string | null;
}
