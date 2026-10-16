import { Cover } from "@/components/ui/Cover";
import type { Game } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Visual part of a game card (no hooks) — usable from server and client. */
export function CardFace({ game, tilt = 0, priority, size = "md" }: { game: Game; tilt?: number; priority?: boolean; size?: "md" | "lg" }) {
  const rot = tilt % 2 === 0 ? 2.5 : -2.5;
  return (
    <>
      <span
        aria-hidden
        className="absolute -inset-1.5 rounded-2xl border-[1.5px] opacity-70 transition-transform duration-300 group-hover:scale-105"
        style={{ borderColor: game.accent_color, transform: `rotate(${rot}deg)` }}
      />
      <span className="relative block h-full w-full overflow-hidden rounded-2xl bg-surface shadow-lg shadow-black/40 ring-1 ring-white/10 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_12px_40px_-8px_var(--accent)] group-active:scale-[0.97]">
        <Cover
          src={size === "lg" ? game.cover_url : (game.cover_sm_url ?? game.cover_url)}
          alt={game.title}
          accent={game.accent_color}
          priority={priority}
        />
        {game.class && (
          <span className="absolute right-2 top-2 rounded-full border border-white/10 bg-black/85 px-2 py-0.5 text-[11px] font-bold text-white">
            Cl. {game.class}
          </span>
        )}
        {game.show_title_overlay && (
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-10">
            <span className={cn("line-clamp-2 font-display font-extrabold leading-tight text-white drop-shadow", size === "lg" ? "text-2xl" : "text-lg")}>
              {game.title}
            </span>
          </span>
        )}
      </span>
    </>
  );
}
