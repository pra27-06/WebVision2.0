import { Scheme } from '@/types';

export const MOCK_SCHOLARSHIPS: Scheme[] = [
  {
    id: 'pragati',
    name: {
      en: 'AICTE Pragati Scholarship for Girl Students',
      hi: 'छात्राओं के लिए एआईसीटीई प्रगति छात्रवृत्ति',
    },
    provider: {
      en: 'AICTE (All India Council for Technical Education)',
      hi: 'एआईसीटीई (अखिल भारतीय तकनीकी शिक्षा परिषद)',
    },
    summary: {
      en: 'Provides ₹50,000 per year towards college fees and incidental expenses for female students admitted to first year of technical degree or diploma courses.\nAvailable across all states and categories with annual family income up to ₹8 Lakh.',
      hi: 'तकनीकी डिग्री या डिप्लोमा पाठ्यक्रमों के प्रथम वर्ष में प्रवेश लेने वाली छात्राओं को कॉलेज शुल्क और आकस्मिक खर्चों के लिए ₹50,000 प्रति वर्ष प्रदान करता है।\n₹8 लाख तक की वार्षिक पारिवारिक आय वाली सभी राज्यों और श्रेणियों की छात्राओं के लिए उपलब्ध।',
    },
    levels: ['diploma', 'ug'],
    states: 'ALL',
    categories: 'ALL',
    maxIncome: 800000,
    femaleOnly: true,
    benefitPerYear: 50000,
    deadlineInDays: 1,
    documents: ['aadhaar', 'income', 'marksheet', 'bank', 'photo'],
  },
  {
    id: 'csss',
    name: {
      en: 'Central Sector Scholarship Scheme for College and University Students',
      hi: 'कॉलेज और विश्वविद्यालय के छात्रों के लिए केंद्रीय क्षेत्र छात्रवृत्ति योजना',
    },
    provider: {
      en: 'Dept of Higher Education, Ministry of Education',
      hi: 'उच्च शिक्षा विभाग, शिक्षा मंत्रालय',
    },
    summary: {
      en: 'Direct financial assistance of ₹20,000/year to meritorious students pursuing regular degree courses in colleges and universities.\nRequires family income under ₹4.5 Lakh and top 20 percentile standing in respective state board exams.',
      hi: 'कॉलेजों और विश्वविद्यालयों में नियमित डिग्री पाठ्यक्रमों में पढ़ने वाले मेधावी छात्रों को ₹20,000/वर्ष की सीधी वित्तीय सहायता।\nपारिवारिक आय ₹4.5 लाख से कम और संबंधित राज्य बोर्ड परीक्षाओं में शीर्ष 20 प्रतिशतक में स्थान आवश्यक है।',
    },
    levels: ['ug', 'pg'],
    states: 'ALL',
    categories: 'ALL',
    maxIncome: 450000,
    soft: {
      penalty: 15,
      note: {
        en: 'Confirm your Class 12 marks are in the top 20 percentile of your board',
        hi: 'पुष्टि करें कि आपके कक्षा 12 के अंक आपके बोर्ड के शीर्ष 20 प्रतिशतक में हैं',
      },
    },
    benefitPerYear: 20000,
    deadlineInDays: 16,
    documents: ['aadhaar', 'income', 'marksheet', 'bank'],
  },
  {
    id: 'pms_minority',
    name: {
      en: 'Post-Matric Scholarship for Minorities',
      hi: 'अल्पसंख्यकों के लिए पोस्ट-मैट्रिक छात्रवृत्ति',
    },
    provider: {
      en: 'Ministry of Minority Affairs',
      hi: 'अल्पसंख्यक कार्य मंत्रालय',
    },
    summary: {
      en: 'Supports minority community students in Class 11, 12, diploma, UG, and PG programs covering admission fees and maintenance allowance.\nRequires annual family income under ₹2 Lakh and minimum 50% marks in the qualifying examination.',
      hi: 'कक्षा 11, 12, डिप्लोमा, यूजी और पीजी में अल्पसंख्यक समुदाय के छात्रों को प्रवेश शुल्क और रखरखाव भत्ता प्रदान करता है।\nवार्षिक पारिवारिक आय ₹2 लाख से कम और अर्हक परीक्षा में कम से कम 50% अंक आवश्यक हैं।',
    },
    levels: ['class11_12', 'diploma', 'ug', 'pg'],
    states: 'ALL',
    categories: 'ALL',
    maxIncome: 200000,
    requiresMinority: true,
    soft: {
      penalty: 10,
      note: {
        en: 'Confirm at least 50% marks in your last exam',
        hi: 'पिछली परीक्षा में न्यूनतम 50% अंक की पुष्टि करें',
      },
    },
    benefitPerYear: 12000,
    deadlineInDays: 1,
    documents: ['aadhaar', 'income', 'marksheet', 'bank'],
  },
  {
    id: 'mcm',
    name: {
      en: 'Merit-cum-Means Scholarship (Technical and Professional)',
      hi: 'मेरिट-कम-मीन्स छात्रवृत्ति (तकनीकी और व्यावसायिक)',
    },
    provider: {
      en: 'Ministry of Minority Affairs',
      hi: 'अल्पसंख्यक कार्य मंत्रालय',
    },
    summary: {
      en: 'Financial support of ₹30,000/year for notified minority students pursuing undergraduate or postgraduate technical and professional courses.\nEligible for students with family income up to ₹2.5 Lakh and at least 50% marks in previous examination.',
      hi: 'अंडरग्रेजुएट या पोस्टग्रेजुएट तकनीकी और व्यावसायिक पाठ्यक्रमों में नामांकित अल्पसंख्यक छात्रों के लिए ₹30,000/वर्ष की वित्तीय सहायता।\n₹2.5 लाख तक की पारिवारिक आय और पिछली परीक्षा में कम से कम 50% अंक वाले छात्र पात्र हैं।',
    },
    levels: ['diploma', 'ug', 'pg'],
    states: 'ALL',
    categories: 'ALL',
    maxIncome: 250000,
    requiresMinority: true,
    soft: {
      penalty: 10,
      note: {
        en: 'Confirm at least 50% marks in your last exam',
        hi: 'पिछली परीक्षा में न्यूनतम 50% अंक की पुष्टि करें',
      },
    },
    benefitPerYear: 30000,
    deadlineInDays: 16,
    documents: ['aadhaar', 'income', 'marksheet', 'bank'],
  },
  {
    id: 'pms_sc',
    name: {
      en: 'Post-Matric Scholarship for SC Students',
      hi: 'अनुसूचित जाति (SC) के छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति',
    },
    provider: {
      en: 'Ministry of Social Justice and Empowerment',
      hi: 'सामाजिक न्याय और अधिकारिता मंत्रालय',
    },
    summary: {
      en: 'Centrally sponsored comprehensive scheme covering 100% compulsory non-refundable fees and academic allowances for Scheduled Caste students.\nApplicable from Class 11 to PhD with an annual parental income ceiling of ₹2.5 Lakh.',
      hi: 'अनुसूचित जाति के छात्रों के लिए अनिवार्य गैर-वापसी योग्य शुल्क और शैक्षणिक भत्तों को कवर करने वाली व्यापक केंद्रीय योजना।\n₹2.5 लाख की वार्षिक आय सीमा के साथ कक्षा 11 से पीएचडी तक लागू।',
    },
    levels: ['class11_12', 'diploma', 'ug', 'pg', 'phd'],
    states: 'ALL',
    categories: ['sc'],
    maxIncome: 250000,
    benefitPerYear: 25000,
    deadlineInDays: 31,
    documents: ['aadhaar', 'caste', 'income', 'marksheet', 'bank'],
  },
  {
    id: 'yasasvi',
    name: {
      en: 'PM YASASVI Post-Matric Scholarship for OBC, EBC and DNT',
      hi: 'ओबीसी, ईबीसी और डीएनटी के लिए पीएम यशस्वी पोस्ट-मैट्रिक छात्रवृत्ति',
    },
    provider: {
      en: 'Ministry of Social Justice and Empowerment',
      hi: 'सामाजिक न्याय और अधिकारिता मंत्रालय',
    },
    summary: {
      en: 'Scholarship assistance of up to ₹18,000 per year for students belonging to OBC, Economically Backward Classes (EBC) and De-notified Tribes (DNT).\nAvailable for post-matric higher education with parental income ceiling of ₹2.5 Lakh per annum.',
      hi: 'ओबीसी, ईबीसी और डीएनटी श्रेणियों के छात्रों के लिए ₹18,000 प्रति वर्ष तक की छात्रवृत्ति सहायता।\n₹2.5 लाख वार्षिक पारिवारिक आय सीमा के साथ पोस्ट-मैट्रिक उच्च शिक्षा के लिए उपलब्ध।',
    },
    levels: ['class11_12', 'diploma', 'ug', 'pg'],
    states: 'ALL',
    categories: ['obc'],
    maxIncome: 250000,
    benefitPerYear: 18000,
    deadlineInDays: 31,
    documents: ['aadhaar', 'caste', 'income', 'marksheet', 'bank'],
  },
  {
    id: 'pms_st',
    name: {
      en: 'Post-Matric Scholarship for ST Students',
      hi: 'अनुसूचित जनजाति (ST) के छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति',
    },
    provider: {
      en: 'Ministry of Tribal Affairs',
      hi: 'जनजातीय कार्य मंत्रालय',
    },
    summary: {
      en: 'Covers full tuition and academic maintenance allowances for Scheduled Tribe students studying at recognized post-matric institutions across India.\nParental income must not exceed ₹2.5 Lakh per annum.',
      hi: 'भारत भर के मान्यता प्राप्त संस्थानों में पढ़ने वाले अनुसूचित जनजाति के छात्रों के लिए पूर्ण ट्यूशन और शैक्षणिक रखरखाव भत्ता।\nअभिभावक की वार्षिक आय ₹2.5 लाख से अधिक नहीं होनी चाहिए।',
    },
    levels: ['class11_12', 'diploma', 'ug', 'pg', 'phd'],
    states: 'ALL',
    categories: ['st'],
    maxIncome: 250000,
    benefitPerYear: 22000,
    deadlineInDays: 31,
    documents: ['aadhaar', 'caste', 'income', 'marksheet', 'bank'],
  },
  {
    id: 'topclass_sc',
    name: {
      en: 'Top Class Education for SC Students',
      hi: 'अनुसूचित जाति (SC) के छात्रों के लिए शीर्ष श्रेणी शिक्षा योजना',
    },
    provider: {
      en: 'Ministry of Social Justice and Empowerment',
      hi: 'सामाजिक न्याय और अधिकारिता मंत्रालय',
    },
    summary: {
      en: 'Full financial support up to ₹2,00,000 per year including full tuition fees, living expenses, and computer allowances for SC students in premier institutes.\nInstitutes include IITs, IIMs, NITs, and other notified central excellence institutions with family income up to ₹8 Lakh.',
      hi: 'आईआईटी, आईआईएम जैसे शीर्ष संस्थानों में एससी छात्रों के लिए ₹2,00,000 प्रति वर्ष तक पूर्ण वित्तीय सहायता।\n₹8 लाख तक की वार्षिक आय वाले अधिसूचित राष्ट्रीय उत्कृष्टता संस्थानों के छात्रों के लिए मान्य।',
    },
    levels: ['ug', 'pg'],
    states: 'ALL',
    categories: ['sc'],
    maxIncome: 800000,
    soft: {
      penalty: 20,
      note: {
        en: 'Confirm admission to a notified institute (IIT, NIT, IIM, AIIMS, etc.)',
        hi: 'अधिसूचित शीर्ष संस्थान (आईआईटी, एनआईटी, एम्स आदि) में प्रवेश की पुष्टि करें',
      },
    },
    benefitPerYear: 200000,
    deadlineInDays: 45,
    documents: ['aadhaar', 'caste', 'income', 'marksheet', 'bank'],
  },
  {
    id: 'saksham',
    name: {
      en: 'AICTE Saksham Scholarship for Specially-Abled Students',
      hi: 'दिव्यांग छात्रों के लिए एआईसीटीई सक्षम छात्रवृत्ति',
    },
    provider: {
      en: 'AICTE (All India Council for Technical Education)',
      hi: 'एआईसीटीई (अखिल भारतीय तकनीकी शिक्षा परिषद)',
    },
    summary: {
      en: 'Provides ₹50,000 per annum towards tuition and assistive devices for specially-abled students with disability not less than 40%.\nApplicable for students admitted to AICTE approved diploma or undergraduate degree level programs.',
      hi: '40% से अधिक दिव्यांगता वाले विशेष रूप से सक्षम छात्रों के लिए ट्यूशन और सहायक उपकरणों हेतु ₹50,000 प्रति वर्ष प्रदान करता है।\nएआईसीटीई अनुमोदित डिप्लोमा या स्नातक डिग्री कार्यक्रमों में प्रवेश लेने वाले छात्रों के लिए।',
    },
    levels: ['diploma', 'ug'],
    states: 'ALL',
    categories: 'ALL',
    maxIncome: 800000,
    requiresDisability: true,
    benefitPerYear: 50000,
    deadlineInDays: 1,
    documents: ['aadhaar', 'income', 'marksheet', 'bank', 'photo'],
  },
  {
    id: 'nmmss',
    name: {
      en: 'National Means-cum-Merit Scholarship',
      hi: 'राष्ट्रीय साधन-सह-योग्यता छात्रवृत्ति योजना (NMMSS)',
    },
    provider: {
      en: 'Department of School Education & Literacy, MoE',
      hi: 'स्कूल शिक्षा और साक्षरता विभाग, शिक्षा मंत्रालय',
    },
    summary: {
      en: 'Awards ₹12,000 per year to meritorious students from economically weaker sections to prevent dropout at secondary stage.\nSupports students in classes 11 and 12 who qualified the state-level competitive selection exam.',
      hi: 'माध्यमिक स्तर पर ड्रॉपआउट रोकने के लिए आर्थिक रूप से कमजोर वर्ग के मेधावी छात्रों को ₹12,000 प्रति वर्ष प्रदान करता है।\nराज्य स्तरीय चयन परीक्षा उत्तीर्ण करने वाले कक्षा 11 और 12 के छात्रों का समर्थन करता है।',
    },
    levels: ['class11_12'],
    states: 'ALL',
    categories: 'ALL',
    maxIncome: 350000,
    soft: {
      penalty: 15,
      note: {
        en: 'Confirm you cleared your state selection exam',
        hi: 'पुष्टि करें कि आपने राज्य स्तरीय चयन परीक्षा उत्तीर्ण की है',
      },
    },
    benefitPerYear: 12000,
    deadlineInDays: 60,
    documents: ['aadhaar', 'income', 'marksheet', 'bank'],
  },
  {
    id: 'ishan',
    name: {
      en: 'Ishan Uday Special Scholarship for North-Eastern Region',
      hi: 'उत्तर-पूर्वी क्षेत्र के लिए ईशान उदय विशेष छात्रवृत्ति योजना',
    },
    provider: {
      en: 'University Grants Commission (UGC)',
      hi: 'विश्वविद्यालय अनुदान आयोग (यूजीसी)',
    },
    summary: {
      en: 'Special scholarship offering ₹54,000 per year to students with domicile in the North-Eastern states admitted to general degree courses.\nHelps bridge educational access with family income up to ₹4.5 Lakh per annum.',
      hi: 'उत्तर-पूर्वी राज्यों के मूल निवासी छात्रों को सामान्य डिग्री पाठ्यक्रमों के लिए ₹54,000 प्रति वर्ष की विशेष छात्रवृत्ति।\n₹4.5 लाख वार्षिक पारिवारिक आय वाले छात्रों के लिए उच्च शिक्षा के अवसर सुनिश्चित करता है।',
    },
    levels: ['ug'],
    states: [
      'Arunachal Pradesh',
      'Assam',
      'Manipur',
      'Meghalaya',
      'Mizoram',
      'Nagaland',
      'Sikkim',
      'Tripura',
    ],
    categories: 'ALL',
    maxIncome: 450000,
    benefitPerYear: 54000,
    deadlineInDays: 75,
    documents: ['aadhaar', 'income', 'marksheet', 'bank'],
  },
  {
    id: 'jk_special',
    name: {
      en: 'Special Scholarship Scheme for Jammu & Kashmir and Ladakh',
      hi: 'जम्मू-कश्मीर और लद्दाख के लिए विशेष छात्रवृत्ति योजना (PM-USPY)',
    },
    provider: {
      en: 'Ministry of Education / AICTE',
      hi: 'शिक्षा मंत्रालय / एआईसीटीई',
    },
    summary: {
      en: 'Provides maintenance allowance of ₹30,000 to ₹1,00,000 plus full academic fees for J&K and Ladakh domicile students studying outside the UTs.\nOpen to diploma and UG students passing 10+2 from state or CBSE board with family income up to ₹8 Lakh.',
      hi: 'केंद्र शासित प्रदेश से बाहर अध्ययन करने वाले जम्मू-कश्मीर और लद्दाख के छात्रों को रखरखाव भत्ता और पूर्ण शैक्षणिक शुल्क प्रदान करता है।\n₹8 लाख तक की वार्षिक आय वाले डिप्लोमा और स्नातक स्तर के पात्र छात्रों के लिए।',
    },
    levels: ['diploma', 'ug'],
    states: ['Jammu and Kashmir', 'Ladakh'],
    categories: 'ALL',
    maxIncome: 800000,
    benefitPerYear: 30000,
    deadlineInDays: 90,
    documents: ['aadhaar', 'income', 'marksheet', 'bank'],
  },
];
