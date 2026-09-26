(function(){
'use strict';

var B=window.PLANON_UX_BRIDGE;
var D=window.PLANON_SMART_DATA;
var L=window.PLANON_SMART_LEARNING;
if(!B||!D||!L)return;

function S(){return B.state();}
function Q(){return window.PLANON_SCHEDULING;}
function U(){return window.PLANON_UNDO;}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function today(){return B.todayKey();}
function prefs(){return D.prefs();}

var REASON_ORDER=['TIME_SHORTAGE','TOOK_LONGER','TIRED','UNEXPECTED_EVENT','PROCRASTINATED'];

function smartOn(){return prefs().enabled!==false;}
function smartHomeMarker(){return document.querySelector('.smart-home-marker');}

function hideLegacyWhenOff(){
  if(smartOn())return;
  document.querySelectorAll('.smart-now,.smart-risk,.smart-split-offer').forEach(function(el){el.remove();});
  document.querySelectorAll('[data-smart-home="today"],[data-smart-home="week"],[data-smart-home="one"]').forEach(function(btn){
    var c=btn.closest('.smart-card');if(c)c.remove();
  });
}

function smartSettingsSummary(){
  var p=prefs(),bits=[];
  bits.push(p.enabled!==false?'켜짐':'꺼짐');
  bits.push(+p.bufferPct===30?'여유 있게':+p.bufferPct===10?'빡빡하게':'보통');
  return bits.join(' · ');
}
function smartSettingsModal(){
  var p=prefs(),undo=U(),last=undo&&undo.last&&undo.last();
  B.openModal(
    '<h3>스마트 계획 설정</h3>'+
    '<p class="hint">프로필에서는 설정 한 줄만 보여요. 세부 옵션은 여기에서만 바꿀 수 있어요.</p>'+
    '<div class="setrow"><span class="smart-setting-copy"><b>Smart Plan</b><small>자동 분할·재배치·마감 감지·지금 할 일 추천</small></span><button class="tbtn" data-learning-setting="enabled">'+(p.enabled!==false?'켜짐':'꺼짐')+'</button></div>'+
    '<div class="setrow"><span class="smart-setting-copy"><b>계획 여유</b><small>빈 시간을 전부 공부로 채우지 않아요</small></span><select class="sel" data-learning-buffer>'+
      '<option value="30"'+(+p.bufferPct===30?' selected':'')+'>여유 있게</option>'+
      '<option value="20"'+(+p.bufferPct===20?' selected':'')+'>보통</option>'+
      '<option value="10"'+(+p.bufferPct===10?' selected':'')+'>빡빡하게</option>'+
    '</select></div>'+
    '<div class="setrow"><span class="smart-setting-copy"><b>공부 일정 자동 이동</b><small>수업·시험·친구 약속은 자동으로 움직이지 않아요</small></span><button class="tbtn" data-learning-setting="autoMove">'+(p.autoMove!==false?'켜짐':'꺼짐')+'</button></div>'+
    '<div class="setrow"><span class="smart-setting-copy"><b>자동 분할 최대 길이</b><small>긴 공부는 이 길이 안쪽으로 나눠 제안해요</small></span><select class="sel" data-learning-session><option value="60"'+(+p.maxSessionMin===60?' selected':'')+'>60분</option><option value="50"'+(+p.maxSessionMin===50?' selected':'')+'>50분</option><option value="40"'+(+p.maxSessionMin===40?' selected':'')+'>40분</option><option value="30"'+(+p.maxSessionMin===30?' selected':'')+'>30분</option></select></div>'+
    (last?'<button class="setrow smart-recent-undo" data-learning-act="undo"><span class="smart-setting-copy"><b>최근 자동 계획 변경</b><small>'+esc(last.changeReason||'자동 계획')+' · '+new Date(last.timestamp||Date.now()).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})+'</small></span><span class="chev">되돌리기</span></button>':'')+
    '<div class="smart-status">AI API 없이 규칙 기반으로 작동해요.</div>'+
    '<div class="acts"><button class="b-save" data-learning-act="close-settings">완료</button></div>'
  );
}
function simplifySettings(){
  var u=B.ui&&B.ui();
  if(!u||u.tab!=='settings')return;
  var sec=document.querySelector('.smart-settings');
  if(!sec)return;
  var p=prefs();
  sec.innerHTML='<button class="setrow chatrow" data-learning-act="open-settings"><span><b>스마트 계획 설정</b><small>'+esc(smartSettingsSummary())+' · 눌러서 세부 설정</small></span><span class="chev">›</span></button>';
}
function pendingMissed(){
  var q=Q();if(!q||!smartOn()||prefs().missedSuggestions===false)return [];
  return q.missed().filter(function(t){return !L.hasFailure(t)&&!L.isDismissed(t);});
}

