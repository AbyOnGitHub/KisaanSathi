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

// Demo Session Management (Ensures 1-Click Demo & Sample Login work seamlessly even before Supabase is connected)
const DEMO_SESSION_KEY = 'kisaansathi_demo_session';

export const setDemoSession = (role = 'farmer') => {
  const uuidMap = {
    farmer: 'cda94955-d450-4a73-b008-a57918300593',
    seller: 'af05ddfd-105c-4e97-8c8b-0ab1fa1133fb',
    admin: 'ddfb1ae0-aa38-45a8-99b2-6884985b9e5e'
  };
  const demoSession = {
    user: {
      id: uuidMap[role] || '00000000-0000-0000-0000-000000000000',
      email: `demo.${role}@kisaansathi.org`,
      user_metadata: {
        full_name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      },
    },
    role,
    is_verified: true,
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoSession));
  return demoSession;
};

export const getDemoSession = () => {
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearDemoSession = () => {
  localStorage.removeItem(DEMO_SESSION_KEY);
};
