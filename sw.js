const CACHE = "satishjhanwer-v1792562537021";
const OFFLINE_URL = "/offline.html";
const MATCH = { ignoreVary: true };

async function precache() {
  const cache = await caches.open(CACHE);
  await cache.addAll([OFFLINE_URL, "/favicon.svg", "/manifest.json"]);
  const res = await fetch("/", { cache: "no-cache" });
  await cache.put("/", res.clone());
  const html = await res.text();
  const assets = [
    ...new Set(
      [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]),
    ),
  ];
  await cache.addAll(assets);
}

self.addEventListener("install", (e) => {
  e.waitUntil(precache());
});

self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }
  if (e.data?.type === "CACHE_URLS" && Array.isArray(e.data.urls)) {
    const urls = e.data.urls.filter(
      (u) => typeof u === "string" && u.startsWith("/assets/"),
    );
    e.waitUntil(
      caches.open(CACHE).then((cache) =>
        Promise.all(
          urls.map((u) =>
            cache
              .match(u, MATCH)
              .then((hit) => hit || cache.add(u))
              .catch(() => undefined),
          ),
        ),
      ),
    );
  }
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, resClone));
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE);
          return (
            (await cache.match(e.request, { ...MATCH, ignoreSearch: true })) ??
            (url.pathname === "/" || url.pathname === "/index.html"
              ? await cache.match("/", MATCH)
              : undefined) ??
            (await cache.match(OFFLINE_URL, MATCH))
          );
        }),
    );
    return;
  }

  if (url.pathname.startsWith("/assets/")) {
    e.respondWith(
      caches.match(e.request, MATCH).then(
        (cached) =>
          cached ||
          fetch(e.request).then((res) => {
            const resClone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, resClone));
            return res;
          }),
      ),
    );
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, resClone));
        return res;
      })
      .catch(() => caches.match(e.request, MATCH)),
  );
});
