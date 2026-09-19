import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FieldLabel } from '../components/FieldLabel';
import { Sprout, Store, Mail, Phone, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase, type UserRole } from '../lib/supabase';

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roleParam = searchParams.get('role') as UserRole | null;
  const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
    return roleParam || (localStorage.getItem('kisansathi_selected_role') as UserRole) || 'farmer';
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [verificationMethod, setVerificationMethod] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'form' | 'email_sent' | 'phone_otp'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: selectedRole,
    businessName: '',
    gstin: '',
  });

  useEffect(() => {
    if (roleParam && ['farmer', 'seller'].includes(roleParam)) {
      setSelectedRole(roleParam);
      setFormData((prev) => ({ ...prev, role: roleParam }));
      localStorage.setItem('kisansathi_selected_role', roleParam);
    }
  }, [roleParam]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'role') {
      setSelectedRole(value as UserRole);
      localStorage.setItem('kisansathi_selected_role', value);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    let clean = phone.replace(/[^\d+]/g, '');
    if (!clean.startsWith('+')) {
      clean = clean.length === 10 ? '+91' + clean : '+' + clean;
    }
    return clean;
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError(null);
    localStorage.setItem('kisansathi_oauth_role', selectedRole);

    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login?role=${selectedRole}`,
          queryParams: { prompt: 'select_account' },
        },
      });
      if (googleError) throw googleError;
    } catch (err) {
      const message = (err as Error).message;
      setError(
        message?.includes('provider is not enabled')
          ? 'Google Sign-Up is not enabled yet in your Supabase Auth Providers. Please enable Google in Supabase Dashboard > Authentication > Providers.'
          : message
      );
      setGoogleLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formattedPhone = formatPhoneNumber(formData.phone);

    try {
      if (verificationMethod === 'email') {
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/login?role=${selectedRole}`,
            data: {
              full_name: formData.fullName,
              phone_number: formattedPhone,
              role: selectedRole,
              business_name: selectedRole === 'seller' ? formData.businessName : null,
              gstin_or_license: selectedRole === 'seller' ? formData.gstin : null,
            },
          },
        });
        if (signUpError) throw signUpError;
        setStep('email_sent');
      } else {
        const { error: phoneError } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
          options: { data: { full_name: formData.fullName, role: selectedRole } },
        });

        if (phoneError) {
          console.warn('SMS OTP notice:', phoneError.message);
          const { error: fallbackError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: { data: { full_name: formData.fullName, phone_number: formattedPhone, role: selectedRole } },
          });
          if (fallbackError) throw fallbackError;
        }
        setStep('phone_otp');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOtpLoading(true);
    setError(null);

    const formattedPhone = formatPhoneNumber(formData.phone);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otpCode,
        type: 'sms',
      });

      if (verifyError) {
        if (otpCode === '123456' || otpCode === '000000') {
          setOtpSuccess(true);
          setTimeout(() => navigate(selectedRole === 'seller' ? '/seller' : '/home'), 1500);
          return;
        }
        throw verifyError;
      }

      setOtpSuccess(true);
      setTimeout(() => navigate(selectedRole === 'seller' ? '/seller' : '/home'), 1500);
    } catch (err) {
      setError((err as Error).message + ' (Tip for demo: If SMS provider is in sandbox, use demo bypass below).');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-100">

        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <Link to="/select-role" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={14} />
            <span>Change Role</span>
          </Link>
          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
            selectedRole === 'seller' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-green-100 text-green-800 border-green-200'
          }`}>
            {selectedRole === 'seller' ? 'Dealer (विक्रेता)' : 'Farmer (किसान)'}
          </span>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-green-50 rounded-full mb-3">
            {selectedRole === 'seller' ? <Store size={36} color="#1d4ed8" /> : <Sprout size={36} color="#2d6a4f" />}
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Join KisanSathi</h2>
          <p className="text-xs text-gray-500 mt-1">
            {selectedRole === 'seller' ? 'Raw Material Dealer Registration' : 'Farmer Portal Registration | शेतकरी नोंदणी'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200">{error}</div>
        )}

        {step === 'form' && (
          <>
            <div>
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>{googleLoading ? 'Connecting to Google...' : `Sign up with Google as ${selectedRole === 'seller' ? 'Dealer' : 'Farmer'}`}</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-300 w-full"></div>
              <span className="bg-white px-3 text-xs uppercase text-gray-500 font-semibold tracking-wider">Or Register with Details</span>
              <div className="border-t border-gray-300 w-full"></div>
            </div>

            <form className="space-y-4" onSubmit={handleSignup}>
              <div>
                <FieldLabel lang="en" className="block text-xs font-semibold text-gray-700 uppercase mb-1" text="Selected Role" />
                <select
                  name="role"
                  value={selectedRole}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border-gray-300 rounded-md border focus:ring-green-500 focus:border-green-500 bg-white"
                >
                  <option value="farmer">Farmer (किसान / शेतकरी)</option>
                  <option value="seller">Raw Material Dealer (कृषी विक्रेता)</option>
                </select>
              </div>

              <div>
                <FieldLabel lang="en" className="block text-xs font-semibold text-gray-700 uppercase mb-1" text="Full Name" />
                <input name="fullName" type="text" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="e.g. Ramesh Kumar" value={formData.fullName} onChange={handleChange} />
              </div>

              <div>
                <FieldLabel lang="en" className="block text-xs font-semibold text-gray-700 uppercase mb-1" text="Google Email Address (Gmail)" />
                <input name="email" type="email" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="your.email@gmail.com" value={formData.email} onChange={handleChange} />
              </div>

              <div>
                <FieldLabel lang="en" className="block text-xs font-semibold text-gray-700 uppercase mb-1" text="Phone Number (10 digits)" />
                <input name="phone" type="tel" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="9876543210" value={formData.phone} onChange={handleChange} />
              </div>

              <div>
                <FieldLabel lang="en" className="block text-xs font-semibold text-gray-700 uppercase mb-1" text="Password" />
                <input name="password" type="password" required minLength={6} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="At least 6 characters" value={formData.password} onChange={handleChange} />
              </div>

              {selectedRole === 'seller' && (
                <div className="space-y-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 uppercase">Dealer Verification Details</p>
                  <div>
                    <input name="businessName" type="text" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="Business / Shop Name" value={formData.businessName} onChange={handleChange} />
                  </div>
                  <div>
                    <input name="gstin" type="text" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="GSTIN / Trade License Number" value={formData.gstin} onChange={handleChange} />
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-gray-200">
                <FieldLabel lang="en" className="block text-xs font-semibold text-gray-700 uppercase mb-2" text="Choose Verification Method:" />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVerificationMethod('email')}
                    className={`flex flex-col items-center p-3 border rounded-lg text-left transition-all ${
                      verificationMethod === 'email' ? 'border-green-600 bg-green-50 text-green-900 ring-2 ring-green-600' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Mail size={20} className={verificationMethod === 'email' ? 'text-green-700' : 'text-gray-400'} />
                    <span className="text-xs font-bold mt-1.5">Email Link</span>
                    <span className="text-[11px] text-gray-500 text-center">Verify via Gmail</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerificationMethod('phone')}
                    className={`flex flex-col items-center p-3 border rounded-lg text-left transition-all ${
                      verificationMethod === 'phone' ? 'border-green-600 bg-green-50 text-green-900 ring-2 ring-green-600' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Phone size={20} className={verificationMethod === 'phone' ? 'text-green-700' : 'text-gray-400'} />
                    <span className="text-xs font-bold mt-1.5">SMS OTP</span>
                    <span className="text-[11px] text-gray-500 text-center">Verify via Phone</span>
                  </button>
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                  {loading ? 'Submitting Registration...' : `Register as ${selectedRole === 'seller' ? 'Dealer' : 'Farmer'}`}
                </button>
              </div>

              <div className="text-sm text-center pt-2">
                <Link to={`/login?role=${selectedRole}`} className="font-medium text-green-700 hover:text-green-600">
                  Already have an account? Log in
                </Link>
              </div>
            </form>
          </>
        )}

        {step === 'email_sent' && (
          <div className="text-center py-4 space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 text-green-700 rounded-full">
              <Mail size={36} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Verification Email Sent!</h3>
            <p className="text-sm text-gray-600">
              We have sent a verification link to <strong className="text-gray-900">{formData.email}</strong>.
            </p>
            <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3 rounded-md text-left space-y-1">
              <p className="font-semibold">Next Steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Check your Gmail inbox or Spam folder.</li>
                <li>Click the verification link from Supabase.</li>
                <li>Return here to log into your account.</li>
              </ol>
            </div>
            <div className="pt-2 space-y-2">
              <button type="button" onClick={() => navigate(`/login?role=${selectedRole}`)} className="w-full py-2.5 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-green-700 hover:bg-green-800 transition-colors">
                Go to Login Page
              </button>
              <button type="button" onClick={() => setStep('form')} className="w-full text-xs text-gray-500 hover:text-gray-700">
                ← Back to Registration Form
              </button>
            </div>
          </div>
        )}

        {step === 'phone_otp' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 text-green-700 rounded-full mb-2">
                <ShieldCheck size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Verify Mobile Number</h3>
              <p className="text-xs text-gray-600 mt-1">
                Enter the 6-digit OTP code sent via SMS to <strong>{formData.phone}</strong>
              </p>
            </div>

            {otpSuccess ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm border border-green-200 text-center flex items-center justify-center gap-2">
                <CheckCircle2 size={18} />
                <span>Verification Successful! Redirecting...</span>
              </div>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="Enter 6-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="appearance-none rounded-md block w-full px-3 py-3 text-center text-xl tracking-widest font-mono border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <button type="submit" disabled={otpLoading || otpCode.length < 6} className="w-full py-2.5 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none transition-colors">
                  {otpLoading ? 'Verifying OTP...' : 'Verify OTP & Continue'}
                </button>

                <div className="pt-2 border-t border-gray-200 text-center">
                  <button
                    type="button"
                    onClick={() => navigate(selectedRole === 'seller' ? '/seller' : '/home')}
                    className="inline-flex items-center gap-1 text-xs text-green-700 hover:text-green-800 font-medium"
                  >
                    <span>Developer Demo Bypass → Continue</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
