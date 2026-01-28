// Service Worker për Zenith Vaktia
self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    return self.clients.claim();
});

// Kjo lejon shfaqjen e njoftimit kur dërgohet nga sistemi
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    event.waitUntil(
        self.registration.showNotification(data.title || "Zenith Vaktia", {
            body: data.body || "Është koha e namazit në Ratkoc",
            icon: "Images/604776747_122280490772225847_4370550408157022665_n.jpg",
            badge: "Images/604776747_122280490772225847_4370550408157022665_n.jpg",
            vibrate: [200, 100, 200]
        })
    );
});