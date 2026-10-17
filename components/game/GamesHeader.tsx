"use client";
import { useTranslation } from "@/lib/i18n";

export function GamesHeader() {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="font-display text-4xl font-extrabold">{t("games", "Games")}</h1>
      <p className="text-muted">{t("gamesSubtitle", "Student-made games — tap and play!")}</p>
    </div>
  );
}
