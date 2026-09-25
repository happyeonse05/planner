(function(){
'use strict';
var BOUNDARY_HOUR=5;
function cloneDate(v){
  if(v instanceof Date)return new Date(v.getTime());
  if(v===undefined||v===null)return new Date();
  return new Date(v);
}
function date(v){
  var d=cloneDate(v);
  if(d.getHours()<BOUNDARY_HOUR)d.setDate(d.getDate()-1);
  return d;
}
function pad(n){return String(n).padStart(2,'0');}
function key(v){var d=date(v);return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function tomorrowKey(v){var d=date(v);d.setDate(d.getDate()+1);return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function isBeforeBoundary(v){var d=cloneDate(v);return d.getHours()<BOUNDARY_HOUR;}
window.PLANON_STUDY_DAY={boundaryHour:BOUNDARY_HOUR,date:date,key:key,tomorrowKey:tomorrowKey,isBeforeBoundary:isBeforeBoundary};
})();
