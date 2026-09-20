// Curated scheme catalog (central + Maharashtra).
// NOTE: this is a static list, NOT live-scraped. Always confirm amounts/dates on the official portal (source_url).
import type { FarmerData } from '../context/FarmerContext';

export interface CatalogScheme {
  id: string;
  category: string; // matches the "need" values in onboarding
  level: 'central' | 'state';
  states?: string[];       // restrict to these states
  audience?: string[];     // farmer categories that get this (marginal/small/women/sc...)
  maxHa?: number;          // max land in hectares
  minAge?: number;
  maxAge?: number;
  name_en: string; name_hi: string; name_mr: string;
  benefit_en: string; benefit_hi: string; benefit_mr: string;
  desc_en: string;
  source_name: string;
  source_url: string;
}

const MH = ['Maharashtra'];

export const SCHEMES: CatalogScheme[] = [
  {
    id: '1', category: 'farm_machinery', level: 'state', states: MH,
    name_en: 'Farm Mechanization Assistance (MahaDBT)', name_hi: 'कृषि यंत्रीकरण सहायता (MahaDBT)', name_mr: 'कृषी यांत्रिकीकरण योजना (MahaDBT)',
    benefit_en: 'Up to 50% subsidy on tractor, power tiller and farm implements. Max ₹1,00,000.',
    benefit_hi: 'ट्रैक्टर, पावर टिलर पर 50% तक सब्सिडी। अधिकतम ₹1,00,000.',
    benefit_mr: 'ट्रॅक्टर, पॉवर टिलरवर 50% पर्यंत अनुदान. कमाल ₹1,00,000.',
    desc_en: '', source_name: 'MahaDBT - Maharashtra Agriculture Department', source_url: 'https://mahadbt.maharashtra.gov.in/Farmer/AgriLogin/AgriLogin',
  },
  {
    id: '2', category: 'financial', level: 'central',
    name_en: 'PM Kisan Samman Nidhi', name_hi: 'पीएम किसान सम्मान निधि', name_mr: 'पीएम किसान सन्मान निधी',
    benefit_en: '₹6,000 per year in 3 installments of ₹2,000 directly in your bank account.',
    benefit_hi: 'प्रति वर्ष ₹6,000 — 3 किस्तों में सीधे बैंक खाते में।',
    benefit_mr: 'दरवर्षी ₹6,000 — 3 हप्त्यांमध्ये थेट बँक खात्यात.',
    desc_en: '', source_name: 'PM Kisan - Government of India', source_url: 'https://pmkisan.gov.in',
  },
  {
    id: '3', category: 'insurance', level: 'central',
    name_en: 'Pradhan Mantri Fasal Bima Yojana', name_hi: 'प्रधानमंत्री फसल बीमा योजना', name_mr: 'प्रधानमंत्री पीक विमा योजना',
    benefit_en: 'Crop insurance at 2% premium (Kharif), 1.5% (Rabi), 5% (commercial/horticulture crops).',
    benefit_hi: 'फसल बीमा — खरीफ 2%, रबी 1.5%, वाणिज्यिक/बागवानी फसलों पर 5% प्रीमियम।',
    benefit_mr: 'पीक विमा — खरीप 2%, रब्बी 1.5%, व्यावसायिक/फळबाग पिकांसाठी 5% प्रीमियम.',
    desc_en: '', source_name: 'PMFBY Portal', source_url: 'https://pmfby.gov.in',
  },
  {
    id: 'kcc', category: 'loans', level: 'central',
    name_en: 'Kisan Credit Card (KCC)', name_hi: 'किसान क्रेडिट कार्ड (KCC)', name_mr: 'किसान क्रेडिट कार्ड (KCC)',
    benefit_en: 'Short-term farm loans up to ₹3 lakh at a concessional interest rate, with extra relief for timely repayment.',
    benefit_hi: '₹3 लाख तक का अल्पकालिक कृषि ऋण रियायती ब्याज पर; समय पर चुकाने पर अतिरिक्त छूट।',
    benefit_mr: '₹3 लाखांपर्यंत अल्पमुदतीचे शेती कर्ज सवलतीच्या व्याजदराने; वेळेवर परतफेडीवर अतिरिक्त सवलत.',
    desc_en: 'A credit card for farmers that gives quick, low-interest loans for seeds, fertiliser, pesticides and other farm needs, so you do not depend on moneylenders.',
    source_name: 'myScheme - Government of India', source_url: 'https://www.myscheme.gov.in',
  },
  {
    id: 'pm-kusum', category: 'irrigation', level: 'central',
    name_en: 'PM-KUSUM (Solar Pumps)', name_hi: 'पीएम-कुसुम (सौर पंप)', name_mr: 'पीएम-कुसुम (सौर पंप)',
    benefit_en: 'About 60% subsidy (central + state) on solar irrigation pumps; up to 30% more as a bank loan.',
    benefit_hi: 'सौर सिंचाई पंप पर लगभग 60% सब्सिडी (केंद्र + राज्य); 30% तक बैंक ऋण।',
    benefit_mr: 'सौर सिंचन पंपावर सुमारे 60% अनुदान (केंद्र + राज्य); 30% पर्यंत बँक कर्ज.',
    desc_en: 'Helps farmers replace diesel pumps with solar pumps and cut electricity and fuel costs.',
    source_name: 'MNRE - PM-KUSUM', source_url: 'https://pmkusum.mnre.gov.in',
  },
  {
    id: 'pmksy', category: 'irrigation', level: 'central',
    name_en: 'PMKSY – Per Drop More Crop (Drip/Sprinkler)', name_hi: 'पीएमकेएसवाई – पर ड्रॉप मोर क्रॉप (ड्रिप/स्प्रिंकलर)', name_mr: 'पीएमकेएसवाय – पर ड्रॉप मोर क्रॉप (ठिबक/तुषार)',
    benefit_en: 'Subsidy on drip and sprinkler irrigation: about 55% for small/marginal farmers, 45% for others.',
    benefit_hi: 'ड्रिप/स्प्रिंकलर पर सब्सिडी: लघु/सीमांत किसानों को लगभग 55%, अन्य को 45%।',
    benefit_mr: 'ठिबक/तुषार सिंचनावर अनुदान: लघु/अल्पभूधारकांना सुमारे 55%, इतरांना 45%.',
    desc_en: 'Promotes micro-irrigation so you can grow more crop with less water.',
    source_name: 'PMKSY', source_url: 'https://pmksy.gov.in',
  },
  {
    id: 'shc', category: 'crop_support', level: 'central',
    name_en: 'Soil Health Card', name_hi: 'मृदा स्वास्थ्य कार्ड', name_mr: 'मृदा आरोग्य पत्रिका',
    benefit_en: 'Free soil testing and crop-wise fertiliser advice for your field.',
    benefit_hi: 'आपके खेत की मुफ्त मिट्टी जांच और फसल-वार उर्वरक सलाह।',
    benefit_mr: 'तुमच्या शेताची मोफत माती तपासणी आणि पीकनिहाय खत सल्ला.',
    desc_en: 'You get a card showing your soil nutrients and what fertiliser to use, which lowers input cost and improves yield.',
    source_name: 'Soil Health Card Portal', source_url: 'https://soilhealth.dac.gov.in',
  },
  {
    id: 'pkvy', category: 'organic', level: 'central',
    name_en: 'Paramparagat Krishi Vikas Yojana (Organic)', name_hi: 'परंपरागत कृषि विकास योजना (जैविक)', name_mr: 'परंपरागत कृषी विकास योजना (सेंद्रिय)',
    benefit_en: 'About ₹50,000 per hectare over 3 years for organic farming clusters, most of it paid to the farmer via DBT.',
    benefit_hi: 'जैविक खेती क्लस्टर के लिए 3 वर्षों में लगभग ₹50,000 प्रति हेक्टेयर, अधिकांश राशि DBT से किसान को।',
    benefit_mr: 'सेंद्रिय शेती गटासाठी 3 वर्षांत सुमारे ₹50,000 प्रति हेक्टर, बहुतांश रक्कम DBT द्वारे शेतकऱ्याला.',
    desc_en: 'Supports groups of farmers to shift to certified organic farming, including inputs, certification and marketing.',
    source_name: 'PGS India / NCOF', source_url: 'https://pgsindia-ncof.gov.in',
  },
  {
    id: 'nmnf', category: 'organic', level: 'central',
    name_en: 'National Mission on Natural Farming', name_hi: 'राष्ट्रीय प्राकृतिक खेती मिशन', name_mr: 'राष्ट्रीय नैसर्गिक शेती अभियान',
    benefit_en: 'Training, bio-input support and help to adopt chemical-free natural farming.',
    benefit_hi: 'रसायन-मुक्त प्राकृतिक खेती अपनाने के लिए प्रशिक्षण और जैव-इनपुट सहायता।',
    benefit_mr: 'रसायनमुक्त नैसर्गिक शेतीसाठी प्रशिक्षण आणि जैव-निविष्ठा मदत.',
    desc_en: 'Encourages farmers to use cow-based and local bio-inputs instead of chemical fertiliser and pesticides.',
    source_name: 'Ministry of Agriculture', source_url: 'https://agricoop.gov.in',
  },
  {
    id: 'midh', category: 'horticulture', level: 'central',
    name_en: 'Mission for Integrated Development of Horticulture', name_hi: 'बागवानी के समग्र विकास का मिशन (MIDH)', name_mr: 'फलोत्पादन एकात्मिक विकास अभियान (MIDH)',
    benefit_en: 'Subsidy, generally 40–50% of cost, for orchards, nurseries, polyhouses, cold storage and more.',
    benefit_hi: 'बाग, नर्सरी, पॉलीहाउस, कोल्ड स्टोरेज आदि पर आमतौर पर 40–50% सब्सिडी।',
    benefit_mr: 'फळबाग, रोपवाटिका, पॉलीहाउस, शीतगृह इत्यादींवर साधारणपणे 40–50% अनुदान.',
    desc_en: 'Supports fruit, vegetable, flower and spice farming with subsidy on planting material and infrastructure.',
    source_name: 'MIDH', source_url: 'https://midh.gov.in',
  },
  {
    id: 'smam', category: 'farm_machinery', level: 'central',
    name_en: 'Sub-Mission on Agricultural Mechanization (SMAM)', name_hi: 'कृषि यंत्रीकरण उप-मिशन (SMAM)', name_mr: 'कृषी यांत्रिकीकरण उप-अभियान (SMAM)',
    benefit_en: '40–50% subsidy on farm machines; higher rate for SC/ST, small, marginal and women farmers. Custom hiring centres also supported.',
    benefit_hi: 'कृषि मशीनों पर 40–50% सब्सिडी; SC/ST, लघु, सीमांत और महिला किसानों को अधिक। कस्टम हायरिंग केंद्र भी समर्थित।',
    benefit_mr: 'कृषी यंत्रांवर 40–50% अनुदान; अ.जा./अ.ज., लघु, अल्पभूधारक व महिला शेतकऱ्यांना जास्त. कस्टम हायरिंग केंद्रांनाही मदत.',
    desc_en: 'Makes machines like tractors, rotavators and harvesters affordable for small farmers.',
    source_name: 'Farm Mechanization Portal', source_url: 'https://agrimachinery.nic.in',
  },
  {
    id: 'aif', category: 'loans', level: 'central',
    name_en: 'Agriculture Infrastructure Fund', name_hi: 'कृषि अवसंरचना कोष', name_mr: 'कृषी पायाभूत सुविधा निधी',
    benefit_en: 'Loans up to ₹2 crore with 3% interest subvention for up to 7 years, plus credit guarantee.',
    benefit_hi: '₹2 करोड़ तक ऋण पर 7 वर्ष तक 3% ब्याज छूट और क्रेडिट गारंटी।',
    benefit_mr: '₹2 कोटींपर्यंत कर्जावर 7 वर्षांपर्यंत 3% व्याज सवलत आणि पतहमी.',
    desc_en: 'For farm-gate infrastructure such as warehouses, cold storage, sorting/grading and primary processing.',
    source_name: 'Agri Infra Fund', source_url: 'https://agriinfra.dac.gov.in',
  },
  {
    id: 'pmkmy', category: 'financial', level: 'central', maxHa: 2, minAge: 18, maxAge: 40,
    name_en: 'PM Kisan Maandhan (Pension)', name_hi: 'पीएम किसान मानधन (पेंशन)', name_mr: 'पीएम किसान मानधन (निवृत्तिवेतन)',
    benefit_en: '₹3,000 per month pension after age 60. You pay a small monthly amount; the government matches it.',
    benefit_hi: '60 वर्ष के बाद ₹3,000 मासिक पेंशन। आप थोड़ी मासिक राशि जमा करते हैं; सरकार उतनी ही जमा करती है।',
    benefit_mr: 'वय 60 नंतर दरमहा ₹3,000 निवृत्तिवेतन. तुम्ही थोडी मासिक रक्कम भरता; सरकार तितकीच रक्कम भरते.',
    desc_en: 'A pension scheme for small and marginal farmers aged 18–40.',
    source_name: 'PM Kisan Maandhan', source_url: 'https://maandhan.in',
  },
  {
    id: 'enam', category: 'crop_support', level: 'central',
    name_en: 'e-NAM (Online Crop Market)', name_hi: 'ई-नाम (ऑनलाइन फसल बाज़ार)', name_mr: 'ई-नाम (ऑनलाइन शेतमाल बाजार)',
    benefit_en: 'Sell your crop online to buyers across India for better prices, with payment directly to your bank.',
    benefit_hi: 'देशभर के खरीदारों को ऑनलाइन फसल बेचें, बेहतर दाम और सीधे बैंक में भुगतान।',
    benefit_mr: 'देशभरातील खरेदीदारांना ऑनलाइन शेतमाल विका, चांगला भाव आणि थेट बँकेत पैसे.',
    desc_en: 'A national electronic trading platform linking mandis so farmers can find more buyers.',
    source_name: 'e-NAM', source_url: 'https://enam.gov.in',
  },
  {
    id: 'nfsm', category: 'seeds', level: 'central',
    name_en: 'National Food Security Mission (Seeds & Inputs)', name_hi: 'राष्ट्रीय खाद्य सुरक्षा मिशन (बीज और इनपुट)', name_mr: 'राष्ट्रीय अन्न सुरक्षा अभियान (बियाणे व निविष्ठा)',
    benefit_en: 'Subsidised certified seeds, demonstrations and inputs for rice, wheat, pulses and coarse cereals.',
    benefit_hi: 'धान, गेहूं, दलहन और मोटे अनाज के लिए अनुदानित प्रमाणित बीज, प्रदर्शन और इनपुट।',
    benefit_mr: 'भात, गहू, कडधान्ये व भरड धान्यांसाठी अनुदानित प्रमाणित बियाणे, प्रात्यक्षिके व निविष्ठा.',
    desc_en: 'Helps raise production of food grains through better seeds and improved practices.',
    source_name: 'NFSM', source_url: 'https://nfsm.gov.in',
  },
  {
    id: 'pmfme', category: 'processing', level: 'central',
    name_en: 'PM Formalisation of Micro Food Processing (PMFME)', name_hi: 'पीएम सूक्ष्म खाद्य प्रसंस्करण उद्यम औपचारिकीकरण (PMFME)', name_mr: 'पीएम सूक्ष्म अन्न प्रक्रिया उद्योग औपचारिकीकरण (PMFME)',
    benefit_en: '35% credit-linked subsidy, up to ₹10 lakh per unit, for setting up or upgrading a food processing unit.',
    benefit_hi: 'खाद्य प्रसंस्करण इकाई के लिए 35% क्रेडिट-लिंक्ड सब्सिडी, प्रति इकाई ₹10 लाख तक।',
    benefit_mr: 'अन्न प्रक्रिया युनिटसाठी 35% कर्ज-संलग्न अनुदान, प्रति युनिट ₹10 लाखांपर्यंत.',
    desc_en: 'Helps you turn farm produce into value-added products such as flour, pickles, oil or dal.',
    source_name: 'PMFME - Ministry of Food Processing', source_url: 'https://pmfme.mofpi.gov.in',
  },
  {
    id: 'fpo', category: 'training', level: 'central',
    name_en: 'Farmer Producer Organisation (FPO) Scheme', name_hi: 'किसान उत्पादक संगठन (FPO) योजना', name_mr: 'शेतकरी उत्पादक कंपनी (FPO) योजना',
    benefit_en: 'Financial support up to ₹18 lakh per FPO over 3 years, plus equity grant and credit guarantee.',
    benefit_hi: 'प्रति FPO 3 वर्षों में ₹18 लाख तक सहायता, साथ में इक्विटी अनुदान और क्रेडिट गारंटी।',
    benefit_mr: 'प्रति FPO 3 वर्षांत ₹18 लाखांपर्यंत मदत, तसेच इक्विटी अनुदान व पतहमी.',
    desc_en: 'Helps groups of farmers form a company to buy inputs and sell produce together at better prices.',
    source_name: 'SFAC', source_url: 'https://sfacindia.com',
  },
  {
    id: 'pmmsy', category: 'financial', level: 'central',
    name_en: 'PM Matsya Sampada Yojana (Fisheries)', name_hi: 'पीएम मत्स्य संपदा योजना (मत्स्य पालन)', name_mr: 'पीएम मत्स्य संपदा योजना (मत्स्यपालन)',
    benefit_en: 'Subsidy of 40% (60% for SC/ST and women) on fish ponds, cages, hatcheries and fishing equipment.',
    benefit_hi: 'मछली तालाब, केज, हैचरी और उपकरणों पर 40% (SC/ST और महिलाओं को 60%) सब्सिडी।',
    benefit_mr: 'मत्स्य तलाव, पिंजरे, हॅचरी व उपकरणांवर 40% (अ.जा./अ.ज. व महिलांना 60%) अनुदान.',
    desc_en: 'Extra income for farm families through fish farming.',
    source_name: 'PMMSY - Department of Fisheries', source_url: 'https://pmmsy.dof.gov.in',
  },
  {
    id: 'kisan-call', category: 'training', level: 'central',
    name_en: 'Kisan Call Centre (Free Advice)', name_hi: 'किसान कॉल सेंटर (मुफ्त सलाह)', name_mr: 'किसान कॉल सेंटर (मोफत सल्ला)',
    benefit_en: 'Free expert advice on crops, pests, weather and schemes by phone in your language. Call 1800-180-1551.',
    benefit_hi: 'फसल, कीट, मौसम और योजनाओं पर अपनी भाषा में फोन पर मुफ्त सलाह। कॉल करें 1800-180-1551.',
    benefit_mr: 'पीक, कीड, हवामान व योजनांवर तुमच्या भाषेत फोनवर मोफत सल्ला. कॉल करा 1800-180-1551.',
    desc_en: 'A toll-free helpline where agriculture experts answer farmers\' questions.',
    source_name: 'Ministry of Agriculture', source_url: 'https://agricoop.gov.in',
  },
  // ───── Maharashtra ─────
  {
    id: 'namo-shetkari', category: 'financial', level: 'state', states: MH,
    name_en: 'Namo Shetkari Mahasanman Nidhi', name_hi: 'नमो शेतकरी महासन्मान निधि', name_mr: 'नमो शेतकरी महासन्मान निधी',
    benefit_en: 'Extra ₹6,000 per year from the Maharashtra government for PM-KISAN beneficiaries.',
    benefit_hi: 'पीएम-किसान लाभार्थियों को महाराष्ट्र सरकार से प्रति वर्ष अतिरिक्त ₹6,000।',
    benefit_mr: 'पीएम-किसान लाभार्थ्यांना महाराष्ट्र सरकारकडून दरवर्षी अतिरिक्त ₹6,000.',
    desc_en: 'A state top-up to PM-KISAN. If you receive PM-KISAN in Maharashtra, you are usually covered.',
    source_name: 'Maharashtra Agriculture Department', source_url: 'https://krishi.maharashtra.gov.in',
  },
  {
    id: 'magel-tyala', category: 'irrigation', level: 'state', states: MH,
    name_en: 'Magel Tyala Shettale (Farm Pond on Demand)', name_hi: 'मागेल त्याला शेततळे (मांग पर खेत तालाब)', name_mr: 'मागेल त्याला शेततळे',
    benefit_en: 'Subsidy to dig a farm pond to store water for protective irrigation.',
    benefit_hi: 'सुरक्षात्मक सिंचाई के लिए पानी जमा करने हेतु खेत तालाब खोदने पर सब्सिडी।',
    benefit_mr: 'संरक्षित सिंचनासाठी पाणी साठवण्याकरिता शेततळे खोदण्यास अनुदान.',
    desc_en: 'Farmers can apply for a farm pond on their own land through MahaDBT.',
    source_name: 'MahaDBT', source_url: 'https://mahadbt.maharashtra.gov.in',
  },
  {
    id: 'birsa-munda', category: 'irrigation', level: 'state', states: MH, audience: ['sc'],
    name_en: 'Birsa Munda Krishi Kranti Yojana (ST farmers)', name_hi: 'बिरसा मुंडा कृषि क्रांति योजना (ST किसान)', name_mr: 'बिरसा मुंडा कृषी क्रांती योजना (अनुसूचित जमाती)',
    benefit_en: 'Subsidy for new wells, pump sets, drip/sprinkler and other irrigation items for Scheduled Tribe farmers.',
    benefit_hi: 'अनुसूचित जनजाति किसानों को नए कुएं, पंप, ड्रिप/स्प्रिंकलर आदि पर सब्सिडी।',
    benefit_mr: 'अनुसूचित जमातीच्या शेतकऱ्यांना नवीन विहीर, पंपसंच, ठिबक/तुषार इ. साठी अनुदान.',
    desc_en: 'Irrigation support for Scheduled Tribe farmers in Maharashtra.',
    source_name: 'MahaDBT', source_url: 'https://mahadbt.maharashtra.gov.in',
  },
  {
    id: 'ambedkar-swavalamban', category: 'irrigation', level: 'state', states: MH, audience: ['sc'],
    name_en: 'Dr. Babasaheb Ambedkar Krishi Swavalamban Yojana (SC farmers)', name_hi: 'डॉ. बाबासाहेब आंबेडकर कृषि स्वावलंबन योजना (SC किसान)', name_mr: 'डॉ. बाबासाहेब आंबेडकर कृषी स्वावलंबन योजना (अनुसूचित जाती)',
    benefit_en: 'Subsidy for new wells, pump sets, drip/sprinkler and related items for SC and neo-Buddhist farmers.',
    benefit_hi: 'SC और नव-बौद्ध किसानों को नए कुएं, पंप, ड्रिप/स्प्रिंकलर आदि पर सब्सिडी।',
    benefit_mr: 'अनुसूचित जाती व नवबौद्ध शेतकऱ्यांना नवीन विहीर, पंपसंच, ठिबक/तुषार इ. साठी अनुदान.',
    desc_en: 'Irrigation and farm-development support for SC and neo-Buddhist farmers in Maharashtra.',
    source_name: 'MahaDBT', source_url: 'https://mahadbt.maharashtra.gov.in',
  },
  {
    id: 'gopinath-munde', category: 'insurance', level: 'state', states: MH,
    name_en: 'Gopinath Munde Farmer Accident Insurance', name_hi: 'गोपीनाथ मुंडे शेतकरी अपघात सुरक्षा योजना', name_mr: 'गोपीनाथ मुंडे शेतकरी अपघात सुरक्षा सानुग्रह अनुदान योजना',
    benefit_en: 'Financial help up to ₹2 lakh to the family in case of a farmer\'s accidental death or disability.',
    benefit_hi: 'किसान की दुर्घटना में मृत्यु या विकलांगता पर परिवार को ₹2 लाख तक की सहायता।',
    benefit_mr: 'शेतकऱ्याचा अपघाती मृत्यू किंवा अपंगत्व झाल्यास कुटुंबाला ₹2 लाखांपर्यंत मदत.',
    desc_en: 'Accident cover for farmers in Maharashtra at no cost to the farmer.',
    source_name: 'Maharashtra Agriculture Department', source_url: 'https://krishi.maharashtra.gov.in',
  },
  {
    id: 'pocra', category: 'crop_support', level: 'state', states: MH,
    name_en: 'Nanaji Deshmukh Krishi Sanjivani (PoCRA)', name_hi: 'नानाजी देशमुख कृषि संजीवनी (PoCRA)', name_mr: 'नानाजी देशमुख कृषी संजीवनी प्रकल्प (पोकरा)',
    benefit_en: 'Subsidy on drip, farm ponds, seeds and climate-resilient farming inputs in selected villages.',
    benefit_hi: 'चयनित गांवों में ड्रिप, खेत तालाब, बीज और जलवायु-सहिष्णु खेती पर सब्सिडी।',
    benefit_mr: 'निवडक गावांमध्ये ठिबक, शेततळे, बियाणे व हवामान-अनुकूल शेतीसाठी अनुदान.',
    desc_en: 'A climate-resilient agriculture project for selected villages in drought-prone regions of Maharashtra. Check whether your village is included.',
    source_name: 'PoCRA - Maharashtra', source_url: 'https://krishi.maharashtra.gov.in',
  },
];

