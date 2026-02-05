const CACHE_NAME = 'zenith-vaktia-v1';
const ASSETS = [
  '/',
  '/index.html',
  // Shto këtu skedarët tjerë kryesorë nëse dëshiron që të punojnë pa internet
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
        })
    );
    return self.clients.claim();
});

// Përmirësimi i Push: Shton mundësinë për të dërguar URL specifike
self.addEventListener('push', (event) => {
    let data = {};
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data = { title: "Vaktia Ratkoc", body: event.data.text() };
        }
    }

    event.waitUntil(
        self.registration.showNotification(data.title || "Vaktia Ratkoc", {
            body: data.body || "Është koha e namazit",
            icon: "Images/604776747_122280490772225847_4370550408157022665_n.jpg",
            badge: "Images/604776747_122280490772225847_4370550408157022665_n.jpg",
            vibrate: [200, 100, 200],
            data: { url: data.url || '/' } // Ruajmë URL-në këtu
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const urlToOpen = event.notification.data.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // Nëse aplikacioni është i hapur, thjesht fokusoje atë
            for (let client of windowClients) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // Nëse nuk është i hapur, hape një dritare të re
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});





