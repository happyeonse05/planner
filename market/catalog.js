(function(){
'use strict';
var P={
  butterTheme:1000, strawberryTheme:1000, mintTheme:1000,
  checkTimetable:900, cozyTimetable:900, examPack:1500,
  weeklyPack:1500, seasonalPack:1900, cloudBackground:700,
  softChecks:700, ribbonNemo:900, weeklyScrapbook:900,
  retroFrame:900, ddayWidget:800, midtermTemplate:1500,
  butterBundle:2900
};
var C={
  theme:'테마', timetable:'시간표 디자인', background:'배경', icons:'아이콘/체크박스',
  character:'캐릭터', weeklyExport:'주간 플래너 저장', frame:'포토카드/회고 프레임',
  widget:'위젯', preset:'플래너 세팅', studyTemplate:'공부 템플릿', bundle:'번들'
};
function official(x){return Object.assign({creatorId:'planon-official',creatorName:'Planon',currency:'KRW',forSale:true,marketVersion:1},x);}
var products=[
  official({id:'free-ivory',category:'theme',productType:'theme',name:'기본 아이보리',description:'플래논의 차분한 기본 아이보리 테마.',price:0,isFree:true,tags:['무료','기본'],thumbnail:{colors:['#f7f3ec','#fffdf9','#eadfcf','#b88f69']},payload:{theme:{background:'#f7f3ec',primary:'#eadfcf',secondary:'#f1ebe0',card:'#fffdf9',schedule:'#eadfcf',border:'#e9e2d6',button:'#f1ebe0',icon:'#735c48',ink:'#3b3530',sub:'#9a9086',iconStyle:'line'}}}),
  official({id:'free-pink',category:'theme',productType:'theme',name:'기본 핑크',description:'부드러운 연핑크와 크림 카드 조합.',price:0,isFree:true,tags:['무료','핑크'],thumbnail:{colors:['#f9e5e8','#fffafa','#f4cfd6','#a85f70']},payload:{theme:{background:'#f9e5e8',primary:'#f4cfd6',secondary:'#f8edf0',card:'#fffafa',schedule:'#f4cfd6',border:'#eed8dc',button:'#f8edf0',icon:'#8b5360',ink:'#403436',sub:'#9b8187',iconStyle:'line'}}}),
  official({id:'free-yellow',category:'theme',productType:'theme',name:'기본 옐로우',description:'밝고 편안한 연노랑 플래너 테마.',price:0,isFree:true,tags:['무료','옐로우'],thumbnail:{colors:['#fff6cf','#fffdf4','#f4df9b','#8a6d2e']},payload:{theme:{background:'#fff6cf',primary:'#f4df9b',secondary:'#fff8df',card:'#fffdf4',schedule:'#f4df9b',border:'#eee2bd',button:'#fff8df',icon:'#7b6230',ink:'#3d382b',sub:'#968d71',iconStyle:'line'}}}),
  official({id:'free-mint',category:'theme',productType:'theme',name:'기본 민트',description:'시원한 파스텔 민트 테마.',price:0,isFree:true,tags:['무료','민트'],thumbnail:{colors:['#e3f5ee','#fbfffd','#c4eadb','#4e7768']},payload:{theme:{background:'#e3f5ee',primary:'#c4eadb',secondary:'#edf8f4',card:'#fbfffd',schedule:'#c4eadb',border:'#d5e9e1',button:'#edf8f4',icon:'#527568',ink:'#32403b',sub:'#7e958c',iconStyle:'line'}}}),
  official({id:'free-blue',category:'theme',productType:'theme',name:'기본 블루',description:'공부 화면에 잘 어울리는 연하늘 테마.',price:0,isFree:true,tags:['무료','블루'],thumbnail:{colors:['#e7f1fb','#fbfdff','#c9def2','#526f8a']},payload:{theme:{background:'#e7f1fb',primary:'#c9def2',secondary:'#eef5fb',card:'#fbfdff',schedule:'#c9def2',border:'#d7e4ef',button:'#eef5fb',icon:'#526f8a',ink:'#303a43',sub:'#81909d',iconStyle:'line'}}}),

  official({id:'butter-yellow-theme',category:'theme',productType:'theme',name:'버터 옐로우 테마',description:'버터처럼 포근한 옐로우. 카드·버튼·일정·체크 포인트가 한 세트로 바뀌어요.',price:P.butterTheme,tags:['다꾸','옐로우'],thumbnail:{colors:['#fff1b8','#fff9df','#f5ce62','#8c6723']},payload:{theme:{background:'#fff1b8',primary:'#f5ce62',secondary:'#fff5d2',card:'#fffdf4',schedule:'#f5d984',border:'#ead89e',button:'#fff0b9',icon:'#7a5c25',ink:'#3d351e',sub:'#8e815d',iconStyle:'soft'}}}),
  official({id:'strawberry-milk-theme',category:'theme',productType:'theme',name:'딸기우유 테마',description:'딸기우유 핑크와 크림 화이트를 묶은 전체 테마.',price:P.strawberryTheme,tags:['핑크','다꾸'],thumbnail:{colors:['#ffdce5','#fff8fa','#f4aebe','#98566a']},payload:{theme:{background:'#ffdce5',primary:'#f4aebe',secondary:'#ffedf2',card:'#fffafa',schedule:'#f5c4cf',border:'#f0ccd5',button:'#ffe8ee',icon:'#8f5362',ink:'#412f35',sub:'#967983',iconStyle:'soft'}}}),
  official({id:'mint-deco-theme',category:'theme',productType:'theme',name:'민트 다꾸 테마',description:'민트 스티커북처럼 산뜻하지만 일정 가독성은 유지한 테마.',price:P.mintTheme,tags:['민트','다꾸'],thumbnail:{colors:['#d9f4e8','#fffdf7','#9ed9c5','#39705f']},payload:{theme:{background:'#d9f4e8',primary:'#9ed9c5',secondary:'#eaf8f2',card:'#fffdf7',schedule:'#b8e7d7',border:'#cce8de',button:'#e2f5ee',icon:'#3f7564',ink:'#2f423b',sub:'#78958b',iconStyle:'rounded'}}}),

  official({id:'check-deco-timetable',category:'timetable',productType:'timetable',name:'체크 다꾸 시간표',description:'시간표 칸에 잔잔한 체크 패턴과 둥근 수업 블록을 적용해요.',price:P.checkTimetable,tags:['시간표','체크'],thumbnail:{colors:['#fffaf0','#eddcb9','#c7a974','#75603e'],pattern:'check'},payload:{timetableStyle:'check'}}),
  official({id:'cozy-ivory-timetable',category:'timetable',productType:'timetable',name:'포근한 아이보리 시간표',description:'아이보리 종이 느낌의 시간표 카드와 부드러운 수업 블록.',price:P.cozyTimetable,tags:['시간표','아이보리'],thumbnail:{colors:['#fffaf1','#f3eadc','#dfcdb2','#8c765a']},payload:{timetableStyle:'cozy'}}),
  official({id:'cloud-dots-background',category:'background',productType:'background',name:'구름 도트 배경',description:'작은 크림 도트가 반복되는 차분한 배경.',price:P.cloudBackground,tags:['배경','도트'],thumbnail:{colors:['#dfeefa','#fffdf8','#bdd8ea','#6d8fa5'],pattern:'dots'},payload:{background:{color:'#dfeefa',dot:'#fffdf8',size:34}}}),
  official({id:'soft-check-icons',category:'icons',productType:'icons',name:'말랑 체크 아이콘',description:'체크박스와 완료 표시를 둥글고 말랑한 스타일로 바꿔요.',price:P.softChecks,tags:['아이콘','체크'],thumbnail:{colors:['#fff7df','#e5c16f','#6f5b2d','#ffffff']},payload:{iconStyle:'soft'}}),
  official({id:'ribbon-nemo',category:'character',productType:'character',name:'리본 네모',description:'네모 캐릭터에 작은 리본 포인트가 생겨요. 표정 기능은 그대로 유지돼요.',price:P.ribbonNemo,tags:['캐릭터','네모'],thumbnail:{colors:['#fae7e8','#c88f9d','#fff7f7','#7b555f']},payload:{characterStyle:'ribbon'}}),
  official({id:'weekly-scrapbook-export',category:'weeklyExport',productType:'weeklyExport',name:'주간 스크랩북 저장 디자인',description:'주간 플래너 이미지 저장 시 크림 종이·진한 포인트 선으로 출력해요.',price:P.weeklyScrapbook,tags:['주간','저장'],thumbnail:{colors:['#fffaf0','#f2dfbd','#8a6a3d','#d6c09a']},payload:{exportStyle:{paper:'#fffaf0',ink:'#3b3026',sub:'#8b7966',line:'#e6d4b8',soft:'#f7ead2'}}}),
  official({id:'retro-review-frame',category:'frame',productType:'frame',name:'회고 포토카드 프레임',description:'일기·주간 회고 카드에 폴라로이드처럼 얇은 프레임을 적용해요.',price:P.retroFrame,tags:['회고','프레임'],thumbnail:{colors:['#fffdf7','#f0dfcb','#c99f7b','#6d5544']},payload:{frameStyle:'polaroid'}}),
  official({id:'dday-widget-skin',category:'widget',productType:'widget',name:'D-day 미니 위젯 스킨',description:'홈의 요약 카드·D-day 포인트를 작은 라벨형 디자인으로 정리해요.',price:P.ddayWidget,tags:['위젯','D-day'],thumbnail:{colors:['#fff8dd','#eacb74','#7b6530','#fffef9']},payload:{widgetStyle:'label'}}),

  official({id:'exam-period-pack',category:'preset',productType:'preset',name:'시험기간 테마팩',description:'주간 회고·오늘 기록·상단 D-day를 켜고 홈을 간단하게 정리하는 시험기간 세팅.',price:P.examPack,tags:['시험기간','세팅팩'],thumbnail:{colors:['#f4eadb','#d9c1a1','#6c5a47','#fffdf8']},payload:{settings:{liteHome:true,showWeeklyReview:true,showLog:true,showMemo:false,topShow:true,topN:3}}}),
  official({id:'weekly-planner-pack',category:'preset',productType:'preset',name:'주간 플래너 꾸미기팩',description:'주간 화면·회고·메모를 중심으로 쓰는 플래너 세팅팩.',price:P.weeklyPack,tags:['주간','세팅팩'],thumbnail:{colors:['#f9e8d9','#e5c8ad','#7e6450','#fffaf6']},payload:{settings:{liteHome:false,showWeeklyReview:true,showMemo:true,showLog:false,weekend:true}}}),
  official({id:'midterm-3week-template',category:'studyTemplate',productType:'studyTemplate',name:'중간고사 3주 플랜 세팅',description:'시험 3주 전부터 쓰기 좋은 간단한 홈·회고·D-day 조합을 저장해요. 핵심 기능은 무료 그대로예요.',price:P.midtermTemplate,tags:['시험','공부 템플릿'],thumbnail:{colors:['#edf2fb','#cbd8ed','#647895','#fff']},payload:{settings:{liteHome:true,showWeeklyReview:true,showMemo:true,topShow:true,topN:3},templateNote:'D-21부터 과목별 할 일을 적고, 빈 시간 자동배치와 함께 사용하는 세팅입니다.'}}),
  official({id:'seasonal-theme-pack',category:'bundle',productType:'bundle',name:'계절 한정 테마팩',description:'봄 핑크·여름 민트·가을 아이보리 느낌을 한 번에 보유하는 시즌 번들.',price:P.seasonalPack,tags:['시즌','번들'],thumbnail:{colors:['#ffdce5','#d9f4e8','#f3e4c8','#fff']},bundleItems:['strawberry-milk-theme','mint-deco-theme','cozy-ivory-timetable']}),
  official({id:'butter-full-bundle',category:'bundle',productType:'bundle',name:'버터옐로우 전체팩',description:'버터 테마 + 체크 시간표 + 말랑 체크 + D-day 위젯 + 회고 프레임을 묶은 전체팩.',price:P.butterBundle,tags:['버터','번들'],thumbnail:{colors:['#fff1b8','#f5ce62','#fffaf0','#8c6723']},bundleItems:['butter-yellow-theme','check-deco-timetable','soft-check-icons','dday-widget-skin','retro-review-frame']})
];
window.PLANON_MARKET_CATALOG={version:1,prices:P,categories:C,products:products};
})();