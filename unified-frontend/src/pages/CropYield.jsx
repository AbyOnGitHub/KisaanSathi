import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Sprout, 
  CloudRain, 
  Thermometer, 
  FlaskConical, 
  Sparkles, 
  RotateCcw, 
  Award, 
  Info, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

const SUPPORTED_CROPS = [
  { id: 'Rice', label: 'Rice (Paddy)', icon: '🌾', typical: '18 - 22 Q/acre' },
  { id: 'Wheat', label: 'Wheat', icon: '🌾', typical: '16 - 20 Q/acre' },
  { id: 'Maize', label: 'Maize (Corn)', icon: '🌽', typical: '18 - 24 Q/acre' },
  { id: 'Bajra', label: 'Bajra (Pearl Millet)', icon: '🌾', typical: '8 - 12 Q/acre' },
  { id: 'Jowar', label: 'Jowar (Sorghum)', icon: '🌾', typical: '9 - 13 Q/acre' },
  { id: 'Cotton', label: 'Cotton', icon: '🌱', typical: '8 - 12 Q/acre' },
  { id: 'Soybean', label: 'Soybean', icon: '🫘', typical: '9 - 13 Q/acre' },
  { id: 'Groundnut', label: 'Groundnut (Peanut)', icon: '🥜', typical: '10 - 15 Q/acre' },
  { id: 'Chickpea', label: 'Chickpea (Gram)', icon: '🫘', typical: '7 - 11 Q/acre' },
  { id: 'Mustard', label: 'Mustard (Sarson)', icon: '🌼', typical: '6 - 10 Q/acre' },
];

const CROP_SAMPLE_PROFILES = {
  Wheat: {
    crop: 'Wheat',
    rainfall: '450',
    temperature: '20',
    fertilizer: '100',
    nitrogen: '110',
    phosphorus: '45',
    potassium: '35',
  },
  Rice: {
    crop: 'Rice',
    rainfall: '1400',
    temperature: '28',
    fertilizer: '110',
    nitrogen: '100',
    phosphorus: '40',
    potassium: '40',
  },
  Maize: {
    crop: 'Maize',
    rainfall: '700',
    temperature: '25',
    fertilizer: '115',
    nitrogen: '110',
    phosphorus: '45',
    potassium: '40',
  },
  Cotton: {
    crop: 'Cotton',
    rainfall: '750',
    temperature: '29',
    fertilizer: '95',
    nitrogen: '90',
    phosphorus: '38',
    potassium: '38',
  },
  Mustard: {
    crop: 'Mustard',
    rainfall: '360',
    temperature: '19',
    fertilizer: '70',
    nitrogen: '70',
    phosphorus: '38',
    potassium: '28',
  },
};

