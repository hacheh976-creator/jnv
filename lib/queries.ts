import "server-only";
import { cache } from "react";
import { publicDb, hasSupabaseEnv } from "./supabase/server";
import { demoAlbums, demoCategories, demoGames, demoGenres, demoTracks } from "./demo-data";
import {
  GAME_FIELDS,
  TRACK_FIELDS,
  type Album,
  type Game,
  type GameCategory,
  type GameWithCode,
  type Genre,
  type SiteSettings,
  type Track,
} from "./types";

export const isDemo = () => !hasSupabaseEnv();

const DEFAULT_SETTINGS: SiteSettings = {
  site_name: "JNV Studio",
  school_name: "PM SHRI School JNV Serchhip, Thenzawl",
  tagline: "Kan naupangte siam game leh hla",
};

export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (isDemo()) return DEFAULT_SETTINGS;
  const { data } = await publicDb().from("site_settings").select("site_name,school_name,tagline").maybeSingle();
  return (data as SiteSettings) ?? DEFAULT_SETTINGS;
});

export const getCategories = cache(async (): Promise<GameCategory[]> => {
  if (isDemo()) return demoCategories;
  const { data, error } = await publicDb().from("game_categories").select("*").order("sort_order");
  if (error) throw error;
  return data as GameCategory[];
});

export async function getGames(opts: { category?: string; cls?: number; limit?: number; order?: "new" | "popular" } = {}): Promise<Game[]> {
  if (isDemo()) {
    let list = demoGames;
    if (opts.category) {
      const c = demoCategories.find((x) => x.slug === opts.category);
      list = list.filter((g) => g.category_id === c?.id);
    }
    if (opts.cls) list = list.filter((g) => g.class === opts.cls);
    if (opts.order === "popular") list = [...list].sort((a, b) => b.plays - a.plays);
    return list.slice(0, opts.limit ?? 200);
  }
  let q = publicDb().from("games").select(GAME_FIELDS).eq("published", true);
  if (opts.category) {
    const cats = await getCategories();
    const c = cats.find((x) => x.slug === opts.category);
    if (c) q = q.eq("category_id", c.id);
  }
  if (opts.cls) q = q.eq("class", opts.cls);
  q = opts.order === "popular" ? q.order("plays", { ascending: false }) : q.order("created_at", { ascending: false });
  const { data, error } = await q.limit(opts.limit ?? 200);
  if (error) throw error;
  return data as unknown as Game[];
}

export async function getMosaicGames(): Promise<Game[]> {
  if (isDemo()) return demoGames;
  const { data, error } = await publicDb()
    .from("games")
    .select(GAME_FIELDS)
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(18);
  if (error) throw error;
  return data as unknown as Game[];
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  if (isDemo()) return demoGames.find((g) => g.slug === slug) ?? null;
  const { data } = await publicDb().from("games").select(GAME_FIELDS).eq("slug", slug).eq("published", true).maybeSingle();
  return (data as unknown as Game) ?? null;
}

export async function getGameCode(slug: string): Promise<GameWithCode | null> {
  if (isDemo()) {
    const g = demoGames.find((x) => x.slug === slug);
    return g ? { ...g, html_code: DEMO_GAME_HTML(g.title, g.accent_color) } : null;
  }
  const { data } = await publicDb().from("games").select(`${GAME_FIELDS},html_code`).eq("slug", slug).eq("published", true).maybeSingle();
  return (data as unknown as GameWithCode) ?? null;
}

export const getAlbums = cache(async (): Promise<Album[]> => {
  if (isDemo()) return demoAlbums;
  const { data, error } = await publicDb().from("albums").select("*").order("sort_order");
  if (error) throw error;
  return data as Album[];
});

export async function getAlbumTrackCounts(): Promise<Record<string, number>> {
  const tracks = isDemo()
    ? demoTracks
    : ((await publicDb().from("tracks").select("album_id").eq("published", true)).data ?? []);
  const counts: Record<string, number> = {};
  for (const t of tracks as { album_id: string }[]) counts[t.album_id] = (counts[t.album_id] ?? 0) + 1;
  return counts;
}

export async function getAlbumPage(slug: string): Promise<{ album: Album; genres: Genre[]; tracks: Track[] } | null> {
  const albums = await getAlbums();
  const album = albums.find((a) => a.slug === slug);
  if (!album) return null;
  if (isDemo()) {
    return {
      album,
      genres: demoGenres.filter((g) => g.album_id === album.id),
      tracks: demoTracks.filter((t) => t.album_id === album.id),
    };
  }
  const db = publicDb();
  const [g, t] = await Promise.all([
    db.from("genres").select("*").eq("album_id", album.id).order("sort_order"),
    db.from("tracks").select(TRACK_FIELDS).eq("album_id", album.id).eq("published", true).order("sort_order").order("created_at", { ascending: false }),
  ]);
  if (g.error) throw g.error;
  if (t.error) throw t.error;
  return { album, genres: g.data as Genre[], tracks: t.data as unknown as Track[] };
}

export async function getNewTracks(limit = 10): Promise<Track[]> {
  if (isDemo()) return demoTracks.slice(0, limit);
  const { data, error } = await publicDb()
    .from("tracks")
    .select(TRACK_FIELDS)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as unknown as Track[];
}

export async function search(q: string): Promise<{ games: Game[]; tracks: Track[] }> {
  const term = q.trim().slice(0, 60);
  if (!term) return { games: [], tracks: [] };
  if (isDemo()) {
    const s = term.toLowerCase();
    return {
      games: demoGames.filter((g) => `${g.title} ${g.creators} ${g.description}`.toLowerCase().includes(s)),
      tracks: demoTracks.filter((t) => `${t.title} ${t.creators}`.toLowerCase().includes(s)),
    };
  }
  // ilike works well for short names in Mizo/Hindi; escape wildcard characters
  const like = `"*${term.replace(/[%_*\\,()"']/g, " ").trim()}*"`;
  const db = publicDb();
  const [g, t] = await Promise.all([
    db.from("games").select(GAME_FIELDS).eq("published", true)
      .or(`title.ilike.${like},creators.ilike.${like},description.ilike.${like}`).limit(30),
    db.from("tracks").select(TRACK_FIELDS).eq("published", true)
      .or(`title.ilike.${like},creators.ilike.${like}`).limit(30),
  ]);
  return { games: (g.data ?? []) as unknown as Game[], tracks: (t.data ?? []) as unknown as Track[] };
}

const DEMO_GAME_HTML = (title: string, color: string) => `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>
body{margin:0;height:100vh;display:grid;place-items:center;background:#0b0b12;color:#fff;font-family:system-ui;text-align:center}
button{font-size:22px;padding:16px 28px;border-radius:999px;border:0;background:${color};color:#111;font-weight:700}
#n{font-size:64px;margin:16px}</style></head><body><div><h1>${title}</h1><p>Demo game — hmet la, chhiar rawh!</p>
<div id="n">0</div><button onclick="n.textContent=+n.textContent+1">Hmet rawh!</button></div></body></html>`;
