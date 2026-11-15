/* Service Worker - Licencia Clase B CONASET 2026 */
const SHELL_CACHE = "claseb-shell-v2";
const MEDIA_CACHE = "claseb-media-v2";

const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./questions-db.js",
  "./manifest.webmanifest",
  "./assets/diagrams/pt_102_zona_curvas.svg",
  "./assets/diagrams/pt_106_paso_peatones.svg",
  "./assets/diagrams/pt_132_viraje_ciclovia.svg",
  "./assets/diagrams/pt_142_fin_prohibicion_adelantar.svg",
  "./assets/diagrams/pt_151_interseccion_abc.svg",
  "./assets/diagrams/pt_48_retorno_autopista.svg",
  "./assets/diagrams/pt_83_estacionado_izquierda.svg",
  "./assets/icons/apple-touch-icon-180.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png",
  "./assets/icons/icon.svg",
  "./assets/pdf-images/pdf-007-vec.png",
  "./assets/pdf-images/pdf-009-vec.png",
  "./assets/pdf-images/pdf-011-003.png",
  "./assets/pdf-images/pdf-014-013.png",
  "./assets/pdf-images/pdf-019-023.png",
  "./assets/pdf-images/pdf-020-025.png",
  "./assets/pdf-images/pdf-021-042.png",
  "./assets/pdf-images/pdf-024-047.png",
  "./assets/pdf-images/pdf-025-049.png",
  "./assets/pdf-images/pdf-026-051.png",
  "./assets/pdf-images/pdf-027-053.png",
  "./assets/pdf-images/pdf-030-070.png",
  "./assets/pdf-images/pdf-031-071.png",
  "./assets/pdf-images/pdf-034-vec.png",
  "./assets/pdf-images/pdf-038-073.png",
  "./assets/pdf-images/pdf-043-076.png",
  "./assets/pdf-images/pdf-044-078.png",
  "./assets/pdf-images/pdf-050-table.png",
  "./assets/pdf-images/pdf-050-vec.png",
  "./assets/pdf-images/pdf-052-080.png",
  "./assets/pdf-images/pdf-071-082.png",
  "./assets/pdf-images/pdf-072-083.png",
  "./assets/pdf-images/pdf-074-091.png",
  "./assets/pdf-images/pdf-075-096.png",
  "./assets/pdf-images/pdf-075-097.png",
  "./assets/pdf-images/pdf-077-109.png",
  "./assets/pdf-images/pdf-079-117.png",
  "./assets/pdf-images/pdf-079-121.png",
  "./assets/pdf-images/pdf-082-163.png",
  "./assets/pdf-images/pdf-082-168.png",
  "./assets/pdf-images/pdf-083-169.png",
  "./assets/pdf-images/pdf-083-170.png",
  "./assets/pdf-images/pdf-083-171.png",
  "./assets/pdf-images/pdf-083-173.png",
  "./assets/pdf-images/pdf-084-176.png",
  "./assets/pdf-images/pdf-086-186.png",
  "./assets/pdf-images/pdf-088-189.png",
  "./assets/pdf-images/pdf-089-190.png",
  "./assets/pdf-images/pdf-090-192.png",
  "./assets/pdf-images/pdf-092-195.png",
  "./assets/pdf-images/pdf-092-197.png",
  "./assets/pdf-images/pdf-093-203.png",
  "./assets/pdf-images/pdf-094-204.png",
  "./assets/pdf-images/pdf-094-206.png",
  "./assets/pdf-images/pdf-095-210.png",
  "./assets/pdf-images/pdf-097-vec.png",
  "./assets/pdf-images/pdf-102-223.png",
  "./assets/pdf-images/pdf-105-229.png",
  "./assets/pdf-images/pdf-106-239.png",
  "./assets/pdf-images/pdf-110-246.png",
  "./assets/pdf-images/pdf-111-249.png",
  "./assets/pdf-images/pdf-114-258.png",
  "./assets/pdf-images/pdf-115-259.png",
  "./assets/pdf-images/pdf-116-261.png",
  "./assets/pdf-images/pdf-118-262.png",
  "./assets/pdf-images/pdf-129-269.png",
  "./assets/pdf-images/pdf-131-272.png",
  "./assets/pdf-images/pdf-132-276.png",
  "./assets/pdf-images/pdf-137-284.png",
  "./assets/pdf-images/pdf-138-288.png",
  "./assets/pdf-images/pdf-146-290.png",
  "./assets/pdf-images/pdf-147-295.png",
  "./assets/pdf-images/pdf-148-301.png",
  "./assets/pdf-images/pdf-151-333.png",
  "./assets/pdf-images/pdf-153-415.png",
  "./assets/pdf-images/pdf-168-685.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== MEDIA_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

function isExternalMediaOrFont(url) {
  return (
    url.hostname.includes("practicatest.cl") ||
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com")
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // Navigation requests (SPA routes, shortcuts like ./?view=exam, offline fallback)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put("./index.html", copy));
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(SHELL_CACHE);
          return (
            (await cache.match("./index.html")) ||
            (await cache.match("./")) ||
            Response.error()
          );
        })
    );
    return;
  }

  // External fonts / PracticaTest sign images / local heavy PDF -> runtime cache
  if (
    isExternalMediaOrFont(url) ||
    (url.origin === self.location.origin && url.pathname.endsWith(".pdf"))
  ) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const networkPromise = fetch(request)
          .then((response) => {
            if (response && (response.ok || response.type === "opaque")) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => null);
        return cached || (await networkPromise) || Response.error();
      })
    );
    return;
  }

  // Same-origin static assets (Stale-While-Revalidate + cache fallback)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(SHELL_CACHE).then(async (cache) => {
        const cached =
          (await cache.match(request)) ||
          (await cache.match(request, { ignoreSearch: true }));

        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => null);

        if (cached) {
          event.waitUntil(networkFetch);
          return cached;
        }
        return (await networkFetch) || Response.error();
      })
    );
  }
});
