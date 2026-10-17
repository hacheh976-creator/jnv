"use client";
import Link from "next/link";
import { Gamepad2, Music2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function HeroButtons() {
  const { t } = useTranslation();
  return (
    <div className="pointer-events-auto mt-7 flex flex-wrap justify-center gap-3">
      <Link
        href="/games"
        className="flex h-14 items-center gap-2 rounded-full bg-saffron px-7 text-lg font-extrabold text-black shadow-[0_10px_30px_-8px_var(--saffron)] transition-transform duration-75 hover:brightness-110 active:scale-95 touch-manipulation"
      >
        <Gamepad2 size={22} /> {t("playGames", "Play Games")}
      </Link>
      <Link
        href="/music"
        className="flex h-14 items-center gap-2 rounded-full border border-white/10 bg-surface-2/90 px-7 text-lg font-bold ring-1 ring-white/10 transition-transform duration-75 hover:bg-surface-2 active:scale-95 touch-manipulation"
      >
        <Music2 size={22} /> {t("listenMusic", "Listen Music")}
      </Link>
    </div>
  );
}
