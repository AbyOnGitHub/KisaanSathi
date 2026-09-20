import React from 'react';

export default function Footer({ t }) {
  const footerTitle = t?.footerTitle || 'KisaanSathi (किसान साथी) — Farmer Portal';
  const footerSubtitle = t?.footerSubtitle || 'College Mini-Project | Dedicated to empowering farmers with data-driven agricultural assistance.';

  return (
    <footer className="footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
          {footerTitle}
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
          {footerSubtitle}
        </p>
      </div>
    </footer>
  );
}
