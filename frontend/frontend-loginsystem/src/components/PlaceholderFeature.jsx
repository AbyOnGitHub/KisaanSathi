import React from 'react';
import { Clock, ArrowLeft, TrendingUp } from 'lucide-react';

export default function PlaceholderFeature({ title, description, onNavigate }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', maxWidth: '650px', margin: '2rem auto' }}>
      <div style={{ display: 'inline-flex', padding: '1rem', background: '#f3f4f6', borderRadius: '50%', marginBottom: '1.25rem' }}>
        <Clock size={40} color="#4b5563" />
      </div>
      <span className="badge" style={{ display: 'inline-block', marginBottom: '1rem', fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
        Under Development
      </span>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
        {title}
      </h2>
      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
        {description}
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-outline" onClick={() => onNavigate('home')}>
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </button>
        <button className="btn btn-primary" onClick={() => onNavigate('yield')}>
          <TrendingUp size={18} />
          <span>Try Crop Yield Prediction</span>
        </button>
      </div>
    </div>
  );
}
