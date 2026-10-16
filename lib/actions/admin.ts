"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { adminDb } from "@/lib/supabase/admin";
import { randomSuffix, slugify } from "@/lib/utils";

export type Result<T = undefined> = { ok: true; data: T } | { ok: false; error: string };

function fail(e: unknown): { ok: false; error: string } {
  const msg = e instanceof z.ZodError ? e.issues.map((i) => i.message).join(", ") : e instanceof Error ? e.message : "Thil a dik lo";
  return { ok: false, error: msg };
}

function refresh() {
  revalidatePath("/", "layout");
}

async function uniqueSlug(table: "games" | "tracks", base: string, excludeId?: string) {
  let slug = slugify(base);
  for (let i = 0; i < 5; i++) {
    let q = adminDb().from(table).select("id").eq("slug", slug);
    if (excludeId) q = q.neq("id", excludeId);
    const { data } = await q.maybeSingle();
    if (!data) return slug;
    slug = `${slugify(base)}-${randomSuffix()}`;
  }
  return `${slugify(base)}-${randomSuffix(8)}`;
}

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Rong (hex) a dik lo");
const url = z.string().url().max(1000).nullable();
const cls = z.union([z.literal(7), z.literal(8), z.literal(9)]).nullable();

// ---------------- uploads ----------------

const UploadReq = z.object({
  bucket: z.enum(["covers", "audio"]),
  ext: z.enum(["webp", "png", "jpg", "mp3", "m4a", "aac", "wav"]),
  folder: z.string().regex(/^[a-z0-9-]{1,40}$/).default("misc"),
});

/** Returns a one-time signed URL; the browser uploads straight to Supabase Storage. */
export async function createUploadTarget(input: z.input<typeof UploadReq>): Promise<Result<{ signedUrl: string; publicUrl: string }>> {
  try {
    await requireAdmin();
    const { bucket, ext, folder } = UploadReq.parse(input);
    const path = `${folder}/${Date.now()}-${randomSuffix(8)}.${ext}`;
    const store = adminDb().storage.from(bucket);
    const { data, error } = await store.createSignedUploadUrl(path);
    if (error || !data) throw error ?? new Error("Upload URL siam a hlawhchham");
    const publicUrl = store.getPublicUrl(path).data.publicUrl;
    return { ok: true, data: { signedUrl: data.signedUrl, publicUrl } };
  } catch (e) {
    return fail(e);
  }
}

// ---------------- games ----------------

const GameInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1, "Hming dah rawh").max(80),
  slug: z.string().trim().max(60).optional(),
  description: z.string().max(2000).default(""),
  category_id: z.string().uuid().nullable(),
  class: cls,
  creators: z.string().trim().max(120).default(""),
  cover_url: url,
  cover_sm_url: url,
  accent_color: hex,
  show_title_overlay: z.boolean(),
  featured: z.boolean(),
  published: z.boolean(),
  html_code: z.string().max(2_000_000, "HTML a lian lutuk (2MB aia tlem tur)"),
});
export type GameInputT = z.input<typeof GameInput>;

export async function saveGame(input: GameInputT): Promise<Result<{ id: string; slug: string }>> {
  try {
    await requireAdmin();
    const g = GameInput.parse(input);
    const slug = await uniqueSlug("games", g.slug || g.title, g.id);
    const row = { ...g, slug };
    delete (row as { id?: string }).id;
    const db = adminDb().from("games");
    const { data, error } = g.id
      ? await db.update(row).eq("id", g.id).select("id,slug").single()
      : await db.insert(row).select("id,slug").single();
    if (error) throw error;
    refresh();
    return { ok: true, data };
  } catch (e) {
    return fail(e);
  }
}

export async function setGamePublished(id: string, published: boolean): Promise<Result> {
  try {
    await requireAdmin();
    const { error } = await adminDb().from("games").update({ published }).eq("id", z.string().uuid().parse(id));
    if (error) throw error;
    refresh();
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteGame(id: string): Promise<Result> {
  try {
    await requireAdmin();
    const { error } = await adminDb().from("games").delete().eq("id", z.string().uuid().parse(id));
    if (error) throw error;
    refresh();
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e);
  }
}

// ---------------- categories ----------------

const CategoryInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Hming dah rawh").max(40),
  icon: z.string().trim().max(40).default("gamepad-2"),
});

export async function saveCategory(input: z.input<typeof CategoryInput>): Promise<Result> {
  try {
    await requireAdmin();
    const c = CategoryInput.parse(input);
    const db = adminDb().from("game_categories");
    if (c.id) {
      const { error } = await db.update({ name: c.name, icon: c.icon }).eq("id", c.id);
      if (error) throw error;
    } else {
      const { count } = await adminDb().from("game_categories").select("id", { count: "exact", head: true });
      const { error } = await db.insert({ name: c.name, icon: c.icon, slug: `${slugify(c.name)}-${randomSuffix(3)}`, sort_order: (count ?? 0) + 1 });
      if (error) throw error;
    }
    refresh();
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteCategory(id: string): Promise<Result> {
  try {
    await requireAdmin();
    const { error } = await adminDb().from("game_categories").delete().eq("id", z.string().uuid().parse(id));
    if (error) throw error;
    refresh();
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e);
  }
}

const Reorder = z.object({
  table: z.enum(["game_categories", "albums", "genres", "tracks"]),
  ids: z.array(z.string().uuid()).max(500),
});

/** Saves a new order: ids[0] gets sort_order 1, and so on. */
export async function reorder(input: z.input<typeof Reorder>): Promise<Result> {
  try {
    await requireAdmin();
    const { table, ids } = Reorder.parse(input);
    const db = adminDb();
    const results = await Promise.all(ids.map((id, i) => db.from(table).update({ sort_order: i + 1 }).eq("id", id)));
    const err = results.find((r) => r.error)?.error;
    if (err) throw err;
    refresh();
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e);
  }
}

