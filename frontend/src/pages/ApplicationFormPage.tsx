import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer } from '../context/FarmerContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { VoiceInputButton } from '../components/VoiceInputButton';
import { ListenButton } from '../components/ListenButton';
import { useTTS } from '../hooks/useTTS';
import { Leaf, ChevronLeft, HelpCircle } from 'lucide-react';

// Application form fields per scheme
const SCHEME_FIELDS: Record<string, any[]> = {
  '1': [
    {
      field_name: 'machinery_type',
      label_en: 'Type of Machinery',
      label_hi: 'मशीनरी का प्रकार',
      label_mr: 'यंत्राचा प्रकार',
      field_type: 'select',
      options: ['Tractor', 'Power Tiller', 'Reaper', 'Seed Drill', 'Sprayer', 'Thresher'],
      help_text_en: 'Select the type of agricultural machinery you want to purchase with this scheme.',
      help_text_hi: 'वह कृषि मशीनरी चुनें जो आप इस योजना से खरीदना चाहते हैं।',
      help_text_mr: 'या योजनेतून खरेदी करायच्या शेती यंत्राचा प्रकार निवडा.',
      required: true,
    },
    {
      field_name: 'machinery_make',
      label_en: 'Machinery Brand / Make',
      label_hi: 'मशीनरी ब्रांड / मेक',
      label_mr: 'यंत्राचा ब्रँड / मेक',
      field_type: 'text',
      help_text_en: 'Write the brand name of the machinery (e.g., Mahindra, Swaraj).',
      help_text_hi: 'मशीनरी का ब्रांड नाम लिखें (जैसे महिंद्रा, स्वराज)।',
      help_text_mr: 'यंत्राचे ब्रँड नाव लिहा (उदा. महिंद्रा, स्वराज).',
      required: false,
    },
    {
      field_name: 'quotation_amount',
      label_en: 'Quotation Amount (₹)',
      label_hi: 'कोटेशन राशि (₹)',
      label_mr: 'कोटेशन रक्कम (₹)',
      field_type: 'number',
      help_text_en: 'Enter the total price quoted by the authorized dealer for the machinery.',
      help_text_hi: 'अधिकृत डीलर द्वारा मशीनरी की कुल कीमत दर्ज करें।',
      help_text_mr: 'अधिकृत डीलरने यंत्रासाठी दिलेली एकूण किंमत लिहा.',
      required: true,
    },
    {
      field_name: 'dealer_name',
      label_en: 'Authorized Dealer Name',
      label_hi: 'अधिकृत डीलर का नाम',
      label_mr: 'अधिकृत डीलरचे नाव',
      field_type: 'text',
      help_text_en: 'Enter the name of the machinery dealer you plan to buy from.',
      help_text_hi: 'उस डीलर का नाम दर्ज करें जिससे आप मशीनरी खरीदना चाहते हैं।',
      help_text_mr: 'ज्या डीलरकडून यंत्र खरेदी करणार आहात त्याचे नाव लिहा.',
      required: true,
    },
    {
      field_name: 'purpose',
      label_en: 'Purpose / Why do you need this machinery?',
      label_hi: 'उद्देश्य — आपको यह मशीनरी क्यों चाहिए?',
      label_mr: 'उद्देश्य — हे यंत्र का हवे आहे?',
      field_type: 'textarea',
      help_text_en: 'Briefly explain what work you will use this machinery for on your farm.',
      help_text_hi: 'संक्षेप में बताएं कि आप खेत पर इस मशीनरी का उपयोग किस काम के लिए करेंगे।',
      help_text_mr: 'थोडक्यात सांगा की तुम्ही हे यंत्र शेतात कोणत्या कामासाठी वापराल.',
      required: false,
    },
  ],
  '2': [
    {
      field_name: 'land_survey_number',
      label_en: 'Land Survey Number (Gat Krama)',
      label_hi: 'भूमि सर्वेक्षण संख्या (गट क्रमांक)',
      label_mr: 'जमीन सर्वे नंबर (गट क्रमांक)',
      field_type: 'text',
      help_text_en: 'The survey number of your agricultural land. Found on 7/12 extract.',
      help_text_hi: 'आपकी कृषि भूमि का सर्वेक्षण नंबर। 7/12 उतारे पर पाया जाता है।',
      help_text_mr: 'तुमच्या शेतजमिनीचा सर्वे नंबर. 7/12 उताऱ्यावर आढळतो.',
      required: true,
    },
    {
      field_name: 'mobile_number',
      label_en: 'Mobile Number (Aadhaar linked)',
      label_hi: 'मोबाइल नंबर (आधार से लिंक)',
      label_mr: 'मोबाइल नंबर (आधार लिंक)',
      field_type: 'text',
      help_text_en: 'Your mobile number that is linked to your Aadhaar card.',
      help_text_hi: 'आपका मोबाइल नंबर जो आधार कार्ड से लिंक है।',
      help_text_mr: 'तुमचा मोबाइल नंबर जो आधार कार्डशी लिंक आहे.',
      required: true,
    },
  ],
  '3': [
    {
      field_name: 'crop_name',
      label_en: 'Crop to Insure',
      label_hi: 'बीमा करने की फसल',
      label_mr: 'विमा घ्यायचे पीक',
      field_type: 'text',
      help_text_en: 'Name the crop for which you want crop insurance.',
      help_text_hi: 'वह फसल का नाम बताएं जिसके लिए आप बीमा चाहते हैं।',
      help_text_mr: 'ज्या पिकासाठी विमा हवा आहे त्याचे नाव लिहा.',
      required: true,
    },
    {
      field_name: 'insured_area',
      label_en: 'Area to be Insured (in Hectares)',
      label_hi: 'बीमाकृत क्षेत्र (हेक्टेयर में)',
      label_mr: 'विमा घ्यायचे क्षेत्र (हेक्टरमध्ये)',
      field_type: 'number',
      help_text_en: 'How many hectares of land do you want to insure under this scheme?',
      help_text_hi: 'इस योजना के तहत आप कितने हेक्टेयर भूमि का बीमा करना चाहते हैं?',
      help_text_mr: 'या योजनेंतर्गत किती हेक्टर जमिनीचा विमा घेणार आहात?',
      required: true,
    },
  ],
};

