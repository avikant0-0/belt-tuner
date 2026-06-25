const CACHE_NAME = 'belt-tuner-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/about/',
  '/contact/',
  '/terms/',
  '/privacy/',
  '/submit/',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use catch() to avoid failure if some pages aren't built yet during dev
      return cache.addAll(ASSETS_TO_CACHE).catch(err => console.warn('Cache install partial:', err));
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request).then((fetchRes) => {
        // Optional: Dynamically cache new assets like CSS/JS bundles
        return caches.open(CACHE_NAME).then((cache) => {
          // Don't cache opaque responses or non-200s
          if (fetchRes.status === 200 && fetchRes.type === 'basic') {
            cache.put(event.request, fetchRes.clone());
          }
          return fetchRes;
        });
      });
    }).catch(() => {
      // Fallback if offline and not in cache
      return caches.match('/');
    })
  );
});
