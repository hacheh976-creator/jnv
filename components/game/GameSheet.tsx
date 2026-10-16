"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Play, Share2, Users } from "lucide-react";
import { useGameSheet } from "@/lib/stores/gameSheet";
import { Sheet } from "@/components/ui/Sheet";
import { Cover } from "@/components/ui/Cover";
import { likeGame } from "@/lib/actions/public";
import { hasLiked, rememberLike } from "@/lib/likes";
import { byline, formatCount } from "@/lib/utils";

export function GameSheet({ categories }: { categories: Record<string, string> }) {
  const { game, close } = useGameSheet();
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const onPop = () => close({ fromPop: true });
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [close]);

  useEffect(() => {
    if (!game) return;
    const t = setTimeout(() => {
      setLikes(game.likes);
      setLiked(hasLiked(game.id));
    }, 0);
    return () => clearTimeout(t);
  }, [game]);

  if (!game) return null;

  async function onLike() {
    if (!game || liked) return;
    setLiked(true);
    setLikes((n) => n + 1);
    rememberLike(game.id);
    const n = await likeGame(game.id).catch(() => null);
    if (typeof n === "number") setLikes(n);
  }

  async function onShare() {
    if (!game) return;
    const url = `${location.origin}/games?g=${game.slug}`;
    try {
      if (navigator.share) await navigator.share({ title: game.title, url });
      else await navigator.clipboard.writeText(url);
    } catch {}
  }

  const cat = game.category_id ? categories[game.category_id] : undefined;

  return (
    <Sheet open onClose={() => close()} label={game.title}>
      <div className="relative">
        <div className="relative aspect-[16/10] w-full overflow-hidden md:rounded-t-3xl">
          <Cover src={game.cover_url} alt={game.title} accent={game.accent_color} priority />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
        </div>
        <div className="-mt-16 px-5 pb-6 md:px-7">
          <div className="relative">
            {cat && (
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-bold text-black"
                style={{ background: game.accent_color }}
              >
                {cat}
              </span>
            )}
            <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight">{game.title}</h2>
            {byline(game.creators, game.class) && (
              <p className="mt-1 flex items-center gap-1.5 text-muted">
                <Users size={16} /> {byline(game.creators, game.class)}
              </p>
            )}
          </div>

          <div className="mt-4 flex gap-6 text-sm">
            <span>
              <b className="block text-lg">{formatCount(game.plays)}</b>
              <span className="text-muted">Khelh zat</span>
            </span>
            <span>
              <b className="block text-lg">{formatCount(likes)}</b>
              <span className="text-muted">Duh zat</span>
            </span>
          </div>

          {game.description && <p className="mt-4 whitespace-pre-line text-[15px] text-text/85">{game.description}</p>}

          <div className="mt-6 flex items-center gap-3">
            <Link
              href={`/play/${game.slug}`}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-saffron text-xl font-extrabold text-black shadow-[0_8px_30px_-6px_var(--saffron)] transition hover:brightness-110 active:scale-[0.98]"
            >
              <Play size={24} fill="currentColor" /> PLAY
            </Link>
            <button
              onClick={onLike}
              aria-label="Ka duh"
              aria-pressed={liked}
              className="grid h-14 w-14 place-items-center rounded-full bg-surface-2 transition active:scale-90"
            >
              <Heart size={24} className={liked ? "fill-red text-red" : ""} />
            </button>
            <button
              onClick={onShare}
              aria-label="Share"
              className="grid h-14 w-14 place-items-center rounded-full bg-surface-2 transition active:scale-90"
            >
              <Share2 size={22} />
            </button>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
