import React from 'react';
import { Award, Info, Sprout } from 'lucide-react';

export default function YieldResult({ result, t }) {
  if (!result) return null;

  const { predicted_yield, unit, inputs } = result;
  const crop = result.crop || inputs?.crop;
  const cropDisplayName = crop ? (t?.cropNames?.[crop] || crop) : null;

  const explanation = cropDisplayName
    ? (t?.cropSelectedResult
        ? t.cropSelectedResult(cropDisplayName, predicted_yield.toFixed(2))
        : `Based on the conditions you provided, the estimated harvest yield for ${cropDisplayName} is approximately ${predicted_yield.toFixed(2)} quintals per acre.`)
    : (t?.resultExplanation
        ? t.resultExplanation(predicted_yield.toFixed(2))
        : `Based on the conditions you provided, the estimated crop yield is approximately ${predicted_yield.toFixed(2)} quintals per acre.`);

  return (
    <div className="result-card">
      <div className="result-header">
        <Award size={22} color="var(--primary)" />
        <span>
          {cropDisplayName
            ? `${t?.resultHeader || 'Estimated Crop Yield'}: ${cropDisplayName}`
            : (t?.resultHeader || 'Estimated Crop Yield')}
        </span>
      </div>

      {cropDisplayName && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.85rem',
          backgroundColor: 'var(--primary-light, #e8f5e9)',
          color: 'var(--primary, #2b8a3e)',
          borderRadius: '16px',
          fontWeight: 600,
          fontSize: '0.88rem',
          marginBottom: '1rem'
        }}>
          <Sprout size={16} />
          <span>{cropDisplayName}</span>
        </div>
      )}

      <div className="result-value-box">
        <span className="result-number">{predicted_yield.toFixed(2)}</span>
        <span className="result-unit">{t?.resultUnit || unit}</span>
      </div>

      <p className="result-explanation">
        {explanation}
      </p>

      {/* Input parameters summary */}
      {inputs && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            {t?.conditionsEvaluated || 'Conditions Evaluated:'}
          </p>
          <table className="result-summary-table">
            <tbody>
              {cropDisplayName && (
                <tr>
                  <td><strong>{t?.cropLabel || 'Selected Crop'}</strong></td>
                  <td><strong>{cropDisplayName}</strong></td>
                </tr>
              )}
              <tr>
                <td>{t?.rainfallLabel || 'Rainfall'}</td>
                <td>{inputs.rainfall} {t?.rainfallUnit || 'mm'}</td>
              </tr>
              <tr>
                <td>{t?.fertilizerLabel || 'Fertilizer'}</td>
                <td>{inputs.fertilizer} {t?.fertilizerUnit || 'units'}</td>
              </tr>
              <tr>
                <td>{t?.temperatureLabel || 'Temperature'}</td>
                <td>{inputs.temperature} {t?.temperatureUnit || '°C'}</td>
              </tr>
              <tr>
                <td>{t?.nitrogenLabel || 'Nitrogen (N)'}</td>
                <td>{inputs.nitrogen}</td>
              </tr>
              <tr>
                <td>{t?.phosphorusLabel || 'Phosphorus (P)'}</td>
                <td>{inputs.phosphorus}</td>
              </tr>
              <tr>
                <td>{t?.potassiumLabel || 'Potassium (K)'}</td>
                <td>{inputs.potassium}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Required model disclaimer */}
      <div className="disclaimer-box">
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
          <Info size={16} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
          <span>
            {t?.disclaimer || (
              <>
                <strong>Note:</strong> This is a machine-learning based estimate. Actual yield may vary
                depending on crop variety, soil conditions, weather, irrigation, pests and other field conditions.
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

