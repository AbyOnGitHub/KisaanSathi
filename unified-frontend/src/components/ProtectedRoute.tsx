import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { supabase, type Profile, type UserRole } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  /** Show a small fixed logout button over the page. Defaults to true. */
  showLogout?: boolean;
}

export default function ProtectedRoute({ children, allowedRoles, showLogout = true }: ProtectedRouteProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/select-role';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // Basic redirect if they try to access a route outside their role
    if (profile.role === 'admin') return <Navigate to="/admin" replace />;
    if (profile.role === 'seller') return <Navigate to="/seller" replace />;
    return <Navigate to="/home" replace />;
  }

  return (
    <>
      {showLogout && (
        <button
          type="button"
          onClick={handleLogout}
          title="Log out"
          className="fixed top-3 right-3 z-50 inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white/90 backdrop-blur border border-gray-200 shadow-sm hover:bg-red-50 hover:text-red-700 hover:border-red-200 px-3 py-1.5 rounded-full transition-colors"
        >
          <LogOut size={13} />
          <span>Logout</span>
        </button>
      )}
      {children}
    </>
  );
}
