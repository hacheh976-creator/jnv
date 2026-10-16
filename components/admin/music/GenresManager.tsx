"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, Plus, Tags, Trash2, X } from "lucide-react";
import { Button, Input, confirmDelete, toast } from "../ui";
import { MoveButtons } from "../SortableList";
import { deleteGenre, saveGenre } from "@/lib/actions/admin";
import type { Genre } from "@/lib/types";

export function GenresManager({ albumId, initial }: { albumId: string; initial: Genre[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const r = await saveGenre({ album_id: albumId, name });
    if (!r.ok) return toast.error(r.error);
    setName("");
    toast.ok("Genre belh a ni ta!");
    router.refresh();
  }
  async function rename(id: string) {
    const r = await saveGenre({ id, album_id: albumId, name: editName });
    if (!r.ok) return toast.error(r.error);
    setItems((l) => l.map((g) => (g.id === id ? { ...g, name: editName } : g)));
    setEditing(null);
    router.refresh();
  }
  async function remove(g: Genre) {
    if (!confirmDelete(`Genre “${g.name}”`)) return;
    const r = await deleteGenre(g.id);
    if (!r.ok) return toast.error(r.error);
    setItems((l) => l.filter((x) => x.id !== g.id));
    router.refresh();
  }

  return (
    <div className="rounded-3xl bg-surface p-4">
      <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-bold"><Tags size={20} /> Genre</h2>
      <p className="mb-3 text-sm text-muted">
        {items.length ? "User-te chuan heng hi chip angin an hmu ang." : "Genre a awm lo — hla list chauh a lang ang."}
      </p>
      <ul className="space-y-2">
        {items.map((g, i) => (
          <li key={g.id} className="flex items-center gap-2 rounded-2xl bg-surface-2 p-2">
            <MoveButtons items={items} index={i} table="genres" onChange={setItems} />
            {editing === g.id ? (
              <>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus className="h-10" />
                <button onClick={() => rename(g.id)} aria-label="Vawng" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green text-white"><Check size={18} /></button>
                <button onClick={() => setEditing(null)} aria-label="Sut" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface"><X size={18} /></button>
              </>
            ) : (
              <>
                <span className="flex-1 px-2 font-semibold">{g.name}</span>
                <button onClick={() => { setEditing(g.id); setEditName(g.name); }} aria-label="Thlak" className="grid h-10 w-10 place-items-center rounded-xl bg-surface"><Pencil size={16} /></button>
                <button onClick={() => remove(g)} aria-label="Paih" className="grid h-10 w-10 place-items-center rounded-xl bg-red/15 text-red"><Trash2 size={16} /></button>
              </>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={add} className="mt-3 flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Genre thar" maxLength={40} className="h-11" />
        <Button type="submit" className="h-11 shrink-0" disabled={!name.trim()}><Plus size={18} /> Belh</Button>
      </form>
    </div>
  );
}
