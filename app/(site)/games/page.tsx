import type { Metadata } from "next";
import { GameCard } from "@/components/game/GameCard";
import { OpenGameOnLoad } from "@/components/game/OpenGameOnLoad";
import { GamesHeader } from "@/components/game/GamesHeader";
import { GamesFilterBar } from "@/components/game/GamesFilterBar";
import { GamesEmptyFilter } from "@/components/game/GamesEmptyFilter";
import { DemoBanner } from "@/components/site/Section";
import { getCategories, getGameBySlug, getGames, isDemo } from "@/lib/queries";

export const metadata: Metadata = { title: "Games" };

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
      <GamesHeader />
      {isDemo() && <div className="-mx-4"><DemoBanner /></div>}

      <GamesFilterBar categories={categories} cat={cat} cls={cls} href={href} />

      {games.length ? (
        <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-7 p-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {games.map((game, i) => (
            <GameCard key={game.id} game={game} tilt={i} priority={i < 4} />
          ))}
        </div>
      ) : (
        <GamesEmptyFilter />
      )}
      {deepLinked && <OpenGameOnLoad game={deepLinked} />}
    </div>
  );
}
