(function(){
'use strict';

var B=window.PLANON_UX_BRIDGE;
if(!B)return;

var OWNER_HASH='fa6d5343119fead06dbea76aedcfbcfeae0c2d727cfd38e455c2228834d9b99c';
var access=null,checking=false,lastIdentity='';
var selectedDate='';

function state(){return B.state&&B.state();}
function ui(){return B.ui&&B.ui();}
function account(){return B.account?B.account():{email:'',uid:'',loggedIn:false};}
function pad(n){return String(n).padStart(2,'0');}
function todayKey(){var d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function uid(){try{return crypto.randomUUID();}catch(e){return 'pt-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10);}}
function monthPrefix(k){return String(k||todayKey()).slice(0,7);}
function fmt(n){
  n=Number(n||0);
  if(!isFinite(n))n=0;
  var sign=n>0?'+':'';
  return sign+n.toLocaleString('ko-KR',{maximumFractionDigits:2});
}
function sum(xs){return (xs||[]).reduce(function(a,x){return a+Number(x.value||0);},0);}

function store(){
  var s=state();
  if(!s||!s.settings)return null;
  if(!s.settings.privateTally||typeof s.settings.privateTally!=='object'||Array.isArray(s.settings.privateTally)){
    s.settings.privateTally={};
  }
  return s.settings.privateTally;
}
function entries(k){
  var st=store();if(!st)return [];
  if(!Array.isArray(st[k]))st[k]=[];
  return st[k];
}
function dayTotal(k){return sum(entries(k));}
function monthTotal(k){
  var st=store(),pre=monthPrefix(k),total=0;
  if(!st)return 0;
  Object.keys(st).forEach(function(day){
    if(day.slice(0,7)===pre&&Array.isArray(st[day]))total+=sum(st[day]);
  });
  return total;
}
function cleanup(){
  var st=store();if(!st)return;
  Object.keys(st).forEach(function(k){if(!Array.isArray(st[k])||!st[k].length)delete st[k];});
}

async function sha256(s){
  if(!(window.crypto&&crypto.subtle&&window.TextEncoder))return '';
  var data=new TextEncoder().encode(String(s||'').trim().toLowerCase());
  var buf=await crypto.subtle.digest('SHA-256',data);
  return Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
}
function checkAccess(){
  var a=account(),identity=(a.uid||'')+'|'+String(a.email||'').toLowerCase();
  if(identity!==lastIdentity){lastIdentity=identity;access=null;}
  if(!a.loggedIn||!a.email){access=false;return Promise.resolve(false);}
  if(access!==null)return Promise.resolve(access);
  if(checking)return Promise.resolve(false);
  checking=true;
  return sha256(a.email).then(function(h){
    access=(h===OWNER_HASH);
    return access;
  }).catch(function(){access=false;return false;}).finally(function(){checking=false;});
}

function addStyles(){
  if(document.getElementById('planon-private-tally-css'))return;
  var st=document.createElement('style');
  st.id='planon-private-tally-css';
  st.textContent=`
  .private-tally-card .setrow{border-bottom:0}
  .private-tally-date{display:grid;grid-template-columns:auto 1fr auto;gap:7px;align-items:center;margin:4px 0 11px}
  .private-tally-date button{height:40px;min-width:40px;border-radius:11px;background:var(--soft);font-weight:800;text-align:center}
  .private-tally-date input{height:40px;border:1px solid var(--line);border-radius:11px;background:var(--bg);padding:0 10px;color:var(--ink);font:inherit;text-align:center}
  .private-tally-total{text-align:center;padding:17px 8px 15px}
  .private-tally-total small{display:block;color:var(--sub);font-size:12px}
  .private-tally-total b{display:block;margin-top:3px;font-size:38px;letter-spacing:-.04em;font-variant-numeric:tabular-nums}
  .private-tally-month{margin-top:4px;color:var(--sub);font-size:12px}
  .private-tally-add{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px;margin-bottom:13px}
  .private-tally-add input{height:44px;border:1px solid var(--line);border-radius:12px;background:var(--bg);padding:0 12px;color:var(--ink);font:inherit;font-size:17px;font-variant-numeric:tabular-nums}
  .private-tally-add button{height:44px;padding:0 15px;border-radius:12px;background:var(--planner-color);color:var(--planner-ink,#1c1c1e);font-weight:800}
  .private-tally-list{border-top:1px solid var(--line)}
  .private-tally-row{display:flex;align-items:center;gap:8px;min-height:45px;border-bottom:1px solid var(--line)}
  .private-tally-row b{font-size:16px;font-variant-numeric:tabular-nums}
  .private-tally-row small{margin-left:auto;color:var(--sub);font-size:11px}
  .private-tally-row button{width:28px;height:28px;border-radius:9px;color:var(--sub);text-align:center}
  .private-tally-empty{padding:20px 4px;text-align:center;color:var(--sub);font-size:13px}
  `;
  document.head.appendChild(st);
}

function injectSettings(){
  addStyles();
  var u=ui(),main=document.getElementById('main');
  if(!main||!u||u.tab!=='settings'||u.settingsPage)return;
  if(main.querySelector('[data-private-tally-card]'))return;

  checkAccess().then(function(ok){
    var nowU=ui(),nowMain=document.getElementById('main');
    if(!ok||!nowMain||!nowU||nowU.tab!=='settings'||nowU.settingsPage||nowMain.querySelector('[data-private-tally-card]'))return;
    var card=document.createElement('section');
    card.className='card private-tally-card';
    card.setAttribute('data-private-tally-card','1');
    card.innerHTML='<button class="setrow chatrow" data-private-tally="open"><span>숫자 합계<small>이름 없이 숫자만 더해서 날짜별 합계를 남겨요</small></span><span class="chev">›</span></button>';
    var cards=nowMain.querySelectorAll(':scope > section.card');
    if(cards.length)cards[cards.length-1].before(card);else nowMain.appendChild(card);
  });
}

function moveDay(delta){
  var d=new Date((selectedDate||todayKey())+'T12:00:00');
  d.setDate(d.getDate()+delta);
  selectedDate=d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
  draw();
}
function draw(){
  if(access!==true)return;
  selectedDate=selectedDate||todayKey();
  var list=entries(selectedDate).slice().sort(function(a,b){return Number(a.at||0)-Number(b.at||0);});
  var rows=list.map(function(x){
    var d=new Date(Number(x.at)||Date.now());
    return '<div class="private-tally-row"><b>'+esc(fmt(x.value))+'</b><small>'+pad(d.getHours())+':'+pad(d.getMinutes())+'</small><button data-private-tally="delete" data-id="'+esc(x.id)+'" aria-label="삭제">×</button></div>';
  }).join('');
  var ym=monthPrefix(selectedDate).split('-');
  B.openModal('<h3>숫자 합계</h3>'+
    '<div class="private-tally-date"><button data-private-tally="prev">‹</button><input id="private-tally-date" type="date" value="'+esc(selectedDate)+'"><button data-private-tally="next">›</button></div>'+
    '<div class="private-tally-total"><small>이날 합계</small><b>'+esc(fmt(dayTotal(selectedDate)))+'</b><div class="private-tally-month">'+esc(ym[0]+'년 '+Number(ym[1])+'월 합계 '+fmt(monthTotal(selectedDate)))+'</div></div>'+
    '<div class="private-tally-add"><input id="private-tally-value" type="number" step="any" inputmode="decimal" placeholder="예: 15000 · -3000 · 3.5"><button data-private-tally="add">더하기</button></div>'+
    '<div class="private-tally-list">'+(rows||'<div class="private-tally-empty">아직 더한 숫자가 없어요.</div>')+'</div>'+
    '<p class="hint">항목 이름·카테고리·단위는 없어요. 양수, 음수, 소수를 그대로 누적해요.</p>'+
    '<div class="acts"><button class="b-save" data-private-tally="close">닫기</button></div>');
}
function openTool(){
  checkAccess().then(function(ok){
    if(!ok){B.toast('이 계정에서는 보이지 않는 개인 기능이에요');return;}
    selectedDate=todayKey();draw();
  });
}
function addValue(){
  if(access!==true)return;
  var input=document.getElementById('private-tally-value');
  var raw=input&&input.value;
  var value=Number(raw);
  if(raw===''||!isFinite(value)||value===0){B.toast('0이 아닌 숫자를 입력해주세요');return;}
  entries(selectedDate).push({id:uid(),value:value,at:Date.now()});
  cleanup();B.save();draw();
  setTimeout(function(){var i=document.getElementById('private-tally-value');if(i)i.focus();},30);
}
function deleteValue(id){
  var st=store();if(!st)return;
  st[selectedDate]=(st[selectedDate]||[]).filter(function(x){return x.id!==id;});
  cleanup();B.save();draw();
}
function click(e){
  var a=e.target.closest&&e.target.closest('[data-private-tally]');
  if(!a)return;
  var act=a.dataset.privateTally;
  if(act==='open')return openTool();
  if(act==='close')return B.closeModal();
  if(act==='add')return addValue();
  if(act==='delete')return deleteValue(a.dataset.id);
  if(act==='prev')return moveDay(-1);
  if(act==='next')return moveDay(1);
}
function change(e){
  if(e.target&&e.target.id==='private-tally-date'){selectedDate=e.target.value||todayKey();draw();}
}
function keydown(e){
  if(e.target&&e.target.id==='private-tally-value'&&e.key==='Enter'){e.preventDefault();addValue();}
}
document.addEventListener('click',click);
document.addEventListener('change',change);
document.addEventListener('keydown',keydown);

var main=document.getElementById('main');
if(main){
  var queued=false;
  new MutationObserver(function(){
    if(queued)return;
    queued=true;
    setTimeout(function(){queued=false;injectSettings();},35);
  }).observe(main,{childList:true});
}

window.PLANON_PRIVATE_TALLY={afterRender:injectSettings};
injectSettings();
})();