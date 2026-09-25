function nemoSVG(mood,cls){
  var m=['basic','happy','proud','sad','gloomy','angry','sleepy'].indexOf(mood)>=0?mood:'basic';
  cls=cls||'';
  var face='';
  if(m==='happy'){
    face='<path d="M29 38 Q34 31 39 38" fill="none" stroke="#5a4033" stroke-width="3.8" stroke-linecap="round"/><path d="M53 38 Q58 31 63 38" fill="none" stroke="#5a4033" stroke-width="3.8" stroke-linecap="round"/>';
  }else if(m==='proud'){
    face='<path d="M31 33 L39 37 L31 41" fill="none" stroke="#5a4033" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M61 33 L53 37 L61 41" fill="none" stroke="#5a4033" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M41 47 Q46 53 51 47" fill="none" stroke="#5a4033" stroke-width="3.8" stroke-linecap="round"/>';
  }else if(m==='sad'){
    face='<circle cx="34" cy="37" r="3.6" fill="#5a4033"/><circle cx="58" cy="37" r="3.6" fill="#5a4033"/><path d="M42 51 Q46 46 50 51" fill="none" stroke="#5a4033" stroke-width="3.8" stroke-linecap="round"/>';
  }else if(m==='gloomy'){
    face='<path d="M29 39 L39 39" fill="none" stroke="#5a4033" stroke-width="4.2" stroke-linecap="round"/><path d="M53 39 L63 39" fill="none" stroke="#5a4033" stroke-width="4.2" stroke-linecap="round"/><path d="M43 50 L49 50" fill="none" stroke="#5a4033" stroke-width="4.2" stroke-linecap="round"/>';
  }else if(m==='angry'){
    face='<path d="M29 35 L37 38" fill="none" stroke="#5a4033" stroke-width="4" stroke-linecap="round"/><path d="M61 35 L53 38" fill="none" stroke="#5a4033" stroke-width="4" stroke-linecap="round"/><circle cx="34" cy="40" r="3.6" fill="#5a4033"/><circle cx="58" cy="40" r="3.6" fill="#5a4033"/><path d="M42 52 Q46 46 50 52" fill="none" stroke="#5a4033" stroke-width="3.8" stroke-linecap="round"/>';
  }else if(m==='sleepy'){
    face='<path d="M27 40 L39 39" fill="none" stroke="#5a4033" stroke-width="4.2" stroke-linecap="round"/><path d="M53 39 L65 40" fill="none" stroke="#5a4033" stroke-width="4.2" stroke-linecap="round"/><circle cx="46" cy="49" r="3.8" fill="none" stroke="#5a4033" stroke-width="3.8"/><circle cx="8" cy="41" r="2.6" fill="none" stroke="#b98e70" stroke-width="2.8"/><circle cx="8" cy="51" r="3.2" fill="none" stroke="#b98e70" stroke-width="2.8"/>';
  }else{
    face='<ellipse cx="34" cy="39" rx="4.4" ry="2.8" fill="#5a4033"/><ellipse cx="58" cy="39" rx="4.4" ry="2.8" fill="#5a4033"/>';
  }
  return '<span class="nemo-char '+esc(cls)+'" aria-hidden="true"><svg viewBox="0 0 92 92" role="img" focusable="false">'+
    '<path d="M72 14 L85 7 Q89 6 88 11 L84 27 Z" fill="#f8ddb2" stroke="#b98e70" stroke-width="3" stroke-linejoin="round"/>'+
    '<path d="M77 13 L85 19 M80 9 L87 14 M74 18 L83 26" fill="none" stroke="#fff1d3" stroke-width="2" stroke-linecap="round"/>'+
    '<rect x="10" y="14" width="72" height="66" rx="14" fill="var(--planner-color,#dce9f7)" stroke="#b98e70" stroke-width="3.5"/>'+
    '<path d="M24 80 Q24 89 31 89 Q38 89 38 80" fill="var(--planner-color,#dce9f7)" stroke="#b98e70" stroke-width="3.5" stroke-linejoin="round"/>'+
    '<path d="M55 80 Q55 89 62 89 Q69 89 69 80" fill="var(--planner-color,#dce9f7)" stroke="#b98e70" stroke-width="3.5" stroke-linejoin="round"/>'+face+'</svg></span>';
}
function nemoMoodForToday(total,done,hour){
  if(total<=0)return 'basic';
  if(done>=total)return 'happy';
  var remain=Math.max(0,total-done),pct=total?done/total:0;
  if(hour>=22&&remain>0)return 'sleepy';
  if(remain>=Math.max(4,Math.ceil(total*0.65)))return 'angry';
  if(done>=Math.max(1,total-1)||pct>=0.8)return 'proud';
  if(hour>=18&&pct<0.35)return 'sad';
  if(hour>=14&&(pct<0.2||remain>=Math.max(2,Math.ceil(total*0.45))))return 'gloomy';
  return 'basic';
}
function nemoMoodLabel(mood){
  var map={basic:'기본',happy:'행복',proud:'뿌듯',sad:'슬픔',gloomy:'우울',angry:'화남',sleepy:'졸림'};
  return map[mood]||'기본';
}
function nemoMoodValid(mood){return ['basic','happy','proud','sad','gloomy','angry','sleepy'].indexOf(mood)>=0;}
function diaryMoodForDate(k){
  var bridge=window.PLANON_UX_BRIDGE;
  var state=(bridge&&typeof bridge.state==='function')?bridge.state():window.S;
  var rows=((state&&state.diaries)||[]).filter(function(x){return diaryDateKey(x)===k&&nemoMoodValid(x.mood);}).sort(function(a,b){return Number(b.finishedAt||0)-Number(a.finishedAt||0);});
  return rows.length?rows[0].mood:'';
}
function nemoHomeCopy(mood,total,done,manual){
  if(manual)return ['오늘의 네모 · '+nemoMoodLabel(mood),'오늘 일기에서 고른 기분이에요'];
  if(mood==='happy')return ['오늘 네모는 행복해요','오늘 할 일을 다 해냈어요'];
  if(mood==='proud')return ['오늘 네모가 뿌듯해해요','거의 다 끝냈어요. 마지막 하나만 마무리해볼까요?'];
  if(mood==='sad')return ['네모가 조금 속상해해요','남은 할 일을 하나씩 줄여봐요'];
  if(mood==='gloomy')return ['네모가 조금 우울해해요','지친 날엔 쉬엄쉬엄 해도 괜찮아요'];
  if(mood==='angry')return ['네모가 잔뜩 바빠졌어요','할 일이 많아요. 가장 급한 것부터 해봐요'];
  if(mood==='sleepy')return ['네모가 졸려해요','밤이 늦었어요. 오늘 몫만 하고 쉬어도 돼요'];
  if(total===0)return ['오늘의 네모','일정이나 할 일을 추가하면 같이 하루를 채워가요'];
  return ['오늘의 네모',done+'/'+total+' 완료 · 이름 기본 색과 자동으로 맞춰져요'];
}
