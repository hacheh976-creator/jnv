"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, FileAudio, Loader2, Save, Trash2 } from "lucide-react";
import { Button, Field, Input, Segmented, Select, Textarea, Toggle, confirmDelete, toast } from "../ui";
import { CoverPicker } from "../CoverPicker";
import { ProgressBar } from "../ProgressBar";
import { deleteTrack, saveTrack, type TrackInputT } from "@/lib/actions/admin";
import { audioExt, readDuration, uploadFile } from "@/lib/upload";
import type { Album, Genre, Track } from "@/lib/types";
import { formatDuration } from "@/lib/utils";

export function TrackForm({ track, albums, genres }: { track: Track; albums: Album[]; genres: Genre[] }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [f, setF] = useState<TrackInputT>({
    id: track.id,
    album_id: track.album_id,
    genre_id: track.genre_id,
    title: track.title,
    creators: track.creators,
    class: track.class,
    audio_url: track.audio_url,
    cover_url: track.cover_url,
    cover_sm_url: track.cover_sm_url,
    lyrics: track.lyrics,
    duration_sec: track.duration_sec,
    published: track.published,
  });
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState<number | null>(null);
  const albumGenres = genres.filter((g) => g.album_id === f.album_id);
  const album = albums.find((a) => a.id === f.album_id);

  async function replaceAudio(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const ext = audioExt(file);
    if (!ext) return toast.error("MP3/M4A chauh");
    if (file.size > 15 * 1024 * 1024) return toast.error("15MB aia lian");
    try {
      setPct(0);
      const [url, dur] = await Promise.all([uploadFile("audio", file, ext, album?.slug ?? "music", setPct), readDuration(file)]);
      setF((x) => ({ ...x, audio_url: url, duration_sec: dur }));
      toast.ok("Hla file thlak a ni ta — Vawng hmet rawh");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload a hlawhchham");
    } finally {
      setPct(null);
    }
  }

  async function save() {
    setBusy(true);
    const r = await saveTrack(f);
    setBusy(false);
    if (!r.ok) return toast.error(r.error);
    toast.ok("Vawn a ni ta!");
    router.refresh();
  }

  async function remove() {
    if (!confirmDelete(f.title)) return;
    const r = await deleteTrack(track.id);
    if (!r.ok) return toast.error(r.error);
    toast.ok("Paih a ni ta");
    router.replace(album ? `/admin/music/${album.slug}` : "/admin/music");
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href={album ? `/admin/music/${album.slug}` : "/admin/music"} className="grid h-11 w-11 place-items-center rounded-full bg-surface-2" aria-label="Kir leh"><ChevronLeft /></Link>
        <h1 className="mr-auto truncate font-display text-2xl font-extrabold">{f.title || "Hla"}</h1>
        <Button variant="danger" onClick={remove}><Trash2 size={18} /> <span className="hidden sm:inline">Paih</span></Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl bg-surface p-4">
          <Field label="Hla hming *"><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} maxLength={100} /></Field>
          <Field label="Siamtute" hint="Hming hmasa chauh"><Input value={f.creators} onChange={(e) => setF({ ...f, creators: e.target.value })} maxLength={120} /></Field>
          <div>
            <span className="mb-1.5 block font-semibold">Class</span>
            <Segmented value={f.class ?? 0} onChange={(v) => setF({ ...f, class: v ? (v as 7 | 8 | 9) : null })} options={[{ value: 7, label: "7" }, { value: 8, label: "8" }, { value: 9, label: "9" }, { value: 0, label: "—" }]} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Album">
              <Select value={f.album_id} onChange={(e) => setF({ ...f, album_id: e.target.value, genre_id: genres.find((g) => g.album_id === e.target.value)?.id ?? null })}>
                {albums.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </Select>
            </Field>
            {albumGenres.length > 0 && (
              <Field label="Genre">
                <Select value={f.genre_id ?? ""} onChange={(e) => setF({ ...f, genre_id: e.target.value || null })}>
                  {albumGenres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  <option value="">— Awm lo —</option>
                </Select>
              </Field>
            )}
          </div>
          <div className="rounded-2xl bg-surface-2 p-3">
            <div className="flex items-center gap-3">
              <FileAudio className="text-saffron" />
              <span className="flex-1 text-sm">Hla file · {formatDuration(f.duration_sec)}</span>
              <Button variant="ghost" className="h-10 text-sm" onClick={() => fileInput.current?.click()} disabled={pct !== null}>Thlak</Button>
            </div>
            {pct !== null && <div className="mt-2"><ProgressBar value={pct} /></div>}
            <audio src={f.audio_url} controls preload="none" className="mt-3 w-full" />
            <input ref={fileInput} type="file" accept="audio/mpeg,audio/mp4,.mp3,.m4a" hidden onChange={replaceAudio} />
          </div>
          <Toggle checked={f.published} onChange={(v) => setF({ ...f, published: v })} label="Published" hint="Off chuan user-te an hmu thei lo" />
        </div>

        <div className="space-y-4 rounded-3xl bg-surface p-4">
          <CoverPicker
            folder="tracks"
            accent={album?.accent_color ?? "#F7931E"}
            value={{ cover_url: f.cover_url ?? null, cover_sm_url: f.cover_sm_url ?? null }}
            onChange={(v) => setF({ ...f, ...v })}
            label="Hla cover (duh chuan)"
          />
          <Field label="Lyrics" hint="Hla thu — line tin Enter hmet rawh">
            <Textarea value={f.lyrics} onChange={(e) => setF({ ...f, lyrics: e.target.value })} className="min-h-72" />
          </Field>
        </div>
      </div>

      <div className="sticky bottom-[calc(72px+env(safe-area-inset-bottom))] mt-4 lg:bottom-4">
        <Button onClick={save} disabled={busy || pct !== null} className="w-full shadow-2xl">
          {busy ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Vawng rawh
        </Button>
      </div>
    </div>
  );
}
