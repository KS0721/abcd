// ========================================
// 올인원 AAC 서비스 워커
//
// 네트워크 우선 전략: 항상 최신 코드를 가져옴
// 오프라인일 때만 캐시 사용
//
// 개선사항 (Beukelman & Light, 2020):
//   - AAC 시스템은 네트워크 상태와 무관하게 안정적으로 동작해야 함
//   - 앱 셸 사전 캐싱으로 오프라인 첫 접속도 지원
//   - activate 시 현재 캐시 보존 (이전 버전만 삭제)
// ========================================

const CACHE_NAME = 'aac-v4.2';

// 앱 셸: 오프라인에서도 최소한 앱이 로드되도록 사전 캐싱
const APP_SHELL = [
  '/abcd/',
  '/abcd/index.html',
];

// 설치 시 앱 셸 사전 캐싱
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// 활성화 시 이전 버전 캐시만 삭제 (현재 버전 보존)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// 요청 처리
self.addEventListener('fetch', event => {
  const req = event.request;

  // HTML 페이지 요청: 네트워크 우선, 실패 시 캐시
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req, { cache: 'no-store' }).catch(() => caches.match(req))
    );
    return;
  }

  // JS/CSS/이미지: 네트워크 우선, 실패 시 캐시
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
