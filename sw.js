const CACHE_NAME = 'orcaobra-v23'; 
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', event => {
  // Comando 1: Força o novo app a furar a fila e instalar agora mesmo
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            // Comando 2: Apaga a versão antiga da memória do celular do cliente
            return caches.delete(cacheName); 
          }
        })
      );
    }).then(() => self.clients.claim()) // Comando 3: Assume o controle da tela
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
