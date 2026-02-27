// 올인원 AAC 서비스 워커
// 네트워크 우선 전략: 항상 최신 코드를 가져옴
// 오프라인일 때만 캐시 사용

const CACHE_NAME = 'aac-1772189356401';

// 설치 즉시 활성화 (대기 없이 즉시 교체)
self.addEventListener('install', () => self.skipWaiting());

// 활성화 시 이전 버전 캐시 전부 삭제 + 즉시 제어 시작
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => {
        // 모든 클라이언트에게 새 버전 알림 → 자동 새로고침
        self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
        });
      })
  );
});

// 요청 처리
self.addEventListener('fetch', event => {
  const req = event.request;

  // HTML 페이지 요청: 무조건 네트워크에서 가져옴
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req, { cache: 'no-store' }).catch(() => caches.match(req))
    );
    return;
  }

  // chrome-extension:// 등 비표준 scheme은 캐시 불가 → 스킵
  if (!req.url.startsWith('http')) return;

  // ARASAAC 이미지: 캐시 우선 (한 번 받으면 네트워크 요청 없음)
  if (req.url.includes('static.arasaac.org')) {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
          return res;
        });
      })
    );
    return;
  }

  // JS/CSS/앱 파일: 네트워크 우선, 실패 시 캐시
  event.respondWith(
    fetch(req)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, clone));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
