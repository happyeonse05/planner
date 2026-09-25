(function(){
'use strict';
var B=window.PLANON_UX_BRIDGE;
if(!B)return;

function state(){return B.state&&B.state();}
function ui(){return B.ui&&B.ui();}
function modal(){return B.modal&&B.modal();}
function todo(id){var s=state();return s&&Array.isArray(s.todos)?s.todos.find(function(x){return x.id===id;}):null;}
function now(){return Date.now();}
function dateKey(ts){try{return B.dkey(new Date(ts));}catch(e){return '';}}
function sessions(t){if(!t)return[];if(!Array.isArray(t.workSessions))t.workSessions=[];return t.workSessions;}
function activeStart(t){var n=Number(t&&t.workStartedAt||0);return Number.isFinite(n)&&n>0?n:0;}
function totalSec(t,includeActive){
  if(!t)return 0;
  var sec=sessions(t).reduce(function(n,x){
    if(!x||typeof x!=='object')return n;
    var s=Number(x.sec);
    if(!Number.isFinite(s)||s<0)s=Math.max(0,Number(x.min||0)*60);
    return n+s;
  },0);
  var st=activeStart(t);
  if(includeActive!==false&&st)sec+=Math.max(0,Math.round((now()-st)/1000));
  return Math.max(0,Math.round(sec));
}
function todaySec(t){
  var k=B.todayKey(),sec=0;
  sessions(t).forEach(function(x){
    if(!x||typeof x!=='object')return;
    var dk=x.date||dateKey(Number(x.startAt||0));
    if(dk!==k)return;
    var s=Number(x.sec);if(!Number.isFinite(s)||s<0)s=Math.max(0,Number(x.min||0)*60);
    sec+=s;
  });
  var st=activeStart(t);if(st&&dateKey(st)===k)sec+=Math.max(0,Math.round((now()-st)/1000));
  return Math.max(0,Math.round(sec));
}
function weekBounds(){
  var d=new Date(),day=d.getDay(),delta=day===0?-6:1-day;
  var a=new Date(d.getFullYear(),d.getMonth(),d.getDate()+delta,0,0,0,0);
  var b=new Date(a);b.setDate(a.getDate()+7);return [a.getTime(),b.getTime()];
}
function sessionSec(x){
  if(!x||typeof x!=='object')return 0;var s=Number(x.sec);
  if(!Number.isFinite(s)||s<0)s=Math.max(0,Number(x.min||0)*60);return Math.max(0,s);
}
function weekSec(t){
  if(!t)return 0;var w=weekBounds(),sec=0;
  sessions(t).forEach(function(x){var ts=Number(x&&x.startAt||0);if(!ts&&x&&x.date){try{ts=new Date(x.date+'T12:00:00').getTime();}catch(e){ts=0;}}if(ts>=w[0]&&ts<w[1])sec+=sessionSec(x);});
  var st=activeStart(t);if(st>=w[0]&&st<w[1])sec+=Math.max(0,Math.round((now()-st)/1000));
  return Math.max(0,Math.round(sec));
}
function courseWeekSec(name){
  var s=state();if(!s||!Array.isArray(s.todos)||!name)return 0;
  return s.todos.filter(function(t){return String(t.course||'')===String(name);}).reduce(function(n,t){return n+weekSec(t);},0);
}

function fmt(sec){
  sec=Math.max(0,Math.round(Number(sec)||0));
  if(sec<60)return sec>0?'<1분':'0분';
  var min=Math.floor(sec/60),h=Math.floor(min/60),m=min%60;
  if(!h)return min+'분';
  return h+'시간'+(m?' '+m+'분':'');
}
function summary(t){
  var active=activeStart(t),tot=totalSec(t,true),today=todaySec(t);
  if(active)return {active:true,short:'진행 '+fmt(Math.max(1,Math.round((now()-active)/1000))),today:today,total:tot};
  return {active:false,short:tot?'작업 '+fmt(tot):'',today:today,total:tot};
}
function syncLegacy(t){
  if(!t)return;
  var sec=totalSec(t,false);t.workSec=sec;t.workMin=Math.floor(sec/60);
}
function stop(t,silent){
  if(!t)return 0;
  var st=activeStart(t);if(!st)return 0;
  var en=now(),sec=Math.max(1,Math.round((en-st)/1000));
  sessions(t).push({startAt:st,endAt:en,sec:sec,min:Math.floor(sec/60),date:dateKey(st)});
  if(t.workSessions.length>500)t.workSessions=t.workSessions.slice(-500);
  t.workStartedAt=null;
  syncLegacy(t);
  if(!silent&&B.toast)B.toast('작업 '+fmt(sec)+' 기록했어요');
  return sec;
}
function stopOther(activeId){
  var s=state(),changed=false;
  if(!s||!Array.isArray(s.todos))return false;
  s.todos.forEach(function(x){if(x.id!==activeId&&activeStart(x)){stop(x,true);changed=true;}});
  return changed;
}
function start(t){
  if(!t)return;
  if(t.done){if(B.toast)B.toast('완료한 할 일은 다시 열고 시작해 주세요');return;}
  if(activeStart(t)){stop(t,false);B.save();decorateAll();return;}
  var moved=stopOther(t.id);
  t.workStartedAt=now();
  if(!Array.isArray(t.workSessions))t.workSessions=[];
  B.save();
  if(B.toast)B.toast(moved?'이전 작업을 끝내고 새 작업을 시작했어요':'작업 기록을 시작했어요 · 화면을 닫아도 계속 계산돼요');
  decorateAll();
}
function end(t){if(!t||!activeStart(t))return;stop(t,false);B.save();decorateAll();}

function rowButton(t){
  var b=document.createElement('button');
  b.type='button';b.className='worklog-btn';b.dataset.workAction=activeStart(t)?'stop':'start';b.dataset.workId=t.id;
  b.setAttribute('aria-label',activeStart(t)?'작업 기록 끝내기':'작업 기록 시작');
  return b;
}
function decorateRow(row){
  var id=row&&row.dataset&&row.dataset.tid,t=id&&todo(id);if(!t)return;
  var q=summary(t),txt=row.querySelector('.ttxt');
  var cm=row.querySelector('.todo-course-meta'),cw=cm&&cm.querySelector('.todo-course-week');
  if(cw&&t.course){var ws=courseWeekSec(t.course),wt=ws?'이번 주 '+fmt(ws):'이번 주 0분';if(cw.textContent!==wt)cw.textContent=wt;}
  var tag=row.querySelector('.worklog-tag');
  if(q.short){
    if(!tag){tag=document.createElement('em');tag.className='worklog-tag';if(cm)cm.insertAdjacentElement('afterend',tag);else if(txt)txt.appendChild(tag);}
    if(tag.textContent!==q.short)tag.textContent=q.short;tag.classList.toggle('active',q.active);
  }else if(tag)tag.remove();

  var btn=row.querySelector('.worklog-btn');
  if(t.done){if(btn)btn.remove();return;}
  if(!btn){
    btn=rowButton(t);
    var focus=row.querySelector('.rowfocus'),del=row.querySelector('.tododel'),grip=row.querySelector('.grip');
    if(focus)row.insertBefore(btn,focus);else if(del)row.insertBefore(btn,del);else if(grip)row.insertBefore(btn,grip);else row.appendChild(btn);
  }
  btn.dataset.workAction=q.active?'stop':'start';btn.dataset.workId=t.id;
  var bt=q.active?'끝':'시작';if(btn.textContent!==bt)btn.textContent=bt;
  btn.classList.toggle('active',q.active);
  btn.setAttribute('aria-label',q.active?'작업 기록 끝내기':'작업 기록 시작');
  btn.title=q.active?('현재 '+fmt(Math.max(1,Math.round((now()-activeStart(t))/1000)))+' 기록 중'):'타이머 화면 없이 작업시간 기록';
}
function modalPanel(t){
  var sh=document.querySelector('#modal .sheet');if(!sh||!t)return;
  var panel=sh.querySelector('.worklog-modal-panel');
  if(!panel){
    panel=document.createElement('div');panel.className='worklog-modal-panel';
    var focus=sh.querySelector('[data-act="focus-todo"]'),acts=sh.querySelector('.acts');
    if(focus)focus.before(panel);else if(acts)acts.before(panel);else sh.appendChild(panel);
  }
  var q=summary(t),parts=[];
  if(q.today)parts.push('오늘 '+fmt(q.today));
  if(q.total&&q.total!==q.today)parts.push('총 '+fmt(q.total));
  if(!parts.length)parts.push('아직 기록 없음');
  panel.innerHTML='<div class="worklog-modal-copy"><b>작업시간 기록</b><small>'+parts.join(' · ')+'</small></div>'+ 
    '<button type="button" class="worklog-modal-btn'+(q.active?' active':'')+'" data-work-action="'+(q.active?'stop':'start')+'" data-work-id="'+String(t.id).replace(/"/g,'&quot;')+'">'+(q.active?'끝내기':'시작')+'</button>';
}
function decorateModal(){
  var m=modal();if(!m||m.type!=='todo'||!m.id)return;
  var t=todo(m.id);if(t)modalPanel(t);
}
function decorateCourseWeeks(){
  document.querySelectorAll('.course .cname[data-name]').forEach(function(b){
    var name=b.dataset.name||'',row=b.closest('.course');if(!row||!name)return;
    var host=row.querySelector('.course-week-study');if(!host){host=document.createElement('span');host.className='course-week-study';var cd=row.querySelector('.cd');if(cd)cd.insertAdjacentElement('afterend',host);else b.insertAdjacentElement('afterend',host);}
    var sec=courseWeekSec(name),ht='이번 주 공부 '+fmt(sec);if(host.textContent!==ht)host.textContent=ht;
  });
}
function decorateAll(){
  document.querySelectorAll('li.todo[data-tid]').forEach(decorateRow);
  decorateCourseWeeks();
  decorateModal();
}

var queued=false,mainObserver=null,modalObserver=null,watchTimer=null;
function queue(){if(queued)return;queued=true;setTimeout(function(){queued=false;decorateAllSafe();},20);}
var main=document.getElementById('main'),mod=document.getElementById('modal');
function watchWorklog(){
  if(main&&mainObserver)mainObserver.observe(main,{childList:true,subtree:true});
  if(mod&&modalObserver)modalObserver.observe(mod,{childList:true,subtree:true});
}
function decorateAllSafe(){
  if(mainObserver)mainObserver.disconnect();if(modalObserver)modalObserver.disconnect();
  decorateAll();clearTimeout(watchTimer);watchTimer=setTimeout(watchWorklog,0);
}
if(main){mainObserver=new MutationObserver(queue);}
if(mod){modalObserver=new MutationObserver(queue);}
watchWorklog();

document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('[data-work-action]');if(!b)return;
  e.preventDefault();e.stopPropagation();
  var t=todo(b.dataset.workId);if(!t)return;
  if(b.dataset.workAction==='stop')end(t);else start(t);
},true);

/* 완료 체크를 누르면 진행 중 작업만 먼저 종료하고, 완료 여부는 기존 앱이 처리해요. */
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('[data-act]');if(!a)return;
  if(a.dataset.act==='toggle'){
    var t=todo(a.dataset.id);if(t&&!t.done&&activeStart(t)){stop(t,true);B.save();}
  }
  /* 집중 타이머로 전환할 때 단순 작업기록과 시간이 겹치지 않게 종료해요. */
  if(a.dataset.act==='focus-todo'){
    var s=state(),changed=false;
    if(s&&Array.isArray(s.todos))s.todos.forEach(function(t){if(activeStart(t)){stop(t,true);changed=true;}});
    if(changed){B.save();if(B.toast)B.toast('작업 기록을 끝내고 집중 타이머로 전환했어요');}
  }
},true);

/* 앱을 다시 열어도 workStartedAt이 todo에 저장되어 있어서 그대로 이어져요. */
setInterval(function(){
  var s=state();if(s&&Array.isArray(s.todos)&&s.todos.some(function(t){return !!activeStart(t);})){decorateAll();}
},15000);

window.PLANON_WORKLOG={start:start,end:end,totalSec:totalSec,todaySec:todaySec,weekSec:weekSec,courseWeekSec:courseWeekSec,decorate:decorateAll};
decorateAllSafe();
})();
