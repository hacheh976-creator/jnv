"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Gamepad2,
  HelpCircle,
  Loader2,
  Maximize,
  Minimize,
  RotateCcw,
  Smartphone,
  X,
} from "lucide-react";
import { recordGamePlay } from "@/lib/actions/public";
import { useTranslation } from "@/lib/i18n";
import { byline, cn } from "@/lib/utils";

type PlayFrameProps = {
  id: string;
  slug: string;
  title: string;
  accent: string;
  description?: string;
  creators?: string;
  cls?: 7 | 8 | 9 | null;
};

export function PlayFrame({
  id,
  slug,
  title,
  accent,
  description,
  creators,
  cls,
}: PlayFrameProps) {
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [full, setFull] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [dismissRotate, setDismissRotate] = useState(false);

  // Auto-detect mobile touch & portrait orientation
  useEffect(() => {
    const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    if (isTouch) setShowControls(true);

    const checkOrientation = () => {
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 900;
      setIsPortrait(portrait);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    // Try automatic landscape lock if browser allows
    try {
      const orientation = screen.orientation as unknown as { lock?: (mode: string) => Promise<void> } | undefined;
      if (orientation && typeof orientation.lock === "function") {
        orientation.lock("landscape").catch(() => {});
      }
    } catch {}

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  // Record play
  useEffect(() => {
    const key = `played:${id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}
    recordGamePlay(id).catch(() => {});
  }, [id]);

  // Loading safety fallback
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      frame.current?.focus();
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const onFs = () => {
      const isFs = Boolean(document.fullscreenElement);
      setFull(isFs);
      if (isFs) {
        try {
          const orientation = screen.orientation as unknown as { lock?: (mode: string) => Promise<void> } | undefined;
          if (orientation && typeof orientation.lock === "function") {
            orientation.lock("landscape").catch(() => {});
          }
        } catch {}
      }
    };
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
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await box.current?.requestFullscreen();
      }
    } catch {}
  }

  function restart() {
    if (frame.current) {
      setLoading(true);
      frame.current.src = `/g/${slug}?r=${Date.now()}`;
      setTimeout(() => frame.current?.focus(), 500);
    }
  }

  // Synthesize keyboard event into iframe
  function sendKeyEvent(key: string, code: string, type: "keydown" | "keyup") {
    const win = frame.current?.contentWindow;
    if (!win) return;
    const keyCode =
      key === "ArrowUp" ? 38 :
      key === "ArrowDown" ? 40 :
      key === "ArrowLeft" ? 37 :
      key === "ArrowRight" ? 39 :
      key === " " ? 32 :
      key === "Enter" ? 13 : 0;

    try {
      const event = new KeyboardEvent(type, {
        key,
        code,
        keyCode,
        which: keyCode,
        bubbles: true,
        cancelable: true,
      });
      win.dispatchEvent(event);
      win.document?.dispatchEvent(event);
    } catch {}
  }

  return (
    <div ref={box} className="fixed inset-0 select-none overflow-hidden bg-black">
      {/* Game iframe */}
      <iframe
        ref={frame}
        src={`/g/${slug}`}
        title={title}
        sandbox="allow-scripts allow-pointer-lock allow-popups allow-modals allow-forms allow-orientation-lock"
        allow="fullscreen; gamepad; autoplay; accelerometer; gyroscope"
        onLoad={() => {
          setLoading(false);
          frame.current?.focus();
        }}
        className="h-full w-full border-0"
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/85">
          <div className="flex flex-col items-center gap-3 text-white/90">
            <Loader2 className="animate-spin" size={44} style={{ color: accent }} />
            <span className="font-display text-2xl font-bold tracking-tight">{title}</span>
          </div>
        </div>
      )}

      {/* Top Toolbar */}
      <div className="absolute left-3 top-[max(10px,env(safe-area-inset-top))] z-40 flex items-center gap-2">
        <button
          onClick={exit}
          aria-label={t("exit", "Exit")}
          title={t("exit", "Exit")}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/70 text-white shadow-lg transition-transform duration-75 active:scale-95 touch-manipulation hover:bg-black/90"
        >
          <X size={22} />
        </button>
        <button
          onClick={restart}
          aria-label={t("restart", "Restart")}
          title={t("restart", "Restart")}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/70 text-white shadow-lg transition-transform duration-75 active:scale-95 touch-manipulation hover:bg-black/90"
        >
          <RotateCcw size={19} />
        </button>
        <button
          onClick={toggleFull}
          aria-label={t("fullscreen", "Fullscreen")}
          title={t("fullscreen", "Fullscreen")}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/70 text-white shadow-lg transition-transform duration-75 active:scale-95 touch-manipulation hover:bg-black/90"
        >
          {full ? <Minimize size={19} /> : <Maximize size={19} />}
        </button>
        <button
          onClick={() => setShowHelp(true)}
          aria-label={t("instructions", "Instructions")}
          title={t("instructions", "Instructions")}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/70 text-saffron shadow-lg transition-transform duration-75 active:scale-95 touch-manipulation hover:bg-black/90"
        >
          <HelpCircle size={20} />
        </button>
        <button
          onClick={() => setShowControls((v) => !v)}
          aria-label={t("virtualGamepad", "Touch Gamepad")}
          title={t("virtualGamepad", "Touch Gamepad")}
          className={cn(
            "flex h-11 items-center gap-1.5 rounded-full border border-white/20 px-3.5 text-xs font-bold shadow-lg transition-transform duration-75 active:scale-95 touch-manipulation",
            showControls ? "bg-saffron text-black" : "bg-black/70 text-white hover:bg-black/90"
          )}
        >
          <Gamepad2 size={18} />
          <span className="hidden sm:inline">{t("virtualGamepad", "Controls")}</span>
        </button>
      </div>

      {/* Landscape Rotation Helper Banner (on mobile portrait) */}
      {isPortrait && !dismissRotate && (
        <div className="absolute inset-x-4 top-16 z-30 mx-auto max-w-sm rounded-2xl border border-white/20 bg-black/90 p-3 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 text-xs text-white">
            <div className="flex items-center gap-2">
              <span className="animate-bounce text-xl">🔄</span>
              <span>{t("rotateBanner", "Rotate phone to Landscape mode for the best view")}</span>
            </div>
            <button
              onClick={() => setDismissRotate(true)}
              className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-bold text-white hover:bg-white/20"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Virtual Touch Controller (D-Pad + Action Buttons) */}
      {showControls && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-30 flex items-end justify-between px-4 pb-[env(safe-area-inset-bottom)] sm:px-8">
          {/* D-Pad (Left side) */}
          <div className="pointer-events-auto relative grid h-36 w-36 grid-cols-3 grid-rows-3 gap-1 rounded-full border border-white/10 bg-black/60 p-2 shadow-2xl backdrop-blur-md">
            <div />
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                sendKeyEvent("ArrowUp", "ArrowUp", "keydown");
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                sendKeyEvent("ArrowUp", "ArrowUp", "keyup");
              }}
              onPointerLeave={(e) => {
                e.preventDefault();
                sendKeyEvent("ArrowUp", "ArrowUp", "keyup");
              }}
              aria-label="Up"
              className="grid place-items-center rounded-xl bg-white/20 text-white transition-colors active:bg-saffron active:text-black touch-manipulation"
            >
              <ArrowUp size={22} />
            </button>
            <div />

            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                sendKeyEvent("ArrowLeft", "ArrowLeft", "keydown");
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                sendKeyEvent("ArrowLeft", "ArrowLeft", "keyup");
              }}
              onPointerLeave={(e) => {
                e.preventDefault();
                sendKeyEvent("ArrowLeft", "ArrowLeft", "keyup");
              }}
              aria-label="Left"
              className="grid place-items-center rounded-xl bg-white/20 text-white transition-colors active:bg-saffron active:text-black touch-manipulation"
            >
              <ArrowLeft size={22} />
            </button>
            <div className="grid place-items-center text-[10px] font-extrabold text-white/30">JNV</div>
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                sendKeyEvent("ArrowRight", "ArrowRight", "keydown");
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                sendKeyEvent("ArrowRight", "ArrowRight", "keyup");
              }}
              onPointerLeave={(e) => {
                e.preventDefault();
                sendKeyEvent("ArrowRight", "ArrowRight", "keyup");
              }}
              aria-label="Right"
              className="grid place-items-center rounded-xl bg-white/20 text-white transition-colors active:bg-saffron active:text-black touch-manipulation"
            >
              <ArrowRight size={22} />
            </button>

            <div />
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                sendKeyEvent("ArrowDown", "ArrowDown", "keydown");
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                sendKeyEvent("ArrowDown", "ArrowDown", "keyup");
              }}
              onPointerLeave={(e) => {
                e.preventDefault();
                sendKeyEvent("ArrowDown", "ArrowDown", "keyup");
              }}
              aria-label="Down"
              className="grid place-items-center rounded-xl bg-white/20 text-white transition-colors active:bg-saffron active:text-black touch-manipulation"
            >
              <ArrowDown size={22} />
            </button>
            <div />
          </div>

          {/* Action Buttons (Right side: A = Space/Jump, B = Action/Enter) */}
          <div className="pointer-events-auto flex items-end gap-3 pb-2">
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                sendKeyEvent("Enter", "Enter", "keydown");
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                sendKeyEvent("Enter", "Enter", "keyup");
              }}
              onPointerLeave={(e) => {
                e.preventDefault();
                sendKeyEvent("Enter", "Enter", "keyup");
              }}
              aria-label="Button B"
              className="grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-blue/80 text-lg font-black text-white shadow-xl transition-transform duration-75 active:scale-90 active:bg-blue touch-manipulation"
            >
              B
            </button>
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                sendKeyEvent(" ", "Space", "keydown");
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                sendKeyEvent(" ", "Space", "keyup");
              }}
              onPointerLeave={(e) => {
                e.preventDefault();
                sendKeyEvent(" ", "Space", "keyup");
              }}
              aria-label="Button A (Jump / Shoot)"
              className="grid h-16 w-16 place-items-center rounded-full border border-white/25 bg-saffron text-xl font-black text-black shadow-xl transition-transform duration-75 active:scale-90 touch-manipulation"
            >
              A
            </button>
          </div>
        </div>
      )}

      {/* Game Instructions Modal */}
      {showHelp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-surface p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-extrabold leading-tight text-white">{title}</h2>
                {byline(creators, cls) && (
                  <p className="mt-0.5 text-xs font-semibold text-muted">{byline(creators, cls)}</p>
                )}
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-surface-2/60 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-saffron">
                  📖 {t("howToPlay", "How to Play")}
                </h3>
                <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-text/90">
                  {description || t("defaultTagline", "Have fun playing this student-made HTML game!")}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-surface-2/60 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue">
                  🎮 {t("controlsGuide", "Controls Guide")}
                </h3>
                <div className="mt-2 space-y-2 text-xs text-text/80">
                  <div className="flex items-start gap-2">
                    <span className="text-sm">💻</span>
                    <span>{t("desktopControlsTip", "PC: Arrow Keys or W/A/S/D to move, Space to Jump / Action.")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm">📱</span>
                    <span>{t("mobileControlsTip", "Mobile: Rotate to Landscape mode. Use the on-screen Gamepad buttons.")}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowHelp(false);
                frame.current?.focus();
              }}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-saffron text-base font-extrabold text-black shadow-lg transition-transform duration-75 active:scale-95 touch-manipulation hover:brightness-110"
            >
              {t("gotIt", "Got it! Resume Game")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
