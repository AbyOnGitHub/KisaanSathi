import React, { useState } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

export default function YieldForm({ onSubmit, isLoading, t }) {
  const [formData, setFormData] = useState({
    rainfall: '',
    fertilizer: '',
    temperature: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
  });

  const [errors, setErrors] = useState({});

  const sampleData = {
    rainfall: '1200',
    fertilizer: '80',
    temperature: '28',
    nitrogen: '80',
    phosphorus: '24',
    potassium: '20',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    const rf = parseFloat(formData.rainfall);
    if (!formData.rainfall || isNaN(rf)) {
      newErrors.rainfall = t?.rainfallError || 'Please enter a valid rainfall value.';
    } else if (rf < 100 || rf > 3000) {
      newErrors.rainfall = t?.rainfallError || 'Rainfall should typically be between 100 and 3000 mm.';
    }

    const fert = parseFloat(formData.fertilizer);
    if (!formData.fertilizer || isNaN(fert)) {
      newErrors.fertilizer = t?.fertilizerError || 'Please enter a valid fertilizer quantity.';
    } else if (fert < 10 || fert > 300) {
      newErrors.fertilizer = t?.fertilizerError || 'Fertilizer should typically be between 10 and 300 units.';
    }

    const temp = parseFloat(formData.temperature);
    if (!formData.temperature || isNaN(temp)) {
      newErrors.temperature = t?.temperatureError || 'Please enter a valid temperature.';
    } else if (temp < 10 || temp > 55) {
      newErrors.temperature = t?.temperatureError || 'Temperature should typically be between 10°C and 55°C.';
    }

    const n = parseFloat(formData.nitrogen);
    if (!formData.nitrogen || isNaN(n)) {
      newErrors.nitrogen = t?.nitrogenError || 'Please enter soil Nitrogen (N) value.';
    } else if (n < 10 || n > 200) {
      newErrors.nitrogen = t?.nitrogenError || 'Nitrogen (N) should typically be between 10 and 200.';
    }

    const p = parseFloat(formData.phosphorus);
    if (!formData.phosphorus || isNaN(p)) {
      newErrors.phosphorus = t?.phosphorusError || 'Please enter soil Phosphorus (P) value.';
    } else if (p < 5 || p > 100) {
      newErrors.phosphorus = t?.phosphorusError || 'Phosphorus (P) should typically be between 5 and 100.';
    }

    const k = parseFloat(formData.potassium);
    if (!formData.potassium || isNaN(k)) {
      newErrors.potassium = t?.potassiumError || 'Please enter soil Potassium (K) value.';
    } else if (k < 5 || k > 100) {
      newErrors.potassium = t?.potassiumError || 'Potassium (K) should typically be between 5 and 100.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleFillSample = () => {
    setFormData(sampleData);
    setErrors({});
  };

  const handleReset = () => {
    setFormData({
      rainfall: '',
      fertilizer: '',
      temperature: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
    });
    setErrors({});
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-hover)' }}>
          {t?.formTitle || 'Enter Farm Conditions'}
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
            onClick={handleFillSample}
            title="Populate form with realistic agricultural data"
          >
            <Sparkles size={15} color="var(--primary)" />
            <span>{t?.sampleDataBtn || 'Sample Data'}</span>
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
            onClick={handleReset}
            title="Clear all fields"
          >
            <RotateCcw size={15} />
            <span>{t?.resetBtn || 'Reset'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Rainfall */}
          <div className="form-group">
            <label className="form-label" htmlFor="rainfall">
              <span>{t?.rainfallLabel || 'Rainfall'}</span>
              <span className="form-unit">{t?.rainfallUnit || 'mm'}</span>
            </label>
            <input
              id="rainfall"
              name="rainfall"
              type="number"
              step="any"
              className={`form-input ${errors.rainfall ? 'input-error' : ''}`}
              placeholder={t?.rainfallPlaceholder || 'e.g. 1200'}
              value={formData.rainfall}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span className="form-helper">{t?.rainfallHelper || 'Expected or recorded rainfall in millimetres.'}</span>
            {errors.rainfall && <span className="form-error-msg">{errors.rainfall}</span>}
          </div>

          {/* Fertilizer */}
          <div className="form-group">
            <label className="form-label" htmlFor="fertilizer">
              <span>{t?.fertilizerLabel || 'Fertilizer'}</span>
              <span className="form-unit">{t?.fertilizerUnit || 'units'}</span>
            </label>
            <input
              id="fertilizer"
              name="fertilizer"
              type="number"
              step="any"
              className={`form-input ${errors.fertilizer ? 'input-error' : ''}`}
              placeholder={t?.fertilizerPlaceholder || 'e.g. 80'}
              value={formData.fertilizer}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span className="form-helper">{t?.fertilizerHelper || 'Amount of fertilizer applied to the field.'}</span>
            {errors.fertilizer && <span className="form-error-msg">{errors.fertilizer}</span>}
          </div>

          {/* Temperature */}
          <div className="form-group">
            <label className="form-label" htmlFor="temperature">
              <span>{t?.temperatureLabel || 'Temperature'}</span>
              <span className="form-unit">{t?.temperatureUnit || '°C'}</span>
            </label>
            <input
              id="temperature"
              name="temperature"
              type="number"
              step="any"
              className={`form-input ${errors.temperature ? 'input-error' : ''}`}
              placeholder={t?.temperaturePlaceholder || 'e.g. 28'}
              value={formData.temperature}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span className="form-helper">{t?.temperatureHelper || 'Average season temperature in Celsius.'}</span>
            {errors.temperature && <span className="form-error-msg">{errors.temperature}</span>}
          </div>

          {/* Nitrogen (N) */}
          <div className="form-group">
            <label className="form-label" htmlFor="nitrogen">
              <span>{t?.nitrogenLabel || 'Nitrogen (N)'}</span>
              <span className="form-unit">{t?.nitrogenUnit || 'N level'}</span>
            </label>
            <input
              id="nitrogen"
              name="nitrogen"
              type="number"
              step="any"
              className={`form-input ${errors.nitrogen ? 'input-error' : ''}`}
              placeholder={t?.nitrogenPlaceholder || 'e.g. 80'}
              value={formData.nitrogen}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span className="form-helper">{t?.nitrogenHelper || 'Soil Nitrogen content from soil test.'}</span>
            {errors.nitrogen && <span className="form-error-msg">{errors.nitrogen}</span>}
          </div>

          {/* Phosphorus (P) */}
          <div className="form-group">
            <label className="form-label" htmlFor="phosphorus">
              <span>{t?.phosphorusLabel || 'Phosphorus (P)'}</span>
              <span className="form-unit">{t?.phosphorusUnit || 'P level'}</span>
            </label>
            <input
              id="phosphorus"
              name="phosphorus"
              type="number"
              step="any"
              className={`form-input ${errors.phosphorus ? 'input-error' : ''}`}
              placeholder={t?.phosphorusPlaceholder || 'e.g. 24'}
              value={formData.phosphorus}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span className="form-helper">{t?.phosphorusHelper || 'Soil Phosphorus content from soil test.'}</span>
            {errors.phosphorus && <span className="form-error-msg">{errors.phosphorus}</span>}
          </div>

          {/* Potassium (K) */}
          <div className="form-group">
            <label className="form-label" htmlFor="potassium">
              <span>{t?.potassiumLabel || 'Potassium (K)'}</span>
              <span className="form-unit">{t?.potassiumUnit || 'K level'}</span>
            </label>
            <input
              id="potassium"
              name="potassium"
              type="number"
              step="any"
              className={`form-input ${errors.potassium ? 'input-error' : ''}`}
              placeholder={t?.potassiumPlaceholder || 'e.g. 20'}
              value={formData.potassium}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span className="form-helper">{t?.potassiumHelper || 'Soil Potassium content from soil test.'}</span>
            {errors.potassium && <span className="form-error-msg">{errors.potassium}</span>}
          </div>
        </div>

        <div style={{ marginTop: '1.75rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span>{t?.calculatingBtn || 'Calculating Estimate...'}</span>
            ) : (
              <span>{t?.predictBtn || 'Predict Yield'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