// ---------------- albums & genres ----------------

const AlbumInput = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(40),
  description: z.string().max(200).default(""),
  cover_url: url,
  accent_color: hex,
});

export async function saveAlbum(input: z.input<typeof AlbumInput>): Promise<Result> {
  try {
    await requireAdmin();
    const a = AlbumInput.parse(input);
    const { id, ...row } = a;
    const { error } = await adminDb().from("albums").update(row).eq("id", id);
    if (error) throw error;
    refresh();
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e);
  }
}

const NewAlbum = z.object({ name: z.string().trim().min(1, "Hming dah rawh").max(40), accent_color: hex });

export async function createAlbum(input: z.input<typeof NewAlbum>): Promise<Result<{ slug: string }>> {
  try {
    await requireAdmin();
    const a = NewAlbum.parse(input);
    const { count } = await adminDb().from("albums").select("id", { count: "exact", head: true });
    const slug = `${slugify(a.name)}-${randomSuffix(3)}`;
    const { error } = await adminDb().from("albums").insert({ ...a, slug, sort_order: (count ?? 0) + 1 });
    if (error) throw error;
    refresh();
    return { ok: true, data: { slug } };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteAlbum(id: string): Promise<Result> {
  try {
    await requireAdmin();
    const { error } = await adminDb().from("albums").delete().eq("id", z.string().uuid().parse(id));
    if (error) throw error;
    refresh();
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e);
  }
}

const GenreInput = z.object({
  id: z.string().uuid().optional(),
  album_id: z.string().uuid(),
  name: z.string().trim().min(1, "Hming dah rawh").max(40),
});

export async function saveGenre(input: z.input<typeof GenreInput>): Promise<Result> {
  try {
    await requireAdmin();
    const g = GenreInput.parse(input);
    const db = adminDb().from("genres");
    if (g.id) {
      const { error } = await db.update({ name: g.name }).eq("id", g.id);
      if (error) throw error;
    } else {
      const { count } = await adminDb().from("genres").select("id", { count: "exact", head: true }).eq("album_id", g.album_id);
      const { error } = await db.insert({ album_id: g.album_id, name: g.name, slug: `${slugify(g.name)}-${randomSuffix(3)}`, sort_order: (count ?? 0) + 1 });
      if (error) throw error;
    }
    refresh();
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteGenre(id: string): Promise<Result> {
  try {
    await requireAdmin();
    const { error } = await adminDb().from("genres").delete().eq("id", z.string().uuid().parse(id));
    if (error) throw error;
    refresh();
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e);
  }
}

// ---------------- tracks ----------------

const TrackInput = z.object({
  id: z.string().uuid().optional(),
  album_id: z.string().uuid(),
  genre_id: z.string().uuid().nullable(),
  title: z.string().trim().min(1, "Hla hming dah rawh").max(100),
  creators: z.string().trim().max(120).default(""),
  class: cls,
  audio_url: z.string().url().max(1000),
  cover_url: url,
  cover_sm_url: url,
  lyrics: z.string().max(20_000).default(""),
  duration_sec: z.number().int().min(0).max(60 * 60),
  published: z.boolean(),
});
export type TrackInputT = z.input<typeof TrackInput>;

export async function saveTrack(input: TrackInputT): Promise<Result<{ id: string }>> {
  try {
    await requireAdmin();
    const t = TrackInput.parse(input);
    const { id, ...row } = t;
    const db = adminDb().from("tracks");
    if (id) {
      const { error } = await db.update(row).eq("id", id);
      if (error) throw error;
      refresh();
      return { ok: true, data: { id } };
    }
    const slug = await uniqueSlug("tracks", t.title);
    const { count } = await adminDb().from("tracks").select("id", { count: "exact", head: true }).eq("album_id", t.album_id);
    const { data, error } = await db.insert({ ...row, slug, sort_order: (count ?? 0) + 1 }).select("id").single();
    if (error) throw error;
    refresh();
    return { ok: true, data };
  } catch (e) {
    return fail(e);
  }
}

export async function setTrackPublished(id: string, published: boolean): Promise<Result> {
  try {
    await requireAdmin();
    const { error } = await adminDb().from("tracks").update({ published }).eq("id", z.string().uuid().parse(id));
    if (error) throw error;
    refresh();
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteTrack(id: string): Promise<Result> {
  try {
    await requireAdmin();
    const { error } = await adminDb().from("tracks").delete().eq("id", z.string().uuid().parse(id));
    if (error) throw error;
    refresh();
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e);
  }
}

// ---------------- settings ----------------

const SettingsInput = z.object({
  site_name: z.string().trim().min(1).max(60),
  school_name: z.string().trim().min(1).max(120),
  tagline: z.string().trim().max(160),
});

export async function saveSettings(input: z.input<typeof SettingsInput>): Promise<Result> {
  try {
    await requireAdmin();
    const s = SettingsInput.parse(input);
    const { error } = await adminDb().from("site_settings").update(s).eq("id", 1);
    if (error) throw error;
    refresh();
    return { ok: true, data: undefined };
  } catch (e) {
    return fail(e);
  }
}
