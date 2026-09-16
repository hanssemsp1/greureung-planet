/* 그르릉 행성 — 홈 화면 앱용 저장 장치 (1단계 PWA, 9/16)
   · html·js 는 「인터넷 먼저」 — 새로 올린 게 바로 보이고, 끊겼을 땐 저장본
   · 그림·영상은 「저장본 먼저」 — 두 번째부터 로딩 없이, 없을 때만 받아서 저장 */
const CACHE = "greureung-v2";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  const code = req.mode === "navigate" || req.destination === "document" || req.destination === "script" || /.(html|js|webmanifest)$/.test(url.pathname) || url.pathname.endsWith("/");
  if (code) {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put(req, c)); return r; })
                             .catch(() => caches.match(req, { ignoreSearch: true })));
  } else {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok && (r.type === "basic")) { const c = r.clone(); caches.open(CACHE).then(k => k.put(req, c)); }
      return r; })));
  }
});
