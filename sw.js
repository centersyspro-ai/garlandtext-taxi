// Service Worker para Garland Taxi - Optimizado para GitHub Pages
const CACHE_NAME = 'garland-taxi-v3';
const urlsToCache = [
  '/garlandtext-taxi/',
  '/garlandtext-taxi/index.html',
  '/garlandtext-taxi/styles/main.css',
  '/garlandtext-taxi/assets/js/main.js',
  '/garlandtext-taxi/assets/js/pwa.js',
  '/garlandtext-taxi/assets/js/carousel.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@400;500;700&display=swap'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching archivos');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Instalación completada');
        return self.skipWaiting();
      })
  );
});

// Activar Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eliminando cache antiguo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activación completada');
      return self.clients.claim();
    })
  );
});

// Interceptar solicitudes
self.addEventListener('fetch', event => {
  // Excluir solicitudes de chrome-extension y otras especiales
  if (event.request.url.includes('chrome-extension')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si encontramos en cache, devolver
        if (response) {
          return response;
        }

        // Clonar la solicitud
        const fetchRequest = event.request.clone();

        // Intentar obtener de la red
        return fetch(fetchRequest)
          .then(response => {
            // Verificar respuesta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar respuesta para cache
            const responseToCache = response.clone();

            // Almacenar en cache
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Para solicitudes de navegación, devolver página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/garlandtext-taxi/index.html');
            }
            
            // Para imágenes, devolver placeholder
            if (event.request.url.match(/\.(jpg|jpeg|png|gif)$/)) {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#FFD700"/><text x="200" y="150" font-family="Arial" font-size="24" fill="#000" text-anchor="middle" dominant-baseline="middle">Garland Taxi</text></svg>',
                {
                  headers: { 'Content-Type': 'image/svg+xml' }
                }
              );
            }
          });
      })
  );
});

// Manejar mensajes desde la página principal
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
