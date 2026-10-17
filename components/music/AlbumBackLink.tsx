"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function AlbumBackLink() {
  const { t } = useTranslation();
  return (
    <Link
      href="/music"
      className="mb-4 inline-flex h-10 items-center gap-1 rounded-full bg-black/30 pl-2 pr-4 text-sm font-semibold backdrop-blur transition-transform active:scale-95 touch-manipulation"
    >
      <ChevronLeft size={20} /> {t("music", "Music")}
    </Link>
  );
}

export function AlbumTrackCount({ count }: { count: number }) {
  const { t } = useTranslation();
  return (
    <p className="mt-2 text-sm text-white/75">
      {count} {t("songsCount", "songs")}
    </p>
  );
}
