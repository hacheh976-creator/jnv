"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ClipboardPaste, Code2, Eye, FileUp, Info, Loader2, RefreshCw, Rocket, Save, Trash2 } from "lucide-react";
import { Button, Field, Input, Segmented, Select, Textarea, Toggle, toast, confirmDelete } from "./ui";
import { CoverPicker } from "./CoverPicker";
import { GameCard } from "@/components/game/GameCard";
import { deleteGame, saveGame, type GameInputT } from "@/lib/actions/admin";
import type { Game, GameCategory, GameWithCode } from "@/lib/types";
import { cn } from "@/lib/utils";

const Monaco = dynamic(() => import("@monaco-editor/react").then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-muted">
      <Loader2 className="animate-spin" />
    </div>
  ),
});

const STARTER = `<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ka Game</title>
</head>
<body>
  <!-- Gemini atanga i game code kha hetah paste rawh -->
</body>
</html>`;

type Tab = "code" | "preview" | "info";

export function GameEditor({ game, categories }: { game?: GameWithCode; categories: GameCategory[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("code");
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [dirty, setDirty] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const [monacoReady, setMonacoReady] = useState(false);
  const [monacoSlow, setMonacoSlow] = useState(false);
  const [form, setForm] = useState<GameInputT>(() => ({
    id: game?.id,
    title: game?.title ?? "",
    slug: game?.slug ?? "",
    description: game?.description ?? "",
    category_id: game?.category_id ?? categories[0]?.id ?? null,
    class: game?.class ?? null,
    creators: game?.creators ?? "",
    cover_url: game?.cover_url ?? null,
    cover_sm_url: game?.cover_sm_url ?? null,
    accent_color: game?.accent_color ?? "#F7931E",
    show_title_overlay: game?.show_title_overlay ?? true,
    featured: game?.featured ?? false,
    published: game?.published ?? false,
    html_code: game?.html_code ?? STARTER,
  }));

  function set<K extends keyof GameInputT>(k: K, v: GameInputT[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
  }

  useEffect(() => {
    const t = setTimeout(() => setCoarse(window.matchMedia("(pointer: coarse)").matches), 0);
    return () => clearTimeout(t);
  }, []);

  // if the code editor (loaded from a CDN) is slow, fall back to a plain text box
  useEffect(() => {
    if (monacoReady) return;
    const t = setTimeout(() => setMonacoSlow(true), 8000);
    return () => clearTimeout(t);
  }, [monacoReady]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save(publish: boolean) {
    if (!form.title.trim()) {
      setTab("info");
      return toast.error("Game hming dah rawh");
    }
    setSaving(publish ? "publish" : "draft");
    const r = await saveGame({ ...form, published: publish });
    setSaving(null);
    if (!r.ok) return toast.error(r.error);
    setDirty(false);
    setForm((f) => ({ ...f, id: r.data.id, slug: r.data.slug, published: publish }));
    toast.ok(publish ? "Publish a ni ta! 🎉" : "Vawn a ni ta!");
    if (!game) router.replace(`/admin/games/${r.data.id}`);
    else router.refresh();
  }

  async function remove() {
    if (!form.id || !confirmDelete(form.title || "He game")) return;
    const r = await deleteGame(form.id);
    if (!r.ok) return toast.error(r.error);
    setDirty(false);
    toast.ok("Paih a ni ta");
    router.replace("/admin/games");
  }

  async function paste() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) return toast.error("Clipboard-ah thil a awm lo");
      set("html_code", text);
      toast.ok("Paste a ni ta!");
    } catch {
      toast.error("Paste theih a ni lo — code box-ah Ctrl+V hmang rawh");
    }
  }

  function onHtmlFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) return toast.error("File a lian lutuk (2MB aia tlem tur)");
    f.text().then((t) => {
      set("html_code", t);
      if (!form.title) set("title", f.name.replace(/\.html?$/i, ""));
      toast.ok("File lak a ni ta!");
    });
  }

  const previewGame: Game = useMemo(
    () => ({
      id: form.id ?? "preview",
      slug: form.slug || "preview",
      title: form.title || "Game hming",
      description: form.description ?? "",
      category_id: form.category_id,
      class: form.class,
      creators: form.creators ?? "",
      cover_url: form.cover_url,
      cover_sm_url: form.cover_sm_url,
      accent_color: form.accent_color,
      show_title_overlay: form.show_title_overlay,
      plays: 0,
      likes: 0,
      featured: form.featured,
      published: form.published,
      created_at: "",
    }),
    [form],
  );

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "code", label: "Code", icon: <Code2 size={18} /> },
    { id: "preview", label: "Preview", icon: <Eye size={18} /> },
    { id: "info", label: "Info", icon: <Info size={18} /> },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link href="/admin/games" className="grid h-11 w-11 place-items-center rounded-full bg-surface-2" aria-label="Kir leh">
          <ChevronLeft />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-2xl font-extrabold">{game ? form.title || "Game" : "Game thar"}</h1>
          <p className="text-sm text-muted">
            {form.published ? <span className="text-green">● Published</span> : "● Draft"}
            {dirty && <span className="ml-2 text-yellow">· Vawn loh thil a awm</span>}
          </p>
        </div>
        {form.id && (
          <Button variant="danger" onClick={remove} aria-label="Paih rawh">
            <Trash2 size={18} /> <span className="hidden sm:inline">Paih</span>
          </Button>
        )}
      </div>

      {/* mobile tabs */}
      <div className="sticky top-14 z-20 -mx-4 mb-4 flex gap-2 bg-bg/95 px-4 py-2 backdrop-blur lg:hidden">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full font-bold",
              tab === t.id ? "bg-text text-bg" : "bg-surface-2 text-muted",
            )}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-5">
          {/* CODE */}
          <section className={cn("rounded-3xl bg-surface p-4", tab !== "code" && "hidden lg:block")}>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h2 className="mr-auto flex items-center gap-2 font-display text-lg font-bold"><Code2 size={20} /> HTML Code</h2>
              <Button variant="ghost" className="h-10 text-sm" onClick={paste}>
                <ClipboardPaste size={16} /> Paste
              </Button>
              <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-surface-2 px-4 text-sm font-bold hover:bg-white/10">
                <FileUp size={16} /> .html file
                <input type="file" accept=".html,.htm,text/html" hidden onChange={onHtmlFile} />
              </label>
            </div>
            <div className="h-[55dvh] overflow-hidden rounded-2xl border border-line lg:h-[440px]">
              {coarse || (monacoSlow && !monacoReady) ? (
                <textarea
                  value={form.html_code}
                  onChange={(e) => set("html_code", e.target.value)}
                  spellCheck={false}
                  className="h-full w-full resize-none bg-[#1e1e1e] p-3 font-mono text-xs leading-relaxed text-[#d4d4d4] outline-none"
                />
              ) : (
                <Monaco
                  height="100%"
                  defaultLanguage="html"
                  theme="vs-dark"
                  value={form.html_code}
                  onChange={(v) => set("html_code", v ?? "")}
                  onMount={() => setMonacoReady(true)}
                  options={{ minimap: { enabled: false }, fontSize: 13, wordWrap: "on", scrollBeyondLastLine: false, tabSize: 2 }}
                />
              )}
            </div>
            <p className="mt-2 text-xs text-muted">{(new Blob([form.html_code]).size / 1024).toFixed(1)} KB · 2 MB aia tlem tur</p>
          </section>

          {/* PREVIEW */}
          <section className={cn("rounded-3xl bg-surface p-4", tab !== "preview" && "hidden lg:block")}>
            <Preview html={form.html_code} />
          </section>
        </div>

        {/* INFO */}
        <section className={cn("min-w-0 space-y-4 rounded-3xl bg-surface p-4 lg:sticky lg:top-6 lg:self-start", tab !== "info" && "hidden lg:block")}>
          <h2 className="flex items-center gap-2 font-display text-lg font-bold"><Info size={20} /> Game Info</h2>
          <Field label="Game hming *">
            <Input value={form.title} maxLength={80} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Tlang Runner" />
          </Field>
          <Field label="Siamtute" hint="Hming hmasa emaw team hming chauh — e.g. “Mawia” emaw “Team Thlifim”">
            <Input value={form.creators} maxLength={120} onChange={(e) => set("creators", e.target.value)} placeholder="Mawia" />
          </Field>
          <div>
            <span className="mb-1.5 block font-semibold">Class</span>
            <Segmented
              value={form.class ?? 0}
              onChange={(v) => set("class", v === 0 ? null : (v as 7 | 8 | 9))}
              options={[
                { value: 7, label: "7" },
                { value: 8, label: "8" },
                { value: 9, label: "9" },
                { value: 0, label: "—" },
              ]}
            />
          </div>
          <Field label="Category">
            <Select value={form.category_id ?? ""} onChange={(e) => set("category_id", e.target.value || null)}>
              <option value="">— Thlang lo —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Sawifiahna" hint="Khelh dan tawi te in ziak rawh">
            <Textarea value={form.description} maxLength={2000} onChange={(e) => set("description", e.target.value)} placeholder="Arrow key hmangin tlan la..." />
          </Field>

          <CoverPicker
            folder="games"
            accent={form.accent_color}
            value={{ cover_url: form.cover_url ?? null, cover_sm_url: form.cover_sm_url ?? null }}
            onChange={(v, accent) => {
              setForm((f) => ({ ...f, ...v, accent_color: accent ?? f.accent_color }));
              setDirty(true);
            }}
          />

          <Field label="Rong (accent color)" hint="Cover atangin a in thlang nghal. I duh chuan thlak rawh.">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.accent_color}
                onChange={(e) => set("accent_color", e.target.value.toUpperCase())}
                className="h-12 w-16 cursor-pointer rounded-xl border border-line bg-surface-2 p-1"
              />
              <Input value={form.accent_color} onChange={(e) => set("accent_color", e.target.value)} className="font-mono" maxLength={7} />
            </div>
          </Field>

          <Toggle checked={form.show_title_overlay} onChange={(v) => set("show_title_overlay", v)} label="Card-ah hming lang tir" hint="Cover-ah game hming a awm loh chuan on rawh" />
          <Toggle checked={form.featured} onChange={(v) => set("featured", v)} label="⭐ Featured" hint="Home page-ah hmasa berah a lang ang" />

          <div>
            <span className="mb-2 block font-semibold">Card preview</span>
            <div className="pointer-events-none mx-auto w-44 p-3">
              <GameCard game={previewGame} />
            </div>
          </div>

          <div className="hidden gap-3 lg:flex">
            <SaveButtons saving={saving} onSave={save} />
          </div>
        </section>
      </div>

      {/* sticky save bar on phones */}
      <div className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-30 flex gap-3 border-t border-white/5 bg-bg/95 p-3 backdrop-blur lg:hidden">
        <SaveButtons saving={saving} onSave={save} />
      </div>
    </div>
  );
}

