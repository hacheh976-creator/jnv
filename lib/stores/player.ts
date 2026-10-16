"use client";
import { create } from "zustand";
import type { Track } from "@/lib/types";

export type Repeat = "off" | "all" | "one";

type PlayerState = {
  queue: Track[];
  index: number;
  isPlaying: boolean;
  shuffle: boolean;
  repeat: Repeat;
  expanded: boolean;
  current: () => Track | null;
  playQueue: (tracks: Track[], startIndex?: number, opts?: { shuffle?: boolean }) => void;
  toggle: () => void;
  setPlaying: (v: boolean) => void;
  next: (auto?: boolean) => void;
  prev: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setExpanded: (v: boolean) => void;
};

function shuffled<T>(arr: T[], first?: T) {
  const a = arr.filter((x) => x !== first);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return first ? [first, ...a] : a;
}

export const usePlayer = create<PlayerState>((set, get) => ({
  queue: [],
  index: 0,
  isPlaying: false,
  shuffle: false,
  repeat: "off",
  expanded: false,
  current: () => get().queue[get().index] ?? null,
  playQueue: (tracks, startIndex = 0, opts) => {
    const playable = tracks.filter((t) => t.audio_url);
    if (!playable.length) return;
    const start = tracks[startIndex];
    const useShuffle = opts?.shuffle ?? get().shuffle;
    const queue = useShuffle ? shuffled(playable, opts?.shuffle ? undefined : start) : playable;
    const index = useShuffle ? 0 : Math.max(0, queue.indexOf(start));
    set({ queue, index, isPlaying: true, shuffle: useShuffle });
  },
  toggle: () => set((s) => ({ isPlaying: s.queue.length ? !s.isPlaying : false })),
  setPlaying: (v) => set({ isPlaying: v }),
  next: (auto) => {
    const { index, queue, repeat } = get();
    if (auto && repeat === "one") return set({ isPlaying: true });
    if (index < queue.length - 1) return set({ index: index + 1, isPlaying: true });
    if (repeat === "all" || !auto) return set({ index: 0, isPlaying: true });
    set({ isPlaying: false });
  },
  prev: () => {
    const { index, queue } = get();
    set({ index: index > 0 ? index - 1 : queue.length - 1, isPlaying: true });
  },
  toggleShuffle: () => {
    const { shuffle, queue, index } = get();
    const cur = queue[index];
    if (!shuffle) set({ shuffle: true, queue: shuffled(queue, cur), index: 0 });
    else set({ shuffle: false });
  },
  cycleRepeat: () => set((s) => ({ repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off" })),
  setExpanded: (v) => set({ expanded: v }),
}));
