/**
 * Authentication Context.
 * Listens to active Supabase sessions stored by the teammate's authentication system.
 * Resolves user role and profile from the Supabase 'profiles' table.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShieldAlert, LogIn } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch real profile from Supabase 'profiles' table
  const fetchProfile = async (userId, userMetadata = {}) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data);
      } else {
        // Construct standard profile from Auth metadata if not yet inserted into profiles table
        const fallback = {
          id: userId,
          role: userMetadata.role || 'farmer',
          full_name: userMetadata.full_name || userMetadata.name || 'AgriMart User',
          phone_number: userMetadata.phone_number || '',
          business_name: userMetadata.business_name || null,
          gstin_or_license: userMetadata.gstin_or_license || null,
          avatar_url: userMetadata.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          is_verified: true,
        };
        setProfile(fallback);
      }
    } catch (err) {
      console.error('Error fetching user profile from Supabase:', err);
    }
  };

  useEffect(() => {
    // 1. Check existing session from Supabase client / browser storage
    const initAuth = async () => {
      try {
        const { data: { session: activeSession }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (activeSession?.user) {
          setSession(activeSession);
          setUser(activeSession.user);
          await fetchProfile(activeSession.user.id, activeSession.user.user_metadata);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.warn('Supabase session lookup error:', err);
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 2. Subscribe to auth state changes across browser tabs / teammate login
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          await fetchProfile(currentSession.user.id, currentSession.user.user_metadata);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
    setSession(null);
    setUser(null);
    setProfile(null);
    toast.success('Logged out successfully');
  };

  // Determine role
  const isSeller = profile?.role === 'seller';
  const isFarmer = !isSeller; // Defaults to farmer/buyer

  // If initial auth check is loading, show minimal pulse
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-agri-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-gray-500">Checking AgriMart authentication session...</span>
        </div>
      </div>
    );
  }

  // If no session exists, render a full-page message informing the user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-lg space-y-5">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Authentication Required
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Please log in using the authentication app to access the marketplace.
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-[11px] text-green-900 text-left space-y-1">
            <p className="font-bold flex items-center gap-1">
              <span>🌾</span> AgriMart Single Sign-On
            </p>
            <p className="text-green-800">
              Your Supabase session token from the authentication portal is automatically synchronized. Once logged in there, refresh this window to enter.
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-agri-primary hover:bg-agri-dark text-white font-bold py-2.5 rounded-lg text-xs transition shadow-xs"
          >
            Check Session Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        isFarmer,
        isSeller,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
