"use client";
import { useTranslation } from "@/lib/i18n";

export function GameEmptyRow() {
  const { t } = useTranslation();
  return (
    <p className="rounded-3xl bg-surface p-8 text-center text-muted">
      {t("noGamesAvailable", "No games available yet. Check back soon!")}
    </p>
  );
}
