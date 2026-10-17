"use client";
import { useEffect, useState } from "react";
import { Download, Share, SquarePlus } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

let deferred: BIPEvent | null = null;
const listeners = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as BIPEvent;
    listeners.forEach((l) => l());
  });
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function InstallButton({ variant = "pill" }: { variant?: "pill" | "card" }) {
  const [canPrompt, setCanPrompt] = useState(false);
  const [ios, setIos] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [help, setHelp] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const sync = () => setCanPrompt(Boolean(deferred));
    listeners.add(sync);
    const t = setTimeout(() => {
      sync();
      setIos(isIOS());
      setHidden(isStandalone());
    }, 0);
    return () => {
      clearTimeout(t);
      listeners.delete(sync);
    };
  }, []);

  if (hidden || (!canPrompt && !ios)) return null;

  async function onClick() {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice.catch(() => null);
      deferred = null;
      setCanPrompt(false);
    } else {
      setHelp(true);
    }
  }

  return (
    <>
      {variant === "pill" ? (
        <button
          onClick={onClick}
          className="flex h-10 items-center gap-1.5 rounded-full bg-saffron px-4 text-sm font-bold text-black transition-transform duration-75 hover:brightness-110 active:scale-95 touch-manipulation"
        >
          <Download size={18} /> <span className="hidden sm:inline">{t("downloadApp", "Download App")}</span>
          <span className="sm:hidden">{t("downloadAppShort", "App")}</span>
        </button>
      ) : (
        <button
          onClick={onClick}
          className={cn(
            "flex w-full items-center gap-4 rounded-3xl border border-saffron/30 bg-gradient-to-r from-saffron/20 to-transparent p-4 text-left transition-transform duration-75 active:scale-[0.99] touch-manipulation",
          )}
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-saffron text-black">
            <Download size={24} />
          </span>
          <span>
            <span className="block font-display text-lg font-bold">{t("downloadApp", "Download App")}</span>
            <span className="block text-sm text-muted">{t("installAppCardDesc", "Add to phone home screen, play anytime like an app")}</span>
          </span>
        </button>
      )}
      <Sheet open={help} onClose={() => setHelp(false)} label={t("installIosTitle", "How to install on iPhone")}>
        <div className="p-6 pt-10">
          <h2 className="font-display text-2xl font-bold">{t("installIosTitle", "How to install on iPhone")}</h2>
          <ol className="mt-5 space-y-4 text-lg">
            <li className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-surface-2"><Share /></span>
              {t("installIosStep1", "Tap the Share button at the bottom of Safari")}
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-surface-2"><SquarePlus /></span>
              {t("installIosStep2", "Tap 'Add to Home Screen'")}
            </li>
          </ol>
        </div>
      </Sheet>
    </>
  );
}