const getApiUrl = () => {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (
    import.meta.env.PROD ||
    (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
  ) {
    if (envUrl && !envUrl.includes('localhost') && envUrl.startsWith('http')) {
      return envUrl.replace(/\/api\/?$/, '');
    }
    return '';
  }
  return envUrl.replace(/\/api\/?$/, '') || 'http://localhost:8000';
};

const API_BASE = getApiUrl();

const CropYield = () => {
  const [formData, setFormData] = useState({
    crop: 'Wheat',
    rainfall: '450',
    temperature: '20',
    fertilizer: '100',
    nitrogen: '110',
    phosphorus: '45',
    potassium: '35',
  });

  const [availableCrops, setAvailableCrops] = useState(SUPPORTED_CROPS);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Attempt to fetch dynamically supported crops from backend
    axios.get(`${API_BASE}/api/crop-yield/crops`)
      .then((res) => {
        if (res.data?.crops && Array.isArray(res.data.crops)) {
          const mapped = res.data.crops.map((name) => {
            const found = SUPPORTED_CROPS.find((c) => c.id.toLowerCase() === name.toLowerCase());
            return found || { id: name, label: name, icon: '🌾', typical: 'Agricultural baseline' };
          });
          setAvailableCrops(mapped);
        }
      })
      .catch((err) => {
        // Graceful fallback to local supported list
        console.debug('Using local crop catalog:', err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectCrop = (cropId) => {
    const profile = CROP_SAMPLE_PROFILES[cropId];
    if (profile) {
      setFormData(profile);
    } else {
      setFormData((prev) => ({ ...prev, crop: cropId }));
    }
    setErrors({});
  };

  const handleFillSample = () => {
    const activeCrop = formData.crop || 'Wheat';
    const sample = CROP_SAMPLE_PROFILES[activeCrop] || CROP_SAMPLE_PROFILES['Wheat'];
    setFormData(sample);
    setErrors({});
    toast.success(`Loaded sample conditions for ${sample.crop}`);
  };

  const handleReset = () => {
    setFormData({
      crop: '',
      rainfall: '',
      fertilizer: '',
      temperature: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
    });
    setErrors({});
    setPrediction(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.crop) newErrors.crop = 'Please select a crop.';
    
    const rf = parseFloat(formData.rainfall);
    if (!formData.rainfall || isNaN(rf) || rf < 100 || rf > 3000) {
      newErrors.rainfall = 'Rainfall must be between 100 and 3,000 mm.';
    }

    const temp = parseFloat(formData.temperature);
    if (!formData.temperature || isNaN(temp) || temp < 10 || temp > 55) {
      newErrors.temperature = 'Temperature must be between 10°C and 55°C.';
    }

    const fert = parseFloat(formData.fertilizer);
    if (!formData.fertilizer || isNaN(fert) || fert < 10 || fert > 300) {
      newErrors.fertilizer = 'Fertilizer must be between 10 and 300 units.';
    }

    const n = parseFloat(formData.nitrogen);
    if (!formData.nitrogen || isNaN(n) || n < 10 || n > 200) {
      newErrors.nitrogen = 'Nitrogen (N) must be between 10 and 200.';
    }

    const p = parseFloat(formData.phosphorus);
    if (!formData.phosphorus || isNaN(p) || p < 5 || p > 100) {
      newErrors.phosphorus = 'Phosphorus (P) must be between 5 and 100.';
    }

    const k = parseFloat(formData.potassium);
    if (!formData.potassium || isNaN(k) || k < 5 || k > 100) {
      newErrors.potassium = 'Potassium (K) must be between 5 and 100.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setPrediction(null);

    try {
      const payload = {
        crop: formData.crop,
        rainfall: parseFloat(formData.rainfall),
        fertilizer: parseFloat(formData.fertilizer),
        temperature: parseFloat(formData.temperature),
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
      };

      const response = await axios.post(`${API_BASE}/api/crop-yield/predict`, payload);
      setPrediction(response.data);
      toast.success('Crop-wise yield estimated successfully!');
    } catch (error) {
      const detail = error.response?.data?.detail || 'Failed to estimate crop yield.';
      toast.error(detail);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCropObj = availableCrops.find((c) => c.id === formData.crop);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-work-sans">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <Sprout className="w-4 h-4 text-green-600" />
          AI & Agronomic Model
        </div>
        <h1 className="text-3xl md:text-4xl font-oswald font-bold text-gray-900 tracking-tight">
          Crop-Wise Yield Predictor
        </h1>
        <p className="mt-2 text-gray-600 text-sm md:text-base">
          Get genuine, crop-specific harvest projections based on your regional rainfall, temperature, and soil nutrient levels.
        </p>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          {/* Form Actions Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-gray-100 mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Farm & Climate Parameters</h2>
              <p className="text-xs text-gray-500">Provide field metrics or select a pre-calibrated sample</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFillSample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                title="Populate with recommended agronomic sample"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Fill Sample
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                title="Reset all inputs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Crop Selector Section */}
            <div>
              <label htmlFor="crop" className="block text-sm font-semibold text-gray-800 mb-2">
                Target Crop <span className="text-red-500">*</span>
              </label>

              {/* Quick Select Crop Pills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {SUPPORTED_CROPS.slice(0, 5).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCrop(c.id)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                      formData.crop === c.id
                        ? 'bg-green-700 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span>{c.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Full Dropdown */}
              <select
                id="crop"
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-gray-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.crop ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                }`}
              >
                <option value="">-- Select Crop --</option>
                {availableCrops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon || '🌾'} {c.label || c.id}
                  </option>
                ))}
              </select>
              {errors.crop && <p className="text-xs text-red-600 mt-1">{errors.crop}</p>}
            </div>

            {/* Climate Inputs */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                <CloudRain className="w-4 h-4 text-blue-500" />
                Weather & Climate Conditions
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rainfall" className="block text-xs font-medium text-gray-700 mb-1">
                    Rainfall (mm) <span className="text-gray-400 text-[11px]">(100 - 3000)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="rainfall"
                    name="rainfall"
                    value={formData.rainfall}
                    onChange={handleChange}
                    placeholder="e.g. 450"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.rainfall ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  {errors.rainfall && <p className="text-xs text-red-600 mt-1">{errors.rainfall}</p>}
                </div>

                <div>
                  <label htmlFor="temperature" className="block text-xs font-medium text-gray-700 mb-1">
                    Average Temperature (°C) <span className="text-gray-400 text-[11px]">(10 - 55)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="temperature"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    placeholder="e.g. 20"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.temperature ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  {errors.temperature && <p className="text-xs text-red-600 mt-1">{errors.temperature}</p>}
                </div>
              </div>
            </div>

            {/* Fertilizer & Soil Nutrients */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                Soil Nutrients & Fertilizer Application
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fertilizer" className="block text-xs font-medium text-gray-700 mb-1">
                    Fertilizer Applied (units) <span className="text-gray-400 text-[11px]">(10 - 300)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="fertilizer"
                    name="fertilizer"
                    value={formData.fertilizer}
                    onChange={handleChange}
                    placeholder="e.g. 100"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.fertilizer ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  {errors.fertilizer && <p className="text-xs text-red-600 mt-1">{errors.fertilizer}</p>}
                </div>

                <div>
                  <label htmlFor="nitrogen" className="block text-xs font-medium text-gray-700 mb-1">
                    Nitrogen (N) Content <span className="text-gray-400 text-[11px]">(10 - 200)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="nitrogen"
                    name="nitrogen"
                    value={formData.nitrogen}
                    onChange={handleChange}
                    placeholder="e.g. 110"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.nitrogen ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  {errors.nitrogen && <p className="text-xs text-red-600 mt-1">{errors.nitrogen}</p>}
                </div>

                <div>
                  <label htmlFor="phosphorus" className="block text-xs font-medium text-gray-700 mb-1">
                    Phosphorus (P) Content <span className="text-gray-400 text-[11px]">(5 - 100)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="phosphorus"
                    name="phosphorus"
                    value={formData.phosphorus}
                    onChange={handleChange}
                    placeholder="e.g. 45"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.phosphorus ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  {errors.phosphorus && <p className="text-xs text-red-600 mt-1">{errors.phosphorus}</p>}
                </div>

                <div>
                  <label htmlFor="potassium" className="block text-xs font-medium text-gray-700 mb-1">
                    Potassium (K) Content <span className="text-gray-400 text-[11px]">(5 - 100)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="potassium"
                    name="potassium"
                    value={formData.potassium}
                    onChange={handleChange}
                    placeholder="e.g. 35"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.potassium ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  {errors.potassium && <p className="text-xs text-red-600 mt-1">{errors.potassium}</p>}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-green-700 hover:bg-green-800 text-white rounded-xl font-bold text-base transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Calculating Crop Yield...</span>
                </>
              ) : (
                <>
                  <Sprout className="w-5 h-5" />
                  <span>Predict Yield for {formData.crop || 'Crop'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Prediction Result & Agronomic Insights (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {prediction ? (
            /* Result Card */
            <div className="bg-white rounded-2xl shadow-sm border border-green-200 overflow-hidden">
              {/* Card Banner */}
              <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                    <Award className="w-3.5 h-3.5" />
                    <span>Estimated Harvest</span>
                  </div>
                  {prediction.crop && (
                    <span className="text-xl">{selectedCropObj?.icon || '🌾'}</span>
                  )}
                </div>
                <h3 className="text-2xl font-oswald font-bold tracking-wide">
                  {prediction.crop || 'Crop'} Yield Estimate
                </h3>
                <p className="text-xs text-green-100 mt-1">
                  Calibrated against Indian agricultural response models
                </p>
              </div>

              {/* Yield Number Callout */}
              <div className="p-6 space-y-6">
                <div className="text-center p-6 bg-green-50/70 border border-green-100 rounded-xl">
                  <span className="text-5xl font-black text-green-800 tracking-tight">
                    {prediction.predicted_yield.toFixed(2)}
                  </span>
                  <span className="text-lg font-semibold text-green-700 block mt-1">
                    {prediction.unit || 'Quintals / Acre'}
                  </span>
                  <div className="mt-3 pt-3 border-t border-green-200/60 flex items-center justify-center gap-4 text-xs text-gray-600">
                    <div>
                      <span className="font-semibold text-gray-800">
                        {(prediction.predicted_yield * 0.2471).toFixed(2)}
                      </span>{' '}
                      Tonnes / Hectare
                    </div>
                    <div className="h-3 w-px bg-gray-300"></div>
                    <div>
                      <span className="font-semibold text-gray-800">
                        {(prediction.predicted_yield * 100).toFixed(0)}
                      </span>{' '}
                      kg / Acre
                    </div>
                  </div>
                </div>

                {/* Farmer Message */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700 leading-relaxed">
                  <p>{prediction.message}</p>
                </div>

                {/* Conditions Evaluated Summary */}
                {prediction.inputs && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Evaluated Field Inputs
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-500 block">Rainfall</span>
                        <span className="font-semibold text-gray-800">{prediction.inputs.rainfall} mm</span>
                      </div>
                      <div className="p-2.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-500 block">Temperature</span>
                        <span className="font-semibold text-gray-800">{prediction.inputs.temperature} °C</span>
                      </div>
                      <div className="p-2.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-500 block">Fertilizer</span>
                        <span className="font-semibold text-gray-800">{prediction.inputs.fertilizer} units</span>
                      </div>
                      <div className="p-2.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-500 block">Soil N-P-K</span>
                        <span className="font-semibold text-gray-800">
                          {prediction.inputs.nitrogen}-{prediction.inputs.phosphorus}-{prediction.inputs.potassium}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Agronomic Disclaimer */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Agronomic Note:</strong> Predictions are based on optimal crop response models. Actual farm yields may vary depending on seed quality, irrigation schedule, weed control, and localized pest management.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Awaiting Input Placeholder Card */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Awaiting Farm Inputs</h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                Select your crop and fill in your soil testing and rainfall metrics on the left, then click <strong>Predict Yield</strong> to view your personalized harvest estimation.
              </p>

              {/* Supported Crops Quick Reference */}
              <div className="mt-6 pt-6 border-t border-gray-100 text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  10 Supported Agricultural Crops
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {SUPPORTED_CROPS.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleSelectCrop(c.id)}
                      className="p-2 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-green-50 hover:border-green-200 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-gray-700 flex items-center gap-1.5">
                        <span>{c.icon}</span>
                        <span>{c.id}</span>
                      </span>
                      <span className="text-[10px] text-gray-400">{c.typical.split(' ')[0]} Q</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tips Card */}
          <div className="bg-emerald-50/60 rounded-2xl border border-emerald-100 p-5 space-y-2 text-xs text-emerald-900">
            <div className="font-bold flex items-center gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Agronomic Maximization Tips
            </div>
            <ul className="list-disc pl-4 space-y-1 text-emerald-800/90">
              <li>Balanced N-P-K fertilization ensures strong root establishment and disease resilience.</li>
              <li>Watering at critical phenological stages (flowering & grain filling) dramatically boosts yield.</li>
              <li>Combine with regular crop disease scanning to prevent pre-harvest loss.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropYield;
