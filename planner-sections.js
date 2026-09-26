/* 시간표 탭 섹션 접기 + 표시 설정
   - 강의·고정 일정 / D-day / 시험 일정: 기본은 접힘, 제목을 눌러야 펼쳐져요
   - D-day도 시험 일정과 동일하게 접힌 상태에서 요약만 보여주고, 펼치면 커플 디데이가 맨 위
   - 설정 > '시간표·홈 표시'에서 각 섹션과 홈의 '곧 마감' 줄을 아예 숨길 수 있어요
   데이터는 건드리지 않고 화면만 바꿔요. */
(function(){'use strict';
var B=window.PLANON_UX_BRIDGE;if(!B)return;
var KEYS=[{k:'schedule',t:'일정',sub:'시간표 탭의 학교·개인 일정 목록'},{k:'fixed',t:'강의·고정 일정',sub:'시간표 탭의 반복 수업/고정 일정 목록'},{k:'dday',t:'D-day',sub:'시간표 탭의 D-day 목록 (커플 디데이 포함)'},{k:'exam',t:'시험 일정',sub:'시간표 탭의 시험 일정 목록'},{k:'toplist',t:'일간 맨 위 시험·D-day 목록',sub:'일간 화면 맨 위에 뜨는 다가오는 시험·D-day 줄'},{k:'homeDeadline',t:"홈의 '곧 마감' 줄",sub:'일간 홈 할 일 진행바 아래 마감·시험 한 줄'}];
function S(){return B.state();}
function pref(){var s=S();if(!s)return {};s.settings=s.settings||{};var p=s.settings.plannerSections;if(!p||typeof p!=='object')p=s.settings.plannerSections={hide:{},fold:true};if(!p.hide||typeof p.hide!=='object')p.hide={};if(typeof p.fold!=='boolean')p.fold=true;return p;}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
var OPEN={};try{OPEN=JSON.parse(sessionStorage.getItem('planon.secOpen')||'{}')||{};}catch(e){}
function saveOpen(){try{sessionStorage.setItem('planon.secOpen',JSON.stringify(OPEN));}catch(e){}}
function findSections(main){var out={};main.querySelectorAll(':scope > section.card').forEach(function(sec){var h=sec.querySelector('.card-h h3');if(!h)return;var t=(h.textContent||'').trim();
  if(!out.fixed&&(sec.querySelector('.semrow')||sec.querySelector('[data-act="add-block"]')))out.fixed=sec;
  else if(!out.dday&&/^D-day/.test(t))out.dday=sec;
  else if(!out.schedule&&/^일정$/.test(t))out.schedule=sec;
  else if(!out.exam&&h.classList.contains('exh'))out.exam=sec;});return out;}
function summary(k,sec){
  if(k==='fixed'){var n=sec.querySelectorAll('.course').length;return n?n+'개 과목 · 눌러서 보기':'아직 비어 있어요 · 눌러서 추가';}
  if(k==='schedule'){var n=sec.querySelectorAll('.schedule-list-row').length;return n?n+'개 · 눌러서 보기':'눌러서 추가';}
  if(k==='exam'){var rs=[].slice.call(sec.querySelectorAll('.setrow')),up=rs.filter(function(r){return !r.classList.contains('past');})[0];if(up){var sp=up.querySelector('span'),nm=sp&&sp.childNodes[0]?(sp.childNodes[0].textContent||'').trim():'';var when=((sp&&sp.querySelector('small'))||{}).textContent||'';return '다음 시험 · <b>'+esc(nm)+'</b> <small>'+esc(when.split(' · ')[0])+'</small>';}return rs.length?'이번 학기 시험은 다 지났어요':'눌러서 추가';}
  if(k==='dday'){var rows=[].slice.call(sec.querySelectorAll('.setrow'));return rows.length?rows.length+'개 · 눌러서 보기':'눌러서 추가';}
  return '';}
function coupleFirst(sec){var rows=[].slice.call(sec.querySelectorAll(':scope > .setrow'));var cs=rows.filter(function(r){var i=r.querySelector('.ddcat-row');return i&&/♡/.test(i.textContent||'');});if(!cs.length)return;var first=rows[0];cs.forEach(function(r){r.classList.add('ps-couple-row');first.before(r);});}
function apply(){var u=B.ui(),main=document.getElementById('main');if(!u||!main)return;var p=pref();
  var hd=main.querySelectorAll('.home-deadline');hd.forEach(function(x){x.style.display=p.hide.homeDeadline?'none':'';});
  main.querySelectorAll('.toplist').forEach(function(tl){if(p.hide.toplist){tl.style.display='none';var o=tl.previousElementSibling;if(o&&o.classList.contains('ps-top-sum'))o.remove();return;}tl.style.display='';
    var sm=tl.previousElementSibling&&tl.previousElementSibling.classList.contains('ps-top-sum')?tl.previousElementSibling:null;
    if(!p.fold){tl.classList.remove('ps-top-closed');if(sm)sm.remove();return;}
    var rows=tl.querySelectorAll('.trow');if(!rows.length)return;var first=rows[0],nm=((first.querySelector('b')||{}).textContent||''),dd=((first.querySelector('em')||{}).textContent||'');
    if(!sm){sm=document.createElement('button');sm.type='button';sm.className='ps-top-sum';tl.before(sm);}
    var open=!!OPEN.toplist;tl.classList.toggle('ps-top-closed',!open);sm.classList.toggle('open',open);
    sm.innerHTML='<span class="ps-caret" aria-hidden="true"></span><span>다가오는 시험·D-day '+rows.length+'개</span><b>'+esc(nm)+' '+esc(dd)+'</b>';});
  if(u.tab!=='ttable')return;var secs=findSections(main);
  Object.keys(secs).forEach(function(k){var sec=secs[k];if(!sec)return;
    if(p.hide[k]){sec.style.display='none';return;}sec.style.display='';
    if(k==='dday')coupleFirst(sec);
    if(!p.fold){sec.classList.remove('ps-fold','ps-closed');return;}
    sec.classList.add('ps-fold');sec.dataset.psKey=k;var open=!!OPEN[k];sec.classList.toggle('ps-closed',!open);
    var head=sec.querySelector('.card-h');if(head&&!head.querySelector('.ps-caret')){head.insertAdjacentHTML('afterbegin','<span class="ps-caret" aria-hidden="true"></span>');head.setAttribute('role','button');head.setAttribute('tabindex','0');}
    var sm=sec.querySelector(':scope > .ps-sum');if(!sm){sm=document.createElement('div');sm.className='ps-sum';head.after(sm);}sm.innerHTML=summary(k,sec);});}
document.addEventListener('click',function(e){var ts=e.target.closest&&e.target.closest('.ps-top-sum');if(!ts)return;OPEN.toplist=!OPEN.toplist;saveOpen();apply();});
document.addEventListener('click',function(e){var head=e.target.closest&&e.target.closest('.ps-fold > .card-h, .ps-fold > .ps-sum');if(!head)return;if(e.target.closest('button,a,input,select')&&!e.target.closest('.ps-caret'))return;var sec=head.parentNode,k=sec.dataset.psKey;OPEN[k]=sec.classList.contains('ps-closed');saveOpen();apply();});
/* 설정 화면: 표시 설정 진입 */
function inject(){var u=B.ui(),main=document.getElementById('main');if(!main||!u||u.tab!=='settings'||u.settingsPage)return;if(main.querySelector('[data-ps-entry]'))return;var sec=document.createElement('section');sec.className='card';sec.setAttribute('data-ps-entry','1');sec.innerHTML='<button class="setrow chatrow" data-ps="open"><span>시간표·홈 표시<small>강의·D-day·시험 일정 접기/숨기기 · 일간 맨 위 시험 목록 · 곧 마감 줄</small></span><span class="chev">›</span></button>';var cards=main.querySelectorAll(':scope > section.card');if(cards.length>2)cards[2].before(sec);else main.appendChild(sec);}
function sheet(){var p=pref();var sw=function(on,attr){return '<button class="ux-switch '+(on?'on':'')+'" '+attr+' role="switch" aria-checked="'+(on?'true':'false')+'"></button>';};
  B.openModal('<h3>시간표·홈 표시</h3><p class="hint">끄면 화면에서만 숨겨요. 수업·D-day·시험 데이터는 그대로예요.</p><div class="ux-feature-list"><div class="ux-feature-row"><span class="ux-feature-copy"><b>강의·D-day·일정·시험 접어두기</b><small>강의·D-day·일정·시험은 기본으로 접어두고 제목을 누르면 펼쳐져요</small></span>'+sw(p.fold,'data-ps="fold"')+'</div>'+KEYS.map(function(x){return '<div class="ux-feature-row"><span class="ux-feature-copy"><b>'+esc(x.t)+' 보이기</b><small>'+esc(x.sub)+'</small></span>'+sw(!p.hide[x.k],'data-ps="hide" data-k="'+x.k+'"')+'</div>';}).join('')+'</div><div class="acts"><button class="b-save" data-ps="close">완료</button></div>');}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-ps]');if(!a)return;var v=a.dataset.ps,p=pref();
  if(v==='open'){sheet();return;}if(v==='close'){B.closeModal();B.render();return;}
  if(v==='fold'){p.fold=!p.fold;B.save();sheet();return;}
  if(v==='hide'){var k=a.dataset.k;p.hide[k]=!p.hide[k];B.save();sheet();return;}});
var main=document.getElementById('main');if(main)new MutationObserver(function(){apply();inject();}).observe(main,{childList:true});
/* 기존 D-day 커플 마이그레이션: 예전에 '기타'로 저장된 '우리/만난 날/사귄 날…' 시작일 D-day를 커플로 (1회) */
function coupleMigrate(){var s=S();if(!s||!s.settings)return;var re=/100일|200일|300일|연애|커플|우리|만난|사귄|사귐|애인|남친|여친|남자친구|여자친구|\u2665|\u2764/,n=0;(s.ddays||[]).forEach(function(x){if(!x||!x.title||x.coupleChecked)return;x.coupleChecked=true;n+=0.001;if((!x.category||x.category==='other')&&x.mode==='since'&&re.test(String(x.title))){x.category='couple';n++;}});if(n>0)B.save();n=Math.floor(n);if(n){try{B.render();}catch(e){}}}
setTimeout(function(){coupleMigrate();apply();inject();},60);setInterval(coupleMigrate,30000);
})();
