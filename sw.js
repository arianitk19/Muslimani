const CACHE_NAME = 'zenith-vaktia-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/Images/604776747_122280490772225847_4370550408157022665_n.jpg',
    'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap'
    // Shto këtu skedarët e tu .css ose .js nëse i ke ndaras
];

// Instalimi: Ruajmë skedarët në Cache
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Aktivizimi: Pastrojmë cache-et e vjetra nëse ndryshon versioni
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
    return self.clients.claim();
});

// Fetch: Shërbejmë skedarët nga Cache nëse jemi offline
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});

// Kontrolli i njoftimeve (Push & Click)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    event.waitUntil(
        self.registration.showNotification(data.title || "Vaktia", {
            body: data.body || "Është koha e namazit",
            icon: "Images/604776747_122280490772225847_4370550408157022665_n.jpg",
            badge: "Images/604776747_122280490772225847_4370550408157022665_n.jpg",
            vibrate: [200, 100, 200],
            tag: 'prayer-alert' // Parandalon njoftimet e shumta të mbivendosura
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            if (clientList.length > 0) return clientList[0].focus();
            return clients.openWindow('/');
        })
    );
});



