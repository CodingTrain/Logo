const APP_NAME = 'logo-code-editor';
const CACHE_NAME = `${APP_NAME}-v1`;
// const urlsToCache = [
//   `/${APP_NAME}/`,
//   `/${APP_NAME}/index.html`,
//   `/${APP_NAME}/sketch.js`,
//   `/${APP_NAME}/turtle.js`,
//   `/${APP_NAME}/css/main.css`,
//   `/${APP_NAME}/icons/favicon.ico`
// ];

const urlsToCache = [
  `/`,
  `/index.html`,
  'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/p5.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/addons/p5.dom.min.js',
  `/sketch.js`,
  `/turtle.js`,
  `/css/main.css`,
  `/assets/icons/favicon.ico`,
  'https://api.github.com/repos/fabritsius/logo-code-editor/contents/examples',
  'https://api.github.com/repos/fabritsius/logo-code-editor/contents/examples/White_Spiral.logocode'
];

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
  console.log(`fetch request: ${event.request.url}`)
  event.respondWith(
    caches.match(event.request).then((request) => {
      return request || fetch(event.request).then((response) => {
        if (!response.ok) {
          console.log(`Can't load ${response}`);
          return;
        }
        return response;
      }).catch((error) => {
        // const example_404 = '/examples/White_Spiral.logocode';
        const example_404 = 'https://api.github.com/repos/fabritsius/logo-code-editor/contents/examples/White_Spiral.logocode';
        return caches.match(example_404);
      });
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then( (keyList) => {
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