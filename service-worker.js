const CACHE_NAME = "reading-board-v6";

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
        .then(cache => cache.addAll(ALL_FILES))
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

if (event.request.method !== "GET") {
    return;
}

event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {

        // Ищем полный файл в кэше без заголовка Range
        const cached = await cache.match(
            new Request(event.request.url)
        );

        if (!cached) {
            return fetch(event.request);
        }

        const range = event.request.headers.get("Range");

        // Если запрос обычный, отдаём файл целиком
        if (!range) {
            return cached;
        }

        // Если Safari запросил часть аудиофайла
        const buffer = await cached.arrayBuffer();
        const size = buffer.byteLength;

        const match = range.match(/bytes=(\d*)-(\d*)/);

        if (!match) {
            return cached;
        }

        let start;
        let end;

        if (match[1] === "") {
            const suffixLength = Number(match[2]);
            start = Math.max(size - suffixLength, 0);
            end = size - 1;
        } else {
            start = Number(match[1]);
            end = match[2] === ""
                ? size - 1
                : Math.min(Number(match[2]), size - 1);
        }

        if (start >= size || start > end) {
            return new Response(null, {
                status: 416,
                headers: {
                    "Content-Range": `bytes */${size}`
                }
            });
        }

        const headers = new Headers(cached.headers);
        headers.set("Accept-Ranges", "bytes");
        headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
        headers.set("Content-Length", String(end - start + 1));

        return new Response(
            buffer.slice(start, end + 1),
            {
                status: 206,
                statusText: "Partial Content",
                headers
            }
        );
     })
  );
});
