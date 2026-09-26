(function(){
'use strict';
var B=window.PLANON_UX_BRIDGE;
if(!B)return;

function S(){return B.state&&B.state();}
function U(){return B.ui&&B.ui();}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

var NAV_ICONS={
  month:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="6" y="7" width="20" height="19" rx="5" fill="#FFF0F5" stroke="#E58FB0" stroke-width="2"/><path d="M10 5v5M22 5v5" stroke="#E58FB0" stroke-width="2" stroke-linecap="round"/><circle cx="12.5" cy="17" r="1.15" fill="#8B6673" stroke="none"/><circle cx="19.5" cy="17" r="1.15" fill="#8B6673" stroke="none"/><path d="M12 27q0 2 2 2t2-2M17 27q0 2 2 2t2-2" fill="none" stroke="#E58FB0" stroke-width="1.7" stroke-linecap="round"/></svg>',
  week:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4.5" y="7" width="18" height="19" rx="5" fill="#EFF7FF" stroke="#78B5DE" stroke-width="2"/><circle cx="10" cy="15" r="1.05" fill="#5C7D96" stroke="none"/><circle cx="16" cy="15" r="1.05" fill="#5C7D96" stroke="none"/><rect x="18" y="12" width="10" height="13" rx="2.7" fill="#F7FBFF" stroke="#78B5DE" stroke-width="1.8"/><path d="M21 16h4M21 19h4M21 22h3" stroke="#78B5DE" stroke-width="1.5" stroke-linecap="round"/><path d="M8 27q0 2 2 2t2-2" fill="none" stroke="#78B5DE" stroke-width="1.6"/></svg>',
  day:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="6" width="19" height="20" rx="5" fill="#FFF6DF" stroke="#C99A45" stroke-width="2"/><circle cx="11" cy="14.5" r="1.1" fill="#7C6237" stroke="none"/><circle cx="17.5" cy="14.5" r="1.1" fill="#7C6237" stroke="none"/><path d="M9 27q0 2 2 2t2-2M16 27q0 2 2 2t2-2" fill="none" stroke="#C99A45" stroke-width="1.6"/><g transform="rotate(-22 25 22)"><rect x="22" y="13" width="5" height="13" rx="2" fill="#F6C76E" stroke="#C99A45" stroke-width="1.5"/><path d="M22 25h5l-2.5 4z" fill="#FFE7B5" stroke="#C99A45" stroke-width="1.4"/></g></svg>',
  ttable:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="7" width="18" height="19" rx="5" fill="#EEFAF4" stroke="#67B391" stroke-width="2"/><circle cx="9.5" cy="15" r="1.05" fill="#4E7C68" stroke="none"/><circle cx="15.5" cy="15" r="1.05" fill="#4E7C68" stroke="none"/><circle cx="23.5" cy="21.5" r="6.2" fill="#F8FFFB" stroke="#67B391" stroke-width="1.9"/><path d="M23.5 18v4l2.6 1.5" stroke="#67B391" stroke-width="1.7" fill="none" stroke-linecap="round"/><path d="M8 27q0 2 2 2t2-2" fill="none" stroke="#67B391" stroke-width="1.6"/></svg>',
  friends:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="12" width="15" height="15" rx="4.5" fill="#F4EEFF" stroke="#A98BDA" stroke-width="1.9"/><rect x="14" y="8" width="14" height="15" rx="4.5" fill="#FAF7FF" stroke="#A98BDA" stroke-width="1.9"/><circle cx="9" cy="19" r="1" fill="#6D5B86" stroke="none"/><circle cx="14" cy="19" r="1" fill="#6D5B86" stroke="none"/><circle cx="19" cy="15" r="1" fill="#6D5B86" stroke="none"/><circle cx="24" cy="15" r="1" fill="#6D5B86" stroke="none"/><path d="M20 5.8c1.1-2 4.2-1.1 4.2 1.1 0 2-2.1 3.2-4.2 4.6-2.1-1.4-4.2-2.6-4.2-4.6 0-2.2 3.1-3.1 4.2-1.1z" fill="#E5C9FF" stroke="#A98BDA" stroke-width="1.3"/></svg>'
};

function migrateFiveTabNav(){
  var s=S();
  if(!s||!s.settings||s.settings.nemoFiveTabV1)return false;
  s.settings.nemoFiveTabV1=true;
  s.settings.showTodoTab=false;
  B.save();
  return true;
}

function decorateNav(){
  var nav=document.getElementById('nav');
  if(!nav)return;
  Object.keys(NAV_ICONS).forEach(function(key){
    var btn=nav.querySelector('button[data-tab="'+key+'"]');
    if(!btn)return;
    var ico=btn.querySelector('.navico');
    if(ico&&ico.dataset.nemoIcon!=='1'){
      ico.innerHTML=NAV_ICONS[key];
      ico.dataset.nemoIcon='1';
    }
    btn.classList.add('nemo-nav-tab','nemo-nav-'+key);
  });
}

function diaryFor(k){
  var s=S(),rows=s&&Array.isArray(s.diaries)?s.diaries:[];
  return rows.filter(function(x){
    if(!x)return false;
    var dk='';
    try{dk=typeof window.diaryDateKey==='function'?window.diaryDateKey(x):(x.studyDate||x.date||'');}catch(e){dk=x.studyDate||x.date||'';}
    return dk===k;
  }).sort(function(a,b){return Number(b.finishedAt||0)-Number(a.finishedAt||0);})[0]||null;
}
function dayClosed(k){
  var s=S(),rows=s&&Array.isArray(s.dayCloses)?s.dayCloses:[];
  return rows.some(function(x){return x&&(x.key||x.date)===k;});
}
function diaryReady(k){
  var st=B.dayCloseStats?B.dayCloseStats(k):{total:0,done:0};
  return dayClosed(k)||(Number(st.total||0)>0&&Number(st.done||0)>=Number(st.total||0));
}
function diaryCharacter(){
  if(typeof window.nemoStateSVG==='function')return window.nemoStateSVG('focus','basic','nemo-diary-prompt-char');
  if(typeof window.nemoSVG==='function')return window.nemoSVG('basic','nemo-diary-prompt-char');
  return '<span class="nemo-diary-fallback">□</span>';
}
function diaryCardHTML(k){
  var d=diaryFor(k),has=!!d,preview=has?String(d.text||d.note||'').trim().replace(/\s+/g,' ').slice(0,72):'';
  var title=has?'오늘 쓴 일기 보기':'네모가 일기를 기다려요';
  var sub=has?(preview||(d.word?('오늘의 한 단어 · '+d.word):'오늘 남긴 기록을 다시 펼쳐봐요.')):'하루를 마무리하며 오늘의 기록을 남겨봐요';
  return '<button class="card diary-today-banner nemo-diary-end-card" data-nemo-diary-state="'+(has?'saved':'waiting')+'" data-act="'+(has?'open-diary-library':'open-diary')+'">'+
    '<span class="nemo-diary-character">'+diaryCharacter()+'</span>'+
    '<span class="diary-banner-copy"><b>'+esc(title)+'</b><span>'+esc(sub)+'</span></span>'+
    '<span class="diary-banner-arrow">›</span></button>';
}
function ensureDiaryPrompt(){
  var u=U(),main=document.getElementById('main');
  if(!u||!main)return;
  var old=main.querySelector('.closed-diary-wait');
  if(u.tab!=='day'){
    var stale=main.querySelector('.nemo-diary-end-card');if(stale)stale.remove();
    return;
  }
  var k='';
  try{k=B.dkey(u.date);}catch(e){k='';}
  var today=B.todayKey?B.todayKey():'';
  var enabled=B.featOn?B.featOn('showDiary'):true;
  var ready=k===today&&enabled&&diaryReady(k);
  if(!ready){
    var remove=main.querySelector('.nemo-diary-end-card');if(remove)remove.remove();
    return;
  }
  var desired=diaryFor(k)?'saved':'waiting';
  var existing=main.querySelector('.nemo-diary-end-card');
  if(old&&!old.classList.contains('nemo-diary-end-card')){
    old.outerHTML=diaryCardHTML(k);
    return;
  }
  if(existing){
    if(existing.dataset.nemoDiaryState!==desired)existing.outerHTML=diaryCardHTML(k);
    return;
  }
  var dayg=main.querySelector('.dayg');
  if(dayg){dayg.insertAdjacentHTML('afterend',diaryCardHTML(k));return;}
  var closed=main.querySelector('.closed-day');
  if(closed)closed.insertAdjacentHTML('beforeend',diaryCardHTML(k));
}

function decorateSettings(){
  var u=U(),main=document.getElementById('main');
  if(!u||!main||u.tab!=='settings')return;
  main.querySelectorAll('.setrow').forEach(function(row){
    var span=row.querySelector('span');
    if(!span)return;
    var t=(span.textContent||'').replace(/\s+/g,' ').trim();
    if(t.indexOf('저녁 일기 버튼')===0){
      span.innerHTML='<b>하루 마감 일기 카드</b><small>오늘 할 일을 다 끝내거나 하루를 마감하면 “네모가 일기를 기다려요” 카드를 보여줘요.</small>';
    }
  });
}

var raf=0;
function refresh(){
  raf=0;
  decorateNav();
  ensureDiaryPrompt();
  decorateSettings();
}
function queue(){
  if(raf)return;
  raf=requestAnimationFrame(refresh);
}

var migrated=migrateFiveTabNav();
if(migrated)setTimeout(function(){try{B.render(true);}catch(e){}},0);
setTimeout(refresh,0);
var root=document.getElementById('app');
if(root)new MutationObserver(queue).observe(root,{childList:true,subtree:true});
window.addEventListener('planon:studydaychange',queue);
window.PLANON_NEMO_UI={refresh:refresh};
})();