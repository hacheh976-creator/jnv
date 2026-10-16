"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Music, UploadCloud, XCircle } from "lucide-react";
import { Button, Field, Input, Segmented, Select, Toggle, toast } from "../ui";
import { ProgressBar } from "../ProgressBar";
import { saveTrack } from "@/lib/actions/admin";
import { audioExt, readDuration, titleFromFile, uploadFile } from "@/lib/upload";
import type { Album, Genre } from "@/lib/types";
import { cn } from "@/lib/utils";

type Item = { file: File; title: string; status: "wait" | "up" | "done" | "error"; pct: number; error?: string };
const MAX = 15 * 1024 * 1024;

export function BulkUpload({ album, genres }: { album: Album; genres: Genre[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [genreId, setGenreId] = useState<string>(genres[0]?.id ?? "");
  const [cls, setCls] = useState<number>(0);
  const [creators, setCreators] = useState("");
  const [publish, setPublish] = useState(true);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next: Item[] = [];
    for (const file of Array.from(list)) {
      if (!audioExt(file)) {
        toast.error(`${file.name}: MP3/M4A chauh`);
        continue;
      }
      if (file.size > MAX) {
        toast.error(`${file.name}: 15MB aia lian`);
        continue;
      }
      next.push({ file, title: titleFromFile(file.name), status: "wait", pct: 0 });
    }
    setItems((l) => [...l, ...next]);
  }

  function patch(i: number, p: Partial<Item>) {
    setItems((l) => l.map((x, j) => (j === i ? { ...x, ...p } : x)));
  }

  async function start() {
    setBusy(true);
    let ok = 0;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.status === "done") continue;
      patch(i, { status: "up", pct: 0, error: undefined });
      try {
        const ext = audioExt(it.file)!;
        const [url, duration] = await Promise.all([
          uploadFile("audio", it.file, ext, album.slug.replace(/[^a-z0-9-]/g, "").slice(0, 40) || "music", (p) => patch(i, { pct: p })),
          readDuration(it.file),
        ]);
        const r = await saveTrack({
          album_id: album.id,
          genre_id: genreId || null,
          title: it.title.trim() || titleFromFile(it.file.name),
          creators,
          class: cls ? (cls as 7 | 8 | 9) : null,
          audio_url: url,
          cover_url: null,
          cover_sm_url: null,
          lyrics: "",
          duration_sec: duration,
          published: publish,
        });
        if (!r.ok) throw new Error(r.error);
        patch(i, { status: "done", pct: 100 });
        ok++;
      } catch (e) {
        patch(i, { status: "error", error: e instanceof Error ? e.message : "A hlawhchham" });
      }
    }
    setBusy(false);
    setItems((l) => l.filter((x) => x.status !== "done"));
    if (ok) {
      toast.ok(`Hla ${ok} upload a ni ta!`);
      router.refresh();
    }
  }

  const pending = items.filter((x) => x.status !== "done").length;

  return (
    <div className="rounded-3xl bg-surface p-4">
      <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><UploadCloud size={20} /> Hla upload rawh</h2>
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
        className={cn(
          "flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
          drag ? "border-saffron bg-saffron/10" : "border-line hover:border-saffron/60",
        )}
      >
        <UploadCloud size={40} className="text-saffron" />
        <span className="text-lg font-bold">MP3 file thlang rawh</span>
        <span className="text-sm text-muted">Pakhat aia tam a thlan theih · 15MB aia tlem tur</span>
      </button>
      <input ref={input} type="file" accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/aac,.mp3,.m4a" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />

      {items.length > 0 && (
        <div className="mt-4 space-y-4">
          <ul className="space-y-2">
            {items.map((it, i) => (
              <li key={i} className="rounded-2xl bg-surface-2 p-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5">
                    {it.status === "done" ? <CheckCircle2 className="text-green" /> : it.status === "error" ? <XCircle className="text-red" /> : it.status === "up" ? <Loader2 className="animate-spin text-saffron" /> : <Music className="text-muted" />}
                  </span>
                  <Input
                    value={it.title}
                    disabled={busy || it.status === "done"}
                    onChange={(e) => patch(i, { title: e.target.value })}
                    className="h-10"
                    aria-label="Hla hming"
                  />
                  {!busy && it.status !== "done" && (
                    <button onClick={() => setItems((l) => l.filter((_, j) => j !== i))} aria-label="Paih" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-muted hover:text-red"><XCircle size={20} /></button>
                  )}
                </div>
                {it.status === "up" && <div className="mt-2"><ProgressBar value={it.pct} /></div>}
                {it.error && <p className="mt-1 text-xs text-red">{it.error}</p>}
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {genres.length > 0 && (
              <Field label="Genre">
                <Select value={genreId} onChange={(e) => setGenreId(e.target.value)} disabled={busy}>
                  {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  <option value="">— Genre awm lo —</option>
                </Select>
              </Field>
            )}
            <Field label="Siamtute (hla zawng zawng tan)" hint="Hming hmasa chauh — e.g. Class 8 Choir">
              <Input value={creators} onChange={(e) => setCreators(e.target.value)} disabled={busy} maxLength={120} />
            </Field>
          </div>
          <div>
            <span className="mb-1.5 block font-semibold">Class</span>
            <Segmented value={cls} onChange={setCls} options={[{ value: 7, label: "7" }, { value: 8, label: "8" }, { value: 9, label: "9" }, { value: 0, label: "—" }]} />
          </div>
          <Toggle checked={publish} onChange={setPublish} label="Publish nghal rawh" hint="Off chuan Draft-ah a awm ang" />
          <Button onClick={start} disabled={busy || pending === 0} className="w-full">
            {busy ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
            {busy ? "Upload mek..." : `Hla ${pending} upload rawh`}
          </Button>
        </div>
      )}
    </div>
  );
}
