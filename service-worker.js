self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('aqua-track-cache').then(cache => {
            return cache.addAll([
                '/',
                'https://sardy222.github.io/Aqua-Track/',
                '/index.html',
                '/style.css',
                '/script.js',
                '/icon-192.png',
                '/icon-512.png'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
