import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import { ProgressStepper } from '../components/ProgressStepper';
import { VoiceInputButton } from '../components/VoiceInputButton';
import { FieldLabel } from '../components/FieldLabel';
import { ListenButton } from '../components/ListenButton';
import { LanguageSelector } from '../components/LanguageSelector';
import { Leaf, ChevronRight, ChevronLeft } from 'lucide-react';

// ─── Step 1: About You ────────────────────────────────────────────────
const StepAboutYou: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { t } = useLanguage();
  const { farmer, updateFarmer } = useFarmer();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!farmer.name.trim()) e.name = t('required_field');
    if (!farmer.age) e.age = t('required_field');
    if (!farmer.gender) e.gender = t('required_field');
    if (!farmer.category) e.category = t('required_field');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6"><ListenButton size="md" text={t('onboarding_title')} /><h2 className="text-xl md:text-2xl font-bold text-gray-800">{t('onboarding_title')}</h2></div>

      <div className="mb-5">
        <FieldLabel className="block text-base font-semibold text-gray-700 mb-2" text={t('name_label')} />
        <input
          type="text"
          value={farmer.name}
          onChange={e => updateFarmer({ name: e.target.value })}
          placeholder={t('name_placeholder')}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:border-green-500 focus:outline-none"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        <VoiceInputButton
          className="mt-2"
          size="sm"
          onTranscript={(text) => updateFarmer({ name: text })}
        />
      </div>

      <div className="mb-5">
        <FieldLabel className="block text-base font-semibold text-gray-700 mb-2" text={t('age_label')} />
        <input
          type="number"
          value={farmer.age}
          onChange={e => updateFarmer({ age: e.target.value })}
          placeholder={t('age_placeholder')}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:border-green-500 focus:outline-none"
          min="18" max="100"
        />
        {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
      </div>

      <div className="mb-5">
        <FieldLabel className="block text-base font-semibold text-gray-700 mb-2" text={t('gender_label')} />
        <div className="flex gap-3">
          {['male', 'female', 'other'].map(g => (
            <button
              key={g}
              onClick={() => updateFarmer({ gender: g })}
              className={`flex-1 py-3 rounded-xl border-2 font-semibold text-base transition-all ${
                farmer.gender === g
                  ? 'bg-green-600 text-white border-green-600'
                  : 'border-gray-200 text-gray-700 hover:border-green-300'
              }`}
            >
              {t(`gender_${g}`)}
            </button>
          ))}
        </div>
        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
      </div>

      <div className="mb-6">
        <FieldLabel className="block text-base font-semibold text-gray-700 mb-2" text={t('category_label')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['marginal', 'small', 'medium', 'large', 'women', 'sc'].map(cat => (
            <button
              key={cat}
              onClick={() => updateFarmer({ category: cat })}
              className={`py-3 px-4 rounded-xl border-2 font-medium text-left transition-all ${
                farmer.category === cat
                  ? 'bg-green-600 text-white border-green-600'
                  : 'border-gray-200 text-gray-700 hover:border-green-300 bg-white'
              }`}
            >
              {t(`cat_${cat}`)}
            </button>
          ))}
        </div>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      <button
        onClick={() => validate() && onNext()}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl text-xl flex items-center justify-center gap-2 transition-all"
      >
        {t('next')} <ChevronRight size={22} />
      </button>
    </div>
  );
};

