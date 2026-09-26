/* Planon 집중 화면 동반자 (focus-mate) v2
   먼별 테마: 복복복 집중 화면을 새로 그려요.
   - 타이머 틀: 별사탕 / 구름 / 하트 / 동글 (진행 막대가 틀 모양을 따라 차올라요)
   - 틀 위에 먼별이 또는 먼돌이가 헤드폰 끼고 붙어 있어요 (혼자 모드는 별밤)
   - 캐릭터를 문지르면 쓰다듬기 반응
   - 시작/잠깐/끝내기 = app-core 그대로(fstart/fpause/fstop), 나가기(타이머 유지)만 추가
   먼별 테마가 아닌 사람: 기존 화면 + (유료 꾸미기 보유 시) 집중 기록·이번 주 그리드 */
(function(){'use strict';
var B=window.PLANON_UX_BRIDGE;if(!B)return;
function E(){return window.PLANON_MARKET_THEME;}
function MB(){return window.PLANON_MEONBYEOL;}
function mbOn(){try{return !!(MB()&&MB().on());}catch(e){return false;}}
function premium(){try{return !!(E()&&E().hasPremium&&E().hasPremium());}catch(e){return false;}}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function pad(n){return String(n).padStart(2,'0');}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v);}catch(e){return null;}}
function mode(){return ls('planon.focusMate')==='alone'?'alone':'with';}
function setMode(v){ls('planon.focusMate',v==='alone'?'alone':'with');}
function ctype(){try{return MB().charType();}catch(e){return 'byeol';}}
function cname(){try{return MB().charName();}catch(e){return '먼별이';}}
function lineKey(m){return m==='alone'?'alone':ctype()==='dol'?'dol':'with';}
function shape(){var v=ls('planon.focusShape');return ['candy','cloud','heart','round'].indexOf(v)>=0?v:'candy';}
function fstate(){try{return JSON.parse(localStorage.getItem('planner.focusState')||'null');}catch(e){return null;}}
function running(){var f=fstate();return !!(f&&f.phase&&f.phase!=='idle');}
function durTxt(min){min=Math.round(min||0);var h=Math.floor(min/60),m=min%60;return h?(h+'시간'+(m?' '+m+'분':'')):m+'분';}

/* ---------- 이번 주 그리드 · 오늘 기록 ---------- */
function mondayOf(d){var x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return x;}
function toMin(t){var p=String(t||'').split(':');return Number(p[0]||0)*60+Number(p[1]||0);}
function weekGridHTML(){
  var s=B.state()||{},H0=(window.PLANON_STUDY_DAY&&window.PLANON_STUDY_DAY.boundaryHour)||5,sd=B.studyDayDate(new Date()),mon=mondayOf(sd),today=B.todayKey(),DN=['월','화','수','목','금','토','일'],rows='',weekSum=0;
  var head='<span></span>';for(var h=0;h<24;h++){var hr=(H0+h)%24;head+='<span class="fm-gh">'+(h%3===0?hr:'')+'</span>';}head+='<span class="fm-gh">합계</span>';
  for(var i=0;i<7;i++){var d=new Date(mon.getFullYear(),mon.getMonth(),mon.getDate()+i),k=B.dkey(d),cells=[],sess=(s.fsess&&s.fsess[k])||[];for(var c=0;c<24;c++)cells.push(0);
    sess.forEach(function(x){if(!x||!x.start)return;var a=toMin(x.start),b=x.end?toMin(x.end):a+Number(x.min||0);if(b<a)b+=1440;var oa=a-H0*60;if(oa<0)oa+=1440;var ob=oa+(b-a);for(var q=0;q<24;q++){var ov=Math.min(ob,(q+1)*60)-Math.max(oa,q*60);if(ov>0)cells[q]+=ov;}});
    var tot=Number(s.focus&&s.focus[k]||0);weekSum+=tot;var td=k===today?' today':'';
    rows+='<span class="fm-gd'+td+'">'+DN[i]+'</span>'+cells.map(function(v){var l=v<=0?0:v<15?1:v<30?2:v<45?3:4;return '<i class="l'+l+td+'"></i>';}).join('')+'<span class="fm-gt'+td+'">'+(tot?durTxt(tot):'·')+'</span>';}
  return '<div class="fm-grid-wrap"><div class="fm-grid">'+head+rows+'</div><div class="fm-grid-foot"><span>이번 주 '+durTxt(weekSum)+'</span><span class="fm-legend">적게<i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i>많이</span></div></div>';}
