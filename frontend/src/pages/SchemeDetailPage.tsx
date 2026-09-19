import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { useTTS } from '../hooks/useTTS';
import { SCHEMES, toDetail } from '../data/schemes';
import { Volume2, FileText, ExternalLink, ChevronLeft, CheckCircle } from 'lucide-react';

const SCHEME_DATA: Record<string, any> = {
  '1': {
    name_en: 'Farm Mechanization Assistance',
    name_hi: 'कृषि यंत्रीकरण सहायता',
    name_mr: 'कृषी यांत्रिकीकरण योजना',
    description_en: 'This scheme provides financial assistance to farmers for purchasing agricultural machinery including tractors, power tillers, reapers, seed drills, and other implements. The objective is to increase mechanization in agriculture to improve productivity and reduce labour costs.',
    description_hi: 'यह योजना किसानों को ट्रैक्टर, पावर टिलर, रीपर, सीड ड्रिल और अन्य उपकरण खरीदने के लिए वित्तीय सहायता प्रदान करती है।',
    description_mr: 'ही योजना शेतकऱ्यांना ट्रॅक्टर, पॉवर टिलर, रीपर, सीड ड्रिल आणि इतर अवजारे खरेदीसाठी आर्थिक सहाय्य देते.',
    benefit_description_en: 'Farmers receive a subsidy of 40% to 50% of the purchase cost of eligible machinery, with a maximum limit of ₹1,00,000 for general farmers and up to ₹1,25,000 for women/SC/ST farmers.',
    benefit_description_hi: 'पात्र मशीनरी की खरीद लागत पर 40% से 50% सब्सिडी। सामान्य किसानों के लिए अधिकतम ₹1,00,000 और महिला/अनुसूचित जाति किसानों के लिए ₹1,25,000।',
    benefit_description_mr: 'पात्र यंत्रसामग्रीच्या खरेदी खर्चावर 40% ते 50% अनुदान. सामान्य शेतकऱ्यांसाठी कमाल ₹1,00,000 आणि महिला/अ.जा./अ.ज.जाती शेतकऱ्यांसाठी ₹1,25,000.',
    eligibility_description_en: 'Farmers owning agricultural land in Maharashtra, belonging to small/marginal/women/SC/ST categories are prioritized. The farmer must not have availed the same scheme in the last 7 years.',
    eligibility_description_hi: 'महाराष्ट्र में कृषि भूमि के मालिक, लघु/सीमांत/महिला/अनुसूचित जाति/जनजाति श्रेणी के किसान। पिछले 7 वर्षों में इस योजना का लाभ न लिया हो।',
    eligibility_description_mr: 'महाराष्ट्रात शेतजमीन असलेले लघु/अल्पभूधारक/महिला/अ.जा./अ.ज.जाती शेतकरी. गेल्या 7 वर्षांत याच योजनेचा लाभ घेतला नसावा.',
    application_description_en: 'Apply online through the MahaDBT portal at mahadbt.maharashtra.gov.in. Submit required documents and wait for field verification. After approval, purchase the machinery and claim the subsidy.',
    application_description_hi: 'MahaDBT पोर्टल पर ऑनलाइन आवेदन करें। आवश्यक दस्तावेज़ जमा करें और फील्ड सत्यापन की प्रतीक्षा करें। अनुमोदन के बाद मशीनरी खरीदें और सब्सिडी का दावा करें।',
    application_description_mr: 'MahaDBT पोर्टलवर ऑनलाइन अर्ज करा. आवश्यक कागदपत्रे सादर करा आणि फील्ड पडताळणीची प्रतीक्षा करा. मंजुरीनंतर यंत्रसामग्री खरेदी करा.',
    source_url: 'https://mahadbt.maharashtra.gov.in/Farmer/AgriLogin/AgriLogin',
    source_name: 'MahaDBT - Maharashtra Agriculture Department',
    last_verified_at: '2024-03-01',
    verification_status: 'Verified',
    matched_rules: [
      { description_en: 'Your state (Maharashtra) matches', description_hi: 'राज्य (महाराष्ट्र) मेल खाता है', description_mr: 'राज्य (महाराष्ट्र) जुळते' },
      { description_en: 'Farmer category qualifies', description_hi: 'किसान श्रेणी योग्य है', description_mr: 'शेतकरी श्रेणी पात्र आहे' },
      { description_en: 'Your selected need is farm machinery', description_hi: 'आपकी ज़रूरत कृषि मशीनरी है', description_mr: 'तुमची गरज शेती यंत्रसामग्री आहे' },
    ],
    documents: [
      {
        name: '7/12 Extract (Satbara)',
        desc_en: 'Land ownership document issued by local revenue authority. Proves you own agricultural land.',
        desc_hi: '7/12 उतारा — स्थानीय राजस्व प्राधिकरण द्वारा जारी भूमि स्वामित्व दस्तावेज़।',
        desc_mr: '7/12 उतारा — तलाठी कार्यालयातून मिळते. जमिनीचे मालकी हक्क सिद्ध करते.',
        where_en: 'Talathi office or digitally from mahabhulekh.maharashtra.gov.in',
        required: true,
      },
      {
        name: 'Aadhaar Card',
        desc_en: 'Identity proof of the farmer.',
        desc_hi: 'किसान का पहचान प्रमाण।',
        desc_mr: 'शेतकऱ्याचा ओळखपत्र.',
        where_en: 'Your existing Aadhaar card issued by UIDAI.',
        required: true,
      },
      {
        name: 'Bank Passbook (First Page)',
        desc_en: 'Proof of bank account for receiving subsidy directly.',
        desc_hi: 'सब्सिडी प्राप्त करने के लिए बैंक खाते का प्रमाण।',
        desc_mr: 'अनुदान थेट मिळण्यासाठी बँक खात्याचा पुरावा.',
        where_en: 'From your bank branch.',
        required: true,
      },
      {
        name: 'Machinery Quotation',
        desc_en: 'A quotation from an authorized dealer for the machinery you want to purchase.',
        desc_hi: 'अधिकृत डीलर से मशीनरी का कोटेशन।',
        desc_mr: 'अधिकृत डीलरकडून यंत्रसामग्रीचे कोटेशन.',
        where_en: 'From an authorized machinery dealer.',
        required: true,
      },
    ],
  },
  '2': {
    name_en: 'PM Kisan Samman Nidhi',
    name_hi: 'पीएम किसान सम्मान निधि',
    name_mr: 'पीएम किसान सन्मान निधी',
    description_en: 'PM-KISAN is a Central Sector scheme that provides income support of ₹6,000 per year to all landholding farmers in 3 equal installments of ₹2,000 each directly to their bank accounts.',
    description_hi: 'पीएम-किसान योजना सभी भूमिधारी किसानों को ₹6,000 प्रति वर्ष — 3 किस्तों में — सीधे बैंक खाते में प्रदान करती है।',
    description_mr: 'पीएम-किसान योजना सर्व जमीनधारी शेतकऱ्यांना ₹6,000 दरवर्षी — 3 हप्त्यांमध्ये — थेट बँक खात्यात देते.',
    benefit_description_en: '₹6,000 per year directly to your bank account in 3 installments of ₹2,000.',
    benefit_description_hi: '₹6,000 प्रति वर्ष — 3 किस्तों में सीधे बैंक खाते में।',
    benefit_description_mr: '₹6,000 दरवर्षी — 3 हप्त्यांमध्ये थेट बँक खात्यात.',
    eligibility_description_en: 'All landholding farmer families in India are eligible, except those who are income tax payers, retired government employees, or hold constitutional positions.',
    eligibility_description_hi: 'भारत में सभी भूमिधारी किसान परिवार पात्र हैं, आयकर दाताओं और सरकारी सेवानिवृत्त लोगों को छोड़कर।',
    eligibility_description_mr: 'भारतातील सर्व जमीनधारी शेतकरी कुटुंबे पात्र आहेत, आयकर भरणाऱ्यांना आणि निवृत्त सरकारी कर्मचाऱ्यांना वगळता.',
    application_description_en: 'Register through the PM Kisan portal at pmkisan.gov.in or visit the nearest Common Service Centre (CSC).',
    application_description_hi: 'pmkisan.gov.in पर ऑनलाइन पंजीकरण करें या नजदीकी CSC केंद्र पर जाएं।',
    application_description_mr: 'pmkisan.gov.in वर ऑनलाइन नोंदणी करा किंवा जवळच्या CSC केंद्रावर जा.',
    source_url: 'https://pmkisan.gov.in',
    source_name: 'PM Kisan - Government of India',
    last_verified_at: '2024-06-01',
    verification_status: 'Verified',
    matched_rules: [
      { description_en: 'You own agricultural land', description_hi: 'आपके पास कृषि भूमि है', description_mr: 'तुमच्याकडे शेतजमीन आहे' },
    ],
    documents: [
      { name: 'Aadhaar Card', desc_en: 'Mandatory for identity verification.', desc_hi: 'पहचान के लिए अनिवार्य।', desc_mr: 'ओळखीसाठी अनिवार्य.', where_en: 'Your existing Aadhaar.', required: true },
      { name: 'Land Records (7/12 / Khasra Khatauni)', desc_en: 'Proof of land ownership.', desc_hi: 'भूमि स्वामित्व का प्रमाण।', desc_mr: 'जमिनीच्या मालकीचा पुरावा.', where_en: 'Talathi office or state revenue portal.', required: true },
      { name: 'Bank Account Details', desc_en: 'Bank account linked to Aadhaar for direct benefit transfer.', desc_hi: 'आधार से लिंक बैंक खाता।', desc_mr: 'आधार लिंक बँक खाते.', where_en: 'Your bank.', required: true },
    ],
  },
  '3': {
    name_en: 'Pradhan Mantri Fasal Bima Yojana',
    name_hi: 'प्रधानमंत्री फसल बीमा योजना',
    name_mr: 'प्रधानमंत्री पीक विमा योजना',
    description_en: 'PMFBY provides comprehensive insurance coverage against crop loss due to natural calamities, pests, and diseases at affordable premium rates, helping farmers stabilize their incomes.',
    description_hi: 'PMFBY प्राकृतिक आपदाओं, कीट और रोगों से फसल नुकसान के खिलाफ किफायती प्रीमियम पर व्यापक बीमा कवरेज प्रदान करती है।',
    description_mr: 'PMFBY नैसर्गिक आपत्ती, कीड आणि रोगांमुळे पिकाचे नुकसान झाल्यास परवडणाऱ्या प्रीमियमवर संपूर्ण विमा संरक्षण देते.',
    benefit_description_en: 'Insurance coverage at 2% premium for Kharif crops, 1.5% for Rabi crops. Government pays the remaining premium.',
    benefit_description_hi: 'खरीफ फसलों के लिए 2% प्रीमियम, रबी फसलों के लिए 1.5% प्रीमियम। शेष प्रीमियम सरकार देती है।',
    benefit_description_mr: 'खरीप पिकांसाठी 2% प्रीमियम, रब्बी पिकांसाठी 1.5% प्रीमियम. उर्वरित प्रीमियम सरकार भरते.',
    eligibility_description_en: 'All farmers growing notified crops in notified areas are eligible.',
    eligibility_description_hi: 'अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाने वाले सभी किसान पात्र हैं।',
    eligibility_description_mr: 'अधिसूचित क्षेत्रात अधिसूचित पिके घेणारे सर्व शेतकरी पात्र आहेत.',
    application_description_en: 'Apply through the PMFBY portal, your nearest bank, or crop insurance companies during the crop enrollment period.',
    application_description_hi: 'PMFBY पोर्टल, नजदीकी बैंक या फसल बीमा कंपनियों के माध्यम से आवेदन करें।',
    application_description_mr: 'PMFBY पोर्टल, जवळच्या बँक किंवा पीक विमा कंपन्यांमार्फत अर्ज करा.',
    source_url: 'https://pmfby.gov.in',
    source_name: 'PMFBY Portal',
    last_verified_at: '2024-05-15',
    verification_status: 'Verified',
    matched_rules: [
      { description_en: 'State is covered under PMFBY', description_hi: 'राज्य PMFBY के अंतर्गत है', description_mr: 'राज्य PMFBY अंतर्गत आहे' },
    ],
    documents: [
      { name: 'Aadhaar Card', desc_en: 'Identity proof.', desc_hi: 'पहचान पत्र।', desc_mr: 'ओळखपत्र.', where_en: 'Your existing Aadhaar.', required: true },
      { name: 'Land Records', desc_en: 'Proof that you own/cultivate the insured land.', desc_hi: 'बीमाकृत भूमि का प्रमाण।', desc_mr: 'विमा केलेल्या जमिनीचा पुरावा.', where_en: 'Talathi office.', required: true },
      { name: 'Sowing Certificate', desc_en: 'Proof that the crop has been sown.', desc_hi: 'बुवाई प्रमाण पत्र।', desc_mr: 'पेरणी प्रमाणपत्र.', where_en: 'From Talathi or Krishi Sevak.', required: true },
    ],
  },
};

