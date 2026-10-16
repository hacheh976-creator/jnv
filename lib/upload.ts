"use client";
import { createUploadTarget } from "@/lib/actions/admin";

type Ext = "webp" | "png" | "jpg" | "mp3" | "m4a" | "aac" | "wav";

/** Uploads straight from the browser to Supabase Storage with progress. */
export async function uploadFile(
  bucket: "covers" | "audio",
  file: Blob,
  ext: Ext,
  folder = "misc",
  onProgress?: (pct: number) => void,
): Promise<string> {
  const target = await createUploadTarget({ bucket, ext, folder });
  if (!target.ok) throw new Error(target.error);
  const form = new FormData();
  form.append("cacheControl", "31536000");
  form.append("", file);
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", target.data.signedUrl);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`Upload a hlawhchham (${xhr.status})`)));
    xhr.onerror = () => reject(new Error("Upload a hlawhchham — internet en rawh"));
    xhr.send(form);
  });
  onProgress?.(100);
  return target.data.publicUrl;
}

export function audioExt(file: File): Ext | null {
  const n = file.name.toLowerCase();
  if (n.endsWith(".mp3")) return "mp3";
  if (n.endsWith(".m4a") || n.endsWith(".mp4")) return "m4a";
  if (n.endsWith(".aac")) return "aac";
  if (n.endsWith(".wav")) return "wav";
  return null;
}

export function readDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const a = document.createElement("audio");
    const url = URL.createObjectURL(file);
    a.preload = "metadata";
    a.onloadedmetadata = () => {
      resolve(Number.isFinite(a.duration) ? Math.round(a.duration) : 0);
      URL.revokeObjectURL(url);
    };
    a.onerror = () => {
      resolve(0);
      URL.revokeObjectURL(url);
    };
    a.src = url;
  });
}

export function titleFromFile(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
