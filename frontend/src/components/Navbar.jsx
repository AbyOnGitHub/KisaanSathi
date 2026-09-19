import React from 'react';
import { Sprout, TrendingUp, LogOut } from 'lucide-react';

export default function Navbar({ onLogout }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Sprout size={28} color="#2d6a4f" />
          <span>KisaanSathi</span>
          <span className="nav-brand-hindi">किसान साथी</span>
        </div>

        <nav>
          <ul className="nav-links">
            <li>
              <div
                className="nav-btn active"
                style={{ cursor: 'default' }}
              >
                <TrendingUp size={18} />
                <span>Crop Yield Prediction</span>
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
                  <span>Logout</span>
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
