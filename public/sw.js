const staticCacheName = 'site-static-v6';
const dynamicCacheName = 'dynamic-cache-v4'
const assets = [
  '/',
  '/templates/fallback.html',
  '/templates/home.html',
  '/angular-1.5.8/angular.min.js',
  '/angular-1.5.8/angular-route.min.js',
  '/angular-1.5.8/angular-animate.min.js',
  '/materialize/js/materialize.min.js',
  '/app.js',
  '/controller.js',
  '/manifest.json',
  '/javascript/register.js',
  '/stylesheet/index_style.css',
  '/materialize/css/materialize.min.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js',
];

// install event
self.addEventListener('install', evt => {
  // console.log('service worker installed');
  evt.waitUntill(
    caches.open(staticCacheName)
      .then(cache => {
        console.log('Caching shell assets');
        cache.addAll(assets);
      })
      .catch((err) => console.log('Error occured'))
  );
});

// activate event
self.addEventListener('activate', evt => {
  // console.log('service worker activated');
  evt.waitUntill(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName) // && key !== dynamicCacheName)
        .map(key => caches.delete(key))
        );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  // console.log('service worker fetched: ', evt);

  // if(evt.request.url = "http://localhost:3000/api/getCatalog"){
  //   evt.request.url = "";
  //   console.log(evt.request.url);
  // }
  // evt.respondWith(
  //   caches.match(evt.request).then(cacheRes =>{
  //     return cacheRes || fetch(evt.request).then(fetchRes =>{
  //       return caches.open(dynamicCacheName).then(cache => {
  //         cache.put(evt.request.url, fetchRes.clone());
  //         return fetchRes;
  //       });
  //     });
  //   })
  //   .catch(() => {
  //     if(evt.request.url.indexOf('/') > -1){
  //       console.log(evt.request.url);
  //       return caches.match('/templates/fallback.html');
  //     }
  //   })
  // );
});