"use client";
import { ArrowDown, ArrowUp } from "lucide-react";
import { reorder } from "@/lib/actions/admin";
import { toast } from "./ui";

/** Simple up/down reordering — easier than drag-and-drop on phones. */
export function MoveButtons<T extends { id: string }>({
  items,
  index,
  table,
  onChange,
}: {
  items: T[];
  index: number;
  table: "game_categories" | "albums" | "genres" | "tracks";
  onChange: (next: T[]) => void;
}) {
  async function move(dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[index], next[j]] = [next[j], next[index]];
    onChange(next);
    const r = await reorder({ table, ids: next.map((x) => x.id) });
    if (!r.ok) {
      toast.error(r.error);
      onChange(items);
    }
  }
  return (
    <span className="flex shrink-0 gap-1">
      <button type="button" disabled={index === 0} onClick={() => move(-1)} aria-label="Chung lamah" className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 disabled:opacity-30">
        <ArrowUp size={18} />
      </button>
      <button type="button" disabled={index === items.length - 1} onClick={() => move(1)} aria-label="Hnuai lamah" className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 disabled:opacity-30">
        <ArrowDown size={18} />
      </button>
    </span>
  );
}
