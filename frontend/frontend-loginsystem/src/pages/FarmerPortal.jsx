import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CropYieldPage from '../components/CropYield/CropYieldPage';
import { supabase } from '../lib/supabase';
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      navigate('/login');
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="app-container">
      <Navbar
        onLogout={handleLogout}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      <main className="main-content">
        <CropYieldPage t={t} />
      </main>

      <Footer t={t} />
    </div>
  );
}
