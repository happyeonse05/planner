(function(){
'use strict';

var B=window.PLANON_UX_BRIDGE;
if(!B)return;

var zoneCache={zone:null,at:0};
var timer=null;

function ui(){return B.ui&&B.ui();}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function deviceZone(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC';}catch(e){return 'UTC';}}
function icon(){return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/></svg>';}

function addStyles(){
  if(document.getElementById('planon-clock-css'))return;
  var st=document.createElement('style');st.id='planon-clock-css';st.textContent=`
  .planon-clock-chip{display:inline-grid;place-items:center;width:26px;height:26px;margin-left:5px;border-radius:999px;background:var(--soft);color:var(--ink);vertical-align:middle}
  .planon-clock-chip svg{width:15px;height:15px}
  .planon-clock-face{text-align:center;padding:24px 8px 28px}
  .planon-clock-face b{display:block;font-size:42px;line-height:1.1;letter-spacing:-.04em;font-variant-numeric:tabular-nums}
  `;
  document.head.appendChild(st);
}

function inject(){
  addStyles();
  var u=ui();
  document.querySelectorAll('.planon-clock-chip').forEach(function(x){x.remove();});
  if(!u||u.tab!=='day')return;
  var sub=document.querySelector('#top .ttl small');
  if(!sub)return;
  var b=document.createElement('button');
  b.className='planon-clock-chip';
  b.type='button';
  b.dataset.clockAct='open';
  b.setAttribute('aria-label','현재 시간');
  b.innerHTML=icon();
  sub.appendChild(b);
}

function weatherZone(){
  try{
    if(window.PLANON_WEATHER&&typeof window.PLANON_WEATHER.timezone==='function'){
      return window.PLANON_WEATHER.timezone()||null;
    }
  }catch(e){}
  return null;
}

function zoneFromCoords(lat,lon){
  var u='https://api.open-meteo.com/v1/forecast?latitude='+encodeURIComponent(lat)+
    '&longitude='+encodeURIComponent(lon)+'&current=temperature_2m&forecast_days=1&timezone=auto';
  return fetch(u,{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('timezone');return r.json();})
    .then(function(x){return x&&x.timezone||null;});
}
function locateZone(){
  var wz=weatherZone();
  if(wz)return Promise.resolve(wz);
  if(zoneCache.zone&&Date.now()-zoneCache.at<6*60*60*1000)return Promise.resolve(zoneCache.zone);

  // 날씨 모듈이 이미 위치를 알고 있으면 먼저 재사용해요.
  if(window.PLANON_WEATHER&&typeof window.PLANON_WEATHER.refresh==='function'){
    return Promise.resolve(window.PLANON_WEATHER.refresh()).then(function(){
      var z=weatherZone();
      if(z){zoneCache={zone:z,at:Date.now()};return z;}
      return locateDirect();
    }).catch(locateDirect);
  }
  return locateDirect();
}
function locateDirect(){
  return new Promise(function(resolve){
    if(!navigator.geolocation){resolve(deviceZone());return;}
    navigator.geolocation.getCurrentPosition(function(p){
      zoneFromCoords(p.coords.latitude,p.coords.longitude).then(function(z){
        z=z||deviceZone();zoneCache={zone:z,at:Date.now()};resolve(z);
      }).catch(function(){resolve(deviceZone());});
    },function(){resolve(deviceZone());},{enableHighAccuracy:false,timeout:5000,maximumAge:30*60*1000});
  });
}

function formatNow(zone){
  try{
    return new Intl.DateTimeFormat('ko-KR',{
      timeZone:zone,hour:'numeric',minute:'2-digit',hour12:true
    }).format(new Date());
  }catch(e){
    return new Intl.DateTimeFormat('ko-KR',{hour:'numeric',minute:'2-digit',hour12:true}).format(new Date());
  }
}
function tick(zone){
  var el=document.getElementById('planon-clock-now');
  if(!el){if(timer){clearInterval(timer);timer=null;}return;}
  el.textContent=formatNow(zone);
}
function show(zone){
  if(timer){clearInterval(timer);timer=null;}
  B.openModal('<h3>현재 시간</h3><div class="planon-clock-face"><b id="planon-clock-now">'+esc(formatNow(zone))+'</b></div><div class="acts"><button class="b-save" data-clock-act="close">닫기</button></div>');
  timer=setInterval(function(){tick(zone);},1000);
}
function open(){
  B.openModal('<h3>현재 시간</h3><div class="planon-clock-face"><b id="planon-clock-now">…</b></div>');
  locateZone().then(function(z){
    if(!document.getElementById('planon-clock-now'))return;
    show(z||deviceZone());
  });
}
function click(e){
  var a=e.target.closest&&e.target.closest('[data-clock-act]');
  if(!a)return;
  if(a.dataset.clockAct==='open'){open();return;}
  if(a.dataset.clockAct==='close'){if(timer){clearInterval(timer);timer=null;}B.closeModal();return;}
}

document.addEventListener('click',click);
window.PLANON_CLOCK={afterRender:inject,open:open};
inject();

})();