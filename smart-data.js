(function(){'use strict';
var B=window.PLANON_UX_BRIDGE;if(!B)return;
function s(){return B.state();} function clone(x){return JSON.parse(JSON.stringify(x));}
function prefs(){var S=s(),d={autoSplit:true,missedSuggestions:true,deadlineRisk:true,estimateSuggestions:true,bufferPct:20,dailyMaxMin:240};S.settings.smartPlan=Object.assign(d,S.settings.smartPlan||{});return S.settings.smartPlan;}
function ensure(){var S=s(),p=prefs();(S.todos||[]).forEach(function(t){if(t.movable===undefined)t.movable=true;if(t.autoScheduleEnabled===undefined)t.autoScheduleEnabled=t.movable!==false;if(t.estimatedMinutes===undefined&&Number(t.estimateMin)>0)t.estimatedMinutes=Number(t.estimateMin);if(t.remainingMinutes===undefined&&Number(t.estimatedMinutes||t.estimateMin)>0)t.remainingMinutes=Math.max(0,Number(t.estimatedMinutes||t.estimateMin));});(S.events||[]).forEach(function(e){if(e.movable===undefined)e.movable=false;if(e.autoScheduleEnabled===undefined)e.autoScheduleEnabled=false;if(e.kind==='appointment')e.locked=true;});(S.classes||[]).forEach(function(x){x.movable=false;x.autoScheduleEnabled=false;x.locked=true;});(S.exams||[]).forEach(function(x){x.movable=false;x.autoScheduleEnabled=false;x.locked=true;});return p;}
window.PLANON_SMART_DATA={prefs:prefs,ensure:ensure,clone:clone};ensure();
})();
