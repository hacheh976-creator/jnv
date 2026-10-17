export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function slugify(input: string) {
  const base = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || "item";
}

export function randomSuffix(n = 4) {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let s = "";
  const bytes = crypto.getRandomValues(new Uint8Array(n));
  for (const b of bytes) s += chars[b % chars.length];
  return s;
}

export function formatDuration(sec: number) {
  if (!sec || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatCount(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export function classLabel(c: number | null | undefined) {
  return c ? `Class ${c}` : "";
}

/** "Mawia" + 8 → "Mawia · Class 8" */
export function byline(creators?: string | null, cls?: number | null | undefined) {
  return [creators, classLabel(cls)].filter(Boolean).join(" · ");
}

export function isDevanagari(text: string) {
  return /[ऀ-ॿ]/.test(text);
}
