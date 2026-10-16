"use client";
import { useEffect } from "react";
import { useGameSheet } from "@/lib/stores/gameSheet";
import type { Game } from "@/lib/types";

/** Opens the info sheet when the page is loaded with ?g=<slug>. */
export function OpenGameOnLoad({ game }: { game: Game }) {
  const open = useGameSheet((s) => s.open);
  useEffect(() => {
    open(game, { pushUrl: false });
  }, [game, open]);
  return null;
}
