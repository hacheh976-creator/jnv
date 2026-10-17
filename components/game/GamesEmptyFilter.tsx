"use client";
import { useTranslation } from "@/lib/i18n";

export function GamesEmptyFilter() {
  const { t } = useTranslation();
  return (
    <p className="mt-8 rounded-3xl bg-surface p-10 text-center text-lg text-muted">
      {t("noGamesFilter", "No games found here. Try another filter.")}
    </p>
  );
}
