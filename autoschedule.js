(function(){
'use strict';

var B=window.PLANON_UX_BRIDGE;
if(!B)return;

var KEY='planon.autoEstimateMin';
var DAYS=['월','화','수','목','금','토','일'];

function state(){return B.state&&B.state();}
function ui(){return B.ui&&B.ui();}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function pad(n){return String(n).padStart(2,'0');}
function uid(){try{return crypto.randomUUID();}catch(e){return 'ap-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10);}}
function toMin(s){var p=String(s||'').split(':');return Number(p[0]||0)*60+Number(p[1]||0);}
function hm(m){m=Math.max(0,Math.min(1439,Math.round(m)));return pad(Math.floor(m/60))+':'+pad(m%60);}
function dateKey(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function parseKey(k){var p=String(k||'').split('-').map(Number);return new Date(p[0],(p[1]||1)-1,p[2]||1);}
function addDays(d,n){var x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()+n);return x;}
function dow(d){return (d.getDay()+6)%7;}
function md(d){return (d.getMonth()+1)+'/'+d.getDate();}
function durText(m){var h=Math.floor(m/60),mm=m%60;return (h?h+'시간':'')+(h&&mm?' ':'')+(mm?mm+'분':'');}

function todayKey(){try{return B.todayKey?B.todayKey():dateKey(new Date());}catch(e){return dateKey(new Date());}}
function currentStudyMinute(){var n=new Date(),m=n.getHours()*60+n.getMinutes();return todayKey()===dateKey(n)?m:m+1440;}

function addStyles(){
  if(document.getElementById('planon-autoschedule-css'))return;
  var st=document.createElement('style');
  st.id='planon-autoschedule-css';
  st.textContent=`
  .auto-plan-controls{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:end;margin-top:9px}
  .auto-plan-est{display:flex;align-items:center;gap:7px;min-width:0}
  .auto-plan-est span{font-size:12px;font-weight:750;color:var(--sub);white-space:nowrap}
  .auto-plan-est input{width:88px;height:40px;border:1px solid transparent;border-radius:10px;background:var(--soft);padding:0 10px;font:inherit;font-size:14px;color:var(--ink)}
  .auto-plan-est em{font-style:normal;font-size:12px;color:var(--sub)}
  .auto-plan-btn{height:40px;padding:0 13px;border-radius:11px;background:var(--planner-color);color:var(--planner-ink,#1c1c1e);font-size:13px;font-weight:800;white-space:nowrap}
  .auto-plan-hint{grid-column:1/-1;margin:-1px 2px 0;color:var(--sub);font-size:11px;line-height:1.4}
  .auto-plan-preview{display:flex;flex-direction:column;gap:7px;margin:12px 0}
  .auto-plan-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 12px;border-radius:12px;background:var(--soft)}
  .auto-plan-row span{min-width:0}
  .auto-plan-row b{display:block;font-size:13px}
  .auto-plan-row small{display:block;margin-top:2px;color:var(--sub);font-size:11px}
  .auto-plan-row em{font-style:normal;font-weight:800;font-size:12px;white-space:nowrap}
  .auto-core-copy{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 10px;align-items:center;padding:12px;border-radius:14px;background:color-mix(in srgb,var(--planner-color) 12%,var(--card))}.auto-core-copy b,.auto-core-copy small{grid-column:1}.auto-core-copy small{color:var(--sub);font-size:11px;line-height:1.45}.auto-core-copy button{grid-column:2;grid-row:1/3}.auto-core-flow{display:flex;align-items:center;gap:5px;margin-top:10px;overflow:auto}.auto-core-flow span{font-size:10px;font-weight:800;white-space:nowrap}.auto-core-flow i{width:18px;height:1px;background:var(--line);flex:none}@media(max-width:390px){.auto-core-copy{grid-template-columns:1fr}.auto-core-copy button{grid-column:1;grid-row:auto;width:100%;margin-top:5px}}
  .auto-plan-summary{padding:11px 12px;border-radius:12px;background:color-mix(in srgb,var(--planner-color) 24%,var(--card));font-size:12px;line-height:1.5}
  .auto-plan-warn{padding:11px 12px;border-radius:12px;background:color-mix(in srgb,var(--now) 10%,var(--card));color:var(--ink);font-size:12px;line-height:1.5}
  [data-act="split-todo-open"]{display:none!important}

  .auto-replan{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:10px 0;padding:12px 13px;border:1px solid color-mix(in srgb,var(--planner-color) 45%,var(--line));border-radius:14px;background:color-mix(in srgb,var(--planner-color) 17%,var(--card))}
  .auto-replan span{min-width:0}.auto-replan b{display:block;font-size:13px}.auto-replan small{display:block;margin-top:3px;color:var(--sub);font-size:11px;line-height:1.4}.auto-replan button{flex:none}
  .deadline-radar{margin:10px 0;padding:13px;border-radius:14px;background:color-mix(in srgb,var(--now) 9%,var(--card));border:1px solid color-mix(in srgb,var(--now) 22%,var(--line))}.deadline-radar b{display:block;font-size:13px}.deadline-radar small{display:block;margin-top:4px;color:var(--sub);font-size:11px;line-height:1.45}.deadline-radar .acts{margin-top:9px}.smart-est-note{grid-column:1/-1;font-size:11px;color:var(--sub);margin:0 2px}.plan-buffer-settings{margin-top:8px}
  @media(max-width:390px){
    .auto-plan-controls{grid-template-columns:1fr}
    .auto-plan-btn{width:100%}
    .auto-plan-hint{grid-column:auto}
  }`;
  document.head.appendChild(st);
}

function estValue(){
  var x=document.getElementById('auto-est-min');
  var n=Number(x&&x.value);
  if(!isFinite(n)||n<20)n=120;
  return Math.min(720,Math.round(n/10)*10);
}
function saveEst(v){
  try{sessionStorage.setItem(KEY,String(v));}catch(e){}
}
function storedEst(){
  try{var n=Number(sessionStorage.getItem(KEY));if(isFinite(n)&&n>=20)return n;}catch(e){}
  return 120;
}

function inject(){
  addStyles();
  var u=ui();
  if(!u)return;
  injectRiskRadar();
  injectCoreHero();
  injectSettings();
  if(u.tab!=='todo'||u.qscope==='routine')return;
  var input=document.querySelector('#main input[data-draft="quick"]');
  if(!input)return;
  input.placeholder='예: 물리 과제 금요일 2시간';
  var card=input.closest('.card');
  if(!card||card.querySelector('.auto-plan-controls'))return;

  var box=document.createElement('div');
  box.className='auto-plan-controls';
  box.innerHTML=
    '<label class="auto-plan-est"><span>예상 소요시간</span><input id="auto-est-min" type="number" min="20" max="720" step="10" inputmode="numeric" value="'+storedEst()+'"><em>분</em></label>'+
    '<button class="auto-plan-btn" data-auto-act="preview">빈 시간에 넣기</button>'+
    '<div class="auto-plan-hint">마감일까지 시간표·약속·시간이 정해진 할 일을 피해 나눠 넣어요.</div>';
  card.appendChild(box);
  injectReplan(card);
}


function injectCoreHero(){
  var u=ui();if(!u||u.tab!=='home'||document.querySelector('.auto-core-hero'))return;
  var main=document.querySelector('#main');if(!main)return;
  var g=replanGroup(),risk=riskRows()[0],card=document.createElement('section');card.className='card auto-core-hero';
  var status=g?'<b>틀어진 계획 '+durText(g.minutes)+' 다시 살리기</b><small>'+esc(g.parent.text)+' · 기존 미래 일정은 건드리지 않고 다시 제안해요.</small><button class="tbtn" data-auto-act="replan" data-id="'+esc(g.parent.id)+'">복구 제안 보기</button>':risk?'<b>마감 전 시간이 부족해요</b><small>'+esc(risk.todo.text)+' · '+durText(risk.shortage)+' 부족</small><button class="tbtn" data-auto-act="risk-replan" data-id="'+esc(risk.todo.id)+'">다시 계산</button>':'<b>계획이 틀어져도 다시 살려요</b><small>할 일 · 마감 · 예상시간만 적으면 빈 시간에 나눠 제안해요. 확인 전에는 일정이 바뀌지 않아요.</small><button class="tbtn" data-auto-act="goto-todo">계획 제안 만들기</button>';
  card.innerHTML='<div class="card-h"><h3>PLANON 자동 계획</h3><span class="cnt">규칙 기반</span></div><div class="auto-core-copy">'+status+'</div><div class="auto-core-flow"><span>최소 입력</span><i></i><span>빈 시간 제안</span><i></i><span>확인 적용</span><i></i><span>다시 살리기</span></div>';
  var first=main.querySelector('.home,.card');if(first)first.parentNode.insertBefore(card,first);else main.prepend(card);
}

function studyPrefs(){
  var s=state(),x=s.settings||(s.settings={});
  return {buffer:Math.max(0,Math.min(50,Number(x.planBufferPct==null?20:x.planBufferPct))),daily:Math.max(60,Math.min(720,Number(x.planDailyMaxMin==null?180:x.planDailyMaxMin))),fridayOff:x.planFridayOff===true};
}
function injectSettings(){
  var u=ui();if(!u||u.tab!=='settings'||document.querySelector('.plan-buffer-settings'))return;
  var cards=document.querySelectorAll('#main .card');if(!cards.length)return;
  var pref=studyPrefs(),sec=document.createElement('section');sec.className='card plan-buffer-settings';
  sec.innerHTML='<div class="card-h"><h3>자동 계획</h3><span class="cnt">무리하지 않게</span></div><div class="setrow"><span>빈 시간 여유<small>자동 계획이 이 비율만큼 시간을 남겨둬요</small></span><select class="sel" id="plan-buffer-pct">'+[0,10,20,30,40].map(function(n){return '<option value="'+n+'"'+(pref.buffer===n?' selected':'')+'>'+n+'%</option>';}).join('')+'</select></div><div class="setrow"><span>하루 최대 자동 공부<small>자동으로 배치하는 공부 시간의 상한이에요</small></span><select class="sel" id="plan-daily-max">'+[120,180,240,300,360,480].map(function(n){return '<option value="'+n+'"'+(pref.daily===n?' selected':'')+'>'+durText(n)+'</option>';}).join('')+'</select></div><div class="setrow"><span>금요일 저녁 비우기<small>18시 이후에는 자동 계획을 잡지 않아요</small></span><button class="tbtn" data-auto-act="friday-off">'+(pref.fridayOff?'켜짐':'꺼짐')+'</button></div>';
  cards[0].parentNode.insertBefore(sec,cards[0].nextSibling);
}
function parseNaturalMeta(raw){
  var text=String(raw||'').trim(),out={text:text,estimateMin:0,due:'',course:''},m;
  m=text.match(/(?:약\s*)?(\d+(?:\.\d+)?)\s*시간(?:\s*(\d{1,2})\s*분)?/);
  if(m){out.estimateMin=Math.round(Number(m[1])*60+Number(m[2]||0));text=text.replace(m[0],' ');}
  else {m=text.match(/(?:약\s*)?(\d{2,3})\s*분/);if(m){out.estimateMin=Number(m[1]);text=text.replace(m[0],' ');}}
  var now=parseKey(todayKey()),names=['일','월','화','수','목','금','토'];
  m=text.match(/(이번\s*주|다음\s*주)?\s*([월화수목금토일])요일(?:까지|마감)?/);
  if(m){var target=names.indexOf(m[2]),cur=now.getDay(),add=(target-cur+7)%7;if(m[1]&&/다음/.test(m[1]))add+=7;if(add===0&&!m[1])add=7;out.due=dateKey(addDays(now,add));text=text.replace(m[0],' ');}
  if(!out.due){m=text.match(/(오늘|내일|모레)(?:까지|마감)?/);if(m){var n=m[1]==='오늘'?0:m[1]==='내일'?1:2;out.due=dateKey(addDays(now,n));text=text.replace(m[0],' ');}}
  var s=state(),courses=[];(s.classes||[]).forEach(function(c){if(c&&c.name&&courses.indexOf(c.name)<0)courses.push(c.name);});courses.sort(function(a,b){return b.length-a.length;});
  for(var i=0;i<courses.length;i++){if(text.indexOf(courses[i])>=0){out.course=courses[i];break;}}
  out.text=text.replace(/\s+/g,' ').trim();return out;
}
function learnedEstimate(text,course,base){
  var s=state(),vals=[];
  (s.todos||[]).forEach(function(t){if(!t||!t.done||t.splitParentId)return;var actual=Number(t.focusMin||0);if(Array.isArray(t.planChildIds))actual+=(s.todos||[]).filter(function(x){return x.splitParentId===t.id;}).reduce(function(n,x){return n+Number(x.focusMin||0);},0);var same=course&&t.course===course;if(!same&&text&&t.text){var a=text.split(/\s+/),b=t.text;same=a.some(function(w){return w.length>=2&&b.indexOf(w)>=0;});}if(same&&Number(t.estimateMin)>=20&&actual>0)vals.push(actual/Number(t.estimateMin));});
  if(vals.length<2)return {minutes:base,ratio:1,count:vals.length};vals=vals.slice(-6);var ratio=vals.reduce(function(a,b){return a+b;},0)/vals.length;ratio=Math.max(.65,Math.min(1.8,ratio));return {minutes:Math.max(20,Math.round(base*ratio/5)*5),ratio:ratio,count:vals.length};
}
function classActive(c,k){
  var from=c.from||'',to=c.to||'';
  return (!from||k>=from)&&(!to||k<=to)&&(!Array.isArray(c.skip)||c.skip.indexOf(k)<0);
}
function eventOn(e,k,d){
  if(e.date===k)return true;
  if(Array.isArray(e.days))return e.days.indexOf(dow(d))>=0&&(!e.from||k>=e.from)&&(!e.to||k<=e.to);
  return !!(e.from&&e.to&&k>=e.from&&k<=e.to);
}
function occupied(k){
  var s=state(),d=parseKey(k),w=dow(d),out=[];
  (s.classes||[]).forEach(function(c){
    if(c.day===w&&classActive(c,k)&&c.start&&c.end)out.push({start:toMin(c.start),end:toMin(c.end)});
  });
  (s.events||[]).forEach(function(e){
    if(!e.start||!eventOn(e,k,d))return;
    var st=toMin(e.start),en=e.end?toMin(e.end):Math.min(1440,st+30);
    out.push({start:st,end:en});
  });
  (s.todos||[]).forEach(function(t){
    if(t.done||t.scope!=='day'||t.key!==k||!t.time)return;
    var st=toMin(t.time);
    out.push({start:st,end:Math.min(1440,st+Number(t.dur||60))});
  });
  ((s.fsess&&s.fsess[k])||[]).forEach(function(x){
    if(!x.start)return;
    var st=toMin(x.start),en=x.end?toMin(x.end):st+Number(x.min||30);
    out.push({start:st,end:Math.max(st+15,en)});
  });
  return out.filter(function(x){return isFinite(x.start)&&isFinite(x.end)&&x.end>x.start;});
}
function mergeIntervals(xs){
  xs=xs.slice().sort(function(a,b){return a.start-b.start||a.end-b.end;});
  var out=[];
  xs.forEach(function(x){
    if(!out.length||x.start>out[out.length-1].end)out.push({start:x.start,end:x.end});
    else out[out.length-1].end=Math.max(out[out.length-1].end,x.end);
  });
  return out;
}
function freeForDay(k){
  var s=state(),d=parseKey(k);
  var start=Math.max(0,Number(s.settings&&s.settings.hStart!=null?s.settings.hStart:9)*60);
  var end=Math.min(1440,Number(s.settings&&s.settings.hEnd!=null?s.settings.hEnd:22)*60),pref=studyPrefs();
  if(pref.fridayOff&&d.getDay()===5)end=Math.min(end,18*60);
  if(k===todayKey()){
    var now=currentStudyMinute();
    start=Math.max(start,Math.ceil(now/10)*10);
  }
  if(end-start<20)return [];
  var occ=mergeIntervals(occupied(k).map(function(x){
    return {start:Math.max(start,x.start),end:Math.min(end,x.end)};
  }).filter(function(x){return x.end>x.start;}));
  var free=[],cur=start;
  occ.forEach(function(x){
    if(x.start-cur>=20)free.push({start:cur,end:x.start});
    cur=Math.max(cur,x.end);
  });
  if(end-cur>=20)free.push({start:cur,end:end});
  var keep=pref.buffer/100,used=0,cap=pref.daily;
  return free.map(function(iv){var len=iv.end-iv.start,allow=Math.floor(len*(1-keep)/10)*10,room=Math.max(0,cap-used),take=Math.min(allow,room);used+=take;return {start:iv.start,end:iv.start+take};}).filter(function(iv){return iv.end-iv.start>=20;});
}

function candidateDays(due){
  var today=parseKey(todayKey()),dd=parseKey(due),last=dd;
  if(dd>today)last=addDays(dd,-1); // 마감일 전까지 우선 배치
  var out=[];
  for(var d=today;d<=last;d=addDays(d,1)){
    var k=dateKey(d),free=freeForDay(k);
    if(free.length)out.push({date:k,d:new Date(d),free:free});
  }
  // 마감이 오늘이면 오늘을 사용.
  if(!out.length&&dateKey(dd)===dateKey(today)){
    var f=freeForDay(due);if(f.length)out.push({date:due,d:dd,free:f});
  }
  return out;
}

function takeFromInterval(iv,remaining){
  var len=iv.end-iv.start;
  if(len<20||remaining<=0)return 0;
  var want=remaining<=60?remaining:40;
  want=Math.min(want,len);
  want=Math.floor(want/10)*10;
  if(want<20)return 0;

  // 10분짜리 찌꺼기가 생기면 지금 블록을 조금 줄여 최소 20분짜리 다음 블록을 남겨요.
  var left=remaining-want;
  if(left>0&&left<20&&want>=30){
    var reduce=20-left;
    if(want-reduce>=20)want-=reduce;
  }
  return want;
}

function buildPlan(due,total){
  var days=candidateDays(due);
  var remaining=total,plan=[],round=0,guard=0;

  // 한 날짜에 몰아넣기보다 하루 한 블록씩 먼저 돌며 분산해요.
  while(remaining>0&&guard++<100){
    var placedThisRound=false;
    for(var i=0;i<days.length&&remaining>0;i++){
      var day=days[i],chosen=-1,take=0;
      for(var j=0;j<day.free.length;j++){
        var n=takeFromInterval(day.free[j],remaining);
        if(n>0){chosen=j;take=n;break;}
      }
      if(chosen<0)continue;
      var iv=day.free[chosen],st=iv.start,en=st+take;
      plan.push({date:day.date,start:st,end:en,dur:take});
      remaining-=take;
      iv.start=en;
      if(iv.end-iv.start<20)day.free.splice(chosen,1);
      placedThisRound=true;
    }
    if(!placedThisRound)break;
    round++;
  }
  plan.sort(function(a,b){return a.date<b.date?-1:a.date>b.date?1:a.start-b.start;});
  return {plan:plan,remaining:remaining,total:total};
}

function quickValues(){
  var u=ui(),input=document.querySelector('#main input[data-draft="quick"]');
  var raw=(input&&input.value||'').trim(),meta=parseNaturalMeta(raw);
  var due=(document.getElementById('q-due')&&document.getElementById('q-due').value)||(u&&u.qdue)||meta.due||'';
  var course=(document.getElementById('q-course')&&document.getElementById('q-course').value)||(u&&u.qcourse)||meta.course||'';
  var base=meta.estimateMin||estValue(),learn=learnedEstimate(meta.text,course,base);
  return {text:meta.text||raw,raw:raw,due:due,course:course,total:learn.minutes,baseTotal:base,learn:learn};
}

function preview(){
  var u=ui(),v=quickValues();
  saveEst(v.total);
  if(!v.text){B.toast('할 일을 먼저 적어주세요');var inp=document.querySelector('#main input[data-draft="quick"]');if(inp)inp.focus();return;}
  if(!v.due){
    if(u){u.qopt=true;B.render(false);}
    setTimeout(function(){var d=document.getElementById('q-due');if(d){d.focus();d.scrollIntoView({behavior:'smooth',block:'center'});}},80);
    B.toast('마감일을 먼저 정해주세요');
    return;
  }
  if(v.due<todayKey()){B.toast('이미 지난 마감일이에요');return;}
  if(v.total<20){B.toast('예상 소요시간은 20분 이상으로 적어주세요');return;}

  var r=buildPlan(v.due,v.total);
  var dueD=parseKey(v.due);
  var rows=r.plan.map(function(p){
    var d=parseKey(p.date);
    return '<div class="auto-plan-row"><span><b>'+DAYS[dow(d)]+' '+md(d)+'</b><small>'+hm(p.start)+'–'+hm(p.end)+'</small></span><em>'+durText(p.dur)+'</em></div>';
  }).join('');

  var learned=v.learn&&v.learn.count>=2&&v.total!==v.baseTotal?'<br>최근 비슷한 할 일 '+v.learn.count+'개 기준 '+durText(v.baseTotal)+' → '+durText(v.total)+'으로 보정했어요.':''; var head='<div class="auto-plan-summary"><b>'+esc(v.text)+'</b><br>마감 '+md(dueD)+' · 예상 '+durText(v.total)+learned+'<br>여유시간 설정을 지키며 하루에 한 블록씩 먼저 나눠 배치해요.</div>';
  if(r.remaining>0){
    B.openModal('<h3>빈 시간이 조금 부족해요</h3>'+head+
      (rows?'<div class="auto-plan-preview">'+rows+'</div>':'')+
      '<div class="auto-plan-warn">'+durText(r.remaining)+'을 넣을 빈 시간이 더 필요해요. 시간표 시간 범위나 기존 일정을 확인해주세요.</div>'+
      '<div class="acts"><button class="b-save" data-auto-act="close">확인</button></div>');
    return;
  }

  window.__PLANON_AUTO_PREVIEW={values:v,result:r};
  B.openModal('<h3>이렇게 나눠 넣을까요?</h3>'+head+
    '<div class="auto-plan-preview">'+rows+'</div>'+
    '<p class="hint">시간표·약속·시간이 정해진 할 일·집중 기록과 겹치지 않게 계산했어요.</p>'+
    '<div class="acts"><button class="b-ghost" data-auto-act="close">취소</button><button class="b-save" data-auto-act="confirm">이대로 넣기</button></div>');
}

function commit(){
  var p=window.__PLANON_AUTO_PREVIEW;
  if(!p||!p.values||!p.result||p.result.remaining>0)return;
  var s=state(),u=ui(),v=p.values,slots=p.result.plan,now=Date.now();
  var parentId=uid();
  var parent={
    id:parentId,text:v.text,done:false,star:false,scope:'inbox',key:null,
    due:v.due,course:v.course||'',time:null,created:now,order:now,
    estimateMin:v.total,originalEstimateMin:v.baseTotal||v.total,planTotalMin:v.total,planBlockMin:40,
    planChildIds:[],planCreatedAt:now,planUnscheduledMin:0,autoPlan:true
  };
  var children=slots.map(function(x,i){
    var id=uid();parent.planChildIds.push(id);
    return {
      id:id,text:v.text+' · '+(i+1),done:false,star:false,scope:'day',key:x.date,
      due:v.due,course:v.course||'',time:hm(x.start),dur:x.dur,
      created:now+i+1,order:now+i+1,carried:false,carryCount:0,
      splitParentId:parentId,splitIndex:i+1,autoPlanChild:true
    };
  });
  s.todos.push(parent);
  children.forEach(function(x){s.todos.push(x);});
  if(u){
    if(u.drafts)delete u.drafts.quick;
    u.qdue='';
  }
  saveEst(120);
  window.__PLANON_AUTO_PREVIEW=null;
  B.save();B.closeModal();B.render(true);
  B.toast('빈 시간에 '+children.length+'개로 나눠 넣었어요');
}



function riskRows(){
  var s=state(),tk=todayKey(),out=[];
  (s.todos||[]).filter(function(t){return t&&!t.done&&!t.splitParentId&&t.due&&t.due>=tk&&(Number(t.estimateMin||t.planTotalMin)>0);}).forEach(function(t){
    var kids=(s.todos||[]).filter(function(x){return x.splitParentId===t.id;}),done=kids.filter(function(x){return x.done;}).reduce(function(n,x){return n+Number(x.dur||0);},0),actual=Number(t.focusMin||0)+kids.reduce(function(n,x){return n+Number(x.focusMin||0);},0),total=Number(t.estimateMin||t.planTotalMin||0),remain=Math.max(0,total-Math.max(done,actual));
    if(remain<20)return;var cap=0,days=candidateDays(t.due);days.forEach(function(day){day.free.forEach(function(iv){cap+=iv.end-iv.start;});});var shortage=Math.max(0,remain-cap);if(shortage>0)out.push({todo:t,remain:remain,capacity:cap,shortage:shortage});
  });return out.sort(function(a,b){return b.shortage-a.shortage||String(a.todo.due).localeCompare(String(b.todo.due));});
}
function injectRiskRadar(){
  var u=ui();if(!u||['home','todo'].indexOf(u.tab)<0||document.querySelector('.deadline-radar'))return;var r=riskRows()[0];if(!r)return;var main=document.querySelector('#main');if(!main)return;var card=document.createElement('section');card.className='deadline-radar';card.innerHTML='<b>마감 전에 '+durText(r.shortage)+' 부족해요</b><small>'+esc(r.todo.text)+' · 남은 작업 '+durText(r.remain)+' / 현재 빈 시간 '+durText(r.capacity)+'<br>지금 일정대로면 마감 전에 필요한 시간이 모자라요.</small><div class="acts"><button class="tbtn" data-auto-act="risk-replan" data-id="'+esc(r.todo.id)+'">일정 다시 짜기</button></div>';var first=main.querySelector('.card,.home');if(first)first.parentNode.insertBefore(card,first.nextSibling);else main.prepend(card);
}
function riskReplan(id){var s=state(),t=(s.todos||[]).find(function(x){return x.id===id;});if(!t)return;var total=Number(t.estimateMin||t.planTotalMin||120),kids=(s.todos||[]).filter(function(x){return x.splitParentId===id;}),done=kids.filter(function(x){return x.done;}).reduce(function(n,x){return n+Number(x.dur||0);},0),remain=Math.max(20,total-done),r=buildPlan(t.due,remain),rows=r.plan.map(function(p){var d=parseKey(p.date);return '<div class="auto-plan-row"><span><b>'+DAYS[dow(d)]+' '+md(d)+'</b><small>'+hm(p.start)+'–'+hm(p.end)+'</small></span><em>'+durText(p.dur)+'</em></div>';}).join('');B.openModal('<h3>마감 위험 다시 계산</h3><div class="auto-plan-summary"><b>'+esc(t.text)+'</b><br>남은 작업 '+durText(remain)+' · 확보 가능한 시간 '+durText(remain-r.remaining)+'</div><div class="auto-plan-preview">'+rows+'</div>'+(r.remaining?'<div class="auto-plan-warn">아직 '+durText(r.remaining)+'이 부족해요. 다른 일정 이동이나 하루 최대 공부시간 조정이 필요해요.</div>':'<p class="hint">현재 설정으로 마감 전 배치가 가능해요.</p>')+'<div class="acts"><button class="b-save" data-auto-act="close">확인</button></div>');}
function missedGroups(){
  var s=state(),tk=todayKey(),parents={};
  (s.todos||[]).forEach(function(t){if(t&&t.autoPlan&&t.id)parents[t.id]=t;});
  var groups={};
  (s.todos||[]).forEach(function(t){
    if(!t||!t.autoPlanChild||t.done||!t.splitParentId||!t.key||t.key>=tk)return;
    var p=parents[t.splitParentId];if(!p||p.done||!p.due||p.due<tk)return;
    (groups[p.id]||(groups[p.id]={parent:p,children:[],minutes:0})).children.push(t);
    groups[p.id].minutes+=Number(t.dur||40);
  });
  return Object.keys(groups).map(function(k){return groups[k];}).sort(function(x,y){return String(x.parent.due).localeCompare(String(y.parent.due));});
}
function injectReplan(card){
  var u=ui();if(!u||u.tab!=='todo'||!card)return;
  var old=document.querySelectorAll('.auto-replan');old.forEach(function(x){x.remove();});
  var g=missedGroups()[0];if(!g)return;
  var el=document.createElement('div');el.className='auto-replan';
  el.innerHTML='<span><b>못 한 계획 '+durText(g.minutes)+'이 남았어요</b><small>'+esc(g.parent.text)+' · 마감 '+esc(g.parent.due)+' · 빈 시간에 다시 나눠 넣을 수 있어요</small></span><button class="tbtn" data-auto-act="replan" data-id="'+esc(g.parent.id)+'">다시 배치</button>';
  card.parentNode.insertBefore(el,card.nextSibling);
}
function groupByParent(id){return missedGroups().filter(function(g){return g.parent.id===id;})[0]||null;}
function previewReplan(id){
  var g=groupByParent(id);if(!g){B.toast('다시 배치할 미완료 계획이 없어요');return;}
  var r=buildPlan(g.parent.due,g.minutes),rows=r.plan.map(function(p){var d=parseKey(p.date);return '<div class="auto-plan-row"><span><b>'+DAYS[dow(d)]+' '+md(d)+'</b><small>'+hm(p.start)+'–'+hm(p.end)+'</small></span><em>'+durText(p.dur)+'</em></div>';}).join('');
  if(r.remaining>0){B.openModal('<h3>빈 시간이 조금 부족해요</h3><div class="auto-plan-summary"><b>'+esc(g.parent.text)+'</b><br>남은 '+durText(g.minutes)+' · 마감 '+esc(g.parent.due)+'</div>'+(rows?'<div class="auto-plan-preview">'+rows+'</div>':'')+'<div class="auto-plan-warn">'+durText(r.remaining)+'을 넣을 시간이 더 필요해요.</div><div class="acts"><button class="b-save" data-auto-act="close">확인</button></div>');return;}
  window.__PLANON_REPLAN_PREVIEW={parentId:id,group:g,result:r};
  B.openModal('<h3>못 한 분량을 다시 넣을까요?</h3><div class="auto-plan-summary"><b>'+esc(g.parent.text)+'</b><br>남은 '+durText(g.minutes)+' · 마감 '+esc(g.parent.due)+'<br>기존 미래 계획은 건드리지 않고, 지나간 미완료 블록만 다시 배치해요.</div><div class="auto-plan-preview">'+rows+'</div><div class="acts"><button class="b-ghost" data-auto-act="close">취소</button><button class="b-save" data-auto-act="replan-confirm">적용</button></div>');
}
function commitReplan(){
  var q=window.__PLANON_REPLAN_PREVIEW;if(!q||!q.group||!q.result||q.result.remaining>0)return;
  var s=state(),g=q.group,p=g.parent,old=g.children.slice(),slots=q.result.plan,now=Date.now(),ids=(p.planChildIds||[]).slice();
  var used=[];
  slots.forEach(function(x,i){
    var t=old[i];
    if(!t){t={id:uid(),text:p.text,done:false,star:false,scope:'day',due:p.due,course:p.course||'',created:now+i,order:now+i,carried:false,carryCount:0,splitParentId:p.id,autoPlanChild:true};s.todos.push(t);ids.push(t.id);}
    t.scope='day';t.key=x.date;t.time=hm(x.start);t.dur=x.dur;t.done=false;t.carried=false;t.rescheduledAt=now;used.push(t.id);
  });
  var drop=old.slice(slots.length).map(function(t){return t.id;});
  if(drop.length){s.todos=s.todos.filter(function(t){return drop.indexOf(t.id)<0;});ids=ids.filter(function(id){return drop.indexOf(id)<0;});}
  p.planChildIds=ids;
  var kids=(s.todos||[]).filter(function(t){return t.splitParentId===p.id&&t.autoPlanChild;}).sort(function(x,y){return String(x.key).localeCompare(String(y.key))||toMin(x.time)-toMin(y.time);});
  kids.forEach(function(t,i){t.splitIndex=i+1;t.text=p.text+' · '+(i+1);});
  window.__PLANON_REPLAN_PREVIEW=null;B.save();B.closeModal();B.render(true);B.toast('못 한 '+durText(g.minutes)+'을 다시 배치했어요');
}
function click(e){
  var a=e.target.closest&&e.target.closest('[data-auto-act]');
  if(!a)return;
  var act=a.dataset.autoAct;
  if(act==='goto-todo'){if(B.setTab)B.setTab('todo');else{var t=document.querySelector('[data-tab="todo"]');if(t)t.click();}return;}
  if(act==='preview'){preview();return;}
  if(act==='confirm'){commit();return;}
  if(act==='replan'){previewReplan(a.dataset.id||'');return;}
  if(act==='risk-replan'){riskReplan(a.dataset.id||'');return;}
  if(act==='friday-off'){var ss=state();ss.settings.planFridayOff=!ss.settings.planFridayOff;B.save();B.render(true);return;}
  if(act==='replan-confirm'){commitReplan();return;}
  if(act==='close'){window.__PLANON_AUTO_PREVIEW=null;window.__PLANON_REPLAN_PREVIEW=null;B.closeModal();return;}
}
function input(e){
  if(e.target&&e.target.id==='auto-est-min')saveEst(estValue());
}
function change(e){var s=state();if(!e.target)return;if(e.target.id==='plan-buffer-pct'){s.settings.planBufferPct=Number(e.target.value)||0;B.save();B.render(true);}if(e.target.id==='plan-daily-max'){s.settings.planDailyMaxMin=Number(e.target.value)||180;B.save();B.render(true);}}

document.addEventListener('click',click);
document.addEventListener('input',input);
document.addEventListener('change',change);
window.PLANON_AUTOSCHEDULE={afterRender:inject,preview:preview,parseNaturalMeta:parseNaturalMeta,learnedEstimate:learnedEstimate};
inject();

})();