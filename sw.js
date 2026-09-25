const PLANON_SW='20260925-2055';
const CACHE='planon-app-'+PLANON_SW;
const APP_SHELL=["./", "./index.html", "./styles.css", "./worklog.css", "./portfolio.css", "./app-core.js", "./worklog.js", "./ux.js", "./weather.js", "./weather-extra.js", "./autoschedule.js", "./clock.js", "./private-tally.js", "./portfolio-vault.js", "./nemo.js", "./recipes.js", "./selfchat.js", "./config.js", "./privacy.html", "./market/shop.css", "./market/catalog.js", "./market/theme-engine.js", "./market/payment-adapter.js", "./market/shop.js"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(APP_SHELL.map(u=>c.add(u).catch(()=>null)))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('planon-app-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==self.location.origin)return;
  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));return r;}).catch(()=>caches.match('./index.html')));return;}
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}return r;})));
});