function reasonCard(){
  if(document.querySelector('.smart-failure-card'))return;
  var xs=pendingMissed();if(!xs.length)return;
  var t=xs[0],mark=smartHomeMarker();if(!mark)return;
  var card=document.createElement('section');
  card.className='card smart-card smart-failure-card';
  var buttons=REASON_ORDER.map(function(code){
    return '<button type="button" data-learning-reason="'+code+'" data-id="'+esc(t.id)+'">'+esc(L.reasons[code])+'</button>';
  }).join('');
  card.innerHTML=
    '<div class="smart-learning-meta"><b>오늘 못 한 이유가 있을까요?</b><small>'+(xs.length>1?'1/'+xs.length:'한 번 탭하면 끝')+'</small></div>'+
    '<small><strong>'+esc(t.text||'할 일')+'</strong> · 다음 계획을 더 현실적으로 잡는 데만 사용해요.</small>'+
    '<div class="smart-learning-reasons">'+buttons+'</div>'+
    '<div class="smart-actions"><button type="button" class="tbtn" data-learning-act="replan-one" data-id="'+esc(t.id)+'">다시 잡기</button></div>'+
    '<button type="button" class="smart-learning-skip" data-learning-skip="'+esc(t.id)+'">건너뛰기</button>';
  var nowCard=document.querySelector('.smart-now');
  if(nowCard&&nowCard.parentNode)nowCard.insertAdjacentElement('afterend',card);
  else mark.insertAdjacentElement('afterend',card);
}

function nudgeSuppressed(key){
  var st=L.store();return st.nudges&&st.nudges[key]===today();
}
function suppressNudge(key){var st=L.store();st.nudges[key]=today();B.save();}

function bufferNudge(){
  if(document.querySelector('.smart-buffer-nudge')||pendingMissed().length||nudgeSuppressed('buffer'))return;
  var s=L.bufferSuggestion();if(!s)return;
  var mark=smartHomeMarker();if(!mark)return;
  var c=document.createElement('section');
  c.className='card smart-card smart-nudge smart-buffer-nudge';
  c.innerHTML='<b>최근 일정이 조금 빡빡했어요</b><small>최근 2주 동안 “시간 부족”이 '+s.count+'번 있었어요. 자동 계획이 빈 시간을 조금 더 남기게 할까요?</small><div class="smart-actions"><button class="b-save" data-learning-act="buffer-relax">여유 있게 잡기</button><button class="tbtn" data-learning-act="buffer-keep">지금대로</button></div>';
  var risk=document.querySelector('.smart-risk');
  if(risk&&risk.parentNode)risk.insertAdjacentElement('afterend',c);else mark.insertAdjacentElement('afterend',c);
}

function procrastinationNudge(){
  if(document.querySelector('.smart-procrastination-nudge')||pendingMissed().length||document.querySelector('.smart-buffer-nudge')||nudgeSuppressed('short-block'))return;
  var task=(S().todos||[]).find(function(t){return t&&!t.done&&!t.splitParentId&&L.procrastinationSuggestion(t);});
  if(!task)return;
  var sug=L.procrastinationSuggestion(task);if(!sug)return;
  var mark=smartHomeMarker();if(!mark)return;
  var c=document.createElement('section');
  c.className='card smart-card smart-nudge smart-procrastination-nudge';
  c.innerHTML='<b>긴 계획을 조금 짧게 나눠볼까요?</b><small>'+esc(task.text)+'처럼 긴 공부 블록을 미룬 기록이 반복됐어요. 앞으로 자동 분할은 최대 '+sug.minutes+'분 단위로 제안할 수 있어요.</small><div class="smart-actions"><button class="b-save" data-learning-act="short-block" data-min="'+sug.minutes+'">'+sug.minutes+'분으로 나누기</button><button class="tbtn" data-learning-act="short-keep">지금대로</button></div>';
  mark.insertAdjacentElement('afterend',c);
}

function collapseCompleted(){
  document.querySelectorAll('.todo-box ul.todos').forEach(function(list){
    if(list.querySelector('.smart-completed-toggle'))return;
    var done=Array.prototype.slice.call(list.children).filter(function(li){return li.matches&&li.matches('li.todo.done');});
    if(!done.length)return;
    var toggle=document.createElement('li');
    toggle.className='smart-completed-toggle';
    toggle.innerHTML='<button type="button" data-learning-act="toggle-completed">✓ 완료 '+done.length+'</button>';
    list.appendChild(toggle);
    done.forEach(function(li){li.classList.add('smart-completed-hidden');list.appendChild(li);});
  });
}