function recordHTML(){
  var s=B.state()||{},k=B.todayKey(),rows=((s.fsess&&s.fsess[k])||[]).slice().reverse(),tot=Number(s.focus&&s.focus[k]||0);
  var name=function(tid){var t=tid&&(s.todos||[]).find(function(x){return x.id===tid;});return t?t.text:'자유 집중';};
  if(!rows.length)return '<p class="fm-empty">아직 오늘 기록이 없어. 첫 집중을 시작해볼까?</p>';
  return '<div class="fm-rec-sum"><b>'+durTxt(tot)+'</b><small>오늘 '+rows.length+'번 집중</small></div><ul class="fm-rec">'+rows.slice(0,8).map(function(x){return '<li><span class="fm-rec-t">'+esc(x.start||'')+'–'+esc(x.end||'')+'</span><span class="fm-rec-n">'+esc(name(x.tid))+'</span><b>'+durTxt(x.min)+'</b></li>';}).join('')+'</ul>';}
function extrasHTML(){return premium()?'<div class="fm-extra"><section class="fm-card"><h4>오늘 집중 기록</h4>'+recordHTML()+'</section><section class="fm-card"><h4>이번 주 그리드</h4>'+weekGridHTML()+'</section></div>':'<p class="fm-lock">오늘 집중 기록·이번 주 그리드는 Planon Shop 꾸미기(리본 네모, 먼별 등)를 가진 분께 열려요. <button data-market-open>둘러보기</button></p>';}

/* ---------- 틀 모양 (pathLength로 어떤 모양이든 진행 막대가 따라가요) ---------- */
function bumpy(N,R,r,cx,cy,k){var d='',st=-Math.PI/2;function P(a,rr){return (cx+Math.cos(a)*rr).toFixed(1)+' '+(cy+Math.sin(a)*rr).toFixed(1);}d='M'+P(st,r);for(var i=0;i<N;i++){var a=st+i*2*Math.PI/N;d+=' Q'+P(a+Math.PI/N,R*k)+' '+P(a+2*Math.PI/N,r);}return d+'Z';}
var SHAPES={
  candy:{name:'별사탕',d:bumpy(8,122,98,130,130,1.1)},
  cloud:{name:'구름',d:bumpy(11,120,106,130,130,1.05)},
  heart:{name:'하트',d:'M130 70C166 26 230 40 232 94C234 146 180 184 130 226C80 184 26 146 28 94C30 40 94 26 130 70Z'},
  round:{name:'동글',d:'M130 14A116 116 0 1 1 129.9 14Z'}};
function shapeIcon(k){return '<svg viewBox="0 0 260 260" aria-hidden="true"><path d="'+SHAPES[k].d+'" fill="none" stroke="currentColor" stroke-width="26" stroke-linejoin="round"/></svg>';}

