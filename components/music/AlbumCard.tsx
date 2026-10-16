import Link from "next/link";
import { Music2 } from "lucide-react";
import type { Album } from "@/lib/types";

export function AlbumCard({ album, count, big }: { album: Album; count: number; big?: boolean }) {
  return (
    <Link
      href={`/music/${album.slug}`}
      className="group relative block overflow-hidden rounded-3xl ring-1 ring-white/10 transition hover:-translate-y-1 active:scale-[0.98]"
      style={{ boxShadow: `0 20px 50px -24px ${album.accent_color}` }}
    >
      <div className={big ? "aspect-[16/10] sm:aspect-square" : "aspect-square"}>
        {album.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={album.cover_url} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `radial-gradient(circle at 80% 10%, ${album.accent_color} 0%, ${album.accent_color}55 35%, #15151f 80%)`,
            }}
          >
            <Music2 className="absolute right-5 top-5 h-16 w-16 text-white/25" />
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-3xl font-extrabold text-white sm:text-4xl">{album.name}</h3>
        <p className="text-sm text-white/75">
          {count} hla {album.description && <>· {album.description}</>}
        </p>
      </div>
    </Link>
  );
}
