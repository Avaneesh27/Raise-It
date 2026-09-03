export type Language = 'en' | 'hi' | 'mr';

export interface Translations {
  nav: {
    home: string;
    howItWorks: string;
    features: string;
    about: string;
    login: string;
    signUp: string;
    reportIssue: string;
    dashboard: string;
  };
  hero: {
    tagline: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    badge: string;
    statsReports: string;
    statsResolved: string;
    statsSpeed: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: {
      number: string;
      title: string;
      description: string;
    }[];
  };
  features: {
    title: string;
    subtitle: string;
    aiTitle: string;
    aiDesc: string;
    recurrenceTitle: string;
    recurrenceDesc: string;
    trackingTitle: string;
    trackingDesc: string;
    assistantTitle: string;
    assistantDesc: string;
  };
  workflow: {
    title: string;
    subtitle: string;
    citizenStep: string;
    citizenDesc: string;
    aiStep: string;
    aiDesc: string;
    authorityStep: string;
    authorityDesc: string;
    resolvedStep: string;
    resolvedDesc: string;
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
    authorityLink: string;
  };
  footer: {
    tagline: string;
    product: string;
    resources: string;
    company: string;
    legal: string;
    copyright: string;
    links: {
      howItWorks: string;
      features: string;
      reportIssue: string;
      trackReports: string;
      civicAssistant: string;
      help: string;
      faq: string;
      about: string;
      contact: string;
      privacy: string;
      terms: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      howItWorks: 'How It Works',
      features: 'Features',
      about: 'About',
      login: 'Login',
      signUp: 'Sign Up',
      reportIssue: 'Report an Issue',
      dashboard: 'Dashboard'
    },
    hero: {
      tagline: 'Civic Reporting Reimagined',
      title: 'Report. Track. Improve.',
      subtitle:
        'Report civic problems with a photo and location. RaiseIt helps identify the issue, find recurring problems and connect your complaint with the responsible authority.',
      ctaPrimary: 'Report an Issue',
      ctaSecondary: 'See How It Works',
      badge: 'Official Municipal Grievance Network',
      statsReports: 'Complaints Managed',
      statsResolved: 'Resolution Rate',
      statsSpeed: 'Avg Response Time'
    },
    howItWorks: {
      title: 'How RaiseIt Works',
      subtitle: 'From street photo to verified municipal resolution in 6 clear steps.',
      steps: [
        {
          number: '01',
          title: 'Take a Photo',
          description: 'Capture the civic problem using your phone camera or upload from gallery.'
        },
        {
          number: '02',
          title: 'Confirm Location',
          description: 'Attach GPS coordinates and confirm your neighborhood street address.'
        },
        {
          number: '03',
          title: 'AI Identifies the Problem',
          description: 'RaiseIt analyzes image evidence and suggests the issue category with confidence.'
        },
        {
          number: '04',
          title: 'Check Nearby Reports',
          description: 'The system checks whether similar issues have already been reported nearby.'
        },
        {
          number: '05',
          title: 'Review & Submit',
          description: 'You confirm all information and receive an official tracking ticket ID.'
        },
        {
          number: '06',
          title: 'Track Resolution',
          description: 'Follow your complaint with live updates until work is inspected and resolved.'
        }
      ]
    },
    features: {
      title: 'Intelligent Civic Infrastructure',
      subtitle: 'Designed for transparency, accountability, and rapid municipal action.',
      aiTitle: 'AI-Powered Issue Detection',
      aiDesc:
        'Isolated computer vision classifies potholes, garbage accumulation, streetlights, drainage, and infrastructure damage automatically.',
      recurrenceTitle: 'Recurring Issue Prioritization',
      recurrenceDesc:
        'Geospatial clustering flags repeated complaints within 500 meters, automatically escalating neglected chronic issues.',
      trackingTitle: 'Transparent Complaint Tracking',
      trackingDesc:
        'Follow real-time status progression from review to work-order assignment, progress notes, and photo-verified completion.',
      assistantTitle: 'Civic Knowledge Assistant',
      assistantDesc:
        'Context-aware RAG assistant grounds answers strictly on verified municipal SOPs, citizen charters, and official timelines.'
    },
    workflow: {
      title: 'Citizen → Authority Workflow',
      subtitle: 'Connecting community reports directly to authorized municipal field officers.',
      citizenStep: 'Citizen Reports',
      citizenDesc: 'Captures defect photo, GPS pin, and submits with AI assistance in under 60 seconds.',
      aiStep: 'RaiseIt Engine',
      aiDesc: 'Verifies category, calculates deterministic priority, detects clusters, and assigns department.',
      authorityStep: 'Authority Handles',
      authorityDesc: 'Designated ward engineer reviews evidence, assigns maintenance crew, and posts progress logs.',
      resolvedStep: 'Issue Resolved',
      resolvedDesc: 'Physical repair completed with resolution photo and permanent citizen audit timeline.'
    },
    cta: {
      title: 'Help make our neighborhoods better.',
      subtitle:
        'Every report helps local authorities prioritize repairs, eliminate recurring blackspots, and keep public infrastructure safe.',
      button: 'Report a Problem Now',
      authorityLink: 'Municipal Authority Sign In →'
    },
    footer: {
      tagline: 'Making civic reporting simpler.',
      product: 'Product',
      resources: 'Resources',
      company: 'Company',
      legal: 'Legal',
      copyright: '© 2026 RaiseIt. All rights reserved.',
      links: {
        howItWorks: 'How It Works',
        features: 'Features',
        reportIssue: 'Report an Issue',
        trackReports: 'Track Reports',
        civicAssistant: 'Civic Assistant',
        help: 'Help Center',
        faq: 'FAQ',
        about: 'About Us',
        contact: 'Contact',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service'
      }
    }
  },
  hi: {
    nav: {
      home: 'होम',
      howItWorks: 'कार्य प्रणाली',
      features: 'सुविधाएं',
      about: 'परिचय',
      login: 'लॉग इन',
      signUp: 'साइन अप',
      reportIssue: 'समस्या दर्ज करें',
      dashboard: 'डैशबोर्ड'
    },
    hero: {
      tagline: 'नागरिक समस्या समाधान मंच',
      title: 'रिपोर्ट करें। ट्रैक करें। सुधारें।',
      subtitle:
        'फोटो और लोकेशन के साथ नागरिक समस्याओं की रिपोर्ट करें। RaiseIt समस्या को पहचानने, बार-बार होने वाली समस्याओं को खोजने और सक्षम प्राधिकारी से जोड़ने में मदद करता है।',
      ctaPrimary: 'समस्या दर्ज करें',
      ctaSecondary: 'कार्यप्रणाली देखें',
      badge: 'आधिकारिक नगर निगम शिकायत नेटवर्क',
      statsReports: 'निपटाई गई शिकायतें',
      statsResolved: 'समाधान दर',
      statsSpeed: 'औसत प्रतिक्रिया समय'
    },
    howItWorks: {
      title: 'RaiseIt कैसे काम करता है',
      subtitle: 'सड़क की फोटो से लेकर प्रमाणित नगरपालिका समाधान तक के 6 आसान चरण।',
      steps: [
        {
          number: '01',
          title: 'फोटो लें',
          description: 'अपने फोन से नागरिक समस्या की फोटो खींचें या गैलरी से अपलोड करें।'
        },
        {
          number: '02',
          title: 'स्थान की पुष्टि करें',
          description: 'जीपीएस लोकेशन और अपने मोहल्ले का पता संलग्न करें।'
        },
        {
          number: '03',
          title: 'AI समस्या की पहचान करता है',
          description: 'RaiseIt फोटो देखकर समस्या की श्रेणी और विश्वसनीयता स्कोर सुझाता है।'
        },
        {
          number: '04',
          title: 'आस-पास की रिपोर्ट देखें',
          description: 'सिस्टम जांचता है कि क्या पास में ऐसी समस्या पहले से दर्ज है।'
        },
        {
          number: '05',
          title: 'समीक्षा और सबमिट करें',
          description: 'जानकारी की पुष्टि करें और अपना आधिकारिक ट्रैकिंग टिकट प्राप्त करें।'
        },
        {
          number: '06',
          title: 'समाधान ट्रैक करें',
          description: 'समस्या के हल होने तक लाइव स्टेटस अपडेट देखें।'
        }
      ]
    },
    features: {
      title: 'सक्षम नागरिक प्रणाली',
      subtitle: 'पारदर्शिता, जवाबदेही और त्वरित नगरपालिका कार्रवाई के लिए निर्मित।',
      aiTitle: 'AI-संचालित समस्या पहचान',
      aiDesc: 'कंप्यूटर विज़न गड्ढों, कचरे, स्ट्रीटलाइट और जलभराव को तुरंत पहचानता है।',
      recurrenceTitle: 'बार-बार होने वाली समस्याओं की प्राथमिकता',
      recurrenceDesc: '500 मीटर के भीतर बार-बार आने वाली शिकायतों को स्वतः उच्च प्राथमिकता मिलती है।',
      trackingTitle: 'पारदर्शी शिकायत ट्रैकिंग',
      trackingDesc: 'समीक्षा से लेकर मरम्मत और फोटो प्रमाण तक हर कदम को ट्रैक करें।',
      assistantTitle: 'नागरिक ज्ञान सहायक',
      assistantDesc: 'आधिकारिक नगरपालिका नियमों और नागरिक चार्टर पर आधारित सही जानकारी प्राप्त करें।'
    },
    workflow: {
      title: 'नागरिक → प्राधिकारी कार्यप्रवाह',
      subtitle: 'सीधे वार्ड इंजीनियरों और जिम्मेदार अधिकारियों से जुड़ें।',
      citizenStep: 'नागरिक रिपोर्ट',
      citizenDesc: 'फोटो खींचकर 60 सेकंड में शिकायत दर्ज करें।',
      aiStep: 'RaiseIt इंजन',
      aiDesc: 'प्राथमिकता तय करता है और संबंधित विभाग को भेजता है।',
      authorityStep: 'अधिकारी कार्रवाई',
      authorityDesc: 'वार्ड अधिकारी कार्य आदेश जारी करते हैं और प्रगति दर्ज करते हैं।',
      resolvedStep: 'समस्या का समाधान',
      resolvedDesc: 'मरम्मत पूर्ण होने पर फोटो प्रमाण सहित नागरिक को सूचित किया जाता है।'
    },
    cta: {
      title: 'अपने शहर को स्वच्छ और सुरक्षित बनाएं।',
      subtitle: 'आपकी हर रिपोर्ट अधिकारियों को तेजी से काम करने और बार-बार होने वाली समस्याओं को हल करने में मदद करती है।',
      button: 'अभी समस्या दर्ज करें',
      authorityLink: 'विभागीय अधिकारी लॉगिन →'
    },
    footer: {
      tagline: 'नागरिक शिकायतों का सरल समाधान।',
      product: 'उत्पाद',
      resources: 'संसाधन',
      company: 'संस्था',
      legal: 'कानूनी',
      copyright: '© 2026 RaiseIt. सर्वाधिकार सुरक्षित।',
      links: {
        howItWorks: 'कार्य प्रणाली',
        features: 'सुविधाएं',
        reportIssue: 'समस्या दर्ज करें',
        trackReports: 'रिपोर्ट ट्रैक करें',
        civicAssistant: 'नागरिक सहायक',
        help: 'सहायता केंद्र',
        faq: 'सामान्य प्रश्न',
        about: 'हमारे बारे में',
        contact: 'संपर्क करें',
        privacy: 'गोपनीयता नीति',
        terms: 'सेवा की शर्तें'
      }
    }
  },
  mr: {
    nav: {
      home: 'मुख्यपृष्ठ',
      howItWorks: 'कार्यपद्धती',
      features: 'वैशिष्ट्ये',
      about: 'माहिती',
      login: 'लॉगिन',
      signUp: 'साइन अप',
      reportIssue: 'तक्रार नोंदवा',
      dashboard: 'डॅशबोर्ड'
    },
    hero: {
      tagline: 'नागरी तक्रार निवारण व्यासपीठ',
      title: 'नोंदवा. ट्रॅक करा. सुधारा.',
      subtitle:
        'फोटो आणि स्थानासह नागरी समस्यांची तक्रार नोंदवा. RaiseIt समस्येचे वर्गीकरण करून संबंधित महानगरपालिका प्राधिकरणाशी थेट संपर्क साधून देते.',
      ctaPrimary: 'समस्या नोंदवा',
      ctaSecondary: 'कार्यपद्धती पहा',
      badge: 'अधिकृत महानगरपालिका तक्रार निवारण यंत्रणा',
      statsReports: 'नोंदवलेल्या तक्रारी',
      statsResolved: 'निवारण प्रमाण',
      statsSpeed: 'सरासरी प्रतिसाद वेळ'
    },
    howItWorks: {
      title: 'RaiseIt कसे कार्य करते',
      subtitle: 'समस्येच्या फोटोपासून ते अधिकृत दुरुस्तीपर्यंतचे ६ सोपे टप्पे.',
      steps: [
        {
          number: '01',
          title: 'फोटो काढा',
          description: 'आपल्या फोन कॅमेऱ्याने समस्येचा फोटो घ्या किंवा गॅलरीतून निवडा.'
        },
        {
          number: '02',
          title: 'स्थान निश्चित करा',
          description: 'GPS लोकेशन जोडून आपल्या परिसराचा पत्ता तपासा.'
        },
        {
          number: '03',
          title: 'AI द्वारे तपासणी',
          description: 'RaiseIt फोटो तपासून समस्येचा प्रकार व अचूकता स्कोर सुचवते.'
        },
        {
          number: '04',
          title: 'जवळील तक्रारी तपासा',
          description: 'परिसरात आधीपासून अशी तक्रार प्रलंबित आहे का हे पाहिले जाते.'
        },
        {
          number: '05',
          title: 'तपासणी व सबमिट',
          description: 'माहिती तपासून सबमिट करा आणि अधिकृत ट्रॅकिंग तिकीट मिळवा.'
        },
        {
          number: '06',
          title: 'निवारण ट्रॅक करा',
          description: 'काम पूर्ण होईपर्यंत तक्रारीची स्थिती थेट ट्रॅक करा.'
        }
      ]
    },
    features: {
      title: 'प्रभावी नागरी पायाभूत सुविधा',
      subtitle: 'पारदर्शकता, जबाबदारी आणि जलद कारवाईसाठी बनवलेले व्यासपीठ.',
      aiTitle: 'AI-आधारित समस्या ओळख',
      aiDesc: 'खड्डे, कचरा, पथदिवे आणि ड्रेनेज समस्यांची स्वयंचलित अचूक तपासणी.',
      recurrenceTitle: 'वारंवार उद्भवणाऱ्या समस्यांना प्राधान्य',
      recurrenceDesc: '५०० मीटरच्या परिघात वारंवार येणाऱ्या तक्रारींना थेट उच्च प्राधान्य दिले जाते.',
      trackingTitle: 'पारदर्शक तक्रार ट्रॅकिंग',
      trackingDesc: 'समीक्षेपासून ते दुरुस्ती आणि फोटो पुराव्यापर्यंत सर्व टप्पे पारदर्शकपणे पहा.',
      assistantTitle: 'नागरी ज्ञान सहाय्यक',
      assistantDesc: 'अधिकृत महानगरपालिका नियम आणि मार्गदर्शक तत्त्वांवर आधारित अचूक उत्तरे मिळवा.'
    },
    workflow: {
      title: 'नागरिक → प्राधिकरण कार्यप्रवाह',
      subtitle: 'नागरिकांच्या तक्रारी थेट संबंधित प्रभाग अभियंत्यांपर्यंत पोहोचतात.',
      citizenStep: 'नागरिक तक्रार',
      citizenDesc: 'फोटो काढून ६० सेकंदात तक्रार दाखल करा.',
      aiStep: 'RaiseIt प्रणाली',
      aiDesc: 'प्राधान्य ठरवून संबंधित विभागाकडे तक्रार वर्ग करते.',
      authorityStep: 'अधिकारी कारवाई',
      authorityDesc: 'अभियंता कामाचा आदेश देऊन दुरुस्तीची नोंद ठेवतात.',
      resolvedStep: 'समस्या निवारण',
      resolvedDesc: 'काम पूर्ण झाल्यावर फोटो पुराव्यासह नागरिकाला सूचना दिली जाते.'
    },
    cta: {
      title: 'आपला परिसर स्वच्छ आणि सुरक्षित ठेवा.',
      subtitle: 'प्रत्येक तक्रार प्रशासनाला जलद काम करण्यास आणि समस्या कायमस्वरूपी सोडवण्यास मदत करते.',
      button: 'आता तक्रार नोंदवा',
      authorityLink: 'विभागीय अधिकारी लॉगिन →'
    },
    footer: {
      tagline: 'नागरी तक्रारींचे सुलभ निवारण.',
      product: 'उत्पादन',
      resources: 'साधने',
      company: 'कंपनी',
      legal: 'कायदेशीर',
      copyright: '© 2026 RaiseIt. सर्व हक्क राखीव.',
      links: {
        howItWorks: 'कार्यपद्धती',
        features: 'वैशिष्ट्ये',
        reportIssue: 'समस्या नोंदवा',
        trackReports: 'तक्रार ट्रॅक करा',
        civicAssistant: 'नागरी सहाय्यक',
        help: 'मदत केंद्र',
        faq: 'सामान्य प्रश्न',
        about: 'आमच्याबद्दल',
        contact: 'संपर्क',
        privacy: 'गोपनीयता धोरण',
        terms: 'सेवा अटी'
      }
    }
  }
};
