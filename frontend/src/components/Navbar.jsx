import React from 'react';
import { Sprout, TrendingUp, ShieldAlert, Landmark, Handshake, Home, LogOut } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onLogout }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => setActiveTab('home')}>
          <Sprout size={28} color="#2d6a4f" />
          <span>KisaanSathi</span>
          <span className="nav-brand-hindi">किसान साथी</span>
        </div>

        <nav>
          <ul className="nav-links">
            <li>
              <button
                className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                <Home size={18} />
                <span>Home</span>
              </button>
            </li>

            <li>
              <button
                className={`nav-btn ${activeTab === 'yield' ? 'active' : ''}`}
                onClick={() => setActiveTab('yield')}
              >
                <TrendingUp size={18} />
                <span>Yield Prediction</span>
              </button>
            </li>

            <li>
              <button
                className={`nav-btn ${activeTab === 'disease' ? 'active' : ''}`}
                onClick={() => setActiveTab('disease')}
              >
                <ShieldAlert size={18} />
                <span>Disease Detection</span>
                <span className="badge">Soon</span>
              </button>
            </li>

            <li>
              <button
                className={`nav-btn ${activeTab === 'schemes' ? 'active' : ''}`}
                onClick={() => setActiveTab('schemes')}
              >
                <Landmark size={18} />
                <span>Schemes</span>
                <span className="badge">Soon</span>
              </button>
            </li>

            <li>
              <button
                className={`nav-btn ${activeTab === 'negotiator' ? 'active' : ''}`}
                onClick={() => setActiveTab('negotiator')}
              >
                <Handshake size={18} />
                <span>Price Negotiator</span>
                <span className="badge">Soon</span>
              </button>
            </li>

            {onLogout && (
              <li>
                <button
                  className="nav-btn"
                  onClick={onLogout}
                  title="Sign out"
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
