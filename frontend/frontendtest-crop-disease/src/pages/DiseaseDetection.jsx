import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import imageCompression from 'browser-image-compression'
import { Camera, Upload, AlertCircle, CheckCircle2, Leaf, ShieldAlert } from 'lucide-react'

export default function DiseaseDetection() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0]
      
      // Show local preview immediately
      setPreviewUrl(URL.createObjectURL(originalFile))
      setResult(null)
      setError(null)

      try {
        setLoading(true)
        
        // Compress image before upload
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true
        }
        
        const compressedFile = await imageCompression(originalFile, options)
        setFile(compressedFile)
        
      } catch (err) {
        setError("Failed to process image. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handlePredict = async () => {
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://localhost:8000/api/predict-disease', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image. Ensure the backend is running.')
      }

      const data = await response.json()
      setResult(data)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-green-800 flex items-center justify-center gap-2">
          <Leaf className="w-8 h-8" />
          Crop Disease Scanner
        </h1>
        <p className="text-gray-600">Take a photo of a diseased leaf to get instant analysis and treatment recommendations.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        
        {/* Upload Area */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
            ${previewUrl ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-green-50/50'}`}
        >
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
          
          {previewUrl ? (
            <div className="space-y-4">
              <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg object-contain" />
              <p className="text-sm text-green-700 font-medium">Tap to select a different photo</p>
            </div>
          ) : (
            <div className="space-y-4 text-gray-500">
              <div className="flex justify-center gap-4">
                <div className="p-4 bg-white rounded-full shadow-sm border border-gray-100">
                  <Camera className="w-8 h-8 text-green-600" />
                </div>
                <div className="p-4 bg-white rounded-full shadow-sm border border-gray-100">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-lg">Take Photo or Upload</p>
                <p className="text-sm mt-1">Supports JPG, PNG (Max 5MB)</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <button
          onClick={handlePredict}
          disabled={!file || loading}
          className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
              Analyzing...
            </>
          ) : (
            'Analyze Leaf'
          )}
        </button>
      </div>

      {/* Results Section */}
      {result && result.treatment_data && !result.treatment_data.error && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-green-600 p-6 text-white text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-200" />
            <h2 className="text-2xl font-bold">
              {result.disease === 'healthy' 
                ? 'Healthy Crop' 
                : result.treatment_data.disease_name.replace(/___/g, ' - ').replace(/_/g, ' ')}
            </h2>
            <p className="text-green-100 mt-1 font-medium">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{result.treatment_data.description}</p>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Symptoms to verify</h3>
              <p className="text-gray-700 leading-relaxed">{result.treatment_data.symptoms}</p>
            </div>

            {result.disease !== 'healthy' && (
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                  <h4 className="font-bold text-emerald-800 flex items-center gap-2 mb-2">
                    <Leaf className="w-5 h-5" /> Organic Treatment
                  </h4>
                  <p className="text-emerald-900 text-sm leading-relaxed">{result.treatment_data.organic_treatment}</p>
                </div>
                
                <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                  <h4 className="font-bold text-orange-800 flex items-center gap-2 mb-2">
                    <ShieldAlert className="w-5 h-5" /> Chemical Treatment
                  </h4>
                  <p className="text-orange-900 text-sm leading-relaxed">{result.treatment_data.chemical_treatment}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Raw Error if DB fetch fails */}
      {result && result.treatment_data && result.treatment_data.error && (
        <div className="p-6 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-200">
          <p className="font-bold">Raw Prediction: {result.disease.replace(/___/g, ' - ')}</p>
          <p className="mt-2 text-sm">{result.treatment_data.error}</p>
          <p className="mt-2 text-xs opacity-75">Please ensure you ran the disease_schema.sql script in Supabase!</p>
        </div>
      )}
    </div>
  )
}
