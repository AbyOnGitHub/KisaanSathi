import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import DiseaseDetection from './pages/DiseaseDetection'
import { Leaf } from 'lucide-react'

// Simple wrapper for this specific feature test
function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-green-700 text-white p-4 shadow-md flex items-center gap-3">
        <Leaf className="w-6 h-6" />
        <h1 className="text-xl font-bold tracking-wide">KisaanSathi</h1>
      </header>
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/disease-detection" />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
