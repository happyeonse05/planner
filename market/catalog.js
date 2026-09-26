(function(){
'use strict';
/* 가격은 여기만 바꾸면 Shop 전체에 반영돼요. */
var P={
  specialColor:800, dotBackground:700,
  butterTheme:1000, strawberryTheme:1000, mintTheme:1000,
  checkTimetable:900, cozyTimetable:900,
  softChecks:700, ribbonNemo:900, weeklyScrapbook:900, retroFrame:900, ddayWidget:800,
  examPack:1500, weeklyPack:1500, midtermTemplate:1500,
  butterBundle:2900, strawberryBundle:2900, mintBundle:2900, seasonalPack:1900,
  meonbyeolTheme:2900
};
var C={
  theme:'테마', timetable:'시간표 디자인', background:'배경', icons:'아이콘/체크박스',
  character:'캐릭터', weeklyExport:'주간 플래너 저장', frame:'포토카드/회고 프레임',
  widget:'위젯', preset:'플래너 세팅', studyTemplate:'공부 템플릿', bundle:'번들'
};
function official(x){return Object.assign({creatorId:'planon-official',creatorName:'Planon',currency:'KRW',forSale:true,marketVersion:2},x);}
function theme(id,name,color,theme,isFree){return official({id:id,category:'theme',productType:'theme',name:name,description:(isFree?'처음부터 무료로 쓸 수 있는 기본 컬러.':'기본 무료 컬러와 다른 특색 컬러. 앱 전체 포인트가 같은 톤으로 맞춰져요.'),price:isFree?0:P.specialColor,isFree:!!isFree,legacyColor:color,tags:[isFree?'무료':'특색 컬러','컬러'],thumbnail:{colors:[theme.background,theme.card,theme.primary,theme.icon]},payload:{theme:theme}});}
function bg(id,name,key,color,dot){return official({id:id,category:'background',productType:'background',name:name,description:'플래논에서 쓰던 작은 도트무늬 배경. 기본 컬러 5종과 별도로 구매하는 꾸미기 아이템이에요.',price:P.dotBackground,legacyBg:key,tags:['도트','배경','다꾸'],thumbnail:{colors:[color,dot,color,dot],pattern:'dots'},payload:{background:{color:color,dot:dot,size:40,legacyKey:key}}});}
var products=[
  /* 무료는 딱 기본 컬러 5종 */
  theme('free-ivory','기본 아이보리','#faefdc',{background:'#f7f3ec',primary:'#faefdc',secondary:'#f5efe6',card:'#fffdf9',schedule:'#faefdc',border:'#e9e2d6',button:'#f5efe6',icon:'#735c48',ink:'#3b3530',sub:'#9a9086',iconStyle:'line'},true),
  theme('free-pink','기본 핑크','#f8dedd',{background:'#f9e8e8',primary:'#f8dedd',secondary:'#fbefef',card:'#fffafa',schedule:'#f8dedd',border:'#eed8dc',button:'#fbefef',icon:'#8b5360',ink:'#403436',sub:'#9b8187',iconStyle:'line'},true),
  theme('free-yellow','기본 옐로우','#f8edc4',{background:'#fff8dc',primary:'#f8edc4',secondary:'#fff9e7',card:'#fffdf4',schedule:'#f8edc4',border:'#eee2bd',button:'#fff9e7',icon:'#7b6230',ink:'#3d382b',sub:'#968d71',iconStyle:'line'},true),
  theme('free-mint','기본 민트','#d9efe6',{background:'#e8f6f0',primary:'#d9efe6',secondary:'#f0faf6',card:'#fbfffd',schedule:'#d9efe6',border:'#d5e9e1',button:'#f0faf6',icon:'#527568',ink:'#32403b',sub:'#7e958c',iconStyle:'line'},true),
  theme('free-blue','기본 블루','#dce9f7',{background:'#edf5fc',primary:'#dce9f7',secondary:'#f2f7fc',card:'#fbfdff',schedule:'#dce9f7',border:'#d7e4ef',button:'#f2f7fc',icon:'#526f8a',ink:'#303a43',sub:'#81909d',iconStyle:'line'},true),

  /* 기존 팔레트의 나머지 색은 유료 특색 컬러 */
  theme('special-gray','소프트 그레이 컬러','#ebebee',{background:'#f2f2f4',primary:'#ebebee',secondary:'#f7f7f8',card:'#ffffff',schedule:'#ebebee',border:'#dedee2',button:'#f4f4f6',icon:'#62636a',ink:'#343438',sub:'#8d8e95',iconStyle:'line'},false),
  theme('special-peach','살구 컬러','#fbe3cf',{background:'#fff0e4',primary:'#fbe3cf',secondary:'#fff5ec',card:'#fffdfb',schedule:'#fbe3cf',border:'#efd8c4',button:'#fff2e7',icon:'#8b654d',ink:'#40352f',sub:'#987f70',iconStyle:'line'},false),
  theme('special-green','연두 컬러','#e3efd6',{background:'#eef6e4',primary:'#e3efd6',secondary:'#f4f9ed',card:'#fdfff9',schedule:'#e3efd6',border:'#dbe7cf',button:'#f2f8eb',icon:'#607653',ink:'#354031',sub:'#85947d',iconStyle:'line'},false),
  theme('special-lavender','라벤더 컬러','#e7e1f4',{background:'#f2eef9',primary:'#e7e1f4',secondary:'#f7f4fb',card:'#fefcff',schedule:'#e7e1f4',border:'#ded7eb',button:'#f5f1fa',icon:'#6e6081',ink:'#39343f',sub:'#8d8497',iconStyle:'line'},false),

  /* 전체 테마 */
  official({id:'butter-yellow-theme',category:'theme',productType:'theme',name:'버터 옐로우 테마',description:'버터처럼 포근한 옐로우. 카드·버튼·일정·체크 포인트가 한 세트로 바뀌어요.',price:P.butterTheme,tags:['다꾸','옐로우'],thumbnail:{colors:['#fff1b8','#fff9df','#f5ce62','#8c6723']},payload:{theme:{background:'#fff1b8',primary:'#f5ce62',secondary:'#fff5d2',card:'#fffdf4',schedule:'#f5d984',border:'#ead89e',button:'#fff0b9',icon:'#7a5c25',ink:'#3d351e',sub:'#8e815d',iconStyle:'soft'}}}),
  official({id:'strawberry-milk-theme',category:'theme',productType:'theme',name:'딸기우유 테마',description:'딸기우유 핑크와 크림 화이트를 묶은 전체 테마.',price:P.strawberryTheme,tags:['핑크','다꾸'],thumbnail:{colors:['#ffdce5','#fff8fa','#f4aebe','#98566a']},payload:{theme:{background:'#ffdce5',primary:'#f4aebe',secondary:'#ffedf2',card:'#fffafa',schedule:'#f5c4cf',border:'#f0ccd5',button:'#ffe8ee',icon:'#8f5362',ink:'#412f35',sub:'#967983',iconStyle:'soft'}}}),
  official({id:'mint-deco-theme',category:'theme',productType:'theme',name:'민트 다꾸 테마',description:'민트 스티커북처럼 산뜻하지만 일정 가독성은 유지한 테마.',price:P.mintTheme,tags:['민트','다꾸'],thumbnail:{colors:['#d9f4e8','#fffdf7','#9ed9c5','#39705f']},payload:{theme:{background:'#d9f4e8',primary:'#9ed9c5',secondary:'#eaf8f2',card:'#fffdf7',schedule:'#b8e7d7',border:'#cce8de',button:'#e2f5ee',icon:'#3f7564',ink:'#2f423b',sub:'#78958b',iconStyle:'rounded'}}}),

  /* 기존 플래논 도트 배경은 모두 유료 꾸미기 상품 */
  bg('bg-pink-white','연핑크 + 흰 점','pink','#fbd6de','#ffffff'),
  bg('bg-white-pink','흰 바탕 + 연핑크 점','white','#fffdfd','#fbd3dc'),
  bg('bg-beige-white','베이지 + 흰 점','beige','#fbf0e0','#fffaf2'),
  bg('bg-dot-mint','민트 + 아이보리 도트','dot-mint','#ccecd7','#fffaf2'),
  bg('bg-dot-mint-rev','아이보리 + 민트 도트','dot-mint-rev','#faf8ed','#ccecd7'),
  bg('bg-dot-sky','하늘 + 아이보리 도트','dot-sky','#c7e3fd','#fffaf2'),
  bg('bg-dot-sky-rev','아이보리 + 하늘 도트','dot-sky-rev','#fcfaf4','#c7e3fd'),
  bg('bg-dot-yellow','연노랑 + 아이보리 도트','dot-yellow','#fdf4bc','#fffaf2'),
  bg('bg-dot-yellow-rev','아이보리 + 연노랑 도트','dot-yellow-rev','#fefaf2','#fdf4bc'),
  bg('bg-dot-peach','살구 + 아이보리 도트','dot-peach','#fcd3c2','#fffaf2'),
  bg('bg-dot-peach-rev','아이보리 + 살구 도트','dot-peach-rev','#fef7ea','#fcd3c2'),
  bg('bg-dot-pink','연핑크 + 아이보리 도트','dot-pink','#fdced2','#fffaf2'),
  bg('bg-dot-pink-rev','아이보리 + 연핑크 도트','dot-pink-rev','#fef8f4','#fdced2'),
  bg('bg-dot-lavender','라벤더 + 아이보리 도트','dot-lavender','#e6d5f2','#fffaf2'),
  bg('bg-dot-lavender-rev','아이보리 + 라벤더 도트','dot-lavender-rev','#fefaf3','#e6d5f2'),
  bg('bg-dot-green','연두 + 아이보리 도트','dot-green','#dbe7c4','#fffaf2'),
  bg('bg-dot-green-rev','아이보리 + 연두 도트','dot-green-rev','#fdf9ef','#dbe7c4'),
  bg('bg-dot-gray','연회색 + 아이보리 도트','dot-gray','#e2e0df','#fffaf2'),
  bg('bg-dot-gray-rev','아이보리 + 연회색 도트','dot-gray-rev','#fdf9ef','#e2e0df'),
  bg('bg-dot-beige','베이지 + 아이보리 도트','dot-beige','#edddca','#fffaf2'),
  bg('bg-dot-beige-rev','아이보리 + 베이지 도트','dot-beige-rev','#fffaf0','#edddca'),

  official({id:'check-deco-timetable',category:'timetable',productType:'timetable',name:'체크 다꾸 시간표',description:'시간표 칸에 잔잔한 체크 패턴과 둥근 수업 블록을 적용해요.',price:P.checkTimetable,tags:['시간표','체크'],thumbnail:{colors:['#fffaf0','#eddcb9','#c7a974','#75603e'],pattern:'check'},payload:{timetableStyle:'check'}}),
  official({id:'cozy-ivory-timetable',category:'timetable',productType:'timetable',name:'포근한 아이보리 시간표',description:'아이보리 종이 느낌의 시간표 카드와 부드러운 수업 블록.',price:P.cozyTimetable,tags:['시간표','아이보리'],thumbnail:{colors:['#fffaf1','#f3eadc','#dfcdb2','#8c765a']},payload:{timetableStyle:'cozy'}}),
  official({id:'soft-check-icons',category:'icons',productType:'icons',name:'말랑 체크 아이콘',description:'체크박스와 완료 표시를 둥글고 말랑한 스타일로 바꿔요.',price:P.softChecks,tags:['아이콘','체크'],thumbnail:{colors:['#fff7df','#e5c16f','#6f5b2d','#ffffff']},payload:{iconStyle:'soft'}}),
  official({id:'meonbyeol-theme',category:'character',productType:'meonbyeol',name:'먼별 테마',description:'먼지 별사탕 먼별이 플래너에 이사 와요. 할 일 먼지를 누르면 빛나는 별사탕으로 변하고, 먼별 탭에서 말 걸기·기상 챌린지·힐링하기·오늘의 꽃·이달의 하늘·미용실(별로 색 교환)을 쓸 수 있어요. 적용 후 언제든 해제 가능.',price:P.meonbyeolTheme,tags:['캐릭터','먼별','테마'],thumbnail:{colors:['#EDE4F6','#FFFDFC','#FFE08A','#8E7BC8']},payload:{meonbyeol:true}}),
  official({id:'ribbon-nemo',category:'character',productType:'character',name:'리본 네모',description:'네모 캐릭터에 작은 리본 포인트가 생겨요. 표정 기능은 그대로 유지돼요.',price:P.ribbonNemo,tags:['캐릭터','네모'],thumbnail:{colors:['#fae7e8','#c88f9d','#fff7f7','#7b555f']},payload:{characterStyle:'ribbon'}}),
  official({id:'weekly-scrapbook-export',category:'weeklyExport',productType:'weeklyExport',name:'주간 스크랩북 저장 디자인',description:'주간 플래너 이미지 저장 시 크림 종이·진한 포인트 선으로 출력해요.',price:P.weeklyScrapbook,tags:['주간','저장'],thumbnail:{colors:['#fffaf0','#f2dfbd','#8a6a3d','#d6c09a']},payload:{exportStyle:{paper:'#fffaf0',ink:'#3b3026',sub:'#8b7966',line:'#e6d4b8',soft:'#f7ead2'}}}),
  official({id:'retro-review-frame',category:'frame',productType:'frame',name:'회고 포토카드 프레임',description:'일기·주간 회고 카드에 폴라로이드처럼 얇은 프레임을 적용해요.',price:P.retroFrame,tags:['회고','프레임'],thumbnail:{colors:['#fffdf7','#f0dfcb','#c99f7b','#6d5544']},payload:{frameStyle:'polaroid'}}),
  official({id:'dday-widget-skin',category:'widget',productType:'widget',name:'D-day 미니 위젯 스킨',description:'홈의 요약 카드·D-day 포인트를 작은 라벨형 디자인으로 정리해요.',price:P.ddayWidget,tags:['위젯','D-day'],thumbnail:{colors:['#fff8dd','#eacb74','#7b6530','#fffef9']},payload:{widgetStyle:'label'}}),

  /* 실용 세팅은 '꾸미기 팩'과 분리 */
  official({id:'exam-period-pack',category:'preset',productType:'preset',name:'시험기간 세팅팩',description:'주간 회고·오늘 기록·상단 D-day를 켜고 홈을 간단하게 정리하는 시험기간 세팅.',price:P.examPack,tags:['시험기간','세팅'],thumbnail:{colors:['#f4eadb','#d9c1a1','#6c5a47','#fffdf8']},payload:{settings:{liteHome:true,showWeeklyReview:true,showLog:true,showMemo:false,topShow:true,topN:3}}}),
  official({id:'weekly-planner-pack',category:'preset',productType:'preset',name:'주간 플래너 세팅팩',description:'주간 화면·회고·메모를 중심으로 쓰는 플래너 세팅.',price:P.weeklyPack,tags:['주간','세팅'],thumbnail:{colors:['#f9e8d9','#e5c8ad','#7e6450','#fffaf6']},payload:{settings:{liteHome:false,showWeeklyReview:true,showMemo:true,showLog:false,weekend:true}}}),
  official({id:'midterm-3week-template',category:'studyTemplate',productType:'studyTemplate',name:'중간고사 3주 플랜 세팅',description:'시험 3주 전부터 쓰기 좋은 간단한 홈·회고·D-day 조합.',price:P.midtermTemplate,tags:['시험','공부 템플릿'],thumbnail:{colors:['#edf2fb','#cbd8ed','#647895','#fff']},payload:{settings:{liteHome:true,showWeeklyReview:true,showMemo:true,showLog:true,topShow:true,topN:3},templateNote:'D-21부터 과목별 할 일을 적고, 빈 시간 자동배치와 함께 사용하는 세팅입니다.'}}),

  /* 사용자가 말한 '팩'은 실제 꾸미기 조합 */
  official({id:'butter-full-bundle',category:'bundle',productType:'bundle',name:'버터옐로우 다꾸팩',description:'버터 옐로우 테마 + 아이보리·연노랑 도트 + 말랑 체크 + 회고 프레임.',price:P.butterBundle,tags:['버터','도트','다꾸','번들'],thumbnail:{colors:['#fff1b8','#fdf4bc','#fffaf2','#8c6723'],pattern:'dots'},bundleItems:['butter-yellow-theme','bg-dot-yellow-rev','soft-check-icons','retro-review-frame']}),
  official({id:'strawberry-full-bundle',category:'bundle',productType:'bundle',name:'딸기우유 다꾸팩',description:'딸기우유 테마 + 아이보리·핑크 도트 + 리본 네모 + 회고 프레임.',price:P.strawberryBundle,tags:['핑크','도트','다꾸','번들'],thumbnail:{colors:['#ffdce5','#fef8f4','#fdced2','#98566a'],pattern:'dots'},bundleItems:['strawberry-milk-theme','bg-dot-pink-rev','ribbon-nemo','retro-review-frame']}),
  official({id:'mint-full-bundle',category:'bundle',productType:'bundle',name:'민트 다꾸팩',description:'민트 다꾸 테마 + 아이보리·민트 도트 + D-day 위젯 + 주간 저장 디자인.',price:P.mintBundle,tags:['민트','도트','다꾸','번들'],thumbnail:{colors:['#d9f4e8','#faf8ed','#ccecd7','#39705f'],pattern:'dots'},bundleItems:['mint-deco-theme','bg-dot-mint-rev','dday-widget-skin','weekly-scrapbook-export']}),
  official({id:'seasonal-theme-pack',category:'bundle',productType:'bundle',name:'계절 컬러팩',description:'살구·연두·라벤더 특색 컬러를 묶은 시즌 컬러팩.',price:P.seasonalPack,tags:['시즌','컬러','번들'],thumbnail:{colors:['#fbe3cf','#e3efd6','#e7e1f4','#fff']},bundleItems:['special-peach','special-green','special-lavender']})
];
window.PLANON_MARKET_CATALOG={version:2,prices:P,categories:C,products:products};
})();
