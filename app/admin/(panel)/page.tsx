import Link from "next/link";
import { Gamepad2, Music2, Play, Plus, Upload } from "lucide-react";
import { adminDb } from "@/lib/supabase/admin";
import { PageTitle } from "@/components/admin/PageTitle";
import { formatCount } from "@/lib/utils";

export default async function Dashboard() {
  const db = adminDb();
  const [games, tracks] = await Promise.all([
    db.from("games").select("id,title,plays,published,slug").order("plays", { ascending: false }),
    db.from("tracks").select("id,title,plays,published").order("plays", { ascending: false }),
  ]);
  const g = games.data ?? [];
  const t = tracks.data ?? [];
  const totalPlays = g.reduce((s, x) => s + x.plays, 0) + t.reduce((s, x) => s + x.plays, 0);

  const stats = [
    { label: "Game (publish)", value: g.filter((x) => x.published).length, sub: `${g.filter((x) => !x.published).length} draft`, color: "var(--saffron)" },
    { label: "Hla (publish)", value: t.filter((x) => x.published).length, sub: `${t.filter((x) => !x.published).length} draft`, color: "var(--blue)" },
    { label: "Khelh zat", value: formatCount(totalPlays), sub: "a vaiin", color: "var(--green)" },
  ];

  return (
    <>
      <PageTitle title="Dashboard" sub="Chibai! Tunah eng nge i tih ang?" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link href="/admin/games/new" className="flex items-center gap-4 rounded-3xl bg-saffron p-5 text-black transition hover:brightness-110 active:scale-[0.98]">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-black/15"><Plus size={30} /></span>
          <span><span className="block font-display text-2xl font-extrabold">Game thar</span><span className="text-sm font-medium">HTML code paste la, cover dah rawh</span></span>
        </Link>
        <Link href="/admin/music" className="flex items-center gap-4 rounded-3xl bg-blue p-5 text-white transition hover:brightness-110 active:scale-[0.98]">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-black/15"><Upload size={28} /></span>
          <span><span className="block font-display text-2xl font-extrabold">Hla thar</span><span className="text-sm font-medium">MP3 upload la, album thlang rawh</span></span>
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="min-w-0 rounded-3xl bg-surface p-3 sm:p-5">
            <div className="text-xs text-muted sm:text-sm">{s.label}</div>
            <div className="font-display text-3xl font-extrabold sm:text-4xl" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-muted">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TopList title="Game lar ber" icon={<Gamepad2 size={20} />} rows={g.slice(0, 5).map((x) => ({ id: x.id, title: x.title, plays: x.plays, href: `/admin/games/${x.id}` }))} />
        <TopList title="Hla lar ber" icon={<Music2 size={20} />} rows={t.slice(0, 5).map((x) => ({ id: x.id, title: x.title, plays: x.plays, href: `/admin/music/track/${x.id}` }))} />
      </div>
    </>
  );
}

function TopList({ title, icon, rows }: { title: string; icon: React.ReactNode; rows: { id: string; title: string; plays: number; href: string }[] }) {
  return (
    <div className="rounded-3xl bg-surface p-5">
      <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold">{icon} {title}</h2>
      {rows.length ? (
        <ol className="space-y-1">
          {rows.map((r, i) => (
            <li key={r.id}>
              <Link href={r.href} className="flex items-center gap-3 rounded-2xl px-3 py-2 hover:bg-white/5">
                <span className="w-6 text-center font-bold text-muted">{i + 1}</span>
                <span className="flex-1 truncate font-semibold">{r.title}</span>
                <span className="flex items-center gap-1 text-sm text-muted"><Play size={14} /> {formatCount(r.plays)}</span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="py-6 text-center text-muted">A la awm lo</p>
      )}
    </div>
  );
}