function reorderHome(){
  var mark=smartHomeMarker();if(!mark)return;
  var nowCard=document.querySelector('.smart-now');
  if(nowCard)mark.insertAdjacentElement('afterend',nowCard);
  var fail=document.querySelector('.smart-failure-card');
  if(fail&&nowCard)nowCard.insertAdjacentElement('afterend',fail);
}

function afterRender(){
  hideLegacyWhenOff();
  simplifySettings();
  if(smartOn()){
    reasonCard();
    bufferNudge();
    procrastinationNudge();
    reorderHome();
  }
  collapseCompleted();
}

function contextualToast(code){
  var msg={
    TIME_SHORTAGE:'다음 계획의 여유 정도를 정할 때 참고할게요.',
    TOOK_LONGER:'다음 예상시간 제안에 반영할게요.',
    TIRED:'늦은 시간 배치 우선순위를 낮출 때 참고할게요.',
    UNEXPECTED_EVENT:'예상시간은 바꾸지 않고 재배치에만 참고할게요.',
    PROCRASTINATED:'긴 블록이 반복되면 더 짧게 나누는 걸 제안할게요.'
  }[code]||'다음 계획에 참고할게요.';
  B.toast(msg);
}

document.addEventListener('click',function(e){
  var reason=e.target.closest&&e.target.closest('[data-learning-reason]');
  if(reason){
    L.recordFailure(reason.dataset.id,reason.dataset.learningReason);
    contextualToast(reason.dataset.learningReason);
    B.render(true);
    return;
  }
  var skip=e.target.closest&&e.target.closest('[data-learning-skip]');
  if(skip){
    var t=(S().todos||[]).find(function(x){return x.id===skip.dataset.learningSkip;});
    if(t)L.dismissFailure(t);
    B.render(true);
    return;
  }
  var a=e.target.closest&&e.target.closest('[data-learning-act],[data-learning-setting]');
  if(!a)return;

  if(a.dataset.learningSetting){
    var p=prefs(),k=a.dataset.learningSetting;
    p[k]=p[k]===false;
    B.save();smartSettingsModal();return;
  }

  var act=a.dataset.learningAct;
  if(act==='open-settings'){smartSettingsModal();return;}
  if(act==='close-settings'){B.closeModal();B.render(true);return;}
  if(act==='undo'){var un=U();if(un&&un.undo)un.undo();return;}
  if(act==='replan-one'){var q=Q();if(q){var p=q.buildMissed('week',[a.dataset.id]);if(p)q.preview(p);}return;}
  if(act==='buffer-relax'){prefs().bufferPct=30;suppressNudge('buffer');B.save();B.render(true);B.toast('자동 계획을 조금 더 여유 있게 잡을게요.');return;}
  if(act==='buffer-keep'){suppressNudge('buffer');B.render(true);return;}
  if(act==='short-block'){prefs().maxSessionMin=Math.max(30,Math.min(60,Number(a.dataset.min)||40));suppressNudge('short-block');B.save();B.render(true);B.toast('앞으로 자동 분할을 더 짧게 제안할게요.');return;}
  if(act==='short-keep'){suppressNudge('short-block');B.render(true);return;}
  if(act==='toggle-completed'){
    var li=a.closest('.smart-completed-toggle'),list=li&&li.parentElement;if(!list)return;
    var open=!li.classList.contains('open');li.classList.toggle('open',open);
    list.querySelectorAll('li.todo.done').forEach(function(x){x.classList.toggle('smart-completed-hidden',!open);});
    a.textContent=(open?'▾':'✓')+' 완료 '+list.querySelectorAll('li.todo.done').length;
    return;
  }
});

document.addEventListener('change',function(e){
  if(!e.target)return;
  if(e.target.matches('[data-learning-buffer]')){
    prefs().bufferPct=Number(e.target.value)||20;
    B.save();smartSettingsModal();return;
  }
  if(e.target.matches('[data-learning-session]')){
    prefs().maxSessionMin=Math.max(30,Math.min(60,Number(e.target.value)||60));
    B.save();smartSettingsModal();
  }
});

if(window.PLANON_SMART_UI&&typeof window.PLANON_SMART_UI.afterRender==='function'){
  var old=window.PLANON_SMART_UI.afterRender;
  window.PLANON_SMART_UI.afterRender=function(){old();afterRender();};
}

window.PLANON_SMART_LEARNING_UI={afterRender:afterRender};
afterRender();

})();