import { Flame, Music2, Sparkles } from "lucide-react";
import { Mosaic } from "@/components/game/Mosaic";
import { GameCard } from "@/components/game/GameCard";
import { AlbumCard } from "@/components/music/AlbumCard";
import { TrackList } from "@/components/music/TrackList";
import { InstallButton } from "@/components/site/InstallButton";
import { HeroButtons } from "@/components/site/HeroButtons";
import { DemoBanner, Section } from "@/components/site/Section";
import {
  getAlbumTrackCounts,
  getAlbums,
  getGames,
  getMosaicGames,
  getNewTracks,
  getSettings,
  isDemo,
} from "@/lib/queries";

export default async function Home() {
  const [settings, mosaic, newest, popular, albums, counts, tracks] = await Promise.all([
    getSettings(),
    getMosaicGames(),
    getGames({ limit: 12 }),
    getGames({ limit: 12, order: "popular" }),
    getAlbums(),
    getAlbumTrackCounts(),
    getNewTracks(5),
  ]);

  return (
    <>
      <section className="relative isolate flex min-h-[min(78svh,620px)] items-center justify-center overflow-hidden">
        <Mosaic games={mosaic} />
        <div className="pointer-events-none relative z-10 px-6 py-16 text-center">
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] sm:text-7xl">
            JNV <span className="brand-text">Studio</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base font-medium text-white/85 drop-shadow sm:text-lg">
            {settings.tagline}
          </p>
          <p className="mt-1 text-sm text-white/60 drop-shadow">{settings.school_name}</p>
          <HeroButtons />
        </div>
      </section>

      {isDemo() && <DemoBanner />}

      <div className="relative z-10 mt-4 px-4 empty:hidden">
        <InstallButton variant="card" />
      </div>

      <Section title="Game thar" titleKey="newGames" href="/games" icon={<Sparkles className="text-yellow" size={24} />}>
        <GameRow games={newest} />
      </Section>

      {popular.length > 3 && (
        <Section title="A lar ber" titleKey="popularGames" href="/games" icon={<Flame className="text-red" size={24} />}>
          <GameRow games={popular} />
        </Section>
      )}

      <Section title="Hla" titleKey="albums" href="/music" icon={<Music2 className="text-blue" size={24} />}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {albums.map((a) => (
            <AlbumCard key={a.id} album={a} count={counts[a.id] ?? 0} big />
          ))}
        </div>
      </Section>

      {tracks.length > 0 && (
        <Section title="Hla thar" titleKey="newTracks">
          <TrackList tracks={tracks} />
        </Section>
      )}
    </>
  );
}

function GameRow({ games }: { games: Parameters<typeof GameCard>[0]["game"][] }) {
  if (!games.length) {
    return <p className="rounded-3xl bg-surface p-8 text-center text-muted">Game a la awm lo. A hun hnaiah lo en leh rawh!</p>;
  }
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 pt-3">
      {games.map((g, i) => (
        <div key={g.id} className="w-40 shrink-0 snap-start sm:w-48">
          <GameCard game={g} tilt={i} />
        </div>
      ))}
    </div>
  );
}
