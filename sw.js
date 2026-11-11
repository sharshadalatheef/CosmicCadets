// CosmicCadets Service Worker - Offline Space Training PWA (v3.0 - Network-First)
const CACHE_NAME = 'cosmiccadets-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html?v=3.0',
  '/manifest.json',
  '/favicon.svg',
  '/css/style.css?v=3.0',
  '/js/core.js?v=3.0',
  '/js/icons.js?v=3.0',
  '/js/audio.js?v=3.0',
  '/js/storage.js?v=3.0',
  '/js/daily.js?v=3.0',
  '/js/tutorial.js?v=3.0',
  '/js/app.js?v=3.0',
  '/js/games/blaster.js?v=3.0',
  '/js/games/collector.js?v=3.0',
  '/js/games/dodge.js?v=3.0',
  '/js/games/gyro.js?v=3.0',
  '/js/games/gforce.js?v=3.0',
  '/js/games/memory.js?v=3.0'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('PWA: Pre-cache completed with minor warnings', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('PWA: Purging outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass API calls so leaderboard and dynamic server requests are always fresh
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ ok: false, offline: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Network-First strategy: Always fetch newest code first; fall back to cache when offline
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html?v=3.0') || caches.match('/');
          }
        });
      })
  );
});
