import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { ListenButton } from '../components/ListenButton';
import { matchAll, CATEGORY_LABEL_KEY, SCHEMES } from '../data/schemes';
import { Leaf, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';

const ALL_LABEL: Record<string, string> = { en: 'All', hi: 'सभी', mr: 'सर्व' };
const COUNT_LABEL: Record<string, string> = { en: 'schemes', hi: 'योजनाएं', mr: 'योजना' };
const NEED_LABEL: Record<string, string> = { en: 'Matches your need', hi: 'आपकी ज़रूरत से मेल', mr: 'तुमच्या गरजेशी जुळते' };

export const SchemesPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { farmer } = useFarmer();
  const [filter, setFilter] = useState('all');

  const all = useMemo(() => matchAll(farmer), [farmer]);
  const categories = useMemo(() => Array.from(new Set(SCHEMES.map(s => s.category))), []);
  const shown = filter === 'all' ? all : all.filter(s => s.category === filter);

  const name = (s: any) => s[`name_${language}`] || s.name_en;
  const benefit = (s: any) => s[`benefit_${language}`] || s.benefit_en;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-green-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-2 pr-24">
          <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-green-700 font-bold text-lg">
            <Leaf size={22} /> {t('app_name')}
          </button>
          <LanguageSelector />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
        {farmer.name && (
          <div className="bg-white rounded-2xl border border-green-100 px-4 py-3 mb-5 flex items-center gap-3 shadow-sm">
            <div className="text-3xl">👨‍🌾</div>
            <div className="min-w-0">
              <p className="font-bold text-gray-800 truncate">{farmer.name}</p>
              <p className="text-gray-500 text-sm">
                {farmer.district && `${farmer.district}, `}{farmer.state} &bull; {farmer.land_area} {t(farmer.land_unit)}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mb-1">
          <ListenButton size="md" text={t('schemes_title')} />
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{t('schemes_title')}</h1>
        </div>
        <p className="text-sm text-gray-500 mb-4">{shown.length} {COUNT_LABEL[language]}</p>

        {/* Category filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-3 -mx-4 px-4">
          {['all', ...categories].map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                filter === c ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
              }`}
            >
              {c === 'all' ? ALL_LABEL[language] : t(CATEGORY_LABEL_KEY[c])}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-lg">{t('no_schemes')}</div>
        ) : (
          <div className="flex flex-col gap-4">
            {shown.map(s => {
              const ok = s.match_status === 'potentially_eligible';
              return (
                <div key={s.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 md:p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs md:text-sm font-semibold border ${
                      ok ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                      {ok ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                      {t(s.match_status)}
                    </span>
                    {s.needMatch && (
                      <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">
                        {NEED_LABEL[language]}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-2">
                    <ListenButton size="md" text={`${name(s)}. ${benefit(s)}`} className="mt-1" />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1 break-words">{name(s)}</h2>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {t(CATEGORY_LABEL_KEY[s.category])} · {s.level === 'state' ? (s.states?.[0] ?? 'State') : 'India'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 bg-green-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">{t('benefit_label')}</p>
                    <p className="text-gray-800 text-sm">{benefit(s)}</p>
                  </div>

                  {s.missing.length > 0 && (
                    <div className="mt-3 bg-yellow-50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">{t('missing_info')}</p>
                      <div className="flex flex-wrap gap-2">
                        {s.missing.map(m => (
                          <span key={m} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">{m}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-xs text-gray-400 truncate">{s.source_name}</p>
                    <button
                      onClick={() => navigate(`/schemes/${s.id}`)}
                      className="shrink-0 flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all"
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
