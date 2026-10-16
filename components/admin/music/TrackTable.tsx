"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Pencil, Play } from "lucide-react";
import { MoveButtons } from "../SortableList";
import { PublishSwitch } from "../PublishSwitch";
import type { Genre, Track } from "@/lib/types";
import { byline, cn, formatCount, formatDuration } from "@/lib/utils";

export function TrackTable({ initial, genres }: { initial: Track[]; genres: Genre[] }) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<string>("all");
  const genreName = useMemo(() => Object.fromEntries(genres.map((g) => [g.id, g.name])), [genres]);
  const shown = filter === "all" ? items : items.filter((t) => (filter === "none" ? !t.genre_id : t.genre_id === filter));

  return (
    <div className="rounded-3xl bg-surface p-4">
      <h2 className="mb-3 font-display text-lg font-bold">Hla zawng zawng ({items.length})</h2>
      {genres.length > 0 && (
        <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
          {[{ id: "all", name: "All" }, ...genres, { id: "none", name: "Genre awm lo" }].map((g) => (
            <button key={g.id} onClick={() => setFilter(g.id)} className={cn("h-10 shrink-0 rounded-full px-4 text-sm font-semibold", filter === g.id ? "bg-text text-bg" : "bg-surface-2 text-muted")}>
              {g.name}
            </button>
          ))}
        </div>
      )}
      {shown.length === 0 ? (
        <p className="py-8 text-center text-muted">Hla a la awm lo. A chung lamah upload rawh.</p>
      ) : (
        <ul className="space-y-2">
          {shown.map((t) => {
            const i = items.indexOf(t);
            return (
              <li key={t.id} className="flex items-center gap-2 rounded-2xl bg-surface-2 p-2">
                {filter === "all" && (
                  <span className="hidden sm:flex">
                    <MoveButtons items={items} index={i} table="tracks" onChange={setItems} />
                  </span>
                )}
                <Link href={`/admin/music/track/${t.id}`} className="min-w-0 flex-1 px-1">
                  <span className="block truncate font-semibold">{t.title}</span>
                  <span className="block truncate text-xs text-muted">
                    {[t.genre_id && genreName[t.genre_id], byline(t.creators, t.class), formatDuration(t.duration_sec)].filter(Boolean).join(" · ")}
                    <span className="ml-2 inline-flex items-center gap-0.5"><Play size={10} /> {formatCount(t.plays)}</span>
                  </span>
                </Link>
                <PublishSwitch id={t.id} published={t.published} kind="track" />
                <Link href={`/admin/music/track/${t.id}`} aria-label="Thlak" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface"><Pencil size={16} /></Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
