const CACHE_NAME = `frc-wave-battery-tracker-v1`;

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      '/BatteryTracking/',
      '/BatteryTracking/index.html',
      '/BatteryTracking/manifest.json',
      '/BatteryTracking/script.js',
      '/BatteryTracking/style.css',
    ]);
  })());
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    try {
      // Try to fetch the resource from the network.
      const fetchResponse = await fetch(event.request);

      // Save the resource in the cache and return it.
      const cache = await caches.open(CACHE_NAME);
      cache.put(event.request, fetchResponse.clone());
      return fetchResponse;
    } catch (e) {
      // If the network request failed, try to get it from the cache.
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      return cachedResponse || new Response('Network error occurred', { status: 408 });
    }
  })());
});