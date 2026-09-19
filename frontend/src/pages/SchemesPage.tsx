import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { useTTS } from '../hooks/useTTS';
import { Leaf, CheckCircle, AlertCircle, Clock, ChevronRight, Volume2 } from 'lucide-react';

// Mock data — will be replaced by API calls once backend is running
const MOCK_SCHEMES = [
  {
    id: '1',
    name_en: 'Farm Mechanization Assistance',
    name_hi: 'कृषि यंत्रीकरण सहायता',
    name_mr: 'कृषी यांत्रिकीकरण योजना',
    category: 'farm_machinery',
    match_status: 'potentially_eligible',
    match_score: 0.9,
    benefit_en: 'Up to 50% subsidy on tractor, power tiller, and farm implements. Max ₹1,00,000.',
    benefit_hi: 'ट्रैक्टर, पावर टिलर पर 50% तक सब्सिडी। अधिकतम ₹1,00,000.',
    benefit_mr: 'ट्रॅक्टर, पॉवर टिलरवर 50% पर्यंत अनुदान. कमाल ₹1,00,000.',
    matched_rules: [
      { description_en: 'State is Maharashtra', description_hi: 'राज्य महाराष्ट्र है', description_mr: 'राज्य महाराष्ट्र आहे' },
      { description_en: 'Farmer category matches', description_hi: 'किसान श्रेणी मेल खाती है', description_mr: 'शेतकरी श्रेणी जुळते' },
    ],
    missing_information: [],
    source_name: 'Maharashtra Agricultural Department',
    last_verified_at: '2024-03-01',
  },
  {
    id: '2',
    name_en: 'PM Kisan Samman Nidhi',
    name_hi: 'पीएम किसान सम्मान निधि',
    name_mr: 'पीएम किसान सन्मान निधी',
    category: 'financial',
    match_status: 'potentially_eligible',
    match_score: 0.85,
    benefit_en: '₹6,000 per year in 3 installments of ₹2,000 directly in bank account.',
    benefit_hi: 'प्रति वर्ष ₹6,000 — 3 किस्तों में सीधे बैंक खाते में।',
    benefit_mr: 'दरवर्षी ₹6,000 — 3 हप्त्यांमध्ये थेट बँक खात्यात.',
    matched_rules: [
      { description_en: 'Farmer owns agricultural land', description_hi: 'किसान के पास कृषि भूमि है', description_mr: 'शेतकऱ्याकडे शेतजमीन आहे' },
    ],
    missing_information: ['annual_income'],
    source_name: 'Government of India - PM Kisan Portal',
    last_verified_at: '2024-06-01',
  },
  {
    id: '3',
    name_en: 'Pradhan Mantri Fasal Bima Yojana',
    name_hi: 'प्रधानमंत्री फसल बीमा योजना',
    name_mr: 'प्रधानमंत्री पीक विमा योजना',
    category: 'insurance',
    match_status: 'more_info_needed',
    match_score: 0.6,
    benefit_en: 'Crop insurance coverage at highly subsidized premium rates.',
    benefit_hi: 'अत्यधिक रियायती प्रीमियम दरों पर फसल बीमा।',
    benefit_mr: 'अत्यंत सवलतीच्या दरात पीक विमा संरक्षण.',
    matched_rules: [
      { description_en: 'State is covered', description_hi: 'राज्य शामिल है', description_mr: 'राज्य समाविष्ट आहे' },
    ],
    missing_information: ['crop_season', 'cultivated_area'],
    source_name: 'PMFBY Portal',
    last_verified_at: '2024-05-15',
  },
];

const statusConfig = {
  potentially_eligible: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <CheckCircle size={16} className="text-green-600" />,
    labelKey: 'potentially_eligible',
  },
  more_info_needed: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <AlertCircle size={16} className="text-yellow-600" />,
    labelKey: 'more_info_needed',
  },
  not_matching: {
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: <Clock size={16} className="text-red-500" />,
    labelKey: 'not_matching',
  },
};

export const SchemesPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { farmer } = useFarmer();
  const [schemes, setSchemes] = useState(MOCK_SCHEMES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call; filter by farmer's stated needs
    const timer = setTimeout(() => {
      const filtered = farmer.needs.includes('all') || farmer.needs.length === 0
        ? MOCK_SCHEMES
        : MOCK_SCHEMES.filter(s => farmer.needs.includes(s.category));
      setSchemes(filtered.length > 0 ? filtered : MOCK_SCHEMES);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [farmer.needs]);

  const getLocalName = (scheme: any) =>
    scheme[`name_${language}`] || scheme.name_en;

  const getBenefit = (scheme: any) =>
    scheme[`benefit_${language}`] || scheme.benefit_en;

  const { speak } = useTTS();



  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-green-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-green-700 font-bold text-lg">
            <Leaf size={22} /> {t('app_name')}
          </button>
          <LanguageSelector />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Farmer summary pill */}
        {farmer.name && (
          <div className="bg-white rounded-2xl border border-green-100 px-5 py-3 mb-6 flex items-center gap-4 shadow-sm">
            <div className="text-3xl">👨‍🌾</div>
            <div>
              <p className="font-bold text-gray-800">{farmer.name}</p>
              <p className="text-gray-500 text-sm">
                {farmer.district && `${farmer.district}, `}{farmer.state} &bull; {farmer.land_area} {t(farmer.land_unit)} &bull; {t(`cat_${farmer.category}`) || farmer.category}
              </p>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('schemes_title')}</h1>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-lg">{t('loading')}</div>
        ) : schemes.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-lg">{t('no_schemes')}</div>
        ) : (
          <div className="flex flex-col gap-5">
            {schemes.map(scheme => {
              const cfg = statusConfig[scheme.match_status as keyof typeof statusConfig];
              return (
                <div key={scheme.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 md:p-6">
                  {/* Status badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border mb-3 ${cfg.color}`}>
                    {cfg.icon}
                    {t(cfg.labelKey)}
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{getLocalName(scheme)}</h2>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize">
                        {scheme.category.replace('_', ' ')}
                      </span>
                    </div>
                    <button
                      onClick={() => speak(getLocalName(scheme) + '. ' + getBenefit(scheme))}
                      className="text-gray-400 hover:text-green-600 transition-colors flex-shrink-0"
                      title={t('listen_btn')}
                    >
                      <Volume2 size={22} />
                    </button>
                  </div>

                  {/* Benefit */}
                  <div className="mt-3 bg-green-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">{t('benefit_label')}</p>
                    <p className="text-gray-800 text-sm">{getBenefit(scheme)}</p>
                  </div>

                  {/* Why matched */}
                  {scheme.matched_rules.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{t('why_matched')}</p>
                      <ul className="flex flex-col gap-1">
                        {scheme.matched_rules.map((rule: any, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="text-green-500">✓</span>
                            {rule[`description_${language}`] || rule.description_en}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Missing info */}
                  {scheme.missing_information.length > 0 && (
                    <div className="mt-3 bg-yellow-50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">{t('missing_info')}</p>
                      <ul className="flex flex-wrap gap-2">
                        {scheme.missing_information.map((m: string) => (
                          <li key={m} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">{m.replace('_', ' ')}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Source + CTA */}
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-gray-400">{t('last_verified')}: {scheme.last_verified_at}</p>
                    <button
                      onClick={() => navigate(`/schemes/${scheme.id}`)}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all"
                    >
                      {t('view_details')} <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
