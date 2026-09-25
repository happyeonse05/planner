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
  .auto-plan-summary{padding:11px 12px;border-radius:12px;background:color-mix(in srgb,var(--planner-color) 24%,var(--card));font-size:12px;line-height:1.5}
  .auto-plan-warn{padding:11px 12px;border-radius:12px;background:color-mix(in srgb,var(--now) 10%,var(--card));color:var(--ink);font-size:12px;line-height:1.5}
  [data-act="split-todo-open"]{display:none!important}
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
  if(!u||u.tab!=='todo'||u.qscope==='routine')return;
  var input=document.querySelector('#main input[data-draft="quick"]');
  if(!input)return;
  var card=input.closest('.card');
  if(!card||card.querySelector('.auto-plan-controls'))return;

  var box=document.createElement('div');
  box.className='auto-plan-controls';
  box.innerHTML=
    '<label class="auto-plan-est"><span>예상 소요시간</span><input id="auto-est-min" type="number" min="20" max="720" step="10" inputmode="numeric" value="'+storedEst()+'"><em>분</em></label>'+
    '<button class="auto-plan-btn" data-auto-act="preview">빈 시간에 넣기</button>'+
    '<div class="auto-plan-hint">마감일까지 시간표·약속·시간이 정해진 할 일을 피해 나눠 넣어요.</div>';
  card.appendChild(box);
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
  var end=Math.min(1440,Number(s.settings&&s.settings.hEnd!=null?s.settings.hEnd:22)*60);
  if(k===dateKey(new Date())){
    var n=new Date(),now=n.getHours()*60+n.getMinutes();
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
  return free;
}

function candidateDays(due){
  var today=parseKey(dateKey(new Date())),dd=parseKey(due),last=dd;
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
  var text=(input&&input.value||'').trim();
  var due=(document.getElementById('q-due')&&document.getElementById('q-due').value)||(u&&u.qdue)||'';
  var course=(document.getElementById('q-course')&&document.getElementById('q-course').value)||(u&&u.qcourse)||'';
  return {text:text,due:due,course:course,total:estValue()};
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
  if(v.due<dateKey(new Date())){B.toast('이미 지난 마감일이에요');return;}
  if(v.total<20){B.toast('예상 소요시간은 20분 이상으로 적어주세요');return;}

  var r=buildPlan(v.due,v.total);
  var dueD=parseKey(v.due);
  var rows=r.plan.map(function(p){
    var d=parseKey(p.date);
    return '<div class="auto-plan-row"><span><b>'+DAYS[dow(d)]+' '+md(d)+'</b><small>'+hm(p.start)+'–'+hm(p.end)+'</small></span><em>'+durText(p.dur)+'</em></div>';
  }).join('');

  var head='<div class="auto-plan-summary"><b>'+esc(v.text)+'</b><br>마감 '+md(dueD)+' · 예상 '+durText(v.total)+'<br>가능하면 하루에 한 블록씩 먼저 나눠 배치해요.</div>';
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
    estimateMin:v.total,planTotalMin:v.total,planBlockMin:40,
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

function click(e){
  var a=e.target.closest&&e.target.closest('[data-auto-act]');
  if(!a)return;
  var act=a.dataset.autoAct;
  if(act==='preview'){preview();return;}
  if(act==='confirm'){commit();return;}
  if(act==='close'){window.__PLANON_AUTO_PREVIEW=null;B.closeModal();return;}
}
function input(e){
  if(e.target&&e.target.id==='auto-est-min')saveEst(estValue());
}

document.addEventListener('click',click);
document.addEventListener('input',input);
window.PLANON_AUTOSCHEDULE={afterRender:inject,preview:preview};
inject();

})();