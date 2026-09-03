const CACHE_NAME = 'myguard-pwa-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Ignore WebSockets, chrome extensions, socket.io and backend API requests
  if (!event.request.url.startsWith('http')) return;
  if (event.request.url.includes('socket.io') || event.request.url.includes('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === 'navigate' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
          const indexHtml = await caches.match('/index.html');
          if (indexHtml) return indexHtml;
        }
        return new Response('Network error', { status: 408, headers: { 'Content-Type': 'text/plain' } });
      })
  );
});
