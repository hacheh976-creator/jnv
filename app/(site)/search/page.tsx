import type { Metadata } from "next";
import { GameCard } from "@/components/game/GameCard";
import { TrackList } from "@/components/music/TrackList";
import {
  SearchForm,
  SearchHeader,
  SearchNotFound,
  SearchSectionTitle,
} from "@/components/site/SearchForm";
import { search } from "@/lib/queries";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const { games, tracks } = await search(q);
  const nothing = q && !games.length && !tracks.length;

  return (
    <div className="px-4 pt-6">
      <SearchHeader />
      <SearchForm defaultValue={q} />

      {nothing && <SearchNotFound query={q} />}

      {games.length > 0 && (
        <section className="mt-8">
          <SearchSectionTitle type="games" />
          <div className="grid grid-cols-2 gap-x-5 gap-y-7 p-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {games.map((g, i) => (
              <GameCard key={g.id} game={g} tilt={i} />
            ))}
          </div>
        </section>
      )}
      {tracks.length > 0 && (
        <section className="mt-8">
          <SearchSectionTitle type="music" />
          <TrackList tracks={tracks} />
        </section>
      )}
    </div>
  );
}
