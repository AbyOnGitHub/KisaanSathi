import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Globe, Sprout } from 'lucide-react';
import CropYieldPage from '../components/CropYield/CropYieldPage';
import { translations } from '../translations';

export default function FarmerPortal() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('kisaansathi_lang') || 'en';
  });

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('kisaansathi_lang', newLang);
  };

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'hi', label: 'हिन्दी', short: 'HI' },
    { code: 'mr', label: 'मराठी', short: 'MR' },
  ];

  const t = translations[language] || translations.en;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Farmer Portal Header Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg border border-green-200 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Marketplace</span>
          </Link>
          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 text-green-700 rounded-lg">
              <Sprout size={20} />
            </div>
            <div>
              <h2 className="text-lg font-oswald font-bold text-gray-900 leading-tight">
                Farmer Advisory Dashboard
              </h2>
              <p className="text-xs text-gray-500 font-work-sans">
                {language === 'hi' ? 'किसान सहायता एवं उत्पादन अनुमान' : language === 'mr' ? 'शेतकरी सल्ला आणि उत्पादन अंदाज' : 'AI-driven agricultural advisory & crop yield estimation'}
              </p>
            </div>
          </div>
        </div>

        {/* Multilingual Selector */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <Globe size={16} className="text-gray-400" />
          <div className="inline-flex rounded-lg bg-gray-100 p-0.5 border border-gray-200">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  language === lang.code
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {lang.short}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Yield Prediction Form & Analytics Section */}
      <div className="bg-transparent">
        <CropYieldPage t={t} />
      </div>
    </div>
  );
}
