import type { Metadata } from "next";
import { AlbumCard } from "@/components/music/AlbumCard";
import { TrackList } from "@/components/music/TrackList";
import { MusicHeader } from "@/components/music/MusicHeader";
import { DemoBanner, Section } from "@/components/site/Section";
import { getAlbumTrackCounts, getAlbums, getNewTracks, isDemo } from "@/lib/queries";

export const metadata: Metadata = { title: "Music" };

export default async function MusicPage() {
  const [albums, counts, tracks] = await Promise.all([getAlbums(), getAlbumTrackCounts(), getNewTracks(8)]);
  return (
    <div className="pt-6">
      <MusicHeader />
      {isDemo() && <DemoBanner />}
      <div className="mt-6 grid grid-cols-1 gap-4 px-4 sm:grid-cols-3">
        {albums.map((a) => (
          <AlbumCard key={a.id} album={a} count={counts[a.id] ?? 0} big />
        ))}
      </div>
      {tracks.length > 0 && (
        <Section title="Hla thar" titleKey="newTracks">
          <TrackList tracks={tracks} />
        </Section>
      )}
    </div>
  );
}
