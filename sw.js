// صلاتي — Service Worker v1
// يتيح عمل التطبيق بدون إنترنت بعد أول تحميل

const CACHE = 'salati-v1';
const ASSETS = [
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Tajawal:wght@300;400;500;700&family=Lato:wght@300;400;700&display=swap'
];

// تثبيت: تخزين الملفات
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

// تفعيل: حذف الكاش القديم
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// الاعتراض: الرد من الكاش أو الشبكة
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return response;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
