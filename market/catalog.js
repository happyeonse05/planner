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
  meonbyeolTheme:9900, meonbyeolRandom:9900, meonbyeolPick:15900, meonbyeolEgg:9900, meondolTheme:9900, wearItem:2500, wearSet:9900,
  functionPack:1900, premiumPack:2900, coupleTogether:15900
};
var C={
  theme:'테마', timetable:'시간표 디자인', background:'배경', icons:'아이콘/체크박스',
  bokbok:'복복복 · 먼별', character:'캐릭터', weeklyExport:'주간 플래너 저장', frame:'포토카드/회고 프레임',
  widget:'위젯', preset:'플래너 세팅', studyTemplate:'공부 템플릿', bundle:'번들',
  studentPack:'학생', examPack:'수험', workPack:'직장 · 프로젝트', startupPack:'창업', creatorPack:'크리에이터 · N잡', travelPack:'여행', fandomPack:'팬덤', petPack:'반려생활', lifePack:'라이프', moneyPack:'머니 · 생활', decoPack:'다꾸', relationTheme:'관계 테마'
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

  /* 관계 테마 — 기능팩/캐릭터/다꾸와 독립 슬롯 */
  official({id:'couple-together-theme',category:'relationTheme',productType:'relationTheme',name:'애인과 함께',description:'기억의 페이지 FINAL의 데이트 흐름을 PLANON에 옮긴 커플 관계 테마. 약속 → 서로 수락 → 티켓 → 데이트 마감 → 기억의 페이지 → 월간 Chapter로 이어져요. 먼별&먼돌 커플 세트가 포함되며 적용 전에 누가 먼별/먼돌인지 정해요.',price:P.coupleTogether,tags:['커플','기억의 페이지','먼별','먼돌'],thumbnail:{colors:['#FFF8EE','#F5DDE5','#E7E0F2','#8B7281']},payload:{relationKey:'couple',includesPair:true},bundleItems:['meonbyeol-theme','meondol-theme']}),
  official({id:'friend-together-theme',category:'relationTheme',productType:'relationTheme',name:'친구랑 함께',description:'실제 PLANON 친구 또는 내가 만든 가상 상대와 함께 집중해요. 나만·분할·상대만 보기, 클리어 피드, 같이 집중, 누적 집중시간 대결을 지원해요.',price:0,isFree:true,tags:['친구','집중','대결','함께'],thumbnail:{colors:['#EEF5F0','#E6ECF7','#FFF9EA','#66756E']},payload:{relationKey:'friend'}}),

  /* 전체 테마 */
  official({id:'butter-yellow-theme',category:'theme',productType:'theme',name:'버터 옐로우 테마',description:'버터처럼 포근한 옐로우. 카드·버튼·일정·체크 포인트가 한 세트로 바뀌어요.',price:P.butterTheme,tags:['다꾸','옐로우'],thumbnail:{colors:['#fff1b8','#fff9df','#f5ce62','#8c6723']},payload:{theme:{background:'#fff1b8',primary:'#f5ce62',secondary:'#fff5d2',card:'#fffdf4',schedule:'#f5d984',border:'#ead89e',button:'#fff0b9',icon:'#7a5c25',ink:'#3d351e',sub:'#8e815d',iconStyle:'soft'}}}),
  official({id:'strawberry-milk-theme',category:'theme',productType:'theme',name:'딸기우유 테마',description:'딸기우유 핑크와 크림 화이트를 묶은 전체 테마.',price:P.strawberryTheme,tags:['핑크','다꾸'],thumbnail:{colors:['#ffdce5','#fff8fa','#f4aebe','#98566a']},payload:{theme:{background:'#ffdce5',primary:'#f4aebe',secondary:'#ffedf2',card:'#fffafa',schedule:'#f5c4cf',border:'#f0ccd5',button:'#ffe8ee',icon:'#8f5362',ink:'#412f35',sub:'#967983',iconStyle:'soft'}}}),
  official({id:'mint-deco-theme',category:'theme',productType:'theme',name:'민트 다꾸 테마',description:'민트 스티커북처럼 산뜻하지만 일정 가독성은 유지한 테마.',price:P.mintTheme,tags:['민트','다꾸'],thumbnail:{colors:['#d9f4e8','#fffdf7','#9ed9c5','#39705f']},payload:{theme:{background:'#d9f4e8',primary:'#9ed9c5',secondary:'#eaf8f2',card:'#fffdf7',schedule:'#b8e7d7',border:'#cce8de',button:'#e2f5ee',icon:'#3f7564',ink:'#2f423b',sub:'#78958b',iconStyle:'rounded'}}}),


  /* 기능 패키지 — 색/캐릭터와 독립적으로 홈에 전용 작업판을 설치해요. */
  official({id:'pack-class-notes',category:'studentPack',productType:'functionalPack',name:'수업 정리록 팩',description:'강의별 핵심내용·모르는 점·복습할 것·과제를 한 장에서 정리해요. 홈에는 오늘 수업 정리와 미복습 항목이 보여요.',price:P.functionPack,tags:['학생','수업','강의노트'],thumbnail:{colors:['#fff7dd','#dcebf8','#f4d9df','#8a7964']},payload:{packKey:'classNotes'}}),
  official({id:'pack-assignment',category:'studentPack',productType:'functionalPack',name:'과제 완성 팩',description:'자료조사 → 초안 → 수정 → 제출을 단계로 관리하고 마감 전 남은 작업을 홈에 보여줘요.',price:P.functionPack,tags:['학생','과제','마감'],thumbnail:{colors:['#f7eadc','#f7d7ca','#fffaf4','#8b6858']},payload:{packKey:'assignment'}}),
  official({id:'pack-team-project',category:'studentPack',productType:'functionalPack',name:'팀플 팩',description:'회의·역할·결정사항·내 액션아이템을 연결해 팀플에서 내가 해야 할 일을 놓치지 않게 해요.',price:P.functionPack,tags:['학생','팀플','회의'],thumbnail:{colors:['#e8f3ee','#d8e7f4','#fffdf7','#60776d']},payload:{packKey:'teamProject'}}),
  official({id:'pack-job-prep',category:'studentPack',productType:'functionalPack',name:'취준 지원관리 팩',description:'기업·직무·서류·면접·결과를 지원 건별로 관리하고 다음 마감을 홈에 모아봐요.',price:P.premiumPack,tags:['취준','지원','면접'],thumbnail:{colors:['#eef0f8','#dfe8f4','#fff','#5e6880']},payload:{packKey:'jobPrep'}}),
  official({id:'pack-exam-semester',category:'examPack',productType:'functionalPack',name:'학기 시험팩',description:'중간·기말·내신용. 과목별 시험일·범위·진도·복습 단계를 홈에서 바로 확인해요.',price:P.premiumPack,tags:['시험','중간고사','기말고사'],thumbnail:{colors:['#fff1d9','#f3d8c7','#e8eef8','#7d6956']},payload:{packKey:'examSemester'}}),
  official({id:'pack-exam-cram',category:'examPack',productType:'functionalPack',name:'벼락치기 시험팩',description:'남은 시간에 맞춰 반드시 끝낼 것·시간 남으면 할 것·미룰 것을 구분하는 D-day 중심 홈.',price:P.functionPack,tags:['시험','벼락치기','D-day'],thumbnail:{colors:['#fff0e7','#f7cfc5','#fffaf6','#8a5e56']},payload:{packKey:'examCram'}}),
  official({id:'pack-exam-long',category:'examPack',productType:'functionalPack',name:'장기 수험 코어팩',description:'고시·장기시험의 기본 코어. 주간 목표·회독·누적 진도를 관리하고, 수능·입시는 입시 확장팩으로 더 세밀하게 쓸 수 있어요.',price:P.premiumPack,tags:['수험','수능','고시'],thumbnail:{colors:['#e8eef8','#dce7dd','#fffdf8','#586b69']},payload:{packKey:'examLong'}}),
  official({id:'pack-certificate',category:'examPack',productType:'functionalPack',name:'자격증 · 어학 팩',description:'영역별 진도와 회독, 기출·모의시험 점수를 기록해 다음 공부 영역을 바로 확인해요.',price:P.functionPack,tags:['자격증','영어시험','어학'],thumbnail:{colors:['#e8f4ef','#dbe7f7','#fff','#55746a']},payload:{packKey:'certificate'}}),
  official({id:'pack-meeting-notes',category:'workPack',productType:'functionalPack',name:'회의록 팩',description:'회의 목적·논의·결정사항·담당자·기한을 기록하고 후속 업무를 홈 액션아이템으로 연결해요.',price:P.premiumPack,tags:['직장인','회의록','업무'],thumbnail:{colors:['#f2eee7','#dfe6ec','#fff','#606b73']},payload:{packKey:'meetingNotes'}}),
  official({id:'pack-workday',category:'workPack',productType:'functionalPack',name:'업무 데일리 팩',description:'오늘 업무·대기 중·미팅·내일로 넘길 일을 분리해서 직장인용 홈 작업판을 만들어요.',price:P.functionPack,tags:['직장인','업무','데일리'],thumbnail:{colors:['#edf2f4','#e4eadf','#fff','#5f6c67']},payload:{packKey:'workday'}}),
  official({id:'pack-project',category:'workPack',productType:'functionalPack',name:'프로젝트 팩',description:'목표·마일스톤·작업·리스크·다음 액션을 프로젝트별로 관리해요.',price:P.premiumPack,tags:['프로젝트','프리랜서','업무'],thumbnail:{colors:['#e9eef7','#e9e1f2','#fff','#646176']},payload:{packKey:'project'}}),
  official({id:'pack-startup',category:'startupPack',productType:'functionalPack',name:'창업 빌더 팩',description:'문제정의·타깃고객·가설·인터뷰·MVP·지표·수익모델·지원사업 준비까지 창업 과정을 홈에서 이어가요.',price:P.premiumPack,tags:['창업','MVP','시장검증','사업계획서'],thumbnail:{colors:['#fff1cf','#f5d6bf','#dcebe5','#705f4b']},payload:{packKey:'startup'}}),
  official({id:'pack-business-docs',category:'startupPack',productType:'functionalPack',name:'창업 문서작성 팩',description:'문제·고객·솔루션·시장·경쟁·BM·실행계획·팀·예산·성과지표를 질문형 카드로 채워 사업계획서 재료를 모아요.',price:P.premiumPack,tags:['창업','사업계획서','지원서'],thumbnail:{colors:['#f7ead8','#e7e2f2','#e0eee8','#6e675d']},payload:{packKey:'businessDocs'}}),
  official({id:'pack-content',category:'creatorPack',productType:'functionalPack',name:'콘텐츠 파이프라인 CORE',description:'아이디어 → 대본 → 촬영 → 편집 → 업로드 상태를 빠르게 관리하는 크리에이터 기본팩. 씬·대사 관리는 스크립트 확장팩에서 더해요.',price:P.functionPack,tags:['영상','콘텐츠','크리에이터'],thumbnail:{colors:['#f7e5e8','#f5e9d7','#e6eef6','#765f66']},payload:{packKey:'content'}}),
  official({id:'pack-freelance',category:'creatorPack',productType:'functionalPack',name:'N잡 · 프리랜서 팩',description:'본업·외주·개인 프로젝트를 분리하고 작업시간·단가·정산일·미수금을 함께 관리해요.',price:P.premiumPack,tags:['N잡','프리랜서','외주','정산'],thumbnail:{colors:['#edf0f6','#e9e1f0','#fff8ed','#626579']},payload:{packKey:'freelance'}}),
  official({id:'pack-habit-challenge',category:'lifePack',productType:'functionalPack',name:'갓생 · 루틴 챌린지 팩',description:'기상·공부·생활 루틴을 스트릭과 주간 달성 기록으로 관리해요. 캐릭터 테마와 함께 써도 기능은 독립적으로 유지돼요.',price:P.functionPack,tags:['갓생','루틴','챌린지'],thumbnail:{colors:['#fff0c9','#e7f0df','#f9e4e8','#756b4f']},payload:{packKey:'habitChallenge'}}),
  official({id:'pack-independent',category:'lifePack',productType:'functionalPack',name:'자취 · 생활력 팩',description:'식재료 유통기한, 공과금·월세 납부일, 청소·분리수거 주기를 한 생활판에서 관리해요.',price:P.functionPack,tags:['자취','1인가구','생활'],thumbnail:{colors:['#f6eadb','#e4eee4','#dfeaf4','#6f746b']},payload:{packKey:'independent'}}),
  official({id:'pack-budget',category:'moneyPack',productType:'functionalPack',name:'머니 · 예산 팩',description:'주간 예산, 고정지출·구독 결제일, 저축 목표를 일정과 함께 가볍게 기록해요.',price:P.premiumPack,tags:['예산','고정지출','저축'],thumbnail:{colors:['#e7f0e7','#f7edcf','#eef1f7','#61715f']},payload:{packKey:'budget'}}),
  official({id:'pack-fitness',category:'lifePack',productType:'functionalPack',name:'운동 · 식단 팩',description:'운동 루틴·운동시간·식사·물 체크와 주간 달성 기록을 플래너 일정과 함께 관리해요.',price:P.functionPack,tags:['운동','식단','루틴'],thumbnail:{colors:['#e8f2ea','#f7e8df','#e7edf7','#60736a']},payload:{packKey:'fitness'}}),
  official({id:'pack-couple',category:'lifePack',productType:'functionalPack',name:'커플 플래너 팩',description:'기념일·약속·함께할 일·준비물·추억 메모를 기존 친구/약속 기능과 나란히 관리해요.',price:P.functionPack,tags:['커플','기념일','약속'],thumbnail:{colors:['#f9e3e6','#fff1d9','#eee7f5','#8b626b']},payload:{packKey:'couple'}}),
  official({id:'pack-fandom',category:'fandomPack',productType:'functionalPack',name:'덕질 · 입덕 팩',description:'컴백·공연·티켓팅·예판·굿즈 배송·최애 스케줄을 한 캘린더에 모아봐요.',price:P.functionPack,tags:['덕질','공연','티켓팅'],thumbnail:{colors:['#eee6f7','#f7e4ee','#e6eff8','#6e637d']},payload:{packKey:'fandom'}}),
  official({id:'pack-travel',category:'travelPack',productType:'functionalPack',name:'여행 · 메이트 팩',description:'날짜별 동선·예약·준비물·동행 정산·추억카드까지 여행 전후를 한 번에 관리해요.',price:P.functionPack,tags:['여행','준비물','일정'],thumbnail:{colors:['#e4f2ed','#dfeaf7','#fff2d9','#5e756e']},payload:{packKey:'travel'}}),
  official({id:'pack-entrance-exam',category:'examPack',productType:'functionalPack',name:'입시 · 재수 확장팩',description:'장기 수험 코어를 수능·입시에 맞게 확장. 순공시간·실전 시간표·모의고사·오답·다음날 보정을 더해요.',price:P.premiumPack,tags:['수능','입시','재수','순공'],thumbnail:{colors:['#e7edf7','#f6eadb','#e5efe6','#59697b']},payload:{packKey:'entranceExam'}}),
  official({id:'pack-creator-script',category:'creatorPack',productType:'functionalPack',name:'스크립트 제작 확장팩',description:'콘텐츠 파이프라인 CORE에 씬별 구성·대사·자막·촬영 준비·편집 체크를 더하는 제작 특화 확장팩.',price:P.premiumPack,tags:['영상','숏폼','대본','칸반'],thumbnail:{colors:['#f5e4e8','#eee6f5','#e3edf7','#735f74']},payload:{packKey:'creatorScript'}}),
  official({id:'pack-life-admin',category:'moneyPack',productType:'functionalPack',name:'생활관리 팩',description:'병원·은행·택배·반납·구독 갱신처럼 생활 속 마감 업무를 예약→준비→완료→다음 갱신까지 관리해요.',price:P.functionPack,tags:['생활','예약','갱신','반납'],thumbnail:{colors:['#F4EEE5','#E7EFE9','#E8EDF5','#68716D']},payload:{packKey:'lifeAdmin'}}),
  official({id:'pack-portfolio',category:'studentPack',productType:'functionalPack',name:'포트폴리오 빌더 팩',description:'프로젝트의 문제·내 역할·결과·수치 근거·회고를 카드로 쌓아 취업·외주·창업 포트폴리오 재료로 만들어요.',price:P.premiumPack,tags:['포트폴리오','프로젝트','취준'],thumbnail:{colors:['#EEEAF4','#E6EDF6','#FFF4E4','#696578']},payload:{packKey:'portfolio'}}),
  official({id:'pack-event-ops',category:'workPack',productType:'functionalPack',name:'행사 · 프로젝트 운영 팩',description:'동아리·스터디·축제·공모전의 마일스톤·역할·준비물·회의결정·당일 운영·회고를 한 보드에서 관리해요.',price:P.premiumPack,tags:['행사','동아리','스터디','운영'],thumbnail:{colors:['#E7F0EB','#F5E9DB','#E4EAF4','#63736C']},payload:{packKey:'eventOps'}}),
  official({id:'pack-pet-care',category:'petPack',productType:'functionalPack',name:'반려동물 · 집사 팩',description:'병원·접종·복약·사료·모래 교체 주기와 오늘의 컨디션 기록을 놓치지 않게 관리해요.',price:P.functionPack,tags:['반려동물','접종','병원','집사'],thumbnail:{colors:['#f5eadb','#e5efe7','#f7e5e5','#71675d']},payload:{packKey:'petCare'}}),
  official({id:'pack-routine',category:'lifePack',productType:'functionalPack',name:'루틴 리셋 팩',description:'아침·저녁 루틴과 이번 주 유지 목표를 가볍게 체크하는 생활용 작업판이에요.',price:P.functionPack,tags:['루틴','습관','생활'],thumbnail:{colors:['#f2eadf','#e5efdf','#fff','#6c7665']},payload:{packKey:'routine'}}),

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
  /* 먼별 권한(entitlement) 본체. 목록에는 숨기고, 아래 두 상품 중 하나만 가져도 보유로 처리돼요.
     예전에 meonbyeol-theme 를 산 사람은 그대로 보유 → 다시 결제하지 않아요. */
  /* 먼별 테마: 알에서 태어나요(질문 20개) · 빛깔은 평생 고정 · 다른 빛깔은 새 알로.
     예전 뽑기/선택형(meonbyeol-random/pick)이나 2,900원 구매자는 그대로 먼별 테마 보유 → 재결제 없음 */
  official({id:'meonbyeol-theme',category:'bokbok',productType:'meonbyeol',name:'먼별 테마',description:'별사탕 알이 플래너로 와요. 질문 20개에 답하면 나와 닮은 빛깔의 먼별이가 태어나요. 할 일 체크가 별사탕으로 반짝이고, 먼별 탭에서 말 걸기·기상 챌린지·힐링·오늘의 꽃 포카·집중 친구·옷장을 쓸 수 있어요. 적용하면 네모 대신 먼별이만 보여요.',price:P.meonbyeolTheme,tags:['복복복','먼별','테마'],thumbnail:{colors:['#EDE4F6','#FFFDFC','#FFE08A','#8E7BC8']},payload:{meonbyeol:true}}),
  official({id:'meonbyeol-random',category:'bokbok',productType:'meonbyeol',forSale:false,name:'먼별 테마(이전 뽑기형)',description:'이전 판매 상품. 먼별 테마로 그대로 이어져요.',price:P.meonbyeolRandom,tags:['먼별'],thumbnail:{colors:['#EDE4F6','#FFFDFC','#FFE08A','#8E7BC8']},payload:{meonbyeol:true}}),
  official({id:'meonbyeol-pick',category:'bokbok',productType:'meonbyeol',forSale:false,name:'먼별 테마(이전 선택형)',description:'이전 판매 상품. 먼별 테마로 그대로 이어져요.',price:P.meonbyeolPick,tags:['먼별'],thumbnail:{colors:['#FCEEF4','#EAF7F1','#F3ECFB','#FFE08A']},payload:{meonbyeol:true}}),
  official({id:'meonbyeol-egg',category:'bokbok',productType:'meonbyeolEgg',consumable:true,name:'새 먼별 알',description:'먼별이의 빛깔은 바꿀 수 없어요. 다른 빛깔의 먼별을 만나고 싶을 때 새 알을 하나 더 데려와요. 질문 20개에 다시 답하면 새 먼별이가 태어나고, 우리 집 먼별들 중에서 같이 지낼 먼별이를 고를 수 있어요. (먼별 테마가 있어야 해요)',price:P.meonbyeolEgg,tags:['복복복','먼별','알'],thumbnail:{colors:['#FFFDF8','#F7C8D8','#DCCDF2','#FFE9A8']},payload:{egg:true}}),
  official({id:'meondol-theme',category:'bokbok',productType:'meonbyeol',name:'먼돌 테마',description:'헤드폰 낀 먼돌이가 플래너에 굴러와요. 적용하면 네모 대신 먼돌이만 보이고, 먼돌 탭·집중 친구·꽃 포카·옷장을 먼돌이와 함께 써요. 먼별 테마와는 따로예요(한 번에 하나만 적용).',price:P.meondolTheme,tags:['복복복','먼돌','테마'],thumbnail:{colors:['#E6E0EE','#D8D2E2','#C8B8E8','#A79BB4']},payload:{meondol:true}}),
  official({id:'mb-wear-nightcap',category:'bokbok',productType:'wardrobe',name:'옷장 · 수면모자',description:'별 달린 수면모자. 먼별·먼돌 둘 다 입을 수 있어요.',price:P.wearItem,tags:['옷장','먼별','먼돌'],thumbnail:{colors:['#8E9AD8','#FFFDF8','#FFE9A8','#6E7AB8']},payload:{gear:'nightcap'}}),
  official({id:'mb-wear-crown',category:'bokbok',productType:'wardrobe',name:'옷장 · 별 왕관',description:'반짝이는 별 왕관.',price:P.wearItem,tags:['옷장'],thumbnail:{colors:['#FFE08A','#F7B8D2','#C9B2EC','#E0B040']},payload:{gear:'crown'}}),
  official({id:'mb-wear-bunny',category:'bokbok',productType:'wardrobe',name:'옷장 · 토끼 귀',description:'쫑긋 토끼 귀 머리띠.',price:P.wearItem,tags:['옷장'],thumbnail:{colors:['#FFFDF8','#F7C8D8','#E4D6EC','#B8A0DC']},payload:{gear:'bunny'}}),
  official({id:'mb-wear-berry',category:'bokbok',productType:'wardrobe',name:'옷장 · 딸기 모자',description:'새콤달콤 딸기 모자.',price:P.wearItem,tags:['옷장'],thumbnail:{colors:['#F28AA0','#8CC48C','#FFF6E0','#DE6B86']},payload:{gear:'berryhat'}}),
  official({id:'mb-wear-scarf',category:'bokbok',productType:'wardrobe',name:'옷장 · 목도리',description:'포근한 버터색 목도리.',price:P.wearItem,tags:['옷장'],thumbnail:{colors:['#F4C27A','#FFF1C2','#D89A3A','#FFFDF8']},payload:{gear:'scarf'}}),
  official({id:'mb-wardrobe-set',category:'bokbok',productType:'bundle',name:'먼별·먼돌 옷장 세트',description:'수면모자·별 왕관·토끼 귀·딸기 모자·목도리를 한 번에. 따로 사는 것보다 저렴해요.',price:P.wearSet,tags:['옷장','번들'],thumbnail:{colors:['#8E9AD8','#FFE08A','#F28AA0','#F4C27A']},bundleItems:['mb-wear-nightcap','mb-wear-crown','mb-wear-bunny','mb-wear-berry','mb-wear-scarf']}),
  official({id:'ribbon-nemo',category:'character',productType:'character',name:'리본 네모',description:'네모 캐릭터에 작은 리본 포인트가 생겨요. 표정 기능은 그대로 유지돼요.',price:P.ribbonNemo,tags:['캐릭터','네모'],thumbnail:{colors:['#fae7e8','#c88f9d','#fff7f7','#7b555f']},payload:{characterStyle:'ribbon'}}),
  official({id:'weekly-scrapbook-export',category:'weeklyExport',productType:'weeklyExport',name:'주간 스크랩북 저장 디자인',description:'주간 플래너 이미지 저장 시 크림 종이·진한 포인트 선으로 출력해요.',price:P.weeklyScrapbook,tags:['주간','저장'],thumbnail:{colors:['#fffaf0','#f2dfbd','#8a6a3d','#d6c09a']},payload:{exportStyle:{paper:'#fffaf0',ink:'#3b3026',sub:'#8b7966',line:'#e6d4b8',soft:'#f7ead2'}}}),
  official({id:'retro-review-frame',category:'frame',productType:'frame',name:'회고 포토카드 프레임',description:'일기·주간 회고 카드에 폴라로이드처럼 얇은 프레임을 적용해요.',price:P.retroFrame,tags:['회고','프레임'],thumbnail:{colors:['#fffdf7','#f0dfcb','#c99f7b','#6d5544']},payload:{frameStyle:'polaroid'}}),
  official({id:'dday-widget-skin',category:'widget',productType:'widget',name:'D-day 미니 위젯 스킨',description:'홈의 요약 카드·D-day 포인트를 작은 라벨형 디자인으로 정리해요.',price:P.ddayWidget,tags:['위젯','D-day'],thumbnail:{colors:['#fff8dd','#eacb74','#7b6530','#fffef9']},payload:{widgetStyle:'label'}}),

  /* 실용 세팅은 '꾸미기 팩'과 분리 */
  official({id:'exam-period-pack',category:'preset',productType:'preset',name:'시험기간 세팅팩',description:'주간 회고·오늘 기록·상단 D-day를 켜고 홈을 간단하게 정리하는 시험기간 세팅.',price:P.examPack,tags:['시험기간','세팅'],thumbnail:{colors:['#f4eadb','#d9c1a1','#6c5a47','#fffdf8']},payload:{settings:{liteHome:true,showWeeklyReview:true,showLog:true,showMemo:false,topShow:true,topN:3}}}),
  official({id:'weekly-planner-pack',category:'preset',productType:'preset',name:'주간 플래너 세팅팩',description:'주간 화면·회고·메모를 중심으로 쓰는 플래너 세팅.',price:P.weeklyPack,tags:['주간','세팅'],thumbnail:{colors:['#f9e8d9','#e5c8ad','#7e6450','#fffaf6']},payload:{settings:{liteHome:false,showWeeklyReview:true,showMemo:true,showLog:false,weekend:true}}}),
  official({id:'midterm-3week-template',category:'studyTemplate',productType:'studyTemplate',name:'중간고사 3주 플랜 세팅',description:'시험 3주 전부터 쓰기 좋은 간단한 홈·회고·D-day 조합.',price:P.midtermTemplate,tags:['시험','공부 템플릿'],thumbnail:{colors:['#edf2fb','#cbd8ed','#647895','#fff']},payload:{settings:{liteHome:true,showWeeklyReview:true,showMemo:true,showLog:true,topShow:true,topN:3},templateNote:'D-21부터 과목별 할 일을 적고, 빈 시간 자동배치와 함께 사용하는 세팅입니다.'}}),

  /* 기능 시너지 번들 — 기능팩은 여러 개를 동시에 홈에 설치할 수 있어요. */
  official({id:'bundle-student-starter',category:'bundle',productType:'bundle',name:'대학생 스타터 번들',description:'수업 정리록 + 과제 + 팀플. 수업에서 나온 내용을 과제와 팀 작업까지 이어 쓰는 구성.',price:4900,tags:['학생','기능팩','번들'],thumbnail:{colors:['#fff2d8','#e3edf7','#e9f2e8','#756b5e']},bundleItems:['pack-class-notes','pack-assignment','pack-team-project']}),
  official({id:'bundle-freelancer-pro',category:'bundle',productType:'bundle',name:'프리랜서 프로 번들',description:'N잡·프리랜서 + 프로젝트 + 회의록. 외주 일정부터 후속 업무·정산까지 이어지는 구성.',price:6900,tags:['프리랜서','프로젝트','번들'],thumbnail:{colors:['#e8edf5','#eee5f4','#f5eee3','#606979']},bundleItems:['pack-freelance','pack-project','pack-meeting-notes']}),
  official({id:'bundle-godsaeng',category:'bundle',productType:'bundle',name:'갓생 스타터 번들',description:'갓생 루틴 + 머니 + 루틴 리셋을 묶어 생활 목표와 예산을 함께 관리해요.',price:4900,tags:['갓생','루틴','머니'],thumbnail:{colors:['#fff0c9','#e4efe1','#f2e9dc','#6d735e']},bundleItems:['pack-habit-challenge','pack-budget','pack-routine']}),
  official({id:'bundle-independent',category:'bundle',productType:'bundle',name:'자취 만렙 번들',description:'자취 생활력 + 머니 팩. 유통기한·공과금·생활비를 한 번에 관리해요.',price:3900,tags:['자취','머니','생활'],thumbnail:{colors:['#f5eadc','#e5eee5','#e6edf5','#6c7269']},bundleItems:['pack-independent','pack-budget']}),
  /* 사용자가 말한 '팩'은 실제 꾸미기 조합 */
  official({id:'butter-full-bundle',category:'bundle',productType:'bundle',name:'버터옐로우 다꾸팩',description:'버터 옐로우 테마 + 아이보리·연노랑 도트 + 말랑 체크 + 회고 프레임.',price:P.butterBundle,tags:['버터','도트','다꾸','번들'],thumbnail:{colors:['#fff1b8','#fdf4bc','#fffaf2','#8c6723'],pattern:'dots'},bundleItems:['butter-yellow-theme','bg-dot-yellow-rev','soft-check-icons','retro-review-frame']}),
  official({id:'strawberry-full-bundle',category:'bundle',productType:'bundle',name:'딸기우유 다꾸팩',description:'딸기우유 테마 + 아이보리·핑크 도트 + 리본 네모 + 회고 프레임.',price:P.strawberryBundle,tags:['핑크','도트','다꾸','번들'],thumbnail:{colors:['#ffdce5','#fef8f4','#fdced2','#98566a'],pattern:'dots'},bundleItems:['strawberry-milk-theme','bg-dot-pink-rev','ribbon-nemo','retro-review-frame']}),
  official({id:'mint-full-bundle',category:'bundle',productType:'bundle',name:'민트 다꾸팩',description:'민트 다꾸 테마 + 아이보리·민트 도트 + D-day 위젯 + 주간 저장 디자인.',price:P.mintBundle,tags:['민트','도트','다꾸','번들'],thumbnail:{colors:['#d9f4e8','#faf8ed','#ccecd7','#39705f'],pattern:'dots'},bundleItems:['mint-deco-theme','bg-dot-mint-rev','dday-widget-skin','weekly-scrapbook-export']}),
  official({id:'seasonal-theme-pack',category:'bundle',productType:'bundle',name:'계절 컬러팩',description:'살구·연두·라벤더 특색 컬러를 묶은 시즌 컬러팩.',price:P.seasonalPack,tags:['시즌','컬러','번들'],thumbnail:{colors:['#fbe3cf','#e3efd6','#e7e1f4','#fff']},bundleItems:['special-peach','special-green','special-lavender']})
];
window.PLANON_MARKET_CATALOG={version:2,prices:P,categories:C,products:products};
})();
