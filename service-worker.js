self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('aqua-track-cache').then(cache => {
    return cache.addAll([
        '/Aqua-Track/',
        '/Aqua-Track/index.html',
        '/Aqua-Track/style.css',
        '/Aqua-Track/script.js',
        '/Aqua-Track/icon-192.png',
        '/Aqua-Track/icon-512.png',
        '/Aqua-Track/service-worker.js'
            ]);
        });
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
