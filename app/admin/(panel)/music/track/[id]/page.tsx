import { notFound } from "next/navigation";
import { adminDb } from "@/lib/supabase/admin";
import { TrackForm } from "@/components/admin/music/TrackForm";
import { TRACK_FIELDS, type Album, type Genre, type Track } from "@/lib/types";

export default async function EditTrack({ params }: PageProps<"/admin/music/track/[id]">) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const db = adminDb();
  const [{ data: track }, { data: albums }, { data: genres }] = await Promise.all([
    db.from("tracks").select(TRACK_FIELDS).eq("id", id).maybeSingle(),
    db.from("albums").select("*").order("sort_order"),
    db.from("genres").select("*").order("sort_order"),
  ]);
  if (!track) notFound();
  return <TrackForm track={track as unknown as Track} albums={(albums ?? []) as Album[]} genres={(genres ?? []) as Genre[]} />;
}
