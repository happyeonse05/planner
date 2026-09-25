(function(){
'use strict';
var B=window.PLANON_UX_BRIDGE;
if(!B)return;

var FEATURE_ROWS=[
  {key:'showDiary',title:'일기',sub:'홈의 저녁 일기와 설정의 일기 바로가기'},
  {key:'showMemo',title:'하루 메모',sub:'일간 화면의 메모·사진 카드'},
  {key:'showLog',title:'생활 기록',sub:'기상·취침·공부 시간 기록 카드'},
  {key:'showWeeklyReview',title:'주간 회고',sub:'주간 완료율·집중시간·한 줄 회고'},
  {key:'showMeetMaker',title:'친구 약속 잡기',sub:'새 약속·링크 약속 만들기 버튼'},
  {key:'showSchoolLinks',title:'학교 바로가기',sub:'홈의 학교 홈페이지·공지·식단 링크'}
];

function state(){return B.state();}
function ui(){return B.ui();}
function on(key){
  var s=state();
  if(!s||!s.settings)return true;
  return s.settings[key]!==false;
}
function setOn(key,value){
  var s=state();
  if(!s||!s.settings)return;
  s.settings[key]=!!value;
  B.save();
}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

function addStyles(){
  if(document.getElementById('planon-ux-css'))return;
  var st=document.createElement('style');
  st.id='planon-ux-css';
  st.textContent=`
    .top>.plus{display:none!important}
    .ux-fab{position:fixed;right:max(18px,calc((100vw - 920px)/2 + 18px));bottom:calc(76px + env(safe-area-inset-bottom,0px));width:54px;height:54px;border-radius:18px;background:var(--planner-color);color:var(--planner-ink,#1c1c1e);display:grid;place-items:center;font-size:30px;font-weight:400;line-height:1;box-shadow:0 10px 28px rgba(0,0,0,.14);z-index:32;border:1px solid color-mix(in srgb,var(--planner-color) 78%,#000 8%)}
    .ux-fab:active{transform:scale(.96)}
    @media(min-width:760px){.ux-fab{bottom:28px}}
    .ux-feature-entry{margin-top:10px}.ux-feature-entry .setrow{width:100%;border:0}
    .ux-feature-list{display:flex;flex-direction:column;gap:0;margin:4px 0 10px}.ux-feature-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 2px;border-bottom:1px solid var(--line)}.ux-feature-row:last-child{border-bottom:0}.ux-feature-copy{min-width:0}.ux-feature-copy b{display:block;font-size:14px}.ux-feature-copy small{display:block;color:var(--sub);font-size:12px;line-height:1.4;margin-top:3px}.ux-switch{flex:none;width:48px;height:28px;border-radius:999px;background:var(--soft);position:relative;transition:.18s}.ux-switch:after{content:'';position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:var(--card);box-shadow:0 1px 4px rgba(0,0,0,.14);transition:.18s}.ux-switch.on{background:var(--planner-color)}.ux-switch.on:after{left:23px}
    .ux-quick-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:8px 0 12px}.ux-quick-item{min-height:76px;border-radius:14px;background:var(--soft);padding:12px;text-align:left}.ux-quick-item b{display:block;font-size:15px}.ux-quick-item small{display:block;color:var(--sub);font-size:11px;margin-top:5px;line-height:1.35}.ux-quick-item.wide{grid-column:1/-1;min-height:58px}
    .ux-empty-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;padding:18px 8px;text-align:center;color:var(--sub)}.ux-face{width:58px;height:58px;border-radius:16px;background:var(--planner-color);position:relative;box-shadow:inset 0 -5px 0 color-mix(in srgb,var(--planner-color) 84%,#000 16%)}.ux-face:before,.ux-face:after{content:'';position:absolute;top:20px;width:5px;height:5px;border-radius:50%;background:var(--planner-ink,#1c1c1e)}.ux-face:before{left:17px}.ux-face:after{right:17px}.ux-mouth{position:absolute;left:50%;bottom:14px;width:20px;height:10px;margin-left:-10px;border:2px solid var(--planner-ink,#1c1c1e);border-top:0;border-left-color:transparent;border-right-color:transparent;border-radius:0 0 14px 14px}.ux-face.sad .ux-mouth{bottom:12px;border:2px solid var(--planner-ink,#1c1c1e);border-bottom:0;border-left-color:transparent;border-right-color:transparent;border-radius:14px 14px 0 0}.ux-face.sleep:before,.ux-face.sleep:after{height:2px;border-radius:3px;top:22px}.ux-face.sleep .ux-mouth{width:12px;height:2px;margin-left:-6px;border:0;background:var(--planner-ink,#1c1c1e);bottom:15px}.ux-face .ux-point{position:absolute;right:-5px;top:7px;width:9px;height:3px;border-radius:999px;background:var(--planner-color);transform:rotate(-48deg);box-shadow:7px 7px 0 -1px var(--planner-color)}.ux-face.happy:before,.ux-face.happy:after{width:9px;height:5px;top:21px;border:2px solid var(--planner-ink,#1c1c1e);border-bottom:0;border-left:0;border-right:0;background:transparent;border-radius:50% 50% 0 0}.ux-face.happy .ux-mouth{display:none}.ux-empty-text{font-size:13px;line-height:1.45}.ux-empty-text b{display:block;color:var(--ink);font-size:14px;margin-bottom:2px}
  `;
  document.head.appendChild(st);
}

function featureEntry(){
  var main=document.getElementById('main');
  if(!main||!ui()||ui().tab!=='settings'||ui().settingsPage)return;
  if(main.querySelector('.ux-feature-entry'))return;
  var first=main.querySelector('section.card');
  if(!first)return;
  var sec=document.createElement('section');
  sec.className='card ux-feature-entry';
  sec.innerHTML='<button class="setrow chatrow" data-ux-act="feature-settings"><span>기능 표시<small>안 쓰는 기능은 화면에서만 숨겨요 · 기록은 그대로 보관</small></span><span class="chev">›</span></button>';
  first.insertAdjacentElement('afterend',sec);
}

function applyFeatureVisibility(){
  var u=ui();
  if(!u||u.tab!=='settings'||u.settingsPage)return;
  var diary=document.querySelector('.diary-library-shortcut');
  if(diary){var card=diary.closest('section.card');if(card)card.style.display=on('showDiary')?'':'none';}
}

function quickFab(){
  var old=document.getElementById('ux-fab');
  var u=ui();
  var hide=!u||u.guest||u.tab==='settings'||u.tab==='friends'||document.getElementById('modal')?.classList.contains('open');
  if(hide){if(old)old.remove();return;}
  if(old)return;
  var b=document.createElement('button');
  b.id='ux-fab';b.className='ux-fab';b.type='button';b.setAttribute('aria-label','빠른 추가');b.dataset.uxAct='quick-add';b.textContent='+';
  document.body.appendChild(b);
}

function moodFor(text){
  if(/다 끝|남은 할 일이 없|등록된 시험이 없|다가오는 시험 일정이 없/.test(text))return 'happy';
  if(/기록이 아직 없|기록 없음|아직 적은 일이 없|아직 수업이 없|아직 반복 할 일이 없/.test(text))return 'sleep';
  return 'sad';
}
function decorateEmpties(){
  var candidates=document.querySelectorAll('#main .empty');
  candidates.forEach(function(el){
    if(el.dataset.uxDone==='1'||el.querySelector('button,input,select,textarea,a'))return;
    var text=(el.textContent||'').trim().replace(/\s+/g,' ');
    if(!text||text.length>80)return;
    if(!(/남은 할 일이 없|아직 적은 일이 없|아직 수업이 없|이번 주 기록이 아직 없|이 주에 적은 일은 다 끝냈|기록 없음|아직 반복 할 일이 없/.test(text)))return;
    var mood=moodFor(text);
    el.dataset.uxDone='1';
    el.innerHTML='<span class="ux-empty-wrap"><span class="ux-face '+mood+'"><i class="ux-point"></i><i class="ux-mouth"></i></span><span class="ux-empty-text">'+esc(text)+'</span></span>';
  });
}

function featureSettings(){
  var rows=FEATURE_ROWS.map(function(f){return '<div class="ux-feature-row"><span class="ux-feature-copy"><b>'+esc(f.title)+'</b><small>'+esc(f.sub)+'</small></span><button class="ux-switch '+(on(f.key)?'on':'')+'" data-ux-act="toggle-feature" data-key="'+esc(f.key)+'" role="switch" aria-checked="'+(on(f.key)?'true':'false')+'" aria-label="'+esc(f.title)+'"></button></div>';}).join('');
  B.openModal('<h3>기능 표시</h3><p class="hint">끄면 화면에서만 숨겨져요. 기존 일정·기록·친구 데이터는 삭제되지 않아요.</p><div class="ux-feature-list">'+rows+'</div><div class="acts"><button class="b-save" data-ux-act="close">완료</button></div>');
}

function openQuickAdd(){
  var pm=B.plannerMode();
  var scheduleName=pm==='exam'?'공부 일정':'일정';
  var meet=on('showMeetMaker')?'<button class="ux-quick-item" data-ux-act="quick-type" data-type="appointment"><b>약속</b><small>친구 또는 직접 입력</small></button>':'';
  var memo=on('showMemo')?'<button class="ux-quick-item" data-ux-act="quick-type" data-type="memo"><b>메모</b><small>오늘 일간 메모로 이동</small></button>':'';
  B.openModal('<h3>빠른 추가</h3><p class="hint">추가할 것만 고르면 바로 입력 화면이 열려요.</p><div class="ux-quick-grid">'+
    '<button class="ux-quick-item" data-ux-act="quick-type" data-type="todo"><b>할 일</b><small>오늘 해야 할 일</small></button>'+
    '<button class="ux-quick-item" data-ux-act="quick-type" data-type="schedule"><b>'+esc(scheduleName)+'</b><small>날짜·시간이 있는 일정</small></button>'+
    '<button class="ux-quick-item" data-ux-act="quick-type" data-type="exam"><b>시험</b><small>시험 기간·준비 계획</small></button>'+
    '<button class="ux-quick-item" data-ux-act="quick-type" data-type="dday"><b>D-day</b><small>중요한 날짜 표시</small></button>'+meet+memo+
    '</div><div class="acts"><button class="b-ghost" data-ux-act="close">닫기</button></div>');
}

function openNewTodo(){
  var k=B.todayKey();
  B.openModal('<h3>할 일 추가</h3><input class="fld" id="ux-todo-text" maxlength="120" placeholder="해야 할 일을 적어요" enterkeyhint="done"><span class="lbl">날짜</span><input class="fld" id="ux-todo-date" type="date" value="'+esc(k)+'"><div class="acts"><button class="b-ghost" data-ux-act="close">취소</button><button class="b-save" data-ux-act="save-todo">추가</button></div>');
  setTimeout(function(){var x=document.getElementById('ux-todo-text');if(x)x.focus();},40);
}
function saveNewTodo(){
  var inp=document.getElementById('ux-todo-text'),d=document.getElementById('ux-todo-date');
  var text=inp?inp.value.trim():'';if(!text){if(inp)inp.classList.add('bad');return;}
  var key=d&&d.value?d.value:B.todayKey();
  B.closeModal();
  B.addTodo('day',key,text,'ux-quick',null,'');
  B.toast('할 일을 추가했어요');
}

function openQuickType(type){
  B.closeModal();
  var u=ui(),date=B.dkey(u&&u.date?u.date:new Date());
  if(type==='todo'){openNewTodo();return;}
  if(type==='schedule'){B.openSchedule(null,{date:date});return;}
  if(type==='exam'){B.openExam(null);return;}
  if(type==='dday'){B.openDD(null,{date:date});return;}
  if(type==='appointment'){B.openAppointment(null,{date:date});return;}
  if(type==='memo'){
    var s=state();if(s&&s.settings&&s.settings.showMemo===false){s.settings.showMemo=true;B.save();}
    if(u){u.tab='day';u.date=new Date();}
    B.render(true);
    setTimeout(function(){var m=document.querySelector('[data-memo="'+B.todayKey()+'"]');if(m){m.scrollIntoView({behavior:'smooth',block:'center'});m.focus();}},80);
  }
}

function afterRender(){
  addStyles();
  /* 기능 표시 메뉴는 홈·기록 설정으로 통합했어요. */
  applyFeatureVisibility();
  decorateEmpties();
  quickFab();
}

function click(e){
  var a=e.target.closest&&e.target.closest('[data-ux-act]');if(!a)return;
  var act=a.dataset.uxAct;
  if(act==='quick-add'){openQuickAdd();return;}
  if(act==='feature-settings'){featureSettings();return;}
  if(act==='toggle-feature'){
    var key=a.dataset.key;if(!key)return;
    setOn(key,!on(key));
    featureSettings();
    return;
  }
  if(act==='quick-type'){openQuickType(a.dataset.type);return;}
  if(act==='save-todo'){saveNewTodo();return;}
  if(act==='close'){B.closeModal();afterRender();return;}
}

document.addEventListener('click',click);
document.addEventListener('keydown',function(e){
  if(e.key==='Enter'&&e.target&&e.target.id==='ux-todo-text'){e.preventDefault();saveNewTodo();}
});
window.PLANON_UX={afterRender:afterRender,openQuickAdd:openQuickAdd,openFeatureSettings:featureSettings};
afterRender();
})();
