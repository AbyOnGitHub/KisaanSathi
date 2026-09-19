import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
          KisaanSathi (किसान साथी) — Farmer Portal
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
          College Mini-Project | Dedicated to empowering farmers with data-driven agricultural assistance.
        </p>
      </div>
    </footer>
  );
}