export const SchemeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { speak } = useTTS();

  const catalogItem = SCHEMES.find(x => x.id === id);
  const scheme = id ? (SCHEME_DATA[id] || (catalogItem ? toDetail(catalogItem) : null)) : null;

  if (!scheme) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>Scheme not found.</p>
      </div>
    );
  }

  const getField = (field: string) =>
    scheme[`${field}_${language}`] || scheme[`${field}_en`] || '';

  const Section: React.FC<{ title: string; content: string; speakContent?: string }> = ({
    title, content, speakContent,
  }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-gray-700 uppercase tracking-wide">{title}</h3>
        <button
          onClick={() => speak(speakContent || content)}
          className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium"
        >
          <Volume2 size={16} /> {t('listen_btn')}
        </button>
      </div>
      <p className="text-gray-800 text-base leading-relaxed">{content}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-green-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/schemes')} className="flex items-center gap-2 text-green-700 font-bold">
            <ChevronLeft size={20} /> {t('schemes')}
          </button>
          <LanguageSelector />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
              {t('potentially_eligible')}
            </span>
            {scheme.last_verified_at && (
              <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                {t('last_verified')}: {scheme.last_verified_at}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">{getField('name')}</h1>
          <p className="text-gray-500 text-sm mt-1">{scheme.source_name}</p>
        </div>

        {/* Why matched */}
        {scheme.matched_rules?.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4">
            <p className="text-sm font-semibold text-green-700 mb-2">{t('why_matched')}</p>
            <ul className="flex flex-col gap-1">
              {scheme.matched_rules.map((rule: any, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm text-green-800">
                  <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                  {rule[`description_${language}`] || rule.description_en}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Section title={t('what_is_scheme')} content={getField('description')} />
        <Section title={t('what_benefit')} content={getField('benefit_description')} />
        <Section title={t('eligibility')} content={getField('eligibility_description')} />

        {/* Documents */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <h3 className="text-base font-bold text-gray-700 uppercase tracking-wide mb-3">{t('documents')}</h3>
          <div className="flex flex-col gap-3">
            {scheme.documents?.map((doc: any, i: number) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                <FileText size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{doc.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {doc[`desc_${language}`] || doc.desc_en}
                  </p>
                  {doc.where_en && (
                    <p className="text-green-600 text-xs mt-1">📍 {doc.where_en}</p>
                  )}
                </div>
                <button
                  onClick={() => speak(doc[`desc_${language}`] || doc.desc_en)}
                  className="text-gray-400 hover:text-green-600"
                >
                  <Volume2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Section title={t('how_to_apply')} content={getField('application_description')} />

        {/* Official Portal */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
          <p className="text-sm font-semibold text-blue-700 mb-1">{t('official_source')}</p>
          <p className="text-blue-900 font-bold mb-1">{scheme.source_name}</p>
          <p className="text-blue-600 text-sm mb-3">{scheme.source_url}</p>
          <p className="text-blue-700 text-sm mb-3">{t('official_notice')}</p>
          <a
            href={scheme.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition-all"
          >
            <ExternalLink size={16} />
            {t('go_official')}
          </a>
        </div>

        {/* Apply CTA */}
        <button
          onClick={() => navigate(`/schemes/${id}/apply`)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-5 rounded-2xl text-xl transition-all shadow-lg"
        >
          {t('apply_now')}
        </button>
      </div>
    </div>
  );
};
