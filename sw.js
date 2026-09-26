const PLANON_SW='20260927-0130';
const CACHE='planon-prod-'+PLANON_SW;
const APP_SHELL=[
  "./","./index.html","./manifest.webmanifest","./apple-touch-icon.png","./icon-512.png",
  "./styles.css","./worklog.css","./today-core.css","./day-story.css","./market/shop.css",
  "./market/functional-packs.css","./relationship-theme.css","./portfolio.css","./meonbyeol.css",
  "./focus-mate.css","./planner-sections.css","./recovery-20260926.css","./nemo-ui.css",
  "./config.js","./study-day.js","./nemo.js","./recipes.js","./selfchat.js","./app-core.js",
  "./worklog.js","./day-story.js","./market/catalog.js","./market/theme-engine.js",
  "./market/payment-adapter.js","./market/shop.js","./market/functional-packs.js",
  "./relationship-theme.js","./ux.js","./weather.js","./weather-extra.js","./stability-regression.js",
  "./smart-data.js","./planner.js","./undo.js","./scheduling.js","./exams.js","./smart-ui.js",
  "./clock.js","./private-tally.js","./portfolio-vault.js","./meonbyeol.js","./meonbyeol-social.js",
  "./focus-mate.js","./planner-sections.js","./recovery-20260926.js","./nemo-ui.js",
  "./privacy.html","./third-party-notices.html","./nemo-diary.png"
];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(APP_SHELL.map(function(u){return c.add(u).catch(function(){return null;});}));
  }).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k.startsWith('planon-')&&k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var u=new URL(e.request.url);
  if(u.origin!==self.location.origin)return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(function(r){
      var cp=r.clone();caches.open(CACHE).then(function(c){c.put('./index.html',cp);});return r;
    }).catch(function(){return caches.match('./index.html');}));
    return;
  }
  if(/\.(?:js|css)$/.test(u.pathname)){
    e.respondWith(fetch(e.request).then(function(r){
      if(r&&r.ok){var cp=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,cp);});}
      return r;
    }).catch(function(){return caches.match(e.request);}));
    return;
  }
  e.respondWith(caches.match(e.request).then(function(hit){
    return hit||fetch(e.request).then(function(r){
      if(r&&r.ok){var cp=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,cp);});}
      return r;
    });
  }));
});