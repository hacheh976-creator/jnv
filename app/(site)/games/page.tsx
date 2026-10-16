import type { Metadata } from "next";
import { GameCard } from "@/components/game/GameCard";
import { OpenGameOnLoad } from "@/components/game/OpenGameOnLoad";
import { Chip } from "@/components/site/Chip";
import { DemoBanner } from "@/components/site/Section";
import { getCategories, getGameBySlug, getGames, isDemo } from "@/lib/queries";

export const metadata: Metadata = { title: "Game" };

export default async function GamesPage({ searchParams }: PageProps<"/games">) {
  const sp = await searchParams;
  const cat = typeof sp.cat === "string" ? sp.cat : undefined;
  const clsNum = Number(sp.cls);
  const cls = [7, 8, 9].includes(clsNum) ? clsNum : undefined;
  const g = typeof sp.g === "string" ? sp.g : undefined;

  const [categories, games, deepLinked] = await Promise.all([
    getCategories(),
    getGames({ category: cat, cls }),
    g ? getGameBySlug(g) : Promise.resolve(null),
  ]);

  const href = (next: { cat?: string; cls?: number }) => {
    const p = new URLSearchParams();
    if (next.cat) p.set("cat", next.cat);
    if (next.cls) p.set("cls", String(next.cls));
    const s = p.toString();
    return s ? `/games?${s}` : "/games";
  };

  return (
    <div className="px-4 pt-6">
      <h1 className="font-display text-4xl font-extrabold">Game</h1>
      <p className="text-muted">Kan naupangte siam game — hmet la, khel rawh!</p>
      {isDemo() && <div className="-mx-4"><DemoBanner /></div>}

      <div className="sticky top-16 z-30 -mx-4 mt-4 space-y-2 bg-bg/90 px-4 py-3 backdrop-blur-xl">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <Chip href={href({ cls })} active={!cat}>All</Chip>
          {categories.map((c) => (
            <Chip key={c.id} href={href({ cat: c.slug, cls })} active={cat === c.slug}>
              {c.name}
            </Chip>
          ))}
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <Chip href={href({ cat })} active={!cls}>Class zawng zawng</Chip>
          {[7, 8, 9].map((n) => (
            <Chip key={n} href={href({ cat, cls: n })} active={cls === n}>
              Class {n}
            </Chip>
          ))}
        </div>
      </div>

      {games.length ? (
        <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-7 p-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {games.map((game, i) => (
            <GameCard key={game.id} game={game} tilt={i} priority={i < 4} />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-3xl bg-surface p-10 text-center text-lg text-muted">
          Hetah hian game a la awm lo. Filter dang thlang rawh.
        </p>
      )}
      {deepLinked && <OpenGameOnLoad game={deepLinked} />}
    </div>
  );
}
