const APP_NAME = 'logo-code-editor';
const CACHE_NAME = `${APP_NAME}-v1`;
const urlsToCache = [
  `${APP_NAME}/`,
  `${APP_NAME}/index.html`,
  `${APP_NAME}/js/libs/p5/p5.min.js`,
  `${APP_NAME}/js/libs/p5/p5.dom.min.js`,
  `${APP_NAME}/js/sketch.js`,
  `${APP_NAME}/js/turtle.js`,
  `${APP_NAME}/js/swhelper.js`,
  `${APP_NAME}/css/main.css`,
  `${APP_NAME}/assets/offline/offline_examples.json`,
  `${APP_NAME}/assets/offline/offline_logocode.json`
];

// use this version if served not on GitHub Pages
// const urlsToCache = [
//   '/',
//   '/index.html',
//   '/js/libs/p5/p5.min.js',
//   '/js/libs/p5/p5.dom.min.js',
//   '/js/sketch.js',
//   '/js/turtle.js',
//   '/js/swhelper.js',
//   '/css/main.css',
//   '/assets/offline/offline_examples.json',
//   '/assets/offline/offline_logocode.json'
// ];

// Perform install steps
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});


// Respond with cached resources
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((request) => {
      return request || fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch((error) => {
        if (event.request.url.split('?')[0].endsWith('.logocode')) {
          return caches.match('/assets/offline/offline_logocode.json');
        } else if (event.request.url.endsWith('/examples')) {
          return caches.match('/assets/offline/offline_examples.json');
        }
      });
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      let cacheWhitelist = keyList.filter((key) => {
        return key.indexOf(APP_NAME)
      })
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME);

      return Promise.all(keyList.map((key, i) => {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log(`deleting cache: ${keyList[i]}`)
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})