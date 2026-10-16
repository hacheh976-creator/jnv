import Link from "next/link";
import { Play, Plus, Star } from "lucide-react";
import { adminDb } from "@/lib/supabase/admin";
import { PageTitle } from "@/components/admin/PageTitle";
import { PublishSwitch } from "@/components/admin/PublishSwitch";
import { Cover } from "@/components/ui/Cover";
import { GAME_FIELDS, type Game, type GameCategory } from "@/lib/types";
import { byline, formatCount } from "@/lib/utils";

export default async function AdminGames({ searchParams }: PageProps<"/admin/games">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const db = adminDb();
  let query = db.from("games").select(GAME_FIELDS).order("created_at", { ascending: false });
  if (q) query = query.ilike("title", `%${q.replace(/[%_]/g, "")}%`);
  const [{ data }, cats] = await Promise.all([query, db.from("game_categories").select("*")]);
  const games = (data ?? []) as unknown as Game[];
  const catName = Object.fromEntries(((cats.data ?? []) as GameCategory[]).map((c) => [c.id, c.name]));

  return (
    <>
      <PageTitle
        title="Game"
        sub={`${games.length} game`}
        action={
          <Link href="/admin/games/new" className="flex h-12 items-center gap-2 rounded-full bg-saffron px-5 font-bold text-black">
            <Plus size={20} /> Game thar
          </Link>
        }
      />
      <form className="mb-4">
        <input name="q" defaultValue={q} placeholder="Game hming zawng rawh..." className="h-12 w-full rounded-2xl border border-line bg-surface px-4 outline-none focus:border-saffron" />
      </form>
      {games.length === 0 ? (
        <div className="rounded-3xl bg-surface p-10 text-center">
          <p className="text-lg text-muted">Game a la awm lo.</p>
          <Link href="/admin/games/new" className="mt-4 inline-flex h-12 items-center gap-2 rounded-full bg-saffron px-5 font-bold text-black">
            <Plus size={20} /> A hmasa ber dah rawh
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 [&>li]:min-w-0">
          {games.map((g) => (
            <li key={g.id} className="flex items-center gap-3 rounded-3xl bg-surface p-3">
              <Link href={`/admin/games/${g.id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                <Cover src={g.cover_sm_url ?? g.cover_url} alt={g.title} accent={g.accent_color} />
              </Link>
              <Link href={`/admin/games/${g.id}`} className="min-w-0 flex-1">
                <span className="flex items-center gap-1 truncate font-bold">
                  {g.featured && <Star size={14} className="shrink-0 fill-yellow text-yellow" />} {g.title}
                </span>
                <span className="block truncate text-sm text-muted">{byline(g.creators, g.class) || "—"}</span>
                <span className="mt-1 flex items-center gap-2 text-xs text-muted">
                  {g.category_id && catName[g.category_id] && <span className="rounded-full bg-white/10 px-2 py-0.5">{catName[g.category_id]}</span>}
                  <span className="flex items-center gap-1"><Play size={12} /> {formatCount(g.plays)}</span>
                </span>
              </Link>
              <PublishSwitch id={g.id} published={g.published} kind="game" />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
