import { notFound } from "next/navigation";
import { adminDb } from "@/lib/supabase/admin";
import { GameEditor } from "@/components/admin/GameEditor";
import type { GameCategory, GameWithCode } from "@/lib/types";

export default async function EditGame({ params }: PageProps<"/admin/games/[id]">) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const db = adminDb();
  const [{ data: game }, { data: cats }] = await Promise.all([
    db.from("games").select("*").eq("id", id).maybeSingle(),
    db.from("game_categories").select("*").order("sort_order"),
  ]);
  if (!game) notFound();
  return <GameEditor game={game as GameWithCode} categories={(cats ?? []) as GameCategory[]} />;
}
