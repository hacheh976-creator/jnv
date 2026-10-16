"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button, Input, confirmDelete, toast } from "./ui";
import { MoveButtons } from "./SortableList";
import { deleteCategory, saveCategory } from "@/lib/actions/admin";
import type { GameCategory } from "@/lib/types";

export function CategoryManager({ initial }: { initial: GameCategory[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const r = await saveCategory({ name });
    if (!r.ok) return toast.error(r.error);
    setName("");
    toast.ok("Category belh a ni ta!");
    router.refresh();
  }

  async function rename(id: string) {
    const r = await saveCategory({ id, name: editName });
    if (!r.ok) return toast.error(r.error);
    setItems((l) => l.map((c) => (c.id === id ? { ...c, name: editName } : c)));
    setEditing(null);
    toast.ok("Thlak a ni ta!");
  }

  async function remove(c: GameCategory) {
    if (!confirmDelete(c.name)) return;
    const r = await deleteCategory(c.id);
    if (!r.ok) return toast.error(r.error);
    setItems((l) => l.filter((x) => x.id !== c.id));
    toast.ok("Paih a ni ta");
  }

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="flex gap-3">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category thar hming (e.g. Sports)" maxLength={40} />
        <Button type="submit" className="shrink-0"><Plus size={20} /> Belh</Button>
      </form>
      <ul className="space-y-2">
        {items.map((c, i) => (
          <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-surface p-3">
            <MoveButtons items={items} index={i} table="game_categories" onChange={setItems} />
            {editing === c.id ? (
              <>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus maxLength={40} />
                <button onClick={() => rename(c.id)} aria-label="Vawng" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-green text-white"><Check size={20} /></button>
                <button onClick={() => setEditing(null)} aria-label="Sut" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-2"><X size={20} /></button>
              </>
            ) : (
              <>
                <span className="flex-1 font-semibold">{c.name}</span>
                <button onClick={() => { setEditing(c.id); setEditName(c.name); }} aria-label="Thlak" className="grid h-11 w-11 place-items-center rounded-xl bg-surface-2"><Pencil size={18} /></button>
                <button onClick={() => remove(c)} aria-label="Paih" className="grid h-11 w-11 place-items-center rounded-xl bg-red/15 text-red"><Trash2 size={18} /></button>
              </>
            )}
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">Category paih chuan a chhunga game te chu “Category awm lo” ah a kal ang (a bo lo).</p>
    </div>
  );
}
