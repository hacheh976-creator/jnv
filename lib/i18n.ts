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
  downloadApp: {
    en: "Download App",
    miz: "App download rawh",
    hi: "ऐप डाउनलोड करें",
  },
  downloadAppShort: {
    en: "App",
    miz: "App",
    hi: "ऐप",
  },
  installAppCardDesc: {
    en: "Add to home screen, play anytime like an app",
    miz: "Phone home screen-ah dah la, app angin hmang rawh",
    hi: "फ़ोन होम स्क्रीन पर जोड़ें, ऐप की तरह उपयोग करें",
  },
  installIosTitle: {
    en: "How to install on iPhone",
    miz: "iPhone-ah dah dan",
    hi: "iPhone पर कैसे इंस्टॉल करें",
  },
  installIosStep1: {
    en: "Tap the Share button at the bottom of Safari",
    miz: "Safari hnuai lama Share button hmet rawh",
    hi: "सफ़ारी के नीचे शेयर बटन दबाएं",
  },
  installIosStep2: {
    en: "Tap 'Add to Home Screen'",
    miz: "Add to Home Screen hmet rawh",
    hi: "'होम स्क्रीन पर जोड़ें' दबाएं",
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
  searchQueryPlaceholder: {
    en: "Game or song name...",
    miz: "Game emaw hla hming...",
    hi: "गेम या गाना खोजें...",
  },
  searchQueryBtn: {
    en: "Search",
    miz: "Zawng",
    hi: "खोजें",
  },
  searchNotFound: {
    en: "No results found for",
    miz: "hi kan hmu lo. Thumal dang hmang rawh.",
    hi: "के लिए कोई परिणाम नहीं मिला। कृपया दूसरा शब्द आज़माएँ।",
  },
  all: {
    en: "All",
    miz: "Zawng zawng",
    hi: "सभी",
  },

  // Games page
  gamesSubtitle: {
    en: "Student-made games — tap and play!",
    miz: "Kan naupangte siam game — hmet la, khel rawh!",
    hi: "छात्रों द्वारा बनाए गए खेल — खेलें और आनंद लें!",
  },
  allClasses: {
    en: "All Classes",
    miz: "Class zawng zawng",
    hi: "सभी कक्षाएं",
  },
  noGamesFilter: {
    en: "No games found here. Try another filter.",
    miz: "Hetah hian game a la awm lo. Filter dang thlang rawh.",
    hi: "यहाँ कोई गेम नहीं मिला। कोई अन्य फ़िल्टर चुनें।",
  },

  // Music page
  musicSubtitle: {
    en: "Student-composed songs powered by AI — listen now!",
    miz: "Kan naupangte phuah hla — Gemini hmangin",
    hi: "छात्रों द्वारा लिखे गए गाने — एआई द्वारा संचालित",
  },
  songsCount: {
    en: "songs",
    miz: "hla",
    hi: "गाने",
  },
  playAll: {
    en: "Play all",
    miz: "Play all",
    hi: "सभी बजाएं",
  },
  shuffle: {
    en: "Shuffle",
    miz: "Shuffle",
    hi: "शफ़ल",
  },
  noTracksAvailable: {
    en: "No songs available yet. Check back soon!",
    miz: "Hla a la awm lo. A hun hnaiah lo en leh rawh!",
    hi: "अभी कोई गाना उपलब्ध नहीं है। जल्द ही देखें!",
  },

  // Player
  expandPlayer: {
    en: "Expand player",
    miz: "Player lian en rawh",
    hi: "प्लेयर बड़ा करें",
  },
  nextTrack: {
    en: "Next track",
    miz: "A dawt leh",
    hi: "अगला गाना",
  },
  songTab: {
    en: "Song",
    miz: "Hla",
    hi: "गाना",
  },
  lyricsTab: {
    en: "Lyrics",
    miz: "Lyrics",
    hi: "गीत के बोल",
  },
  noLyrics: {
    en: "No lyrics available.",
    miz: "Lyrics a la awm lo.",
    hi: "गीत के बोल उपलब्ध नहीं हैं।",
  },

  // Error & Common
  errorTitle: {
    en: "Something went wrong",
    miz: "Diklo a awm tlat mai",
    hi: "कुछ गलत हो गया",
  },
  errorDesc: {
    en: "Check your internet connection and try again",
    miz: "Internet en la, thar thawh leh rawh",
    hi: "अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें",
  },
  retry: {
    en: "Try again",
    miz: "Thar thawh leh rawh",
    hi: "पुनः प्रयास करें",
  },
  heroTagline: {
    en: "Student-made games & AI songs",
    miz: "Kan naupangte siam game leh hla",
    hi: "छात्रों द्वारा बनाए गए गेम्स और एआई गाने",
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
