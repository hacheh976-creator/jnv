"use client";
import { create } from "zustand";
import type { Game } from "@/lib/types";

type State = {
  game: Game | null;
  open: (g: Game, opts?: { pushUrl?: boolean }) => void;
  close: (opts?: { fromPop?: boolean }) => void;
};

export const useGameSheet = create<State>((set, get) => ({
  game: null,
  open: (game, opts) => {
    if (opts?.pushUrl !== false) {
      const url = new URL(window.location.href);
      url.searchParams.set("g", game.slug);
      window.history.pushState({ sheet: game.slug }, "", url);
    }
    set({ game });
  },
  close: (opts) => {
    if (!get().game) return;
    set({ game: null });
    if (!opts?.fromPop && window.history.state?.sheet) {
      window.history.back();
    } else if (!opts?.fromPop) {
      const url = new URL(window.location.href);
      url.searchParams.delete("g");
      window.history.replaceState(null, "", url);
    }
  },
}));
