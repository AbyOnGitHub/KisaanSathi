import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoMsg, setInfoMsg] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

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

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      // Fetch the user's profile to determine routing
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_verified')
        .eq('id', data.user.id)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        console.warn('Profile fetch warning:', profileError);
      }

      // Role-based routing: Farmers go directly to Crop Yield Prediction
      if (profile && profile.role === 'admin') {
        navigate('/admin');
      } else if (profile && profile.role === 'seller') {
        if (!profile.is_verified) {
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

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    setInfoMsg(null);

    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/crop-yield`,
        },
      });

      if (googleError) throw googleError;
    } catch (err) {
      setError(
        err.message?.includes('provider is not enabled')
          ? 'Google Sign-In is not enabled yet in your Supabase Auth Providers. Please enable Google in Supabase Dashboard > Authentication > Providers.'
          : err.message
      );
      setGoogleLoading(false);
    }
  };

  // Auto-fill developer sample credentials
  const handleFillSample = () => {
    setFormData({
      email: 'demo.farmer@kisaansathi.org',
      password: 'DemoFarmer@2025',
    });
    setInfoMsg('Sample credentials loaded! Click "Log In" or use "1-Click Developer Demo" below.');
  };

  // 1-Click developer demo bypass to crop yield prediction
  const handleOneClickDemo = () => {
    navigate('/crop-yield');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-green-50 rounded-full mb-3">
            <Sprout size={36} color="#2d6a4f" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Log in to KisaanSathi
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Farmer Portal | किसान साथी | शेतकरी पोर्टल
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200">
            {error}
          </div>
        )}

        {infoMsg && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm border border-green-200">
            {infoMsg}
          </div>
        )}

        {/* Google OAuth Login Button */}
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
            <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
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
                Email Address (Gmail / Email)
              </label>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="farmer@gmail.com"
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
              className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
          
          <div className="text-sm text-center pt-1">
            <Link to="/signup" className="font-medium text-green-700 hover:text-green-600">
              Don't have an account? Sign up
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
              title="Populate sample farmer login details"
            >
              <Sparkles size={14} className="text-amber-600" />
              <span>Fill Sample Data</span>
            </button>

            <button
              type="button"
              onClick={handleOneClickDemo}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-green-800 bg-green-50 hover:bg-green-100 border border-green-200 py-2 px-3 rounded-md transition-colors"
              title="Quickly jump straight to Crop Yield Prediction"
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