/* ---------- 그림 ---------- */
var PHONES='<path d="M38 104Q100 18 162 104" stroke="#A894D0" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M38 104Q100 22 162 104" stroke="#C8B8E8" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="24" y="92" width="22" height="34" rx="11" fill="#C8B8E8" stroke="#A894D0" stroke-width="3"/><rect x="154" y="92" width="22" height="34" rx="11" fill="#C8B8E8" stroke="#A894D0" stroke-width="3"/><rect x="29" y="98" width="11" height="22" rx="5.5" fill="#E8DFF5"/><rect x="160" y="98" width="11" height="22" rx="5.5" fill="#E8DFF5"/>';
function charSVG(m,ph){var mb=MB();if(!mb||!mb.charSVG)return '';var ex=mb.exprFor('focus',ph==='idle'?'idle':ph);return mb.charSVG(ex,{headphone:ph!=='brk'&&ph!=='done',scene:ph==='brk'||ph==='done'?null:{front:PHONES}});}
var ICO={
  watch:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 13V8.5M10 3h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  alarm:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="7.5" fill="#F7B8D2" stroke="#E08AAE" stroke-width="1.6"/><path d="M12 13V9.5M12 13l2.5 1.5M4.5 6.5l3-2.5M19.5 6.5l-3-2.5" stroke="#B0567E" stroke-width="1.6" stroke-linecap="round"/></svg>',
  tomato:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="14" r="7.5" fill="#F07A7A" stroke="#D05A5A" stroke-width="1.4"/><path d="M12 7l-3-2M12 7l3-2M12 7V4" stroke="#6AAE5E" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="9.5" cy="12" rx="1.6" ry="1" fill="#fff" opacity=".6"/></svg>',
  play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  pause:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5.5" width="3.8" height="13" rx="1.6" fill="currentColor"/><rect x="13.7" y="5.5" width="3.8" height="13" rx="1.6" fill="currentColor"/></svg>',
  check:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'};
function sparkles(){var sp=MB()&&MB().starPath;if(!sp)return '';return '<path class="fm2-tw" d="'+sp(30,40,7)+'" fill="#FFE9A8"/><path class="fm2-tw d2" d="'+sp(232,52,5)+'" fill="#FFE9A8"/><path class="fm2-tw d3" d="'+sp(236,214,6)+'" fill="#F7C8D8"/><path class="fm2-tw d4" d="'+sp(22,206,4.5)+'" fill="#DCCDF2"/>';}
function nightLayer(){var s='';for(var i=0;i<34;i++)s+='<i style="left:'+(Math.random()*100).toFixed(1)+'%;top:'+(Math.random()*80).toFixed(1)+'%;animation-delay:'+(Math.random()*4).toFixed(1)+'s;transform:scale('+(0.6+Math.random()*1.1).toFixed(2)+')"></i>';return '<div class="fm-night" aria-hidden="true">'+s+'</div>';}

var LINES={
  with:{idle:['준비되면 시작 눌러줘. 헤드폰 꼈어!','오늘은 뭐부터 할까? 옆에서 지켜줄게.','같이 앉자. 딱 한 판만 해보자.'],work:['쉿… 나도 집중 중.','한 줄 한 줄, 천천히 가도 돼.','너 지금 엄청 집중했어. 다 봤어.','조금 어려워도 괜찮아. 나 여기 있어.','물 한 모금 마시고 계속 가자.'],brk:['쉬는 시간! 어깨 쭉— 같이 기지개.','눈 감고 열까지 세어볼래?','잘했어. 별사탕 하나 반짝였을 거야.'],paused:['잠깐 멈췄지? 기다릴게.','급한 일 끝나면 다시 앉자.','멈춰도 괜찮아. 이어서 하면 돼.']},
  dol:{idle:['(먼돌이가 헤드폰을 쓰고 자리에 앉았어)','(먼돌이가 조용히 네 옆을 지키고 있어)'],work:['(먼돌이는 말없이 지켜보는 중)','(먼돌이 헤드폰에서 잔잔한 음악이 새어 나와)','(먼돌이가 꾸벅… 아니, 안 졸았대)'],brk:['(먼돌이가 헤드폰을 벗고 기지개를 켰어)','(먼돌이도 잠깐 쉬는 중)'],paused:['(먼돌이가 그 자리에서 기다리고 있어)']},
  alone:{idle:['조용한 별밤 집중'],work:['별이 조용히 같이 켜져 있어'],brk:['잠깐 쉬어가도 괜찮은 밤'],paused:['잠시 멈춤 · 별은 기다려줘']}};
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function phaseOf(pg){if(pg.classList.contains('brk'))return 'brk';if(pg.querySelector('[data-act="fpause"]'))return 'work';var st=pg.querySelector('[data-act="fstart"]');if(st&&/이어서/.test(st.textContent))return 'paused';return 'idle';}

/* ---------- 모드 고르기 ---------- */
var bypass=false;
function openChooser(src){var mb=MB(),ov=document.createElement('div');ov.className='fm-choose-ov';var cur=mode();
  var art={with:mb&&mb.charSVG?mb.charSVG(mb.exprFor('focus','idle'),{headphone:true,scene:{front:PHONES}}):'',alone:'<svg viewBox="0 0 80 80" aria-hidden="true"><rect x="4" y="4" width="72" height="72" rx="20" fill="#2E2A60"/><path d="M50 16a18 18 0 1 0 10 30a14 14 0 1 1-10-30z" fill="#FFF3C4"/><circle cx="18" cy="20" r="1.6" fill="#fff"/><circle cx="62" cy="62" r="1.3" fill="#fff"/>'+(mb&&mb.starPath?'<path d="'+mb.starPath(26,42,6)+'" fill="#FFE08A"/>':'')+'</svg>'};
  var opt=function(k,t,sub){return '<button data-fm-mode="'+k+'" class="'+(cur===k?'last':'')+'"><span class="fm-choose-art">'+art[k]+'</span><b>'+t+'</b><small>'+sub+'</small></button>';};
  ov.innerHTML='<div class="fm-choose" role="dialog" aria-label="집중 방식 고르기"><h3>어떻게 집중할까?</h3><p>오늘의 공부 자리를 골라줘.</p><div class="fm-choose-grid two">'+opt('with',cname()+'와 함께','집중하면 안경 쓰고 옆에 있어')+opt('alone','혼자 조용히','별밤처럼 잔잔하게')+'</div><button class="fm-choose-x" data-fm-x>닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(e){if(e.target===ov||e.target.closest('[data-fm-x]')){ov.remove();return;}var b=e.target.closest('[data-fm-mode]');if(!b)return;setMode(b.dataset.fmMode);ov.remove();bypass=true;try{src.click();}finally{bypass=false;}});}
document.addEventListener('click',function(e){if(bypass)return;var a=e.target.closest&&e.target.closest('[data-act="focus-free"],[data-act="focus-todo"]');if(!a||!mbOn()||running())return;if(a.classList.contains('fm-pill'))return;e.preventDefault();e.stopImmediatePropagation();openChooser(a);},true);

/* ---------- 화면 ---------- */
var talkTimer=null;
function modalEl(){return document.getElementById('modal');}
function cleanup(){var md=modalEl();if(md)md.classList.remove('fm-deco','fm2-on','fm2-night');if(talkTimer){clearInterval(talkTimer);talkTimer=null;}}
function decorate(){var md=modalEl();if(!md)return;var pg=md.querySelector('.fpage');if(!pg){cleanup();return;}
  if(pg.querySelector('.fdone')){decorateDone(md,pg);return;}
  if(pg.dataset.fm==='1')return;pg.dataset.fm='1';md.classList.add('fm-deco');
  if(mbOn())rebuild(md,pg);else plainExtras(pg);}
function plainExtras(pg){var ph=phaseOf(pg);addExit(pg,ph,pg.querySelector('.factions'));var st=pg.querySelector('.factions [data-act="fstop"]');if(st&&ph!=='idle')st.textContent='끝내고 기록';pg.insertAdjacentHTML('beforeend',extrasHTML());}
function addExit(pg,ph,after){var back=pg.querySelector('[data-act="fstop"][aria-label]');if(back&&ph!=='idle'){back.removeAttribute('data-act');back.setAttribute('data-fm','min');back.setAttribute('aria-label','나가기 · 타이머는 계속');}
  if(after&&ph!=='idle'&&!pg.querySelector('.fm-exit')){var mn=document.createElement('button');mn.className='fm-exit';mn.setAttribute('data-fm','min');mn.textContent='나가기 · 타이머는 계속 흘러가';after.after(mn);}}
function rebuild(md,pg){
  var ph=phaseOf(pg),m=mode(),shp=shape(),run=ph==='work'||ph==='brk';
  var clock=(pg.querySelector('#fclock')||{}).textContent||'00:00',state=(pg.querySelector('.fstate')||{}).textContent||'준비',today=(pg.querySelector('.ftoday')||{}).innerHTML||'';
  var ring=pg.querySelector('#fring'),RL=741.42,off=0;if(ring){RL=parseFloat(ring.style.strokeDasharray)||RL;off=parseFloat(ring.style.strokeDashoffset);if(isNaN(off))off=RL;}
  var fmodeOn=(pg.querySelector('[data-act="fmode"].on')||{dataset:{}}).dataset.v||'p25',sel=pg.querySelector('#f-task'),week=(pg.querySelector('.fweek')||{}).textContent||'';
  var name=cname(),title=m==='alone'?'혼자 집중 — 별밤 모드':'같이 집중 — '+name+'가 지켜줘';
  var modeIco=fmodeOn==='sw'?ICO.watch:fmodeOn==='p50'?ICO.alarm:ICO.tomato,modeTxt=fmodeOn==='sw'?'스톱워치':fmodeOn==='p50'?'뽀모도로 50 + 10':'뽀모도로 25 + 5';
  var chip=function(v,ico,t){return '<button class="fm2-chip'+(fmodeOn===v?' on':'')+'" data-act="fmode" data-v="'+v+'"'+(run?' disabled':'')+'>'+ico+'<span>'+t+'</span></button>';};
  var opt=function(k,v,t,cur){return '<button class="fm2-mini'+(cur===v?' on':'')+'" data-fm="'+k+'" data-v="'+v+'">'+t+'</button>';};
  var html='<div class="fm2">'+(m==='alone'?nightLayer():'')+
    '<div class="fm2-top"><button class="fm2-back" '+(ph==='idle'?'data-act="fstop"':'data-fm="min"')+' aria-label="'+(ph==='idle'?'닫기':'나가기 · 타이머는 계속')+'">‹</button><span class="fm2-today">'+today+'</span></div>'+
    '<div class="fm2-card">'+
      '<p class="fm2-title">'+ICO.watch+'<span>'+esc(title)+'</span></p>'+
      '<div class="fm2-timer shape-'+shp+' m-'+m+'">'+
        (m==='alone'?'':'<div class="fm2-char c-'+ctype()+'" id="fm2-char" aria-label="'+name+' · 문지르면 쓰다듬기">'+charSVG(m,ph)+'</div>')+
        '<svg class="fm2-frame" viewBox="0 0 260 260" aria-hidden="true"><path class="fm2-track" d="'+SHAPES[shp].d+'"/><path id="fring" class="fm2-bar" d="'+SHAPES[shp].d+'" pathLength="'+RL+'" style="stroke-dasharray:'+RL+';stroke-dashoffset:'+off+'"/>'+sparkles()+'</svg>'+
        '<div class="fm2-center"><small class="fm2-mode">'+modeIco+'<span>'+modeTxt+'</span></small><div class="fm2-clock" id="fclock">'+esc(clock)+'</div><small class="fstate fm2-state">'+esc(state)+'</small></div>'+
      '</div>'+
      '<p class="fm2-talk" id="fm-talk">'+esc(pick(LINES[lineKey(m)][ph]))+'</p>'+
      '<div class="fm2-btns"><button class="fm2-b start" data-act="fstart"'+(run?' disabled':'')+'>'+ICO.play+'<span>'+(ph==='paused'?'이어서':'집중 시작')+'</span></button><button class="fm2-b pause" data-act="fpause"'+(run?'':' disabled')+'>'+ICO.pause+'<span>잠깐</span></button><button class="fm2-b end" data-act="fstop">'+ICO.check+'<span>끝내기</span></button></div>'+
      '<div class="fm2-chips">'+chip('sw',ICO.watch,'스톱워치')+chip('p25',ICO.tomato,'뽀모도로')+chip('p50',ICO.alarm,'50분 타이머')+'</div>'+
      '<div class="fm2-sep"></div>'+
      '<div class="fm2-task"><small>무엇에 집중할까 · 할 일마다 시간이 쌓여</small><div id="fm2-selbox"></div></div>'+
      '<div class="fm2-opts"><div><small>같이 할 친구</small>'+opt('char','with',cname().replace(/이$/,''),m)+opt('char','alone','혼자',m)+'</div><div><small>타이머 모양</small>'+['candy','cloud','heart','round'].map(function(k){return '<button class="fm2-mini shp'+(shp===k?' on':'')+'" data-fm="shape" data-v="'+k+'" aria-label="'+SHAPES[k].name+'">'+shapeIcon(k)+'<span>'+SHAPES[k].name+'</span></button>';}).join('')+'</div></div>'+
      (ph!=='idle'?'<button class="fm-exit" data-fm="min">나가기 · 타이머는 계속 흘러가</button>':'')+
      (week?'<p class="fm2-week">'+esc(week)+'</p>':'')+
    '</div>'+extrasHTML()+'</div>';
  pg.innerHTML=html;pg.classList.add('fm2-page');
  var box=pg.querySelector('#fm2-selbox');if(box&&sel){sel.classList.add('fm2-sel');box.appendChild(sel);}
  md.classList.add('fm2-on');md.classList.toggle('fm2-night',m==='alone');
  if(talkTimer)clearInterval(talkTimer);talkTimer=setInterval(function(){var t=document.getElementById('fm-talk');if(!t){clearInterval(talkTimer);talkTimer=null;return;}var p2=document.querySelector('#modal .fpage');var ph2=p2?phaseOf2(p2):'work';t.textContent=pick(LINES[lineKey(mode())][ph2]);t.classList.remove('fm-pop');void t.offsetWidth;t.classList.add('fm-pop');},40000);}
function phaseOf2(pg){var p=pg.querySelector('[data-act="fpause"]');if(p&&!p.disabled)return pg.classList.contains('brk')?'brk':'work';var s=pg.querySelector('[data-act="fstart"] span');return s&&/이어서/.test(s.textContent)?'paused':'idle';}
function decorateDone(md,pg){if(pg.dataset.fm==='1')return;pg.dataset.fm='1';md.classList.add('fm-deco');var on=mbOn(),m=on?mode():'';
  if(on){md.classList.add('fm2-on');md.classList.toggle('fm2-night',m==='alone');pg.classList.add('fm2-page','fm2-donepage');var ck=pg.querySelector('.fcheck');if(ck&&m!=='alone'){ck.outerHTML='<div class="fm-done-mate">'+charSVG(m,'done')+'</div>';}if(m==='alone')pg.insertAdjacentHTML('afterbegin',nightLayer());var h=pg.querySelector('.fdone h2');if(h)h.insertAdjacentHTML('afterend','<p class="fm-done-line">'+(m==='alone'?'오늘 밤 별 하나가 더 밝아졌어.':ctype()==='dol'?'(먼돌이가 뿌듯하게 고개를 끄덕였어)':'같이 해서 더 반짝였어. 수고했어!')+'</p>');}
  if(premium())pg.insertAdjacentHTML('beforeend','<div class="fm-extra"><section class="fm-card"><h4>이번 주 그리드</h4>'+weekGridHTML()+'</section></div>');}
var md0=modalEl();if(md0)new MutationObserver(function(){setTimeout(decorate,0);}).observe(md0,{childList:true,subtree:false});

function redraw(){var pg=document.querySelector('#modal .fpage');if(!pg)return;var sel=pg.querySelector('#f-task'),clock=(pg.querySelector('#fclock')||{}).textContent;
  /* 옵션만 바꾼 경우: 원래 구조를 흉내 내서 다시 그림 */
  var ph=phaseOf2(pg),ring=pg.querySelector('#fring');var fake='<div class="ftop"><span class="ftoday">'+((pg.querySelector('.fm2-today')||{}).innerHTML||'')+'</span></div>'+'<svg><circle id="fring" style="stroke-dasharray:'+(ring?ring.style.strokeDasharray:'741.42')+';stroke-dashoffset:'+(ring?ring.style.strokeDashoffset:'741.42')+'"/></svg><div id="fclock">'+esc(clock||'00:00')+'</div><div class="fstate">'+esc((pg.querySelector('.fm2-state')||{}).textContent||'')+'</div>'+
    '<div class="seg">'+['sw','p25','p50'].map(function(v){var b=pg.querySelector('.fm2-chip[data-v="'+v+'"]');return '<button data-act="fmode" data-v="'+v+'" class="'+(b&&b.classList.contains('on')?'on':'')+'"></button>';}).join('')+'</div>'+
    '<div class="factions">'+(ph==='work'||ph==='brk'?'<button data-act="fpause"></button>':'<button data-act="fstart">'+(ph==='paused'?'이어서':'시작')+'</button>')+'</div><p class="fweek">'+esc((pg.querySelector('.fm2-week')||{}).textContent||'')+'</p>';
  pg.innerHTML=fake;if(sel)pg.appendChild(sel);pg.classList.toggle('brk',ph==='brk');pg.dataset.fm='';cleanup();decorate();}

/* ---------- 버튼 · 문지르기 ---------- */
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-fm]');if(!a)return;var k=a.dataset.fm;
  if(k==='min'){e.preventDefault();e.stopPropagation();cleanup();try{B.closeModal();}catch(x){}setTimeout(pill,50);try{B.toast('타이머는 계속 흘러가요 · 아래 알약을 누르면 돌아와요',2400);}catch(x){}return;}
  if(k==='char'){e.preventDefault();setMode(a.dataset.v);redraw();return;}
  if(k==='shape'){e.preventDefault();ls('planon.focusShape',a.dataset.v);redraw();return;}},true);
