import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CropYield = () => {
  const [formData, setFormData] = useState({
    rainfall: '',
    fertilizer: '',
    temperature: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    try {
      const payload = {
        rainfall: parseFloat(formData.rainfall),
        fertilizer: parseFloat(formData.fertilizer),
        temperature: parseFloat(formData.temperature),
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
      };
      
      const baseUrl = API_URL.replace(/\/api\/?$/, '');
      const response = await axios.post(`${baseUrl}/api/crop-yield/predict`, payload);
      setPrediction(response.data);
      toast.success('Prediction generated successfully!');
    } catch (error) {
      toast.error('Failed to get prediction');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-sm border border-gray-100 mt-8">
      <h2 className="text-3xl font-oswald font-semibold mb-6 text-green-700">Crop Yield Predictor</h2>
      <p className="mb-8 text-gray-600 font-work-sans">
        Enter your soil and climate details below to estimate the expected crop yield.
      </p>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rainfall (mm)</label>
          <input required type="number" step="0.1" name="rainfall" value={formData.rainfall} onChange={handleChange} className="w-full border border-gray-300 rounded-sm p-2 focus:ring-green-500 focus:border-green-500" placeholder="e.g. 1200" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
          <input required type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} className="w-full border border-gray-300 rounded-sm p-2 focus:ring-green-500 focus:border-green-500" placeholder="e.g. 28" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fertilizer (units)</label>
          <input required type="number" step="0.1" name="fertilizer" value={formData.fertilizer} onChange={handleChange} className="w-full border border-gray-300 rounded-sm p-2 focus:ring-green-500 focus:border-green-500" placeholder="e.g. 80" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nitrogen (N)</label>
          <input required type="number" step="0.1" name="nitrogen" value={formData.nitrogen} onChange={handleChange} className="w-full border border-gray-300 rounded-sm p-2 focus:ring-green-500 focus:border-green-500" placeholder="e.g. 80" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phosphorus (P)</label>
          <input required type="number" step="0.1" name="phosphorus" value={formData.phosphorus} onChange={handleChange} className="w-full border border-gray-300 rounded-sm p-2 focus:ring-green-500 focus:border-green-500" placeholder="e.g. 24" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Potassium (K)</label>
          <input required type="number" step="0.1" name="potassium" value={formData.potassium} onChange={handleChange} className="w-full border border-gray-300 rounded-sm p-2 focus:ring-green-500 focus:border-green-500" placeholder="e.g. 20" />
        </div>
        
        <div className="md:col-span-2 mt-4">
          <button type="submit" disabled={loading} className="w-full bg-green-700 hover:bg-green-800 text-white rounded-md py-3 text-lg flex items-center justify-center transition-colors">
            {loading ? 'Analyzing Data...' : 'Predict Yield'}
          </button>
        </div>
      </form>

      {prediction && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-xl font-oswald text-green-800 mb-2">Prediction Results</h3>
          <p className="text-gray-800">
            <strong>Estimated Yield:</strong> <span className="text-2xl text-green-700 ml-2">{prediction.predicted_yield.toFixed(2)}</span> <span className="text-sm">Quintals / Acre</span>
          </p>
          <p className="text-gray-600 text-sm mt-2">{prediction.message}</p>
        </div>
      )}
    </div>
  );
};

export default CropYield;
