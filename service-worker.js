// Set a name for the current cache
const cacheName = 'v1';

// Default files to always cache
const cacheFiles = ['/index.html', '/app.js', '/images/manifest-icon-512.maskable.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