var R={on:false};
document.addEventListener('pointerdown',function(e){var c=e.target.closest&&e.target.closest('#fm2-char');if(!c)return;R={on:true,x:e.clientX,y:e.clientY,dist:0,sp:0,done:false,id:e.pointerId};try{c.setPointerCapture(e.pointerId);}catch(x){}},{passive:true});
document.addEventListener('pointermove',function(e){if(!R.on||e.pointerId!==R.id)return;var dx=e.clientX-R.x,dy=e.clientY-R.y,d=Math.sqrt(dx*dx+dy*dy);if(d<2)return;R.dist+=d;R.sp+=d;R.x=e.clientX;R.y=e.clientY;var c=document.getElementById('fm2-char');if(c&&R.dist>12)c.classList.add('rub');
  if(R.sp>60){R.sp=0;try{MB().rubBurst(e.clientX,e.clientY);}catch(x){}}
  if(!R.done&&R.dist>420){R.done=true;var t=document.getElementById('fm-talk');if(t){t.textContent=ctype()==='dol'?'(먼돌이가 살짝 몸을 기대 왔어)':pick(['헤헤, 간지러워~ 이제 집중!','힘 났어! 같이 조금만 더.','복복복… 좋다.']);t.classList.remove('fm-pop');void t.offsetWidth;t.classList.add('fm-pop');}try{MB().pop();}catch(x){}}},{passive:true});
