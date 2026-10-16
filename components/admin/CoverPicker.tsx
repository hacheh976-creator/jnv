"use client";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { Button, toast } from "./ui";
import { ProgressBar } from "./ProgressBar";
import { cropSquare, type Area } from "@/lib/image";
import { uploadFile } from "@/lib/upload";

type CropperLiteProps = {
  image: string;
  crop: { x: number; y: number };
  zoom: number;
  aspect: number;
  onCropChange: (c: { x: number; y: number }) => void;
  onZoomChange: (z: number) => void;
  onCropComplete: (area: Area, pixels: Area) => void;
};

const Cropper = dynamic(() => import("react-easy-crop").then((m) => m.default as unknown as React.ComponentType<CropperLiteProps>), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center"><Loader2 className="animate-spin" /></div>,
});

export type CoverValue = { cover_url: string | null; cover_sm_url: string | null };

export function CoverPicker({
  value,
  onChange,
  folder,
  accent,
  label = "Cover thlalak",
}: {
  value: CoverValue;
  onChange: (v: CoverValue, accent?: string) => void;
  folder: string;
  accent: string;
  label?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!/^image\/(png|jpeg|webp|gif)$/.test(f.type)) return toast.error("PNG, JPG emaw WebP chauh");
    if (f.size > 8 * 1024 * 1024) return toast.error("Thlalak a lian lutuk (8MB aia tlem tur)");
    setSrc(URL.createObjectURL(f));
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  }

  async function save() {
    if (!src || !area) return;
    setBusy(true);
    setPct(0);
    try {
      const { big, small, accent: picked } = await cropSquare(src, area);
      const bigUrl = await uploadFile("covers", big, "webp", folder, (p) => setPct(Math.round(p * 0.7)));
      const smallUrl = await uploadFile("covers", small, "webp", folder, (p) => setPct(70 + Math.round(p * 0.3)));
      onChange({ cover_url: bigUrl, cover_sm_url: smallUrl }, picked);
      URL.revokeObjectURL(src);
      setSrc(null);
      toast.ok("Thlalak upload a ni ta!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload a hlawhchham");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block font-semibold">{label}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="relative grid aspect-square w-32 shrink-0 place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-line bg-surface-2 hover:border-saffron"
          style={value.cover_url ? { borderStyle: "solid", borderColor: accent } : undefined}
        >
          {value.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.cover_sm_url ?? value.cover_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-1 text-sm text-muted">
              <ImagePlus size={28} /> Thlang rawh
            </span>
          )}
        </button>
        <div className="flex flex-col gap-2">
          <Button type="button" variant="ghost" onClick={() => input.current?.click()}>
            <ImagePlus size={18} /> {value.cover_url ? "Thlak rawh" : "Thlalak thlang"}
          </Button>
          {value.cover_url && (
            <Button type="button" variant="danger" onClick={() => onChange({ cover_url: null, cover_sm_url: null })}>
              <Trash2 size={18} /> Paih rawh
            </Button>
          )}
          <span className="text-xs text-muted">Square (1:1) in a cut ang. PNG/JPG/WebP.</span>
        </div>
      </div>
      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={onFile} />

      <Sheet open={Boolean(src)} onClose={() => !busy && setSrc(null)} label="Thlalak cut rawh" variant="sheet">
        <div className="p-5 pt-10">
          <h3 className="font-display text-xl font-bold">Thlalak cut rawh</h3>
          <p className="text-sm text-muted">Hruai la, zoom rawh. Square chhunga mi chauh a lang ang.</p>
          <div className="relative mt-4 aspect-square w-full overflow-hidden rounded-2xl bg-black">
            {src && (
              <Cropper
                image={src}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, px) => setArea(px)}
              />
            )}
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="mt-4 w-full accent-[var(--saffron)]"
            aria-label="Zoom"
          />
          {busy && <div className="mt-3"><ProgressBar value={pct} /></div>}
          <div className="mt-4 flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" disabled={busy} onClick={() => setSrc(null)}>
              Sut rawh
            </Button>
            <Button type="button" className="flex-1" disabled={busy || !area} onClick={save}>
              {busy && <Loader2 size={18} className="animate-spin" />} Upload rawh
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
