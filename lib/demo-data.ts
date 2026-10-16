// Sample content shown only when Supabase env vars are not set yet,
// so the design can be previewed before connecting the database.
import type { Album, Game, GameCategory, Genre, Track } from "./types";

export const demoCategories: GameCategory[] = [
  { id: "c1", name: "Puzzle", slug: "puzzle", icon: "puzzle", sort_order: 1 },
  { id: "c2", name: "Action", slug: "action", icon: "swords", sort_order: 2 },
  { id: "c3", name: "Quiz", slug: "quiz", icon: "circle-help", sort_order: 3 },
  { id: "c4", name: "Racing", slug: "racing", icon: "car", sort_order: 4 },
];

const g = (
  i: number,
  title: string,
  cat: string,
  cls: 7 | 8 | 9,
  creators: string,
  accent: string,
  desc: string,
): Game => ({
  id: `g${i}`,
  slug: `demo-${i}`,
  title,
  description: desc,
  category_id: cat,
  class: cls,
  creators,
  cover_url: null,
  cover_sm_url: null,
  accent_color: accent,
  show_title_overlay: true,
  plays: 1200 - i * 97,
  likes: 300 - i * 21,
  featured: i < 4,
  published: true,
  created_at: new Date(2026, 9, 16 - i).toISOString(),
});

export const demoGames: Game[] = [
  g(1, "Tlang Runner", "c2", 8, "Mawia", "#F7931E", "Tlang chunga tlan chhuak la, lung pumpelh rawh!"),
  g(2, "Math Blast", "c3", 7, "Team Thlifim", "#3B82F6", "Chhiar hmanhmawh takin zawhna chhang rawh."),
  g(3, "Snake Zawl", "c2", 9, "Rina", "#2EA043", "Rul te chaw ei tir la, a sei zel ang."),
  g(4, "Memory Match", "c1", 7, "Puii", "#E5484D", "Card pahnih inang zawng chhuak rawh."),
  g(5, "Thenzawl Racer", "c4", 9, "Team Speed", "#A855F7", "Thenzawl kawngah motor tlan siak."),
  g(6, "Word Hunt", "c1", 8, "Teteii", "#FACC15", "Mizo thumal thup zawng chhuak rawh."),
  g(7, "Space Shooter", "c2", 9, "Zaua", "#06B6D4", "Boruak chhunga hmelma kap rawh."),
  g(8, "Flag Quiz", "c3", 8, "Mami", "#F43F5E", "Ram tin flag hriat chiang em?"),
];

export const demoAlbums: Album[] = [
  { id: "a1", name: "Mizo", slug: "mizo", description: "Mizo hla — Gospel leh Lengzem", cover_url: null, accent_color: "#F7931E", sort_order: 1 },
  { id: "a2", name: "English", slug: "english", description: "English songs — Gospel and more", cover_url: null, accent_color: "#3B82F6", sort_order: 2 },
  { id: "a3", name: "Hindi", slug: "hindi", description: "हिंदी गाने — Hindi songs", cover_url: null, accent_color: "#2EA043", sort_order: 3 },
];

export const demoGenres: Genre[] = [
  { id: "n1", album_id: "a1", name: "Gospel", slug: "gospel", sort_order: 1 },
  { id: "n2", album_id: "a1", name: "Lengzem", slug: "lengzem", sort_order: 2 },
  { id: "n3", album_id: "a2", name: "Gospel", slug: "gospel", sort_order: 1 },
  { id: "n4", album_id: "a2", name: "Others", slug: "others", sort_order: 2 },
];

const t = (
  i: number,
  title: string,
  album: string,
  genre: string | null,
  creators: string,
  cls: 7 | 8 | 9,
): Track => ({
  id: `t${i}`,
  slug: `demo-track-${i}`,
  album_id: album,
  genre_id: genre,
  title,
  creators,
  class: cls,
  audio_url: "",
  cover_url: null,
  cover_sm_url: null,
  lyrics: "He hi demo hla a ni.\nSupabase i connect hnuah\nhla dik tak a lang ang.",
  duration_sec: 150 + i * 17,
  plays: 500 - i * 30,
  likes: 80 - i * 5,
  sort_order: i,
  published: true,
  created_at: new Date(2026, 9, 16 - i).toISOString(),
});

export const demoTracks: Track[] = [
  t(1, "Lalpa Ka Fak Ang", "a1", "n1", "Class 8 Choir", 8),
  t(2, "Thenzawl Tlang", "a1", "n2", "Mawia", 9),
  t(3, "Krista Hmangaihna", "a1", "n1", "Rina", 7),
  t(4, "Amazing Light", "a2", "n3", "Team Thlifim", 8),
  t(5, "School Days", "a2", "n4", "Zaua", 9),
  t(6, "मेरा भारत", "a3", null, "Mami", 8),
  t(7, "सपनों की उड़ान", "a3", null, "Puii", 7),
];
