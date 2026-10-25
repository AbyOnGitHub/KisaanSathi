import { useNavigate } from 'react-router-dom';
import { Sprout, Store, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import type { UserRole } from '../lib/supabase';

export default function RoleSelect() {
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole) => {
    localStorage.setItem('kisansathi_selected_role', role);
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50/50 via-gray-50 to-emerald-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3.5 bg-green-100/80 rounded-2xl shadow-sm mb-2">
            <Sprout size={40} className="text-green-800" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            KisanSathi <span className="text-green-700 font-semibold text-2xl sm:text-3xl">| किसान साथी</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
            Welcome to the Smart Agricultural Ecosystem. Please select your role to proceed to the portal.
          </p>
          <p className="text-xs text-green-800 font-medium">
            कृपया पुढे जाण्यासाठी तुमची भूमिका निवडा • कृपया आगे बढ़ने के लिए अपनी भूमिका चुनें
          </p>
        </div>

        {/* Role Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

          {/* Card 1: Farmer */}
          <div
            onClick={() => handleSelectRole('farmer')}
            className="group relative bg-white border-2 border-green-200 hover:border-green-600 rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-green-100 text-green-800 rounded-xl group-hover:bg-green-700 group-hover:text-white transition-colors">
                  <Sprout size={32} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                  Primary Role
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-800 transition-colors">
                  Farmer (शेतकरी / किसान)
                </h3>
                <p className="text-xs font-semibold text-green-700 mt-0.5">
                  Agricultural Producer & Cultivator
                </p>
                <p className="text-sm text-gray-600 mt-2.5 leading-relaxed">
                  Discover government schemes suited to your farm, get help understanding benefits, and apply with step-by-step, voice-assisted guidance.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-600" />
                  <span>AI-matched scheme recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-600" />
                  <span>Multilingual (English, हिन्दी, मराठी)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-600" />
                  <span>Guided application & review</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-colors text-sm"
              >
                <span>Login as Farmer</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Card 2: Raw Material Dealer / Seller */}
          <div
            onClick={() => handleSelectRole('seller')}
            className="group relative bg-white border-2 border-blue-200 hover:border-blue-600 rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-blue-100 text-blue-800 rounded-xl group-hover:bg-blue-700 group-hover:text-white transition-colors">
                  <Store size={32} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                  Marketplace
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-800 transition-colors">
                  Raw Material Dealer (विक्रेता)
                </h3>
                <p className="text-xs font-semibold text-blue-700 mt-0.5">
                  Agricultural Inputs & Equipment Supplier
                </p>
                <p className="text-sm text-gray-600 mt-2.5 leading-relaxed">
                  Provide certified seeds, fertilizers, organic nutrients, machinery, and farm inputs directly to verified farmers.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-blue-600" />
                  <span>Verified Dealer Business Profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-blue-600" />
                  <span>GSTIN & Trade License Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-blue-600" />
                  <span>Direct Farmer Inquiries</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-colors text-sm"
              >
                <span>Login as Dealer</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* Footer info & Admin link */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3 border-t border-gray-200/80">
          <p>© 2026 KisanSathi. Dedicated to empowering Indian Agriculture.</p>
          <button
            type="button"
            onClick={() => handleSelectRole('admin')}
            className="inline-flex items-center gap-1.5 text-purple-700 hover:text-purple-900 font-medium transition-colors"
          >
            <Shield size={14} />
            <span>Administrator Login</span>
          </button>
        </div>

      </div>
    </div>
  );
}
