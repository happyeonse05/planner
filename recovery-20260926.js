/* PLANON recovery patch 2026-09-26 21:55 KST
   Additive regression repair: no feature deletion, preserve state/sync. */
(function(){'use strict';
var B=window.PLANON_UX_BRIDGE;if(!B)return;
function state(){try{return B.state&&B.state();}catch(e){return null;}}
function save(){try{B.save&&B.save();}catch(e){}}
function migrate(){
  var s=state();if(!s)return;s.settings=s.settings||{};
  if(![5,10,20,30].includes(Number(s.settings.diaryMinutes)))s.settings.diaryMinutes=10;
  /* 9/24→9/25 보정도 새벽 5시 공부일 경계를 지켜요.
     9/25 05:00 이후에 끝난 기록만 9/25로 옮기고, 00:00~04:59 기록은 9/24에 남겨요. */
  if(!s.settings.fixDiary0925v1&&Array.isArray(s.diaries)){
    s.diaries.forEach(function(x){
      if(!x||String(x.date||x.studyDate)!=='2026-09-24'||!x.finishedAt)return;
      var d=new Date(Number(x.finishedAt));
      if(d.getFullYear()===2026&&d.getMonth()===8&&d.getDate()===25&&d.getHours()>=5){x.date='2026-09-25';x.studyDate='2026-09-25';}
    });
    s.settings.fixDiary0925v1=true;save();
  }
  /* exact duplicate exams/course deliverables only */
  if(!s.settings.dedupeSchedule0926v1&&Array.isArray(s.exams)){
    var seen={};s.exams=s.exams.filter(function(x){
      if(!x)return false;var k=[x.name,x.start,x.end||x.start,x.kind,x.course,x.time].map(function(v){return String(v||'').trim().toLowerCase();}).join('|');
      if(!k.replace(/\|/g,''))return true;if(seen[k])return false;seen[k]=1;return true;
    });s.settings.dedupeSchedule0926v1=true;save();
  }
}
function clean(){
  /* Writing view stays focused; past dates can also be opened from the diary library. */
  document.querySelectorAll('.diary-history').forEach(function(x){x.style.display='none';});
  /* Old monthly sky panel is superseded by BokBokBok capsule gacha. */
  document.querySelectorAll('section,article,.card,.mb-card').forEach(function(x){
    var h=x.querySelector('h2,h3,h4');if(h&&/^\s*9월의 하늘\s*$/.test(h.textContent||''))x.style.display='none';
  });
  /* Prevent accidental duplicate visual rows from older render fragments. */
  document.querySelectorAll('.course').forEach(function(row){
    var p=row.parentElement;if(!p)return;var key=(row.textContent||'').replace(/\s+/g,' ').trim(),prev=row.previousElementSibling;
    if(prev&&prev.classList.contains('course')&&(prev.textContent||'').replace(/\s+/g,' ').trim()===key)row.remove();
  });
  /* 오늘 마감하기는 일간 콘텐츠의 진짜 마지막에 둔다. 상단 요약 카드 안이나 고정 버튼으로 두지 않는다. */
  var main=document.getElementById('main'),u=B.ui&&B.ui();
  if(main&&u&&u.tab==='day'){
    var closes=[].slice.call(main.querySelectorAll('button')).filter(function(b){return (b.textContent||'').trim()==='오늘 마감하기';});
    closes.forEach(function(b){
      var wrap=b.closest('.day-close-fixed')||b.parentElement;if(!wrap)return;
      wrap.style.position='static';wrap.style.inset='auto';wrap.style.width='auto';wrap.style.margin='18px 0 calc(112px + env(safe-area-inset-bottom,0px))';
      b.style.position='static';b.style.inset='auto';b.style.width='100%';b.style.margin='0';
      main.appendChild(wrap);
    });
  }
}
function touchFix(e){
  var a=e.target&&e.target.closest&&e.target.closest('button,a,[data-act],[data-mb],[data-rel-open],[data-market-open]');
  if(!a||a.disabled)return;
  /* Safari sometimes keeps an invisible overlay after a sheet transition. Pointer event keeps taps routed. */
  a.style.webkitTapHighlightColor='transparent';
}
document.addEventListener('touchstart',touchFix,{passive:true,capture:true});
document.addEventListener('pointerdown',touchFix,true);
migrate();clean();
var root=document.getElementById('app');if(root)new MutationObserver(function(){requestAnimationFrame(clean);}).observe(root,{childList:true,subtree:true});
window.addEventListener('planon-market-change',clean);
})();