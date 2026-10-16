"use client";
import { useGameSheet } from "@/lib/stores/gameSheet";
import type { Game } from "@/lib/types";

/** One click handler for the whole mosaic (keeps the page light). */
export function MosaicClicks({ games, children }: { games: Game[]; children: React.ReactNode }) {
  const open = useGameSheet((s) => s.open);
  return (
    <div
      className="mosaic absolute inset-0 overflow-hidden"
      onClick={(e) => {
        const el = (e.target as HTMLElement).closest<HTMLElement>("[data-slug]");
        const g = el && games.find((x) => x.slug === el.dataset.slug);
        if (g) open(g);
      }}
    >
      {children}
    </div>
  );
}
