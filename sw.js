importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
workbox.setConfig({ modulePathPrefix: 'https://g.alicdn.com/kg/workbox/3.6.3/' });

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      var validSets = ["is-sw-8afa7d","is-html-8afa7d","is-jsdelivr-8afa7d","is-theme-8afa7d","is-json-8afa7d"];
      return Promise.all(
        names
          .filter(function (name) { return !~validSets.indexOf(name); })
          .map(function (name) {
            indexedDB && indexedDB.deleteDatabase(name);
            return caches.delete(name);
          })
      ).then(function() { self.skipWaiting() });
    })
  );
});

workbox.routing.registerRoute(new RegExp('sw\\.js'), workbox.strategies.networkOnly({
  cacheName: 'is-sw-8afa7d',
}));
workbox.routing.registerRoute(new RegExp('https://cdn\\.jsdelivr\\.net'), workbox.strategies.staleWhileRevalidate({
  cacheName: 'is-jsdelivr-8afa7d',
}));
workbox.routing.registerRoute(new RegExp('/.*\\.(?:js|css|woff2|png|jpg|gif)l;/span>'), workbox.strategies.cacheFirst({
  cacheName: 'is-theme-8afa7d',
}));
workbox.routing.registerRoute(new RegExp('your_data_prefix/.*\\.json'), workbox.strategies.cacheFirst({
  cacheName: 'is-json-8afa7d',
}));

workbox.routing.registerRoute(new RegExp('/.*(:?/[^\\.]*/?)$'), function(context) {
  var url = context.url.pathname;
  if (!url.endsWith('/')) url += '/';
  return fetch(url);
});