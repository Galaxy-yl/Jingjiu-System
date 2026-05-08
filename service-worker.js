const CACHE_NAME = 'mian1-pwa-v3';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/peisong.html',
  '/manifest.json',
  '/icon.png',
  '/css/app-shell.css',
  '/js/mian1-shared.js',
  '/js/pwa-bootstrap.js',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return Promise.allSettled(
          PRECACHE_URLS.map(function (u) {
            return cache.add(u).catch(function () {});
          })
        );
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (names) {
        return Promise.all(
          names.map(function (name) {
            if (name !== CACHE_NAME) return caches.delete(name);
          })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', function (event) {
  var url = event.request.url;
  if (url.indexOf('/api/') !== -1) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).catch(function () {
        return caches.match('/index.html');
      });
    })
  );
});
