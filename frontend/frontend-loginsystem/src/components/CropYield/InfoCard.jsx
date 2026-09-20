import React from 'react';
import { Lightbulb, Droplets, Thermometer, FlaskConical } from 'lucide-react';

export default function InfoCard({ t }) {
  return (
    <div className="card" style={{ backgroundColor: '#f9fcf9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
        <Lightbulb size={20} color="var(--primary)" />
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-hover)' }}>
          {t?.insightsTitle || 'Farming Insights'}
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <Droplets size={18} color="#2b8a3e" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
          <div>
            <strong style={{ color: 'var(--text-main)' }}>{t?.waterTitle || 'Water & Moisture:'}</strong>{' '}
            <p style={{ color: 'var(--text-muted)' }}>
              {t?.waterDesc || 'Adequate rainfall during the vegetative stage promotes robust root growth. Ensure proper drainage during excess rain.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <FlaskConical size={18} color="#2b8a3e" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
          <div>
            <strong style={{ color: 'var(--text-main)' }}>{t?.nutrientsTitle || 'Balanced N-P-K:'}</strong>{' '}
            <p style={{ color: 'var(--text-muted)' }}>
              {t?.nutrientsDesc || 'Nitrogen fuels leaf growth, Phosphorus supports early roots and flowering, while Potassium builds drought and disease resistance.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <Thermometer size={18} color="#2b8a3e" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
          <div>
            <strong style={{ color: 'var(--text-main)' }}>{t?.temperatureTitle || 'Temperature Range:'}</strong>{' '}
            <p style={{ color: 'var(--text-muted)' }}>
              {t?.temperatureDesc || 'Most crops thrive between 20°C and 35°C. Mulching can help maintain optimal root zone temperature in hot weather.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
