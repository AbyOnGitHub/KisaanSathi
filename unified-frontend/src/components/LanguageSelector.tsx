import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../context/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const options: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' },
  ];

  return (
    <div className="flex gap-1 bg-white rounded-full border border-green-200 p-1 shadow-sm">
      {options.map(opt => (
        <button
          key={opt.code}
          onClick={() => setLanguage(opt.code)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            language === opt.code
              ? 'bg-green-600 text-white shadow'
              : 'text-green-700 hover:bg-green-50'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
