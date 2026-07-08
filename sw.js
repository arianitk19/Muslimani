/* Vakti — Service Worker · Offline-first */
const VERSION = 'vakti-v1.0.1';
const SHELL = [
  './', './index.html', './manifest.webmanifest',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png', './assets/icons/favicon.svg'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k.startsWith('vakti-v') && k !== VERSION).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  // API e Kuranit: cache-first e përhershme (menaxhohet nga faqja)
  if (url.hostname === 'api.alquran.cloud') {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        if (res.ok) caches.open('vakti-quran-v1').then(c => c.put(e.request, res.clone()));
        return res.clone();
      }))
    );
    return;
  }

  // Fontet & thumbnails: stale-while-revalidate
  if (url.hostname.includes('fonts.g') || url.hostname === 'i.ytimg.com') {
    e.respondWith(
      caches.open('vakti-ext-v1').then(async c => {
        const hit = await c.match(e.request);
        const net = fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  // Shell lokal: cache-first me rifreskim në sfond
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true }).then(hit => {
        const net = fetch(e.request).then(res => {
          if (res.ok) caches.open(VERSION).then(c => c.put(e.request, res.clone()));
          return res;
        }).catch(() => hit || caches.match('./index.html'));
        return hit || net;
      })
    );
  }
});
