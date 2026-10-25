import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Globe,
  Sprout,
  User,
  MapPin,
  Landmark,
  Droplets,
  Tractor,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  Sparkles,
  ChevronRight,
  FileText,
  IndianRupee,
  Layers,
  Award,
  Info,
  Check,
  Search,
  SlidersHorizontal,
  Compass,
  Store,
  ArrowRight,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFarmer } from '../context/FarmerContext';
import { supabase } from '../utils/supabaseClient';
import { SCHEMES, toDetail } from '../data/schemes';
import toast from 'react-hot-toast';

export default function FarmerPortal() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { farmer, updateFarmer } = useFarmer();

  const isSeller = profile?.role === 'seller' || user?.role === 'seller' || user?.user_metadata?.role === 'seller' || user?.email?.includes('seller');


  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('kisaansathi_lang') || 'en';
  });

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'schemes'
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [backendRecommendations, setBackendRecommendations] = useState(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Local editable form state synced with FarmerContext
  const [formData, setFormData] = useState({
    // Personal Details
    name: farmer.name || user?.full_name || '',
    email: farmer.email || user?.email || '',
    phone: farmer.phone || profile?.phone_number || '',
    age: farmer.age || '38',
    gender: farmer.gender || 'Male',
    // Residence
    state: farmer.state || 'Maharashtra',
    district: farmer.district || 'Amravati',
    taluka: farmer.taluka || 'Achalpur',
    village: farmer.village || 'Dhamangaon',
    pincode: farmer.pincode || '444806',
    // Caste & Category
    category: farmer.category || 'General',
    // Farm & Land
    land_area: farmer.land_area || '2.5',
    land_unit: farmer.land_unit || 'acres',
    ownership_type: farmer.ownership_type || 'Owner',
    soil_type: farmer.soil_type || 'Black',
    irrigation_availability: farmer.irrigation_availability !== false,
    irrigation_type: farmer.irrigation_type || 'Drip',
    // Income & Finance
    annual_income: farmer.annual_income || '150000',
    kcc_holder: farmer.kcc_holder !== false,
    aadhaar_linked_bank: farmer.aadhaar_linked_bank !== false,
    // Cultivation
    crops: farmer.crops && farmer.crops.length > 0
      ? farmer.crops
      : [{ crop: 'Cotton', season: 'Kharif', cultivated_area: '1.5' }, { crop: 'Soybean', season: 'Kharif', cultivated_area: '1.0' }],
    // Assistance Needs
    needs: farmer.needs && farmer.needs.length > 0
      ? farmer.needs
      : ['financial', 'irrigation', 'farm_machinery'],
  });

  // Sync when farmer or user profile loads
  useEffect(() => {
    if (user || profile) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user?.full_name || profile?.full_name || '',
        email: prev.email || user?.email || '',
        phone: prev.phone || profile?.phone_number || '',
      }));
    }
  }, [user, profile]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('kisaansathi_lang', newLang);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleNeed = (needKey) => {
    setFormData(prev => {
      const exists = prev.needs.includes(needKey);
      const updated = exists ? prev.needs.filter(n => n !== needKey) : [...prev.needs, needKey];
      return { ...prev, needs: updated };
    });
  };

  const AVAILABLE_CROPS = [
    'Cotton', 'Soybean', 'Wheat', 'Rice', 'Sugarcane',
    'Maize', 'Gram (Chana)', 'Tur (Pigeon Pea)', 'Groundnut',
    'Onion', 'Tomato', 'Mustard', 'Bajra', 'Jowar', 'Banana', 'Citrus / Orange'
  ];

  const toggleCrop = (cropName) => {
    setFormData(prev => {
      const exists = prev.crops.some(c => c.crop.toLowerCase() === cropName.toLowerCase());
      if (exists) {
        return { ...prev, crops: prev.crops.filter(c => c.crop.toLowerCase() !== cropName.toLowerCase()) };
      } else {
        return { ...prev, crops: [...prev.crops, { crop: cropName, season: 'Kharif', cultivated_area: '1.0' }] };
      }
    });
  };

  // Save profile to context, localStorage, and Supabase
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      updateFarmer(formData);

      // If user is authenticated in Supabase, update profile row
      if (user?.id) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.name,
            phone_number: formData.phone,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) {
          console.warn('Note: Could not sync with Supabase profiles table directly', error.message);
        }
      }

      toast.success(
        language === 'hi'
          ? 'किसान प्रोफाइल सफलतापूर्वक अपडेट की गई!'
          : language === 'mr'
          ? 'शेतकरी प्रोफाइल यशस्वीरित्या जतन केली!'
          : 'Farmer Profile saved & updated successfully!'
      );

      // Re-trigger recommendations
      fetchRecommendations(formData);
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch explainable recommendations from backend
  const fetchRecommendations = async (profileData) => {
    setLoadingRecommendations(true);
    try {
      const payload = {
        name: profileData.name,
        state: profileData.state,
        district: profileData.district,
        taluka: profileData.taluka,
        village: profileData.village,
        category: profileData.category,
        land_size: parseFloat(profileData.land_area) || 2.0,
        land_unit: profileData.land_unit,
        annual_income: parseFloat(profileData.annual_income) || 150000,
        gender: profileData.gender,
        age: parseInt(profileData.age) || 38,
        crops: profileData.crops.map(c => c.crop),
        needs: profileData.needs,
        irrigation_availability: profileData.irrigation_availability,
        irrigation_type: profileData.irrigation_type,
        soil_type: profileData.soil_type,
        additional_data: {
          kcc_holder: profileData.kcc_holder,
          aadhaar_linked_bank: profileData.aadhaar_linked_bank,
          ownership_type: profileData.ownership_type,
        }
      };

      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setBackendRecommendations(data);
      }
    } catch (err) {
      console.warn('Backend recommendation call fell back to local explainability engine:', err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(formData);
  }, []);

  // Compute explainable scheme matches (merging backend recommendations with curated catalog)
  const computeExplainableSchemes = () => {
    const area = parseFloat(formData.land_area) || 0;
    const ha = formData.land_unit === 'acres' ? area * 0.404686 : area;
    const age = parseInt(formData.age) || 35;
    const cropsList = formData.crops.map(c => c.crop.toLowerCase());
    const needsList = formData.needs;

    return SCHEMES.map(scheme => {
      // Backend recommendation match override if present
      const backendMatch = backendRecommendations?.find(b => b.scheme_id === scheme.id);

      const explanations = [];
      let isEligible = true;
      let matchScore = 100;

      // 1. State Rule
      if (scheme.states && scheme.states.length > 0) {
        if (scheme.states.includes(formData.state)) {
          explanations.push(`✓ State Location: Located in ${formData.state}, fully eligible for state benefits.`);
        } else {
          isEligible = false;
          matchScore -= 40;
          explanations.push(`✗ State Location: Scheme is restricted to ${scheme.states.join(', ')}.`);
        }
      } else {
        explanations.push(`✓ Geographic Scope: Pan-India Central Scheme applicable across all states.`);
      }

      // 2. Land Size Rule
      if (scheme.maxHa) {
        if (ha <= scheme.maxHa) {
          explanations.push(`✓ Landholding: ${formData.land_area} ${formData.land_unit} (${ha.toFixed(2)} ha) satisfies limit (≤ ${scheme.maxHa} ha).`);
        } else {
          isEligible = false;
          matchScore -= 30;
          explanations.push(`✗ Landholding: Requires land holding ≤ ${scheme.maxHa} ha, current is ${ha.toFixed(2)} ha.`);
        }
      } else {
        explanations.push(`✓ Landholding: Open to all landholding sizes (small, marginal, and large).`);
      }

      // 3. Age Rule
      if (scheme.minAge || scheme.maxAge) {
        const minA = scheme.minAge || 18;
        const maxA = scheme.maxAge || 60;
        if (age >= minA && age <= maxA) {
          explanations.push(`✓ Age Requirement: Age ${age} meets the required window (${minA} to ${maxA} years).`);
        } else {
          isEligible = false;
          matchScore -= 30;
          explanations.push(`✗ Age: Requires age between ${minA} and ${maxA} years (current: ${age}).`);
        }
      }

      // 4. Caste / Audience Rule
      if (scheme.audience && scheme.audience.length > 0) {
        const catMatch = scheme.audience.includes(formData.category.toLowerCase()) ||
          (scheme.audience.includes('women') && formData.gender.toLowerCase() === 'female');
        if (catMatch) {
          explanations.push(`✓ Beneficiary Category: Member of ${formData.category} qualifies for exclusive targeted allocation.`);
        } else {
          matchScore -= 25;
          explanations.push(`ℹ Category: Special priority given to ${scheme.audience.join(', ').toUpperCase()} categories.`);
        }
      } else {
        explanations.push(`✓ Social Category: Universal DBT scheme across all social categories (${formData.category}).`);
      }

      // 5. Crop Relevance
      if (scheme.category === 'insurance') {
        const hasNotified = cropsList.some(c => ['cotton', 'soybean', 'wheat', 'rice', 'sugarcane', 'maize', 'gram', 'onion'].some(nc => c.includes(nc)));
        if (hasNotified) {
          explanations.push(`✓ Crop Coverage: Cultivates notified crops (${formData.crops.map(c => c.crop).join(', ')}) insured under PMFBY.`);
        } else {
          explanations.push(`✓ Crop Coverage: Applicable across notified Kharif and Rabi food grains and commercial crops.`);
        }
      }

      // 6. Farmer Need Alignment
      const needMatched = needsList.includes(scheme.category) || needsList.includes('all');
      if (needMatched) {
        explanations.push(`✓ Direct Alignment: Specifically addresses your selected priority need for ${scheme.category.replace('_', ' ').toUpperCase()}.`);
        matchScore = Math.min(100, matchScore + 10);
      }

      // Use backend explanations if available
      const finalExplanations = backendMatch?.explanations?.length
        ? backendMatch.explanations
        : explanations;

      const finalScore = backendMatch ? backendMatch.match_score : Math.max(0, matchScore);
      const matchStatus = finalScore >= 80 ? 'Eligible' : finalScore >= 50 ? 'Partial Match' : 'Not Eligible';
      const confidenceScore = backendMatch?.confidence_score || (finalScore >= 85 ? 0.98 : finalScore >= 50 ? 0.76 : 0.25);
      const modelName = backendMatch?.model_name || "Explainable Decision Tree (CART)";

      return {
        ...scheme,
        matchStatus,
        matchScore: finalScore,
        confidenceScore,
        modelName,
        explanations: finalExplanations,
        needMatched,
        benefit: backendMatch?.benefit || scheme[`benefit_${language}`] || scheme.benefit_en,
        name: scheme[`name_${language}`] || scheme.name_en,
        documents: backendMatch?.documents || ['Aadhaar Card', '7/12 Land Record', 'Bank Passbook with Aadhaar Link'],
      };
    });
  };


  const allRecommendations = computeExplainableSchemes();

  // Filter schemes
  const filteredSchemes = allRecommendations.filter(s => {
    if (s.matchScore < 45) return false;
    if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.benefit.toLowerCase().includes(q) ||
        s.source_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const eligibleCount = allRecommendations.filter(s => s.matchStatus === 'Eligible').length;

  const CATEGORIES = [
    { id: 'all', label: language === 'hi' ? 'सभी योजनाएं' : language === 'mr' ? 'सर्व योजना' : 'All Schemes' },
    { id: 'financial', label: language === 'hi' ? 'वित्तीय DBT' : language === 'mr' ? 'थेट आर्थिक DBT' : 'Financial DBT' },
    { id: 'farm_machinery', label: language === 'hi' ? 'कृषि यंत्रीकरण' : language === 'mr' ? 'कृषी यांत्रिकीकरण' : 'Farm Machinery' },
    { id: 'irrigation', label: language === 'hi' ? 'सिंचाई एवं सौर पंप' : language === 'mr' ? 'सिंचन व सौर पंप' : 'Irrigation & Solar' },
    { id: 'insurance', label: language === 'hi' ? 'फसल बीमा' : language === 'mr' ? 'पीक विमा' : 'Crop Insurance' },
    { id: 'organic', label: language === 'hi' ? 'जैविक खेती' : language === 'mr' ? 'सेंद्रिय शेती' : 'Organic Farming' },
    { id: 'loans', label: language === 'hi' ? 'ऋण एवं केसीसी' : language === 'mr' ? 'कर्ज व केसीसी' : 'Loans & KCC' },
    { id: 'crop_support', label: language === 'hi' ? 'मृदा एवं फसल सहायता' : language === 'mr' ? 'माती व पीक सहाय्य' : 'Soil & Crop Support' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-xl border border-green-200 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Marketplace</span>
          </Link>
          <div className="h-7 w-px bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 text-white flex items-center justify-center shadow-sm">
              <User size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-oswald font-bold text-gray-900 leading-tight">
                  {formData.name || (isSeller ? 'Seller Profile' : 'Farmer Profile')}
                </h1>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                  isSeller
                    ? 'bg-yellow-100 text-yellow-900 border-yellow-300'
                    : 'bg-green-100 text-green-800 border-green-200'
                }`}>
                  {isSeller ? 'Verified Seller' : 'Verified Farmer'}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-work-sans">
                {isSeller && profile?.business_name ? `${profile.business_name} • ` : ''}
                {formData.village}, {formData.taluka}, {formData.district}, {formData.state}
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3 self-end md:self-center">
          {/* Seller Dashboard Quick Link if Seller */}
          {isSeller && (
            <Link
              to="/seller"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 px-3 py-2 rounded-xl border border-amber-300 transition-colors shadow-xs"
            >
              <Store size={15} />
              <span>Seller Products Dashboard</span>
            </Link>
          )}

          {/* Language Switcher */}
          <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-200">
            <Globe size={15} className="text-gray-400 ml-1.5" />
            {['en', 'hi', 'mr'].map((langCode) => (
              <button
                key={langCode}
                type="button"
                onClick={() => handleLanguageChange(langCode)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === langCode
                    ? 'bg-green-700 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {langCode.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Quick tab switcher pill */}
          <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-white text-green-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User size={14} />
              <span>{language === 'hi' ? 'प्रोफ़ाइल विवरण' : language === 'mr' ? 'प्रोफाइल तपशील' : 'Profile & Farm'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schemes')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'schemes'
                  ? 'bg-green-700 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles size={14} />
              <span>{language === 'hi' ? 'अनुशंसित योजनाएं' : language === 'mr' ? 'पात्र योजना' : 'Recommended Schemes'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${activeTab === 'schemes' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                {eligibleCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Seller Notification Banner when Seller is on Dashboard */}
      {isSeller && (
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 text-gray-950 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-work-sans border border-amber-300">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-gray-950 text-yellow-300 rounded-xl shadow-xs">
              <Store size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-oswald font-bold text-base text-gray-950 tracking-wide uppercase">
                  Seller Central Active: {profile?.business_name || formData.name || 'Verified Dealer'}
                </span>
                <span className="bg-gray-950 text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Dealer Portal
                </span>
              </div>
              <p className="text-xs text-gray-900 font-medium mt-0.5">
                You are logged in as a registered agricultural dealer ({formData.email || user?.email}). View and manage your listed products, stock inventory, received orders, and buyer bargains in Seller Central.
              </p>
            </div>
          </div>

          <Link
            to="/seller"
            className="inline-flex items-center gap-2 bg-gray-950 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all shrink-0"
          >
            <span>View My Products & Dashboard</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      )}


      {/* Main Tab 1: Profile & Demographics Management */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Top Info Banner */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
                <Compass size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 font-oswald">
                  {language === 'hi' ? 'स्मार्ट किसान प्रोफाइल और योजना पात्रता डेटा' : language === 'mr' ? 'स्मार्ट शेतकरी प्रोफाइल आणि योजना पात्रता माहिती' : 'Smart Farmer Profile & Scheme Eligibility Data'}
                </h3>
                <p className="text-xs text-gray-600 font-work-sans">
                  {language === 'hi'
                    ? 'अपनी व्यक्तिगत, भूमि, आय और फसल संबंधी जानकारी भरें ताकि हमारा ML मॉडल आपको 100% सटीक और पारदर्शी योजनाएं सुझा सके।'
                    : language === 'mr'
                    ? 'आपली वैयक्तिक, जमीन, उत्पन्न आणि पीक माहिती भरा जेणेकरून आमचे ML मॉडेल आपल्याला अचूक योजनांची शिफारस करू शकेल.'
                    : 'Keep your agricultural and demographic profile updated to enable explainable DBT scheme matching tailored to your farm.'}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-50 shrink-0"
            >
              <Save size={15} />
              <span>{isSaving ? 'Saving...' : language === 'hi' ? 'प्रोफ़ाइल सहेजें' : language === 'mr' ? 'प्रोफाइल जतन करा' : 'Save & Sync Profile'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section 1: Personal & Demographics */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
                <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
                  <User size={18} />
                </div>
                <h3 className="font-oswald font-bold text-gray-900 text-base">
                  1. {language === 'hi' ? 'व्यक्तिगत विवरण' : language === 'mr' ? 'वैयक्तिक माहिती' : 'Personal & Identity Details'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-work-sans">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {language === 'hi' ? 'पूरा नाम' : language === 'mr' ? 'पूर्ण नाव' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    placeholder="e.g. Ramesh Baburao Patil"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {language === 'hi' ? 'ईमेल पता' : language === 'mr' ? 'ईमेल पत्ता' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="farmer@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {language === 'hi' ? 'मोबाइल नंबर' : language === 'mr' ? 'मोबाईल नंबर' : 'Phone / Mobile'} *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {language === 'hi' ? 'उम्र (वर्ष)' : language === 'mr' ? 'वय (वर्षे)' : 'Age (Years)'} *
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    min="18"
                    max="95"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {language === 'hi' ? 'लिंग' : language === 'mr' ? 'लिंग' : 'Gender'}
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
                  >
                    <option value="Male">Male / पुरुष</option>
                    <option value="Female">Female / महिला (Special Subsidies)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {language === 'hi' ? 'सामाजिक वर्ग / जाति' : language === 'mr' ? 'सामाजिक प्रवर्ग / जात' : 'Social Category / Caste'} *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
                  >
                    <option value="General">General / खुला</option>
                    <option value="OBC">OBC (Other Backward Class)</option>
                    <option value="SC">SC (Scheduled Caste - 100% Well/Solar)</option>
                    <option value="ST">ST (Scheduled Tribe - Birsa Munda Grant)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Residence & Location */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
                <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
                  <MapPin size={18} />
                </div>
                <h3 className="font-oswald font-bold text-gray-900 text-base">
                  2. {language === 'hi' ? 'निवास एवं स्थान' : language === 'mr' ? 'निवास व स्थान' : 'Residence & Location'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-work-sans">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {language === 'hi' ? 'राज्य' : language === 'mr' ? 'राज्य' : 'State'} *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="Maharashtra">Maharashtra (MahaDBT Active)</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {language === 'hi' ? 'जिला' : language === 'mr' ? 'जिल्हा' : 'District'} *
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    placeholder="e.g. Amravati, Yavatmal, Pune"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {language === 'hi' ? 'तालुका / तहसील' : language === 'mr' ? 'तालुका' : 'Taluka / Tehsil'}
                  </label>
                  <input
                    type="text"
                    value={formData.taluka}
                    onChange={(e) => handleInputChange('taluka', e.target.value)}
                    placeholder="e.g. Achalpur, Chandur"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {language === 'hi' ? 'गाँव / ग्राम पंचायत' : language === 'mr' ? 'गाव / ग्रामपंचायत' : 'Village / Gram Panchayat'}
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => handleInputChange('village', e.target.value)}
                    placeholder="e.g. Dhamangaon, Belora"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-1">
                    {language === 'hi' ? 'पिन कोड' : language === 'mr' ? 'पिन कोड' : 'Postal PIN Code'}
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="e.g. 444806"
                    className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Farm & Land Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
                <div className="p-1.5 bg-green-50 text-green-700 rounded-lg">
                  <Tractor size={18} />
                </div>
                <h3 className="font-oswald font-bold text-gray-900 text-base">
                  3. {language === 'hi' ? 'खेत और भूमि विवरण' : language === 'mr' ? 'शेतजमीन माहिती' : 'Farm & Land Holding'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-work-sans">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {language === 'hi' ? 'भूमि का क्षेत्रफल' : language === 'mr' ? 'जमिनीचे क्षेत्रफळ' : 'Total Land Size'} *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={formData.land_area}
                      onChange={(e) => handleInputChange('land_area', e.target.value)}
                      className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none font-bold"
                    />
                    <select
                      value={formData.land_unit}
                      onChange={(e) => handleInputChange('land_unit', e.target.value)}
                      className="w-1/3 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="acres">Acres</option>
                      <option value="hectares">Hectares</option>
                    </select>
                  </div>
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    {parseFloat(formData.land_area) <= (formData.land_unit === 'acres' ? 5.0 : 2.0)
                      ? '✓ Small & Marginal Farmer (PM-KISAN / MahaDBT Priority)'
                      : 'Medium / Large Farmer category'}
                  </span>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {language === 'hi' ? 'भूमि का स्वामित्व' : language === 'mr' ? 'जमिनीची मालकी' : 'Ownership Type'}
                  </label>
                  <select
                    value={formData.ownership_type}
                    onChange={(e) => handleInputChange('ownership_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
                  >
                    <option value="Owner">Self-Owner (7/12 Holder)</option>
                    <option value="Tenant">Tenant Cultivator</option>
                    <option value="Sharecropper">Sharecropper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {language === 'hi' ? 'मिट्टी का प्रकार' : language === 'mr' ? 'मातीचा प्रकार' : 'Soil Type'}
                  </label>
                  <select
                    value={formData.soil_type}
                    onChange={(e) => handleInputChange('soil_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
                  >
                    <option value="Black">Black Cotton Soil (काली मिट्टी)</option>
                    <option value="Red">Red Soil (लाल मिट्टी)</option>
                    <option value="Alluvial">Alluvial Soil (जलोढ़ मिट्टी)</option>
                    <option value="Clay">Clay Loam (चिकनी बलुई)</option>
                    <option value="Sandy">Sandy Loam (बलुई मिट्टी)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {language === 'hi' ? 'सिंचाई की सुविधा' : language === 'mr' ? 'सिंचनाची सोय' : 'Irrigation Availability'}
                  </label>
                  <select
                    value={formData.irrigation_type}
                    onChange={(e) => handleInputChange('irrigation_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
                  >
                    <option value="Drip">Drip Irrigation (ठिबक सिंचन)</option>
                    <option value="Sprinkler">Sprinkler (तुषार सिंचन)</option>
                    <option value="Borewell">Borewell / Tube Well</option>
                    <option value="Well">Open Dug Well (विहीर)</option>
                    <option value="Canal">Canal Water (कालवा)</option>
                    <option value="Rainfed">Rainfed / None (कोरडवाहू)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Income & Financial Profile */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
                <div className="p-1.5 bg-purple-50 text-purple-700 rounded-lg">
                  <Landmark size={18} />
                </div>
                <h3 className="font-oswald font-bold text-gray-900 text-base">
                  4. {language === 'hi' ? 'आय एवं वित्तीय विवरण' : language === 'mr' ? 'उत्पन्न व आर्थिक माहिती' : 'Income & Financial Credentials'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-work-sans">
                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-1">
                    {language === 'hi' ? 'वार्षिक कृषि आय (₹)' : language === 'mr' ? 'वार्षिक शेती उत्पन्न (₹)' : 'Annual Farm Income (₹)'} *
                  </label>
                  <select
                    value={formData.annual_income}
                    onChange={(e) => handleInputChange('annual_income', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="80000">Below ₹1,00,000 (Low Income / High Subsidy Tier)</option>
                    <option value="150000">₹1,00,000 – ₹1,50,000 (Qualifies for Birsa Munda/Ambedkar Schemes)</option>
                    <option value="250000">₹1,50,000 – ₹2,50,000</option>
                    <option value="500000">₹2,50,000 – ₹5,00,000</option>
                    <option value="800000">Above ₹5,00,000</option>
                  </select>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">Kisan Credit Card (KCC)</p>
                    <p className="text-[11px] text-gray-500">Hold active KCC farm credit line</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.kcc_holder}
                    onChange={(e) => handleInputChange('kcc_holder', e.target.checked)}
                    className="h-4 w-4 text-green-600 rounded focus:ring-green-500"
                  />
                </div>

                <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">Aadhaar-Linked Bank</p>
                    <p className="text-[11px] text-gray-500">Direct DBT bank account seeded</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.aadhaar_linked_bank}
                    onChange={(e) => handleInputChange('aadhaar_linked_bank', e.target.checked)}
                    className="h-4 w-4 text-green-600 rounded focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Crops Cultivated */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                    <Sprout size={18} />
                  </div>
                  <h3 className="font-oswald font-bold text-gray-900 text-base">
                    5. {language === 'hi' ? 'बोई जाने वाली फसलें' : language === 'mr' ? 'पिकवली जाणारी पिके' : 'Crops Cultivated on Farm'}
                  </h3>
                </div>
                <span className="text-xs text-gray-500 font-work-sans">
                  {formData.crops.length} crops selected
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-gray-600 font-work-sans">
                  Select all crops you grow. These are matched with the National Food Security Mission, PMFBY crop insurance, and horticulture subsidies:
                </p>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_CROPS.map((cropName) => {
                    const isSelected = formData.crops.some(c => c.crop.toLowerCase() === cropName.toLowerCase());
                    return (
                      <button
                        key={cropName}
                        type="button"
                        onClick={() => toggleCrop(cropName)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-green-700 text-white border-green-700 shadow-sm'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-green-300'
                        }`}
                      >
                        {isSelected && <Check size={13} />}
                        <span>{cropName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 6: Assistance & Government Scheme Needs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-orange-50 text-orange-700 rounded-lg">
                    <Award size={18} />
                  </div>
                  <h3 className="font-oswald font-bold text-gray-900 text-base">
                    6. {language === 'hi' ? 'प्राथमिक सहायता आवश्यकताएं' : language === 'mr' ? 'प्राधान्य योजना गरजा' : 'Government Assistance Priority Needs'}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-work-sans">
                {[
                  { id: 'financial', label: 'Financial DBT Cash', desc: 'Direct ₹6k-₹12k bank transfer' },
                  { id: 'farm_machinery', label: 'Tractor / Machinery', desc: 'Up to 50% subsidy implements' },
                  { id: 'irrigation', label: 'Solar Pump / Drip', desc: '60% subsidy for wells & pumps' },
                  { id: 'insurance', label: 'Crop Loss Insurance', desc: 'PMFBY weather coverage' },
                  { id: 'organic', label: 'Organic Certification', desc: 'PKVY cluster funding' },
                  { id: 'seeds', label: 'Subsidized Seeds', desc: 'Certified seed kits' },
                  { id: 'loans', label: 'Crop Loans / KCC', desc: '4% concessional credit' },
                  { id: 'crop_support', label: 'Soil Health & Testing', desc: 'Free nutrient testing card' },
                ].map((item) => {
                  const isChecked = formData.needs.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleNeed(item.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-green-50/80 border-green-500 shadow-sm'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold ${isChecked ? 'text-green-800' : 'text-gray-800'}`}>
                          {item.label}
                        </span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent div
                          className="h-3.5 w-3.5 text-green-600 rounded"
                        />
                      </div>
                      <p className="text-[10px] text-gray-500">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-500 font-work-sans text-center sm:text-left">
              Data is securely processed under the DPDP Act guidelines to determine Direct Benefit Transfer eligibility.
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
              >
                <Save size={15} />
                <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSaveProfile();
                  setActiveTab('schemes');
                }}
                className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
              >
                <Sparkles size={15} />
                <span>View Eligible Schemes ({eligibleCount})</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Main Tab 2: Explainable Scheme Recommendation Viewer */}
      {activeTab === 'schemes' && (
        <div className="space-y-6">
          {/* Recommendation Overview Hero */}
          <div className="bg-gradient-to-br from-green-800 via-green-700 to-emerald-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-green-200 text-xs font-semibold border border-white/15">
                <Sparkles size={14} className="text-yellow-300" />
                <span>ML Model: Explainable Decision Tree (CART) & Multi-Attribute Ensemble (SRS 4.1)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-oswald font-bold tracking-wide">
                {language === 'hi'
                  ? `${formData.name || 'किसान'}, आपके लिए अनुशंसित सरकारी योजनाएं`
                  : language === 'mr'
                  ? `${formData.name || 'शेतकरी'}, आपल्यासाठी शिफारस केलेल्या सरकारी योजना`
                  : `Personalized Schemes for ${formData.name || 'Farmer'}`}
              </h2>
              <p className="text-xs sm:text-sm text-green-100 font-work-sans leading-relaxed">
                {language === 'hi'
                  ? 'आपकी भूमि, सामाजिक वर्ग और महाराष्ट्र राज्य के अनुसार Decision Tree ML मॉडल द्वारा तैयार की गई पारदर्शी योजना सूची।'
                  : language === 'mr'
                  ? 'Decision Tree ML मॉडेलद्वारे आपल्या शेती माहितीनुसार थेट बँक खात्यात मिळणाऱ्या योजनांची पारदर्शक माहिती.'
                  : `Classified via Decision Tree ML inference evaluated against your farm profile: ${formData.land_area} ${formData.land_unit}, ${formData.category} category in ${formData.state}. Each recommendation includes transparent eligibility explanations and direct government application links.`}
              </p>
            </div>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
                <span className="text-[10px] text-green-200 uppercase tracking-wider block font-semibold">
                  Eligible Schemes
                </span>
                <span className="text-2xl font-bold font-oswald text-white">
                  {eligibleCount} / {allRecommendations.length}
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
                <span className="text-[10px] text-green-200 uppercase tracking-wider block font-semibold">
                  Max Financial Value
                </span>
                <span className="text-2xl font-bold font-oswald text-emerald-300">
                  ₹2,50,000+
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
                <span className="text-[10px] text-green-200 uppercase tracking-wider block font-semibold">
                  ML Algorithm
                </span>
                <span className="text-sm font-bold font-oswald text-white block mt-1">
                  CART Decision Tree
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
                <span className="text-[10px] text-green-200 uppercase tracking-wider block font-semibold">
                  Profile Completeness
                </span>
                <span className="text-2xl font-bold font-oswald text-yellow-300">
                  95%
                </span>
              </div>
            </div>
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search schemes by name or benefit..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-gray-500 font-work-sans">
                <span>Showing <strong>{filteredSchemes.length}</strong> matching schemes</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className="text-green-700 font-semibold hover:underline ml-2"
                >
                  Edit Farm Profile ✎
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs font-work-sans">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-green-700 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scheme Recommendation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200/90 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="p-5 space-y-4">
                  {/* Card Header with Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          scheme.level === 'central'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {scheme.level === 'central' ? 'Central Scheme' : 'Maharashtra State'}
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200 capitalize">
                          {scheme.category.replace('_', ' ')}
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          Decision Tree ML
                        </span>

                        {scheme.needMatched && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ★ High Priority Match
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-gray-900 font-oswald leading-snug">
                        {scheme.name}
                      </h3>
                    </div>

                    {/* Match Score Badge */}
                    <div className="text-right shrink-0">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold ${
                        scheme.matchStatus === 'Eligible'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        <CheckCircle2 size={13} />
                        <span>{scheme.matchScore}% Match</span>
                      </span>
                      <span className="block text-[10px] text-gray-400 font-work-sans mt-0.5">
                        {Math.round(scheme.confidenceScore * 100)}% ML Confidence
                      </span>
                    </div>
                  </div>

                  {/* Benefit Highlight Box */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50/50 border border-green-200/90 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <IndianRupee size={16} className="text-green-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-bold text-green-900 uppercase tracking-wider">
                          Key Benefit / Subsidy:
                        </p>
                        <p className="text-xs font-semibold text-gray-900 font-work-sans mt-0.5 leading-snug">
                          {scheme.benefit}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* EXPLAINABILITY ENGINE BREAKDOWN (SRS REQ-4.1) */}
                  <div className="bg-gray-50 border border-gray-200/90 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 font-work-sans">
                      <ShieldCheck size={14} className="text-green-600" />
                      <span>Why You Are Eligible (Decision Tree Inference Path):</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-gray-700 font-work-sans">
                      {scheme.explanations.slice(0, 4).map((expl, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-tight">
                          <span className={expl.startsWith('✓') ? 'text-green-600 font-bold' : expl.startsWith('✗') ? 'text-red-500 font-bold' : 'text-amber-600 font-bold'}>
                            {expl.slice(0, 1)}
                          </span>
                          <span>{expl.slice(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Required Documents Pills */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold text-gray-500 font-work-sans flex items-center gap-1">
                      <FileText size={12} />
                      <span>Required Documents:</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {scheme.documents.map((doc, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-medium border border-gray-200"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="bg-gray-50 border-t border-gray-100 p-3.5 px-5 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-gray-500 font-work-sans truncate">
                    Source: {scheme.source_name}
                  </span>

                  <a
                    href={scheme.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition-all shrink-0"
                  >
                    <span>Apply on Portal</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredSchemes.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center border border-gray-200 space-y-3">
              <AlertCircle size={36} className="mx-auto text-gray-400" />
              <h3 className="font-oswald text-lg font-bold text-gray-900">
                No matching schemes found for this filter
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try selecting "All Schemes" or updating your land holding, category, and state details in your profile.
              </p>
              <button
                type="button"
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="px-4 py-2 bg-green-700 text-white text-xs font-semibold rounded-xl"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
