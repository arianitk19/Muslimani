const CACHE_NAME = 'pd-professional-v3';
const ICON_URL = 'https://img.icons8.com/external-flat-icons-maxicons/512/external-isla-islamic-flat-flat-icons-maxicons-2.png';

self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(clients.claim());
});

// Sistemi i Njoftimeve STRIKT
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: "Përkujtuesi Ditor", body: "Kohë namazi." };
    
    const options = {
        body: data.body,
        icon: ICON_URL,
        badge: ICON_URL,
        vibrate: [500, 100, 500, 100, 500], // Sistemi Zig-Zag
        tag: 'vakti-pd-strikt',
        renotify: true,
        actions: [
            { action: 'open', title: 'Hap Vaktinë' }
        ]
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow('/index.html'));
});



