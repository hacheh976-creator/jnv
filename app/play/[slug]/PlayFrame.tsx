"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Maximize, Minimize, RotateCcw, X } from "lucide-react";
import { recordGamePlay } from "@/lib/actions/public";

export function PlayFrame({ id, slug, title, accent }: { id: string; slug: string; title: string; accent: string }) {
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const key = `played:${id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}
    recordGamePlay(id).catch(() => {});
  }, [id]);

  // the iframe can finish loading before React hydrates, so never show the spinner too long
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onFs = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  function exit() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    if (window.history.length > 1) router.back();
    else router.push("/games");
  }

  async function toggleFull() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await box.current?.requestFullscreen();
    } catch {}
  }

  function restart() {
    if (frame.current) frame.current.src = `/g/${slug}?r=${Date.now()}`;
  }

  return (
    <div ref={box} className="fixed inset-0 bg-black">
      <iframe
        ref={frame}
        src={`/g/${slug}`}
        title={title}
        sandbox="allow-scripts allow-pointer-lock allow-popups allow-modals allow-forms allow-orientation-lock"
        allow="fullscreen; gamepad; autoplay; accelerometer; gyroscope"
        onLoad={() => setLoading(false)}
        className="h-full w-full border-0"
      />
      {loading && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-3 text-white/80">
            <Loader2 className="animate-spin" size={40} style={{ color: accent }} />
            <span className="font-display text-xl font-bold">{title}</span>
          </div>
        </div>
      )}
      <div className="absolute left-3 top-[max(12px,env(safe-area-inset-top))] flex gap-2">
        <button onClick={exit} aria-label="Chhuak rawh" className="grid h-11 w-11 place-items-center rounded-full bg-black/60 text-white ring-1 ring-white/20 backdrop-blur">
          <X size={22} />
        </button>
        <button onClick={restart} aria-label="Tan tha leh" className="grid h-11 w-11 place-items-center rounded-full bg-black/60 text-white ring-1 ring-white/20 backdrop-blur">
          <RotateCcw size={20} />
        </button>
        <button onClick={toggleFull} aria-label="Fullscreen" className="grid h-11 w-11 place-items-center rounded-full bg-black/60 text-white ring-1 ring-white/20 backdrop-blur">
          {full ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>
    </div>
  );
}
