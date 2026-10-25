import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LayoutList, Bug, TrendingUp, Handshake, Sprout, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const features = [
  {
    title: 'Marketplace',
    description: 'Buy seeds, fertilizers, and equipment from verified sellers.',
    icon: <ShoppingCart className="w-8 h-8 text-white" />,
    color: 'bg-green-600',
    hover: 'hover:bg-green-700',
    link: '/marketplace',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Bargain Corner',
    description: 'Negotiate prices directly with sellers in real-time.',
    icon: <Handshake className="w-8 h-8 text-white" />,
    color: 'bg-amber-500',
    hover: 'hover:bg-amber-600',
    link: '/bargains',
    image: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Crop Disease Detection',
    description: 'Upload a photo to instantly identify crop diseases.',
    icon: <Bug className="w-8 h-8 text-white" />,
    color: 'bg-red-500',
    hover: 'hover:bg-red-600',
    link: '/disease-detection',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Yield Prediction',
    description: 'Predict your harvest yield based on soil and weather.',
    icon: <TrendingUp className="w-8 h-8 text-white" />,
    color: 'bg-blue-600',
    hover: 'hover:bg-blue-700',
    link: '/yield-prediction',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Govt Schemes',
    description: 'Explore and apply for agricultural subsidies and schemes.',
    icon: <LayoutList className="w-8 h-8 text-white" />,
    color: 'bg-purple-600',
    hover: 'hover:bg-purple-700',
    link: '/schemes',
    image: 'https://images.unsplash.com/photo-1529313780224-1a12b68bed16?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Seller Portal',
    description: 'Are you a vendor? Manage your products and orders here.',
    icon: <Sprout className="w-8 h-8 text-white" />,
    color: 'bg-teal-600',
    hover: 'hover:bg-teal-700',
    link: '/seller/dashboard',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop&q=80'
  }
];

const backgroundImages = [
  "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559884743-74a57598c6c7?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=1600&auto=format&fit=crop&q=80"
];

export const LandingPage = () => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-agri-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-black">
          {backgroundImages.map((img, index) => (
            <img 
              key={index}
              src={img} 
              alt="Farming in India" 
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-40' : 'opacity-0'
              }`}
            />
          ))}
          {/* Dark overlay to ensure text remains readable */}
          <div className="absolute inset-0 bg-agri-dark/60 mix-blend-multiply"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            Welcome to <span className="text-agri-accent">Kisan Sathi</span>
          </h1>
          <p className="text-lg sm:text-xl text-green-100 max-w-2xl mb-10 font-medium">
            Your one-stop digital platform for modern agriculture. Explore the marketplace, 
            diagnose crop diseases, predict yields, and access government schemes all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/marketplace" 
              className="bg-agri-accent hover:bg-amber-600 text-white px-8 py-4 rounded-md font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              Shop Now
            </Link>
            <Link 
              to="/disease-detection" 
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-md font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition"
            >
              <Bug className="w-5 h-5" />
              Diagnose Crops
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Explore Platform Features</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Kisan Sathi integrates multiple intelligent modules to empower farmers at every step of their journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Link 
              key={idx} 
              to={feature.link}
              className={`group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white flex flex-col h-full`}
            >
              <div className={`relative h-40 p-6 flex items-center justify-between overflow-hidden`}>
                <div className="absolute inset-0">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/75 via-gray-900/20 to-transparent"></div>
                </div>
                
                <div className="relative z-10 bg-white/20 p-3 rounded-lg backdrop-blur-md shadow-sm border border-white/20">
                  {feature.icon}
                </div>
                <ArrowRight className="relative z-10 w-6 h-6 text-white opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 drop-shadow-md" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 flex-1">{feature.description}</p>
                <div className="mt-4 text-sm font-semibold text-agri-primary group-hover:text-agri-dark transition flex items-center gap-1">
                  Access Feature <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
