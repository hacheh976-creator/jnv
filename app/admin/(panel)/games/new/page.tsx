import { adminDb } from "@/lib/supabase/admin";
import { GameEditor } from "@/components/admin/GameEditor";
import type { GameCategory } from "@/lib/types";

export default async function NewGame() {
  const { data } = await adminDb().from("game_categories").select("*").order("sort_order");
  return <GameEditor categories={(data ?? []) as GameCategory[]} />;
}
