import { adminDb } from "@/lib/supabase/admin";
import { PageTitle } from "@/components/admin/PageTitle";
import { CategoryManager } from "@/components/admin/CategoryManager";
import type { GameCategory } from "@/lib/types";

export default async function Categories() {
  const { data } = await adminDb().from("game_categories").select("*").order("sort_order");
  return (
    <>
      <PageTitle title="Game Category" sub="Puzzle, Action, Quiz... siam, thlak, indawt rem" />
      <CategoryManager initial={(data ?? []) as GameCategory[]} />
    </>
  );
}
