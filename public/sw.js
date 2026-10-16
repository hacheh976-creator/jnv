/* JNV Studio service worker — hand written, no build step. */
const VERSION = "v1";
const STATIC = `static-${VERSION}`;
const PAGES = `pages-${VERSION}`;
const GAMES = `games-${VERSION}`;
const IMAGES = `images-${VERSION}`;
const PRECACHE = ["/offline.html", "/logo-160.webp", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  const keep = [STATIC, PAGES, GAMES, IMAGES];
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await Promise.race([fetch(request), timeout(4000)]);
    if (res.ok) {
      cache.put(request, res.clone());
      trim(cacheName, 60);
    }
    return res;
  } catch {
    const hit = await cache.match(request);
    if (hit) return hit;
    return (await caches.match("/offline.html")) || Response.error();
  }
}

async function staleWhileRevalidate(request, cacheName, max) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  const net = fetch(request)
    .then((res) => {
      if (res.ok) {
        cache.put(request, res.clone());
        trim(cacheName, max);
      }
      return res;
    })
    .catch(() => hit);
  return hit || net;
}

async function cacheFirst(request, cacheName, max) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok || res.type === "opaque") {
    cache.put(request, res.clone());
    trim(cacheName, max);
  }
  return res;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // never touch admin, api, or audio streaming (range requests)
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api")) return;
  if (request.headers.has("range") || url.pathname.includes("/object/public/audio/")) return;

  if (url.origin === self.location.origin) {
    if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
      event.respondWith(cacheFirst(request, STATIC, 200));
      return;
    }
    if (url.pathname.startsWith("/g/")) {
      event.respondWith(staleWhileRevalidate(request, GAMES, 80));
      return;
    }
    if (request.mode === "navigate") {
      event.respondWith(networkFirst(request, PAGES));
      return;
    }
    return;
  }

  // Supabase cover images
  if (url.pathname.includes("/storage/v1/object/public/covers/")) {
    event.respondWith(cacheFirst(request, IMAGES, 300));
  }
});
