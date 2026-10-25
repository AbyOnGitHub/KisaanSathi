// Kisan Sathi API Service

const getApiBaseUrl = () => {
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

const API_BASE_URL = getApiBaseUrl();

/**
 * Checks whether the backend FastAPI service is running.
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) {
      return { ok: false, error: 'Backend service returned an error.' };
    }
    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: 'Unable to connect to the prediction service. Please make sure the backend is running.'
    };
  }
}

/**
 * Sends farmer input to the FastAPI crop yield prediction endpoint.
 *
 * @param {Object} inputData - { rainfall, fertilizer, temperature, nitrogen, phosphorus, potassium }
 * @returns {Promise<Object>} - { success: true, data } or { success: false, error: string }
 */
export async function predictCropYield(inputData) {
  try {
    const payload = {
      rainfall: parseFloat(inputData.rainfall),
      fertilizer: parseFloat(inputData.fertilizer),
      temperature: parseFloat(inputData.temperature),
      nitrogen: parseFloat(inputData.nitrogen),
      phosphorus: parseFloat(inputData.phosphorus),
      potassium: parseFloat(inputData.potassium),
    };

    const response = await fetch(`${API_BASE_URL}/api/crop-yield/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = result.message || 'Prediction request could not be processed. Please check your inputs.';
      return { success: false, error: errorMessage };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Unable to connect to the prediction service. Please make sure the backend is running.'
    };
  }
}
