# Vakti — Platforma islame për Kosovën

Aplikacion PWA me kohët e namazit **sipas Takvimit zyrtar të Bashkësisë Islame të Kosovës (BIK)**, Kuran me përkthim shqip, lutje, Kiblë, ligjërata dhe kalendar islam. Offline-first, pa llogari, pa gjurmim.

## Përdorimi
- **Lokalisht:** hape `index.html` me dy klikime — funksionon direkt, gjithçka është në një skedar.
- **Online:** tërhiqe krejt folderin te https://app.netlify.com/drop — merr HTTPS, instalim në telefon, njoftimet, Kiblën me GPS dhe offline të plotë.

## Të dhënat e orareve
Dataset 365-ditor nga Takvimi zyrtar i BIK-ut (burimi: github.com/drilonjaha/kohet-e-namazit-kosove-json, MIT), i normalizuar në orë standarde me DST automatike dhe diferencat zyrtare për 26 qytete. I saktë çdo vit, 100% offline.

## Struktura
```
vakti.app/
├── index.html            # Aplikacioni i plotë (CSS + JS inline, funksionon kudo)
├── manifest.webmanifest  # PWA: ikona maskable + shortcuts
├── sw.js                 # Offline-first service worker
└── assets/icons/         # Ikonat e aplikacionit
```

Për App Store / Google Play paketohet me PWABuilder (pwabuilder.com) pa asnjë ndryshim kodi.

— BuiltByNiti
