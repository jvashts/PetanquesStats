const CACHE = 'petanque-v3';

/** URLs absolues sous le scope du SW (indispensable sur GitHub Pages : /repo-name/...) */
function asset(path) {
  return new URL(path, self.registration.scope).href;
}

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll([
        asset('index.html'),
        asset('styles.css'),
        asset('app.js'),
        asset('manifest.json'),
        asset('icons/icon-192.png'),
        asset('icons/icon-512.png')
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (k) { return k !== CACHE; })
          .map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  e.respondWith(
    caches.match(req).then(function (r) {
      return (
        r ||
        fetch(req).catch(function () {
          return caches.match(asset('index.html'));
        })
      );
    })
  );
});
