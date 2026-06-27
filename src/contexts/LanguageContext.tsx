import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Supported languages
export type LanguageCode = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'kn' | 'ml' | 'pa' | 'ha';

export interface LanguageOption {
  code: LanguageCode;
  label: string;       // native name
  englishLabel: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English',    englishLabel: 'English'   },
  { code: 'hi', label: 'हिन्दी',      englishLabel: 'Hindi'     },
  { code: 'mr', label: 'मराठी',       englishLabel: 'Marathi'   },
  { code: 'ta', label: 'தமிழ்',       englishLabel: 'Tamil'     },
  { code: 'te', label: 'తెలుగు',      englishLabel: 'Telugu'    },
  { code: 'kn', label: 'ಕನ್ನಡ',       englishLabel: 'Kannada'   },
  { code: 'ml', label: 'മലയാളം',     englishLabel: 'Malayalam' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ',      englishLabel: 'Punjabi'   },
  { code: 'ha', label: 'हरयाणवी',    englishLabel: 'Haryanvi'  },
];

// Translation keys
export type TranslationKey =
  // Navigation
  | 'nav.explore'
  | 'nav.planTrip'
  | 'nav.dashboard'
  | 'nav.profile'
  | 'nav.myTrips'
  | 'nav.travelWallet'
  | 'nav.myDocuments'
  | 'nav.aiAssistant'
  | 'nav.emergencyHub'
  | 'nav.transportHub'
  // Auth
  | 'auth.signIn'
  | 'auth.signOut'
  | 'auth.getStarted'
  | 'auth.createAccount'
  | 'auth.welcome'
  | 'auth.traveller'
  // Search
  | 'search.placeholder'
  | 'search.viewAllResults'
  | 'search.destinations'
  | 'search.experiences'
  // Profile
  | 'profile.settings'
  | 'profile.wishlist'
  | 'profile.fullName'
  | 'profile.bio'
  | 'profile.travelPersona'
  | 'profile.budgetPreference'
  | 'profile.preferredLanguage'
  | 'profile.saveProfile'
  | 'profile.saving'
  | 'profile.appearance'
  | 'profile.theme'
  | 'profile.bioPlaceholder'
  // Personas
  | 'persona.budget'
  | 'persona.luxury'
  | 'persona.adventure'
  | 'persona.food_explorer'
  | 'persona.religious'
  | 'persona.family'
  | 'persona.selectPersona'
  // Theme
  | 'theme.light'
  | 'theme.dark'
  | 'theme.system'
  // Common
  | 'common.view'
  | 'common.remove'
  | 'common.discover'
  | 'common.loading'
  | 'common.empty.wishlist'
  | 'common.adminPanel'
  | 'common.notifications';

type Translations = Record<TranslationKey, string>;
type TranslationMap = Record<LanguageCode, Translations>;

const translations: TranslationMap = {
  en: {
    'nav.explore':        'Explore',
    'nav.planTrip':       'Plan Trip',
    'nav.dashboard':      'Dashboard',
    'nav.profile':        'Profile',
    'nav.myTrips':        'My Trips',
    'nav.travelWallet':   'Travel Wallet',
    'nav.myDocuments':    'My Documents',
    'nav.aiAssistant':    'AI Assistant',
    'nav.emergencyHub':   'Emergency Hub',
    'nav.transportHub':   'Transport Hub',
    'auth.signIn':        'Sign in',
    'auth.signOut':       'Sign out',
    'auth.getStarted':    'Get started',
    'auth.createAccount': 'Create account',
    'auth.welcome':       'Welcome',
    'auth.traveller':     'Traveller',
    'search.placeholder':    'Search destinations, experiences…',
    'search.viewAllResults': 'View all results for',
    'search.destinations':   'Destinations',
    'search.experiences':    'Experiences',
    'profile.settings':         'Profile Settings',
    'profile.wishlist':         'Wishlist',
    'profile.fullName':         'Full Name',
    'profile.bio':              'Bio',
    'profile.travelPersona':    'Travel Persona',
    'profile.budgetPreference': 'Budget Preference (₹/trip)',
    'profile.preferredLanguage':'Preferred Language',
    'profile.saveProfile':      'Save Profile',
    'profile.saving':           'Saving…',
    'profile.appearance':       'Appearance',
    'profile.theme':            'Theme',
    'profile.bioPlaceholder':   'Tell us about your travel style…',
    'persona.budget':       'Budget Traveller',
    'persona.luxury':       'Luxury Voyager',
    'persona.adventure':    'Adventure Seeker',
    'persona.food_explorer':'Food Explorer',
    'persona.religious':    'Pilgrimage Traveller',
    'persona.family':       'Family Traveller',
    'persona.selectPersona':'Select persona',
    'theme.light':  'Light',
    'theme.dark':   'Dark',
    'theme.system': 'System',
    'common.view':          'View',
    'common.remove':        'Remove',
    'common.discover':      'Discover destinations',
    'common.loading':       'Loading…',
    'common.empty.wishlist':'Your wishlist is empty.',
    'common.adminPanel':    'Admin Panel',
    'common.notifications': 'Notifications',
  },
  hi: {
    'nav.explore':        'अन्वेषण करें',
    'nav.planTrip':       'यात्रा बनाएं',
    'nav.dashboard':      'डैशबोर्ड',
    'nav.profile':        'प्रोफ़ाइल',
    'nav.myTrips':        'मेरी यात्राएं',
    'nav.travelWallet':   'यात्रा वॉलेट',
    'nav.myDocuments':    'मेरे दस्तावेज़',
    'nav.aiAssistant':    'AI सहायक',
    'nav.emergencyHub':   'आपातकाल केंद्र',
    'nav.transportHub':   'परिवहन केंद्र',
    'auth.signIn':        'साइन इन करें',
    'auth.signOut':       'साइन आउट',
    'auth.getStarted':    'शुरू करें',
    'auth.createAccount': 'खाता बनाएं',
    'auth.welcome':       'स्वागत है',
    'auth.traveller':     'यात्री',
    'search.placeholder':    'गंतव्य, अनुभव खोजें…',
    'search.viewAllResults': 'सभी परिणाम देखें',
    'search.destinations':   'गंतव्य',
    'search.experiences':    'अनुभव',
    'profile.settings':         'प्रोफ़ाइल सेटिंग्स',
    'profile.wishlist':         'विश लिस्ट',
    'profile.fullName':         'पूरा नाम',
    'profile.bio':              'परिचय',
    'profile.travelPersona':    'यात्रा व्यक्तित्व',
    'profile.budgetPreference': 'बजट प्राथमिकता (₹/यात्रा)',
    'profile.preferredLanguage':'पसंदीदा भाषा',
    'profile.saveProfile':      'प्रोफ़ाइल सहेजें',
    'profile.saving':           'सहेज रहे हैं…',
    'profile.appearance':       'रूप-रंग',
    'profile.theme':            'थीम',
    'profile.bioPlaceholder':   'अपनी यात्रा शैली के बारे में बताएं…',
    'persona.budget':       'बजट यात्री',
    'persona.luxury':       'लक्जरी यात्री',
    'persona.adventure':    'साहसिक यात्री',
    'persona.food_explorer':'खाद्य अन्वेषक',
    'persona.religious':    'तीर्थ यात्री',
    'persona.family':       'पारिवारिक यात्री',
    'persona.selectPersona':'व्यक्तित्व चुनें',
    'theme.light':  'हल्का',
    'theme.dark':   'गहरा',
    'theme.system': 'सिस्टम',
    'common.view':          'देखें',
    'common.remove':        'हटाएं',
    'common.discover':      'गंतव्य खोजें',
    'common.loading':       'लोड हो रहा है…',
    'common.empty.wishlist':'आपकी विश लिस्ट खाली है।',
    'common.adminPanel':    'एडमिन पैनल',
    'common.notifications': 'सूचनाएं',
  },
  mr: {
    'nav.explore':        'एक्सप्लोर करा',
    'nav.planTrip':       'प्रवास नियोजन',
    'nav.dashboard':      'डॅशबोर्ड',
    'nav.profile':        'प्रोफाइल',
    'nav.myTrips':        'माझे प्रवास',
    'nav.travelWallet':   'प्रवास वॉलेट',
    'nav.myDocuments':    'माझे दस्तऐवज',
    'nav.aiAssistant':    'AI सहाय्यक',
    'nav.emergencyHub':   'आपत्कालीन केंद्र',
    'nav.transportHub':   'वाहतूक केंद्र',
    'auth.signIn':        'साइन इन करा',
    'auth.signOut':       'साइन आउट',
    'auth.getStarted':    'सुरुवात करा',
    'auth.createAccount': 'खाते तयार करा',
    'auth.welcome':       'स्वागत आहे',
    'auth.traveller':     'प्रवासी',
    'search.placeholder':    'गंतव्ये, अनुभव शोधा…',
    'search.viewAllResults': 'सर्व निकाल पाहा',
    'search.destinations':   'गंतव्ये',
    'search.experiences':    'अनुभव',
    'profile.settings':         'प्रोफाइल सेटिंग्ज',
    'profile.wishlist':         'विश लिस्ट',
    'profile.fullName':         'पूर्ण नाव',
    'profile.bio':              'परिचय',
    'profile.travelPersona':    'प्रवास व्यक्तिमत्त्व',
    'profile.budgetPreference': 'बजेट प्राधान्य (₹/प्रवास)',
    'profile.preferredLanguage':'पसंतीची भाषा',
    'profile.saveProfile':      'प्रोफाइल जतन करा',
    'profile.saving':           'जतन होत आहे…',
    'profile.appearance':       'दिसणे',
    'profile.theme':            'थीम',
    'profile.bioPlaceholder':   'आपल्या प्रवास शैलीबद्दल सांगा…',
    'persona.budget':       'बजेट प्रवासी',
    'persona.luxury':       'लक्झरी प्रवासी',
    'persona.adventure':    'साहसी प्रवासी',
    'persona.food_explorer':'खाद्य अन्वेषक',
    'persona.religious':    'तीर्थ प्रवासी',
    'persona.family':       'कौटुंबिक प्रवासी',
    'persona.selectPersona':'व्यक्तिमत्त्व निवडा',
    'theme.light':  'उजळ',
    'theme.dark':   'गडद',
    'theme.system': 'सिस्टम',
    'common.view':          'पाहा',
    'common.remove':        'काढा',
    'common.discover':      'गंतव्ये शोधा',
    'common.loading':       'लोड होत आहे…',
    'common.empty.wishlist':'तुमची विश लिस्ट रिकामी आहे.',
    'common.adminPanel':    'अॅडमिन पॅनल',
    'common.notifications': 'सूचना',
  },
  ta: {
    'nav.explore':        'ஆராயுங்கள்',
    'nav.planTrip':       'பயணத்தை திட்டமிடு',
    'nav.dashboard':      'டாஷ்போர்டு',
    'nav.profile':        'சுயவிவரம்',
    'nav.myTrips':        'என் பயணங்கள்',
    'nav.travelWallet':   'பயண பணப்பை',
    'nav.myDocuments':    'என் ஆவணங்கள்',
    'nav.aiAssistant':    'AI உதவியாளர்',
    'nav.emergencyHub':   'அவசர மையம்',
    'nav.transportHub':   'போக்குவரத்து மையம்',
    'auth.signIn':        'உள்நுழைக',
    'auth.signOut':       'வெளியேறு',
    'auth.getStarted':    'தொடங்குங்கள்',
    'auth.createAccount': 'கணக்கு உருவாக்கு',
    'auth.welcome':       'வரவேற்கிறோம்',
    'auth.traveller':     'பயணர்',
    'search.placeholder':    'இடங்கள், அனுபவங்களை தேடுங்கள்…',
    'search.viewAllResults': 'அனைத்து முடிவுகளையும் காண்க',
    'search.destinations':   'இடங்கள்',
    'search.experiences':    'அனுபவங்கள்',
    'profile.settings':         'சுயவிவர அமைப்புகள்',
    'profile.wishlist':         'விருப்பப்பட்டியல்',
    'profile.fullName':         'முழு பெயர்',
    'profile.bio':              'அறிமுகம்',
    'profile.travelPersona':    'பயண தன்மை',
    'profile.budgetPreference': 'பட்ஜெட் விருப்பம் (₹/பயணம்)',
    'profile.preferredLanguage':'விருப்பமான மொழி',
    'profile.saveProfile':      'சுயவிவரம் சேமி',
    'profile.saving':           'சேமிக்கிறது…',
    'profile.appearance':       'தோற்றம்',
    'profile.theme':            'தீம்',
    'profile.bioPlaceholder':   'உங்கள் பயண பாணியை சொல்லுங்கள்…',
    'persona.budget':       'பட்ஜெட் பயணர்',
    'persona.luxury':       'ஆடம்பர பயணர்',
    'persona.adventure':    'சாகச பயணர்',
    'persona.food_explorer':'உணவு ஆர்வலர்',
    'persona.religious':    'யாத்திரை பயணர்',
    'persona.family':       'குடும்ப பயணர்',
    'persona.selectPersona':'தன்மையை தேர்ந்தெடு',
    'theme.light':  'வெளிர்',
    'theme.dark':   'இருள்',
    'theme.system': 'சிஸ்டம்',
    'common.view':          'காண்க',
    'common.remove':        'அகற்று',
    'common.discover':      'இடங்களை கண்டறி',
    'common.loading':       'ஏற்றுகிறது…',
    'common.empty.wishlist':'உங்கள் விருப்பப்பட்டியல் காலியாக உள்ளது.',
    'common.adminPanel':    'நிர்வாக பலகை',
    'common.notifications': 'அறிவிப்புகள்',
  },
  te: {
    'nav.explore':        'అన్వేషించండి',
    'nav.planTrip':       'యాత్ర ప్లాన్ చేయండి',
    'nav.dashboard':      'డాష్‌బోర్డ్',
    'nav.profile':        'ప్రొఫైల్',
    'nav.myTrips':        'నా యాత్రలు',
    'nav.travelWallet':   'యాత్ర వాలెట్',
    'nav.myDocuments':    'నా పత్రాలు',
    'nav.aiAssistant':    'AI సహాయకుడు',
    'nav.emergencyHub':   'అత్యవసర కేంద్రం',
    'nav.transportHub':   'రవాణా కేంద్రం',
    'auth.signIn':        'సైన్ ఇన్',
    'auth.signOut':       'సైన్ అవుట్',
    'auth.getStarted':    'ప్రారంభించండి',
    'auth.createAccount': 'ఖాతా సృష్టించండి',
    'auth.welcome':       'స్వాగతం',
    'auth.traveller':     'యాత్రికుడు',
    'search.placeholder':    'గమ్యాలు, అనుభవాలు శోధించండి…',
    'search.viewAllResults': 'అన్ని ఫలితాలు చూడండి',
    'search.destinations':   'గమ్యాలు',
    'search.experiences':    'అనుభవాలు',
    'profile.settings':         'ప్రొఫైల్ సెట్టింగులు',
    'profile.wishlist':         'విష్ లిస్ట్',
    'profile.fullName':         'పూర్తి పేరు',
    'profile.bio':              'పరిచయం',
    'profile.travelPersona':    'యాత్ర వ్యక్తిత్వం',
    'profile.budgetPreference': 'బడ్జెట్ ప్రాధాన్యత (₹/యాత్ర)',
    'profile.preferredLanguage':'ఇష్టమైన భాష',
    'profile.saveProfile':      'ప్రొఫైల్ సేవ్ చేయండి',
    'profile.saving':           'సేవ్ అవుతోంది…',
    'profile.appearance':       'రూపం',
    'profile.theme':            'థీమ్',
    'profile.bioPlaceholder':   'మీ యాత్ర శైలి గురించి చెప్పండి…',
    'persona.budget':       'బడ్జెట్ యాత్రికుడు',
    'persona.luxury':       'లగ్జరీ యాత్రికుడు',
    'persona.adventure':    'సాహస యాత్రికుడు',
    'persona.food_explorer':'ఆహార అన్వేషకుడు',
    'persona.religious':    'తీర్థ యాత్రికుడు',
    'persona.family':       'కుటుంబ యాత్రికుడు',
    'persona.selectPersona':'వ్యక్తిత్వం ఎంచుకోండి',
    'theme.light':  'లైట్',
    'theme.dark':   'డార్క్',
    'theme.system': 'సిస్టమ్',
    'common.view':          'చూడండి',
    'common.remove':        'తొలగించండి',
    'common.discover':      'గమ్యాలు కనుగొనండి',
    'common.loading':       'లోడ్ అవుతోంది…',
    'common.empty.wishlist':'మీ విష్ లిస్ట్ ఖాళీగా ఉంది.',
    'common.adminPanel':    'అడ్మిన్ పానెల్',
    'common.notifications': 'నోటిఫికేషన్లు',
  },
  kn: {
    'nav.explore':        'ಅನ್ವೇಷಿಸಿ',
    'nav.planTrip':       'ಪ್ರಯಾಣ ಯೋಜಿಸಿ',
    'nav.dashboard':      'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'nav.profile':        'ಪ್ರೊಫೈಲ್',
    'nav.myTrips':        'ನನ್ನ ಪ್ರಯಾಣಗಳು',
    'nav.travelWallet':   'ಪ್ರಯಾಣ ವಾಲೆಟ್',
    'nav.myDocuments':    'ನನ್ನ ದಾಖಲೆಗಳು',
    'nav.aiAssistant':    'AI ಸಹಾಯಕ',
    'nav.emergencyHub':   'ತುರ್ತು ಕೇಂದ್ರ',
    'nav.transportHub':   'ಸಾರಿಗೆ ಕೇಂದ್ರ',
    'auth.signIn':        'ಸೈನ್ ಇನ್',
    'auth.signOut':       'ಸೈನ್ ಔಟ್',
    'auth.getStarted':    'ಪ್ರಾರಂಭಿಸಿ',
    'auth.createAccount': 'ಖಾತೆ ರಚಿಸಿ',
    'auth.welcome':       'ಸ್ವಾಗತ',
    'auth.traveller':     'ಪ್ರಯಾಣಿಕ',
    'search.placeholder':    'ಸ್ಥಳಗಳು, ಅನುಭವಗಳನ್ನು ಹುಡುಕಿ…',
    'search.viewAllResults': 'ಎಲ್ಲಾ ಫಲಿತಾಂಶಗಳನ್ನು ನೋಡಿ',
    'search.destinations':   'ಗಮ್ಯಸ್ಥಾನಗಳು',
    'search.experiences':    'ಅನುಭವಗಳು',
    'profile.settings':         'ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    'profile.wishlist':         'ವಿಷ್ ಲಿಸ್ಟ್',
    'profile.fullName':         'ಪೂರ್ಣ ಹೆಸರು',
    'profile.bio':              'ಪರಿಚಯ',
    'profile.travelPersona':    'ಪ್ರಯಾಣ ವ್ಯಕ್ತಿತ್ವ',
    'profile.budgetPreference': 'ಬಜೆಟ್ ಆದ್ಯತೆ (₹/ಪ್ರಯಾಣ)',
    'profile.preferredLanguage':'ಆದ್ಯತಾ ಭಾಷೆ',
    'profile.saveProfile':      'ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ',
    'profile.saving':           'ಉಳಿಸಲಾಗುತ್ತಿದೆ…',
    'profile.appearance':       'ನೋಟ',
    'profile.theme':            'ಥೀಮ್',
    'profile.bioPlaceholder':   'ನಿಮ್ಮ ಪ್ರಯಾಣ ಶೈಲಿಯ ಬಗ್ಗೆ ಹೇಳಿ…',
    'persona.budget':       'ಬಜೆಟ್ ಪ್ರಯಾಣಿಕ',
    'persona.luxury':       'ಐಷಾರಾಮಿ ಪ್ರಯಾಣಿಕ',
    'persona.adventure':    'ಸಾಹಸ ಪ್ರಯಾಣಿಕ',
    'persona.food_explorer':'ಆಹಾರ ಅನ್ವೇಷಕ',
    'persona.religious':    'ತೀರ್ಥ ಪ್ರಯಾಣಿಕ',
    'persona.family':       'ಕುಟುಂಬ ಪ್ರಯಾಣಿಕ',
    'persona.selectPersona':'ವ್ಯಕ್ತಿತ್ವ ಆಯ್ಕೆಮಾಡಿ',
    'theme.light':  'ಬೆಳಕು',
    'theme.dark':   'ಕತ್ತಲೆ',
    'theme.system': 'ಸಿಸ್ಟಮ್',
    'common.view':          'ನೋಡಿ',
    'common.remove':        'ತೆಗೆದುಹಾಕಿ',
    'common.discover':      'ಗಮ್ಯಸ್ಥಾನಗಳನ್ನು ಹುಡುಕಿ',
    'common.loading':       'ಲೋಡ್ ಆಗುತ್ತಿದೆ…',
    'common.empty.wishlist':'ನಿಮ್ಮ ವಿಷ್ ಲಿಸ್ಟ್ ಖಾಲಿಯಾಗಿದೆ.',
    'common.adminPanel':    'ಅಡ್ಮಿನ್ ಪ್ಯಾನೆಲ್',
    'common.notifications': 'ಅಧಿಸೂಚನೆಗಳು',
  },
  ml: {
    'nav.explore':        'പര്യവേക്ഷണം',
    'nav.planTrip':       'യാത്ര ആസൂത്രണം',
    'nav.dashboard':      'ഡാഷ്‌ബോർഡ്',
    'nav.profile':        'പ്രൊഫൈൽ',
    'nav.myTrips':        'എന്റെ യാത്രകൾ',
    'nav.travelWallet':   'യാത്രാ വാലറ്റ്',
    'nav.myDocuments':    'എന്റെ രേഖകൾ',
    'nav.aiAssistant':    'AI സഹായകൻ',
    'nav.emergencyHub':   'അടിയന്തര കേന്ദ്രം',
    'nav.transportHub':   'ഗതാഗത കേന്ദ്രം',
    'auth.signIn':        'സൈൻ ഇൻ',
    'auth.signOut':       'സൈൻ ഔട്ട്',
    'auth.getStarted':    'ആരംഭിക്കുക',
    'auth.createAccount': 'അക്കൗണ്ട് ഉണ്ടാക്കുക',
    'auth.welcome':       'സ്വാഗതം',
    'auth.traveller':     'യാത്രക്കാരൻ',
    'search.placeholder':    'സ്ഥലങ്ങൾ, അനുഭവങ്ങൾ തിരയുക…',
    'search.viewAllResults': 'എല്ലാ ഫലങ്ങളും കാണുക',
    'search.destinations':   'ലക്ഷ്യസ്ഥാനങ്ങൾ',
    'search.experiences':    'അനുഭവങ്ങൾ',
    'profile.settings':         'പ്രൊഫൈൽ ക്രമീകരണങ്ങൾ',
    'profile.wishlist':         'ആഗ്രഹ പട്ടിക',
    'profile.fullName':         'പൂർണ്ണ നാമം',
    'profile.bio':              'പരിചയം',
    'profile.travelPersona':    'യാത്രാ വ്യക്തിത്വം',
    'profile.budgetPreference': 'ബജറ്റ് മുൻഗണന (₹/യാത്ര)',
    'profile.preferredLanguage':'ഇഷ്ടപ്പെട്ട ഭാഷ',
    'profile.saveProfile':      'പ്രൊഫൈൽ സേവ് ചെയ്യുക',
    'profile.saving':           'സേവ് ചെയ്യുന്നു…',
    'profile.appearance':       'രൂപം',
    'profile.theme':            'തീം',
    'profile.bioPlaceholder':   'നിങ്ങളുടെ യാത്രാ ശൈലിയെ കുറിച്ച് പറയൂ…',
    'persona.budget':       'ബജറ്റ് യാത്രക്കാരൻ',
    'persona.luxury':       'ആഡംബര യാത്രക്കാരൻ',
    'persona.adventure':    'സാഹസ യാത്രക്കാരൻ',
    'persona.food_explorer':'ഭക്ഷണ പ്രിയൻ',
    'persona.religious':    'തീർഥാടകൻ',
    'persona.family':       'കുടുംബ യാത്രക്കാരൻ',
    'persona.selectPersona':'വ്യക്തിത്വം തിരഞ്ഞെടുക്കുക',
    'theme.light':  'ശോഭനം',
    'theme.dark':   'ഇരുണ്ട',
    'theme.system': 'സിസ്റ്റം',
    'common.view':          'കാണുക',
    'common.remove':        'നീക്കം ചെയ്യുക',
    'common.discover':      'സ്ഥലങ്ങൾ കണ്ടെത്തുക',
    'common.loading':       'ലോഡ് ചെയ്യുന്നു…',
    'common.empty.wishlist':'നിങ്ങളുടെ ആഗ്രഹ പട്ടിക ശൂന്യമാണ്.',
    'common.adminPanel':    'അഡ്മിൻ പാനൽ',
    'common.notifications': 'അറിയിപ്പുകൾ',
  },
  pa: {
    'nav.explore':        'ਖੋਜ ਕਰੋ',
    'nav.planTrip':       'ਯਾਤਰਾ ਬਣਾਓ',
    'nav.dashboard':      'ਡੈਸ਼ਬੋਰਡ',
    'nav.profile':        'ਪ੍ਰੋਫਾਈਲ',
    'nav.myTrips':        'ਮੇਰੀਆਂ ਯਾਤਰਾਵਾਂ',
    'nav.travelWallet':   'ਯਾਤਰਾ ਵਾਲੇਟ',
    'nav.myDocuments':    'ਮੇਰੇ ਦਸਤਾਵੇਜ਼',
    'nav.aiAssistant':    'AI ਸਹਾਇਕ',
    'nav.emergencyHub':   'ਐਮਰਜੈਂਸੀ ਕੇਂਦਰ',
    'nav.transportHub':   'ਆਵਾਜਾਈ ਕੇਂਦਰ',
    'auth.signIn':        'ਸਾਈਨ ਇਨ ਕਰੋ',
    'auth.signOut':       'ਸਾਈਨ ਆਊਟ',
    'auth.getStarted':    'ਸ਼ੁਰੂ ਕਰੋ',
    'auth.createAccount': 'ਖਾਤਾ ਬਣਾਓ',
    'auth.welcome':       'ਜੀ ਆਇਆਂ',
    'auth.traveller':     'ਯਾਤਰੀ',
    'search.placeholder':    'ਮੰਜ਼ਿਲਾਂ, ਤਜ਼ਰਬੇ ਖੋਜੋ…',
    'search.viewAllResults': 'ਸਾਰੇ ਨਤੀਜੇ ਦੇਖੋ',
    'search.destinations':   'ਮੰਜ਼ਿਲਾਂ',
    'search.experiences':    'ਤਜ਼ਰਬੇ',
    'profile.settings':         'ਪ੍ਰੋਫਾਈਲ ਸੈਟਿੰਗਜ਼',
    'profile.wishlist':         'ਵਿਸ਼ ਲਿਸਟ',
    'profile.fullName':         'ਪੂਰਾ ਨਾਮ',
    'profile.bio':              'ਜਾਣ-ਪਛਾਣ',
    'profile.travelPersona':    'ਯਾਤਰਾ ਸ਼ਖਸੀਅਤ',
    'profile.budgetPreference': 'ਬਜਟ ਤਰਜੀਹ (₹/ਯਾਤਰਾ)',
    'profile.preferredLanguage':'ਮਨਪਸੰਦ ਭਾਸ਼ਾ',
    'profile.saveProfile':      'ਪ੍ਰੋਫਾਈਲ ਸੇਵ ਕਰੋ',
    'profile.saving':           'ਸੇਵ ਹੋ ਰਿਹਾ ਹੈ…',
    'profile.appearance':       'ਦਿੱਖ',
    'profile.theme':            'ਥੀਮ',
    'profile.bioPlaceholder':   'ਆਪਣੀ ਯਾਤਰਾ ਸ਼ੈਲੀ ਬਾਰੇ ਦੱਸੋ…',
    'persona.budget':       'ਬਜਟ ਯਾਤਰੀ',
    'persona.luxury':       'ਲਗਜ਼ਰੀ ਯਾਤਰੀ',
    'persona.adventure':    'ਸਾਹਸੀ ਯਾਤਰੀ',
    'persona.food_explorer':'ਭੋਜਨ ਖੋਜੀ',
    'persona.religious':    'ਤੀਰਥ ਯਾਤਰੀ',
    'persona.family':       'ਪਰਿਵਾਰਕ ਯਾਤਰੀ',
    'persona.selectPersona':'ਸ਼ਖਸੀਅਤ ਚੁਣੋ',
    'theme.light':  'ਹਲਕਾ',
    'theme.dark':   'ਗਹਿਰਾ',
    'theme.system': 'ਸਿਸਟਮ',
    'common.view':          'ਦੇਖੋ',
    'common.remove':        'ਹਟਾਓ',
    'common.discover':      'ਮੰਜ਼ਿਲਾਂ ਲੱਭੋ',
    'common.loading':       'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…',
    'common.empty.wishlist':'ਤੁਹਾਡੀ ਵਿਸ਼ ਲਿਸਟ ਖਾਲੀ ਹੈ।',
    'common.adminPanel':    'ਐਡਮਿਨ ਪੈਨਲ',
    'common.notifications': 'ਸੂਚਨਾਵਾਂ',
  },
  ha: {
    'nav.explore':        'खोज करो',
    'nav.planTrip':       'यात्रा बणाओ',
    'nav.dashboard':      'डैशबोर्ड',
    'nav.profile':        'प्रोफाइल',
    'nav.myTrips':        'म्हारी यात्रावां',
    'nav.travelWallet':   'यात्रा वॉलेट',
    'nav.myDocuments':    'म्हारे कागज',
    'nav.aiAssistant':    'AI सहाई',
    'nav.emergencyHub':   'आपातकाल केंद्र',
    'nav.transportHub':   'वाहन केंद्र',
    'auth.signIn':        'साइन इन करो',
    'auth.signOut':       'साइन आउट',
    'auth.getStarted':    'शुरू करो',
    'auth.createAccount': 'खाता बणाओ',
    'auth.welcome':       'आओ बणो',
    'auth.traveller':     'मुसाफिर',
    'search.placeholder':    'जगह, तजरबे खोजो…',
    'search.viewAllResults': 'सब नतीजे देखो',
    'search.destinations':   'जगहां',
    'search.experiences':    'तजरबे',
    'profile.settings':         'प्रोफाइल सेटिंग',
    'profile.wishlist':         'विश लिस्ट',
    'profile.fullName':         'पूरा नाम',
    'profile.bio':              'जाण-पहचाण',
    'profile.travelPersona':    'यात्रा तेवर',
    'profile.budgetPreference': 'बजट (₹/यात्रा)',
    'profile.preferredLanguage':'पसंदीदा भाषा',
    'profile.saveProfile':      'प्रोफाइल सेव करो',
    'profile.saving':           'सेव हो रया सै…',
    'profile.appearance':       'दिखावट',
    'profile.theme':            'थीम',
    'profile.bioPlaceholder':   'आपणे यात्रा तरीके बारे बताओ…',
    'persona.budget':       'सस्ता मुसाफिर',
    'persona.luxury':       'शाही मुसाफिर',
    'persona.adventure':    'साहसी मुसाफिर',
    'persona.food_explorer':'खाणे का शौकीन',
    'persona.religious':    'तीरथ यात्री',
    'persona.family':       'पारिवारिक मुसाफिर',
    'persona.selectPersona':'तेवर चुणो',
    'theme.light':  'उजला',
    'theme.dark':   'गहरा',
    'theme.system': 'सिस्टम',
    'common.view':          'देखो',
    'common.remove':        'हटाओ',
    'common.discover':      'जगहां लभो',
    'common.loading':       'लोड हो रया सै…',
    'common.empty.wishlist':'थारी विश लिस्ट खाली सै।',
    'common.adminPanel':    'एडमिन पैनल',
    'common.notifications': 'सूचनावां',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: TranslationKey) => string;
  currentLanguage: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'yaatra_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    return stored && LANGUAGES.some(l => l.code === stored) ? stored : 'en';
  });

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
    localStorage.setItem(STORAGE_KEY, code);
  };

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] ?? translations['en'][key] ?? key;
  };

  const currentLanguage = LANGUAGES.find(l => l.code === language) ?? LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
