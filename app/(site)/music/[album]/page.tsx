import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Music2 } from "lucide-react";
import { PlayAllButtons, TrackList } from "@/components/music/TrackList";
import { Chip } from "@/components/site/Chip";
import { getAlbumPage } from "@/lib/queries";

export async function generateMetadata({ params }: PageProps<"/music/[album]">): Promise<Metadata> {
  const { album } = await params;
  const data = await getAlbumPage(album);
  return { title: data ? `${data.album.name} hla` : "Hla" };
}

export default async function AlbumPage({ params, searchParams }: PageProps<"/music/[album]">) {
  const { album: slug } = await params;
  const sp = await searchParams;
  const data = await getAlbumPage(slug);
  if (!data) notFound();
  const { album, genres, tracks } = data;
  const genreSlug = typeof sp.g === "string" ? sp.g : undefined;
  const genre = genres.find((g) => g.slug === genreSlug);
  const shown = genre ? tracks.filter((t) => t.genre_id === genre.id) : tracks;

  return (
    <div>
      <div
        className="relative overflow-hidden px-4 pb-6 pt-4"
        style={{ background: `linear-gradient(180deg, ${album.accent_color}55 0%, transparent 100%)` }}
      >
        <Link href="/music" className="mb-4 inline-flex h-10 items-center gap-1 rounded-full bg-black/30 pl-2 pr-4 text-sm font-semibold backdrop-blur">
          <ChevronLeft size={20} /> Hla
        </Link>
        <div className="flex items-end gap-5">
          <div
            className="grid h-32 w-32 shrink-0 place-items-center overflow-hidden rounded-3xl shadow-2xl shadow-black/50 sm:h-44 sm:w-44"
            style={{ background: `radial-gradient(circle at 70% 20%, ${album.accent_color}, #15151f)` }}
          >
            {album.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={album.cover_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <Music2 className="h-14 w-14 text-white/40" />
            )}
          </div>
          <div className="min-w-0 pb-1">
            <p className="text-xs font-bold uppercase tracking-widest text-white/70">Album</p>
            <h1 className="font-display text-5xl font-extrabold leading-none sm:text-6xl">{album.name}</h1>
            <p className="mt-2 text-sm text-white/75">{tracks.length} hla</p>
          </div>
        </div>
        <div className="mt-5">
          <PlayAllButtons tracks={shown} accent={album.accent_color} />
        </div>
      </div>

      {genres.length > 0 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-4">
          <Chip href={`/music/${album.slug}`} active={!genre}>All</Chip>
          {genres.map((g) => (
            <Chip key={g.id} href={`/music/${album.slug}?g=${g.slug}`} active={genre?.id === g.id}>
              {g.name}
            </Chip>
          ))}
        </div>
      )}

      <div className="px-4">
        <TrackList tracks={shown} albumCover={album.cover_url} />
      </div>
    </div>
  );
}
