import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Sprout, Store, Shield, ArrowRight, Sparkles, KeyRound, ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured, setDemoSession } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Selected role: 'farmer' (default), 'seller', or 'admin'
  const roleParam = searchParams.get('role');
  const [selectedRole, setSelectedRole] = useState(() => {
    return roleParam || localStorage.getItem('kisaansathi_selected_role') || 'farmer';
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoMsg, setInfoMsg] = useState(null);
  const [showResendLink, setShowResendLink] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Keep state & localStorage in sync if URL param changes
  useEffect(() => {
    if (roleParam && ['farmer', 'seller', 'admin'].includes(roleParam)) {
      setSelectedRole(roleParam);
      localStorage.setItem('kisaansathi_selected_role', roleParam);
    }
  }, [roleParam]);

  // Handle Google OAuth callback if returning with session
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const checkOAuthSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const targetRole = localStorage.getItem('kisaansathi_oauth_role') || selectedRole;
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, is_verified')
            .eq('id', session.user.id)
            .maybeSingle();

          if (!profile) {
            await supabase.from('profiles').insert([
              {
                id: session.user.id,
                role: targetRole,
                full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                phone_number: session.user.phone || null,
                is_verified: targetRole === 'farmer',
              }
            ]);
          }

          const finalRole = profile?.role || targetRole;
          localStorage.removeItem('kisaansathi_oauth_role');

          if (finalRole === 'admin') {
            navigate('/admin');
          } else if (finalRole === 'seller') {
            navigate(profile?.is_verified === false ? '/pending-verification' : '/seller');
          } else {
            navigate('/crop-yield');
          }
        }
      } catch (err) {
        console.error('OAuth session verification error:', err);
      }
    };

    checkOAuthSession();
  }, [navigate, selectedRole]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfoMsg(null);
    setShowResendLink(false);

    const email = formData.email.trim().toLowerCase();
    const isDemoAccount = email.startsWith('demo.') && email.endsWith('@kisaansathi.org');

    // 1. DEVELOPER / SAMPLE DEMO ACCOUNT (For viva/presentation only)
    if (isDemoAccount) {
      setDemoSession(selectedRole);
      setLoading(false);
      if (selectedRole === 'seller') {
        navigate('/seller');
      } else if (selectedRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/crop-yield');
      }
      return;
    }

    // 2. REGULAR USER: Strict requirement ("without verified signup, the user cannot login")
    if (!isSupabaseConfigured) {
      setLoading(false);
      setError(
        '⚠️ Supabase database connection is not configured in frontend/.env. Live accounts cannot be checked.'
      );
      return;
    }

    // Attempt real authentication against Supabase
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        if (signInError.message?.toLowerCase().includes('email not confirmed')) {
          setShowResendLink(true);
          throw new Error(
            'Email verification required: Your email address has not been verified yet. Please click the verification link sent to your inbox before logging in.'
          );
        }

        throw new Error(
          'Invalid credentials or account does not exist. Without signing up first, a user cannot log in. Please click "Sign up" below to register.'
        );
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_verified')
        .eq('id', data.user.id)
        .maybeSingle();

      const userRole = profile?.role || selectedRole;

      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'seller') {
        if (profile && !profile.is_verified) {
          navigate('/pending-verification');
        } else {
          navigate('/seller');
        }
      } else {
        navigate('/crop-yield');
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Resend Verification Email from Login Screen
  const handleResendFromLogin = async () => {
    if (!formData.email) {
      setError('Please enter your email address above to resend the verification link.');
      return;
    }

    setResendLoading(true);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/login?role=${selectedRole}`,
        },
      });

      if (resendError) throw resendError;
      setInfoMsg('Verification link resent to ' + formData.email + '! Please check your Inbox and Spam folder.');
      setShowResendLink(false);
    } catch (err) {
      setError('Error resending link: ' + err.message);
    } finally {
      setResendLoading(false);
    }
  };

  // Google OAuth Login with validation
  const handleGoogleLogin = async () => {
    setError(null);
    setInfoMsg(null);

    if (!isSupabaseConfigured) {
      setError(
        '⚠️ Google Sign-In requires a live Supabase project. Please set your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env.'
      );
      return;
    }

    setGoogleLoading(true);
    localStorage.setItem('kisaansathi_oauth_role', selectedRole);

    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login?role=${selectedRole}`,
          queryParams: {
            prompt: 'select_account',
          }
        },
      });

      if (googleError) throw googleError;
    } catch (err) {
      setError(
        err.message?.includes('provider is not enabled')
          ? 'Google Sign-In is not enabled yet in your Supabase Auth Providers. Go to Supabase Dashboard > Authentication > Providers > Google, and toggle it ON.'
          : err.message
      );
      setGoogleLoading(false);
    }
  };

  // Auto-fill developer sample credentials based on role
  const handleFillSample = () => {
    setError(null);
    setShowResendLink(false);
    if (selectedRole === 'seller') {
      setFormData({
        email: 'demo.seller@kisaansathi.org',
        password: 'DemoSeller@2025',
      });
      setInfoMsg('Sample Dealer credentials loaded! Click "Log In as Dealer" to enter.');
    } else if (selectedRole === 'admin') {
      setFormData({
        email: 'demo.admin@kisaansathi.org',
        password: 'DemoAdmin@2025',
      });
      setInfoMsg('Sample Admin credentials loaded! Click "Log In as Admin" to enter.');
    } else {
      setFormData({
        email: 'demo.farmer@kisaansathi.org',
        password: 'DemoFarmer@2025',
      });
      setInfoMsg('Sample Farmer credentials loaded! Click "Log In as Farmer" to enter.');
    }
  };

  // 1-Click developer demo bypass based on role
  const handleOneClickDemo = () => {
    setDemoSession(selectedRole);
    if (selectedRole === 'seller') {
      navigate('/seller');
    } else if (selectedRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/crop-yield');
    }
  };

  // Configuration per role
  const roleConfig = {
    farmer: {
      title: 'Farmer Login',
      sub: 'किसान लॉगिन | शेतकरी लॉगिन',
      icon: <Sprout size={34} className="text-green-800" />,
      bgIcon: 'bg-green-50',
      badge: 'Farmer (किसान)',
      badgeColor: 'bg-green-100 text-green-800 border-green-200',
      btnColor: 'bg-green-700 hover:bg-green-800 focus:ring-green-500',
      demoTarget: 'Crop Yield Prediction',
    },
    seller: {
      title: 'Raw Material Dealer Login',
      sub: 'विक्रेता लॉगिन | Dealer Portal',
      icon: <Store size={34} className="text-blue-800" />,
      bgIcon: 'bg-blue-50',
      badge: 'Dealer (विक्रेता)',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      btnColor: 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-500',
      demoTarget: 'Seller Dashboard',
    },
    admin: {
      title: 'Administrator Login',
      sub: 'प्रशासक लॉगिन | Admin Portal',
      icon: <Shield size={34} className="text-purple-800" />,
      bgIcon: 'bg-purple-50',
      badge: 'Admin (प्रशासक)',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      btnColor: 'bg-purple-700 hover:bg-purple-800 focus:ring-purple-500',
      demoTarget: 'Admin Dashboard',
    },
  };

  const config = roleConfig[selectedRole] || roleConfig.farmer;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        
        {/* Change Role Back Link */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <Link
            to="/select-role"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Change Role</span>
          </Link>
          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${config.badgeColor}`}>
            {config.badge}
          </span>
        </div>

        {/* Brand Header */}
        <div className="text-center">
          <div className={`inline-flex items-center justify-center p-3 ${config.bgIcon} rounded-full mb-3`}>
            {config.icon}
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            {config.title}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {config.sub}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3.5 rounded-md text-sm border border-red-200 space-y-2.5">
            <div className="flex items-start gap-2">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>

            {showResendLink && (
              <button
                type="button"
                onClick={handleResendFromLogin}
                disabled={resendLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold transition-colors"
              >
                <RefreshCw size={13} className={resendLoading ? 'animate-spin' : ''} />
                <span>{resendLoading ? 'Resending Link...' : 'Resend Verification Link to ' + formData.email}</span>
              </button>
            )}
          </div>
        )}

        {infoMsg && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm border border-green-200">
            {infoMsg}
          </div>
        )}

        {/* Google OAuth Login Button with Role Preservation */}
        <div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{googleLoading ? 'Connecting to Google...' : `Continue with Google (${config.badge})`}</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="bg-white px-3 text-xs uppercase text-gray-500 font-semibold tracking-wider">
            Or log in with Email
          </span>
          <div className="border-t border-gray-300 w-full"></div>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder={`${selectedRole}@example.com`}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || googleLoading}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-md text-white ${config.btnColor} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
            >
              {loading ? 'Logging in...' : `Log In as ${config.badge}`}
            </button>
          </div>
          
          <div className="text-sm text-center pt-1">
            <Link
              to={`/signup?role=${selectedRole}`}
              className="font-medium text-green-700 hover:text-green-600"
            >
              Don't have an account? Sign up as {config.badge}
            </Link>
          </div>
        </form>

        {/* Developer / Viva Demonstration Section */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-amber-800 flex items-center gap-1">
              <KeyRound size={13} />
              Developer & Demo Access
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleFillSample}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 py-2 px-3 rounded-md transition-colors"
              title="Populate sample login details"
            >
              <Sparkles size={14} className="text-amber-600" />
              <span>Fill Sample Data</span>
            </button>

            <button
              type="button"
              onClick={handleOneClickDemo}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-green-800 bg-green-50 hover:bg-green-100 border border-green-200 py-2 px-3 rounded-md transition-colors"
              title={`Quickly jump straight to ${config.demoTarget}`}
            >
              <span>1-Click Demo</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
