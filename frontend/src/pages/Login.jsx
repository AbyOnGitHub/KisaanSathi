import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
        
      if (profileError) throw profileError;

      // Role-based routing: Farmers go directly to Crop Yield Prediction
      if (profile.role === 'admin') {
        navigate('/admin');
      } else if (profile.role === 'seller') {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-green-50 rounded-full mb-3">
            <Sprout size={36} color="#2d6a4f" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Log in to KisaanSathi
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Farmer Portal | किसान साथी
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="farmer@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Password</label>
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
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
          
          <div className="text-sm text-center pt-2">
            <Link to="/signup" className="font-medium text-green-700 hover:text-green-600">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>

        {/* Guest access option for evaluator / demonstration */}
        <div className="pt-4 border-t border-gray-200 text-center">
          <button
            type="button"
            onClick={() => navigate('/crop-yield')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-800 hover:text-green-900 bg-green-50 hover:bg-green-100 py-2 px-4 rounded-md transition-colors w-full justify-center"
          >
            <span>Continue to Crop Yield Prediction</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
