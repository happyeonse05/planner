const PLANON_SW='20260927-0105';
const CACHE='planon-20260926-rel1-prod0926'+PLANON_SW;
const APP_SHELL=["./","./index.html","./apple-touch-icon.png","./icon-512.png","./styles.css","./worklog.css","./day-story.css","./today-core.css","./portfolio.css","./app-core.js","./worklog.js","./day-story.js","./ux.js","./weather.js","./weather-extra.js","./autoschedule.js","./clock.js","./private-tally.js","./portfolio-vault.js","./nemo.js","./recipes.js","./selfchat.js","./config.js","./study-day.js","./smart-data.js","./smart-learning.js","./planner.js","./undo.js","./scheduling.js","./exams.js","./smart-ui.js","./smart-learning-ui.js","./smart-learning.css","./privacy.html","./third-party-notices.html","./nemo-diary.png","./market/shop.css","./market/functional-packs.css","./market/catalog.js","./market/theme-engine.js","./market/payment-adapter.js","./market/shop.js","./market/functional-packs.js","./meonbyeol.js","./meonbyeol.css","./meonbyeol-social.js","./focus-mate.js","./focus-mate.css","./planner-sections.js","./planner-sections.css","./relationship-theme.js","./relationship-theme.css","./recovery-20260926.js","./recovery-20260926.css"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(APP_SHELL.map(u=>c.add(u).catch(()=>null)))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('planon-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==self.location.origin)return;
  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));return r;}).catch(()=>caches.match('./index.html')));return;}
  if(/\\.(?:js|css)$/.test(u.pathname)){e.respondWith(fetch(e.request).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}return r;}).catch(()=>caches.match(e.request)));return;}
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}return r;})));
});
