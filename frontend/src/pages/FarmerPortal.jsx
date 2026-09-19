import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CropYieldPage from '../components/CropYield/CropYieldPage';
import { supabase } from '../lib/supabase';

export default function FarmerPortal() {
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
      <Navbar onLogout={handleLogout} />

      <main className="main-content">
        <CropYieldPage />
      </main>

      <Footer />
    </div>
  );
}
