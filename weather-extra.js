/* ===== 강수확률 요약 v2: 강한 비 여부와 무관하게 확률 자체를 보여줘요 ===== */
(function(){
  'use strict';

  var API_CACHE='planon.rain.forecast.v2';
  var pending=null;

  function isTodayDay(){
    try{
      if(typeof U==='undefined'||U.tab!=='day'||!U.date)return false;
      var a=U.date,b=new Date();
      return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
    }catch(e){return false;}
  }
  function localDay(){
    var d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function timeLabel(iso){
    var h=Number(String(iso||'').slice(11,13));
    if(!isFinite(h))return '';
    return (h<12?'오전 ':'오후 ')+(h%12||12)+'시';
  }
  function icon(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 0 1 16 0H4Z"/><path d="M12 4v13.5a2.5 2.5 0 0 0 5 0"/></svg>';
  }
  function chip(){
    return document.getElementById('planon-rain-chip');
  }
  function hide(){
    var el=chip();if(el){el.classList.remove('on');el.innerHTML='';}
  }

  function forecastObject(v,depth){
    if(!v||depth>6)return null;
    if(typeof v==='string'){
      try{return forecastObject(JSON.parse(v),depth+1);}catch(e){return null;}
    }
    if(typeof v!=='object')return null;
    if(v.hourly&&Array.isArray(v.hourly.time)&&Array.isArray(v.hourly.precipitation_probability))return v;
    if(v.data){
      var d=forecastObject(v.data,depth+1);if(d)return d;
    }
    if(v.forecast){
      var f=forecastObject(v.forecast,depth+1);if(f)return f;
    }
    var keys=Object.keys(v);
    for(var i=0;i<Math.min(keys.length,40);i++){
      var r=forecastObject(v[keys[i]],depth+1);
      if(r)return r;
    }
    return null;
  }
  function findWeatherJsCache(){
    var stores=[];
    try{stores.push(localStorage);}catch(e){}
    try{stores.push(sessionStorage);}catch(e){}
    for(var s=0;s<stores.length;s++){
      var st=stores[s];
      for(var i=0;i<st.length;i++){
        try{
          var k=st.key(i),raw=st.getItem(k);
          if(!raw||raw.indexOf('precipitation_probability')<0)continue;
          var o=forecastObject(raw,0);
          if(o)return o;
        }catch(e){}
      }
    }
    return null;
  }
  function summary(data){
    if(!data||!data.hourly)return null;
    var h=data.hourly,times=h.time||[],probs=h.precipitation_probability||[];
    var prec=h.precipitation||[],rain=h.rain||[],showers=h.showers||[];
    var day=localDay(),now=new Date(),nowHour=now.getHours(),rows=[];
    for(var i=0;i<times.length;i++){
      var ts=String(times[i]||'');
      if(ts.slice(0,10)!==day)continue;
      var hr=Number(ts.slice(11,13));
      if(hr<nowHour)continue;
      rows.push({
        time:ts,
        hour:hr,
        p:Number(probs[i]||0),
        mm:Number(prec[i]||0)+Number(rain[i]||0)+Number(showers[i]||0)
      });
    }
    if(!rows.length)return null;

    // 사용자가 원하는 건 "비가 올 가능성"이므로 40%부터 표시.
    // 실제 강수량 예보가 있으면 확률이 조금 낮아도 표시.
    var first=-1;
    for(var j=0;j<rows.length;j++){
      if(rows[j].p>=40||rows[j].mm>0.05){first=j;break;}
    }
    if(first<0)return null;

    var peak=rows[first].p,end=first;
    for(var k=first+1;k<rows.length;k++){
      if(rows[k].hour-rows[end].hour>1)break;
      if(rows[k].p<30&&rows[k].mm<=0.02)break;
      end=k;peak=Math.max(peak,rows[k].p);
    }
    // 시작 후 4시간 내 최고 확률도 같이 반영.
    for(var z=first;z<Math.min(rows.length,first+5);z++)peak=Math.max(peak,rows[z].p);

    var isNow=(first===0&&rows[first].hour===nowHour);
    var cur=data.current||{},code=Number(cur.weather_code),nowRain=(Number(cur.rain||0)+Number(cur.showers||0)>0.01)||(code>=51&&code<=67)||(code>=80&&code<=82)||(code>=95&&code<=99);
    var label=nowRain?'비 오는 중':(isNow?'곧 비':timeLabel(rows[first].time)+'부터 비');
    return {
      first: rows[first],
      peak: Math.round(peak),
      isNow:isNow,
      nowRain:nowRain,
      html: icon()+'<span><b>'+label+'</b><span class="rain-sub"> · 강수확률 '+Math.round(rows[first].p)+'%'+(peak>rows[first].p?' · 최고 '+Math.round(peak)+'%':'')+'</span></span>'
    };
  }
  function paint(data){
    if(!isTodayDay()){hide();return false;}
    var el=chip();if(!el)return false;
    var s=summary(data);
    if(!s){hide();return false;}
    el.innerHTML=s.html;
    el.classList.add('on');
    return true;
  }

  function cachedOwn(){
    try{
      var x=JSON.parse(localStorage.getItem(API_CACHE)||'null');
      if(x&&x.data&&Date.now()-x.at<15*60*1000)return x.data;
    }catch(e){}
    return null;
  }
  function saveOwn(data){
    try{localStorage.setItem(API_CACHE,JSON.stringify({at:Date.now(),data:data}));}catch(e){}
  }

  function coordsFromStorage(){
    var stores=[];
    try{stores.push(localStorage);}catch(e){}
    try{stores.push(sessionStorage);}catch(e){}
    var latKeys=['lat','latitude'],lngKeys=['lng','lon','longitude'];
    function walk(v,depth){
      if(!v||depth>5)return null;
      if(typeof v==='string'){try{return walk(JSON.parse(v),depth+1);}catch(e){return null;}}
      if(typeof v!=='object')return null;
      var lat=null,lng=null;
      for(var i=0;i<latKeys.length;i++)if(isFinite(Number(v[latKeys[i]])))lat=Number(v[latKeys[i]]);
      for(var j=0;j<lngKeys.length;j++)if(isFinite(Number(v[lngKeys[j]])))lng=Number(v[lngKeys[j]]);
      if(lat!=null&&lng!=null&&Math.abs(lat)<=90&&Math.abs(lng)<=180)return {lat:lat,lng:lng};
      var ks=Object.keys(v);
      for(var k=0;k<Math.min(ks.length,30);k++){var r=walk(v[ks[k]],depth+1);if(r)return r;}
      return null;
    }
    for(var s=0;s<stores.length;s++){
      for(var n=0;n<stores[s].length;n++){
        try{
          var r=walk(stores[s].getItem(stores[s].key(n)),0);
          if(r)return r;
        }catch(e){}
      }
    }
    return null;
  }
  function fallbackCampus(){
    try{
      var c=(S&&S.settings&&S.settings.schoolCampus)||'';
      if(/수원|자연과학/.test(c))return {lat:37.3003,lng:126.9708};
      if(/서울|인문사회/.test(c))return {lat:37.5882,lng:126.9936};
    }catch(e){}
    return null;
  }
  function getCoords(){
    var stored=coordsFromStorage();
    if(stored)return Promise.resolve(stored);
    return new Promise(function(resolve){
      var fallback=fallbackCampus();
      if(!navigator.geolocation){resolve(fallback);return;}
      navigator.geolocation.getCurrentPosition(function(p){
        resolve({lat:p.coords.latitude,lng:p.coords.longitude});
      },function(){resolve(fallback);},{enableHighAccuracy:false,timeout:6000,maximumAge:30*60*1000});
    });
  }
  function fetchForecast(p){
    if(!p)return Promise.resolve(null);
    var u='https://api.open-meteo.com/v1/forecast?latitude='+encodeURIComponent(p.lat.toFixed(4))+
      '&longitude='+encodeURIComponent(p.lng.toFixed(4))+
      '&current=weather_code,precipitation,rain,showers'+
      '&hourly=precipitation_probability,precipitation,rain,showers'+
      '&forecast_days=1&timezone=auto';
    return fetch(u,{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json();})
      .then(function(d){saveOwn(d);return d;}).catch(function(){return null;});
  }

  function refresh(force){
    if(!isTodayDay()){hide();return Promise.resolve(null);}
    if(!force){
      var fromWeather=findWeatherJsCache();
      if(fromWeather&&paint(fromWeather))return Promise.resolve(fromWeather);
      var own=cachedOwn();
      if(own&&paint(own))return Promise.resolve(own);
    }
    if(pending)return pending;
    pending=getCoords().then(fetchForecast).then(function(d){if(d)paint(d);return d;})
      .finally(function(){pending=null;});
    return pending;
  }

  window.PLANON_RAIN={
    afterRender:function(){
      if(!isTodayDay()){hide();return;}
      // weather.js가 먼저 캐시를 채울 수 있으므로 즉시 + 짧은 재확인.
      refresh(false);
      setTimeout(function(){refresh(false);},500);
      setTimeout(function(){refresh(false);},1800);
    },
    refresh:function(){return refresh(true);}
  };

  // weather.js가 모달을 열면서 최신 예보를 저장하는 경우도 바로 반영.
  try{
    var mo=new MutationObserver(function(){if(isTodayDay())setTimeout(function(){refresh(false);},120);});
    mo.observe(document.getElementById('modal'),{childList:true,subtree:true});
  }catch(e){}

  setTimeout(function(){try{window.PLANON_RAIN.afterRender();}catch(e){}},250);
})();

/* ===== 날씨 모달 강수 시작 시각 보정 ===== */
(function(){
  'use strict';
  function hourRowsFromModal(modal){
    if(!modal)return [];
    var found={},nodes=modal.querySelectorAll('*');
    for(var i=0;i<nodes.length;i++){
      var el=nodes[i],t=(el.innerText||'').replace(/\s+/g,' ').trim();
      if(!t||t.length>90)continue;
      var hm=t.match(/^(\d{1,2})시\b/),pm=t.match(/비\s*(\d{1,3})%/);
      if(!hm||!pm)continue;
      var h=+hm[1],p=+pm[1];
      if(h>=0&&h<=23&&p>=0&&p<=100)found[h]=Math.max(found[h]||0,p);
    }
    return Object.keys(found).map(function(h){return {hour:+h,p:found[h]};}).sort(function(a,b){return a.hour-b.hour;});
  }
  function smallestTextNode(modal){
    var nodes=modal.querySelectorAll('*'),best=null;
    for(var i=0;i<nodes.length;i++){
      var t=(nodes[i].innerText||'').replace(/\s+/g,' ').trim();
      if(!(/\d{1,2}시\s*[~～-]\s*\d{1,2}시/.test(t)&&/비\s*예상/.test(t)))continue;
      if(!best||t.length<(best.innerText||'').length)best=nodes[i];
    }
    return best;
  }
  function patchWeatherModal(){
    var modal=document.getElementById('modal');
    if(!modal||!modal.classList.contains('open')||(modal.innerText||'').indexOf('오늘 날씨')<0)return;
    var rows=hourRowsFromModal(modal);if(!rows.length)return;
    var curHour=new Date().getHours(),current=null,first=null,peak=0;
    rows.forEach(function(r){if(r.hour>=curHour){if(!current&&r.hour===curHour)current=r;if(!first&&r.p>=40)first=r;peak=Math.max(peak,r.p);}});
    if(!first)return;
    var currentHigh=current&&current.p>=40;
    var msg=currentHigh?('곧 비 · 현재 강수확률 '+current.p+'% · 최고 '+peak+'%'):(first.hour+'시부터 비 가능성 · '+first.p+'% · 최고 '+peak+'%');
    var target=smallestTextNode(modal);
    if(target)target.textContent=msg;
    var top=document.getElementById('top');
    if(top){
      var els=top.querySelectorAll('button,span,div'),best=null;
      for(var i=0;i<els.length;i++){
        var tt=(els[i].innerText||'').replace(/\s+/g,' ').trim();
        if(/^우산\s*챙기/.test(tt)&&(!best||tt.length<(best.innerText||'').length))best=els[i];
      }
      if(best)best.textContent=currentHigh?('☂ 지금 비 '+current.p+'%'):('☂ '+first.hour+'시부터 비 '+first.p+'%');
    }
  }
  var queued=false;
  function queuePatch(){if(queued)return;queued=true;setTimeout(function(){queued=false;try{patchWeatherModal();}catch(e){}},80);}
  document.addEventListener('click',function(){setTimeout(queuePatch,120);},true);
  try{var modal=document.getElementById('modal');if(modal)new MutationObserver(queuePatch).observe(modal,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class']});}catch(e){}
  setTimeout(queuePatch,300);
})();
