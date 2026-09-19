import React from 'react';
import { Sprout, TrendingUp, LogOut, Globe } from 'lucide-react';

export default function Navbar({ onLogout, language = 'en', onLanguageChange }) {
  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'hi', label: 'हिन्दी', short: 'HI' },
    { code: 'mr', label: 'मराठी', short: 'MR' },
  ];

  const titles = {
    en: { brand: 'KisaanSathi', sub: 'Farmer Portal', yieldNav: 'Crop Yield Prediction', logout: 'Logout' },
    hi: { brand: 'किसान साथी', sub: 'किसान पोर्टल', yieldNav: 'फसल उत्पादन अनुमान', logout: 'लॉग आउट' },
    mr: { brand: 'किसान साथी', sub: 'शेतकरी पोर्टल', yieldNav: 'पीक उत्पादन अंदाज', logout: 'लॉग आउट' },
  };

  const t = titles[language] || titles.en;

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Sprout size={28} color="#2d6a4f" />
          <span>{t.brand}</span>
          <span className="nav-brand-hindi">({t.sub})</span>
        </div>

        <nav>
          <ul className="nav-links">
            <li>
              <div
                className="nav-btn active"
                style={{ cursor: 'default' }}
              >
                <TrendingUp size={18} />
                <span>{t.yieldNav}</span>
              </div>
            </li>

            {/* Language Selector */}
            <li>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  padding: '2px 4px',
                  border: '1px solid #e5e7eb',
                  gap: '2px',
                }}
              >
                <Globe size={16} color="#4b5563" style={{ marginLeft: '4px', marginRight: '2px' }} />
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => onLanguageChange && onLanguageChange(lang.code)}
                    title={`Switch language to ${lang.label}`}
                    style={{
                      border: 'none',
                      background: language === lang.code ? '#2d6a4f' : 'transparent',
                      color: language === lang.code ? '#ffffff' : '#374151',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: language === lang.code ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {lang.short}
                  </button>
                ))}
              </div>
            </li>

            {onLogout && (
              <li>
                <button
                  className="nav-btn"
                  onClick={onLogout}
                  title="Sign out of KisaanSathi"
                  style={{ color: '#b91c1c' }}
                >
                  <LogOut size={18} />
                  <span>{t.logout}</span>
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
