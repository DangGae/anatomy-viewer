// 서비스 워커: 앱과 모델·데이터 파일을 전부 기기에 저장해 오프라인에서도 열리게 한다.
// 이 파일은 틀이다. `npm run build` 때 vite.config.ts 가 아래 FILES 에 [경로, 내용 해시] 목록을 채워 dist/sw.js 로 쓴다.
//
// - 파일은 "경로?h=해시" 열쇠로 한 캐시에 넣는다. 새 버전에서도 내용이 같은 파일(대부분의 모델)은 다시 받지 않는다.
// - 새 버전은 받아만 두고, 사용자가 "새로고침"을 누르거나 앱을 완전히 닫았다 열 때 적용한다
//   (쓰는 도중에 코드와 데이터가 서로 다른 버전이 되지 않게).
const FILES = [["assets/index-DxFYlqw3.css","412f4600c6"],["assets/index-QXgLviso.js","bfd2985f30"],["data/attachments.json","be6f12765f"],["data/bind_joints.json","eaf2bfbe40"],["data/bones.json","7a688e660c"],["data/desc_bones.json","8cfddefd34"],["data/desc_fascia.json","859fd7ba0c"],["data/desc_joints.json","b7e28bab5a"],["data/desc_muscles.json","6945d12c31"],["data/desc_nerves.json","d09f8dd6ac"],["data/fascia.json","46fe315c89"],["data/joints.json","f6fa383b0d"],["data/landmarks.json","d7289cf7d9"],["data/manifest.json","924848dfcf"],["data/muscles.json","5de1a4f416"],["data/nerves.json","dafeb20de1"],["data/skin_fascia.json","c98ced6206"],["data/skin_muscles.json","3fe5c394a8"],["data/skin_nerves.json","efac90e9ff"],["icons/icon-180.png","5ec119bcfd"],["icons/icon-192.png","41d7f8fe59"],["icons/icon-512.png","36b80dd91c"],["index.html","0aab28aea7"],["manifest.webmanifest","280cd3a0a6"],["models/bones.glb","3bcabb5d3a"],["models/fascia.glb","87ef622773"],["models/joints.glb","7fef7d9a19"],["models/muscles.glb","8aded1efaf"],["models/nerves.glb","1e74bb5724"],["models/skin_fascia.bin","bfad7182ab"],["models/skin_muscles.bin","6085ffa94f"],["models/skin_nerves.bin","9d19e7e90f"]];
const CACHE = 'anatomy-files-v1';
const scope = self.registration.scope;
const keyOf = (path, hash) => `${new URL(path, scope).href}?h=${hash}`;
const KEYS = new Map(FILES.map(([path, hash]) => [new URL(path, scope).href, keyOf(path, hash)]));
KEYS.set(scope, KEYS.get(new URL('index.html', scope).href));

async function tell(msg) {
  for (const c of await self.clients.matchAll({ includeUncontrolled: true })) c.postMessage(msg);
}

async function status() {
  const cache = await caches.open(CACHE);
  const have = new Set((await cache.keys()).map((r) => r.url));
  const keys = [...new Set(KEYS.values())];
  return { type: 'status', done: keys.filter((k) => have.has(k)).length, total: keys.length };
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const have = new Set((await cache.keys()).map((r) => r.url));
      const todo = FILES.filter(([path, hash]) => !have.has(keyOf(path, hash)));
      const total = FILES.length;
      let done = total - todo.length;
      await tell({ type: 'progress', done, total });
      let next = 0;
      const worker = async () => {
        while (next < todo.length) {
          const [path, hash] = todo[next++];
          const res = await fetch(new URL(path, scope).href, { cache: 'no-cache' });
          if (!res.ok) throw new Error(`${path}: ${res.status}`);
          await cache.put(keyOf(path, hash), res);
          await tell({ type: 'progress', done: ++done, total });
        }
      };
      // 하나라도 실패하면 설치가 실패하고, 다음에 앱을 열 때 받지 못한 파일부터 다시 시도한다
      await Promise.all([worker(), worker(), worker(), worker()]);
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const keep = new Set(KEYS.values());
      for (const req of await cache.keys()) if (!keep.has(req.url)) await cache.delete(req);
      for (const name of await caches.keys()) if (name !== CACHE) await caches.delete(name);
      await self.clients.claim();
      await tell(await status());
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
  if (event.data === 'status') event.waitUntil(status().then((s) => event.source && event.source.postMessage(s)));
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const key = req.mode === 'navigate' ? KEYS.get(scope) : KEYS.get(url.origin + url.pathname);
  if (!key) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(key);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok && req.mode !== 'navigate') cache.put(key, res.clone()).catch(() => {});
      return res;
    })(),
  );
});
