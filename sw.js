const CACHE_NAME = 'pd-professional-v3';
const ICON_URL = 'https://img.icons8.com/external-flat-icons-maxicons/512/external-isla-islamic-flat-flat-icons-maxicons-2.png';

// Dokumentet që do të ruhen në memorien e telefonit (Offline)
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/info.html',
    '/lutje.html',
    '/kibla.html'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (e) => {
    // Fshin caches e vjetra nëse ndryshon versioni (v3 -> v4 etj)
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if (key !== CACHE_NAME) return caches.delete(key);
            }));
        })
    );
    return self.clients.claim();
});

// Strategjia: Shërbe nga Cache, por përditëso në background (Stale-while-revalidate)
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});

// Sistemi i Njoftimeve STRIKT
self.addEventListener('push', (event) => {
    let data = { title: "Përkujtuesi Ditor", body: "Ka hyrë koha e namazit." };
    
    try {
        if (event.data) {
            data = event.data.json();
        }
    } catch (e) {
        data.body = event.data.text();
    }
    
    const options = {
        body: data.body,
        icon: ICON_URL,
        badge: ICON_URL,
        vibrate: [500, 100, 500, 100, 500], 
        tag: 'vakti-pd-strikt',
        renotify: true,
        data: { url: '/index.html' },
        actions: [
            { action: 'open', title: 'Hap Vaktinë' }
        ]
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // Hap faqen nëse nuk është e hapur, ose fokusoje nëse është aktive
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return clients.openWindow(event.notification.data.url);
        })
    );
});