function SaveButtons({ saving, onSave }: { saving: "draft" | "publish" | null; onSave: (publish: boolean) => void }) {
  return (
    <>
      <Button variant="ghost" className="flex-1" disabled={Boolean(saving)} onClick={() => onSave(false)}>
        {saving === "draft" ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Draft<span className="hidden sm:inline">-ah vawng</span>
      </Button>
      <Button variant="success" className="flex-1" disabled={Boolean(saving)} onClick={() => onSave(true)}>
        {saving === "publish" ? <Loader2 size={18} className="animate-spin" /> : <Rocket size={18} />} Publish
      </Button>
    </>
  );
}

function Preview({ html }: { html: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [key, setKey] = useState(0);
  const [shown, setShown] = useState(html);

  // debounce: reload the preview 800ms after typing stops
  useEffect(() => {
    const t = setTimeout(() => {
      setShown(html);
      setKey((k) => k + 1);
    }, 800);
    return () => clearTimeout(t);
  }, [html]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.source === frame.current?.contentWindow && e.data?.type === "jnv-preview-ready") {
        frame.current?.contentWindow?.postMessage({ type: "jnv-preview", html: shown }, "*");
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [shown]);

  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="mr-auto flex items-center gap-2 font-display text-lg font-bold"><Eye size={20} /> Preview</h2>
        <Button variant="ghost" className="h-10 text-sm" onClick={() => setKey((k) => k + 1)}>
          <RefreshCw size={16} /> Tan tha leh
        </Button>
      </div>
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-line bg-black">
        <iframe
          key={key}
          ref={frame}
          src="/gp"
          title="Game preview"
          sandbox="allow-scripts allow-pointer-lock allow-modals allow-forms"
          className="h-full w-full border-0"
        />
      </div>
      <p className="mt-2 text-xs text-muted">Game hi hetah khel chhin la, a tha tawh chuan Publish rawh.</p>
    </>
  );
}
