const CACHE_NAME = 'ikhtiarqu-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'image_f6ff9c.png' // Masukkan nama fail gambar background cream anda jika ada
];

// Proses Instalasi Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Proses Aktivasi & Pembersihan Cache Lama
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Strategi Fetch (Network First, Fallback to Cache) agar data GSheet tetap realtime
self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('script.google.com') || e.request.url.includes('alquran.cloud')) {
    // Jangan cache data realtime dari GSheet atau API Al-Quran
    return fetch(e.request);
  }
  
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
