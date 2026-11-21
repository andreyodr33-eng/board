const APP_CACHE = 'Reading Board-v1';

const APP_FILES = [ 
    "./", 
    "./index.html",
    "./manifest.json",
    "./piggy.png",
    "./actions/icon-32.png",
    "./actions/icon-180.png",
    "./actions/icon-192.png",
    "./actions/icon-512.png"

// Изображения действий
"./actions/ant_1.png",
"./actions/ant_2.png",
"./actions/ant_3.png",
"./actions/cap_1.png",
"./actions/cap_2.png",
"./actions/cap_3.png",
"./actions/cat_1.png",
"./actions/cat_2.png",
"./actions/cat_3.png",

// Звуковые файлы
"./sounds/a.wav",
"./sounds/b.wav",
"./sounds/c.wav",
"./sounds/d.wav",
"./sounds/e.wav",
"./sounds/h.wav"
];

// Установка Service Worker
self.addEventListener("install", event => {
event.waitUntil(
caches.open(APP_CACHE)
.then(cache => cache.addAll(APP_FILES))
.then(() => self.skipWaiting())
);
});

// Активация и удаление старых кэшей
self.addEventListener("activate", event => {
event.waitUntil(
caches.keys()
.then(keys =>
Promise.all(
keys
.filter(key => key !== APP_CACHE)
.map(key => caches.delete(key))
)
)
.then(() => self.clients.claim())
);
});

// Обработка запросов
self.addEventListener("fetch", event => {
if (event.request.method !== "GET") return;

event.respondWith(
caches.match(event.request)
.then(cachedResponse => {
if (cachedResponse) {
return cachedResponse;
}

    return fetch(event.request);
  })
);
});
