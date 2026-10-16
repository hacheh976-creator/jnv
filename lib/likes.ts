"use client";
// One like per browser, remembered in localStorage (best effort).
const KEY = "jnv_likes";

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function hasLiked(id: string) {
  return read().includes(id);
}

export function rememberLike(id: string) {
  try {
    const list = read();
    if (!list.includes(id)) localStorage.setItem(KEY, JSON.stringify([...list, id].slice(-500)));
  } catch {
    /* storage blocked — ignore */
  }
}
