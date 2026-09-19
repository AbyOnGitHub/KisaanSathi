import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { SCHEMES } from '../data/schemes';
import { ChevronLeft, CheckCircle, ExternalLink } from 'lucide-react';

const SCHEME_OFFICIAL_URLS: Record<string, string> = {
  // Deep-linked to the Farmer login page directly — the bare domain
  // (mahadbt.maharashtra.gov.in) bounces through a generic landing
  // redirect that can loop for some users. This URL goes straight in.
  '1': 'https://mahadbt.maharashtra.gov.in/Farmer/AgriLogin/AgriLogin',
  '2': 'https://pmkisan.gov.in',
  '3': 'https://pmfby.gov.in',
};

const SCHEME_NAMES: Record<string, Record<string, string>> = {
  '1': { en: 'Farm Mechanization Assistance', hi: 'कृषि यंत्रीकरण सहायता', mr: 'कृषी यांत्रिकीकरण योजना' },
  '2': { en: 'PM Kisan Samman Nidhi', hi: 'पीएम किसान सम्मान निधि', mr: 'पीएम किसान सन्मान निधी' },
  '3': { en: 'Pradhan Mantri Fasal Bima Yojana', hi: 'प्रधानमंत्री फसल बीमा योजना', mr: 'प्रधानमंत्री पीक विमा योजना' },
};

export const ApplicationReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  const { farmer } = useFarmer();

  const state = location.state as { answers?: Record<string, string>; scheme_id?: string } | null;
  const answers = state?.answers || {};
  const cat = SCHEMES.find(x => x.id === id);
  const officialUrl = id ? (SCHEME_OFFICIAL_URLS[id] || cat?.source_url || '#') : '#';
  const schemeName = id ? (SCHEME_NAMES[id]?.[language] || SCHEME_NAMES[id]?.en || (cat && ((cat as any)[`name_${language}`] || cat.name_en)) || 'Scheme') : 'Unknown Scheme';

  const ReviewSection: React.FC<{ title: string; items: { label: string; value: string }[] }> = ({
    title, items,
  }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">{title}</h3>
      <div className="flex flex-col gap-2">
        {items.filter(i => i.value).map(({ label, value }) => (
          <div key={label} className="flex justify-between items-start gap-4">
            <span className="text-sm text-gray-500 min-w-24">{label}</span>
            <span className="text-sm font-medium text-gray-800 text-right flex-1">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-green-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-green-700 font-bold">
            <ChevronLeft size={20} /> {t('back')}
          </button>
          <LanguageSelector />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle size={32} className="text-green-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('review_title')}</h1>
            <p className="text-gray-500 text-sm">{schemeName}</p>
          </div>
        </div>

        <ReviewSection
          title="Personal Information"
          items={[
            { label: 'Name', value: farmer.name },
            { label: 'Age', value: farmer.age },
            { label: 'Gender', value: farmer.gender },
            { label: 'Category', value: farmer.category },
          ]}
        />

        <ReviewSection
          title="Location"
          items={[
            { label: 'State', value: farmer.state },
            { label: 'District', value: farmer.district },
            { label: 'Taluka', value: farmer.taluka },
            { label: 'Village', value: farmer.village },
          ]}
        />

        <ReviewSection
          title="Farm"
          items={[
            { label: 'Land Area', value: `${farmer.land_area} ${farmer.land_unit}` },
            { label: 'Irrigation', value: farmer.irrigation_availability ? 'Yes' : 'No' },
            { label: 'Irrigation Type', value: farmer.irrigation_type },
          ]}
        />

        {farmer.crops.length > 0 && (
          <ReviewSection
            title="Crops"
            items={farmer.crops.map((c, i) => ({
              label: `Crop ${i + 1}`,
              value: `${c.crop} (${c.season})${c.cultivated_area ? ` — ${c.cultivated_area} acres` : ''}`,
            }))}
          />
        )}

        {Object.keys(answers).length > 0 && (
          <ReviewSection
            title="Application Answers"
            items={Object.entries(answers).map(([key, val]) => ({
              label: key.replace(/_/g, ' '),
              value: val,
            }))}
          />
        )}

        {/* Official portal notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
          <p className="text-blue-800 font-semibold mb-1">{t('official_notice')}</p>
          <p className="text-blue-600 text-sm mb-1">{officialUrl}</p>
          <p className="text-blue-700 text-sm">
            You will be redirected to the official government website to complete your application. Keep your documents ready.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-5 rounded-2xl text-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <ExternalLink size={22} />
            {t('go_official')}
          </a>
          <button
            onClick={() => navigate(`/schemes/${id}/apply`)}
            className="w-full border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-2xl text-lg hover:bg-gray-50 transition-all"
          >
            {t('edit')} Application
          </button>
        </div>
      </div>
    </div>
  );
};