function rEnd(){if(!R.on)return;R.on=false;var c=document.getElementById('fm2-char');if(c)c.classList.remove('rub');}
document.addEventListener('pointerup',rEnd,{passive:true});document.addEventListener('pointercancel',rEnd,{passive:true});

/* ---------- 나간 뒤 떠 있는 알약 ---------- */
function remainText(f){if(!f)return '';var now=Date.now(),sec;if(f.mode==='sw'){sec=f.phase==='work'?(now-f.startAt)/1000+(f.acc||0):(f.acc||0);}else if(f.phase==='work'||f.phase==='break'){sec=(f.endAt-now)/1000;if(sec<=0)return '끝났어! 눌러서 기록';}else sec=f.left||0;sec=Math.max(0,Math.round(sec));return pad(Math.floor(sec/60))+':'+pad(sec%60);}
function pill(){var f=fstate(),md=modalEl(),inFocus=!!(md&&md.querySelector('.fpage'));var p=document.getElementById('fm-pill');
  if(!f||!f.phase||f.phase==='idle'||inFocus){if(p)p.remove();return;}
  if(!p){p=document.createElement('button');p.id='fm-pill';p.className='fm-pill';p.setAttribute('data-act','focus-free');document.body.appendChild(p);}
  var on=mbOn(),m=mode(),mb=MB(),icon=on&&m!=='alone'&&mb&&mb.charSVG?mb.charSVG(mb.exprFor('focus',f.phase==='work'?'work':f.phase==='break'?'brk':'paused')):ICO.watch;
  var lbl=f.phase==='paused'?'멈춤':f.phase==='break'?'휴식':'집중 중',txt=remainText(f),key=lbl+txt+(on?m:'');if(p.dataset.k===key)return;p.dataset.k=key;
  p.innerHTML='<span class="fm-pill-ic">'+icon+'</span><span><small>'+lbl+'</small><b>'+esc(txt)+'</b></span>';p.classList.toggle('mb',on);}
setInterval(pill,1000);setTimeout(pill,800);

window.PLANON_FOCUS_MATE={weekGridHTML:weekGridHTML,recordHTML:recordHTML,mode:mode,setMode:setMode};
})();
