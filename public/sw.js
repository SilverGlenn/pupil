/* The production build injects a content-hashed version and every emitted chunk. */
const VERSION = '__PUPIL_BUILD__';
const PRECACHE = self.__PUPIL_PRECACHE__ || [];
const SHELL = `pupil-shell-${VERSION}`;
const DATA = `pupil-data-${VERSION}`;
self.addEventListener('install', event => {
  // Updates wait until old tabs close, keeping their old index and lazy chunks paired.
  event.waitUntil(caches.open(SHELL).then(cache => cache.addAll(PRECACHE)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => (key.startsWith('pupil-shell-') || key.startsWith('pupil-data-')) && key !== SHELL && key !== DATA).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('.json') && url.pathname !== '/manifest.json') {
    event.respondWith(caches.open(DATA).then(async cache => {
      const cached = await cache.match(request);
      const update = fetch(request).then(response => { if (response.ok) cache.put(request, response.clone()); return response; });
      event.waitUntil(update.catch(() => {}));
      return cached || update;
    }));
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(caches.open(SHELL).then(async cache => (await cache.match('/index.html')) || fetch(request).catch(async () => (await cache.match('/offline.html')) || Response.error())));
    return;
  }
  // Never mix an old index with new chunks. Only this version's shell is read.
  event.respondWith(caches.open(SHELL).then(async cache => (await cache.match(request, {ignoreVary: true})) || fetch(request)));
});