export const CATEGORY_LABEL_KEY: Record<string, string> = {
  seeds: 'need_seeds', irrigation: 'need_irrigation', farm_machinery: 'need_machinery',
  financial: 'need_financial', crop_support: 'need_crop_support', insurance: 'need_insurance',
  organic: 'need_organic', horticulture: 'need_horticulture', processing: 'need_processing',
  loans: 'need_loans', training: 'need_training',
};

export type MatchStatus = 'potentially_eligible' | 'more_info_needed';

export interface Matched extends CatalogScheme {
  match_status: MatchStatus;
  missing: string[];        // labels shown as "missing info"
  needMatch: boolean;
}

/** Returns null when the scheme clearly does not apply to this farmer. */
export function matchScheme(s: CatalogScheme, f: FarmerData): Matched | null {
  const missing: string[] = [];
  if (s.states) {
    if (f.state && !s.states.includes(f.state)) return null;
    if (!f.state) missing.push('state');
  }
  const area = parseFloat(f.land_area);
  if (s.maxHa) {
    if (!isNaN(area)) {
      const ha = f.land_unit === 'acres' ? area * 0.4047 : area;
      if (ha > s.maxHa) return null;
    } else missing.push('land area');
  }
  const age = parseInt(f.age);
  if (s.minAge || s.maxAge) {
    if (!isNaN(age)) {
      if ((s.minAge && age < s.minAge) || (s.maxAge && age > s.maxAge)) return null;
    } else missing.push('age');
  }
  if (s.audience) {
    const ok = s.audience.includes(f.category) || (s.audience.includes('women') && f.gender === 'female');
    if (!ok) missing.push('category (SC/ST)');
  }
  const needs = f.needs.filter(n => n !== 'all');
  return {
    ...s,
    match_status: missing.length ? 'more_info_needed' : 'potentially_eligible',
    missing,
    needMatch: needs.includes(s.category),
  };
}

