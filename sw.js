/* 플래너 알림용 서비스워커 — 캐시는 건드리지 않아요 (index.html은 항상 최신으로 받아요) */
self.addEventListener('install',function(){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim());});
self.addEventListener('notificationclick',function(e){
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(list){
    for(var i=0;i<list.length;i++){if('focus' in list[i])return list[i].focus();}
    if(self.clients.openWindow)return self.clients.openWindow('./');
  }));
});
