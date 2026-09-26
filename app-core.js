(function(){
'use strict';

/* ---------- helpers ---------- */
var KEY='planner.v1';
var DAYS=['월','화','수','목','금','토','일'];
var PALETTE=['#faefdc','#ebebee','#f8dedd','#fbe3cf','#f8edc4','#dce9f7','#d9efe6','#e3efd6','#e7e1f4'];
var DEFAULT_LINKS=[
  {name:'학교 홈페이지',url:'https://www.skku.edu'},
  {name:'학교 공지사항',url:'https://www.skku.edu/skku/campus/skk_comm/notice01.do'},
  {name:'봉룡학사 식단',url:'https://dorm.skku.edu/dorm_suwon/lifeguide/dorm_restaurant_table.jsp'}
];
/* 캠퍼스가 나뉘는 학교는 캠퍼스별 바로가기를 따로 관리해요. */
var CAMPUS_LINKS={
  skku:{
    '서울':[
      {name:'학교 홈페이지',url:'https://www.skku.edu'},
      {name:'학교 공지사항',url:'https://www.skku.edu/skku/campus/skk_comm/notice01.do'},
      {name:'명륜학사·서울 식단',url:'https://dorm.skku.edu/dorm_seoul/'}
    ],
    '수원':[
      {name:'학교 홈페이지',url:'https://www.skku.edu'},
      {name:'학교 공지사항',url:'https://www.skku.edu/skku/campus/skk_comm/notice01.do'},
      {name:'봉룡학사·수원 식단',url:'https://dorm.skku.edu/dorm_suwon/lifeguide/dorm_restaurant_table.jsp'}
    ]
  },
  yonsei:{
    '신촌':[
      {name:'신촌캠퍼스 홈페이지',url:'https://www.yonsei.ac.kr/sc/index.do'},
      {name:'신촌 공지사항',url:'https://www.yonsei.ac.kr/sc/254/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGc2MlMkY1OCUyRjk0MjQ2MiUyRmFydGNsVmlldy5kbyUzRg%3D%3D'}
    ],
    '미래':[
      {name:'미래캠퍼스 홈페이지',url:'https://yonsei.ac.kr/wj/1415/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGd2olMkYxMDQlMkY5NDIzMzclMkZhcnRjbFZpZXcuZG8lM0Y%3D'},
      {name:'미래 공지사항',url:'https://yonsei.ac.kr/wj/1415/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGd2olMkYxMDQlMkY5NDIzMzclMkZhcnRjbFZpZXcuZG8lM0Y%3D'},
      {name:'송도학사·미래 생활관',url:'https://yicdorm.yonsei.ac.kr/'}
    ]
  },
  korea:{
    '서울':[
      {name:'학교 홈페이지',url:'https://www.korea.ac.kr/ko/index.do'},
      {name:'서울 공지사항',url:'https://www.korea.ac.kr/ko/index.do'},
      {name:'기숙사 안내',url:'https://dorm.korea.ac.kr/'}
    ],
    '세종':[
      {name:'세종캠퍼스 홈페이지',url:'https://sejong.korea.ac.kr/koreaSejong/index.do'},
      {name:'세종 공지·학사안내',url:'https://sejong.korea.ac.kr/koreaSejong/index.do'},
      {name:'세종 식단·생활관',url:'https://sejong.korea.ac.kr/koreaSejong/8025/subview.do'}
    ]
  },
  hanyang:{
    '서울':[
      {name:'서울캠퍼스 홈페이지',url:'https://www.hanyang.ac.kr/'},
      {name:'서울 공지사항',url:'https://www.hanyang.ac.kr/'},
      {name:'서울 생활관',url:'https://www.dormitory.hanyang.ac.kr/'}
    ],
    'ERICA':[
      {name:'ERICA 홈페이지',url:'https://erica.hanyang.ac.kr/web/go/home'},
      {name:'ERICA 공지사항',url:'https://erica.hanyang.ac.kr/web/go/home'},
      {name:'ERICA 캠퍼스 안내',url:'https://erica.hanyang.ac.kr/web/go/home'}
    ]
  },
  hongik:{
    '서울':[
      {name:'서울캠퍼스 홈페이지',url:'https://www.hongik.ac.kr/kr/index.do'},
      {name:'서울 공지사항',url:'https://www.hongik.ac.kr/kr/education/notice-undergrad.do?mode=list&srCategoryId=23&srEndDt=&srSearchKey=article_title&srSearchVal=&srStartDt='},
      {name:'서울 식당',url:'https://www.hongik.ac.kr/kr/life/seoul-cafeteria.do'},
      {name:'서울 기숙사',url:'https://dormitory.hongik.ac.kr/'}
    ],
    '세종':[
      {name:'세종캠퍼스 홈페이지',url:'https://www.hongik.ac.kr/kr/index.do'},
      {name:'세종 공지사항',url:'https://www.hongik.ac.kr/kr/education/notice-undergrad.do?mode=list&srCategoryId=25&srEndDt=&srSearchKey=article_title&srSearchVal=&srStartDt='},
      {name:'세종 식당',url:'https://www.hongik.ac.kr/kr/life/dining-room.do'},
      {name:'세종 기숙사',url:'https://house.hongik.ac.kr/'}
    ]
  },
  pusan:{
    '부산':[
      {name:'학교 홈페이지',url:'https://www.pusan.ac.kr/'},
      {name:'학교 공지사항',url:'https://m.pusan.ac.kr/ko/notice/cover/?current=notice'},
      {name:'부산캠퍼스 식단',url:'https://m.pusan.ac.kr/ko/meals/cover/?current=geumjeong'}
    ],
    '밀양':[
      {name:'학교 홈페이지',url:'https://www.pusan.ac.kr/'},
      {name:'학교 공지사항',url:'https://m.pusan.ac.kr/ko/notice/cover/?current=notice'},
      {name:'밀양캠퍼스 식단',url:'https://m.pusan.ac.kr/ko/meals/cover/?current=miryang'}
    ],
    '양산':[
      {name:'학교 홈페이지',url:'https://www.pusan.ac.kr/'},
      {name:'학교 공지사항',url:'https://m.pusan.ac.kr/ko/notice/cover/?current=notice'},
      {name:'양산캠퍼스 식단',url:'https://m.pusan.ac.kr/ko/meals/cover/?current=yangsan'}
    ]
  }
};
function basicSchool(id,name,url,campuses){return {id:id,name:name,campuses:campuses||['본교'],links:[{name:'학교 홈페이지',url:url}]};}
var SCHOOL_PROFILES=[
  {id:'skku',name:'성균관대학교',campuses:['수원','서울'],links:DEFAULT_LINKS},
  {id:'snu',name:'서울대학교',campuses:['관악'],links:[
    {name:'학교 홈페이지',url:'https://www.snu.ac.kr/'},
    {name:'학생처·공지사항',url:'https://student.snu.ac.kr/'},
    {name:'학생생활관',url:'https://dorm.snu.ac.kr/'}
  ]},
  {id:'yonsei',name:'연세대학교',campuses:['신촌','미래'],links:[
    {name:'학교 홈페이지',url:'https://www.yonsei.ac.kr/'},
    {name:'대학 공지사항',url:'https://www.yonsei.ac.kr/sc/254/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGc2MlMkY1OCUyRjk0MjQ2MiUyRmFydGNsVmlldy5kbyUzRg%3D%3D'},
    {name:'송도학사',url:'https://yicdorm.yonsei.ac.kr/'}
  ]},
  {id:'korea',name:'고려대학교',campuses:['서울','세종'],links:[
    {name:'학교 홈페이지',url:'https://www.korea.ac.kr/ko/index.do'},
    {name:'학교 공지사항',url:'https://www.korea.ac.kr/ko/index.do'},
    {name:'호연학사',url:'https://dormitel.korea.ac.kr/'}
  ]},
  {id:'hanyang',name:'한양대학교',campuses:['서울','ERICA'],links:[
    {name:'학교 홈페이지',url:'https://www.hanyang.ac.kr/'},
    {name:'학교 공지사항',url:'https://www.hanyang.ac.kr/'},
    {name:'기숙사 안내',url:'https://www.hanyang.ac.kr/dormitory_e'}
  ]},
  {id:'ewha',name:'이화여자대학교',campuses:['서울'],links:[
    {name:'학교 홈페이지',url:'https://www.ewha.ac.kr/ewha/index.do'},
    {name:'학교 공지사항',url:'https://www.ewha.ac.kr/ewha/news/notice.do'},
    {name:'기숙사',url:'https://dorm.ewha.ac.kr/'}
  ]},
  {id:'sogang',name:'서강대학교',campuses:['서울'],links:[{name:'학교 홈페이지',url:'https://www.sogang.ac.kr/'}]},
  {id:'cau',name:'중앙대학교',campuses:['서울','다빈치'],links:[{name:'학교 홈페이지',url:'https://www.cau.ac.kr/'}]},
  {id:'khu',name:'경희대학교',campuses:['서울','국제'],links:[{name:'학교 홈페이지',url:'https://www.khu.ac.kr/'}]},
  {id:'konkuk',name:'건국대학교',campuses:['서울','글로컬'],links:[{name:'학교 홈페이지',url:'https://www.konkuk.ac.kr/'}]},
  {id:'uos',name:'서울시립대학교',campuses:['서울'],links:[{name:'학교 홈페이지',url:'https://www.uos.ac.kr/'}]},
  {id:'hufs',name:'한국외국어대학교',campuses:['서울','글로벌'],links:[{name:'학교 홈페이지',url:'https://www.hufs.ac.kr/'}]},
  {id:'hongik',name:'홍익대학교',campuses:['서울','세종'],links:[{name:'학교 홈페이지',url:'https://www.hongik.ac.kr/'}]},
  {id:'kookmin',name:'국민대학교',campuses:['서울'],links:[{name:'학교 홈페이지',url:'https://www.kookmin.ac.kr/'}]},
  {id:'ssu',name:'숭실대학교',campuses:['서울'],links:[{name:'학교 홈페이지',url:'https://ssu.ac.kr/'}]},
  {id:'inha',name:'인하대학교',campuses:['인천'],links:[{name:'학교 홈페이지',url:'https://www.inha.ac.kr/'}]},
  {id:'ajou',name:'아주대학교',campuses:['수원'],links:[{name:'학교 홈페이지',url:'https://www.ajou.ac.kr/'}]},
  {id:'pusan',name:'부산대학교',campuses:['부산','밀양','양산'],links:[{name:'학교 홈페이지',url:'https://www.pusan.ac.kr/'}]},
  {id:'knu',name:'경북대학교',campuses:['대구','상주'],links:[{name:'학교 홈페이지',url:'https://www.knu.ac.kr/'}]},
  {id:'jnu',name:'전남대학교',campuses:['광주','여수'],links:[{name:'학교 홈페이지',url:'https://www.jnu.ac.kr/'}]},
  {id:'cnu',name:'충남대학교',campuses:['대전'],links:[{name:'학교 홈페이지',url:'https://plus.cnu.ac.kr/'}]},
  basicSchool('seoultech','서울과학기술대학교','https://www.seoultech.ac.kr/',['서울']),
  basicSchool('kw','광운대학교','https://www.kw.ac.kr/',['서울']),
  basicSchool('sejong','세종대학교','https://www.sejong.ac.kr/',['서울']),
  basicSchool('mju','명지대학교','https://www.mju.ac.kr/',['서울','용인']),
  basicSchool('gachon','가천대학교','https://www.gachon.ac.kr/',['성남','인천']),
  basicSchool('kyonggi','경기대학교','https://www.kyonggi.ac.kr/',['수원','서울']),
  basicSchool('dankook','단국대학교','https://www.dankook.ac.kr/',['죽전','천안']),
  basicSchool('inu','인천대학교','https://www.inu.ac.kr/',['인천']),
  basicSchool('kangwon','강원대학교','https://www.kangwon.ac.kr/',['춘천','삼척']),
  basicSchool('cbnu','충북대학교','https://www.chungbuk.ac.kr/',['청주']),
  basicSchool('jbnu','전북대학교','https://www.jbnu.ac.kr/',['전주']),
  basicSchool('gnu','경상국립대학교','https://www.gnu.ac.kr/',['진주','통영','창원']),
  basicSchool('yu','영남대학교','https://www.yu.ac.kr/',['경산']),
  basicSchool('kmu','계명대학교','https://www.kmu.ac.kr/',['대구','성서']),
  basicSchool('ulsan','울산대학교','https://www.ulsan.ac.kr/',['울산']),
  basicSchool('chosun','조선대학교','https://www3.chosun.ac.kr/',['광주']),
  basicSchool('jejunu','제주대학교','https://www.jejunu.ac.kr/',['제주']),
  basicSchool('hallym','한림대학교','https://www.hallym.ac.kr/',['춘천']),
  basicSchool('kaist','KAIST','https://www.kaist.ac.kr/',['대전']),
  basicSchool('postech','POSTECH','https://www.postech.ac.kr/',['포항']),
  basicSchool('dgist','DGIST','https://www.dgist.ac.kr/',['대구']),
  basicSchool('unist','UNIST','https://www.unist.ac.kr/',['울산']),
  basicSchool('gist','GIST','https://www.gist.ac.kr/',['광주']),
  basicSchool('tukorea','한국공학대학교','https://www.tukorea.ac.kr/',['시흥']),
  basicSchool('swu','서울여자대학교','https://www.swu.ac.kr/',['서울']),
  basicSchool('sungshin','성신여자대학교','https://www.sungshin.ac.kr/',['서울']),
  basicSchool('dongduk','동덕여자대학교','https://www.dongduk.ac.kr/',['서울']),
  basicSchool('duksung','덕성여자대학교','https://www.duksung.ac.kr/',['서울']),
  basicSchool('sookmyung','숙명여자대학교','https://www.sookmyung.ac.kr/',['서울']),
  basicSchool('catholic','가톨릭대학교','https://www.catholic.ac.kr/',['성심','성의','성신']),
  basicSchool('sangmyung','상명대학교','https://www.smu.ac.kr/',['서울','천안']),
  basicSchool('hansung','한성대학교','https://www.hansung.ac.kr/',['서울']),
  basicSchool('seoulgyo','서울교육대학교','https://www.snue.ac.kr/',['서울']),
  basicSchool('gyeonginyo','경인교육대학교','https://www.ginue.ac.kr/',['인천','경기']),
  basicSchool('busangyo','부산교육대학교','https://www.bnue.ac.kr/',['부산']),
  basicSchool('gongjugyo','공주교육대학교','https://www.gjue.ac.kr/',['공주']),
  basicSchool('gwangju','광주대학교','https://www.gwangju.ac.kr/',['광주']),
  basicSchool('daegu','대구대학교','https://www.daegu.ac.kr/',['경산']),
  basicSchool('dcu','대구가톨릭대학교','https://www.cu.ac.kr/',['경산']),
  basicSchool('kyungsung','경성대학교','https://ks.ac.kr/',['부산']),
  basicSchool('donga','동아대학교','https://www.donga.ac.kr/',['부산']),
  basicSchool('deu','동의대학교','https://www.deu.ac.kr/',['부산']),
  basicSchool('pknu','국립부경대학교','https://www.pknu.ac.kr/',['부산']),
  basicSchool('kmou','국립한국해양대학교','https://www.kmou.ac.kr/',['부산']),
  basicSchool('soonchunhyang','순천향대학교','https://home.sch.ac.kr/',['아산']),
  basicSchool('woosong','우송대학교','https://www.wsu.ac.kr/',['대전']),
  basicSchool('hannam','한남대학교','https://www.hannam.ac.kr/',['대전']),
  basicSchool('paichai','배재대학교','https://www.pcu.ac.kr/',['대전']),
  basicSchool('mokwon','목원대학교','https://www.mokwon.ac.kr/',['대전']),
  basicSchool('konyang','건양대학교','https://www.konyang.ac.kr/',['논산','대전']),
  basicSchool('eulji','을지대학교','https://www.eulji.ac.kr/',['성남','대전']),
  basicSchool('wonkwang','원광대학교','https://www.wku.ac.kr/',['익산']),
  basicSchool('jeonju','전주대학교','https://www.jj.ac.kr/',['전주']),
  basicSchool('kangneung','강릉원주대학교','https://www.gwnu.ac.kr/',['강릉','원주']),
  basicSchool('gnu2','국립공주대학교','https://www.kongju.ac.kr/',['공주','천안','예산']),
  basicSchool('gunsan','국립군산대학교','https://www.kunsan.ac.kr/',['군산']),
  basicSchool('mokpo','국립목포대학교','https://www.mokpo.ac.kr/',['무안','목포']),
  basicSchool('andong','국립안동대학교','https://www.andong.ac.kr/',['안동']),
  basicSchool('changwon','국립창원대학교','https://www.changwon.ac.kr/',['창원']),
  basicSchool('snu_sport','한국체육대학교','https://www.knsu.ac.kr/',['서울'])
];
function allSchoolProfiles(state){
  var cfg=state||(typeof S!=='undefined'?S:null),custom=cfg&&cfg.settings&&Array.isArray(cfg.settings.customSchools)?cfg.settings.customSchools:[];
  return SCHOOL_PROFILES.concat(custom).slice().sort(function(a,b){return String(a.name||'').localeCompare(String(b.name||''),'ko');});
}
function schoolProfile(id,state){return allSchoolProfiles(state).find(function(x){return x.id===id;})||SCHOOL_PROFILES[0];}
function schoolName(id){return schoolProfile(id).name;}
function canonicalCampus(id,campus){
  var p=schoolProfile(id),raw=String(campus||'');
  return p.campuses.find(function(c){return c===raw;})||p.campuses.find(function(c){return raw.indexOf(c)>=0||c.indexOf(raw)>=0;})||p.campuses[0]||'';
}
function schoolHost(url){return String(url||'').replace(/^https?:\/\//i,'').split('/')[0];}
function schoolSearchUrl(url,query){return 'https://search.naver.com/search.naver?query='+encodeURIComponent('site:'+schoolHost(url)+' '+query);}
function schoolLinks(id,campus){
  var p=schoolProfile(id),camp=campus||p.campuses[0]||'',campusList=CAMPUS_LINKS[id]&&CAMPUS_LINKS[id][campus];
  var list=(campusList||p.links||[]).map(function(l){return {name:l.name,url:l.url};}),names=list.map(function(l){return l.name||'';}).join(' ');
  return list.map(function(l){return {id:uid(),name:l.name,url:l.url,schoolLink:true};});
}
function isGeneratedSchoolLink(l){
  if(!l)return false;
  if(l.schoolLink===false)return false;
  if(l.schoolLink===true)return true;
  var u=String(l.url||'').replace(/\/$/,'');
  if(/^https:\/\/search\.naver\.com\/search\.naver\?query=site%3A/i.test(u))return true;
  var found=false;
  function scan(arr){(arr||[]).forEach(function(x){if(x&&String(x.url||'').replace(/\/$/,'')===u)found=true;});}
  SCHOOL_PROFILES.forEach(function(p){scan(p.links);Object.keys(CAMPUS_LINKS[p.id]||{}).forEach(function(k){scan(CAMPUS_LINKS[p.id][k]);});});
  return found;
}
function schoolOptions(sel){return allSchoolProfiles().map(function(x){return '<option value="'+x.id+'"'+(x.id===sel?' selected':'')+'>'+esc(x.name)+'</option>';}).join('')+'<option value="__add__">+ 내 학교 직접 추가</option>';}
function schoolDatalist(){return allSchoolProfiles().map(function(x){return '<option value="'+esc(x.name)+'">';}).join('');}
function setSchool(id,campus){
  var p=schoolProfile(id),custom=(S.settings.links||[]).filter(function(l){return !isGeneratedSchoolLink(l);});
  var nextCampus=canonicalCampus(p.id,campus);
  S.settings.school=p.id;S.settings.schoolCampus=nextCampus;
  S.settings.schoolConfigured=true;
  S.settings.links=schoolLinks(p.id,nextCampus).concat(custom);
  save();
}
var DEFAULT_TRK=[
  {id:'study',name:'공부 시간',type:'dur'},
  {id:'wake',name:'일어난 시간',type:'time'},
  {id:'sleep',name:'취침 시간',type:'time'},
  {id:'sstart',name:'공부 시작',type:'time'},
  {id:'send',name:'공부 끝',type:'time'}
];
var BEIGE='#faefdc';
var $=function(s){return document.querySelector(s);};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function pad(n){return String(n).padStart(2,'0');}
function dkey(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function studyDayDate(d){return window.PLANON_STUDY_DAY?window.PLANON_STUDY_DAY.date(d):new Date((d||new Date()).getTime?d.getTime():d);}
function studyDayKey(d){return window.PLANON_STUDY_DAY?window.PLANON_STUDY_DAY.key(d):dkey(d||new Date());}
function studyTomorrowKey(d){return window.PLANON_STUDY_DAY?window.PLANON_STUDY_DAY.tomorrowKey(d):dkey(addDays(d||new Date(),1));}
function mkey(d){return d.getFullYear()+'-'+pad(d.getMonth()+1);}
function parseKey(k){var p=k.split('-').map(Number);return new Date(p[0],p[1]-1,p[2]);}
function addDays(d,n){return new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);}
function addMonths(d,n){
  var t=new Date(d.getFullYear(),d.getMonth()+n,1);
  var dim=new Date(t.getFullYear(),t.getMonth()+1,0).getDate();
  return new Date(t.getFullYear(),t.getMonth(),Math.min(d.getDate(),dim));
}
function dow(d){return (d.getDay()+6)%7;}            // 월=0 … 일=6
function mondayOf(d){return addDays(d,-dow(d));}
function toMin(t){var p=t.split(':').map(Number);return p[0]*60+p[1];}
function fmt(m){return pad(Math.floor(m/60))+':'+pad(m%60);}
function uid(){return Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4);}

/* ---------- 기본 시간표 (스크린샷 기준) ---------- */
var DEFAULT_CLASSES=[];

/* ---------- 플래너 유형 ---------- */
var PLANNER_MODES={
  university:{label:'대학생',sub:'공강 · 강의 · 과제',schedule:'시간표'},
  school:{label:'중·고등학생',sub:'빈 시간 · 수업 · 수행평가',schedule:'시간표'},
  exam:{label:'N수 · 고시',sub:'공부 시간 · 과목 · 시험 계획',schedule:'공부 스케줄'},
  other:{label:'기타',sub:'내 방식대로 쓰는 플래너',schedule:'스케줄'}
};
var MODE_DATA_KEYS=['classes','events','todos','routines','exams','allday','hourNotes','logs','focus','retro','weeklyRetro','fsess','dayCloses','ddays','routineDone','memos','schedulePrepTemplates'];
function plannerMode(){var k=S&&S.settings&&S.settings.plannerMode||'university';return PLANNER_MODES[k]?k:'university';}
function plannerModeMeta(k){return PLANNER_MODES[k||plannerMode()]||PLANNER_MODES.university;}
function modeBlockWord(k){var m=k||plannerMode();return m==='university'?'강의':m==='school'?'수업':m==='exam'?'공부':'일정';}
function modeGapWord(k){return (k||plannerMode())==='university'?'공강':'빈 시간';}
function emptyModeState(){return {classes:[],events:[],todos:[],routines:[],exams:[],allday:[],hourNotes:{},logs:{},focus:{},retro:{},weeklyRetro:{},fsess:{},dayCloses:[],ddays:[],routineDone:{},memos:{},schedulePrepTemplates:{}};}
function snapshotModeState(){var out={};MODE_DATA_KEYS.forEach(function(k){out[k]=JSON.parse(JSON.stringify(S[k]!==undefined?S[k]:emptyModeState()[k]));});return out;}
function applyModeState(st){var blank=emptyModeState(),src=st&&typeof st==='object'?st:{};MODE_DATA_KEYS.forEach(function(k){S[k]=JSON.parse(JSON.stringify(src[k]!==undefined?src[k]:blank[k]));});if(Array.isArray(S.todos))S.todos.forEach(function(t){if(t&&typeof t==='object')t.isCore=t.isCore===true;});}
function switchPlannerMode(next){
  if(!PLANNER_MODES[next]||next===plannerMode())return;
  S.modeStates=S.modeStates||{};
  S.modeStates[plannerMode()]=snapshotModeState();
  if(!S.modeStates[next])S.modeStates[next]=emptyModeState();
  applyModeState(S.modeStates[next]);
  S.settings.plannerMode=next;U.date=studyDayDate(new Date());U.tab='ttable';U.settingsPage='';
  save();render(true);inAppToast(plannerModeMeta(next).label+' 플래너로 전환했어요');
}
function modePillsHTML(active,act){return '<div class="mode-pills">'+Object.keys(PLANNER_MODES).map(function(k){var m=PLANNER_MODES[k];return '<button class="mode-pill'+(k===active?' on':'')+'" data-act="'+(act||'switch-mode')+'" data-v="'+k+'"><b>'+m.label+'</b><small>'+m.sub+'</small></button>';}).join('')+'</div>';}
function modeSwitchButtonHTML(){return '<button class="mode-top" data-act="open-mode-switch" aria-label="플래너 유형 바꾸기">'+esc(plannerModeMeta().label)+'</button>';}
function openModeSwitch(){M={type:'mode-switch'};openModal('<h3>플래너 유형</h3><p class="hint">유형마다 시간표·할 일·시험·일정이 따로 보관돼요. 다른 유형으로 갔다가 돌아와도 기존 내용은 그대로 남아요.</p>'+modePillsHTML(plannerMode(),'switch-mode')+'<div class="acts"><button class="b-ghost" data-act="close">닫기</button></div>');}

/* ---------- 상태 & 저장 ---------- */
function defaults(){
  return {
    classes:DEFAULT_CLASSES.map(function(c){return Object.assign({id:uid()},c);}),
    events:[],todos:[],routines:[],exams:[],allday:[],hourNotes:{},logs:{},letters:{},focus:{},retro:{},weeklyRetro:{},fsess:{},selfchat:[],diaries:[],dayCloses:[],ddays:[],modeStates:{},trackers:DEFAULT_TRK.map(function(t){return Object.assign({},t);}),routineDone:{},memos:{},schedulePrepTemplates:{},settings:{plannerMode:'university',weekend:true,weekV2:true,colorV2:true,logOn:true,calItem:'study',calDday:'icon',remindOn:false,liteHome:true,showTodoTab:true,locationEnabled:false,notified:{},schoolLastChecked:0,wakeGoal:'09:00',profileName:'',profilePhoto:'',homeStation:'',originRules:[],originWeekOverrides:[],bgLinkedV3:true,schoolConfigured:false,onboardDone:false,logDisplay:{wakeGoal:true,wakeTime:true,sleepTime:true,studyTotal:true},monthItems:{appointment:true,event:true,dday:true,exam:true,allday:true,todo:true},topShow:true,topOrder:[],pinnedFriends:[],blockedUsers:[],friendMemories:[],customSchools:[],recipes:[],links:DEFAULT_LINKS.map(function(l){return {id:uid(),name:l.name,url:l.url};})},updatedAt:0
  };
}
function normalize(s){
  var d=defaults(),hadSavedSchool=!!(s&&s.settings&&s.settings.school);
  var o=Object.assign(d,s||{});
  o.settings=Object.assign({weekend:false},(s&&s.settings)||{});
  if(!Array.isArray(o.settings.customSchools))o.settings.customSchools=[];
  if(!Array.isArray(o.settings.pinnedFriends))o.settings.pinnedFriends=[];
  if(!Array.isArray(o.settings.blockedUsers))o.settings.blockedUsers=[];
  if(!o.settings.blockedUserNames||typeof o.settings.blockedUserNames!=='object')o.settings.blockedUserNames={};
  if(!Array.isArray(o.settings.friendMemories))o.settings.friendMemories=[];
  if(o.settings.showMeetMaker===undefined)o.settings.showMeetMaker=true;
  if(!Array.isArray(o.settings.recipes))o.settings.recipes=[];
  if(!o.settings.market||typeof o.settings.market!=='object'||Array.isArray(o.settings.market))o.settings.market={};
  if(!Array.isArray(o.settings.market.owned))o.settings.market.owned=[];
  if(!Array.isArray(o.settings.market.wishlist))o.settings.market.wishlist=[];
  if(!Array.isArray(o.settings.market.purchaseLog))o.settings.market.purchaseLog=[];
  if(!o.settings.market.active||typeof o.settings.market.active!=='object')o.settings.market.active={};
  o.settings.recipes=o.settings.recipes.map(function(r){
    if(!r||typeof r!=='object')return null;
    var title=String(r.title||'').trim().slice(0,50);
    if(!title)return null;
    return {id:r.id||uid(),title:title,ingredients:String(r.ingredients||'').slice(0,4000),steps:String(r.steps||'').slice(0,6000),memo:String(r.memo||'').slice(0,3000),favorite:!!r.favorite,createdAt:Number(r.createdAt||Date.now()),updatedAt:Number(r.updatedAt||r.createdAt||Date.now())};
  }).filter(Boolean).slice(0,200);

  if(!o.modeStates||typeof o.modeStates!=='object'||Array.isArray(o.modeStates))o.modeStates={};
  if(['university','school','exam','other'].indexOf(o.settings.plannerMode)<0)o.settings.plannerMode='university';
  if(typeof o.settings.profileName!=='string')o.settings.profileName='';
  o.settings.profileName=o.settings.profileName.trim().slice(0,20);
  if(typeof o.settings.profilePhoto!=='string')o.settings.profilePhoto='';
  if(typeof o.settings.homeStation!=='string')o.settings.homeStation='';
  if(!Array.isArray(o.settings.originRules))o.settings.originRules=[];
  o.settings.originRules=o.settings.originRules.map(function(r){
    if(!r||typeof r!=='object')return null;
    var from=/^\d{2}:\d{2}$/.test(r.from||'')?r.from:'08:00';
    var to=/^\d{2}:\d{2}$/.test(r.to||'')?r.to:'12:00';
    var origin=String(r.origin||'').trim();
    var days=Array.isArray(r.days)?r.days.map(Number).filter(function(x){return x>=0&&x<=6;}):[0,1,2,3,4,5,6];
    if(!days.length)days=[0,1,2,3,4,5,6];
    return origin?{id:r.id||uid(),from:from,to:to,origin:origin,days:days}:null;
  }).filter(Boolean).slice(0,16);
  if(!Array.isArray(o.settings.originWeekOverrides))o.settings.originWeekOverrides=[];
  o.settings.originWeekOverrides=o.settings.originWeekOverrides.map(function(r){
    if(!r||typeof r!=='object')return null;
    var date=/^\d{4}-\d{2}-\d{2}$/.test(r.date||'')?r.date:'';
    var from=/^\d{2}:\d{2}$/.test(r.from||'')?r.from:'08:00';
    var to=/^\d{2}:\d{2}$/.test(r.to||'')?r.to:'12:00';
    var origin=String(r.origin||'').trim();
    return date&&origin?{id:r.id||uid(),date:date,from:from,to:to,origin:origin}:null;
  }).filter(Boolean).slice(0,20);
  if(o.settings.schoolConfigured===undefined)o.settings.schoolConfigured=hadSavedSchool;
  if(o.settings.onboardDone===undefined)o.settings.onboardDone=hadSavedSchool;
  if(!o.settings.notified||typeof o.settings.notified!=='object')o.settings.notified={};
  if(o.settings.remindOn===undefined)o.settings.remindOn=false;
  if(o.settings.showTodoTab===undefined)o.settings.showTodoTab=true;
  if(o.settings.locationEnabled===undefined)o.settings.locationEnabled=false;
  if(o.settings.showWeeklyReview===undefined)o.settings.showWeeklyReview=true;
  if(o.settings.diaryRuled===undefined)o.settings.diaryRuled=true;
  if(o.settings.morningBriefing===undefined)o.settings.morningBriefing=false;
  if(!/^\d{2}:\d{2}$/.test(o.settings.morningBriefingTime||''))o.settings.morningBriefingTime='08:00';
  if(o.settings.cheerReceiveTime!=null&&!/^(?:0[8-9]|1\d|2[0-3]):[0-5]\d$/.test(o.settings.cheerReceiveTime||''))delete o.settings.cheerReceiveTime;
  if(!o.settings.cheerSent||typeof o.settings.cheerSent!=='object')o.settings.cheerSent={};
  if(o.settings.schoolLastChecked==null)o.settings.schoolLastChecked=0;
  if(!o.settings.school||!schoolProfile(o.settings.school,o))o.settings.school='skku';
  o.settings.schoolCampus=canonicalCampus(o.settings.school,o.settings.schoolCampus);
  if(!o.settings.wakeGoal)o.settings.wakeGoal='09:00';
  o.settings.logDisplay=Object.assign({wakeGoal:true,wakeTime:true,sleepTime:true,studyTotal:true},o.settings.logDisplay||{});
  if(o.settings.topShow===undefined)o.settings.topShow=true;
  if(!Array.isArray(o.settings.chatRooms))o.settings.chatRooms=[];
  if(!o.settings.chatHidden||typeof o.settings.chatHidden!=='object')o.settings.chatHidden={};
  if(!o.settings.chatRoomNames||typeof o.settings.chatRoomNames!=='object')o.settings.chatRoomNames={};
  ['classes','events','todos','routines','exams','allday','trackers','selfchat','diaries','dayCloses','ddays'].forEach(function(k){if(!Array.isArray(o[k]))o[k]=d[k];});
  /* 오늘의 핵심: 기존 할 일 데이터는 그대로 두고 isCore 필드만 안전하게 보완 */
  o.todos.forEach(function(t){if(t&&typeof t==='object')t.isCore=t.isCore===true;});
  o.dayCloses=o.dayCloses.map(function(c){
    if(!c||typeof c!=='object')return null;
    c.key=c.key||c.date||'';c.date=c.date||c.key||'';
    if(!c.id&&c.key)c.id='dayclose-'+c.key;
    if(!c.closedAt)c.closedAt=new Date(Number(c.finishedAt||Date.now())).toISOString();
    if(c.doneCount==null)c.doneCount=Number(c.done||0);
    if(c.totalCount==null)c.totalCount=Number(c.total||0);
    if(c.coreDone==null)c.coreDone=0;if(c.coreTotal==null)c.coreTotal=0;
    if(c.comment==null)c.comment=String(c.note||c.word||'').slice(0,40);
    if(!c.visibility)c.visibility='private';
    if(c.cardVersion==null)c.cardVersion=2;
    return c;
  }).filter(Boolean);
  if(!o.schedulePrepTemplates||typeof o.schedulePrepTemplates!=='object')o.schedulePrepTemplates={};
  DEFAULT_TRK.forEach(function(t){if(!o.trackers.some(function(x){return x.id===t.id;}))o.trackers.push(Object.assign({},t));});
  if(!o.memos||typeof o.memos!=='object')o.memos={};
  if(!o.routineDone||typeof o.routineDone!=='object')o.routineDone={};
  if(!o.hourNotes||typeof o.hourNotes!=='object')o.hourNotes={};
  if(!o.logs||typeof o.logs!=='object')o.logs={};
  if(!o.letters||typeof o.letters!=='object')o.letters={};
  if(!o.focus||typeof o.focus!=='object')o.focus={};
  if(!o.retro||typeof o.retro!=='object')o.retro={};
  if(!o.weeklyRetro||typeof o.weeklyRetro!=='object')o.weeklyRetro={};
  if(!o.fsess||typeof o.fsess!=='object')o.fsess={};
  o.selfchat.forEach(function(m){
    if(m.photo&&!m.photos)m.photos=[m.photo];
    if(!Array.isArray(m.photos))m.photos=[];
    if(!m.room)m.room='general';
  });
  Object.keys(o.memos).forEach(function(k){
    if(typeof o.memos[k]==='string')o.memos[k]={text:o.memos[k],photos:[]};
    else if(!o.memos[k]||typeof o.memos[k]!=='object')o.memos[k]={text:'',photos:[]};
    if(!Array.isArray(o.memos[k].photos))o.memos[k].photos=[];
  });
  Object.keys(o.letters).forEach(function(k){
    if(o.letters[k]&&o.letters[k].photo)delete o.letters[k].photo;
  });
  if(o.settings.letterOn===undefined)o.settings.letterOn=true;
  if(!o.settings.theme&&lsGet('planner.theme'))o.settings.theme=lsGet('planner.theme');
  if(!o.settings.bg&&lsGet('planner.bg'))o.settings.bg=lsGet('planner.bg');
  if(!o.settings.weekV2){o.settings.weekend=true;o.settings.weekV2=true;}
  if(o.settings.logOn===undefined)o.settings.logOn=true;
  if(!o.settings.defColor&&lsGet('planner.defColor'))o.settings.defColor=lsGet('planner.defColor');
  if(!o.settings.calItem)o.settings.calItem='study';
  if(!o.settings.calDday||o.settings.calDday==='star')o.settings.calDday='icon';
  /* 이전 버전에서 '기본'으로 저장된 배경도 이름 기본 색 연동으로 한 번 교정 */
  if(o.settings.bgLinkedV3===undefined){if(!o.settings.bg||o.settings.bg==='plain')o.settings.bg='rainbow';o.settings.bgLinkedV3=true;}
  o.settings.monthItems=Object.assign({appointment:true,event:true,dday:true,exam:true,allday:true,todo:true},o.settings.monthItems||{});
  if(!Array.isArray(o.settings.topOrder))o.settings.topOrder=[];
  if(!Array.isArray(o.settings.links))o.settings.links=[];
  /* 학교를 바꾸기 전 버전에서 남은 학교 링크·검색 링크를 제거하고
     현재 학교/캠퍼스 공식 링크만 다시 만들어요. 사용자 추가 링크는 보존해요. */
  var customLinks=o.settings.links.filter(function(l){return !isGeneratedSchoolLink(l);});
  o.settings.links=schoolLinks(o.settings.school,o.settings.schoolCampus).concat(customLinks);
  var OLDB=['#efe7da','#f4e0bf'];
  o.classes.forEach(function(c){if(OLDB.indexOf(c.color)>=0)c.color=BEIGE;});
  o.events.forEach(function(e){if(OLDB.indexOf(e.color)>=0)e.color=BEIGE; e.packing=cleanPackItems(e.packing);});
  o.events.forEach(function(e){if(e.important!==true)e.important=false;});
  o.ddays.forEach(function(x){if(!x.category)x.category=ddInferCategory(x);if(x.category==='couple'){x.mode='since';x.one=true;x.yearly=false;}});
  o.allday.forEach(function(e){if(OLDB.indexOf(e.color)>=0)e.color=BEIGE; e.packing=cleanPackItems(e.packing);});
  if(!o.settings.colorV2){
    o.classes.forEach(function(c){c.color=BEIGE;});
    o.events.forEach(function(e){if(PALETTE.indexOf(e.color)<0)e.color=PALETTE[5];});
    o.settings.colorV2=true;
  }
  return migratePlannerState(o);
}
/* ---------- 앱 데이터 스키마 / 안전 마이그레이션 ---------- */
var APP_SCHEMA_VERSION=8;
function migratePlannerState(st){
  if(!st||typeof st!=='object')return st;
  st.settings=st.settings&&typeof st.settings==='object'?st.settings:{};
  var v=Number(st.settings._schemaVersion||1);
  /* 마이그레이션은 추가형만 사용: 기존 사용자 필드를 삭제/초기화하지 않아요. */
  if(v<2){if(st.settings.onboardDone===undefined)st.settings.onboardDone=!!st.settings.schoolConfigured;v=2;}
  if(v<3){if(!st.settings.monthItems)st.settings.monthItems={appointment:true,event:true,dday:true,exam:true,allday:true,todo:true};v=3;}
  if(v<4){st.settings._lastMigrationAt=Date.now();v=4;}
  if(v<5){if(!st.settings._syncMeta)st.settings._syncMeta={cols:{},maps:{}};v=5;}
  if(v<6){if(Array.isArray(st.todos))st.todos.forEach(function(t){if(t&&t.isCore!==true)t.isCore=false;});v=6;}
  if(v<7){var coreByDay={};if(Array.isArray(st.todos))st.todos.slice().sort(function(a,b){return Number(a.order||a.created||0)-Number(b.order||b.created||0);}).forEach(function(t){if(!t||t.isCore!==true||t.scope!=='day'||!t.key)return;var n=coreByDay[t.key]||0;if(n>=3)t.isCore=false;else coreByDay[t.key]=n+1;});v=7;}
  if(v<8){
    st.settings.smartPlan=Object.assign({autoSplit:true,missedSuggestions:true,deadlineRisk:true,estimateSuggestions:true,bufferPct:20,dailyMaxMin:240},st.settings.smartPlan||{});
    if(Array.isArray(st.todos))st.todos.forEach(function(t){if(!t||typeof t!=='object')return;if(t.movable===undefined)t.movable=true;if(t.autoScheduleEnabled===undefined)t.autoScheduleEnabled=t.movable!==false;if(t.estimatedMinutes===undefined&&Number(t.estimateMin)>0)t.estimatedMinutes=Number(t.estimateMin);if(t.remainingMinutes===undefined&&Number(t.estimatedMinutes||t.estimateMin)>0)t.remainingMinutes=Math.max(0,Number(t.estimatedMinutes||t.estimateMin));});
    if(Array.isArray(st.events))st.events.forEach(function(e){if(!e||typeof e!=='object')return;if(e.movable===undefined)e.movable=e.kind==='appointment'?false:false;if(e.autoScheduleEnabled===undefined)e.autoScheduleEnabled=false;if(e.kind==='appointment')e.locked=true;});
    if(Array.isArray(st.classes))st.classes.forEach(function(c){if(c&&typeof c==='object'){if(c.movable===undefined)c.movable=false;if(c.autoScheduleEnabled===undefined)c.autoScheduleEnabled=false;c.locked=true;}});
    if(Array.isArray(st.exams))st.exams.forEach(function(e){if(e&&typeof e==='object'){if(e.movable===undefined)e.movable=false;if(e.autoScheduleEnabled===undefined)e.autoScheduleEnabled=false;e.locked=true;}});
    v=8;
  }
  st.settings._schemaVersion=APP_SCHEMA_VERSION;
  return st;
}
function plannerStateValid(st){
  if(!st||typeof st!=='object'||!st.settings||typeof st.settings!=='object')return false;
  var arrays=['classes','events','todos','routines','exams','allday','trackers','selfchat','diaries','dayCloses','ddays'];
  for(var i=0;i<arrays.length;i++)if(!Array.isArray(st[arrays[i]]))return false;
  return true;
}
var storageOK=true;
function load(){
  try{
    var raw=localStorage.getItem(KEY);
    if(raw)return normalize(JSON.parse(raw));
  }catch(e){}
  try{localStorage.setItem('planner.test','1');localStorage.removeItem('planner.test');}catch(e){storageOK=false;}
  return defaults();
}
var S=load();
PREF_H=prefHash(S);
function backupData(){
  var d=JSON.parse(JSON.stringify(S||{}));
  delete d.updatedAt;
  return d;
}
function hasPlannerData(st){
  if(!st)return false;
  /* 기본 시간표·기본 기록 항목은 새 계정에도 들어 있어서 '내용'으로 치지 않아요.
     (예전엔 이것 때문에 빈 계정도 내용이 있는 걸로 판단돼, 빈 데이터가 덮어쓰는 걸 못 막았어요) */
  return ['classes','events','todos','routines','exams','allday','ddays','selfchat','diaries','dayCloses'].some(function(k){return Array.isArray(st[k])&&st[k].length>0;})||
    ['memos','logs','letters','hourNotes','retro','focus','fsess','routineDone'].some(function(k){return st[k]&&typeof st[k]==='object'&&Object.keys(st[k]).length>0;})||
    !!(st.settings&&((st.settings.chatRooms||[]).length||(st.settings.friendMemories||[]).length||st.settings.schoolConfigured||st.settings.onboardDone||st.settings.profileName||st.settings.school));
}
/* 계정별 보관함
   localStorage의 planner.v1 하나만 공유하면 로그아웃 후 다른 계정의 빈 데이터가
   이전 계정 데이터를 밀어낼 수 있어요. 계정별 사본을 따로 두고, 서버 동기화 전에
   현재 계정과 다음 계정의 데이터를 분리해요. */
function accountKey(uid){return uid?'planner.account.'+uid:'';}
function saveAccountState(uid,st){
  if(Sync&&Sync.deleting)return;
  if(!uid||!st||/^loggedout:/.test(uid))return;
  try{lsSet(accountKey(uid),JSON.stringify(st));}catch(e){}
}
function readAccountState(uid){
  if(!uid)return null;
  var raw=lsGet(accountKey(uid));
  try{return raw?normalize(JSON.parse(raw)):null;}catch(e){return null;}
}

/* ---------- 무거운 백업은 IndexedDB에 ----------
   예전엔 전체 사본(자동 백업 20개 + 날짜별 30개 + 로그아웃·정상상태 등)을 전부
   localStorage(약 5MB)에 넣어서 금방 꽉 찼고, 그 뒤로는 백업·저장이 조용히 실패했어요.
   이제 큰 사본은 전부 IndexedDB에 두고 localStorage엔 지금 상태만 둬요. */
var BK={db:null,wait:null,lastGoodAt:0};
function bkOpen(){
  if(BK.db)return Promise.resolve(BK.db);
  if(BK.wait)return BK.wait;
  BK.wait=new Promise(function(res){
    try{
      if(!window.indexedDB){BK.wait=null;res(null);return;}
      var req=indexedDB.open('planner-safe-backups-v1',2);
      req.onupgradeneeded=function(){var d=req.result;
        if(!d.objectStoreNames.contains('snapshots'))d.createObjectStore('snapshots',{keyPath:'id',autoIncrement:true});
        if(!d.objectStoreNames.contains('kv'))d.createObjectStore('kv');};
      req.onsuccess=function(){BK.db=req.result;res(BK.db);};
      req.onerror=function(){BK.wait=null;res(null);};
      req.onblocked=function(){BK.wait=null;res(null);};
    }catch(e){BK.wait=null;res(null);}
  });
  return BK.wait;
}
function bkPut(k,raw){
  if(!raw)return Promise.resolve(false);
  return bkOpen().then(function(db){
    if(!db){try{localStorage.setItem('planner.bk.'+k,raw);return true;}catch(e){return false;}}
    return new Promise(function(res){try{var tx=db.transaction('kv','readwrite');tx.objectStore('kv').put({at:Date.now(),raw:raw},k);tx.oncomplete=function(){res(true);};tx.onerror=tx.onabort=function(){res(false);};}catch(e){res(false);}});
  });
}
/* 계정별 현재 상태 금고: localStorage와 별개로 IndexedDB에도 최신 전체 상태를 보관해요.
   시간이 지난 뒤 Safari/localStorage 또는 오래된 서버 상태가 문제를 일으켜도 이 사본과 합쳐 복구합니다. */
function currentVaultKey(uid){return uid?'current.'+uid:'current.local';}
function vaultPut(uid,st){
  if(Sync&&Sync.deleting)return Promise.resolve(false);
  if(!st)return Promise.resolve(false);
  var raw;try{raw=JSON.stringify(st);}catch(e){return Promise.resolve(false);}
  return bkPut(currentVaultKey(uid),raw);
}
function vaultGet(uid){
  return bkGetRec(currentVaultKey(uid)).then(function(rec){
    if(!rec||!rec.raw)return null;
    try{return normalize(JSON.parse(rec.raw));}catch(e){return null;}
  });
}
function restoreCurrentVault(uid){
  if(!uid)return Promise.resolve(false);
  return vaultGet(uid).then(function(v){
    if(!v)return false;
    var before=itemCount(S),vn=itemCount(v);
    /* 금고와 현재 상태를 항상 합쳐 한쪽에만 있는 항목을 보존합니다.
       설정은 prefsAt 규칙을 그대로 사용해 더 최근 설정을 따릅니다. */
    var joined=mergeState(S,v,null);
    if(JSON.stringify(joined)===JSON.stringify(S))return false;
    joined.updatedAt=Math.max(Date.now(),S.updatedAt||0,v.updatedAt||0);
    S=joined;PREF_H=prefHash(S);
    try{localStorage.setItem(KEY,JSON.stringify(S));storageOK=true;}catch(e){storageOK=false;}
    saveAccountState(uid,S);
    if(vn>before&&typeof inAppToast==='function')inAppToast('기기 안전 보관함에서 플래너를 복구했어요');
    return true;
  });
}

function bkGetRec(k){
  return bkOpen().then(function(db){
    if(!db){
      var legacy=k==='logout'?'planner.logoutBackup':k.indexOf('logout.')===0?'planner.logoutBackup.'+k.slice(7):
        k==='lastGood'?'planner.lastGoodBackup':k.indexOf('lastGood.')===0?'planner.lastGoodBackup.'+k.slice(9):
        k==='remote'?'planner.remoteBackup':k==='prev'?'planner.prevBackup':k.indexOf('snap.')===0?'planner.snap.'+k.slice(5):'';
      var r=lsGet('planner.bk.'+k)||(legacy?lsGet(legacy):null);
      return r?{at:0,raw:r}:null;
    }
    return new Promise(function(res){try{var q=db.transaction('kv','readonly').objectStore('kv').get(k);q.onsuccess=function(){res(q.result&&q.result.raw?q.result:null);};q.onerror=function(){res(null);};}catch(e){res(null);}});
  });
}
function bkDel(k){
  return bkOpen().then(function(db){
    if(!db){try{localStorage.removeItem('planner.bk.'+k);}catch(e){}return;}
    try{db.transaction('kv','readwrite').objectStore('kv').delete(k);}catch(e){}
  });
}
/* 계정별 키를 먼저 찾고, 없으면 공용 키 */
function bkFirst(keys){
  return keys.filter(Boolean).reduce(function(p,k){return p.then(function(r){return r||bkGetRec(k);});},Promise.resolve(null));
}
function bkOwner(){var o=Sync&&Sync.uid||lsGet('planner.activeUser')||'';return /^loggedout:/.test(o)?o.slice(10):o;}
function bkKeys(name){var o=bkOwner();return o?[name+'.'+o]:[name];}
function savePrevBackup(st){
  if(!st||!hasPlannerData(st))return Promise.resolve(false);
  var raw;try{raw=JSON.stringify(st);}catch(e){return Promise.resolve(false);}
  var o=bkOwner();
  return bkPut(o?'prev.'+o:'prev',raw);
}
/* 자동 백업 기록: 최근 24시간을 촘촘히 보존 (15분 간격, 최대 96개) */
function bkRingAdd(st,force){
  if(Sync&&Sync.deleting)return Promise.resolve(false);
  if(!st||!hasPlannerData(st))return Promise.resolve(false);
  var last=+(lsGet('planner.idbAt')||0);
  if(!force&&Date.now()-last<15*60000)return Promise.resolve(false);
  lsSet('planner.idbAt',String(Date.now()));
  var data;try{data=JSON.parse(JSON.stringify(st));}catch(e){return Promise.resolve(false);}
  var owner=bkOwner();
  return bkOpen().then(function(db){
    if(!db)return false;
    return new Promise(function(res){try{var tx=db.transaction('snapshots','readwrite'),os=tx.objectStore('snapshots');
      os.add({at:Date.now(),owner:owner,data:data});
      var kr=os.getAllKeys();kr.onsuccess=function(){var ks=kr.result||[];ks.slice(0,Math.max(0,ks.length-96)).forEach(function(k){os.delete(k);});};
      tx.oncomplete=function(){res(true);};tx.onerror=tx.onabort=function(){res(false);};}catch(e){res(false);}});
  });
}
function bkRingList(){
  return bkOpen().then(function(db){
    if(!db)return [];
    return new Promise(function(res){try{var q=db.transaction('snapshots','readonly').objectStore('snapshots').getAll();q.onsuccess=function(){res((q.result||[]).sort(function(a,b){return b.at-a.at;}));};q.onerror=function(){res([]);};}catch(e){res([]);}});
  });
}
function saveLocalBackupLayers(st){bkRingAdd(st,true);}
/* 예전 localStorage 사본을 IndexedDB로 옮기고 자리를 비워요 */
function bkMigrate(){
  var moves=[];
  try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(!k)continue;var m=null;
    if(k==='planner.logoutBackup')m='logout';
    else if(k.indexOf('planner.logoutBackup.')===0)m='logout.'+k.slice(21);
    else if(k==='planner.lastGoodBackup')m='lastGood';
    else if(k.indexOf('planner.lastGoodBackup.')===0)m='lastGood.'+k.slice(23);
    else if(k==='planner.remoteBackup')m='remote';
    else if(k==='planner.prevBackup')m='prev';
    else if(k.indexOf('planner.snap.')===0)m='snap.'+k.slice(13);
    else if(k==='planner.backupRing')m='__ring';
    if(m)moves.push([k,m]);}}catch(e){}
  if(!moves.length)return Promise.resolve();
  return bkOpen().then(function(db){
    if(!db)return;
    return moves.reduce(function(p,mv){return p.then(function(){
      var raw=lsGet(mv[0]);if(!raw)return;
      if(mv[1]==='__ring'){
        var ring=[];try{ring=JSON.parse(raw)||[];}catch(e){}
        return new Promise(function(res){try{var tx=db.transaction('snapshots','readwrite'),os=tx.objectStore('snapshots');
          (Array.isArray(ring)?ring:[]).forEach(function(x){if(x&&x.data)os.add({at:x.at||0,owner:'',data:x.data});});
          tx.oncomplete=function(){try{localStorage.removeItem(mv[0]);}catch(e){}res();};tx.onerror=tx.onabort=function(){res();};}catch(e){res();}});
      }
      return bkPut(mv[1],raw).then(function(ok){if(ok){try{localStorage.removeItem(mv[0]);}catch(e){}}});
    });},Promise.resolve());
  }).then(function(){
    /* 공간이 생겼으니 지금 상태를 다시 저장해봐요 */
    var was=storageOK;
    try{localStorage.setItem(KEY,JSON.stringify(S));storageOK=true;}catch(e){storageOK=false;}
    var o=bkOwner();if(o)saveAccountState(o,S);
    if(!was&&storageOK&&!M.type)render();
  });
}
/* 저장이 꽉 찼을 때 비상용: IndexedDB로 이미 옮겨진 옛 사본 자리만 비워요 */
function bkFreeSpace(){
  try{var del=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&(k==='planner.backupRing'||k.indexOf('planner.snap.')===0))del.push(k);}
    del.forEach(function(k){localStorage.removeItem(k);});}catch(e){}
}
/* 로그아웃·계정 전환 때만 호출돼요 (예전엔 앱을 닫을 때마다 덮어써서 '로그아웃 전' 백업이 늘 지금 상태였어요) */
function saveLogoutBackup(uid,st){
  if(Sync&&Sync.deleting)return;
  if(!st||!hasPlannerData(st))return;
  if(uid&&/^loggedout:/.test(uid))uid=uid.slice(10);
  var raw;try{raw=JSON.stringify(st);}catch(e){return;}
  saveAccountState(uid,st);
  bkPut('logout',raw);if(uid)bkPut('logout.'+uid,raw);
  bkRingAdd(st,true);
}
function bkLastGood(previous){
  if(Sync&&Sync.deleting)return;
  if(!previous||Date.now()-BK.lastGoodAt<60000)return;
  try{var ps=JSON.parse(previous);if(!hasPlannerData(ps))return;}catch(e){return;}
  BK.lastGoodAt=Date.now();
  var o=bkOwner();
  bkPut('lastGood',previous);if(o)bkPut('lastGood.'+o,previous);
}
function prepareAccount(uid){
  var active=lsGet('planner.activeUser')||'';
  var legacy=lsGet('planner.syncedUser')||'';
  var previous=active||legacy;
  if(previous&&previous!==uid&&!/^loggedout:/.test(previous))saveLogoutBackup(previous,S);
  if(previous==='loggedout:'+uid&&hasPlannerData(S)){
    /* 같은 계정으로 다시 로그인: 로그아웃 상태에서 복원·수정한 내용을 그대로 이어가요 */
    saveAccountState(uid,S);
  }else if(previous!==uid){
    var cached=readAccountState(uid);
    if(cached)S=cached;
    else if(!previous&&!legacy&&hasPlannerData(S))saveAccountState(uid,S);
    else{
      S=defaults();
      /* 이 기기 사본이 없으면 로그아웃 전 백업에서 찾아와요 */
      bkFirst(['logout.'+uid]).then(function(rec){
        if(!rec||hasPlannerData(S)||Sync.uid!==uid)return;
        try{var st=normalize(JSON.parse(rec.raw));if(hasPlannerData(st)){S=st;save();render(true);}}catch(e){}
      });
    }
    try{lsSet(KEY,JSON.stringify(S));}catch(e){}
  }
  lsSet('planner.activeUser',uid);
  if(uid)vaultPut(uid,S);
  PREF_H=prefHash(S);
}
function backupCode(st){
  try{return btoa(unescape(encodeURIComponent(JSON.stringify(st||backupData()))));}catch(e){return '';}
}
function decodeBackupCode(code){
  var text=String(code||'').trim();
  if(!text)throw new Error('empty backup');
  /* 코드 칸에 JSON을 직접 붙여넣은 경우도 함께 지원해요. */
  try{return JSON.parse(text);}catch(e){}
  var b64=text.replace(/\s+/g,'').replace(/-/g,'+').replace(/_/g,'/');
  while(b64.length%4)b64+='=';
  return JSON.parse(decodeURIComponent(escape(atob(b64))));
}
function validBackupState(st){
  if(!st||typeof st!=='object'||Array.isArray(st))return false;
  return ['classes','events','todos','routines','exams','allday','selfchat','diaries','ddays','memos','settings'].some(function(k){return Object.prototype.hasOwnProperty.call(st,k);});
}
function restoreBackupState(raw,emptyMsg){
  try{
    var obj=typeof raw==='string'?decodeBackupCode(raw):raw;
    if(obj&&obj.state&&typeof obj.state==='object')obj=obj.state;
    if(!validBackupState(obj))throw new Error('bad backup');
    var next=normalize(obj),old=S;
    next.updatedAt=Math.max(Date.now(),(old.updatedAt||0)+1,(Sync.lastSeen||0)+1);
    return savePrevBackup(old).then(function(){
      try{
        /* 저장 실패 시 복원했다고 표시하거나 기존 화면을 지우지 않아요. */
        localStorage.setItem(KEY,JSON.stringify(next));
        S=next;storageOK=true;
        if(Sync.uid)saveAccountState(Sync.uid,S);
        bkRingAdd(S,true);
        if(Sync.db){Sync.forceRestore=true;scheduleSync();}
        closeModal();render(true);return true;
      }catch(e){bkMsg('저장 공간이 부족하거나 복원에 실패했어요. 기존 데이터는 유지했어요.');return false;}
    });
  }catch(e){bkMsg(emptyMsg||'이 백업을 읽지 못했어요');return Promise.resolve(false);}
}
function bkRestore(name,emptyMsg){
  bkMsg('불러오는 중…');
  return bkFirst(bkKeys(name)).then(function(rec){
    if(!rec){bkMsg(emptyMsg);return;}
    return restoreBackupState(rec.raw,emptyMsg);
  });
}
function recoverLocalBackup(){
  if(hasPlannerData(S))return Promise.resolve();
  var o=bkOwner();
  bkFirst(o?['lastGood.'+o,'logout.'+o]:['lastGood','logout']).then(function(rec){
    var cand=null;try{cand=rec?JSON.parse(rec.raw):null;}catch(e){}
    if(cand&&hasPlannerData(cand))return cand;
    return bkRingList().then(function(rows){var r=rows.find(function(x){return x.data&&hasPlannerData(x.data)&&(!o||!x.owner||x.owner===o);});return r?r.data:null;});
  }).then(function(cand){
    if(!cand||hasPlannerData(S))return;
    S=normalize(cand);S.updatedAt=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}render(true);
  });
}
/* ---------- 항목 단위 기기 동기화 ----------
   전체 JSON의 최신 시각만 비교하면 아이폰/아이패드에서 서로 다른 항목을 수정했을 때
   마지막 저장이 다른 기기의 변경을 덮을 수 있어요. 각 항목/맵 키의 변경 시각과 삭제표식을
   상태 안에 함께 저장해, 서로 다른 항목은 합치고 같은 항목만 더 최근 변경을 선택합니다. */
function syncMeta(st){
  st.settings=st.settings||{};
  var m=st.settings._syncMeta;
  if(!m||typeof m!=='object')m=st.settings._syncMeta={cols:{},maps:{}};
  m.cols=m.cols||{};m.maps=m.maps||{};return m;
}
function stableItem(x){try{var y=JSON.parse(JSON.stringify(x));delete y.updatedAt;return JSON.stringify(y);}catch(e){return '';}}
function stampItemChanges(prev,cur,at){
  var m=syncMeta(cur),pm=prev&&prev.settings&&prev.settings._syncMeta||{cols:{},maps:{}};
  COLS.forEach(function(c){
    var old={},now={};(prev&&prev[c]||[]).forEach(function(x){if(x&&x.id)old[x.id]=x;});(cur[c]||[]).forEach(function(x){if(x&&x.id)now[x.id]=x;});
    var cm=m.cols[c]||(m.cols[c]={}),pcm=(pm.cols&&pm.cols[c])||{};
    Object.keys(now).forEach(function(id){if(!old[id]||stableItem(old[id])!==stableItem(now[id]))cm[id]={u:at};else if(!cm[id]&&pcm[id])cm[id]=pcm[id];});
    Object.keys(old).forEach(function(id){if(!now[id])cm[id]={u:at,d:1};});
  });
  MAPS.forEach(function(k){
    var old=prev&&prev[k]||{},now=cur[k]||{},mm=m.maps[k]||(m.maps[k]={}),pmm=(pm.maps&&pm.maps[k])||{};
    var keys={};Object.keys(old).concat(Object.keys(now)).forEach(function(x){keys[x]=1;});
    Object.keys(keys).forEach(function(id){if(!(id in now)&&id in old)mm[id]={u:at,d:1};else if(!(id in old)||stableItem(old[id])!==stableItem(now[id]))mm[id]={u:at};else if(!mm[id]&&pmm[id])mm[id]=pmm[id];});
  });
}
function mergeStateV2(loc,rem){
  var out=JSON.parse(JSON.stringify(loc)),lm=syncMeta(out),rm=rem&&rem.settings&&rem.settings._syncMeta||{cols:{},maps:{}};
  COLS.forEach(function(c){
    var a={},b={};(loc[c]||[]).forEach(function(x){if(x&&x.id)a[x.id]=x;});(rem[c]||[]).forEach(function(x){if(x&&x.id)b[x.id]=x;});
    var ids={};Object.keys(a).concat(Object.keys(b)).concat(Object.keys((lm.cols&&lm.cols[c])||{})).concat(Object.keys((rm.cols&&rm.cols[c])||{})).forEach(function(id){ids[id]=1;});
    var rows=[],meta=lm.cols[c]||(lm.cols[c]={}),rmeta=(rm.cols&&rm.cols[c])||{};
    Object.keys(ids).forEach(function(id){var la=meta[id]||{},ra=rmeta[id]||{},lu=+la.u||0,ru=+ra.u||0,useR=ru>lu,win=useR?ra:la,val=useR?b[id]:a[id];if(ru===lu&&!val)val=a[id]||b[id];if(!win.d&&val)rows.push(JSON.parse(JSON.stringify(val)));meta[id]=JSON.parse(JSON.stringify(ru>lu?ra:la));});out[c]=rows;
  });
  MAPS.forEach(function(k){
    var a=loc[k]||{},b=rem[k]||{},dst={},meta=lm.maps[k]||(lm.maps[k]={}),rmeta=(rm.maps&&rm.maps[k])||{},ids={};Object.keys(a).concat(Object.keys(b)).concat(Object.keys(meta)).concat(Object.keys(rmeta)).forEach(function(id){ids[id]=1;});
    Object.keys(ids).forEach(function(id){var la=meta[id]||{},ra=rmeta[id]||{},useR=(+ra.u||0)>(+la.u||0),win=useR?ra:la,val=useR?b[id]:a[id];if((+ra.u||0)===(+la.u||0)&&val===undefined)val=a[id]!==undefined?a[id]:b[id];if(!win.d&&val!==undefined)dst[id]=JSON.parse(JSON.stringify(val));meta[id]=JSON.parse(JSON.stringify(useR?ra:la));});out[k]=dst;
  });
  mergeSettings(out.settings||(out.settings={}),rem.settings||{});return normalize(out);
}
function save(){
  if(!plannerStateValid(S)){setSyncUI('error');Sync.diag='데이터 형식 이상을 감지해서 저장을 중단했어요. 마지막 정상 백업은 유지돼요.';try{inAppToast('저장 이상을 감지했어요. 기존 데이터는 보호했어요');}catch(e){}return;}
  S.settings._schemaVersion=APP_SCHEMA_VERSION;
  var previous=null,prevState=null;try{previous=localStorage.getItem(KEY);prevState=previous?normalize(JSON.parse(previous)):null;}catch(e){}
  var saveAt=Date.now();stampItemChanges(prevState,S,saveAt);S.updatedAt=saveAt;SyncUI.localAt=saveAt;
  var ph=prefHash(S);if(PREF_H&&ph!==PREF_H)S.settings.prefsAt=Date.now();PREF_H=ph;
  var json=JSON.stringify(S);
  try{localStorage.setItem(KEY,json);storageOK=true;}
  catch(e){
    /* 꽉 찼으면 IndexedDB로 이미 옮겨진 오래된 localStorage 백업 자리만 비우고 다시 저장해요. */
    try{bkFreeSpace();localStorage.setItem(KEY,json);storageOK=true;}catch(e2){storageOK=false;}
  }
  /* 새 저장 전 상태를 '마지막 정상 상태'로 남겨요 (1분에 한 번) */
  if(previous&&previous!==json)bkLastGood(previous);
  var owner=Sync&&Sync.uid||lsGet('planner.activeUser');
  if(owner&&!/^loggedout:/.test(owner)){saveAccountState(owner,S);vaultPut(owner,S);}
  else vaultPut('',S);
  bkRingAdd(S,false);
  snapshotIfNeeded();
  setSyncUI(Sync.db?'saving':'local');
  scheduleSync();
  if(typeof FriendSync!=='undefined'){clearTimeout(window.__fpT);window.__fpT=setTimeout(function(){try{friendPush();}catch(e){}},3000);}
}

/* ---------- Supabase 설정 (깃허브 배포용) ---------- */
var SUPA_DEFAULT={supabaseUrl:'https://mhxcnmfgemdnfjwmtqlh.supabase.co',supabaseAnonKey:'sb_publishable_PxgP4E_dgBowjQcv0093kw_xePXJh-S'};
var SUPA_CFG=(window.PLANNER_CONFIG&&String(window.PLANNER_CONFIG.supabaseUrl||'').indexOf('https://')===0)?window.PLANNER_CONFIG:SUPA_DEFAULT;
var SUPABASE_URL=SUPA_CFG.supabaseUrl||'';       // config.js에서 읽어요
var SUPABASE_ANON_KEY=SUPA_CFG.supabaseAnonKey||'';
var SUPA_TABLE='planner';

/* ---------- 기기 간 동기화 (사용 가능할 때만) ---------- */
var Sync={db:null,path:null,on:false,busy:false,dirty:false,timer:null,kind:null,sb:null,email:'',uid:null,examGuardAt:0,deleting:false};
/* ---------- 추가 과금 없는 백업 구조 ----------
   외부 종량제 저장소는 사용하지 않습니다.
   1) 기기 IndexedDB 자동 백업 40개
   2) Supabase 계정 원본
   3) Supabase 날짜별 스냅샷 30일
   + 사용자가 JSON/백업 코드를 내보낼 수 있습니다. */
function mirrorPush(){return Promise.resolve(false);}
function mirrorRescueIfUseful(){return Promise.resolve(false);}
var SyncUI={state:'local',at:0,localAt:0,okAt:0};
/* 동기화 진단: Supabase가 준 code/message/details/hint/status를 숨기지 않고 설정 화면에 표시해요. */
function syncErrorText(e){
  if(!e)return '';
  var parts=[];
  function add(k,v){if(v!==undefined&&v!==null&&String(v).trim())parts.push(k+': '+String(v).trim());}
  add('message',e.message||(!e.code&&!e.details&&!e.hint?String(e):''));
  add('code',e.code);add('details',e.details);add('hint',e.hint);add('status',e.status||e.statusCode);
  return parts.join(' | ');
}
function setSyncError(prefix,e){
  var raw=syncErrorText(e)||'알 수 없는 오류';
  Sync.lastError=raw;
  Sync.diag=(prefix||'계정 동기화에 실패했어요.')+' [실제 오류] '+raw;
  setSyncUI('error');
  try{console.error('[planner sync]',e);}catch(_){}
}
function setSyncUI(st){var was=SyncUI.state,now=Date.now();SyncUI.state=st;SyncUI.at=now;if(st==='ok')SyncUI.okAt=now;if(st==='local')SyncUI.localAt=SyncUI.localAt||now;if(st==='error'&&was!=='error'&&now-(SyncUI.errDrawn||0)>30000&&(SyncUI.errDrawn=now)&&typeof U!=='undefined'&&U.tab==='settings'&&typeof M!=='undefined'&&!M.type)setTimeout(function(){try{render();}catch(e){}},0);var el=document.getElementById('sync-state');if(el){el.className='sync-state '+(st==='saving'?'saving':st==='ok'?'ok':st==='error'?'err':'');el.innerHTML=syncStateHTML(true);}}
function syncStateHTML(inner){var st=SyncUI.state;if(!Sync.uid)return (inner?'':'<div id="sync-state" class="sync-state">')+'<i class="sync-dot"></i>이 기기에 저장됨'+(inner?'':'</div>');var txt=st==='saving'?'계정에 저장 중…':st==='error'?'계정 동기화 실패':'계정 동기화 완료';return (inner?'':'<div id="sync-state" class="sync-state '+(st==='saving'?'saving':st==='ok'?'ok':st==='error'?'err':'')+'">')+'<i class="sync-dot"></i>'+txt+(inner?'':'</div>');}
function syncClock(ts){if(!ts)return '';var d=new Date(ts);return pad(d.getHours())+':'+pad(d.getMinutes());}
function syncTrustText(){
  var localAt=SyncUI.localAt||S.updatedAt||0,local=localAt?('마지막 저장 '+syncClock(localAt)):'기기 저장 준비됨';
  if(!Sync.uid)return local+' · 이 기기에 저장됨';
  if(SyncUI.state==='error')return local+' · 클라우드 동기화 확인 필요';
  if(SyncUI.state==='saving')return local+' · 클라우드 저장 중';
  var ok=SyncUI.okAt?(' · 클라우드 동기화 완료 '+syncClock(SyncUI.okAt)):' · 클라우드 동기화 완료';
  return local+ok;
}

/* ---------- 친구 공유 동기화 ---------- */
var FriendSync={invitesIn:[],invitesOut:[],inviteNames:{},inviteError:'',busyMap:{},busyError:'',lastBusy:'',code:'',friends:[],incoming:[],requests:[],shared:[],memories:[],shown:{},loaded:false,busy:false,msg:'',error:'',memoryError:''};
var CheerSync={busy:false,error:'',lastCheck:0};
var FRIEND_CODE_ALPH='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
var KOREA_REGIONS={"서울특별시":["종로구","중구","용산구","성동구","광진구","동대문구","중랑구","성북구","강북구","도봉구","노원구","은평구","서대문구","마포구","양천구","강서구","구로구","금천구","영등포구","동작구","관악구","서초구","강남구","송파구","강동구"],"부산광역시":["중구","서구","동구","영도구","부산진구","동래구","남구","북구","해운대구","사하구","금정구","강서구","연제구","수영구","사상구","기장군"],"대구광역시":["중구","동구","서구","남구","북구","수성구","달서구","달성군","군위군"],"인천광역시":["중구","동구","미추홀구","연수구","남동구","부평구","계양구","서구","강화군","옹진군"],"광주광역시":["동구","서구","남구","북구","광산구"],"대전광역시":["동구","중구","서구","유성구","대덕구"],"울산광역시":["중구","남구","동구","북구","울주군"],"세종특별자치시":["세종특별자치시"],"경기도":{"수원시":["장안구","권선구","팔달구","영통구"],"성남시":["수정구","중원구","분당구"],"의정부시":[],"안양시":["만안구","동안구"],"부천시":["원미구","소사구","오정구"],"광명시":[],"평택시":[],"동두천시":[],"안산시":["상록구","단원구"],"고양시":["덕양구","일산동구","일산서구"],"과천시":[],"구리시":[],"남양주시":[],"오산시":[],"시흥시":[],"군포시":[],"의왕시":[],"하남시":[],"용인시":["처인구","기흥구","수지구"],"파주시":[],"이천시":[],"안성시":[],"김포시":[],"화성시":["만세구","효행구","병점구","동탄구"],"광주시":[],"양주시":[],"포천시":[],"여주시":[],"연천군":[],"가평군":[],"양평군":[]},"강원특별자치도":["춘천시","원주시","강릉시","동해시","태백시","속초시","삼척시","홍천군","횡성군","영월군","평창군","정선군","철원군","화천군","양구군","인제군","고성군","양양군"],"충청북도":{"청주시":["상당구","서원구","흥덕구","청원구"],"충주시":[],"제천시":[],"보은군":[],"옥천군":[],"영동군":[],"증평군":[],"진천군":[],"괴산군":[],"음성군":[],"단양군":[]},"충청남도":{"천안시":["동남구","서북구"],"공주시":[],"보령시":[],"아산시":[],"서산시":[],"논산시":[],"계룡시":[],"당진시":[],"금산군":[],"부여군":[],"서천군":[],"청양군":[],"홍성군":[],"예산군":[],"태안군":[]},"전북특별자치도":{"전주시":["완산구","덕진구"],"군산시":[],"익산시":[],"정읍시":[],"남원시":[],"김제시":[],"완주군":[],"진안군":[],"무주군":[],"장수군":[],"임실군":[],"순창군":[],"고창군":[],"부안군":[]},"전라남도":["목포시","여수시","순천시","나주시","광양시","담양군","곡성군","구례군","고흥군","보성군","화순군","장흥군","강진군","해남군","영암군","무안군","함평군","영광군","장성군","완도군","진도군","신안군"],"경상북도":{"포항시":["남구","북구"],"경주시":[],"김천시":[],"안동시":[],"구미시":[],"영주시":[],"영천시":[],"상주시":[],"문경시":[],"경산시":[],"의성군":[],"청송군":[],"영양군":[],"영덕군":[],"청도군":[],"고령군":[],"성주군":[],"칠곡군":[],"예천군":[],"봉화군":[],"울진군":[],"울릉군":[]},"경상남도":{"창원시":["의창구","성산구","마산합포구","마산회원구","진해구"],"진주시":[],"통영시":[],"사천시":[],"김해시":[],"밀양시":[],"거제시":[],"양산시":[],"의령군":[],"함안군":[],"창녕군":[],"고성군":[],"남해군":[],"하동군":[],"산청군":[],"함양군":[],"거창군":[],"합천군":[]},"제주특별자치도":["제주시","서귀포시"]};
var REGION_SHORT={'서울특별시':'서울','부산광역시':'부산','대구광역시':'대구','인천광역시':'인천','광주광역시':'광주','대전광역시':'대전','울산광역시':'울산','세종특별자치시':'세종','경기도':'경기','강원특별자치도':'강원','충청북도':'충북','충청남도':'충남','전북특별자치도':'전북','전라남도':'전남','경상북도':'경북','경상남도':'경남','제주특별자치도':'제주'};
/* 서울은 구 대신 자주 가는 역으로도 고를 수 있어요. 목록에 없는 역은 검색으로 넣어요. */
var SEOUL_STATIONS=['가락시장','가산디지털단지','강남','강동','강변','건대입구','경복궁','고속터미널','공덕','광화문','교대','구로디지털단지','군자','금호','길동','김포공항','낙성대','노량진','노원','녹사평','논현','대림','대치','도곡','동대문','동대문역사문화공원','동묘앞','뚝섬','마곡나루','망원','매봉','명동','목동','몽촌토성','문래','문정','발산','방이','사당','삼각지','삼성','상수','서울대입구','서울숲','서울역','석촌','선릉','성수','성신여대입구','송파','수서','수유','숙대입구','시청','신논현','신당','신도림','신림','신사','신촌','안국','압구정','압구정로데오','약수','양재','여의나루','여의도','역삼','연신내','영등포구청','옥수','올림픽공원','왕십리','용산','을지로3가','을지로입구','이촌','이태원','잠실','잠실새내','종각','종로3가','천호','청담','청량리','충무로','학동','한강진','한양대','합정','혜화','홍대입구','회기','흑석'];
function regionShort(k){return REGION_SHORT[k]||k;}
function regionCities(region){var x=KOREA_REGIONS[region];return Array.isArray(x)?x:Object.keys(x||{});}
function regionDistricts(region,city){var x=KOREA_REGIONS[region];return !Array.isArray(x)&&x&&Array.isArray(x[city])?x[city]:[];}
function euro(w){w=String(w||'');var c=w.charCodeAt(w.length-1);if(c<0xAC00||c>0xD7A3)return w+'(으)로';var j=(c-0xAC00)%28;return w+(j===0||j===8?'로':'으로');}
function mdTxt(d){return (d.getMonth()+1)+'월\u00a0'+d.getDate()+'일';}
function normalizePlaceText(v){return String(v||'').replace(/\s+/g,' ').trim();}

/* 플래너 전용 약속 장소 보조 추천
   - 특정 서비스의 이동시간/공평성 점수 로직을 사용하지 않아요.
   - 각 참여자의 출발 위치를 좌표로 바꾼 뒤, 그 위치들의 지리적 중심점과 가까운
     교통 거점 후보를 보여주는 단순한 '중간 위치 힌트'예요.
   - 실제 이동시간/환승/교통상황은 계산하지 않고 지도에서 최종 확인해요. */
var PLANNER_MEET_POINTS=[
  {name:'홍대입구역',lat:37.5572,lng:126.9245,area:'서울 서북'},
  {name:'서울역',lat:37.5547,lng:126.9707,area:'서울 도심'},
  {name:'여의도역',lat:37.5216,lng:126.9242,area:'서울 서남'},
  {name:'신도림역',lat:37.5088,lng:126.8913,area:'서울 서남'},
  {name:'왕십리역',lat:37.5612,lng:127.0371,area:'서울 동북'},
  {name:'건대입구역',lat:37.5404,lng:127.0692,area:'서울 동북'},
  {name:'노원역',lat:37.6551,lng:127.0611,area:'서울 동북'},
  {name:'잠실역',lat:37.5133,lng:127.1002,area:'서울 동남'},
  {name:'강남역',lat:37.4979,lng:127.0276,area:'서울 동남'},
  {name:'고속터미널역',lat:37.5048,lng:127.0048,area:'서울 동남'},
  {name:'사당역',lat:37.4766,lng:126.9816,area:'서울 남부'},
  {name:'수원역',lat:37.2661,lng:126.9999,area:'경기 남부'},
  {name:'판교역',lat:37.3948,lng:127.1112,area:'경기 남부'},
  {name:'범계역',lat:37.3898,lng:126.9508,area:'경기 남부'},
  {name:'부천시청역',lat:37.5046,lng:126.7635,area:'경기 서부'},
  {name:'인천터미널역',lat:37.4418,lng:126.7011,area:'인천'},
  {name:'천안아산역',lat:36.7946,lng:127.1045,area:'충청'},
  {name:'오송역',lat:36.6200,lng:127.3273,area:'충청'},
  {name:'대전역',lat:36.3321,lng:127.4344,area:'충청'},
  {name:'전주역',lat:35.8498,lng:127.1618,area:'호남'},
  {name:'광주송정역',lat:35.1377,lng:126.7915,area:'호남'},
  {name:'동대구역',lat:35.8798,lng:128.6283,area:'영남'},
  {name:'울산역',lat:35.5514,lng:129.1386,area:'영남'},
  {name:'부산역',lat:35.1151,lng:129.0414,area:'영남'},
  {name:'강릉역',lat:37.7640,lng:128.8995,area:'강원'},
  {name:'제주공항',lat:33.5104,lng:126.4914,area:'제주'}
];
var PLANNER_REGION_POINTS=[
  {name:'서울',lat:37.5665,lng:126.9780},{name:'부산',lat:35.1796,lng:129.0756},
  {name:'대구',lat:35.8714,lng:128.6014},{name:'인천',lat:37.4563,lng:126.7052},
  {name:'광주',lat:35.1595,lng:126.8526},{name:'대전',lat:36.3504,lng:127.3845},
  {name:'울산',lat:35.5384,lng:129.3114},{name:'세종',lat:36.4800,lng:127.2890},
  {name:'경기',lat:37.4138,lng:127.5183},{name:'강원',lat:37.8228,lng:128.1555},
  {name:'충북',lat:36.6357,lng:127.4917},{name:'충남',lat:36.6588,lng:126.6728},
  {name:'전북',lat:35.7175,lng:127.1530},{name:'전남',lat:34.8679,lng:126.9910},
  {name:'경북',lat:36.4919,lng:128.8889},{name:'경남',lat:35.4606,lng:128.2132},
  {name:'제주',lat:33.4996,lng:126.5312}
];
var PLANNER_NEAR_STATIONS=[
  /* 서울 남부 · 관악 */
  {name:'낙성대역',lat:37.4769,lng:126.9637,area:'서울 남부'},
  {name:'서울대입구역',lat:37.4813,lng:126.9527,area:'서울 남부'},
  {name:'봉천역',lat:37.4824,lng:126.9416,area:'서울 남부'},
  {name:'신림역',lat:37.4842,lng:126.9297,area:'서울 남부'},
  {name:'사당역',lat:37.4766,lng:126.9816,area:'서울 남부'},
  {name:'남태령역',lat:37.4642,lng:126.9891,area:'서울 남부'},
  {name:'이수역',lat:37.4850,lng:126.9822,area:'서울 남부'},
  /* 수원 · 경기 남부 */
  {name:'성균관대역',lat:37.3003,lng:126.9708,area:'경기 남부'},
  {name:'화서역',lat:37.2839,lng:126.9896,area:'경기 남부'},
  {name:'수원역',lat:37.2661,lng:126.9999,area:'경기 남부'},
  {name:'매교역',lat:37.2655,lng:127.0158,area:'경기 남부'},
  {name:'수원시청역',lat:37.2618,lng:127.0307,area:'경기 남부'},
  {name:'매탄권선역',lat:37.2525,lng:127.0408,area:'경기 남부'},
  {name:'망포역',lat:37.2458,lng:127.0574,area:'경기 남부'},
  {name:'영통역',lat:37.2516,lng:127.0714,area:'경기 남부'},
  {name:'청명역',lat:37.2595,lng:127.0789,area:'경기 남부'},
  {name:'광교중앙역',lat:37.2886,lng:127.0517,area:'경기 남부'},
  {name:'세류역',lat:37.2450,lng:127.0134,area:'경기 남부'}
];
function plannerOriginPoints(){
  var out=[],seen={};
  PLANNER_MEET_POINTS.concat(PLANNER_NEAR_STATIONS).forEach(function(x){if(!seen[x.name]){seen[x.name]=1;out.push(x);}});
  return out;
}
function originText(v){return normalizePlaceText(v).replace(/(특별시|광역시|특별자치시|특별자치도)$/,'');}
function plannerMeetPoint(name){
  var raw=normalizePlaceText(name),stem=raw.replace(/역$/,'');
  return plannerOriginPoints().find(function(x){return x.name===raw||x.name.replace(/역$/,'')===stem;})||null;
}
function originPoint(name){
  var raw=normalizePlaceText(name),pt=plannerMeetPoint(raw);if(pt)return pt;
  var q=originText(raw).replace(/도$/,'');
  return PLANNER_REGION_POINTS.find(function(x){return x.name===q||x.name.replace(/도$/,'')===q;})||null;
}
function originDatalist(){return '<datalist id="origin-suggestions">'+PLANNER_REGION_POINTS.map(function(x){return '<option value="'+esc(x.name)+'">';}).join('')+plannerOriginPoints().map(function(x){return '<option value="'+esc(x.name)+'">';}).join('')+'</datalist>';}
function plannerGeoDistance(a,b){var R=6371,rad=function(v){return v*Math.PI/180;},dLat=rad(b.lat-a.lat),dLng=rad(b.lng-a.lng),h=Math.sin(dLat/2)**2+Math.sin(dLng/2)**2*Math.cos(rad(a.lat))*Math.cos(rad(b.lat));return R*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));}
function nearestPlannerMeetPoints(lat,lng,limit){
  var here={lat:+lat,lng:+lng};
  return plannerOriginPoints().map(function(st){return {station:st,distance:plannerGeoDistance(here,st)};}).sort(function(a,b){return a.distance-b.distance;}).slice(0,Math.max(1,limit||5));
}
function geoDistanceText(km){return km<1?Math.round(km*1000)+'m':km.toFixed(1)+'km';}
function locationPermissionOn(){return S.settings.locationEnabled===true;}
function locationPermissionSave(enabled){
  S.settings.locationEnabled=!!enabled;save();
  if(!Sync.sb||!Sync.uid)return Promise.resolve({local:true});
  return Sync.sb.from('planner_location_permissions').upsert({user_id:Sync.uid,enabled:!!enabled,updated_at:new Date().toISOString()},{onConflict:'user_id'}).then(function(r){
    if(r&&r.error)throw r.error;return r;
  }).catch(function(e){
    var m=(e&&(e.message||e.details))||String(e||'');
    if(/planner_location_permissions|relation|schema cache|does not exist/i.test(m))inAppToast('위치 권한 SQL을 먼저 실행해주세요');
    return {error:e};
  });
}
function locationPermissionLoad(){
  if(!Sync.sb||!Sync.uid)return Promise.resolve();
  return Sync.sb.from('planner_location_permissions').select('enabled').eq('user_id',Sync.uid).maybeSingle().then(function(r){
    if(r.error)throw r.error;
    if(r.data){S.settings.locationEnabled=!!r.data.enabled;try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
    else return locationPermissionSave(!!S.settings.locationEnabled);
  }).catch(function(){return null;});
}
function requestLocationPermission(enable,done){
  if(!enable){locationPermissionSave(false).then(function(){if(done)done(false);});return;}
  if(!navigator.geolocation){inAppToast('이 기기에서는 현재 위치를 사용할 수 없어요');if(done)done(false);return;}
  navigator.geolocation.getCurrentPosition(function(){
    locationPermissionSave(true).then(function(){inAppToast('현재 위치 사용을 켰어요');if(done)done(true);});
  },function(err){
    S.settings.locationEnabled=false;save();
    inAppToast(err&&err.code===1?'브라우저에서 위치 권한을 허용해주세요':'현재 위치를 확인하지 못했어요');if(done)done(false);
  },{enableHighAccuracy:true,timeout:12000,maximumAge:0});
}
function requestHomeStationCandidates(){
  var msg=$('#home-geo-msg'),box=$('#home-geo-cands');
  if(!locationPermissionOn()){if(msg)msg.textContent='먼저 아래의 현재 위치 사용을 켜주세요.';return;}
  if(!navigator.geolocation){if(msg)msg.textContent='이 기기에서는 현재 위치를 사용할 수 없어요.';return;}
  if(msg)msg.textContent='정확한 현재 위치 확인 중…';if(box)box.innerHTML='';
  navigator.geolocation.getCurrentPosition(function(pos){
    var xs=nearestPlannerMeetPoints(pos.coords.latitude,pos.coords.longitude,5),acc=Math.round(Number(pos.coords.accuracy||0));
    if(!xs.length){if(msg)msg.textContent='가까운 역 후보를 찾지 못했어요. 직접 입력해주세요.';return;}
    if(acc>800){if(msg)msg.textContent='현재 위치가 너무 넓게 잡혔어요(약 ±'+acc+'m). 엉뚱한 역을 추천하지 않도록 자동 후보를 숨겼어요. 실제 출발역을 직접 입력해주세요.';if(box)box.innerHTML='';return;}
    if(msg)msg.textContent='위치 정확도 약 ±'+acc+'m · 자동 저장하지 않아요. 실제 출발역을 골라주세요.';
    if(box)box.innerHTML=xs.map(function(z){return '<button type="button" class="geo-cand" data-act="home-station-pick" data-st="'+esc(z.station.name)+'">'+esc(z.station.name)+' <small>'+geoDistanceText(z.distance)+'</small></button>';}).join('');
  },function(err){
    if(msg)msg.textContent=err&&err.code===1?'위치 권한이 꺼져 있어요. 직접 역을 입력해도 돼요.':'현재 위치가 정확하지 않아요. 직접 출발역을 입력해주세요.';
  },{enableHighAccuracy:true,timeout:12000,maximumAge:0});
}
function nearestPlannerMeetPoint(lat,lng){
  return nearestPlannerMeetPoints(lat,lng,1)[0]||null;
}
function requestNearestStation(done,msgEl){
  if(!locationPermissionOn()&&!U.guest){if(msgEl)msgEl.textContent='설정 → 내 프로필에서 현재 위치 사용을 먼저 켜주세요.';return;}
  if(!navigator.geolocation){if(msgEl)msgEl.textContent='이 기기에서는 현재 위치를 사용할 수 없어요.';return;}
  if(msgEl)msgEl.textContent='정확한 현재 위치 확인 중…';
  navigator.geolocation.getCurrentPosition(function(pos){
    var z=nearestPlannerMeetPoint(pos.coords.latitude,pos.coords.longitude),acc=Math.round(Number(pos.coords.accuracy||0));
    if(!z){if(msgEl)msgEl.textContent='가까운 교통 거점을 찾지 못했어요.';return;}
    if(acc>800){if(msgEl)msgEl.textContent='현재 위치가 너무 넓게 잡혔어요(약 ±'+acc+'m). 잘못된 역을 자동 입력하지 않았어요. 출발지를 직접 골라주세요.';return;}
    if(msgEl)msgEl.textContent='가까운 역 후보 · '+z.station.name+' · 직선 '+geoDistanceText(z.distance)+' · 위치 정확도 ±'+acc+'m';
    done(z.station.name,z);
  },function(err){
    if(msgEl)msgEl.textContent=err&&err.code===1?'위치 권한이 꺼져 있어요. 브라우저 설정에서 위치를 허용해주세요.':'현재 위치를 불러오지 못했어요.';
  },{enableHighAccuracy:true,timeout:12000,maximumAge:0});
}
function linkMetaSlots(slots,origin){
  var a=(slots||[]).filter(function(x){return !/^@(?:origin|cap):/.test(x);});
  if(origin)a.push('@origin:'+origin);return a;
}
function linkAnswerMeta(a){
  var o='';(a&&a.slots||[]).forEach(function(x){if(x.indexOf('@origin:')===0)o=x.slice(8);});
  return {origin:o};
}
function linkRealSlots(a){return (a&&a.slots||[]).filter(function(x){return x.indexOf('@')!==0;});}
function linkPlacePeople(p,answers){
  var out=[{id:'owner',name:p.ownerName||'나',origin:p.ownerStation||''}];
  (answers||[]).forEach(function(a){var m=linkAnswerMeta(a);out.push({id:a.id,name:a.name||'친구',origin:m.origin});});
  return out;
}
function plannerMeetingCandidates(people){
  var valid=(people||[]).map(function(p){return {id:p.id,name:p.name,origin:p.origin,point:originPoint(p.origin)};}).filter(function(p){return p.point;});
  if(valid.length<2)return [];
  var center={lat:valid.reduce(function(a,p){return a+p.point.lat;},0)/valid.length,lng:valid.reduce(function(a,p){return a+p.point.lng;},0)/valid.length};
  return PLANNER_MEET_POINTS.map(function(pt){
    var centerKm=plannerGeoDistance(center,pt);
    var originKm=valid.map(function(p){return {name:p.name,km:plannerGeoDistance(p.point,pt)};});
    return {point:pt,centerKm:centerKm,originKm:originKm,count:valid.length};
  }).sort(function(a,b){return a.centerKm-b.centerKm;}).slice(0,3);
}
function plannerMeetPointOptions(selected){
  var areas=[];PLANNER_MEET_POINTS.forEach(function(x){if(areas.indexOf(x.area)<0)areas.push(x.area);});
  var sel=normalizePlaceText(selected);
  return '<option value="">출발 지역/거점 선택</option>'+areas.map(function(area){return '<optgroup label="'+esc(area)+'">'+PLANNER_MEET_POINTS.filter(function(x){return x.area===area;}).map(function(x){return '<option value="'+esc(x.name)+'"'+(x.name===sel||x.name.replace(/역$/,'')===sel.replace(/역$/,'')?' selected':'')+'>'+esc(x.name)+'</option>';}).join('')+'</optgroup>';}).join('');
}
function linkPlaceRecoHTML(p,answers){
  if(!p.placeRecommend)return '';
  var people=linkPlacePeople(p,answers),filled=people.filter(function(x){return !!originPoint(x.origin);}).length,total=Math.max(+p.expectedPeople||0,people.length),rec=plannerMeetingCandidates(people);
  var progress=total?Math.min(100,Math.round(filled/total*100)):0;
  return '<div class="place-reco"><div class="place-reco-head"><b>출발지 중심 장소 후보</b><small>'+filled+'/'+total+'명 출발지 입력</small></div>'+
    '<div class="input-progress"><i style="width:'+progress+'%"></i></div>'+
    (rec.length?rec.map(function(r,i){return '<div class="place-reco-card"><div><b>후보 '+(i+1)+' · '+esc(r.point.name)+'</b><small>'+r.count+'명의 출발 위치 중심에서 약 '+(r.centerKm<1?Math.round(r.centerKm*1000)+'m':r.centerKm.toFixed(1)+'km')+'</small><small>'+esc(r.point.area)+' · 실제 이동시간은 지도에서 확인</small></div><div class="place-reco-actions"><button class="tbtn" data-act="lk-place-pick" data-st="'+esc(r.point.name)+'">장소로 선택</button><a class="tbtn" target="_blank" rel="noopener" href="https://map.kakao.com/link/search/'+encodeURIComponent(r.point.name)+'">지도 보기</a></div></div>';}).join(''):'<div class="reco-wait">출발 지역을 2명 이상 입력하면 중간 위치 후보가 보여요.</div>')+
    '<p class="hint">플래너가 이동시간을 임의로 계산하지 않고, 입력한 출발 위치들의 지리적 중심과 가까운 교통 거점만 보조로 제안해요.</p></div>';
}

function originRuleLabel(r){return (r.from||'')+'–'+(r.to||'')+' · '+(r.origin||'');}
function timeInOriginRule(t,r){
  if(!t||!r)return false;
  var m=toMin(t),a=toMin(r.from||'00:00'),b=toMin(r.to||'23:59');
  if(!isFinite(m)||!isFinite(a)||!isFinite(b))return false;
  if(a<=b)return m>=a&&m<b;
  return m>=a||m<b;
}
function dateDow(k){return dow(parseKey(k));}
function selectedMeetDate(){return M&&M.sel&&M.sel.date?M.sel.date:'';}
function selectedMeetStartTime(){return M&&M.sel&&M.sel.s!=null?fmt(M.sel.s):'';}
function originForMoment(defaultOrigin,rules,overrides,date,time){
  var ov=(Array.isArray(overrides)?overrides:[]).find(function(r){
    return r&&r.date===date&&timeInOriginRule(time,r)&&String(r.origin||'').trim();
  });
  if(ov)return String(ov.origin||'').trim();
  var wd=date?dateDow(date):null;
  var hit=(Array.isArray(rules)?rules:[]).find(function(r){
    var ds=Array.isArray(r.days)?r.days:[0,1,2,3,4,5,6];
    return (wd==null||ds.indexOf(wd)>=0)&&timeInOriginRule(time,r)&&String(r.origin||'').trim();
  });
  return hit?String(hit.origin||'').trim():String(defaultOrigin||'').trim();
}
function myOriginForMeeting(){return originForMoment(S.settings.homeStation,S.settings.originRules,S.settings.originWeekOverrides,selectedMeetDate(),selectedMeetStartTime());}
function friendOriginForMeeting(f){return originForMoment(f&&f.homeStation,f&&f.originRules,f&&f.originWeekOverrides,selectedMeetDate(),selectedMeetStartTime());}
function originDayChips(r){
  var ds=Array.isArray(r.days)?r.days:[0,1,2,3,4,5,6];
  return '<div class="origin-days">'+DAYS.map(function(n,i){return '<button type="button" class="'+(ds.indexOf(i)>=0?'on':'')+'" data-act="origin-day" data-id="'+esc(r.id)+'" data-origin-day="'+esc(r.id)+'" data-v="'+i+'">'+n+'</button>';}).join('')+'</div>';
}
function originRulesHTML(){
  var rows=S.settings.originRules||[];
  return '<div class="origin-rules">'+
    (rows.length?rows.map(function(r){
      return '<div class="origin-rule weekly" data-origin-rule="'+esc(r.id)+'">'+
        originDayChips(r)+
        '<div class="origin-rule-fields"><input class="fld origin-time" type="time" data-origin-from="'+esc(r.id)+'" value="'+esc(r.from)+'"><span>–</span><input class="fld origin-time" type="time" data-origin-to="'+esc(r.id)+'" value="'+esc(r.to)+'"><input class="fld origin-place" list="origin-suggestions" data-origin-place="'+esc(r.id)+'" placeholder="학교, 회사, 역" value="'+esc(r.origin)+'"><button class="pp-x" data-act="origin-rule-del" data-id="'+esc(r.id)+'">✕</button></div>'+
      '</div>';
    }).join(''):'<div class="origin-empty">주간 규칙이 없어요. 기본 출발 지역을 사용해요.</div>')+
    '<button class="origin-add" data-act="origin-rule-add">+ 주간 출발지 추가</button>'+
  '</div>';
}
function currentWeekDates(){
  var d=parseKey(todayKey()),w=dow(d),mon=addDays(d,-w);
  return [0,1,2,3,4,5,6].map(function(i){return dkey(addDays(mon,i));});
}
function originWeekOverridesHTML(){
  var rows=S.settings.originWeekOverrides||[],week=currentWeekDates();
  var filtered=rows.filter(function(r){return week.indexOf(r.date)>=0;});
  return '<div class="origin-week-overrides">'+
    (filtered.length?filtered.map(function(r){
      return '<div class="origin-override" data-origin-override="'+esc(r.id)+'">'+
        '<select class="sel" data-origin-override-date="'+esc(r.id)+'">'+week.map(function(k){return '<option value="'+k+'"'+(k===r.date?' selected':'')+'>'+DAYS[dateDow(k)]+' '+Number(k.slice(5,7))+'/'+Number(k.slice(8,10))+'</option>';}).join('')+'</select>'+
        '<div class="origin-rule-fields"><input class="fld origin-time" type="time" data-origin-override-from="'+esc(r.id)+'" value="'+esc(r.from)+'"><span>–</span><input class="fld origin-time" type="time" data-origin-override-to="'+esc(r.id)+'" value="'+esc(r.to)+'"><input class="fld origin-place" list="origin-suggestions" data-origin-override-place="'+esc(r.id)+'" placeholder="이번 주만 다른 출발지" value="'+esc(r.origin)+'"><button class="pp-x" data-act="origin-override-del" data-id="'+esc(r.id)+'">✕</button></div>'+
      '</div>';
    }).join(''):'<div class="origin-empty">이번 주 예외가 없어요.</div>')+
    '<button class="origin-add" data-act="origin-override-add">+ 이번 주만 수정</button>'+
  '</div>';
}

function originGridDay(){var d=Number(U.originGridDay);return isFinite(d)&&d>=0&&d<=6?d:dow(new Date());}
function originHourTime(h){return pad(Number(h)||0)+':00';}
function originHourEnd(h){h=Number(h)||0;return pad((h+1)%24)+':00';}
function originRuleHitsHour(r,day,h){
  if(!r)return false;var ds=Array.isArray(r.days)?r.days:[0,1,2,3,4,5,6];
  return ds.indexOf(day)>=0&&timeInOriginRule(pad(h)+':30',r);
}
function originOverrideHitsHour(r,date,h){return !!(r&&r.date===date&&timeInOriginRule(pad(h)+':30',r));}
function originRecurringAt(day,h){var wk=currentWeekDates(),date=wk[day]||wk[0];return originForMoment(S.settings.homeStation,S.settings.originRules,[],date,pad(h)+':30');}
function originWeekAt(day,h){var wk=currentWeekDates(),date=wk[day]||wk[0];return originForMoment(S.settings.homeStation,S.settings.originRules,S.settings.originWeekOverrides,date,pad(h)+':30');}
function originWeekHasOverride(day,h){var date=currentWeekDates()[day];return (S.settings.originWeekOverrides||[]).some(function(r){return originOverrideHitsHour(r,date,h);});}
function originRecurringHasCustom(day,h){return (S.settings.originRules||[]).some(function(r){return originRuleHitsHour(r,day,h);});}
function originGridHTML(){
  var day=originGridDay(),home=(S.settings.homeStation||'').trim(),week=currentWeekDates(),date=week[day];
  var days='<div class="origin-grid-days">'+DAYS.map(function(n,i){return '<button type="button" class="'+(i===day?'on':'')+'" data-act="origin-grid-day" data-day="'+i+'">'+n+'</button>';}).join('')+'</div>';
  var cells='<div class="origin-hour-grid">'+Array.from({length:24},function(_,h){
    var weekOv=originWeekHasOverride(day,h),always=originRecurringHasCustom(day,h),place=originWeekAt(day,h)||home||'출발지 미설정';
    var cls=weekOv?' week':always?' always':'';var sub=weekOv?'이번 주만':always?'항상':'기본';
    return '<button type="button" class="origin-hour-cell'+cls+'" data-act="origin-grid-cell" data-day="'+day+'" data-hour="'+h+'"><b>'+pad(h)+':00</b><span>'+esc(place)+'<em>'+sub+'</em></span></button>';
  }).join('')+'</div>';
  return '<div class="origin-grid-panel"><p class="origin-grid-help"><b>'+DAYS[day]+'요일 · '+Number(date.slice(5,7))+'/'+Number(date.slice(8,10))+'</b><br>아무 설정이 없는 시간은 기본 출발지 <b>'+(home?esc(home):'미설정')+'</b>를 사용해요. 한 칸을 눌러 바꿔보세요.</p>'+days+cells+'<div class="origin-grid-legend"><span>기본 출발지</span><span class="lg-always">항상</span><span class="lg-week">이번 주만</span></div></div>';
}
function originRulesToHourly(){
  var old=(S.settings.originRules||[]).slice(),out=[],home=(S.settings.homeStation||'').trim();
  for(var d=0;d<7;d++)for(var h=0;h<24;h++){
    var hit=old.find(function(r){return originRuleHitsHour(r,d,h);});var val=hit&&String(hit.origin||'').trim();
    if(val&&val!==home)out.push({id:uid(),from:pad(h)+':00',to:pad((h+1)%24)+':00',origin:val,days:[d]});
  }
  S.settings.originRules=out;
  var ovs=(S.settings.originWeekOverrides||[]).slice(),byDate={};ovs.forEach(function(r){if(r&&r.date)byDate[r.date]=1;});var oo=[];
  Object.keys(byDate).forEach(function(date){for(var h=0;h<24;h++){var hit=ovs.find(function(r){return originOverrideHitsHour(r,date,h);});var val=hit&&String(hit.origin||'').trim();if(val)oo.push({id:uid(),date:date,from:pad(h)+':00',to:pad((h+1)%24)+':00',origin:val});}});
  S.settings.originWeekOverrides=oo;
}
function openOriginHourEditor(day,hour){
  day=Number(day);hour=Number(hour);if(!(day>=0&&day<7&&hour>=0&&hour<24))return;
  var week=currentWeekDates(),date=week[day],home=(S.settings.homeStation||'').trim(),rec=originRecurringAt(day,hour),eff=originWeekAt(day,hour);
  M={type:'origin-hour',day:day,hour:hour,date:date};
  openModal('<h3>'+DAYS[day]+'요일 '+pad(hour)+':00–'+pad((hour+1)%24)+':00 출발지</h3><div class="origin-hour-summary"><b>기본 출발지 · '+esc(home||'미설정')+'</b><small>항상 설정 · '+esc(rec||home||'없음')+' · 이번 주 적용 · '+esc(eff||home||'없음')+'</small></div>'+originDatalist()+'<span class="lbl">이 시간에 어디서 출발해?</span><input class="fld" id="f-origin-hour" list="origin-suggestions" autocomplete="off" placeholder="예: 성균관대역, 낙성대역, 학교" value="'+esc(eff||home)+'"><p class="hint">저장 범위를 고르면 돼요. <b>이번 주만</b>은 '+Number(date.slice(5,7))+'/'+Number(date.slice(8,10))+'에만, <b>항상</b>은 매주 '+DAYS[day]+'요일 이 시간에 적용돼요.</p><div class="origin-scope-grid"><button class="week" data-act="origin-hour-save" data-scope="week">이번 주만</button><button class="always" data-act="origin-hour-save" data-scope="always">항상</button></div><div class="acts"><button class="b-ghost" data-act="origin-hour-default">기본 출발지로 되돌리기</button><button class="b-ghost" data-act="close">취소</button></div>');
  setTimeout(function(){var x=$('#f-origin-hour');if(x)x.focus();},50);
}
function saveOriginHour(scope,useDefault){
  if(M.type!=='origin-hour')return;var day=Number(M.day),h=Number(M.hour),date=M.date||currentWeekDates()[day],home=(S.settings.homeStation||'').trim();
  var inp=$('#f-origin-hour'),val=useDefault?home:(inp?inp.value.trim():'');if(!val&&!home){if(inp)inp.classList.add('bad');inAppToast('먼저 기본 출발지를 입력해줘');return;}
  originRulesToHourly();
  if(scope==='always'){
    S.settings.originRules=(S.settings.originRules||[]).filter(function(r){return !originRuleHitsHour(r,day,h);});
    if(val&&val!==home)S.settings.originRules.push({id:uid(),from:pad(h)+':00',to:pad((h+1)%24)+':00',origin:val,days:[day]});
    S.settings.originWeekOverrides=(S.settings.originWeekOverrides||[]).filter(function(r){return !originOverrideHitsHour(r,date,h);});
  }else{
    S.settings.originWeekOverrides=(S.settings.originWeekOverrides||[]).filter(function(r){return !originOverrideHitsHour(r,date,h);});
    var recurring=originForMoment(home,S.settings.originRules,[],date,pad(h)+':30');
    if(val!==recurring)S.settings.originWeekOverrides.push({id:uid(),date:date,from:pad(h)+':00',to:pad((h+1)%24)+':00',origin:val||home});
  }
  save();if(typeof friendPush==='function')friendPush().catch(function(){});closeModal();U.originGridOpen=true;render();inAppToast((scope==='always'?'항상':'이번 주만')+' 출발지를 저장했어요');
}
function saveOriginRulesFromUI(){
  var rows=[];
  document.querySelectorAll('[data-origin-rule]').forEach(function(row){
    var id=row.dataset.originRule,fr=row.querySelector('[data-origin-from]'),to=row.querySelector('[data-origin-to]'),pl=row.querySelector('[data-origin-place]');
    var origin=(pl&&pl.value||'').trim(),days=[].slice.call(row.querySelectorAll('[data-origin-day].on')).map(function(b){return Number(b.dataset.v);});
    if(origin)rows.push({id:id||uid(),from:(fr&&fr.value)||'08:00',to:(to&&to.value)||'12:00',origin:origin,days:days.length?days:[0,1,2,3,4,5,6]});
  });
  S.settings.originRules=rows;
  var ovs=[];
  document.querySelectorAll('[data-origin-override]').forEach(function(row){
    var id=row.dataset.originOverride,dt=row.querySelector('[data-origin-override-date]'),fr=row.querySelector('[data-origin-override-from]'),to=row.querySelector('[data-origin-override-to]'),pl=row.querySelector('[data-origin-override-place]');
    var origin=(pl&&pl.value||'').trim();
    if(origin&&dt&&dt.value)ovs.push({id:id||uid(),date:dt.value,from:(fr&&fr.value)||'08:00',to:(to&&to.value)||'12:00',origin:origin});
  });
  S.settings.originWeekOverrides=ovs;save();
}
function meetPlacePeople(){
  var st=selectedMeetStartTime();
  var me={id:Sync.uid||'me',name:myDisplayName()||'나',origin:myOriginForMeeting(),defaultOrigin:S.settings.homeStation||'',originRules:S.settings.originRules||[]};
  return [me].concat(meetFriends().map(function(f){return {id:f.id,name:friendLabel(f),origin:friendOriginForMeeting(f),defaultOrigin:f.homeStation||'',originRules:f.originRules||[]};}));
}
function placeRecoPanelHTML(){
  var people=meetPlacePeople();M.placePeople=people;
  var st=selectedMeetStartTime(),sub=st?('약속 '+timeShort(st)+' 기준 출발지'):'기본 출발지 기준';
  return '<div class="place-reco"><div class="place-reco-head"><b>중간 위치 후보</b><small>'+esc(sub)+'</small></div>'+
    people.map(function(p,i){return '<div class="place-reco-person"><b>'+esc(p.name)+(p.id===(Sync.uid||'me')?' (나)':'')+'</b><select class="sel" data-place-origin="'+i+'">'+plannerMeetPointOptions(p.origin)+'</select></div>';}).join('')+
    '<div class="acts"><button class="b-save" data-act="place-reco-run">후보 보기</button></div><div id="place-reco-results"></div></div>';
}
function placeRecoResultsHTML(){
  var rec=plannerMeetingCandidates(M.placePeople||[]);
  if(!rec.length)return '<p class="hint">출발 지역을 2명 이상 입력해주세요.</p>';
  return rec.map(function(r,i){
    var q=encodeURIComponent(r.point.name);
    return '<div class="place-reco-card"><div><b>후보 '+(i+1)+' · '+esc(r.point.name)+'</b><small>'+r.count+'명 출발 위치 중심에서 '+(r.centerKm<1?Math.round(r.centerKm*1000)+'m':r.centerKm.toFixed(1)+'km')+'</small><small>'+esc(r.point.area)+'</small></div><div class="place-reco-actions"><button class="tbtn" data-act="place-reco-pick" data-st="'+esc(r.point.name)+'">여기로</button><a class="tbtn" target="_blank" rel="noopener" href="https://map.kakao.com/link/search/'+q+'">지도 보기</a></div></div>';
  }).join('');
}
function stationName(s){s=normalizePlaceText(s);return s?(/역$/.test(s)?s:s+'역'):'';}
function stationStem(s){return normalizePlaceText(s).replace(/역$/,'');}
function placeLeaf(v){var a=normalizePlaceText(v).split(/\s*·\s*|\s*>\s*/).filter(Boolean);return a[a.length-1]||'';}
/* ----- 장소 정보: {kind:'area',region,city,district} | {kind:'station',station} | {kind:'other',text} ----- */
function placeInfoText(i){
  if(!i)return '';
  if(i.kind==='station')return stationName(i.station);
  if(i.kind==='other')return normalizePlaceText(i.text);
  return [regionShort(i.region),i.city&&i.city!==i.region?i.city:'',i.district||''].filter(Boolean).join(' ');
}
function placeKeyOf(i){
  if(!i)return '';
  if(i.kind==='station')return stationStem(i.station);
  if(i.kind==='other')return normalizePlaceText(i.text);
  return i.district||(i.city&&i.city!==i.region?i.city:regionShort(i.region));
}
var PLACE_CACHE=null;
function allRegionPlaces(){
  if(PLACE_CACHE)return PLACE_CACHE;
  var out=[];
  Object.keys(KOREA_REGIONS).forEach(function(r){
    regionCities(r).forEach(function(c){
      out.push({kind:'area',region:r,city:c,district:''});
      regionDistricts(r,c).forEach(function(d){out.push({kind:'area',region:r,city:c,district:d});});
    });
  });
  return (PLACE_CACHE=out);
}
function regionAliases(r){var s=regionShort(r),a=[r,s,s+'시',s+'도'];if(r==='전북특별자치도')a.push('전라북도');if(r==='강원특별자치도')a.push('강원도');if(r==='제주특별자치도')a.push('제주도');return a;}
function placeTokenScore(p,t){
  var t2=t.replace(/(특별자치시|특별자치도|특별시|광역시)$/,''),best=0,cut=function(x){return String(x||'').replace(/(시|군|구)$/,'');};
  regionAliases(p.region).forEach(function(a){if(a===t||a===t2)best=Math.max(best,2);else if(t2.length>=2&&a.indexOf(t2)===0)best=Math.max(best,1);});
  [p.city,p.district].forEach(function(f){if(!f||f===p.region)return;if(f===t)best=Math.max(best,4);else if(t.length>=2&&cut(f)===cut(t))best=Math.max(best,4);else if(f.indexOf(t)===0)best=Math.max(best,3);});
  return best;
}
function placeSearchRows(q){
  var toks=normalizePlaceText(q).split(' ').filter(Boolean);if(!toks.length)return [];
  var joined=toks.join(''),wantStation=/역$/.test(joined),sq=wantStation?joined.replace(/역$/,''):joined,areas=[],stations=[];
  if(!wantStation){
    allRegionPlaces().forEach(function(p){var sc=0;for(var i=0;i<toks.length;i++){var v=placeTokenScore(p,toks[i]);if(!v)return;sc+=v;}areas.push({p:p,sc:sc-(p.district?0.5:0)});});
    areas.sort(function(a,b){return b.sc-a.sc;});
  }
  if(sq.length>=1&&toks.length===1){
    SEOUL_STATIONS.forEach(function(s){if(s.indexOf(sq)===0)stations.push(s);});
    if(sq.length>=2)SEOUL_STATIONS.forEach(function(s){if(s.indexOf(sq)>0&&stations.indexOf(s)<0)stations.push(s);});
    if(sq.length>=2&&stations.indexOf(sq)<0&&(wantStation||(!areas.length&&!stations.length))&&/^[가-힣0-9]+$/.test(sq)&&!/(시|도|구|군)$/.test(sq))stations.push(sq);
  }
  var ar=areas.slice(0,30).map(function(x){return {info:x.p,label:placeInfoText(x.p)};}),sr=stations.slice(0,12).map(function(s){return {info:{kind:'station',station:stationName(s)},label:stationName(s)};});
  return (wantStation?sr.concat(ar):ar.concat(sr)).slice(0,30);
}
function placeInfoFromText(v){
  v=normalizePlaceText(v);if(!v)return null;
  if(/역$/.test(v))return {kind:'station',station:v};
  var rows=placeSearchRows(v);
  if(rows.length&&rows[0].info.kind==='area'&&normalizePlaceText(rows[0].label).replace(/\s/g,'')===v.replace(/\s/g,''))return rows[0].info;
  return {kind:'other',text:v};
}
/* ----- 추억 기록 키: 같은 곳이 몇 번째인지 셀 때 써요 ----- */
function appointmentPhotoMemoryMeta(x){
  if(!x||String(x.line||'')!=='약속 포토카드')return null;var raw=String(x.station||''),m=raw.match(/^@planoncard\|([^|]*)\|(basic|cafe|study|walk)$/);if(!m)return {source:'',pose:'basic'};var src='';try{src=decodeURIComponent(m[1]||'');}catch(e){src=m[1]||'';}return {source:src,pose:m[2]||'basic'};
}
function memoryInfo(x){
  if(!x)return null;
  var line=String(x.line||''),st=normalizePlaceText(x.station);
  if(line==='약속 포토카드')return x.place?placeInfoFromText(placeLeaf(x.place)):null;
  if(line==='지하철'||/^\d+$/.test(line))return st?{kind:'station',station:st}:(x.place?placeInfoFromText(x.place):null);
  if(line==='기타')return st?{kind:'other',text:st}:null;
  if(line==='약속'){return st?placeInfoFromText(st):(x.place?placeInfoFromText(placeLeaf(x.place)):null);}
  if(KOREA_REGIONS[line]){var p=st.split('>').map(function(v){return v.trim();});return {kind:'area',region:line,city:p[0]||line,district:p[1]||''};}
  return st?{kind:'other',text:st}:null;
}
function memoryAreaLabel(x){var i=memoryInfo(x);return i?placeInfoText(i):'장소 미정';}
function memoryKey(x){return placeKeyOf(memoryInfo(x));}
function friendPlaceCounts(id){var m={};friendMemoryRows(id).forEach(function(x){var k=memoryKey(x);if(k)m[k]=(m[k]||0)+1;});return m;}
function placeIcon(kind){return kind==='station'?'<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="4.5" y="3" width="11" height="11" rx="3"/><path d="M7 17l1.5-3M13 17l-1.5-3M4.5 9.5h11"/><circle cx="7.6" cy="11.8" r=".6"/><circle cx="12.4" cy="11.8" r=".6"/></svg>':'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 17.5s5.5-5.2 5.5-9.3A5.5 5.5 0 0 0 4.5 8.2c0 4.1 5.5 9.3 5.5 9.3Z"/><circle cx="10" cy="8.2" r="2"/></svg>';}
function friendMemoryBanners(id){
  var rows=friendMemoryRows(id),cnt=friendPlaceCounts(id),seen={},out=[];
  rows.forEach(function(x){var i=memoryInfo(x),k=placeKeyOf(i);if(!k||seen[k])return;seen[k]=1;out.push('<span class="memory-banner">'+placeIcon(i.kind)+'<b>'+esc(k)+'</b><span>추억 '+cnt[k]+'개</span></span>');});
  return out.length?'<div class="memory-banners">'+out.slice(0,10).join('')+'</div>':'';
}
function placeCountBanner(friendId,info,future){
  var k=placeKeyOf(info);if(!k||!friendId)return '';
  var n=(friendPlaceCounts(friendId)[k]||0)+1;
  return '<div class="place-count">'+placeIcon(info.kind)+'<span><b>'+esc(k)+'</b>에서 '+(n===1?'첫':n+'번째')+' 추억'+(future?'이 될 거예요!':'이에요!')+'</span></div>';
}
function sharedFriendOf(r){return r.user_a===Sync.uid?r.user_b:r.user_a;}
function sharedMetDates(id){
  var out=[],now=new Date(),tk=dkey(now),nm=now.getHours()*60+now.getMinutes();
  (FriendSync.shared||[]).forEach(function(r){if(sharedFriendOf(r)!==id)return;var p=r.payload||{},fb=p.feedback||{};if(!p.date||fb[r.user_a]==='no'||fb[r.user_b]==='no')return;var end=p.end?toMin(p.end):(p.start?toMin(p.start)+60:1440);if(p.date<tk||(p.date===tk&&end<=nm))out.push(p.date);});
  return out;
}
function lastMetInfo(id){
  var dates=friendMemoryRows(id).map(function(x){return x.visited_at;}).filter(Boolean).concat(sharedMetDates(id)).filter(function(k){return k<=dkey(new Date());});
  dates.sort().reverse();if(!dates.length)return '아직 함께한 기록이 없어요';
  var n=Math.max(0,-diffDays(dates[0]));return n===0?'오늘 만났어요 ㅎ.ㅎ':n===1?'어제 만났어요':'안 만난 지 '+n+'일';
}
/* ----- 장소 고르기 (약속·추억·약속 수정에서 같이 써요) ----- */
function ppNew(info,o){
  o=o||{};var P={mode:'pick',region:'',city:'',district:'',station:'',other:'',q:'',tab:'area',allowUndecided:!!o.allowUndecided,friendId:o.friendId||null,future:!!o.future};
  if(!info){if(o.allowUndecided)P.mode='undecided';}
  else if(info.kind==='station'){P.station=stationName(info.station);P.region='서울특별시';P.tab='station';}
  else if(info.kind==='other'){P.mode='other';P.other=info.text||'';}
  else{P.region=info.region||'';P.city=info.city||'';P.district=info.district||'';}
  return P;
}
function ppInfo(P){
  if(!P||P.mode==='undecided')return null;
  if(P.mode==='other'){var t=normalizePlaceText(P.other);return t?{kind:'other',text:t}:null;}
  if(P.station)return {kind:'station',station:stationName(P.station)};
  if(P.region&&P.city)return {kind:'area',region:P.region,city:P.city,district:P.district||''};
  return null;
}
function ppHTML(P){
  var modes=(P.allowUndecided?[['undecided','미정']]:[]).concat([['pick','지역·역 고르기'],['other','직접 입력']]);
  var h='<div class="place-mode">'+modes.map(function(m){return '<button class="'+(P.mode===m[0]?'on':'')+'" data-act="pp-mode" data-v="'+m[0]+'">'+m[1]+'</button>';}).join('')+'</div>';
  if(P.mode==='undecided')h+='<p class="hint">장소는 나중에 같이 정해도 돼요. 아래에 후보를 올려두면 친구가 골라요.</p>';
  else if(P.mode==='other')h+='<input class="fld" id="pp-other" maxlength="80" placeholder="해외여행, 놀이공원, 학교 등 자유롭게 입력" value="'+esc(P.other)+'"><p class="hint">예: 도쿄 디즈니랜드 · 한강 놀이터 · 오사카 여행</p>';
  else{
    var region=P.region,isSeoul=region==='서울특별시',cities=region?regionCities(region):[],ds=P.city?regionDistricts(region,P.city):[];
    h+='<div class="place-search"><input class="fld" id="pp-q" autocomplete="off" enterkeyhint="search" placeholder="~시 ~구로 입력하거나 지하철역 입력하세요" value="'+esc(P.q)+'"></div><div id="pp-results">'+ppResultsHTML(P.q)+'</div>'+
      '<div class="region-chips">'+Object.keys(KOREA_REGIONS).map(function(r){return '<button class="'+(r===region?'on':'')+'" data-act="pp-region" data-v="'+esc(r)+'">'+esc(regionShort(r))+'</button>';}).join('')+'</div>';
    if(region){
      if(isSeoul)h+='<div class="seg pp-tabs"><button class="'+(P.tab!=='station'?'on':'')+'" data-act="pp-tab" data-v="area">구로 고르기</button><button class="'+(P.tab==='station'?'on':'')+'" data-act="pp-tab" data-v="station">지하철역으로 고르기</button></div>';
      if(isSeoul&&P.tab==='station')h+='<div class="station-grid">'+SEOUL_STATIONS.map(function(s){var v=stationName(s);return '<button class="'+(P.station===v?'on':'')+'" data-act="pp-station" data-v="'+esc(v)+'">'+esc(s)+'</button>';}).join('')+'</div><p class="hint">목록에 없는 역은 위 검색창에 역 이름을 입력해요.</p>';
      else if(region!=='세종특별자치시'){
        h+='<span class="lbl">'+(Array.isArray(KOREA_REGIONS[region])&&isSeoul?'구':'시·군·구')+'</span><div class="station-grid">'+cities.map(function(c){return '<button class="'+(P.city===c&&!P.station?'on':'')+'" data-act="pp-city" data-v="'+esc(c)+'">'+esc(c)+'</button>';}).join('')+'</div>';
        if(ds.length)h+='<span class="lbl">'+esc(P.city)+' 안에서 <em>(선택)</em></span><div class="station-grid">'+ds.map(function(d){return '<button class="'+(P.district===d?'on':'')+'" data-act="pp-district" data-v="'+esc(d)+'">'+esc(d)+'</button>';}).join('')+'</div>';
      }
    }
  }
  var info=ppInfo(P);
  if(P.mode!=='undecided')h+=info?'<div class="pp-sel">'+placeIcon(info.kind)+'<span>'+esc(placeInfoText(info))+'</span><button class="pp-x" data-act="pp-clear" aria-label="장소 지우기">✕</button></div>'+placeCountBanner(P.friendId,info,P.future):(P.mode==='pick'?'<p class="hint">지역을 누르거나 검색해서 골라요.</p>':'');
  return h;
}
function ppResultsHTML(q){
  if(!normalizePlaceText(q))return '';
  var rows=placeSearchRows(q);
  return '<div class="place-results">'+(rows.length?rows.map(function(x){var i=x.info;return '<button class="place-result" data-act="pp-pick" data-kind="'+i.kind+'" data-r="'+esc(i.region||'')+'" data-c="'+esc(i.city||'')+'" data-d="'+esc(i.district||'')+'" data-s="'+esc(i.station||'')+'"><small style="opacity:.55;margin-right:5px">'+(i.kind==='station'?'역':'지역')+'</small>'+esc(x.label)+'</button>';}).join(''):'<span class="hint">찾는 곳이 없어요. “직접 입력”으로 적어도 돼요.</span>')+'</div>';
}
function ppDraw(){
  var box=$('#pp');if(!box||!M.pp)return;box.innerHTML=ppHTML(M.pp);
  var cb=$('#appointment-candidates');if(cb)cb.style.display=M.pp.mode==='undecided'?'':'none';
}
function ppAct(name,a){
  var P=M.pp;if(!P)return;
  if(name==='pp-mode'){P.mode=a.dataset.v;}
  else if(name==='pp-region'){P.region=a.dataset.v;P.city=P.region==='세종특별자치시'?P.region:'';P.district='';P.station='';P.tab='area';}
  else if(name==='pp-tab'){P.tab=a.dataset.v;P.station='';P.city='';P.district='';}
  else if(name==='pp-city'){P.city=a.dataset.v;P.district='';P.station='';}
  else if(name==='pp-district'){P.district=P.district===a.dataset.v?'':a.dataset.v;}
  else if(name==='pp-station'){P.station=a.dataset.v;P.city='';P.district='';}
  else if(name==='pp-clear'){P.region='';P.city='';P.district='';P.station='';P.other='';P.q='';P.tab='area';}
  else if(name==='pp-pick'){
    if(a.dataset.kind==='station'){P.station=stationName(a.dataset.s);P.region='서울특별시';P.tab='station';P.city='';P.district='';}
    else{P.region=a.dataset.r;P.city=a.dataset.c;P.district=a.dataset.d||'';P.station='';P.tab='area';}
    P.mode='pick';P.q='';
  }
  ppDraw();
}
/* ----- 장소 후보 ----- */
function cleanCandidates(a){var seen={};return (a||[]).map(normalizePlaceText).filter(function(x){if(!x||seen[x])return false;seen[x]=1;return true;}).slice(0,5);}
function candidateInputsHTML(vals){
  vals=vals&&vals.length?vals.slice():['','',''];
  while(vals.length<2)vals.push('');
  return '<div class="place-candidates"><span class="lbl">장소 후보 <em>(선택 · 최대 5개)</em></span><p class="hint">친구가 괜찮은 곳을 여러 개 고를 수 있어요. 둘이 겹친 곳으로 확정하면 두 사람 캘린더 장소도 같이 바뀌어요.</p>'+vals.map(function(v,i){return '<div class="candrow"><input class="fld f-place-candidate" maxlength="80" placeholder="후보 '+(i+1)+' · 예: 성수역 / 서울숲 / 한강공원" value="'+esc(v)+'">'+(i>=2?'<button class="tbtn" data-act="candidate-remove" data-i="'+i+'">삭제</button>':'')+'</div>';}).join('')+(vals.length<5?'<button class="tbtn" data-act="candidate-add">+ 후보 추가</button>':'')+'</div>';
}
/* ----- 관계 요약 ----- */
function relationStats(id){
  var mem=friendMemoryRows(id),shared=(FriendSync.shared||[]).filter(function(r){return sharedFriendOf(r)===id;}),counts=friendPlaceCounts(id);
  var top=Object.keys(counts).sort(function(a,b){return counts[b]-counts[a];})[0]||'';
  return {meet:shared.length,mem:mem.length,last:lastMetInfo(id),top:top,topN:top?counts[top]:0};
}
function relationSummaryHTML(id,noLast){
  var x=relationStats(id);
  return '<div class="relation-summary">'+(noLast?'':'<div class="relation-chip"><b>'+esc(x.last)+'</b>마지막 만남</div>')+'<div class="relation-chip"><b>'+x.meet+'번</b>함께 잡은 약속</div><div class="relation-chip"><b>'+x.mem+'개</b>쌓인 추억</div>'+(x.top?'<div class="relation-chip"><b>'+esc(x.top)+' '+x.topN+'번</b>제일 자주 간 곳</div>':'')+'</div>';
}
/* ----- 약속 전 체크 (오늘·내일 약속) ----- */
function upcomingPlaceDecisions(){
  var tk=dkey(new Date());
  return (FriendSync.shared||[]).filter(function(r){var p=r.payload||{};if(p.place||!p.date||p.date<tk)return false;var cs=p.candidateSelections||{},mine=cs[Sync.uid]||[],theirs=cs[sharedFriendOf(r)]||[];if(!cleanCandidates(p.placeCandidates).length)return false;return !mine.length||mine.filter(function(x){return theirs.indexOf(x)>=0;}).length>1;});
}
function appointmentPrecheckHTML(){
  if(!Sync.uid)return '';
  var now=new Date(),tk=dkey(now),nm=now.getHours()*60+now.getMinutes(),out=[];
  (FriendSync.shared||[]).slice().sort(function(a,b){return String((a.payload||{}).date+(a.payload||{}).start).localeCompare(String((b.payload||{}).date+(b.payload||{}).start));}).forEach(function(r){
    var p=r.payload||{};if(!p.date||p.date<tk)return;
    var days=diffDays(p.date);if(days<0||days>1)return;
    var s=p.start?toMin(p.start):null,e=p.end?toMin(p.end):(s!=null?s+60:null);if(days===0&&e!=null&&e<=nm)return;
    var fid=sharedFriendOf(r),who=requestFriendCode(fid),c=cleanCandidates(p.placeCandidates),sel=(p.candidateSelections||{})[fid]||[],checks=[];
    if(s!=null){var clash=itemsFor(parseKey(p.date)).filter(function(it){if(it.skipped||it.kind==='focus')return false;var ev=it.kind==='event'&&S.events.find(function(x){return x.id===it.id;});if(ev&&ev.sharedRequestId===r.request_id)return false;return it.start<e&&it.end>s;});
      if(clash.length)checks.push('<li class="warn">같은 시간에 “'+esc(clash[0].name)+'”'+(clash.length>1?' 외 '+(clash.length-1)+'개':'')+' 일정이 있어요</li>');
      else checks.push('<li>이 시간엔 다른 일정이 없어요</li>');
      if(days===0){var left=s-nm;if(left>0)checks.push('<li>'+(left>=60?Math.floor(left/60)+'시간 '+(left%60?left%60+'분 ':''):left+'분 ')+'뒤에 만나요</li>');}
    }else checks.push('<li>시간이 아직 안 정해졌어요</li>');
    if(!p.place)checks.push('<li class="warn">장소가 아직 미정이에요'+(c.length?' · 후보 '+c.length+'곳'+(sel.length?', 친구가 '+sel.length+'곳 골랐어요':''):'')+'</li>');
    out.push('<section class="appt-check"><b>'+(days===0?'오늘':'내일')+' '+esc(who)+'님과 '+esc(p.what||'약속')+'</b><small>'+esc([s!=null?timeShort(p.start)+(p.end?'~'+timeShort(p.end):''):'시간 미정',p.place||'장소 미정'].join(' · '))+'</small><ul class="appt-list">'+checks.join('')+'</ul>'+
      (!p.place?'<div class="acts"><button class="tbtn" data-act="place-decide-open" data-id="'+esc(r.request_id)+'">장소 같이 정하기</button></div>':'')+'</section>');
  });
  return out.join('');
}
function latestShared(rid){return (FriendSync.shared||[]).find(function(x){return x.request_id===rid;});}
/* 약속 정보는 서버 최신본을 먼저 읽고 내 변경만 얹어서 저장해요 (둘이 동시에 눌러도 서로 답이 안 지워져요) */
function sharedPatch(rid,fn){
  var sb=friendDb();if(!sb)return Promise.reject(new Error('로그인이 필요해요'));
  return sb.from('planner_shared_appointments').select('request_id,user_a,user_b,payload').eq('request_id',rid).maybeSingle().then(function(x){
    if(x.error)throw x.error;if(!x.data)throw new Error('약속을 찾지 못했어요');
    var p=JSON.parse(JSON.stringify(x.data.payload||{})),res=fn(p,x.data),gid=p.groupId||'';
    if(!gid)return sb.from('planner_shared_appointments').update({payload:p,updated_at:new Date().toISOString()}).eq('request_id',rid).then(function(y){if(y.error)throw y.error;var loc=latestShared(rid);if(loc)loc.payload=p;return {p:p,res:res};});
    var groupRows=(FriendSync.shared||[]).filter(function(r){return r.payload&&r.payload.groupId===gid;});
    if(!groupRows.length)groupRows=[x.data];
    return Promise.all(groupRows.map(function(gr){
      var gp=Object.assign({},gr.payload||{},p);
      return sb.from('planner_shared_appointments').update({payload:gp,updated_at:new Date().toISOString()}).eq('request_id',gr.request_id).then(function(y){if(y.error)throw y.error;var loc=latestShared(gr.request_id);if(loc)loc.payload=gp;});
    })).then(function(){return {p:p,res:res};});
  });
}
function updateSharedPayload(r,fn,msg){
  if(!r)return Promise.resolve();
  return sharedPatch(r.request_id,fn).then(function(o){mergeSharedAppointments(FriendSync.shared);softRender();var m=typeof msg==='function'?msg(o):msg;if(m)inAppToast(m);return friendRequestLoad();}).catch(function(){inAppToast('약속을 업데이트하지 못했어요. 잠시 뒤 다시 해주세요');});
}
function openPlaceDecision(rid){
  var r=latestShared(rid);if(!r)return;
  var p=r.payload||{},my=(p.candidateSelections||{})[Sync.uid]||[];
  M={type:'place-decision',requestId:rid,selected:my.slice(),added:[]};
  drawPlaceDecision();
}
function drawPlaceDecision(){
  var r=latestShared(M.requestId);if(!r){closeModal();return;}
  var p=r.payload||{},fid=sharedFriendOf(r),who=requestFriendCode(fid),c=cleanCandidates((p.placeCandidates||[]).concat(M.added||[])),other=(p.candidateSelections||{})[fid]||[];
  var rows=c.map(function(x){return '<button class="candidate-pick'+(M.selected.indexOf(x)>=0?' on':'')+'" data-act="candidate-toggle" data-v="'+esc(x)+'">'+(M.selected.indexOf(x)>=0?'✓ ':'')+esc(x)+(other.indexOf(x)>=0?'<em>'+esc(who)+'도 골랐어요</em>':'')+'</button>';}).join('');
  openModal('<h3>장소 같이 정하기</h3><p class="hint">'+esc(who)+'님과 '+esc(p.date?slotText(p.date,p.start?toMin(p.start):null,p.start?(p.end?toMin(p.end):toMin(p.start)+60):null):'')+' 약속이에요. 괜찮은 곳을 여러 개 골라도 돼요. 둘 다 고른 곳이 하나면 바로 확정돼요.</p>'+
    (rows?'<div class="candidate-picks" id="candidate-picks">'+rows+'</div>':'<div class="empty">아직 후보가 없어요. 아래에 먼저 올려봐요.</div>')+
    (c.length<5?'<div class="row"><input class="fld" style="margin:0" id="f-cand-new" maxlength="80" placeholder="후보 추가 · 예: 성수역, 서울숲"><button class="b-ghost" style="height:44px;padding:0 14px" data-act="candidate-new">추가</button></div>':'')+
    '<div id="candidate-common"></div><div class="acts"><button class="b-ghost" data-act="close">닫기</button><button class="b-save" data-act="candidate-save">선택 저장</button></div>');
  drawCandidateCommon();
}
function drawCandidateCommon(){
  var box=$('#candidate-common');if(!box)return;var r=(FriendSync.shared||[]).find(function(x){return x.request_id===M.requestId;});if(!r)return;
  var p=r.payload||{},cs=p.candidateSelections||{},members=(p.groupMembers&&p.groupMembers.length?p.groupMembers:[r.user_a,r.user_b]),lists=members.map(function(uid){return cs[uid]||[];}).filter(function(a){return a.length;});
  var common=lists.length?lists[0].filter(function(x){return lists.every(function(a){return a.indexOf(x)>=0;});}):[];
  box.innerHTML=common.length?'<p class="hint">현재 선택을 보낸 사람들 모두 겹치는 후보예요.</p>'+common.map(function(x){return '<button class="candidate-pick on" data-act="candidate-final" data-v="'+esc(x)+'">✓ '+esc(x)+'로 확정</button>';}).join(''):'<p class="hint">아직 모두 겹치는 후보가 없어요. 여러 개 골라도 돼요.</p>';
}
function saveCandidateSelection(){
  var r=latestShared(M.requestId);if(!r)return;
  var sel=cleanCandidates(M.selected||[]),added=(M.added||[]).slice(),me=Sync.uid;closeModal();
  updateSharedPayload(r,function(p,row){
    var cs=p.candidateSelections||{};p.placeCandidates=cleanCandidates((p.placeCandidates||[]).concat(added));cs[me]=sel;p.candidateSelections=cs;p.candidateBy=me;p.candidateAt=Date.now();
    var members=(p.groupMembers&&p.groupMembers.length?p.groupMembers:[row.user_a,row.user_b]),lists=members.map(function(uid){return cs[uid]||[];}).filter(function(a){return a.length;});
    var allAnswered=members.every(function(uid){return (cs[uid]||[]).length>0;});
    var common=lists.length?lists[0].filter(function(x){return lists.every(function(a){return a.indexOf(x)>=0;});}):[];
    if(!p.place&&allAnswered&&common.length===1){p.place=common[0];p.placeInfo=placeInfoFromText(common[0]);p.placePending=false;p.placeConfirmedBy=me;}
    return {common:common,allAnswered:allAnswered};
  },function(o){var z=o.res||{},c=z.common||[];return z.allAnswered&&c.length===1?euro(c[0])+' 장소를 확정했어요. 그룹 캘린더에 같이 바뀌어요':c.length>1?'겹친 곳이 '+c.length+'곳이에요. 하나를 눌러 확정해요':'장소 후보 선택을 저장했어요';});
}
function finalizeCandidate(v){
  var r=latestShared(M.requestId);if(!r)return;closeModal();
  updateSharedPayload(r,function(p){p.place=v;p.placeInfo=placeInfoFromText(v);p.placePending=false;p.placeConfirmedBy=Sync.uid;},euro(v)+' 장소를 확정했어요. 두 사람 캘린더에 같이 바뀌어요');
}
/* ----- 약속 끝난 뒤: 재밌었어? ----- */
function pendingPostMeets(){
  if(!Sync.uid)return [];
  var now=new Date(),tk=dkey(now),nm=now.getHours()*60+now.getMinutes(),from=dkey(addDays(now,-14));
  return (FriendSync.shared||[]).filter(function(r){var p=r.payload||{},end=p.end?toMin(p.end):(p.start?toMin(p.start)+60:1440);if(!p.date||p.date<from||p.date>tk||(p.date===tk&&end>nm))return false;return !(p.feedback||{})[Sync.uid];});
}
function postMeetRowHTML(r,compact){
  var p=r.payload||{},who=requestFriendCode(sharedFriendOf(r)),tk=todayKey();
  var when=(p.date===tk?'오늘':(p.date?mdTxt(parseKey(p.date)):''));
  var clock=p.start?(timeShort(p.start)+(p.end?'~'+timeShort(p.end):'')):'시간 미정';
  var place=p.place||'장소 미정';
  return '<section class="postmeet'+(compact?' compact':'')+'"><b>'+esc([when,clock].filter(Boolean).join(' '))+'에 '+esc(place)+'에서 '+esc(who)+'님 만났어?</b><small>'+esc(p.what||'약속')+' · 확인하면 기분과 한줄평을 골라 포토카드를 만들 수 있어요.</small><div class="acts"><button class="b-save" data-act="postmeet-yes" data-id="'+esc(r.request_id)+'">응, 카드 만들래</button><button class="b-ghost" data-act="postmeet-no" data-id="'+esc(r.request_id)+'">아니야</button></div></section>';
}
function postMeetNudgesHTML(){
  var a=pendingPostMeets().slice(0,3).map(function(r){return postMeetRowHTML(r);});
  var b=pendingLocalPostMeets().slice(0,Math.max(0,3-a.length)).map(localPostMeetRowHTML);
  return a.concat(b).join('');
}
/* ----- 직접 입력한 약속도(연결된 친구 이름과 같으면) 끝나면 확인 → 추억 ----- */
function localMeetFriend(ev){
  if(!ev||ev.sharedRequestId||typeof FriendSync==='undefined'||!FriendSync.friends)return null;
  if(ev.friendId){var byId=FriendSync.friends.find(function(f){return f.id===ev.friendId;});if(byId)return byId;}
  var nm=String(ev.person||'').trim().replace(/님$/,'');if(!nm)return null;
  return FriendSync.friends.find(function(f){return friendLabel(f).trim()===nm||String(f.name||'').trim()===nm||String(f.code||'')===nm;})||null;
}
function pendingLocalPostMeets(){
  if(!Sync.uid||!FriendSync.loaded)return [];
  var now=new Date(),tk=dkey(now),nm=now.getHours()*60+now.getMinutes(),from=dkey(addDays(now,-14));
  return (S.events||[]).filter(function(ev){
    if(!ev||ev.kind!=='appointment'||ev.sharedRequestId||ev.metAsked||!ev.date||!ev.start)return false;
    var end=ev.end?toMin(ev.end):toMin(ev.start)+60;
    if(ev.date<from||ev.date>tk||(ev.date===tk&&end>nm))return false;
    return !!localMeetFriend(ev);
  }).sort(function(a,b){return (a.date+a.start)<(b.date+b.start)?-1:1;});
}
function localPostMeetRowHTML(ev){
  var f=localMeetFriend(ev),tk=todayKey();
  var when=ev.date===tk?'오늘':mdTxt(parseKey(ev.date));
  var clock=timeShort(ev.start)+(ev.end?'~'+timeShort(ev.end):'');
  var place=ev.place||'장소 미정';
  return '<section class="postmeet"><b>'+esc(when+' '+clock)+'에 '+esc(place)+'에서 '+esc(friendLabel(f))+'님 만났어?</b><small>'+esc(ev.what||'약속')+' · 확인하면 기분과 한줄평을 골라 포토카드를 만들 수 있어요.</small><div class="acts"><button class="b-save" data-act="postmeet-local-yes" data-id="'+esc(ev.id)+'">응, 카드 만들래</button><button class="b-ghost" data-act="postmeet-local-no" data-id="'+esc(ev.id)+'">아니야</button></div></section>';
}
function postMeetLocalAnswer(id,yes){
  var ev=(S.events||[]).find(function(x){return x.id===id;});if(!ev)return;
  var f=localMeetFriend(ev);ev.metAsked=yes?'yes':'no';save();
  if(!yes||!f){inAppToast(yes?'확인했어요':'안 만난 약속으로 표시했어요');softRender();return;}
  softRender();
  if(window.PLANON_DAY_STORY&&window.PLANON_DAY_STORY.openAppointmentStory){window.PLANON_DAY_STORY.openAppointmentStory(ev.id);return;}
  inAppToast('약속을 확인했어요 · 약속 상세에서 추억 포토카드를 만들 수 있어요');
}
function ensureMemoryFromSharedNow(row){
  if(!row||!Sync.uid)return Promise.resolve(false);
  var rid=row.request_id,fid=sharedFriendOf(row);
  var exists=friendMemoryRows(fid).some(function(x){return x.id===rid||x.request_id===rid;});
  if(exists)return sharedPatch(rid,function(p){p.memoryCreated=true;}).then(function(){return true;}).catch(function(){return true;});
  var base=memoryRowFromShared(row),sb=friendDb();
  var local=Object.assign({id:rid,request_id:rid},base);
  if(!sb){
    if(!(S.settings.friendMemories||[]).some(function(x){return x.id===rid;}))S.settings.friendMemories.push(local);
    if(!(FriendSync.memories||[]).some(function(x){return x.id===rid;}))FriendSync.memories.push(local);
    save();return Promise.resolve(true);
  }
  var ins=Object.assign({id:rid},base);
  return sb.from('planner_friend_memories').upsert(ins,{onConflict:'id',ignoreDuplicates:true}).then(function(x){
    if(x.error)throw x.error;
    if(!(FriendSync.memories||[]).some(function(m){return m.id===rid;}))FriendSync.memories.push(ins);
    return sharedPatch(rid,function(p){p.memoryCreated=true;}).catch(function(){}).then(function(){return true;});
  }).catch(function(){
    if(!(S.settings.friendMemories||[]).some(function(x){return x.id===rid;}))S.settings.friendMemories.push(local);
    if(!(FriendSync.memories||[]).some(function(x){return x.id===rid;}))FriendSync.memories.push(local);
    save();return true;
  });
}
function postMeetAnswer(rid,yes){
  var row=latestShared(rid);if(!row||!friendDb())return;
  var me=Sync.uid,lp=JSON.parse(JSON.stringify(row.payload||{}));(lp.feedback=lp.feedback||{})[me]=yes?'yes':'no';row.payload=lp;
  if(M.type==='notices')drawNotices();else softRender();
  sharedPatch(rid,function(p){var fb=p.feedback||{};fb[me]=yes?'yes':'no';p.feedback=fb;}).then(function(){
    if(!yes){inAppToast('안 만난 약속으로 표시했어요');return friendRequestLoad();}
    var ev=(S.events||[]).find(function(x){return x&&x.kind==='appointment'&&(x.sharedRequestId===rid||(Array.isArray(x.groupRequestIds)&&x.groupRequestIds.indexOf(rid)>=0));});
    if(ev&&window.PLANON_DAY_STORY&&window.PLANON_DAY_STORY.openAppointmentStory){setTimeout(function(){window.PLANON_DAY_STORY.openAppointmentStory(ev.id);},0);}else inAppToast('약속을 확인했어요 · 약속 상세에서 추억 포토카드를 만들 수 있어요');
    return friendRequestLoad();
  }).then(function(){softRender();}).catch(function(){inAppToast('답을 저장하지 못했어요');});
}
function memoryRowFromShared(r){
  var p=r.payload||{},info=p.placeInfo||placeInfoFromText(p.place),line='약속',station='';
  if(info&&info.kind==='station'){line='지하철';station=stationName(info.station);}
  else if(info&&info.kind==='area'){line=info.region;station=[info.city,info.district].filter(Boolean).join(' > ');}
  else if(info&&info.kind==='other'){line='기타';station=info.text;}
  return {owner_id:Sync.uid,friend_id:sharedFriendOf(r),line:line,station:station,visited_at:p.date||dkey(new Date()),place:'',what:p.what||'함께한 약속'};
}
function autoMemoryFromShared(){return Promise.resolve();}

/* ---------- 링크 약속: 앱 없는 친구·여러 명(팀플·동아리)도 링크로 시간 고르기 ---------- */
var LinkSync={links:[],answers:{},loaded:false,error:''};
function linkUrl(t){return location.origin+location.pathname+'#m='+t;}
function linkBusy(p,k,m){var b=p.busy&&p.busy[k];if(!b)return false;if(b==='a')return true;return b.some(function(r){return r[0]<m+30&&r[1]>m;});}
function linkDays(p){var out=[],f=parseKey(p.from);for(var i=0;i<(p.days||14);i++)out.push(dkey(addDays(f,i)));return out;}
function linkCounts(answers,skipId){var c={},who={};(answers||[]).forEach(function(a){if(skipId&&a.id===skipId)return;linkRealSlots(a).forEach(function(s){c[s]=(c[s]||0)+1;(who[s]=who[s]||[]).push(a.name||'친구');});});return {c:c,who:who};}
function linkBestRuns(p,answers){
  var cw=linkCounts(answers),runs=[],tk=dkey(new Date()),total=(answers||[]).length+1;
  linkDays(p).forEach(function(k){if(k<tk)return;var cur=null;
    for(var m=p.lo;m<=p.hi;m+=30){
      var ownerOk=m<p.hi&&!linkBusy(p,k,m),n=ownerOk?((cw.c[k+'|'+m]||0)+1):0;
      if(cur&&n===cur.n&&n>0){cur.e=m+30;continue;}
      if(cur)runs.push(cur);
      cur=n>0?{date:k,s:m,e:m+30,n:n,total:total}:null;
    }
  });
  runs=runs.filter(function(x){return x.e-x.s>=60;});
  var out=[],seen={};
  function add(x,label,why){if(!x)return;var k=x.date+'|'+x.s+'|'+x.e;if(seen[k])return;seen[k]=1;x.label=label;x.why=why;out.push(x);}
  var all=runs.filter(function(x){return x.n===total;});
  var longest=all.slice().sort(function(a,b){return (b.e-b.s)-(a.e-a.s)||a.date.localeCompare(b.date)||a.s-b.s;})[0];
  var earliest=all.slice().sort(function(a,b){return a.date.localeCompare(b.date)||a.s-b.s||(b.e-b.s)-(a.e-a.s);})[0];
  var most=runs.slice().sort(function(a,b){return b.n-a.n||(b.e-b.s)-(a.e-a.s)||a.date.localeCompare(b.date)||a.s-b.s;})[0];
  add(longest,'전원 가능',longest?'전원 가능 · '+durText(longest.e-longest.s)+' 확보':'');
  add(earliest,'가장 빠른 후보',earliest?'가장 이른 전원 가능 시간 · '+durText(earliest.e-earliest.s)+' 확보':'');
  add(most,'가장 많이 겹침',most?most.n+'/'+total+'명 가능 · '+durText(most.e-most.s)+' 확보':'');
  return out.slice(0,3);
}
function durText(min){min=Math.max(0,+min||0);var h=Math.floor(min/60),m=min%60;return (h?h+'시간 ':'')+(m?m+'분':'')||'0분';}
function linkInviteeNames(p){return (p&&Array.isArray(p.inviteeNames)?p.inviteeNames:[]).map(function(x){return String(x||'').trim();}).filter(Boolean);}
function linkUnanswered(p,answers){
  var inv=linkInviteeNames(p),done=(answers||[]).map(function(a){return String(a.name||'').trim();});
  if(inv.length)return inv.filter(function(n){return done.indexOf(n)<0;});
  var expected=Math.max(+((p||{}).expectedPeople)||2,2),left=Math.max(0,expected-1-done.length),out=[];for(var i=0;i<left;i++)out.push('미응답 '+(i+1));return out;
}
function linkDeadlineNudge(){
  if(!Sync.uid)return;if(!S.settings.linkDeadlineNudged)S.settings.linkDeadlineNudged={};var changed=false,now=Date.now();
  LinkSync.links.forEach(function(l){var p=l.payload||{};if(l.status!=='open'||!p.responseDeadline)return;var t=new Date(p.responseDeadline).getTime(),left=t-now;if(!isFinite(t)||left<=0||left>86400000)return;var key=l.token+'|'+p.responseDeadline;if(S.settings.linkDeadlineNudged[key])return;var ua=linkUnanswered(p,LinkSync.answers[l.token]||[]);if(!ua.length)return;S.settings.linkDeadlineNudged[key]=1;changed=true;var who=linkInviteeNames(p).length?ua.join(', ')+' 미응답':ua.length+'명 미응답';var tx='“'+(p.what||'약속')+'” 응답 마감이 24시간 안에 있어요 · '+who;pushNotice('friend',tx);if(document.hidden)sysNotify('약속 응답 마감',tx,'lk-deadline:'+l.token);else inAppToast(tx);});
  if(changed)save();
}
function linkGridHTML(p,answers,o){
  var days=linkDays(p),start=o.week*7,tk=dkey(new Date()),now=new Date(),nm=now.getHours()*60+now.getMinutes(),cw=linkCounts(answers,o.skipId),total=(answers||[]).filter(function(a){return !o.skipId||a.id!==o.skipId;}).length,max=0;
  Object.keys(cw.c).forEach(function(k){if(cw.c[k]>max)max=cw.c[k];});
  var cols=[];for(var i=0;i<7;i++)cols.push(days[start+i]||null);
  var h='<div class="mgh"></div>'+cols.map(function(k){if(!k)return '<div class="mgh"></div>';var d=parseKey(k);return '<div class="mgh'+(k===tk?' td':'')+'">'+DAYS[dow(d)]+'<b>'+d.getDate()+'</b></div>';}).join('');
  for(var m=p.lo;m<p.hi;m+=30){
    h+='<span class="mt">'+(m%60===0?m/60:'')+'</span>';
    cols.forEach(function(k){
      if(!k){h+='<span class="mc past" aria-hidden="true"></span>';return;}
      var key=k+'|'+m,past=k<tk||(k===tk&&m+30<=nm),busy=linkBusy(p,k,m),n=cw.c[key]||0;
      var mine=o.mode==='guest'&&o.mine&&o.mine[key],sel=o.mode==='owner'&&o.sel&&o.sel.date===k&&m>=o.sel.s&&m<o.sel.e;
      var cls='mc'+(past?' past':'')+(busy&&o.mode==='guest'?' fb':'')+(busy&&o.mode==='owner'?' mb':'')+(mine||sel?' pick':'')+(n&&!mine&&!sel?' heat':'');
      var st=n&&!mine&&!sel?' style="--h:'+Math.round(35+65*n/Math.max(max,1))+'%"':'';
      h+='<button class="'+cls+'"'+st+' data-act="'+(o.mode==='guest'?'lk-cell':'lk-ocell')+'" data-k="'+k+'" data-m="'+m+'"'+(past||(busy&&o.mode==='guest')?' aria-disabled="true"':'')+' aria-label="'+esc(slotText(k,m,m+30)+(n?' · '+n+'명 가능':''))+'">'+(n&&o.mode==='owner'&&!sel?'<i>'+n+'</i>':'')+'</button>';
    });
  }
  var pages=Math.ceil(days.length/7),a=parseKey(cols[0]),lastK=cols.filter(Boolean).pop(),b=parseKey(lastK);
  return '<div class="meetnav"><button class="tbtn" data-act="lk-week" data-v="-1"'+(o.week>0?'':' disabled')+'>‹</button><b>'+mdTxt(a)+' – '+mdTxt(b)+'</b><button class="tbtn" data-act="lk-week" data-v="1"'+(o.week<pages-1?'':' disabled')+'>›</button></div>'+
    '<div class="meetlegend">'+(o.mode==='guest'?'<span><i class="fb"></i>'+esc(p.ownerName||'친구')+' 안 되는 시간</span><span><i class="pick"></i>내가 된다고 한 시간</span>':'<span><i class="mb"></i>내 일정</span><span><i class="pick"></i>고른 시간</span>')+(total?'<span><i class="heat" style="--h:80%"></i>다른 사람 가능 (진할수록 많이)</span>':'')+'</div>'+
    '<div class="meetgrid">'+h+'</div>';
}
/* ----- 만드는 쪽 (로그인한 나) ----- */
function localInputValue(d){
  d=d||new Date();
  return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'T'+pad(d.getHours())+':'+pad(d.getMinutes());
}
function linkDeadlineDefault(){
  var d=new Date();d.setDate(d.getDate()+3);d.setHours(23,59,0,0);return localInputValue(d);
}
function linkDeadlineText(v){
  if(!v)return '마감 없음';
  try{var d=new Date(v);if(!isFinite(d))return v;return (d.getMonth()+1)+'월 '+d.getDate()+'일 '+pad(d.getHours())+':'+pad(d.getMinutes());}catch(e){return v;}
}
function linkDeadlinePassed(p){
  if(!p||!p.responseDeadline)return false;var t=new Date(p.responseDeadline).getTime();return isFinite(t)&&Date.now()>t;
}
function openLinkCreate(){
  if(!friendDb()){openLogin('링크 약속은 로그인 후 만들 수 있어요');return;}
  M={type:'link-create',pp:ppNew(null,{allowUndecided:true}),days:14};
  openModal('<h3>링크로 약속 잡기</h3><p class="hint">앱이 없는 친구도, 여러 명(팀플·동아리·모임)도 링크만 열면 되는 시간을 골라요. 내 일정은 제목 없이 “안 되는 시간”으로만 보여요.</p>'+
    '<span class="lbl">무엇을</span><input class="fld" id="f-lkwhat" maxlength="40" placeholder="예: 팀플 회의, 동아리 회식, 저녁">'+
    '<div class="meet-step">2. 장소 정하기 <small>지금 정하지 않아도 돼요.</small></div><div id="pp">'+ppHTML(M.pp)+'</div>'+
    '<div class="card" style="margin:8px 0"><label class="ck" style="margin-bottom:8px"><input type="checkbox" id="f-lk-place-reco" checked> 출발지를 바탕으로 중간 장소 후보 받기</label>'+
    '<span class="lbl">총 몇 명이 답할 예정이야? <em>(나 포함)</em></span><input class="fld" id="f-lk-expected" type="number" min="2" max="30" value="3">'+
    '<span class="lbl">응답할 사람 이름 <em>(선택)</em></span><input class="fld" id="f-lk-invitees" maxlength="160" placeholder="예: 민지, 지민, 서연"><p class="hint">이름을 적어두면 누가 아직 답하지 않았는지 보여줘요.</p>'+
    '<span class="lbl">내 출발 지역</span><input class="fld" id="f-lk-origin" list="origin-suggestions" autocomplete="off" placeholder="부산, 서울, 강남역처럼 검색" value="'+esc(S.settings.homeStation||'')+'">'+originDatalist()+
    '<div class="geo-row"><button class="tbtn" data-act="lk-current">현재 위치에서 찾기</button><small id="lk-geo-msg">프로필의 출발 지역이 자동으로 들어가요.</small></div>'+
    '</div>'+
    '<span class="lbl">언제까지의 날짜를 물어볼까</span><div class="seg" id="lk-days">'+[[7,'1주'],[14,'2주'],[21,'3주']].map(function(x){return '<button data-act="lk-days" data-v="'+x[0]+'" class="'+(x[0]===14?'on':'')+'">'+x[1]+'</button>';}).join('')+'</div>'+
    '<span class="lbl">응답은 언제까지 받을까</span><input class="fld" id="f-lk-deadline" type="datetime-local" value="'+linkDeadlineDefault()+'">'+
    '<p class="hint">이 시간이 지나면 친구는 더 이상 답을 보내거나 수정할 수 없어요.</p>'+
    '<span class="lbl">몇 시부터 몇 시까지 물어볼까</span><div class="row" style="margin-bottom:10px;align-items:center">'+meetAvailSelHTML('f-lk-time-start',meetAvail()[0],0,23)+'<span style="flex:none;color:var(--sub)">~</span>'+meetAvailSelHTML('f-lk-time-end',meetAvail()[1],1,24)+'</div>'+
    '<p class="hint">이 링크에서만 쓰는 시간 범위예요. 기본값은 내 약속 가능 시간이고, 여기서 따로 바꿀 수 있어요.</p>'+
    '<p class="hint" id="lk-msg"></p><div class="acts"><button class="b-ghost" data-act="close">닫기</button><button class="b-save" data-act="lk-create">링크 만들기</button></div>');
}
function createLink(){
  var sb=friendDb();if(!sb)return;
  var info=ppInfo(M.pp),msg=$('#lk-msg');
  if(M.pp.mode!=='undecided'&&!info){if(msg)msg.textContent='장소를 고르거나 “미정”을 눌러주세요';return;}
  var what=$('#f-lkwhat').value.trim(),days=M.days||14,av=meetAvail(),busy={},t=new Date(),
      linkStart=+($('#f-lk-time-start')&&$('#f-lk-time-start').value),
      linkEnd=+($('#f-lk-time-end')&&$('#f-lk-time-end').value),
      responseDeadline=($('#f-lk-deadline')&&$('#f-lk-deadline').value)||'',
      placeRecommend=!!($('#f-lk-place-reco')&&$('#f-lk-place-reco').checked),
      expectedPeople=Math.max(2,Math.min(30,+($('#f-lk-expected')&&$('#f-lk-expected').value)||2)),
      inviteeNames=((($('#f-lk-invitees')&&$('#f-lk-invitees').value)||'').split(',').map(function(x){return x.trim();}).filter(Boolean)).slice(0,29),
      ownerStation=($('#f-lk-origin')&&$('#f-lk-origin').value)||S.settings.homeStation||'';
  if(!Number.isFinite(linkStart))linkStart=av[0];if(!Number.isFinite(linkEnd))linkEnd=av[1];
  if(linkEnd<=linkStart){if(msg)msg.textContent='끝나는 시간은 시작 시간보다 뒤로 정해주세요';return;}
  if(responseDeadline){var rd=new Date(responseDeadline).getTime();if(!isFinite(rd)||rd<=Date.now()){if(msg)msg.textContent='응답 마감은 지금보다 뒤로 정해주세요';return;}}
  av=[linkStart,linkEnd];
  for(var i=0;i<days;i++){var k=dkey(addDays(t,i)),b=myBusyOn(k);if(b.allday)busy[k]='a';else if(b.r.length)busy[k]=b.r.map(function(r){return [r[0],r[1]];});}
  var payload={v:1,ownerName:myDisplayName(),ownerPhoto:S.settings.profilePhoto||'',what:what,place:placeInfoText(info),placeInfo:info,from:dkey(t),days:days,lo:av[0]*60,hi:av[1]*60,busy:busy,responseDeadline:responseDeadline,placeRecommend:placeRecommend,expectedPeople:expectedPeople,inviteeNames:inviteeNames,ownerStation:ownerStation};
  if(msg)msg.textContent='만드는 중…';
  sb.from('planner_meet_links').insert({owner_id:Sync.uid,payload:payload,status:'open'}).select().single().then(function(r){
    if(r.error)throw r.error;LinkSync.links.unshift(r.data);LinkSync.answers[r.data.token]=[];openLinkShare(r.data.token,true);
  }).catch(function(e){if(msg)msg.textContent=userMsg('링크를 만들지 못했어요. 잠시 뒤 다시 해주세요.',(/does not exist|schema cache|Could not find/i.test(e&&e.message||'')?'Supabase에서 planner-friends.sql을 한 번 더 실행해주세요. ':'링크를 만들지 못했어요. ')+'('+(e&&e.message||'')+')');});
}
function linkShareText(l){var p=l.payload||{},dl=p.responseDeadline?' · '+linkDeadlineText(p.responseDeadline)+'까지 응답':'';return (p.ownerName||'친구')+'님이 '+(p.what?'“'+p.what+'” ':'약속 ')+'시간을 물어봐요!'+dl+' · 되는 시간 눌러줘 → '+linkUrl(l.token);}
function openLinkShare(t,fresh){
  var l=LinkSync.links.find(function(x){return x.token===t;});if(!l)return;
  M={type:'link-share',token:t};
  openModal('<h3>'+(fresh?'링크가 만들어졌어요':'링크 공유')+'</h3><p class="hint">카톡방에 보내면 앱이 없어도 링크만 열어서 되는 시간을 골라요. 여러 명한테 같은 링크를 보내도 돼요.</p><div class="codebox" style="display:block"><small>약속 링크</small><span class="lk-url">'+esc(linkUrl(t))+'</span></div>'+
    '<div class="acts"><button class="b-ghost" data-act="lk-copy" data-id="'+t+'">복사</button>'+(navigator.share?'<button class="b-save" data-act="lk-share" data-id="'+t+'">공유하기</button>':'<button class="b-save" data-act="lk-detail" data-id="'+t+'">답 확인하기</button>')+'</div>'+
    (navigator.share?'<button class="tbtn" style="width:100%;margin-top:8px" data-act="lk-detail" data-id="'+t+'">답 확인하기</button>':'')+'<p class="hint" id="lk-msg"></p>');
}
function linkLoad(){
  var sb=friendDb();if(!sb)return Promise.resolve();
  return sb.from('planner_meet_links').select('token,payload,status,final,created_at').eq('owner_id',Sync.uid).order('created_at',{ascending:false}).limit(30).then(function(r){
    if(r.error)throw r.error;LinkSync.links=r.data||[];var ts=LinkSync.links.map(function(x){return x.token;});
    if(!ts.length){LinkSync.answers={};return;}
    return sb.from('planner_meet_answers').select('id,token,name,slots,created_at').in('token',ts).then(function(a){if(a.error)throw a.error;var m={};(a.data||[]).forEach(function(x){(m[x.token]=m[x.token]||[]).push(x);});LinkSync.answers=m;});
  }).then(function(){
    LinkSync.loaded=true;LinkSync.error='';
    if(!S.settings.linkSeen)S.settings.linkSeen={};var seen=S.settings.linkSeen,first=!LinkSync.ready,ch=false;
    Object.keys(LinkSync.answers).forEach(function(t){var l=LinkSync.links.find(function(x){return x.token===t;});(LinkSync.answers[t]||[]).forEach(function(a){var sig=a.id+':'+(a.slots||[]).length;if(seen[a.id]===sig)return;var isNew=!seen[a.id];seen[a.id]=sig;ch=true;if(first&&!l)return;if(l&&l.status==='open'){var tx=(a.name||'친구')+'님이 '+((l.payload||{}).what?'“'+l.payload.what+'” ':'링크 약속에 ')+(isNew?'되는 시간을 보냈어요':'시간을 고쳤어요');pushNotice('friend',tx);if(document.hidden)sysNotify('링크 약속',tx,'lk:'+a.id);else if(M.type!=='notices')inAppToast(tx);}});});
    LinkSync.ready=true;if(ch)save();linkDeadlineNudge();
    if(M.type==='link-detail')drawLinkDetail();else if(M.type==='link-list')openLinkList();
  }).catch(function(e){LinkSync.error=e&&e.message||'';});
}
function openLinkList(){
  M={type:'link-list'};
  var rows=LinkSync.links.map(function(l){var p=l.payload||{},an=LinkSync.answers[l.token]||[],n=an.length,f=l.final,ua=linkUnanswered(p,an);return '<button class="setrow lk-row" data-act="lk-detail" data-id="'+l.token+'"><span>'+esc(p.what||'약속')+(p.place?' · '+esc(p.place):'')+'<small>'+(l.status==='open'?esc((n?n+'명 답함':'아직 답이 없어요')+(ua.length?' · '+ua.length+'명 미응답':'')+(p.responseDeadline?' · 응답 '+linkDeadlineText(p.responseDeadline)+'까지':'')+(linkDeadlinePassed(p)?' · 마감됨':' · 누르면 겹치는 시간을 봐요')):'확정 · '+esc(f&&f.date?slotText(f.date,toMin(f.start),toMin(f.end)):''))+'</small></span><span class="chev">›</span></button>';}).join('');
  openModal('<h3>링크 약속</h3>'+(rows||'<div class="empty">아직 만든 링크가 없어요.</div>')+'<div class="acts"><button class="b-ghost" data-act="close">닫기</button><button class="b-save" data-act="lk-new">새 링크 만들기</button></div>');
}
function openLinkDetail(t){M={type:'link-detail',token:t,week:0,sel:null,tap:null};drawLinkDetail();linkLoad();}
function drawLinkDetail(){
  var l=LinkSync.links.find(function(x){return x.token===M.token;});if(!l){closeModal();return;}
  var p=l.payload||{},ans=LinkSync.answers[l.token]||[],sc=document.querySelector('#lk-grid .meetgrid'),top=sc?sc.scrollTop:0;
  if(l.status!=='open'){var f=l.final||{};openModal('<h3>'+esc(p.what||'약속')+'</h3><div class="requestbox"><b>확정된 약속</b><small>'+esc([f.date?slotText(f.date,toMin(f.start),toMin(f.end)):'',f.place||'장소 미정',(f.names||[]).join(', ')].filter(Boolean).join(' · '))+'</small></div><p class="hint">링크를 연 사람들도 확정된 시간을 볼 수 있어요.</p><div class="acts"><button class="b-del" data-act="lk-delete" data-id="'+l.token+'">링크 삭제</button><button class="b-ghost" data-act="lk-copy" data-id="'+l.token+'">링크 복사</button><button class="b-save" data-act="close">닫기</button></div>');return;}
  var best=linkBestRuns(p,ans),cw=linkCounts(ans),tapWho=M.tap?(cw.who[M.tap]||[]):null,s=M.sel,ua=linkUnanswered(p,ans),named=linkInviteeNames(p);
  openModal('<h3>'+esc(p.what||'링크 약속')+'</h3><p class="hint">'+(p.responseDeadline?'응답 마감 '+esc(linkDeadlineText(p.responseDeadline))+(linkDeadlinePassed(p)?' · 마감됨':'')+'<br>':'')+(ans.length?((ans.length+1)+'/'+Math.max(+p.expectedPeople||0,ans.length+1)+'명 입력 완료 · '+esc(ans.map(function(a){return a.name;}).join(', '))):('1/'+Math.max(+p.expectedPeople||2,2)+'명 입력 완료 · 아직 친구 답이 없어요.'))+(ua.length?'<br><b style="color:var(--now)">'+esc(named.length?('미응답 · '+ua.join(', ')):(ua.length+'명 아직 미응답'))+'</b>':'')+'</p>'+
    (best.length?'<div class="meetsug"><span>플래너 추천 후보</span><div class="meetsug-row">'+best.map(function(x){var on=s&&s.date===x.date&&s.s===x.s&&s.e===x.e;return '<button class="sugchip'+(on?' on':'')+'" data-act="lk-best" data-k="'+x.date+'" data-s="'+x.s+'" data-e="'+x.e+'"><b>'+esc(x.label||'추천')+'</b> · '+esc(slotText(x.date,x.s,x.e))+'<small style="display:block;margin-top:2px">'+esc(x.why||'')+'</small></button>';}).join('')+'</div></div>':'')+
    linkPlaceRecoHTML(p,ans)+'<div id="lk-grid">'+linkGridHTML(p,ans,{mode:'owner',week:M.week,sel:s})+'</div>'+
    '<p class="hint" id="lk-sel">'+(tapWho?esc(slotText(M.tap.split('|')[0],+M.tap.split('|')[1],+M.tap.split('|')[1]+30))+' 가능 · '+(tapWho.length?esc(tapWho.join(', ')):'아무도 없어요')+'<br>':'')+(s?'고른 시간 · '+esc(slotText(s.date,s.s,s.e))+(s.step===1?' · 한 번 더 누르면 끝 시간':''):'칸을 눌러 누가 되는지 보고, 시작·끝을 골라 확정해요')+'</p>'+
    '<div class="acts"><button class="b-ghost" data-act="lk-copy" data-id="'+l.token+'">링크 복사</button><button class="b-save" data-act="lk-confirm"'+(s&&s.step===2?'':' disabled')+'>이 시간으로 확정</button></div>'+
    '<button class="tbtn" style="width:100%;margin-top:8px;color:var(--now)" data-act="lk-delete" data-id="'+l.token+'">링크 삭제</button>');
  var g=document.querySelector('#lk-grid .meetgrid');if(g)g.scrollTop=top;
}
function linkOwnerTap(k,m){
  var s=M.sel;M.tap=k+'|'+m;
  if(s&&s.step===1&&s.date===k&&m>=s.s)M.sel={date:k,s:s.s,e:m+30,step:2};else M.sel={date:k,s:m,e:m+30,step:1};
  drawLinkDetail();
}
function confirmLink(){
  var sb=friendDb(),l=LinkSync.links.find(function(x){return x.token===M.token;}),s=M.sel;if(!sb||!l||!s||s.step!==2)return;
  var p=l.payload||{},ans=LinkSync.answers[l.token]||[],names=ans.filter(function(a){for(var m=s.s;m<s.e;m+=30)if(linkRealSlots(a).indexOf(s.date+'|'+m)<0)return false;return true;}).map(function(a){return a.name;});
  if(!names.length)names=ans.map(function(a){return a.name;});
  var f={date:s.date,start:hm(s.s),end:hm(Math.min(s.e,1439)),what:p.what||'',place:p.place||'',placeInfo:p.placeInfo||null,names:names};
  sb.from('planner_meet_links').update({status:'closed',final:f,updated_at:new Date().toISOString()}).eq('token',l.token).then(function(r){
    if(r.error)throw r.error;l.status='closed';l.final=f;
    S.events.push({id:uid(),kind:'appointment',title:f.what||names.join(', ')||'약속',what:f.what,person:names.join(', '),place:f.place,placeInfo:f.placeInfo,date:f.date,start:f.start,end:f.end,color:defCol(),linkToken:l.token});
    save();closeModal();U.date=parseKey(f.date);render();inAppToast('확정했어요. 내 캘린더에 넣었고, 링크를 연 사람들도 확정 시간을 봐요');
  }).catch(function(){var e=$('#lk-sel');if(e)e.textContent='확정하지 못했어요. 잠시 뒤 다시 해주세요';});
}
function deleteLink(t){var sb=friendDb();if(!sb)return;sb.from('planner_meet_links').delete().eq('token',t).then(function(r){if(r.error)throw r.error;LinkSync.links=LinkSync.links.filter(function(x){return x.token!==t;});delete LinkSync.answers[t];openLinkList();}).catch(function(){inAppToast('삭제하지 못했어요');});}
function copyLink(t){var l=LinkSync.links.find(function(x){return x.token===t;});if(!l)return;copyTextSafe(linkShareText(l),function(){inAppToast('링크를 복사했어요. 카톡에 붙여넣어요');},function(){var m=$('#lk-msg');if(m)m.textContent=linkUrl(t);});}
function shareLink(t){var l=LinkSync.links.find(function(x){return x.token===t;});if(!l)return;try{navigator.share({title:'약속 시간 고르기',text:linkShareText(l).replace(linkUrl(t),'').trim(),url:linkUrl(t)}).catch(function(){});}catch(e){copyLink(t);}}
function linkOpenAnswersCount(){return LinkSync.links.filter(function(l){return l.status==='open'&&(LinkSync.answers[l.token]||[]).length;}).length;}
/* ----- 받는 쪽 (링크를 연 사람, 로그인 필요 없음) ----- */
function guestKey(t){return 'planner.meet.'+t;}
function guestSaved(t){try{return JSON.parse(lsGet(guestKey(t))||'null');}catch(e){return null;}}
function guestLoad(){
  var G=U.guest;if(!G)return;
  if(!Sync.sb||!Sync.sb.rpc){G.state='error';G.msg='연결 도구를 불러오지 못했어요. 인터넷을 확인하고 새로고침해주세요.';render();return;}
  Sync.sb.rpc('planner_meet_get',{t:G.token}).then(function(r){
    if(r.error)throw r.error;if(!r.data){G.state='error';G.msg='링크가 삭제됐거나 주소가 잘못됐어요.';render();return;}
    G.link=r.data;G.answers=r.data.answers||[];var sv=guestSaved(G.token);
    if(G.state==='loading'){G.mine={};if(sv){G.aid=sv.id;G.sec=sv.secret;G.name=sv.name||'';G.origin=sv.origin||'';(sv.slots||[]).forEach(function(s){if(s.indexOf('@')!==0)G.mine[s]=1;});}if(!G.name)G.name=(S.settings.profileName||'').trim();if(!G.origin)G.origin=S.settings.homeStation||'';}
    G.state='ready';render();if(G.link&&G.link.status!=='open'&&Sync.uid&&G.aid)setTimeout(guestAutoAddConfirmed,0);
  }).catch(function(e){G.state='error';G.msg=/does not exist|Could not find/i.test(e&&e.message||'')?'링크 약속 기능이 아직 서버에 설정되지 않았어요. 링크를 보낸 친구에게 알려주세요.':'링크를 불러오지 못했어요. 잠시 뒤 새로고침해주세요.';render();});
}
function gcalUrl(f,p){var d=f.date.replace(/-/g,''),a=f.start.replace(':','')+'00',b=(f.end||f.start).replace(':','')+'00';return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(f.what||((p.ownerName||'친구')+'님과 약속'))+'&dates='+d+'T'+a+'/'+d+'T'+b+'&ctz=Asia/Seoul'+(f.place?'&location='+encodeURIComponent(f.place):'');}
function guestAutoAddConfirmed(){
  var G=U.guest;if(!G||!G.link||G.link.status==='open'||!Sync.uid||!G.aid)return false;var f=G.link.final||{},p=G.link.payload||{};if(!f.date)return false;
  if((S.events||[]).some(function(e){return e.linkToken===G.token;}))return false;
  S.events.push({id:uid(),kind:'appointment',title:f.what||p.what||'약속',what:f.what||p.what||'',person:(f.names||[]).join(', '),place:f.place||'',placeInfo:f.placeInfo||null,date:f.date,start:f.start,end:f.end,color:defCol(),linkToken:G.token});save();inAppToast('확정된 약속을 내 플래너에 자동으로 넣었어요');return true;
}
function guestHTML(){
  var G=U.guest;
  if(G.state==='loading')return '<div class="note">약속 링크를 불러오는 중…</div>';
  if(G.state==='error')return '<section class="card"><div class="card-h"><h3>링크를 열 수 없어요</h3></div><p class="hint">'+esc(G.msg||'')+'</p><button class="b-save lk-full" data-act="lk-leave">플래너 열기</button></section>';
  var L=G.link,p=L.payload||{},who=p.ownerName||'친구',ans=G.answers||[];
  var expected=Math.max(+p.expectedPeople||0,ans.length+1),answered=ans.length+1;
  var head='<section class="card lk-head"><div class="meet-head">'+friendAvatar(who,p.ownerPhoto,'lg')+'<div><b class="meet-days-big">'+esc(who)+'님이 약속 시간을 물어봐요</b><span class="meet-days">'+esc([p.what||'약속',p.place||'장소는 같이 정해요'].join(' · '))+'</span></div></div>'+
    '<p class="hint" style="margin:0">'+answered+'/'+expected+'명 입력 완료'+(p.responseDeadline?' · 응답 '+esc(linkDeadlineText(p.responseDeadline))+'까지':'')+(ans.length?' · '+esc(ans.map(function(a){return a.name;}).join(', ')):'')+'</p><div class="input-progress"><i style="width:'+Math.min(100,Math.round(answered/expected*100))+'%"></i></div></section>';
  if(L.status!=='open'){var f=L.final||{};
    return head+'<section class="card"><div class="card-h"><h3>약속이 정해졌어요</h3></div><div class="requestbox"><b>'+esc(f.date?slotText(f.date,toMin(f.start),toMin(f.end)):'')+'</b><small>'+esc([f.place||'장소 미정',(f.names||[]).length?'함께 · '+f.names.join(', '):''].filter(Boolean).join(' · '))+'</small></div>'+
      '<div class="acts"><a class="b-ghost lk-a" href="'+esc(gcalUrl(f,p))+'" target="_blank" rel="noopener">구글 캘린더에 추가</a><button class="b-save" data-act="lk-add-mine">내 플래너에 넣기</button></div></section>'+guestCtaHTML();}
  if(linkDeadlinePassed(p))return head+'<section class="card"><div class="card-h"><h3>응답이 마감됐어요</h3></div><p class="hint">'+esc(linkDeadlineText(p.responseDeadline))+'까지 받는 약속이었어요. 이제 새 답을 보내거나 수정할 수 없어요.</p></section>'+guestCtaHTML();
  var cnt=Object.keys(G.mine||{}).length;
  return head+'<section class="card"><span class="lbl">내 이름</span><input class="fld" id="lk-name" maxlength="20" placeholder="친구들이 알아볼 이름" value="'+esc(G.name||'')+'">'+
    (p.placeRecommend?'<span class="lbl">어디서 출발해?</span><select class="fld" id="lk-origin">'+plannerMeetPointOptions(G.origin||'')+'</select><div class="geo-row"><button class="tbtn" data-act="guest-current">현재 위치에서 찾기</button><small id="guest-geo-msg">좌표는 저장하지 않고 가까운 교통 거점만 사용해요.</small></div>':'')+
    '<span class="lbl">되는 시간을 모두 눌러줘</span><p class="hint">회색은 '+esc(who)+'님이 안 되는 시간이라 못 골라요. 다시 누르면 빠져요.</p><div id="lk-grid">'+linkGridHTML(p,ans,{mode:'guest',week:G.week||0,mine:G.mine,skipId:G.aid})+'</div>'+
    '<p class="hint" id="lk-gmsg">'+(G.sent?'보냈어요! '+esc(who)+'님이 시간을 정하면 이 링크에서 바로 볼 수 있어요. 고치고 싶으면 다시 눌러서 보내요.':cnt?cnt+'칸 골랐어요 ('+(cnt*30>=60?Math.floor(cnt*30/60)+'시간 ':'')+(cnt*30%60?'30분':'')+')':'')+'</p>'+
    '<button class="b-save lk-full" data-act="lk-send">'+(G.aid?'고쳐서 다시 보내기':'보내기')+'</button></section>'+guestCtaHTML();
}
function guestCtaHTML(){return '<section class="card lk-cta"><b>나도 이 플래너 써볼래?</b><p class="hint">친구 시간표를 보고 빈 시간에 약속을 잡으면, 만난 곳이 추억으로 쌓여요.</p><button class="b-ghost lk-full" data-act="lk-leave">플래너 열어보기</button></section>';}
function guestDrawGrid(){var G=U.guest,box=$('#lk-grid');if(!box||!G||!G.link)return;var g=box.querySelector('.meetgrid'),top=g?g.scrollTop:0;box.innerHTML=linkGridHTML(G.link.payload||{},G.answers,{mode:'guest',week:G.week||0,mine:G.mine,skipId:G.aid});var g2=box.querySelector('.meetgrid');if(g2)g2.scrollTop=top;var cnt=Object.keys(G.mine).length,m=$('#lk-gmsg');if(m&&!G.sent)m.textContent=cnt?cnt+'칸 골랐어요':'';}
function guestSend(){
  var G=U.guest;if(G&&G.link&&linkDeadlinePassed(G.link.payload||{})){var mm=$('#lk-gmsg');if(mm)mm.textContent='응답 마감 시간이 지나서 더 이상 보낼 수 없어요';return;}
  var nm=$('#lk-name'),name=nm?nm.value.trim():'',m=$('#lk-gmsg'),slots=Object.keys(G.mine||{}),
      p=(G.link&&G.link.payload)||{},origin=($('#lk-origin')&&$('#lk-origin').value)||G.origin||'';
  if(!name){if(nm){nm.classList.add('bad');nm.focus();}if(m)m.textContent='이름을 먼저 적어줘';return;}
  if(p.placeRecommend&&!origin){if(m)m.textContent='출발 지역이나 역을 입력해줘';return;}if(!slots.length){if(m)m.textContent='되는 시간을 한 칸 이상 눌러줘';return;}G.origin=origin;var sendSlots=linkMetaSlots(slots,origin);
  G.name=name;if(m)m.textContent='보내는 중…';
  Sync.sb.rpc('planner_meet_answer',{t:G.token,n:name,s:sendSlots,aid:G.aid||null,sec:G.sec||null}).then(function(r){
    if(r.error)throw r.error;var d=r.data||{};G.aid=d.id;G.sec=d.secret;lsSet(guestKey(G.token),JSON.stringify({id:d.id,secret:d.secret,name:name,slots:slots,origin:origin}));G.sent=true;guestLoad();
  }).catch(function(e){if(m)m.textContent=/closed/i.test(e&&e.message||'')?'이미 시간이 정해진 약속이에요. 새로고침해서 확인해줘':'보내지 못했어요. 잠시 뒤 다시 눌러줘';});
}
function guestAddMine(){
  var G=U.guest,L=G&&G.link,f=L&&L.final,p=L&&L.payload||{};if(!f)return;
  if(S.events.some(function(e){return e.linkToken===G.token;})){inAppToast('이미 내 플래너에 있어요');return;}
  S.events.push({id:uid(),kind:'appointment',title:f.what||'약속',what:f.what||'',person:p.ownerName||'',place:f.place||'',placeInfo:f.placeInfo||null,date:f.date,start:f.start,end:f.end,color:defCol(),linkToken:G.token});
  save();inAppToast('내 플래너에 넣었어요');guestLeave(parseKey(f.date));
}
function guestLeave(d){U.guest=null;try{history.replaceState(null,'',location.pathname+location.search);}catch(e){location.hash='';}$('#nav').style.display='';if(d){U.date=d;U.tab='day';}render(true);}
function renderGuest(){
  $('#top').classList.remove('navtop');$('#top').innerHTML='<div class="ttl"><h1>약속 시간 고르기</h1><small>로그인 없이 바로 골라요</small></div>';
  $('#nav').style.display='none';$('#app').classList.remove('wide');
  var ae=document.activeElement,keep=ae&&ae.id==='lk-name'?ae.value:null;if(U.guest){var go=$('#lk-origin');if(go)U.guest.origin=go.value;}
  $('#main').innerHTML=guestHTML();
  if(keep!=null&&$('#lk-name')){$('#lk-name').value=keep;}
}
/* ----- 추억 사진 ----- */
function shrinkTo(file,max,q,cb){var fr=new FileReader();fr.onload=function(){var img=new Image();img.onload=function(){var w=img.width,h=img.height,r=Math.min(1,max/Math.max(w,h)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*r));c.height=Math.max(1,Math.round(h*r));c.getContext('2d').drawImage(img,0,0,c.width,c.height);try{cb(c.toDataURL('image/jpeg',q));}catch(e){cb(null);}};img.onerror=function(){cb(null);};img.src=fr.result;};fr.onerror=function(){cb(null);};fr.readAsDataURL(file);}
function setMemoryPhoto(file,memId){
  shrinkTo(file,900,0.72,function(url){
    if(!url){inAppToast('사진을 읽지 못했어요');return;}
    if(!memId){M.mphoto=url;drawFriendMemories();return;}
    var row=(FriendSync.memories||[]).find(function(x){return x.id===memId;}),sb=friendDb();
    if(!row||!sb){var lr=(S.settings.friendMemories||[]).find(function(x){return x.id===memId;});if(lr){lr.photo=url;save();drawFriendMemories();}return;}
    sb.from('planner_friend_memories').update({photo:url}).eq('id',memId).then(function(r){if(r.error)throw r.error;row.photo=url;drawFriendMemories();inAppToast('사진을 넣었어요');}).catch(function(e){inAppToast(userMsg('사진을 저장하지 못했어요. 잠시 뒤 다시 해주세요',/photo|column/i.test(e&&e.message||'')?'사진 저장 서버 설정이 필요해요. 최신 production migration을 적용해주세요':(e&&e.message)));});
  });
}
/* ----- 우리 추억 리포트 (인스타 스토리용 이미지) ----- */
function reportRange(period){
  var tk=dkey(new Date()),y=+tk.slice(0,4);
  if(period==='year')return {from:y+'-01-01',to:y+'-12-31',label:y+'년'};
  if(period==='all')return {from:'0000',to:'9999',label:'지금까지'};
  var s=semOf(tk);return s.t===1?{from:s.y+'-03-01',to:s.y+'-08-31',label:semTxt(s)}:{from:s.y+'-09-01',to:(s.y+1)+'-02-31',label:semTxt(s)};
}
function reportData(fid,period){
  var R=reportRange(period),inR=function(k){return k&&k>=R.from&&k<=R.to;};
  var mem=friendMemoryRows(fid).filter(function(x){return inR(x.visited_at||String(x.created_at||'').slice(0,10));});
  var days={};mem.forEach(function(x){days[x.visited_at||String(x.created_at).slice(0,10)]=1;});sharedMetDates(fid).forEach(function(k){if(inR(k))days[k]=1;});
  var cnt={};mem.forEach(function(x){var k=memoryKey(x);if(k)cnt[k]=(cnt[k]||0)+1;});
  var top=Object.keys(cnt).sort(function(a,b){return cnt[b]-cnt[a];}).slice(0,3).map(function(k){return {k:k,n:cnt[k]};});
  var ds=Object.keys(days).sort();
  return {range:R,mem:mem,met:ds.length,top:top,first:ds[0]||'',last:ds[ds.length-1]||'',photos:mem.filter(function(x){return x.photo;}).slice(0,4).map(function(x){return x.photo;})};
}
function drawReport(fid,period,cb){
  var f=FriendSync.friends.find(function(x){return x.id===fid;}),D=reportData(fid,period),W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;var g=c.getContext('2d');
  var FONT='-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR",sans-serif',base=S.settings.defColor||'#dce9f7';
  var rr=function(x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();};
  var txt=function(t,x,y,size,weight,color,align){g.font=(weight||500)+' '+size+'px '+FONT;g.fillStyle=color||'#1c1c1e';g.textAlign=align||'left';g.fillText(t,x,y);};
  var imgs=D.photos.map(function(src){return new Promise(function(res){var i=new Image();i.onload=function(){res(i);};i.onerror=function(){res(null);};i.src=src;});});
  Promise.all(imgs).then(function(ph){
    ph=ph.filter(Boolean);
    g.fillStyle=base;g.fillRect(0,0,W,H);
    g.fillStyle='rgba(255,255,255,.55)';for(var yy=30;yy<H;yy+=60)for(var xx=((yy/60)%2?30:60);xx<W;xx+=60){g.beginPath();g.arc(xx,yy,4,0,7);g.fill();}
    g.fillStyle='#ffffff';rr(60,60,W-120,H-120,48);g.fill();
    var me=(S.settings.profileName||'').trim()||'나',you=friendLabel(f);
    txt(D.range.label+' 우리 기록',110,160,38,600,'#8e8e93');
    txt(me+' × '+you,110,245,76,800);
    var bx=[['만난 날',D.met+'번'],['추억',D.mem.length+'개'],['제일 자주 간 곳',D.top[0]?D.top[0].k:'-']];
    bx.forEach(function(b,i){var x=110+i*292,w=270;g.fillStyle=i===2?base:'#f4f4f6';rr(x,300,w,190,32);g.fill();txt(b[0],x+28,354,30,600,'#6e6e73');var v=b[1];var sz=v.length>6?40:58;txt(v,x+28,448,sz,800);});
    var py=540,ph_h=D.top.length>1?420:500;
    if(ph.length){var n=ph.length,gw=W-220,cols=n===1?1:2,rows=n>2?2:1,cw=(gw-(cols-1)*16)/cols,chh=(ph_h-(rows-1)*16)/rows;
      ph.forEach(function(im,i){var cx=110+(i%cols)*(cw+16),cy=py+Math.floor(i/cols)*(chh+16),s=Math.max(cw/im.width,chh/im.height),sw=cw/s,sh=chh/s;g.save();rr(cx,cy,cw,chh,26);g.clip();g.drawImage(im,(im.width-sw)/2,(im.height-sh)/2,sw,sh,cx,cy,cw,chh);g.restore();});}
    else{g.setLineDash([14,12]);g.strokeStyle='#c7c7cc';g.lineWidth=4;rr(110,py,W-220,ph_h,32);g.stroke();g.setLineDash([]);txt('추억에 사진을 남기면 여기에 모여요',W/2,py+ph_h/2+12,34,600,'#8e8e93','center');}
    var ly=py+ph_h+80;
    if(D.top.length>1){txt('많이 간 곳',110,ly,32,700,'#6e6e73');txt(D.top.map(function(x){return x.k+' '+x.n+'번';}).join('   '),110,ly+56,42,800);ly+=130;}
    if(D.first)txt('처음 '+mdTxt(parseKey(D.first)).replace('\u00a0',' ')+(D.last&&D.last!==D.first?'  ·  최근 '+mdTxt(parseKey(D.last)).replace('\u00a0',' '):''),110,Math.min(ly,H-150),34,600,'#3a3a3c');
    txt('내 플래너',W-110,H-100,28,700,'#aeaeb2','right');
    cb(c,D);
  });
}
function openMemoryReport(fid,period){
  period=period||'sem';M={type:'memory-report',friendId:fid,period:period};
  var D=reportData(fid,period),seg='<div class="seg">'+[['sem','이번 학기'],['year','올해'],['all','전체']].map(function(x){return '<button data-act="report-period" data-v="'+x[0]+'" class="'+(x[0]===period?'on':'')+'">'+x[1]+'</button>';}).join('')+'</div>';
  if(!D.mem.length&&!D.met){openModal('<h3>우리 추억 리포트</h3>'+seg+'<div class="empty">'+esc(D.range.label)+'에는 아직 기록이 없어요. 만나고 “웅” 하거나 추억을 남기면 리포트가 만들어져요.</div><div class="acts"><button class="b-save" data-act="friend-memories" data-id="'+esc(fid)+'">추억으로 돌아가기</button></div>');return;}
  openModal('<h3>우리 추억 리포트</h3>'+seg+'<div class="report-box"><div class="note">만드는 중…</div></div><div class="acts"><button class="b-ghost" data-act="friend-memories" data-id="'+esc(fid)+'">돌아가기</button><button class="b-save" data-act="report-save">이미지 저장·공유</button></div>');
  drawReport(fid,period,function(c){if(M.type!=='memory-report'||M.period!==period)return;M.canvas=c;var b=$('.report-box');if(b)b.innerHTML='<img src="'+c.toDataURL('image/png')+'" alt="우리 추억 리포트">';});
}
function saveReport(){
  var c=M.canvas;if(!c)return;
  c.toBlob(function(bl){if(!bl)return;var name='우리기록.png';
    try{var file=new File([bl],name,{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[file]})){navigator.share({files:[file],title:'우리 추억 리포트'}).catch(function(){});return;}}catch(e){}
    var u=URL.createObjectURL(bl),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u);},4000);inAppToast('이미지를 저장했어요');
  },'image/png');
}

function eyeSVG(open){return open?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18"/><path d="M10.6 5.9A10.4 10.4 0 0 1 12 5.8c6.2 0 9.5 6.2 9.5 6.2a17 17 0 0 1-3.4 3.9M6.6 6.8C4.1 8.2 2.5 12 2.5 12s3.3 6 9.5 6c1.4 0 2.7-.3 3.8-.8"/></svg>'}
function friendDb(){return !Sync.deleting&&Sync.kind==='supa'&&Sync.sb&&Sync.uid?Sync.sb:null;}
function makeFriendCode(){var out='';for(var i=0;i<8;i++)out+=FRIEND_CODE_ALPH[Math.floor(Math.random()*FRIEND_CODE_ALPH.length)];return out;}
function storedFriendCode(){return Sync.uid?lsGet('planner.friendCode.'+Sync.uid)||'':'';}
function friendPinIndex(id){var a=(S.settings&&Array.isArray(S.settings.pinnedFriends))?S.settings.pinnedFriends:[];return a.indexOf(id);}
function sortedFriends(){
  return FriendSync.friends.slice().sort(function(a,b){
    var ai=friendPinIndex(a.id),bi=friendPinIndex(b.id),ap=ai>=0,bp=bi>=0;
    if(ap!==bp)return ap?-1:1;
    if(ap&&ai!==bi)return ai-bi;
    return friendLabel(a).localeCompare(friendLabel(b),'ko');
  });
}
function friendLabel(f){return f&&((f.name&&f.name.trim())||f.code)||'친구';}
function friendCodeSelf(sb){
  return sb.from('planner_friend_codes').select('code,display_name').eq('user_id',Sync.uid).maybeSingle().then(function(r){
    if(r.error&&/display_name|column|schema cache/i.test(r.error.message||''))return sb.from('planner_friend_codes').select('code').eq('user_id',Sync.uid).maybeSingle();
    return r;
  });
}
function friendCodeList(sb,ids){
  var tries=['user_id,code,display_name,photo','user_id,code,display_name','user_id,code'];
  var go=function(i){return sb.from('planner_friend_codes').select(tries[i]).in('user_id',ids).then(function(r){
    if(r.error&&i<tries.length-1&&/display_name|photo|column|schema cache/i.test(r.error.message||''))return go(i+1);
    return r;
  });};
  return go(0);
}
function toggleFriendPin(id){
  if(!S.settings.pinnedFriends||!Array.isArray(S.settings.pinnedFriends))S.settings.pinnedFriends=[];
  var i=S.settings.pinnedFriends.indexOf(id);
  if(i>=0)S.settings.pinnedFriends.splice(i,1);else S.settings.pinnedFriends.unshift(id);
  save();render();
}
function payloadClsActive(c,k,p){
  var a=c.from||(p&&p.semStart)||'',b=c.to||(p&&p.semEnd)||'';
  return (!a||k>=a)&&(!b||k<=b);
}
function friendTimetableHTML(p){
  var tk=dkey(new Date()),cs=(p.classes||[]).filter(function(c){return c.start&&c.end&&c.day!=null&&payloadClsActive(c,tk,p);});
  if(!cs.length)return '<span class="lbl">수업 시간표</span><div class="empty">등록된 수업 시간표가 없어요.</div>';
  var lo=Math.floor(Math.min.apply(null,cs.map(function(c){return toMin(c.start);}))/60)*60,hi=Math.ceil(Math.max.apply(null,cs.map(function(c){return toMin(c.end);}))/60)*60;
  var nd=cs.some(function(c){return c.day>=5;})?7:5,PX=0.5,H=(hi-lo)*PX;
  var h='<div class="ftt" style="grid-template-columns:22px repeat('+nd+',minmax(0,1fr))"><span></span>';
  for(var i=0;i<nd;i++)h+='<span class="fh">'+DAYS[i]+'</span>';
  var tm='<div class="ftm" style="height:'+H+'px">';for(var m=lo;m<hi;m+=60)tm+='<span style="top:'+((m-lo)*PX)+'px">'+(m/60)+'</span>';h+=tm+'</div>';
  for(var d=0;d<nd;d++){h+='<div class="fcol" style="height:'+H+'px">'+cs.filter(function(c){return c.day===d;}).map(function(c){var a=toMin(c.start),b=toMin(c.end);return '<div class="fb" style="--c:'+esc(c.color||defCol())+';top:'+((a-lo)*PX)+'px;height:'+Math.max(14,(b-a)*PX-2)+'px">'+esc(c.name||'수업')+'<small>'+esc(timeShort(c.start))+'</small></div>';}).join('')+'</div>';}
  return '<span class="lbl">수업 시간표</span>'+h+'</div>';
}
function friendExamHTML(p){
  if(!Array.isArray(p.exams))return '<span class="lbl">시험 기간</span><div class="empty">친구가 앱을 한 번 열면 시험 기간도 같이 보여요.</div>';
  var now=todayKey(),future=p.exams.filter(function(x){return x.start&&(x.end||x.start)>=now;}).sort(function(a,b){return String(a.start).localeCompare(String(b.start));}).slice(0,8);
  return '<span class="lbl">시험 기간</span>'+(future.length?future.map(function(x){var d=diffDays(x.start),tag=d>0?'D-'+d:(diffDays(x.end||x.start)>=0?'진행 중':'');return '<div class="friend-plan-item"><span>'+esc(x.name||x.kind||'시험')+(tag?' <em class="dd soon">'+tag+'</em>':'')+'</span><small>'+esc(rangeTxt(x.start,x.end||x.start)+(x.kind?' · '+x.kind:''))+'</small></div>';}).join(''):'<div class="empty">다가오는 시험 일정이 없어요.</div>');
}
function friendCalendarHTML(p){
  var now=new Date(),shown=0,h='';
  for(var i=0;i<14&&shown<8;i++){var d=addDays(now,i),k=dkey(d),it=[];
    (p.events||[]).filter(function(e){return eventOnDate(e,k);}).forEach(function(e){it.push({t:eventChipLabel(e),m:e.start?timeShort(e.start):'일정'});});
    (p.allday||[]).filter(function(a){return alldayForPayload(a,d);}).forEach(function(a){it.push({t:a.title||'종일 일정',m:'종일'});});
    if(it.length){shown++;h+='<div class="friend-plan-day"><b>'+esc((i===0?'오늘 ':'')+mdTxt(d)+' '+DAYS[dow(d)])+'</b>'+it.slice(0,6).map(function(x){return '<div class="friend-plan-item"><span>'+esc(x.t)+'</span><small>'+esc(x.m)+'</small></div>';}).join('')+'</div>';}
  }
  return '<span class="lbl">공유 일정 · 앞으로 2주</span>'+(h||'<div class="empty">앞으로 2주간 공유된 일정이 없어요.</div>');
}
function friendPlannerDetailHTML(p){
  var today=new Date(),h='<span class="lbl">상세 플래너 · 앞으로 30일</span>',any=false;
  for(var i=0;i<30;i++){
    var d=addDays(today,i),k=dkey(d),items=[];
    (p.classes||[]).filter(function(c){return c.day===dow(d)&&payloadClsActive(c,k,p);}).forEach(function(c){items.push({text:c.name||c.title||'수업',meta:(c.start?timeShort(c.start):'')+(c.end?'~'+timeShort(c.end):'')});});
    (p.todos||[]).filter(function(t){return t.scope==='day'&&t.key===k;}).forEach(function(t){items.push({text:t.text||'할 일',meta:t.done?'완료':'할 일'});});
    (p.events||[]).filter(function(e){return eventOnDate(e,k);}).forEach(function(e){items.push({text:eventChipLabel(e),meta:e.start?timeShort(e.start):'일정'});});
    (p.allday||[]).filter(function(a){return alldayForPayload(a,d);}).forEach(function(a){items.push({text:a.title||'종일 일정',meta:'종일'});});
    (p.ddays||[]).filter(function(x){return x.date===k;}).forEach(function(x){items.push({text:x.title||'D-day',meta:'D-day'});});
    if(!items.length)continue;any=true;
    h+='<div class="friend-plan-day"><b>'+esc((i===0?'오늘 ':'')+mdTxt(d)+' '+DAYS[dow(d)])+'</b>'+items.map(function(x){return '<div class="friend-plan-item"><span>'+esc(x.text)+'</span><small>'+esc(x.meta)+'</small></div>';}).join('')+'</div>';
  }
  return h+(any?'':'<div class="empty">앞으로 30일 동안 적힌 내용이 없어요.</div>');
}
/* 친구 화면과 '내 화면 미리보기'가 같은 함수로 그려져서 보이는 범위가 항상 같아요 */
function friendViewHTML(o){
  var badges=[];if(o.tt)badges.push('시간표');if(o.exams)badges.push('시험');if(o.cal)badges.push('일정');
  var body='';
  if(o.tt)body+=friendTimetableHTML(o.tt);
  if(o.exams)body+=friendExamHTML(o.exams);
  if(o.cal)body+=friendCalendarHTML(o.cal);
  if(!body)body='<div class="empty" style="margin-top:12px">공개한 일정 정보가 없어요.</div>';
  return '<div class="share-preview-head">'+friendAvatar(o.name,o.photo,'lg')+'<div><b>'+esc(o.name)+'</b><small>'+esc(o.sub||'')+'</small></div></div>'+
    (badges.length?'<div class="share-preview-badges">'+badges.map(function(x){return '<span>'+esc(x)+'</span>';}).join('')+'</div>':'')+body;
}
function friendPlannerProgressHTML(id){
  var me=todayTodoStatsFrom(S.todos,todayKey()),fr=friendCheerStatus(id),sent=cheerAlreadySent(id);
  var both=me.allDone&&fr.allDone;
  var status=both?'둘 다 오늘 할 일을 끝냈어요':(!me.total&&!fr.total?'오늘 할 일 기록이 아직 없어요':'오늘 진행 중');
  var btn=sent
    ?'<span class="planner-cheer-sent">응원 보냄 ✓</span>'
    :(both?'<button class="b-save planner-cheer-btn" data-act="cheer-open" data-id="'+esc(id)+'">응원 쪽지 보내기</button>':'');
  return '<div class="planner-progress"><div class="planner-progress-head"><b>오늘 할 일</b><small>'+esc(status)+'</small></div>'+
    '<div class="planner-progress-grid"><div><span>나</span><b>'+me.done+'/'+me.total+'</b></div><div><span>친구</span><b>'+fr.done+'/'+fr.total+'</b></div></div>'+
    '<div class="planner-progress-foot"><small>할 일 내용은 서로 보이지 않고 완료 개수만 보여요.</small>'+btn+'</div></div>';
}
function openFriendPlanner(id){
  var f=FriendSync.friends.find(function(x){return x.id===id;});
  M={type:'friend-planner',id:id};
  if(!f){openModal('<h3>친구 플래너</h3><div class="empty">친구 연결 정보를 찾지 못했어요.</div><div class="acts"><button class="b-ghost" data-act="close">닫기</button></div>');return;}
  var row=function(kind){return FriendSync.incoming.find(function(x){return x.owner_id===id&&x.kind===kind;});};
  var trow=row('timetable'),erow=row('exam'),crow=row('calendar'),label=friendLabel(f);
  var tt=trow&&trow.payload,exams=erow&&erow.payload,cal=f.inCalendar&&crow?crow.payload:null;
  var html='<div class="friend-planner-title"><div>'+friendAvatar(label,f.photo,'lg',f.id)+'<div><h3>'+esc(label)+'님 플래너</h3><small>'+esc(lastMetInfo(id))+'</small></div></div></div>'+
    friendPlannerProgressHTML(id)+
    '<div class="share-preview compact-preview">'+friendViewHTML({name:label,photo:f.photo,sub:'',tt:tt,exams:exams,cal:cal})+'</div>';
  openModal(html+'<div class="acts"><button class="b-ghost" data-act="close">닫기</button><button class="b-save" data-act="friend-meet" data-id="'+esc(id)+'">약속 잡기</button></div>');
}
function friendNote(t){FriendSync.msg=t||'';FriendSync.error='';if((U.tab==='settings'||U.tab==='friends')&&!M.type)render();}
var DEV_MODE=(function(){try{return /[?&]debug\b/.test(location.search)||localStorage.getItem('planner.debug')==='1';}catch(e){return false;}})();
function userMsg(friendly,dev){if(dev)try{console.warn('[planner]',dev);}catch(e){}return DEV_MODE&&dev?dev:friendly;}
function friendSharePref(id){
  S.settings.friendSharePrefs=S.settings.friendSharePrefs||{};
  var p=S.settings.friendSharePrefs[id];
  if(!p)p=S.settings.friendSharePrefs[id]={timetable:false,exams:false};
  return p;
}

function todayTodoStatsFrom(list,k){
  k=k||todayKey();
  var xs=(list||[]).filter(function(t){return t&&t.scope==='day'&&t.key===k&&!t.splitParentId;});
  var done=xs.filter(function(t){return !!t.done;}).length;
  return {total:xs.length,done:done,allDone:xs.length>0&&done===xs.length};
}
function myCheerStatus(){var st=todayTodoStatsFrom(S.todos,todayKey());return {date:todayKey(),total:st.total,done:st.done,allDone:st.allDone,updatedAt:Date.now()};}
function friendCheerStatus(id){
  var pr=(FriendSync.incoming||[]).find(function(x){return x.owner_id===id&&x.kind==='profile';});
  var old=(FriendSync.incoming||[]).find(function(x){return x.owner_id===id&&x.kind==='cheer_status';});
  var p=(pr&&pr.payload&&pr.payload.cheerStatus)||(old&&old.payload)||{};
  if(p.date!==todayKey())return {date:p.date||'',total:0,done:0,allDone:false,stale:true};
  return {date:p.date,total:Number(p.total||0),done:Number(p.done||0),allDone:!!p.allDone};
}
function earliestClassStart(){
  var mins=(S.classes||[]).map(function(c){return c&&c.start?toMin(c.start):null;}).filter(function(x){return x!=null&&isFinite(x);});
  if(!mins.length)return '09:00';
  var m=Math.min.apply(Math,mins);m=Math.max(8*60,Math.min(23*60+59,m));return fmt(m);
}
function cheerReceiveTime(){return /^(?:0[8-9]|1\d|2[0-3]):[0-5]\d$/.test(S.settings.cheerReceiveTime||'')?S.settings.cheerReceiveTime:earliestClassStart();}
function cheerEligible(id){
  var mine=todayTodoStatsFrom(S.todos,todayKey()),fr=friendCheerStatus(id);
  return {ok:mine.allDone&&fr.allDone,mine:mine,friend:fr};
}
function cheerSentKey(id){return todayKey()+'|'+id;}
function cheerAlreadySent(id){return !!(S.settings.cheerSent&&S.settings.cheerSent[cheerSentKey(id)]);}
function cheerIconHTML(cls){
  return '<svg class="cheer-envelope-icon '+esc(cls||'')+'" viewBox="0 0 28 24" aria-hidden="true" focusable="false">'+
    '<rect x="2.5" y="5.5" width="18" height="14" rx="3"></rect>'+
    '<path d="M4.2 8l7.3 5.4L18.8 8"></path>'+
    '<path class="cheer-heart" d="M22 4.2c-1.8-2.2-5.2-.9-5.2 1.8 0 2.3 2.2 3.8 5.2 6.1 3-2.3 5.2-3.8 5.2-6.1 0-2.7-3.4-4-5.2-1.8Z"></path>'+
  '</svg>';
}
function cheerStatusHTML(id){
  var e=cheerEligible(id),f=FriendSync.friends.find(function(x){return x.id===id;}),n=f?friendLabel(f):'친구';
  if(cheerAlreadySent(id))return '<section class="card"><div class="card-h"><h3>응원 쪽지</h3><span class="cnt">보냄 ✓</span></div><p class="hint">오늘 '+esc(n)+'님에게 보낸 응원은 내일 상대가 정한 시간이 지난 뒤 플래논을 열면 확인할 수 있어요.</p></section>';
  if(e.ok)return '<section class="card cheer-card"><div class="card-h"><h3>오늘 둘 다 완료!</h3><span class="cnt">'+e.mine.done+'/'+e.mine.total+' · '+e.friend.done+'/'+e.friend.total+'</span></div><p class="hint">둘 다 오늘 할 일을 다 했어요. '+esc(n)+'님에게 최대 100자의 수고 메시지를 보내면 내일 설정 시간 이후 플래논에서 확인할 수 있어요.</p><button class="b-save" style="width:100%;height:42px" data-act="cheer-open" data-id="'+esc(id)+'">수고했다고 응원 보내기</button></section>';
  var mine=e.mine.total?('내 할 일 '+e.mine.done+'/'+e.mine.total):( '내 오늘 할 일 없음');
  var fr=e.friend.total?('친구 할 일 '+e.friend.done+'/'+e.friend.total):'친구 완료 상태 확인 전';
  return '<section class="card"><div class="card-h"><h3>응원 쪽지</h3></div><p class="hint">'+esc(mine+' · '+fr)+'<br>둘 다 오늘 할 일을 모두 마치면 응원 쪽지를 보낼 수 있어요. 할 일 내용은 공유하지 않고 완료 개수만 확인해요.</p></section>';
}
function openCheerMessage(id){
  var f=FriendSync.friends.find(function(x){return x.id===id;});if(!f)return;
  var e=cheerEligible(id);if(!e.ok){inAppToast('둘 다 오늘 할 일을 다 한 뒤 보낼 수 있어요');return;}
  M={type:'cheer-message',friendId:id};
  openModal('<h3>'+esc(friendLabel(f))+'님에게 응원 보내기</h3><div class="cheer-delay-note"><b class="cheer-note-title">'+cheerIconHTML('small')+'<span>오늘 보내고, 내일 받기</span></b><small>바로 전달되지 않아요. 내일 설정 시간 이후 상대가 플래논을 열면 보여요. 답장·대화 기능은 없고 하루에 한 번만 보낼 수 있어요.</small></div><textarea class="diary-text" style="min-height:130px;background-image:none" id="f-cheer-msg" maxlength="100" placeholder="예: 오늘도 수고했어! 진짜 잘했다"></textarea><div class="diary-count" id="cheer-count">0/100</div><p class="hint" id="cheer-msg-status">최대 100자 · 내일 설정 시간 이후 플래논을 열면 보여요</p><div class="acts"><button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="cheer-send" data-id="'+esc(id)+'">내일 보내기</button></div>');
  setTimeout(function(){var x=$('#f-cheer-msg');if(x)x.focus();},30);
}
function sendCheerMessage(id){
  var sb=friendDb(),box=$('#f-cheer-msg'),msg=$('#cheer-msg-status'),text0=box?(box.value||'').trim():'';
  if(!sb){if(msg)msg.textContent='로그인 연결을 확인해주세요.';return;}
  if(!text0){bad('#f-cheer-msg');if(msg)msg.textContent='응원 메시지를 적어주세요.';return;}
  var chars=Array.from(text0);if(chars.length>100){bad('#f-cheer-msg');if(msg)msg.textContent='100자 이하로 적어주세요.';return;}
  if(!cheerEligible(id).ok){if(msg)msg.textContent='둘 다 오늘 할 일을 모두 마친 상태가 아니에요.';return;}
  if(msg)msg.textContent='보내는 중…';
  var tomorrow=studyTomorrowKey(new Date());
  sb.from('planner_friend_cheers').insert({from_user:Sync.uid,to_user:id,message:text0,deliver_date:tomorrow}).then(function(r){
    if(r.error)throw r.error;
    S.settings.cheerSent=S.settings.cheerSent||{};S.settings.cheerSent[cheerSentKey(id)]=1;save();
    closeModal();render();inAppToast('응원을 보냈어요 · 내일 설정 시간 이후 플래논에서 확인할 수 있어요');
  }).catch(function(e){
    var em=e&&e.message||'';
    if(msg)msg.textContent=/duplicate|23505/i.test(em)?'오늘은 이 친구에게 이미 응원을 보냈어요.':(/planner_friend_cheers|schema cache|does not exist/i.test(em)?'응원 기능 서버 설정이 필요해요. 최신 production migration을 적용해주세요.':'보내지 못했어요. 잠시 뒤 다시 시도해주세요.');
  });
}

function receivedCheerLog(){if(!Array.isArray(S.settings.cheerReceivedLog))S.settings.cheerReceivedLog=[];return S.settings.cheerReceivedLog;}
function recordReceivedCheer(x,name){
  if(!x||!x.id)return;var L=receivedCheerLog();if(L.some(function(r){return r.id===x.id;}))return;
  L.push({id:x.id,date:String(x.deliver_date||todayKey()),fromUser:x.from_user||'',fromName:name||'친구',message:x.message||'',receivedAt:Date.now()});
  if(L.length>240)L.splice(0,L.length-240);save();
}
function monthCheerCount(d){
  var pre=mkey(d),seen={},n=0;
  receivedCheerLog().forEach(function(x){if(x&&x.date&&String(x.date).slice(0,7)===pre&&!seen[x.id]){seen[x.id]=1;n++;}});
  if(n)return n;
  noticeLog().forEach(function(x){var k=x&&x.date?String(x.date):dkey(new Date(x.at||0));if(x&&x.kind==='cheer'&&k.slice(0,7)===pre)n++;});
  return n;
}
function monthCheerSummaryHTML(d){
  var n=monthCheerCount(d);if(!n)return '';
  return '<button class="month-cheer-summary" data-act="open-notices"><span>'+cheerIconHTML('small')+'<b>친구에게 받은 응원 쪽지</b></span><em>'+n+'개</em></button>';
}

function cheerDeliverDue(){
  var sb=friendDb();if(!sb||CheerSync.busy)return Promise.resolve();
  CheerSync.busy=true;CheerSync.error='';
  var tk=todayKey(),now=new Date(),cur=pad(now.getHours())+':'+pad(now.getMinutes()),rt=cheerReceiveTime();
  return sb.from('planner_friend_cheers').select('id,from_user,to_user,message,deliver_date,notified_at,created_at').eq('to_user',Sync.uid).is('notified_at',null).lte('deliver_date',tk).order('created_at',{ascending:true}).then(function(r){
    if(r.error)throw r.error;
    var due=(r.data||[]).filter(function(x){return x.deliver_date<tk||(x.deliver_date===tk&&cur>=rt);});
    if(!due.length)return;
    return Promise.all(due.map(function(x){
      var f=FriendSync.friends.find(function(y){return y.id===x.from_user;}),n=f?friendLabel(f):'친구';
      var tx=n+'님: '+x.message;
      recordReceivedCheer(x,n);
      pushNotice('cheer',tx,x.deliver_date);
      if(document.hidden)sysNotify('응원 메시지가 도착했어요',tx,'cheer:'+x.id);else inAppToast(tx);
      return sb.from('planner_friend_cheers').update({notified_at:new Date().toISOString()}).eq('id',x.id).eq('to_user',Sync.uid);
    }));
  }).catch(function(e){
    var em=e&&e.message||'';
    if(!/planner_friend_cheers|schema cache|does not exist/i.test(em))CheerSync.error=em;
  }).then(function(){CheerSync.busy=false;CheerSync.lastCheck=Date.now();});
}

function friendPayload(kind){
  var cp=function(a){return (a||[]).map(function(e){return Object.assign({},e);});};
  if(kind==='profile')return {name:(S.settings.profileName||'').trim(),photo:S.settings.profilePhoto||'',color:S.settings.defColor||'#dce9f7',homeStation:S.settings.homeStation||'',originRules:(S.settings.originRules||[]).map(function(r){return {from:r.from,to:r.to,origin:r.origin,days:r.days};}),originWeekOverrides:(S.settings.originWeekOverrides||[]).map(function(r){return {date:r.date,from:r.from,to:r.to,origin:r.origin};}),cheerStatus:myCheerStatus(),meonbyeol:(function(){try{return window.PLANON_MB_SOCIAL?window.PLANON_MB_SOCIAL.sharePayload():null;}catch(e){return null;}})()};
  if(kind==='timetable')return {classes:cp(S.classes),semStart:S.settings.semStart||null,semEnd:S.settings.semEnd||null,school:S.settings.school||'',schoolCampus:S.settings.schoolCampus||''};
  if(kind==='exam')return (S.exams||[]).map(function(e){return {id:e.id,name:e.name||'',kind:e.kind||'',start:e.start,end:e.end||e.start};});
  if(kind==='calendar')return {events:cp(S.events),allday:cp(S.allday)};
  return {classes:cp(S.classes),events:cp(S.events),allday:cp(S.allday),todos:cp(S.todos),routines:cp(S.routines),exams:cp(S.exams),ddays:cp(S.ddays),semStart:S.settings.semStart||null,semEnd:S.settings.semEnd||null};
}
function friendBusyItems(friendId,k){
  var d=parseKey(k),out=[],f=FriendSync.friends.find(function(x){return x.id===friendId;}),detail=!!(f&&f.inPlanner),G='#c9c9c9';
  var nm=function(t){return detail&&t?t:'일정 있음';};
  FriendSync.incoming.filter(function(r){return r.owner_id===friendId&&(r.kind==='calendar'||r.kind==='planner');}).forEach(function(r){
    var p=r.payload||{};
    (p.classes||[]).filter(function(c){return c.day===dow(d)&&payloadClsActive(c,k,p);}).forEach(function(c){if(c.start&&c.end)out.push({start:toMin(c.start),end:toMin(c.end),name:nm(c.name),color:G,friendBusy:true});});
    (p.events||[]).filter(function(e){return eventOnDate(e,k);}).forEach(function(e){var s0=e.start||'00:00',en=e.end||'23:59';out.push({start:toMin(s0),end:toMin(en),name:nm(e.title),color:G,friendBusy:true});});
    (p.allday||[]).filter(function(a){return alldayForPayload(a,d);}).forEach(function(a){out.push({start:0,end:24*60,name:nm(a.title),color:G,friendBusy:true});});
  });
  /* 수락된 친구는 일정 내용 없이 '바쁜 시간'만 서로 받아요 */
  var bp=FriendSync.busyMap&&FriendSync.busyMap[friendId],bx=bp&&bp.days&&bp.days[k];
  if(bx){if(bx.a)out.push({start:0,end:24*60,name:'일정 있음',color:G,friendBusy:true});(bx.r||[]).forEach(function(r){out.push({start:+r[0],end:+r[1],name:'일정 있음',color:G,friendBusy:true});});}
  return out;
}
function friendPush(){
  var sb=friendDb();if(!sb||!FriendSync.loaded||FriendSync.busy)return Promise.resolve();
  friendBusyPush();
  var rows=[],stamp=new Date().toISOString();
  var clean=[];
  FriendSync.friends.forEach(function(f){
    var pref=friendSharePref(f.id);
    /* 응원 완료 상태는 허용된 profile payload 안에 함께 보관해 DB kind 제약과 충돌하지 않게 해요. */
    rows.push({owner_id:Sync.uid,friend_id:f.id,kind:'profile',payload:friendPayload('profile'),updated_at:stamp});
    if(pref.timetable)rows.push({owner_id:Sync.uid,friend_id:f.id,kind:'timetable',payload:friendPayload('timetable'),updated_at:stamp});
    else clean.push({friend_id:f.id,kind:'timetable'});
    if(pref.exams)rows.push({owner_id:Sync.uid,friend_id:f.id,kind:'exam',payload:friendPayload('exam'),updated_at:stamp});
    else clean.push({friend_id:f.id,kind:'exam'});
    if(f.outCalendar)rows.push({owner_id:Sync.uid,friend_id:f.id,kind:'calendar',payload:friendPayload('calendar'),updated_at:stamp});
    if(f.outPlanner)rows.push({owner_id:Sync.uid,friend_id:f.id,kind:'planner',payload:friendPayload('planner'),updated_at:stamp});
  });
  if(!rows.length&&!clean.length)return Promise.resolve();
  FriendSync.busy=true;
  var jobs=rows.map(function(row){return sb.from('planner_friend_data').upsert(row,{onConflict:'owner_id,friend_id,kind'});});
  clean.forEach(function(x){jobs.push(sb.from('planner_friend_data').delete().eq('owner_id',Sync.uid).eq('friend_id',x.friend_id).eq('kind',x.kind));});
  return Promise.all(jobs).then(function(rs){
    var bad=rs.find(function(x){return x.error;});if(bad)throw bad.error;FriendSync.error='';
  }).catch(function(e){var em=e&&e.message||'';FriendSync.error=userMsg('친구 정보 동기화가 잠시 안 됐어요. 다시 시도해주세요.',em);}).then(function(){FriendSync.busy=false;});
}
function friendLoad(){
  var sb=friendDb();
  if(!sb){FriendSync.loaded=false;FriendSync.friends=[];FriendSync.incoming=[];FriendSync.memories=[];return Promise.resolve();}
  FriendSync.error='';FriendSync.memoryError='';
  return friendCodeSelf(sb).then(function(r){
    if(r.error)throw r.error;
    if(r.data&&r.data.code){FriendSync.code=r.data.code;lsSet('planner.friendCode.'+Sync.uid,FriendSync.code);return null;}
    var c=makeFriendCode(),dn=(S.settings.profileName||'').trim();return sb.from('planner_friend_codes').insert({user_id:Sync.uid,code:c,display_name:dn}).then(function(x){if(x.error&&/display_name|column|schema cache/i.test(x.error.message||''))return sb.from('planner_friend_codes').insert({user_id:Sync.uid,code:c});if(x.error)throw x.error;}).then(function(x){if(x&&x.error)throw x.error;FriendSync.code=c;lsSet('planner.friendCode.'+Sync.uid,c);});
  }).then(function(){
    return Promise.all([
      sb.from('planner_friendships').select('user_a,user_b').eq('user_a',Sync.uid),
      sb.from('planner_friendships').select('user_a,user_b').eq('user_b',Sync.uid)
    ]);
  }).then(function(rs){
    rs.forEach(function(r){if(r.error)throw r.error;});
    var links=(rs[0].data||[]).concat(rs[1].data||[]),ids=[];
    links.forEach(function(x){var id=x.user_a===Sync.uid?x.user_b:x.user_a;if(!isBlockedUser(id)&&ids.indexOf(id)<0)ids.push(id);});
    if(!ids.length){FriendSync.friends=[];FriendSync.incoming=[];FriendSync.memories=[];FriendSync.loaded=true;return null;}
    return Promise.all([
      friendCodeList(sb,ids),
      sb.from('planner_friend_shares').select('owner_id,friend_id,share_calendar,share_planner').in('owner_id',[Sync.uid].concat(ids)).in('friend_id',[Sync.uid].concat(ids)),
      sb.from('planner_friend_data').select('owner_id,friend_id,kind,payload,updated_at').eq('friend_id',Sync.uid).in('owner_id',ids)
    ]).then(function(xs){
      xs.forEach(function(r){if(r.error)throw r.error;});
      var cm={};(xs[0].data||[]).forEach(function(x){cm[x.user_id]={code:x.code,name:(x.display_name||'').trim(),photo:x.photo||''};});
      var sm={};(xs[1].data||[]).forEach(function(x){sm[x.owner_id+'|'+x.friend_id]=x;});
      var rawData=xs[2].data||[],profiles={};
      rawData.forEach(function(x){if(x.kind==='profile')profiles[x.owner_id]=x.payload||{};});
      FriendSync.friends=ids.map(function(id){
        var out=sm[Sync.uid+'|'+id]||{},inc=sm[id+'|'+Sync.uid]||{},info=cm[id]||{},pr=profiles[id]||{};
        var pref=friendSharePref(id);
        return {id:id,code:info.code||id.slice(0,6).toUpperCase(),name:(pr.name||info.name||'').trim(),photo:pr.photo||info.photo||'',color:pr.color||'#dce9f7',homeStation:pr.homeStation||'',originRules:Array.isArray(pr.originRules)?pr.originRules:[],originWeekOverrides:Array.isArray(pr.originWeekOverrides)?pr.originWeekOverrides:[],outTimetable:!!pref.timetable,outExams:!!pref.exams,outCalendar:!!out.share_calendar,outPlanner:!!out.share_planner,inCalendar:!!inc.share_calendar,inPlanner:!!inc.share_planner};
      });
      FriendSync.incoming=rawData.filter(function(x){
        var f=FriendSync.friends.find(function(y){return y.id===x.owner_id;});if(!f)return false;
        if(x.kind==='profile'||x.kind==='timetable'||x.kind==='cheer_status')return true;
        return x.kind==='calendar'?f.inCalendar:(x.kind==='planner'&&f.inPlanner);
      });
    });
  }).then(function(){FriendSync.loaded=true;var ch=JSON.stringify([(S.settings.profileName||'').trim(),(S.settings.profilePhoto||'').length,S.settings.defColor||'',S.settings.homeStation||'',S.settings.originRules||[],S.settings.originWeekOverrides||[]]);if(lsGet('planner.codeSync.'+Sync.uid)!==ch)syncProfileToCodes().then(function(r){if(!r||!r.error)lsSet('planner.codeSync.'+Sync.uid,ch);},function(){});return friendBusyLoad().then(friendLoadMemories);}).then(function(){return friendPush();}).then(function(){return friendRequestLoad();}).then(function(){return cheerDeliverDue();}).then(function(){if((U.tab==='settings'||U.tab==='friends')&&!M.type)render();else if(!M.type)$('#nav').innerHTML=navHTML();}).catch(function(e){FriendSync.loaded=false;var em=(e&&(e.message||e.details||e.hint||e.code))||String(e||'');FriendSync.error=userMsg('친구 정보를 불러오지 못했어요. 잠시 뒤 다시 열어주세요.',(/does not exist|schema cache|Could not find/i.test(em)?'Supabase 친구 기능 설정이 아직 없어요. 최신 production migration을 적용해주세요.':/permission denied|row-level security|42501/i.test(em)?'친구 기능 권한 설정을 확인해주세요. 최신 production migration 기준으로 다시 점검해주세요.':'친구 연동 중 오류가 났어요.')+' (자세히: '+em+')');if((U.tab==='settings'||U.tab==='friends')&&!M.type)render();});
}
function friendLoadMemories(){
  var sb=friendDb();if(!sb||!FriendSync.friends.length){FriendSync.memories=[];return Promise.resolve();}
  var ids=FriendSync.friends.map(function(f){return f.id;});
  var cols=FriendSync.noMemPhoto?'id,owner_id,friend_id,line,station,visited_at,place,what,created_at':'id,owner_id,friend_id,line,station,visited_at,place,what,photo,created_at';
  return Promise.all([
    sb.from('planner_friend_memories').select(cols).eq('owner_id',Sync.uid).in('friend_id',ids),
    sb.from('planner_friend_memories').select(cols).eq('friend_id',Sync.uid).in('owner_id',ids)
  ]).then(function(rs){var pe=rs.find(function(r){return r.error&&/photo/i.test(r.error.message||'');});if(pe&&!FriendSync.noMemPhoto){FriendSync.noMemPhoto=true;throw {retry:1};}var out=[],seen={};rs.forEach(function(r){if(r.error)throw r.error;(r.data||[]).forEach(function(x){if(!seen[x.id]){seen[x.id]=1;out.push(x);}});});FriendSync.memories=out;}).catch(function(e){if(e&&e.retry)return friendLoadMemories();FriendSync.memories=[];FriendSync.memoryError=e&&e.message||'친구 추억을 불러오지 못했어요';});
}
function friendMemoryRows(id){return friendMemoryRows0(id).sort(function(a,b){return String(b.visited_at||b.created_at||'').localeCompare(String(a.visited_at||a.created_at||''));});}
function friendMemoryRows0(id){
  var out=(FriendSync.memories||[]).filter(function(x){return (x.owner_id===Sync.uid&&x.friend_id===id)||(x.owner_id===id&&x.friend_id===Sync.uid);});
  (S.settings.friendMemories||[]).filter(function(x){return (x.owner_id===Sync.uid&&x.friend_id===id)||(x.owner_id===id&&x.friend_id===Sync.uid);}).forEach(function(x){if(!out.some(function(y){return y.id===x.id;}))out.push(x);});
  return out.sort(function(a,b){return String(b.visited_at||b.created_at||'').localeCompare(String(a.visited_at||a.created_at||''));});
}
function openFriendMemories(id,pre){
  var f=FriendSync.friends.find(function(x){return x.id===id;});if(!f)return;
  var info=pre&&(pre.info||(pre.place?placeInfoFromText(pre.place):null));
  M={type:'friend-memories',friendId:id,pp:ppNew(info,{friendId:id}),memoryDate:(pre&&pre.date)||dkey(new Date()),mplace:'',mwhat:(pre&&pre.what)||'',mphoto:''};
  drawFriendMemories();
}
function appointmentMemoryMood(pose){return pose==='cafe'?{label:'행복',mood:'happy',expr:'smile'}:pose==='walk'?{label:'설렘',mood:'happy',expr:'shy'}:pose==='study'?{label:'뿌듯',mood:'proud',expr:'proud'}:{label:'편안',mood:'basic',expr:'shy'};}
function appointmentMemoryFace(uid,pose,friend){var md=appointmentMemoryMood(pose),soc=window.PLANON_MB_SOCIAL,x='';try{if(soc&&soc.pairFace)x=soc.pairFace(uid,md.expr)||'';}catch(e){}if(x)return '<span class="memory-pair-mb">'+x+'</span>';var col=friend&&friend.color||S.settings.defColor||'#dce9f7';return '<span class="memory-pair-nemo" style="--planner-color:'+esc(col)+'">'+(typeof nemoSVG==='function'?nemoSVG(md.mood,'memory-pair-svg'):'□')+'</span>';}
function appointmentMemoryCardHTML(x,id){var meta=appointmentPhotoMemoryMeta(x)||{pose:'basic'},f=FriendSync.friends.find(function(y){return y.id===id;}),md=appointmentMemoryMood(meta.pose),left=appointmentMemoryFace(Sync.uid,meta.pose,null),right=appointmentMemoryFace(id,meta.pose,f),date=x.visited_at?mdTxt(parseKey(x.visited_at)):'';return '<div class="memory-card appointment-memory-photo"><div class="memory-photo-top"><span>'+esc(date)+'</span><b>'+esc(md.label)+'</b></div><div class="memory-photo-pair"><div>'+left+'</div><i>✦</i><div>'+right+'</div></div><div class="memory-photo-place"><b>'+esc(x.place||'함께한 장소')+'</b><small>'+esc(x.what||'한줄평을 남기지 않았어요')+'</small></div><em>PLAN:ON · MEMORY</em></div>';}
function drawFriendMemories(){
  if($('#f-mdate')){M.memoryDate=$('#f-mdate').value;M.mplace=$('#f-mplace').value;M.mwhat=$('#f-mwhat').value;}
  var id=M.friendId,f=FriendSync.friends.find(function(x){return x.id===id;}),rows=friendMemoryRows(id);
  var list=rows.length?rows.slice(0,30).map(function(x){if(appointmentPhotoMemoryMeta(x))return appointmentMemoryCardHTML(x,id);var i=memoryInfo(x);return '<div class="memory-card">'+(i?placeIcon(i.kind):'')+'<div class="mc-body"><b>'+esc(memoryAreaLabel(x))+'</b><small>'+esc([x.visited_at?mdTxt(parseKey(x.visited_at)):'',x.place,x.what].filter(function(v){return !!v;}).join(' · ')||'기록만 남김')+'</small>'+(x.photo?'<img class="mem-photo" src="'+esc(x.photo)+'" alt="추억 사진" loading="lazy">':(!FriendSync.noMemPhoto?'<label class="mem-addphoto">+ 사진 넣기<input type="file" accept="image/*" data-memphoto="'+esc(x.id)+'" hidden></label>':''))+'</div></div>';}).join(''):'<div class="memory-empty">아직 함께 남긴 추억이 없어요. 첫 추억을 남겨봐요.</div>';
  openModal('<h3>'+esc(friendLabel(f))+'님과의 추억</h3>'+relationSummaryHTML(id)+friendMemoryBanners(id)+
    '<span class="lbl">어디였어?</span><div id="pp">'+ppHTML(M.pp)+'</div>'+
    '<span class="lbl">언제</span><input class="fld" type="date" id="f-mdate" value="'+esc(M.memoryDate||'')+'"><span class="lbl">어디서 <em>(선택)</em></span><input class="fld" id="f-mplace" maxlength="50" placeholder="카페, 공원, 식당 이름 등" value="'+esc(M.mplace||'')+'"><span class="lbl">무엇을 <em>(선택)</em></span><input class="fld" id="f-mwhat" maxlength="80" placeholder="같이 한 일" value="'+esc(M.mwhat||'')+'">'+
    '<span class="lbl">사진 <em>(선택)</em></span>'+(M.mphoto?'<div class="mem-new-photo"><img src="'+esc(M.mphoto)+'" alt=""><button class="pp-x" data-act="mem-photo-clear" aria-label="사진 빼기">✕</button></div>':'<label class="tbtn photo-pick">사진 고르기<input type="file" accept="image/*" data-memphoto="" hidden></label>')+
    '<p class="hint" id="memory-msg">'+(FriendSync.memoryError?'서버에 저장이 안 되면 이 기기에 먼저 저장해요.':'')+'</p><div class="acts"><button class="b-ghost" data-act="memory-appointment">이 장소로 약속 잡기</button><button class="b-save" data-act="save-friend-memory">추억 저장</button></div>'+
    (rows.length?'<button class="report-cta" data-act="report-open" data-id="'+esc(id)+'"><b>우리 추억 리포트 만들기</b><small>이번 학기 만난 횟수·자주 간 곳·사진을 한 장으로</small></button>':'')+'<span class="lbl" style="margin-top:16px">지난 추억 '+rows.length+'개</span><div class="memory-list">'+list+'</div><div class="acts"><button class="b-ghost" data-act="close">닫기</button></div>');
}
function memoryLineOf(info){
  if(info.kind==='station')return {line:'지하철',station:stationName(info.station)};
  if(info.kind==='other')return {line:'기타',station:info.text};
  return {line:info.region,station:[info.city,info.district].filter(Boolean).join(' > ')};
}
function saveFriendMemory(){
  var info=ppInfo(M.pp),mm=$('#memory-msg');
  if(!info){if(mm)mm.textContent='어디였는지 먼저 골라주세요 (지역·역을 누르거나 직접 입력)';var pb=$('#pp');if(pb)pb.classList.add('bad');return;}
  var id=M.friendId,date=$('#f-mdate').value||null,place=$('#f-mplace').value.trim(),what=$('#f-mwhat').value.trim(),lk=memoryLineOf(info);
  var k=placeKeyOf(info),n=(friendPlaceCounts(id)[k]||0)+1,done='추억을 남겼어요 · '+k+'에서 '+(n===1?'첫':n+'번째')+' 추억이에요!';
  var row={id:'local-memory-'+uid(),owner_id:Sync.uid,friend_id:id,line:lk.line,station:lk.station,visited_at:date,place:place,what:what,created_at:new Date().toISOString()};
  var photo=M.mphoto||'';var reset=function(){M.pp=ppNew(null,{friendId:id});M.mplace='';M.mwhat='';M.mphoto='';M.memoryDate=dkey(new Date());drawFriendMemories();var m2=$('#memory-msg');if(m2)m2.textContent=done;};
  var sb=friendDb();
  row.photo=photo;var ins={owner_id:row.owner_id,friend_id:row.friend_id,line:row.line,station:row.station,visited_at:row.visited_at,place:row.place,what:row.what};if(photo&&!FriendSync.noMemPhoto)ins.photo=photo;
  if(sb){sb.from('planner_friend_memories').insert(ins).select().single().then(function(r){if(r.error&&ins.photo&&/photo/i.test(r.error.message||'')){FriendSync.noMemPhoto=true;delete ins.photo;inAppToast(userMsg('사진은 지금 저장할 수 없어서 기록만 남겼어요','사진은 SQL 실행 후에 저장돼요. 기록은 남겼어요'));return sb.from('planner_friend_memories').insert(ins).select().single();}return r;}).then(function(r){if(r.error)throw r.error;FriendSync.memories.push(r.data);FriendSync.memoryError='';reset();inAppToast(done);}).catch(function(e){S.settings.friendMemories.push(row);save();FriendSync.memoryError=e&&e.message||'';reset();var msg=$('#memory-msg');if(msg)msg.textContent='이 기기에 먼저 저장했어요. 서버 권한이 복구되면 친구와도 공유돼요.';});}
  else{S.settings.friendMemories.push(row);save();FriendSync.memories.push(row);reset();inAppToast(done);}
}
function friendAdd(code){
  var sb=friendDb(),c=String(code||'').trim().toUpperCase();if(!sb){friendNote('먼저 로그인해주세요');return;}if(!/^[A-Z2-9]{8}$/.test(c)){friendNote('8자리 초대코드를 입력해주세요');return;}
  sb.from('planner_friend_codes').select('user_id').eq('code',c).maybeSingle().then(function(r){if(r.error)throw r.error;if(!r.data){friendNote('초대코드를 찾지 못했어요');return;}var to=r.data.user_id;if(to===Sync.uid){friendNote('내 초대코드는 입력할 수 없어요');return;}
    if(isBlockedUser(to)){friendNote('차단한 사용자는 친구로 추가할 수 없어요');return;}
    if(FriendSync.friends.some(function(f){return f.id===to;})){friendNote('이미 연결된 친구예요');return;}
    /* 상대가 먼저 나에게 요청했으면 바로 수락으로 처리해요 */
    var back=(FriendSync.invitesIn||[]).find(function(x){return x.from_user===to;});if(back){friendInviteRespond(back.id,true);return;}
    return sb.from('planner_friend_invites').upsert({from_user:Sync.uid,to_user:to,status:'pending',created_at:new Date().toISOString(),responded_at:null},{onConflict:'from_user,to_user'}).then(function(x){if(x.error)throw x.error;var el=$('#f-friend-code');if(el)el.value='';friendNote('친구 요청을 보냈어요. 상대가 수락하면 연결돼요');return friendInviteLoad();});
  }).catch(function(e){friendNote(friendSqlHint(e));});
}
function friendToggle(id,mode){
  var sb=friendDb(),f=FriendSync.friends.find(function(x){return x.id===id;});if(!sb||!f)return Promise.resolve(false);
  if(mode==='timetable'||mode==='exams'){
    var pref=friendSharePref(id),key=mode==='timetable'?'timetable':'exams';
    pref[key]=!pref[key];f[mode==='timetable'?'outTimetable':'outExams']=pref[key];
    save();
    return friendPush().then(function(){friendNote((mode==='timetable'?'시간표':'시험')+' 공개를 '+(pref[key]?'켰어요':'껐어요'));return true;}).catch(function(e){pref[key]=!pref[key];f[mode==='timetable'?'outTimetable':'outExams']=pref[key];save();friendNote(e&&e.message||'공유 범위를 바꾸지 못했어요');return false;});
  }
  var row={owner_id:Sync.uid,friend_id:id,share_calendar:mode==='calendar'?!f.outCalendar:f.outCalendar,share_planner:mode==='planner'?!f.outPlanner:f.outPlanner};
  f.outCalendar=row.share_calendar;f.outPlanner=row.share_planner;
  return sb.from('planner_friend_shares').upsert(row,{onConflict:'owner_id,friend_id'}).then(function(r){if(r.error)throw r.error;return friendLoad();}).then(friendPush).then(function(){return true;}).catch(function(e){friendNote(e&&e.message||'공유 범위를 바꾸지 못했어요');return false;});
}
function friendRemove(id){
  var sb=friendDb(),pair=[Sync.uid,id].sort();if(!sb)return;
  Promise.all([sb.from('planner_friendships').delete().eq('user_a',pair[0]).eq('user_b',pair[1]),sb.from('planner_friend_shares').delete().eq('owner_id',Sync.uid).eq('friend_id',id),sb.from('planner_friend_data').delete().eq('owner_id',Sync.uid).eq('friend_id',id)]).then(function(rs){rs.forEach(function(r){if(r.error)throw r.error;});return friendLoad();}).then(function(){friendNote('친구 연결을 해제했어요');}).catch(function(e){friendNote(e&&e.message||'친구 연결 해제에 실패했어요');});
}
function requestFriendCode(id){var f=FriendSync.friends.find(function(x){return x.id===id;});return friendLabel(f);}
function appointmentRequestText(p){var t=[p.groupNames&&p.groupNames.length>2?(p.groupNames.length+'명 약속'):'',p.what,p.place,p.date?mdTxt(parseKey(p.date)):'',p.start?timeShort(p.start):'시간 미정'].filter(function(x){return !!x;}).join(' · ')||'약속';var g=groupAppointmentStatus(p);return t+(g?' · '+g:'');}
function mergeSharedAppointments(rows){
  var accepted={},changed=false,groups={};
  (rows||[]).forEach(function(r){
    var p=Object.assign({},r.payload||{}),g=p.groupId||'';
    if(g&&groups[g]){
      groups[g].groupRequestIds.push(r.request_id);accepted[r.request_id]=1;return;
    }
    if(p.fromUser){
      var mine=p.fromUser===Sync.uid?p.fromName:p.toName;
      p.person=p.groupNames&&p.groupNames.length?p.groupNames.filter(function(n){return n&&n!==myDisplayName();}).join(', '):(p.fromUser===Sync.uid?(p.toName||p.person):(p.fromName||requestFriendCode(p.fromUser)));
      if(!p.what&&(!p.title||p.title===mine||p.title===p.toName||p.title===p.fromName))p.title=p.place||p.person||'약속';
    }
    p.friendId=r.user_a===Sync.uid?r.user_b:r.user_a;p.id='shared:'+r.request_id;p.sharedRequestId=r.request_id;p.groupRequestIds=[r.request_id];p.shared=true;p.kind='appointment';accepted[r.request_id]=1;
    if(g)groups[g]=p;
    var old=S.events.find(function(e){return g?e.groupId===g:e.sharedRequestId===r.request_id;});
    if(old){var bf=JSON.stringify(old);Object.assign(old,p);if(JSON.stringify(old)!==bf)changed=true;}else{S.events.push(p);changed=true;}
  });
  var validGroups={};Object.keys(groups).forEach(function(g){validGroups[g]=1;});
  var before=S.events.length;S.events=S.events.filter(function(e){if(e.groupId)return !!validGroups[e.groupId];return !e.sharedRequestId||accepted[e.sharedRequestId];});if(before!==S.events.length)changed=true;
  if(changed){S.updatedAt=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){storageOK=false;}scheduleSync();}
}
function showNextAppointmentRequest(){
  if(M.type||!Sync.uid||U.guest)return;
  var r=FriendSync.requests.find(function(x){return x.to_user===Sync.uid&&x.status==='pending'&&!FriendSync.shown[x.id];});if(!r)return;
  openAppointmentRequest(r);
}
function openAppointmentRequest(r){
  FriendSync.shown[r.id]=1;
  var p=r.payload||{},sel=null,c=!p.place?cleanCandidates(p.placeCandidates):[],info=p.placeInfo||(p.place?placeInfoFromText(p.place):null);
  if(p.date&&p.start){var s0=toMin(p.start),e0=p.end?toMin(p.end):Math.min(s0+60,1440);sel={date:p.date,s:s0,e:e0,step:2};}
  var my=meetAvail(),lo=my[0]*60,hi=my[1]*60;if(sel){lo=Math.min(lo,Math.floor(sel.s/60)*60);hi=Math.max(hi,Math.ceil(sel.e/60)*60);}
  var f=FriendSync.friends.find(function(x){return x.id===r.from_user;})||{id:r.from_user};
  M={type:'appointment-request',request:r,requestCandidateSelections:[],friendId:r.from_user,week:weekMon(p.date?parseKey(p.date):new Date()),sel:sel,orig:sel?Object.assign({},sel):null,lo:lo,hi:Math.min(hi,1440),minWeek:null};
  openModal('<h3>새 약속 요청</h3><div class="meet-head">'+friendAvatar(requestFriendCode(r.from_user),f.photo)+'<div><b>'+esc(requestFriendCode(r.from_user))+'님이 약속을 제안했어요</b><span class="meet-days">'+esc(lastMetInfo(r.from_user))+'</span></div></div>'+
    '<div class="requestbox"><b>'+esc(p.what||'약속')+'</b><small>'+esc([p.date?slotText(p.date,sel?sel.s:null,sel?sel.e:null):'',sel?'':'시간 미정',p.place||'장소 미정'].filter(function(x){return !!x;}).join(' · '))+'</small></div>'+
    (info?placeCountBanner(r.from_user,info,true):'')+
    (c.length?'<span class="lbl">장소 후보 · 괜찮은 곳을 골라줘 <em>(여러 개 가능)</em></span><div class="candidate-picks">'+c.map(function(x){return '<button class="candidate-pick" data-act="request-candidate-toggle" data-v="'+esc(x)+'">'+esc(x)+'</button>';}).join('')+'</div><p class="hint">하나만 고르면 수락할 때 그곳으로 바로 확정돼요.</p>':'')+
    '<p class="hint">그 주의 내 일정(빗금)과 친구 일정(회색)이에요. 다른 빈 칸을 고르면 그 시간으로 다시 제안할 수 있어요.</p><div id="meetbox"></div><p class="hint" id="meet-sel"></p><p class="hint" id="request-msg"></p><div class="acts" id="meet-acts"></div>');
  drawMeet();var t3=$('#meet-top3');if(t3)t3.innerHTML=groupTopSlotsHTML();refreshMeetBusy();
}
function friendRequestLoad(){
  if(!Sync.on)return Promise.resolve();
  var sb=friendDb();if(!sb){FriendSync.requests=[];FriendSync.shared=[];return Promise.resolve();}
  friendInviteLoad();linkLoad();
  return Promise.all([
    sb.from('planner_appointment_requests').select('id,from_user,to_user,payload,status,created_at').eq('to_user',Sync.uid).eq('status','pending'),
    sb.from('planner_appointment_requests').select('id,from_user,to_user,payload,status,created_at').eq('from_user',Sync.uid).eq('status','pending'),
    sb.from('planner_shared_appointments').select('request_id,user_a,user_b,payload,updated_at').eq('user_a',Sync.uid),
    sb.from('planner_shared_appointments').select('request_id,user_a,user_b,payload,updated_at').eq('user_b',Sync.uid),
    friendLoadMemories().then(function(){return {error:null};})
  ]).then(function(rs){rs.forEach(function(r){if(r&&r.error)throw r.error;});FriendSync.requests=(rs[0].data||[]).concat(rs[1].data||[]);FriendSync.shared=(rs[2].data||[]).concat(rs[3].data||[]);mergeSharedAppointments(FriendSync.shared);autoMemoryFromShared();friendNotifyScan();showNextAppointmentRequest();softRender();}).catch(function(e){if(!/relation|planner_appointment|planner_shared/i.test(e&&e.message||''))FriendSync.error=e&&e.message||'약속 요청을 불러오지 못했어요';});
}
function sendAppointmentRequest(target,data){
  var sb=friendDb();if(!sb){friendNote('친구 요청은 로그인 후 사용할 수 있어요');return;}
  sb.from('planner_appointment_requests').insert({from_user:Sync.uid,to_user:target,payload:data,status:'pending'}).then(function(r){if(r.error)throw r.error;friendNote('약속 수락 요청을 보냈어요');closeModal();render();friendRequestLoad();}).catch(function(e){var m=$('#appointment-msg')||$('#request-msg');if(m)m.textContent=e&&e.message||'약속 요청을 보내지 못했어요';});
}
function respondAppointmentRequest(accept){
  var sb=friendDb(),r=M.request;if(!sb||!r)return;
  var work;
  if(accept){
    var pair=[r.from_user,r.to_user].sort(),pp=JSON.parse(JSON.stringify(r.payload||{})),cs=pp.candidateSelections||{},mine=cleanCandidates(M.requestCandidateSelections||[]);
    if(mine.length)cs[Sync.uid]=mine;pp.candidateSelections=cs;
    var theirs=cs[r.from_user]||cleanCandidates(pp.placeCandidates),common=mine.filter(function(x){return theirs.indexOf(x)>=0;});
    if(!pp.place&&common.length===1){pp.place=common[0];pp.placeInfo=placeInfoFromText(common[0]);pp.placePending=false;pp.placeConfirmedBy=Sync.uid;}
    work=sb.from('planner_shared_appointments').upsert({request_id:r.id,user_a:pair[0],user_b:pair[1],payload:pp,updated_at:new Date().toISOString()},{onConflict:'request_id'});
  }
  else work=Promise.resolve({error:null});
  work.then(function(x){if(x.error)throw x.error;return sb.from('planner_appointment_requests').update({status:accept?'accepted':'declined',responded_at:new Date().toISOString()}).eq('id',r.id).eq('to_user',Sync.uid);}).then(function(x){if(x.error)throw x.error;FriendSync.shown[r.id]=1;return friendRequestLoad();}).then(function(){closeModal();render();if(accept)inAppToast('약속을 수락했어요. 두 사람 캘린더에 들어갔어요');}).catch(function(e){var m=$('#request-msg');if(m)m.textContent=e&&e.message||'처리하지 못했어요';});
}
function sharedAppointmentPayload(e){var p=Object.assign({},e);delete p.id;delete p.shared;delete p.sharedRequestId;return p;}
function updateSharedAppointment(e){
  if(!friendDb()||!e||!e.sharedRequestId)return Promise.resolve();
  var ids=(e.groupRequestIds&&e.groupRequestIds.length?e.groupRequestIds:[e.sharedRequestId]).slice();
  return Promise.all(ids.map(function(rid){return sharedPatch(rid,function(p){['what','place','placeInfo','date','start','end','title'].forEach(function(k){p[k]=e[k]===undefined?null:e[k];});if(p.place)p.placePending=false;});})).then(function(){return friendRequestLoad();});
}
function cancelSharedAppointment(e){var sb=friendDb();if(!sb||!e||!e.sharedRequestId)return Promise.resolve();var ids=(e.groupRequestIds&&e.groupRequestIds.length?e.groupRequestIds:[e.sharedRequestId]).filter(Boolean);return sb.from('planner_appointment_requests').update({status:'cancelled',responded_at:new Date().toISOString()}).in('id',ids).then(function(r){if(r.error)throw r.error;return sb.from('planner_shared_appointments').delete().in('request_id',ids);}).then(function(r){if(r.error)throw r.error;});}
/* ---------- 친구 요청(수락제) · 약속 가능 시간 · 약속 잡기 ---------- */
function meetAvail(){var a=S.settings.meetStart,b=S.settings.meetEnd;a=a==null?9:+a;b=b==null?22:+b;if(b<=a)b=Math.min(24,a+1);return [a,b];}
function hm(m){return pad(Math.floor(m/60))+':'+pad(m%60);}
function slotText(k,a,b){var d=parseKey(k),t=mdTxt(d)+' ('+DAYS[dow(d)]+')';return a==null?t:t+' '+timeShort(hm(a))+'~'+timeShort(hm(b));}
function myDisplayName(){return (S.settings.profileName||'').trim()||FriendSync.code||'친구';}
function weekMon(d){return addDays(d,-dow(d));}
function friendSqlHint(e){var m=(e&&(e.message||e.details||e.code))||String(e||'');return userMsg('연결 중 오류가 났어요. 잠시 뒤 다시 해주세요.',(/does not exist|schema cache|Could not find|relation/i.test(m)?'Supabase 최신 production migration을 적용해주세요.':/permission|row-level|42501/i.test(m)?'권한 설정을 최신 production migration 기준으로 확인해주세요.':'연결 중 오류가 났어요.')+' (자세히: '+m+')');}
function myBusyOn(k){
  var d=parseKey(k),allday=(S.allday||[]).some(function(a){return alldayForPayload(a,d);});
  var r=itemsFor(d).filter(function(it){return !it.skipped&&(it.kind==='class'||it.kind==='event');}).map(function(it){return [it.start,it.end];});
  return {allday:allday,r:r};
}
function friendBusyOn(id,k){var its=friendBusyItems(id,k);return {allday:its.some(function(it){return it.start<=0&&it.end>=1440;}),r:its.map(function(it){return [it.start,it.end,it.name];})};}
function myBusyPayload(){
  var days={},t=new Date();
  for(var i=-1;i<63;i++){var k=dkey(addDays(t,i)),b=myBusyOn(k);if(b.allday)days[k]={a:1};else if(b.r.length)days[k]={r:b.r};}
  return {v:1,avail:meetAvail(),days:days};
}
function friendBusyPush(){
  var sb=friendDb();if(!sb||!FriendSync.loaded||!FriendSync.friends.length)return Promise.resolve();
  var p=myBusyPayload(),j=JSON.stringify(p);if(j===FriendSync.lastBusy)return Promise.resolve();
  return sb.from('planner_friend_busy').upsert({user_id:Sync.uid,payload:p,updated_at:new Date().toISOString()},{onConflict:'user_id'}).then(function(r){if(r.error)throw r.error;FriendSync.lastBusy=j;FriendSync.busyError='';}).catch(function(e){FriendSync.busyError=friendSqlHint(e);});
}
function friendBusyLoad(){
  var sb=friendDb();if(!sb||!FriendSync.friends.length){FriendSync.busyMap={};return Promise.resolve();}
  return sb.from('planner_friend_busy').select('user_id,payload,updated_at').in('user_id',FriendSync.friends.map(function(f){return f.id;})).then(function(r){if(r.error)throw r.error;var m={};(r.data||[]).forEach(function(x){m[x.user_id]=x.payload||{};});FriendSync.busyMap=m;}).catch(function(e){FriendSync.busyError=friendSqlHint(e);});
}
function friendAvail(id){var p=FriendSync.busyMap&&FriendSync.busyMap[id],a=p&&Array.isArray(p.avail)?p.avail:null;return a&&+a[1]>+a[0]?[+a[0],+a[1]]:[9,22];}
function inviteName(id){return FriendSync.inviteNames[id]||'친구';}
function friendInviteLoad(){
  var sb=friendDb();if(!sb)return Promise.resolve();
  var cols='id,from_user,to_user,status,created_at';
  return Promise.all([
    sb.from('planner_friend_invites').select(cols).eq('to_user',Sync.uid).eq('status','pending'),
    sb.from('planner_friend_invites').select(cols).eq('from_user',Sync.uid).eq('status','pending')
  ]).then(function(rs){rs.forEach(function(r){if(r.error)throw r.error;});
    var isFriend=function(id){return FriendSync.friends.some(function(f){return f.id===id;});};
    var prevOut=(FriendSync.invitesOut||[]).map(function(x){return x.id;});
    FriendSync.invitesIn=(rs[0].data||[]).filter(function(x){return !isFriend(x.from_user)&&!isBlockedUser(x.from_user);});
    FriendSync.invitesOut=(rs[1].data||[]).filter(function(x){return !isFriend(x.to_user)&&!isBlockedUser(x.to_user);});
    FriendSync.inviteError='';
    var goneOut=(FriendSync.invitesOutAll||[]).filter(function(x){return !(rs[1].data||[]).some(function(y){return y.id===x.id;});});
    var accepted=goneOut.length>0;FriendSync.invitesOutAll=(rs[1].data||[]).slice();
    var need=FriendSync.invitesIn.map(function(x){return x.from_user;}).concat(FriendSync.invitesOut.map(function(x){return x.to_user;})).filter(function(id){return !FriendSync.inviteNames[id];});
    var named=need.length?friendCodeList(sb,need).then(function(r){if(!FriendSync.invitePhotos)FriendSync.invitePhotos={};(r&&r.data||[]).forEach(function(x){FriendSync.inviteNames[x.user_id]=((x.display_name||'').trim())||x.code;FriendSync.invitePhotos[x.user_id]=x.photo||'';});}):Promise.resolve();
    return named.then(function(){friendNotifyScan();if(accepted){FriendSync.msg='친구 요청이 수락됐어요. 이제 약속을 잡을 수 있어요';return friendLoad().then(function(){goneOut.forEach(function(x){if(FriendSync.friends.some(function(f){return f.id===x.to_user;})){var t=requestFriendCode(x.to_user)+'님이 친구 요청을 수락했어요';pushNotice('friend',t);if(document.hidden)sysNotify('친구가 연결됐어요',t,'fr:'+x.id);else inAppToast(t);}});});}}).then(function(){showNextFriendInvite();softRender();});
  }).catch(function(e){FriendSync.inviteError=friendSqlHint(e);});
}
function showNextFriendInvite(){
  if(M.type||!Sync.uid||U.guest)return;
  var r=(FriendSync.invitesIn||[]).find(function(x){return !FriendSync.shown['inv:'+x.id];});if(!r)return;
  FriendSync.shown['inv:'+r.id]=1;M={type:'friend-invite',invite:r};
  openModal('<h3>새 친구 요청</h3><p class="hint">수락하면 서로 약속을 신청하고 추억을 함께 기록할 수 있어요. 일정 내용은 공유를 켜기 전까지 안 보이고, 바쁜 시간만 회색으로 보여요.</p><div class="requestbox"><b>'+esc(inviteName(r.from_user))+'</b><small>친구 연결을 요청했어요</small></div><p class="hint" id="invite-msg"></p><div class="acts"><button class="b-del" data-act="friend-invite-decline" data-id="'+r.id+'">거절</button><button class="b-save" data-act="friend-invite-accept" data-id="'+r.id+'">수락</button></div>');
}
function friendInviteRespond(id,accept){
  var sb=friendDb(),r=(FriendSync.invitesIn||[]).find(function(x){return x.id===id;});if(!sb||!r)return;
  var pair=[Sync.uid,r.from_user].sort();
  var work=accept?sb.from('planner_friendships').upsert({user_a:pair[0],user_b:pair[1]},{onConflict:'user_a,user_b',ignoreDuplicates:true}).then(function(x){if(x.error)throw x.error;return sb.from('planner_friend_shares').upsert({owner_id:Sync.uid,friend_id:r.from_user,share_calendar:false,share_planner:false},{onConflict:'owner_id,friend_id',ignoreDuplicates:true});}):Promise.resolve({error:null});
  work.then(function(x){if(x&&x.error)throw x.error;return sb.from('planner_friend_invites').update({status:accept?'accepted':'declined',responded_at:new Date().toISOString()}).eq('id',id).eq('to_user',Sync.uid);})
    .then(function(x){if(x.error)throw x.error;FriendSync.invitesIn=FriendSync.invitesIn.filter(function(y){return y.id!==id;});if(accept)pushNotice('friend',inviteName(r.from_user)+'님과 친구가 됐어요');if(M.type==='friend-invite')closeModal();if(M.type==='notices')drawNotices();friendNote(accept?'친구가 연결됐어요. 이제 약속 잡기·추억을 쓸 수 있어요':'친구 요청을 거절했어요');return accept?friendLoad():null;})
    .then(function(){if(!M.type)render();})
    .catch(function(e){var t=friendSqlHint(e),m=$('#invite-msg');if(m)m.textContent=t;else friendNote(t);});
}
function friendInviteCancel(id){
  var sb=friendDb();if(!sb)return;
  sb.from('planner_friend_invites').update({status:'cancelled',responded_at:new Date().toISOString()}).eq('id',id).eq('from_user',Sync.uid).then(function(x){if(x.error)throw x.error;FriendSync.invitesOut=FriendSync.invitesOut.filter(function(y){return y.id!==id;});friendNote('친구 요청을 취소했어요');}).catch(function(e){friendNote(friendSqlHint(e));});
}
function meetHeadHTML(f){return '<div class="meet-head">'+friendAvatar(friendLabel(f),f.photo,'',f.id)+'<div><b class="meet-days-big">'+esc(friendLabel(f))+'</b><span class="meet-days">'+esc(lastMetInfo(f.id))+'</span></div></div>';}
function meetFriendIds(){return (M.friendIds&&M.friendIds.length?M.friendIds:[M.friendId]).filter(Boolean);}
function meetFriends(){return meetFriendIds().map(function(id){return FriendSync.friends.find(function(f){return f.id===id;});}).filter(Boolean);}
function meetGroupNames(){return meetFriends().map(friendLabel);}
function meetGroupLabel(){var n=meetGroupNames();return n.length?n.join(', '):'친구';}
function meetFriendPickerHTML(){
  var ids=meetFriendIds();
  return '<span class="lbl">함께할 친구</span><div class="group-friends">'+
    FriendSync.friends.map(function(f){var on=ids.indexOf(f.id)>=0;return '<button class="group-friend'+(on?' on':'')+'" data-act="meet-friend-toggle" data-id="'+esc(f.id)+'">'+esc(friendLabel(f))+'</button>';}).join('')+
    '</div><div class="group-summary"><b>'+ids.length+'명 선택</b><span> · 모두 비는 시간만 추천해요</span></div>';
}
function meetGroupBusyOn(k){
  var all=[],ids=meetFriendIds(),allday=false;
  ids.forEach(function(id){
    var b=friendBusyOn(id,k),f=FriendSync.friends.find(function(x){return x.id===id;}),nm=f?friendLabel(f):'친구';
    if(b.allday)allday=true;
    (b.r||[]).forEach(function(r){all.push([r[0],r[1],r[2]&&r[2]!=='일정 있음'?nm+' · '+r[2]:nm+' 일정']);});
  });
  return {allday:allday,r:all};
}
function meetGroupAvail(){
  var ids=meetFriendIds(),mine=meetAvail(),lo=mine[0],hi=mine[1];
  ids.forEach(function(id){var a=friendAvail(id);lo=Math.max(lo,a[0]);hi=Math.min(hi,a[1]);});
  if(hi<=lo)return [0,0];
  return [lo,hi];
}
function redrawFriendMeetShell(){
  if(M.type!=='friend-meet')return;
  var av=meetGroupAvail();M.lo=av[0]*60;M.hi=av[1]*60;
  var p=$('#meet-friend-picker');if(p)p.innerHTML=meetFriendPickerHTML();
  var h=$('#meet-group-hint');if(h)h.textContent=av[1]>av[0]?'모두 약속 가능 시간 '+av[0]+':00~'+av[1]+':00 · '+meetGroupLabel():'설정한 약속 가능 시간이 서로 겹치지 않아요.';
  drawMeet();refreshMeetBusy();setTimeout(function(){refreshTaskAssign();bindTaskDrag();},0);
}
function groupAppointmentRows(p){
  if(!p||!p.groupId)return [];
  return (FriendSync.requests||[]).filter(function(r){return r.payload&&r.payload.groupId===p.groupId;});
}
function groupAppointmentStatus(p){
  if(!p||!p.groupId)return '';
  var rows=groupAppointmentRows(p),total=(p.groupMembers&&p.groupMembers.length?Math.max(0,p.groupMembers.length-1):rows.length),ok=0,no=0,wait=0;
  rows.forEach(function(r){if(r.status==='accepted')ok++;else if(r.status==='declined'||r.status==='rejected')no++;else wait++;});
  if(!rows.length)return total?'0/'+total+'명 응답':'';
  return ok+'/'+total+'명 수락'+(no?' · '+no+'명 거절':'')+(wait?' · '+wait+'명 대기':'');
}
function groupAppointmentStatusHTML(p){
  var t=groupAppointmentStatus(p);return t?'<span class="group-status">'+esc(t)+'</span>':'';
}
function groupPersonStatusHTML(p){
  if(!p||!p.groupId)return '';
  var rows=groupAppointmentRows(p),by={};
  rows.forEach(function(r){var uid=r.to_user||r.user_b||'',nm=(r.payload&&r.payload.toName)||requestFriendCode(uid)||'친구';by[uid]={name:nm,status:r.status};});
  var me=myDisplayName()||'나',out=['<span class="group-person">'+esc(me)+' ✓</span>'];
  (p.groupMembers||[]).forEach(function(uid){
    if(uid===Sync.uid)return;var z=by[uid],nm=z?z.name:requestFriendCode(uid),st=z?z.status:'pending';
    out.push('<span class="group-person">'+esc(nm||'친구')+' '+(st==='accepted'?'✓':(st==='declined'||st==='rejected'?'✕':'대기'))+'</span>');
  });
  return '<div class="group-people">'+out.join('')+'</div>';
}

function openFriendMeet(id,pre){
  var f=FriendSync.friends.find(function(x){return x.id===id;});if(!f)return;
  var mon=weekMon(new Date()),wk=mon;if(pre&&pre.date&&pre.date>=dkey(new Date()))wk=weekMon(parseKey(pre.date));
  var info=pre&&(pre.info||(pre.place?placeInfoFromText(pre.place):null));
  M={type:'friend-meet',friendId:id,friendIds:[id],week:wk,minWeek:mon,sel:null,lo:9*60,hi:22*60,pp:ppNew(info,{allowUndecided:true,friendId:id,future:true})};
  if(pre&&pre.date&&pre.start!=null&&pre.end!=null)M.sel={date:pre.date,s:+pre.start,e:+pre.end,step:2};
  var av=meetGroupAvail();M.lo=av[0]*60;M.hi=av[1]*60;
  openModal('<h3>약속 잡기</h3>'+meetHeadHTML(f)+
    '<div id="meet-friend-picker">'+meetFriendPickerHTML()+'</div>'+
    '<p class="meet-mini-hint" id="meet-group-hint">'+(av[1]>av[0]?'가능 '+av[0]+':00~'+av[1]+':00':'가능 시간이 겹치지 않아요.')+'</p>'+
    '<div class="meet-step">시간</div>'+
    '<div id="meet-top3">'+groupTopSlotsHTML()+'</div><p class="hint" id="meet-sel"></p><details class="meet-grid-more"><summary>시간표에서 직접 고르기</summary><div id="meetbox"></div></details>'+
    '<div class="meet-step">장소</div><div id="pp">'+ppHTML(M.pp)+'</div><div id="appointment-candidates"'+(M.pp.mode==='undecided'?'':' style="display:none"')+'>'+candidateInputsHTML([])+'</div>'+
    '<button class="tbtn" style="width:100%;margin:4px 0 8px;text-align:center" data-act="place-reco-toggle">중간 장소 추천</button><div id="place-reco-panel" style="display:none">'+placeRecoPanelHTML()+'</div>'+
    '<details class="meet-advanced"><summary>더 설정하기</summary><div><span class="lbl">뭐 할지</span>'+activityPickerHTML()+'<input class="fld" id="f-mtwhat" maxlength="60" placeholder="직접 적기 (선택)">'+
    '<span class="lbl">할 일</span><input class="fld" id="f-checklist" maxlength="180" placeholder="예: 예약하기, 케이크 사기"><div id="task-assign">'+taskAssignHTML()+'</div>'+
    '<span class="lbl">조건</span><div class="meet-condition-options"><select class="fld" id="f-min-duration"><option value="60">1시간 이상</option><option value="120">2시간 이상</option><option value="180">3시간 이상</option><option value="240">4시간 이상</option></select><select class="fld" id="f-area-pref"><option value="">권역 상관없음</option><option>서울 동쪽</option><option>서울 서쪽</option><option>서울 남쪽</option><option>서울 북쪽</option><option>경기</option></select></div><input class="fld" id="f-poll-deadline" type="datetime-local" aria-label="투표 마감"></div></details>'+
    '<p class="hint" id="appointment-msg"></p><div class="acts"><button class="b-ghost" data-act="close">닫기</button><button class="b-save" data-act="meet-send">약속 보내기</button></div>');
  var meetSheet=document.querySelector('#modal .sheet');if(meetSheet)meetSheet.classList.add('meet-sheet');
  if(pre&&pre.what)$('#f-mtwhat').value=pre.what;
  if(M.sel){var ms=$('#meet-sel');if(ms)ms.textContent='선택 · '+slotText(M.sel.date,M.sel.s,M.sel.e);var prp=$('#place-reco-panel');if(prp&&prp.style.display!=='none'){M.placePeople=meetPlacePeople();prp.innerHTML=placeRecoPanelHTML();}}
  drawMeet();refreshMeetBusy();
}
/* 창을 열 때 친구의 최신 바쁜 시간을 한 번 더 받아와요 */
function refreshMeetBusy(){var m0=M;friendBusyLoad().then(function(){if(M===m0&&$('#meetbox'))drawMeet();});}
function meetState(k,m){
  var now=new Date(),tk=dkey(now);
  if(k<tk||(k===tk&&m+30<=now.getHours()*60+now.getMinutes()))return 'past';
  var fb=M.type==='friend-meet'?meetGroupBusyOn(k):friendBusyOn(M.friendId,k);if(fb.allday||fb.r.some(function(r){return r[0]<m+30&&r[1]>m;}))return 'fb';
  var mb=myBusyOn(k);if(mb.allday||mb.r.some(function(r){return r[0]<m+30&&r[1]>m;}))return 'mb';
  return '';
}
function meetGridHTML(){
  var ws=M.week,tk=dkey(new Date()),now=new Date(),nowM=now.getHours()*60+now.getMinutes(),cols=[];
  for(var i=0;i<7;i++){var d=addDays(ws,i),k=dkey(d);
    var pend=M.type==='friend-meet'?FriendSync.requests.filter(function(r){return r.status==='pending'&&r.from_user===Sync.uid&&r.to_user===M.friendId&&r.payload&&r.payload.date===k&&r.payload.start;}).map(function(r){var a=toMin(r.payload.start);return [a,r.payload.end?toMin(r.payload.end):a+60];}):[];
    cols.push({d:d,k:k,fb:(M.type==='friend-meet'?meetGroupBusyOn(k):friendBusyOn(M.friendId,k)),mb:myBusyOn(k),pend:pend});}
  var hit=function(rs,m){return rs.some(function(r){return r[0]<m+30&&r[1]>m;});};
  var h='<div class="mgh"></div>'+cols.map(function(c,i){return '<div class="mgh'+(c.k===tk?' td':'')+'">'+DAYS[i]+'<b>'+c.d.getDate()+'</b>'+(c.fb.allday||c.mb.allday?'<em>종일</em>':'')+'</div>';}).join('');
  for(var m=M.lo;m<M.hi;m+=30){
    h+='<span class="mt">'+(m%60===0?m/60:'')+'</span>';
    cols.forEach(function(c){
      var st=(c.k<tk||(c.k===tk&&m+30<=nowM))?'past':(c.fb.allday||hit(c.fb.r,m))?'fb':(c.mb.allday||hit(c.mb.r,m))?'mb':'';
      var sel=M.sel&&M.sel.date===c.k&&m>=M.sel.s&&m<M.sel.e,org=!sel&&M.orig&&M.orig.date===c.k&&m>=M.orig.s&&m<M.orig.e;
      var lb='';if(st==='fb'&&!sel){var fr=c.fb.r.find(function(r){return r[2]&&r[2]!=='일정 있음'&&r[0]<m+30&&r[1]>m&&(r[0]>=m||m===M.lo);});if(fr)lb='<i>'+esc(fr[2])+'</i>';}
      h+='<button class="mc'+(st?' '+st:'')+(sel?' pick':'')+(org?' orig':'')+(hit(c.pend,m)?' pend':'')+'" data-act="meet-cell" data-k="'+c.k+'" data-m="'+m+'"'+(st?' aria-disabled="true"':'')+' aria-label="'+esc(slotText(c.k,m,m+30))+'">'+lb+'</button>';
    });
  }
  var we=addDays(ws,6),canPrev=!M.minWeek||ws>M.minWeek;
  return '<div class="meetnav"><button class="tbtn" data-act="meet-week" data-v="-1"'+(canPrev?'':' disabled')+'>‹</button><b>'+(ws.getMonth()+1)+'/'+ws.getDate()+' – '+(we.getMonth()+1)+'/'+we.getDate()+'</b><button class="tbtn" data-act="meet-week" data-v="1">›</button></div>'+
    '<div class="meetlegend"><span><i class="fb"></i>친구 일정</span><span><i class="mb"></i>내 일정</span><span><i class="pick"></i>고른 시간</span>'+(M.type==='friend-meet'?'<span><i style="outline:2px dashed var(--accent);outline-offset:-2px"></i>수락 대기</span>':M.orig?'<span><i style="outline:2px dashed var(--accent);outline-offset:-2px"></i>제안받은 시간</span>':'')+'</div>'+
    '<div class="meetgrid">'+h+'</div>';
}
function meetSuggest(dur){
  var out=[],now=new Date(),cache={};
  for(var i=0;i<21&&out.length<3;i++){var k=dkey(addDays(now,i));
    for(var m=M.lo;m+dur<=M.hi;m+=30){var okk=true;for(var x=m;x<m+dur;x+=30){if(meetState(k,x)){okk=false;break;}}if(okk){out.push({date:k,s:m,e:m+dur});break;}}}
  return out;
}
function meetSuggestHTML(){
  if(M.type!=='friend-meet')return '';
  var dur=M.dur||60,sg=meetSuggest(dur);
  return '<div class="meetsug"><span>둘 다 비는 가장 빠른 시간</span><div class="meetsug-row"><button class="chipt'+(dur===60?' on':'')+'" data-act="meet-dur" data-v="60">1시간</button><button class="chipt'+(dur===120?' on':'')+'" data-act="meet-dur" data-v="120">2시간</button>'+
    (sg.length?sg.map(function(x){var on=M.sel&&M.sel.date===x.date&&M.sel.s===x.s&&M.sel.e===x.e;return '<button class="sugchip'+(on?' on':'')+'" data-act="meet-pick" data-k="'+x.date+'" data-s="'+x.s+'" data-e="'+x.e+'">'+esc(slotText(x.date,x.s,x.e))+'</button>';}).join(''):'<small>3주 안에 겹치는 빈 시간이 없어요</small>')+'</div></div>';
}
function meetSelChanged(){var a=M.sel,b=M.orig;if(!a)return false;if(!b)return true;return a.date!==b.date||a.s!==b.s||a.e!==b.e;}
function drawMeet(){
  var box=$('#meetbox');if(!box)return;
  var sc=box.querySelector('.meetgrid'),top=sc?sc.scrollTop:null;
  box.innerHTML=meetSuggestHTML()+meetGridHTML();
  var g=box.querySelector('.meetgrid');
  if(g){if(top!=null)g.scrollTop=top;else if(M.sel){var c=g.querySelector('.mc.pick');if(c)g.scrollTop=Math.max(0,c.offsetTop-g.offsetTop-60);}}
  var info=$('#meet-sel'),s=M.sel,txt;
  if(M.type==='friend-meet')txt=s?'고른 시간 · '+slotText(s.date,s.s,s.e)+(s.step===1?' · 한 번 더 누르면 끝 시간을 정해요':''):'빈 칸을 눌러 시간을 골라요';
  else{var o=M.orig,warn=o&&(function(){var mb=myBusyOn(o.date);return mb.allday||mb.r.some(function(r){return r[0]<o.e&&r[1]>o.s;});})();
    txt=(warn?'주의 · 제안받은 시간에 내 일정이 있어요. ':'')+(meetSelChanged()?'다시 제안할 시간 · '+slotText(s.date,s.s,s.e):'');}
  if(info)info.textContent=(M.meetMsg?M.meetMsg+' ':'')+txt;
  var acts=$('#meet-acts');
  if(acts){var ch=meetSelChanged();acts.innerHTML='<button class="b-del" data-act="appointment-decline">거절</button>'+(ch?'<button class="b-ghost" data-act="appointment-counter">다시 제안</button>':'')+'<button class="b-save" data-act="appointment-accept">'+(ch&&M.orig?'원래 시간 수락':'수락')+'</button>';}
}
function meetTap(k,m){
  if(meetState(k,m))return;
  var s=M.sel;M.meetMsg='';
  if(s&&s.step===1&&s.date===k&&m>=s.s){
    for(var x=s.s;x<=m;x+=30)if(meetState(k,x)){M.sel={date:k,s:m,e:m+30,step:1};M.meetMsg='중간에 일정이 있어서 여기서 다시 시작해요.';drawMeet();return;}
    M.sel={date:k,s:s.s,e:m+30,step:2};
  }else M.sel={date:k,s:m,e:m+30,step:1};
  drawMeet();
}

function meetPollDeadline(){
  var el=document.querySelector('#f-poll-deadline');return el&&el.value?el.value:'';
}
function checklistClean(a){
  return (a||[]).map(function(x){return typeof x==='string'?{id:'ck_'+Math.random().toString(36).slice(2),text:x,owner:'all',doneBy:[]}:x;})
    .filter(function(x){return x&&String(x.text||'').trim();});
}
function checklistHTML(p){
  var a=checklistClean(p&&p.checklist||[]);if(!a.length)return '';
  return '<div class="shared-checklist"><b>같이 준비하기</b>'+a.map(function(x){
    var done=(x.doneBy||[]).indexOf(Sync.uid)>=0;
    return '<button class="shared-check '+(done?'on':'')+'" data-act="group-check" data-rid="'+esc(p.sharedRequestId||'')+'" data-id="'+esc(x.id)+'"><span>'+(done?'✓':'○')+'</span><em>'+esc(x.text)+'</em><small>'+esc(x.owner==='all'?'같이':x.owner)+'</small></button>';
  }).join('')+'</div>';
}
function groupTopSlots(limit){
  limit=limit||3;if(M.type!=='friend-meet')return [];
  var out=[],base=M.week||weekMon(new Date()),lo=M.lo||540,hi=M.hi||1320;
  for(var di=0;di<7;di++){
    var d=addDays(base,di),k=dkey(d);
    var dur=+(($('#f-min-duration')&&$('#f-min-duration').value)||60);
    for(var m=lo;m+dur<=hi;m+=30){
      var ok=true;for(var q=m;q<m+dur;q+=30){if(meetState(k,q)!==''){ok=false;break;}}
      if(ok){out.push({date:k,s:m,e:m+dur});if(out.length>=limit)return out;}
    }
  }
  return out;
}
function groupTopSlotsHTML(){
  var a=groupTopSlots(3);if(!a.length)return '<p class="hint">이번 주에는 모두가 1시간 이상 비는 시간이 없어요.</p>';
  return '<div class="top-slots"><b>추천 시간</b><div>'+a.map(function(x,i){
    return '<button class="sugchip" data-act="meet-top-slot" data-date="'+x.date+'" data-s="'+x.s+'" data-e="'+x.e+'">'+(i+1)+'순위 · '+mdTxt(parseKey(x.date))+' '+hm(x.s)+'</button>';
  }).join('')+'</div></div>';
}
function memoryPhotoCardHTML(m){
  if(!m||!m.photo)return '';
  return '<div class="memory-photo-card"><img src="'+esc(m.photo)+'" alt=""><div><b>'+esc(m.visited_at||'')+' · '+esc(memoryAreaLabel(m)||m.place||'추억')+'</b><small>'+esc(m.what||'함께한 시간')+'</small></div></div>';
}

var MEET_ACTIVITIES=['밥','카페','술','산책','공부','쇼핑','전시','영화','운동','여행','기타'];
function selectedMeetActivities(){
  return Array.from(document.querySelectorAll('.activity-chip.on')).map(function(x){return x.dataset.v;});
}
function activityPickerHTML(){
  return '<div class="meet-activity-picks">'+MEET_ACTIVITIES.map(function(x){return '<button type="button" class="activity-chip" data-act="meet-activity" data-v="'+esc(x)+'">'+esc(x)+'</button>';}).join('')+'</div>';
}
function parseMeetTasks(){
  var raw=String(($('#f-checklist')&&$('#f-checklist').value)||''),old=(M&&M.taskAssign)||{};
  return raw.split(',').map(function(x){return x.trim();}).filter(Boolean).map(function(x,i){
    var id='task_'+i+'_'+x.replace(/\s+/g,'_').slice(0,20),prev=old[id]||[];
    return {id:id,text:x,ownerIds:prev.slice(),doneBy:[]};
  });
}
function taskAssignHTML(){
  var people=[{id:Sync.uid,name:myDisplayName()||'나'}].concat(meetFriends().map(function(f){return {id:f.id,name:friendLabel(f)};}));
  var tasks=parseMeetTasks();M.taskAssign=M.taskAssign||{};
  if(!tasks.length)return '<div class="task-assign-wrap"><p class="hint">할 일을 적으면 담당자를 정할 수 있어요.</p></div>';
  return '<div class="task-assign-wrap"><b>누가 할까요?</b><p class="hint">드래그 대신 이름을 눌러 선택해요. 여러 명 선택도 가능해요.</p>'+tasks.map(function(t){var ids=M.taskAssign[t.id]||[];return '<div class="task-row"><span>'+esc(t.text)+'</span><div class="task-drop">'+people.map(function(p){return '<button type="button" class="task-person '+(ids.indexOf(p.id)>=0?'on':'')+'" data-act="task-person-toggle" data-task="'+esc(t.id)+'" data-uid="'+esc(p.id)+'">'+esc(p.name)+'</button>';}).join('')+'</div></div>';}).join('')+'</div>';
}
function refreshTaskAssign(){var x=$('#task-assign');if(x)x.innerHTML=taskAssignHTML();}
function bindTaskDrag(){}
function assignedChecklist(){
  var tasks=parseMeetTasks(),people=[{id:Sync.uid,name:myDisplayName()||'나'}].concat(meetFriends().map(function(f){return {id:f.id,name:friendLabel(f)};}));
  return tasks.map(function(t){var ids=(M.taskAssign&&M.taskAssign[t.id])||[],names=ids.map(function(uid){var p=people.find(function(z){return z.id===uid;});return p&&p.name;}).filter(Boolean);return {id:t.id,text:t.text,ownerIds:ids,owner:names.length?names.join(', '):'같이',doneBy:[]};});
}
function meetSend(){
  var ids=meetFriendIds(),s0=M.sel,msg=$('#appointment-msg'),activities=selectedMeetActivities(),minDuration=+(($('#f-min-duration')&&$('#f-min-duration').value)||60),areaPref=(($('#f-area-pref')&&$('#f-area-pref').value)||''),pollDeadline=($('#f-poll-deadline')&&$('#f-poll-deadline').value)||'',checklist=assignedChecklist();if(!ids.length){if(msg)msg.textContent='약속에 초대할 친구를 한 명 이상 골라주세요';return;}
  if(!s0){var i=$('#meet-sel');if(i)i.textContent='먼저 모두 비는 흰 칸을 눌러 시간을 골라주세요';if(msg)msg.textContent='위 표에서 시간을 먼저 골라주세요';return;}
  var info=ppInfo(M.pp);
  if(M.pp.mode!=='undecided'&&!info){if(msg)msg.textContent='장소를 고르거나 “미정”을 눌러주세요';return;}
  var place=placeInfoText(info),what=$('#f-mtwhat').value.trim(),names=meetGroupNames(),deadline=meetPollDeadline();
  var candidates=info?[]:cleanCandidates(Array.from(document.querySelectorAll('.f-place-candidate')).map(function(x){return x.value;})),cs={};
  if(candidates.length)cs[Sync.uid]=candidates.slice();
  var groupId='grp_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8),sb=friendDb();
  if(!sb){if(msg)msg.textContent='로그인 후 사용할 수 있어요';return;}
  var rows=ids.map(function(id){
    var f=FriendSync.friends.find(function(x){return x.id===id;}),name=friendLabel(f);
    return {from_user:Sync.uid,to_user:id,status:'pending',payload:{kind:'appointment',title:what||place||(names.join(', ')+' 약속'),what:what,person:names.join(', '),place:place,placeInfo:info,placePending:!place,placeCandidates:candidates,candidateSelections:JSON.parse(JSON.stringify(cs)),date:s0.date,start:hm(s0.s),end:hm(Math.min(s0.e,1439)),color:defCol(),fromUser:Sync.uid,fromName:myDisplayName(),toName:name,groupId:groupId,groupMembers:[Sync.uid].concat(ids),groupNames:[myDisplayName()].concat(names),pollDeadline:pollDeadline,checklist:checklist,activities:activities,minDuration:minDuration,areaPref:areaPref}};
  });
  Promise.all(rows.map(function(row){return sb.from('planner_appointment_requests').insert(row);})).then(function(rs){
    var bad=rs.find(function(r){return r.error;});if(bad)throw bad.error;
    friendNote(ids.length+'명에게 약속 요청을 보냈어요');closeModal();render();return friendRequestLoad();
  }).catch(function(e){if(msg)msg.textContent=e&&e.message||'약속 요청을 보내지 못했어요';});
}
function counterAppointment(){
  var r=M.request,s=M.sel,sb=friendDb();if(!sb||!r||!s)return;
  var name=requestFriendCode(r.from_user),p=Object.assign({},r.payload||{},{date:s.date,start:hm(s.s),end:hm(Math.min(s.e,1439)),fromUser:Sync.uid,fromName:myDisplayName(),toName:name,person:name,counterOf:r.id});
  sb.from('planner_appointment_requests').update({status:'declined',responded_at:new Date().toISOString()}).eq('id',r.id).eq('to_user',Sync.uid).then(function(x){if(x.error)throw x.error;FriendSync.shown[r.id]=1;sendAppointmentRequest(r.from_user,p);}).catch(function(e){var m=$('#request-msg');if(m)m.textContent=e&&e.message||'다시 제안하지 못했어요';});
}
function meetAvailSelHTML(id,v,lo,hi){var o='';for(var h=lo;h<=hi;h++)o+='<option value="'+h+'"'+(h===v?' selected':'')+'>'+h+':00</option>';return '<select class="sel" id="'+id+'" style="flex:none;width:84px">'+o+'</select>';}
function copyTextSafe(txt,ok,fail){
  var legacy=function(){var t=document.createElement('textarea');t.value=txt;t.setAttribute('readonly','');t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();var done=false;try{done=document.execCommand('copy');}catch(x){}t.remove();(done?ok:(fail||ok))();};
  try{if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(ok,legacy);else legacy();}catch(e){legacy();}
}
function friendCopyCode(){if(!FriendSync.code)return;copyTextSafe(FriendSync.code,function(){friendNote('초대코드를 복사했어요');},function(){friendNote('복사가 막혀 있어요. 코드 '+FriendSync.code+'를 직접 알려주세요');});}
function friendSharedLabels(d){
  if(!FriendSync.incoming.length)return [];
  var k=dkey(d),seen={},chips=[];
  FriendSync.incoming.forEach(function(r){var p=r.payload||{},f=FriendSync.friends.find(function(x){return x.id===r.owner_id;}),detail=!!(f&&f.inPlanner);(p.events||[]).filter(function(e){return eventOnDate(e,k);}).forEach(function(e){var id=r.owner_id+'|e|'+e.id;if(seen[id])return;seen[id]=1;chips.push({text:detail?eventChipLabel(e):'일정 있음',color:detail?(e.color||defCol()):'#c9c9c9'});});(p.allday||[]).filter(function(a){return alldayForPayload(a,d);}).forEach(function(a){var id=r.owner_id+'|a|'+a.id;if(seen[id])return;seen[id]=1;chips.push({text:detail?(a.title||'일정'):'일정 있음',color:detail?(a.color||defCol()):'#c9c9c9'});});});
  return chips;
}
function friendScheduleHTML(d){
  var chips=friendSharedLabels(d).map(function(x){return '<span class="adchip" style="--c:'+x.color+'">'+esc(x.text)+'</span>';});
  return chips.length?'<div class="adrow"><span class="adlabel">친구 공유</span>'+chips.join('')+'</div>':'';
}
function alldayForPayload(a,d){var k=dkey(d),w=dow(d);return a.days?(a.days.indexOf(w)>=0&&(!a.from||k>=a.from)&&(!a.to||k<=a.to)):(k>=a.date&&k<=(a.end||a.date));}
function friendPlannerHTML(k){
  var rows=[];FriendSync.incoming.filter(function(r){return r.kind==='planner';}).forEach(function(r){var p=r.payload||{},ts=(p.todos||[]).filter(function(t){return t.scope==='day'&&t.key===k;}),cs=(p.classes||[]).filter(function(c){return c.day===dow(parseKey(k))&&clsActive(c,k);});if(ts.length||cs.length)rows.push('<div class="friend-plan"><b>'+esc(friendLabel(FriendSync.friends.find(function(f){return f.id===r.owner_id;}))||'공유 플래너')+'</b><small>'+(cs.length?'수업 '+cs.length+'개 · ':'')+'할 일 '+ts.filter(function(t){return !t.done;}).length+'/'+ts.length+'개</small></div>');});
  return rows.length?'<section class="card"><div class="card-h"><h3>친구 공유 플래너</h3><span class="cnt">보기 전용</span></div>'+rows.join('')+'</section>':'';
}
function pendingAppointmentHTML(k){
  var xs=FriendSync.requests.filter(function(r){return r.from_user===Sync.uid&&r.status==='pending'&&r.payload&&r.payload.date===k;});
  return xs.length?'<div class="adrow"><span class="adlabel">수락 대기</span>'+xs.map(function(r){return '<span class="adchip" style="--c:'+((r.payload&&r.payload.color)||defCol())+'">'+esc((r.payload&&r.payload.what)||'약속')+' · 친구에게 요청함</span>';}).join('')+'</div>':'';
}
function scheduleSync(){
  if(Sync.deleting)return;
  if(!Sync.db){setSyncUI('local');return;}
  setSyncUI('saving');
  clearTimeout(Sync.timer);
  Sync.timer=setTimeout(push,1200);
}
var COLS=['classes','events','todos','routines','exams','allday','trackers','selfchat','diaries','dayCloses','ddays'];
var MAPS=['memos','logs','letters','focus','fsess','retro','weeklyRetro','hourNotes','routineDone','modeStates'];
function idsOf(st){var o={};COLS.forEach(function(c){o[c]={};(st[c]||[]).forEach(function(x){o[c][x.id]=1;});});return o;}
/* 설정(학교·색·배경·프로필 등)은 더 최근에 바꾼 쪽을 따르고, 학교 설정 완료는 한 번 하면 계속 유지해요 */
var PREF_KEYS=['theme','bg','defColor','school','schoolCampus','profileName','profilePhoto','homeStation','originRules','originWeekOverrides','meetStart','meetEnd','hStart','hEnd','weekend','semStart','semEnd','topN','topShow','calDday','calItem','monthItems','letterOn','letterSkipComposeDate','holiOff','logDisplay','wakeGoal','logOn','remindOn','friendNotify','pinnedFriends','topOrder','schoolConfigured','onboardDone','plannerMode','showSchoolLinks','showNextTodo','showTodoTab','locationEnabled','diaryMinutes','showMeetMaker','liteHome','showLog','showDiary','showMemo','showWeeklyReview','diaryRuled','morningBriefing','morningBriefingTime','recipes','market','smartPlan'];
function prefHash(st){try{var s=st&&st.settings||{};return JSON.stringify(PREF_KEYS.map(function(k){return s[k]===undefined?null:s[k];}));}catch(e){return '';}}
var PREF_H='';
function mergeSettings(ls,rs){
  /* 간단한 홈 이전에 만든 계정·백업이면, 새 기기 기본값(간단한 홈)이 원래 화면을 덮지 않게 해요. */
  if(rs.liteHome===undefined&&Object.keys(rs).length)ls.liteHome=false;
  if((+rs.prefsAt||0)>(+ls.prefsAt||0)){PREF_KEYS.forEach(function(k){if(rs[k]!==undefined)ls[k]=JSON.parse(JSON.stringify(rs[k]));});ls.prefsAt=rs.prefsAt;}
  if(rs.schoolConfigured||rs.onboardDone){if(!ls.schoolConfigured&&rs.school){ls.school=rs.school;ls.schoolCampus=rs.schoolCampus;}ls.schoolConfigured=true;ls.onboardDone=true;}
  ['profileName','profilePhoto','homeStation','defColor'].forEach(function(k){if(!ls[k]&&rs[k])ls[k]=rs[k];});
  if((!Array.isArray(ls.originRules)||!ls.originRules.length)&&Array.isArray(rs.originRules))ls.originRules=rs.originRules;
  if((!Array.isArray(ls.originWeekOverrides)||!ls.originWeekOverrides.length)&&Array.isArray(rs.originWeekOverrides))ls.originWeekOverrides=rs.originWeekOverrides;
  var byId=function(a,b){var seen={},out=[];(a||[]).concat(b||[]).forEach(function(x){var id=x&&(x.id||JSON.stringify(x));if(!id||seen[id])return;seen[id]=1;out.push(x);});return out;};
  ls.customSchools=byId(ls.customSchools,rs.customSchools);ls.friendMemories=byId(ls.friendMemories,rs.friendMemories);
  /* Shop 구매권은 한 기기의 오래된 설정 때문에 사라지면 안 돼요. 구매 상품/기록은 합집합으로 병합합니다. */
  ls.market=ls.market&&typeof ls.market==='object'?ls.market:{};rs.market=rs.market&&typeof rs.market==='object'?rs.market:{};
  var mkUnion=function(a,b){var seen={},out=[];(a||[]).concat(b||[]).forEach(function(x){var id=typeof x==='string'?x:(x&&x.id);if(!id||seen[id])return;seen[id]=1;out.push(x);});return out;};
  ls.market.owned=mkUnion(ls.market.owned,rs.market.owned);
  ls.market.purchaseLog=mkUnion(ls.market.purchaseLog,rs.market.purchaseLog);
  if(!ls.market.active&&rs.market.active)ls.market.active=JSON.parse(JSON.stringify(rs.market.active));
  if(!ls.market.wishlist&&rs.market.wishlist)ls.market.wishlist=JSON.parse(JSON.stringify(rs.market.wishlist));
  ls.memToasted=Object.assign({},rs.memToasted||{},ls.memToasted||{});
}
function mergeState(loc,rem,base){
  var out=JSON.parse(JSON.stringify(loc));
  COLS.forEach(function(c){
    var have={};out[c].forEach(function(x){have[x.id]=1;});
    (rem[c]||[]).forEach(function(x){
      if(have[x.id])return;
      if(base&&base[c]&&base[c][x.id])return;   // 이 기기에서 지운 것
      out[c].push(x);                              // 다른 기기에서 새로 만든 것
    });
    if(base&&base[c]){ // 다른 기기에서 지운 것: base엔 있었는데 원격엔 없음
      var rid={};(rem[c]||[]).forEach(function(x){rid[x.id]=1;});
      out[c]=out[c].filter(function(x){return !(base[c][x.id]&&!rid[x.id]);});
    }
  });
  MAPS.forEach(function(m){var r=rem[m]||{};out[m]=out[m]||{};Object.keys(r).forEach(function(k){if(out[m][k]===undefined)out[m][k]=r[k];});});
  mergeSettings(out.settings||(out.settings={}),rem.settings||{});
  return normalize(out);
}
function applyRemote(st,at){
  /* 원격 반영 전 현재 상태를 보관해, 다른 기기의 빈/옛 데이터로
     시험·일정이 덮여도 되돌릴 수 있게 해요. */
  try{if(S&&hasPlannerData(S)){bkPut(bkOwner()?'remote.'+bkOwner():'remote',JSON.stringify(S));saveLocalBackupLayers(S);}}catch(e){}
  S=st;S.updatedAt=at;PREF_H=prefHash(S);
  try{localStorage.setItem(KEY,JSON.stringify(S));storageOK=true;}catch(e){storageOK=false;}
  if(Sync&&Sync.uid){saveAccountState(Sync.uid,S);vaultPut(Sync.uid,S);}
  var ae=document.activeElement;
  if(M.type==='login'){closeModal();ae=null;}
  if(!M.type&&!(ae&&/INPUT|TEXTAREA|SELECT/.test(ae.tagName)))render();
}
function saveMeta(){lsSet('planner.sync.'+(Sync.uid||'local'),JSON.stringify({lastSeen:Sync.lastSeen||0,base:Sync.base||null}));}
function loadMeta(){Sync.lastSeen=0;Sync.base=null;try{var m=JSON.parse(lsGet('planner.sync.'+(Sync.uid||'local'))||'null');if(m){Sync.lastSeen=m.lastSeen||0;Sync.base=m.base||null;}}catch(e){}}
function reconcile(r){
  var rat=+r.updatedAt||0,rem=normalize(JSON.parse(r.json));
  var localAt=S.updatedAt||0;
  /* 내용이 있는 기기에 데이터 0개인 원격 상태가 들어오면 자동 반영하지 않아요.
     같은 계정의 빈 상태가 먼저 저장된 경우에도 사용자가 직접 선택하게 해요. */
  var localHasData=hasPlannerData(S),remoteHasData=hasPlannerData(rem);
  if(localHasData&&!remoteHasData&&rat!==localAt&&Sync.examGuardAt!==rat){
    Sync.examGuardAt=rat;
    try{bkPut(bkOwner()?'remote.'+bkOwner():'remote',JSON.stringify(S));}catch(e){}
    if(Sync.kind==='supa'){autoMerge(r,rat);return false;}
    return false;
  }
  var dirty=localAt>0&&(!Sync.lastSeen||localAt>Sync.lastSeen);
  /* 재로그인/다른 기기에서 계정 데이터를 불러올 때 원격 JSON에 일부 묶음이 빠져 있어도
     이 기기의 시간표·시험·일정을 삭제하지 않아요. 서버와 로컬 중 한쪽에만 있는 항목은
     우선 합쳐서 보존하고, 합쳐진 상태를 다시 계정에 저장합니다. */
  if(!dirty){
    if(!localHasData&&remoteHasData){applyRemote(rem,rat);Sync.lastSeen=rat;Sync.base=idsOf(S);saveMeta();return false;}
    if(localHasData&&!remoteHasData){Sync.lastSeen=rat;Sync.base=idsOf(S);saveMeta();return true;}
    var safe=mergeStateV2(S,rem);
    var changed=JSON.stringify(safe)!==JSON.stringify(rem);
    if(changed){safe.updatedAt=Math.max(Date.now(),rat+1);applyRemote(safe,safe.updatedAt);Sync.lastSeen=rat;Sync.base=idsOf(S);saveMeta();return true;}
    applyRemote(rem,rat);Sync.lastSeen=rat;Sync.base=idsOf(S);saveMeta();return false;
  }
  /* 데이터 손실 방지가 우선이라 로그인 동기화에서는 삭제 추론을 하지 않아요.
     명시적으로 앱에서 삭제한 직후의 일반 저장은 push()가 처리합니다. */
  var m=mergeStateV2(S,rem);
  m.updatedAt=Math.max(Date.now(),rat+1);applyRemote(m,m.updatedAt);
  Sync.lastSeen=rat;Sync.base=idsOf(S);saveMeta();return true;
}
function cloudGuardSnap(json){
  if(Sync.deleting)return Promise.resolve();
  if(Sync.kind!=='supa'||!Sync.uid||!Sync.sb)return Promise.resolve();
  var d=new Date(),k=dkey(d)+'~'+pad(d.getHours())+pad(d.getMinutes());
  try{return encryptCloudValue(json).then(function(cipher){return Sync.sb.from('planner_snapshots').upsert({user_id:Sync.uid,date:k,json:cipher,updated_at:Date.now()});}).then(function(){},function(){});}catch(e){return Promise.resolve();}
}
function snapDates(){try{return JSON.parse(lsGet('planner.snapDates')||'[]');}catch(e){return [];}}
function snapshotIfNeeded(){
  if(Sync&&Sync.deleting)return;
  if(!hasPlannerData(S))return;
  var now=new Date(),tk=todayKey(),ds=snapDates();
  /* 기기에는 일별 복원 지점 30일을 별도로 유지 */
  if(!ds.length||ds[ds.length-1]!==tk){
    var json=JSON.stringify(S);bkPut('snap.'+tk,json);ds.push(tk);
    while(ds.length>30){var old=ds.shift();bkDel('snap.'+old);}
    lsSet('planner.snapDates',JSON.stringify(ds));
  }
  cloudSnapshotTiers(now,JSON.stringify(S));
}
function cloudSnapshotTiers(now,json){
  if(Sync.deleting)return;
  if(Sync.kind!=='supa'||!Sync.uid||!Sync.sb)return;
  /* 전문 앱식 소형 보존정책: 최근 24시간=시간별, 최근 30일=일별, 최근 12개월=월별
     - 시간별: 그 시간의 최신 상태로 갱신 (저장할 때마다가 아니라 10분에 한 번)
     - 일별·월별: 그날/그달 처음 저장된 상태만 남기고 덮어쓰지 않아요.
       (예전엔 저장할 때마다 오늘·이번 달 사본까지 덮어써서, 데이터가 날아가면 그 사본도 같이 날아갔어요) */
  var hour='h:'+dkey(now)+'~'+pad(now.getHours());
  var day='d:'+dkey(now);
  var month='m:'+now.getFullYear()+'-'+pad(now.getMonth()+1);
  var tick=+lsGet('planner.cloudSnapAt.'+Sync.uid)||0;
  var firstKey=lsGet('planner.cloudSnapDay.'+Sync.uid)!==day;
  if(!firstKey&&Date.now()-tick<600000)return;
  lsSet('planner.cloudSnapAt.'+Sync.uid,String(Date.now()));
  var uid=Sync.uid,sb=Sync.sb;
  encryptCloudValue(json).then(function(cipher){
    var row=function(k){return {user_id:uid,date:k,json:cipher,updated_at:Date.now()};};
    return sb.from('planner_snapshots').upsert([row(hour)]).then(function(r1){
      if(r1&&r1.error)throw r1.error;
      return sb.from('planner_snapshots').upsert([row(day),row(month)],{ignoreDuplicates:true});
    }).then(function(r2){
      if(r2&&r2.error)throw r2.error;
      lsSet('planner.cloudSnapDay.'+uid,day);
      Sync.snapOk=Date.now();Sync.snapErr='';
      pruneCloudSnapshotTiers();
    });
  }).catch(function(e){
    Sync.snapErr=syncErrorText(e)||'알 수 없는 오류';
    lsSet('planner.cloudSnapAt.'+uid,'0');
    try{console.error('[planner snapshot]',e);}catch(_){}
  });
}
function pruneCloudSnapshotTiers(){
  if(Sync.kind!=='supa'||!Sync.uid||!Sync.sb)return;
  var hcut=new Date(Date.now()-24*3600000),dcut=addDays(new Date(),-30),mcut=new Date();mcut.setMonth(mcut.getMonth()-12);
  var hk='h:'+dkey(hcut)+'~'+pad(hcut.getHours()),dk='d:'+dkey(dcut),mk='m:'+mcut.getFullYear()+'-'+pad(mcut.getMonth()+1);
  /* prefix 범위 안에서만 삭제해서 다른 종류의 복원 지점은 건드리지 않음 */
  Sync.sb.from('planner_snapshots').delete().eq('user_id',Sync.uid).like('date','h:%').lt('date',hk).then(function(){},function(){});
  Sync.sb.from('planner_snapshots').delete().eq('user_id',Sync.uid).like('date','d:%').lt('date',dk).then(function(){},function(){});
  Sync.sb.from('planner_snapshots').delete().eq('user_id',Sync.uid).like('date','m:%').lt('date',mk).then(function(){},function(){});
}
function fetchCloudSnaps(){
  if(Sync.kind!=='supa'||!Sync.uid||!Sync.sb)return Promise.resolve([]);
  return Sync.sb.from('planner_snapshots').select('date').eq('user_id',Sync.uid).order('date',{ascending:false}).limit(200)
    .then(function(res){if(res&&res.error){Sync.snapErr=syncErrorText(res.error);return [];}return (res&&res.data)?res.data.map(function(r){return r.date;}):[];},function(e){Sync.snapErr=syncErrorText(e);return [];});
}
function loadCloudSnap(k){
  return Sync.sb.from('planner_snapshots').select('json').eq('user_id',Sync.uid).eq('date',k).maybeSingle()
    .then(function(res){return res&&res.data?decryptCloudValue(res.data.json):null;}).catch(function(){return null;});
}
function snapBoxHTML(dates,loading){
  if(!dates.length&&!loading&&!Sync.snapErr)return '';
  var lab=function(k){
    if(k.indexOf('h:')===0){var p=k.slice(2).split('~'),d=parseKey(p[0]);return (d.getMonth()+1)+'/'+d.getDate()+' '+p[1]+':00';}
    if(k.indexOf('d:')===0){var d=parseKey(k.slice(2));return (d.getMonth()+1)+'/'+d.getDate();}
    if(k.indexOf('m:')===0)return k.slice(2)+' 월 보관본';
    var p=k.split('~'),d=parseKey(p[0]);return (d.getMonth()+1)+'/'+d.getDate()+(p[1]?' '+p[1].slice(0,2)+':'+p[1].slice(2):'');
  };
  var section=function(title,arr,max){arr=arr.slice().sort().reverse().slice(0,max);if(!arr.length)return '';return '<p class="lbl" style="margin-top:14px">'+title+'</p><div class="snaplist">'+arr.map(function(k){return '<button class="tbtn" data-act="load-snap" data-k="'+esc(k)+'">'+esc(lab(k))+'</button>';}).join('')+'</div>';};
  var h=dates.filter(function(k){return k.indexOf('h:')===0;}),d=dates.filter(function(k){return k.indexOf('d:')===0;}),m=dates.filter(function(k){return k.indexOf('m:')===0;}),legacy=dates.filter(function(k){return !/^[hdm]:/.test(k);});
  var st=Sync.snapErr?'<p class="hint" style="color:var(--now);word-break:break-word">계정 복원 지점 저장이 실패하고 있어요. (자세히: '+esc(Sync.snapErr)+')</p>':Sync.snapOk?'<p class="hint">계정 복원 지점 마지막 저장: '+pad(new Date(Sync.snapOk).getHours())+':'+pad(new Date(Sync.snapOk).getMinutes())+'</p>':'';
  var html='<p class="lbl" style="margin-top:14px">복구센터 · 계정 복원 지점</p><p class="hint">지금 상태는 건드리지 않고 원하는 시점의 백업을 먼저 불러와 확인할 수 있어요.</p>'+st;
  html+=section('최근 24시간 · 시간별',h,24)+section('최근 30일 · 일별',d.concat(legacy),30)+section('최근 12개월 · 월별',m,12);
  if(loading)html+='<span class="tbtn" style="opacity:.5">불러오는 중…</span>';
  return html;
}
function push(){
  Sync.timer=null;
  if(Sync.deleting)return Promise.resolve();
  if(!plannerStateValid(S)){setSyncUI('error');Sync.diag='손상 가능성이 있는 데이터의 클라우드 업로드를 차단했어요.';return Promise.resolve();}
  if(!Sync.db)return Promise.resolve();
  if(Sync.busy||(Sync.kind==='supa'&&!Sync.pulled)){Sync.dirty=true;return Promise.resolve();}
  Sync.busy=true;
  var ref=Sync.db.doc(Sync.path);
  return ref.get().then(function(snap){
    var rem=null,r=null;
    if(snap.exists){r=snap.data()||{};try{rem=normalize(JSON.parse(r.json));}catch(e){rem=null;}}
    if(r&&!Sync.forceRestore){
      if((+r.updatedAt||0)!==Sync.lastSeen){try{reconcile(r);}catch(e){}}
      else if(!Sync.base&&rem){var m0=mergeStateV2(S,rem);if(itemCount(m0)!==itemCount(S)){m0.updatedAt=Math.max(Date.now(),(S.updatedAt||0)+1);S=m0;try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}if(Sync.uid)saveAccountState(Sync.uid,S);if(!M.type)render();}}
      /* 빈 플래너로 내용 있는 계정을 덮지 않아요 */
      if(rem&&hasPlannerData(rem)&&!hasPlannerData(S)){applyRemote(rem,+r.updatedAt||0);Sync.lastSeen=+r.updatedAt||0;Sync.base=idsOf(S);saveMeta();return;}
    }
    /* 항목이 많이 줄어드는 저장은 덮기 전에 계정에 사본을 하나 남겨요 */
    var guard=(r&&rem&&itemCount(rem)-itemCount(S)>=5)?cloudGuardSnap(r.json):Promise.resolve();
    return guard.then(function(){return ref.set({updatedAt:S.updatedAt,json:JSON.stringify(S)});}).then(function(){Sync.forceRestore=false;Sync.diag='';Sync.lastSeen=S.updatedAt;Sync.base=idsOf(S);saveMeta();if(Sync.uid)vaultPut(Sync.uid,S);setSyncUI('ok');mirrorPush();});
  }).catch(function(e){setSyncError('계정 저장에 실패했어요. 이 기기 백업을 보관하고 다시 연결해주세요.',e);})
    .then(function(){
      Sync.busy=false;
      if(Sync.dirty){Sync.dirty=false;scheduleSync();}
    });
}
function pull(){
  if(!Sync.db)return Promise.resolve();
  if(Sync.forceRestore)return push();
  setSyncUI('saving');
  return Sync.db.doc(Sync.path).get().then(function(snap){
    Sync.pulled=true;Sync.diag='';setSyncUI('ok');
    var localAt=S.updatedAt||0;
    if(snap.exists){
      var r=snap.data()||{};
      var remoteAt=+r.updatedAt||0;
      if(Sync.kind==='supa'&&lsGet('planner.syncedUser')!==Sync.uid&&localAt>0&&remoteAt!==localAt){
        autoMerge(r,remoteAt);return;
      }
      if(Sync.kind==='supa')lsSet('planner.syncedUser',Sync.uid);
      /* 로그인/재로그인에서는 서버 JSON을 통째로 applyRemote 하지 않아요.
         같은 lastSeen이어도 로컬의 주간 할 일·메모·회고가 서버에 없을 수 있어서,
         더 최신인 쪽을 우선값으로 삼되 양쪽의 '한쪽에만 있는 데이터'를 항상 합칩니다. */
      var remNow=null;try{remNow=normalize(JSON.parse(r.json));}catch(e){remNow=null;}
      if(remNow){
        var primary=remoteAt>localAt?remNow:S;
        var secondary=remoteAt>localAt?S:remNow;
        var joined=mergeStateV2(primary,secondary);
        var differsRemote=JSON.stringify(joined)!==JSON.stringify(remNow);
        var differsLocal=JSON.stringify(joined)!==JSON.stringify(S);
        if(differsLocal||differsRemote){
          joined.updatedAt=Math.max(Date.now(),remoteAt+1,localAt+1);
          applyRemote(joined,joined.updatedAt);
          Sync.lastSeen=remoteAt;Sync.base=idsOf(S);saveMeta();
          if(Sync.uid)saveAccountState(Sync.uid,S);
          push();
          return;
        }
      }
      if(remoteAt===Sync.lastSeen){
        if(localAt>remoteAt)push();
        return;
      }
      if(remoteAt===localAt){
        Sync.lastSeen=remoteAt;Sync.base=idsOf(S);saveMeta();return;
      }
      try{if(reconcile(r))push();}catch(e){}
    }else{if(Sync.kind==='supa')lsSet('planner.syncedUser',Sync.uid);if(localAt>0)return push();}
  }).catch(function(e){setSyncError('계정 동기화에 실패했어요. 이 기기 데이터는 그대로 보관돼요.',e);throw e;});
}
function applyTheme(){
  /* 계정 확인 전/로그아웃 상태에서는 특정 계정의 색·배경을 노출하지 않아요.
     로그인 세션이 붙으면 아래 저장된 계정 설정으로 즉시 다시 그려집니다. */
  var accountPending=(typeof Sync!=='undefined'&&Sync.kind==='supa'&&!Sync.uid);
  var t=accountPending?'auto':((typeof S!=='undefined'&&S.settings&&S.settings.theme)||lsGet('planner.theme')||'auto');
  if(t==='auto')document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme',t);
  var chosenColor=!accountPending&&typeof S!=='undefined'&&S.settings&&S.settings.defColor?S.settings.defColor:'';
  var dc=chosenColor||'#ffffff';
  document.documentElement.style.setProperty('--planner-color',dc);
  /* 이름 기본 색은 단순 UI 포인트색이 아니라 플래너 항목의 공통색이에요.
     클라우드에서 예전 개별 색이 다시 내려와도 화면을 그릴 때 현재 기본색으로 맞춥니다. */
  if(!accountPending&&typeof S!=='undefined'&&S.settings&&typeof applyDefaultColorToPlanner==='function')applyDefaultColorToPlanner();
  var bg=accountPending?'plain':(!chosenColor?'plain':((typeof S!=='undefined'&&S.settings&&S.settings.bg)||lsGet('planner.bg')||'rainbow'));
  if(bg==='plain')document.documentElement.removeAttribute('data-bg');
  else document.documentElement.setAttribute('data-bg',bg);
}
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function supaReady(){return !!(/^https:\/\/.+/.test(SUPABASE_URL)&&SUPABASE_ANON_KEY.length>20&&window.supabase&&window.supabase.createClient);}
/* ---------- 예전 암호화 데이터 호환 ----------
   신규 저장은 이메일 계정 자동복구용 일반 JSON을 사용합니다.
   과거 enc:v1 데이터는 기존 키가 있으면 해독하고, 키가 없지만 정상 로컬 사본이 있으면 안전 이전합니다. */
var PRIV_PREFIX='enc:v1:';
function b64u(bytes){var s='';bytes.forEach(function(b){s+=String.fromCharCode(b);});return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function unb64u(s){s=String(s||'').replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';var x=atob(s),a=new Uint8Array(x.length);for(var i=0;i<x.length;i++)a[i]=x.charCodeAt(i);return a;}
function privacyKeyName(uid){return 'planner.privateKey.'+uid;}
function privacyRaw(uid,create){var v=lsGet(privacyKeyName(uid));if(v)return v;if(!create)return '';var a=new Uint8Array(32);crypto.getRandomValues(a);v=b64u(a);lsSet(privacyKeyName(uid),v);try{alert('개인 플래너 암호화를 켰어요.\n\n복구키를 안전한 곳에 저장해 주세요. 새 기기에서 로그인할 때 필요해요.\n\n'+v+'\n\n이 키는 서버에 저장되지 않아 운영자도 볼 수 없어요.');}catch(e){}return v;}
function importPrivacyKey(uid){var v='';try{v=prompt('이 계정의 플래너는 암호화되어 있어요.\n다른 기기에서 받은 복구키를 입력해 주세요.\n\n복구키가 없으면 운영자도 내용을 복구할 수 없어요.')||'';}catch(e){}v=v.trim();if(!v)return '';try{if(unb64u(v).length!==32)throw 0;lsSet(privacyKeyName(uid),v);return v;}catch(e){try{alert('복구키 형식이 맞지 않아요.');}catch(_){}return '';}}
function cryptoKey(uid,create){var raw=privacyRaw(uid,create);if(!raw)return Promise.reject(new Error('암호화 복구키가 필요해요'));return crypto.subtle.importKey('raw',unb64u(raw),{name:'AES-GCM'},false,['encrypt','decrypt']);}
/* 계정 자동 복구 모드. 새 저장은 계정 서버에 JSON으로 저장하며 복구키가 필요 없어요.
   기존 enc:v1 데이터는 이 기기에 남은 예전 키로 한 번 열어 자동 이전합니다. */
function encryptCloudValue(txt){return Promise.resolve(String(txt));}
function decryptCloudValue(txt){
  txt=String(txt||'');
  if(txt.indexOf(PRIV_PREFIX)!==0)return Promise.resolve(txt);
  var z=txt.slice(PRIV_PREFIX.length).split('.');
  if(z.length!==2)return Promise.reject(new Error('예전 암호화 데이터 형식이 올바르지 않아요'));
  if(!privacyRaw(Sync.uid,false)){Sync.keyNeeded=true;return Promise.reject(new Error('예전 암호화 데이터예요. 기존 데이터가 보이는 기기에서 이 버전을 한 번 열어 자동 이전해주세요.'));}
  return cryptoKey(Sync.uid,false).then(function(k){return crypto.subtle.decrypt({name:'AES-GCM',iv:unb64u(z[0])},k,unb64u(z[1])).then(function(buf){return new TextDecoder().decode(buf);});})
    .then(function(t){Sync.keyNeeded=false;Sync.needsPlainMigration=true;return t;},function(){Sync.keyNeeded=true;throw new Error('예전 암호화 데이터를 열지 못했어요. 기존 데이터가 정상적으로 보이는 기기에서 먼저 이전해주세요.');});
}
function privacyRecoveryKey(){if(!Sync.uid){inAppToast('먼저 로그인해주세요');return;}
  var show=function(v){try{prompt('이 복구키를 안전한 곳에 복사해 두세요.\n다른 기기에서 \'복구키 입력\'에 넣으면 돼요.\n운영자도 대신 복구할 수 없어요.',v);}catch(e){}};
  var have=privacyRaw(Sync.uid,false);if(have){show(have);return;}
  /* 이 기기에 키가 없는데 계정이 이미 암호화돼 있으면 새 키를 만들면 안 돼요(다른 기기와 키가 갈라짐) */
  Sync.sb.from(SUPA_TABLE).select('json').eq('user_id',Sync.uid).maybeSingle().then(function(r){
    var j=r&&r.data&&String(r.data.json||'');
    if(j&&j.indexOf(PRIV_PREFIX)===0){inAppToast('이 기기엔 복구키가 없어요. 잘 되는 기기의 복구키를 입력해주세요');enterPrivacyKey();}
    else show(privacyRaw(Sync.uid,true));
  },function(){inAppToast('서버를 확인하지 못했어요. 잠시 뒤 다시 해주세요');});}
function enterPrivacyKey(){if(!Sync.uid){inAppToast('먼저 로그인해주세요');return;}
  var v='';try{v=prompt('잘 되는 기기에서 설정 → 암호화 복구키 → 보기로 복사한 키를 붙여넣어 주세요.')||'';}catch(e){}v=v.trim();if(!v)return;
  try{if(unb64u(v).length!==32)throw 0;}catch(e){inAppToast('복구키 형식이 맞지 않아요');return;}
  lsSet(privacyKeyName(Sync.uid),v);Sync.keyAsked=true;retrySync();}
function retrySync(){if(!Sync.db){inAppToast('먼저 로그인해주세요');return;}
  Sync.busy=false;Sync.pulled=false;setSyncUI('saving');
  pull().then(function(){Sync.pulled=true;if(SyncUI.state!=='error'){Sync.diag='';setSyncUI('ok');inAppToast('계정과 다시 맞췄어요');}if(!M.type)render();},function(){Sync.pulled=true;if(!M.type)render();});}
function syncReason(){var d=Sync.diag||'';if(!d)return '';
  if(Sync.keyNeeded||/복구키/.test(d)||/예전 암호화/.test(d))return '예전 복구키 방식 데이터가 아직 서버에 남아 있어요. 기존 플래너가 정상적으로 보이는 기기에서 이 버전을 한 번 열면 자동 복구 방식으로 이전돼요.';
  if(/JWT|jwt|expired|401|refresh|session/i.test(d))return '로그인이 만료됐어요. 로그아웃 후 다시 로그인해주세요.';
  if(/Failed to fetch|Load failed|NetworkError|network/i.test(d))return '인터넷 연결이 불안정해서 서버에 닿지 못했어요. 연결을 확인하고 다시 시도해주세요.';
  if(/permission|row-level|42501/i.test(d))return '서버 권한 설정에 막혔어요. (자세히: '+d+')';
  return d;}
function supaAdapter(sb,uid){
  return {doc:function(){return {
    get:function(){
      return sb.from(SUPA_TABLE).select('json,updated_at').eq('user_id',uid).maybeSingle().then(function(res){
        if(res.error)throw res.error;var row=res.data;if(!row)return {exists:false,data:function(){}};
        var raw=String(row.json||'');
        /* 자동복구 전환: 서버가 예전 enc:v1 형식인데 이 기기에 옛 키가 없어도,
           현재 기기에 정상 플래너가 보이면 그 사본을 기준으로 안전하게 새 형식으로 이전합니다.
           덮어쓰기 직전 현재 사본과 예전 암호문을 기기에 별도 보관하고, 서버 재읽기로 검증합니다. */
        if(raw.indexOf(PRIV_PREFIX)===0&&!privacyRaw(uid,false)&&hasPlannerData(S)){
          try{
            saveAccountState(uid,S);vaultPut(uid,S);bkRingAdd(S,true);
            lsSet('planner.legacyCipher.'+uid,raw);
            lsSet('planner.legacyCipherAt.'+uid,String(Date.now()));
          }catch(_e){}
          var plainNow=JSON.stringify(S),at=Math.max(Date.now(),+S.updatedAt||0,+row.updated_at||0);
          return sb.from(SUPA_TABLE).upsert({user_id:uid,json:plainNow,updated_at:at}).then(function(w){
            if(w.error)throw w.error;
            return sb.from(SUPA_TABLE).select('json,updated_at').eq('user_id',uid).maybeSingle();
          }).then(function(v){
            if(v.error)throw v.error;
            if(!v.data||String(v.data.json||'')!==plainNow)throw new Error('자동 이전 검증에 실패했어요. 기존 기기 데이터는 그대로 보관했어요.');
            Sync.keyNeeded=false;Sync.needsPlainMigration=false;Sync.diag='';
            lsSet('planner.autoMigrated.'+uid,String(Date.now()));
            return {exists:true,data:function(){return {updatedAt:+v.data.updated_at||at,json:plainNow};}};
          });
        }
        return decryptCloudValue(raw).then(function(plain){return {exists:true,data:function(){return {updatedAt:row.updated_at,json:plain};}};});
      });
    },
    set:function(v){
      return encryptCloudValue(v.json).then(function(cipher){return sb.from(SUPA_TABLE).upsert({user_id:uid,json:cipher,updated_at:v.updatedAt});}).then(function(res){if(res.error)throw res.error;});
    }
  };}};
}
function supaAttach(session){
  if(!session||!session.user){
    var oldUid=Sync.uid||lsGet('planner.activeUser')||'';
    if(oldUid&&!/^loggedout:/.test(oldUid)&&!Sync.deleting){
      /* 일반 로그아웃에서는 마지막 상태를 남기지만, 계정 삭제 중에는 삭제 데이터를 다시 백업하지 않아요. */
      saveLogoutBackup(oldUid,S);
      saveAccountState(oldUid,S);
      lsSet('planner.activeUser','loggedout:'+oldUid);
    }
    Sync.db=null;Sync.on=false;Sync.pulled=false;Sync.loading=false;Sync.uid=null;Sync.email='';
    FriendSync.loaded=false;FriendSync.invitesIn=[];FriendSync.invitesOut=[];FriendSync.busyMap={};FriendSync.lastBusy='';FriendSync.code='';FriendSync.friends=[];FriendSync.incoming=[];FriendSync.requests=[];FriendSync.shared=[];FriendSync.memories=[];FriendSync.shown={};
    if(!M.type)render();return;
  }
  if(Sync.uid===session.user.id)return;
  prepareAccount(session.user.id);
  Sync.uid=session.user.id;Sync.email=session.user.email||'';FriendSync.code=storedFriendCode();
  Sync.db=supaAdapter(Sync.sb,Sync.uid);Sync.path='planner';loadMeta();Sync.base=null;Sync.pulled=false;
  /* 로그인되면 모달부터 닫고 이 기기 사본을 바로 보여줘요 (계정 데이터는 이어서 덮어씀) */
  if(M.type==='login')closeModal();
  Sync.loading=true;if(!M.type)render(true);
  var myUid=Sync.uid;
  restoreCurrentVault(myUid).catch(function(){return false;}).then(function(){return pull();}).catch(function(e){Sync.diag='계정 불러오기에 실패했어요. '+(e&&e.message||'');}).then(function(){return mirrorRescueIfUseful();}).then(function(){
    if(Sync.uid!==myUid)return;
    Sync.loading=false;Sync.on=true;Sync.pulled=true;if(SyncUI.state!=='error')setSyncUI('ok');
    /* 기존 복구키 방식 데이터는 현재 기기에서 한 번 열리면 자동 복구 형식으로 다시 저장해요. */
    if(Sync.needsPlainMigration){Sync.needsPlainMigration=false;S.updatedAt=Math.max(Date.now(),(S.updatedAt||0)+1);save();}
    /* 이 계정에서 온보딩을 한 번 끝냈다면 다시 학교/색을 묻지 않아요.
       예전 버전에서 로컬 표식만 남고 cloud flag가 빠진 경우도 여기서 복구해 계정에 저장합니다. */
    /* 온보딩은 계정당 딱 한 번만. 예전 버전에서 완료 플래그가 클라우드에 빠졌어도
       이미 사용 중인 계정(플래너 데이터/프로필/학교 설정이 있음)은 완료 계정으로 마이그레이션해요. */
    var onboardKey='planner.onboard.'+Sync.uid;
    var existingAccount=hasPlannerData(S)||!!S.settings.profileName||!!S.settings.schoolConfigured||!!S.settings.onboardDone;
    if(lsGet(onboardKey)||existingAccount){
      if(!S.settings.onboardDone||!S.settings.schoolConfigured){
        S.settings.onboardDone=true;S.settings.schoolConfigured=true;save();
      }
      lsSet(onboardKey,'1');
    }
    if(Sync.dirty){Sync.dirty=false;scheduleSync();}
    locationPermissionLoad().then(function(){if(!M.type)render();});
    if(!M.type||M.type==='login'){if(M.type==='login')closeModal();render(true);}
    /* 친구 기능은 시간표 표시를 막지 않게 뒤에서 따로 불러와요 */
    friendLoad().catch(function(){}).then(function(){if(!M.type)render();});
  });
}
function initSupa(){
  if(!supaReady())return false;
  Sync.kind='supa';
  try{Sync.sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});}catch(e){Sync.kind=null;Sync.diag='로그인 연결 설정이 잘못됐어요.';return false;}
  if(U.guest)guestLoad();
  Sync.sb.auth.getSession().then(function(r){Sync.ready=true;var ss=r.data&&r.data.session;supaAttach(ss);if(!ss&&!M.type)render();}).catch(function(){Sync.ready=true;if(!M.type)render();});
  Sync.sb.auth.onAuthStateChange(function(ev,session){setTimeout(function(){supaAttach(session);},0);});
  return true;
}
function dataBucketCount(v){if(Array.isArray(v))return v.length;if(v&&typeof v==='object')return Object.keys(v).length;return v?1:0;}
function itemCount(st){if(!st)return 0;return ['classes','events','todos','routines','exams','allday','ddays','selfchat','diaries','memos','logs','letters','hourNotes','retro','weeklyRetro'].reduce(function(n,k){return n+dataBucketCount(st[k]);},0);}
/* 로그인·재로그인 때 이 기기와 계정 내용이 다르면 묻지 않고 합쳐요.
   (예전엔 '계정 것만/이 기기 것만'을 잘못 누르면 한쪽이 통째로 사라졌어요) */
function autoMerge(r,remoteAt){
  try{
    if(hasPlannerData(S))savePrevBackup(S);
    var rem=normalize(JSON.parse(r.json)),before=itemCount(S),rb=itemCount(rem);
    var m=mergeStateV2(S,rem);m.updatedAt=Math.max(Date.now(),(+remoteAt||0)+1);
    applyRemote(m,m.updatedAt);if(Sync.uid)saveAccountState(Sync.uid,S);
    lsSet('planner.syncedUser',Sync.uid);Sync.lastSeen=+remoteAt||0;Sync.base=null;saveMeta();Sync.on=true;
    if(before&&rb&&itemCount(S)>Math.min(before,rb)&&typeof inAppToast==='function')inAppToast('이 기기와 계정 내용을 합쳤어요. 사라진 건 없어요');
    push();
  }catch(e){}
}
function openChoice(r,remoteAt){
  M={type:'choice',r:r,remoteAt:remoteAt};
  var rt=new Date(remoteAt),lt=new Date(S.updatedAt||0);
  var rem;try{rem=normalize(JSON.parse(r.json));}catch(e){rem={};}
  var rn=itemCount(rem),ln=itemCount(S);
  function f(d){return (d.getMonth()+1)+'/'+d.getDate()+' '+pad(d.getHours())+':'+pad(d.getMinutes());}
  var warnR=rn<ln?'<p class="hint warn2">주의: 계정 쪽 항목이 '+(ln-rn)+'개 더 적어요. 이걸 고르면 이 기기 내용이 사라져요.</p>':'';
  var warnL=ln<rn?'<p class="hint warn2">주의: 이 기기 항목이 '+(rn-ln)+'개 더 적어요. 이걸 고르면 계정 내용이 사라져요.</p>':'';
  openModal('<h3>어떤 플래너를 쓸까요?</h3><p class="hint">이 기기에 적힌 내용과 계정에 저장된 내용이 달라요. 합치면 양쪽 내용이 모두 남고, 아무것도 안 사라져요.</p>'+
    '<div class="acts" style="flex-direction:column"><button class="b-save" data-act="use-merge">둘 다 합치기 (추천)</button>'+
    warnR+'<button class="b-ghost" data-act="use-remote">계정에 저장된 것만 · 총 '+rn+'개 ('+f(rt)+')</button>'+
    warnL+'<button class="b-ghost" data-act="use-local">이 기기 것만 · 총 '+ln+'개 ('+f(lt)+')</button></div>');
}
function openLogin(msg){
  M={type:'login',signup:false};
  openModal('<h3 id="auth-title">로그인</h3><p class="hint">로그인하면 아이폰·아이패드 어디서 열어도 같은 플래너가 떠요.</p>'+
    '<input class="fld" type="email" id="f-email" placeholder="이메일" autocomplete="email">'+
    '<div class="pwrow"><input class="fld" type="password" id="f-pw" placeholder="비밀번호 (6자 이상)" autocomplete="current-password"><button class="pw-eye" type="button" data-act="toggle-password" data-target="f-pw" aria-label="비밀번호 보기">'+eyeSVG(false)+'</button></div>'+ 
    '<div class="pwrow" id="pw-confirm-wrap" style="display:none"><input class="fld" type="password" id="f-pw2" placeholder="비밀번호 다시 입력" autocomplete="new-password"><button class="pw-eye" type="button" data-act="toggle-password" data-target="f-pw2" aria-label="비밀번호 확인 보기">'+eyeSVG(false)+'</button></div>'+ 
    '<div class="acts"><button class="b-ghost" id="auth-switch" data-act="signup-mode">회원가입</button><button class="b-save" id="auth-submit" data-act="login">로그인</button></div>'+ 
    '<button class="tbtn" style="width:100%;margin-top:8px;text-align:center;background:transparent" data-act="close">나중에 하기</button>'+
    '<button class="tbtn" style="width:100%;margin-top:10px;text-align:center" data-act="magic">비밀번호 없이 메일 링크로 로그인</button>'+
    '<p class="hint" id="login-msg" style="margin-top:10px">'+esc(msg||'')+'</p>');
}
function switchAuthMode(signup){var isSignup=!!signup;M.signup=isSignup;var title=$('#auth-title'),wrap=$('#pw-confirm-wrap'),submit=$('#auth-submit'),sw=$('#auth-switch');if(title)title.textContent=isSignup?'회원가입':'로그인';if(wrap)wrap.style.display=isSignup?'flex':'none';if(submit){submit.dataset.act=isSignup?'signup':'login';submit.textContent=isSignup?'가입하기':'로그인';}if(sw){sw.dataset.act=isSignup?'login-mode':'signup-mode';sw.textContent=isSignup?'로그인으로':'회원가입';}if(!isSignup&&$('#f-pw2'))$('#f-pw2').value='';}
function togglePassword(target,button){var el=$('#'+target);if(!el)return;var open=el.type==='password';el.type=open?'text':'password';button.innerHTML=eyeSVG(open);button.setAttribute('aria-label',open?'비밀번호 숨기기':'비밀번호 보기');}
function loginMsg(t){var el=$('#login-msg');if(el)el.textContent=t;}
function authErr(e){
  var m=(e&&e.message)||'';
  if(/Invalid login/i.test(m))return '이메일이나 비밀번호가 맞지 않아요';
  if(/not confirmed/i.test(m))return '메일함에서 인증 링크를 먼저 눌러주세요';
  if(/already registered/i.test(m))return '이미 가입된 이메일이에요. 로그인을 눌러주세요';
  if(/Password should/i.test(m))return '비밀번호는 6자 이상이어야 해요';
  if(/rate limit/i.test(m))return '요청이 많아요. 잠시 후 다시 해주세요';
  return m||'연결이 안 돼요. 인터넷을 확인해주세요';
}
function initSync(){
  if(!window.claude){
    if(!SUPABASE_URL)Sync.diag=userMsg('로그인 서버에 연결하지 못했어요. 잠시 뒤 다시 열어주세요.','config.js 파일을 못 찾았어요. index.html이랑 같은 폴더에 올렸는지 확인해주세요.');
    else if(!/^https:\/\/.+/.test(SUPABASE_URL)||SUPABASE_ANON_KEY.length<=20)Sync.diag=userMsg('로그인 서버에 연결하지 못했어요. 잠시 뒤 다시 열어주세요.','config.js에 주소나 키가 비어 있어요.');
    else if(!window.supabase)Sync.diag='로그인 도구를 못 불러왔어요. 인터넷 연결을 확인하고 새로고침해주세요.';
  }
  if(initSupa())return;
  if(U.guest){U.guest.state='error';U.guest.msg='연결 설정을 찾지 못했어요. 링크를 보낸 친구에게 알려주세요.';render();}
  try{
    if(!window.claude||typeof window.claude.use!=='function')return;
    Promise.all([window.claude.use('db'),window.claude.use('user')]).then(function(r){
      var db=r[0],user=r[1];
      if(!db||!user)return null;
      return user.id().then(function(id){
        if(!id)return null;
        Sync.db=db;Sync.path='data/users/'+id+'/planner';loadMeta();
        return pull().then(function(){Sync.on=true;if(U.tab==='ttable'&&!M.type)render();});
      });
    }).catch(function(){});
  }catch(e){}
}

/* ---------- UI 상태 ---------- */
var U={tab:'day',date:studyDayDate(new Date()),drafts:{},showDone:false,qscope:'day',refocus:null,chatQuery:'',chatPhotos:[],chatRoom:'general',diaryDraft:'',diaryNote:'',diaryMood:'',diaryRun:null};
var M={type:null};
var onboardTimer=null;

/* ---------- 데이터 조회 ---------- */
function itemsFor(d){
  var w=dow(d),k=dkey(d);
  var cls=S.classes.filter(function(c){return c.day===w&&clsActive(c,k);}).map(function(c){
    return {kind:'class',id:c.id,name:c.name,sub:c.sub,start:toMin(c.start),end:toMin(c.end),color:c.color,skipped:(c.skip||[]).indexOf(k)>=0};
  });
  var evs=S.events.filter(function(e){return e.start&&eventOnDate(e,k);}).map(function(e){
    var st=toMin(e.start),en=e.end?toMin(e.end):Math.min(st+30,1440);
    return {kind:'event',id:e.id,name:eventLabel(e),sub:eventSub(e),start:st,end:en,color:e.color,appointment:e.kind==='appointment',openEnd:!e.end};
  });
  var tds=S.todos.filter(function(t){return t.scope==='day'&&t.key===k&&t.time;}).map(function(t){
    var st=toMin(t.time);return {kind:'todo',id:t.id,name:(t.done?'✓ ':'')+t.text,sub:'',start:st,end:Math.min(st+(t.dur||60),1440),color:t.course?courseColor(t.course):'#dce9f7',done:t.done};
  });
  var fss=(S.fsess[k]||[]).map(function(x,i){var t=x.tid?S.todos.find(function(y){return y.id===x.tid;}):null;
    var st=toMin(x.start),en=Math.max(toMin(x.end),st+15);return {kind:'focus',id:x.tid||'',name:'집중 '+x.min+'분'+(t?' · '+t.text:''),sub:'',start:st,end:Math.min(en,1440),color:'#e6e6ea'};});
  return cls.concat(evs,tds,fss).sort(function(a,b){return a.start-b.start||a.end-b.end;});
}
function monthItemOn(id){return !S.settings.monthItems||S.settings.monthItems[id]!==false;}
function eventOnDate(e,k){
  if(e.date===k)return true;
  var d=parseKey(k),w=dow(d);
  if(Array.isArray(e.days))return e.days.indexOf(w)>=0&&(!e.from||k>=e.from)&&(!e.to||k<=e.to);
  return !!(e.from&&e.to&&k>=e.from&&k<=e.to);
}
function eventLabel(e){return e.kind==='appointment'?(e.what||e.title||e.person||e.place||'약속'):(e.title||'일정');}
function eventSub(e){return e.kind==='appointment'?[e.person,e.place].filter(function(x,i,a){return x&&a.indexOf(x)===i;}).join(' · '):'';}
function eventChipLabel(e){
  if(e.kind!=='appointment'){var base=eventLabel(e),pc=cleanPackItems(e&&e.packing).length;return base+(pc?(' · 준비물 '+pc):'');}
  return [e.what,e.person,e.place].filter(function(x,i,a){return x&&a.indexOf(x)===i;}).join(' · ')||'약속';
}
function eventImportanceClass(e){return e&&e.kind==='appointment'?'appointment':(e&&e.important?'important':'normal');}
function monthEventMarkerHTML(evs,ads){var e=(evs&&evs[0])||(ads&&ads[0]);if(!e)return '';var cls=eventImportanceClass(e);return '<span class="evmark '+cls+'" style="--c:'+(e.color||defCol())+'" title="'+esc(cls==='appointment'?'약속':cls==='important'?'중요 일정':'일정')+'"></span>';}
function monthEventChipHTML(e){var cls=eventImportanceClass(e);return '<span class="chip ev '+(cls==='appointment'?'appointment-chip':cls==='important'?'important-chip':'')+'" style="--c:'+(e.color||defCol())+'">'+esc(eventChipLabel(e))+'</span>';}

function appointmentChip(e){return '<button class="adchip" style="--c:'+e.color+'" data-act="edit-event" data-id="'+e.id+'">'+esc(eventChipLabel(e))+'</button>';}
function actOf(it){return it.kind==='event'?(it.appointment?'edit-event':'view-event-detail'):it.kind==='todo'||(it.kind==='focus'&&it.id)?'edit-todo':it.kind==='focus'?'noop':'view-block';}
function layout(items){
  var out=[],cluster=[],cEnd=-1;
  function flush(){
    if(!cluster.length)return;
    var lanes=[];
    cluster.forEach(function(it){
      var i=lanes.findIndex(function(end){return end<=it.start;});
      if(i<0){i=lanes.length;lanes.push(it.end);}else lanes[i]=it.end;
      it.lane=i;
    });
    cluster.forEach(function(it){it.lanes=lanes.length;});
    out=out.concat(cluster);cluster=[];
  }
  items.forEach(function(it){
    if(cluster.length&&it.start>=cEnd){flush();cEnd=-1;}
    cluster.push(it);cEnd=Math.max(cEnd,it.end);
  });
  flush();
  return out;
}
function diffDays(k){var a=parseKey(k),t=parseKey(todayKey());return Math.round((a-t)/86400000);}
function ddHTML(t){
  if(!t.due)return '';
  var n=diffDays(t.due);
  if(t.done)return '<em class="dd">'+(n===0?'D-day':n>0?'D-'+n:'D+'+(-n))+'</em>';
  var cls=n<0?'late':n<=1?'hot':n<=3?'soon':'';
  return '<em class="dd '+cls+'">'+(n===0?'D-day':n>0?'D-'+n:'D+'+(-n))+'</em>';
}
function courseNames(){var o=[];function add(n){n=String(n||'').trim();if(n&&n!=='기타'&&o.indexOf(n)<0)o.push(n);}S.classes.forEach(function(c){add(c.name);});S.todos.forEach(function(t){add(t.course);});S.exams.forEach(function(e){add(e.course);});return o;}
function courseColor(n){var c=S.classes.find(function(x){return x.name===n;});return c?c.color:'#9a9086';}
function courseSelect(id,sel,cls){
  var names=courseNames();
  if(sel&&names.indexOf(sel)<0)names.push(sel);
  return '<select class="'+(cls||'fld')+'" id="'+id+'"><option value="">과목 없음</option>'+names.map(function(n){return '<option value="'+esc(n)+'"'+(n===sel?' selected':'')+'>'+esc(n)+'</option>';}).join('')+'</select>';
}
function examNow(){
  var tk=todayKey();
  return S.exams.filter(function(e){return e.end>=tk;}).sort(function(a,b){return a.start<b.start?-1:1;})[0]||null;
}
function inExam(k){return S.exams.some(function(e){return k>=e.start&&k<=e.end;});}
function rangeTxt(a,b){var x=parseKey(a),y=parseKey(b||a);if(!b||a===b)return mdTxt(x);return mdTxt(x)+' – '+(x.getMonth()===y.getMonth()&&x.getFullYear()===y.getFullYear()?y.getDate()+'일':mdTxt(y));}
function examBar(){
  var e=examNow();if(!e)return '';
  var n=diffDays(e.start),txt;
  if(n>0)txt='<b>D-'+n+'</b>';
  else{var left=diffDays(e.end);txt='<b>'+(left===0?'오늘 끝':left+'일 남음')+'</b>';}
  var s=parseKey(e.start),en=parseKey(e.end);
  return '<button class="exbar" data-act="view-exam" data-id="'+e.id+'"><span>'+esc(e.name)+(n<=0?' 기간':'')+' <small>'+rangeTxt(e.start,e.end)+(e.time?' · '+e.time:'')+(e.kind?' · '+e.kind:'')+'</small></span>'+txt+'</button>';
}
function alldayFor(d){
  var k=dkey(d),w=dow(d);
  return S.allday.filter(function(a){return a.days?(a.days.indexOf(w)>=0&&(!a.from||k>=a.from)&&(!a.to||k<=a.to)):(k>=a.date&&k<=(a.end||a.date));});
}
function adChip(a){return '<button class="adchip" style="--c:'+a.color+'" data-act="view-ad-detail" data-id="'+a.id+'">'+esc(a.title)+'</button>';}
function trk(id){return S.trackers.find(function(t){return t.id===id;});}
function logVal(k,id){var o=S.logs[k];return o?o[id]:undefined;}
function setLog(k,id,v){
  var o=S.logs[k]||{};
  if(v===undefined||v===null||v==='')delete o[id];else o[id]=v;
  if(Object.keys(o).length)S.logs[k]=o;else delete S.logs[k];
}
function logItemOn(id){
  var d=S.settings.logDisplay||{};
  return id==='wakeGoal'?d.wakeGoal!==false:id==='wake'?d.wakeTime!==false:id==='sleep'?d.sleepTime!==false:id==='study'?d.studyTotal!==false:true;
}
function beforeWakeGoalCutoff(){
  var now=new Date(),base=parseKey(todayKey()),cut=new Date(base.getFullYear(),base.getMonth(),base.getDate(),9,0,0,0);
  return now<cut;
}
function durShort(m){if(m<60)return m+'m';var h=Math.floor(m/60),r=m%60;return h+'h'+(r?pad(r):'');}
function durLong(m){var h=Math.floor(m/60),r=m%60;return (h?h+'시간':'')+(h&&r?' ':'')+(r||!h?r+'분':'');}
function timeShort(t){return t.replace(/^0(\d)/,'$1');}
function calOptions(){
  var o=S.trackers.filter(function(t){return logItemOn(t.id);}).map(function(t){return [t.id,t.name];});
  if(trk('sstart')&&trk('send'))o.push(['range','공부 시작~끝']);
  return o;
}
function calCell(k){
  if(!S.settings.logOn)return '';
  var ci=S.settings.calItem;
  if(ci==='range'){
    if(!logItemOn('sstart')&&!logItemOn('send'))return '';
    var a=logVal(k,'sstart'),b=logVal(k,'send');
    if(!a&&!b)return '';
    return '<span class="lg">'+(a?timeShort(a):'?')+'~'+(b?timeShort(b):'?')+'</span>';
  }
  var t=trk(ci),v=logVal(k,ci);
  if(!t||!logItemOn(ci)||v===undefined)return '';
  return '<span class="lg">'+(t.type==='dur'?durShort(v):timeShort(v))+'</span>';
}
function logCard(k){
  var on=S.settings.logOn;
  var list=S.trackers.filter(function(t){return logItemOn(t.id)&&(on||t.type==='dur');});
  var rows=list.map(function(t){
    var v=logVal(k,t.id),inp;
    if(t.type==='dur'){
      var h=v!==undefined?Math.floor(v/60):'',m=v!==undefined?v%60:'';
      inp='<div class="lin"><input type="number" inputmode="numeric" min="0" max="24" placeholder="0" data-log="'+k+'|'+t.id+'|h" value="'+h+'"><span>시간</span>'+
        '<input type="number" inputmode="numeric" min="0" max="59" placeholder="0" data-log="'+k+'|'+t.id+'|m" value="'+m+'"><span>분</span></div>';
    }else{
      inp='<div class="lin"><input type="time" data-log="'+k+'|'+t.id+'|t" value="'+(v||'')+'"><button class="mini" data-act="log-now" data-k="'+k+'" data-id="'+t.id+'">지금</button></div>';
    }
    return '<div class="lrow"><button class="lname" data-act="edit-trk" data-id="'+t.id+'">'+esc(t.name)+'</button>'+inp+'</div>';
  }).join('')||'<div class="empty">기록할 항목이 없어요</div>';
  var goalRow='';
  if(logItemOn('wakeGoal')){
    var goalDone=!!logVal(k,'wakeGoal'),locked=k===todayKey()&&!beforeWakeGoalCutoff();
    goalRow='<div class="lrow"><span class="lname">기상 목표<small>목표 '+esc(S.settings.wakeGoal||'09:00')+(locked?' · 오늘 9시 마감':'')+'</small></span><button class="mini'+(goalDone?' on':'')+'" data-act="wake-goal" data-k="'+k+'"'+(locked?' disabled':'')+'>'+(goalDone?'달성 ✓':locked?'마감':'달성')+'</button></div>';
  }
  var sel=on?'<div class="lrow"><span class="lname" style="color:var(--sub)">달력에 표시</span><select class="sel" id="cal-item">'+
    calOptions().map(function(o){return '<option value="'+o[0]+'"'+(o[0]===S.settings.calItem?' selected':'')+'>'+esc(o[1])+'</option>';}).join('')+'</select></div>':'';
  var dl=S.todos.filter(function(t){return t.scope==='day'&&t.key===k;}),rr=routinesFor(parseKey(k));
  var dT=dl.length+rr.length,dD=dl.filter(function(t){return t.done;}).length+rr.filter(function(r){return routineDone(r,k);}).length;
  var stat='<div class="lstat"><span>완료율 <b>'+(dT?Math.round(dD/dT*100)+'%':'–')+'</b></span><span>집중 <b>'+(S.focus[k]?durLong(S.focus[k]):'–')+'</b></span></div>';
  var retro='<input class="fld retro" data-retro="'+k+'" maxlength="80" placeholder="오늘 한 줄 회고" value="'+esc(S.retro[k]||'')+'">';
  return '<section class="card"><div class="card-h"><h3>기록</h3><span style="display:flex;align-items:center;gap:6px"><span class="cnt">자세히</span>'+ 
    '<button class="switch'+(on?' on':'')+'" role="switch" aria-checked="'+on+'" aria-label="자세한 기록과 달력 표시" data-act="log-switch"><i></i></button></span></div>'+ 
    stat+goalRow+rows+sel+retro+'<button class="tbtn" style="width:100%;margin-top:10px;text-align:center" data-act="add-trk">+ 기록 항목 추가</button></section>';
}
function openTrk(t){
  var x=t||{name:'',type:'dur'};
  M={type:'trk',id:t?t.id:null,ttype:x.type};
  openModal('<h3>'+(t?'기록 항목 수정':'기록 항목 추가')+'</h3>'+
    '<input class="fld" id="f-tname" placeholder="예: 필라테스, 독서, 운동" maxlength="20" value="'+esc(x.name)+'">'+
    '<span class="lbl">어떻게 적을까요</span><div class="seg" id="f-ttype"><button data-act="trk-type" data-v="dur">몇 시간 했는지</button><button data-act="trk-type" data-v="time">몇 시에 했는지</button></div>'+
    '<div class="acts">'+(t?'<button class="b-del" data-act="del-trk">삭제</button>':'')+'<button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="save-trk">저장</button></div>');
  drawTrkType();
  if(!t)setTimeout(function(){var f=$('#f-tname');if(f)f.focus();},50);
}
function drawTrkType(){document.querySelectorAll('#f-ttype button').forEach(function(b){b.classList.toggle('on',b.dataset.v===M.ttype);});}
function saveTrk(){
  var n=$('#f-tname').value.trim();
  if(!n){bad('#f-tname');return;}
  if(M.id){var t=trk(M.id);if(t){if(t.type!==M.ttype){Object.keys(S.logs).forEach(function(k){setLog(k,t.id,undefined);});}t.name=n;t.type=M.ttype;}}
  else S.trackers.push({id:uid(),name:n,type:M.ttype});
  save();closeModal();render();
}
function featOn(k){var v=S.settings[k];return v===undefined?!S.settings.liteHome:v!==false;}
function todayKey(){return studyDayKey(new Date());}
function letterAccentColor(){
  var c=String(defCol()||'#dce9f7').toLowerCase();
  var map={
    '#faefdc':'#9b7449',
    '#ebebee':'#747784',
    '#f8dedd':'#b96570',
    '#fbe3cf':'#b8734d',
    '#f8edc4':'#9d7b25',
    '#dce9f7':'#5d83aa',
    '#d9efe6':'#4f8e76',
    '#e3efd6':'#6f914e',
    '#e7e1f4':'#7e6aa7'
  };
  return map[c]||'color-mix(in oklab,'+c+' 70%,#111 30%)';
}
function letterBar(){
  if(!S.settings.letterOn)return '';
  var k=todayKey(),L=S.letters[k];
  if(!L||L.seen||!L.text)return '';
  return '<section class="letter" style="--letter-accent:'+esc(letterAccentColor())+';border-left-width:5px!important;border-left-color:var(--letter-accent)!important"><div class="lt-h"><span>어제의 내가 남긴 말</span><button class="lt-x" data-act="letter-seen" aria-label="오늘은 그만 보기">✕</button></div>'+
    '<p>'+esc(L.text)+'</p></section>';
}
function letterCard(k){
  if(!S.settings.letterOn)return '';
  var tk=todayKey(),html='';
  var got=S.letters[k];
  /* [중복 방지] 오늘 받은 말은 화면 맨 위 letterBar()에서 한 번만 보여줘요.
     지난 날짜를 열었을 때만 일간 기록 안에 보관본을 표시해요. */
  if(got&&got.text&&k<tk){
    html+='<section class="card"><div class="card-h"><h3>이날 받은 말</h3></div>'+
      '<p class="lt-got">'+esc(got.text)+'</p></section>';
  }
  if(k===tk){
    var nk=studyTomorrowKey(new Date()),L=S.letters[nk]||{},sent=!!(L&&L.text);
    var skipped=S.settings.letterSkipComposeDate===tk;
    if(!skipped){
      html+='<section class="card self-letter-card"><div class="card-h"><h3>내일의 나에게</h3><span class="cnt">'+(sent?'예약됨 ✓':'내일 맨 위에 도착')+'</span></div>'+
        '<div class="self-letter-compose"><input class="fld" style="margin:0" id="f-letter-tomorrow" maxlength="80" placeholder="내일의 나에게 한 줄" value="'+esc(L.text||'')+'">'+
        '<button class="b-save" data-act="send-letter-tomorrow" data-date="'+nk+'">'+(sent?'예약 수정':'보내기')+'</button>'+
        '<button class="b-ghost" data-act="no-letter-tomorrow" data-date="'+nk+'">없음</button></div>'+
        '<small class="self-letter-help">'+(sent?'내일 열기 전까지 문구를 수정하거나, 없음으로 취소할 수 있어요.':'입력하지 않으면 내일 아무 창도 뜨지 않아요.')+'</small></section>';
    }
  }
  return html;
}
function shrinkImage(file,cb){
  var fr=new FileReader();
  fr.onload=function(){
    var img=new Image();
    img.onload=function(){
      var max=640,w=img.width,h=img.height,r=Math.min(1,max/Math.max(w,h));
      var c=document.createElement('canvas');c.width=Math.round(w*r);c.height=Math.round(h*r);
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      try{cb(c.toDataURL('image/jpeg',0.68));}catch(e){cb(null);}
    };
    img.onerror=function(){cb(null);};
    img.src=fr.result;
  };
  fr.onerror=function(){cb(null);};
  fr.readAsDataURL(file);
}
function setLetter(k,patch){
  var L=Object.assign({},S.letters[k]||{},patch);
  delete L.photo;
  Object.keys(L).forEach(function(x){if(L[x]===null||L[x]===''||L[x]===undefined)delete L[x];});
  if(L.text)S.letters[k]=L;else delete S.letters[k];
}
function sendLetterTomorrow(k){
  var f=$('#f-letter-tomorrow'),txt=f?(f.value||'').trim():'';
  if(!txt){bad('#f-letter-tomorrow');inAppToast('내일의 나에게 남길 말을 적어줘');return;}
  setLetter(k,{text:txt,seen:null,sentAt:Date.now()});
  if(S.settings.letterSkipComposeDate===todayKey())delete S.settings.letterSkipComposeDate;
  save();
  render();
  M={type:'self-letter-sent'};
  openModal('<div class="self-letter-sent-pop"><h3>내일 보여드릴게요!</h3><p class="hint">내일의 나에게 예약했어요.</p><div class="acts"><button class="b-save" data-act="close">확인</button></div></div>');
}
function askNoLetterTomorrow(k){
  M={type:'no-letter-tomorrow',date:k};
  openModal('<h3>내일의 나에게 아무 말도 남기지 않을까요?</h3><p class="hint">확인하면 오늘은 이 입력창이 사라지고, 내일도 메시지 창이 뜨지 않아요.</p><div class="acts"><button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="no-letter-tomorrow-confirm" data-date="'+esc(k)+'">없음으로 할게</button></div>');
}
function skipLetterTomorrow(k){
  if(S.letters[k])delete S.letters[k];
  S.settings.letterSkipComposeDate=todayKey();
  save();
  closeModal();
  render();
}
function pruneLetters(){
  var y=dkey(addDays(new Date(),-1)),ch=false;
  Object.keys(S.letters).forEach(function(k){
    var L=S.letters[k];
    if(L.photo){delete L.photo;ch=true;}
    if(k<y&&!L.text){delete S.letters[k];ch=true;}
  });
  if(ch)save();
}
function memoOf(k){
  var m=S.memos[k];
  if(typeof m==='string')return {text:m,photos:[]};
  if(!m||typeof m!=='object')return {text:'',photos:[]};
  return {text:m.text||'',photos:Array.isArray(m.photos)?m.photos.slice():[]};
}
function memoPhotoSrc(p){return typeof p==='string'?p:p&&p.src||'';}
function memoPhotoId(p,i){return typeof p==='string'?'old-'+i:p&&p.id||'photo-'+i;}
function memoPhotosHTML(k,photos){
  if(!photos.length)return '';
  return '<div class="memo-photos">'+photos.map(function(p,i){return '<div class="memo-photo"><img src="'+memoPhotoSrc(p)+'" alt="하루 메모 사진"><button class="lt-x" data-act="memo-photo-del" data-k="'+k+'" data-pid="'+memoPhotoId(p,i)+'" aria-label="사진 삭제">✕</button></div>';}).join('')+'</div>';
}
function addMemoPhotos(k,files){
  var m=memoOf(k),list=Array.prototype.slice.call(files||[]);
  if(!list.length)return;
  var left=list.length,changed=false;
  list.forEach(function(file){
    shrinkImage(file,function(url){
      if(url){m.photos.push({id:uid(),src:url});changed=true;}
      left--;
      if(left===0&&changed){S.memos[k]=m;save();render();}
    });
  });
}
var ICO_CLOCK='<svg class="ico" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2"/><path d="M10 2h4"/></svg>';
function streakTxt(r){
  var d=new Date(),n=0,k=dkey(d),i;
  if(r.days.indexOf(dow(d))>=0&&!routineDone(r,k))d=addDays(d,-1);
  for(i=0;i<400;i++){
    if(r.days.indexOf(dow(d))>=0){if(routineDone(r,dkey(d)))n++;else break;}
    d=addDays(d,-1);
  }
  return n>=2?' · '+n+'일 연속':'';
}
function todayClose(){var k=todayKey();return (S.dayCloses||[]).find(function(x){return x.key===k;})||null;}
function dayCloseStats(k){var d=parseKey(k),todos=S.todos.filter(function(t){return t.scope==='day'&&t.key===k;}),rr=routinesFor(d),done=todos.filter(function(t){return t.done;}).length+rr.filter(function(r){return routineDone(r,k);}).length,total=todos.length+rr.length,classes=itemsFor(d).filter(function(it){return it.kind==='class'&&!it.skipped;}).length,focus=S.focus[k]||0;return {done:done,total:total,classes:classes,focus:focus};}
function dayCloseBanner(){var h=new Date().getHours(),c=todayClose();if(h<17&&!c)return '';return '<button class="dayclose-banner" data-act="open-day-close"><span><b>'+(c?'오늘 마감 완료':'하루 마감')+'</b><small>'+(c?'오늘 기록을 다시 볼 수 있어요':'오늘 한 일을 한 번에 정리해요')+'</small></span><span class="chev">›</span></button>';}
function openDayClose(){var k=todayKey(),st=dayCloseStats(k),c=todayClose(),di=(S.diaries||[]).filter(function(x){return diaryDateKey(x)===k;}),mins=Math.round((st.focus||0)/60000);M={type:'day-close'};openModal('<h3>하루 마감</h3><div class="close-summary"><div><b>'+st.done+'/'+st.total+'</b><small>할 일</small></div><div><b>'+st.classes+'</b><small>'+esc(modeBlockWord())+'</small></div><div><b>'+mins+'분</b><small>집중</small></div></div><p class="hint">'+(di.length?diaryTargetMinutes()+'분 일기 '+di.length+'개도 오늘 기록에 함께 남아 있어요.':'오늘 기록을 이 상태로 마감해요.')+'</p><span class="lbl">오늘을 한 단어로 표현하면?</span><input class="fld" id="f-close-word" maxlength="12" placeholder="예: 뿌듯, 정신없음, 몰입" value="'+esc(c&&c.word||'')+'"><textarea class="memo" id="f-close-note" placeholder="더 남기고 싶은 말 · 선택사항">'+esc(c&&c.note||'')+'</textarea><div class="acts"><button class="b-ghost" data-act="close">닫기</button><button class="b-save" data-act="save-day-close">'+(c?'다시 저장':'오늘 마감')+'</button></div>');}
function saveDayClose(){var k=todayKey(),st=dayCloseStats(k),note=$('#f-close-note')?$('#f-close-note').value.trim():'',word=$('#f-close-word')?$('#f-close-word').value.trim():'',arr=S.dayCloses||(S.dayCloses=[]),old=arr.find(function(x){return x.key===k;}),obj={key:k,finishedAt:Date.now(),word:word,note:note,done:st.done,total:st.total,classes:st.classes,focus:st.focus};if(old)Object.assign(old,obj);else arr.push(obj);save();closeModal();render();var sk=dayCloseStreak();inAppToast(sk>=2?'오늘 마감했어요 · '+sk+'일 연속':'오늘 마감했어요');}
function examPrep(x){return Array.isArray(x&&x.prep)?x.prep:[];}
function examPrepProgress(x){var a=examPrep(x),done=a.filter(function(t){return t.done;}).length;return {done:done,total:a.length,pct:a.length?Math.round(done/a.length*100):0};}
function friendLastMetDays(id){
  var dates=friendMemoryRows(id).map(function(x){return x.visited_at;}).filter(Boolean).concat(sharedMetDates(id)).filter(function(k){return k<=dkey(new Date());});
  dates.sort().reverse();if(!dates.length)return null;return Math.max(0,-diffDays(dates[0]));
}
function flashMeetWindow(friendId){
  var fp=FriendSync.busyMap&&FriendSync.busyMap[friendId];
  if(!fp)return null; // 친구의 실제 가능시간/바쁜시간 데이터가 확인된 경우에만 추천
  var now=new Date(),k=dkey(now),mine=meetAvail(),fr=friendAvail(friendId),lo=Math.max(mine[0]*60,fr[0]*60),hi=Math.min(mine[1]*60,fr[1]*60);
  var cur=now.getHours()*60+now.getMinutes();cur=Math.ceil(cur/30)*30;lo=Math.max(lo,cur);if(hi-lo<60)return null;
  var mb=myBusyOn(k),fb=friendBusyOn(friendId,k);if(mb.allday||fb.allday)return null;
  function hit(rs,m){return (rs||[]).some(function(r){return r[0]<m+30&&r[1]>m;});}
  var runs=[],st=null;
  for(var m=lo;m<hi;m+=30){
    var free=!hit(mb.r,m)&&!hit(fb.r,m);
    if(free&&st===null)st=m;
    if((!free||m+30>=hi)&&st!==null){var en=free&&m+30>=hi?m+30:m;if(en-st>=60)runs.push({start:st,end:en,duration:en-st});st=null;}
  }
  if(!runs.length)return null;
  runs.sort(function(a,b){return a.start-b.start||(b.duration-a.duration);});return runs[0];
}
function flashMeetSuggestion(){
  if(!Sync.uid||S.settings.showMeetMaker===false||!FriendSync.loaded||!FriendSync.friends.length)return null;
  var now=new Date(),cur=now.getHours()*60+now.getMinutes(),rows=[];
  FriendSync.friends.forEach(function(f){
    var w=flashMeetWindow(f.id);if(!w)return;var days=friendLastMetDays(f.id),wait=Math.max(0,w.start-cur),recency=days==null?20:Math.min(days,45);
    var score=w.duration + recency*2 - wait*.15 + (friendPinIndex(f.id)>=0?10:0);
    rows.push({friend:f,win:w,days:days,score:score});
  });
  rows.sort(function(a,b){return b.score-a.score||a.win.start-b.win.start;});return rows[0]||null;
}
function flashMeetHTML(){
  var x=flashMeetSuggestion();if(!x)return '';
  var f=x.friend,w=x.win,now=new Date(),cur=now.getHours()*60+now.getMinutes(),wait=Math.max(0,w.start-cur),mins=Math.max(30,w.end-Math.max(w.start,cur));
  var nowish=wait<=30,when=nowish?('약 '+mins+'분 정도'):timeShort(hm(w.start))+'부터 · '+durText(w.duration);
  var rel=x.days==null?'아직 함께한 추억 기록이 없어요':x.days===0?'오늘 이미 만난 기록이 있어요':x.days===1?'어제 만났어요':'마지막 만남 '+x.days+'일 전';
  var reason=nowish?('둘의 시간표·일정을 보면 지금부터 약 '+mins+'분 동안 함께 비어 있어요.'):('오늘 '+timeShort(hm(w.start))+'부터 '+durText(w.duration)+' 연속으로 둘 다 비어요.');
  return '<section class="flash-meet"><div class="flash-meet-top">'+friendAvatar(friendLabel(f),f.photo,'',f.id)+'<div class="flash-meet-main"><span class="flash-meet-kicker">'+(nowish?'지금 만날 수 있는 친구':'오늘 만날 수 있는 친구')+'</span><b>'+esc(friendLabel(f))+'</b><small><span class="flash-meet-now">'+esc(when)+'</span> · '+esc(rel)+'</small></div></div><div class="flash-meet-reason">'+esc(reason)+'</div><button class="b-save" data-act="home-flash-meet" data-id="'+esc(f.id)+'" data-k="'+todayKey()+'" data-s="'+w.start+'" data-e="'+w.end+'">번개 약속 만들기</button></section>';
}

function planonNemoStateForDate(k){
  k=k||todayKey();
  if(k===todayKey()&&(S.todos||[]).some(function(t){return Number(t&&t.workStartedAt||0)>0;}))return 'focus';
  try{if(examsFor(parseKey(k)).length)return 'exam';}catch(e){}
  if((S.events||[]).some(function(e){return e&&e.kind==='appointment'&&eventOnDate(e,k);}))return 'appointment';
  try{if(diaryForKey(k))return 'diary';}catch(e){}
  var td=(S.todos||[]).filter(function(t){return t&&t.scope==='day'&&t.key===k;});
  if(td.length&&td.every(function(t){return !!t.done;}))return 'rest';
  return 'basic';
}
window.planonNemoStateForDate=planonNemoStateForDate;

function homeStrip(){
  var k=todayKey(),d=studyDayDate(new Date()),realNow=new Date(),now=realNow.getHours()*60+realNow.getMinutes(),hour=realNow.getHours();
  /* 00:00~04:59에는 공부일이 전날이라, 전날의 모든 시간대는 이미 지난 것으로 계산해요. */
  if(k!==dkey(realNow))now+=1440;
  var dl=S.todos.filter(function(t){return t.scope==='day'&&t.key===k;}),rr=routinesFor(d);
  var tot=dl.length+rr.length,dn=dl.filter(function(t){return t.done;}).length+rr.filter(function(r){return routineDone(r,k);}).length;
  var all=itemsFor(d).filter(function(it){return !it.skipped&&!it.done&&it.kind!=='focus';});
  var current=all.filter(function(it){return it.start<=now&&it.end>now;})[0]||null;
  var next=all.filter(function(it){return it.start>now;})[0]||null;
  var pct=tot?Math.round(dn/tot*100):0,bw=modeBlockWord();
  function contextRow(label,it,empty){
    if(!it)return '<div class="home-context-row empty"><small>'+label+'</small><b>'+empty+'</b></div>';
    var dur=it.start<=now&&it.end>now?durText(it.end-now)+' 남음':timeShort(fmt(it.start))+(it.end?('–'+timeShort(fmt(it.end))):'');
    var act=it.kind==='class'?'view-block':it.kind==='event'?'edit-event':'edit-todo';
    var extra=' data-id="'+esc(it.id||'')+'"'+(it.kind==='class'?' data-date="'+esc(k)+'"':'');
    return '<button class="home-context-row" data-act="'+act+'"'+extra+'><small>'+label+' · '+esc(dur)+'</small><b>'+esc(String(it.name||'').replace(/^✓\s*/,''))+'</b><span>›</span></button>';
  }
  var nowNext='<div class="home-context">'+contextRow('지금',current,'비어 있어요')+contextRow('다음',next,'오늘 남은 일정이 없어요')+'</div>';
  var todo=S.settings.showNextTodo===false?'':('<div class="home-line"><span><small>오늘 할 일</small><b>'+dn+'/'+tot+' 완료</b></span><em>'+pct+'%</em></div><div class="hbar" role="progressbar" aria-valuenow="'+pct+'" aria-valuemin="0" aria-valuemax="100"><i style="width:'+pct+'%"></i></div>');
  var deadlines=[];
  S.todos.filter(function(t){return !t.done&&t.due&&t.due>=k;}).forEach(function(t){deadlines.push({date:t.due,title:t.text,kind:'할 일'});});
  S.exams.filter(function(e){return e.start&&e.start>=k;}).forEach(function(e){deadlines.push({date:e.start,title:e.name||e.kind||'시험',kind:e.kind||'시험'});});
  deadlines.sort(function(a,b){return a.date<b.date?-1:a.date>b.date?1:0;});
  var near=deadlines[0],nearLine='';
  if(near){var nd=diffDays(near.date),dd=nd===0?'오늘':nd===1?'내일':'D-'+nd;nearLine='<div class="home-deadline"><small>곧 마감 · '+esc(near.kind)+'</small><b>'+esc(near.title)+'</b><em>'+esc(dd)+'</em></div>';}
  else nearLine='<div class="home-deadline empty"><small>곧 마감</small><b>가까운 마감이 없어요</b></div>';
  var main=nowNext+todo+nearLine;
  var quick='<div class="home-quick-actions"><button class="tbtn" data-act="add-schedule" data-date="'+k+'">+ 일정</button><button class="tbtn" data-act="add-dd" data-date="'+k+'">D-day</button></div>';
  var savedNemoMood=diaryMoodForDate(k),nemoMood=savedNemoMood||nemoMoodForToday(tot,dn,hour),nemoCopy=nemoHomeCopy(nemoMood,tot,dn,!!savedNemoMood),nemoState=planonNemoStateForDate(k);
  var nemoFace=(typeof nemoStateSVG==='function'?nemoStateSVG(nemoState,nemoMood,'nemo-home-char'):nemoSVG(nemoMood,'nemo-home-char'));
  var nemo='<div class="nemo-home-head">'+nemoFace+'<span class="nemo-copy"><b>'+esc(nemoCopy[0])+'</b><small>'+esc(nemoCopy[1])+'</small></span></div>';
  return '<section class="home home-clean"><div class="home-main">'+nemo+main+'</div>'+quick+'</section>';
}
function isStandalonePWA(){
  try{return window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;}catch(e){return false;}
}
function isIOSDevice(){return /iPad|iPhone|iPod/.test(navigator.userAgent)||(/Macintosh/.test(navigator.userAgent)&&navigator.maxTouchPoints>1);}
function reminderPermissionLabel(){
  if(!('Notification' in window))return isIOSDevice()&&!isStandalonePWA()?'홈 화면 설치 필요':'알림 미지원';
  if(Notification.permission==='granted')return '허용됨';
  if(Notification.permission==='denied')return '차단됨';
  return '권한 필요';
}
function askReminderPermission(){
  if(isIOSDevice()&&!isStandalonePWA()){
    S.settings.remindOn=false;save();render();toast('아이폰은 Safari 공유 → 홈 화면에 추가 후 앱으로 열어야 알림을 켤 수 있어요');return Promise.resolve(false);
  }
  if(!('Notification' in window)){
    S.settings.remindOn=false;save();render();toast('이 브라우저는 시스템 알림을 지원하지 않아요');return Promise.resolve(false);
  }
  if(Notification.permission==='granted'){
    S.settings.remindOn=true;save();render();toast('가까운 일정 알림을 켰어요');return Promise.resolve(true);
  }
  if(Notification.permission==='denied'){
    S.settings.remindOn=false;save();render();toast('알림이 차단되어 있어요. 브라우저/기기 설정에서 알림을 허용해주세요');return Promise.resolve(false);
  }
  return Notification.requestPermission().then(function(p){
    if(p==='granted'){
      S.settings.remindOn=true;save();render();toast('가까운 일정 알림을 켰어요');return true;
    }
    S.settings.remindOn=false;save();render();toast(p==='denied'?'알림 권한이 차단됐어요':'알림 권한이 허용되지 않았어요');return false;
  }).catch(function(){
    S.settings.remindOn=false;save();render();toast('알림 권한을 요청하지 못했어요');return false;
  });
}
function checkReminders(){
  if(!S.settings.remindOn||!('Notification' in window)||Notification.permission!=='granted')return;
  var d=new Date(),k=dkey(d),now=d.getHours()*60+d.getMinutes(),changed=false;
  itemsFor(d).filter(function(it){return !it.skipped&&it.start>=now&&it.start-now<=30;}).forEach(function(it){
    var key=k+'|'+it.id+'|'+it.start;
    if(S.settings.notified[key])return;
    try{new Notification('곧 시작해요',{body:it.name+' · '+timeShort(fmt(it.start))});}catch(e){}
    S.settings.notified[key]=Date.now();changed=true;
  });
  gapsOf(itemsFor(d)).forEach(function(g){
    if(g.end-g.start<40||now<g.start||now-g.start>5)return;
    var key=k+'|gap|'+g.start;if(S.settings.notified[key])return;
    var c=gapFillCandidates(k)[0];
    try{new Notification(modeGapWord()+' '+durText(g.end-g.start)+' 시작',{body:c?'지금 하기 좋은 일: '+c.text:'다음 일정은 '+timeShort(fmt(g.end))+'부터예요'});}catch(e){}
    S.settings.notified[key]=Date.now();changed=true;
  });
  Object.keys(S.settings.notified).forEach(function(key){if(Date.now()-S.settings.notified[key]>1209600000){delete S.settings.notified[key];changed=true;}});
  if(changed)save();
}
function todoCarryBump(t){
  t.carryCount=Math.max(0,Number(t.carryCount||0))+1;
  t.carried=true;t.lastCarriedAt=Date.now();
}
function splitChildren(parentId){return S.todos.filter(function(t){return t.splitParentId===parentId;});}
function syncSplitParent(parentId){
  var p=findTodo(parentId);if(!p)return;
  var xs=splitChildren(parentId);if(!xs.length){p.planChildIds=[];return;}
  p.planChildIds=xs.map(function(x){return x.id;});
  p.planDoneMin=xs.filter(function(x){return x.done;}).reduce(function(n,x){return n+Number(x.dur||0);},0);
  if(xs.every(function(x){return x.done;}))p.done=true;
}
function splitPlanProgressHTML(t){
  if(!t||!Array.isArray(t.planChildIds)||!t.planChildIds.length)return '';
  var xs=splitChildren(t.id),tot=xs.reduce(function(n,x){return n+Number(x.dur||0);},0),dn=xs.filter(function(x){return x.done;}).reduce(function(n,x){return n+Number(x.dur||0);},0);
  var pct=tot?Math.round(dn/tot*100):0;
  return '<div class="task-plan-box"><b>분할 계획 '+xs.filter(function(x){return x.done;}).length+'/'+xs.length+'개 완료</b><span>'+durLong(dn)+' / '+durLong(tot)+'</span><div class="task-plan-progress"><i style="width:'+pct+'%"></i></div></div>';
}
function nextPlanSlot(fromKey,toKey,dur){
  var d=parseKey(fromKey),end=parseKey(toKey);
  while(d<=end){
    var k=dkey(d),gs=openGaps(k);
    for(var i=0;i<gs.length;i++){
      var g=gs[i],avail=g.end-g.start;
      if(avail>=dur)return {date:k,start:g.start,dur:dur};
      if(avail>=30&&dur>30)return {date:k,start:g.start,dur:Math.min(avail,dur)};
    }
    d=addDays(d,1);
  }
  return null;
}
function createSplitPlan(parent,totalMin,blockMin){
  if(!parent||parent.done)return {made:0,left:totalMin};
  if(!parent.due)return {error:'마감일을 먼저 정해주세요.'};
  var due=parent.due,today=todayKey();
  if(due<today)return {error:'이미 지난 마감일이에요.'};
  /* 기존 분할 블록은 중복 생성하지 않아요. */
  var existing=splitChildren(parent.id).filter(function(x){return !x.done;});
  if(existing.length)return {error:'이미 진행 중인 분할 계획이 있어요.'};
  parent.planTotalMin=totalMin;parent.planBlockMin=blockMin;parent.planChildIds=[];parent.planCreatedAt=Date.now();
  var left=totalMin,made=0,guard=0;
  while(left>0&&guard++<200){
    var want=Math.min(blockMin,left),slot=nextPlanSlot(today,due,want);
    if(!slot&&want>30)slot=nextPlanSlot(today,due,30);
    if(!slot)break;
    var child={id:uid(),text:parent.text+' · '+(made+1),done:false,star:parent.star,scope:'day',key:slot.date,due:parent.due,course:parent.course||'',time:fmt(slot.start),dur:slot.dur,created:Date.now()+made,order:Date.now()+made,carried:false,carryCount:0,splitParentId:parent.id,splitIndex:made+1};
    S.todos.push(child);parent.planChildIds.push(child.id);left-=slot.dur;made++;
  }
  parent.planUnscheduledMin=Math.max(0,left);
  return {made:made,left:left};
}
function openSplitTodo(id){
  var t=findTodo(id);if(!t)return;
  if(t.splitParentId){var p=findTodo(t.splitParentId);if(p)t=p;}
  M={type:'split-todo',id:t.id};
  openModal('<h3>큰 과제 쪼개기</h3><p class="hint">마감일까지 비어 있는 '+esc(modeGapWord())+'에 나눠 넣어요. 이미 잡힌 '+esc(modeBlockWord())+'·일정·할 일과 겹치지 않아요.</p>'+
    '<div class="requestbox"><b>'+esc(t.text)+'</b><small>마감 '+(t.due?esc(t.due):'미정')+'</small></div>'+
    '<span class="lbl">예상 총 시간</span><select class="fld" id="f-split-total">'+[120,180,240,300,360,480,600,720].map(function(x){return '<option value="'+x+'"'+(Number(t.planTotalMin||360)===x?' selected':'')+'>'+durLong(x)+'</option>';}).join('')+'</select>'+
    '<span class="lbl">한 번에</span><select class="fld" id="f-split-block">'+[30,60,90,120].map(function(x){return '<option value="'+x+'"'+(Number(t.planBlockMin||60)===x?' selected':'')+'>'+durLong(x)+'</option>';}).join('')+'</select>'+
    '<p class="hint" id="split-msg"></p><div class="acts"><button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="split-todo-confirm">'+esc(modeGapWord())+'에 나눠 넣기</button></div>');
}
function splitTodoNow(){
  var p=findTodo(M.id),msg=$('#split-msg');if(!p)return;
  var total=Number($('#f-split-total').value)||360,block=Number($('#f-split-block').value)||60;
  var r=createSplitPlan(p,total,block);
  if(r.error){if(msg)msg.textContent=r.error;return;}
  save();closeModal();render();
  inAppToast(r.left?modeGapWord()+'에 '+r.made+'개 배치했어요 · '+durLong(r.left)+'은 아직 자리가 없어요':'과제를 '+r.made+'개 블록으로 나눴어요');
}
function deleteTodoCascade(id){
  var t=findTodo(id);if(!t)return;
  if(t.splitParentId){
    var pid=t.splitParentId;S.todos=S.todos.filter(function(x){return x.id!==id;});syncSplitParent(pid);return;
  }
  var kids=splitChildren(id).map(function(x){return x.id;});
  S.todos=S.todos.filter(function(x){return x.id!==id&&kids.indexOf(x.id)<0;});
}
function rescheduleSplitChild(t){
  if(!t||!t.splitParentId||t.done)return false;
  var p=findTodo(t.splitParentId),due=(p&&p.due)||t.due;
  if(!due||due<todayKey())return false;
  var oldKey=t.key,oldTime=t.time;t.scope='inbox';t.key=null;t.time=null;
  var slot=nextPlanSlot(todayKey(),due,Number(t.dur||60));
  if(slot){t.scope='day';t.key=slot.date;t.time=fmt(slot.start);t.dur=slot.dur;t.carried=true;todoCarryBump(t);return true;}
  t.scope='day';t.key=todayKey();t.time=null;t.carried=true;todoCarryBump(t);return false;
}
function repeatedCarryTodos(){
  return S.todos.filter(function(t){return !t.done&&!t.splitParentId&&Number(t.carryCount||0)>=3;})
    .sort(function(a,b){return Number(b.carryCount||0)-Number(a.carryCount||0);});
}
function maybeReviewRepeatedCarry(){
  if(M.type)return;
  var xs=repeatedCarryTodos(),tk=todayKey();
  if(!xs.length||S.settings.carryReviewShown===tk)return;
  S.settings.carryReviewShown=tk;save();
  var t=xs[0];M={type:'stale-todo',id:t.id};
  openModal('<h3>계속 미뤄진 할 일</h3><div class="requestbox"><b>'+esc(t.text)+'</b><small>'+Number(t.carryCount||0)+'번 이월됐어요. 그대로 미루기보다 정리해볼까요?</small></div>'+
    '<div class="stale-actions"><button class="primary" data-act="stale-split" data-id="'+t.id+'">쪼개기</button><button data-act="stale-date" data-id="'+t.id+'">날짜 정하기</button><button data-act="stale-delete" data-id="'+t.id+'">삭제</button></div>'+
    '<div class="acts"><button class="b-ghost" data-act="close">나중에</button></div>');
}
function openStaleDate(id){
  var t=findTodo(id);if(!t)return;M={type:'stale-date',id:id};
  openModal('<h3>날짜 정하기</h3><p class="hint">'+esc(t.text)+'</p><input class="fld" type="date" id="f-stale-date" value="'+esc(t.due||todayKey())+'"><div class="acts"><button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="stale-date-save">이 날짜로 옮기기</button></div>');
}

function briefingPermission(){
  if(isIOSDevice()&&!isStandalonePWA()){inAppToast('아이폰은 홈 화면에 추가한 뒤 아침 브리핑을 켤 수 있어요');return Promise.resolve(false);}
  if(!('Notification' in window)){inAppToast('이 브라우저는 알림을 지원하지 않아요');return Promise.resolve(false);}
  if(Notification.permission==='granted')return Promise.resolve(true);
  if(Notification.permission==='denied'){inAppToast('알림이 차단되어 있어요. 기기 설정에서 허용해주세요');return Promise.resolve(false);}
  return Notification.requestPermission().then(function(p){return p==='granted';});
}
function todayBriefingData(){
  carryOver();
  var d=parseKey(todayKey()),k=todayKey();
  var cls=itemsFor(d).filter(function(x){return x.kind==='class'&&!x.skipped;}).length;
  var due=S.todos.filter(function(t){return !t.done&&t.due===k;}).length+S.exams.filter(function(e){return (e.start||'')===k;}).length;
  var gapMin=openGaps(k).reduce(function(n,g){return n+Math.max(0,g.end-g.start);},0);
  var todo=S.todos.filter(function(t){return !t.done&&t.scope==='day'&&t.key===k;}).length;
  return {classes:cls,due:due,gap:gapMin,todo:todo};
}
function checkMorningBriefing(force){
  if(!S.settings.morningBriefing||!('Notification' in window)||Notification.permission!=='granted')return;
  var n=new Date(),k=todayKey(),tm=S.settings.morningBriefingTime||'08:00',p=tm.split(':'),target=(+p[0]||8)*60+(+p[1]||0),now=n.getHours()*60+n.getMinutes();
  if(!force&&(now<target||S.settings.morningBriefingSent===k))return;
  var b=todayBriefingData(),body='오늘 '+modeBlockWord()+' '+b.classes+'개 · 마감 '+b.due+'개 · '+modeGapWord()+' '+durText(b.gap);
  if(b.todo)body+=' · 할 일 '+b.todo+'개';
  try{new Notification('오늘의 플래너',{body:body});}catch(e){}
  S.settings.morningBriefingSent=k;save();
}
function toggleMorningBriefing(){
  if(S.settings.morningBriefing){S.settings.morningBriefing=false;save();render();return;}
  briefingPermission().then(function(ok){if(!ok)return;S.settings.morningBriefing=true;save();render();checkMorningBriefing(true);});
}
function carryOver(){
  /* Smart Plan v2: 지난 미완료 일정은 사용자 확인 없이 이동하지 않습니다.
     위치는 그대로 보존하고 missedAt만 표시해 재배치 제안 UI가 처리합니다. */
  var tk=todayKey(),ch=false;
  S.todos.forEach(function(t){
    if(t.done||t.scope!=='day'||!t.key||t.key>=tk)return;
    if(!t.missedAt){t.missedAt=Date.now();ch=true;}
  });
  if(ch)save();
}
/* ----- 집중 타이머 ----- */
var F=null,FT=null;
function saveF(){if(F)lsSet('planner.focusState',JSON.stringify(F));else{try{localStorage.removeItem('planner.focusState');}catch(e){}}}
function restoreFocus(){
  var raw=lsGet('planner.focusState');if(!raw)return;
  try{F=JSON.parse(raw);}catch(e){F=null;}
  if(!F||F.phase==='idle'){F=null;saveF();return;}
  M={type:'focus'};drawFocus();catchUp();
}
function catchUp(){
  if(!F||F.mode==='sw'||F.phase!=='work')return;
  var late=Date.now()-F.endAt;
  if(late>=0){
    var w=FMODES[F.mode][0];addFocus(w);
    if(late>FMODES[F.mode][1]*60000||late>15000){F.phase='idle';F.left=w*60;saveF();drawFocusDone(w,true);F=null;saveF();return;}
  }
}
var FMODES={p25:[25,5],p50:[50,10],sw:[0,0]};
function openFocus(tid){
  var mode=lsGet('planner.fmode')||'p25';
  if(F&&F.phase!=='idle'){M={type:'focus'};drawFocus();return;}
  F={tid:tid||null,mode:mode,phase:'idle',endAt:0,startAt:0,left:FMODES[mode][0]*60,acc:0};
  M={type:'focus'};drawFocus();
}
function fLabel(sec){sec=Math.max(0,Math.round(sec));return pad(Math.floor(sec/60))+':'+pad(sec%60);}
var RING=2*Math.PI*118;
function fShown(){
  var run=F.phase==='work'||F.phase==='break';
  if(F.mode==='sw')return F.phase==='work'?(Date.now()-F.startAt)/1000+F.acc:F.acc;
  return run?(F.endAt-Date.now())/1000:F.left;
}
function fProg(){
  if(F.mode==='sw'){return (fShown()%3600)/3600;}
  var tot=(F.phase==='break'||(F.phase==='paused'&&F.pbreak)?FMODES[F.mode][1]:FMODES[F.mode][0])*60;
  return 1-Math.max(0,fShown())/tot;
}
function weekFocus(){var m=mondayOf(studyDayDate(new Date())),t=0;for(var i=0;i<7;i++)t+=S.focus[dkey(addDays(m,i))]||0;return t;}
function focusTasks(){var tk=todayKey(),wk=dkey(mondayOf(studyDayDate(new Date())));
  return sortTodos(S.todos.filter(function(t){return !t.done&&((t.scope==='day'&&t.key===tk)||(t.scope==='week'&&t.key===wk)||t.scope==='inbox');}));}
function drawFocusDone(min,late){
  var t=F&&F.tid?S.todos.find(function(x){return x.id===F.tid;}):null;
  openModal('<div class="fpage"><div class="fdone"><div class="fcheck"><svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>'+
    (late?'<p class="flate">자리를 비운 사이에 끝났어요</p>':'')+'<h2>'+durLong(min)+' 집중했어요</h2><p>'+(t?esc(t.text)+'에 기록했어요':'오늘 집중 시간에 기록했어요')+'</p><p class="fsmall">오늘 '+durLong(S.focus[todayKey()]||0)+' · 이번 주 '+durLong(weekFocus())+'</p></div>'+
    '<div class="factions"><button class="fbig" data-act="fdone-ok">확인</button></div></div>');
  $('#modal').classList.add('full');M={type:'focusdone'};
}
function drawFocus(){
  var t=F.tid?S.todos.find(function(x){return x.id===F.tid;}):null;
  var run=F.phase==='work'||F.phase==='break';
  var brk=F.phase==='break'||(F.phase==='paused'&&F.pbreak);
  var seg=[['p25','25 + 5'],['p50','50 + 10'],['sw','스톱워치']].map(function(x){return '<button data-act="fmode" data-v="'+x[0]+'" class="'+(F.mode===x[0]?'on':'')+'"'+(run?' disabled':'')+'>'+x[1]+'</button>';}).join('');
  var k=todayKey();
  openModal('<div class="fpage'+(brk?' brk':'')+'">'+
    '<div class="ftop"><button class="ibtn" data-act="fstop" aria-label="끝내고 나가기">‹</button><span>'+(brk?'휴식':'집중')+'</span><span class="ftoday">오늘 <b>'+durLong(S.focus[k]||0)+'</b></span></div>'+
    '<select class="ftask-sel" id="f-task"'+(run?' disabled':'')+'><option value="">할 일 선택 안 함</option>'+focusTasks().map(function(x){return '<option value="'+x.id+'"'+(x.id===F.tid?' selected':'')+'>'+esc(x.text)+'</option>';}).join('')+
      (t&&focusTasks().indexOf(t)<0?'<option value="'+t.id+'" selected>'+esc(t.text)+'</option>':'')+'</select>'+
    '<div class="fring"><svg viewBox="0 0 260 260" aria-hidden="true"><circle cx="130" cy="130" r="118" class="rtrack"/><circle cx="130" cy="130" r="118" class="rbar" id="fring" style="stroke-dasharray:'+RING+';stroke-dashoffset:'+(RING*(1-fProg()))+'"/></svg>'+
    '<div class="fcenter"><div class="fclock" id="fclock">'+fLabel(fShown())+'</div><div class="fstate">'+(brk?(F.justDone?FMODES[F.mode][0]+'분 기록했어요 · 쉬는 중':'잠깐 쉬어요'):run?'집중하는 중':F.phase==='paused'?'멈춤':'준비')+'</div></div></div>'+
    '<div class="seg fseg">'+seg+'</div>'+
    '<div class="factions">'+(run?'<button class="fbig ghost" data-act="fpause">멈춤</button>':'<button class="fbig" data-act="fstart">'+(F.phase==='paused'?'이어서':'시작')+'</button>')+
    '<button class="fbig ghost" data-act="fstop">끝내기</button></div><p class="fweek">이번 주 '+durLong(weekFocus())+'</p></div>');
  $('#modal').classList.add('full');
}
function tickFocus(){
  if(!F||M.type!=='focus')return;
  var el=$('#fclock');if(!el)return;
  var rg=$('#fring');if(rg)rg.style.strokeDashoffset=RING*(1-fProg());
  if(F.mode==='sw'){if(F.phase==='work')el.textContent=fLabel((Date.now()-F.startAt)/1000+F.acc);return;}
  if(F.phase!=='work'&&F.phase!=='break')return;
  var left=(F.endAt-Date.now())/1000;
  if(left<=0){
    try{navigator.vibrate&&navigator.vibrate(300);}catch(e){}
    if(F.phase==='work'){if(-left>15){catchUp();return;}addFocus(FMODES[F.mode][0]);F.justDone=true;F.phase='break';F.endAt=F.endAt+FMODES[F.mode][1]*60000;}
    else{F.phase='idle';F.left=FMODES[F.mode][0]*60;}
    saveF();drawFocus();return;
  }
  el.textContent=fLabel(left);
}
function focusStudySegments(fromMs,toMs,totalMin){
  var segs=[],cur=fromMs,left=Math.max(0,Math.round(totalMin)),guard=0;
  while(cur<toMs&&guard++<370){
    var d=new Date(cur),sd=studyDayDate(d),boundary=new Date(sd.getFullYear(),sd.getMonth(),sd.getDate()+1,(window.PLANON_STUDY_DAY&&window.PLANON_STUDY_DAY.boundaryHour)||5,0,0,0).getTime();
    var en=Math.min(toMs,boundary),raw=(en-cur)/60000,segMin;
    if(en>=toMs)segMin=left;else{segMin=Math.min(left,Math.max(0,Math.round(raw)));left-=segMin;}
    segs.push({key:studyDayKey(new Date(cur)),from:new Date(cur),to:new Date(en),min:segMin});cur=en;
  }
  return segs.filter(function(x){return x.min>0;});
}
function addFocus(min){
  min=Math.max(0,Math.round(Number(min)||0));if(min<1)return;
  var now=new Date(),fromMs=now.getTime()-min*60000,segs=focusStudySegments(fromMs,now.getTime(),min),tid=F&&F.tid||null;
  segs.forEach(function(seg){
    S.focus[seg.key]=(S.focus[seg.key]||0)+seg.min;
    (S.fsess[seg.key]=S.fsess[seg.key]||[]).push({start:pad(seg.from.getHours())+':'+pad(seg.from.getMinutes()),end:pad(seg.to.getHours())+':'+pad(seg.to.getMinutes()),tid:tid,min:seg.min});
  });
  if(tid){var t=S.todos.find(function(x){return x.id===tid;});if(t)t.focusMin=(t.focusMin||0)+min;}
  save();
}
var DDAY_CATS={couple:{label:'커플',icon:'♡'},exam:{label:'시험',icon:'✎'},birthday:{label:'생일',icon:'✦'},travel:{label:'여행',icon:'→'},deadline:{label:'마감',icon:'!'},anniversary:{label:'기념일',icon:''},graduation:{label:'입학·졸업',icon:''},other:{label:'기타',icon:'—'}};
function ddInferCategory(x){var t=String(x&&x.title||'');if(/시험|중간|기말|모의고사|수능|토익|자격/.test(t))return 'exam';if(/생일/.test(t))return 'birthday';if(/여행|출국|입국|휴가/.test(t))return 'travel';if(/마감|제출|공모전|신청/.test(t))return 'deadline';if(/100일|200일|300일|연애|커플|우리|만난|사귄|사귐|처음 만난|애인|남친|여친|남자친구|여자친구|\u2665|\u2764/.test(t))return 'couple';if(/주년|기념/.test(t))return 'anniversary';if(/입학|졸업|개강|종강/.test(t))return 'graduation';return 'other';}
function ddCategory(x){var c=x&&x.category||ddInferCategory(x);return DDAY_CATS[c]?c:'other';}
function ddCatIcon(x){return DDAY_CATS[ddCategory(x)].icon;}
function ddCatIconHTML(x){
  var cat=typeof x==='string'?x:ddCategory(x);
  if(cat==='anniversary'){
    return '<svg class="dd-anniv-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="7" r="2.7"/><circle cx="17" cy="12" r="2.7"/><circle cx="12" cy="17" r="2.7"/><circle cx="7" cy="12" r="2.7"/><circle cx="12" cy="12" r="1.4"/></svg>';
  }
  if(cat==='graduation'){
    return '<svg class="dd-grad-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.5 8.7 12 5l8.5 3.7L12 12.4 3.5 8.7Z"/><path d="M7.2 10.6v4.1c2.6 2.1 7 2.1 9.6 0v-4.1"/><path d="M20.5 8.8v5.1"/></svg>';
  }
  return esc(DDAY_CATS[cat]&&DDAY_CATS[cat].icon||'—');
}
function ddCatLabel(x){return DDAY_CATS[ddCategory(x)].label;}
function dateKeyAdd(k,n){return dkey(addDays(parseKey(k),n));}
function coupleDayNo(x,k){if(!x||!x.date||k<x.date)return 0;return Math.floor((parseKey(k)-parseKey(x.date))/86400000)+1;}
function coupleAnniversaryNo(x,k){if(!x||!x.date||k<x.date)return 0;var a=parseKey(x.date),b=parseKey(k),y=b.getFullYear()-a.getFullYear();return y>=1&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate()?y:0;}
function coupleMilestoneName(x,k){var y=coupleAnniversaryNo(x,k);if(y)return y+'주년';var n=coupleDayNo(x,k);return n>=100&&n%100===0?n+'일':'';}
function nextCoupleMilestone(x){
  var tk=todayKey();if(!x||!x.date)return tk;if(tk<x.date)return x.date;
  var n=coupleDayNo(x,tk),next100=Math.max(100,Math.ceil(n/100)*100),k100=dateKeyAdd(x.date,next100-1);if(k100<tk){next100+=100;k100=dateKeyAdd(x.date,next100-1);}
  var a=parseKey(x.date),t=parseKey(tk),yr=t.getFullYear(),ann=new Date(yr,a.getMonth(),a.getDate());if(dkey(ann)<tk||yr===a.getFullYear())ann=new Date(yr+1,a.getMonth(),a.getDate());
  var ka=dkey(ann);return k100<=ka?k100:ka;
}


function fullDateTxt(k){
  if(!k)return '—';var d=parseKey(k);return d.getFullYear()+'년 '+(d.getMonth()+1)+'월 '+d.getDate()+'일 ('+DAYS[dow(d)]+')';
}
function planonDetailRows(rows){
  return '<div class="planon-detail-list">'+rows.filter(function(x){return x&&x[1]!=null&&String(x[1]).trim()!=='';}).map(function(x){return '<div><small>'+esc(x[0])+'</small><b>'+esc(x[1])+'</b></div>';}).join('')+'</div>';
}
function coupleMilestoneDate(x,n){return x&&x.date?dateKeyAdd(x.date,Number(n)-1):'';}
function coupleAnniversaryDate(x,y){if(!x||!x.date)return '';var d=parseKey(x.date),r=new Date(d.getFullYear()+Number(y),d.getMonth(),d.getDate());return dkey(r);}
function openDDDetail(x){
  if(!x)return;M={type:'dd-detail',id:x.id};
  var cat=ddCategory(x),rows=[[ddCatLabel(x),x.title||'D-day'],['기준 날짜',fullDateTxt(x.date)],['현재',ddCount(x)]],extra='';
  if(cat==='couple'){
    var today=todayKey(),day=coupleDayNo(x,today);
    var milestone=[100,200,300,400,500,600,700,800,900,1000].map(function(n){return '<div><span>'+n+'일</span><b>'+esc(fullDateTxt(coupleMilestoneDate(x,n)))+'</b></div>';}).join('');
    var one=[1,2,3].map(function(y){return '<div><span>'+y+'주년</span><b>'+esc(fullDateTxt(coupleAnniversaryDate(x,y)))+'</b></div>';}).join('');
    var nextN=Math.max(100,Math.ceil(Math.max(day+1,1)/100)*100),next100=coupleMilestoneDate(x,nextN);
    var sd=parseKey(x.date),td=parseKey(today),yr=Math.max(1,td.getFullYear()-sd.getFullYear()),ann=coupleAnniversaryDate(x,yr);if(ann<today){yr++;ann=coupleAnniversaryDate(x,yr);}
    var candidates=[{name:nextN+'일',date:next100},{name:yr+'주년',date:ann}].sort(function(p,q){return p.date<q.date?-1:1;});
    rows.push(['오늘',day>0?day+'일째':'아직 시작 전']);
    extra='<div class="planon-milestones"><div class="planon-detail-title">기념일 날짜</div>'+milestone+one+'</div><div class="planon-next-milestone"><small>다음 기념일</small><b>'+esc(candidates[0].name)+'</b><span>'+esc(fullDateTxt(candidates[0].date))+'</span></div>';
  }else rows.push(['반복',x.yearly?'매년':'반복 없음']);
  openModal('<h3>'+esc(x.title||'D-day')+'</h3>'+planonDetailRows(rows)+extra+'<div class="acts"><button class="b-ghost" data-act="close">닫기</button><button class="b-save" data-act="edit-dd" data-id="'+x.id+'">수정</button></div>');
}
function openExamDetail(e){
  if(!e)return;M={type:'exam-detail',id:e.id};
  var pp=examPrep(e),done=pp.filter(function(x){return x.done;}).length,course=examCourse(e),df=diffDays(e.start),rows=[['과목',course||'기타'],['시험',e.kind||'시험'],['날짜',fullDateTxt(e.start)+(e.end&&e.end!==e.start?' ~ '+fullDateTxt(e.end):'')],['시간',e.time||'시간 미정'],['D-day',df===0?'오늘':(df>0?'D-'+df:'D+'+(-df))],['시험 범위',e.rangeText||''],['공부할 자료',e.materials||'']];
  var prep=pp.length?'<div class="planon-detail-section"><div class="planon-detail-title">시험 준비 · '+done+'/'+pp.length+'</div>'+pp.map(function(x){return '<div class="planon-check-row '+(x.done?'done':'')+'"><i>'+(x.done?'✓':'')+'</i><span>'+esc(x.text)+'</span></div>';}).join('')+'</div>':'';
  openModal('<h3>'+esc(e.name||e.kind||'시험')+'</h3>'+planonDetailRows(rows)+prep+'<div class="acts"><button class="b-ghost" data-act="close">닫기</button><button class="b-save" data-act="view-exam" data-id="'+e.id+'">수정</button></div>');
}
function openBlockDetail(c,dk){
  if(!c)return;M={type:'block-detail',id:c.id,date:dk||''};
  var period=(c.from||c.to)?[(c.from?fullDateTxt(c.from):'학기 시작'),(c.to?fullDateTxt(c.to):'학기 종료')].join(' ~ '):'학기 설정을 따름';
  var rows=[['강의',c.name],['요일',c.day==null?'시간 미정':DAYS[c.day]+'요일'],['시간',c.day==null?'시간 미정':((c.start||'')+' ~ '+(c.end||''))],['강의번호·장소',c.sub||''],['적용 기간',period]];
  if(dk&&Array.isArray(c.skip)&&c.skip.indexOf(dk)>=0)rows.push(['이 날짜',fullDateTxt(dk)+' · 휴강']);
  var exs=S.exams.filter(function(e){return examCourse(e)===c.name;}).sort(function(x,y){return x.start<y.start?-1:1;});
  var exhtml=exs.length?'<div class="planon-detail-section"><div class="planon-detail-title">시험 일정</div>'+exs.slice(0,5).map(function(e){return '<button class="planon-detail-link" data-act="view-exam" data-id="'+e.id+'"><span>'+esc(e.name||e.kind||'시험')+'</span><b>'+esc(fullDateTxt(e.start))+'</b></button>';}).join('')+'</div>':'';
  openModal('<h3>'+esc(c.name||modeBlockWord())+'</h3>'+planonDetailRows(rows)+exhtml+'<div class="acts"><button class="b-ghost" data-act="course-todos" data-name="'+esc(c.name)+'">과목 페이지</button><button class="b-save" data-act="edit-block-direct" data-id="'+c.id+'" data-date="'+esc(dk||'')+'">수정</button></div>');
}

function ddOn(k){var md=k.slice(5);return S.ddays.filter(function(x){if(ddCategory(x)==='couple')return x.date===k||!!coupleMilestoneName(x,k);return x.date===k||(x.yearly&&x.date.slice(5)===md&&x.date<=k);});}
function ddNext(x){if(ddCategory(x)==='couple')return nextCoupleMilestone(x);if(x.mode==='since'||!x.yearly)return x.date;var tk=todayKey(),y=Number(tk.slice(0,4)),c=y+x.date.slice(4);if(c<tk)c=(y+1)+x.date.slice(4);return x.date>c?x.date:c;}
function ddCount(x){
  if(x.mode==='since'){var n=-diffDays(x.date)+(x.one?1:0);return n>=0?'D+'+n:'D-'+(-n);}
  var m=diffDays(ddNext(x));return m===0?'D-day':m>0?'D-'+m:'D+'+(-m);
}
function ddLabel(x){if(ddCategory(x)==='couple'){var nk=ddNext(x),mil=coupleMilestoneName(x,nk)||'기념일',n=diffDays(nk);return mil+(n===0?'':n>0?' D-'+n:' D+'+(-n));}return ddCount(x);}
function ddayBar(){
  var list=S.ddays.filter(function(x){return x.pin;}).sort(function(a,b){return ddNext(a)<ddNext(b)?-1:1;});
  if(!list.length)return '';
  return '<div class="ddbar">'+list.slice(0,4).map(function(x){return '<button class="ddpill'+(diffDays(ddNext(x))===0?' today':'')+'" style="--c:'+x.color+'" data-act="view-dd" data-id="'+x.id+'"><i class="ddcat-ico">'+ddCatIconHTML(x)+'</i><span>'+esc(x.title)+'</span><b>'+ddLabel(x)+'</b></button>';}).join('')+'</div>';
}
function ddChip(x,k){var mil=ddCategory(x)==='couple'&&k?coupleMilestoneName(x,k):'';return '<button class="adchip ddchip" style="--c:'+x.color+'" data-act="view-dd" data-id="'+x.id+'"><span class="ddcat-ico">'+ddCatIconHTML(x)+'</span> '+esc(mil||x.title)+'</button>';}
function examIcon(){return '<svg class="examico" viewBox="0 0 20 20" aria-hidden="true"><path d="M6 3.5h8a1.5 1.5 0 0 1 1.5 1.5v11.5H4.5V5A1.5 1.5 0 0 1 6 3.5Z"/><path d="M8 3.5V2.8h4v.7M7.5 8h5M7.5 11h5M7.5 14h3"/></svg>';}
function examChip(x){var c=examCourse(x),col=c&&c!=='기타'?courseColor(c):BEIGE,p=examPrep(x),dn=p.filter(function(t){return t.done;}).length,pg=p.length?' · '+dn+'/'+p.length:'';return '<button class="adchip ddchip" style="--c:'+col+'" data-act="view-exam" data-id="'+x.id+'">'+examIcon()+' '+esc(x.name)+(pg?'<span class="prep-progress">'+pg+'</span>':'')+'</button>';}
function ddDisplay(x,k){if((S.settings.calDday||'icon')==='text')return ddCategory(x)==='couple'&&k?(coupleMilestoneName(x,k)||ddLabel(x)):ddLabel(x);return ddCatIcon(x);}
function ddMark(k){var x=ddOn(k)[0];if(!x)return '';var isText=(S.settings.calDday||'icon')==='text',text=ddDisplay(x,k),body=isText?esc(text):ddCatIconHTML(x);return '<span class="impmark '+(isText?'ddtext':'ddicon')+'" data-act="view-dd" data-id="'+x.id+'" style="--c:'+x.color+'" title="'+esc(ddCatLabel(x)+' · '+(coupleMilestoneName(x,k)||x.title))+'">'+body+'</span>';}
function examsFor(d){var k=dkey(d);return S.exams.filter(function(x){return k>=x.start&&k<=x.end;}).sort(function(a,b){return a.start<b.start?-1:a.start>b.start?1:0;});}
function specialRowsForDay(d){
  var k=dkey(d),dds=ddOn(k),exs=examsFor(d),ads=alldayFor(d),aps=S.events.filter(function(e){return eventOnDate(e,k)&&e.kind==='appointment'&&!e.start;}),tasks=S.todos.filter(function(t){return t.scope==='day'&&t.key===k;}),routines=routinesFor(d),total=tasks.length+routines.length,done=tasks.filter(function(t){return t.done;}).length+routines.filter(function(r){return routineDone(r,k);}).length,html='';
  if(dds.length||exs.length)html+='<div class="adrow"><span class="adlabel">D-day</span>'+dds.map(function(x){return ddChip(x,k);}).join('')+exs.map(examChip).join('')+'</div>';
  if(ads.length)html+='<div class="adrow"><span class="adlabel">일정</span>'+ads.map(adChip).join('')+'</div>';
  if(aps.length)html+='<div class="adrow"><span class="adlabel">약속</span>'+aps.map(appointmentChip).join('')+'</div>';
  html+=friendScheduleHTML(d);
  html+=pendingAppointmentHTML(k);
  if(total)html+='<div class="adrow"><span class="adlabel">할 일</span><span class="adchip todochip">'+done+'/'+total+'개 · '+Math.round(done/total*100)+'%</span></div>';
  return html;
}
function openDD(x,def){
  var v=x||{title:'',date:(def&&def.date)||dkey(U.date),color:defCol(),yearly:false,pin:true,mode:'until',one:false,category:'other'};
  M={type:'dd',id:x?x.id:null,color:v.color,mode:v.mode||'until',category:ddCategory(v)};
  openModal('<h3>'+(x?'D-day 수정':'D-day 추가')+'</h3>'+ 
    '<span class="lbl">종류</span><div class="ddcat-grid" id="f-ddcat">'+Object.keys(DDAY_CATS).map(function(k){var c=DDAY_CATS[k];return '<button type="button" data-act="dd-cat" data-v="'+k+'"><b>'+ddCatIconHTML(k)+'</b>'+esc(c.label)+'</button>';}).join('')+'</div>'+ 
    '<input class="fld" id="f-ddt" placeholder="예: 우리, 기말고사, 여행, 공모전 마감" maxlength="30" value="'+esc(v.title)+'">'+ 
    '<span class="lbl" id="f-ddmode-label">어떻게 셀까요</span><div class="seg" id="f-ddm"><button data-act="dd-mode" data-v="until">그날까지 남은 날 (D-)</button><button data-act="dd-mode" data-v="since">그날부터 지난 날 (D+)</button></div>'+ 
    '<span class="lbl" id="f-ddl">날짜</span><input class="fld" type="date" id="f-ddd" value="'+v.date+'">'+ 
    '<label class="ck" id="f-ddyw"><input type="checkbox" id="f-ddy"'+(v.yearly?' checked':'')+'>매년 반복</label>'+ 
    '<label class="ck" id="f-ddow"><input type="checkbox" id="f-ddo"'+(v.one?' checked':'')+'>시작한 날을 1일로 세기 (당일 D+1)</label>'+ 
    '<label class="ck"><input type="checkbox" id="f-ddp"'+(v.pin?' checked':'')+'>맨 위에 표시</label>'+ 
    '<p class="ddprev" id="f-ddprev"></p>'+palHTML(v.color)+ 
    '<div class="acts">'+(x?'<button class="b-del" data-act="del-dd">삭제</button>':'')+'<button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="save-dd">저장</button></div>');
  drawDD();if(!x)setTimeout(function(){var f=$('#f-ddt');if(f)f.focus();},50);
}
function drawDD(){
  var couple=M.category==='couple';if(couple)M.mode='since';
  document.querySelectorAll('#f-ddcat button').forEach(function(b){b.classList.toggle('on',b.dataset.v===M.category);});
  document.querySelectorAll('#f-ddm button').forEach(function(b){b.classList.toggle('on',b.dataset.v===M.mode);});
  var since=M.mode==='since';
  var modeBox=$('#f-ddm'),modeLabel=$('#f-ddmode-label');if(modeBox)modeBox.style.display=couple?'none':'';if(modeLabel)modeLabel.style.display=couple?'none':'';
  $('#f-ddl').textContent=couple?'처음 만난 날 / 시작일':(since?'시작한 날':'목표 날짜');
  $('#f-ddyw').style.display=since?'none':'';$('#f-ddow').style.display=since&&!couple?'':'none';if(couple&&$('#f-ddo'))$('#f-ddo').checked=true;
  var d=$('#f-ddd').value,pv=$('#f-ddprev');if(d&&pv){var tmp={category:M.category,mode:M.mode,date:d,yearly:$('#f-ddy').checked,one:couple?true:$('#f-ddo').checked};pv.textContent=couple?('다음 기념일 · '+ddLabel(tmp)):('오늘 기준 '+ddCount(tmp));}
}
function saveDD(){
  var t=$('#f-ddt').value.trim(),d=$('#f-ddd').value;if(!t){bad('#f-ddt');return;}if(!d){bad('#f-ddd');return;}
  var couple=M.category==='couple',since=couple||M.mode==='since';
  var data={title:t,date:d,category:M.category||'other',mode:couple?'since':M.mode,yearly:!since&&$('#f-ddy').checked,one:couple?true:(since&&$('#f-ddo').checked),pin:$('#f-ddp').checked,color:M.color};
  if(M.id){var x=S.ddays.find(function(y){return y.id===M.id;});if(x)Object.assign(x,data);}else S.ddays.push(Object.assign({id:uid()},data));save();closeModal();render();
}
function clsFrom(c){return c.from||S.settings.semStart||'';}
function clsTo(c){return c.to||S.settings.semEnd||'';}
function clsActive(c,k){var a=clsFrom(c),b=clsTo(c);return (!a||k>=a)&&(!b||k<=b);}
function defCol(){return S.settings.defColor||PALETTE[5];}
function applyDefaultColorToPlanner(){
  var c=defCol();
  S.classes.forEach(function(x){x.color=c;});
  S.events.forEach(function(x){x.color=c;});
  S.allday.forEach(function(x){x.color=c;});
  S.ddays.forEach(function(x){x.color=c;});
}
var HOLI={"2026-01-01":"신정","2026-02-16":"설날 연휴","2026-02-17":"설날","2026-02-18":"설날 연휴","2026-03-01":"삼일절","2026-03-02":"대체공휴일","2026-05-01":"노동절","2026-05-05":"어린이날","2026-05-24":"부처님오신날","2026-05-25":"대체공휴일","2026-06-03":"지방선거","2026-06-06":"현충일","2026-07-17":"제헌절","2026-08-15":"광복절","2026-08-17":"대체공휴일","2026-09-24":"추석 연휴","2026-09-25":"추석","2026-09-26":"추석 연휴","2026-10-03":"개천절","2026-10-05":"대체공휴일","2026-10-09":"한글날","2026-12-25":"성탄절","2027-01-01":"신정","2027-02-06":"설날 연휴","2027-02-07":"설날","2027-02-08":"설날 연휴","2027-02-09":"대체공휴일","2027-03-01":"삼일절","2027-05-01":"노동절","2027-05-05":"어린이날","2027-05-13":"부처님오신날","2027-06-06":"현충일","2027-07-17":"제헌절","2027-07-19":"대체공휴일","2027-08-15":"광복절","2027-08-16":"대체공휴일","2027-09-14":"추석 연휴","2027-09-15":"추석","2027-09-16":"추석 연휴","2027-10-03":"개천절","2027-10-04":"대체공휴일","2027-10-09":"한글날","2027-10-11":"대체공휴일","2027-12-25":"성탄절","2027-12-27":"대체공휴일"};
function holi(k){return S.settings.holiOff?null:HOLI[k]||null;}
function semOf(k){var y=+k.slice(0,4),m=+k.slice(5,7);return m>=3&&m<=8?{y:y,t:1}:m>=9?{y:y,t:2}:{y:y-1,t:2};}
function semTxt(o){return o.y+'-'+o.t+'학기';}
function rangeSeg(id,single){return '<div class="seg rseg" id="'+id+'"><button data-act="rsel" data-v="1" data-g="'+id+'" class="'+(single?'on':'')+'">하루</button><button data-act="rsel" data-v="0" data-g="'+id+'" class="'+(single?'':'on')+'">기간</button></div>';}
function examCourse(e){
  if(e.course)return e.course;
  var nm=(e.name||'').replace(/\s/g,''),hit=null;
  courseNames().forEach(function(c){var cc=c.replace(/\s/g,'');if(cc&&nm.indexOf(cc)>=0&&(!hit||cc.length>hit.replace(/\s/g,'').length))hit=c;});
  return hit;
}
function examRow(e,noCourse){
  var ec=examCourse(e),pp=examPrep(e),pd=pp.filter(function(x){return x.done;}).length,prog=pp.length?' · 준비 '+pd+'/'+pp.length:'';
  return '<div class="setrow'+(e.end<todayKey()?' past':'')+'"><span>'+esc(e.name)+'<small>'+rangeTxt(e.start,e.end)+(e.time?' · '+e.time:'')+(e.kind?' · '+e.kind:'')+(!noCourse&&ec&&ec!=='기타'&&e.name.replace(/\s/g,'').indexOf(ec.replace(/\s/g,''))<0?' · '+esc(ec):'')+prog+'</small></span><button class="tbtn" data-act="edit-exam" data-id="'+e.id+'">수정</button></div>';
}
function exPinned(e){return e.pin!=null?e.pin:e.kind!=='기타';}
function topItems(){
  var tk=todayKey(),items=[];
  S.exams.forEach(function(e){if(!exPinned(e)||e.end<tk)return;var d=diffDays(e.start),lab=d>0?'D-'+d:d===0?'D-day':(diffDays(e.end)===0?'오늘 끝':'진행 중');
    items.push({id:'exam:'+e.id,type:'exam',title:e.name,sub:rangeTxt(e.start,e.end)+(e.time?' · '+e.time:'')+(e.kind?' · '+e.kind:''),value:lab,k:e.start,now:d<=0});});
  S.ddays.forEach(function(x){if(!x.pin)return;var nk=ddNext(x);
    items.push({id:'dd:'+x.id,type:'dd',title:x.title,sub:rangeTxt(nk)+(x.mode==='since'?' 부터':''),value:ddLabel(x),k:x.mode==='since'?'9999':nk,now:diffDays(nk)===0&&x.mode!=='since',color:x.color});});
  var order=S.settings.topOrder||[],rank={};order.forEach(function(id,i){rank[id]=i;});
  items.sort(function(a,b){var ar=rank[a.id],br=rank[b.id];
    if(ar!=null&&br!=null)return ar-br;if(ar!=null)return -1;if(br!=null)return 1;
    return a.k<b.k?-1:a.k>b.k?1:0;
  });
  return items;
}
function topItemHTML(i){
  var act=i.type==='exam'?'edit-exam':'edit-dd',icon='';if(i.type==='dd'){var dx=S.ddays.find(function(x){return 'dd:'+x.id===i.id;});icon=dx?'<i class="ddcat-row" style="--c:'+dx.color+'">'+ddCatIconHTML(dx)+'</i> ':'';}
  return '<button class="trow'+(i.now?' now':'')+'" data-act="'+act+'" data-id="'+(i.type==='exam'?i.id.slice(5):i.id.slice(3))+'"><span><b>'+icon+esc(i.title)+'</b><small>'+esc(i.sub)+'</small></span><em>'+esc(i.value)+'</em></button>';
}
function topBar(){
  if(S.settings.topShow===false)return '';
  var n=Math.min(3,Math.max(0,S.settings.topN!=null?S.settings.topN:3)),items=topItems();
  if(n===0)return '';
  return items.length?'<div class="toplist">'+items.slice(0,n).map(topItemHTML).join('')+'</div>':'';
}
function routinesFor(d){var w=dow(d);return S.routines.filter(function(r){return r.days.indexOf(w)>=0;});}
function routineDone(r,k){return (S.routineDone[k]||[]).indexOf(r.id)>=0;}
function daysText(days){
  if(days.length===7)return '매일';
  var wd=[0,1,2,3,4];
  if(days.length===5&&wd.every(function(x){return days.indexOf(x)>=0;}))return '평일마다';
  return '매주 '+days.slice().sort().map(function(x){return DAYS[x];}).join('·');
}
function durText(m,short){var h=Math.floor(m/60),mm=m%60;if(short)return h+':'+pad(mm);return (h?h+'시간':'')+(h&&mm?' ':'')+(mm?mm+'분':'');}
function gapsOf(items){
  var out=[],end=-1;
  items.filter(function(i){return !i.skipped;}).slice().sort(function(a,b){return a.start-b.start;}).forEach(function(it){
    if(end>=0&&it.start-end>=30)out.push({start:end,end:it.start});
    end=Math.max(end,it.end);
  });
  return out;
}
/* ---------- 공강 채우기 ---------- */
function gapDueRank(t){return t.due?diffDays(t.due):999;}
function gapFillCandidates(k){
  var wk=dkey(mondayOf(parseKey(k))),mk=k.slice(0,7);
  return S.todos.filter(function(t){
    if(t.done)return false;
    if(t.scope==='day')return t.key<=k&&!(t.key===k&&t.time);
    if(t.scope==='week')return t.key===wk;
    if(t.scope==='month')return t.key===mk&&!!t.due;
    if(t.scope==='inbox')return !!t.due&&diffDays(t.due)<=7;
    return false;
  }).sort(function(a,b){return (+!!b.star)-(+!!a.star)||gapDueRank(a)-gapDueRank(b)||ordOf(a)-ordOf(b);});
}
function openGaps(k){
  var isT=k===todayKey(),n=new Date(),nm=n.getHours()*60+n.getMinutes();
  return gapsOf(itemsFor(parseKey(k))).map(function(g){var st=g.start;if(isT&&nm>st)st=Math.ceil(nm/5)*5;return {start:st,end:g.end};}).filter(function(g){return g.end-g.start>=30;});
}
function gapPlan(k){
  var cands=gapFillCandidates(k),plan=[];
  openGaps(k).forEach(function(g){
    var cur=g.start;
    while(cands.length&&g.end-cur>=30){var t=cands.shift(),dur=Math.min(t.dur||60,g.end-cur);plan.push({t:t,start:cur,dur:dur});cur+=dur;}
  });
  return plan;
}
function placeTodoAt(t,k,start,dur){t.scope='day';t.key=k;t.time=fmt(start);t.dur=dur;t.carried=false;}
function gapAutoFill(k){
  var plan=gapPlan(k);if(!plan.length){inAppToast(modeGapWord()+'에 넣을 할 일이 없어요');return;}
  var before=JSON.stringify(S);
  plan.forEach(function(p){placeTodoAt(p.t,k,p.start,p.dur);});
  save();render();showUndo(before,modeGapWord()+'에 '+plan.length+'개 넣었어요');
}
function openGapFill(k,st,en){
  var isT=k===todayKey(),n=new Date(),nm=n.getHours()*60+n.getMinutes();
  if(isT&&nm>st&&nm<en)st=Math.ceil(nm/5)*5;
  M={type:'gap-fill',gap:{date:k,start:st,cur:st,end:en}};drawGapFill();
}
function drawGapFill(){
  var g=M.gap,left=g.end-g.cur,c=gapFillCandidates(g.date).slice(0,8);
  var rows=c.map(function(t){
    return '<li><button class="gapfill-row" data-act="gap-place" data-id="'+t.id+'"><span>'+esc(t.text)+(t.course?'<em class="ctag" style="--c:'+courseColor(t.course)+'">'+esc(t.course)+'</em>':'')+ddHTML(t)+'</span><b>'+timeShort(fmt(g.cur))+'</b></button></li>';
  }).join('');
  openModal('<h3>'+esc(modeGapWord())+' '+timeShort(fmt(g.cur))+'–'+timeShort(fmt(g.end))+' · '+esc(durText(left))+'</h3>'+
    (c.length?'<p class="hint">누르면 그 할 일이 이 '+esc(modeGapWord())+'에 바로 들어가요. 별표·마감 가까운 순이에요.</p><ul class="gapfill">'+rows+'</ul>'
      :'<p class="hint">'+esc(modeGapWord())+'에 넣을 할 일이 없어요. 할 일을 먼저 적거나 새 일정으로 넣어보세요.</p>')+
    '<div class="acts"><button class="b-ghost" data-act="close">닫기</button><button class="b-save" data-act="gap-new-event">새 일정으로 넣기</button></div>');
}
function gapPlace(id){
  var t=findTodo(id),g=M.gap;if(!t||!g)return;
  var dur=Math.min(t.dur||60,g.end-g.cur);
  placeTodoAt(t,g.date,g.cur,dur);g.cur+=dur;save();render();
  inAppToast(timeShort(fmt(g.cur-dur))+'에 넣었어요');
  if(g.end-g.cur>=30&&gapFillCandidates(g.date).length)drawGapFill();else closeModal();
}
function gapHomeLine(k){
  var plan=gapPlan(k);if(!plan.length)return '';
  var gl=openGaps(k).reduce(function(s,g){return s+g.end-g.start;},0);
  return '<button class="home-line gapfill-home" data-act="gap-autofill" data-date="'+k+'"><span><small>남은 '+esc(modeGapWord())+' '+esc(durText(gl))+'</small><b>할 일 '+plan.length+'개를 '+esc(modeGapWord())+'에 넣기</b></span><em>채우기 ›</em></button>';
}
/* ---------- 빠른 입력: "내일 3시 경제학 과제" ---------- */
function parseQuickTodo(raw){
  var txt=' '+raw+' ',out={},T=studyDayDate(new Date()),t0=new Date(T.getFullYear(),T.getMonth(),T.getDate()),date=null,m;
  var WD='월화수목금토일';
  function cut(re){txt=txt.replace(re,' ');}
  function mark(d,deadline){if(deadline)out.due=dkey(d);else date=d;}
  m=txt.match(/\s(오늘|내일|낼|모레|글피)(\s*(까지|마감))?(?=\s|에\s)/);
  if(m){mark(addDays(t0,{'오늘':0,'내일':1,'낼':1,'모레':2,'글피':3}[m[1]]),!!m[2]);cut(m[0]);}
  if(!m||!date&&!out.due){
    m=txt.match(/\s(이번\s?주|다음\s?주|담주)?\s*([월화수목금토일])요일(\s*(까지|마감))?(?=\s|에\s)/);
    if(m){var wi=WD.indexOf(m[2]),d;
      if(m[1]&&/다음|담/.test(m[1]))d=addDays(mondayOf(t0),7+wi);
      else if(m[1])d=addDays(mondayOf(t0),wi);
      else{d=addDays(t0,(wi-dow(t0)+7)%7);}
      mark(d,!!m[3]);cut(m[0]);}
  }
  if(!date&&!out.due){
    m=txt.match(/\s(\d{1,2})\s?(?:\/|월\s?)(\d{1,2})일?(\s*(까지|마감))?(?=\s|에\s)/);
    if(m){var mo=+m[1],da=+m[2];
      if(mo>=1&&mo<=12&&da>=1&&da<=31){var d2=new Date(t0.getFullYear(),mo-1,da);if(d2-t0<-60*864e5)d2=new Date(t0.getFullYear()+1,mo-1,da);
        if(d2-t0<=200*864e5){mark(d2,!!m[3]);cut(m[0]);}}}
  }
  m=txt.match(/\s(오전|오후|아침|저녁|밤)?\s*(\d{1,2})시(?:\s*(반|(\d{1,2})분))?(?:에|부터)?(?=\s)/);
  if(m&&!/시간/.test(m[0])){
    var h=+m[2],mi=m[3]==='반'?30:(+m[4]||0);
    if(h<=24&&mi<60){
      if(/오후|저녁|밤/.test(m[1]||'')){if(h<12)h+=12;}
      else if(!m[1]&&h>=1&&h<=7)h+=12;
      if(h===24)h=0;
      out.time=fmt(h*60+mi);cut(m[0]);}
  }else{
    m=txt.match(/\s([01]?\d|2[0-3]):([0-5]\d)(?:에|부터)?(?=\s)/);
    if(m){out.time=fmt(+m[1]*60+(+m[2]));cut(m[0]);}
  }
  var names=courseNames().slice().sort(function(a,b){return b.length-a.length;});
  for(var i=0;i<names.length;i++){var nm=names[i];if(nm.length>=2&&txt.indexOf(nm)>=0){out.course=nm;var rest=txt.replace(nm,' ').replace(/\s+/g,' ').trim();if(rest)txt=' '+rest+' ';break;}}
  if(date)out.key=dkey(date);
  out.text=txt.replace(/\s+/g,' ').trim()||raw.trim();
  return out;
}
function quickTodoToast(q){
  var bits=[];
  if(q.key){var n=diffDays(q.key);bits.push(n===0?'오늘':n===1?'내일':n===2?'모레':mdTxt(parseKey(q.key)));}
  if(q.time)bits.push(timeShort(q.time));
  if(q.due)bits.push('마감 '+mdTxt(parseKey(q.due)));
  if(q.course)bits.push(q.course);
  return bits.length?'넣었어요 · '+bits.join(' · '):'';
}
/* ---------- 하루 마감 연속 기록 ---------- */
function dayCloseStreak(){
  var set={};(S.dayCloses||[]).forEach(function(x){set[x.key]=1;});
  var d=studyDayDate(new Date());if(!set[dkey(d)])d=addDays(d,-1);
  var n=0;while(set[dkey(d)]&&n<3650){n++;d=addDays(d,-1);}
  return n;
}
function ordOf(t){return t.order!=null?t.order:t.created;}
function sortTodos(a){return a.slice().sort(function(x,y){return (+x.done)-(+y.done)||ordOf(x)-ordOf(y);});}
function keyFor(scope,d){
  return scope==='day'?dkey(d):scope==='week'?dkey(mondayOf(d)):scope==='month'?mkey(d):null;
}
function tagOf(t){
  if(t.scope==='day'){var d=parseKey(t.key);return (d.getMonth()+1)+'/'+d.getDate()+' ('+DAYS[dow(d)]+')';}
  if(t.scope==='week'){var w=parseKey(t.key);return (w.getMonth()+1)+'/'+w.getDate()+' 주';}
  if(t.scope==='month'){return Number(t.key.split('-')[1])+'월';}
  return '언제든지';
}

/* ---------- 화면: 공통 ---------- */
function relLabel(){
  var t=parseKey(todayKey()),n;
  if(U.tab==='month'){n=(U.date.getFullYear()-t.getFullYear())*12+U.date.getMonth()-t.getMonth();return n===0?'이번 달':n>0?n+'달 후':(-n)+'달 전';}
  if(U.tab==='week'){n=Math.round((mondayOf(U.date)-mondayOf(t))/(7*864e5));return n===0?'이번 주':n>0?n+'주 후':(-n)+'주 전';}
  n=diffDays(dkey(U.date));return n===0?'오늘':n>0?n+'일 후':(-n)+'일 전';
}
function topHTML(){
  var d=U.date,t='',s='',arrows=false,plus='';
  var searchBtn='<button class="ibtn" data-act="global-search" aria-label="전체 검색"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg></button>';
  var today=dkey(d)===todayKey();
  if(U.tab==='month'){t=d.getFullYear()+'년 '+(d.getMonth()+1)+'월';arrows=true;plus='add-schedule';}
  else if(U.tab==='week'){
    var m=mondayOf(d),th=addDays(m,3),e=addDays(m,6);
    t=(th.getMonth()+1)+'월 '+Math.ceil(th.getDate()/7)+'주차';
    if(S.settings.semStart&&dkey(addDays(m,6))>=S.settings.semStart&&(!S.settings.semEnd||dkey(m)<=S.settings.semEnd)){var sw=Math.floor((m-mondayOf(parseKey(S.settings.semStart)))/(7*864e5))+1;if(sw>=1)t='개강 '+sw+'주차';}
    s=(m.getMonth()+1)+'/'+m.getDate()+' – '+(e.getMonth()+1)+'/'+e.getDate();
    arrows=true;plus='add-schedule';
  }else if(U.tab==='day'){
    t=mdTxt(d)+' ('+DAYS[dow(d)]+')';
    s=(today?'오늘':d.getFullYear()+'년')+(holi(dkey(d))?' · '+holi(dkey(d)):'');
    arrows=true;plus='add-schedule';
  }else if(U.tab==='todo'){
    var n=S.todos.filter(function(x){return !x.done;}).length;
    t='할 일';s='남은 일 '+n+'개';
  }else if(U.tab==='friends'){
    var fn=(typeof FriendSync!=='undefined'&&FriendSync.friends)?FriendSync.friends.length:0;
    if(U.friendsPage==='detail'&&U.friendDetailId){
      return '<button class="ibtn" data-act="friends-home" aria-label="친구로 돌아가기">‹</button><div class="ttl"><h1>친구</h1></div>'+bellBtnHTML()+searchBtn;
    }
    t='친구';s=fn?'친구 '+fn+'명 · 비는 시간에 약속 잡기':'시간표 기준으로 약속 잡고 추억 쌓기';
  }else if(U.tab==='meonbyeol'){
    t=(window.PLANON_MEONBYEOL&&window.PLANON_MEONBYEOL.charType&&window.PLANON_MEONBYEOL.charType()==='dol')?'먼돌':'먼별';s='오늘도 복복복';
  }else if(U.tab==='settings'){
    var settingsBackAct=U.settingsPage?'settings-home':'back';
    return '<button class="ibtn" data-act="'+settingsBackAct+'" aria-label="뒤로">‹</button><div class="ttl"><h1>설정</h1></div>'+modeSwitchButtonHTML()+bellBtnHTML()+searchBtn;
  }else{
    t=plannerModeMeta().schedule;s=plannerMode()==='exam'?'반복되는 공부 블록 · 고정 공부 시간':plannerMode()==='other'?'반복되는 고정 일정':plannerMode()==='school'?'반복되는 수업 · 고정 일정':'매주 반복되는 강의 · 고정 일정';plus='add-block';
  }
  var jump=(U.tab==='month'||U.tab==='week'||U.tab==='day');
  var rainSlot=(U.tab==='day'&&today)?'<button type="button" id="planon-rain-chip" data-rain-details="1" aria-live="polite" aria-label="강수 예보 자세히 보기"></button>':'';
  return '<div class="ttl">'+(jump?'<button class="h1b" data-act="jump" aria-label="날짜로 이동"><h1>'+esc(t)+' <span class="caret">⌄</span></h1></button>':'<h1>'+esc(t)+'</h1>')+(s?'<small>'+esc(s)+'</small>':'')+rainSlot+'</div>'+
    (arrows?'<span class="topbr" aria-hidden="true"></span><button class="ibtn navg" data-act="prev" aria-label="이전">‹</button><button class="tbtn navg" data-act="today">'+relLabel()+'</button><button class="ibtn navg" data-act="next" aria-label="다음">›</button>'+(U.tab==='day'?'<button class="tbtn navg top-focus-btn" data-act="focus-free" aria-label="집중 타이머">'+ICO_CLOCK+'집중</button>':''):'')+
    (plus?'<button class="ibtn plus navg" data-act="'+plus+'" aria-label="추가">+</button>':'')+
    modeSwitchButtonHTML()+bellBtnHTML().replace('class="ibtn bell"','class="ibtn bell icog"')+searchBtn.replace('class="ibtn"','class="ibtn icog"')+
    '<button class="ibtn gear icog" data-act="open-settings" aria-label="설정">'+'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg></button>';
}
function navHTML(){
  var scheduleLabel=plannerMode()==='exam'?'공부':(plannerMode()==='other'?'스케줄':'시간표');
  var tabs=[['month','월간'],['week','주간'],['day','일간'],['todo','할 일'],['ttable',scheduleLabel],['friends','친구']];
  if(S.settings.showTodoTab===false)tabs=tabs.filter(function(t){return t[0]!=='todo';});
  if(window.PLANON_MEONBYEOL&&window.PLANON_MEONBYEOL.on())return window.PLANON_MEONBYEOL.nav(tabs,U.tab,friendPendingCount());
  return tabs.map(function(t){var dot=t[0]==='friends'&&friendPendingCount()>0?'<i class="navdot" aria-label="새 요청"></i>':'';return '<button data-act="tab" data-tab="'+t[0]+'" class="'+(U.tab===t[0]?'on':'')+'">'+t[1]+dot+'</button>';}).join('');
}
function friendPendingCount(){
  if(typeof FriendSync==='undefined'||!Sync.uid)return 0;
  var inv=(FriendSync.invitesIn||[]).length;
  var req=(FriendSync.requests||[]).filter(function(r){return r.to_user===Sync.uid&&r.status==='pending';}).length;
  return inv+req;
}
function viewFriends(){
  if(U.friendsPage==='detail'&&U.friendDetailId)return friendDetailHTML(U.friendDetailId);
  return friendHTML();
}

/* ---------- 할 일 컴포넌트 ---------- */
function todoItem(t,o){
  o=o||{};
  var courseMeta=(t.course&&!o.nocourse?'<span class="todo-course-meta ctag" data-course="'+esc(t.course)+'" style="--c:'+courseColor(t.course)+'"><span class="todo-course-name">'+esc(t.course)+'</span></span>':'');
  return '<li class="todo '+(t.done?'done':'')+'" data-tid="'+t.id+'">'+
    '<button class="chk" data-act="toggle" data-id="'+t.id+'" aria-label="완료 체크">✓</button>'+
    (o.coreToggle?'<button class="core-star '+(t.isCore?'on':'')+'" data-act="core-toggle" data-id="'+t.id+'" aria-label="오늘의 핵심 '+(t.isCore?'해제':'선택')+'">'+(t.isCore?'★':'☆')+'</button>':'')+
    '<span class="ttxt" data-act="edit-todo" data-id="'+t.id+'"><span class="todo-title-line">'+esc(t.text)+ddHTML(t)+(t.time?'<em class="tag">'+timeShort(t.time)+'</em>':'')+(t.focusMin?'<em class="tag">집중 '+durLong(t.focusMin)+'</em>':'')+(t.carried&&!t.done?'<em class="tag">이월'+(Number(t.carryCount||0)>1?' '+Number(t.carryCount||0)+'회':'')+'</em>':'')+(t.splitParentId?'<em class="tag">분할</em>':'')+(o.tag?'<em class="tag">'+esc(tagOf(t))+'</em>':'')+'</span>'+courseMeta+'</span>'+
    (o.move?'<button class="mini" data-act="move-today" data-id="'+t.id+'">오늘로</button>':'')+
    '<button class="star '+(t.star?'on':'')+'" data-act="star" data-id="'+t.id+'" aria-label="중요 표시">★</button>'+
    (o.focus&&!t.done?'<button class="rowfocus" data-act="focus-todo" data-id="'+t.id+'" aria-label="이 일로 집중">'+ICO_CLOCK+'</button>':'')+
    (o.today?'<button class="mini tododel" data-act="del-todo-inline" data-id="'+t.id+'" aria-label="할 일 삭제">×</button>':'')+
    (t.done?'':'<span class="grip" aria-label="끌어서 순서 바꾸기">⋮⋮</span>')+'</li>';
}
function todoBox(scope,key,title){
  var list=sortTodos(S.todos.filter(function(t){return t.scope===scope&&t.key===key;}));
  var rts=scope==='day'?routinesFor(parseKey(key)):[];
  var done=list.filter(function(t){return t.done;}).length+rts.filter(function(r){return routineDone(r,key);}).length;
  var total=list.length+rts.length;
  var id=scope+':'+key;
  var rtHTML=rts.map(function(r){
    var dn=routineDone(r,key);
    return '<li class="todo '+(dn?'done':'')+'"><button class="chk" data-act="toggle-rt" data-id="'+r.id+'" data-date="'+key+'" aria-label="완료 체크">✓</button>'+
      '<span class="ttxt" data-act="edit-rt" data-id="'+r.id+'">'+esc(r.text)+'<em class="rp">↻ '+esc(daysText(r.days))+streakTxt(r)+'</em></span></li>';
  }).join('');
  return '<section class="card"><div class="card-h"><h3>'+esc(title)+'</h3><span class="cnt">'+done+'/'+total+'</span></div>'+
    (total?'<div class="bar"><i style="width:'+Math.round(done/total*100)+'%"></i></div>':'')+
    '<ul class="todos">'+((rtHTML+list.map(function(t){return todoItem(t);}).join(''))||'<li class="empty">아직 적은 일이 없어요</li>')+'</ul>'+
    '<div class="add"><input data-draft="'+id+'" data-scope="'+scope+'" data-key="'+key+'" placeholder="할 일 추가" enterkeyhint="done" value="'+esc(U.drafts[id]||'')+'"><button data-act="add">추가</button></div></section>';
}

/* ---------- 시간표 그리드 ---------- */
function hourLabel(h){return ((h+11)%12)+1;}
function gridHTML(dates,o){
  o=o||{};
  var items=dates.map(function(d){return layout(itemsFor(d));});
  var lo=S.settings.hStart!=null?S.settings.hStart:9,hi=S.settings.hEnd!=null?S.settings.hEnd:22;
  items.forEach(function(arr){arr.forEach(function(it){lo=Math.min(lo,Math.floor(it.start/60));hi=Math.max(hi,Math.ceil(it.end/60));});});
  hi=Math.min(hi,24);
  var rows=hi-lo,hh=o.day?56:48;
  var now=new Date(),tk=todayKey(),nowMin=now.getHours()*60+now.getMinutes();
  var hours='';
  for(var i=0;i<rows;i++)hours+='<span style="top:'+(i*hh+3)+'px">'+hourLabel(lo+i)+'</span>';
  var cols=dates.map(function(d,i){
    var k=dkey(d);
    var blocks=items[i].map(function(it){
      var top=(it.start-lo*60)/60*hh,h=Math.max((it.end-it.start)/60*hh-2,18);
      var left='calc('+it.lane+'*100%/'+it.lanes+' + 1px)',w='calc(100%/'+it.lanes+' - 2px)';
      var small='';
      if(o.day||it.appointment)small+='<small>'+fmt(it.start)+(it.openEnd?'':'–'+fmt(it.end))+'</small>';
      if(it.sub)small+='<small>'+esc(it.sub)+'</small>';
      return '<button class="blk '+(it.kind==='event'?'ev':'')+(it.appointment?' appt':'')+(it.skipped?' skipd':'')+'" style="--c:'+it.color+';top:'+top+'px;height:'+h+'px;left:'+left+';width:'+w+'" data-act="'+actOf(it)+'" data-id="'+it.id+'" data-date="'+k+'"><b>'+esc(it.name)+'</b>'+small+'</button>';
    }).join('');
    var gaps=gapsOf(items[i]).map(function(g){
      var top=(g.start-lo*60)/60*hh+1,h=(g.end-g.start)/60*hh-3;
      return '<button class="gap" style="top:'+top+'px;height:'+h+'px" data-act="gap" data-date="'+k+'" data-s="'+fmt(g.start)+'" data-e="'+fmt(g.end)+'" aria-label="'+esc(modeGapWord())+' '+durText(g.end-g.start)+'">'+(o.day?esc(modeGapWord())+' '+durText(g.end-g.start):durText(g.end-g.start,true))+'</button>';
    }).join('');
    blocks=gaps+blocks;
    var nl=(k===tk&&nowMin>=lo*60&&nowMin<hi*60)?'<div class="now" data-lo="'+(lo*60)+'" data-hh="'+hh+'" style="top:'+((nowMin-lo*60)/60*hh)+'px"></div>':'';
    return '<div class="tt-col '+(k===tk?'today':'')+'" data-date="'+k+'" data-lo="'+(lo*60)+'" data-hh="'+hh+'">'+blocks+nl+'</div>';
  }).join('');
  var head=o.head?'<div class="tt-head"><span></span>'+dates.map(function(d){
    var k=dkey(d);
    return '<button data-act="open-day" data-date="'+k+'" class="'+(k===tk?'today':'')+'"><span>'+DAYS[dow(d)]+'</span><b'+(holi(k)?' class="holb" title="'+holi(k)+'"':'')+'>'+d.getDate()+'</b></button>';
  }).join('')+'</div>':'';
  var ddDates=dates.some(function(d){return ddOn(dkey(d)).length||examsFor(d).length;});
  var adDates=dates.some(function(d){return alldayFor(d).length;});
  var specials='';
  if(ddDates)specials+='<div class="tt-ad"><span>D-day</span>'+dates.map(function(d){var k=dkey(d);return '<div>'+ddOn(k).map(function(x){return ddChip(x,k);}).join('')+examsFor(d).map(examChip).join('')+'</div>';}).join('')+'</div>';
  if(adDates)specials+='<div class="tt-ad"><span>일정</span>'+dates.map(function(d){return '<div>'+alldayFor(d).map(adChip).join('')+'</div>';}).join('')+'</div>';
  return '<div class="tt '+(o.day?'day':'')+'" style="--n:'+dates.length+';--hh:'+hh+'px;--h:'+(rows*hh)+'px">'+head+
    '<div class="tt-body"><div class="tt-hrs">'+hours+'</div>'+cols+'</div>'+specials+'</div>';
}
function updateNow(){
  var n=new Date(),m=n.getHours()*60+n.getMinutes();
  document.querySelectorAll('.now').forEach(function(el){
    el.style.top=((m-Number(el.dataset.lo))/60*Number(el.dataset.hh))+'px';
  });
}


function relationFriendColor(id){
  var pal=['#f1b8b2','#f3cf83','#a9d8bf','#a9c9ee','#c8b9e8','#efb8d2','#b6d9dc','#d7c3a4'];
  var h=0,v=String(id||'');for(var i=0;i<v.length;i++)h=(h*31+v.charCodeAt(i))>>>0;return pal[h%pal.length];
}
function relationDatesForFriend(id){
  var m={};friendMemoryRows(id).forEach(function(x){var k=x.visited_at||String(x.created_at||'').slice(0,10);if(k)m[k]=1;});
  sharedMetDates(id).forEach(function(k){if(k)m[k]=1;});return Object.keys(m).sort();
}
function relationFriendsOnDate(k){
  if(!Sync.uid||!FriendSync.loaded)return [];
  var out=[];(FriendSync.friends||[]).forEach(function(f){if(relationDatesForFriend(f.id).indexOf(k)>=0)out.push(f);});return out;
}
function relationMonthHeader(d){
  if(!Sync.uid||!FriendSync.loaded||!FriendSync.friends.length)return '';
  var pre=mkey(d),seen=[];
  FriendSync.friends.forEach(function(f){if(relationDatesForFriend(f.id).some(function(k){return k.slice(0,7)===pre;}))seen.push(f);});
  var legend=seen.slice(0,6).map(function(f){return '<span><i class="rel-dot" style="--rc:'+relationFriendColor(f.id)+'"></i>'+esc(friendLabel(f))+'</span>';}).join('');
  var stale=(FriendSync.friends||[]).map(function(f){return {f:f,d:friendLastMetDays(f.id)};}).filter(function(x){return x.d!=null&&x.d>=30;}).sort(function(a,b){return b.d-a.d;})[0];
  var note=stale?'<div class="rel-calendar-note"><b>오래 못 본 친구</b><span>'+esc(friendLabel(stale.f))+' · '+stale.d+'일째</span></div>':'';
  return note+(legend?'<div class="rel-legend"><span style="font-weight:700">관계 캘린더</span>'+legend+'</div>':'');
}
function relationDotsHTML(k){
  var fs=relationFriendsOnDate(k);if(!fs.length)return '';
  return '<span class="rel-dots" aria-label="친구와 만난 날">'+fs.slice(0,4).map(function(f){return '<i class="rel-dot" title="'+esc(friendLabel(f))+'" style="--rc:'+relationFriendColor(f.id)+'"></i>';}).join('')+'</span>';
}

function monthReviewHTML(d){var pre=mkey(d),cl=(S.dayCloses||[]).filter(function(x){return x.key&&x.key.slice(0,7)===pre;}),di=(S.diaries||[]).filter(function(x){return diaryDateKey(x).slice(0,7)===pre;}),words=cl.map(function(x){return (x.word||'').trim();}).filter(Boolean),focus=cl.reduce(function(a,x){return a+(x.focus||0);},0),done=cl.reduce(function(a,x){return a+(x.done||0);},0),total=cl.reduce(function(a,x){return a+(x.total||0);},0);if(!cl.length&&!di.length)return '';return '<div class="month-review"><b>'+ (d.getMonth()+1)+'월 회고</b><small>하루 마감 '+cl.length+'일 · '+diaryTargetMinutes()+'분 일기 '+di.length+'개'+(total?' · 할 일 '+done+'/'+total:'')+(focus?' · 집중 '+durLong(focus):'')+'</small>'+(words.length?'<div class="month-words">'+words.slice(-12).map(function(w){return '<span>'+esc(w)+'</span>';}).join('')+'</div>':'')+'</div>';}

/* ---------- 화면: 월간 ---------- */
function viewMonth(){
  var d=U.date,y=d.getFullYear(),m=d.getMonth();
  var first=new Date(y,m,1),off=dow(first),dim=new Date(y,m+1,0).getDate();
  var rows=Math.ceil((off+dim)/7),start=addDays(first,-off),tk=todayKey();
  var cells='';
  for(var i=0;i<rows*7;i++){
    var c=addDays(start,i),k=dkey(c),w=i%7;
    var dots=S.classes.filter(function(x){return x.day===w&&clsActive(x,k);}).slice(0,5).map(function(x){return '<i style="background:'+x.color+'"></i>';}).join('');
    var evs=S.events.filter(function(e){return eventOnDate(e,k)&&((e.kind==='appointment'&&monthItemOn('appointment'))||(e.kind!=='appointment'&&monthItemOn('event')));}).sort(function(a,b){return (a.start||'99:99')<(b.start||'99:99')?-1:1;});
    var tds=monthItemOn('todo')?sortTodos(S.todos.filter(function(t){return t.scope==='day'&&t.key===k;})):[];var tdn=tds.filter(function(t){return t.done;}).length;
    var dues=monthItemOn('todo')?S.todos.filter(function(t){return t.due===k&&!t.done;}):[];
    var ads=monthItemOn('event')?alldayFor(c):[],exs=monthItemOn('exam')?examsFor(c):[],dds=monthItemOn('dday')?ddOn(k):[],adSummary=ads.length?'<span class="chip ev" style="--c:'+ads[0].color+'">'+esc(ads[0].title)+(ads.length>1?'<b class="admore">+'+(ads.length-1)+'</b>':'')+'</span>':'';
    var friendChips=friendSharedLabels(c),chips=dds.map(function(x){var mil=coupleMilestoneName(x,k);return '<span class="chip ev" style="--c:'+x.color+'">'+esc(ddDisplay(x,k))+' '+esc(mil||x.title)+'</span>';}).concat(dues.map(function(t){return '<span class="chip due">'+esc(t.text)+'</span>';})).concat(adSummary?[adSummary]:[]).concat(evs.map(monthEventChipHTML)).concat(friendChips.map(function(x){return '<span class="chip ev" style="--c:'+x.color+'">'+esc(x.text)+'</span>';}))
      .concat(tds.map(function(t){return '<span class="chip td'+(t.done?' cdone':'')+'">'+esc(t.text)+'</span>';}));
    var shown=chips.slice(0,2).join('')+(chips.length>2?'<span class="more">+'+(chips.length-2)+'</span>':'');
    cells+='<button class="cell '+(c.getMonth()!==m?'out ':'')+(w>=5?'we ':'')+(holi(k)?'hol ':'')+(k===tk?'today ':'')+(exs.length?'exam':'')+'" data-act="open-day" data-date="'+k+'">'+
      '<span class="n"'+(holi(k)?' title="'+holi(k)+'"':'')+'>'+c.getDate()+'</span>'+relationDotsHTML(k)+(holi(k)?'<span class="holn">'+holi(k)+'</span>':'')+(dues.length?'<span class="duemark"></span>':'')+(exs.length?'<span class="exmark" data-act="view-exam" data-id="'+exs[0].id+' title="시험 기간">'+examIcon()+'</span>':'')+monthEventMarkerHTML(evs,ads)+(monthItemOn('dday')?ddMark(k):'')+(tds.length?'<span class="tcnt">'+tdn+'/'+tds.length+'</span>':'')+'<span class="dots">'+dots+'</span>'+calCell(k)+shown+'</button>';
  }
  var sum='';
  if(S.settings.logOn){
    var ci=trk(S.settings.calItem);
    if(ci&&ci.type==='dur'){
      var tot=0,cnt=0,pre=mkey(d);
      Object.keys(S.logs).forEach(function(k){if(k.slice(0,7)===pre&&S.logs[k][ci.id]!==undefined){tot+=S.logs[k][ci.id];cnt++;}});
      if(cnt)sum='<div class="msum">'+esc(ci.name)+' 이번 달 합계 <b>'+durLong(tot)+'</b><span>'+cnt+'일 · 하루 평균 '+durLong(Math.round(tot/cnt))+'</span></div>';
    }
  }
  var closes=(S.dayCloses||[]).filter(function(x){return x.key&&x.key.slice(0,7)===mkey(d);}),words=closes.filter(function(x){return x.word;}).slice(-5),review=closes.length?'<div class="month-review"><div><small>마감한 날</small><b>'+closes.length+'일</b></div><div><small>완료한 할 일</small><b>'+closes.reduce(function(n,x){return n+(x.done||0);},0)+'개</b></div>'+(words.length?'<div><small>이번 달의 단어</small><b>'+words.map(function(x){return esc(x.word);}).join(' · ')+'</b></div>':'')+'</div>':'';
  return '<section class="card">'+relationMonthHeader(d)+monthCheerSummaryHTML(d)+review+sum+'<div class="mh">'+DAYS.map(function(x){return '<span>'+x+'</span>';}).join('')+'</div><div class="mg">'+cells+'</div></section>'+
    todoBox('month',mkey(d),(m+1)+'월 할 일');
}

/* ---------- 화면: 주간 ---------- */
function viewWeek(){
  var mon=mondayOf(U.date),n=S.settings.weekend?7:5;
  var dates=[];for(var i=0;i<n;i++)dates.push(addDays(mon,i));
  var wk0=dkey(mon),wk6=dkey(addDays(mon,n-1)),un=S.classes.filter(function(c){return c.day==null;}),unA=S.events.filter(function(e){return e.kind==='appointment'&&!e.start&&e.date>=wk0&&e.date<=wk6;});
  return '<section class="card tt-card"><div class="card-h"><h3>시간표</h3><div class="tt-actions"><button class="tbtn" data-act="week-export">주간표 이미지</button><button class="tbtn" data-act="week-print">인쇄</button><button class="tbtn" data-act="toggle-weekend">'+(S.settings.weekend?'주말 숨기기':'주말 보기')+'</button></div></div>'+ 
    gridHTML(dates,{head:true})+'</section>'+ 
    (un.length?'<section class="card"><div class="card-h"><h3>시간 미정 수업</h3></div><div class="slots">'+
      un.map(function(c){return '<button class="slot c" style="--c:'+c.color+'" data-act="view-block" data-id="'+c.id+'>'+esc(c.name)+'</button>';}).join('')+'</div></section>':'')+
    (unA.length?'<section class="card"><div class="card-h"><h3>시간 미정 약속</h3></div><div class="slots">'+
      unA.map(function(a){return '<button class="slot c" style="--c:'+a.color+'" data-act="'+(a.kind==='appointment'?'edit-event':'view-event-detail')+'" data-id="'+a.id+'">'+esc(eventChipLabel(a))+'</button>';}).join('')+'</div></section>':'')+
    todoBox('week',dkey(mon),'이번 주 할 일')+reviewHTML(mon);
}

/* ---------- 주간 플래너 내보내기 ---------- */
function weeklyExportModel(){
  var mon=mondayOf(U.date),n=S.settings.weekend?7:5,dates=[];
  for(var i=0;i<n;i++){
    var d=addDays(mon,i),k=dkey(d),labels=[];
    alldayFor(d).forEach(function(a){labels.push({text:a.title,color:a.color,kind:'일정'});});
    S.events.filter(function(e){return e.kind==='appointment'&&!e.start&&eventOnDate(e,k);}).forEach(function(a){labels.push({text:eventChipLabel(a),color:a.color,kind:'약속'});});
    examsFor(d).forEach(function(x){labels.push({text:'시험 · '+x.name,color:x.color||S.settings.defColor||'#dce9f7',kind:'시험'});});
    ddOn(k).forEach(function(x){labels.push({text:ddDisplay(x,k)+' · '+(coupleMilestoneName(x,k)||x.title),color:x.color||S.settings.defColor||'#dce9f7',kind:'D-day'});});
    dates.push({date:d,key:k,labels:labels,items:itemsFor(d).filter(function(x){return x.kind!=='focus';}),todos:sortTodos(S.todos.filter(function(t){return t.scope==='day'&&t.key===k&&!t.time;}))});
  }
  var weekTodos=sortTodos(S.todos.filter(function(t){return t.scope==='week'&&t.key===dkey(mon);}));
  return {mon:mon,dates:dates,weekTodos:weekTodos};
}
function weeklyItemTime(it){return it.start==null?'':timeShort(fmt(it.start))+(it.openEnd?'':'–'+timeShort(fmt(it.end)));}
function canvasRoundRect(ctx,x,y,w,h,r,fill,stroke){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
  if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}
}
function canvasLines(ctx,text,maxWidth,maxLines){
  var out=[],parts=String(text==null?'':text).split('\n');
  parts.forEach(function(part){var line='';Array.from(part).forEach(function(ch){var next=line+ch;if(line&&ctx.measureText(next).width>maxWidth){out.push(line);line=ch;}else line=next;});out.push(line||' ');});
  if(out.length>maxLines){out=out.slice(0,maxLines);var last=out[maxLines-1];while(last.length&&ctx.measureText(last+'…').width>maxWidth)last=last.slice(0,-1);out[maxLines-1]=(last||'')+'…';}
  return out;
}
function drawWeeklyCanvas(canvas,model){
  var n=model.dates.length,W=n===7?1800:1500,H=1200,ctx=canvas.getContext('2d'),skin=(window.PLANON_MARKET_THEME&&window.PLANON_MARKET_THEME.exportStyle?window.PLANON_MARKET_THEME.exportStyle():null)||{},paper=skin.paper||'#fffdf9',ink=skin.ink||'#3b3530',sub=skin.sub||'#9a9086',line=skin.line||'#e9e2d6',soft=skin.soft||'#f1ebe0';
  canvas.width=W;canvas.height=H;ctx.fillStyle=paper;ctx.fillRect(0,0,W,H);ctx.textBaseline='top';
  var first=model.dates[0].date,last=model.dates[model.dates.length-1].date;
  ctx.fillStyle=ink;ctx.font='800 34px Gowun Dodum, Apple SD Gothic Neo, Noto Sans KR, sans-serif';ctx.fillText(first.getFullYear()+'년 '+(first.getMonth()+1)+'월 '+Math.ceil(first.getDate()/7)+'주차',50,38);
  ctx.fillStyle=sub;ctx.font='500 18px Gowun Dodum, Apple SD Gothic Neo, Noto Sans KR, sans-serif';ctx.fillText((first.getMonth()+1)+'/'+first.getDate()+' – '+(last.getMonth()+1)+'/'+last.getDate()+' · 주간 플래너',50,82);
  var gap=14,left=40,top=132,footer=105,colW=(W-left*2-gap*(n-1))/n,colH=H-top-footer-42,def=S.settings.defColor||'#dce9f7';
  model.dates.forEach(function(c,i){
    var x=left+i*(colW+gap),d=c.date;
    canvasRoundRect(ctx,x,top,colW,colH,16,paper,line);
    ctx.fillStyle=(i>=5?'#d0705f':ink);ctx.font='700 17px Gowun Dodum, Apple SD Gothic Neo, Noto Sans KR, sans-serif';ctx.fillText(DAYS[dow(d)],x+18,top+17);
    ctx.fillStyle=ink;ctx.font='800 25px Gowun Dodum, Apple SD Gothic Neo, Noto Sans KR, sans-serif';ctx.fillText(String(d.getDate()),x+18,top+43);
    ctx.fillStyle=line;ctx.fillRect(x+16,top+84,colW-32,1);
    var y=top+98;
    function row(text,color,meta){
      if(y>top+colH-42)return;
      canvasRoundRect(ctx,x+13,y,colW-26,meta?39:34,8,soft,null);ctx.fillStyle=color||def;ctx.fillRect(x+13,y,4,meta?39:34);
      ctx.fillStyle=ink;ctx.font='600 13px Gowun Dodum, Apple SD Gothic Neo, Noto Sans KR, sans-serif';var lines=canvasLines(ctx,text,colW-70,1);ctx.fillText(lines[0],x+25,y+8);
      if(meta){ctx.fillStyle=sub;ctx.font='500 11px Gowun Dodum, Apple SD Gothic Neo, Noto Sans KR, sans-serif';ctx.fillText(meta,x+25,y+24);}
      y+=meta?45:40;
    }
    c.labels.slice(0,3).forEach(function(a){row(a.text,a.color,a.kind);});
    if(c.labels.length>3)row('+'+(c.labels.length-3)+'개 더',def,'');
    c.items.slice(0,10).forEach(function(it){row(it.name,it.color,weeklyItemTime(it));});
    if(c.items.length>10)row('+'+(c.items.length-10)+'개 일정',def,'');
    c.todos.slice(0,4).forEach(function(t){row('□ '+t.text,t.course?courseColor(t.course):def,'할 일');});
    if(c.todos.length>4)row('+'+(c.todos.length-4)+'개 할 일',def,'');
    if(!c.labels.length&&!c.items.length&&!c.todos.length){ctx.fillStyle=sub;ctx.font='500 13px Gowun Dodum, Apple SD Gothic Neo, Noto Sans KR, sans-serif';ctx.fillText('기록 없음',x+18,top+105);}
  });
  var fy=H-footer+8;ctx.fillStyle=ink;ctx.font='700 16px Gowun Dodum, Apple SD Gothic Neo, Noto Sans KR, sans-serif';ctx.fillText('이번 주 할 일',left,fy);
  ctx.fillStyle=sub;ctx.font='500 13px Gowun Dodum, Apple SD Gothic Neo, Noto Sans KR, sans-serif';
  var footerText=model.weekTodos.length?model.weekTodos.map(function(t){return (t.done?'✓ ':'□ ')+t.text;}).join('   ·   '):'추가한 주간 할 일이 없어요';
  ctx.fillText(footerText.slice(0,150),left,fy+28);
}
function exportWeeklyImage(){
  try{
    var c=document.createElement('canvas');drawWeeklyCanvas(c,weeklyExportModel());
    c.toBlob(function(blob){
      if(!blob){openModal('<h3>이미지 저장을 못 했어요</h3><p class="hint">브라우저가 이미지 저장을 지원하지 않아요. 인쇄를 이용해 주세요.</p><div class="acts"><button class="b-save" data-act="close">확인</button></div>');return;}
      var url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='주간-플래너-'+dkey(mondayOf(U.date))+'.png';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(url);a.remove();},1000);
    },'image/png');
  }catch(err){openModal('<h3>이미지 저장을 못 했어요</h3><p class="hint">인쇄 버튼을 이용하면 같은 주간표를 출력할 수 있어요.</p><div class="acts"><button class="b-save" data-act="close">확인</button></div>');}
}
function exportTimetableWallpaper(device){
  try{
    var phone=device!=='pad',W=phone?1290:2048,H=phone?2796:2732,c=document.createElement('canvas');c.width=W;c.height=H;
    var ctx=c.getContext('2d'),bg='#fffdf9',ink='#282522',sub='#9b948d',grid='#e9e4dd',def=S.settings.defColor||'#dce9f7';
    ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);ctx.textBaseline='top';
    var padX=phone?70:110, top=phone?390:300, bottom=phone?250:220;
    var mon=mondayOf(U.date), n=S.settings.weekend?7:5, days=[];for(var i=0;i<n;i++)days.push(addDays(mon,i));
    var active=[];days.forEach(function(d){var k=dkey(d);S.classes.forEach(function(x){if(x.day===dow(d)&&x.start&&x.end&&clsActive(x,k))active.push(x);});});
    var hs=S.settings.hStart!=null?+S.settings.hStart:9,he=S.settings.hEnd!=null?+S.settings.hEnd:22;
    active.forEach(function(x){hs=Math.min(hs,Math.floor(toMin(x.start)/60));he=Math.max(he,Math.ceil(toMin(x.end)/60));});he=Math.max(hs+1,he);
    ctx.fillStyle=ink;ctx.font=(phone?'800 56px':'800 66px')+' -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR",sans-serif';
    ctx.fillText((mon.getMonth()+1)+'월 '+Math.ceil(mon.getDate()/7)+'주차 시간표',padX,phone?120:90);
    ctx.fillStyle=sub;ctx.font=(phone?'500 28px':'500 32px')+' -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR",sans-serif';
    ctx.fillText((mon.getMonth()+1)+'/'+mon.getDate()+' – '+(days[n-1].getMonth()+1)+'/'+days[n-1].getDate(),padX,phone?195:175);
    var timeW=phone?76:105,gx=padX+timeW,gw=W-padX*2-timeW,gh=H-top-bottom,colW=gw/n,rowH=gh/(he-hs);
    ctx.strokeStyle=grid;ctx.lineWidth=2;
    for(i=0;i<=n;i++){ctx.beginPath();ctx.moveTo(gx+i*colW,top);ctx.lineTo(gx+i*colW,top+gh);ctx.stroke();}
    for(var h=hs;h<=he;h++){var y=top+(h-hs)*rowH;ctx.beginPath();ctx.moveTo(gx,y);ctx.lineTo(gx+gw,y);ctx.stroke();if(h<he){ctx.fillStyle=sub;ctx.font=(phone?'500 22px':'500 25px')+' -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR",sans-serif';ctx.fillText(String(h),padX,y+7);}}
    days.forEach(function(d,di){var x=gx+di*colW;ctx.fillStyle=ink;ctx.font=(phone?'700 27px':'700 31px')+' -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR",sans-serif';var lab=DAYS[dow(d)]+' '+d.getDate();ctx.fillText(lab,x+12,top-55);var k=dkey(d);S.classes.filter(function(z){return z.day===dow(d)&&z.start&&z.end&&clsActive(z,k);}).forEach(function(z){var a=toMin(z.start),b=toMin(z.end),yy=top+((a-hs*60)/60)*rowH,hh=Math.max(28,((b-a)/60)*rowH-5),xx=x+5,ww=colW-10;canvasRoundRect(ctx,xx,yy,ww,hh,phone?15:18,z.color||def,null);ctx.fillStyle='#292522';ctx.font=(phone?'700 22px':'700 27px')+' -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR",sans-serif';var lines=canvasLines(ctx,z.name||'수업',ww-24,2);lines.forEach(function(t,j){ctx.fillText(t,xx+12,yy+12+j*(phone?27:32));});if(hh>(phone?80:95)){ctx.font=(phone?'500 17px':'500 20px')+' -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR",sans-serif';ctx.fillText(timeShort(z.start)+'–'+timeShort(z.end),xx+12,yy+hh-(phone?29:34));}});});
    ctx.fillStyle=sub;ctx.font=(phone?'500 20px':'500 23px')+' -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR",sans-serif';ctx.fillText('플래너 · '+new Date().getFullYear(),padX,H-(phone?125:105));
    c.toBlob(function(blob){if(!blob){inAppToast('이미지를 만들지 못했어요');return;}var url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='주간-시간표-'+(phone?'폰':'패드')+'-'+dkey(mon)+'.png';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},3000);inAppToast((phone?'폰':'패드')+' 배경화면 이미지를 저장했어요');},'image/png');
  }catch(e){openModal('<h3>배경화면 저장을 못 했어요</h3><p class="hint">잠시 뒤 다시 시도해 주세요.</p><div class="acts"><button class="b-save" data-act="close">확인</button></div>');}
}
function weeklyPrintHTML(model){
  var n=model.dates.length,days=model.dates.map(function(c,i){
    var d=c.date,labels=c.labels.map(function(a){return '<div class="tag" style="--c:'+esc(a.color||'#dce9f7')+'"><b>'+esc(a.kind)+'</b>'+esc(a.text)+'</div>';}).join('');
    var items=c.items.map(function(it){return '<div class="row" style="--c:'+esc(it.color||'#dce9f7')+'"><span>'+esc(weeklyItemTime(it))+'</span><b>'+esc(it.name)+'</b></div>';}).join('');
    var todos=c.todos.map(function(t){return '<div class="todo">□ '+esc(t.text)+'</div>';}).join('');
    return '<section class="day"><header><span>'+(i>=5?'주말':'')+'</span><b>'+esc(DAYS[dow(d)])+' '+d.getDate()+'</b></header>'+(labels||items||todos?labels+items+todos:'<p class="empty">기록 없음</p>')+'</section>';
  }).join('');
  var wt=model.weekTodos.length?model.weekTodos.map(function(t){return '<span>'+ (t.done?'✓ ':'□ ')+esc(t.text)+'</span>';}).join(''): '<span>추가한 주간 할 일이 없어요</span>';
  return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>주간 플래너</title></head><body><div class="printbar"><button onclick="window.print()">인쇄하기</button></div><h1>'+esc(model.mon.getFullYear()+'년 '+(model.mon.getMonth()+1)+'월 주간 플래너')+'</h1><p class="sub">'+esc((model.dates[0].date.getMonth()+1)+'/'+model.dates[0].date.getDate()+' – '+(model.dates[n-1].date.getMonth()+1)+'/'+model.dates[n-1].date.getDate())+'</p><div class="week">'+days+'</div><div class="footer"><b>이번 주 할 일</b>'+wt+'</div></body></html>';
}
function printWeekly(){
  var w=null;try{w=window.open('','_blank');}catch(e){}
  if(!w){openModal('<h3>인쇄 창을 열 수 없어요</h3><p class="hint">브라우저에서 팝업을 허용한 뒤 다시 눌러 주세요.</p><div class="acts"><button class="b-save" data-act="close">확인</button></div>');return;}
  w.document.open();w.document.write(weeklyPrintHTML(weeklyExportModel()));w.document.close();w.focus();setTimeout(function(){try{w.print();}catch(e){}},350);
}
function weekFocusMinutes(mon){
  var sum=0;for(var i=0;i<7;i++){var k=dkey(addDays(mon,i));sum+=Number(S.focus[k]||0);}return sum;
}
/* ----- 과목별 이번 주 공부 시간 (집중 타이머 + 작업 기록) ----- */
function courseStudyMinutes(mon){
  var a=dkey(mon),b=dkey(addDays(mon,6)),map={},byId={},nowMs=Date.now();
  (S.todos||[]).forEach(function(t){if(t&&t.course)byId[t.id]=t;});
  Object.keys(S.fsess||{}).forEach(function(k){if(k<a||k>b)return;(S.fsess[k]||[]).forEach(function(x){var t=x&&x.tid&&byId[x.tid];if(t)map[t.course]=(map[t.course]||0)+Number(x.min||0);});});
  Object.keys(byId).forEach(function(id){var t=byId[id];
    (Array.isArray(t.workSessions)?t.workSessions:[]).forEach(function(x){if(!x)return;var k=x.date||(x.startAt?dkey(new Date(Number(x.startAt))):'');if(!k||k<a||k>b)return;var sec=Number(x.sec);if(!isFinite(sec)||sec<0)sec=Number(x.min||0)*60;map[t.course]=(map[t.course]||0)+sec/60;});
    var st=Number(t.workStartedAt||0);if(st>0){var k2=dkey(new Date(st));if(k2>=a&&k2<=b)map[t.course]=(map[t.course]||0)+Math.max(0,(nowMs-st)/60000);}
  });
  var names=[];(S.classes||[]).forEach(function(c){if(c&&c.name&&names.indexOf(c.name)<0)names.push(c.name);});
  Object.keys(map).forEach(function(n){if(names.indexOf(n)<0)names.push(n);});
  return names.map(function(n){return {name:n,min:Math.round(map[n]||0)};}).sort(function(x,y){return y.min-x.min;});
}
function courseStudyHTML(mon){
  var rows=courseStudyMinutes(mon);if(!rows.length)return '';
  return '<div class="course-study"><span class="lbl">과목별 공부 시간</span><div class="course-study-list">'+rows.map(function(r){return '<div class="course-study-row'+(r.min?'':' zero')+'" style="--c:'+courseColor(r.name)+'"><i></i><span>'+esc(r.name)+'</span><b>'+(r.min?durLong(r.min):'0분')+'</b></div>';}).join('')+'</div></div>';
}
function reviewHTML(mon){
  if(S.settings.showWeeklyReview===false)return '';
  var thisMon=mondayOf(studyDayDate(new Date())),today=todayKey();
  if(dkey(mon)>dkey(thisMon))return '';
  var sun=addDays(mon,6),mk=dkey(mon),sk=dkey(sun);
  var list=S.todos.filter(function(t){return (t.scope==='week'&&t.key===mk)||(t.scope==='day'&&t.key>=mk&&t.key<=sk);});
  var rTot=0,rDone=0;
  for(var i=0;i<7;i++){var dd=addDays(mon,i),k=dkey(dd);if(k>today)break;routinesFor(dd).forEach(function(r){rTot++;if(routineDone(r,k))rDone++;});}
  var tot=list.length+rTot,dn=list.filter(function(t){return t.done;}).length+rDone;
  var left=sortTodos(list.filter(function(t){return !t.done;}));
  var pct=tot?Math.round(dn/tot*100):0,focus=weekFocusMinutes(mon),prev=weekFocusMinutes(addDays(mon,-7)),delta=focus-prev,deltaTxt=prev?((delta>=0?'+':'−')+durLong(Math.abs(delta))):'';
  var courseDone={};list.filter(function(t){return t.done&&t.course;}).forEach(function(t){courseDone[t.course]=(courseDone[t.course]||0)+1;});
  var best=Object.keys(courseDone).sort(function(a,b){return courseDone[b]-courseDone[a];})[0]||'–';
  return '<section class="card"><div class="card-h"><h3>'+(dkey(mon)===dkey(thisMon)?'이번 주 돌아보기':'이 주 돌아보기')+'</h3><span class="cnt">반복 포함 '+dn+'/'+tot+'</span></div>'+
    '<div class="week-review-grid"><div><b>'+pct+'%</b><small>완료율</small></div><div><b>'+durLong(focus)+'</b><small>집중'+(deltaTxt?' · '+deltaTxt:'')+'</small></div><div><b>'+esc(best)+'</b><small>완료가 많은 과목</small></div></div>'+
    (tot?'<div class="bar" style="margin:8px 2px 10px"><i style="width:'+pct+'%"></i></div>':'')+courseStudyHTML(mon)+
    '<span class="lbl">이번 주 한 줄 회고</span><textarea class="week-retro" data-weekretro="'+mk+'" maxlength="240" placeholder="잘한 점, 다음 주에 바꿀 점을 짧게 남겨보세요">'+esc(S.weeklyRetro[mk]||'')+'</textarea>'+
    (left.length?'<ul class="todos">'+left.map(function(t){return todoItem(t,{tag:true});}).join('')+'</ul>'+
      '<div class="acts"><button class="b-save" data-act="carry-over" data-mon="'+mk+'">못 한 일 '+left.length+'개 다음 주로 넘기기</button></div>'
      :'<div class="empty">'+(tot?'이 주에 적은 일은 다 끝냈어요':'이번 주 기록이 아직 없어요')+'</div>')+'</section>';
}

/* ---------- 화면: 일간 ---------- */
function sideTodo(k,title){
  var list=S.todos.filter(function(t){return t.scope==='day'&&t.key===k;});
  var rts=routinesFor(parseKey(k));
  var coreT=sortTodos(list.filter(function(t){return t.isCore===true;}));
  var normal=list.filter(function(t){return t.isCore!==true;});
  var openT=sortTodos(normal.filter(function(t){return !t.done;})),doneT=sortTodos(normal.filter(function(t){return t.done;}));
  var openR=rts.filter(function(r){return !routineDone(r,k);}),doneR=rts.filter(function(r){return routineDone(r,k);});
  function rtLi(r,dn){
    return '<li class="todo '+(dn?'done':'')+'"><button class="chk" data-act="toggle-rt" data-id="'+r.id+'" data-date="'+k+'" aria-label="완료 체크">✓</button>'+ 
      '<span class="ttxt" data-act="edit-rt" data-id="'+r.id+'">'+esc(r.text)+'<em class="rp">↻ '+esc(daysText(r.days))+streakTxt(r)+'</em></span></li>';
  }
  var nOpen=list.filter(function(t){return !t.done;}).length+openR.length,nDone=list.filter(function(t){return t.done;}).length+doneR.length,tot=nOpen+nDone,id='day:'+k;
  var coreHTML='<div class="today-core-box"><div class="today-core-head"><span><b>오늘의 핵심</b><small>'+coreT.length+'/3</small></span></div>'+ 
    (coreT.length?'<ul class="todos core-todos">'+coreT.map(function(t){return todoItem(t,{focus:k===todayKey(),today:true,coreToggle:true});}).join('')+'</ul>':'<p class="today-core-empty">☆를 눌러 오늘 꼭 할 일을 골라봐</p>')+'</div>';
  return '<section class="card"><div class="card-h"><h3>'+esc(title)+'</h3><span class="cnt">'+nOpen+' 남음 · '+nDone+' 완료</span></div>'+ 
    (tot?'<div class="bar"><i style="width:'+Math.round(nDone/tot*100)+'%"></i></div>':'')+coreHTML+
    '<div class="add" style="margin:4px 0 6px"><input data-draft="'+id+'" data-scope="day" data-key="'+k+'" placeholder="새 할 일 (예: 내일 3시 과제)" enterkeyhint="done" value="'+esc(U.drafts[id]||'')+'"><button data-act="add">추가</button></div>'+ 
    '<ul class="todos">'+((openR.map(function(r){return rtLi(r,false);}).join('')+openT.map(function(t){return todoItem(t,{focus:k===todayKey(),today:true,coreToggle:true});}).join(''))||'<li class="todo-empty-plain">'+(nDone?'다 끝냈어요':'아직 적은 일이 없어요')+'</li>')+'</ul>'+ 
    (nDone?'<div class="donelbl">완료됨</div><ul class="todos">'+doneR.map(function(r){return rtLi(r,true);}).join('')+doneT.map(function(t){return todoItem(t,{today:true,coreToggle:true});}).join('')+'</ul>':'')+ 
    '</section>';
}
function timelineHTML(d){
  var k=dkey(d),items=itemsFor(d),gaps=gapsOf(items);
  var lo=S.settings.hStart!=null?S.settings.hStart:6,hi=S.settings.hEnd!=null?S.settings.hEnd:23;
  items.forEach(function(it){lo=Math.min(lo,Math.floor(it.start/60));hi=Math.max(hi,Math.ceil(it.end/60));});
  hi=Math.min(hi,24);
  var now=new Date(),isToday=k===todayKey(),nh=now.getHours();
  var notes=S.hourNotes[k]||{},rows='';
  for(var h=lo;h<hi;h++){
    var hs=h*60,he=hs+60;
    var inH=items.filter(function(it){return it.start<he&&it.end>hs;});
    var chips=inH.map(function(it){
      var first=it.start>=hs;
      var tm=timeShort(fmt(Math.max(it.start,hs)))+(it.openEnd?'':'~'+timeShort(fmt(Math.min(it.end,he))));
      return '<button class="hchip '+(it.kind==='event'?'ev':'')+(it.appointment?' appt':'')+(it.skipped?' skipd':'')+(it.done?' tdone':'')+'" style="--c:'+it.color+'" data-act="'+actOf(it)+'" data-id="'+it.id+'" data-date="'+k+'"><span>'+esc(it.name)+'</span>'+(it.sub?'<small>'+esc(it.sub)+'</small>':'')+'<small>'+tm+'</small></button>';
    });
    gaps.forEach(function(g){
      if(g.start<he&&g.end>hs&&g.start>=hs)chips.push('<button class="hchip gp" data-act="gap" data-date="'+k+'" data-s="'+fmt(g.start)+'" data-e="'+fmt(g.end)+'">'+esc(modeGapWord())+' '+esc(durText(g.end-g.start))+'</button>');
    });
    rows+='<div class="hr'+(isToday&&h===nh?' cur':'')+'" id="hr-'+h+'">'+
      '<button class="t" data-act="add-at" data-date="'+k+'" data-h="'+h+'" aria-label="'+h+'시 일정 추가">'+h+':00</button>'+
      '<div class="body">'+(chips.length?'<div class="hrow">'+chips.join('')+'</div>':'')+
      '<input class="hin" data-hnote="'+k+'|'+h+'" placeholder="메모" value="'+esc(notes[h]||'')+'"></div></div>';
  }
  return '<section class="card tl"><div class="tl-h"><b>'+mdTxt(d)+'</b><span>'+DAYS[dow(d)]+'요일</span><div class="tl-acts"><button class="tbtn" data-act="add-dd" data-date="'+k+'">D-day</button>'+(S.settings.showMeetMaker===false?'':'<button class="tbtn" data-act="add-appointment" data-date="'+k+'">+ 약속</button>')+'<button class="tbtn" data-act="add-schedule" data-date="'+k+'">+ 일정</button></div></div>'+rows+specialRowsForDay(d)+'</section>';
}
function schoolInfoCard(){
 var p=schoolProfile(S.settings.school),camp=canonicalCampus(p.id,S.settings.schoolCampus),custom=(S.settings.links||[]).filter(function(l){return !isGeneratedSchoolLink(l);});
  var links=schoolLinks(p.id,camp).concat(custom);
  var checked=S.settings.schoolLastChecked?new Date(S.settings.schoolLastChecked):null,sub=checked?'마지막 확인 '+(checked.getMonth()+1)+'/'+checked.getDate()+' '+pad(checked.getHours())+':'+pad(checked.getMinutes()):'공식 사이트에서 최신 내용을 확인해요';
  if(!featOn('showSchoolLinks')||!S.settings.schoolConfigured)return ''; return '<section class="card school-info"><div class="card-h"><div class="school-name">'+esc(p.name)+'<small>'+esc(camp)+' 캠퍼스 · '+sub+'</small></div></div><div class="school-links">'+(links.length?links.slice(0,4).map(function(l){return '<button class="tbtn" data-act="school-link" data-url="'+esc(l.url)+'">'+esc(l.name)+'</button>';}).join(''):'<span class="empty">학교 정보를 설정에서 연결해보세요</span>')+'</div></section>';
}
/* ---------- 일간: 하루 마감 후 요약 화면 ---------- */
function dayCloseCard(k){try{return window.PLANON_DAY_STORY&&typeof window.PLANON_DAY_STORY.closeFor==='function'?window.PLANON_DAY_STORY.closeFor(k):null;}catch(e){return null;}}
function dayClosedMode(k){return !!dayCloseCard(k)&&U.dayFullView!==k;}
function closedDayHTML(d){
  var k=dkey(d),tk=todayKey(),c=dayCloseCard(k),st=dayCloseStats(k);
  var saved=(typeof diaryMoodForDate==='function')?diaryMoodForDate(k):'';
  var mood=saved||(st.total&&st.done>=st.total?'happy':(typeof nemoMoodForToday==='function'?nemoMoodForToday(st.total,st.done,k===tk?new Date().getHours():20):'basic'));
  var copy=(typeof nemoHomeCopy==='function')?nemoHomeCopy(mood,st.total,st.done,!!saved):['오늘의 네모',''];
  var face=(typeof nemoSVG==='function')?nemoSVG(mood,'closed-nemo'):'';
  var hero='<section class="card closed-hero">'+face+'<div class="closed-hero-copy"><small>'+esc(mdTxt(d)+' '+DAYS[dow(d)]+'요일')+' · 마감 완료</small><b>'+esc(copy[0])+'</b><span>할 일 '+st.done+'/'+st.total+' 완료</span></div></section>';
  /* 시간별 한 일 */
  var junkTimeLabel=/^(시작|시장|끝|종료)$/;var items=itemsFor(d).filter(function(it){var nm=String(it&&it.name||'').trim();return !it.skipped&&it.kind!=='todo'&&!junkTimeLabel.test(nm);}),notes=S.hourNotes[k]||{},hrs={};
  items.forEach(function(it){var h=Math.floor(it.start/60);(hrs[h]=hrs[h]||{items:[],note:''}).items.push(it);});
  Object.keys(notes).forEach(function(h){var nt=String(notes[h]||'').trim();if(nt&&!junkTimeLabel.test(nt))(hrs[h]=hrs[h]||{items:[],note:''}).note=nt;});
  var hourRows=Object.keys(hrs).map(Number).sort(function(a,b){return a-b;}).map(function(h){var x=hrs[h];
    return '<li class="closed-hour"><span class="closed-hour-t">'+h+':00</span><div class="closed-hour-b">'+
      x.items.map(function(it){var nm=String(it.name||'');return '<span class="closed-hour-it" style="--c:'+it.color+'"><i></i>'+esc(nm)+'<small>'+fmt(it.start)+(it.openEnd?'':'–'+fmt(it.end))+'</small></span>';}).join('')+
      (x.note?'<p>'+esc(x.note)+'</p>':'')+'</div></li>';}).join('');
  var hours='<section class="card closed-sec"><div class="card-h"><h3>시간별로 한 일</h3></div>'+(hourRows?'<ul class="closed-hours">'+hourRows+'</ul>':'<p class="closed-empty">시간별 기록이 없어요</p>')+'</section>';
  /* 하려고 한 일 (한 건 선 긋기) */
  var tds=sortTodos(S.todos.filter(function(t){return t.scope==='day'&&t.key===k;})),rts=routinesFor(d);
  var planRows=rts.map(function(r){var dn=routineDone(r,k);return '<li class="'+(dn?'done':'')+'"><i></i><span>'+esc(r.text||r.name||'반복 할 일')+'</span></li>';}).join('')+
    tds.map(function(t){return '<li class="'+(t.done?'done':'')+'"><i></i><span>'+esc(t.text)+'</span>'+(t.course?'<small>'+esc(t.course)+'</small>':'')+'</li>';}).join('');
  var plans='<section class="card closed-sec"><div class="card-h"><h3>하려고 한 일</h3><span class="cnt">'+st.done+'/'+st.total+'</span></div>'+(planRows?'<ul class="closed-plans">'+planRows+'</ul>':'<p class="closed-empty">적어둔 할 일이 없었어요</p>')+'</section>';
  /* 내일의 나에게 */
  var letter='';
  if(S.settings.letterOn){
    if(k===tk)letter=letterCard(k);
    else{var nx=S.letters[dkey(addDays(d,1))];if(nx&&nx.text)letter='<section class="card"><div class="card-h"><h3>다음 날의 나에게</h3></div><p class="lt-got">'+esc(nx.text)+'</p></section>';}
  }
  var diaryEntry=diaryForKey(k),hasDiary=!!diaryEntry,diaryWait='';
  if(k===tk){
    var diaryPreview=hasDiary?String(diaryEntry.text||diaryEntry.note||'').trim().replace(/\s+/g,' ').slice(0,72):'';
    var diaryTitle=hasDiary?'오늘 쓴 일기 보기':'네모가 일기를 기다리고 있어요';
    var diarySub=hasDiary?(diaryPreview||(diaryEntry.word?('오늘의 한 단어 · '+diaryEntry.word):'오늘 남긴 기록을 다시 펼쳐봐요.')):'일기로 오늘 하루의 마지막을 채워봐요';
    diaryWait='<button class="card diary-today-banner closed-diary-wait" data-act="'+(hasDiary?'open-diary-library':'open-diary')+'"><div class="diary-banner-copy"><small>'+esc(mdTxt(d)+' ('+DAYS[dow(d)]+')')+'</small><b>'+esc(diaryTitle)+'</b><span>'+esc(diarySub)+'</span></div><img class="diary-banner-nemo" src="nemo-diary.png?v=20260926-0209" alt=""><span class="diary-banner-arrow">›</span></button>';
  }
  /* 일간에는 스토리 카드 자체를 펼쳐두지 않아요. 마감 뒤 원본 기록은 읽기 전용이고, 카드는 하단 버튼/친구 탭에서 열어요. */
  return '<div class="closed-day">'+hours+plans+diaryWait+letter+'</div>';
}
function viewDay(){
  var d=U.date,k=dkey(d),tk=todayKey();
  if(dayClosedMode(k))return closedDayHTML(d);
  var backToClosed=dayCloseCard(k)?'<div class="closed-back"><button class="tbtn" data-act="day-closed-view">마감 요약으로 보기</button></div>':'';
  var memo=memoOf(k);
  var over=(k===tk)?S.todos.filter(function(t){return !t.done&&t.scope==='day'&&t.key<tk;}):[];
  var warn=over.length?'<section class="card warn"><div class="card-h"><h3>밀린 할 일 '+over.length+'개</h3><button class="tbtn" data-act="move-all-today">모두 오늘로</button></div><ul class="todos">'+
    sortTodos(over).map(function(t){return todoItem(t,{tag:true,move:true});}).join('')+'</ul></section>':'';
  var side='<div class="side">'+warn+sideTodo(k,k===tk?'오늘 할 일':'이날 할 일')+friendPlannerHTML(k)+(featOn('showMemo')?
    '<section class="card s-memo" data-memo-drop="'+k+'"><div class="card-h"><h3>하루 메모</h3></div><textarea class="memo" data-memo="'+k+'" placeholder="기억할 것, 오늘 있었던 일">'+esc(memo.text)+'</textarea>'+
    memoPhotosHTML(k,memo.photos)+'<label class="tbtn memo-addphoto">사진 추가<input type="file" accept="image/*" multiple data-memophoto="'+k+'" hidden></label></section>':'')+
    (featOn('showLog')?'<div class="s-log">'+logCard(k)+'</div>':'')+'<div class="s-letter">'+letterCard(k)+'</div></div>';
  return backToClosed+(k===tk?homeStrip()+schoolInfoCard():'')+'<div class="dayg">'+timelineHTML(d)+side+'</div>';
}

/* ---------- 화면: 할 일 ---------- */
function viewTodo(){
  var T=studyDayDate(new Date()),tk=todayKey(),wk=dkey(mondayOf(T)),mo=mkey(T);
  var allOpen=S.todos.filter(function(t){return !t.done&&!t.autoPlanChild;});
  var dueSoon=allOpen.filter(function(t){return t.due&&diffDays(t.due)<=7;}).sort(function(a,b){return a.due<b.due?-1:a.due>b.due?1:0;});
  var open=allOpen.filter(function(t){return dueSoon.indexOf(t)<0;});
  function over(t){return (t.scope==='day'&&t.key<tk)||(t.scope==='week'&&t.key<wk)||(t.scope==='month'&&t.key<mo);}
  function fut(t){return (t.scope==='day'&&t.key>tk)||(t.scope==='week'&&t.key>wk)||(t.scope==='month'&&t.key>mo);}
  var groups=[
    ['마감 임박',dueSoon,{tag:true,warn:true,keep:true}],
    ['밀린 할 일',open.filter(over),{tag:true,warn:true}],
    ['오늘',open.filter(function(t){return t.scope==='day'&&t.key===tk;}),{}],
    ['이번 주',open.filter(function(t){return t.scope==='week'&&t.key===wk;}),{}],
    ['이번 달',open.filter(function(t){return t.scope==='month'&&t.key===mo;}),{}],
    ['앞으로',open.filter(fut),{tag:true}],
    ['언제든지',open.filter(function(t){return t.scope==='inbox';}),{}]
  ];
  var qs=[['day','오늘'],['week','이번 주'],['month','이번 달'],['inbox','언제든지'],['routine','반복']];
  var qtabs='<div class="seg qscope-tabs" style="margin-bottom:8px">'+
    qs.map(function(q){return '<button data-act="qscope" data-v="'+q[0]+'" class="'+(U.qscope===q[0]?'on':'')+'">'+q[1]+'</button>';}).join('')+'</div>';
  var quickBody=U.qscope==='routine'
    ? '<button class="routine-quick-add" data-act="add-rt">+ 반복 할 일 추가</button><div class="hint" style="margin:8px 2px 0">요일을 골라두면 해당 날짜의 일간 화면에 자동으로 떠요.</div>'
    : '<div class="add" style="margin-top:0"><input data-draft="quick" placeholder="해야 할 일을 적어요" enterkeyhint="done" value="'+esc(U.drafts.quick||'')+'"><button data-act="add-quick">추가</button></div>'+ 
      (U.qopt?'':'<button class="optlink" data-act="qopt">+ 과목·마감일</button>')+(U.qopt?'<div class="duebox"><span>과목</span>'+courseSelect('q-course',U.qcourse||'','sel')+'</div>':'')+
      (U.qopt?'<div class="duebox"><span>마감일</span><input type="date" id="q-due" value="'+esc(U.qdue||'')+'">'+(U.qdue?'<button data-act="clear-qdue">없음</button>':'')+'</div>':'');
  var html='<section class="card">'+qtabs+quickBody+'</section>';
  if(U.qscope==='routine'){
    html+='<section class="card"><div class="card-h"><h3>반복 할 일</h3><span class="cnt">'+S.routines.length+'</span></div>'+ 
      (S.routines.length?S.routines.map(function(r){
        return '<div class="rt"><span class="ttxt" data-act="edit-rt" data-id="'+r.id+'">'+esc(r.text)+'<small>↻ '+esc(daysText(r.days))+streakTxt(r)+'</small></span></div>';
      }).join(''):'<div class="empty">아직 반복 할 일이 없어요. 위에서 추가해보세요.</div>')+'</section>';
  }
  var any=false;
  groups.forEach(function(g){
    if(!g[1].length)return;
    any=true;
    html+='<section class="card '+(g[2].warn?'warn':'')+'"><div class="card-h"><h3>'+g[0]+'</h3><span class="cnt">'+g[1].length+'</span></div><ul class="todos">'+
      (g[2].keep?g[1]:sortTodos(g[1])).map(function(t){return todoItem(t,{tag:g[2].tag});}).join('')+'</ul></section>';
  });
  if(!any)html+='<div class="empty" style="text-align:center;padding:24px 0">남은 할 일이 없어요</div>';
  var done=S.todos.filter(function(t){return t.done&&!t.autoPlanChild;});
  if(done.length){
    html+='<section class="card"><div class="card-h"><h3>완료한 일 '+done.length+'개</h3><button class="tbtn" data-act="toggle-done-list">'+(U.showDone?'접기':'보기')+'</button></div>';
    if(U.showDone){
      html+='<ul class="todos">'+done.slice().sort(function(a,b){return b.created-a.created;}).slice(0,50).map(function(t){return todoItem(t,{tag:true});}).join('')+'</ul>'+
        '<div class="acts"><button class="b-ghost" data-act="clear-done">완료 항목 모두 지우기</button></div>';
    }
    html+='</section>';
  }
  return html;
}

/* ---------- 화면: 시간표 관리 ---------- */
function openCnt(n){return S.todos.filter(function(t){return t.course===n&&!t.done;}).length;}
function pasteDayIndex(text){
  var m=String(text||'').match(/(?:^|[\s\t,|\[\(])(월|화|수|목|금|토|일)(?:요일)?(?=$|[\s\t,|\]\)])/);
  return m?DAYS.indexOf(m[1]):-1;
}
function pasteTimePair(text){
  var range=String(text||'').match(/(\d{1,2})(?::(\d{2}))?\s*(?:시)?\s*(?:~|〜|-|–|—|부터)\s*(\d{1,2})(?::(\d{2}))?\s*(?:시)?/);
  if(range){
    var sm=Number(range[1])*60+Number(range[2]||0),em=Number(range[3])*60+Number(range[4]||0);
    return {start:fmt(sm),end:fmt(em),text:range[0]};
  }
  var xs=[],re=/(\d{1,2}):(\d{2})/g,m;
  while((m=re.exec(String(text||'')))&&xs.length<2)xs.push({m:Number(m[1])*60+Number(m[2]),text:m[0]});
  return xs.length>=2?{start:fmt(xs[0].m),end:fmt(xs[1].m),text:xs[0].text+' '+xs[1].text}:null;
}
function parsePastedClasses(raw){
  var out=[],seen={};
  String(raw||'').split(/\r?\n/).forEach(function(line){
    var src=line.trim();if(!src||/^(시간표|요일|월|화|수|목|금|토|일)\s*(시간|과목|수업)?$/i.test(src))return;
    var day=pasteDayIndex(src),tm=pasteTimePair(src);if(day<0||!tm)return;
    var name=src.replace(tm.text,' ');
    name=name.replace(/(?:^|[\s\t,|\[\(])(월|화|수|목|금|토|일)(?:요일)?(?=$|[\s\t,|\]\)])/g,' ');
    name=name.replace(/[\t|]+/g,' ').replace(/^[\s,;:–—-]+|[\s,;:–—-]+$/g,'').replace(/\s{2,}/g,' ').trim();
    if(!name||name.length>60)return;
    if(tm.end<=tm.start)return;
    var key=name+'|'+day+'|'+tm.start+'|'+tm.end;if(seen[key])return;seen[key]=1;
    out.push({name:name,sub:'',day:day,start:tm.start,end:tm.end,color:defCol()});
  });
  return out;
}

var TTScan={file:null,preview:'',rows:[],loading:false};
function openTimetableScan(){
  TTScan={file:null,preview:'',rows:[],loading:false};M={type:'tt-scan'};
  openModal('<h3>▣ 시간표 캡처로 등록</h3><p class="hint">요일과 시간이 보이도록 시간표 전체를 캡처해 올려주세요. 분석 결과는 바로 저장하지 않고 먼저 확인할 수 있어요.</p>'+
    '<input id="ttscan-file" type="file" accept="image/*,.heic,.heif" style="display:none">'+
    '<button class="b-ghost" style="width:100%;height:46px;border-radius:12px;font-weight:700" data-act="ttscan-pick">사진 선택</button>'+
    '<div id="ttscan-preview"></div><p class="hint" id="ttscan-msg">JPG · PNG · HEIC 등 휴대폰 사진을 선택할 수 있어요.</p>'+
    '<div id="ttscan-results"></div><div class="acts"><button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="ttscan-analyze">시간표 분석하기</button></div>');
  setTimeout(function(){var f=$('#ttscan-file');if(f)f.onchange=ttscanFileChanged;},0);
}
function ttscanFileChanged(e){
  var f=e.target.files&&e.target.files[0];if(!f)return;TTScan.file=f;TTScan.rows=[];
  if(TTScan.preview)try{URL.revokeObjectURL(TTScan.preview);}catch(_){}
  TTScan.preview=URL.createObjectURL(f);
  var p=$('#ttscan-preview');if(p)p.innerHTML='<div class="ttscan-preview"><img src="'+TTScan.preview+'" alt="시간표 캡처"><div><b>'+esc(f.name||'시간표 이미지')+'</b><small style="display:block;color:var(--sub);margin-top:4px">'+Math.round(f.size/1024)+'KB</small></div></div>';
  var m=$('#ttscan-msg');if(m)m.textContent='사진을 골랐어요. 이제 시간표 분석하기를 눌러주세요.';
  var r=$('#ttscan-results');if(r)r.innerHTML='';
}
function ttscanNormRow(x){
  var days={월:0,화:1,수:2,목:3,금:4,토:5,일:6},d=x.day;
  if(typeof d==='string')d=days[d.replace('요일','').trim()];
  return {id:uid(),name:String(x.title||x.name||'').trim(),day:Number.isInteger(+d)?+d:-1,start:String(x.start||'').slice(0,5),end:String(x.end||'').slice(0,5),professor:String(x.professor||'').trim(),room:String(x.room||x.location||'').trim(),color:defCol()};
}
function ttscanProblems(x){
  var p=[],sm=toMin(x.start),em=toMin(x.end);
  if(!x.name)p.push('과목명이 비어 있어요');
  if(x.day<0||x.day>6)p.push('요일을 확인해주세요');
  if(!/^\d\d:\d\d$/.test(x.start)||!/^\d\d:\d\d$/.test(x.end)||em<=sm)p.push('시간을 다시 확인해주세요');
  else if(em-sm>360)p.push('수업 시간이 너무 길어요');
  var dup=S.classes.some(function(c){return c.name===x.name&&+c.day===+x.day&&c.start===x.start&&c.end===x.end;});
  if(dup)p.push('이미 등록된 수업');
  return p;
}
function drawTTScan(){
  var box=$('#ttscan-results');if(!box)return;
  if(!TTScan.rows.length){box.innerHTML='';return;}
  box.innerHTML='<p class="hint"><b>'+TTScan.rows.length+'개 수업을 찾았어요.</b> 틀린 부분은 수정하고 필요 없는 수업은 삭제해주세요.</p><div class="ttscan-list">'+TTScan.rows.map(function(x,i){
    var pr=ttscanProblems(x),sub=[x.professor,x.room].filter(Boolean).join(' · ');
    return '<div class="ttscan-card'+(pr.length?' bad':'')+'" data-scan-i="'+i+'"><div class="ttscan-grid">'+
      '<input class="fld" data-scan-f="name" value="'+esc(x.name)+'" placeholder="과목명">'+
      '<select class="fld" data-scan-f="day">'+DAYS.map(function(d,di){return '<option value="'+di+'"'+(di===x.day?' selected':'')+'>'+d+'</option>';}).join('')+'</select>'+
      '<input class="fld ttscan-time" type="time" data-scan-f="start" value="'+esc(x.start)+'">'+
      '<input class="fld ttscan-time" type="time" data-scan-f="end" value="'+esc(x.end)+'"></div>'+
      '<div class="ttscan-meta"><input class="fld" data-scan-f="professor" value="'+esc(x.professor)+'" placeholder="교수명 (선택)"><input class="fld" data-scan-f="room" value="'+esc(x.room)+'" placeholder="강의실 (선택)"></div>'+
      (pr.length?'<div class="ttscan-warn">주의: '+esc(pr.join(' · '))+'</div>':'')+
      '<button class="tbtn" style="margin-top:7px" data-act="ttscan-remove" data-i="'+i+'">삭제</button></div>';
  }).join('')+'</div><div class="acts"><button class="b-ghost" data-act="ttscan-analyze">다시 분석</button><button class="b-save" data-act="ttscan-import">전체 등록</button></div>';
  box.querySelectorAll('[data-scan-f]').forEach(function(el){el.onchange=function(){var card=el.closest('[data-scan-i]'),i=+card.dataset.scanI,f=el.dataset.scanF;if(TTScan.rows[i])TTScan.rows[i][f]=f==='day'?+el.value:el.value;drawTTScan();};});
}
async function analyzeTimetableImage(){
  var m=$('#ttscan-msg');if(!TTScan.file){if(m)m.textContent='먼저 시간표 캡처를 선택해주세요.';return;}
  if(TTScan.loading)return;TTScan.loading=true;if(m)m.textContent='시간표 읽는 중…';
  try{
    var fd=new FormData();fd.append('image',TTScan.file);
    var sbBase=(typeof SUPABASE_URL!=='undefined'?SUPABASE_URL:(typeof SB_URL!=='undefined'?SB_URL:'')),
        sbKey=(typeof SUPABASE_ANON_KEY!=='undefined'?SUPABASE_ANON_KEY:(typeof SUPABASE_KEY!=='undefined'?SUPABASE_KEY:(typeof SB_KEY!=='undefined'?SB_KEY:'')));
    if(!sbBase)throw new Error(userMsg('서버에 연결하지 못했어요.','Supabase URL 설정을 찾지 못했어요.'));
    var hdr={};if(sbKey)hdr.apikey=sbKey;
    var res=await fetch(sbBase.replace(/\/$/,'')+'/functions/v1/timetable-vision',{method:'POST',headers:hdr,body:fd});
    var data=await res.json().catch(function(){return {};});
    if(!res.ok)throw new Error(data.error||'분석 실패');
    var rows=(data.classes||[]).map(ttscanNormRow).filter(function(x){return x.name||x.start||x.end;});
    if(!rows.length){if(m)m.textContent='시간표를 정확히 읽지 못했어요. 요일과 시간이 보이도록 캡처해서 다시 시도해주세요.';return;}
    var seen={};TTScan.rows=rows.filter(function(x){var k=x.name+'|'+x.day+'|'+x.start+'|'+x.end;if(seen[k])return false;seen[k]=1;return true;});
    if(m)m.textContent='분석이 끝났어요. 등록 전에 내용을 확인해주세요.';drawTTScan();
  }catch(e){if(m)m.textContent='시간표 분석에 실패했어요. '+(e&&e.message?e.message:'다시 시도해주세요.');}
  finally{TTScan.loading=false;}
}
function importTTScan(){
  document.querySelectorAll('[data-scan-i]').forEach(function(card){var i=+card.dataset.scanI;card.querySelectorAll('[data-scan-f]').forEach(function(el){var f=el.dataset.scanF;if(TTScan.rows[i])TTScan.rows[i][f]=f==='day'?+el.value:el.value;});});
  var good=TTScan.rows.filter(function(x){var p=ttscanProblems(x);return !p.length;});
  if(!good.length){var m=$('#ttscan-msg');if(m)m.textContent='등록할 수 있는 수업이 없어요. 빨간 경고를 먼저 확인해주세요.';drawTTScan();return;}
  good.forEach(function(x){
    var sub=[x.professor,x.room].filter(Boolean).join(' · ');
    S.classes.push({id:uid(),name:x.name,sub:sub,day:+x.day,start:x.start,end:x.end,color:x.color||defCol()});
  });
  save();scheduleSync();closeModal();render(true);inAppToast(good.length+'개 수업을 시간표에 등록했어요');
}
function openPasteTable(){
  M={type:'paste-table'};
  openModal('<h3>시간표 붙여넣기</h3><p class="hint">시간표를 글자로 복사해 한 줄에 한 수업씩 붙여넣어요.<br>예: <b>월 09:00~10:15 일반물리학1</b><br>또는 <b>일반물리학1 · 월 · 09:00~10:15</b></p><textarea class="ta" id="f-tpaste" spellcheck="false" placeholder="월 09:00~10:15 일반물리학1\n화 13:00~14:15 미적분학1"></textarea><p class="hint" id="paste-msg">요일과 시작·끝 시간이 있는 줄만 가져와요.</p><div class="acts"><button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="import-paste">추가하기</button></div><button class="b-del" style="width:100%;height:42px;margin-top:8px" data-act="replace-paste">기존 시간표를 지우고 교체</button>');
}
function pasteMsg(t){var el=$('#paste-msg');if(el)el.textContent=t;}
function importPastedTable(replace,btn){
  var rows=parsePastedClasses($('#f-tpaste')?$('#f-tpaste').value:'');
  if(!rows.length){pasteMsg('요일과 시간 범위를 읽지 못했어요. 예시처럼 한 줄씩 넣어주세요.');return;}
  if(replace&&!armed(btn))return;
  if(replace)S.classes=[];
  rows.forEach(function(x){S.classes.push(Object.assign({id:uid()},x));});
  save();closeModal();render(true);
}
var RECOVER_2026F_CLASSES=[
  {name:'미분적분학1',sub:'62306',day:0,start:'10:30',end:'11:45'},
  {name:'영어쓰기',sub:'26508',day:1,start:'13:30',end:'14:45'},
  {name:'창의적글쓰기',sub:'36101',day:1,start:'15:00',end:'16:15'},
  {name:'미분적분학1',sub:'62306',day:2,start:'09:00',end:'10:15'},
  {name:'예술과4차산업혁명',sub:'36109',day:3,start:'09:00',end:'11:50'},
  {name:'영어쓰기',sub:'26508',day:3,start:'12:00',end:'13:15'},
  {name:'창의적글쓰기',sub:'36101',day:3,start:'16:00',end:'17:15'},
  {name:'문학입문',sub:'26506',day:4,start:'09:00',end:'11:50'},
  {name:'창의적융합디자인',sub:'36203',day:4,start:'12:00',end:'13:50'}
];
function restore2026FallSchedule(){
  var added=0,baseColor=S.settings.defColor||defCol();
  RECOVER_2026F_CLASSES.forEach(function(c){
    var exists=S.classes.some(function(x){return x.name===c.name&&x.day===c.day&&x.start===c.start&&x.end===c.end;});
    if(!exists){S.classes.push(Object.assign({id:uid(),color:baseColor,from:null,to:null},c));added++;}
  });
  S.settings.semStart='2026-08-31';S.settings.semEnd='2026-12-18';
  S.settings.school='skku';S.settings.schoolCampus='수원';S.settings.schoolConfigured=true;S.settings.onboardDone=true;
  var custom=(S.settings.links||[]).filter(function(l){return !isGeneratedSchoolLink(l);});
  S.settings.links=schoolLinks('skku','수원').concat(custom);
  [
    {name:'2026-2 중간시험 기간',start:'2026-10-19',end:'2026-10-23',kind:'중간고사'},
    {name:'2026-2 기말시험 기간',start:'2026-12-14',end:'2026-12-18',kind:'기말고사'}
  ].forEach(function(e){
    var old=S.exams.find(function(x){return x.name===e.name||((x.kind===e.kind)&&x.start===e.start&&x.end===e.end);});
    if(old)Object.assign(old,e,{course:'기타',pin:true});
    else S.exams.push(Object.assign({id:uid(),course:'기타',pin:true},e));
  });
  S.settings.recovered2026F=true;
  save();friendPush();render(true);inAppToast((added?added+'개 수업 + ':'')+'학기·시험기간을 복원했어요');
}
function viewTable(){
  var pm=plannerMode();
  var fixedTitle=pm==='exam'?'과목 · 고정 공부 시간':pm==='other'?'고정 스케줄':pm==='school'?'수업 · 고정 일정':'강의 · 고정 일정';
  var fixedEmpty=pm==='exam'?'아직 공부 스케줄이 없어요. 아래 버튼으로 첫 공부 시간을 넣어봐요':pm==='other'?'아직 고정 스케줄이 없어요. 아래 버튼으로 하나 추가해봐요':pm==='school'?'아직 수업이 없어요. 아래 버튼으로 시간표를 넣어요':'아직 강의가 없어요. 아래 버튼으로 시간표를 넣어요';
  var addFixedLabel=pm==='exam'?'+ 공부 시간 추가':pm==='other'?'+ 고정 일정 추가':pm==='school'?'+ 수업 추가':'+ 강의 추가';
  var scanLabel=(pm==='university'||pm==='school')?'▣ 시간표 캡처':'▣ 스케줄 캡처';
  var examTitle=pm==='exam'?'시험 · 모의고사':pm==='other'?'중요 일정 · 시험':'시험 일정';
  var map={},order=[];
  S.classes.forEach(function(c){
    var k=c.name+'|'+c.sub;
    if(!map[k]){map[k]={name:c.name,sub:c.sub,color:c.color,blocks:[]};order.push(k);}
    map[k].blocks.push(c);
  });
  function rank(g){var b=g.blocks.filter(function(x){return x.day!=null;}).sort(function(a,b){return a.day-b.day||a.start.localeCompare(b.start);})[0];return b?b.day*2000+toMin(b.start):99999;}
  var groups=order.map(function(k){return map[k];}).sort(function(a,b){return rank(a)-rank(b);});
  var list=groups.map(function(g){
    var slots=g.blocks.slice().sort(function(a,b){return (a.day==null?9:a.day)-(b.day==null?9:b.day)||a.start.localeCompare(b.start);}).map(function(b){
      return '<button class="slot" data-act="edit-block-direct" data-id="'+b.id+'">'+(b.day==null?'시간 미정':DAYS[b.day]+' '+b.start+'–'+b.end)+((b.from||b.to)?' · '+(b.from?b.from.slice(5).replace('-','/'):'')+'~'+(b.to?b.to.slice(5).replace('-','/'):''):'')+'</button>';
    }).join('');
    return '<div class="course"><button class="cdot" style="--c:'+g.color+'" data-act="course-color" data-name="'+esc(g.name)+'" aria-label="색 바꾸기"></button><div style="flex:1;min-width:0"><button class="cname" data-act="course-todos" data-name="'+esc(g.name)+'">'+esc(g.name)+(openCnt(g.name)?'<em>'+openCnt(g.name)+'</em>':'')+'</button>'+(g.sub?'<span class="cd">'+esc(g.sub)+'</span>':'')+'<div class="slots">'+slots+'</div></div></div>';
  }).join('')||'<div class="empty">'+esc(fixedEmpty)+'</div>';
  var ex=S.exams.slice().sort(function(a,b){return a.start<b.start?-1:1;});
  var ddl=S.ddays.slice().sort(function(a,b){return ddNext(a)<ddNext(b)?-1:1;});
  var ddHTML='<section class="card"><div class="card-h"><h3>D-day</h3><button class="tbtn" data-act="add-dd">+ 추가</button></div>'+
    (ddl.length?ddl.map(function(x){var nd=parseKey(ddNext(x));
      return '<div class="setrow"><span style="display:flex;align-items:center;gap:8px"><i class="ddcat-row" style="--c:'+x.color+'">'+ddCatIconHTML(x)+'</i><span>'+esc(x.title)+'<small>'+(nd.getMonth()+1)+'/'+nd.getDate()+(ddCategory(x)==='couple'?' · 다음 기념일':x.mode==='since'?' · 시작일':'')+(x.yearly?' · 매년':'')+(x.pin?' · 위에 표시':'')+'</small></span></span><b class="ddn">'+ddLabel(x)+'</b><button class="tbtn" data-act="edit-dd" data-id="'+x.id+'">수정</button></div>';}).join('')
      :'<div class="empty">중요한 날은 디데이로 설정할 수 있어요.<br><button class="tbtn" style="margin-top:8px" data-act="add-dd">+ D-day 추가</button></div>')+'</section>';
  var adl=S.allday.slice().sort(function(a,b){return (a.days?0:1)-(b.days?0:1)||((a.date||'')<(b.date||'')?-1:1);});
  var adHTML='<section class="card"><div class="card-h"><h3>일정</h3><button class="tbtn" data-act="add-schedule">+ 추가</button></div>'+
    (adl.length?adl.map(function(a){var md=function(k){return k?Number(k.slice(5,7))+'/'+Number(k.slice(8)):'';};var when=a.days?daysText(a.days)+((a.from||a.to)?' · '+md(a.from)+'~'+md(a.to):''):a.end?md(a.date)+'~'+md(a.end):(function(x){return (x.getMonth()+1)+'/'+x.getDate()+' ('+DAYS[dow(x)]+')';})(parseKey(a.date));
      return '<div class="setrow"><span style="display:flex;align-items:center;gap:8px"><i class="cdot" style="--c:'+a.color+';margin:0"></i><span>'+esc(a.title)+'<small>'+esc(when)+'</small></span></span><button class="tbtn" data-act="edit-ad" data-id="'+a.id+'">수정</button></div>';}).join('')
      :'<div class="empty">시간 없이 매일·특정 요일에 띄울 일정을 넣어요</div>')+'</section>';
  if(!U.esem)U.esem=semOf(todayKey());
  ex=ex.filter(function(e){var o=semOf(e.start);return o.y===U.esem.y&&o.t===U.esem.t;});
  var exHTML='<section class="card"><div class="card-h"><h3 class="exh">'+esc(examTitle)+' <span class="semnav"><button data-act="esem" data-v="-1" aria-label="이전 학기">‹</button><b>'+semTxt(U.esem)+'</b><button data-act="esem" data-v="1" aria-label="다음 학기">›</button></span></h3><button class="tbtn" data-act="add-exam">+ 추가</button></div>'+
    '<div class="seg exview"><button data-act="exview" data-v="date" class="'+(S.settings.examView!=='course'?'on':'')+'">날짜별</button><button data-act="exview" data-v="course" class="'+(S.settings.examView==='course'?'on':'')+'">과목별</button></div>'+
    (ex.length?(S.settings.examView==='course'?(function(){
      var g={},order=[];ex.forEach(function(e){var c=examCourse(e)||'과목 미지정';if(!g[c]){g[c]=[];order.push(c);}g[c].push(e);});
      order.sort(function(a,b){var ia=courseNames().indexOf(a),ib=courseNames().indexOf(b);return (ia<0?999:ia)-(ib<0?999:ib);});
      return order.map(function(c){return '<div class="exgrp"><div class="exgh"><i class="cdot" style="--c:'+(c==='과목 미지정'||c==='기타'?'#ebebee':courseColor(c))+';margin:0"></i>'+esc(c)+'<span class="cnt">'+g[c].length+'</span></div>'+g[c].map(function(e){return examRow(e,true);}).join('')+'</div>';}).join('');
    })():ex.map(function(e){return examRow(e);}).join(''))
      :'<div class="empty">이 학기엔 등록된 시험이 없어요<br><button class="tbtn" style="margin-top:8px" data-act="add-exam">+ 시험 추가</button></div>')+'</section>';
  return '<section class="card"><div class="card-h"><h3>'+esc(fixedTitle)+'</h3><div class="tt-actions"><button class="tbtn" data-act="ttscan-open">'+esc(scanLabel)+'</button><button class="tbtn" data-act="paste-table">붙여넣기</button></div></div>'+
    '<div class="semrow"><span>학기 기간</span><input type="date" id="set-ss" value="'+(S.settings.semStart||'')+'"><span>~</span><input type="date" id="set-se" value="'+(S.settings.semEnd||'')+'"></div><p class="hint">개강~종강을 넣으면 방학엔 수업이 안 뜨고, 주간 제목이 "개강 N주차"로 바뀌어요</p>'+
    '<p class="hint">동그라미는 과목별, 시간표 블록은 그 시간만 바꿀 수 있어요</p>'+list+
    '<div class="acts" style="margin-top:10px"><button class="b-ghost" data-act="add-block">'+esc(addFixedLabel)+'</button></div></section>'+ddHTML+adHTML+exHTML;
}
function viewSettings(){
  var blockWord=modeBlockWord(),gapWord=modeGapWord();
  /* 학교 기본 링크는 현재 선택된 학교에서 매번 다시 만들고, 사용자가 직접 추가한 링크만 보존해요. */
  var spNow=schoolProfile(S.settings.school),campNow=canonicalCampus(spNow.id,S.settings.schoolCampus);
  var customLinks=(S.settings.links||[]).filter(function(l){return !isGeneratedSchoolLink(l);});
  var links=(S.settings.schoolConfigured?schoolLinks(spNow.id,campNow):[]).concat(customLinks);
  var linkHTML='<section class="card"><div class="card-h"><h3>바로가기</h3><button class="tbtn" data-act="add-link">+ 추가</button></div>'+
    (links.length?links.map(function(l){
      return '<div class="setrow"><a class="lnk" href="'+esc(l.url)+'" target="_blank" rel="noopener">'+esc(l.name)+'<small>'+esc(l.url.replace(/^https?:\/\//,'').replace(/\/$/,''))+'</small></a><button class="tbtn" data-act="edit-link" data-id="'+l.id+'">수정</button></div>';
    }).join(''):'<div class="empty">자주 가는 사이트를 넣어두세요</div>')+'</section>';
  var sp=schoolProfile(S.settings.school),schoolHTML='<section class="card"><div class="card-h"><h3>학교</h3></div>'+ 
    '<div class="setrow" style="align-items:flex-start"><span>학교<small>학교 이름을 검색해서 선택해요</small></span><div style="min-width:0;width:min(62%,420px)"><input class="fld" id="set-school-search" list="set-school-list" autocomplete="off" placeholder="학교 검색" value="'+esc(S.settings.schoolConfigured?sp.name:'')+'" style="margin:0;width:100%"><datalist id="set-school-list">'+schoolDatalist()+'</datalist><small id="set-school-hint" style="display:block;margin-top:5px;color:var(--sub)">예: 가천대학교, 성균관대학교</small></div></div>'+ 
    (S.settings.schoolConfigured&&sp.campuses.length>1?'<div class="setrow"><span>캠퍼스</span><select class="sel" id="set-campus">'+sp.campuses.map(function(c){return '<option value="'+esc(c)+'"'+(c===S.settings.schoolCampus?' selected':'')+'>'+esc(c)+'</option>';}).join('')+'</select></div>':'')+
    '<div class="setrow"><span>목록에 학교가 없나요?<small>공식 홈페이지를 직접 연결할 수 있어요</small></span><button class="tbtn" data-act="school-add-settings">+ 학교 추가</button></div></section>';
  var th=S.settings.theme||lsGet('planner.theme')||'auto';
  var bg=S.settings.bg||lsGet('planner.bg')||'rainbow';
  var ld=S.settings.logDisplay||{};
  var logPrefHTML='<section class="card settings-clean-card"><div class="card-h"><h3>홈 · 기록</h3><span class="cnt">필요한 것만 켜두기</span></div>'+
    '<p class="hint settings-clean-intro">비슷한 설정끼리 묶었어요. 접혀 있는 항목은 눌러서 펼치면 돼요.</p>'+

    '<details class="settings-group" open><summary><span><b>홈 화면</b><small>오늘 화면에 바로 보이는 것</small></span><i>⌄</i></summary><div class="settings-group-body">'+
      '<div class="setrow"><span>간단한 홈<small>핵심 일정과 할 일 위주로 보여줘요</small></span><button class="tbtn" data-act="toggle-lite">'+(S.settings.liteHome?'켜짐':'꺼짐')+'</button></div>'+
      '<div class="setrow"><span>학교 바로가기<small>학교 홈페이지·공지·식단 링크를 홈에 보여줘요</small></span><button class="tbtn" data-act="toggle-feat" data-id="showSchoolLinks">'+(featOn('showSchoolLinks')?'켜짐':'꺼짐')+'</button></div>'+
      '<div class="setrow"><span>오늘 할 일<small>홈 요약 카드에 오늘 할 일 진행률을 보여줘요</small></span><button class="tbtn" data-act="toggle-home-todo">'+(S.settings.showNextTodo===false?'꺼짐':'켜짐')+'</button></div>'+
      '<div class="setrow"><span>상단 D-day · 시험<small>홈·일간·주간 위에 중요 날짜를 보여줘요</small></span><button class="tbtn" data-act="toggle-top-show">'+(S.settings.topShow===false?'꺼짐':'켜짐')+'</button></div>'+
    '</div></details>'+

    '<details class="settings-group"><summary><span><b>생활 기록</b><small>기상 · 취침 · 공부 시간</small></span><i>⌄</i></summary><div class="settings-group-body">'+
      '<p class="hint settings-group-hint">숨겨도 기록 데이터는 지워지지 않아요.</p>'+
      [['wakeGoal','기상 목표'],['wakeTime','기상 시간'],['sleepTime','취침 시간'],['studyTotal','공부 총 시간']].map(function(x){return '<div class="setrow"><span>'+x[1]+'</span><button class="tbtn" data-act="toggle-log-display" data-id="'+x[0]+'">'+(ld[x[0]]!==false?'켜짐':'꺼짐')+'</button></div>';}).join('')+
      '<div class="setrow"><span>기상 목표 시각<small>이 시각이 지나면 오늘의 달성 버튼이 잠겨요</small></span><input class="sel" type="time" id="set-wake-goal" value="'+esc(S.settings.wakeGoal||'09:00')+'"></div>'+
      '<div class="setrow"><span>오늘 기록 카드<small>일간 화면에 생활 기록 카드를 보여줘요</small></span><button class="tbtn" data-act="toggle-feat" data-id="showLog">'+(featOn('showLog')?'켜짐':'꺼짐')+'</button></div>'+
    '</div></details>'+

    '<details class="settings-group"><summary><span><b>메모 · 일기 · 회고</b><small>기록 기능을 한곳에서 관리</small></span><i>⌄</i></summary><div class="settings-group-body">'+
      '<div class="setrow"><span>하루 메모<small>일간 화면에 메모·사진 칸을 보여줘요</small></span><button class="tbtn" data-act="toggle-feat" data-id="showMemo">'+(featOn('showMemo')?'켜짐':'꺼짐')+'</button></div>'+
      '<div class="setrow"><span>주간 회고<small>주간 화면에 완료율·집중시간·한 줄 회고를 보여줘요</small></span><button class="tbtn" data-act="toggle-weekly-review">'+(S.settings.showWeeklyReview===false?'꺼짐':'켜짐')+'</button></div>'+
      '<div class="setrow"><span>저녁 일기 버튼<small>오후 5시부터 홈에 일기 버튼을 보여줘요</small></span><button class="tbtn" data-act="toggle-feat" data-id="showDiary">'+(featOn('showDiary')?'켜짐':'꺼짐')+'</button></div>'+
      '<div class="setrow"><span>일기 노트 줄<small>일기 본문에 기본 색과 연동된 연한 가로줄을 보여줘요</small></span><button class="tbtn" data-act="toggle-feat" data-id="diaryRuled">'+(featOn('diaryRuled')?'켜짐':'꺼짐')+'</button></div>'+
      '<div class="setrow"><span>내일의 나에게<small>오늘 남긴 한 줄이 내일 맨 위에 떠요</small></span><button class="tbtn" data-act="toggle-letter">'+(S.settings.letterOn?'켜짐':'꺼짐')+'</button></div>'+
    '</div></details>'+

  '</section>';
  var syncHTML='<section class="card"><div class="card-h"><h3>저장 상태</h3>'+syncStateHTML(false)+'</div><p class="hint">시간표·시험·할 일·설정은 변경 즉시 이 기기에 저장되고, 로그인 중이면 계정에도 동기화돼요. 같은 계정으로 다시 로그인하면 자동으로 불러와요.</p>'+(Sync.uid&&SyncUI.state==='error'?'<p class="hint" style="color:var(--now)">'+esc(syncReason()||'계정 서버와 맞추지 못했어요. 다시 시도해주세요.')+'</p><div class="note" style="word-break:break-word;user-select:text;-webkit-user-select:text"><b style="display:block;margin-bottom:5px">오류 상세</b>'+esc(Sync.lastError||Sync.diag||'오류 정보 없음')+'</div>':'')+'<div class="acts">'+(Sync.uid&&SyncUI.state==='error'?'<button class="b-ghost" data-act="sync-retry">다시 시도</button>':'')+'<button class="b-ghost" data-act="open-backup">백업·복원</button></div></section>';
  var supportHTML='<section class="card"><div class="card-h"><h3>도움</h3></div>'+
    '<div class="setrow"><span>개인정보처리방침<small>수집·저장·공유·삭제되는 데이터를 확인해요</small></span><button class="tbtn" data-act="open-privacy">보기</button></div>'+
    '<div class="setrow"><span>문의·오류 신고<small>학교 정보 수정·학교 추가·기능 제안도 여기로 보내요</small></span><button class="tbtn" data-act="open-feedback">열기</button></div></section>';
  var viewHTML='<section class="card settings-clean-card"><div class="card-h"><h3>화면 · 알림</h3><span class="cnt">꾸미기와 표시</span></div>'+
    '<p class="hint settings-clean-intro">화면 꾸미기, 알림, 달력 표시를 나눠뒀어요.</p>'+

    '<details class="settings-group" open><summary><span><b>화면 꾸미기</b><small>색상 · 배경 · 캐릭터는 서로 따로 적용</small></span><i>⌄</i></summary><div class="settings-group-body">'+
      '<div class="setrow"><span>테마</span><div class="seg" style="margin:0">'+[['auto','자동'],['light','라이트'],['dark','다크']].map(function(x){return '<button data-act="set-theme" data-v="'+x[0]+'" class="'+(th===x[0]?'on':'')+'">'+x[1]+'</button>';}).join('')+'</div></div>'+
      '<div class="setrow"><span>하단 할 일 버튼<small>끄면 아래 메뉴의 ‘할 일’ 탭만 숨겨져요. 저장된 할 일은 지워지지 않아요.</small></span><button class="tbtn'+(S.settings.showTodoTab===false?'':' on')+'" data-act="toggle-todo-tab">'+(S.settings.showTodoTab===false?'꺼짐':'켜짐')+'</button></div>'+
      '<div class="setrow"><span>배경<small>원하는 배경만 골라요</small></span><div class="bgs">'+[['plain','기본'],['rainbow','기본 색 연동'],['pink','연핑크 + 흰 점'],['white','흰 바탕 + 연핑크 점'],['beige','베이지 + 흰 점'],['dot-mint','민트 바탕 + 아이보리 점'],['dot-mint-rev','아이보리 바탕 + 민트 점'],['dot-sky','하늘 바탕 + 아이보리 점'],['dot-sky-rev','아이보리 바탕 + 하늘 점'],['dot-yellow','연노랑 바탕 + 아이보리 점'],['dot-yellow-rev','아이보리 바탕 + 연노랑 점'],['dot-peach','살구 바탕 + 아이보리 점'],['dot-peach-rev','아이보리 바탕 + 살구 점'],['dot-pink','연핑크 바탕 + 아이보리 점'],['dot-pink-rev','아이보리 바탕 + 연핑크 점'],['dot-lavender','연보라 바탕 + 아이보리 점'],['dot-lavender-rev','아이보리 바탕 + 연보라 점'],['dot-green','연두 바탕 + 아이보리 점'],['dot-green-rev','아이보리 바탕 + 연두 점'],['dot-gray','연회색 바탕 + 아이보리 점'],['dot-gray-rev','아이보리 바탕 + 연회색 점'],['dot-beige','베이지 바탕 + 아이보리 점'],['dot-beige-rev','아이보리 바탕 + 베이지 점']].map(function(x){var linked=x[0]==='rainbow',style=linked?' style="background-color:var(--planner-color)!important;background-image:none!important"':'';return '<button class="bgsw bg-'+x[0]+(bg===x[0]?' on':'')+'"'+style+' data-act="set-bg" data-v="'+x[0]+'" aria-label="'+x[1]+'"></button>';}).join('')+'</div></div>'+
      '<div class="setrow"><span>주간 시간표 배경화면<small>현재 주간 시간표를 이미지로 저장해요</small></span><div class="seg" style="margin:0"><button data-act="wallpaper-phone">폰</button><button data-act="wallpaper-pad">패드</button></div></div>'+
      '<div class="setrow"><span>시간표 시간<small>범위 밖 일정이 있으면 자동으로 늘어나요</small></span><div class="hsel">'+
        '<select class="sel" id="set-hs">'+[0,1,2,3,4,5,6,7,8,9,10,11,12].map(function(h){return '<option value="'+h+'"'+((S.settings.hStart!=null?S.settings.hStart:9)===h?' selected':'')+'>'+h+'시</option>';}).join('')+'</select><span>~</span>'+
        '<select class="sel" id="set-he">'+[15,16,17,18,19,20,21,22,23,24].map(function(h){return '<option value="'+h+'"'+((S.settings.hEnd!=null?S.settings.hEnd:22)===h?' selected':'')+'>'+h+'시</option>';}).join('')+'</select></div></div>'+
      '<div class="setrow defc"><span>이름 기본 색<small>'+esc(blockWord)+'·일정·D-day·네모에 함께 적용돼요</small></span></div><div class="pal defpal">'+PALETTE.map(function(c){return '<button class="sw'+(defCol()===c?' on':'')+'" style="--c:'+c+'" data-act="set-defcolor" data-v="'+c+'" aria-label="기본 색"></button>';}).join('')+'</div>'+
      '<div class="nemo-settings-preview">'+nemoSVG('basic','')+'<div><b>네모도 기본 색에 자동 연동</b><small>홈에서는 오늘 상태에 따라 표정이 바뀌어요.</small><div class="nemo-mood-samples"><span class="nemo-mood-sample">'+nemoSVG('basic','')+'기본</span><span class="nemo-mood-sample">'+nemoSVG('happy','')+'행복</span><span class="nemo-mood-sample">'+nemoSVG('proud','')+'뿌듯</span><span class="nemo-mood-sample">'+nemoSVG('sad','')+'슬픔</span><span class="nemo-mood-sample">'+nemoSVG('gloomy','')+'우울</span><span class="nemo-mood-sample">'+nemoSVG('angry','')+'화남</span><span class="nemo-mood-sample">'+nemoSVG('sleepy','')+'졸림</span></div></div></div>'+
    '</div></details>'+

    '<details class="settings-group"><summary><span><b>알림</b><small>필요한 알림만 켜기</small></span><i>⌄</i></summary><div class="settings-group-body">'+
      '<div class="setrow"><span>가까운 일정 알림<small>'+(isIOSDevice()&&!isStandalonePWA()?'아이폰은 홈 화면에 추가한 앱에서 켤 수 있어요 · 현재 '+reminderPermissionLabel():'30분 전 시스템 알림 · 현재 '+reminderPermissionLabel())+'</small></span><button class="tbtn'+(S.settings.remindOn?' on':'')+'" data-act="toggle-remind">'+(S.settings.remindOn?'켜짐':'켜기')+'</button></div>'+
      '<div class="setrow"><span>아침 브리핑<small>오늘 '+esc(blockWord)+'·마감·'+esc(gapWord)+'·할 일을 알려줘요</small></span><div style="display:flex;align-items:center;gap:6px"><input class="sel" type="time" id="set-brief-time" value="'+esc(S.settings.morningBriefingTime||'08:00')+'" style="width:92px"><button class="tbtn'+(S.settings.morningBriefing?' on':'')+'" data-act="toggle-morning-brief">'+(S.settings.morningBriefing?'켜짐':'켜기')+'</button></div></div>'+
    '</div></details>'+

    '<details class="settings-group"><summary><span><b>달력 · D-day</b><small>월간·주간과 상단 표시</small></span><i>⌄</i></summary><div class="settings-group-body">'+
      '<div class="setrow"><span>공휴일 표시<small>빨간 날과 이름을 달력에 보여줘요 (2026~2027)</small></span><button class="tbtn" data-act="toggle-holi">'+(S.settings.holiOff?'꺼짐':'켜짐')+'</button></div>'+
      '<div class="setrow"><span>맨 위 D-day 개수<small>맨 위 표시한 중요 날짜만 가까운 순으로 보여줘요</small></span><div class="seg" style="margin:0">'+[[0,'0'],[1,'1'],[2,'2'],[3,'3']].map(function(x){var cur=Math.min(3,Math.max(0,S.settings.topN!=null?S.settings.topN:3));return '<button data-act="set-topn" data-v="'+x[0]+'" class="'+(cur===x[0]?'on':'')+'">'+x[1]+'</button>';}).join('')+'</div></div>'+
      topOrderHTML()+
      '<div class="setrow"><span>달력 D-day 표시</span><div class="seg" style="margin:0"><button data-act="set-caldd" data-v="icon" class="'+((S.settings.calDday||'icon')==='icon'?'on':'')+'">종류 아이콘</button><button data-act="set-caldd" data-v="text" class="'+((S.settings.calDday||'icon')==='text'?'on':'')+'">D-숫자</button></div></div>'+
      '<div class="setrow"><span>월간 표시 항목<small>체크한 항목만 월간 달력에 보여요</small></span></div><div class="monthopts">'+[['appointment','약속'],['dday','D-day'],['exam','시험'],['event','일정'],['todo','할 일']].map(function(x){return '<label class="monthopt"><input type="checkbox" data-month-item="'+x[0]+'"'+(monthItemOn(x[0])?' checked':'')+'>'+x[1]+'</label>';}).join('')+'</div>'+
      '<div class="setrow"><span>주간 화면에 주말 표시</span><button class="tbtn" data-act="toggle-weekend">'+(S.settings.weekend?'켜짐':'꺼짐')+'</button></div>'+
    '</div></details>'+
  '</section>';
  var acct='';
  if(Sync.kind!=='supa'&&Sync.diag){
    acct='<section class="card warn"><div class="card-h"><h3>계정</h3></div><div class="setrow"><span>로그인을 쓸 수 없어요<small>'+esc(Sync.diag)+'</small></span></div></section>';
  }
  if(Sync.kind==='supa'){
    acct='<section class="card"><div class="card-h"><h3>계정</h3></div>'+(Sync.uid?
      '<div class="setrow"><span>로그인됨<small>'+esc(Sync.email)+'</small></span></div>'+
      '<div class="setrow"><span>다른 아이디로 로그인</span><button class="tbtn" data-act="switch-account">바꾸기</button></div>'+
      '<div class="setrow"><span>로그아웃</span><button class="tbtn" data-act="logout">로그아웃</button></div>'+
      '<div class="setrow danger-row"><span>계정 삭제<small>계정과 서버의 플래너 데이터를 영구 삭제해요</small></span><button class="tbtn" data-act="delete-account-open">삭제</button></div>'
      :'<div class="setrow"><span>로그인<small>로그인하면 기기끼리 맞춰져요</small></span><button class="tbtn" data-act="open-login">로그인</button></div>')+'</section>';
  }
  var syncTxt=(Sync.uid&&SyncUI.state==='error')?'지금 계정 동기화가 멈춰 있어요 (이 기기엔 저장됨)':Sync.on?'다른 기기와 자동으로 맞춰져요':(storageOK?'이 기기에만 저장돼요':'저장이 막혀 있어서 새로고침하면 사라져요');
  var dataHTML='<section class="card"><div class="card-h"><h3>데이터</h3></div>'+
    '<div class="setrow"><span>저장 상태<small>'+esc(syncTrustText())+'</small></span></div>'+
    '<div class="setrow"><span>백업·복원</span><button class="tbtn" data-act="backup">열기</button></div>'+
    (Sync.uid?'<div class="setrow"><span>계정 자동 복구<small>같은 이메일 계정으로 로그인하면 다른 기기에서도 자동으로 불러와요</small></span><b style="font-size:12px;color:var(--sub)">켜짐</b></div>':'')+
    '<div class="setrow"><span>'+esc(plannerModeMeta().schedule)+' 비우기<small>'+esc(blockWord)+'·고정 일정이 모두 지워져요</small></span><button class="tbtn" data-act="reset-classes">비우기</button></div></section>';
  var lastChat=S.selfchat.length?S.selfchat[S.selfchat.length-1]:null;
  var chatHTML='<section class="card"><button class="setrow chatrow" data-act="open-chat"><span>나와의 채팅<small>'+(lastChat?esc((lastChat.text||'사진').slice(0,30)):'떠오른 생각, 링크, 메모를 나한테 보내요')+'</small></span><span class="chev">›</span></button></section>';
  var diaryShortcut='<section class="card diary-settings-card"><button class="setrow diary-library-shortcut" data-act="open-diary-library"><span>일기장<small>과거는 읽기 · 오늘은 쓰기 · 미래는 잠금</small></span><span class="chev">›</span></button>'+
      '<div class="setrow"><span>오늘의 일기 시간<small>일기 버튼과 타이머에 바로 반영돼요</small></span><div class="seg" style="margin:0">'+[5,10,20,30].map(function(n){return '<button data-act="set-diary-minutes" data-v="'+n+'" class="'+(diaryMinutes()===n?'on':'')+'">'+n+'분</button>';}).join('')+'</div></div></section>';
  /* 설정 첫 화면은 메뉴만 보여주고, 복잡한 내용은 각각 별도 화면에서 열어요. */
  var settingsPage=U.settingsPage||'';
  var back='';
  if(settingsPage==='profile')return back+profileHTML();
  if(settingsPage==='friends')return back+friendHTML();
  if(settingsPage==='friend-detail')return friendDetailHTML(U.friendDetailId);
  if(settingsPage==='school')return back+schoolHTML+linkHTML;
  if(settingsPage==='life')return back+logPrefHTML;
  if(settingsPage==='screen')return back+viewHTML;
  if(settingsPage==='recipes')return back+recipeBookHTML();
  if(settingsPage==='account')return back+acct+syncHTML+dataHTML+supportHTML;
  if(settingsPage==='data')return back+acct+syncHTML+dataHTML+supportHTML;
  if(settingsPage==='support')return back+acct+syncHTML+dataHTML+supportHTML;
  function navRow(act,title,sub){return '<button class="setrow chatrow" data-act="'+act+'"><span>'+title+(sub?'<small>'+sub+'</small>':'')+'</span><span class="chev">›</span></button>';}
  var modeCard='<section class="card"><button class="setrow chatrow" data-act="open-mode-switch"><span>플래너 유형<small>'+esc(plannerModeMeta().label)+' · 유형별 기록은 따로 보관돼요</small></span><span class="chev">›</span></button></section>';
  var main=modeCard+chatHTML+diaryShortcut+
    '<section class="card">'+
      navRow('settings-profile','내 프로필','사진 · 친구에게 보일 이름 · 출발 지역')+
    '</section>'+
    '<section class="card">'+
      navRow('settings-school','학교 · 바로가기','학교 등록 · 캠퍼스 · 학교 링크')+
      navRow('settings-life','홈 · 기록','홈 구성 · 생활 기록 · 일기 · 회고')+
      navRow('settings-screen','화면 · 알림','테마 · 배경 · 달력 · 알림')+
      navRow('settings-recipes','레시피 노트','준비물 · 만드는 법 · 자주 쓰는 조합')+
    '</section>'+
    '<section class="card">'+
      navRow('settings-account','계정',syncTrustText())+
    '</section>';
  return main;
}
function openLink(l){
  var x=l||{name:'',url:''};
  M={type:'link',id:l?l.id:null};
  openModal('<h3>'+(l?'바로가기 수정':'바로가기 추가')+'</h3>'+
    '<input class="fld" id="f-lname" placeholder="이름 (예: 캠퍼스 셔틀)" maxlength="30" value="'+esc(x.name)+'">'+
    '<input class="fld" id="f-lurl" type="url" inputmode="url" autocapitalize="off" placeholder="주소 (https://...)" value="'+esc(x.url)+'">'+
    '<div class="acts">'+(l?'<button class="b-del" data-act="del-link">삭제</button>':'')+'<button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="save-link">저장</button></div>');
  if(!l)setTimeout(function(){var f=$('#f-lname');if(f)f.focus();},50);
}
function saveLink(){
  var n=$('#f-lname').value.trim(),u=$('#f-lurl').value.trim();
  if(!n){bad('#f-lname');return;}
  if(!u){bad('#f-lurl');return;}
  if(!/^https?:\/\//i.test(u))u='https://'+u;
  if(M.id){var l=S.settings.links.find(function(x){return x.id===M.id;});if(l){l.name=n;l.url=u;l.schoolLink=false;}}
  else S.settings.links.push({id:uid(),name:n,url:u,schoolLink:false});
  save();closeModal();render();
}
function topOrderHTML(){
  var items=topItems();
  if(items.length<2)return '';
  return '<div class="top-order-settings"><div class="setrow"><span><b>맨 위 표시 순서</b><small>홈·일간·주간에서는 순서를 바꿀 수 없고 여기서만 설정해요</small></span></div>'+items.map(function(x,i){
    return '<div class="setrow"><span>'+esc(x.title)+'<small>'+esc(x.sub)+'</small></span><div class="seg" style="margin:0"><button data-act="top-up" data-id="'+x.id+'"'+(i===0?' disabled':'')+'>↑</button><button data-act="top-down" data-id="'+x.id+'"'+(i===items.length-1?' disabled':'')+'>↓</button></div></div>';
  }).join('')+'</div>';
}
function moveTopItem(id,dir){
  var ids=topItems().map(function(x){return x.id;}),i=ids.indexOf(id),j=i+dir;
  if(i<0||j<0||j>=ids.length)return;
  var t=ids[i];ids[i]=ids[j];ids[j]=t;S.settings.topOrder=ids;save();render();
}
function profileHTML(){
  if(!Sync.uid)return '<section class="card"><div class="card-h"><h3>프로필</h3></div><p class="hint">로그인하면 친구에게 보일 이름과 사진을 설정할 수 있어요.</p></section>';
  var n=(S.settings.profileName||'').trim(),photo=S.settings.profilePhoto||'',home=(S.settings.homeStation||'').trim(),initial=(n||'?').charAt(0);
  return '<section class="card"><div class="card-h"><h3>프로필</h3><span class="cnt">친구에게 표시</span></div>'+
    '<div class="profile-photo-row"><div class="profile-photo">'+(photo?'<img src="'+esc(photo)+'" alt="프로필 사진">':esc(initial))+'</div><div class="profile-photo-actions"><label class="tbtn" style="display:grid;place-items:center;padding:0 12px">사진 선택<input type="file" accept="image/*" data-profile-photo hidden></label>'+(photo?'<button class="tbtn" data-act="profile-photo-remove">사진 삭제</button>':'')+'</div></div>'+
    '<div class="setrow"><span>친구에게 보일 이름<small>초대코드는 그대로 두고, 친구 화면에는 이 이름과 사진이 보여요.</small></span></div>'+
    '<div class="row"><input class="fld" style="margin:0" id="f-profile-name" maxlength="20" placeholder="이름 또는 별명" value="'+esc(n)+'"><button class="b-save" style="height:44px;padding:0 14px" data-act="save-profile-name">이름 저장</button></div>'+
    '<div id="profile-name-status" class="hint" style="margin-top:-4px">'+(n?'저장됨 ✓':'아직 저장된 이름이 없어요')+'</div>'+
    '<div class="setrow"><span>현재 위치 사용<small>현재 위치를 가까운 교통 거점으로 바꿀 때만 사용하고 좌표는 저장하지 않아요. 계정별 동의 상태만 서버에 저장해요.</small></span><button class="tbtn'+(locationPermissionOn()?' on':'')+'" data-act="toggle-location-permission">'+(locationPermissionOn()?'켜짐':'꺼짐')+'</button></div>'+
    '<div class="setrow"><span>기본 출발지<small>약속 장소 추천과 시간별 출발지의 기본값으로 사용해요.</small></span></div>'+
    '<input class="fld" id="f-home-station" list="origin-suggestions" autocomplete="off" placeholder="예: 성균관대역, 낙성대역, 학교" value="'+esc(home)+'">'+originDatalist()+
    '<div class="geo-row"><button class="tbtn" data-act="home-current">현재 위치에서 찾기</button><small id="home-geo-msg">자동 저장하지 않고 가까운 역 후보를 보여줘요.</small></div><div class="geo-cands" id="home-geo-cands"></div>'+
    '<div class="acts" style="margin-top:8px"><button class="b-save" data-act="save-home-station">저장</button>'+(home?'<button class="b-ghost" data-act="clear-home-station">초기화</button>':'')+'</div>'+
    '<div class="origin-grid-box '+(U.originGridOpen?'open':'')+'"><button type="button" class="origin-grid-toggle" data-act="origin-grid-toggle"><span><b>시간별 출발지</b><small>요일을 고르고 1시간 칸을 눌러 수정해요</small></span><span class="chev">›</span></button>'+(U.originGridOpen?originGridHTML():'')+'</div>'+
    '<div id="home-station-status" class="hint" style="margin-top:8px">'+(home?'기본 출발지 · '+esc(home):'기본 출발 지역 없음')+'</div></section>';
}
function syncProfileToCodes(){
  var sb=friendDb();if(!sb)return Promise.resolve();
  var name=(S.settings.profileName||'').trim(),photo=S.settings.profilePhoto||'';
  return sb.from('planner_friend_codes').update({display_name:name,photo:photo,updated_at:new Date().toISOString()}).eq('user_id',Sync.uid).then(function(r){
    if(r.error&&/photo|updated_at|column|schema cache/i.test(r.error.message||''))return sb.from('planner_friend_codes').update({display_name:name}).eq('user_id',Sync.uid);
    return r;
  });
}
function setProfileSavedStatus(sel,msg){var el=$(sel);if(el)el.textContent=msg;}
function saveProfileName(){
  var el=$('#f-profile-name'),name=el?el.value.trim().slice(0,20):'';
  S.settings.profileName=name;save();
  setProfileSavedStatus('#profile-name-status',name?'저장됨 ✓ · '+name:'이름을 비워 저장했어요 ✓');
  inAppToast(name?'이름을 저장했어요':'이름을 비워 저장했어요');
  if(!friendDb())return;
  syncProfileToCodes().then(function(r){
    if(r&&r.error&&/display_name|column|schema cache/i.test(r.error.message||'')){friendNote(userMsg('이 기기에는 저장했어요. 친구에게 보이는 이름은 잠시 뒤 다시 저장해주세요.','이 기기에는 저장했어요. 친구에게 이름을 보이려면 planner-friends.sql을 한 번 실행해주세요.'));return;}
    return friendPush().then(function(){return friendLoad();});
  }).catch(function(){friendNote('이름은 저장했지만 친구 동기화를 다시 확인해주세요');});
}
function saveHomeStation(){
  var hs=$('#f-home-station'),v=hs?hs.value.trim():'';
  S.settings.homeStation=v;save();
  setProfileSavedStatus('#home-station-status',v?'기본 출발지 · '+v:'기본 출발 지역 없음');
  inAppToast('출발 지역 설정을 저장했어요');
  if(typeof friendPush==='function')friendPush().catch(function(){});
}
function clearHomeStation(){
  S.settings.homeStation='';var hs=$('#f-home-station');if(hs)hs.value='';save();
  setProfileSavedStatus('#home-station-status','저장된 출발 지역 없음');
  var msg=$('#home-geo-msg');if(msg)msg.textContent='출발 지역을 초기화했어요.';
  inAppToast('출발 지역을 초기화했어요');
  if(typeof friendPush==='function')friendPush().catch(function(){});
  render();
}
function saveProfile(){saveProfileName();saveHomeStation();}
function setProfilePhoto(file){
  if(!file)return;
  var fr=new FileReader();
  fr.onload=function(){
    var img=new Image();
    img.onload=function(){openProfileCrop(img);};
    img.onerror=function(){friendNote('사진을 읽지 못했어요');};
    img.src=fr.result;
  };
  fr.onerror=function(){friendNote('사진을 읽지 못했어요');};
  fr.readAsDataURL(file);
}
function openProfileCrop(img){
  M={type:'profile-crop',cropImg:img,cropX:0,cropY:0,cropScale:1,cropBase:1,cropDrag:null};
  openModal('<h3>프로필 사진 맞추기</h3><div class="profile-crop-wrap"><div class="profile-crop-box" id="profile-crop-box"><img id="profile-crop-img" alt="프로필 사진 미리보기"><i class="profile-crop-ring"></i></div></div><div class="crop-help">사진을 움직이고 확대해서 동그라미 안에 맞춰주세요</div><div class="crop-zoom"><span>−</span><input id="profile-crop-zoom" type="range" min="1" max="3" step="0.01" value="1"><span>＋</span></div><div class="acts"><button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="profile-crop-save">이대로 사용</button></div>');
  requestAnimationFrame(function(){
    var box=$('#profile-crop-box'),el=$('#profile-crop-img');if(!box||!el)return;
    var z=box.clientWidth,base=Math.max(z/img.width,z/img.height);M.cropBase=base;M.cropScale=1;
    M.cropX=(z-img.width*base)/2;M.cropY=(z-img.height*base)/2;el.src=img.src;drawProfileCrop();
  });
}
function drawProfileCrop(){
  if(M.type!=='profile-crop')return;var box=$('#profile-crop-box'),el=$('#profile-crop-img');if(!box||!el||!M.cropImg)return;
  var sc=M.cropBase*M.cropScale,w=M.cropImg.width*sc,h=M.cropImg.height*sc,z=box.clientWidth;
  M.cropX=Math.min(0,Math.max(z-w,M.cropX));M.cropY=Math.min(0,Math.max(z-h,M.cropY));
  el.style.width=w+'px';el.style.height=h+'px';el.style.transform='translate('+M.cropX+'px,'+M.cropY+'px)';
}
function saveProfileCrop(){
  if(M.type!=='profile-crop'||!M.cropImg)return;var box=$('#profile-crop-box'),z=box?box.clientWidth:300,sc=M.cropBase*M.cropScale,c=document.createElement('canvas');c.width=256;c.height=256;var ctx=c.getContext('2d'),k=256/z;
  ctx.drawImage(M.cropImg,M.cropX*-1/sc,M.cropY*-1/sc,z/sc,z/sc,0,0,256,256);
  var url=null;try{url=c.toDataURL('image/jpeg',0.82);}catch(e){}
  if(!url){friendNote('사진을 저장하지 못했어요');return;}
  S.settings.profilePhoto=url;save();closeModal();render();
  Promise.all([friendPush(),syncProfileToCodes()]).then(function(){friendNote('프로필 사진을 저장했어요');render();},function(){friendNote('사진은 이 기기에 저장했어요');render();});
}
function shrinkProfileImage(file,cb){shrinkTo(file,256,.72,cb);}
function softRender(){var ae=document.activeElement;if(!M.type&&!(ae&&/INPUT|TEXTAREA|SELECT/.test(ae.tagName)))render();}
function memoryNudgeHTML(){return '';}
/* ---------- 친구 요청·약속 알림 (앱이 백그라운드에 있을 때 시스템 알림) ---------- */
function inAppToast(t,ms){var el=document.getElementById('app-toast');if(!el){el=document.createElement('div');el.id='app-toast';el.setAttribute('role','status');document.body.appendChild(el);}el.textContent=t;el.classList.add('on');clearTimeout(inAppToast.t);inAppToast.t=setTimeout(function(){el.classList.remove('on');},Number(ms)||3500);}
function notifySupported(){return 'Notification' in window;}
function friendNotifyOn(){return !!S.settings.friendNotify&&notifySupported()&&Notification.permission==='granted';}
function sysNotify(title,body,tag){
  if(!friendNotifyOn()||!document.hidden)return;
  var opt={body:body,tag:tag,icon:'icon-512.png',badge:'icon-512.png'};
  var plain=function(){try{var n=new Notification(title,opt);n.onclick=function(){try{window.focus();}catch(e){}n.close();};}catch(e){}};
  try{if(navigator.serviceWorker&&navigator.serviceWorker.getRegistration)navigator.serviceWorker.getRegistration().then(function(r){if(r&&r.showNotification)r.showNotification(title,opt).catch(plain);else plain();}).catch(plain);else plain();}catch(e){plain();}
}
function friendNotifyScan(){
  var seen=FriendSync.notified||(FriendSync.notified={}),first=!FriendSync.notifyReady,items=[];
  (FriendSync.invitesIn||[]).forEach(function(x){if(!FriendSync.inviteNames[x.from_user])return;items.push(['inv:'+x.id,'새 친구 요청',inviteName(x.from_user)+'님이 친구 연결을 요청했어요']);});
  var whenOf=function(p){return p.date?slotText(p.date,p.start?toMin(p.start):null,p.start?(p.end?toMin(p.end):toMin(p.start)+60):null):'';};
  (FriendSync.requests||[]).forEach(function(r){var p=r.payload||{},when=whenOf(p);
    if(r.to_user===Sync.uid&&r.status==='pending')items.push(['req:'+r.id,'새 약속 요청',requestFriendCode(r.from_user)+'님 · '+(p.what||p.place||'약속')+(when?' · '+when:'')]);});
  /* 내가 보낸 요청이 대기 목록에서 빠지면: 공유 약속이 생겼으면 수락, 역제안이 왔으면 넘어가고, 아니면 거절 */
  (FriendSync.shared||[]).forEach(function(r){var p=r.payload||{},who=requestFriendCode(sharedFriendOf(r));
    if(p.place&&p.placeConfirmedBy&&p.placeConfirmedBy!==Sync.uid)items.push(['plc:'+r.request_id+':'+p.place,'장소가 정해졌어요',who+'님과 약속 장소가 '+euro(p.place)+' 정해졌어요',p.date]);
    else if(!p.place&&p.candidateBy&&p.candidateBy!==Sync.uid)items.push(['cand:'+r.request_id+':'+p.candidateAt,'장소 후보를 골랐어요',who+'님이 장소 후보를 골랐어요. 알림에서 같이 정해요',p.date]);
    var fb=p.feedback||{},fid=sharedFriendOf(r);if(fb[fid]==='yes'&&fb[Sync.uid]!=='yes'&&!fb[Sync.uid])items.push(['fb:'+r.request_id,'약속 어땠어?',who+'님은 재밌었대요. 나도 답하면 추억으로 기록돼요',p.date]);});
  var nowOut={};(FriendSync.requests||[]).forEach(function(r){if(r.from_user===Sync.uid&&r.status==='pending')nowOut[r.id]=r;});
  var prev=FriendSync.prevOut||{};
  Object.keys(prev).forEach(function(id){if(nowOut[id])return;var r=prev[id],p=r.payload||{},when=whenOf(p),who=requestFriendCode(r.to_user);
    if((FriendSync.shared||[]).some(function(x){return x.request_id===id;}))items.push(['ok:'+id,'약속이 확정됐어요',who+'님이 '+(when||'약속')+' 약속을 수락했어요']);
    else if((FriendSync.requests||[]).some(function(x){return x.payload&&x.payload.counterOf===id;}))return;
    else items.push(['no:'+id,'약속 요청 결과',who+'님이 '+(when||'그 시간')+'은 어렵대요']);});
  FriendSync.prevOut=nowOut;
  items.forEach(function(it){if(seen[it[0]])return;seen[it[0]]=1;if(first)return;var res=/^(ok|no):/.test(it[0]);if(res){var rq=prev[it[0].slice(3)];pushNotice(it[0].slice(0,2),it[2],rq&&rq.payload&&rq.payload.date);}else if(it.length>3){pushNotice('ok',it[2],it[3]);res=true;}if(document.hidden)sysNotify(it[1],it[2],it[0]);else if(res&&M.type!=='notices')inAppToast(it[2]);});
  if(M.type==='notices')drawNotices();else{var tb=$('#top');if(tb&&typeof topHTML==='function')tb.innerHTML=topHTML();}
  FriendSync.notifyReady=true;
}
function friendNotifyToggle(){
  if(S.settings.friendNotify){S.settings.friendNotify=false;save();friendNote('친구 알림을 껐어요');return;}
  if(!notifySupported()){friendNote('이 브라우저는 알림을 지원하지 않아요. 아이폰은 사파리에서 공유 → 홈 화면에 추가한 뒤 그 앱에서 켜주세요');return;}
  Notification.requestPermission().then(function(pm){
    if(pm==='granted'){S.settings.friendNotify=true;save();friendNote('알림을 켰어요. 앱을 닫지 않고 다른 화면에 있을 때도 알려줘요');registerSW();}
    else{S.settings.friendNotify=false;save();friendNote(pm==='denied'?'알림이 막혀 있어요. 브라우저(또는 아이폰 설정 → 알림)에서 이 사이트 알림을 허용해주세요':'알림 허용을 선택하지 않았어요');}
  }).catch(function(){friendNote('알림 권한을 요청하지 못했어요');});
}
function registerSW(){try{if(navigator.serviceWorker&&location.protocol==='https:')navigator.serviceWorker.register('sw.js?v=20260925-1641',{updateViaCache:'none'}).then(function(r){try{r.update();}catch(e){}}).catch(function(){});}catch(e){}}
function friendNotifyNudgeHTML(){
  if(S.settings.friendNotify||!notifySupported()||Notification.permission==='denied'||S.settings.friendNotifyAsked)return '';
  if(!FriendSync.friends.length&&!(FriendSync.invitesOut||[]).length)return '';
  return '<div class="fcard req"><div class="fc-top"><span class="fav fav-ic">'+ICO.bell+'</span><div class="fc-name"><b>친구 요청·약속 알림 받기</b><small>누르면 알림 허용 창이 떠요</small></div><button class="tbtn" data-act="friend-notify-later">나중에</button><button class="tbtn b-save" data-act="friend-notify">켜기</button></div></div>';
}
var ICO={"bell": "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3.2v1.3\"/><path d=\"M6.3 16.5V11a5.7 5.7 0 0 1 11.4 0v5.5l1.6 2H4.7z\"/><path d=\"M10 20.6a2.1 2.1 0 0 0 4 0\"/></svg>", "check": "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m5.5 12.5 4.2 4.2 8.8-9.4\"/></svg>", "x": "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 7l10 10M17 7 7 17\"/></svg>", "friend": "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"9\" cy=\"8.5\" r=\"3.2\"/><path d=\"M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5\"/><circle cx=\"16.8\" cy=\"9.3\" r=\"2.6\"/><path d=\"M16.2 14.6c2.4.1 4 1.7 4.4 4.4\"/></svg>"};
function noticeLog(){if(!Array.isArray(S.settings.notices))S.settings.notices=[];return S.settings.notices;}
function pushNotice(kind,text,date){var L=noticeLog();L.unshift({id:uid(),kind:kind,text:text,date:date||null,at:Date.now(),read:false});if(L.length>30)L.length=30;save();}
function noticeUnread(){return noticeLog().filter(function(n){return !n.read;}).length;}
function bellBtnHTML(){
  if(!Sync.uid)return '';
  var n=friendAlertCount()+noticeUnread();
  return '<button class="ibtn bell" data-act="open-notices" aria-label="알림'+(n?' '+n+'개':'')+'">'+ICO.bell+(n?'<span class="badge">'+(n>9?'9+':n)+'</span>':'')+'</button>';
}
function agoText(t){var m=Math.floor((Date.now()-t)/60000);if(m<1)return '방금';if(m<60)return m+'분 전';var h=Math.floor(m/60);if(h<24)return h+'시간 전';var d=Math.floor(h/24);return d<7?d+'일 전':new Date(t).getMonth()+1+'/'+new Date(t).getDate();}
function openNotices(){M={type:'notices'};drawNotices();}
function drawNotices(){
  if(M.type!=='notices')return;
  var todo='',inv=(FriendSync.invitesIn||[]),req=(FriendSync.requests||[]).filter(function(r){return r.to_user===Sync.uid&&r.status==='pending';});
  inv.forEach(function(x){var n=inviteName(x.from_user);todo+='<div class="ntc">'+friendAvatar(n,invitePhoto(x.from_user))+'<div class="fc-name"><b>'+esc(n)+'</b><small>친구 연결을 요청했어요</small></div><button class="tbtn" data-act="friend-invite-decline" data-id="'+x.id+'">거절</button><button class="tbtn b-save" data-act="friend-invite-accept" data-id="'+x.id+'">수락</button></div>';});
  req.forEach(function(r){var p=r.payload||{},n=requestFriendCode(r.from_user),f=FriendSync.friends.find(function(y){return y.id===r.from_user;});todo+='<div class="ntc">'+friendAvatar(n,f&&f.photo,'',f&&f.id)+'<div class="fc-name"><b>'+esc(n)+' · 약속 요청</b><small>'+esc([p.what,p.date?slotText(p.date,p.start?toMin(p.start):null,p.start?(p.end?toMin(p.end):toMin(p.start)+60):null):'시간 미정',p.place||'장소 미정'].filter(Boolean).join(' · '))+'</small></div><button class="tbtn b-save" data-act="appointment-open" data-id="'+r.id+'">확인</button></div>';});
  upcomingPlaceDecisions().forEach(function(r){var p=r.payload||{},fid=sharedFriendOf(r),n=requestFriendCode(fid),f=FriendSync.friends.find(function(y){return y.id===fid;});todo+='<div class="ntc">'+friendAvatar(n,f&&f.photo,'',f&&f.id)+'<div class="fc-name"><b>'+esc(n)+'님과 장소 정하기</b><small>'+esc((p.date?mdTxt(parseKey(p.date))+' 약속 · ':'')+'후보 '+cleanCandidates(p.placeCandidates).length+'곳')+'</small></div><button class="tbtn b-save" data-act="place-decide-open" data-id="'+esc(r.request_id)+'">고르기</button></div>';});
  LinkSync.links.filter(function(l){return l.status==='open'&&(LinkSync.answers[l.token]||[]).length;}).forEach(function(l){var an=LinkSync.answers[l.token];todo+='<div class="ntc"><span class="fav fav-ic">'+ICO.friend+'</span><div class="fc-name"><b>'+esc((l.payload||{}).what||'링크 약속')+' · '+an.length+'명 답함</b><small>'+esc(an.map(function(a){return a.name;}).join(', '))+'</small></div><button class="tbtn b-save" data-act="lk-detail" data-id="'+l.token+'">시간 정하기</button></div>';});
  var pm=pendingPostMeets().map(function(r){return postMeetRowHTML(r,true);}).join('');
  var L=noticeLog(),log=L.map(function(n){var ic=n.kind==='ok'?ICO.check:n.kind==='no'?ICO.x:n.kind==='friend'?ICO.friend:ICO.bell;return '<div class="ntc'+(n.read?'':' unread')+'"><span class="fav fav-ic k-'+esc(n.kind)+'">'+ic+'</span><div class="fc-name"><b>'+esc(n.text)+'</b><small>'+agoText(n.at)+'</small></div>'+(n.date?'<button class="tbtn" data-act="notice-go" data-v="'+esc(n.date)+'">보기</button>':'')+'</div>';}).join('');
  var sysRow=notifySupported()&&Notification.permission!=='denied'?'<div class="setrow" style="margin-top:12px"><span>휴대폰 알림으로도 받기<small>앱을 닫지 않고 다른 화면에 있을 때 알려줘요</small></span><button class="tbtn'+(friendNotifyOn()?' on':'')+'" data-act="friend-notify">'+(friendNotifyOn()?'켜짐':'켜기')+'</button></div>':'';
  openModal('<h3>알림</h3>'+
    (todo?'<div class="ntc-sec">확인이 필요해요</div>'+todo:'')+
    (pm?'<div class="ntc-sec">약속 어땠어?</div>'+pm:'')+
    (log?'<div class="ntc-sec">최근 소식</div>'+log:'')+
    (!todo&&!log&&!pm?'<div class="empty" style="padding:24px 0;text-align:center">새 알림이 없어요<br><small>친구 요청·약속 요청·장소 정하기·약속 결과가 여기에 모여요</small></div>':'')+
    sysRow+'<p class="hint" id="invite-msg"></p><div class="acts">'+(log?'<button class="b-ghost" data-act="notice-clear">기록 지우기</button>':'')+'<button class="b-save" data-act="close">닫기</button></div>');
  var ch=false;L.forEach(function(n){if(!n.read){n.read=true;ch=true;}});if(ch){save();var tb=$('#top');if(tb&&typeof topHTML==='function')tb.innerHTML=topHTML();}
}
function friendAlertCount(){if(typeof FriendSync==='undefined'||!Sync.uid)return 0;return (FriendSync.invitesIn||[]).length+(FriendSync.requests||[]).filter(function(r){return r.to_user===Sync.uid&&r.status==='pending';}).length+upcomingPlaceDecisions().length+pendingPostMeets().length+linkOpenAnswersCount();}
function friendAvatar(t,photo,size,fid){var c=String(t||'?').trim().charAt(0)||'?';var mbf='';try{mbf=fid&&window.PLANON_MB_SOCIAL?window.PLANON_MB_SOCIAL.friendAvatarHTML(fid):'';}catch(e){}if(mbf)return '<span class="fav fav-mb'+(size?' fav-'+size:'')+'">'+mbf+'</span>';return '<span class="fav'+(size?' fav-'+size:'')+'">'+(photo?'<img src="'+esc(photo)+'" alt="">':esc(c))+'</span>';}
function invitePhoto(id){return (FriendSync.invitePhotos||{})[id]||'';}
function blockedUserIds(){return Array.isArray(S.settings.blockedUsers)?S.settings.blockedUsers:[];}
function isBlockedUser(id){return !!id&&blockedUserIds().indexOf(id)>=0;}
function rememberBlockedUser(id,name){if(!id)return;var a=blockedUserIds().slice();if(a.indexOf(id)<0)a.push(id);S.settings.blockedUsers=a;if(!S.settings.blockedUserNames||typeof S.settings.blockedUserNames!=='object')S.settings.blockedUserNames={};if(name)S.settings.blockedUserNames[id]=name;save();}
function forgetBlockedUser(id){S.settings.blockedUsers=blockedUserIds().filter(function(x){return x!==id;});if(S.settings.blockedUserNames)delete S.settings.blockedUserNames[id];save();}

function openFriendSharePreview(id){
  var f=FriendSync.friends.find(function(x){return x.id===id;});if(!f)return;
  var n=(S.settings.profileName||'').trim()||myDisplayName();
  var html='<h3>'+esc(friendLabel(f))+'님에게 보이는 내 화면</h3><p class="hint">공개할 항목을 눌러 켜거나 끌 수 있어요. 모두 끄면 프로필만 보여요.</p>'+
    '<div class="fc-share" style="margin:0 0 10px"><span>공개 범위</span><button class="chipt'+(f.outTimetable?' on':'')+'" data-act="friend-toggle-share" data-id="'+esc(id)+'" data-mode="timetable">시간표</button><button class="chipt'+(f.outExams?' on':'')+'" data-act="friend-toggle-share" data-id="'+esc(id)+'" data-mode="exams">시험</button><button class="chipt'+(f.outCalendar?' on':'')+'" data-act="friend-toggle-share" data-id="'+esc(id)+'" data-mode="calendar">일정</button><button class="chipt'+(f.outPlanner?' on':'')+'" data-act="friend-toggle-share" data-id="'+esc(id)+'" data-mode="planner">플래너</button></div>'+
    '<div class="share-preview">'+friendViewHTML({name:n,photo:S.settings.profilePhoto||'',sub:'친구 화면 미리보기',tt:f.outTimetable?friendPayload('timetable'):null,exams:f.outExams?friendPayload('exam'):null,cal:f.outCalendar?friendPayload('calendar'):null})+
    '<div class="share-preview-private">항상 비공개 · 메모 · 나와의 채팅 · 생활 기록 · 회고 · 사진</div></div>'+
    '<div class="acts"><button class="b-ghost" data-act="close">닫기</button></div>';
  M={type:'friend-share-preview',friendId:id};openModal(html);
}
function openFriendManage(id){
  var f=FriendSync.friends.find(function(x){return x.id===id;});if(!f)return;
  M={type:'friend-manage',friendId:id};
  openModal('<h3>'+esc(friendLabel(f))+'님 관리</h3>'+
    '<button class="setrow chatrow" data-act="friend-report" data-id="'+esc(id)+'"><span>신고하기</span><span class="chev">›</span></button>'+
    '<button class="setrow chatrow danger-row" data-act="friend-block" data-id="'+esc(id)+'"><span>차단</span><span class="chev">›</span></button>'+
    '<button class="setrow chatrow danger-row" data-act="friend-remove" data-id="'+esc(id)+'"><span>친구 연결 해제</span><span class="chev">›</span></button>'+
    '<div class="acts"><button class="b-ghost" data-act="close">닫기</button></div>');
}
function friendDetailHTML(id){
  var f=FriendSync.friends.find(function(x){return x.id===id;});
  if(!f)return '<section class="card"><div class="empty">친구를 찾을 수 없어요.</div></section>';
  var n=friendLabel(f),pinned=friendPinIndex(f.id)>=0;
  return '<section class="card friend-detail-card"><div class="fc-top">'+friendAvatar(n,f.photo,'lg',f.id)+'<div class="fc-name"><b>'+esc(n)+'</b><small>'+esc(lastMetInfo(f.id))+' · 추억 '+friendMemoryRows(f.id).length+'개</small></div><button class="tbtn fc-pin'+(pinned?' on':'')+'" data-act="friend-pin" data-id="'+f.id+'">'+(pinned?'★':'☆')+'</button></div>'+ 
    '<div class="friend-detail-actions"><button class="b-save friend-meet-main" data-act="friend-meet" data-id="'+f.id+'">약속 잡기</button><button class="tbtn" data-act="friend-view-planner" data-id="'+f.id+'">플래너</button><button class="tbtn cheer-entry" data-act="cheer-open" data-id="'+f.id+'">'+cheerIconHTML('button')+'<span>응원 쪽지</span></button><button class="tbtn" data-act="friend-memories" data-id="'+f.id+'">추억</button></div>'+ 
    '<div class="friend-quick-settings"><button data-act="friend-share-preview" data-id="'+f.id+'">공개 설정 <span>›</span></button><button data-act="friend-manage" data-id="'+f.id+'">친구 관리 <span>›</span></button></div></section>'+cheerStatusHTML(f.id);
}
function friendHTML(){
  var storyTop=(window.PLANON_DAY_STORY&&typeof window.PLANON_DAY_STORY.friendStripHTML==='function')?window.PLANON_DAY_STORY.friendStripHTML():'';
  if(!Sync.uid)return storyTop+'<section class="card"><div class="card-h"><h3>친구랑 약속 잡기</h3></div>'+
    '<div class="setrow"><span>1. 초대코드로 친구 연결<small>상대가 수락해야 연결돼요</small></span></div>'+
    '<div class="setrow"><span>2. 둘 다 비는 시간만 골라서 약속<small>시간표 기준으로 바쁜 칸은 회색이에요 · 앱 없는 친구는 링크로</small></span></div>'+
    '<div class="setrow"><span>3. 만나고 나면 추억으로 쌓여요<small>만난 곳·사진이 모여 추억 리포트가 돼요</small></span></div>'+
    '<p class="hint">메모·나와의 채팅·생활기록·회고·사진은 언제나 비공개예요.</p><button class="tbtn plus" style="width:100%;height:42px;margin-top:4px" data-act="open-login">로그인하고 시작하기</button></section>';
  var myCode=FriendSync.code||storedFriendCode()||'생성 중';
  var invIn=(FriendSync.invitesIn||[]).map(function(x){var n=inviteName(x.from_user);return '<div class="fcard req"><div class="fc-top">'+friendAvatar(n,invitePhoto(x.from_user))+'<div class="fc-name"><b>'+esc(n)+'</b><small>친구 요청을 보냈어요</small></div><button class="tbtn" data-act="friend-invite-decline" data-id="'+x.id+'">거절</button><button class="tbtn fc-pri b-save" data-act="friend-invite-accept" data-id="'+x.id+'">수락</button></div></div>';}).join('');
  var reqIn=(FriendSync.requests||[]).filter(function(r){return r.to_user===Sync.uid&&r.status==='pending';}).map(function(r){var p=r.payload||{},n=requestFriendCode(r.from_user),rf=FriendSync.friends.find(function(y){return y.id===r.from_user;});return '<div class="fcard req"><div class="fc-top">'+friendAvatar(n,rf&&rf.photo,'',rf&&rf.id)+'<div class="fc-name"><b>'+esc(n)+' · '+esc(p.what||p.title||'약속')+'</b><small>'+esc([p.date?slotText(p.date,p.start?toMin(p.start):null,p.start?(p.end?toMin(p.end):toMin(p.start)+60):null):'',p.place].filter(function(x){return !!x;}).join(' · ')||'약속 요청')+'</small></div><button class="tbtn b-save" data-act="appointment-open" data-id="'+r.id+'">확인</button></div></div>';}).join('');
  var rows=sortedFriends().map(function(f){var n=friendLabel(f),pinned=friendPinIndex(f.id)>=0;
    return '<button class="fcard friend-list-row" data-act="friend-detail" data-id="'+f.id+'"><div class="fc-top">'+friendAvatar(n,f.photo,'',f.id)+'<div class="fc-name"><b>'+esc(n)+'</b><small>'+esc(lastMetInfo(f.id))+' · 추억 '+friendMemoryRows(f.id).length+'개</small></div><span class="friend-list-tail">'+(pinned?'★ ':'')+'›</span></div></button>';}).join('');
  var invOut=(FriendSync.invitesOut||[]).map(function(x){var n=inviteName(x.to_user);return '<div class="fcard"><div class="fc-top">'+friendAvatar(n,invitePhoto(x.to_user))+'<div class="fc-name"><b>'+esc(n)+'</b><small>수락 기다리는 중</small></div><button class="tbtn" data-act="friend-invite-cancel" data-id="'+x.id+'">요청 취소</button></div></div>';}).join('');
  var av=meetAvail(),availRow='<div class="setrow"><span>약속 가능 시간<small>친구는 이 시간 안에서만 약속을 신청할 수 있어요</small></span><div class="row" style="margin:0;flex:none;align-items:center">'+meetAvailSelHTML('set-meet-s',av[0],0,23)+'<span>~</span>'+meetAvailSelHTML('set-meet-e',av[1],1,24)+'</div></div>';
  var ferr=[FriendSync.error,FriendSync.inviteError,FriendSync.busyError].filter(function(x){return !!x;}).filter(function(x,i,a){return a.indexOf(x)===i;}).map(function(x){return '<p class="hint" style="color:var(--now)">'+esc(x)+'</p>';}).join('');
  var nf=FriendSync.friends.length;
  return storyTop+'<section class="card"><div class="card-h"><h3>친구</h3><span class="cnt">'+(FriendSync.loaded?(nf?nf+'명':'연결됨'):'확인 중')+'</span></div>'+
    '<button class="codebox" style="width:100%;text-align:left" data-act="friend-copy-code"><span><small>내 초대코드 · 눌러서 복사</small><span class="code">'+esc(myCode)+'</span></span><span class="tbtn" style="display:grid;place-items:center">복사</span></button>'+
    '<div class="row"><input class="fld" style="margin:0" id="f-friend-code" maxlength="8" autocapitalize="characters" autocomplete="off" placeholder="친구 초대코드 8자리"><button class="b-save" style="height:44px;padding:0 14px" data-act="friend-add">요청 보내기</button></div>'+
    '<p class="hint">친구가 수락하면 연결돼요.</p>'+ferr+(FriendSync.msg?'<p class="hint">'+esc(FriendSync.msg)+'</p>':'')+
    ((invIn||reqIn)?'<div class="fsec">새 알림</div>'+invIn+reqIn:'')+friendNotifyNudgeHTML()+
    '<div class="fsec">링크 약속</div><div class="lk-entry"><button class="tbtn pri" data-act="lk-new">새 링크</button><button class="tbtn" data-act="lk-list">내 링크 '+LinkSync.links.length+'</button></div>'+
     (blockedUserIds().length?'<div class="fsec">차단 목록</div>'+blockedUserIds().map(function(bid){var bn=(S.settings.blockedUserNames&&S.settings.blockedUserNames[bid])||'차단한 사용자';return '<div class="setrow"><span>'+esc(bn)+'<small>공유 정보와 친구 요청을 표시하지 않아요</small></span><button class="tbtn" data-act="friend-unblock" data-id="'+esc(bid)+'">차단 해제</button></div>';}).join(''):'')+
     '<div class="fsec">친구 목록</div>'+(rows||'<div class="empty">아직 연결된 친구가 없어요. 초대코드를 주고받아 보세요.</div>')+
    (invOut?'<div class="fsec">보낸 요청</div>'+invOut:'')+
    '<div class="fsec">약속 설정</div>'+availRow+
    '<div class="fsec">응원 쪽지</div>'+
    '<div class="setrow"><span>받는 시간<small>오늘 받은 응원은 바로 안 보이고 다음 날 이 시간 이후 플래논을 열면 보여요</small></span><input class="fld" style="width:112px;margin:0" type="time" min="08:00" max="23:59" id="set-cheer-time" value="'+esc(cheerReceiveTime())+'"></div>'+
    '<div class="setrow"><span>친구 요청·약속 알림<small>'+(!notifySupported()?'이 브라우저는 알림을 지원하지 않아요 (아이폰은 홈 화면에 추가 후 사용)':notifySupported()&&Notification.permission==='denied'?'알림이 막혀 있어요. 브라우저·기기 설정에서 허용해주세요':'앱이 열려 있으면 팝업, 다른 화면에 있으면 시스템 알림으로 알려줘요')+'</small></span><button class="tbtn'+(friendNotifyOn()?' on':'')+'" data-act="friend-notify">'+(friendNotifyOn()?'켜짐':'꺼짐')+'</button></div></section>';
}
function globalSearchDate(k){
  if(!k)return '';
  try{var d=parseKey(k);return mdTxt(d)+' ('+DAYS[dow(d)]+')';}catch(e){return k;}
}
function globalSearchRows(query){
  var q=String(query||'').trim().toLowerCase(),rows=[];
  if(!q)return rows;
  function add(kind,type,id,title,meta,extra,sort){
    var hay=[title,meta,extra].filter(function(x){return x!=null;}).join(' ').toLowerCase();
    if(hay.indexOf(q)<0)return;
    rows.push({kind:kind,type:type,id:String(id),title:String(title||''),meta:String(meta||''),extra:extra||'',sort:String(sort||'9999')});
  }
  S.todos.forEach(function(t){
    var meta=(t.scope==='inbox'?'언제든지':(t.key?tagOf(t):''))+(t.due?' · 마감 '+globalSearchDate(t.due):'')+(t.done?' · 완료':'');
    add('todo','할 일',t.id,t.text,meta,t.course,t.key||t.due||'9999');
  });
  S.routines.forEach(function(r){add('routine','반복 할 일',r.id,r.text,'매주 '+daysText(r.days),'','9999');});
  S.classes.forEach(function(c){add('class',modeBlockWord(),c.id,c.name,(DAYS[c.day]||'')+' · '+(c.start||'')+'–'+(c.end||''),c.sub,'9998');});
  S.events.forEach(function(e){
    var ek=e.date||e.from||'',kind=e.kind==='appointment'?'약속':'일정',meta=(ek?(e.from&&e.to?'기간 '+globalSearchDate(e.from)+' – '+globalSearchDate(e.to):globalSearchDate(ek)):'반복 일정');
    if(e.start)meta+=' · '+timeShort(e.start)+(e.end?'–'+timeShort(e.end):'');
    add('event',kind,e.id,eventLabel(e),meta,eventSub(e),ek||'9997');
  });
  S.allday.forEach(function(a){
    var ak=a.date||a.from||'',meta=a.days?'매주 '+daysText(a.days):(ak?(a.end?'기간 '+globalSearchDate(ak)+' – '+globalSearchDate(a.end):globalSearchDate(ak)):'반복 일정');
    add('allday','종일 일정',a.id,a.title,meta,'','9996');
  });
  S.exams.forEach(function(e){add('exam','시험',e.id,e.name,rangeTxt(e.start,e.end),e.kind||'시험 기간',e.start||'9995');});
  S.ddays.forEach(function(x){add('dday','D-day',x.id,x.title,ddLabel(x),x.date||'','9994');});
  Object.keys(S.memos||{}).forEach(function(k){var m=memoOf(k);if(m&&m.text)add('memo','하루 메모',k,m.text,globalSearchDate(k),'','9993');});
  (S.diaries||[]).forEach(function(d){add('diary','일기',d.id,(d.text||d.note||'일기').slice(0,40),globalSearchDate(diaryDateKey(d)),d.text||d.note||'','9991');});
  S.selfchat.forEach(function(m){var text=m.text||'사진';add('chat','채팅',m.id,text,(m.room?chatRoomLabel(m.room)+' · ':'')+globalSearchDate(dkey(new Date(m.at))),m.text||'','9992');});
  if(typeof FriendSync!=='undefined'&&(FriendSync.friends||[]).length){FriendSync.friends.forEach(function(f){add('friend','친구',f.id,friendLabel(f),'친구 · 약속/추억 보기',f.code||'','9991');});}
  var order={todo:0,routine:1,event:2,allday:3,exam:4,dday:5,class:6,friend:7,memo:8,chat:9};
  rows.sort(function(a,b){return (order[a.kind]-order[b.kind])||a.sort.localeCompare(b.sort);});
  return rows.slice(0,80);
}
function globalSearchResult(r){
  return '<button class="gresult" data-act="global-result" data-kind="'+esc(r.kind)+'" data-id="'+esc(r.id)+'"'+(r.kind==='chat'?' data-room="'+esc((S.selfchat.find(function(m){return String(m.id)===r.id;})||{}).room||'general')+'"':'')+'><span class="gresult-type">'+esc(r.type)+'</span><span class="gresult-main"><b class="gresult-title">'+esc(r.title)+'</b><small class="gresult-meta">'+esc(r.meta)+'</small></span><span class="gresult-arrow">›</span></button>';
}
function drawGlobalSearch(){
  var q=$('#f-global-search')?$('#f-global-search').value:(M.query||''),box=$('#global-results'),count=$('#global-count');
  if(!box)return;
  M.query=q;
  var rows=globalSearchRows(q);
  if(count)count.textContent=q.trim()?(rows.length+'개 결과'+(rows.length>=80?' · 일부만 표시':'') ):'검색할 내용을 입력해보세요';
  box.innerHTML=q.trim()?(rows.length?rows.map(globalSearchResult).join(''):'<div class="empty" style="text-align:center">검색 결과가 없어요</div>'):'<div class="empty" style="text-align:center">할 일·일정·시험·과목·친구·약속을 한 번에 찾아보세요</div>';
}
function openGlobalSearch(){
  M={type:'global-search',query:''};
  openModal('<h3>전체 검색</h3><div class="gsearch"><input class="fld" id="f-global-search" placeholder="할 일, 일정, 시험, 과목, 친구, 약속 검색" autocomplete="off" enterkeyhint="search"><button class="gsearch-close" data-act="close">닫기</button></div><p class="gresult-count" id="global-count"></p><div class="gresults" id="global-results"></div>');
  drawGlobalSearch();
  setTimeout(function(){var f=$('#f-global-search');if(f)f.focus();},40);
}
function openGlobalResult(a){
  var kind=a.dataset.kind,id=a.dataset.id;
  if(kind==='friend'){closeModal();U.tab='friends';U.friendsPage='detail';U.friendDetailId=id;render(true);setTimeout(function(){var el=document.querySelector('[data-act="friend-meet"][data-id="'+CSS.escape(id)+'"]');if(el)el.scrollIntoView({behavior:'smooth',block:'center'});},80);return;}
  if(kind==='chat'){
    var cm=S.selfchat.find(function(m){return String(m.id)===id;});
    closeModal();U.chatRoom=(cm&&cm.room)||a.dataset.room||'general';U.chatQuery=cm&&cm.text||'';U.chatSel=null;drawChat();return;
  }
  if(kind==='memo'){closeModal();U.date=parseKey(id);U.tab='day';render(true);return;}
  if(kind==='todo'){var t=S.todos.find(function(x){return x.id===id;});if(t){closeModal();if(t.key&&/^\d{4}-\d{2}/.test(t.key))U.date=parseKey(t.key);openTodo(t);}return;}
  if(kind==='routine'){var rt=S.routines.find(function(x){return x.id===id;});if(rt){closeModal();openRoutine(rt);}return;}
  if(kind==='class'){var c=S.classes.find(function(x){return x.id===id;});if(c){closeModal();openBlock(c,null,dkey(U.date));}return;}
  if(kind==='event'){var ev=S.events.find(function(x){return x.id===id;});if(ev){closeModal();if(ev.date)U.date=parseKey(ev.date);(ev.kind==='appointment'?openAppointment:(ev.kind==='schedule'||ev.days||ev.from?openSchedule:openEvent))(ev);}return;}
  if(kind==='allday'){var ad=S.allday.find(function(x){return x.id===id;});if(ad){closeModal();if(ad.date)U.date=parseKey(ad.date);openSchedule(ad);}return;}
  if(kind==='exam'){var ex=S.exams.find(function(x){return x.id===id;});if(ex){closeModal();U.date=parseKey(ex.start);openExam(ex);}return;}
  if(kind==='dday'){var dd=S.ddays.find(function(x){return x.id===id;});if(dd){closeModal();if(dd.date)U.date=parseKey(dd.date);openDD(dd);}return;}
}

/* ---------- 렌더 ---------- */
function render(reset){
  applyTheme();
  if(U.guest){renderGuest();return;}
  var main=$('#main'),st=reset?0:main.scrollTop;
  $('#top').innerHTML=topHTML();
  $('#top').classList.toggle('navtop',U.tab==='month'||U.tab==='week'||U.tab==='day');
  var v={month:viewMonth,week:viewWeek,day:viewDay,todo:viewTodo,ttable:viewTable,settings:viewSettings,friends:viewFriends,meonbyeol:function(){if(window.PLANON_MEONBYEOL&&window.PLANON_MEONBYEOL.on())return window.PLANON_MEONBYEOL.view();U.tab='day';return viewDay();}}[U.tab]();
  var closedDay=U.tab==='day'&&dayClosedMode(dkey(U.date));
  if((U.tab==='month'||U.tab==='week'||U.tab==='day')&&!closedDay)v=topBar()+v;
  if(U.tab==='day'&&!closedDay&&dkey(U.date)===todayKey())v=letterBar()+v; /* 오늘 일간에서만 한 번 */
  if(U.tab==='day'){var nudges=appointmentPrecheckHTML()+postMeetNudgesHTML()+memoryNudgeHTML();v=closedDay?v+nudges:nudges+v;}
  if(Sync.kind==='supa'&&!Sync.uid&&Sync.ready&&U.tab!=='settings'&&lsGet('planner.loginNudge')!=='off')
    v='<section class="nudge"><span>로그인하면 아이폰·아이패드가 같은 플래너를 봐요</span><button class="tbtn plus" data-act="open-login">로그인</button><button class="lt-x" data-act="nudge-off" aria-label="닫기">✕</button></section>'+v;
  main.innerHTML=(storageOK?'':'<div class="note">이 브라우저에서는 저장이 막혀 있어요. 새로고침하면 내용이 사라질 수 있어요.</div>')+(Sync.loading?'<div class="note">계정 플래너 불러오는 중…</div>':'')+v;
  $('#nav').innerHTML=navHTML();
  $('#app').classList.toggle('wide',U.tab==='day');
  main.scrollTop=st;
  if(reset&&U.tab==='day'&&dkey(U.date)===todayKey()&&window.innerWidth>=760){
    var cur=document.querySelector('.hr.cur');
    if(cur)main.scrollTop=Math.max(0,cur.offsetTop-main.offsetTop-120);
  }
  if(M.type==='course')drawCourse();
  checkReminders();
  if(U.refocus){
    var inp=document.querySelector('[data-draft="'+U.refocus+'"]');
    if(inp){inp.focus();}
    U.refocus=null;
  }
  if(Sync.uid&&Sync.pulled&&!Sync.loading&&(S.settings.onboardDone||S.settings.schoolConfigured))lsSet('planner.onboard.'+Sync.uid,'1');
  if(Sync.uid&&Sync.pulled&&!Sync.loading&&!M.type&&!S.settings.onboardDone&&!S.settings.schoolConfigured&&!lsGet('planner.onboard.'+Sync.uid)&&!onboardTimer){
    onboardTimer=setTimeout(function(){
      onboardTimer=null;
      if(Sync.uid&&Sync.pulled&&!Sync.loading&&!M.type&&!S.settings.onboardDone&&!S.settings.schoolConfigured&&!lsGet('planner.onboard.'+Sync.uid))openOnboard();
    },250);
  }  if(window.PLANON_UX&&typeof window.PLANON_UX.afterRender==='function'){try{window.PLANON_UX.afterRender();}catch(e){}}
  if(window.PLANON_WEATHER&&typeof window.PLANON_WEATHER.afterRender==='function'){try{window.PLANON_WEATHER.afterRender();}catch(e){}}
  if(window.PLANON_RAIN&&typeof window.PLANON_RAIN.afterRender==='function'){try{window.PLANON_RAIN.afterRender();}catch(e){}}
  if(window.PLANON_AUTOSCHEDULE&&typeof window.PLANON_AUTOSCHEDULE.afterRender==='function'){try{window.PLANON_AUTOSCHEDULE.afterRender();}catch(e){}}
  if(window.PLANON_SMART_UI&&typeof window.PLANON_SMART_UI.afterRender==='function'){try{window.PLANON_SMART_UI.afterRender();}catch(e){}}
  if(window.PLANON_CLOCK&&typeof window.PLANON_CLOCK.afterRender==='function'){try{window.PLANON_CLOCK.afterRender();}catch(e){}}
}


/* ---------- 모달 ---------- */
function openModal(html){var el=$('#modal');el.innerHTML='<div class="sheet" role="dialog" aria-modal="true">'+html+'</div>';el.classList.add('open');}
function closeModal(){var el=$('#modal');el.classList.remove('open');el.classList.remove('full');el.innerHTML='';M={type:null};setTimeout(function(){if(!M.type&&Sync.uid&&typeof showNextFriendInvite==='function'){showNextFriendInvite();showNextAppointmentRequest();}},350);}
function finishOnboard(){S.settings.onboardDone=true;if(Sync.uid)lsSet('planner.onboard.'+Sync.uid,'1');save();}
function openSchoolAdd(fromOnboard){
  M={type:'school-add',fromOnboard:!!fromOnboard};
  openModal('<h3>내 학교 직접 추가</h3><p class="hint">학교 이름과 공식 사이트 주소를 넣으면 학교 선택 목록에 저장돼요. 공지·식단 주소는 선택이에요.</p>'+ 
    '<input class="fld" id="f-school-name" placeholder="학교 이름" maxlength="40">'+
    '<input class="fld" id="f-school-campus" placeholder="캠퍼스 (선택)" maxlength="20">'+
    '<input class="fld" id="f-school-home" type="url" inputmode="url" autocapitalize="off" placeholder="학교 홈페이지 (선택)">'+
    '<input class="fld" id="f-school-notice" type="url" inputmode="url" autocapitalize="off" placeholder="공지사항 주소 (선택)">'+
    '<input class="fld" id="f-school-meal" type="url" inputmode="url" autocapitalize="off" placeholder="식단·기숙사 주소 (선택)">'+
    '<div class="acts"><button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="save-school">추가</button></div>');
  setTimeout(function(){var f=$('#f-school-name');if(f)f.focus();},50);
}
function saveSchoolCustom(){
  var n=$('#f-school-name').value.trim(),camp=$('#f-school-campus').value.trim()||'내 캠퍼스',home=$('#f-school-home').value.trim(),notice=$('#f-school-notice').value.trim(),meal=$('#f-school-meal').value.trim();
  if(!n){bad('#f-school-name');return;}
  var links=[];
  [[home,'학교 홈페이지'],[notice,'학교 공지사항'],[meal,'식단·기숙사']].forEach(function(x){if(x[0]){var u=x[0];if(!/^https?:\/\//i.test(u))u='https://'+u;links.push({name:x[1],url:u});}});
  if(!links.length){bad('#f-school-home');return;}
  var id='custom-school:'+uid(),p={id:id,name:n,campuses:[camp],links:links};
  S.settings.customSchools.push(p);setSchool(id,camp);
  var fromOnboard=M.fromOnboard;closeModal();
  if(fromOnboard){M={type:'onboard',step:1,school:id,campus:camp,color:S.settings.defColor||'',plannerMode:S.settings.plannerMode||'university'};drawOnboard();}
  else render(true);
}
function onboardFlow(mode){
  var m=mode||S.settings.plannerMode||'university';
  return (m==='university'||m==='school')?['mode','school','style','scan','first']:['mode','style','first'];
}
function onboardStepKey(){var flow=onboardFlow(M.plannerMode||S.settings.plannerMode);return flow[Math.max(0,Math.min(Number(M.step)||0,flow.length-1))]||'first';}
function onboardAdvance(){var flow=onboardFlow(M.plannerMode||S.settings.plannerMode);if((Number(M.step)||0)>=flow.length-1)return false;M.step=(Number(M.step)||0)+1;return true;}
function openOnboard(){
  M={type:'onboard',step:0,school:S.settings.school||'skku',campus:S.settings.schoolCampus||schoolProfile(S.settings.school||'skku').campuses[0],color:S.settings.defColor||'',plannerMode:S.settings.plannerMode||'university'};
  drawOnboard();
}
function drawOnboard(){
  var darkNow=document.documentElement.getAttribute('data-theme')==='dark'||(document.documentElement.getAttribute('data-theme')!=='light'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);
  var flow=onboardFlow(M.plannerMode||S.settings.plannerMode),key=onboardStepKey(),idx=Math.max(0,flow.indexOf(key));M.step=idx;
  var defs={
    mode:{title:'어떤 플래너로 시작할까요?',desc:'나중에 언제든 바꿀 수 있고, 유형별 내용은 서로 섞이지 않게 따로 보관돼요.'},
    school:{title:'학교를 연결할까요?',desc:'학교 공지·식단·캠퍼스 바로가기를 쓰고 싶다면 연결해요. 지금은 건너뛰어도 돼요.'},
    style:{title:'내 플래너로 만들어요',desc:'친구에게 보일 이름과 기본 색을 정해요. 둘 다 나중에 바꿀 수 있어요.'},
    scan:{title:'시간표를 바로 넣을까요?',desc:'시간표 캡처가 있다면 빠르게 등록할 수 있어요. 없으면 건너뛰면 돼요.'},
    first:{title:'준비 끝',desc:'오늘 할 일 하나만 적어두면 바로 시작하기 편해요. 비워도 괜찮아요.'}
  };
  var st=defs[key],last=idx===flow.length-1,body='';
  if(key==='mode'){
    body=modePillsHTML(M.plannerMode||S.settings.plannerMode||'university','onboard-mode');
  }else if(key==='school'){
    body='<span class="lbl">학교 이름 검색</span><input class="fld" id="f-on-school" list="f-school-list" placeholder="학교를 검색해요" value="'+esc(schoolName(M.school))+'"><datalist id="f-school-list">'+schoolDatalist()+'</datalist><button class="tbtn" data-act="school-add-onboard" style="width:100%;margin:0 0 10px">+ 내 학교 직접 추가</button><span class="lbl">캠퍼스</span><select class="sel" id="f-on-campus" style="width:100%">'+schoolProfile(M.school).campuses.map(function(c){return '<option value="'+esc(c)+'"'+(c===M.campus?' selected':'')+'>'+esc(c)+'</option>';}).join('')+'</select>';
  }else if(key==='style'){
    body='<span class="lbl">이름</span><input class="fld" id="f-on-name" maxlength="20" placeholder="친구에게 보일 이름" value="'+esc((S.settings.profileName||''))+'"><div class="defpal">'+palHTML(M.color,'기본 색상')+'</div>'+(darkNow?'<p class="hint">다크 모드에서도 고른 색은 그대로 저장돼요.</p>':'');
  }else if(key==='scan'){
    body='<div class="onboard-demo" style="display:block;padding:16px"><b>'+esc(plannerModeMeta(M.plannerMode||S.settings.plannerMode).schedule)+' 캡처로 빠르게 등록</b><small style="display:block;color:var(--sub);font-weight:500;margin-top:6px">JPG · PNG · HEIC 사진을 사용할 수 있어요.</small><button class="b-save" data-act="onboard-scan" style="width:100%;margin-top:12px">시간표 사진 등록</button></div>';
  }else{
    body='<span class="lbl">첫 할 일 (선택)</span><input class="fld" id="f-on-first-todo" maxlength="80" placeholder="예: 오늘 30분 복습하기"><div class="onboard-demo"><b>준비 완료</b><small style="display:block;color:var(--sub);font-weight:500;margin-top:6px">추가는 오른쪽 아래 + 하나만 기억하면 돼요.</small></div>';
  }
  var left=key==='mode'?'':('<button class="b-ghost" data-act="onboard-skip">'+(last?'건너뛰고 시작':'건너뛰기')+'</button>');
  openModal('<div class="onboard"><div class="onboard-dots">'+flow.map(function(_,i){return '<i class="'+(i===idx?'on':'')+'"></i>';}).join('')+'</div><h3>'+st.title+'</h3><p class="hint">'+st.desc+'</p>'+body+'<div class="acts">'+left+'<button class="b-save" data-act="onboard-next">'+(last?'플래너 시작':'다음')+'</button></div></div>');
}
function palHTML(sel,label){
  return '<span class="lbl">'+(label||'색상')+'</span><div class="pal">'+PALETTE.map(function(c){return '<button class="sw '+(c===sel?'on':'')+'" style="--c:'+c+'" data-act="pick-color" data-v="'+c+'" aria-label="색상 선택"></button>';}).join('')+'</div>';
}
function bad(sel){var el=$(sel);if(!el)return;if(el.dataset&&el.dataset.dx){var b=el.nextElementSibling;if(b){b.classList.add('bad');b.focus();}return;}el.classList.add('bad');el.focus();}
function armed(btn){
  if(btn.dataset.armed)return true;
  btn.dataset.armed='1';btn.classList.add('armed');
  var orig=btn.textContent;btn.textContent='한 번 더 누르면 실행';
  setTimeout(function(){if(btn.isConnected){delete btn.dataset.armed;btn.classList.remove('armed');btn.textContent=orig;}},3000);
  return false;
}

function scheduleWhenText(x,dk){
  if(!x)return '—';
  if(Array.isArray(x.days)&&x.days.length){
    var ds=x.days.slice().sort().map(function(i){return DAYS[Number(i)]+'요일';}).join(' · ');
    var rg=(x.from?fullDateTxt(x.from):'시작일 없음')+(x.to?' ~ '+fullDateTxt(x.to):' ~ 계속');
    return ds+' · '+rg;
  }
  if(x.from&&x.to)return fullDateTxt(x.from)+' ~ '+fullDateTxt(x.to);
  var k=x.date||dk||'';return k?fullDateTxt(k):'날짜 미정';
}
function openEventDetail(e,dk){
  if(!e)return;
  if(e.kind==='appointment'){openAppointment(e);return;}
  if(e.kind==='schedule'||e.days||e.from){openScheduleDetail(e,'event',dk);return;}
  M={type:'event-detail',id:e.id};
  var rows=[['일정',e.title||'일정'],['날짜',fullDateTxt(e.date||dk)],['시간',(e.start||'시간 미정')+(e.end?' ~ '+e.end:'')],['중요 일정',e.important?'표시함':'아님']];
  if(e.place)rows.push(['장소',e.place]);
  var pc=cleanPackItems(e.packing).length;if(pc)rows.push(['준비물',cleanPackItems(e.packing).join(' · ')]);
  openModal('<h3>'+esc(e.title||'일정')+'</h3>'+planonDetailRows(rows)+'<div class="acts"><button class="b-ghost" data-act="close">닫기</button><button class="b-save" data-act="edit-event" data-id="'+esc(e.id)+'">수정</button></div>');
}
function openScheduleDetail(x,source,dk){
  if(!x)return;source=source||'event';M={type:'schedule-detail',id:x.id,source:source};
  var rows=[['일정',x.title||'일정'],['날짜·반복',scheduleWhenText(x,dk)],['시간',x.start?x.start+(x.end?' ~ '+x.end:''):'하루종일']];
  var packing=cleanPackItems(x.packing);if(packing.length)rows.push(['준비물',packing.join(' · ')]);
  var act=source==='allday'?'edit-ad':'edit-event';
  openModal('<h3>'+esc(x.title||'일정')+'</h3>'+planonDetailRows(rows)+'<div class="acts"><button class="b-ghost" data-act="close">닫기</button><button class="b-save" data-act="'+act+'" data-id="'+esc(x.id)+'">수정</button></div>');
}
function openEvent(e,def){
  def=def||{};var ev=e||{title:'',date:def.date||dkey(U.date),start:def.start||'09:00',end:def.end||'10:00',color:defCol(),important:false};
  M={type:'event',id:e?e.id:null,color:ev.color,tpA:null};
  openModal('<h3>'+(e?'일정 수정':def.heading||'일정 추가')+'</h3>'+ 
    '<input class="fld" id="f-title" placeholder="'+(def.ph||'일정 제목')+'" maxlength="60" value="'+esc(ev.title)+'">'+
    '<span class="lbl">날짜</span><input class="fld" type="date" id="f-date" value="'+ev.date+'">'+
    '<span class="lbl">시간 <em class="tphint">칸을 눌러 고르고, 끝나는 칸을 한 번 더 누르면 범위로 잡혀요</em></span><div class="tpick" id="tpick"></div>'+ 
    '<div class="row"><input class="fld" type="time" id="f-start" value="'+ev.start+'"><span>~</span><input class="fld" type="time" id="f-end" value="'+ev.end+'"></div>'+ 
    '<label class="ck"><input type="checkbox" id="f-important"'+(ev.important?' checked':'')+'>중요 일정으로 표시 <small style="color:var(--sub)">달력에서 기본색 네모로 강조</small></label>'+ 
    palHTML(ev.color)+
    (e?'':'<label class="ck"><input type="checkbox" id="f-weekly">매주 반복 (시간표에 고정)</label><button class="tbtn" style="width:100%;margin:0 0 12px;text-align:center" data-act="to-allday">시간 없이 종일 일정으로 넣기</button>')+
    '<div class="acts">'+(e?'<button class="b-del" data-act="del-event">삭제</button>':'')+'<button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="save-event">저장</button></div>');
  drawTpick();if(!e)setTimeout(function(){var f=$('#f-title');if(f)f.focus();},50);
}
function drawTpick(){
  var box=$('#tpick');if(!box)return;
  var dateInput=$('#f-date')||$('#f-from'),dv=dateInput&&dateInput.value;if(!dv){box.innerHTML='';return;}
  var lo=S.settings.hStart!=null?S.settings.hStart:8,hi=S.settings.hEnd!=null?S.settings.hEnd:23;
  var its=itemsFor(parseKey(dv)).filter(function(it){return !it.skipped&&!(it.kind==='event'&&it.id===M.id);});
  var friendId=M.type==='appointment'?($('#f-afriend')&&$('#f-afriend').value)||M.friendId:null;
  if(friendId)its=its.concat(friendBusyItems(friendId,dv));
  var sv=$('#f-start').value,ev=$('#f-end').value,sm=sv?toMin(sv):-1,em=ev?toMin(ev):-1,html='';
  for(var h=lo;h<hi;h++){
    var hs=h*60,he=hs+60,busy=its.filter(function(it){return it.start<he&&it.end>hs;})[0];
    var sel=sm>=0&&em>sm&&hs<em&&he>sm;
    html+='<button class="tp'+(busy?' busy':'')+(sel?' sel':'')+'" data-act="tp" data-h="'+h+'"'+(busy?' aria-disabled="true" style="--c:'+busy.color+'"':'')+'><b>'+h+'</b>'+(busy?'<small>'+esc(busy.name)+'</small>':'')+'</button>';
  }
  box.innerHTML=html;
}
function saveEvent(){
  var title=$('#f-title').value.trim(),date=$('#f-date').value,s0=$('#f-start').value,e0=$('#f-end').value,important=!!($('#f-important')&&$('#f-important').checked);
  if(!title){bad('#f-title');return;}if(!date){bad('#f-date');return;}if(!s0){bad('#f-start');return;}if(!e0||toMin(e0)<=toMin(s0)){bad('#f-end');return;}
  var weekly=$('#f-weekly');
  if(!M.id&&weekly&&weekly.checked)S.classes.push({id:uid(),name:title,sub:'',day:dow(parseKey(date)),start:s0,end:e0,color:M.color});
  else if(M.id){var ev=S.events.find(function(x){return x.id===M.id;});if(ev)Object.assign(ev,{title:title,date:date,start:s0,end:e0,color:M.color,important:important});}
  else S.events.push({id:uid(),title:title,date:date,start:s0,end:e0,color:M.color,important:important});
  save();closeModal();render();
}
function appointmentConflictWarnings(date,start,end,ignoreId){
  var out=[];if(!date)return out;
  var d=parseKey(date),tom=dkey(addDays(d,1));
  var tomorrowExams=(S.exams||[]).filter(function(x){return x.start===tom||x.end===tom;});
  if(tomorrowExams.length)out.push('다음 날 '+(tomorrowExams[0].name||tomorrowExams[0].kind||'시험')+'이 있어요.');
  if(start){
    var st=toMin(start),en=end?toMin(end):st+60;
    var its=itemsFor(d).filter(function(x){return x.start!=null&&x.end!=null&&!(x.kind==='event'&&x.id===ignoreId);}).map(function(x){return {s:x.start,e:x.end,name:x.name||'' ,kind:x.kind};});
    its.push({s:st,e:en,name:'새 약속',kind:'appointment'});its.sort(function(a,b){return a.s-b.s;});
    var cs=null,ce=null,contains=false,maxBlock=0;
    its.forEach(function(x){if(cs===null||x.s>ce+30){if(contains)maxBlock=Math.max(maxBlock,ce-cs);cs=x.s;ce=x.e;contains=x.kind==='appointment';}else{ce=Math.max(ce,x.e);if(x.kind==='appointment')contains=true;}});if(contains)maxBlock=Math.max(maxBlock,ce-cs);
    if(maxBlock>=300)out.push('이 약속까지 넣으면 일정이 약 '+Math.round(maxBlock/60*10)/10+'시간 이어져요.');
    var next=itemsFor(d).filter(function(x){return x.kind==='class'&&!x.skipped&&x.start>=en&&x.start-en<=30;}).sort(function(a,b){return a.start-b.start;})[0];
    if(next)out.push('약속이 끝난 뒤 '+(next.start-en)+'분 후 '+(next.name||'수업')+'이 시작해요.');
  }
  return out;
}
function appointmentWarningHTML(ws){return ws&&ws.length?'<div class="appt-warning"><b>잠깐, 일정이 조금 빡빡할 수 있어요</b>'+ws.map(function(x){return '<span>• '+esc(x)+'</span>';}).join('')+'</div>':'';}
function showAppointmentWarnings(ws){
  var m=$('#appointment-msg');if(m)m.innerHTML=appointmentWarningHTML(ws)+'<span>그래도 괜찮다면 저장을 한 번 더 눌러주세요.</span>';
  var b=document.querySelector('[data-act="save-appointment"]');if(b)b.textContent='그래도 저장';
}


function appointmentStoryFriend(ev){
  if(!ev||ev.kind!=='appointment')return null;
  var fid=ev.friendId||'';
  if(!fid&&ev.sharedRequestId){var sr=(FriendSync.shared||[]).find(function(r){return r.request_id===ev.sharedRequestId;});if(sr)fid=sharedFriendOf(sr);}
  if(fid)return (FriendSync.friends||[]).find(function(f){return f.id===fid;})||null;
  return localMeetFriend(ev);
}
function appointmentStoryPassed(ev){
  if(!ev||!ev.date||!ev.start)return false;var now=new Date(),tk=dkey(now);if(ev.date<tk)return true;if(ev.date>tk)return false;var end=ev.end?toMin(ev.end):toMin(ev.start)+60;return now.getHours()*60+now.getMinutes()>=end;
}
function appointmentStoryCTAHTML(ev){
  var f=appointmentStoryFriend(ev);if(!ev||!f||!appointmentStoryPassed(ev))return '';
  return '<div class="appointment-story-cta"><div><b>오늘 '+esc(friendLabel(f))+'와 만났어요</b><small>기분과 한줄평을 골라 둘의 포토카드로 남길 수 있어요.</small></div><button type="button" class="b-save" data-story-act="appointment-story-open" data-event-id="'+esc(ev.id)+'">추억 포토카드 만들기</button></div>';
}

function openAppointment(e,def){
  var ap=e||{person:'',place:'',what:'',date:(def&&def.date)||dkey(U.date),start:(def&&def.start)||'',end:'',color:defCol()};
  var what=ap.what||(ap.title&&ap.title!==ap.person?ap.title:'');
  var fid=(e&&e.friendId)||(def&&def.friendId)||null;
  M={type:'appointment',id:e?e.id:null,color:ap.color,tpA:null,friendId:fid,conflictConfirmed:false,pp:ppNew(ap.placeInfo||(ap.place?placeInfoFromText(ap.place):null),{allowUndecided:true,friendId:fid,future:true})};
  var friendPicker=!e?(FriendSync.friends.length?'<select class="sel" id="f-afriend"><option value="">직접 입력</option>'+sortedFriends().map(function(f){return '<option value="'+f.id+'"'+(M.friendId===f.id?' selected':'')+'>'+(friendPinIndex(f.id)>=0?'★ ':'')+esc(friendLabel(f))+'</option>';}).join('')+'</select>':'<button class="tbtn" data-act="open-settings" style="margin-bottom:10px">친구 연결하기</button>'):'',personHint=FriendSync.friends.length?'친구를 선택하면 수락 후 양쪽 플래너에 기록돼요. 공개된 바쁜 시간은 회색으로 막히고, 공개하지 않은 일정 제목은 보이지 않아요. 직접 입력은 나만 저장돼요.':'친구가 아니면 이름을 직접 입력해요. 이 약속은 나만 볼 수 있어요.';
  var shared=e&&e.sharedRequestId;
  openModal('<h3>'+(e?'약속 수정':'약속 추가')+'</h3>'+
    (shared?'<p class="hint">친구와 함께 잡은 약속이에요. 바꾸면 친구 캘린더에도 같이 바뀌어요.</p>':'<span class="lbl">누구랑 <em>(선택)</em></span>'+friendPicker+(!e&&FriendSync.friends.length?'<button class="tbtn" style="width:100%;margin:0 0 10px" data-act="appointment-to-meet">친구 빈 시간 한 주 표로 고르기</button>':'')+(!e?'<button class="tbtn" style="width:100%;margin:0 0 10px" data-act="lk-new">링크로 초대 · 앱 없는 친구·여러 명</button>':'')+'<input class="fld" id="f-aperson" maxlength="30" placeholder="직접 입력" value="'+esc(ap.person||'')+'"><p class="hint">'+personHint+'</p>')+
    '<span class="lbl">어디서 <em>(선택)</em></span><div id="pp">'+ppHTML(M.pp)+'</div>'+
    (shared&&!ap.place?'<button class="tbtn" style="width:100%;margin:0 0 10px" data-act="place-decide-open" data-id="'+esc(e.sharedRequestId)+'">장소 후보로 같이 정하기</button>':'')+
    '<span class="lbl">무엇을 <em>(선택)</em></span><input class="fld" id="f-awhat" maxlength="60" value="'+esc(what)+'">'+
    '<span class="lbl">시간 <em>(선택)</em><em class="tphint">칸을 눌러 시간을 골라도 돼요</em></span><div class="tpick" id="tpick"></div>'+
    '<div class="row"><input class="fld" type="time" id="f-start" value="'+(ap.start||'')+'"><span>~</span><input class="fld" type="time" id="f-end" value="'+(ap.end||'')+'"></div>'+
    '<span class="lbl">날짜</span><input class="fld" type="date" id="f-date" value="'+(ap.date||dkey(U.date))+'">'+
    '<p class="hint" id="appointment-msg">끝나는 시간은 비워도 돼요. 아무것도 입력하지 않아도 저장할 수 있어요.</p>'+palHTML(ap.color)+
    (e?appointmentStoryCTAHTML(ap):'')+
    '<div class="acts">'+(e?'<button class="b-del" data-act="del-event">삭제</button>':'')+'<button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="save-appointment">저장</button></div>');
  drawTpick();
}
function saveAppointment(){
  var pe=$('#f-aperson'),person=pe?pe.value.trim():'',info=ppInfo(M.pp),place=placeInfoText(info),start=$('#f-start').value,end=$('#f-end').value||null,what=$('#f-awhat').value.trim(),date=$('#f-date').value,target=$('#f-afriend')?$('#f-afriend').value:'';
  if(!date){bad('#f-date');return;}
  if(end&&!start){bad('#f-start');return;}
  if(end&&toMin(end)<=toMin(start)){bad('#f-end');return;}
  if(M.pp&&M.pp.mode==='pick'&&!info&&(M.pp.region||M.pp.q)){var am=$('#appointment-msg');if(am)am.textContent='장소를 끝까지 고르거나 “미정”을 눌러주세요';return;}
  var warns=appointmentConflictWarnings(date,start,end,M.id);if(warns.length&&!M.conflictConfirmed){M.conflictConfirmed=true;showAppointmentWarnings(warns);return;}
  var data={kind:'appointment',title:what||person||place||'약속',what:what,place:place,placeInfo:info,date:date,start:start||null,end:end,color:M.color};
  if(pe)data.person=person;
  if(!M.id&&target){data.person=person||friendLabel(FriendSync.friends.find(function(f){return f.id===target;}));data.placePending=!place;data.placeCandidates=[];data.candidateSelections={};data.fromUser=Sync.uid;data.fromName=myDisplayName();data.toName=data.person;sendAppointmentRequest(target,data);return;}
  if(M.id){var ev=S.events.find(function(x){return x.id===M.id;});if(ev){if(ev.sharedRequestId&&!pe)data.title=what||ev.person||place||'약속';Object.assign(ev,data);save();if(ev.sharedRequestId)updateSharedAppointment(ev).then(function(){inAppToast('친구 캘린더에도 반영했어요');},function(){inAppToast('친구 쪽 반영에 실패했어요. 잠시 뒤 다시 저장해주세요');});closeModal();render();return;}}
  else S.events.push(Object.assign({id:uid()},data));
  save();closeModal();render();
}

function openBlock(c,def,dk){
  var b=c||{name:'',sub:'',day:def.day,start:'09:00',end:'10:15',color:defCol()};
  M={type:'block',id:c?c.id:null,color:b.color,day:b.day,days:b.day==null?[]:[b.day],multi:!c};
  var days=DAYS.map(function(n,i){return '<button data-act="pick-day" data-v="'+i+'" class="'+(b.day===i?'on':'')+'">'+n+'</button>';}).join('')+
    '<button data-act="pick-day" data-v="none" class="'+(b.day==null?'on':'')+'">시간 미정</button>';
  openModal('<h3>'+(c?modeBlockWord()+' 수정':modeBlockWord()+' 추가')+'</h3>'+ 
    '<input class="fld" id="f-name" placeholder="이름" maxlength="60" value="'+esc(b.name)+'">'+
    '<input class="fld" id="f-sub" placeholder="'+(plannerMode()==='university'?'강의번호나 장소':plannerMode()==='school'?'교실이나 메모':'메모나 장소')+' (선택)" maxlength="40" value="'+esc(b.sub)+'">'+
    '<span class="lbl">요일'+(c?'':' <em class="tphint">여러 요일 선택 가능 · 같은 시간으로 추가돼요</em>')+'</span><div class="seg" id="f-days">'+days+'</div>'+ 
    '<span class="lbl">적용 기간 (비우면 학기 기간을 따라요)</span><div class="row"><input class="fld" type="date" id="f-cfrom" value="'+(b.from||'')+'"><span>~</span><input class="fld" type="date" id="f-cto" value="'+(b.to||'')+'"></div>'+
    '<div id="f-times" style="'+(b.day==null?'display:none':'')+'"><span class="lbl">시간</span><div class="row"><input class="fld" type="time" id="f-start" value="'+(b.start||'09:00')+'"><span>~</span><input class="fld" type="time" id="f-end" value="'+(b.end||'10:15')+'"></div></div>'+ 
    (c&&dk&&c.day!=null?'<p class="hint">여기서 삭제하면 이 날만 휴강으로 빠져요. 매주 지우려면 시간표 탭에서 삭제해요</p>':'')+
    (c&&dk&&c.day!=null&&(c.skip||[]).indexOf(dk)>=0?(function(){var dd=parseKey(dk);return '<button class="tbtn skipbtn" data-act="unskip-once" data-id="'+c.id+'" data-date="'+dk+'">'+(dd.getMonth()+1)+'/'+dd.getDate()+' 다시 넣기</button>';})():'')+
    palHTML(b.color,'색상')+(c?'<label class="ck"><input type="checkbox" id="f-allsame" checked>같은 과목 모든 시간에 적용 (색·기간)</label>':'')+
    (c?(function(){var xs=S.exams.filter(function(e){return examCourse(e)===c.name;}).sort(function(a,b){return a.start<b.start?-1:1;});
      return xs.length?'<div class="bexams"><span class="lbl">이 과목 시험·과제</span>'+xs.map(function(e){return (function(){var pp=examPrepProgress(e);return '<button class="bex'+(e.end<todayKey()?' past':'')+'" data-act="view-exam" data-id="'+e.id+'"><b>'+esc(e.kind||'일정')+'</b><span>'+esc(e.name)+(pp.total?' <small class="prep-progress">준비 '+pp.done+'/'+pp.total+' · '+pp.pct+'%</small>':'')+'</span><em>'+rangeTxt(e.start,e.end)+'</em></button>';})();}).join('')+'</div>':'';})():'')+
    (c?'<button class="b-ghost" style="width:100%;height:42px;border-radius:12px;font-weight:600;margin-bottom:8px;text-align:center" data-act="course-todos" data-name="'+esc(c.name)+'">과목 페이지'+(openCnt(c.name)?' · 할 일 '+openCnt(c.name)+'개':'')+'</button>':'')+
    '<div class="acts">'+(c?(dk&&c.day!=null?((c.skip||[]).indexOf(dk)<0?'<button class="b-del" data-act="skip-once" data-id="'+c.id+'" data-date="'+dk+'">삭제</button>':''):'<button class="b-del" data-act="del-block">삭제</button>'):'')+'<button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="save-block">저장</button></div>');
  if(!c)setTimeout(function(){var f=$('#f-name');if(f)f.focus();},50);
}
function saveBlock(){
  var name=$('#f-name').value.trim(),sub=$('#f-sub').value.trim();
  if(!name){bad('#f-name');return;}
  var s='',e='';
  var selected=M.multi?(M.days.length?M.days:[null]):[M.day];
  if(selected.some(function(x){return x!=null;})){
    s=$('#f-start').value;e=$('#f-end').value;
    if(!s){bad('#f-start');return;}
    if(!e||toMin(e)<=toMin(s)){bad('#f-end');return;}
  }
  var cf=$('#f-cfrom').value||null,ct=$('#f-cto').value||null;if(cf&&ct&&ct<cf){bad('#f-cto');return;}
  var data={name:name,sub:sub,start:s,end:e,color:M.color,from:cf,to:ct};
  if(M.id){var c=S.classes.find(function(x){return x.id===M.id;});if(c)Object.assign(c,data,{day:selected[0]});}
  else selected.forEach(function(day){S.classes.push(Object.assign({id:uid(),day:day},data));});
  var al=$('#f-allsame');if(al&&al.checked)S.classes.forEach(function(x){if(x.name===name){x.color=M.color;x.from=cf;x.to=ct;}});
  save();closeModal();render();
}

function openTodo(t){
  var date=t.scope==='month'?t.key+'-01':(t.key||todayKey());
  M={type:'todo',id:t.id,scope:t.scope};
  var timeHTML='<span class="lbl">시간표에 넣기 (선택)</span><div class="row"><input class="fld" type="time" id="f-ttime" value="'+(t.time||'')+'"><select class="fld" id="f-tdur">'+[30,60,90,120,180].map(function(m){return '<option value="'+m+'"'+((t.dur||60)===m?' selected':'')+'>'+durLong(m)+'</option>';}).join('')+'</select><button class="tbtn" data-act="clear-ttime">없음</button></div>';
  var dueHTML='<span class="lbl">마감일 (선택)</span><div class="row"><input class="fld" type="date" id="f-due" value="'+(t.due||'')+'"><button class="tbtn" data-act="clear-due">없음</button></div>';
  var sc=[['day','하루'],['week','한 주'],['month','한 달'],['inbox','언제든지']];
  var quick='<div class="qacts"><button class="tbtn'+(t.star?' on':'')+'" data-act="mstar" data-id="'+t.id+'">★ 중요</button><button class="tbtn" data-act="postpone" data-v="1" data-id="'+t.id+'">내일로</button><button class="tbtn" data-act="postpone" data-v="we" data-id="'+t.id+'">주말로</button><button class="tbtn" data-act="postpone" data-v="7" data-id="'+t.id+'">다음 주로</button></div>';
  openModal('<h3>할 일 수정</h3>'+quick+
    '<input class="fld" id="f-text" maxlength="120" value="'+esc(t.text)+'">'+
    '<span class="lbl">과목</span>'+courseSelect('f-course',t.course||'')+
    '<span class="lbl">언제 할까요</span><div class="seg">'+sc.map(function(s){return '<button data-act="pick-tscope" data-v="'+s[0]+'" class="'+(t.scope===s[0]?'on':'')+'">'+s[1]+'</button>';}).join('')+'</div>'+
    '<div id="f-tdate-w" style="'+(t.scope==='inbox'?'display:none':'')+'"><span class="lbl">기준 날짜</span><input class="fld" type="date" id="f-tdate" value="'+date+'"></div>'+dueHTML+
    timeHTML+splitPlanProgressHTML(t)+(t.done?'':'<button class="tbtn fbtn ibt" data-act="focus-todo" data-id="'+t.id+'">'+ICO_CLOCK+'이 일로 집중 시작</button>')+
    (!t.done&&!t.splitParentId?'<button class="tbtn" style="width:100%;height:42px;margin:8px 0;text-align:center" data-act="split-todo-open" data-id="'+t.id+'">큰 과제 쪼개기 · '+esc(modeGapWord())+'에 자동 배치</button>':'')+
    '<div class="acts"><button class="b-del" data-act="del-todo">삭제</button><button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="save-todo">저장</button></div>');
}
function saveTodo(){
  var text=$('#f-text').value.trim();
  if(!text){bad('#f-text');return;}
  var t=S.todos.find(function(x){return x.id===M.id;});
  if(!t){closeModal();return;}
  var d=$('#f-tdate').value?parseKey($('#f-tdate').value):studyDayDate(new Date());
  t.text=text;t.scope=M.scope;t.key=keyFor(M.scope,d);t.due=$('#f-due').value||null;t.course=$('#f-course').value;t.time=$('#f-ttime').value||null;t.dur=Number($('#f-tdur').value)||60;if(t.time&&t.scope!=='day'){t.scope='day';t.key=dkey(d);}
  save();closeModal();render();
}

function openCourse(name){M={type:'course',name:name};openModal('');drawCourse();}
function drawCourse(){
  var sh=document.querySelector('#modal .sheet');if(!sh)return;
  var n=M.name,did='course:'+n;
  var all=S.todos.filter(function(t){return t.course===n;});
  var open=sortTodos(all.filter(function(t){return !t.done;})),done=all.length-open.length;
  var blocks=S.classes.filter(function(c){return c.name===n&&c.day!=null;}).sort(function(a,b){return a.day-b.day||a.start.localeCompare(b.start);});
  var blockHTML=blocks.length?blocks.map(function(c){return '<div class="course-line"><b>'+esc(DAYS[c.day])+'</b><span>'+esc(c.start||'')+'–'+esc(c.end||'')+(c.sub?' · '+esc(c.sub):'')+'</span></div>';}).join(''):'<div class="empty">등록된 '+esc(modeBlockWord())+' 시간이 없어요</div>';
  var exs=S.exams.filter(function(e){return examCourse(e)===n;}).sort(function(a,b){return a.start<b.start?-1:a.start>b.start?1:0;});
  var examHTML=exs.length?'<div class="course-overview"><span class="lbl">시험·일정</span>'+exs.map(function(e){return (function(){var pp=examPrepProgress(e);return '<button class="bex" data-act="view-exam" data-id="'+e.id+'"><b>'+esc(e.kind||'시험')+'</b><span>'+esc(e.name)+(pp.total?' <small class="prep-progress">준비 '+pp.done+'/'+pp.total+' · '+pp.pct+'%</small>':'')+'</span><em>'+rangeTxt(e.start,e.end)+'</em></button>';})();}).join('')+'</div>':'';
  var chatId='course:'+n,chatCount=S.selfchat.filter(function(m){return (m.room||'general')===chatId;}).length;
  sh.innerHTML='<h3 style="display:flex;align-items:center;gap:8px"><span class="dot" style="--c:'+courseColor(n)+';margin:0"></span>'+esc(n)+'</h3>'+
    '<div class="course-overview"><span class="lbl">'+esc(modeBlockWord())+' 시간</span>'+blockHTML+'</div>'+examHTML+
    '<div class="card-h" style="margin-top:12px"><h3>과목 할 일</h3><span class="cnt">'+open.length+'개 남음 · '+done+'개 완료</span></div>'+ 
    '<ul class="todos">'+(open.map(function(t){return todoItem(t,{tag:true,nocourse:true});}).join('')||'<li class="empty">남은 할 일이 없어요</li>')+'</ul>'+ 
    (done?'<p class="hint" style="margin-top:8px">완료한 일 '+done+'개</p>':'')+
    '<div class="add"><input data-draft="'+esc(did)+'" placeholder="이 과목 할 일" enterkeyhint="done" value="'+esc(U.drafts[did]||'')+'"><button data-act="add-course-todo">추가</button></div>'+ 
    '<div class="duebox"><span>마감일</span><input type="date" id="c-due" value="'+esc(U.cdue||'')+'"></div>'+ 
    '<div class="acts" style="margin-top:12px"><button class="tbtn" data-act="chat-room" data-room="'+esc(chatId)+'">'+esc(modeBlockWord())+' 채팅방'+(chatCount?' · '+chatCount:'')+'</button><button class="b-ghost" data-act="close">닫기</button></div>';
  if(U.refocus===did){var i=sh.querySelector('.add input');if(i)i.focus();U.refocus=null;}
}
function openExam(e){
  var x=e||{name:'',start:'',end:'',kind:'',course:'',time:'',pin:true};
  M={type:'exam',id:e?e.id:null,kind:x.kind||'중간고사',single:true};
  var cs=courseNames(),cur=examCourse(x)||'';
  openModal('<h3>'+(e?'시험 수정':'시험 추가')+'</h3>'+ 
    '<span class="lbl">과목</span><select class="fld" id="f-ecourse"><option value="">과목 선택</option>'+cs.map(function(c){return '<option value="'+esc(c)+'"'+(cur===c?' selected':'')+'>'+esc(c)+'</option>';}).join('')+'<option value="기타"'+(cur==='기타'?' selected':'')+'>기타</option></select>'+ 
    '<span class="lbl">시험</span><div class="seg">'+['중간고사','기말고사','기타'].map(function(k){return '<button data-act="exam-name" data-v="'+k+'" class="'+(M.kind===k?'on':'')+'">'+k+'</button>';}).join('')+'</div>'+ 
    '<div class="row"><input class="fld" type="date" id="f-es" value="'+(x.start||'')+'"><input class="fld" type="time" id="f-etime" value="'+(x.time||'')+'"></div>'+ 
    '<input class="fld" id="f-ename" placeholder="이름은 비워도 돼요" maxlength="30" value="'+esc(x.name||'')+'">'+ 
    '<label class="ck"><input type="checkbox" id="f-epin"'+(exPinned(x)?' checked':'')+'>홈에 D-day 표시</label>'+
    '<div class="exam-meta"><input class="fld" id="f-erange-text" placeholder="시험 범위" value="'+esc(x.rangeText||'')+'"><input class="fld" id="f-ematerials" placeholder="공부할 자료" value="'+esc(x.materials||'')+'"></div>'+
    '<div class="prep-head"><span class="lbl">시험 준비</span><button class="tbtn" type="button" data-act="exam-prep-auto">자동 생성</button></div><div class="exam-prep" id="exam-prep">'+examPrep(x).map(function(t){return '<label class="exam-prep-row"><input type="checkbox" data-prep-id="'+esc(t.id)+'"'+(t.done?' checked':'')+'><input type="text" data-prep-text="'+esc(t.id)+'" value="'+esc(t.text||'')+'"><button type="button" data-act="exam-prep-del" data-id="'+esc(t.id)+'">×</button></label>';}).join('')+'<div class="exam-prep-add"><input id="f-prep-new" placeholder="예: Week 1 복습"><button type="button" data-act="exam-prep-add">추가</button></div></div>'+
    '<div class="acts">'+(e?'<button class="b-del" data-act="del-exam">삭제</button>':'')+'<button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="save-exam">저장</button></div>');
}
function saveExam(){
  var course=$('#f-ecourse')?$('#f-ecourse').value||null:null;
  var a=$('#f-es').value,time=$('#f-etime')?$('#f-etime').value:'',n=$('#f-ename').value.trim(),rangeText=$('#f-erange-text')?$('#f-erange-text').value.trim():'',materials=$('#f-ematerials')?$('#f-ematerials').value.trim():'';
  if(!a){bad('#f-es');return;}
  if(!n)n=((course&&course!=='기타')?course+' ':'')+(M.kind||'시험');
  var prep=[].slice.call(document.querySelectorAll('#exam-prep .exam-prep-row')).map(function(r){var c=r.querySelector('[data-prep-id]'),t=r.querySelector('[data-prep-text]');return {id:c.dataset.prepId,text:(t.value||'').trim(),done:c.checked};}).filter(function(x){return x.text;});
  var prepRange=$('#f-prep-range')?$('#f-prep-range').value.trim():'',prepMaterial=$('#f-prep-material')?$('#f-prep-material').value.trim():'';
  if(M.id){var e=S.exams.find(function(x){return x.id===M.id;});if(e){e.name=n;e.start=a;e.end=a;e.time=time||null;e.kind=M.kind||null;e.course=course;e.pin=$('#f-epin').checked;e.prep=prep;e.rangeText=rangeText;e.materials=materials;}}
  else S.exams.push({id:uid(),name:n,start:a,end:a,time:time||null,kind:M.kind||null,course:course,pin:$('#f-epin').checked,prep:prep,rangeText:rangeText,materials:materials});
  save();closeModal();render();
}

function normPackTitle(s){return String(s||'').trim().replace(/\s+/g,' ').toLowerCase();}
function cleanPackItems(items){
  return (Array.isArray(items)?items:[]).map(function(it){
    if(typeof it==='string')it={text:it};
    if(!it||typeof it!=='object')return null;
    var txt=String(it.text||'').trim();
    if(!txt)return null;
    return {id:it.id||uid(),text:txt,done:!!it.done};
  }).filter(Boolean);
}
function scheduleTemplateStore(){if(!S.schedulePrepTemplates||typeof S.schedulePrepTemplates!=='object')S.schedulePrepTemplates={};return S.schedulePrepTemplates;}
function scheduleTemplateFor(title){var k=normPackTitle(title);if(!k)return [];var t=scheduleTemplateStore()[k];return t&&Array.isArray(t.items)?cleanPackItems(t.items):[];}
function scheduleTemplateHas(title){return scheduleTemplateFor(title).length>0;}
function scheduleTemplateSave(title,items){var k=normPackTitle(title),nm=String(title||'').trim();if(!k||!nm)return;var arr=cleanPackItems(items);if(arr.length)scheduleTemplateStore()[k]={title:nm,items:arr};else delete scheduleTemplateStore()[k];}
function scheduleTemplateClear(title){var k=normPackTitle(title);if(k&&scheduleTemplateStore()[k])delete scheduleTemplateStore()[k];}
function schedulePackRow(it){return '<label class="exam-prep-row"><input type="checkbox" data-pack-id="'+esc(it.id)+'"'+(it.done?' checked':'')+'><input type="text" data-pack-text="'+esc(it.id)+'" value="'+esc(it.text||'')+'"><button type="button" data-act="pack-del" data-id="'+esc(it.id)+'">×</button></label>';}
function renderSchedulePackList(items){var box=$('#schedule-pack-list');if(box)box.innerHTML=cleanPackItems(items).map(schedulePackRow).join('');}
function collectSchedulePack(){return [].slice.call(document.querySelectorAll('#schedule-pack-list .exam-prep-row')).map(function(r){var c=r.querySelector('[data-pack-id]'),t=r.querySelector('[data-pack-text]');return {id:(c&&c.dataset.packId)||uid(),text:(t&&t.value||'').trim(),done:!!(c&&c.checked)};}).filter(function(x){return x.text;});}
function schedulePackHint(){
  var ti=$('#f-stitle'),msg=$('#pack-template-msg'),ck=$('#f-pack-template');
  if(!ti||!msg)return;
  var nm=(ti.value||'').trim(),has=scheduleTemplateHas(nm),cnt=has?scheduleTemplateFor(nm).length:0;
  if(has)msg.textContent='“'+nm+'” 제목에 저장된 준비물 템플릿 '+cnt+'개';
  else if(nm)msg.textContent='이 제목엔 아직 저장된 준비물 템플릿이 없어요';
  else msg.textContent='제목을 적으면 같은 제목의 준비물 템플릿을 불러올 수 있어요';
  if(ck&&has&&M.type==='schedule'&&M.id==null&&M.packTouched!==true)ck.checked=true;
}
function maybeApplyScheduleTemplate(force){
  var ti=$('#f-stitle'); if(!ti)return;
  var nm=(ti.value||'').trim(),tpl=scheduleTemplateFor(nm),cur=collectSchedulePack();
  if((force||!cur.length)&&tpl.length){renderSchedulePackList(tpl);M.packTouched=false;}
  schedulePackHint();
}
function schedulePackMarkup(items,title){
  var arr=cleanPackItems(items),has=scheduleTemplateHas(title);
  return '<div class="schedule-pack">'+
    '<div class="prep-head"><span class="lbl">준비물</span><button class="tbtn" type="button" data-act="pack-fill-template">제목 템플릿 불러오기</button></div>'+
    '<p class="hint">예: “본가” 일정에 충전기, 잠옷, 세면도구를 적어두면 다음에 같은 제목을 만들 때도 자동으로 떠요.</p>'+
    '<div class="exam-prep"><div id="schedule-pack-list" class="schedule-pack-list">'+arr.map(schedulePackRow).join('')+'</div><div class="exam-prep-add"><input id="f-pack-new" placeholder="예: 충전기"><button type="button" data-act="pack-add">추가</button></div><div class="pack-opts"><label><input type="checkbox" id="f-pack-template"'+(has?' checked':'')+'> 이 제목의 준비물 템플릿으로 저장</label><button class="b-ghost" type="button" data-act="pack-template-clear">이 제목 템플릿 지우기</button></div><div class="pack-msg" id="pack-template-msg"></div></div></div>';
}
function packBadge(cnt){return cnt?(' <small class="prep-progress">준비물 '+cnt+'개</small>'):'';}

function openCourseColor(name){
  M={type:'ccolor',name:name};
  var cur=courseColor(name);
  openModal('<h3>'+esc(name)+' 색</h3><p class="hint">고르면 이 과목의 모든 시간에 바로 적용돼요</p>'+
    '<div class="pal">'+PALETTE.map(function(c){return '<button class="sw big '+(c===cur?'on':'')+'" style="--c:'+c+'" data-act="apply-ccolor" data-v="'+c+'" aria-label="색상 선택"></button>';}).join('')+'</div>'+
    '<div class="acts"><button class="b-ghost" data-act="close">닫기</button></div>');
}
function openSchedule(a,def){
  def=def||{};
  var editing=!!a,isAll=editing&&!a.start;
  var x=a||{title:def.title||'',color:def.color||defCol(),date:def.date||dkey(U.date),start:def.start||'',end:def.end||''};
  var repeat=!!(x.days&&Array.isArray(x.days)),single=isAll?!(x.end&&x.date&&x.end!==x.date):!(x.from&&x.to&&!repeat);
  var seedPacking=cleanPackItems(x.packing&&x.packing.length?x.packing:scheduleTemplateFor(x.title||def.title||''));
  M={type:'schedule',id:editing?x.id:null,source:isAll?'allday':'event',color:x.color||defCol(),mode:(def.mode==='time'||x.start)?'time':'all',repeat:repeat,tpA:null,single:single,days:repeat?x.days.slice():[0,1,2,3,4,5,6],packTouched:false};
  var date=x.date||x.from||def.date||dkey(U.date),endDate=isAll&&x.end&&x.end!==date?x.end:(!repeat&&x.from&&x.to?x.to:''),from=x.from||date,to=x.to||'';
  openModal('<h3>'+(editing?'일정 수정':'일정 추가')+'</h3>'+ 
    '<input class="fld" id="f-stitle" placeholder="일정 제목" maxlength="60" value="'+esc(x.title||'')+'">'+
    schedulePackMarkup(seedPacking,x.title||def.title||'')+
    '<span class="lbl">언제</span><div class="seg" id="f-swhen"><button data-act="schedule-when" data-v="once">한 번만</button><button data-act="schedule-when" data-v="rep">반복</button></div>'+
    '<div id="schedule-once"><div class="seg" id="f-srange"><button data-act="schedule-range" data-v="single">하루</button><button data-act="schedule-range" data-v="period">기간</button></div><div class="row"><input class="fld" type="date" id="f-date" value="'+esc(date)+'"><span class="s-enddate"'+(single?' style="display:none"':'')+'>~</span><span class="s-enddate"'+(single?' style="display:none"':'')+'><input class="fld" type="date" id="f-enddate" value="'+esc(endDate)+'"></span></div></div>'+
    '<div id="schedule-repeat"><div class="row"><input class="fld" type="date" id="f-from" value="'+esc(from)+'"><span>~</span><input class="fld" type="date" id="f-to" value="'+esc(to)+'"></div><div class="seg" id="f-sdays"></div><div class="seg"><button data-act="schedule-preset" data-v="all">매일</button><button data-act="schedule-preset" data-v="wd">평일</button><button data-act="schedule-preset" data-v="we">주말</button></div></div>'+
    '<span class="lbl">표시 방식</span><div class="seg" id="f-smode"><button data-act="schedule-mode" data-v="all">하루종일</button><button data-act="schedule-mode" data-v="time">시간별</button></div>'+
    '<div id="schedule-all"><p class="hint">하루 전체에 표시되는 일정이에요.</p></div>'+ 
    '<div id="schedule-time"><span class="lbl">시간 <em class="tphint">칸을 눌러 고르고, 끝나는 칸을 한 번 더 누르면 범위로 잡혀요</em></span><div class="tpick" id="tpick"></div><div class="row"><input class="fld" type="time" id="f-start" value="'+(x.start||'')+'"><span>~</span><input class="fld" type="time" id="f-end" value="'+(x.end||'')+'"></div></div>'+
    palHTML(M.color)+
    '<div class="acts">'+(editing?'<button class="b-del" data-act="del-schedule">삭제</button>':'')+'<button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="save-schedule">저장</button></div>');
  drawSchedule();
  schedulePackHint();
  if(!x.title)setTimeout(function(){var f=$('#f-stitle');if(f)f.focus();},50);
}
function drawSchedule(){
  document.querySelectorAll('#f-swhen button').forEach(function(b){b.classList.toggle('on',b.dataset.v===(M.repeat?'rep':'once'));});
  document.querySelectorAll('#f-srange button').forEach(function(b){b.classList.toggle('on',b.dataset.v===(M.single?'single':'period'));});
  document.querySelectorAll('#f-smode button').forEach(function(b){b.classList.toggle('on',b.dataset.v===M.mode);});
  var once=$('#schedule-once'),rep=$('#schedule-repeat'),all=$('#schedule-all'),tim=$('#schedule-time');
  if(once)once.style.display=M.repeat?'none':'';if(rep)rep.style.display=M.repeat?'':'none';
  document.querySelectorAll('.s-enddate').forEach(function(x){x.style.display=!M.repeat&&!M.single?'':'none';});
  if(all)all.style.display=M.mode==='all'?'':'none';if(tim)tim.style.display=M.mode==='time'?'':'none';
  var days=$('#f-sdays');if(days)days.innerHTML=DAYS.map(function(n,i){return '<button data-act="schedule-day" data-v="'+i+'" class="'+(M.days.indexOf(i)>=0?'on':'')+'">'+n+'</button>';}).join('');
  if(M.mode==='time')drawTpick();
}
function saveSchedule(){
  var title=$('#f-stitle').value.trim();if(!title){bad('#f-stitle');return;}
  var packing=cleanPackItems(collectSchedulePack());
  var target,source=M.mode==='all'?'allday':'event';
  if(M.repeat){
    var from=$('#f-from').value,to=$('#f-to').value||null;if(!from){bad('#f-from');return;}if(to&&to<from){bad('#f-to');return;}if(!M.days.length){$('#f-sdays').style.outline='2px solid var(--now)';return;}
    if(M.mode==='all')target={title:title,color:M.color,date:null,end:null,days:M.days.slice().sort(),from:from,to:to,packing:packing};
    else{var rs=$('#f-start').value,re=$('#f-end').value;if(!rs){bad('#f-start');return;}if(!re||toMin(re)<=toMin(rs)){bad('#f-end');return;}target={kind:'schedule',title:title,color:M.color,date:null,start:rs,end:re,days:M.days.slice().sort(),from:from,to:to,packing:packing};}
  }else{
    var date=$('#f-date').value;if(!date){bad('#f-date');return;}var endDate=!M.single?($('#f-enddate').value||''):'';if(endDate&&endDate<date){bad('#f-enddate');return;}
    if(M.mode==='all')target={title:title,color:M.color,date:date,end:endDate&&endDate!==date?endDate:null,days:null,from:null,to:null,packing:packing};
    else{var s=$('#f-start').value,e=$('#f-end').value;if(!s){bad('#f-start');return;}if(!e||toMin(e)<=toMin(s)){bad('#f-end');return;}target={kind:'schedule',title:title,color:M.color,date:endDate?null:date,start:s,end:e,days:null,from:endDate?date:null,to:endDate?endDate:null,packing:packing};}
  }
  if($('#f-pack-template')&&$('#f-pack-template').checked&&title)scheduleTemplateSave(title,packing);
  if(M.id){S.events=S.events.filter(function(x){return x.id!==M.id;});S.allday=S.allday.filter(function(x){return x.id!==M.id;});}
  target.id=M.id||uid();if(source==='allday')S.allday.push(target);else S.events.push(target);
  save();closeModal();render();
}
function openAllday(a,def){
  def=def||{};
  var x=a||{title:def.title||'',color:defCol(),date:def.date||dkey(U.date),days:null};
  M={type:'allday',id:a?a.id:null,color:x.color,mode:a?(a.days?'rep':'once'):(def.mode||'once'),days:x.days?x.days.slice():[0,1,2,3,4,5,6]};
  openModal('<h3>'+(a?'종일 일정 수정':'종일 일정 추가')+'</h3>'+
    '<input class="fld" id="f-adtitle" placeholder="예: 헬스, 영양제, 알바" maxlength="40" value="'+esc(x.title)+'">'+
    '<span class="lbl">언제</span><div class="seg" id="f-admode"><button data-act="ad-mode" data-v="once">한 번만</button><button data-act="ad-mode" data-v="rep">반복</button></div>'+
    '<div id="ad-once">'+rangeSeg('f-adrange',!x.end)+'<div class="row"><input class="fld" type="date" id="f-addate" value="'+(x.date||dkey(U.date))+'"><span class="eew" id="f-adew"'+(!x.end?' style="display:none"':'')+'><span>~</span><input class="fld" type="date" id="f-adend" value="'+(x.end||'')+'"></span></div></div>'+
    '<div id="ad-rep"><span class="lbl">적용 기간 (비우면 계속)</span><div class="row"><input class="fld" type="date" id="f-adfrom" value="'+(x.from||'')+'"><span>~</span><input class="fld" type="date" id="f-adto" value="'+(x.to||'')+'"></div><div class="seg" id="f-adays"></div><div class="seg"><button data-act="ad-preset" data-v="all">매일</button><button data-act="ad-preset" data-v="wd">평일</button><button data-act="ad-preset" data-v="we">주말</button></div></div>'+
    palHTML(x.color)+
    '<div class="acts">'+(a?'<button class="b-del" data-act="del-ad">삭제</button>':'')+'<button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="save-ad">저장</button></div>');
  drawAd();
  if(!a&&!x.title)setTimeout(function(){var f=$('#f-adtitle');if(f)f.focus();},50);
}
function drawAd(){
  document.querySelectorAll('#f-admode button').forEach(function(b){b.classList.toggle('on',b.dataset.v===M.mode);});
  $('#ad-once').style.display=M.mode==='once'?'':'none';
  $('#ad-rep').style.display=M.mode==='rep'?'':'none';
  $('#f-adays').innerHTML=DAYS.map(function(n,i){return '<button data-act="ad-day" data-v="'+i+'" class="'+(M.days.indexOf(i)>=0?'on':'')+'">'+n+'</button>';}).join('');
}
function saveAllday(){
  var t=$('#f-adtitle').value.trim();
  if(!t){bad('#f-adtitle');return;}
  var data={title:t,color:M.color,date:null,days:null,end:null,from:null,to:null};
  if(M.mode==='once'){var dt=$('#f-addate').value,de=($('#f-adew').style.display==='none')?null:($('#f-adend').value||null);if(!dt){bad('#f-addate');return;}if(de&&de<dt){bad('#f-adend');return;}data.date=dt;data.end=(de&&de!==dt)?de:null;}
  else{if(!M.days.length){$('#f-adays').style.outline='2px solid var(--now)';return;}data.days=M.days.slice().sort();data.from=$('#f-adfrom').value||null;data.to=$('#f-adto').value||null;if(data.from&&data.to&&data.to<data.from){bad('#f-adto');return;}}
  if(M.id){var a=S.allday.find(function(x){return x.id===M.id;});if(a)Object.assign(a,data);}
  else S.allday.push(Object.assign({id:uid()},data));
  save();closeModal();render();
}
function diaryTargetMinutes(){return diaryMinutes();}
function diaryMinutes(){var n=Number(S.settings.diaryMinutes||10);return [5,10,20,30].indexOf(n)>=0?n:10;}
function diaryLimitMs(){return diaryMinutes()*60000;}
function diaryFmtMs(ms,targetMin){
  var sec=Math.max(0,Math.floor(ms/1000)),m=Math.floor(sec/60),ss=sec%60,t=Number(targetMin||10),base=t*60;
  if(sec>base){var x=sec-base;return t+'m+'+Math.floor(x/60)+'m'+(x%60)+'s';}
  return m+'m'+(ss?ss+'s':'');
}
function diarySessionKey(k){var owner=(Sync&&Sync.uid)||lsGet('planner.activeUser')||'local';return 'planner.diary.session.'+owner+'.'+(k||todayKey());}
function diarySessionLoad(k){try{var x=JSON.parse(lsGet(diarySessionKey(k))||'null');if(!x||typeof x!=='object')return null;return x;}catch(e){return null;}}
function diarySessionSave(k){k=k||U.diaryDate||todayKey();var r=U.diaryRun,acc=0;if(r){acc=Number(r.acc||0)+(r.running&&!document.hidden?Math.max(0,Date.now()-Number(r.since||Date.now())):0);}try{lsSet(diarySessionKey(k),JSON.stringify({draft:U.diaryDraft||'',note:U.diaryNote||'',mood:nemoMoodValid(U.diaryMood)?U.diaryMood:'',run:r?{acc:acc,running:!!r.running}:null,resumeOnReturn:!!U.diaryResumeOnReturn,updatedAt:Date.now()}));}catch(e){}}
function diarySessionClear(k){try{localStorage.removeItem(diarySessionKey(k||U.diaryDate||todayKey()));}catch(e){}}
function diarySessionRestore(k){var x=diarySessionLoad(k);U.diaryDraft=x&&typeof x.draft==='string'?x.draft:'';U.diaryNote=x&&typeof x.note==='string'?x.note:'';U.diaryMood=x&&nemoMoodValid(x.mood)?x.mood:'';U.diaryRun=x&&x.run?{acc:Number(x.run.acc||0),since:Date.now(),running:!!x.run.running}:null;U.diaryResumeOnReturn=!!(x&&x.resumeOnReturn);if(U.diaryRun&&U.diaryResumeOnReturn){U.diaryRun.running=true;U.diaryRun.since=Date.now();U.diaryResumeOnReturn=false;diarySessionSave(k);}}
function diaryElapsed(){var r=U.diaryRun;if(!r)return 0;return r.acc+(r.running&&!document.hidden?(Date.now()-r.since):0);}
function diaryClockText(){var ms=diaryElapsed(),lim=diaryLimitMs(),left=Math.max(0,lim-ms);if(ms<=lim){var sec=Math.ceil(left/1000);return pad(Math.floor(sec/60))+':'+pad(sec%60);}var x=Math.floor((ms-lim)/1000);return '+'+pad(Math.floor(x/60))+':'+pad(x%60);}
function diaryTick(){if(M.type!=='diary')return;diaryCountUpdate();var t=$('#diary-time'),st=$('#diary-status'),lim=diaryLimitMs(),mins=diaryMinutes();if(t){var ms=diaryElapsed();t.textContent=diaryClockText();t.classList.toggle('extra',ms>lim);if(st)st.textContent=!U.diaryRun?mins+'분 타이머를 시작해도 되고 그냥 써도 돼요':(U.diaryRun.running?(ms>lim?mins+'분 완료 · 추가 시간 기록 중':'집중해서 쓰는 중'):'일시정지');}clearTimeout(U.diaryTimer);U.diaryTimer=setTimeout(diaryTick,250);}
function diaryPause(){var r=U.diaryRun;if(r&&r.running){r.acc+=Date.now()-r.since;r.running=false;}}
function diaryResume(){var r=U.diaryRun;if(r&&!r.running){r.since=Date.now();r.running=true;}}
function diaryMoodPickerHTML(){
  var moods=[['basic','기본'],['happy','행복'],['proud','뿌듯'],['sad','슬픔'],['gloomy','우울'],['angry','화남'],['sleepy','졸림']];
  var cur=nemoMoodValid(U.diaryMood)?U.diaryMood:'';
  return '<div class="diary-mood-pick"><div class="diary-mood-head"><b>오늘의 네모 기분</b><small>고르면 오늘 네모 표정에 반영돼요</small></div><div class="diary-mood-grid">'+moods.map(function(x){return '<button type="button" class="diary-mood-btn'+(cur===x[0]?' on':'')+'" data-act="diary-mood" data-v="'+x[0]+'">'+nemoSVG(x[0],'')+'<span>'+x[1]+'</span></button>';}).join('')+'</div><button type="button" class="diary-mood-auto'+(!cur?' on':'')+'" data-act="diary-mood" data-v="">선택 안 함 · 자동 표정 유지</button></div>';
}
function diaryMoodSavedHTML(mood){return nemoMoodValid(mood)?'<div class="diary-saved-mood">'+nemoSVG(mood,'')+'<span>'+esc(nemoMoodLabel(mood))+'</span></div>':'';}
function diaryHistoryHTML(){var rows=(S.diaries||[]).slice().sort(function(a,b){return b.finishedAt-a.finishedAt;}).slice(0,12);return rows.length?'<div class="diary-history"><span class="lbl">지난 일기</span>'+rows.map(function(x){var tm=new Date(x.finishedAt),d=parseKey(diaryDateKey(x));return '<div class="diary-entry"><b>'+mdTxt(d)+'</b><small>'+pad(tm.getHours())+':'+pad(tm.getMinutes())+'</small> <em>'+esc(diaryFmtMs(x.elapsed||0,x.targetMinutes||10))+'</em>'+(x.word?'<span class="diary-word">'+esc(x.word)+'</span>':'')+'<p>'+esc((x.text||'').slice(0,180))+(x.text&&x.text.length>180?'…':'')+'</p></div>';}).join('')+'</div>':'';}
function diaryDateKey(x){
  /* 일기는 '쓴 시각'이 아니라 사용자가 쓰던 플래너 날짜에 붙어요.
     5시 공부일 전환 중에도 저장된 date/studyDate가 있으면 절대 하루 전으로 밀지 않아요. */
  var sd=x&&/^\d{4}-\d{2}-\d{2}$/.test(String(x.studyDate||''))?String(x.studyDate):'';
  var explicit=x&&/^\d{4}-\d{2}-\d{2}$/.test(String(x.date||''))?String(x.date):'';
  if(sd||explicit)return sd||explicit;
  var d=new Date(Number(x&&x.finishedAt||0));
  return isNaN(d)?todayKey():studyDayKey(d);
}
function diaryForKey(k){var rows=(S.diaries||[]).filter(function(x){try{return diaryDateKey(x)===k;}catch(e){return false;}});return rows.length?rows[rows.length-1]:null;}
function diaryLibraryRows(){return (S.diaries||[]).slice().sort(function(a,b){return a.finishedAt-b.finishedAt;});}
function openDiaryLibrary(dateKey){
  var rows=diaryLibraryRows(),wanted=dateKey||todayKey(),ix=-1;
  if(rows.length){ix=rows.findIndex(function(x){return diaryDateKey(x)===wanted;});if(ix<0){for(var i=rows.length-1;i>=0;i--){if(diaryDateKey(rows[i])<=wanted){ix=i;break;}}if(ix<0)ix=rows.length-1;}}
  M={type:'diary-library',diaryIndex:ix,diaryDate:wanted};drawDiaryLibrary();
}
function diaryCalHTML(key){
  var d=parseKey(key||todayKey()), y=d.getFullYear(), m=d.getMonth(), first=new Date(y,m,1), last=new Date(y,m+1,0).getDate(), offset=first.getDay();
  var has={};diaryLibraryRows().forEach(function(x){has[diaryDateKey(x)]=1;});
  var cells='';for(var i=0;i<42;i++){var n=i-offset+1;if(n<1||n>last){cells+='<span class="diary-cal-day out"></span>';continue;}var k=y+'-'+pad(m+1)+'-'+pad(n),dow=i%7;cells+='<button type="button" class="diary-cal-day '+(dow===0?'sun ':dow===6?'sat ':'')+(k===key?'on ':'')+(has[k]?'has':'')+'" data-act="diary-cal-day" data-date="'+k+'">'+n+'</button>';}
  return '<div class="diary-cal"><div class="diary-cal-head"><button type="button" data-act="diary-cal-prev">‹</button><b>'+y+'년 '+(m+1)+'월</b><button type="button" data-act="diary-cal-next">›</button></div><div class="diary-cal-week"><span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span></div><div class="diary-cal-grid">'+cells+'</div><div class="diary-cal-foot"><button type="button" data-act="diary-cal-today">오늘</button></div></div>';
}
function drawDiaryLibrary(){
  var rows=diaryLibraryRows(),key=M.diaryDate||todayKey(),today=todayKey(),ix=-1;
  rows.forEach(function(row,i){if(diaryDateKey(row)===key&&ix<0)ix=i;});
  M.diaryIndex=ix;
  var shown=ix>=0?rows[ix]:null,date=parseKey(key),isToday=key===today,isFuture=key>today;
  var dateTitle=mdTxt(date),wordMeta=shown?String((shown.word||'기록')).trim().slice(0,12):'',countMeta=shown?String((shown.text||'').trim().length)+'글자':'';
  var book='';
  if(shown){
    book='<div class="diary-book"><div class="diary-book-inner"><div class="diary-pretty-date"><b>'+esc(dateTitle)+'</b><small class="diary-meta-line"><span class="diary-word-meta">&lt;'+esc(wordMeta)+'&gt;</span><span class="diary-count-meta">/'+esc(countMeta)+'</span></small>'+diaryMoodSavedHTML(shown.mood)+'</div>'+
      (isToday?'<div class="diary-today-saved">오늘 일기 저장됨 ✓</div>':'')+
      '<div class="diary-entry-body">'+esc(shown.text||'')+'</div>'+
      ((shown.note||'').trim()?'<div class="diary-entry-note">'+esc(shown.note||'')+'</div>':'')+
      '<div class="diary-entry-meta"><span class="diary-entry-chip">'+esc(String(shown.targetMinutes||diaryMinutes()))+'분 기록</span><span class="diary-entry-chip">'+esc(diaryFmtMs(shown.elapsed||0,shown.targetMinutes||10))+'</span></div></div></div>';
  }else if(isFuture){
    book='<div class="diary-book"><div class="diary-book-inner"><div class="diary-pretty-date"><b>'+esc(dateTitle)+'</b><small>아직 열리지 않은 날짜예요</small></div><div class="diary-empty-wrap"><div class="diary-empty-title">아직 일기장이 안 열렸어요</div><div class="diary-empty-sub">미래 날짜의 일기는 그날이 되면 열려요.</div></div></div></div>';
  }else if(isToday){
    book='<div class="diary-book"><div class="diary-book-inner"><div class="diary-pretty-date"><b>'+esc(dateTitle)+'</b><small>오늘의 기록</small></div><div class="diary-empty-wrap"><div class="diary-empty-title">오늘 날짜에는 일기를 써주세요!</div><button class="diary-cta-btn" data-act="diary-write-date" data-date="'+esc(key)+'">오늘의 '+diaryMinutes()+'분 일기쓰기</button><div class="diary-empty-sub" style="margin-top:10px">설정한 시간에 맞춰 오늘을 가볍게 기록해봐요.</div></div></div></div>';
  }else{
    book='<div class="diary-book"><div class="diary-book-inner"><div class="diary-pretty-date"><b>'+esc(dateTitle)+'</b><small>지난 기록</small></div><div class="diary-empty-wrap"><div class="diary-empty-face" aria-hidden="true"><span class="diary-point"></span><i></i></div><div class="diary-empty-title">이날은 기록이 없어요 :(</div><div class="diary-empty-sub">지나간 날은 읽기만 할 수 있어요.</div></div></div></div>';
  }
  var prevIx=-1,nextIx=-1;
  if(rows.length){
    if(ix>=0){prevIx=ix-1;nextIx=ix+1<rows.length?ix+1:-1;}
    else{
      for(var ri=0;ri<rows.length;ri++){var rk=diaryDateKey(rows[ri]);if(rk<key)prevIx=ri;else if(rk>key&&nextIx<0)nextIx=ri;}
    }
  }
  var dayNav='<div class="diary-day-nav"><button data-act="diary-day-prev">‹ 하루 전</button><span>'+esc(key)+'</span><button data-act="diary-day-next">하루 후 ›</button></div>';
  var nav=rows.length?'<div class="diary-saved-nav"><button data-act="diary-lib-prev"'+(prevIx<0?' disabled':'')+'>‹ 이전에 쓴 일기</button><button data-act="diary-lib-next"'+(nextIx<0?' disabled':'')+'>다음에 쓴 일기 ›</button></div><div class="diary-saved-hint">점이 있는 날짜는 저장된 일기가 있어요 · 버튼으로 기록만 바로 넘길 수도 있어요</div>':'';
  openModal('<div class="diary-library"><div class="diary-library-top"><button class="ibtn" data-act="close">‹</button><div><h3>일기장</h3><small>과거는 읽고 · 오늘은 쓰고 · 미래는 기다려요</small></div><button class="tbtn" data-act="diary-cal-today">오늘</button></div>'+diaryCalHTML(key)+dayNav+book+nav+'</div>');
  $('#modal').classList.add('full');
}
function diaryCalShift(delta){var d=parseKey(M.diaryDate||todayKey());d=new Date(d.getFullYear(),d.getMonth()+delta,1);M.diaryDate=dkey(d);M.diaryIndex=-1;drawDiaryLibrary();}
function diaryCalPick(k){M.diaryDate=k;var rows=diaryLibraryRows(),ix=-1;rows.forEach(function(x,i){if(diaryDateKey(x)===k&&ix<0)ix=i;});M.diaryIndex=ix;drawDiaryLibrary();}
function diaryDayShift(delta){var d=parseKey(M.diaryDate||todayKey());d.setDate(d.getDate()+delta);diaryCalPick(dkey(d));}
function diaryLibraryMove(dir){
  var rows=diaryLibraryRows();if(!rows.length)return;
  var key=M.diaryDate||todayKey(),ix=-1;
  for(var i=0;i<rows.length;i++){if(diaryDateKey(rows[i])===key){ix=i;break;}}
  var target=-1;
  if(ix>=0)target=ix+dir;
  else if(dir<0){for(var p=rows.length-1;p>=0;p--){if(diaryDateKey(rows[p])<key){target=p;break;}}}
  else{for(var n=0;n<rows.length;n++){if(diaryDateKey(rows[n])>key){target=n;break;}}}
  if(target<0||target>=rows.length)return;
  M.diaryIndex=target;M.diaryDate=diaryDateKey(rows[target]);drawDiaryLibrary();
}
function diaryLibraryGoDate(){diaryCalPick(M.diaryDate||todayKey());}
function drawDiary(dateKey){
  var targetKey=dateKey||U.diaryDate||todayKey();if(targetKey!==todayKey()){openDiaryLibrary(targetKey);return;}U.diaryDate=targetKey;M={type:'diary'};var r=U.diaryRun,mins=diaryMinutes(),isToday=targetKey===todayKey(),targetDate=parseKey(targetKey);
  openModal('<div class="diarypage"><div class="diary-head"><button class="ibtn" data-act="diary-back">‹</button><div><h3>'+mins+'분 일기</h3><small>'+(isToday?'오늘을 '+mins+'분만 적어봐요':mdTxt(targetDate)+'의 기록을 남겨요')+'</small></div></div><div class="diary-clock"><div class="diary-time" id="diary-time">'+pad(mins)+':00</div><div class="diary-status" id="diary-status">'+mins+'분 타이머를 시작해도 되고 그냥 써도 돼요</div></div><div class="diary-actions"><button class="primary" data-act="diary-toggle">'+(r&&r.running?'일시정지':r?'계속':'시작')+'</button></div><textarea class="diary-text'+(featOn('diaryRuled')?' ruled':'')+'" style="--diary-rule-color:'+diaryRuleColor()+'" id="f-diary" oninput="diaryLiveInput(this)" oncompositionend="diaryLiveInput(this)" placeholder="지금 떠오르는 생각을 그대로 써봐…">'+esc(U.diaryDraft||'')+'</textarea><div class="diary-count" id="diary-count">'+diaryCharCount(U.diaryDraft||'')+'자</div><textarea class="diary-text diary-note" id="f-diary-note" placeholder="노트 · 더 적어두고 싶은 것">'+esc(U.diaryNote||'')+'</textarea>'+diaryMoodPickerHTML()+'<button class="diary-finish" data-act="diary-finish">일기 마치기</button>'+diaryHistoryHTML()+'</div>');
  $('#modal').classList.add('full');diaryTick();setTimeout(function(){
    var x=$('#f-diary');
    if(x){
      var syncDiaryCount=function(){diaryLiveInput(x);};
      x.addEventListener('input',syncDiaryCount);
      x.addEventListener('compositionend',syncDiaryCount);
      x.addEventListener('keyup',syncDiaryCount);
      syncDiaryCount();
      x.focus();
    }
  },30);
}

function diaryRuleColor(){
  var c=String(S.settings.defColor||defCol()||'#d9846a').trim();
  var m=c.match(/^#([0-9a-f]{6})$/i);
  if(!m)return 'rgba(217,132,106,.34)';
  var n=parseInt(m[1],16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  /* 아주 연한 기본색도 흰 배경에서 실제로 보이도록 대비를 조금 확보 */
  r=Math.round(r*.82+70*.18);
  g=Math.round(g*.82+70*.18);
  b=Math.round(b*.82+70*.18);
  return 'rgba('+r+','+g+','+b+',.38)';
}

function diaryCharCount(v){v=String(v==null?'':v);try{return Array.from(v).length;}catch(e){return v.length;}}
function diaryLiveInput(el){if(el)U.diaryDraft=el.value||'';diaryCountUpdate();if(U.diaryDate)diarySessionSave(U.diaryDate);}
function diaryCountUpdate(){var x=$('#f-diary'),c=$('#diary-count'),v=x?x.value:(U.diaryDraft||'');if(c)c.textContent=diaryCharCount(v)+'자';}
function saveDiaryDraft(){var x=$('#f-diary'),n=$('#f-diary-note');if(x)U.diaryDraft=x.value;if(n)U.diaryNote=n.value;if(U.diaryDate)diarySessionSave(U.diaryDate);}
function finishDiary(){
  saveDiaryDraft();
  var text=(U.diaryDraft||'').trim(),note=(U.diaryNote||'').trim();
  if(!text&&!note){inAppToast('일기를 조금 적어줘');return;}
  diaryPause();
  var dk=U.diaryDate||todayKey(),isToday=dk===todayKey();
  U.diaryFinishPending={date:dk,text:text,note:note,mood:nemoMoodValid(U.diaryMood)?U.diaryMood:'',elapsed:U.diaryRun?U.diaryRun.acc:0,targetMinutes:diaryMinutes(),returnTo:U.diaryReturn||''};
  M={type:'diary-finish-confirm'};
  openModal('<h3>일기를 끝낼까요?</h3><p class="hint">'+(isToday?'오늘 하루를 한 단어로 남겨주세요.':'이날 하루를 한 단어로 남겨주세요.')+'</p><div class="diary-finish-word"><input class="fld" id="f-diary-word" maxlength="12" placeholder="예: 뿌듯, 몽글, 정신없음" autocomplete="off"></div><p class="hint" id="diary-finish-msg">한 단어를 입력하면 일기와 함께 저장돼요.</p><div class="acts"><button class="b-ghost" data-act="diary-finish-cancel">아니요, 더 쓸래요</button><button class="b-save" data-act="diary-finish-save">끝내기</button></div>');
  setTimeout(function(){var w=$('#f-diary-word');if(w)w.focus();},30);
}
function finishDiaryCancel(){
  var p=U.diaryFinishPending;
  if(!p){drawDiary();return;}
  U.diaryDate=p.date;U.diaryReturn=p.returnTo||'';
  U.diaryDraft=p.text||'';U.diaryNote=p.note||'';U.diaryMood=nemoMoodValid(p.mood)?p.mood:'';
  U.diaryFinishPending=null;
  drawDiary(p.date);
}
function finishDiarySave(){
  var p=U.diaryFinishPending;if(!p){closeModal();return;}
  var w=$('#f-diary-word'),word=w?(w.value||'').trim():'';
  if(!word){bad('#f-diary-word');var m=$('#diary-finish-msg');if(m)m.textContent='오늘 하루를 표현하는 한 단어를 적어주세요.';return;}
  if(/\s/.test(word)){bad('#f-diary-word');var m2=$('#diary-finish-msg');if(m2)m2.textContent='띄어쓰기 없이 딱 한 단어로 적어주세요.';return;}
  S.diaries=S.diaries||[];
  var dk=p.date||todayKey(),finishedAt=Date.now();
  S.diaries.push({id:uid(),date:dk,studyDate:dk,text:p.text||'',note:p.note||'',word:word.slice(0,12),mood:nemoMoodValid(p.mood)?p.mood:'',elapsed:Number(p.elapsed||0),targetMinutes:Number(p.targetMinutes||diaryMinutes()),finishedAt:finishedAt});
  diarySessionClear(dk);
  U.diaryDraft='';U.diaryNote='';U.diaryMood='';U.diaryRun=null;U.diaryResumeOnReturn=false;clearTimeout(U.diaryTimer);
  var ret=p.returnTo||'';U.diaryFinishPending=null;
  save();inAppToast('일기 저장 · '+word);
  if(ret==='library'){U.diaryReturn='';openDiaryLibrary(dk);}
  else{U.diaryReturn='';U.diaryDate='';closeModal();render();}
}

function openRoutine(r){
  var x=r||{text:'',days:[0,1,2,3,4,5,6]};
  M={type:'routine',id:r?r.id:null,days:x.days.slice()};
  openModal('<h3>'+(r?'반복 할 일 수정':'반복 할 일 추가')+'</h3>'+
    '<input class="fld" id="f-rtext" placeholder="예: 단어 30개 외우기" maxlength="80" value="'+esc(x.text)+'">'+
    '<span class="lbl">반복 요일</span><div class="seg" id="f-rdays"></div>'+
    '<div class="seg"><button data-act="rt-preset" data-v="all">매일</button><button data-act="rt-preset" data-v="wd">평일</button><button data-act="rt-preset" data-v="we">주말</button></div>'+
    '<div class="acts">'+(r?'<button class="b-del" data-act="del-rt">삭제</button>':'')+'<button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="save-rt">저장</button></div>');
  drawRDays();
  if(!r)setTimeout(function(){var f=$('#f-rtext');if(f)f.focus();},50);
}
function drawRDays(){
  var el=$('#f-rdays');if(!el)return;
  el.innerHTML=DAYS.map(function(n,i){return '<button data-act="rt-day" data-v="'+i+'" class="'+(M.days.indexOf(i)>=0?'on':'')+'">'+n+'</button>';}).join('');
}
function saveRoutine(){
  var text=$('#f-rtext').value.trim();
  if(!text){bad('#f-rtext');return;}
  if(!M.days.length){var el=$('#f-rdays');if(el)el.style.outline='2px solid var(--now)';return;}
  var days=M.days.slice().sort();
  if(M.id){var r=S.routines.find(function(x){return x.id===M.id;});if(r){r.text=text;r.days=days;}}
  else S.routines.push({id:uid(),text:text,days:days});
  save();closeModal();render();
}
function ringLabel(r){var d=new Date(r.at||0);return (d.getMonth()+1)+'/'+d.getDate()+' '+pad(d.getHours())+':'+pad(d.getMinutes());}
function copyText(txt,box,okMsg){
  var ok=function(){bkMsg(okMsg);};
  var fail=function(){
    /* 클립보드가 막히면 칸에 넣고 선택해서 직접 복사하게 해요 */
    if(box){box.value=txt;box.focus();box.select();try{box.setSelectionRange(0,txt.length);}catch(e){}}
    try{if(document.execCommand('copy')){ok();return;}}catch(e){}
    bkMsg('칸의 글자를 길게 눌러 전체 선택 → 복사해주세요');
  };
  try{if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(ok,fail);else fail();}catch(e){fail();}
}
function drawBackupSlots(){
  var o=bkOwner();
  var probe=[['prev',bkKeys('prev'),'undo-backup','방금 복원 전으로 되돌리기'],['logout',bkKeys('logout'),'restore-logout-backup','로그아웃 전 데이터 복원'],['lastGood',bkKeys('lastGood'),'restore-last-good','마지막 정상 상태 복원'],['remote',bkKeys('remote'),'restore-remote-backup','동기화 전 데이터 복원']];
  Promise.all(probe.map(function(p){return bkFirst(p[1]);})).then(function(recs){
    var box=$('#bk-slots');if(!box||M.type!=='backup')return;
    var html=probe.map(function(p,i){var r=recs[i],st=null;if(r)try{st=normalize(JSON.parse(r.raw));}catch(e){}if(!r||!hasPlannerData(st)||itemCount(st)<1)return '';var n=' · '+itemCount(st)+'개';return '<button class="b-ghost" data-act="'+p[2]+'">'+p[3]+(r.at?' ('+ringLabel(r)+n+')':n)+'</button>';}).join('');
    box.innerHTML=html||'<p class="hint">아직 자동으로 남은 복원 지점이 없어요.</p>';
  });
  bkRingList().then(function(rows){
    var box=$('#bk-ring');if(!box||M.type!=='backup')return;
    rows=rows.filter(function(x){return hasPlannerData(x.data)&&itemCount(x.data)>0&&(!o||!x.owner||x.owner===o);}).slice(0,12);
    if(!rows.length){box.innerHTML='';return;}
    box.innerHTML='<p class="lbl" style="margin-top:14px">이 기기 최근 자동 백업</p><div class="snaplist">'+rows.map(function(r){var n='';try{n=' · '+itemCount(normalize(r.data))+'개';}catch(e){}return '<button class="tbtn" data-act="load-ring" data-id="'+r.id+'">'+ringLabel(r)+n+'</button>';}).join('')+'</div><p class="hint">최근 복원 지점을 최대 12개 보여줘요. 기기에는 최대 24시간 분량을 보관해요.</p>';
  });
}
function openBackup(){
  M={type:'backup'};
  if(Sync.kind==='supa'&&Sync.uid){fetchCloudSnaps().then(function(dates){var box=$('#snapbox');if(box&&M.type==='backup')box.innerHTML=snapBoxHTML(dates,false);});}
  openModal('<h3>복구센터</h3><button class="b-save" style="width:100%;margin:4px 0 6px" data-act="recover-all">사라진 내용 되살리기</button><p class="hint" style="margin-bottom:14px">계정에 남은 날짜별 백업과 이 기기 백업을 전부 지금 플래너에 합쳐요. 지금 내용은 그대로 두고 빠진 것만 채워요.</p><p class="hint">‘복사’를 누르면 전체 데이터가 복사돼요. 메모 앱에 붙여넣어 보관하고, 복원할 때는 아래 칸에 붙여넣고 ‘불러오기’를 눌러요. 불러오면 지금 내용이 바뀌어요.</p>'+ 
    '<textarea class="ta" id="f-backup" spellcheck="false" placeholder="복원할 백업 글자를 여기에 붙여넣어요"></textarea>'+ 
    '<div class="acts"><button class="b-ghost" data-act="copy-backup">복사</button><button class="b-save" data-act="import-backup">불러오기</button></div>'+ 
    '<div class="acts"><button class="b-ghost" data-act="merge-backup">합치기 (지금 내용 유지)</button></div>'+ 
    '<details class="backup-auto"><summary>최근 자동 백업</summary><div id="bk-ring"><span class="hint">확인하는 중…</span></div><details class="backup-more"><summary>다른 복원 지점</summary><div class="acts" id="bk-slots" style="flex-direction:column"><span class="hint">확인하는 중…</span></div></details>'+ 
    '<div class="acts"><button class="b-ghost" data-act="save-backup-file">파일로 저장</button><label class="b-ghost fileload">파일 불러오기<input type="file" accept=".json,.txt,application/json,text/plain" id="f-bkfile" hidden></label></div>'+ 
    '</details>'+ 
    '<div id="snapbox">'+snapBoxHTML(snapDates(),Sync.kind==='supa'&&Sync.uid)+'</div>'+ 
    '<hr><p class="hint">백업 코드는 같은 내용을 짧은 글자로 바꾼 거예요. 메모 앱에 보관해도 돼요.</p>'+ 
    '<textarea class="ta" id="f-backup-code" spellcheck="false" placeholder="백업 코드를 붙여넣어요"></textarea>'+ 
    '<div class="acts"><button class="b-ghost" data-act="copy-backup-code">백업 코드 복사</button><button class="b-save" data-act="restore-backup-code">백업 코드로 복원</button></div>'+ 
    '<p class="hint" id="bk-msg" style="margin-top:10px">저장할 때마다 이 기기에 자동 백업돼요. 복원하면 지금 상태는 ‘방금 복원 전으로 되돌리기’에 보관돼요.</p>');
  drawBackupSlots();
}
function recoverAll(){
  bkMsg('백업을 모으는 중…');var t0=Date.now(),before=itemCount(S),cands=[];
  var cloud=(Sync.kind==='supa'&&Sync.uid&&Sync.sb)?Sync.sb.from('planner_snapshots').select('date,json').eq('user_id',Sync.uid).order('date',{ascending:false}).limit(200).then(function(res){(res&&res.data||[]).forEach(function(x){cands.push(x.json);});},function(){}):Promise.resolve();
  var o=bkOwner(),keys=['logout','lastGood','remote','prev'].map(function(n){return o?n+'.'+o:n;});
  var local=Promise.all(keys.map(function(k){return bkFirst([k]).then(function(rec){if(rec&&rec.raw)cands.push(rec.raw);},function(){});})).then(function(){return bkRingList().then(function(rows){rows.slice(0,40).forEach(function(x){if(x.data&&(!o||!x.owner||x.owner===o))cands.push(x.data);});});});
  var acc=(Sync.uid&&lsGet(accountKey(Sync.uid)));if(acc)cands.push(acc);
  Promise.all([cloud,local]).then(function(){
    if(!cands.length){bkMsg('합칠 백업을 찾지 못했어요');return;}
    savePrevBackup(S);
    var cur=S;cands.forEach(function(c){try{var st=typeof c==='string'?JSON.parse(c):c;if(st&&st.state)st=st.state;if(validBackupState(st))cur=mergeState(cur,normalize(st),null);}catch(e){}});
    var added=itemCount(cur)-before;
    if(added<=0){bkMsg('백업 '+cands.length+'개를 확인했어요. 빠진 항목은 없었어요');return;}
    cur.updatedAt=Math.max(Date.now(),(S.updatedAt||0)+1);S=cur;save();closeModal();render(true);
    inAppToast(added+'개를 되살렸어요');
  });
}
function bkMsg(t){var el=$('#bk-msg');if(el)el.textContent=t;}
function feedbackBody(){
  var cat=$('#f-fcat')?$('#f-fcat').value:'기타',msg=$('#f-ftext')?$('#f-ftext').value.trim():'',email=$('#f-femail')?$('#f-femail').value.trim():'';
  return '[플래너 문의]\n분류: '+cat+'\n학교: '+schoolName(S.settings.school)+' · '+(S.settings.schoolCampus||'')+'\n내용: '+(msg||'(내용 없음)')+'\n답변 받을 연락처: '+(email||'(없음)')+'\n기기: '+navigator.userAgent;
}
function feedbackMsg(t){var el=$('#feedback-msg');if(el)el.textContent=t;}
function openFeedback(){
  M={type:'feedback'};
  openModal('<h3>문의·오류 신고</h3><p class="hint">오류가 있거나 학교 정보가 잘못됐을 때 알려주세요. 정적 버전이라 내용을 복사하거나 메일 앱으로 넘겨 보내는 방식이에요.</p>'+
    '<select class="fld" id="f-fcat"><option>오류 신고</option><option>학교 정보 수정</option><option>학교 추가 요청</option><option>기능 제안</option><option>기타</option></select>'+
    '<textarea class="ta" id="f-ftext" placeholder="어떤 점이 불편했는지 적어주세요"></textarea>'+
    '<input class="fld" id="f-femail" type="email" placeholder="답변 받을 연락처 (선택)">'+
    '<p class="hint" id="feedback-msg">문의 내용을 복사한 뒤 메일이나 채팅으로 보내면 돼요.</p>'+
    '<div class="acts"><button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="feedback-copy">내용 복사</button></div>'+
    '<button class="b-ghost" style="width:100%;height:42px;margin-top:8px;border-radius:12px;font-weight:700" data-act="feedback-mail">메일 앱으로 넘기기</button>');
}
function copyFeedback(){
  var value=feedbackBody(),ok=function(){feedbackMsg('문의 내용이 복사됐어요. 메일이나 채팅에 붙여넣어 보내주세요.');};
  var fail=function(){var ta=document.createElement('textarea');ta.value=value;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.focus();ta.select();try{document.execCommand('copy');ok();}catch(e){feedbackMsg('복사가 안 돼요. 내용을 길게 눌러 직접 복사해주세요.');}ta.remove();};
  try{if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(value).then(ok,fail);else fail();}catch(e){fail();}
}
function mailFeedback(){
  var value=feedbackBody(),subject='[플래너 문의] '+($('#f-fcat')?$('#f-fcat').value:'기타');
  try{location.href='mailto:?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(value);feedbackMsg('메일 앱을 열었어요. 받는 사람을 선택해 보내주세요.');}catch(e){copyFeedback();}
}

/* ---------- 액션 ---------- */
function shift(n){
  if(U.tab==='month')U.date=addMonths(U.date,n);
  else if(U.tab==='week')U.date=addDays(U.date,7*n);
  else U.date=addDays(U.date,n);
  render(true);
}
function addTodo(scope,key,text,draftId,due,course){
  text=(text||'').trim();
  if(!text)return;
  var natural=(window.PLANON_AUTOSCHEDULE&&window.PLANON_AUTOSCHEDULE.parseNaturalMeta)?window.PLANON_AUTOSCHEDULE.parseNaturalMeta(text):null;
  if(natural&&natural.text)text=natural.text;
  var q=S.settings.smartAdd===false?{text:text}:parseQuickTodo(text),time=null,msg='';
  if(natural&&natural.due&&!due)due=natural.due;if(natural&&natural.course&&!course)course=natural.course;
  if(q.key){scope='day';key=q.key;}
  if(q.time){time=q.time;if(scope!=='day'){scope='day';key=todayKey();}}
  if(q.due&&!due)due=q.due;
  if(q.course&&!course)course=q.course;
  if(q.key||q.time||q.due||(q.course&&q.course===course&&text!==q.text))msg=quickTodoToast(q);
  S.todos.push({id:uid(),text:q.text,done:false,star:false,isCore:false,scope:scope,key:key,due:due||null,course:course||'',time:time,estimateMin:natural&&natural.estimateMin?natural.estimateMin:null,created:Date.now(),order:Date.now()});
  delete U.drafts[draftId];
  save();U.refocus=draftId;render();
  if(msg)inAppToast(msg);
}
function findTodo(id){return S.todos.find(function(t){return t.id===id;});}

var PRIVACY_URL=(window.PLANNER_CONFIG&&window.PLANNER_CONFIG.privacyUrl)||'privacy.html';
function openPrivacyPolicy(){
  try{window.open(PRIVACY_URL,'_blank','noopener');}catch(e){location.href=PRIVACY_URL;}
}
function openFriendReport(id){
  var f=FriendSync.friends.find(function(x){return x.id===id;});if(!f)return;
  M={type:'friend-report',friendId:id};
  openModal('<h3>'+esc(friendLabel(f))+'님 신고</h3><p class="hint">긴급한 위험이 있다면 앱 신고보다 먼저 경찰·응급기관 등 적절한 기관에 연락해주세요.</p>'+ 
    '<span class="lbl">신고 이유</span><select class="fld" id="f-report-reason"><option value="spam">스팸·도배</option><option value="harassment">괴롭힘·불쾌한 행동</option><option value="inappropriate">부적절한 사진·콘텐츠</option><option value="privacy">개인정보·사생활 침해</option><option value="other">기타</option></select>'+ 
    '<span class="lbl">상세 내용 <em>(선택)</em></span><textarea class="memo" id="f-report-detail" maxlength="1000" placeholder="운영자가 확인할 수 있도록 상황을 적어주세요"></textarea><p class="hint" id="report-msg"></p>'+ 
    '<div class="acts"><button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="friend-report-send" data-id="'+esc(id)+'">신고 보내기</button></div>');
}
function sendFriendReport(id){
  if(!Sync.uid||!friendDb()){friendNote('로그인 후 신고할 수 있어요');return;}
  var reason=$('#f-report-reason')?$('#f-report-reason').value:'other',detail=$('#f-report-detail')?$('#f-report-detail').value.trim().slice(0,1000):'',msg=$('#report-msg'),sb=friendDb();
  if(msg)msg.textContent='보내는 중…';
  sb.from('planner_user_reports').insert({reporter_id:Sync.uid,reported_id:id,reason:reason,details:detail}).then(function(r){
    if(r.error)throw r.error;closeModal();inAppToast('신고를 접수했어요');
  }).catch(function(e){if(msg)msg.textContent=/does not exist|schema cache/i.test(e&&e.message||'')?'신고 기능 서버 설정이 아직 필요해요. 최신 production migration을 적용해주세요.':'신고를 보내지 못했어요. 잠시 뒤 다시 시도해주세요.';});
}
function openFriendBlock(id){
  var f=FriendSync.friends.find(function(x){return x.id===id;});if(!f)return;
  M={type:'friend-block',friendId:id};
  openModal('<h3>'+esc(friendLabel(f))+'님을 차단할까요?</h3><div class="requestbox"><b>차단하면</b><small>친구 연결이 해제되고 서로의 공유 일정·시간표를 앱에서 더 이상 표시하지 않아요. 나중에 차단 목록에서 해제할 수 있어요.</small></div><p class="hint" id="block-msg"></p><div class="acts"><button class="b-ghost" data-act="close">취소</button><button class="b-del" data-act="friend-block-confirm" data-id="'+esc(id)+'">차단</button></div>');
}
function blockFriend(id){
  if(!Sync.uid)return;var sb=friendDb(),msg=$('#block-msg'),pair=[Sync.uid,id].sort(),bf=FriendSync.friends.find(function(x){return x.id===id;});rememberBlockedUser(id,bf?friendLabel(bf):'');if(msg)msg.textContent='차단하는 중…';
  var jobs=[];
  if(sb){
    jobs.push(sb.from('planner_user_blocks').upsert({blocker_id:Sync.uid,blocked_id:id},{onConflict:'blocker_id,blocked_id'}));
    jobs.push(sb.from('planner_friendships').delete().eq('user_a',pair[0]).eq('user_b',pair[1]));
    jobs.push(sb.from('planner_friend_shares').delete().eq('owner_id',Sync.uid).eq('friend_id',id));
    jobs.push(sb.from('planner_friend_data').delete().eq('owner_id',Sync.uid).eq('friend_id',id));
  }
  Promise.all(jobs).then(function(rs){var bad=(rs||[]).find(function(x){return x&&x.error;});if(bad&&bad.error&&!/planner_user_blocks|schema cache|does not exist/i.test(bad.error.message||''))throw bad.error;}).catch(function(){}).then(function(){
    FriendSync.friends=FriendSync.friends.filter(function(f){return f.id!==id;});FriendSync.incoming=(FriendSync.incoming||[]).filter(function(x){return x.owner_id!==id;});closeModal();U.settingsPage='friends';U.friendDetailId='';render(true);inAppToast('차단했어요');
  });
}
function unblockFriend(id){
  var sb=friendDb();forgetBlockedUser(id);
  var done=function(){inAppToast('차단을 해제했어요');render(true);};
  if(sb)sb.from('planner_user_blocks').delete().eq('blocker_id',Sync.uid).eq('blocked_id',id).then(done,function(){done();});else done();
}
function openDeleteAccount(){
  if(!Sync.uid){openLogin();return;}M={type:'delete-account'};
  var mail=Sync.email||'로그인된 계정';
  openModal('<h3>계정 삭제</h3><div class="card warn"><b>'+esc(mail)+'</b><p class="hint" style="margin-top:6px">지운 뒤에는 되돌릴 수 없어요.</p></div>'+ 
    '<div class="requestbox"><b>함께 지워지는 것</b><small>플래너 전체<br>클라우드 백업<br>친구 연결·초대코드<br>친구와의 약속·추억<br>약속 링크·응답</small></div>'+ 
    '<button class="tbtn" style="width:100%;height:42px;margin:0 0 12px" data-act="backup">백업 받기</button>'+ 
    '<span class="lbl">확인을 위해 <b>삭제</b>라고 정확히 입력해주세요</span><input class="fld" id="f-delete-account" autocomplete="off" autocapitalize="off" placeholder="삭제">'+ 
    '<p class="hint" id="delete-account-msg" aria-live="polite"></p><div class="acts"><button class="b-ghost" data-act="close">취소</button><button class="b-danger" id="delete-account-btn" data-act="delete-account-confirm">계정 삭제</button></div>');
}
function waitForSyncIdleForDelete(){
  return new Promise(function(resolve,reject){
    var started=Date.now();
    (function check(){
      if(!Sync.busy){resolve();return;}
      if(Date.now()-started>15000){reject(new Error('sync still busy'));return;}
      setTimeout(check,120);
    })();
  });
}
function clearDeletedAccountIndexedDB(uid0){
  return bkOpen().then(function(db){
    if(!db)return;
    return new Promise(function(resolve){
      try{
        var tx=db.transaction(['kv','snapshots'],'readwrite'),kv=tx.objectStore('kv'),sn=tx.objectStore('snapshots');
        var generic={logout:1,lastGood:1,remote:1,prev:1,'current.local':1};
        var q=kv.openCursor();
        q.onsuccess=function(){var c=q.result;if(!c)return;var k=String(c.key||'');if(k.indexOf(uid0)>=0||generic[k])c.delete();c.continue();};
        var qs=sn.openCursor();
        qs.onsuccess=function(){var c=qs.result;if(!c)return;var v=c.value||{};if(String(v.owner||'')===String(uid0))c.delete();c.continue();};
        tx.oncomplete=function(){resolve();};tx.onerror=tx.onabort=function(){resolve();};
      }catch(e){resolve();}
    });
  }).catch(function(){});
}
function clearDeletedAccountLocal(uid0){
  try{
    var del=[];
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);if(!k)continue;
      if(k.indexOf('planner.')===0&&k.indexOf(uid0)>=0)del.push(k);
    }
    del.forEach(function(k){localStorage.removeItem(k);});
    localStorage.removeItem('planner.activeUser');
    localStorage.removeItem('planner.syncedUser');
    localStorage.removeItem('planner.friendCode.'+uid0);
    localStorage.removeItem('planner.codeSync.'+uid0);
    localStorage.removeItem('planner.privateKey.'+uid0);
    S=defaults();PREF_H=prefHash(S);
    localStorage.setItem(KEY,JSON.stringify(S));storageOK=true;
  }catch(e){S=defaults();PREF_H=prefHash(S);}
  return clearDeletedAccountIndexedDB(uid0);
}
function setDeleteAccountBusy(on){
  var btn=$('#delete-account-btn'),inp=$('#f-delete-account'),modal=$('#modal');
  if(btn){btn.disabled=!!on;btn.textContent=on?'지우는 중…':'계정 삭제';}
  if(inp)inp.disabled=!!on;
  if(modal)[].slice.call(modal.querySelectorAll('[data-act="backup"],[data-act="close"]')).forEach(function(x){x.disabled=!!on;});
}
function deleteAccountError(e){
  var raw=e&&e.message||String(e||'');
  if(/function.*does not exist|schema cache|planner_delete_my_account/i.test(raw))return userMsg('계정 삭제 서버 설정이 아직 필요해요.','최신 production migration을 적용해주세요');
  if(/sync still busy/i.test(raw))return userMsg('동기화가 끝나지 않아 삭제를 시작하지 않았어요. 인터넷 연결을 확인하고 다시 시도해주세요.',raw);
  return userMsg('삭제하지 못했어요. 잠시 뒤 다시 시도해주세요.',raw);
}
function deleteAccountNow(){
  var inp=$('#f-delete-account'),msg=$('#delete-account-msg');
  if(!inp||inp.value.trim()!=='삭제'){if(msg)msg.textContent='“삭제”라고 정확히 입력해주세요.';if(inp)inp.classList.add('bad');return;}
  if(!Sync.sb||!Sync.uid){if(msg)msg.textContent='로그인 상태를 확인해주세요.';return;}
  var uid0=Sync.uid,oldPulled=Sync.pulled;
  if(msg)msg.textContent='계정과 데이터를 삭제하는 중…';setDeleteAccountBusy(true);
  Sync.deleting=true;clearTimeout(Sync.timer);Sync.timer=null;clearTimeout(window.__fpT);Sync.dirty=false;Sync.db=null;Sync.on=false;
  waitForSyncIdleForDelete().then(function(){
    return Sync.sb.rpc('planner_delete_my_account');
  }).then(function(r){
    if(r&&r.error)throw r.error;
    return clearDeletedAccountLocal(uid0);
  }).then(function(){
    return Sync.sb.auth.signOut({scope:'local'}).catch(function(){return null;});
  }).then(function(){
    Sync.db=null;Sync.on=false;Sync.pulled=false;Sync.loading=false;Sync.uid=null;Sync.email='';Sync.busy=false;Sync.dirty=false;
    FriendSync.loaded=false;FriendSync.invitesIn=[];FriendSync.invitesOut=[];FriendSync.busyMap={};FriendSync.lastBusy='';FriendSync.code='';FriendSync.friends=[];FriendSync.incoming=[];FriendSync.requests=[];FriendSync.shared=[];FriendSync.memories=[];FriendSync.shown={};
    Sync.deleting=false;closeModal();U.tab='day';U.settingsPage='';U.date=studyDayDate(new Date());render(true);inAppToast('계정을 삭제했어요');
  }).catch(function(e){
    Sync.deleting=false;Sync.db=supaAdapter(Sync.sb,uid0);Sync.path='planner';Sync.uid=uid0;Sync.on=true;Sync.pulled=oldPulled!==false;Sync.busy=false;Sync.dirty=false;setDeleteAccountBusy(false);if(msg)msg.textContent=deleteAccountError(e);scheduleSync();
  });
}
function signOutSafely(openOther){
  var owner=Sync.uid||lsGet('planner.activeUser');
  saveLogoutBackup(owner,S);
  save();
  clearTimeout(Sync.timer);Sync.timer=null;
  clearTimeout(window.__fpT);
  var jobs=[];
  if(Sync.db)jobs.push(Promise.resolve(Sync.kind==='supa'&&!Sync.pulled?pull():null).then(function(){return push();}).catch(function(){}));
  if(friendDb())jobs.push(Promise.resolve(FriendSync.loaded?null:friendLoad()).then(function(){return friendPush();}).catch(function(){}));
  Promise.all(jobs).then(function(){return Sync.sb.auth.signOut();}).then(function(){
    lsSet('planner.syncedUser','');
    if(openOther)openLogin('다른 아이디로 로그인해주세요');
  }).catch(function(){if(openOther)openLogin('다른 아이디로 로그인해주세요');});
}
function act(a,e){
  var id=a.dataset.id,name=a.dataset.act;
  switch(name){
    case 'tab':if(a.dataset.tab==='friends'&&U.tab==='friends')U.friendsPage='';U.tab=a.dataset.tab;render(true);break;
    case 'prev':shift(-1);break;
    case 'next':shift(1);break;
    case 'today':U.date=studyDayDate(new Date());render(true);break;
    case 'open-day':U.date=parseKey(a.dataset.date);U.tab='day';render(true);break;
    case 'add-event':{
      var now=new Date(),h=(dkey(U.date)===todayKey())?Math.min(Math.max(now.getHours()+1,9),22):9;
      openEvent(null,{date:dkey(U.date),start:pad(h)+':00',end:pad(h+1)+':00'});break;
    }
    case 'add-schedule':openSchedule(null,{date:a.dataset.date||dkey(U.date)});break;
    case 'add-appointment':{
      if(S.settings.showMeetMaker===false){inAppToast('설정 → 생활 기록에서 약속 잡기를 켤 수 있어요');break;}
      openAppointment(null,{date:a.dataset.date});break;
    }
    case 'add-block':openBlock(null,{day:Math.min(dow(U.date),4)});break;
    case 'global-search':openGlobalSearch();break;
    case 'open-backup':openBackup();break;
    case 'undo-delete':undoLastDelete();break;
    case 'global-result':openGlobalResult(a);break;
    case 'view-event-detail':{var ve=S.events.find(function(x){return x.id===id;});if(ve)openEventDetail(ve,a.dataset.date||'');break;}
    case 'view-ad-detail':{var va=S.allday.find(function(x){return x.id===id;});if(va)openScheduleDetail(va,'allday',a.dataset.date||'');break;}
    case 'edit-event':{var ev=S.events.find(function(x){return x.id===id;});if(ev)(ev.kind==='appointment'?openAppointment:(ev.kind==='schedule'||ev.days||ev.from?openSchedule:openEvent))(ev);break;}
    case 'view-block':{var vb=S.classes.find(function(x){return x.id===id;});if(vb)openBlockDetail(vb,a.dataset.date||'');break;}
    case 'edit-block':{var b=S.classes.find(function(x){return x.id===id;});if(b)openCourse(b.name);break;}
    case 'edit-block-direct':{var bd=S.classes.find(function(x){return x.id===id;});if(bd)openBlock(bd,null,a.dataset.date);break;}
    case 'toggle-weekend':S.settings.weekend=!S.settings.weekend;save();render();break;
    case 'week-export':exportWeeklyImage();break;
    case 'wallpaper-phone':exportTimetableWallpaper('phone');break;
    case 'wallpaper-pad':exportTimetableWallpaper('pad');break;
    case 'week-print':printWeekly();break;
    case 'add-at':{var ah=Number(a.dataset.h);openEvent(null,{date:a.dataset.date,start:pad(ah)+':00',end:pad(Math.min(ah+1,23))+':'+(ah>=23?'59':'00')});break;}
    case 'open-login':openLogin();break;
    case 'signup-mode':switchAuthMode(true);break;
    case 'login-mode':switchAuthMode(false);break;
    case 'toggle-password':togglePassword(a.dataset.target,a);break;
    case 'save-profile':saveProfile();break;
    case 'save-profile-name':saveProfileName();break;
    case 'save-home-station':saveHomeStation();break;
    case 'clear-home-station':clearHomeStation();break;
    case 'profile-crop-save':saveProfileCrop();break;
    case 'profile-photo-remove':S.settings.profilePhoto='';save();friendPush().then(function(){friendNote('프로필 사진을 삭제했어요');render();});break;
    case 'friend-copy-code':friendCopyCode();break;
    case 'friend-add':friendAdd($('#f-friend-code')?$('#f-friend-code').value:'');break;
    case 'friend-pin':toggleFriendPin(id);break;
    case 'friend-detail':U.friendDetailId=id;U.tab='friends';U.friendsPage='detail';U.settingsPage='';render(true);break;
    case 'friends-home':U.friendsPage='';render(true);break;
    case 'friend-view-planner':openFriendPlanner(id);break;
    case 'friend-manage':openFriendManage(id);break;
    case 'cheer-open':openCheerMessage(id);break;
    case 'cheer-send':sendCheerMessage(id);break;
    case 'friend-share-preview':openFriendSharePreview(id);break;
    case 'friend-report':openFriendReport(id);break;
    case 'friend-report-send':sendFriendReport(id);break;
    case 'friend-block':openFriendBlock(id);break;
    case 'friend-block-confirm':blockFriend(id);break;
    case 'friend-unblock':unblockFriend(id);break;
    case 'friend-memories':openFriendMemories(id);break;
    case 'friend-meet':openFriendMeet(id);break;
    case 'home-flash-meet':if(S.settings.showMeetMaker===false){inAppToast('설정 → 생활 기록에서 약속 잡기를 켤 수 있어요');break;}openFriendMeet(id,{date:a.dataset.k,start:Number(a.dataset.s),end:Number(a.dataset.e),what:'번개 약속'});break;
    case 'meet-cell':meetTap(a.dataset.k,Number(a.dataset.m));break;
    case 'meet-week':{var nw=addDays(M.week,7*Number(a.dataset.v));if(!M.minWeek||nw>=M.minWeek){M.week=nw;drawMeet();var gg=document.querySelector('#meetbox .meetgrid');if(gg)gg.scrollTop=0;}break;}
    case 'meet-activity':
      b.classList.toggle('on');break;
    case 'task-person-toggle':
      var tid=b.dataset.task,uid=b.dataset.uid;M.taskAssign=M.taskAssign||{};M.taskAssign[tid]=M.taskAssign[tid]||[];var qi=M.taskAssign[tid].indexOf(uid);if(qi>=0)M.taskAssign[tid].splice(qi,1);else M.taskAssign[tid].push(uid);refreshTaskAssign();break;
    case 'meet-checklist-refresh':
      refreshTaskAssign();bindTaskDrag();break;
    case 'group-check':
      var ev=S.events.find(function(e){return e.sharedRequestId===b.dataset.rid||(e.groupRequestIds||[]).indexOf(b.dataset.rid)>=0;});
      if(ev){var ck=checklistClean(ev.checklist||[]),it=ck.find(function(x){return x.id===b.dataset.id;});if(it){it.doneBy=it.doneBy||[];var q=it.doneBy.indexOf(Sync.uid);if(q>=0)it.doneBy.splice(q,1);else it.doneBy.push(Sync.uid);ev.checklist=ck;updateSharedAppointment(ev).then(function(){render();});}}break;
    case 'meet-top-slot':
      if(M.type==='friend-meet'){M.sel={date:b.dataset.date,s:+b.dataset.s,e:+b.dataset.e};drawMeet();var z=$('#meet-sel');if(z)z.textContent='선택 · '+slotText(M.sel.date,M.sel.s,M.sel.e);}break;
    case 'meet-friend-toggle':
      if(M.type==='friend-meet'){var a0=M.friendIds||[M.friendId],ix=a0.indexOf(id);if(ix>=0){if(a0.length>1)a0.splice(ix,1);}else a0.push(id);M.friendIds=a0;M.friendId=a0[0];M.sel=null;redrawFriendMeetShell();}break;
    case 'meet-send':meetSend();break;
    case 'candidate-add':{var box=$('#appointment-candidates'),vals=Array.from(document.querySelectorAll('.f-place-candidate')).map(function(x){return x.value;});if(vals.length<5){vals.push('');box.innerHTML=candidateInputsHTML(vals);}break;}
    case 'candidate-remove':{var bx=$('#appointment-candidates'),vs=Array.from(document.querySelectorAll('.f-place-candidate')).map(function(x){return x.value;});vs.splice(Number(a.dataset.i),1);bx.innerHTML=candidateInputsHTML(vs);break;}
    case 'request-candidate-toggle':{var v=a.dataset.v,ar=M.requestCandidateSelections||(M.requestCandidateSelections=[]),ix=ar.indexOf(v);if(ix>=0)ar.splice(ix,1);else ar.push(v);a.classList.toggle('on',ix<0);a.textContent=(ix<0?'✓ ':'')+v;break;}
    case 'place-decide-open':openPlaceDecision(id);break;
    case 'candidate-toggle':{var cv=a.dataset.v,ca=M.selected||(M.selected=[]),ci=ca.indexOf(cv);if(ci>=0)ca.splice(ci,1);else ca.push(cv);drawPlaceDecision();break;}
    case 'candidate-new':{var cn=$('#f-cand-new'),cvv=cn?normalizePlaceText(cn.value):'';if(!cvv){if(cn)cn.classList.add('bad');break;}if(!M.added)M.added=[];M.added.push(cvv);if(M.selected.indexOf(cvv)<0)M.selected.push(cvv);drawPlaceDecision();break;}
    case 'lk-new':openLinkCreate();break;
    case 'lk-list':openLinkList();linkLoad();break;
    case 'lk-days':M.days=Number(a.dataset.v);document.querySelectorAll('#lk-days button').forEach(function(b){b.classList.toggle('on',b===a);});break;
    case 'lk-create':createLink();break;
    case 'lk-copy':copyLink(id);break;
    case 'lk-share':shareLink(id);break;
    case 'lk-detail':openLinkDetail(id);break;
    case 'lk-delete':if(armed(a))deleteLink(id);break;
    case 'lk-ocell':linkOwnerTap(a.dataset.k,Number(a.dataset.m));break;
    case 'lk-best':M.sel={date:a.dataset.k,s:Number(a.dataset.s),e:Number(a.dataset.e),step:2};M.tap=null;var bw=linkDays(LinkSync.links.find(function(x){return x.token===M.token;}).payload).indexOf(a.dataset.k);M.week=Math.max(0,Math.floor(bw/7));drawLinkDetail();break;
    case 'lk-confirm':confirmLink();break;
    case 'lk-week':if(U.guest){U.guest.week=Math.max(0,(U.guest.week||0)+Number(a.dataset.v));var nm0=$('#lk-name');if(nm0)U.guest.name=nm0.value;guestDrawGrid();}else if(M.type==='link-detail'){M.week=Math.max(0,M.week+Number(a.dataset.v));drawLinkDetail();}break;
    case 'lk-cell':{if(a.getAttribute('aria-disabled'))break;var gk=a.dataset.k+'|'+a.dataset.m,G=U.guest;if(!G)break;if(G.mine[gk])delete G.mine[gk];else G.mine[gk]=1;G.sent=false;a.classList.toggle('pick',!!G.mine[gk]);a.classList.remove('heat');var gm=$('#lk-gmsg'),gc=Object.keys(G.mine).length;if(gm)gm.textContent=gc?gc+'칸 골랐어요':'';break;}
    case 'lk-send':guestSend();break;
    case 'lk-leave':guestLeave();break;
    case 'lk-add-mine':guestAddMine();break;
    case 'report-open':openMemoryReport(id);break;
    case 'report-period':openMemoryReport(M.friendId,a.dataset.v);break;
    case 'report-save':saveReport();break;
    case 'mem-photo-clear':M.mphoto='';drawFriendMemories();break;
    case 'origin-grid-toggle':U.originGridOpen=!U.originGridOpen;render();break;
    case 'origin-grid-day':U.originGridDay=Number(a.dataset.day);U.originGridOpen=true;render();break;
    case 'origin-grid-cell':openOriginHourEditor(Number(a.dataset.day),Number(a.dataset.hour));break;
    case 'origin-hour-save':saveOriginHour(a.dataset.scope||'week',false);break;
    case 'origin-hour-default':{var od=$('#f-origin-hour');if(od)od.value=(S.settings.homeStation||'').trim();inAppToast('기본 출발지를 넣었어요. 이번 주만/항상 중 하나를 눌러 저장해줘');break;}
    case 'origin-rule-add':{
      var rows=S.settings.originRules||[];
      rows.push({id:uid(),from:'08:00',to:'12:00',origin:'',days:[0,1,2,3,4]});S.settings.originRules=rows;save();render();break;}
    case 'origin-rule-del':{
      S.settings.originRules=(S.settings.originRules||[]).filter(function(r){return r.id!==id;});save();render();break;}
    case 'origin-day':{
      var rr=(S.settings.originRules||[]).find(function(r){return r.id===id;}),dv=Number(a.dataset.v);
      if(rr){rr.days=Array.isArray(rr.days)?rr.days:[0,1,2,3,4,5,6];var ix=rr.days.indexOf(dv);if(ix>=0&&rr.days.length>1)rr.days.splice(ix,1);else if(ix<0)rr.days.push(dv);save();render();}break;}
    case 'origin-override-add':{
      var week=currentWeekDates(),tk=todayKey(),date=week.indexOf(tk)>=0?tk:week[0];
      S.settings.originWeekOverrides=S.settings.originWeekOverrides||[];
      S.settings.originWeekOverrides.push({id:uid(),date:date,from:'08:00',to:'12:00',origin:''});save();render();break;}
    case 'origin-override-del':{
      S.settings.originWeekOverrides=(S.settings.originWeekOverrides||[]).filter(function(r){return r.id!==id;});save();render();break;}
    case 'home-current':requestHomeStationCandidates();break;
    case 'home-station-pick':{var st=a.dataset.st||'',el=$('#f-home-station');if(el)el.value=st;S.settings.homeStation=st;save();setProfileSavedStatus('#home-station-status','저장됨 ✓ · '+st);var gb=$('#home-geo-cands');if(gb)gb.innerHTML='';var gm=$('#home-geo-msg');if(gm)gm.textContent='선택한 기본 출발지 · '+st;inAppToast(st+'을 기본 출발지로 저장했어요');if(typeof friendPush==='function')friendPush().catch(function(){});break;}
    case 'lk-current':
      requestNearestStation(function(st){var el=$('#f-lk-origin');if(el)el.value=st;},$('#lk-geo-msg'));break;
    case 'guest-current':
      requestNearestStation(function(st){var el=$('#lk-origin');if(el)el.value=st;if(U.guest)U.guest.origin=st;},$('#guest-geo-msg'));break;
    case 'lk-place-pick':
      if(M.type==='link-detail'){var ll=LinkSync.links.find(function(x){return x.token===M.token;});if(ll){ll.payload=ll.payload||{};ll.payload.place=a.dataset.st;ll.payload.placeInfo={kind:'station',station:a.dataset.st};var db=friendDb();if(db)db.from('planner_meet_links').update({payload:ll.payload,updated_at:new Date().toISOString()}).eq('token',ll.token).then(function(r){if(r.error)throw r.error;inAppToast(a.dataset.st+'을 약속 장소로 저장했어요');}).catch(function(){inAppToast('장소 저장에 실패했어요');});drawLinkDetail();}}break;
    case 'place-reco-toggle':
      var prp=$('#place-reco-panel');if(prp){prp.style.display=prp.style.display==='none'?'block':'none';}break;
    case 'place-reco-run':
      document.querySelectorAll('[data-place-origin]').forEach(function(x){var i=+x.dataset.placeOrigin;if(M.placePeople&&M.placePeople[i])M.placePeople[i].origin=x.value;});
      var rr=$('#place-reco-results');if(rr)rr.innerHTML=placeRecoResultsHTML();break;
    case 'place-reco-pick':
      var st=a.dataset.st;M.pp=ppNew({kind:'station',station:st},{allowUndecided:true,friendId:M.friendId,future:true});var pp=$('#pp');if(pp)pp.innerHTML=ppHTML(M.pp);var pc=$('#appointment-candidates');if(pc)pc.style.display='none';friendNote(st+'을 약속 장소로 골랐어요');break;
    case 'pp-mode':case 'pp-region':case 'pp-tab':case 'pp-city':case 'pp-district':case 'pp-station':case 'pp-clear':case 'pp-pick':ppAct(name,a);break;
    case 'candidate-save':saveCandidateSelection();break;
    case 'candidate-final':finalizeCandidate(a.dataset.v);break;
    case 'postmeet-yes':postMeetAnswer(id,true);break;
    case 'postmeet-no':postMeetAnswer(id,false);break;
    case 'day-full-view':{var dk0=a.dataset.date||dkey(U.date);if(dayCloseCard(dk0)){inAppToast('마감한 기록은 고칠 수 없어요');U.dayFullView='';render(true);break;}U.dayFullView=dk0;render(true);break;}
    case 'day-closed-view':U.dayFullView='';render(true);break;
    case 'postmeet-local-yes':postMeetLocalAnswer(id,true);break;
    case 'postmeet-local-no':postMeetLocalAnswer(id,false);break;
    case 'appointment-counter':counterAppointment();break;
    case 'friend-notify':friendNotifyToggle();if(M.type==='notices')setTimeout(drawNotices,400);break;
    case 'open-notices':openNotices();break;
    case 'notice-go':closeModal();U.tab='day';U.date=parseKey(a.dataset.v);render(true);break;
    case 'notice-clear':S.settings.notices=[];save();drawNotices();break;
    case 'friend-notify-later':S.settings.friendNotifyAsked=1;save();render();break;
    case 'meet-dur':M.dur=Number(a.dataset.v);drawMeet();break;
    case 'meet-pick':{var pk=a.dataset.k;M.sel={date:pk,s:Number(a.dataset.s),e:Number(a.dataset.e),step:2};M.week=weekMon(parseKey(pk));M.meetMsg='';var g0=document.querySelector('#meetbox .meetgrid');if(g0)g0.scrollTop=0;var bx=$('#meetbox');if(bx){bx.innerHTML='';}drawMeet();break;}
    case 'mem-from-appt':{var me=S.events.find(function(x){return x.sharedRequestId===id;});if(!S.settings.memAsked)S.settings.memAsked={};S.settings.memAsked[id]=1;save();render();if(me)openFriendMemories(me.friendId,{date:me.date,info:me.placeInfo,place:me.place,what:me.what});break;}
    case 'mem-nudge-off':if(!S.settings.memAsked)S.settings.memAsked={};S.settings.memAsked[id]=1;save();render();break;
    case 'appointment-open':{var rq=FriendSync.requests.find(function(x){return x.id===id;});if(rq){closeModal();openAppointmentRequest(rq);}break;}
    case 'appointment-to-meet':{var af=$('#f-afriend')?$('#f-afriend').value:'';if(!af){var am=$('#appointment-msg');if(am)am.textContent='위에서 친구를 먼저 골라주세요';break;}var apl=ppInfo(M.pp),awh=$('#f-awhat').value.trim(),adt=$('#f-date').value;closeModal();openFriendMeet(af,{info:apl,what:awh,date:adt});break;}
    case 'friend-invite-accept':friendInviteRespond(id,true);break;
    case 'friend-invite-decline':friendInviteRespond(id,false);break;
    case 'friend-invite-cancel':friendInviteCancel(id);break;
    case 'friend-toggle-share':{var inPrev=M.type==='friend-share-preview';friendToggle(id,a.dataset.mode).then(function(ok){if(!ok)return;if(inPrev&&M.type==='friend-share-preview'&&M.friendId===id)openFriendSharePreview(id);else if(!M.type)render();});break;}
    case 'friend-remove':if(armed(a))friendRemove(id);break;
    case 'save-friend-memory':saveFriendMemory();break;
    case 'memory-appointment':{var mmWhat=$('#f-mwhat')?$('#f-mwhat').value.trim():'',memInfo=ppInfo(M.pp),memFriend=M.friendId;closeModal();openFriendMeet(memFriend,{info:memInfo,what:mmWhat});break;}
    case 'appointment-accept':respondAppointmentRequest(true);break;
    case 'appointment-decline':respondAppointmentRequest(false);break;
    case 'set-topn':S.settings.topN=Number(a.dataset.v);save();render();break;
    case 'toggle-home-school':S.settings.showSchoolLinks=!featOn('showSchoolLinks');save();render();break;
    case 'toggle-feat':if(/^(showSchoolLinks|showMemo|showLog|showDiary|diaryRuled)$/.test(id||'')){S.settings[id]=!featOn(id);save();render();}break;
    case 'toggle-weekly-review':S.settings.showWeeklyReview=S.settings.showWeeklyReview===false?true:false;save();render();break;
    case 'toggle-morning-brief':toggleMorningBriefing();break;
    case 'toggle-lite':S.settings.liteHome=!S.settings.liteHome;save();render();break;
    case 'toggle-home-todo':S.settings.showNextTodo=S.settings.showNextTodo===false;save();render();break;
    case 'toggle-todo-tab':S.settings.showTodoTab=S.settings.showTodoTab===false;if(S.settings.showTodoTab===false&&U.tab==='todo')U.tab='day';save();render(true);break;
    case 'toggle-location-permission':requestLocationPermission(!locationPermissionOn(),function(){render();});break;
    case 'toggle-meet-maker':S.settings.showMeetMaker=S.settings.showMeetMaker===false;save();render();break;
    case 'open-mode-switch':openModeSwitch();break;
    case 'switch-mode':{var mv=a.dataset.v;closeModal();switchPlannerMode(mv);break;}
    case 'onboard-mode':M.plannerMode=a.dataset.v||'university';drawOnboard();break;
    case 'set-diary-minutes':S.settings.diaryMinutes=Number(a.dataset.v)||10;save();render();break;
    case 'toggle-top-show':S.settings.topShow=S.settings.topShow===false;save();render();break;
    case 'top-up':moveTopItem(a.dataset.id,-1);break;
    case 'top-down':moveTopItem(a.dataset.id,1);break;
    case 'set-caldd':S.settings.calDday=a.dataset.v;save();render();break;
    case 'exview':S.settings.examView=a.dataset.v;save();render();break;
    case 'esem':{var dv=Number(a.dataset.v),o=U.esem;if(dv>0){U.esem=o.t===1?{y:o.y,t:2}:{y:o.y+1,t:1};}else{U.esem=o.t===2?{y:o.y,t:1}:{y:o.y-1,t:2};}render();break;}
    case 'rsel':{var sg=a.dataset.g,one=a.dataset.v==='1';document.querySelectorAll('#'+sg+' button').forEach(function(b){b.classList.toggle('on',b===a);});
      var wrap=sg==='f-erange'?$('#f-eew'):$('#f-adew');if(wrap)wrap.style.display=one?'none':'';if(sg==='f-erange')M.single=one;break;}
    case 'toggle-holi':S.settings.holiOff=!S.settings.holiOff;save();render();break;
    case 'set-defcolor':{var activeTheme=S.settings.theme||lsGet('planner.theme')||'auto',sysDark=!!(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(activeTheme==='dark'||(activeTheme==='auto'&&sysDark))break;var dc2=a.dataset.v;S.settings.defColor=dc2;lsSet('planner.defColor',dc2);applyDefaultColorToPlanner();save();applyTheme();render();break;}
    case 'tp':{if(a.classList.contains('busy'))break;var th=Number(a.dataset.h);
      if(M.tpA!=null&&th>=M.tpA){$('#f-start').value=pad(M.tpA)+':00';$('#f-end').value=th>=23?'23:59':pad(th+1)+':00';M.tpA=null;}
      else{M.tpA=th;$('#f-start').value=pad(th)+':00';$('#f-end').value=th>=23?'23:59':pad(th+1)+':00';}
      $('#f-start').classList.remove('bad');$('#f-end').classList.remove('bad');drawTpick();break;}
    case 'skip-once':case 'unskip-once':{var sc=S.classes.find(function(x){return x.id===id;});if(sc){var dkk=a.dataset.date;sc.skip=(sc.skip||[]).filter(function(z){return z!==dkk;});if(name==='skip-once')sc.skip.push(dkk);save();closeModal();render();}break;}
    case 'add-dd':openDD(null,{date:a.dataset.date});break;
    case 'view-dd':{var dv=S.ddays.find(function(y){return y.id===id;});if(dv)openDDDetail(dv);break;}
    case 'edit-dd':{var dx=S.ddays.find(function(y){return y.id===id;});if(dx)openDD(dx);break;}
    case 'save-dd':saveDD();break;
    case 'dd-mode':M.mode=a.dataset.v;drawDD();break;
    case 'dd-cat':M.category=a.dataset.v||'other';drawDD();break;
    case 'del-dd':if(armed(a)){var did=M.id;S.ddays=S.ddays.filter(function(y){return y.id!==did;});save();closeModal();render();}break;
    case 'open-day-close':openDayClose();break;
    case 'save-day-close':saveDayClose();break;
    case 'exam-prep-auto':{var box=$('#exam-prep'),add=box&&box.querySelector('.exam-prep-add'),course=$('#f-ecourse')?$('#f-ecourse').value:'',kind=M.kind||'시험',range=$('#f-erange-text')?$('#f-erange-text').value.trim():'',mats=$('#f-ematerials')?$('#f-ematerials').value.trim():'';var vals=[];if(range)vals.push(range+' 복습');else vals.push('시험 범위 확인');if(mats)vals.push(mats+' 정리');else vals.push('PPT·필기 정리');vals.push((course&&course!=='기타'?course+' ':'')+'핵심 내용 복습');vals.push('예상문제 풀기');vals.push(kind+' 전 최종 복습');var existing=[].slice.call(document.querySelectorAll('[data-prep-text]')).map(function(i){return i.value.trim();});vals.forEach(function(v){if(existing.indexOf(v)>=0)return;var rid=uid(),lab=document.createElement('label');lab.className='exam-prep-row';lab.innerHTML='<input type="checkbox" data-prep-id="'+esc(rid)+'"><input type="text" data-prep-text="'+esc(rid)+'" value="'+esc(v)+'"><button type="button" data-act="exam-prep-del" data-id="'+esc(rid)+'">×</button>';box.insertBefore(lab,add);});break;}
    /* (중복이던 두 번째 exam-prep-auto 케이스 제거: 앞 케이스에서 break 되어 실행된 적 없음) */
    case 'exam-prep-add':{var pi=$('#f-prep-new'),pv=pi&&pi.value.trim();if(pv){var box=$('#exam-prep'),add=box&&box.querySelector('.exam-prep-add'),rid=uid(),lab=document.createElement('label');lab.className='exam-prep-row';lab.innerHTML='<input type="checkbox" data-prep-id="'+esc(rid)+'"><input type="text" data-prep-text="'+esc(rid)+'" value="'+esc(pv)+'"><button type="button" data-act="exam-prep-del" data-id="'+esc(rid)+'">×</button>';box.insertBefore(lab,add);pi.value='';}break;}
    case 'exam-prep-del':{var pr=a.closest('.exam-prep-row');if(pr)pr.remove();break;}
    case 'settings-home':U.settingsPage='';render();break;
    case 'settings-profile':U.settingsPage='profile';render();break;
    case 'settings-friends':U.tab='settings';U.settingsPage='friends';U.friendsPage='';render(true);break;
    case 'settings-school':U.settingsPage='school';render();break;
    case 'settings-life':U.settingsPage='life';render();break;
    case 'settings-screen':U.settingsPage='screen';render();break;
    case 'settings-recipes':U.settingsPage='recipes';render();break;
    case 'recipe-add':openRecipe(null);break;
    case 'recipe-open':openRecipe(id);break;
    case 'recipe-fav-toggle':M.recipeFavorite=!M.recipeFavorite;a.classList.toggle('on',M.recipeFavorite);a.textContent=M.recipeFavorite?'★ 저장됨':'☆ 추가';break;
    case 'recipe-save':saveRecipe();break;
    case 'recipe-delete':deleteRecipe(a);break;
    case 'settings-account':U.settingsPage='account';render();break;
    case 'open-privacy':openPrivacyPolicy();break;
    case 'delete-account-open':openDeleteAccount();break;
    case 'delete-account-confirm':deleteAccountNow();break;
    case 'settings-data':U.settingsPage='data';render();break;
    case 'settings-support':U.settingsPage='support';render();break;
    case 'open-diary-library':openDiaryLibrary();break;
    case 'diary-lib-prev':diaryLibraryMove(-1);break;
    case 'diary-lib-next':diaryLibraryMove(1);break;
    case 'diary-lib-date':diaryLibraryGoDate();break;
    case 'diary-cal-prev':diaryCalShift(-1);break;
    case 'diary-cal-next':diaryCalShift(1);break;
    case 'diary-day-prev':diaryDayShift(-1);break;
    case 'diary-day-next':diaryDayShift(1);break;
    case 'diary-cal-today':diaryCalPick(todayKey());break;
    case 'diary-cal-day':diaryCalPick(a.dataset.date);break;
    case 'diary-write-date':{var writeDate=a.dataset.date||todayKey();if(writeDate!==todayKey()){inAppToast(writeDate>todayKey()?'미래의 날짜에는 아직 일기장이 안 열렸어요':'지나간 날은 읽기만 할 수 있어요');break;}if(U.diaryDate&&U.diaryDate!==writeDate)saveDiaryDraft();U.diaryDate=writeDate;U.diaryReturn='library';diarySessionRestore(writeDate);drawDiary(writeDate);break;}
    case 'open-diary':{saveDiaryDraft();var todayDiary=todayKey();U.diaryDate=todayDiary;U.diaryReturn='home';diarySessionRestore(todayDiary);drawDiary(todayDiary);break;}
    case 'diary-back':{saveDiaryDraft();var wasRunning=!!(U.diaryRun&&U.diaryRun.running);if(wasRunning){diaryPause();U.diaryResumeOnReturn=true;}else U.diaryResumeOnReturn=false;diarySessionSave(U.diaryDate||todayKey());clearTimeout(U.diaryTimer);if(U.diaryReturn==='library'){var backDate=U.diaryDate||todayKey();U.diaryReturn='';openDiaryLibrary(backDate);}else{U.diaryReturn='';U.diaryDate='';closeModal();render();}break;}
    case 'diary-toggle':saveDiaryDraft();U.diaryAutoPaused=false;U.diaryResumeOnReturn=false;if(!U.diaryRun)U.diaryRun={acc:0,since:Date.now(),running:true};else if(U.diaryRun.running)diaryPause();else diaryResume();diarySessionSave(U.diaryDate||todayKey());drawDiary();break;
    case 'diary-mood':U.diaryMood=nemoMoodValid(a.dataset.v)?a.dataset.v:'';diarySessionSave(U.diaryDate||todayKey());document.querySelectorAll('.diary-mood-btn').forEach(function(b){b.classList.toggle('on',b.dataset.v===U.diaryMood);});var autoMoodBtn=document.querySelector('.diary-mood-auto');if(autoMoodBtn)autoMoodBtn.classList.toggle('on',!U.diaryMood);break;
    case 'diary-finish':finishDiary();break;
    case 'diary-finish-cancel':finishDiaryCancel();break;
    case 'diary-finish-save':finishDiarySave();break;
    case 'open-chat':U.chatRoom='general';U.chatQuery='';U.chatSel=null;drawChat();break;
    case 'chat-room':U.chatRoom=a.dataset.room||'general';U.chatQuery='';U.chatSel=null;drawChat();break;
    case 'chat-add-room':openChatRoomAdd();break;
    case 'chat-room-menu':openChatRoomMenu();break;
    case 'chat-room-menu-close':closeModal();drawChat();break;
    case 'chat-room-rename':openChatRoomRename();break;
    case 'chat-room-leave':leaveChatRoom();break;
    case 'chat-room-delete':if(armed(a))deleteChatRoom();break;
    case 'chat-restore-room':restoreChatRoom(a.dataset.room);break;
    case 'save-chat-room':saveChatRoom();break;
    case 'save-chat-room-name':saveChatRoomName();break;
    case 'chat-send':sendChat();break;
    case 'chat-sel':U.chatSel=U.chatSel===id?null:id;drawChat();break;
    case 'chat-photo':{
      var cm2=S.selfchat.find(function(m){return m.id===id;}),cp=cm2&&chatPhotosOf(cm2)[Number(a.dataset.pi)];
      if(cp){M={type:'photo',fromChat:true};openModal('<img class="lt-big" src="'+chatPhotoSrc(cp)+'" alt="채팅 사진"><div class="acts"><button class="b-ghost" data-act="close">닫기</button></div>');}
      break;
    }
    case 'chat-edit':openSelfChatEdit(id);break;
    case 'chat-edit-save':saveSelfChatEdit();break;
    case 'chat-del':if(armed(a)){S.selfchat=S.selfchat.filter(function(m){return m.id!==id;});U.chatSel=null;save();drawChat();}break;
    case 'chat-copy':{var cm=S.selfchat.find(function(m){return m.id===id;});if(cm){copyTextSafe(cm.text,function(){});U.chatSel=null;drawChat();}break;}
    case 'mstar':{var ms=findTodo(id);if(ms){ms.star=!ms.star;save();a.classList.toggle('on',ms.star);render();}break;}
    case 'postpone':{var pt=findTodo(id);if(pt){var base=studyDayDate(new Date()),nd;
      if(a.dataset.v==='we'){nd=addDays(mondayOf(base),5);if(dkey(nd)<=dkey(base))nd=addDays(nd,7);}else nd=addDays(base,Number(a.dataset.v));
      pt.scope='day';pt.key=dkey(nd);pt.time=null;pt.carried=false;save();closeModal();render();}break;}
    case 'jump':M={type:'jump'};openModal('<h3>날짜로 이동</h3><input class="fld" type="date" id="f-jump" value="'+dkey(U.date)+'"><div class="acts"><button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="do-jump">이동</button></div><button class="tbtn jtoday" data-act="jump-today">오늘로 이동</button>');break;
    case 'jump-today':U.date=studyDayDate(new Date());closeModal();render(true);break;
    case 'do-jump':{var jv=$('#f-jump').value;if(jv){U.date=parseKey(jv);closeModal();render(true);}break;}
    case 'merge-backup':{
      try{var mo=decodeBackupCode($('#f-backup').value);if(mo&&mo.state&&typeof mo.state==='object')mo=mo.state;if(!validBackupState(mo))throw 0;
        var beforeMerge=JSON.parse(JSON.stringify(S));
        savePrevBackup(beforeMerge).then(function(ok){if(!ok){bkMsg('합치기 전 백업을 저장하지 못했어요. 현재 내용은 유지했어요.');return;}var mm=mergeState(S,normalize(mo),null);mm.updatedAt=Date.now();S=mm;save();closeModal();render(true);},function(){bkMsg('합치기 전 백업을 저장하지 못했어요. 현재 내용은 유지했어요.');});
      }catch(e){bkMsg('올바른 백업 글자가 아니에요');}
      break;}
    case 'undo-backup':bkRestore('prev','되돌릴 내용이 없어요');break;
    case 'restore-remote-backup':bkRestore('remote','동기화 전 백업이 없어요');break;
    case 'restore-last-good':bkRestore('lastGood','마지막 정상 상태 백업이 없어요');break;
    case 'restore-logout-backup':bkRestore('logout','로그아웃 전 백업이 없어요');break;
    case 'load-ring':{
      var rid=+a.dataset.id;bkMsg('불러오는 중…');
      bkRingList().then(function(rows){var r=rows.find(function(x){return x.id===rid;});
        if(r&&r.data&&M.type==='backup'){$('#f-backup').value=JSON.stringify(r.data);bkMsg(ringLabel(r)+' 백업을 칸에 넣었어요. \'불러오기\'(통째로) 또는 \'합치기\'를 눌러요');$('#f-backup').scrollIntoView({block:'center'});}
        else bkMsg('그 백업을 못 찾았어요');});
      break;}
    case 'load-snap':{
      var sk=a.dataset.k;
      var putSnap=function(sd){if(sd&&M.type==='backup'){$('#f-backup').value=sd;bkMsg(sk+' 백업을 불러왔어요. 아래 \'합치기\'를 눌러요');}else bkMsg('그 날짜 백업을 못 찾았어요');};
      if(Sync.kind==='supa'&&Sync.uid){bkMsg('불러오는 중…');loadCloudSnap(sk).then(function(sd){if(sd)return sd;return bkGetRec('snap.'+sk).then(function(r){return r&&r.raw;});}).then(putSnap);}
      else{bkMsg('불러오는 중…');bkGetRec('snap.'+sk).then(function(r){putSnap(r&&r.raw);});}
      break;}
    case 'save-backup-file':{
      var fname='planner-backup-'+todayKey()+'.json',ftext=JSON.stringify(backupData());
      var dl=function(){try{var blob=new Blob([ftext],{type:'application/json'});var url=URL.createObjectURL(blob);var an=document.createElement('a');an.href=url;an.download=fname;document.body.appendChild(an);an.click();setTimeout(function(){URL.revokeObjectURL(url);an.remove();},1500);bkMsg('파일로 저장했어요');}catch(e){bkMsg('이 화면에선 파일 저장이 안 돼요. 백업 코드 복사를 써주세요');}};
      try{var fobj=new File([ftext],fname,{type:'application/json'});
        if(navigator.canShare&&navigator.canShare({files:[fobj]})){navigator.share({files:[fobj],title:fname}).then(function(){bkMsg('저장했어요. 파일 앱에서 찾을 수 있어요');},function(err){if(err&&err.name==='AbortError')bkMsg('저장을 취소했어요');else dl();});}
        else dl();
      }catch(e){dl();}
      break;}
    case 'ttscan-open':openTimetableScan();break;
    case 'ttscan-pick':{var tf=$('#ttscan-file');if(tf)tf.click();break;}
    case 'ttscan-analyze':analyzeTimetableImage();break;
    case 'ttscan-remove':{var ti=+a.dataset.i;if(TTScan.rows[ti])TTScan.rows.splice(ti,1);drawTTScan();break;}
    case 'ttscan-import':importTTScan();break;
    case 'paste-table':openPasteTable();break;
    case 'import-paste':importPastedTable(false,a);break;
    case 'replace-paste':importPastedTable(true,a);break;
    case 'qopt':U.qopt=true;render();break;
    case 'clear-ttime':$('#f-ttime').value='';break;
    case 'focus-free':openFocus(null);break;
    case 'fdone-ok':closeModal();render();break;
    case 'noop':break;
    case 'focus-todo':openFocus(a.dataset.id);break;
    case 'fmode':if(F.phase==='idle'||F.phase==='paused'){F.mode=a.dataset.v;lsSet('planner.fmode',F.mode);F.phase='idle';F.acc=0;F.left=FMODES[F.mode][0]*60;drawFocus();}break;
    case 'fstart':
      if(F.mode==='sw'){F.startAt=Date.now();F.phase='work';}
      else{F.endAt=Date.now()+F.left*1000;F.phase=F.phase==='paused'&&F.pbreak?'break':'work';}
      saveF();drawFocus();break;
    case 'fpause':
      if(F.mode==='sw'){F.acc+=(Date.now()-F.startAt)/1000;}
      else{F.left=Math.max(0,(F.endAt-Date.now())/1000);F.pbreak=F.phase==='break';}
      F.phase='paused';saveF();drawFocus();break;
    case 'fstop':{
      var mins=0;
      if(F.mode==='sw')mins=Math.floor(((F.phase==='work'?(Date.now()-F.startAt)/1000:0)+F.acc)/60);
      else if((F.phase==='work')||(F.phase==='paused'&&!F.pbreak))mins=Math.floor((FMODES[F.mode][0]*60-(F.phase==='work'?(F.endAt-Date.now())/1000:F.left))/60);
      if(mins>=1){addFocus(mins);drawFocusDone(mins);F=null;saveF();render();}else{F=null;saveF();closeModal();render();}break;
    }
    case 'nudge-off':lsSet('planner.loginNudge','off');render();break;
    case 'toggle-letter':S.settings.letterOn=!S.settings.letterOn;save();render();break;
    case 'letter-seen':{var lk=todayKey();if(S.letters[lk]){S.letters[lk].seen=true;save();}render();break;}
    case 'send-letter-tomorrow':sendLetterTomorrow(a.dataset.date||studyTomorrowKey(new Date()));break;
    case 'no-letter-tomorrow':askNoLetterTomorrow(a.dataset.date||studyTomorrowKey(new Date()));break;
    case 'no-letter-tomorrow-confirm':skipLetterTomorrow(a.dataset.date||studyTomorrowKey(new Date()));break;
    case 'letter-rmphoto':setLetter(a.dataset.k,{photo:null});save();render();break;
    case 'letter-photo':{var LL=S.letters[a.dataset.k];if(LL&&LL.photo){M={type:'photo'};openModal('<img class="lt-big" src="'+LL.photo+'" alt="사진">'+(LL.text?'<p class="lt-got" style="margin-top:12px">'+esc(LL.text)+'</p>':'')+'<div class="acts"><button class="b-ghost" data-act="close">닫기</button></div>');}break;}
    case 'memo-photo-del':{
      var md=memoOf(a.dataset.k),pid=a.dataset.pid;
      md.photos=md.photos.filter(function(p,i){return memoPhotoId(p,i)!==pid;});
      if(md.text||md.photos.length)S.memos[a.dataset.k]=md;else delete S.memos[a.dataset.k];
      save();render();break;
    }
    case 'log-switch':S.settings.logOn=!S.settings.logOn;save();render();break;
    case 'toggle-log-display':{var ld2=S.settings.logDisplay||{};ld2[a.dataset.id]=ld2[a.dataset.id]===false;S.settings.logDisplay=ld2;save();render();break;}
    case 'wake-goal':{if(a.disabled||(!beforeWakeGoalCutoff()&&a.dataset.k===todayKey()))break;var wk=a.dataset.k,wd=!!logVal(wk,'wakeGoal');setLog(wk,'wakeGoal',wd?undefined:true);save();render();break;}
    case 'log-now':{var nw=new Date();setLog(a.dataset.k,a.dataset.id,pad(nw.getHours())+':'+pad(nw.getMinutes()));save();render();break;}
    case 'add-trk':openTrk(null);break;
    case 'edit-trk':{var tk2=trk(id);if(tk2)openTrk(tk2);break;}
    case 'trk-type':M.ttype=a.dataset.v;drawTrkType();break;
    case 'save-trk':saveTrk();break;
    case 'del-trk':if(armed(a)){var tid=M.id;S.trackers=S.trackers.filter(function(x){return x.id!==tid;});
      Object.keys(S.logs).forEach(function(k){setLog(k,tid,undefined);});
      if(S.settings.calItem===tid||(S.settings.calItem==='range'&&(tid==='sstart'||tid==='send')))S.settings.calItem=S.trackers[0]?S.trackers[0].id:'study';
      save();closeModal();render();}break;
    case 'set-bg':S.settings.bg=a.dataset.v;lsSet('planner.bg',a.dataset.v);save();applyTheme();render();break;
    case 'open-settings':closeModal();U.prevTab=U.tab;U.tab='settings';render(true);break;
    case 'school-link':S.settings.schoolLastChecked=Date.now();save();try{window.open(a.dataset.url,'_blank','noopener');}catch(e){location.href=a.dataset.url;}break;
    case 'open-feedback':openFeedback();break;
    case 'feedback-copy':copyFeedback();break;
    case 'feedback-mail':mailFeedback();break;
    case 'back':U.tab=U.prevTab||'week';render(true);break;
    case 'set-theme':S.settings.theme=a.dataset.v;lsSet('planner.theme',a.dataset.v);save();applyTheme();render();break;
    case 'toggle-remind':if(S.settings.remindOn){S.settings.remindOn=false;save();render();toast('가까운 일정 알림을 껐어요');}else{askReminderPermission();}break;
    case 'add-link':openLink(null);break;
    case 'edit-link':{var lk=S.settings.links.find(function(x){return x.id===id;});if(lk)openLink(lk);break;}
    case 'save-link':saveLink();break;
    case 'del-link':if(armed(a)){var lid=M.id;S.settings.links=S.settings.links.filter(function(x){return x.id!==lid;});save();closeModal();render();}break;
    case 'switch-account':signOutSafely(true);break;
    case 'login':case 'signup':{
      var em=$('#f-email').value.trim(),pw=$('#f-pw').value,pw2=$('#f-pw2')?$('#f-pw2').value:'';
      if(!em){bad('#f-email');break;}
      if(pw.length<6){bad('#f-pw');break;}
      if(name==='signup'&&pw!==pw2){loginMsg('비밀번호가 서로 달라요');bad('#f-pw2');break;}
      loginMsg('잠시만요...');
      var pr=name==='login'?Sync.sb.auth.signInWithPassword({email:em,password:pw})
        :Sync.sb.auth.signUp({email:em,password:pw,options:{emailRedirectTo:location.href.split('#')[0]}});
      pr.then(function(res){
        if(res.error){loginMsg(authErr(res.error));return;}
        if(name==='signup'&&!res.data.session)loginMsg('가입 메일을 보냈어요. 메일 속 링크를 누르면 로그인돼요');
      }).catch(function(e){loginMsg(authErr(e));});
      break;
    }
    case 'magic':{
      var em2=$('#f-email').value.trim();
      if(!em2){bad('#f-email');break;}
      loginMsg('보내는 중...');
      Sync.sb.auth.signInWithOtp({email:em2,options:{emailRedirectTo:location.href.split('#')[0]}}).then(function(res){
        loginMsg(res.error?authErr(res.error):'메일을 보냈어요. 이 기기에서 메일 속 링크를 눌러주세요');
      }).catch(function(e){loginMsg(authErr(e));});
      break;
    }
    case 'logout':if(armed(a))signOutSafely(false);break;
    case 'recover-all':recoverAll();break;
    case 'use-merge':{
      try{if(hasPlannerData(S))bkPut('prev',JSON.stringify(S));var rm=normalize(JSON.parse(M.r.json));var mg=mergeState(S,rm,null);mg.updatedAt=Date.now();S=mg;lsSet(KEY,JSON.stringify(S));}catch(e){}
      lsSet('planner.syncedUser',Sync.uid);Sync.lastSeen=M.remoteAt;Sync.base=idsOf(S);saveMeta();Sync.on=true;closeModal();push();render();break;
    }
    case 'use-remote':{if(hasPlannerData(S))bkPut('prev',JSON.stringify(S));
      try{var st=normalize(JSON.parse(M.r.json));st.updatedAt=M.remoteAt;S=st;lsSet(KEY,JSON.stringify(S));}catch(e){}
      lsSet('planner.syncedUser',Sync.uid);Sync.lastSeen=M.remoteAt;Sync.base=idsOf(S);saveMeta();Sync.on=true;closeModal();render();break;
    }
    case 'use-local':lsSet('planner.syncedUser',Sync.uid);S.updatedAt=Date.now();lsSet(KEY,JSON.stringify(S));Sync.on=true;push();closeModal();render();break;
    case 'add-ad':openSchedule(null,{date:a.dataset.date||dkey(U.date),mode:'all'});break;
    case 'edit-ad':{var ad=S.allday.find(function(x){return x.id===id;});if(ad)openSchedule(ad);break;}
    case 'to-allday':openSchedule(null,{title:$('#f-title').value.trim(),date:$('#f-date').value,mode:'all'});break;
    case 'ad-mode':M.mode=a.dataset.v;drawAd();break;
    case 'ad-day':{var dv=Number(a.dataset.v),di=M.days.indexOf(dv);if(di>=0)M.days.splice(di,1);else M.days.push(dv);$('#f-adays').style.outline='';drawAd();break;}
    case 'ad-preset':M.days=a.dataset.v==='all'?[0,1,2,3,4,5,6]:a.dataset.v==='wd'?[0,1,2,3,4]:[5,6];drawAd();break;
    case 'save-ad':saveAllday();break;
    case 'del-ad':if(armed(a)){var aid=M.id;S.allday=S.allday.filter(function(x){return x.id!==aid;});save();closeModal();render();}break;
    case 'course-color':openCourseColor(a.dataset.name);break;
    case 'apply-ccolor':{var nm=M.name,cv=a.dataset.v;S.classes.forEach(function(x){if(x.name===nm)x.color=cv;});save();closeModal();render();break;}
    case 'course-todos':openCourse(a.dataset.name);break;
    case 'add-course-todo':{
      var ci=a.parentElement.querySelector('input'),cd=U.cdue||null;
      if(ci.value.trim())U.cdue='';
      addTodo('inbox',null,ci.value,'course:'+M.name,cd,M.name);break;
    }
    case 'add-exam':openExam(null);break;
    case 'view-exam':{var ve=S.exams.find(function(x){return x.id===id;});if(ve)openExamDetail(ve);break;}
    case 'edit-exam':{var ee=S.exams.find(function(x){return x.id===id;});if(ee)openExam(ee);break;}
    case 'exam-name':{M.kind=M.kind===a.dataset.v?'':a.dataset.v;document.querySelectorAll('#modal .seg button').forEach(function(b){b.classList.toggle('on',b.dataset.v===M.kind);});var en=$('#f-ename');if(!en.value)en.focus();break;}
    case 'save-exam':saveExam();break;
    case 'del-exam':if(armed(a)){var xid=M.id;S.exams=S.exams.filter(function(x){return x.id!==xid;});save();closeModal();render();}break;
    case 'carry-over':{
      var mk=a.dataset.mon,sk=dkey(addDays(parseKey(mk),6)),nk=dkey(addDays(parseKey(mk),7));
      S.todos.forEach(function(t){
        if(t.done)return;
        if((t.scope==='week'&&t.key===mk)||(t.scope==='day'&&t.key>=mk&&t.key<=sk)){t.scope='week';t.key=nk;todoCarryBump(t);}
      });
      save();render();break;
    }
    case 'split-todo-open':openSplitTodo(id);break;
    case 'split-todo-confirm':splitTodoNow();break;
    case 'stale-split':closeModal();openSplitTodo(id);break;
    case 'stale-date':openStaleDate(id);break;
    case 'stale-date-save':{var st=findTodo(M.id),sd=$('#f-stale-date')&&$('#f-stale-date').value;if(st&&sd){st.scope='day';st.key=sd;st.due=st.due||sd;st.time=null;st.carried=false;st.carryCount=0;save();closeModal();render();inAppToast('날짜를 정했어요');}break;}
    case 'stale-delete':if(window.confirm('이 할 일을 삭제할까요?')){deleteTodoCascade(id);save();closeModal();render();}break;
    case 'clear-qdue':U.qdue='';render();break;
    case 'gap':openGapFill(a.dataset.date,toMin(a.dataset.s),toMin(a.dataset.e));break;
    case 'gap-place':gapPlace(id);break;
    case 'gap-new-event':{var gg=M.gap||{};openEvent(null,{date:gg.date,start:fmt(gg.cur),end:fmt(gg.end),heading:'공강에 일정 넣기',ph:'이 시간에 할 일'});break;}
    case 'gap-autofill':gapAutoFill(a.dataset.date);break;
    case 'toggle-rt':{
      var k=a.dataset.date,arr=(S.routineDone[k]||[]).slice(),ix=arr.indexOf(id);
      if(ix>=0)arr.splice(ix,1);else arr.push(id);
      if(arr.length)S.routineDone[k]=arr;else delete S.routineDone[k];
      save();render();break;
    }
    case 'add-rt':openRoutine(null);break;
    case 'edit-rt':{var rr=S.routines.find(function(x){return x.id===id;});if(rr)openRoutine(rr);break;}
    case 'rt-day':{var v=Number(a.dataset.v),j=M.days.indexOf(v);if(j>=0)M.days.splice(j,1);else M.days.push(v);var rd=$('#f-rdays');if(rd)rd.style.outline='';drawRDays();break;}
    case 'rt-preset':M.days=a.dataset.v==='all'?[0,1,2,3,4,5,6]:a.dataset.v==='wd'?[0,1,2,3,4]:[5,6];drawRDays();break;
    case 'save-rt':saveRoutine();break;
    case 'del-rt':if(armed(a)){
      var rid=M.id;S.routines=S.routines.filter(function(x){return x.id!==rid;});
      Object.keys(S.routineDone).forEach(function(k){var l=S.routineDone[k].filter(function(x){return x!==rid;});if(l.length)S.routineDone[k]=l;else delete S.routineDone[k];});
      save();closeModal();render();}break;
    case 'toggle':{var t=findTodo(id);if(t){
      t.done=!t.done;
      if(t.splitParentId)syncSplitParent(t.splitParentId);
      else if(Array.isArray(t.planChildIds)&&t.planChildIds.length){splitChildren(t.id).forEach(function(x){x.done=t.done;});syncSplitParent(t.id);}
      save();render();}break;}
    case 'core-toggle':{var ct=findTodo(id);if(ct){if(ct.isCore){ct.isCore=false;}else{var ck=ct.scope==='day'?ct.key:todayKey(),cc=S.todos.filter(function(x){return x!==ct&&x.scope==='day'&&x.key===ck&&x.isCore===true;}).length;if(cc>=3){inAppToast('핵심은 3개까지야',2000);break;}ct.isCore=true;}save();render();}break;}
    case 'star':{var t2=findTodo(id);if(t2){t2.star=!t2.star;save();render();}break;}
    case 'edit-todo':{var t3=findTodo(id);if(t3)openTodo(t3);break;}
    case 'del-todo-inline':{var td=findTodo(id);if(td&&window.confirm('이 할 일을 삭제할까요?')){deleteTodoCascade(id);save();render();}break;}
    case 'add':{
      var inp=a.parentElement.querySelector('input');
      addTodo(inp.dataset.scope,inp.dataset.key,inp.value,inp.dataset.draft);break;
    }
    case 'add-quick':{
      var q=a.parentElement.querySelector('input');
      var qd=U.qdue||null,qc=U.qcourse||'';
      if(q.value.trim())U.qdue='';
      addTodo(U.qscope,keyFor(U.qscope,studyDayDate(new Date())),q.value,'quick',qd,qc);break;
    }
    case 'qscope':U.qscope=a.dataset.v;render();break;
    case 'move-today':{var t4=findTodo(id);if(t4){t4.scope='day';t4.key=todayKey();save();render();}break;}
    case 'move-all-today':{
      var tk=todayKey();
      S.todos.forEach(function(t){if(!t.done&&t.scope==='day'&&t.key<tk)t.key=tk;});
      save();render();break;
    }
    case 'toggle-done-list':U.showDone=!U.showDone;render();break;
    case 'clear-done':if(armed(a)){S.todos=S.todos.filter(function(t){return !t.done;});save();render();}break;
    case 'close':{var wl=M.type==='login',wo=M.type==='onboard',wc=!!M.fromChat||M.type==='chat-add-room'||M.type==='chat-room-menu'||M.type==='chat-room-rename',ws=M.type==='school-add',wso=ws&&M.fromOnboard; if(wo)finishOnboard();closeModal();if(wl||wo)render();if(wc)drawChat();if(ws){if(wso){M={type:'onboard',step:1,school:S.settings.school||'skku',campus:S.settings.schoolCampus||schoolProfile(S.settings.school||'skku').campuses[0],color:S.settings.defColor||'',plannerMode:S.settings.plannerMode||'university'};drawOnboard();}else render(true);}break;}
    case 'onboard-skip':{var osk=onboardStepKey();if(osk==='first'){finishOnboard();closeModal();render();}else{onboardAdvance();drawOnboard();}break;}
    case 'school-add-onboard':openSchoolAdd(true);break;
    case 'school-add-settings':openSchoolAdd(false);break;
    case 'save-school':saveSchoolCustom();break;
    case 'onboard-scan':
      if(onboardStepKey()==='scan'){finishOnboard();closeModal();U.tab='ttable';render();setTimeout(openTimetableScan,0);}
      break;
    case 'onboard-next':{
      var ok=onboardStepKey();
      if(ok==='mode'){S.settings.plannerMode=M.plannerMode||'university';save();}
      else if(ok==='school'){setSchool(M.school,M.campus);}
      else if(ok==='style'){
        var onName=$('#f-on-name');if(onName)S.settings.profileName=(onName.value||'').trim().slice(0,20);
        if(M.color){S.settings.defColor=M.color;lsSet('planner.defColor',M.color);applyDefaultColorToPlanner();}
        save();
      }else if(ok==='first'){
        var ft=$('#f-on-first-todo'),txt=ft?(ft.value||'').trim():'';
        if(txt){S.todos.push({id:uid(),text:txt,done:false,star:false,isCore:false,scope:'day',key:todayKey(),due:null,course:'',created:Date.now(),order:Date.now()});}
        finishOnboard();closeModal();save();render();break;
      }
      if(onboardAdvance())drawOnboard();else{finishOnboard();closeModal();render();}
      break;}
    case 'save-event':saveEvent();break;
    case 'save-appointment':saveAppointment();break;
    case 'save-schedule':saveSchedule();break;
    case 'schedule-mode':M.mode=a.dataset.v;M.tpA=null;drawSchedule();break;
    case 'schedule-when':M.repeat=a.dataset.v==='rep';M.tpA=null;drawSchedule();break;
    case 'schedule-range':M.single=a.dataset.v==='single';drawSchedule();break;
    case 'schedule-day':{var sd=Number(a.dataset.v),si=M.days.indexOf(sd);if(si>=0)M.days.splice(si,1);else M.days.push(sd);drawSchedule();break;}
    case 'schedule-preset':M.days=a.dataset.v==='all'?[0,1,2,3,4,5,6]:a.dataset.v==='wd'?[0,1,2,3,4]:[5,6];drawSchedule();break;
    case 'pack-fill-template':maybeApplyScheduleTemplate(true);break;
    case 'pack-add':{var pi=$('#f-pack-new'),pv=pi&&pi.value.trim();if(pv){var box=$('#schedule-pack-list');if(box){var rid=uid(),wrap=document.createElement('div');wrap.innerHTML=schedulePackRow({id:rid,text:pv,done:false});box.appendChild(wrap.firstChild);M.packTouched=true;}pi.value='';schedulePackHint();}break;}
    case 'pack-del':{var pr=a.closest('.exam-prep-row');if(pr){pr.remove();M.packTouched=true;schedulePackHint();}break;}
    case 'pack-template-clear':{var ti=$('#f-stitle'),nm=ti&&(ti.value||'').trim();if(nm){scheduleTemplateClear(nm);if($('#f-pack-template'))$('#f-pack-template').checked=false;schedulePackHint();toast('이 제목의 준비물 템플릿을 지웠어요');}break;}
    case 'del-schedule':if(armed(a)){S.events=S.events.filter(function(x){return x.id!==M.id;});S.allday=S.allday.filter(function(x){return x.id!==M.id;});save();closeModal();render();}break;
    case 'del-event':if(armed(a)){var delEv=S.events.find(function(x){return x.id===M.id;});S.events=S.events.filter(function(x){return x.id!==M.id;});save();if(delEv&&delEv.sharedRequestId)cancelSharedAppointment(delEv);closeModal();render();}break;
    case 'save-block':saveBlock();break;
    case 'del-block':if(armed(a)){S.classes=S.classes.filter(function(x){return x.id!==M.id;});save();closeModal();render();}break;
    case 'save-todo':saveTodo();break;
    case 'del-todo':if(armed(a)){deleteTodoCascade(M.id);save();closeModal();render();}break;
    case 'pick-color':
      M.color=a.dataset.v;
      document.querySelectorAll('#modal .sw').forEach(function(s){s.classList.toggle('on',s===a);});break;
    case 'pick-day':{
      if(M.multi){
        if(a.dataset.v==='none'){M.days=[];M.day=null;}
        else{var pv=Number(a.dataset.v),pi=M.days.indexOf(pv);if(pi>=0)M.days.splice(pi,1);else M.days.push(pv);M.days.sort(function(x,y){return x-y;});M.day=M.days.length?M.days[0]:null;}
        document.querySelectorAll('#f-days button').forEach(function(s){var sv=s.dataset.v; s.classList.toggle('on',sv==='none'?M.days.length===0:M.days.indexOf(Number(sv))>=0);});
        $('#f-times').style.display=M.days.length?'':'none';
      }else{
        M.day=a.dataset.v==='none'?null:Number(a.dataset.v);M.days=M.day==null?[]:[M.day];
        document.querySelectorAll('#f-days button').forEach(function(s){s.classList.toggle('on',s===a);});
        $('#f-times').style.display=M.day==null?'none':'';
      }
      break;
    }
    case 'pick-tscope':
      M.scope=a.dataset.v;
      document.querySelectorAll('#modal .seg button').forEach(function(s){s.classList.toggle('on',s===a);});
      $('#f-tdate-w').style.display=M.scope==='inbox'?'none':'';break;
    case 'clear-due':$('#f-due').value='';break;
    case 'privacy-key':privacyRecoveryKey();break;
    case 'privacy-key-enter':enterPrivacyKey();break;
    case 'sync-retry':retrySync();break;
    case 'backup':openBackup();break;
    case 'copy-backup':{
      var ta=$('#f-backup'),txt=(ta.value||'').trim()||JSON.stringify(backupData());
      copyText(txt,ta,'백업 글자를 복사했어요. 메모 앱에 붙여넣어 보관해요');
      break;
    }
    case 'copy-backup-code':{
      var ca=$('#f-backup-code'),code=backupCode();
      if(!code){bkMsg('백업 코드를 만들지 못했어요. 파일로 저장을 써주세요');break;}
      copyText(code,ca,'백업 코드를 복사했어요. 메모 앱에 붙여넣어 보관해요');
      break;
    }
    case 'restore-backup-code':{var cv=$('#f-backup-code').value;if(!cv.trim()){bkMsg('먼저 칸에 백업 코드를 붙여넣어요');break;}restoreBackupState(cv,'올바른 백업 코드가 아니에요');break;}
    case 'import-backup':{
      var bv=$('#f-backup').value;if(!bv.trim()){bkMsg('먼저 칸에 백업 글자를 붙여넣거나 파일을 불러와요');break;}
      restoreBackupState(bv,'올바른 백업 글자가 아니에요');
      break;
    }
    case 'reset-classes':
      if(armed(a)){S.classes=defaults().classes;save();render();}break;
  }
}

/* ---------- 이벤트 ---------- */
/* ---------- 귀여운 날짜 선택 ---------- */
var DP={inp:null,btn:null,y:0,m:0};
function dpLabel(v){if(!v)return '';var d=parseKey(v),y=new Date().getFullYear();return (d.getFullYear()!==y?d.getFullYear()+'년 ':'')+mdTxt(d)+' ('+DAYS[dow(d)]+')';}
function dpPh(inp){return /(end|to|ee|cto|adto|se)$/i.test(inp.id||'')?'끝나는 날 (선택)':'날짜 선택';}
function refreshDates(){document.querySelectorAll('.dbtn').forEach(function(b){var i=b.previousElementSibling;if(!i)return;var v=i.value,t=v?dpLabel(v):dpPh(i);if(b.textContent!==t)b.textContent=t;if(b.classList.contains('empty')!==!v)b.classList.toggle('empty',!v);});}
function enhanceDates(){
  document.querySelectorAll('input[type=date]:not([data-dx])').forEach(function(inp){
    inp.dataset.dx='1';inp.style.display='none';
    var b=document.createElement('button');b.type='button';b.className=(inp.className||'')+' dbtn';
    inp.parentNode.insertBefore(b,inp.nextSibling);
  });
  refreshDates();
}
function closeDP(){var el=document.getElementById('dp');if(el)el.remove();DP.inp=null;DP.btn=null;}
function openDP(btn){
  closeDP();var inp=btn.previousElementSibling;if(!inp)return;
  var base=inp.value?parseKey(inp.value):(function(){var o=document.querySelector('#modal input[type=date]');return o&&o!==inp&&o.value?parseKey(o.value):new Date();})();
  DP={inp:inp,btn:btn,y:base.getFullYear(),m:base.getMonth()};
  var el=document.createElement('div');el.id='dp';el.setAttribute('role','dialog');el.setAttribute('aria-label','날짜 고르기');document.body.appendChild(el);
  drawDP();
  var r=btn.getBoundingClientRect(),w=300,h=el.offsetHeight||340;
  var left=Math.min(Math.max(8,r.left),window.innerWidth-w-8),top=r.bottom+6;
  if(top+h>window.innerHeight-8)top=Math.max(8,r.top-h-6);
  el.style.left=left+'px';el.style.top=top+'px';
}
function drawDP(){
  var el=document.getElementById('dp');if(!el)return;
  var first=new Date(DP.y,DP.m,1),off=first.getDay(),dim=new Date(DP.y,DP.m+1,0).getDate(),tk=todayKey(),sel=DP.inp.value,cells='';
  for(var i=0;i<off;i++)cells+='<span></span>';
  for(var dd=1;dd<=dim;dd++){
    var k=DP.y+'-'+pad(DP.m+1)+'-'+pad(dd),wd=(off+dd-1)%7;
    cells+='<button type="button" data-dp="'+k+'" class="dpd'+(wd===0?' sun':'')+(wd===6?' sat':'')+(holi(k)?' sun':'')+(k===tk?' tdy':'')+(k===sel?' sel':'')+'"'+(holi(k)?' title="'+holi(k)+'"':'')+'>'+dd+'</button>';
  }
  el.innerHTML='<div class="dph"><button type="button" class="dpn" data-dpnav="-1" aria-label="이전 달">‹</button><b>'+DP.y+'년 '+(DP.m+1)+'월</b><button type="button" class="dpn" data-dpnav="1" aria-label="다음 달">›</button></div>'+
    '<div class="dpw"><span class="sun">일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span class="sat">토</span></div>'+
    '<div class="dpg">'+cells+'</div>'+
    '<div class="dpf"><button type="button" data-dpq="today">오늘</button>'+(sel?'<button type="button" data-dpq="clear">지우기</button>':'')+'<button type="button" data-dpq="close">닫기</button></div>';
}
function setDP(v){
  var inp=DP.inp;if(!inp)return;inp.value=v;
  inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}));
  if(DP.btn)DP.btn.classList.remove('bad');closeDP();refreshDates();
}
function dpClick(e){
  var d=e.target.closest('[data-dp]');if(d){setDP(d.dataset.dp);return;}
  var n=e.target.closest('[data-dpnav]');if(n){DP.m+=Number(n.dataset.dpnav);if(DP.m<0){DP.m=11;DP.y--;}if(DP.m>11){DP.m=0;DP.y++;}drawDP();return;}
  var q=e.target.closest('[data-dpq]');if(q){if(q.dataset.dpq==='today')setDP(todayKey());else if(q.dataset.dpq==='clear')setDP('');else closeDP();}
}
try{new MutationObserver(function(){if(document.querySelector('input[type=date]:not([data-dx])'))enhanceDates();}).observe(document.body,{childList:true,subtree:true});}catch(x){}
window.addEventListener('pagehide',function(){if(M.type==='diary'){saveDiaryDraft();diarySessionSave(U.diaryDate||todayKey());}});
document.addEventListener('visibilitychange',function(){if(M.type==='diary'){saveDiaryDraft();if(U.diaryRun){if(document.hidden){U.diaryAutoPaused=!!U.diaryRun.running;if(U.diaryAutoPaused)diaryPause();}else{if(U.diaryAutoPaused)diaryResume();U.diaryAutoPaused=false;}diarySessionSave(U.diaryDate||todayKey());diaryTick();}else if(U.diaryDate)diarySessionSave(U.diaryDate);}});
var TOPDR=null,topDragIgnore=0;
document.addEventListener('input',function(e){
  if(e.target&&e.target.id==='pp-q'&&M.pp){M.pp.q=e.target.value;var z=$('#pp-results');if(z)z.innerHTML=ppResultsHTML(M.pp.q);}
  if(e.target&&e.target.id==='f-diary'){diaryLiveInput(e.target);}
  if(e.target&&e.target.id==='f-diary-note'){U.diaryNote=e.target.value;if(U.diaryDate)diarySessionSave(U.diaryDate);}
  if(e.target&&e.target.id==='f-cheer-msg'){var cc=$('#cheer-count');if(cc)cc.textContent=Array.from(e.target.value||'').length+'/100';}
  if(e.target&&e.target.id==='f-stitle'){schedulePackHint();}
  if(e.target&&e.target.id==='pp-other'&&M.pp){M.pp.other=e.target.value;var pb=$('#pp');if(pb)pb.classList.remove('bad');}
});
var LastDelete=null,undoTimer=null;
function showUndo(before,label){LastDelete=before;var bar=document.getElementById('undo-bar');if(!bar){bar=document.createElement('div');bar.id='undo-bar';bar.innerHTML='<span>삭제했어요</span><button data-act="undo-delete">실행 취소</button>';document.body.appendChild(bar);}bar.querySelector('span').textContent=label||'삭제했어요';bar.classList.add('on');clearTimeout(undoTimer);undoTimer=setTimeout(function(){bar.classList.remove('on');LastDelete=null;},6000);}
function undoLastDelete(){if(!LastDelete)return;S=normalize(JSON.parse(LastDelete));S.updatedAt=Date.now();LastDelete=null;var bar=document.getElementById('undo-bar');if(bar)bar.classList.remove('on');save();closeModal();render(true);inAppToast('되돌렸어요');}
function isDeleteAction(n){return /^(del-|chat-del$|chat-room-delete$|memo-photo-del$|profile-photo-remove$|notice-clear$)/.test(n||'');}
document.addEventListener('click',function(e){
  if(e.target.closest&&e.target.closest('#dp')){dpClick(e);return;}
  var db=e.target.closest&&e.target.closest('.dbtn');if(db){if(DP.btn===db)closeDP();else openDP(db);return;}
  if(document.getElementById('dp'))closeDP();
  if(topDragIgnore&&Date.now()<topDragIgnore){topDragIgnore=0;return;}
  var a=e.target.closest('[data-act]');
  if(a){var dn=a.dataset.act,before=isDeleteAction(dn)?JSON.stringify(S):null,bc=before?itemCount(S):0;act(a,e);if(before)setTimeout(function(){if(itemCount(S)<bc||dn==='profile-photo-remove'||dn==='memo-photo-del'||dn==='notice-clear')showUndo(before);},0);refreshDates();return;}
  if(e.target.id==='modal'&&M.type==='focus')return;
  if(e.target.id==='modal'){var wl2=M.type==='login',wc2=!!M.fromChat||M.type==='chat-room-menu'||M.type==='chat-add-room'||M.type==='chat-room-rename',ws2=M.type==='school-add',wso2=ws2&&M.fromOnboard;closeModal();if(wl2)render();if(wc2)drawChat();if(ws2){if(wso2){M={type:'onboard',step:1,school:S.settings.school||'skku',campus:S.settings.schoolCampus||schoolProfile(S.settings.school||'skku').campuses[0],color:S.settings.defColor||'',plannerMode:S.settings.plannerMode||'university'};drawOnboard();}else render(true);}return;}
  var col=e.target.closest('.tt-col');
  if(col&&e.target===col){
    var r=col.getBoundingClientRect(),lo=Number(col.dataset.lo),hh=Number(col.dataset.hh);
    var m=lo+Math.floor((e.clientY-r.top)/hh*2)*30;
    m=Math.min(Math.max(m,0),23*60);
    openEvent(null,{date:col.dataset.date,start:fmt(m),end:fmt(Math.min(m+60,1439))});
  }
});
document.addEventListener('pointerdown',function(e){
  var row=e.target.closest&&e.target.closest('.topdrag');if(!row)return;
  TOPDR={row:row,id:e.pointerId,x:e.clientX,y:e.clientY,dragging:false};
  try{row.setPointerCapture(e.pointerId);}catch(x){}
});
document.addEventListener('pointermove',function(e){
  if(!TOPDR)return;
  var dx=e.clientX-TOPDR.x,dy=e.clientY-TOPDR.y;
  if(!TOPDR.dragging){
    if(Math.abs(dx)<6&&Math.abs(dy)<6)return;
    TOPDR.dragging=true;TOPDR.row.classList.add('dragging');
  }
  e.preventDefault();
  var over=document.elementFromPoint(e.clientX,e.clientY);
  var target=over&&over.closest?over.closest('.topdrag'):null;
  if(!target||target===TOPDR.row||target.parentElement!==TOPDR.row.parentElement)return;
  var r=target.getBoundingClientRect(),list=target.parentElement;
  if(e.clientY<r.top+r.height/2)list.insertBefore(TOPDR.row,target);
  else list.insertBefore(TOPDR.row,target.nextSibling);
},{passive:false});
function finishTopDrag(e){
  if(!TOPDR)return;
  var d=TOPDR;TOPDR=null;
  d.row.classList.remove('dragging');
  try{d.row.releasePointerCapture(e.pointerId);}catch(x){}
  if(!d.dragging)return;
  var visible=[].slice.call(document.querySelectorAll('.toplist .topdrag')).map(function(x){return x.dataset.topId;});
  if(visible.length){
    var all=topItems().map(function(x){return x.id;}),rest=all.filter(function(id){return visible.indexOf(id)<0;});
    S.settings.topOrder=visible.concat(rest);save();render();
  }
  topDragIgnore=Date.now()+500;
}
document.addEventListener('pointerup',finishTopDrag);
document.addEventListener('pointercancel',finishTopDrag);
var DR=null;
document.addEventListener('pointerdown',function(e){
  var g=e.target.closest&&e.target.closest('.grip');if(!g)return;
  var li=g.closest('li.todo'),ul=li&&li.parentElement;if(!ul)return;
  e.preventDefault();DR={li:li,ul:ul,id:e.pointerId};li.classList.add('dragging');
  try{g.setPointerCapture(e.pointerId);}catch(x){}
});
document.addEventListener('pointermove',function(e){
  if(!DR)return;e.preventDefault();
  var sibs=[].slice.call(DR.ul.querySelectorAll('li.todo[data-tid]:not(.done)'));
  for(var i=0;i<sibs.length;i++){
    var o=sibs[i];if(o===DR.li)continue;var r=o.getBoundingClientRect();
    if(e.clientY>r.top&&e.clientY<r.bottom){
      if(e.clientY<r.top+r.height/2)DR.ul.insertBefore(DR.li,o);else DR.ul.insertBefore(DR.li,o.nextSibling);
      break;
    }
  }
},{passive:false});
function endDrag(){
  if(!DR)return;
  var ids=[].slice.call(DR.ul.querySelectorAll('li.todo[data-tid]:not(.done)')).map(function(l){return l.dataset.tid;});
  var base=Date.now();
  ids.forEach(function(id,i){var t=S.todos.find(function(x){return x.id===id;});if(t)t.order=base+i;});
  DR.li.classList.remove('dragging');DR=null;save();render();
}
document.addEventListener('pointerup',endDrag);
document.addEventListener('pointercancel',endDrag);
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&M.type){var et=M.type,ef=et==='school-add'&&M.fromOnboard,ec=!!M.fromChat||et==='chat-room-menu'||et==='chat-add-room'||et==='chat-room-rename';closeModal();if(ec)drawChat();if(et==='school-add'){if(ef){M={type:'onboard',step:1,school:S.settings.school||'skku',campus:S.settings.schoolCampus||schoolProfile(S.settings.school||'skku').campuses[0],color:S.settings.defColor||'',plannerMode:S.settings.plannerMode||'university'};drawOnboard();}else render(true);}return;}
  if(e.key!=='Enter'||e.isComposing||e.keyCode===229)return;
  if(e.target.id==='f-global-search'){
    e.preventDefault();
    var first=document.querySelector('#global-results [data-act="global-result"]');
    if(first)first.click();
    return;
  }
  if(e.target.id==='pp-q'){e.preventDefault();var ppf=document.querySelector('#pp-results .place-result');if(ppf)ppf.click();return;}
  if(e.target.id==='f-chat'&&!e.shiftKey){e.preventDefault();sendChat();return;}
  var t=e.target;
  if(t.closest&&t.closest('.add')&&t.tagName==='INPUT'){
    e.preventDefault();
    var btn=t.parentElement.querySelector('button[data-act]');
    if(btn)btn.click();
  }else if(t.tagName==='INPUT'&&M.type){
    var sv={dd:'save-dd',jump:'do-jump',trk:'save-trk',link:'save-link',login:'login',event:'save-event',appointment:'save-appointment',schedule:'save-schedule',block:'save-block',todo:'save-todo',routine:'save-rt',exam:'save-exam',allday:'save-ad','diary-finish-confirm':'diary-finish-save','chat-add-room':'save-chat-room','chat-room-rename':'save-chat-room-name','school-add':'save-school','recipe':'recipe-save'}[M.type];
    var b=sv&&document.querySelector('[data-act="'+sv+'"]');
    if(b&&t.type!=='time'&&t.type!=='date'){e.preventDefault();b.click();}
  }
});
var memoTimer=null;
function handleLog(t){
  var p=t.dataset.log.split('|'),k=p[0],id=p[1],f=p[2];
  if(f==='t'){setLog(k,id,t.value||undefined);}
  else{
    var hi=document.querySelector('[data-log="'+k+'|'+id+'|h"]'),mi=document.querySelector('[data-log="'+k+'|'+id+'|m"]');
    var hv=hi&&hi.value!==''?Math.max(0,parseInt(hi.value,10)||0):null,mv=mi&&mi.value!==''?Math.max(0,parseInt(mi.value,10)||0):null;
    if(hv===null&&mv===null)setLog(k,id,undefined);else setLog(k,id,Math.min((hv||0)*60+(mv||0),1440));
  }
  clearTimeout(memoTimer);memoTimer=setTimeout(function(){memoTimer=null;save();},400);
}
document.addEventListener('input',function(e){
  var t=e.target;
  if(t.id==='f-global-search'){M.query=t.value;drawGlobalSearch();return;}
  if(t.classList&&t.classList.contains('bad'))t.classList.remove('bad');
  if(t.dataset&&t.dataset.draft)U.drafts[t.dataset.draft]=t.value;
  if(t.id==='q-due'){U.qdue=t.value;}
  if(t.id==='c-due'){U.cdue=t.value;}
  if(t.id==='f-chat'){U.chatDraft=t.value;}
  if(t.dataset&&(t.dataset.originPlace||t.dataset.originOverridePlace)){clearTimeout(window.__originRuleTimer);window.__originRuleTimer=setTimeout(function(){saveOriginRulesFromUI();if(typeof friendPush==='function')friendPush().catch(function(){});},500);}

  if(t.id==='f-stitle'){schedulePackHint();}
  if(t.dataset&&t.dataset.packText){M.packTouched=true;schedulePackHint();}
  if(t.id==='f-chat-search'){
    U.chatQuery=t.value;
    var cl=document.querySelector('#clist'),old=cl?cl.scrollTop:0;
    if(cl){cl.innerHTML=chatListHTML();cl.scrollTop=old;}
    return;
  }
  if(t.dataset&&t.dataset.log)handleLog(t);
  if(t.dataset&&t.dataset.retro){if(t.value)S.retro[t.dataset.retro]=t.value;else delete S.retro[t.dataset.retro];clearTimeout(memoTimer);memoTimer=setTimeout(function(){memoTimer=null;save();},400);}
  if(t.dataset&&t.dataset.weekretro){if(t.value)S.weeklyRetro[t.dataset.weekretro]=t.value;else delete S.weeklyRetro[t.dataset.weekretro];clearTimeout(memoTimer);memoTimer=setTimeout(function(){memoTimer=null;save();},400);}
  if(t.dataset&&t.dataset.letter){setLetter(t.dataset.letter,{text:t.value.trim()?t.value:null,seen:null});clearTimeout(memoTimer);memoTimer=setTimeout(function(){memoTimer=null;save();},500);}
  if(t.dataset&&t.dataset.hnote){
    var hp=t.dataset.hnote.split('|'),hk=hp[0],hh=hp[1];
    var o=S.hourNotes[hk]||{};
    if(t.value)o[hh]=t.value;else delete o[hh];
    if(Object.keys(o).length)S.hourNotes[hk]=o;else delete S.hourNotes[hk];
    clearTimeout(memoTimer);memoTimer=setTimeout(function(){memoTimer=null;save();},400);
  }
  if(t.dataset&&t.dataset.memo){
    var k=t.dataset.memo;
    var mm=memoOf(k);mm.text=t.value;
    if(mm.text||mm.photos.length)S.memos[k]=mm;else delete S.memos[k];
    clearTimeout(memoTimer);memoTimer=setTimeout(function(){memoTimer=null;save();},400);
  }
});
function flush(){
  if(memoTimer){clearTimeout(memoTimer);memoTimer=null;save();}
  /* 탭 닫기·새로고침도 로그아웃과 같은 마지막 안전 저장으로 처리해요. */
  var owner=Sync&&Sync.uid||lsGet('planner.activeUser');
  if(owner&&!/^loggedout:/.test(owner))saveAccountState(owner,S);
  bkRingAdd(S,false);
}

document.addEventListener('pointerdown',function(e){
  if(M.type!=='profile-crop'||!e.target.closest||!e.target.closest('#profile-crop-box'))return;
  M.cropDrag={id:e.pointerId,x:e.clientX,y:e.clientY,ox:M.cropX,oy:M.cropY};try{e.target.closest('#profile-crop-box').setPointerCapture(e.pointerId);}catch(_){}e.preventDefault();
});
document.addEventListener('pointermove',function(e){
  if(M.type!=='profile-crop'||!M.cropDrag||M.cropDrag.id!==e.pointerId)return;
  M.cropX=M.cropDrag.ox+(e.clientX-M.cropDrag.x);M.cropY=M.cropDrag.oy+(e.clientY-M.cropDrag.y);drawProfileCrop();e.preventDefault();
});
document.addEventListener('pointerup',function(e){if(M.type==='profile-crop'&&M.cropDrag&&M.cropDrag.id===e.pointerId)M.cropDrag=null;});
document.addEventListener('input',function(e){
  if(M.type==='profile-crop'&&e.target.id==='profile-crop-zoom'){
    var box=$('#profile-crop-box'),z=box?box.clientWidth:300,old=M.cropScale||1,n=Number(e.target.value)||1,cx=(z/2-M.cropX)/(M.cropBase*old),cy=(z/2-M.cropY)/(M.cropBase*old);
    M.cropScale=n;M.cropX=z/2-cx*M.cropBase*n;M.cropY=z/2-cy*M.cropBase*n;drawProfileCrop();
  }
});
document.addEventListener('change',function(e){
  if(M&&M.type==='appointment'&&e.target&&['f-date','f-start','f-end'].indexOf(e.target.id)>=0)M.conflictConfirmed=false;
  if(e.target&&e.target.id==='f-stitle'){maybeApplyScheduleTemplate(false);return;}
  if(e.target&&e.target.id==='f-pack-template'){schedulePackHint();return;}
  if(e.target&&e.target.dataset&&e.target.dataset.packId){M.packTouched=true;return;}
  if(e.target.id==='f-on-school'){var picked=allSchoolProfiles().find(function(x){return x.name===e.target.value;});if(picked){M.school=picked.id;M.campus=picked.campuses[0]||'';drawOnboard();}return;}
  if(e.target.id==='f-on-campus'){M.campus=e.target.value;return;}
  if(e.target&&e.target.closest&&(e.target.closest('[data-origin-rule]')||e.target.closest('[data-origin-override]'))){saveOriginRulesFromUI();if(typeof friendPush==='function')friendPush().catch(function(){});return;}
  if(e.target.id==='set-meet-s'||e.target.id==='set-meet-e'){var ms=Number($('#set-meet-s').value),me=Number($('#set-meet-e').value);if(me<=ms){e.target.classList.add('bad');return;}S.settings.meetStart=ms;S.settings.meetEnd=me;save();render();friendBusyPush();return;}
  if(e.target.id==='set-cheer-time'){var ct=e.target.value||'';if(!/^(?:0[8-9]|1\d|2[0-3]):[0-5]\d$/.test(ct)){e.target.classList.add('bad');inAppToast('08:00부터 23:59 사이로 설정해주세요');return;}S.settings.cheerReceiveTime=ct;save();inAppToast('응원 쪽지 받는 시간을 '+ct+'로 바꿨어요');cheerDeliverDue();return;}
  if(e.target.id==='f-afriend'){M.friendId=e.target.value||null;M.tpA=null;if(M.pp){M.pp.friendId=M.friendId;ppDraw();}drawTpick();return;}
  if(e.target.id==='set-school'){if(e.target.value==='__add__'){openSchoolAdd(false);}else{setSchool(e.target.value);render();}return;}
  if(e.target.id==='set-school-search'){
    var q=String(e.target.value||'').trim();
    var picked=allSchoolProfiles().find(function(x){return x.name===q;});
    if(picked){setSchool(picked.id,picked.campuses[0]||'');render();}
    else {var h=$('#set-school-hint');if(h)h.textContent=q?'목록에서 학교를 선택해 주세요':'예: 가천대학교, 성균관대학교';}
    return;
  }
  if(e.target.id==='set-campus'){setSchool(S.settings.school,e.target.value);render();return;}
  if(e.target.id==='set-wake-goal'){S.settings.wakeGoal=e.target.value||'09:00';save();render();return;}
  if(e.target.id==='set-brief-time'){S.settings.morningBriefingTime=e.target.value||'08:00';S.settings.morningBriefingSent='';save();render();return;}
  if(e.target.dataset&&e.target.dataset.monthItem){S.settings.monthItems[e.target.dataset.monthItem]=e.target.checked;save();render();return;}
  if(e.target.dataset&&e.target.dataset.memphoto!==undefined&&e.target.files&&e.target.files[0]){setMemoryPhoto(e.target.files[0],e.target.dataset.memphoto||null);e.target.value='';return;}
  if(e.target.dataset&&e.target.dataset.profilePhoto!==undefined&&e.target.files&&e.target.files[0]){
    setProfilePhoto(e.target.files[0]);e.target.value='';return;
  }
  if(e.target.dataset&&e.target.dataset.memophoto&&e.target.files){
    addMemoPhotos(e.target.dataset.memophoto,e.target.files);e.target.value='';return;
  }
  if(e.target.dataset&&e.target.dataset.chatphoto!==undefined&&e.target.files){
    addChatPhotos(e.target.files);e.target.value='';return;
  }
  if((M.type==='event'||M.type==='appointment'||M.type==='schedule')&&/^f-(date|from|to|enddate|start|end)$/.test(e.target.id)){M.tpA=null;if(M.type==='schedule')drawSchedule();else drawTpick();}
  if(e.target.id==='set-ss'||e.target.id==='set-se'){var a1=$('#set-ss').value||null,b1=$('#set-se').value||null;if(a1&&b1&&b1<a1){e.target.classList.add('bad');return;}S.settings.semStart=a1;S.settings.semEnd=b1;save();render();return;}
  if(M.type==='dd'&&/^f-dd[dyo]$/.test(e.target.id)){drawDD();}
  if(e.target.id==='set-hs'||e.target.id==='set-he'){var hs=Number($('#set-hs').value),he=Number($('#set-he').value);if(he-hs<3)he=Math.min(24,hs+3);S.settings.hStart=hs;S.settings.hEnd=he;save();render();return;}
  if(e.target.id==='f-bkfile'&&e.target.files&&e.target.files[0]){var fr=new FileReader();fr.onload=function(){var ta=$('#f-backup');if(ta){ta.value=fr.result;bkMsg('파일을 읽었어요. 불러오기를 누르면 전체 데이터가 복원돼요');}};fr.readAsText(e.target.files[0]);return;}
  if(e.target.id==='f-task'&&F){F.tid=e.target.value||null;saveF();return;}
  if(e.target.dataset&&e.target.dataset.letterphoto&&e.target.files&&e.target.files[0]){
    var lk=e.target.dataset.letterphoto;
    shrinkImage(e.target.files[0],function(url){if(url){setLetter(lk,{photo:url,seen:null});save();render();}});
    return;
  }if(e.target.dataset&&e.target.dataset.log)handleLog(e.target);if(e.target.id==='cal-item'){S.settings.calItem=e.target.value;save();}if(e.target.id==='c-due')U.cdue=e.target.value;if(e.target.id==='q-due')U.qdue=e.target.value;if(e.target.id==='q-course')U.qcourse=e.target.value;});
document.addEventListener('dragover',function(e){
  if((e.target.closest&&e.target.closest('#clist'))||(e.target.closest&&e.target.closest('[data-memo-drop]')))e.preventDefault();
},{passive:false});
document.addEventListener('drop',function(e){
  var files=e.dataTransfer&&e.dataTransfer.files;if(!files||!files.length)return;
  var chat=e.target.closest&&e.target.closest('#clist'),memo=e.target.closest&&e.target.closest('[data-memo-drop]');
  if(chat){e.preventDefault();addChatPhotos(files);}
  else if(memo){e.preventDefault();addMemoPhotos(memo.dataset.memoDrop,files);}
});
window.addEventListener('pagehide',flush);
window.addEventListener('offline',function(){setSyncUI('local');try{inAppToast('오프라인이에요. 이 기기에 계속 저장할게요');}catch(e){}});
window.addEventListener('online',function(){if(Sync.db){setSyncUI('saving');retrySync();}else setSyncUI('local');});
document.addEventListener('visibilitychange',function(){
  if(document.hidden)flush();
  else{syncStudyDayBoundary();updateNow();checkMorningBriefing();if(F&&M.type==='focus'){catchUp();tickFocus();}if(Sync.db&&!memoTimer&&!Sync.timer&&!Sync.busy)pull();if(Sync.kind==='supa'&&Sync.uid){friendRequestLoad();cheerDeliverDue();}}
});
setInterval(updateNow,60000);
setInterval(tickFocus,500);
setInterval(checkReminders,60000);
setInterval(checkMorningBriefing,60000);
setInterval(function(){if(Sync.kind==='supa'&&Sync.uid)cheerDeliverDue();},60000);
/* 공부 하루는 오전 5시에만 바뀌어요. 00:00~04:59는 여전히 전날 공부일입니다. */
var lastStudyDayKey=todayKey();
function syncStudyDayBoundary(){
  var nextKey=todayKey();
  if(nextKey===lastStudyDayKey)return false;
  var prevKey=lastStudyDayKey;lastStudyDayKey=nextKey;
  if(dkey(U.date)===prevKey)U.date=parseKey(nextKey);
  /* 미완료 할 일 이월도 공부일이 실제로 바뀐 이 순간에만 실행됩니다. */
  carryOver();pruneLetters();render(true);
  try{window.dispatchEvent(new CustomEvent('planon:studydaychange',{detail:{oldKey:prevKey,newKey:nextKey}}));}catch(e){}
  return true;
}
setInterval(syncStudyDayBoundary,30000);
setInterval(function(){if(Sync.db&&!document.hidden&&!Sync.busy&&!Sync.timer&&!memoTimer&&!M.type){pull();if(Sync.kind==='supa')friendLoad();}},45000);
registerSW();
if(typeof S!=='undefined'&&S.settings&&S.settings.friendNotify)registerSW();
var friendPollTick=0;
setInterval(function(){if(Sync.kind!=='supa'||!Sync.uid)return;friendPollTick++;if(document.hidden&&friendPollTick%2)return;friendRequestLoad();},12000);

/* ---------- 분리 파일 Safari 호환 ---------- */
try{Object.defineProperty(window,'S',{configurable:true,get:function(){return S;},set:function(v){S=v;}});}
catch(e){try{window.S=S;}catch(_e){}}
try{Object.defineProperty(window,'U',{configurable:true,get:function(){return U;},set:function(v){U=v;}});}
catch(e){try{window.U=U;}catch(_e){}}
try{Object.defineProperty(window,'M',{configurable:true,get:function(){return M;},set:function(v){M=v;}});}
catch(e){try{window.M=M;}catch(_e){}}
window.$=$;
window.esc=esc;
window.uid=uid;
window.bad=bad;
window.armed=armed;
window.save=save;
window.render=render;
window.openModal=openModal;
window.closeModal=closeModal;
window.inAppToast=inAppToast;
window.dkey=dkey;
window.studyDayKey=studyDayKey;
window.pad=pad;
window.dow=dow;
window.mdTxt=mdTxt;
window.courseNames=courseNames;
window.shrinkImage=shrinkImage;
window.diaryDateKey=diaryDateKey;
window.DAYS=DAYS;
window.refreshTaskAssign=refreshTaskAssign;
window.bindTaskDrag=bindTaskDrag;

/* ---------- UX 모듈 브리지 ---------- */
window.PLANON_UX_BRIDGE={
  state:function(){return S;}, ui:function(){return U;}, modal:function(){return M;},
  save:save, render:render, openModal:openModal, closeModal:closeModal,
  openSchedule:openSchedule, openExam:openExam, openDD:openDD, openAppointment:openAppointment,
  addTodo:addTodo, todayKey:todayKey, dkey:dkey, parseKey:parseKey, studyDayDate:studyDayDate, studyDayKey:studyDayKey,
  plannerMode:plannerMode, plannerModeMeta:plannerModeMeta, featOn:featOn,
  dayCloseStats:dayCloseStats, logVal:logVal, logItemOn:logItemOn,
  db:function(){return friendDb();}, friendState:function(){return FriendSync;},
  account:function(){return {uid:Sync.uid||'',email:Sync.email||'',loggedIn:!!Sync.uid};},
  syncInfo:function(){return {kind:Sync.kind||'',dirty:!!Sync.dirty,localAt:SyncUI.localAt||0,remoteAt:Sync.lastSeen||0,snapOk:Sync.snapOk||0,snapErr:Sync.snapErr||'',diag:Sync.diag||'',deleting:!!Sync.deleting};},
  markAuthoritativeSave:function(){if(Sync&&Sync.uid){Sync.forceRestore=true;Sync.dirty=true;}},
  normalizeState:function(x){return normalize(x);}, migrateState:function(x){return migratePlannerState(x);},
  toast:inAppToast
};

/* ---------- 시작 ---------- */
applyTheme();
carryOver();
setTimeout(checkMorningBriefing,900);
setTimeout(function(){if(Sync.kind==='supa'&&Sync.uid)cheerDeliverDue();},1800);
setTimeout(enhanceDates,0);
pruneLetters();
var gmatch=location.hash.match(/^#m=([0-9a-f-]{36})$/i);if(gmatch)U.guest={token:gmatch[1].toLowerCase(),state:'loading',mine:{},week:0};
window.addEventListener('hashchange',function(){var g=location.hash.match(/^#m=([0-9a-f-]{36})$/i);if(g&&(!U.guest||U.guest.token!==g[1].toLowerCase())){closeModal();U.guest={token:g[1].toLowerCase(),state:'loading',mine:{},week:0};render(true);guestLoad();}});
render(true);
bkMigrate().then(recoverLocalBackup).then(initSync,function(){initSync();});
restoreFocus();
})();

document.addEventListener('input',function(e){if(e.target&&e.target.id==='f-checklist'){clearTimeout(window.__taskTimer);window.__taskTimer=setTimeout(function(){refreshTaskAssign();bindTaskDrag();},180);}});
document.addEventListener('dragend',function(){setTimeout(bindTaskDrag,0);});

/* PLANON build: safari-S-fix 2026-09-25 */
