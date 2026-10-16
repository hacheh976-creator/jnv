import { adminDb } from "@/lib/supabase/admin";
import { PageTitle } from "@/components/admin/PageTitle";
import { AlbumsManager } from "@/components/admin/music/AlbumsManager";
import type { Album } from "@/lib/types";

export default async function AdminMusic() {
  const db = adminDb();
  const [{ data: albums }, { data: tracks }] = await Promise.all([
    db.from("albums").select("*").order("sort_order"),
    db.from("tracks").select("album_id,published"),
  ]);
  const counts: Record<string, { total: number; drafts: number }> = {};
  for (const t of tracks ?? []) {
    const c = (counts[t.album_id] ??= { total: 0, drafts: 0 });
    c.total++;
    if (!t.published) c.drafts++;
  }
  return (
    <>
      <PageTitle title="Hla" sub="Album thlang la, hla upload rawh" />
      <AlbumsManager initial={(albums ?? []) as Album[]} counts={counts} />
    </>
  );
}
