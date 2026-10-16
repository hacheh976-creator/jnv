import type { Metadata } from "next";
import { Search } from "lucide-react";
import { GameCard } from "@/components/game/GameCard";
import { TrackList } from "@/components/music/TrackList";
import { search } from "@/lib/queries";

export const metadata: Metadata = { title: "Zawng" };

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const { games, tracks } = await search(q);
  const nothing = q && !games.length && !tracks.length;

  return (
    <div className="px-4 pt-6">
      <h1 className="font-display text-4xl font-extrabold">Zawng</h1>
      <form action="/search" className="relative mt-4" role="search">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={22} />
        <input
          name="q"
          defaultValue={q}
          autoFocus={!q}
          enterKeyHint="search"
          placeholder="Game emaw hla hming..."
          className="h-14 w-full rounded-full border border-line bg-surface pl-12 pr-28 text-lg outline-none focus:border-saffron"
        />
        <button className="absolute right-2 top-1/2 h-11 -translate-y-1/2 rounded-full bg-saffron px-5 font-bold text-black">
          Zawng
        </button>
      </form>

      {nothing && <p className="mt-10 text-center text-lg text-muted">“{q}” hi kan hmu lo. Thumal dang hmang rawh.</p>}

      {games.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 font-display text-2xl font-extrabold">Game</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-7 p-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {games.map((g, i) => (
              <GameCard key={g.id} game={g} tilt={i} />
            ))}
          </div>
        </section>
      )}
      {tracks.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 font-display text-2xl font-extrabold">Hla</h2>
          <TrackList tracks={tracks} />
        </section>
      )}
    </div>
  );
}