export const ApplicationFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { farmer } = useFarmer();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [helpField, setHelpField] = useState<string | null>(null);

  const fields = id ? (SCHEME_FIELDS[id] || []) : [];

  const updateAnswer = (fieldName: string, value: string) => {
    setAnswers(prev => ({ ...prev, [fieldName]: value }));
  };

  const getLabel = (field: any) => field[`label_${language}`] || field.label_en;
  const getHelp = (field: any) => field[`help_text_${language}`] || field.help_text_en;

  const { speak } = useTTS();
  const speakHelp = (field: any) => speak(getHelp(field));

  const handleSubmit = () => {
    const missing = fields.filter(f => f.required && !answers[f.field_name]);
    if (missing.length > 0) {
      alert('Please fill in all required fields: ' + missing.map(f => getLabel(f)).join(', '));
      return;
    }
    navigate(`/applications/${id}/review`, { state: { answers, scheme_id: id } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-green-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(`/schemes/${id}`)} className="flex items-center gap-2 text-green-700 font-bold">
            <ChevronLeft size={20} /> Back
          </button>
          <LanguageSelector />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Form</h1>
        <p className="text-gray-500 mb-6 text-sm">Fill in the details below. Tap the 🎤 button on any field to speak your answer.</p>

        {/* Pre-filled farmer info */}
        {farmer.name && (
          <div className="bg-green-50 rounded-2xl border border-green-100 p-4 mb-6">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Your Information (Auto-filled)</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div><span className="font-medium">Name:</span> {farmer.name}</div>
              <div><span className="font-medium">State:</span> {farmer.state}</div>
              <div><span className="font-medium">District:</span> {farmer.district}</div>
              <div><span className="font-medium">Land:</span> {farmer.land_area} {farmer.land_unit}</div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-5">
          {fields.map(field => (
            <div key={field.field_name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-2 gap-2">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-800">
                  {getLabel(field)}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                  <ListenButton text={getLabel(field)} />
                </label>
                <button
                  onClick={() => {
                    setHelpField(helpField === field.field_name ? null : field.field_name);
                    speakHelp(field);
                  }}
                  className="text-gray-400 hover:text-green-600 transition-colors shrink-0"
                  title="What should I enter?"
                >
                  <HelpCircle size={20} />
                </button>
              </div>

              {helpField === field.field_name && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-3 text-sm text-blue-800">
                  {getHelp(field)}
                </div>
              )}

              {field.field_type === 'select' && (
                <select
                  value={answers[field.field_name] || ''}
                  onChange={e => updateAnswer(field.field_name, e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:border-green-500 focus:outline-none bg-white"
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {field.field_type === 'textarea' && (
                <textarea
                  value={answers[field.field_name] || ''}
                  onChange={e => updateAnswer(field.field_name, e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:border-green-500 focus:outline-none resize-none"
                  rows={3}
                />
              )}

              {(field.field_type === 'text' || field.field_type === 'number') && (
                <input
                  type={field.field_type}
                  value={answers[field.field_name] || ''}
                  onChange={e => updateAnswer(field.field_name, e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:border-green-500 focus:outline-none"
                />
              )}

              <VoiceInputButton
                className="mt-2"
                size="sm"
                prompt={`🎤 Speak your ${getLabel(field)}`}
                onTranscript={(text) => updateAnswer(field.field_name, text)}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-extrabold py-5 rounded-2xl text-xl transition-all shadow-lg"
        >
          Review Application →
        </button>
      </div>
    </div>
  );
};
