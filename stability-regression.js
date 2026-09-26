(function(){'use strict';
function clone(x){return JSON.parse(JSON.stringify(x));}
function assert(ok,msg){if(!ok)throw new Error(msg);}
function smartFieldsSurvive(normalize){
  var src={settings:{_schemaVersion:8,smartPlan:{enabled:true,autoMove:true,autoSplit:false,missedSuggestions:false,deadlineRisk:true,estimateSuggestions:false,bufferPct:30,dailyMaxMin:180,maxSessionMin:40},smartPlanLearning:{version:1,records:[{id:'r1',taskId:'t1',recordKey:'t1|2026-09-26',reason:'TOOK_LONGER',createdAt:1}],dismissed:{},nudges:{}}},classes:[],events:[],todos:[{id:'t1',title:'물리',estimatedMinutes:120,remainingMinutes:80,movable:true,autoScheduleEnabled:true,examPlan:{confidence:'low',range:'1-4'}}],routines:[],exams:[],allday:[],trackers:[],selfchat:[],diaries:[],dayCloses:[],ddays:[],memos:{},logs:{},letters:{},focus:{},fsess:{},retro:{},weeklyRetro:{},hourNotes:{},routineDone:{},modeStates:{}};
  var out=normalize(clone(src)),t=out.todos[0];
  assert(t.estimatedMinutes===120,'estimatedMinutes lost');assert(t.remainingMinutes===80,'remainingMinutes lost');assert(t.movable===true,'movable lost');assert(t.autoScheduleEnabled===true,'autoScheduleEnabled lost');assert(t.examPlan&&t.examPlan.confidence==='low','examPlan lost');assert(out.settings.smartPlan.bufferPct===30,'smartPlan lost');assert(out.settings.smartPlan.maxSessionMin===40,'maxSessionMin lost');assert(out.settings.smartPlanLearning&&out.settings.smartPlanLearning.records&&out.settings.smartPlanLearning.records[0].reason==='TOOK_LONGER','smartPlanLearning lost');return true;
}
window.PLANON_STABILITY_TEST={smartFieldsSurvive:smartFieldsSurvive};
})();
