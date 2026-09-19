import React from 'react';
import { Award, Info, CheckCircle2 } from 'lucide-react';

export default function YieldResult({ result }) {
  if (!result) return null;

  const { predicted_yield, unit, inputs } = result;

  return (
    <div className="result-card">
      <div className="result-header">
        <Award size={22} color="var(--primary)" />
        <span>Estimated Crop Yield</span>
      </div>

      <div className="result-value-box">
        <span className="result-number">{predicted_yield.toFixed(2)}</span>
        <span className="result-unit">{unit}</span>
      </div>

      <p className="result-explanation">
        Based on the conditions you provided, the estimated crop yield is approximately{' '}
        <strong>{predicted_yield.toFixed(2)} quintals per acre</strong>.
      </p>

      {/* Input parameters summary */}
      {inputs && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Conditions Evaluated:
          </p>
          <table className="result-summary-table">
            <tbody>
              <tr>
                <td>Rainfall</td>
                <td>{inputs.rainfall} mm</td>
              </tr>
              <tr>
                <td>Fertilizer</td>
                <td>{inputs.fertilizer} units</td>
              </tr>
              <tr>
                <td>Temperature</td>
                <td>{inputs.temperature} °C</td>
              </tr>
              <tr>
                <td>Soil Nitrogen (N)</td>
                <td>{inputs.nitrogen}</td>
              </tr>
              <tr>
                <td>Soil Phosphorus (P)</td>
                <td>{inputs.phosphorus}</td>
              </tr>
              <tr>
                <td>Soil Potassium (K)</td>
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
            <strong>Note:</strong> This is a machine-learning based estimate. Actual yield may vary
            depending on crop variety, soil conditions, weather, irrigation, pests and other field conditions.
          </span>
        </div>
      </div>
    </div>
  );
}
