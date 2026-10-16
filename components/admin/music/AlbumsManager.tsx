"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Music2, Plus } from "lucide-react";
import { Button, Input, toast } from "../ui";
import { MoveButtons } from "../SortableList";
import { createAlbum } from "@/lib/actions/admin";
import type { Album } from "@/lib/types";

export function AlbumsManager({ initial, counts }: { initial: Album[]; counts: Record<string, { total: number; drafts: number }> }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#A855F7");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const r = await createAlbum({ name, accent_color: color.toUpperCase() });
    if (!r.ok) return toast.error(r.error);
    toast.ok("Album siam a ni ta!");
    setName("");
    router.push(`/admin/music/${r.data.slug}`);
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {items.map((a, i) => (
          <li key={a.id} className="flex items-center gap-3 rounded-3xl bg-surface p-3">
            <MoveButtons items={items} index={i} table="albums" onChange={setItems} />
            <Link href={`/admin/music/${a.slug}`} className="flex min-w-0 flex-1 items-center gap-4 rounded-2xl p-1 hover:bg-white/5">
              <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl" style={{ background: `radial-gradient(circle at 70% 20%, ${a.accent_color}, #15151f)` }}>
                {a.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.cover_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Music2 className="text-white/60" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-2xl font-extrabold">{a.name}</span>
                <span className="block text-sm text-muted">
                  {counts[a.id]?.total ?? 0} hla{counts[a.id]?.drafts ? ` · ${counts[a.id].drafts} draft` : ""}
                </span>
              </span>
              <ChevronRight className="text-muted" />
            </Link>
          </li>
        ))}
      </ul>
      <form onSubmit={add} className="flex flex-wrap gap-3 rounded-3xl border border-dashed border-line p-4">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Album thar (e.g. Khasi, Nepali)" maxLength={40} className="min-w-48 flex-1" />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Rong" className="h-12 w-14 cursor-pointer rounded-xl border border-line bg-surface-2 p-1" />
        <Button type="submit" disabled={!name.trim()}><Plus size={20} /> Album siam</Button>
      </form>
    </div>
  );
}
