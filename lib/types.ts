export type GameCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
};

export type Game = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category_id: string | null;
  class: 7 | 8 | 9 | null;
  creators: string;
  cover_url: string | null;
  cover_sm_url: string | null;
  accent_color: string;
  show_title_overlay: boolean;
  plays: number;
  likes: number;
  featured: boolean;
  published: boolean;
  created_at: string;
};

export type GameWithCode = Game & { html_code: string };

export type Album = {
  id: string;
  name: string;
  slug: string;
  description: string;
  cover_url: string | null;
  accent_color: string;
  sort_order: number;
};

export type Genre = {
  id: string;
  album_id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type Track = {
  id: string;
  slug: string;
  album_id: string;
  genre_id: string | null;
  title: string;
  creators: string;
  class: 7 | 8 | 9 | null;
  audio_url: string;
  cover_url: string | null;
  cover_sm_url: string | null;
  lyrics: string;
  duration_sec: number;
  plays: number;
  likes: number;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export type SiteSettings = {
  site_name: string;
  school_name: string;
  tagline: string;
};

/** Game fields safe to send to the browser (no html_code). */
export const GAME_FIELDS =
  "id,slug,title,description,category_id,class,creators,cover_url,cover_sm_url,accent_color,show_title_overlay,plays,likes,featured,published,created_at";

export const TRACK_FIELDS =
  "id,slug,album_id,genre_id,title,creators,class,audio_url,cover_url,cover_sm_url,lyrics,duration_sec,plays,likes,sort_order,published,created_at";
