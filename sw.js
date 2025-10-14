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

// 4.FETCH -> se ejecuta cada vez que se haga una petición al servidor
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .catch(() => {
            // Si la petición falla (sin conexión), devolvemos la página offline
            if (event.request.mode === 'navigate') {
              return caches.match('offline.html');
            }
            // Para recursos que no son páginas HTML, podemos devolver un placeholder o simplemente fallar
            return new Response('Sin conexión a Internet', {
              status: 503,
              statusText: 'Sin conexión a Internet'
            });
          });
      })
  );
});
  