// ─── Step 2: Location ─────────────────────────────────────────────────
const MAHARASHTRA_DISTRICTS = [
  'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara',
  'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli',
  'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban',
  'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar',
  'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara',
  'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal',
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const StepLocation: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { t } = useLanguage();
  const { farmer, updateFarmer } = useFarmer();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!farmer.state) e.state = t('required_field');
    if (!farmer.district) e.district = t('required_field');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const districts = farmer.state === 'Maharashtra' ? MAHARASHTRA_DISTRICTS : [];

  return (
    <div>
      <div className="flex items-center gap-2 mb-6"><ListenButton size="md" text={t('loc_title')} /><h2 className="text-xl md:text-2xl font-bold text-gray-800">{t('loc_title')}</h2></div>

      <div className="mb-5">
        <FieldLabel className="block text-base font-semibold text-gray-700 mb-2" text={t('state_label')} />
        <select
          value={farmer.state}
          onChange={e => { updateFarmer({ state: e.target.value, district: '' }); }}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:border-green-500 focus:outline-none bg-white"
        >
          <option value="">{t('state_placeholder')}</option>
          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
      </div>

      <div className="mb-5">
        <FieldLabel className="block text-base font-semibold text-gray-700 mb-2" text={t('district_label')} />
        {farmer.state === 'Maharashtra' ? (
          <select
            value={farmer.district}
            onChange={e => updateFarmer({ district: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:border-green-500 focus:outline-none bg-white"
          >
            <option value="">{t('district_placeholder')}</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        ) : (
          <input
            type="text"
            value={farmer.district}
            onChange={e => updateFarmer({ district: e.target.value })}
            placeholder={t('district_placeholder')}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:border-green-500 focus:outline-none"
          />
        )}
        {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
      </div>

      <div className="mb-5">
        <FieldLabel className="block text-base font-semibold text-gray-700 mb-2" text={t('taluka_label')} />
        <input
          type="text"
          value={farmer.taluka}
          onChange={e => updateFarmer({ taluka: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:border-green-500 focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <FieldLabel className="block text-base font-semibold text-gray-700 mb-2" text={t('village_label')} />
        <input
          type="text"
          value={farmer.village}
          onChange={e => updateFarmer({ village: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:border-green-500 focus:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-2xl text-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
          <ChevronLeft size={22} /> {t('back')}
        </button>
        <button onClick={() => validate() && onNext()} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl text-xl flex items-center justify-center gap-2 transition-all">
          {t('next')} <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
};

// ─── Step 3: Farm ─────────────────────────────────────────────────────
const StepFarm: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { t } = useLanguage();
  const { farmer, updateFarmer } = useFarmer();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!farmer.land_area) e.land_area = t('required_field');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6"><ListenButton size="md" text={t('farm_title')} /><h2 className="text-xl md:text-2xl font-bold text-gray-800">{t('farm_title')}</h2></div>

      <div className="mb-5">
        <FieldLabel className="block text-base font-semibold text-gray-700 mb-2" text={t('land_area_label')} />
        <div className="flex gap-3">
          <input
            type="number"
            value={farmer.land_area}
            onChange={e => updateFarmer({ land_area: e.target.value })}
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:border-green-500 focus:outline-none"
            min="0.1" step="0.1"
          />
          <select
            value={farmer.land_unit}
            onChange={e => updateFarmer({ land_unit: e.target.value })}
            className="border-2 border-gray-200 rounded-xl px-3 py-3 text-lg focus:border-green-500 focus:outline-none bg-white"
          >
            <option value="acres">{t('acres')}</option>
            <option value="hectares">{t('hectares')}</option>
          </select>
        </div>
        {errors.land_area && <p className="text-red-500 text-sm mt-1">{errors.land_area}</p>}
        <VoiceInputButton className="mt-2" size="sm"
          prompt="🎤 Tell us your land area"
          onTranscript={(text) => {
            const match = text.match(/(\d+(\.\d+)?)/);
            if (match) updateFarmer({ land_area: match[1] });
          }}
        />
      </div>

      <div className="mb-5">
        <FieldLabel className="block text-base font-semibold text-gray-700 mb-3" text={t('irrigation_label')} />
        <div className="flex gap-3">
          {[true, false].map(val => (
            <button
              key={String(val)}
              onClick={() => updateFarmer({ irrigation_availability: val })}
              className={`flex-1 py-3 rounded-xl border-2 font-bold text-lg transition-all ${
                farmer.irrigation_availability === val
                  ? 'bg-green-600 text-white border-green-600'
                  : 'border-gray-200 text-gray-700 hover:border-green-300'
              }`}
            >
              {val ? t('yes') : t('no')}
            </button>
          ))}
        </div>
      </div>

      {farmer.irrigation_availability && (
        <div className="mb-5">
          <FieldLabel className="block text-base font-semibold text-gray-700 mb-2" text={t('irrigation_type_label')} />
          <div className="grid grid-cols-2 gap-3">
            {['drip', 'sprinkler', 'canal', 'well'].map(type => (
              <button
                key={type}
                onClick={() => updateFarmer({ irrigation_type: type })}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  farmer.irrigation_type === type
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-200 text-gray-700 hover:border-blue-300 bg-white'
                }`}
              >
                {t(type)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-2xl text-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
          <ChevronLeft size={22} /> {t('back')}
        </button>
        <button onClick={() => validate() && onNext()} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl text-xl flex items-center justify-center gap-2 transition-all">
          {t('next')} <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
};

// ─── Step 4: Crops ────────────────────────────────────────────────────
const StepCrops: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { t } = useLanguage();
  const { farmer, updateFarmer } = useFarmer();

  const updateCrop = (idx: number, field: string, value: string) => {
    const crops = [...farmer.crops];
    crops[idx] = { ...crops[idx], [field]: value };
    updateFarmer({ crops });
  };

  const addCrop = () => {
    updateFarmer({ crops: [...farmer.crops, { crop: '', season: '', cultivated_area: '' }] });
  };

  const removeCrop = (idx: number) => {
    if (farmer.crops.length > 1) {
      updateFarmer({ crops: farmer.crops.filter((_, i) => i !== idx) });
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6"><ListenButton size="md" text={t('crop_title')} /><h2 className="text-xl md:text-2xl font-bold text-gray-800">{t('crop_title')}</h2></div>

      {farmer.crops.map((crop, idx) => (
        <div key={idx} className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-700">Crop {idx + 1}</span>
            {farmer.crops.length > 1 && (
              <button onClick={() => removeCrop(idx)} className="text-red-400 hover:text-red-600 text-sm font-medium">
                ✕ Remove
              </button>
            )}
          </div>

          <div className="mb-3">
            <FieldLabel className="block text-sm font-medium text-gray-600 mb-1" text={t('crop_label')} />
            <input
              type="text"
              value={crop.crop}
              onChange={e => updateCrop(idx, 'crop', e.target.value)}
              placeholder={t('crop_placeholder')}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 focus:border-green-500 focus:outline-none"
            />
          </div>

          <div className="mb-3">
            <FieldLabel className="block text-sm font-medium text-gray-600 mb-1" text={t('season_label')} />
            <div className="grid grid-cols-2 gap-2">
              {['kharif', 'rabi', 'zaid', 'perennial'].map(s => (
                <button
                  key={s}
                  onClick={() => updateCrop(idx, 'season', s)}
                  className={`py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    crop.season === s
                      ? 'bg-green-500 text-white border-green-500'
                      : 'border-gray-200 text-gray-600 hover:border-green-300'
                  }`}
                >
                  {t(s)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <FieldLabel className="block text-sm font-medium text-gray-600 mb-1" text={t('area_label')} />
            <input
              type="number"
              value={crop.cultivated_area}
              onChange={e => updateCrop(idx, 'cultivated_area', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 focus:border-green-500 focus:outline-none"
              min="0" step="0.1"
            />
          </div>
        </div>
      ))}

      <button onClick={addCrop} className="w-full border-2 border-dashed border-green-300 text-green-700 font-semibold py-3 rounded-2xl mb-6 hover:bg-green-50 transition-all">
        {t('add_crop')}
      </button>

      <VoiceInputButton className="mb-4" size="sm"
        prompt="🎤 Tell us which crops you grow"
        onTranscript={(text) => {
          const crops = [...farmer.crops];
          crops[0] = { ...crops[0], crop: text };
          updateFarmer({ crops });
        }}
      />

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-2xl text-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
          <ChevronLeft size={22} /> {t('back')}
        </button>
        <button onClick={onNext} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl text-xl flex items-center justify-center gap-2 transition-all">
          {t('next')} <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
};

// ─── Step 5: Farmer Need ──────────────────────────────────────────────
const NEED_CATEGORIES = [
  { key: 'need_seeds', value: 'seeds', emoji: '🌱' },
  { key: 'need_irrigation', value: 'irrigation', emoji: '💧' },
  { key: 'need_machinery', value: 'farm_machinery', emoji: '🚜' },
  { key: 'need_financial', value: 'financial', emoji: '💰' },
  { key: 'need_crop_support', value: 'crop_support', emoji: '🌾' },
  { key: 'need_insurance', value: 'insurance', emoji: '🛡️' },
  { key: 'need_organic', value: 'organic', emoji: '🍃' },
  { key: 'need_horticulture', value: 'horticulture', emoji: '🍎' },
  { key: 'need_processing', value: 'processing', emoji: '🏭' },
  { key: 'need_loans', value: 'loans', emoji: '🏦' },
  { key: 'need_training', value: 'training', emoji: '📚' },
  { key: 'need_all', value: 'all', emoji: '📋' },
];

const StepNeed: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { t } = useLanguage();
  const { farmer, updateFarmer } = useFarmer();

  const toggleNeed = (value: string) => {
    if (value === 'all') {
      updateFarmer({ needs: ['all'] });
      return;
    }
    const current = farmer.needs.filter(n => n !== 'all');
    if (current.includes(value)) {
      updateFarmer({ needs: current.filter(n => n !== value) });
    } else {
      updateFarmer({ needs: [...current, value] });
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2"><ListenButton size="md" text={t('need_title')} /><h2 className="text-xl md:text-2xl font-bold text-gray-800">{t('need_title')}</h2></div>
      <p className="text-gray-500 mb-5 flex items-center gap-2"><ListenButton text={t('need_sub')} />{t('need_sub')}</p>

      <VoiceInputButton className="mb-5" size="md"
        prompt="🎤 Tell us what you need"
        onTranscript={(text) => {
          const lower = text.toLowerCase();
          if (lower.includes('machine') || lower.includes('tractor') || lower.includes('यंत्र')) {
            toggleNeed('farm_machinery');
          } else if (lower.includes('seed') || lower.includes('बीज') || lower.includes('बियाणे')) {
            toggleNeed('seeds');
          } else if (lower.includes('loan') || lower.includes('कर्ज')) {
            toggleNeed('loans');
          } else if (lower.includes('irrigat') || lower.includes('सिंचन')) {
            toggleNeed('irrigation');
          }
        }}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {NEED_CATEGORIES.map(({ key, value, emoji }) => {
          const selected = farmer.needs.includes(value);
          return (
            <button
              key={value}
              onClick={() => toggleNeed(value)}
              className={`py-4 px-3 rounded-2xl border-2 font-semibold text-center transition-all flex flex-col items-center gap-1 ${
                selected
                  ? 'bg-green-600 text-white border-green-600 shadow-lg scale-105'
                  : 'border-gray-200 text-gray-700 hover:border-green-300 bg-white hover:bg-green-50'
              }`}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-sm leading-tight">{t(key)}</span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-2xl text-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
          <ChevronLeft size={22} /> {t('back')}
        </button>
        <button
          onClick={onNext}
          disabled={farmer.needs.length === 0}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl text-xl flex items-center justify-center gap-2 transition-all"
        >
          {t('find_matching')}
        </button>
      </div>
    </div>
  );
};

// ─── Main Onboarding Page ─────────────────────────────────────────────
export const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const steps = [
    t('step_you'),
    t('step_location'),
    t('step_farm'),
    t('step_crop'),
    t('step_need'),
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else navigate('/schemes');
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-white border-b border-green-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-green-700 font-bold text-lg">
            <Leaf size={22} /> {t('app_name')}
          </button>
          <LanguageSelector />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <ProgressStepper steps={steps} currentStep={step} />

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          {step === 0 && <StepAboutYou onNext={handleNext} />}
          {step === 1 && <StepLocation onNext={handleNext} onBack={handleBack} />}
          {step === 2 && <StepFarm onNext={handleNext} onBack={handleBack} />}
          {step === 3 && <StepCrops onNext={handleNext} onBack={handleBack} />}
          {step === 4 && <StepNeed onNext={handleNext} onBack={handleBack} />}
        </div>
      </div>
    </div>
  );
};