export function matchAll(f: FarmerData): Matched[] {
  return SCHEMES.map(s => matchScheme(s, f))
    .filter((m): m is Matched => m !== null)
    .sort((a, b) =>
      Number(b.needMatch) - Number(a.needMatch) ||
      Number(a.match_status === 'more_info_needed') - Number(b.match_status === 'more_info_needed'));
}

/** Builds the shape SchemeDetailPage expects for catalog-only schemes. */
export function toDetail(s: CatalogScheme) {
  const who = [
    s.states ? `Farmers in ${s.states.join(', ')}` : 'Farmers across India',
    s.audience ? 'belonging to SC/ST categories' : '',
    s.maxHa ? `with up to ${s.maxHa} ha land` : '',
    s.minAge ? `aged ${s.minAge}–${s.maxAge}` : '',
  ].filter(Boolean).join(' ') + '. Exact conditions are set by the scheme; confirm on the official portal.';
  return {
    name_en: s.name_en, name_hi: s.name_hi, name_mr: s.name_mr,
    description_en: s.desc_en || s.benefit_en,
    description_hi: s.benefit_hi, description_mr: s.benefit_mr,
    benefit_description_en: s.benefit_en, benefit_description_hi: s.benefit_hi, benefit_description_mr: s.benefit_mr,
    eligibility_description_en: who,
    eligibility_description_hi: 'पात्रता की शर्तें योजना के अनुसार हैं। कृपया आधिकारिक पोर्टल पर पुष्टि करें।',
    eligibility_description_mr: 'पात्रतेच्या अटी योजनेनुसार आहेत. कृपया अधिकृत पोर्टलवर खात्री करा.',
    application_description_en: `Apply on the official portal (${s.source_url}) or visit your nearest Common Service Centre (CSC) / agriculture office.`,
    application_description_hi: `आधिकारिक पोर्टल (${s.source_url}) पर आवेदन करें या नजदीकी CSC / कृषि कार्यालय जाएं।`,
    application_description_mr: `अधिकृत पोर्टलवर (${s.source_url}) अर्ज करा किंवा जवळच्या CSC / कृषी कार्यालयात जा.`,
    source_url: s.source_url, source_name: s.source_name,
    last_verified_at: '', verification_status: 'Curated',
    matched_rules: [],
    documents: [
      { name: 'Aadhaar Card', desc_en: 'Identity proof.', desc_hi: 'पहचान पत्र।', desc_mr: 'ओळखपत्र.', where_en: 'Your existing Aadhaar.', required: true },
      { name: 'Land Records (7/12 / Khasra)', desc_en: 'Proof of land ownership or cultivation.', desc_hi: 'भूमि स्वामित्व/खेती का प्रमाण।', desc_mr: 'जमिनीच्या मालकीचा/कसण्याचा पुरावा.', where_en: 'Talathi office or state land-records portal.', required: true },
      { name: 'Bank Passbook', desc_en: 'Bank account for receiving the benefit.', desc_hi: 'लाभ प्राप्त करने के लिए बैंक खाता।', desc_mr: 'लाभ मिळण्यासाठी बँक खाते.', where_en: 'Your bank branch.', required: true },
    ],
  };
}
