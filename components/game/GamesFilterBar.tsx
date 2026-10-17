"use client";
import { Chip } from "@/components/site/Chip";
import { useTranslation } from "@/lib/i18n";
import type { GameCategory } from "@/lib/types";

export function GamesFilterBar({
  categories,
  cat,
  cls,
  href,
}: {
  categories: GameCategory[];
  cat?: string;
  cls?: number;
  href: (next: { cat?: string; cls?: number }) => string;
}) {
  const { t } = useTranslation();

  return (
    <div className="sticky top-16 z-30 -mx-4 mt-4 space-y-2 bg-bg/90 px-4 py-3 backdrop-blur-xl">
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        <Chip href={href({ cls })} active={!cat}>
          {t("all", "All")}
        </Chip>
        {categories.map((c) => (
          <Chip key={c.id} href={href({ cat: c.slug, cls })} active={cat === c.slug}>
            {c.name}
          </Chip>
        ))}
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        <Chip href={href({ cat })} active={!cls}>
          {t("allClasses", "All Classes")}
        </Chip>
        {[7, 8, 9].map((n) => (
          <Chip key={n} href={href({ cat, cls: n })} active={cls === n}>
            Class {n}
          </Chip>
        ))}
      </div>
    </div>
  );
}
