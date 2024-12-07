const CACHE_NAME = "fanshawe-market-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/view-products.html",
    "/post-ad.html",
    "/css/styles.css",
    "/js/app.js",
    "/js/firebase.js",
    "/images/icons/icon-192x192.png",
    "/images/icons/icon-512x512.png"
];

// Install Service Worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch Cache First
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Update Cache
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
