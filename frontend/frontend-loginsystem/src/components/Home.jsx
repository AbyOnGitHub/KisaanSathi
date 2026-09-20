import React from 'react';
import { TrendingUp, ShieldAlert, Landmark, Handshake, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home({ onNavigate }) {
  return (
    <div>
      {/* Hero Welcome */}
      <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(to right, #f0fdf4, #ffffff)', borderColor: 'var(--primary-border)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-hover)', marginBottom: '0.5rem' }}>
          Welcome to KisaanSathi <span style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--primary)' }}>(किसान साथी)</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '750px', marginBottom: '1.25rem' }}>
          A unified farmer portal built to help farmers make informed decisions about crop yield, plant health, government schemes, and market negotiations.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => onNavigate('yield')}
          style={{ fontSize: '1.05rem', padding: '0.85rem 1.75rem' }}
        >
          <span>Open Crop Yield Prediction</span>
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Portal Modules Overview */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
        Portal Services
      </h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.95rem' }}>
        Explore available tools and upcoming features designed for your farm.
      </p>

      <div className="grid-features">
        {/* Module 1: Crop Yield Prediction (Active) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--primary)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ background: 'var(--primary-light)', padding: '0.6rem', borderRadius: '8px', display: 'inline-flex' }}>
                <TrendingUp size={24} color="#2d6a4f" />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', background: '#d1fae5', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                Active
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Crop Yield Prediction
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Estimate expected yield (in Q/acre) using rainfall, temperature, fertilizer and soil nutrient (N, P, K) levels.
            </p>
          </div>
          <button
            className="btn btn-outline"
            style={{ width: '100%', borderColor: 'var(--primary)', color: 'var(--primary)' }}
            onClick={() => onNavigate('yield')}
          >
            <span>Estimate Yield</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Module 2: Crop Disease Detection (Placeholder) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: 0.9 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ background: '#f3f4f6', padding: '0.6rem', borderRadius: '8px', display: 'inline-flex' }}>
                <ShieldAlert size={24} color="#6b7280" />
              </div>
              <span className="badge">Coming Soon</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Crop Disease Detection
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Identify crop diseases from plant leaf images and receive immediate organic and chemical remedy recommendations.
            </p>
          </div>
          <button
            className="btn btn-outline"
            style={{ width: '100%' }}
            onClick={() => onNavigate('disease')}
          >
            <span>View Details</span>
          </button>
        </div>

        {/* Module 3: Scheme Recommendation (Placeholder) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: 0.9 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ background: '#f3f4f6', padding: '0.6rem', borderRadius: '8px', display: 'inline-flex' }}>
                <Landmark size={24} color="#6b7280" />
              </div>
              <span className="badge">Coming Soon</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Scheme Recommendation
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Discover central and state government agricultural subsidies, insurance schemes, and financial grants tailored to you.
            </p>
          </div>
          <button
            className="btn btn-outline"
            style={{ width: '100%' }}
            onClick={() => onNavigate('schemes')}
          >
            <span>View Details</span>
          </button>
        </div>

        {/* Module 4: Price Negotiator (Placeholder) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: 0.9 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ background: '#f3f4f6', padding: '0.6rem', borderRadius: '8px', display: 'inline-flex' }}>
                <Handshake size={24} color="#6b7280" />
              </div>
              <span className="badge">Coming Soon</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Price Negotiator
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Compare nearby APMC mandi crop prices and get realistic fair price suggestions before selling your harvest.
            </p>
          </div>
          <button
            className="btn btn-outline"
            style={{ width: '100%' }}
            onClick={() => onNavigate('negotiator')}
          >
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* How It Works Guidance */}
      <div className="card" style={{ marginTop: '2.5rem', backgroundColor: '#fcfdfc' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-hover)', marginBottom: '0.75rem' }}>
          How to Use Crop Yield Prediction
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <CheckCircle2 size={20} color="#2d6a4f" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>1. Enter Farm Data</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Provide rainfall, temperature, fertilizer and soil N-P-K nutrient values.
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <CheckCircle2 size={20} color="#2d6a4f" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>2. Click Predict</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Our backend runs real-time inference using the trained Gradient Boosting model.
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <CheckCircle2 size={20} color="#2d6a4f" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>3. View Yield & Advice</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Get your estimated harvest in quintals per acre (Q/acre) with a clear explanation.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
