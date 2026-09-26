(function(){
'use strict';

var B=window.PLANON_UX_BRIDGE;
var D=window.PLANON_SMART_DATA;
if(!B||!D)return;

var REASONS={
  TIME_SHORTAGE:'시간 부족',
  TOOK_LONGER:'예상보다 오래 걸림',
  TIRED:'피곤함',
  UNEXPECTED_EVENT:'갑자기 일정 생김',
  PROCRASTINATED:'그냥 미룸'
};

function S(){return B.state();}
function now(){return Date.now();}
function uid(){try{return crypto.randomUUID();}catch(e){return 'learn-'+Date.now()+'-'+Math.random().toString(36).slice(2);}}
function clone(x){return JSON.parse(JSON.stringify(x));}
function dayMs(n){return Number(n||0)*86400000;}
function cutoff(days){return now()-dayMs(days);}
function num(x){x=Number(x);return isFinite(x)?x:0;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function round5(v){return Math.max(20,Math.round(v/5)*5);}

function store(){
  var st=S();
  st.settings=st.settings||{};
  var x=st.settings.smartPlanLearning;
  if(!x||typeof x!=='object')x=st.settings.smartPlanLearning={version:1,records:[],dismissed:{},nudges:{}};
  if(!Array.isArray(x.records))x.records=[];
  if(!x.dismissed||typeof x.dismissed!=='object')x.dismissed={};
  if(!x.nudges||typeof x.nudges!=='object')x.nudges={};
  prune(x);
  return x;
}

function prune(x){
  var min=cutoff(120);
  x.records=(x.records||[]).filter(function(r){return r&&num(r.createdAt)>=min;}).slice(-180);
  Object.keys(x.dismissed||{}).forEach(function(k){if(num(x.dismissed[k])<cutoff(14))delete x.dismissed[k];});
}

function typeOf(t){
  if(!t)return 'general';
  if(t.taskType)return String(t.taskType);
  var s=String(t.text||t.title||'').toLowerCase();
  if(/시험|중간|기말|퀴즈|test|exam/.test(s))return 'exam';
  if(/복습|review/.test(s))return 'review';
  if(/문제|연습|problem|practice/.test(s))return 'practice';
  if(/읽기|독서|reading|chapter|교재/.test(s))return 'reading';
  if(/과제|레포트|보고서|assignment|homework/.test(s))return 'assignment';
  return 'general';
}

function sameKind(a,b){
  if(!a||!b)return false;
  var ac=String(a.course||''),bc=String(b.course||'');
  var at=typeOf(a),bt=typeOf(b);
  if(ac&&bc&&ac===bc&&at===bt)return true;
  if(ac&&bc&&ac===bc&&(at==='general'||bt==='general'))return true;
  return !ac&&!bc&&at===bt&&at!=='general';
}

function planDate(t){
  return String((t&&t.key)||(t&&t.missedAt)||(t&&t.due)||'');
}

function recordKey(t){
  return String(t&&t.id||'')+'|'+planDate(t);
}

function hasFailure(t){
  if(!t||!t.id)return false;
  var key=recordKey(t);
  return store().records.some(function(r){return r&&r.recordKey===key;});
}

function isDismissed(t){
  if(!t||!t.id)return false;
  return !!store().dismissed[recordKey(t)];
}

function dismissFailure(t){
  if(!t||!t.id)return;
  store().dismissed[recordKey(t)]=now();
  B.save();
}

function taskById(id){
  return (S().todos||[]).find(function(t){return t&&t.id===id;})||null;
}

function recordFailure(taskId,reason){
  if(!REASONS[reason])return null;
  var t=taskById(taskId);
  if(!t)return null;
  var x=store(),key=recordKey(t),existing=x.records.find(function(r){return r&&r.recordKey===key;});
  var planned=Math.max(20,num(t.dur||t.remainingMinutes||t.estimatedMinutes||t.estimateMin||40));
  var estimated=Math.max(20,num(t.estimatedMinutes||t.estimateMin||planned));
  var actual=Math.max(0,num(t.actualMinutes||t.focusMin||0));
  var rec={
    id:existing&&existing.id||uid(),
    recordKey:key,
    taskId:t.id,
    subjectId:String(t.course||''),
    course:String(t.course||''),
    taskType:typeOf(t),
    reason:reason,
    estimatedMinutes:estimated,
    actualMinutes:actual,
    plannedMinutes:planned,
    completedMinutes:actual,
    planDate:planDate(t),
    plannedTime:String(t.time||''),
    createdAt:now()
  };
  if(existing)Object.assign(existing,rec);else x.records.push(rec);
  t.lastFailureReason=reason;
  t.lastFailureAt=rec.createdAt;
  t.lastFailurePlanDate=rec.planDate;
  delete x.dismissed[key];
  prune(x);
  B.save();
  try{window.dispatchEvent(new CustomEvent('planon:smart-failure',{detail:clone(rec)}));}catch(e){}
  return rec;
}

function recentRecords(days){
  var min=cutoff(days||60);
  return store().records.filter(function(r){return r&&num(r.createdAt)>=min;});
}

function median(vals){
  vals=(vals||[]).filter(function(v){return isFinite(v)&&v>0;}).slice().sort(function(a,b){return a-b;});
  if(!vals.length)return 0;
  var m=Math.floor(vals.length/2);
  return vals.length%2?vals[m]:(vals[m-1]+vals[m])/2;
}

function completedSamples(t){
  var out=[],min=cutoff(60);
  (S().todos||[]).forEach(function(x){
    if(!x||!x.done||x.id===t.id||!sameKind(t,x))return;
    var stamp=num(x.completedAt||x.updatedAt||x.created||x.createdAt);
    if(stamp&&stamp<min)return;
    var est=num(x.estimatedMinutes||x.estimateMin||x.planTotalMin||x.dur);
    var act=num(x.actualMinutes||x.focusMin);
    if(est>=20&&act>=10)out.push({taskId:x.id,ratio:act/est,at:stamp||0,source:'completed'});
  });
  return out;
}

function failureSamples(t){
  return recentRecords(60).filter(function(r){
    if(!r||r.reason!=='TOOK_LONGER')return false;
    var faux={course:r.course||'',taskType:r.taskType||'general',text:''};
    return sameKind(t,faux)&&num(r.estimatedMinutes)>=20&&num(r.actualMinutes)>=10;
  }).map(function(r){return {taskId:r.taskId,ratio:num(r.actualMinutes)/num(r.estimatedMinutes),at:num(r.createdAt),source:'reason'};});
}

function suggestEstimate(t){
  if(!t||D.prefs().estimateSuggestions===false)return null;
  var all=completedSamples(t).concat(failureSamples(t));
  all.sort(function(a,b){return b.at-a.at;});
  var seen={},samples=[];
  all.forEach(function(x){if(!x.taskId||seen[x.taskId])return;seen[x.taskId]=1;samples.push(x);});
  samples=samples.slice(0,8);
  var tookLonger=recentRecords(60).filter(function(r){
    if(!r||r.reason!=='TOOK_LONGER')return false;
    return sameKind(t,{course:r.course||'',taskType:r.taskType||'general',text:''});
  }).slice(-8);
  if(samples.length<3&&tookLonger.length<3)return null;
  var ratio=samples.length>=3?clamp(median(samples.map(function(x){return x.ratio;})),0.70,1.50):1.25;
  var base=Math.max(20,num(t.estimatedMinutes||t.estimateMin||t.dur||60));
  var minutes=round5(base*ratio);
  if(Math.abs(minutes-base)<5)return null;
  return {
    minutes:minutes,
    count:Math.max(samples.length,tookLonger.length),
    ratio:ratio,
    percent:Math.round((ratio-1)*100),
    source:samples.length>=3?'recent-actual':'repeated-took-longer'
  };
}

function shortageSignal(){
  var rs=recentRecords(14),relevant=rs.filter(function(r){return ['TIME_SHORTAGE','TOOK_LONGER','TIRED','UNEXPECTED_EVENT','PROCRASTINATED'].indexOf(r.reason)>=0;});
  var n=relevant.filter(function(r){return r.reason==='TIME_SHORTAGE';}).length;
  return {active:n>=3&&n/Math.max(1,relevant.length)>=0.35,count:n,total:relevant.length};
}

function bufferSuggestion(){
  var sig=shortageSignal(),p=D.prefs();
  if(!sig.active||num(p.bufferPct)>=30)return null;
  return {bufferPct:30,count:sig.count};
}

function fatiguePreference(){
  var rs=recentRecords(30).filter(function(r){return r.reason==='TIRED';});
  var late=rs.filter(function(r){var a=String(r.plannedTime||'').split(':');var m=(+a[0]||0)*60+(+a[1]||0);return m>=20*60;});
  if(late.length<3)return null;
  return {preferBeforeMin:20*60,count:late.length};
}

function orderGaps(gaps){
  gaps=(gaps||[]).slice();
  var pref=fatiguePreference();
  if(!pref)return gaps;
  return gaps.sort(function(a,b){
    var al=a[0]>=pref.preferBeforeMin?1:0,bl=b[0]>=pref.preferBeforeMin?1:0;
    return al-bl||a[0]-b[0];
  });
}

function procrastinationSuggestion(t){
  if(!t)return null;
  var faux=t,rs=recentRecords(30).filter(function(r){
    if(r.reason!=='PROCRASTINATED'||num(r.plannedMinutes)<60)return false;
    return sameKind(faux,{course:r.course||'',taskType:r.taskType||'general',text:''});
  });
  if(rs.length<2)return null;
  return {minutes:rs.length>=3?30:40,count:rs.length};
}

function preferredBlockMax(){
  var p=D.prefs(),m=num(p.maxSessionMin||60);
  return clamp(m||60,30,60);
}

function reasonLabel(code){return REASONS[code]||code||'';}

function recentReasonSummary(days){
  var counts={};
  recentRecords(days||7).forEach(function(r){counts[r.reason]=(counts[r.reason]||0)+1;});
  var keys=Object.keys(counts).sort(function(a,b){return counts[b]-counts[a];});
  return keys[0]?{reason:keys[0],label:reasonLabel(keys[0]),count:counts[keys[0]],counts:counts}:null;
}

window.PLANON_SMART_LEARNING={
  reasons:clone(REASONS),
  store:store,
  typeOf:typeOf,
  hasFailure:hasFailure,
  isDismissed:isDismissed,
  dismissFailure:dismissFailure,
  recordFailure:recordFailure,
  suggestEstimate:suggestEstimate,
  bufferSuggestion:bufferSuggestion,
  shortageSignal:shortageSignal,
  fatiguePreference:fatiguePreference,
  orderGaps:orderGaps,
  procrastinationSuggestion:procrastinationSuggestion,
  preferredBlockMax:preferredBlockMax,
  recentReasonSummary:recentReasonSummary,
  recentRecords:recentRecords
};

store();
})();