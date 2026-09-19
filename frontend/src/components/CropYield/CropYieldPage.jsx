import React, { useState } from 'react';
import { AlertCircle, TrendingUp } from 'lucide-react';
import YieldForm from './YieldForm';
import YieldResult from './YieldResult';
import InfoCard from './InfoCard';
import { predictCropYield } from '../../services/api';

export default function CropYieldPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    const response = await predictCropYield(formData);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      setError(response.error);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Crop Yield Prediction</h1>
        <p className="page-subtitle">
          Estimate your expected crop yield using rainfall, temperature, fertilizer and soil nutrient information.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
          <div>
            <strong>Error: </strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid-2col">
        {/* Left Column: Form */}
        <div>
          <YieldForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Right Column: Result & Insights */}
        <div>
          {result ? (
            <YieldResult result={result} />
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', marginBottom: '1.5rem', background: '#fdfefe' }}>
              <div style={{ display: 'inline-flex', padding: '0.85rem', background: 'var(--primary-light)', borderRadius: '50%', marginBottom: '1rem' }}>
                <TrendingUp size={32} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Awaiting Farm Data
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
                Fill in the form on the left with your field conditions and click <strong>Predict Yield</strong> to see your estimated harvest.
              </p>
            </div>
          )}

          <InfoCard />
        </div>
      </div>
    </div>
  );
}
