"use client";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Heart,
  ListMusic,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { usePlayer } from "@/lib/stores/player";
import { Cover } from "@/components/ui/Cover";
import { likeTrack, recordTrackPlay } from "@/lib/actions/public";
import { hasLiked, rememberLike } from "@/lib/likes";
import { byline, cn, formatDuration, isDevanagari } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

export function Player() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const counted = useRef<Set<string>>(new Set());
  const listened = useRef(0);
  const switching = useRef(false);
  const s = usePlayer();
  const { t } = useTranslation();
  const track = s.queue[s.index] ?? null;
  const isPlaying = s.isPlaying;
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [tab, setTab] = useState<"cover" | "lyrics">("cover");
  const [liked, setLiked] = useState(false);

  // load new track
  useEffect(() => {
    const el = audio.current;
    if (!el || !track) return;
    if (el.src !== track.audio_url) {
      switching.current = true;
      el.src = track.audio_url;
      listened.current = 0;
      setTime(0);
      setDur(track.duration_sec || 0);
      setLiked(hasLiked(track.id));
    }
    if (usePlayer.getState().isPlaying) el.play().catch(() => usePlayer.getState().setPlaying(false));
  }, [track]);

  // play / pause
  useEffect(() => {
    const el = audio.current;
    if (!el || !track) return;
    if (isPlaying) el.play().catch(() => usePlayer.getState().setPlaying(false));
    else el.pause();
  }, [isPlaying, track]);

  // reserve space above the tab bar
  useEffect(() => {
    document.documentElement.style.setProperty("--player-h", track ? "72px" : "0px");
  }, [track]);

  // lock-screen / headphone controls
  useEffect(() => {
    if (!track || !("mediaSession" in navigator)) return;
    const art = track.cover_url ?? "/icons/icon-512.png";
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: byline(track.creators, track.class) || "JNV Studio",
      album: "JNV Studio",
      artwork: [
        { src: track.cover_sm_url ?? art, sizes: "256x256" },
        { src: art, sizes: "512x512" },
      ],
    });
    const st = usePlayer.getState;
    navigator.mediaSession.setActionHandler("play", () => st().setPlaying(true));
    navigator.mediaSession.setActionHandler("pause", () => st().setPlaying(false));
    navigator.mediaSession.setActionHandler("previoustrack", () => st().prev());
    navigator.mediaSession.setActionHandler("nexttrack", () => st().next());
    navigator.mediaSession.setActionHandler("seekto", (d) => {
      if (audio.current && d.seekTime != null) audio.current.currentTime = d.seekTime;
    });
  }, [track]);

  // keyboard (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (!usePlayer.getState().queue.length || tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        usePlayer.getState().toggle();
      } else if (e.code === "ArrowRight" && audio.current) audio.current.currentTime += 10;
      else if (e.code === "ArrowLeft" && audio.current) audio.current.currentTime -= 10;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onTime() {
    const el = audio.current;
    if (!el || !track) return;
    setTime(el.currentTime);
    listened.current += 0.25;
    if (listened.current > 30 && !counted.current.has(track.id)) {
      counted.current.add(track.id);
      recordTrackPlay(track.id).catch(() => {});
    }
  }

  async function onLike() {
    if (!track || liked) return;
    setLiked(true);
    rememberLike(track.id);
    likeTrack(track.id).catch(() => {});
  }

  const pct = dur ? (time / dur) * 100 : 0;
  const PlayIcon = s.isPlaying ? Pause : Play;

  return (
    <>
      <audio
        ref={audio}
        preload="none"
        onTimeUpdate={onTime}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration || track?.duration_sec || 0)}
        onEnded={() => s.next(true)}
        onPlaying={() => (switching.current = false)}
        onPause={() => {
          if (!switching.current && !audio.current?.ended) usePlayer.getState().setPlaying(false);
        }}
        onPlay={() => !usePlayer.getState().isPlaying && usePlayer.getState().setPlaying(true)}
      />
      {track && !s.expanded && (
        <div className="fixed inset-x-0 bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))] z-40 px-2 pb-2 lg:bottom-0 lg:px-4 lg:pb-4">
          <div className="anim-pop relative mx-auto flex h-16 max-w-3xl items-center gap-3 overflow-hidden rounded-2xl bg-surface-2/95 pr-2 shadow-2xl shadow-black/50 ring-1 ring-white/10 backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-white/10">
              <div className="h-full bg-saffron" style={{ width: `${pct}%` }} />
            </div>
            <button
              onClick={() => s.setExpanded(true)}
              className="flex min-w-0 flex-1 items-center gap-3 pl-2 text-left"
              aria-label={t("expandPlayer", "Expand player")}
            >
              <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                <Cover src={track.cover_sm_url} alt="" accent="#f7931e" kind="music" />
              </span>
              <span className="min-w-0">
                <span className={cn("block truncate font-semibold", isDevanagari(track.title) && "font-display")}>
                  {track.title}
                </span>
                <span className="block truncate text-xs text-muted">{byline(track.creators, track.class)}</span>
              </span>
            </button>
            <button
              onClick={s.toggle}
              aria-label={s.isPlaying ? "Pause" : "Play"}
              className="grid h-12 w-12 place-items-center rounded-full bg-white text-black active:scale-90"
            >
              <PlayIcon size={22} fill="currentColor" />
            </button>
            <button onClick={() => s.next()} aria-label={t("nextTrack", "Next track")} className="grid h-12 w-12 place-items-center rounded-full">
              <SkipForward size={22} fill="currentColor" />
            </button>
          </div>
        </div>
      )}

      {track && s.expanded && (
        <div className="anim-sheet fixed inset-0 z-50 flex flex-col overflow-hidden bg-bg" role="dialog" aria-label="Music player">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{ background: "radial-gradient(circle at 50% 0%, var(--saffron) 0%, transparent 60%)" }}
          />
          <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(16px,env(safe-area-inset-top))]">
            <div className="flex items-center justify-between">
              <button onClick={() => s.setExpanded(false)} aria-label={t("close", "Close")} className="grid h-12 w-12 place-items-center rounded-full bg-white/10">
                <ChevronDown size={26} />
              </button>
              <div className="flex rounded-full bg-white/10 p-1 text-sm font-semibold">
                <button onClick={() => setTab("cover")} className={cn("rounded-full px-4 py-2", tab === "cover" && "bg-white text-black")}>
                  {t("songTab", "Song")}
                </button>
                <button onClick={() => setTab("lyrics")} className={cn("flex items-center gap-1 rounded-full px-4 py-2", tab === "lyrics" && "bg-white text-black")}>
                  <ListMusic size={16} /> {t("lyricsTab", "Lyrics")}
                </button>
              </div>
              <div className="w-12" />
            </div>

            <div className="mt-6 min-h-0 flex-1">
              {tab === "cover" ? (
                <div className="mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl shadow-black/60">
                  <Cover src={track.cover_url} alt={track.title} accent="#f7931e" kind="music" priority />
                </div>
              ) : (
                <div className={cn("h-full max-h-[50dvh] overflow-y-auto whitespace-pre-line rounded-3xl bg-white/5 p-5 text-lg leading-relaxed", isDevanagari(track.lyrics) && "font-display")}>
                  {track.lyrics || t("noLyrics", "No lyrics available.")}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className={cn("truncate font-display text-2xl font-extrabold", isDevanagari(track.title) && "font-display")}>{track.title}</h2>
                <p className="truncate text-muted">{byline(track.creators, track.class)}</p>
              </div>
              <button onClick={onLike} aria-label="Ka duh" aria-pressed={liked} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/10">
                <Heart size={24} className={liked ? "fill-red text-red" : ""} />
              </button>
            </div>

            <div className="mt-4">
              <input
                type="range"
                className="seek w-full"
                min={0}
                max={dur || 0}
                step={0.5}
                value={time}
                style={{ ["--pct" as string]: `${pct}%` }}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (audio.current) audio.current.currentTime = v;
                  setTime(v);
                }}
                aria-label="Hla hun"
              />
              <div className="mt-1 flex justify-between text-xs tabular-nums text-muted">
                <span>{formatDuration(time)}</span>
                <span>{formatDuration(dur)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button onClick={s.toggleShuffle} aria-label="Shuffle" aria-pressed={s.shuffle} className={cn("grid h-12 w-12 place-items-center rounded-full", s.shuffle ? "text-saffron" : "text-muted")}>
                <Shuffle size={22} />
              </button>
              <button onClick={s.prev} aria-label="A hmasa" className="grid h-14 w-14 place-items-center rounded-full">
                <SkipBack size={30} fill="currentColor" />
              </button>
              <button onClick={s.toggle} aria-label={s.isPlaying ? "Pause" : "Play"} className="grid h-20 w-20 place-items-center rounded-full bg-saffron text-black shadow-[0_8px_30px_-6px_var(--saffron)] active:scale-95">
                <PlayIcon size={36} fill="currentColor" />
              </button>
              <button onClick={() => s.next()} aria-label="A dawt leh" className="grid h-14 w-14 place-items-center rounded-full">
                <SkipForward size={30} fill="currentColor" />
              </button>
              <button onClick={s.cycleRepeat} aria-label={`Repeat ${s.repeat}`} className={cn("grid h-12 w-12 place-items-center rounded-full", s.repeat !== "off" ? "text-saffron" : "text-muted")}>
                {s.repeat === "one" ? <Repeat1 size={22} /> : <Repeat size={22} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
