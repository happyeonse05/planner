(function(){'use strict';var B=window.PLANON_UX_BRIDGE,D=window.PLANON_SMART_DATA;if(!B||!D)return;var last=null,timer=null;
function capture(reason){last={scheduleBefore:D.clone(B.state()),timestamp:Date.now(),changeReason:reason||'자동 계획'};}
function seal(){if(last)last.scheduleAfter=D.clone(B.state());}
function show(){var old=document.getElementById('smart-undo');if(old)old.remove();var el=document.createElement('div');el.id='smart-undo';el.innerHTML='<span>계획을 다시 정리했어요</span><button type="button">되돌리기</button>';document.body.appendChild(el);el.querySelector('button').onclick=undo;clearTimeout(timer);timer=setTimeout(function(){el.remove();},14000);}
function restoreInto(dst,src){Object.keys(dst).forEach(function(k){delete dst[k];});Object.keys(src).forEach(function(k){dst[k]=D.clone(src[k]);});}
function undo(){if(!last||!last.scheduleBefore)return;restoreInto(B.state(),last.scheduleBefore);if(B.markAuthoritativeSave)B.markAuthoritativeSave();B.save();B.render(true);var el=document.getElementById('smart-undo');if(el)el.remove();B.toast('변경 전 계획으로 되돌렸어요');last=null;}
window.PLANON_UNDO={capture:capture,seal:seal,show:show,undo:undo,last:function(){return last;}};
})();
