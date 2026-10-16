"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Settings2, Trash2 } from "lucide-react";
import { Button, Field, Input, confirmDelete, toast } from "../ui";
import { CoverPicker } from "../CoverPicker";
import { deleteAlbum, saveAlbum } from "@/lib/actions/admin";
import type { Album } from "@/lib/types";

export function AlbumEditor({ album, trackCount }: { album: Album; trackCount: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [a, setA] = useState(album);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    const r = await saveAlbum({ id: a.id, name: a.name, description: a.description, cover_url: a.cover_url, accent_color: a.accent_color });
    setBusy(false);
    if (!r.ok) return toast.error(r.error);
    toast.ok("Album vawn a ni ta!");
    router.refresh();
  }

  async function remove() {
    if (trackCount > 0) return toast.error("Album chhunga hla te paih hmasa rawh");
    if (!confirmDelete(`Album “${a.name}”`)) return;
    const r = await deleteAlbum(a.id);
    if (!r.ok) return toast.error(r.error);
    router.replace("/admin/music");
  }

  if (!open) {
    return (
      <Button variant="ghost" onClick={() => setOpen(true)}>
        <Settings2 size={18} /> Album thlak
      </Button>
    );
  }

  return (
    <div className="w-full space-y-4 rounded-3xl bg-surface p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Album hming"><Input value={a.name} onChange={(e) => setA({ ...a, name: e.target.value })} maxLength={40} /></Field>
        <Field label="Sawifiahna"><Input value={a.description} onChange={(e) => setA({ ...a, description: e.target.value })} maxLength={200} /></Field>
      </div>
      <div className="flex flex-wrap items-end gap-6">
        <CoverPicker folder="albums" accent={a.accent_color} value={{ cover_url: a.cover_url, cover_sm_url: null }} onChange={(v, accent) => setA({ ...a, cover_url: v.cover_url, accent_color: accent ?? a.accent_color })} label="Album cover" />
        <Field label="Rong">
          <input type="color" value={a.accent_color} onChange={(e) => setA({ ...a, accent_color: e.target.value.toUpperCase() })} className="h-12 w-16 cursor-pointer rounded-xl border border-line bg-surface-2 p-1" />
        </Field>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={save} disabled={busy}>{busy ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Vawng</Button>
        <Button variant="ghost" onClick={() => { setA(album); setOpen(false); }}>Khar</Button>
        <Button variant="danger" onClick={remove} className="ml-auto"><Trash2 size={18} /> Album paih</Button>
      </div>
    </div>
  );
}
