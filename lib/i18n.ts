import { useLanguage, type Lang } from "./stores/language";

export const translations = {
  // Navigation
  home: {
    en: "Home",
    miz: "In",
    hi: "होम",
  },
  games: {
    en: "Games",
    miz: "Game",
    hi: "गेम्स",
  },
  music: {
    en: "Music",
    miz: "Hla",
    hi: "संगीत",
  },
  search: {
    en: "Search",
    miz: "Zawng",
    hi: "खोजें",
  },
  installApp: {
    en: "Install App",
    miz: "App Install rawh",
    hi: "ऐप इंस्टॉल करें",
  },

  // Hero Section
  playGames: {
    en: "Play Games",
    miz: "Game khel rawh",
    hi: "गेम्स खेलें",
  },
  listenMusic: {
    en: "Listen Music",
    miz: "Hla ngaithla rawh",
    hi: "गाने सुनें",
  },
  defaultTagline: {
    en: "Student-made games & AI songs",
    miz: "Kan naupangte siam game leh hla",
    hi: "छात्रों द्वारा बनाए गए गेम्स और एआई गाने",
  },

  // Section titles
  newGames: {
    en: "New Games",
    miz: "Game thar",
    hi: "नए गेम्स",
  },
  popularGames: {
    en: "Most Popular",
    miz: "A lar ber",
    hi: "सबसे लोकप्रिय",
  },
  albums: {
    en: "Music Albums",
    miz: "Hla Album",
    hi: "संगीत एल्बम",
  },
  newTracks: {
    en: "New Songs",
    miz: "Hla thar",
    hi: "नए गाने",
  },
  noGamesAvailable: {
    en: "No games available yet. Check back soon!",
    miz: "Game a la awm lo. A hun hnaiah lo en leh rawh!",
    hi: "अभी कोई गेम उपलब्ध नहीं है। जल्द ही देखें!",
  },
  viewAll: {
    en: "View All",
    miz: "En vek rawh",
    hi: "सभी देखें",
  },

  // Game details & Sheet
  play: {
    en: "PLAY",
    miz: "KHELH RAWH",
    hi: "खेलें",
  },
  playsCount: {
    en: "Plays",
    miz: "Khelh zat",
    hi: "कुल प्ले",
  },
  likesCount: {
    en: "Likes",
    miz: "Duh zat",
    hi: "पसंद",
  },
  howToPlay: {
    en: "How to Play",
    miz: "A khelh dan",
    hi: "कैसे खेलें",
  },
  controlsGuide: {
    en: "Game Controls",
    miz: "Controls Guide",
    hi: "नियंत्रण गाइड",
  },
  desktopControlsTip: {
    en: "Desktop / Keyboard: Arrow Keys or W/A/S/D to move, Space to Jump / Action.",
    miz: "Computer / Keyboard: Arrow Keys emaw W/A/S/D chetna, Space hi zuan/action nan.",
    hi: "कंप्यूटर: तीर कुंजी या W/A/S/D चलने के लिए, स्पेस बार कूदने/एक्शन के लिए।",
  },
  mobileControlsTip: {
    en: "Mobile / Phone: Rotate to landscape for full screen. Use on-screen virtual buttons or touch gestures.",
    miz: "Phone: Phone kha landscape (ti-phei)-in dah la, screen-a virtual touch controls emaw swipe hmang rawh.",
    hi: "मोबाइल: लैंडस्केप मोड में घुमाएं। ऑन-स्क्रीन वर्चुअल बटन या टच का उपयोग करें।",
  },
  share: {
    en: "Share",
    miz: "Share",
    hi: "शेयर",
  },
  like: {
    en: "Like",
    miz: "Ka duh",
    hi: "पसंद करें",
  },
  liked: {
    en: "Liked",
    miz: "Duh tawh",
    hi: "पसंद किया गया",
  },
  classLabel: {
    en: "Class",
    miz: "Pawl",
    hi: "कक्षा",
  },

  // Game Play Screen (/play/[slug])
  exit: {
    en: "Exit",
    miz: "Chhuak rawh",
    hi: "बाहर",
  },
  restart: {
    en: "Restart",
    miz: "Tan tha leh",
    hi: "पुनः आरंभ",
  },
  fullscreen: {
    en: "Fullscreen",
    miz: "Fullscreen",
    hi: "पूर्ण स्क्रीन",
  },
  rotateBanner: {
    en: "Rotate phone to Landscape mode for the best gaming experience 🔄",
    miz: "Phone hi landscape (ti-phei)-in dah la khelh a nuam ber 🔄",
    hi: "बेहतरीन गेमिंग अनुभव के लिए फोन को लैंडस्केप में घुमाएं 🔄",
  },
  virtualGamepad: {
    en: "Touch Gamepad",
    miz: "Screen Controller",
    hi: "वर्चुअल गेमपैड",
  },
  instructions: {
    en: "Instructions",
    miz: "Khelh dan",
    hi: "निर्देश",
  },
  instructionsModalTitle: {
    en: "Game Instructions & Controls",
    miz: "Game Khelh Dan & Controls",
    hi: "गेम के नियम और नियंत्रण",
  },
  gotIt: {
    en: "Got it! Resume",
    miz: "Khel chhunzawm rawh",
    hi: "समझ गए! खेलें",
  },
  close: {
    en: "Close",
    miz: "Khar rawh",
    hi: "बंद करें",
  },

  // Search
  searchPlaceholder: {
    en: "Search games, songs, students...",
    miz: "Game, hla, naupang hming zawng rawh...",
    hi: "गेम्स, गाने, छात्र खोजें...",
  },
  all: {
    en: "All",
    miz: "Zawng zawng",
    hi: "सभी",
  },

  // Language names
  langEnglish: {
    en: "English",
    miz: "English",
    hi: "English",
  },
  langMizo: {
    en: "Mizo",
    miz: "Mizo",
    hi: "Mizo",
  },
  langHindi: {
    en: "Hindi",
    miz: "Hindi",
    hi: "हिन्दी",
  },
} as const;

export type TranslationKey = keyof typeof translations;

/** Client hook for translation */
export function useTranslation() {
  const { lang, setLang } = useLanguage();

  function t(key: TranslationKey, fallback?: string): string {
    const entry = translations[key];
    if (!entry) return fallback ?? key;
    return entry[lang] ?? entry.en ?? fallback ?? key;
  }

  return { t, lang, setLang };
}

/** Pure helper to translate given a language code */
export function translate(key: TranslationKey, lang: Lang = "en", fallback?: string): string {
  const entry = translations[key];
  if (!entry) return fallback ?? key;
  return entry[lang] ?? entry.en ?? fallback ?? key;
}
