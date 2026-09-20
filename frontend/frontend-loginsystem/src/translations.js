// KisaanSathi Multilingual Translations (English, Hindi, Marathi)

export const translations = {
  en: {
    // Navigation
    portalTitle: "KisaanSathi",
    portalSubtitle: "Farmer Portal",
    navCropYield: "Crop Yield Prediction",
    logout: "Logout",
    language: "Language",

    // Page Header
    pageTitle: "Crop Yield Prediction",
    pageSubtitle: "Estimate your expected crop yield using rainfall, temperature, fertilizer and soil nutrient information.",

    // Form
    formTitle: "Enter Farm Conditions",
    sampleDataBtn: "Sample Data",
    resetBtn: "Reset",
    rainfallLabel: "Rainfall",
    rainfallUnit: "mm",
    rainfallPlaceholder: "e.g. 1200",
    rainfallHelper: "Expected or recorded rainfall in millimetres.",
    rainfallError: "Please enter a valid rainfall value (100 - 3000 mm).",

    fertilizerLabel: "Fertilizer",
    fertilizerUnit: "units",
    fertilizerPlaceholder: "e.g. 80",
    fertilizerHelper: "Amount of fertilizer applied to the field.",
    fertilizerError: "Please enter a valid fertilizer quantity (10 - 300 units).",

    temperatureLabel: "Temperature",
    temperatureUnit: "°C",
    temperaturePlaceholder: "e.g. 28",
    temperatureHelper: "Average season temperature in Celsius.",
    temperatureError: "Please enter a valid temperature (10°C - 55°C).",

    nitrogenLabel: "Nitrogen (N)",
    nitrogenUnit: "N level",
    nitrogenPlaceholder: "e.g. 80",
    nitrogenHelper: "Soil Nitrogen content from soil test.",
    nitrogenError: "Please enter soil Nitrogen (N) value (10 - 200).",

    phosphorusLabel: "Phosphorus (P)",
    phosphorusUnit: "P level",
    phosphorusPlaceholder: "e.g. 24",
    phosphorusHelper: "Soil Phosphorus content from soil test.",
    phosphorusError: "Please enter soil Phosphorus (P) value (5 - 100).",

    potassiumLabel: "Potassium (K)",
    potassiumUnit: "K level",
    potassiumPlaceholder: "e.g. 20",
    potassiumHelper: "Soil Potassium content from soil test.",
    potassiumError: "Please enter soil Potassium (K) value (5 - 100).",

    predictBtn: "Predict Yield",
    calculatingBtn: "Calculating Estimate...",

    // Result Card
    resultHeader: "Estimated Crop Yield",
    resultUnit: "Q/acre",
    resultExplanation: (yieldVal) =>
      `Based on the conditions you provided, the estimated crop yield is approximately ${yieldVal} quintals per acre.`,
    conditionsEvaluated: "Conditions Evaluated:",
    disclaimer:
      "Note: This is a machine-learning based estimate. Actual yield may vary depending on crop variety, soil conditions, weather, irrigation, pests and other field conditions.",

    // Awaiting State
    awaitingTitle: "Awaiting Farm Data",
    awaitingDesc:
      "Fill in the form on the left with your field conditions and click Predict Yield to see your estimated harvest.",

    // Farming Insights
    insightsTitle: "Farming Insights",
    waterTitle: "Water & Moisture:",
    waterDesc:
      "Adequate rainfall during the vegetative stage promotes robust root growth. Ensure proper drainage during excess rain.",
    nutrientsTitle: "Balanced N-P-K:",
    nutrientsDesc:
      "Nitrogen fuels leaf growth, Phosphorus supports early roots and flowering, while Potassium builds drought and disease resistance.",
    temperatureTitle: "Temperature Range:",
    temperatureDesc:
      "Most crops thrive between 20°C and 35°C. Mulching can help maintain optimal root zone temperature in hot weather.",

    // Footer
    footerTitle: "KisaanSathi (किसान साथी) — Farmer Portal",
    footerSubtitle:
      "College Mini-Project | Dedicated to empowering farmers with data-driven agricultural assistance.",
  },

  hi: {
    // Navigation
    portalTitle: "किसान साथी",
    portalSubtitle: "किसान पोर्टल",
    navCropYield: "फसल उत्पादन अनुमान",
    logout: "लॉग आउट",
    language: "भाषा",

    // Page Header
    pageTitle: "फसल उत्पादन अनुमान",
    pageSubtitle:
      "वर्षा, तापमान, उर्वरक और मिट्टी के पोषक तत्वों की जानकारी का उपयोग करके अपनी अपेक्षित फसल उपज का अनुमान लगाएं।",

    // Form
    formTitle: "खेत की स्थिति दर्ज करें",
    sampleDataBtn: "नमूना डेटा",
    resetBtn: "रीसेट",
    rainfallLabel: "वर्षा (Rainfall)",
    rainfallUnit: "मिमी (mm)",
    rainfallPlaceholder: "उदा. 1200",
    rainfallHelper: "मिलीमीटर (mm) में अपेक्षित या दर्ज वर्षा।",
    rainfallError: "कृपया वर्षा का वैध मान दर्ज करें (100 - 3000 मिमी)।",

    fertilizerLabel: "उर्वरक / खाद (Fertilizer)",
    fertilizerUnit: "यूनिट",
    fertilizerPlaceholder: "उदा. 80",
    fertilizerHelper: "खेत में डाले गए उर्वरक की मात्रा।",
    fertilizerError: "कृपया उर्वरक की वैध मात्रा दर्ज करें (10 - 300 यूनिट)।",

    temperatureLabel: "तापमान (Temperature)",
    temperatureUnit: "°C",
    temperaturePlaceholder: "उदा. 28",
    temperatureHelper: "सेल्सियस (°C) में औसत मौसमी तापमान।",
    temperatureError: "कृपया वैध तापमान दर्ज करें (10°C - 55°C)।",

    nitrogenLabel: "नाइट्रोजन (N)",
    nitrogenUnit: "N स्तर",
    nitrogenPlaceholder: "उदा. 80",
    nitrogenHelper: "मिट्टी परीक्षण से नाइट्रोजन का स्तर।",
    nitrogenError: "कृपया मिट्टी में नाइट्रोजन (N) का मान दर्ज करें (10 - 200)।",

    phosphorusLabel: "फास्फोरस (P)",
    phosphorusUnit: "P स्तर",
    phosphorusPlaceholder: "उदा. 24",
    phosphorusHelper: "मिट्टी परीक्षण से फास्फोरस का स्तर।",
    phosphorusError: "कृपया मिट्टी में फास्फोरस (P) का मान दर्ज करें (5 - 100)।",

    potassiumLabel: "पोटेशियम (K)",
    potassiumUnit: "K स्तर",
    potassiumPlaceholder: "उदा. 20",
    potassiumHelper: "मिट्टी परीक्षण से पोटेशियम का स्तर।",
    potassiumError: "कृपया मिट्टी में पोटेशियम (K) का मान दर्ज करें (5 - 100)।",

    predictBtn: "उपज का अनुमान लगाएं",
    calculatingBtn: "गणना की जा रही है...",

    // Result Card
    resultHeader: "अनुमानित फसल उत्पादन",
    resultUnit: "क्विंटल/एकड़",
    resultExplanation: (yieldVal) =>
      `आपके द्वारा दी गई स्थितियों के आधार पर, अनुमानित फसल उत्पादन लगभग ${yieldVal} क्विंटल प्रति एकड़ है।`,
    conditionsEvaluated: "मूल्यांकन की गई स्थितियाँ:",
    disclaimer:
      "नोट: यह मशीन लर्निंग पर आधारित अनुमान है। फसल की किस्म, मिट्टी की स्थिति, मौसम, सिंचाई, कीट और अन्य क्षेत्रीय परिस्थितियों के आधार पर वास्तविक उपज भिन्न हो सकती है।",

    // Awaiting State
    awaitingTitle: "खेत डेटा की प्रतीक्षा है",
    awaitingDesc:
      "अपनी खेत की स्थितियों के साथ बाईं ओर का फॉर्म भरें और अपनी अनुमानित उपज देखने के लिए 'उपज का अनुमान लगाएं' पर क्लिक करें।",

    // Farming Insights
    insightsTitle: "कृषि उपयोगी सुझाव",
    waterTitle: "जल और नमी:",
    waterDesc:
      "वानस्पतिक अवस्था के दौरान पर्याप्त वर्षा जड़ों के विकास को बढ़ावा देती है। अधिक वर्षा में उचित जल निकासी सुनिश्चित करें।",
    nutrientsTitle: "संतुलित N-P-K:",
    nutrientsDesc:
      "नाइट्रोजन पत्तियों के विकास को बढ़ाता है, फास्फोरस जड़ों और फूलों को सहारा देता है, जबकि पोटेशियम सूखे और रोगों से लड़ने की क्षमता देता है।",
    temperatureTitle: "तापमान सीमा:",
    temperatureDesc:
      "अधिकांश फसलें 20°C से 35°C के बीच अच्छी बढ़ती हैं। गर्म मौसम में मल्चिंग मिट्टी का तापमान नियंत्रित रखने में मदद करती है।",

    // Footer
    footerTitle: "किसान साथी — किसान पोर्टल",
    footerSubtitle:
      "कॉलेज मिनी-प्रोजेक्ट | किसानों को डेटा-आधारित कृषि सहायता प्रदान करने के लिए समर्पित।",
  },

  mr: {
    // Navigation
    portalTitle: "किसान साथी",
    portalSubtitle: "शेतकरी पोर्टल",
    navCropYield: "पीक उत्पादन अंदाज",
    logout: "लॉग आउट",
    language: "भाषा",

    // Page Header
    pageTitle: "पीक उत्पादन अंदाज",
    pageSubtitle:
      "पाऊस, तापमान, खते आणि मातीतील पोषक घटकांच्या माहितीचा वापर करून तुमच्या अपेक्षित पीक उत्पादनाचा अंदाज घ्या.",

    // Form
    formTitle: "शेताची माहिती प्रविष्ट करा",
    sampleDataBtn: "नमुना डेटा",
    resetBtn: "रीसेट",
    rainfallLabel: "पाऊस (Rainfall)",
    rainfallUnit: "मिमी (mm)",
    rainfallPlaceholder: "उदा. 1200",
    rainfallHelper: "मिलीमीटर (mm) मध्ये अपेक्षित किंवा नोंदवलेला पाऊस.",
    rainfallError: "कृपया पावसाचे योग्य प्रमाण टाका (100 - 3000 मिमी).",

    fertilizerLabel: "खते (Fertilizer)",
    fertilizerUnit: "युनिट",
    fertilizerPlaceholder: "उदा. 80",
    fertilizerHelper: "शेतात वापरलेल्या खताचे प्रमाण.",
    fertilizerError: "कृपया खताचे योग्य प्रमाण टाका (10 - 300 युनिट).",

    temperatureLabel: "तापमान (Temperature)",
    temperatureUnit: "°C",
    temperaturePlaceholder: "उदा. 28",
    temperatureHelper: "सेल्सिअस (°C) मध्ये सरासरी हंगामी तापमान.",
    temperatureError: "कृपया योग्य तापमान टाका (10°C - 55°C).",

    nitrogenLabel: "नायट्रोजन (N)",
    nitrogenUnit: "N प्रमाण",
    nitrogenPlaceholder: "उदा. 80",
    nitrogenHelper: "माती परीक्षणावरून नायट्रोजनचे प्रमाण.",
    nitrogenError: "कृपया मातीतील नायट्रोजन (N) चे प्रमाण टाका (10 - 200).",

    phosphorusLabel: "फॉस्फरस (P)",
    phosphorusUnit: "P प्रमाण",
    phosphorusPlaceholder: "उदा. 24",
    phosphorusHelper: "माती परीक्षणावरून फॉस्फरसचे प्रमाण.",
    phosphorusError: "कृपया मातीतील फॉस्फरस (P) चे प्रमाण टाका (5 - 100).",

    potassiumLabel: "पोटॅशियम (K)",
    potassiumUnit: "K प्रमाण",
    potassiumPlaceholder: "उदा. 20",
    potassiumHelper: "माती परीक्षणावरून पोटॅशियमचे प्रमाण.",
    potassiumError: "कृपया मातीतील पोटॅशियम (K) चे प्रमाण टाका (5 - 100).",

    predictBtn: "उत्पादनाचा अंदाज घ्या",
    calculatingBtn: "अंदाज मोजत आहे...",

    // Result Card
    resultHeader: "अंदाजे पीक उत्पादन",
    resultUnit: "क्विंटल/एकर",
    resultExplanation: (yieldVal) =>
      `तुम्ही दिलेल्या माहितीनुसार, अंदाजे पीक उत्पादन सुमारे ${yieldVal} क्विंटल प्रति एकर आहे.`,
    conditionsEvaluated: "तपासलेली माहिती:",
    disclaimer:
      "टीप: हा मशीन लर्निंगवर आधारित अंदाज आहे. पिकाची जात, जमिनीची स्थिती, हवामान, सिंचन, कीड आणि शेतातील इतर परिस्थितीनुसार प्रत्यक्ष उत्पादन बदलू शकते.",

    // Awaiting State
    awaitingTitle: "शेताच्या माहितीची प्रतीक्षा आहे",
    awaitingDesc:
      "डावीकडील फॉर्ममध्ये तुमच्या शेताची माहिती भरा आणि अंदाजे उत्पादन पाहण्यासाठी 'उत्पादनाचा अंदाज घ्या' वर क्लिक करा.",

    // Farming Insights
    insightsTitle: "शेतीविषयक महत्त्वाचे सल्ले",
    waterTitle: "पाणी आणि ओलावा:",
    waterDesc:
      "पिकाच्या वाढीच्या काळात पुरेसा पाऊस मुळांच्या वाढीसाठी फायदेशीर ठरतो. अतिवृष्टीत पाण्याचा निचरा व्यवस्थित करा.",
    nutrientsTitle: "संतुलित N-P-K:",
    nutrientsDesc:
      "नायट्रोजन पानांच्या वाढीसाठी, फॉस्फरस मुळे आणि फुलोऱ्यासाठी, तर पोटॅशियम दुष्काळ आणि रोगांचा प्रतिकार करण्यासाठी आवश्यक आहे.",
    temperatureTitle: "तापमान मर्यादा:",
    temperatureDesc:
      "बहुतेक पिके 20°C ते 35°C दरम्यान उत्तम वाढतात. उष्ण हवामानात मल्चिंगमुळे जमिनीचे तापमान योग्य राहण्यास मदत होते.",

    // Footer
    footerTitle: "किसान साथी — शेतकरी पोर्टल",
    footerSubtitle:
      "कॉलेज मिनी-प्रोजेक्ट | शेतकऱ्यांना डेटा-आधारित शेती सहाय्य देण्यासाठी समर्पित.",
  },
};
