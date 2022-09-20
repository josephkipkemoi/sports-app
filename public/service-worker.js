// Pinaclebet ServiceWorker
const cacheName = 'cache-v1'
// List of files to be precached
const precachedResources = [    '/', 
                                '/history?his_tab=sbets&tab=all', 
                                '/history?his_tab=sbets&tab=settled', 
                                '/history?his_tab=sbets&tab=unsettled', 
                                '/history?his_tab=jbets&tab=j_all',
                                '/history?his_tab=jbets&tab=mega_jackpot',
                                '/history?his_tab=jbets&tab=five_jackpot',
                                '/profile', '/jackpot', 
                                '/soccer'
                            ]

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (e) => {
    console.log('Service worker install event!')
    e.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precachedResources)))
})

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (e) => {
    console.log('Fetch intercepted!')
    e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
        if(cachedResponse) {
            return cachedResponse
        }
            return fetch(e.request)
        })
    )
})






