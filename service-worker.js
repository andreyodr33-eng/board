const CACHE_NAME = "reading-board-v8";

// Основные файлы приложения
const CORE_FILES = [
"./",
"./index.html",
"./manifest.json",
"./piggy.png",
"./actions/icon-32.png",
"./actions/icon-180.png",
"./actions/icon-192.png",
"./actions/icon-512.png"
];

// Изображения действий
const ACTION_FILES = [
"ant", "cap", "cat", "cop", "cut",
"kid", "nap", "pat", "pin", "sit",
"tan", "tap"
].flatMap(name =>
[1, 2, 3].map(number =>
`./actions/${name}_${number}.png`
)
);

// Фонетические звуки
const SOUND_FILES = [
"s", "a", "t", "i", "p", "n", "h", "c",
"k", "e", "r", "m", "d", "g", "o", "u",
"l", "f", "b", "ai", "j", "oa", "ie",
"ee", "or", "z", "w", "ng", "v", "oo",
"oo2", "y", "x", "ch", "sh", "th", "th2",
"qu", "ou", "oi", "ue", "er", "ar"
].map(name => `./sounds/${name}.wav`);

// Все файлы приложения
const ALL_FILES = [
...CORE_FILES,
...ACTION_FILES,
...SOUND_FILES
];

// Установка Service Worker
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async cache => {
                for (const file of ALL_FILES) {
                    try {
                        await cache.add(file);
                    } catch (error) {
                        console.warn("Не удалось сохранить:", file, error);
                    }
                }
            })
            .then(() => self.skipWaiting())
    );
});

// Активация Service Worker
self.addEventListener("activate", event => {

event.waitUntil(
    caches.keys()
        .then(keys => Promise.all(
            keys
                .filter(key =>
                    key.startsWith("reading-board-") &&
                    key !== CACHE_NAME
                )
                .map(key => caches.delete(key))
        ))
        .then(() => self.clients.claim())
);
});

// Обработка запросов, включая частичные запросы аудио Safari
self.addEventListener("fetch", event => {
if (event.request.method !== "GET") return;

event.respondWith(
    caches.open(CACHE_NAME)
        .then(cache => cache.match(event.request))
        .then(response => response || fetch(event.request))
);
});
