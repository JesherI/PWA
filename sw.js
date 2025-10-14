// Estructura basica de un Service Worker

// 1.Nombre del cache y archivos a cachear
const CACHE_NAME = "mi-cahce-v1";
const urlsToCache = ["index.html", "offline.html", "./icons/icon-192x192.png","./icons/icon-512x512.png" ];

// 2.INSTALL -> se ejecuta al instalar el SW
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// 3.ACTIVATE -> se ejecuta al activarse (Limpia cache viejas)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
});

// 4. FETCH -> intercepta peticiones de la app
// Intercepta cada petición de la PWA
// Buscar primero en caché
// Si no está, busca en Internet
// En caso de falla, muestra la página offline.html
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});
  