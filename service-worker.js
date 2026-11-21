const APP_CACHE = 'reading-board-v3';

const APP_FILES = [ 
    "./", 
    "./index.html",
    "./manifest.json",
    "./piggy.png",
    "./actions/icon-32.png",
    "./actions/icon-180.png",
    "./actions/icon-192.png",
    "./actions/icon-512.png",

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
     "./actions/cop_1.png",
     "./actions/cop_2.png",
     "./actions/cop_3.png", 
     "./actions/cut_1.png",
     "./actions/cut_2.png",
     "./actions/cut_3.png",
     "./actions/kid_1.png",
     "./actions/kid_2.png",
     "./actions/kid_3.png",
     "./actions/nap_1.png",
     "./actions/nap_2.png",
     "./actions/nap_3.png",
     "./actions/pat_1.png",
     "./actions/pat_2.png",
     "./actions/pat_3.png",
     "./actions/pin_1.png",
     "./actions/pin_2.png",
     "./actions/pin_3.png",
     "./actions/sit_3.png",
     "./actions/sit_2.png",
     "./actions/sit_1.png",
     "./actions/tan_1.png",
     "./actions/tan_2.png",
     "./actions/tan_3.png",
     "./actions/tap_1.png",
     "./actions/tap_2.png",
     "./actions/tap_3.png",
  // Звуковые файлы
   "./sounds/s.wav",
   "./sounds/a.wav",
   "./sounds/t.wav",
    "./sounds/i.wav",
    "./sounds/p.wav",
    "./sounds/n.wav",
    "./sounds/h.wav",
   "./sounds/c.wav",
    "./sounds/k.wav",
    "./sounds/e.wav",
    "./sounds/r.wav",
    "./sounds/m.wav",
   "./sounds/d.wav",
    "./sounds/g.wav",
    "./sounds/o.wav",
    "./sounds/u.wav",
    "./sounds/l.wav",
    "./sounds/f.wav",
    "./sounds/b.wav",
    "./sounds/ai.wav",
    "./sounds/j.wav",
    "./sounds/oa.wav",
    "./sounds/ie.wav",
    "./sounds/ee.wav",
    "./sounds/or.wav",
    "./sounds/z.wav",
    "./sounds/w.wav",
    "./sounds/ng.wav",
    "./sounds/v.wav",
    "./sounds/oo.wav",
    "./sounds/oo2.wav",
    "./sounds/y.wav",
    "./sounds/x.wav",
    "./sounds/ch.wav",
    "./sounds/sh.wav",
    "./sounds/th.wav",
    "./sounds/th2.wav",
    "./sounds/qu.wav",
    "./sounds/ou.wav",
    "./sounds/oi.wav",
    "./sounds/ue.wav",
    "./sounds/er.wav",
    "./sounds/ar.wav"
     
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
    caches.match(event.request.url.split("?")[0])
    .then(cachedResponse => {

        if (cachedResponse) {
            return cachedResponse;
        }

        return fetch(event.request);
    })
);
});
