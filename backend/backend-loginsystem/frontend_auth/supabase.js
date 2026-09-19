import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawUrl.replace(/\/+$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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
  const demoSession = {
    user: {
      id: `demo-${role}-id`,
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
