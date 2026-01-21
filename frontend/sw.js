const CACHE_NAME = 'aac-v2.0.0';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/data.js',
    '/js/main.js',
    '/js/speak.js',
    '/js/history.js',
    '/js/search.js',
    '/js/settings.js',
    '/js/modals.js',
    '/manifest.json'
];

// 설치
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// 활성화
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// 요청 처리
self.addEventListener('fetch', (event) => {
    // API는 네트워크 우선
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response(JSON.stringify({ 
                    success: false, 
                    error: '오프라인' 
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }

    // 정적 자원은 캐시 우선
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});