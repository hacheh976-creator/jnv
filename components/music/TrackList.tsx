"use client";
import { Play, Shuffle } from "lucide-react";
import { usePlayer } from "@/lib/stores/player";
import { Cover } from "@/components/ui/Cover";
import type { Track } from "@/lib/types";
import { byline, cn, formatDuration, isDevanagari } from "@/lib/utils";

export function PlayAllButtons({ tracks, accent }: { tracks: Track[]; accent: string }) {
  const playQueue = usePlayer((s) => s.playQueue);
  const disabled = !tracks.some((t) => t.audio_url);
  return (
    <div className="flex gap-3">
      <button
        disabled={disabled}
        onClick={() => playQueue(tracks, 0, { shuffle: false })}
        className="flex h-12 items-center gap-2 rounded-full bg-saffron px-6 font-bold text-black disabled:opacity-40"
      >
        <Play size={20} fill="currentColor" /> Play all
      </button>
      <button
        disabled={disabled}
        onClick={() => playQueue(tracks, 0, { shuffle: true })}
        className="flex h-12 items-center gap-2 rounded-full border px-5 font-bold disabled:opacity-40"
        style={{ borderColor: accent }}
      >
        <Shuffle size={20} /> Shuffle
      </button>
    </div>
  );
}

export function TrackList({ tracks, albumCover }: { tracks: Track[]; albumCover?: string | null }) {
  const { playQueue, queue, index, isPlaying, toggle } = usePlayer();
  const currentId = queue[index]?.id;

  if (!tracks.length) {
    return <p className="rounded-3xl bg-surface p-8 text-center text-muted">Hla a la awm lo. A hun hnaiah lo en leh rawh!</p>;
  }

  return (
    <ol className="divide-y divide-white/5 overflow-hidden rounded-3xl bg-surface">
      {tracks.map((t, i) => {
        const active = t.id === currentId;
        return (
          <li key={t.id}>
            <button
              onClick={() => (active ? toggle() : playQueue(tracks, i))}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/5 active:bg-white/10",
                active && "bg-saffron/10",
              )}
            >
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                <Cover src={t.cover_sm_url ?? albumCover ?? null} alt="" accent="#f7931e" kind="music" />
                {active && (
                  <span className={cn("eq absolute inset-0 grid place-items-center bg-black/50", !isPlaying && "paused")}>
                    <span className="flex items-end">
                      <span />
                      <span />
                      <span />
                    </span>
                  </span>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block truncate font-semibold",
                    active && "text-saffron",
                    isDevanagari(t.title) && "font-display",
                  )}
                >
                  {t.title}
                </span>
                <span className="block truncate text-sm text-muted">{byline(t.creators, t.class)}</span>
              </span>
              <span className="shrink-0 text-sm tabular-nums text-muted">{formatDuration(t.duration_sec)}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
