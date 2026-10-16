"use client";
import { useGameSheet } from "@/lib/stores/gameSheet";
import { CardFace } from "./CardFace";
import type { Game } from "@/lib/types";
import { cn } from "@/lib/utils";

export function GameCard({
  game,
  tilt = 0,
  priority,
  className,
  size = "md",
}: {
  game: Game;
  tilt?: number;
  priority?: boolean;
  className?: string;
  size?: "md" | "lg";
}) {
  const open = useGameSheet((s) => s.open);
  return (
    <button
      type="button"
      onClick={() => open(game)}
      aria-label={`${game.title} — info en rawh`}
      className={cn("group relative block aspect-square w-full text-left outline-none", className)}
      style={{ ["--accent" as string]: game.accent_color }}
    >
      <CardFace game={game} tilt={tilt} priority={priority} size={size} />
    </button>
  );
}
