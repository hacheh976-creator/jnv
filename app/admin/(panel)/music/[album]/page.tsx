import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { adminDb } from "@/lib/supabase/admin";
import { BulkUpload } from "@/components/admin/music/BulkUpload";
import { GenresManager } from "@/components/admin/music/GenresManager";
import { TrackTable } from "@/components/admin/music/TrackTable";
import { AlbumEditor } from "@/components/admin/music/AlbumEditor";
import { TRACK_FIELDS, type Album, type Genre, type Track } from "@/lib/types";

export default async function AdminAlbum({ params }: PageProps<"/admin/music/[album]">) {
  const { album: slug } = await params;
  const db = adminDb();
  const { data: album } = await db.from("albums").select("*").eq("slug", slug).maybeSingle();
  if (!album) notFound();
  const [{ data: genres }, { data: tracks }] = await Promise.all([
    db.from("genres").select("*").eq("album_id", album.id).order("sort_order"),
    db.from("tracks").select(TRACK_FIELDS).eq("album_id", album.id).order("sort_order").order("created_at", { ascending: false }),
  ]);
  const a = album as Album;
  const g = (genres ?? []) as Genre[];
  const t = (tracks ?? []) as unknown as Track[];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link href="/admin/music" className="grid h-11 w-11 place-items-center rounded-full bg-surface-2" aria-label="Kir leh"><ChevronLeft /></Link>
        <span className="h-10 w-2 rounded-full" style={{ background: a.accent_color }} />
        <div className="mr-auto">
          <h1 className="font-display text-3xl font-extrabold">{a.name}</h1>
          <p className="text-sm text-muted">{t.length} hla</p>
        </div>
        <AlbumEditor album={a} trackCount={t.length} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-4">
          <BulkUpload album={a} genres={g} />
          <TrackTable key={t.map((x) => x.id + x.published).join()} initial={t} genres={g} />
        </div>
        <div className="min-w-0">
          <GenresManager key={g.map((x) => x.id + x.name).join()} albumId={a.id} initial={g} />
        </div>
      </div>
    </>
  );
}
