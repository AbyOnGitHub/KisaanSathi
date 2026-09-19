import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { VoiceInputButton } from '../components/VoiceInputButton';
import { Sprout, DropletIcon, Tractor, Volume2, ArrowRight, Leaf } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const voiceSectionRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: <Sprout size={32} className="text-green-600" />,
      key: 'feat_find',
      descKey: 'feat_find_desc',
      // Find schemes → start the guided questionnaire
      onClick: () => navigate('/onboarding'),
    },
    {
      icon: <DropletIcon size={32} className="text-blue-500" />,
      key: 'feat_benefits',
      descKey: 'feat_benefits_desc',
      // Benefits → browse the schemes/benefits list directly
      onClick: () => navigate('/schemes'),
    },
    {
      icon: <Volume2 size={32} className="text-purple-500" />,
      key: 'feat_voice',
      descKey: 'feat_voice_desc',
      // Voice Assistant → scroll up to the mic on this page, since
      // there isn't a separate voice-assistant page
      onClick: () => voiceSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    },
    {
      icon: <Tractor size={32} className="text-orange-500" />,
      key: 'feat_apply',
      descKey: 'feat_apply_desc',
      // Apply with guidance → start onboarding, ending on the "what do you need" step
      onClick: () => navigate('/onboarding'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-green-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="text-green-600" size={28} />
            <span className="text-2xl font-bold text-green-800">{t('app_name')}</span>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1 rounded-full mb-6">
          {t('tagline')}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          {t('hero_title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('hero_sub')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-lg transition-all hover:shadow-xl active:scale-95 w-full sm:w-auto"
          >
            {t('find_schemes_cta')}
            <ArrowRight size={22} />
          </button>
          <button
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-2 bg-white border-2 border-green-500 text-green-700 text-xl font-bold px-8 py-4 rounded-2xl shadow transition-all hover:bg-green-50 active:scale-95 w-full sm:w-auto"
          >
            {t('tell_need_cta')}
          </button>
        </div>

        <div ref={voiceSectionRef} className="flex justify-center">
          <VoiceInputButton
            size="lg"
            prompt={t('speak_btn')}
            onTranscript={(text) => {
              // Detect need from speech and navigate
              const lower = text.toLowerCase();
              if (lower.includes('machine') || lower.includes('tractor') || lower.includes('यंत्र') || lower.includes('ट्रैक्टर')) {
                navigate('/onboarding?need=farm_machinery');
              } else {
                navigate('/onboarding');
              }
            }}
          />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon, key, descKey, onClick }) => (
            <div
              key={key}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={onClick}
            >
              <div className="mb-4">{icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{t(key)}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t(descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-gray-400 text-sm">
        {t('app_name')} &mdash; {t('tagline')}
      </footer>
    </div>
  );
};
