"use client";

export type Area = { x: number; y: number; width: number; height: number };

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Thlalak hawn theih a ni lo"));
    img.src = src;
  });
}

function toBlob(canvas: HTMLCanvasElement, quality = 0.85) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Thlalak siam a hlawhchham"))), "image/webp", quality),
  );
}

/** Crops the image and returns 512px + 256px square WebP blobs and an accent colour. */
export async function cropSquare(src: string, area: Area) {
  const img = await loadImage(src);
  const make = async (size: number) => {
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d")!;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, size, size);
    return c;
  };
  const big = await make(512);
  const small = await make(256);
  return { big: await toBlob(big), small: await toBlob(small, 0.8), accent: accentFrom(big) };
}

/** Picks a vivid colour: average of the most saturated pixels. */
export function accentFrom(canvas: HTMLCanvasElement) {
  const c = document.createElement("canvas");
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(canvas, 0, 0, 32, 32);
  const { data } = ctx.getImageData(0, 0, 32, 32);
  const px: { r: number; g: number; b: number; s: number }[] = [];
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (l < 40 || l > 230) continue;
    px.push({ r, g, b, s: (max - min) / (255 - Math.abs(max + min - 255) || 1) });
  }
  if (!px.length) return "#F7931E";
  px.sort((a, b) => b.s - a.s);
  const top = px.slice(0, Math.max(8, Math.floor(px.length * 0.15)));
  const avg = (k: "r" | "g" | "b") => Math.round(top.reduce((s, p) => s + p[k], 0) / top.length);
  return "#" + [avg("r"), avg("g"), avg("b")].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}
