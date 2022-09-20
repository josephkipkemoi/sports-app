// Pinaclebet ServiceWorker
import { warmStrategyCache } from 'workbox-recipes';
import { CacheFirst } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

// Set up page cache
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: [
    '/', 
    '/history', 
    '/profile', 
    '/jackpot', 
    '/soccer'
],
  strategy: pageCache,
});

// Set up asset cache
registerRoute(
    ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
    new StaleWhileRevalidate({
      cacheName: 'asset-cache',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    }),
  ); 

  offlineFallback({
    pageFallback: '/offline',
  });
// const cacheName = 'cache-v1'
// // List of files to be precached
// const precachedResources = [    
//                             ]

// // When the service worker is installing, open the cache and add the precache resources to it
// self.addEventListener('install', (e) => {
//     console.log('Service worker install event!')
//     e.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precachedResources)))
// })

// // When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
// self.addEventListener('fetch', (e) => {
//     console.log('Fetch intercepted!')
//     e.respondWith(
//     caches.match(e.request).then((cachedResponse) => {
//         if(cachedResponse) {
//             return cachedResponse
//         }
//             return fetch(e.request)
//         })
//     )
// })






