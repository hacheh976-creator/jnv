"use client";
import { useTranslation } from "@/lib/i18n";

export function MusicHeader() {
  const { t } = useTranslation();
  return (
    <div className="px-4">
      <h1 className="font-display text-4xl font-extrabold">{t("music", "Music")}</h1>
      <p className="text-muted">{t("musicSubtitle", "Student-composed & AI songs — listen now!")}</p>
    </div>
  );
}
