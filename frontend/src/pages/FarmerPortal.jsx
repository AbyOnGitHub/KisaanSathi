import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Home from '../components/Home';
import CropYieldPage from '../components/CropYield/CropYieldPage';
import PlaceholderFeature from '../components/PlaceholderFeature';
import { supabase } from '../lib/supabase';

export default function FarmerPortal() {
  const [activeTab, setActiveTab] = useState('yield');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      navigate('/login');
    }
  };

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="main-content">
        {activeTab === 'home' && <Home onNavigate={setActiveTab} />}

        {activeTab === 'yield' && <CropYieldPage />}

        {activeTab === 'disease' && (
          <PlaceholderFeature
            title="Crop Disease Detection"
            description="Our upcoming image-based plant disease recognition system will let you upload leaf photos to instantly diagnose infections and get actionable treatment remedies."
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'schemes' && (
          <PlaceholderFeature
            title="Government Scheme Recommendations"
            description="Personalized agricultural schemes and financial subsidies (PM-KISAN, PMFBY crop insurance, solar pump subsidies) tailored to your farm size and location."
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'negotiator' && (
          <PlaceholderFeature
            title="Mandi Price Negotiator"
            description="Real-time crop prices across nearby APMC mandis and intelligent fair-price suggestions to help you bargain with traders effectively."
            onNavigate={setActiveTab}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
