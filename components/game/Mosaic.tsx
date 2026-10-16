import type { Game } from "@/lib/types";
import { CardFace } from "./CardFace";
import { MosaicClicks } from "./MosaicClicks";

/** Tilted, slowly drifting wall of game cards (pure CSS animation, hardware-accelerated). */
export function Mosaic({ games }: { games: Game[] }) {
  if (!games.length) return null;
  const rows = [0, 1, 2, 3].map((r) => {
    const list = games.filter((_, i) => i % 4 === r);
    const base = list.length ? list : games;
    const half: Game[] = [];
    while (half.length < 5) half.push(...base);
    return [...half, ...half]; // duplicated for a seamless loop
  });
  return (
    <MosaicClicks games={games}>
      <div className="mosaic-wall pointer-events-auto absolute left-1/2 top-1/2 flex w-[220%] flex-col gap-4 will-change-transform sm:w-[160%] sm:gap-5">
        {rows.map((row, r) => (
          <div key={r} className={`mosaic-row gap-4 sm:gap-5 ${r % 2 ? "rev" : ""} ${r === 3 ? "hidden sm:flex" : ""}`} style={{ ["--speed" as string]: `${65 + r * 15}s` }}>
            {row.map((g, i) => (
              <button
                key={`${g.id}-${i}`}
                type="button"
                data-slug={g.slug}
                tabIndex={i < row.length / 2 ? 0 : -1}
                aria-hidden={i >= row.length / 2 || undefined}
                aria-label={`${g.title} — info en rawh`}
                className="group relative block aspect-square w-28 shrink-0 sm:w-40 lg:w-48"
                style={{ ["--accent" as string]: g.accent_color }}
              >
                <CardFace game={g} tilt={i + r} />
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,var(--bg)_75%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(11,11,18,0.85)_0%,rgba(11,11,18,0.35)_55%,transparent_75%)] sm:w-[70%]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
    </MosaicClicks>
  );
}
