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
import { useTranslation } from "@/lib/i18n";

export function GameSheet({ categories }: { categories: Record<string, string> }) {
  const { game, close } = useGameSheet();
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const { t } = useTranslation();

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
              <span className="text-muted">{t("playsCount", "Plays")}</span>
            </span>
            <span>
              <b className="block text-lg">{formatCount(likes)}</b>
              <span className="text-muted">{t("likesCount", "Likes")}</span>
            </span>
          </div>

          {/* Game Instructions & Controls Guide */}
          <div className="mt-5 rounded-2xl border border-white/10 bg-surface-2/60 p-4">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-saffron">
              <span>🎮</span> {t("howToPlay", "How to Play & Controls")}
            </h3>
            {game.description && (
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text/90">
                {game.description}
              </p>
            )}
            <div className="mt-3 grid grid-cols-1 gap-2 pt-2 border-t border-white/5 text-xs text-muted sm:grid-cols-2">
              <div className="flex items-start gap-1.5">
                <span className="text-sm">💻</span>
                <span>{t("desktopControlsTip", "PC: Arrow Keys / WASD, Space to jump")}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-sm">📱</span>
                <span>{t("mobileControlsTip", "Mobile: Landscape mode + on-screen buttons")}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Link
              href={`/play/${game.slug}`}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-saffron text-xl font-extrabold text-black shadow-[0_8px_30px_-6px_var(--saffron)] transition-transform duration-75 hover:brightness-110 active:scale-[0.97] touch-manipulation"
            >
              <Play size={24} fill="currentColor" /> {t("play", "PLAY")}
            </Link>
            <button
              onClick={onLike}
              aria-label={t("like", "Like")}
              aria-pressed={liked}
              className="grid h-14 w-14 place-items-center rounded-full bg-surface-2 transition-transform duration-75 active:scale-90 touch-manipulation"
            >
              <Heart size={24} className={liked ? "fill-red text-red" : ""} />
            </button>
            <button
              onClick={onShare}
              aria-label={t("share", "Share")}
              className="grid h-14 w-14 place-items-center rounded-full bg-surface-2 transition-transform duration-75 active:scale-90 touch-manipulation"
            >
              <Share2 size={22} />
            </button>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
