(function(){'use strict';
var GEAR_SVG={};
var TINTS_SRC=[
  {name:'민트초코빛', soft:'#EAF7F1', deep:'#C6E6D6', rib:'#8CC4AC', chips:true},
  {name:'솜사탕빛', soft:'#FCEEF4', deep:'#F4D2E0', rib:'#E79ABA', deco:'cotton'},
  {name:'포도우유빛', soft:'#F3ECFB', deep:'#DCCDF2', rib:'#B090DC', deco:'grape'},
  {name:'사이다빛', soft:'#EAF4FC', deep:'#CCE2F4', rib:'#86AFD6', deco:'fizz'},
  {name:'버터쿠키빛', soft:'#FCF7E8', deep:'#F0E2B8', rib:'#D6B472', deco:'crumb'},
  {name:'우유푸딩빛', soft:'#F4F2F7', deep:'#DCD8E4', rib:'#A8A0B6', deco:'caramel'},
  {name:'복숭아우유빛', soft:'#FCF0E6', deep:'#F6D6BC', rib:'#E4A57A', deco:'peachleaf'},
  {name:'녹차라떼빛', soft:'#F0F9E8', deep:'#D4EAC2', rib:'#9AC478', deco:'matcha'},
  {name:'박하사탕빛', soft:'#E9F7F7', deep:'#C2E8E8', rib:'#7CBEBE', deco:'peppermint'},
  {name:'코코아빛', soft:'#F5EAE2', deep:'#DCC0AA', rib:'#AE8468', deco:'marshmallow'},
  {name:'고구마빛', soft:'#F6EAF4', deep:'#DEBCD6', rib:'#BE86AE', deco:'sweetpotato'},
  {name:'캔디케인빛', soft:'#FCE8E8', deep:'#F0AEAE', rib:'#DE7A7A', deco:'candycane'},
  {name:'딸기라떼빛', soft:'#FCEDF1', deep:'#F4C2D0', rib:'#E68AA6', deco:'strawberry'},
  {name:'단풍라떼빛', soft:'#FAEEE0', deep:'#EAC29E', rib:'#D69A64', deco:'maple'},
  {name:'눈사람빛', soft:'#FCFDFE', deep:'#E2EBF4', rib:'#96B2CE', deco:'snowman'},
  {name:'옥수수빛', soft:'#FFF8E0', deep:'#F0DC8A', rib:'#C8A84A', deco:'corn'},
  {name:'수박빛', soft:'#FCECEC', deep:'#F0A8A8', rib:'#D06868', deco:'watermelon'},
  {name:'체리빛', soft:'#FCE4EC', deep:'#F09AB8', rib:'#D05878', deco:'cherry'},
  {name:'귤빛', soft:'#FFF4E0', deep:'#F0C888', rib:'#D8944A', deco:'tangerine'},
];
function renderByeol(svg,o){
  const t=o.tint, acc=o.acc, isDusty=!!o.dusty, lv=o.dustLevel||0, baby=o.baby;
  /* 먼지는 캐릭터를 덮는 상태가 아니라 표면에 살짝 내려앉는 효과로만 표현한다. */
  const dusty=false;
  const gear=o.gear, scene=o.scene, away=!!o.away&&isDusty;
  const sleep=false, hidden=false, tucked=o.tucked;
  const napping=!!o.napping&&!tucked;
  const eating=scene&&scene.eat;
  const happy=o.happy&&!eating&&!o.tucked;
  const gid='grad_'+svg.id, fid='glow_'+svg.id;
  const bodyTop=dusty?'#F3F1EE':'#FEFDFC', bodyEdge=dusty?'#DFDAD3':t.soft;
  const edge=dusty?'#C9C2B8':t.deep;
  let specks='';
  if(isDusty){
    for(let i=0;i<Math.min(34,Math.max(3,lv*5));i++){
      const a=Math.random()*Math.PI*2, rr=Math.random()*44;
      specks+=`<circle cx="${(100+Math.cos(a)*rr).toFixed(1)}" cy="${(102+Math.sin(a)*rr*.85).toFixed(1)}" r="${(0.8+Math.random()*1.5).toFixed(1)}" fill="${Math.random()>.45?'#B8A99A':'#D0C2B3'}" opacity="${(.22+Math.random()*.2).toFixed(2)}"/>`;
    }
  }
  svg.innerHTML=`
  <defs>
    <radialGradient id="${gid}" cx="42%" cy="34%" r="78%">
      <stop offset="52%" stop-color="${bodyTop}"/>
      <stop offset="100%" stop-color="${bodyEdge}"/>
    </radialGradient>
    <filter id="${fid}" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="3.6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <ellipse cx="100" cy="176" rx="48" ry="8" fill="${edge}" opacity=".38"/>
  ${scene&&scene.back?scene.back:''}
  ${baby||hidden?'':`
  <g transform="rotate(6 160 110)">
    <rect x="160" y="66" width="6.5" height="96" rx="3" fill="#C9A87E"/>
    <rect x="160" y="84" width="6.5" height="4" fill="#B08A64" opacity=".6"/>
    <rect x="160" y="100" width="6.5" height="4" fill="#B08A64" opacity=".6"/>
    ${dusty?'':`<circle class="wand-glow" cx="163" cy="50" r="26" fill="#FFE9A8" opacity=".5" filter="url(#${fid})"/>`}
    <path d="M163.3 28 l6.5 13 14 2.2 -10.2 9.8 2.5 14 -12.8-6.9 -12.8 6.9 2.5-14 -10.2-9.8 14-2.2 z"
      fill="${dusty?'#E4DAC0':'#FBEFC5'}" stroke="${dusty?'#CBBF9E':'#EBD48F'}" stroke-width="2.5" stroke-linejoin="round"
      ${dusty?'':`filter="url(#${fid})"`}/>
    ${dusty?'':`
    <path class="wand-spark" d="M186 44 l1.8 4.4 4.4 1.8 -4.4 1.8 -1.8 4.4 -1.8-4.4 -4.4-1.8 4.4-1.8 z" fill="#FFF6D8"/>
    <path class="wand-spark" d="M142 30 l1.5 3.6 3.6 1.5 -3.6 1.5 -1.5 3.6 -1.5-3.6 -3.6-1.5 3.6-1.5 z" fill="#FFF6D8"/>`}
  </g>`}
  <path d="${cloudPath(100,104,63,10)}" fill="url(#${gid})" stroke="${edge}" stroke-width="2.5" stroke-linejoin="round"/>
  ${specks}
  <ellipse cx="84" cy="168" rx="${baby?6:7}" ry="4.5" fill="#8A7A6A"/>
  <ellipse cx="116" cy="168" rx="${baby?6:7}" ry="4.5" fill="#8A7A6A"/>
  ${baby||hidden?'':`
  <ellipse cx="43" cy="123" rx="9" ry="6" fill="${dusty?'#F3F1EE':'#FDFCFB'}" stroke="${edge}" stroke-width="2"/>
  <ellipse cx="156" cy="120" rx="9" ry="6" fill="${dusty?'#F3F1EE':'#FDFCFB'}" stroke="${edge}" stroke-width="2"/>
  <path d="M66 116 Q100 140 126 152" stroke="#B08A64" stroke-width="5" fill="none" stroke-linecap="round"/>
  <rect x="110" y="144" width="34" height="26" rx="9" fill="#B08A64" stroke="#96714E" stroke-width="2"/>
  <path d="M110 152 h34" stroke="#96714E" stroke-width="2"/>
  <circle cx="127" cy="152" r="3" fill="#EBD48F"/>`}
  ${(!dusty&&t.chips)?`
  <g fill="#3E2A1E" opacity=".9">
    <path d="M70 52 q3 -2 4 1 q1 3 -2 4 q-3 1 -4 -2 q-1 -2 2 -3 z"/>
    <path d="M126 46 q3 -2 4 1 q1 3 -2 4 q-3 1 -4 -2 q-1 -2 2 -3 z" transform="rotate(30 128 48)"/>
    <path d="M144 74 q3 -2 4 1 q1 3 -2 4 q-3 1 -4 -2 q-1 -2 2 -3 z" transform="rotate(-20 146 76)"/>
    <path d="M58 78 q3 -2 4 1 q1 3 -2 4 q-3 1 -4 -2 q-1 -2 2 -3 z" transform="rotate(60 60 80)"/>
    <path d="M64 132 q3 -2 4 1 q1 3 -2 4 q-3 1 -4 -2 q-1 -2 2 -3 z" transform="rotate(-40 66 134)"/>
    <path d="M136 128 q3 -2 4 1 q1 3 -2 4 q-3 1 -4 -2 q-1 -2 2 -3 z" transform="rotate(15 138 130)"/>
    <path d="M100 150 q3 -2 4 1 q1 3 -2 4 q-3 1 -4 -2 q-1 -2 2 -3 z" transform="rotate(80 102 152)"/>
    <path d="M92 58 q3 -2 4 1 q1 3 -2 4 q-3 1 -4 -2 q-1 -2 2 -3 z" transform="rotate(-15 94 60)"/>
    <path d="M146 100 q3 -2 4 1 q1 3 -2 4 q-3 1 -4 -2 q-1 -2 2 -3 z" transform="rotate(45 148 102)"/>
  </g>`:''}
  ${(!dusty&&t.deco==='corn')?`<g transform="translate(134 48) rotate(12)"><rect x="-5" y="-8" width="10" height="20" rx="3.8" fill="#F0DC8A" stroke="#C8A84A" stroke-width="1.7"/><circle cx="-2" cy="-4" r="1.6" fill="#FFE9A8"/><circle cx="2" cy="0" r="1.6" fill="#FFE9A8"/><circle cx="-2" cy="4" r="1.6" fill="#FFE9A8"/><path d="M-3 -10 q-5 -4 -7 0 M3 -10 q5 -4 7 0" stroke="#9AC478" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`:''}
  ${(!dusty&&t.deco==='watermelon')?`<g transform="translate(132 46)"><path d="M-10 -3 Q0 -13 10 -3 Q10 5 0 9 Q-10 5 -10 -3 Z" fill="#F0A8A8" stroke="#D06868" stroke-width="1.5"/><path d="M-10 -3 Q0 -13 10 -3" fill="#8ED8B8" stroke="#5EAE85" stroke-width="1.5"/><circle cx="-2" cy="1" r=".9" fill="#3E3A32"/><circle cx="3" cy="3" r=".9" fill="#3E3A32"/></g>`:''}
  ${(!dusty&&t.deco==='cherry')?`<g transform="translate(134 44)"><circle cx="-4" cy="4" r="5" fill="#F09AB8" stroke="#D05878" stroke-width="1.4"/><circle cx="5" cy="2" r="5" fill="#F09AB8" stroke="#D05878" stroke-width="1.4"/><path d="M-3 -1 Q0 -14 6 -3" stroke="#5EAE85" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`:''}
  ${(!dusty&&t.deco==='tangerine')?`<g transform="translate(132 48)"><circle cx="0" cy="0" r="8" fill="#F0C888" stroke="#D8944A" stroke-width="1.6"/><path d="M-2 -8 q2 -4 4 0" stroke="#5EAE85" stroke-width="1.7" fill="none" stroke-linecap="round"/><circle cx="0" cy="-9" r="1.4" fill="#5EAE85"/></g>`:''}
  ${(!dusty&&t.deco==='peppermint')?`
  <clipPath id="pm${gid}"><path d="${cloudPath(100,104,63,10)}"/></clipPath>
  <g opacity=".18" clip-path="url(#pm${gid})">
    <path d="M0 80 L80 0" stroke="#7EC8DE" stroke-width="6"/>
    <path d="M0 110 L110 0" stroke="#7EC8DE" stroke-width="6"/>
    <path d="M0 140 L140 0" stroke="#7EC8DE" stroke-width="6"/>
    <path d="M0 170 L170 0" stroke="#7EC8DE" stroke-width="6"/>
    <path d="M0 200 L200 0" stroke="#7EC8DE" stroke-width="6"/>
    <path d="M20 210 L210 20" stroke="#7EC8DE" stroke-width="6"/>
    <path d="M50 210 L210 50" stroke="#7EC8DE" stroke-width="6"/>
    <path d="M80 210 L210 80" stroke="#7EC8DE" stroke-width="6"/>
    <path d="M110 210 L210 110" stroke="#7EC8DE" stroke-width="6"/>
    <path d="M140 210 L210 140" stroke="#7EC8DE" stroke-width="6"/>
  </g>`:''}
  ${(!dusty&&t.deco==='marshmallow')?`
  <g transform="translate(100 28)">
    <defs><clipPath id="mclip"><rect x="-22" y="-10" width="44" height="20" rx="10"/></clipPath></defs>
    <rect x="-22" y="-10" width="44" height="20" rx="10" fill="#FFFDF8" stroke="#E8D4CC" stroke-width="1.8"/>
    <g clip-path="url(#mclip)">
      <rect x="-24" y="-12" width="12" height="24" fill="#F8C0D0" transform="skewX(-20)"/>
      <rect x="-4" y="-12" width="12" height="24" fill="#F8C0D0" transform="skewX(-20)"/>
      <rect x="16" y="-12" width="12" height="24" fill="#F8C0D0" transform="skewX(-20)"/>
    </g>
    <rect x="-22" y="-10" width="44" height="20" rx="10" fill="none" stroke="#E8D4CC" stroke-width="1.8"/>
    <ellipse cx="-12" cy="-5" rx="6" ry="2.5" fill="#FFF" opacity=".45" transform="rotate(-10 -12 -5)"/>
    <ellipse cx="8" cy="-5" rx="5" ry="2" fill="#FFF" opacity=".35" transform="rotate(-10 8 -5)"/>
  </g>`:''}
  ${(!dusty&&t.deco==='strawberry')?`
  <g transform="translate(132 46) rotate(14)">
    <path d="M0 0 Q9 1 7 12 Q4 19 0 19 Q-4 19 -7 12 Q-9 1 0 0 Z" fill="#F28AA0" stroke="#DE6B86" stroke-width="1.6"/>
    <path d="M0 0 Q-5 -5 -9 -4 M0 0 Q5 -5 9 -4 M0 0 L0 -6" stroke="#8CC48C" stroke-width="1.7" fill="none" stroke-linecap="round"/>
    <circle cx="-3" cy="7" r="1" fill="#FFF6E0"/><circle cx="3" cy="11" r="1" fill="#FFF6E0"/>
  </g>`:''}
  ${(!dusty&&t.deco==='candycane')?`
  <g transform="translate(136 40)">
    <path d="M0 26 L0 8 Q0 0 8 0 Q16 0 16 8" stroke="#FCE8E8" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M0 26 L0 8 Q0 0 8 0 Q16 0 16 8" stroke="#F0AEAE" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="4 6"/>
  </g>`:''}
  ${(!dusty&&t.deco==='cotton')?`
  <g transform="translate(126 54)">
    <path d="M-15 -3 Q-19 -10 -13 -14 Q-13 -20 -6 -19 Q-2 -24 4 -20 Q10 -23 14 -17 Q21 -16 19 -8 Q24 -4 19 2 Q21 9 13 10 Q9 15 2 12 Q-4 17 -10 11 Q-18 11 -17 4 Q-21 1 -15 -3 Z" fill="#FCEEF4" stroke="#F4D2E0" stroke-width="1.7" stroke-linejoin="round"/>
    <path d="M-9 -8 Q-6 -14 1 -11 Q5 -16 10 -11 Q15 -12 14 -6 Q18 -3 13 1 Q14 6 8 6 Q5 10 0 7 Q-5 10 -9 5 Q-13 4 -11 -1 Q-13 -6 -9 -8 Z" fill="#FDF7FA" opacity=".75"/>
    <path d="M-8 -9 q3 -4 6 -1 M0 -14 q3 -3 6 0 M-13 0 q3 -3 5 0 M6 -1 q3 -3 6 -1" stroke="#F4D2E0" stroke-width="1" fill="none" opacity=".55" stroke-linecap="round"/>
    <rect x="-2" y="10" width="4" height="10" rx="2" fill="#E8C4D4" stroke="#D4A8C0" stroke-width="1.4"/>
  </g>`:''}
  ${(!dusty&&t.deco==='grape')?`
  <g transform="translate(130 42)">
    <circle cx="0" cy="8" r="5" fill="#DCCDF2" stroke="#B090DC" stroke-width="1.4"/>
    <circle cx="9" cy="10" r="4.6" fill="#DCCDF2" stroke="#B090DC" stroke-width="1.3"/>
    <circle cx="4.5" cy="17" r="4.8" fill="#E4D8F6" stroke="#B090DC" stroke-width="1.3"/>
    <path d="M2 2 q4 -5 9 -4" stroke="#9AC478" stroke-width="2" fill="none" stroke-linecap="round"/>
  </g>`:''}
  ${(!dusty&&t.deco==='fizz')?`
  <g class="glint">
    <circle cx="130" cy="46" r="3.4" fill="#FFF" opacity=".85"/>
    <circle cx="142" cy="58" r="2.4" fill="#FFF" opacity=".75"/>
    <circle cx="122" cy="60" r="2" fill="#FFF" opacity=".7"/>
    <circle cx="64" cy="54" r="2.6" fill="#FFF" opacity=".8"/>
    <circle cx="56" cy="68" r="1.8" fill="#FFF" opacity=".65"/>
  </g>`:''}
  ${(!dusty&&t.deco==='crumb')?`
  <g transform="translate(86 38) rotate(-10)">
    <rect x="-15" y="7" width="30" height="3.2" rx="1.6" fill="#D8D2C4" stroke="#B0A896" stroke-width="1"/>
    <circle cx="0" cy="0" r="10" fill="#EAC98E" stroke="#C9A050" stroke-width="1.6"/>
    <path d="M0 -10 L0 10 M-8.6 -5 L8.6 5 M8.6 -5 L-8.6 5" stroke="#FFF6E4" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="0" cy="-5" r="1.5" fill="#FCEFDA"/><circle cx="4.3" cy="2.5" r="1.5" fill="#FCEFDA"/><circle cx="-4.3" cy="2.5" r="1.5" fill="#FCEFDA"/>
    <ellipse cx="-3.5" cy="-3.5" rx="2.6" ry="1.4" fill="#FFF" opacity=".4" transform="rotate(-30 -3.5 -3.5)"/>
  </g>`:''}
  ${(!dusty&&t.deco==='caramel')?`
  <g>
    <path d="M62 46 Q100 34 138 46 Q136 58 128 54 Q118 64 108 56 Q98 66 88 57 Q78 65 70 56 Q64 58 62 46 Z" fill="#E8C89A" stroke="#D6B27E" stroke-width="1.6" opacity=".9"/>
  </g>`:''}
  ${(!dusty&&t.deco==='peachleaf')?`
  <g transform="translate(128 40) rotate(18)">
    <path d="M0 0 Q14 2 12 16 Q10 22 0 22 Q-10 22 -12 16 Q-14 2 0 0 Z" fill="#F6D6BC" stroke="#E4A57A" stroke-width="1.6"/>
    <path d="M0 0 L0 -7" stroke="#8CC48C" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M0 -4 q7 -4 10 1 q-6 4 -10 -1 z" fill="#B8DCA0" stroke="#8CC48C" stroke-width="1.3"/>
  </g>`:''}
  ${(!dusty&&t.deco==='matcha')?`
  <g>
    <path d="M62 44 Q100 32 138 44 Q136 56 100 52 Q66 56 62 44 Z" fill="#D4EAC2" stroke="#9AC478" stroke-width="1.6" opacity=".85"/>
    <circle cx="88" cy="44" r="1.8" fill="#9AC478" opacity=".6"/><circle cx="112" cy="46" r="1.5" fill="#9AC478" opacity=".55"/>
  </g>`:''}
  ${(!dusty&&t.deco==='sweetpotato')?`
  <g transform="translate(130 48) rotate(-16)">
    <path d="M-12 6 Q-14 -4 0 -6 Q14 -8 14 4 Q14 12 2 13 Q-10 14 -12 6 Z" fill="#DEBCD6" stroke="#BE86AE" stroke-width="1.7"/>
    <path d="M-4 0 q6 -2 10 1" stroke="#F0DCEA" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  </g>`:''}
  ${(!dusty&&t.deco==='maple')?`
  <g transform="rotate(16 134 54)">
    <path d="M134 44 l3 6 6 -2 -3 6 5 3 -6 2 1 6 -6 -4 -6 4 1 -6 -6 -2 5 -3 -3 -6 6 2 z" fill="#E07A4E" stroke="#C05A32" stroke-width="1.5" stroke-linejoin="round"/>
    <line x1="134" y1="61" x2="134" y2="66" stroke="#8A5A38" stroke-width="2" stroke-linecap="round"/>
  </g>`:''}
  ${(!dusty&&t.deco==='snowman'&&!hidden)?`
  <path d="M101 103 l15 4.5 -15 4.5 q-3 -4.5 0 -9 z" fill="#F0965A" stroke="#D87A3E" stroke-width="1.8" stroke-linejoin="round"/>
  <line x1="106" y1="106" x2="110" y2="107" stroke="#D87A3E" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="100" cy="132" r="2.6" fill="#5E5468"/>
  <circle cx="100" cy="144" r="2.6" fill="#5E5468"/>
  <circle cx="66" cy="60" r="2" fill="#FFF" class="glint"/>
  <circle cx="138" cy="64" r="1.8" fill="#FFF" class="glint" style="animation-delay:.6s"/>`:''}
  ${dusty?'':`
  <g class="glint"><path d="M62 76 l2.6 6 6 2.6 -6 2.6 -2.6 6 -2.6-6 -6-2.6 6-2.6 z" fill="${t.deep}"/></g>
  <g class="glint"><path d="M134 82 l2 5 5 2 -5 2 -2 5 -2-5 -5-2 5-2 z" fill="#F2DFA0"/></g>`}
  ${hidden?'':(eating||happy)?`
  <path d="M74 100 q7 -5.5 14 0" stroke="#5E5468" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M112 100 q7 -5.5 14 0" stroke="#5E5468" stroke-width="4" fill="none" stroke-linecap="round"/>`:(tucked||napping)?`
  <path d="M74 102 q7 5 14 0" stroke="#5E5468" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M112 102 q7 5 14 0" stroke="#5E5468" stroke-width="4" fill="none" stroke-linecap="round"/>`:baby?`
  <circle cx="82" cy="101" r="5.5" fill="#5E5468"/>
  <circle cx="118" cy="101" r="5.5" fill="#5E5468"/>
  <circle cx="84" cy="99" r="1.8" fill="#fff"/>
  <circle cx="120" cy="99" r="1.8" fill="#fff"/>`:sleep?`
  <ellipse cx="81" cy="101" rx="10" ry="7" fill="#B8AC9C" opacity=".92"/>
  <ellipse cx="119" cy="101" rx="10" ry="7" fill="#B8AC9C" opacity=".92"/>
  <ellipse cx="76" cy="96" rx="4" ry="3" fill="#C9C0B2"/>
  <ellipse cx="124" cy="96" rx="4" ry="3" fill="#C9C0B2"/>
  <ellipse cx="87" cy="106" rx="3.5" ry="2.5" fill="#A79B8C"/>
  <ellipse cx="113" cy="106" rx="3.5" ry="2.5" fill="#A79B8C"/>
  <text class="zzz" x="134" y="92" font-size="11" fill="#A79B8C">…?</text>`:`
  ${(o.eye==='dot')?'<circle cx="81" cy="102" r="3.2" fill="#5E5468"/><circle cx="119" cy="102" r="3.2" fill="#5E5468"/>':'<line x1="74" y1="102" x2="88" y2="102" stroke="#5E5468" stroke-width="4.5" stroke-linecap="round"/><line x1="112" y1="102" x2="126" y2="102" stroke="#5E5468" stroke-width="4.5" stroke-linecap="round"/>'}`}
  ${hidden?'':`
  <ellipse cx="69" cy="114" rx="7.5" ry="4.5" fill="#F7C8D8" opacity="${dusty?'.3':baby?'.9':'.7'}"/>
  <ellipse cx="131" cy="114" rx="7.5" ry="4.5" fill="#F7C8D8" opacity="${dusty?'.3':baby?'.9':'.7'}"/>
  ${happy?`<path id="mouth" d="M92 111 Q100 120 108 111" stroke="#5E5468" stroke-width="3.2" fill="none" stroke-linecap="round"/>`:''}${eating?`<circle class="cheekP" cx="80" cy="113" r="9" fill="${t.soft}" stroke="${t.deep}" stroke-width="2" opacity=".95"/><ellipse class="chewM" cx="101" cy="115" rx="5.5" ry="4" fill="#5E5468"/>`:`<path id="mouth" d="${sleep||tucked?'M97 114 q3 2 6 0':baby?'M96 113 q4 4 8 0':'M95 113 Q100 117 105 113'}" stroke="#5E5468" stroke-width="3" fill="none" stroke-linecap="round"/>`}`}
  ${napping?`<circle class="nosebubble" cx="103" cy="104" r="7" fill="#DFF0FB" stroke="#A8CBE8" stroke-width="1.4" opacity=".75"/><circle cx="100" cy="101" r="1.6" fill="#fff" opacity=".85"/><text class="zzz" x="134" y="90" font-size="12" fill="#B0A0D8">z</text>`:''}
  ${tucked?`
  <path d="M34 126 Q100 104 166 126 L166 164 Q100 184 34 164 z" fill="#C8B8E8" stroke="#A894D0" stroke-width="3" stroke-linejoin="round"/>
  <path d="M34 126 Q100 104 166 126 l0 11 Q100 116 34 137 z" fill="#DFD4F2"/>
  <circle cx="70" cy="150" r="3" fill="#B4A0DC"/><circle cx="100" cy="156" r="3" fill="#B4A0DC"/><circle cx="130" cy="150" r="3" fill="#B4A0DC"/>
  <text class="zzz" x="138" y="72" font-size="15" fill="#8E7BA8">z</text>
  <text class="zzz" style="animation-delay:.55s" x="150" y="58" font-size="12" fill="#B0A0D8">z</text>
  <text class="zzz" style="animation-delay:1.1s" x="160" y="46" font-size="10" fill="#C8BCE8">z</text>`:''}
  ${gear&&gear.face&&!hidden?GEAR_SVG[gear.face]:''}
  ${acc==='ribbon'&&!(gear&&gear.head)&&!hidden?`
  <g transform="translate(76 46) rotate(-8)">
    <path d="M0 4 Q-13 -10 -19 -3 Q-23 6 -12 7 Q-5 6 0 4 Z" fill="${t.rib||'#B99BE0'}" stroke="${darkenHex(t.rib||'#8F6EC4',.28)}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M0 4 Q13 -10 19 -3 Q23 6 12 7 Q5 6 0 4 Z" fill="${t.rib||'#B99BE0'}" stroke="${darkenHex(t.rib||'#8F6EC4',.28)}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M-3 6 L-6 16 L-1 13.5 L0 18 L1 13.5 L6 16 L3 6 Z" fill="${t.rib||'#B99BE0'}" stroke="${darkenHex(t.rib||'#8F6EC4',.28)}" stroke-width="1.6" stroke-linejoin="round"/>
    <circle cx="0" cy="4" r="4.6" fill="${t.rib||'#B99BE0'}" stroke="${darkenHex(t.rib||'#8F6EC4',.28)}" stroke-width="2"/>
    <ellipse cx="-8" cy="-3" rx="4.5" ry="2.4" fill="#FFF" opacity=".4" transform="rotate(-25 -8 -3)"/>
    <ellipse cx="7" cy="-2" rx="3.5" ry="2" fill="#FFF" opacity=".3" transform="rotate(20 7 -2)"/>
  </g>`:''}
  ${acc==='mustache'&&!hidden?`
  <g fill="#5E5468">
    <path d="M99 109 q-9 -6 -16 0 q3 6 10 4 q4 -1 6 -4 z"/>
    <path d="M101 109 q9 -6 16 0 q-3 6 -10 4 q-4 -1 -6 -4 z"/>
  </g>`:''}
  ${gear&&gear.head&&!hidden?GEAR_SVG[gear.head]:''}
  ${gear&&gear.body&&!hidden?GEAR_SVG[gear.body]||'':''}
  ${gear&&gear.body==='custom'&&!hidden&&ME.customOutfit?`<image href="${ME.customOutfit}" x="0" y="0" width="200" height="200" preserveAspectRatio="none"/>`:''}
  ${gear&&gear.hand&&!hidden?GEAR_SVG[gear.hand]:''}
  ${gear&&gear.cloak&&!hidden?GEAR_SVG[gear.cloak]:''}
  ${gear&&gear.neck&&!hidden?GEAR_SVG[gear.neck]:''}
  ${scene&&scene.front&&!dusty?scene.front:''}
  ${sleep?`
  <path d="M40 132 Q100 110 160 132 L160 166 Q100 182 40 166 Z" fill="#8E9AD8" stroke="#7A86C8" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M70 148 l2 5 5 2 -5 2 -2 5 -2-5 -5-2 5-2 z" fill="#FFE9A8" opacity=".9"/>
  <path d="M126 142 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6-4 -4-1.6 4-1.6 z" fill="#FFE9A8" opacity=".9"/>
  <text class="zzz" x="146" y="66" font-size="17" fill="#8E9AD8">z</text>
  <text class="zzz" x="158" y="52" font-size="13" fill="#A8B2E0" style="animation-delay:.7s">z</text>`:''}
  ${hidden?`
  <path d="${cloudPath(100,112,55,10)}" fill="#D5CDC1" opacity=".97" stroke="#BCB2A4" stroke-width="2.5"/>
  <path d="${cloudPath(72,92,25,8)}" fill="#C9C0B2" opacity=".92"/>
  <path d="${cloudPath(132,92,25,8)}" fill="#C9C0B2" opacity=".92"/>
  <path d="${cloudPath(76,137,27,8)}" fill="#C9C0B2" opacity=".9"/>
  <path d="${cloudPath(126,137,27,8)}" fill="#C9C0B2" opacity=".9"/>
  <path d="M54 70 q10 -10 20 0 M126 70 q10 -10 20 0" fill="none" stroke="#B8AEA0" stroke-width="3" stroke-linecap="round" opacity=".8"/>
  <ellipse cx="81" cy="103" rx="10" ry="6" fill="#5E5468"/><ellipse cx="119" cy="103" rx="10" ry="6" fill="#5E5468"/>
  <circle cx="84" cy="101" r="2" fill="#FFFDF8"/><circle cx="122" cy="101" r="2" fill="#FFFDF8"/>
  <g class="wavehand">
    <ellipse cx="146" cy="82" rx="10" ry="12" fill="#FDFCFB" stroke="${t.deep}" stroke-width="2.5"/>
  </g>
  <path class="glint" d="M58 70 l2 5 5 2 -5 2 -2 5 -2-5 -5-2 5-2 z" fill="#FFE9A8"/>`:''}
  ${away?`
  <mask id="eyemask_${svg.id}">
    <rect x="15" y="15" width="170" height="170" fill="white"/>
    <circle cx="81" cy="102" r="10" fill="black"/>
    <circle cx="119" cy="102" r="10" fill="black"/>
  </mask>
  <path d="${cloudPath(100,110,55,9)}" fill="#B4A88E" opacity=".92" stroke="#8F8362" stroke-width="2.5" mask="url(#eyemask_${svg.id})"/>
  <circle cx="81" cy="102" r="4" fill="#5E5468"/><circle cx="119" cy="102" r="4" fill="#5E5468"/>
  <g id="web1" class="web-strand${S.webCleared&&S.webCleared[0]?' cleared':''}">
    <path d="M54 52 L74 66 M54 52 L58 74 M54 52 L40 70" stroke="#E4DECF" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M62 60 Q56 65 58 71" stroke="#E4DECF" stroke-width="1.1" fill="none"/>
  </g>
  <g id="web2" class="web-strand${S.webCleared&&S.webCleared[1]?' cleared':''}">
    <path d="M146 56 L126 70 M146 56 L142 78 M146 56 L156 74" stroke="#E4DECF" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M136 64 Q142 69 140 75" stroke="#E4DECF" stroke-width="1.1" fill="none"/>
  </g>`:''}
  ${(o.sparkle&&!dusty)?`<g class="bday-sparkle">
    ${Array.from({length:10},(_,i)=>{
      const ang=(i/10)*Math.PI*2, rad=62+((i*17)%22);
      const px=(100+Math.cos(ang)*rad).toFixed(1), py=(104+Math.sin(ang)*rad*.82).toFixed(1);
      const sz=(2.4+((i*7)%5)*.6).toFixed(1);
      return `<path class="glint" style="animation-delay:${(i*.22).toFixed(2)}s" d="M${px} ${py} l${sz} ${sz*1.9} l${sz*1.9} ${sz} l-${sz*1.9} ${sz} l-${sz} ${sz*1.9} l-${sz} -${sz*1.9} l-${sz*1.9} -${sz} l${sz*1.9} -${sz} z" fill="#FFE9A8" opacity=".9"/>`;
    }).join('')}
  </g>`:''}
  `;
}
function cloudPath(cx,cy,r,bumps){
  const pts=[];
  for(let i=0;i<bumps;i++){
    const a=(i/bumps)*Math.PI*2-Math.PI/2;
    pts.push([cx+Math.cos(a)*r, cy+Math.sin(a)*r*0.92]);
  }
  const chord=2*r*Math.sin(Math.PI/bumps), ar=(chord*0.62).toFixed(1);
  let d=`M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for(let i=1;i<=bumps;i++){
    const p=pts[i%bumps];
    d+=` A ${ar} ${ar} 0 0 1 ${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  }
  return d+' Z';
}
function darkenHex(hex,amt){
  const n=parseInt(hex.replace('#',''),16);
  let r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  r=Math.max(0,Math.round(r*(1-amt)));g=Math.max(0,Math.round(g*(1-amt)));b=Math.max(0,Math.round(b*(1-amt)));
  return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
}
const FLOWERS={
  common:[
    {n:'수국',mean:'진심',word:'차분한 마음이 오늘을 지켜줄 거야',act:'하늘 한 번 올려다보기',color:'#8EA8E0',cname:'수국 파랑',time:'오전 11시',item:'파란 펜',e:'💠'},
    {n:'빈카',mean:'즐거운 추억',word:'작게 웃었던 순간을 놓치지 마',act:'사진 한 장 남기기',color:'#B8A0E8',cname:'연보라',time:'오후 4시',item:'작은 리본',e:'💜'},
    {n:'라벤더',mean:'기다림',word:'서두르지 않아도 도착할 거야',act:'따뜻한 차 한 잔 마시기',color:'#B0A0D8',cname:'라벤더 연보라',time:'오후 8시',item:'포근한 담요',e:'🪻'},
    {n:'벚꽃',mean:'설렘',season:'spring',word:'짧아서 더 소중한 순간이 있어',act:'평소보다 천천히 걷기',color:'#F7C8D8',cname:'벚꽃 분홍',time:'오후 1시',item:'분홍 머리핀',e:'🌸'},
    {n:'튤립',mean:'사랑의 고백',season:'spring',word:'마음을 표현해도 괜찮은 날이야',act:'좋아하는 사람에게 한마디 하기',color:'#E85A78',cname:'튤립 빨강',time:'오전 10시',item:'빨간 리본',e:'🌷'},
    {n:'프리지아',mean:'새로운 시작',season:'spring',word:'오늘부터 다시 시작해도 늦지 않아',act:'미뤄둔 일 하나 시작하기',color:'#F5D06B',cname:'프리지아 노랑',time:'오전 8시',item:'노란 클립',e:'🌼'},
    {n:'해바라기',mean:'당신만 바라봐',season:'summer',word:'오늘은 네 편이 많은 날이야',act:'고마운 사람에게 인사하기',color:'#F5C86B',cname:'해바라기 노랑',time:'정오',item:'노란 머리끈',e:'🌻'},
    {n:'나팔꽃',mean:'기쁜 소식',season:'summer',word:'아침에 온 소식이 하루를 바꿀지도',act:'미뤄둔 답장 하나 하기',color:'#7E9AD8',cname:'나팔꽃 남색',time:'오전 9시',item:'하늘색 포스트잇',e:'🌀'},
    {n:'능소화',mean:'그리움',season:'summer',word:'담장 너머로도 마음은 닿아',act:'보고 싶은 사람에게 안부 한 줄 보내기',color:'#F0965A',cname:'능소 주황',time:'오후 3시',item:'주황 리본',e:'🧡'},
    {n:'코스모스',mean:'소녀의 순정',season:'fall',word:'바람에 흔들려도 뿌리는 그대로야',act:'산책하며 하늘 사진 찍기',color:'#F0A8B8',cname:'코스모스 분홍',time:'오후 5시',item:'코스모스 압화',e:'🌺'},
    {n:'국화',mean:'고결한 마음',season:'fall',word:'차분히 정리해도 괜찮은 계절이야',act:'방 한 켠 정리하기',color:'#F0DCA6',cname:'국화 아이보리',time:'오후 3시',item:'아이보리 리본',e:'🏵️'},
    {n:'동백',mean:'그대를 누구보다 사랑합니다',season:'winter',word:'추울수록 마음은 더 진해져',act:'따뜻한 곳에서 좋아하는 사람 생각하기',color:'#E85A6A',cname:'동백 다홍',time:'오후 6시',item:'빨간 장갑',e:'🌹'},
    {n:'설강화',mean:'희망',season:'winter',word:'가장 추운 날에도 피는 꽃이 있어',act:'오늘 하루 버틴 나 칭찬하기',color:'#DFF0FB',cname:'설강화 흰빛',time:'오전 7시',item:'하얀 리본',e:'❄️'},
    {n:'개나리',mean:'희망찬 봄',season:'spring',word:'노란 봄이 골목마다 번지고 있어',act:'창문 활짝 열어 환기하기',color:'#F5D84E',cname:'개나리 노랑',time:'오전 9시',item:'노란 손수건',e:'🌼'},
    {n:'목련',mean:'고귀함',season:'spring',word:'천천히 피어도 결국 가장 크게 피어',act:'거울 보며 나에게 칭찬 한마디',color:'#F7EFE8',cname:'목련 아이보리',time:'오전 11시',item:'하얀 손거울',e:'🤍'},
    {n:'라일락',mean:'첫사랑의 추억',season:'spring',word:'향기처럼 은은히 남는 마음이 있어',act:'좋아하는 향 맡아보기',color:'#C8A8E0',cname:'라일락 연보라',time:'오후 5시',item:'보라 향주머니',e:'💐'},
    {n:'수선화',mean:'자기애',season:'spring',word:'나를 아끼는 것부터가 시작이야',act:'나에게 작은 선물 하기',color:'#F5E06B',cname:'수선화 노랑',time:'오전 10시',item:'노란 거울',e:'🌸'},
    {n:'장미',mean:'열정',season:'summer',word:'하고 싶은 게 있다면 오늘 시작해',act:'미뤄둔 도전 하나 적기',color:'#E0405A',cname:'장미 빨강',time:'오후 2시',item:'빨간 노트',e:'🌹'},
    {n:'수련',mean:'맑은 마음',season:'summer',word:'흐린 물 위에도 맑게 피는 꽃이 있어',act:'물 한 잔 천천히 마시기',color:'#F0B8D0',cname:'수련 분홍',time:'정오',item:'유리컵',e:'🪷'},
    {n:'라넌큘러스',mean:'매력',season:'spring',word:'너만의 결이 제일 예뻐',act:'좋아하는 옷 입기',color:'#F5A0B8',cname:'라넌 분홍',time:'오후 1시',item:'분홍 브로치',e:'🌸'},
    {n:'무궁화',mean:'끈기',season:'summer',word:'피고 지고 또 피는 게 진짜 강함이야',act:'포기하려던 것 한 번 더 시도',color:'#D888B8',cname:'무궁화 분홍',time:'오전 8시',item:'분홍 배지',e:'🌺'},
    {n:'맨드라미',mean:'변치 않는 사랑',season:'summer',word:'뜨거운 여름에도 곁을 지키는 마음',act:'오래된 친구에게 안부 전하기',color:'#D0405A',cname:'맨드라미 진홍',time:'오후 4시',item:'빨간 실',e:'❤️'},
    {n:'단풍(꽃잎)',mean:'소중한 추억',season:'fall',word:'물드는 건 시간을 잘 보냈다는 증거야',act:'낙엽 하나 주워 책갈피 하기',color:'#E07A4E',cname:'단풍 주황',time:'오후 3시',item:'단풍 압화',e:'🍁'},
    {n:'억새',mean:'평온',season:'fall',word:'바람에 몸을 맡기면 편해지는 것도 있어',act:'바람 부는 곳에서 눈 감기',color:'#E8DCC0',cname:'억새 은빛',time:'오후 5시',item:'마른 갈대',e:'🌾'},
    {n:'구절초',mean:'순수',season:'fall',word:'꾸미지 않아도 충분히 예뻐',act:'민낯으로 산책하기',color:'#FBFAF6',cname:'구절초 흰빛',time:'오전 10시',item:'흰 손수건',e:'🤍'},
    {n:'단풍제비꽃',mean:'성실',season:'fall',word:'작은 걸 꾸준히 한 사람이 멀리 가',act:'오늘 할 일 하나 끝까지',color:'#9868C0',cname:'제비꽃 보라',time:'오전 9시',item:'보라 클립',e:'💜'},
    {n:'포인세티아',mean:'축복',season:'winter',word:'네가 있는 이 계절이 누군가껜 선물이야',act:'고마운 사람에게 카드 쓰기',color:'#D0304A',cname:'포인세티아 빨강',time:'오후 6시',item:'빨간 봉투',e:'🎄'},
    {n:'수정목',mean:'맑은 겨울',season:'winter',word:'얼어붙은 날에도 반짝이는 게 있어',act:'유리창 닦고 밖 보기',color:'#CFE8F0',cname:'수정 연청',time:'오전 8시',item:'유리구슬',e:'💎'},
    {n:'시클라멘',mean:'수줍음',season:'winter',word:'조용한 마음도 분명히 전해져',act:'좋아하는 사람 몰래 챙기기',color:'#E06A98',cname:'시클라멘 분홍',time:'오후 2시',item:'분홍 편지지',e:'🌸'},
    {n:'납매',mean:'자애',season:'winter',word:'추위 속 가장 먼저 향을 내는 꽃이야',act:'따뜻한 말 한마디 건네기',color:'#F5D86B',cname:'납매 노랑',time:'오전 7시',item:'노란 향초',e:'💛'},
    {n:'목련',mean:'고귀',season:'spring',word:'높은 곳에서 먼저 피는 용기가 있어',act:'하고 싶은 걸 먼저 시작하기',color:'#FCEEF8',cname:'목련 흰분홍',time:'오전 9시',item:'큰 꽃잎',e:'🤍'},
    {n:'매화',mean:'인내',season:'winter',word:'추위를 견딘 꽃이 제일 먼저 피어',act:'어려운 일 하나 해치우기',color:'#F0A0B8',cname:'매화 연분홍',time:'오전 7시',item:'매화 가지',e:'🌸'},
    {n:'작약',mean:'수줍음',season:'spring',word:'부끄러워도 괜찮아, 천천히 피면 돼',act:'오늘 한 가지 솔직해지기',color:'#F0B8C8',cname:'작약 핑크',time:'오후 3시',item:'분홍 리본',e:'🎀'},
    {n:'모란',mean:'부귀',season:'spring',word:'네 안에 숨은 화려함을 믿어',act:'평소 안 입는 색 도전하기',color:'#D8487A',cname:'모란 자홍',time:'오전 11시',item:'비단 조각',e:'💮'},
    {n:'달리아',mean:'감사',season:'summer',word:'고마운 건 말로 하면 더 따뜻해',act:'감사 인사 한 번 더 하기',color:'#E86040',cname:'달리아 주홍',time:'오후 4시',item:'주황 봉투',e:'🧡'},
    {n:'팬지',mean:'나를 생각해',season:'spring',word:'누군가 지금 널 떠올리고 있어',act:'오랜 친구에게 연락하기',color:'#6850A0',cname:'팬지 보라',time:'오후 1시',item:'보라 편지',e:'💜'},
    {n:'금잔화',mean:'이별의 슬픔',season:'summer',word:'끝이 있어야 새 시작도 와',act:'놓아줄 것 하나 정하기',color:'#F0A840',cname:'금잔화 금색',time:'오후 5시',item:'금빛 잎',e:'🌻'},
    {n:'안개꽃',mean:'영원한 사랑',season:'spring',word:'작은 것들이 모여 큰 감동이 돼',act:'소소한 일 하나 즐기기',color:'#FAFAFE',cname:'안개 흰빛',time:'오전 10시',item:'흰 안개',e:'🤍'},
    {n:'리시안셔스',mean:'우아',season:'summer',word:'우아함은 마음에서 나와',act:'천천히 차 한 잔 마시기',color:'#D0A8E8',cname:'리시안 라벤더',time:'오후 3시',item:'라벤더 향',e:'💐'},
    {n:'카네이션',mean:'사랑',season:'spring',word:'가장 가까운 사람에게 마음을 전해봐',act:'부모님께 안부 전하기',color:'#E85070',cname:'카네이션 빨강',time:'오전 11시',item:'빨간 카네이션',e:'❤️'},
    {n:'가시나무꽃',mean:'견고한 사랑',season:'summer',word:'가시가 있어도 아름다운 꽃이야',act:'힘든 일도 긍정적으로 보기',color:'#90C860',cname:'가시나무 초록',time:'오전 8시',item:'작은 가시',e:'🌿'},
    {n:'자스민',mean:'사랑스러움',season:'summer',word:'향기로 마음을 전하는 꽃이야',act:'좋아하는 향수 뿌리기',color:'#FFF8E0',cname:'자스민 크림',time:'밤 9시',item:'향기 주머니',e:'✨'},
    {n:'클레마티스',mean:'아름다운 마음',season:'spring',word:'덩굴처럼 조금씩 뻗어가면 돼',act:'새로운 취미 탐색하기',color:'#7868C0',cname:'클레마티스 청보라',time:'오후 2시',item:'보라 줄',e:'💜'},
    {n:'동백나무',mean:'겸손',season:'winter',word:'조용히 피어도 모두가 알아봐',act:'묵묵히 할 일 하기',color:'#D83050',cname:'동백 빨강',time:'오전 8시',item:'동백 잎',e:'❤️'},
    {n:'데이지',mean:'희망',season:'spring',word:'작은 꽃 하나가 들판을 밝혀',act:'오늘의 좋았던 것 하나 적기',color:'#FFF8E0',cname:'데이지 흰노랑',time:'오전 10시',item:'노란 단추',e:'🌼'},
    {n:'백일홍',mean:'우정',season:'summer',word:'오래 함께할 친구 같은 꽃이야',act:'친구에게 "잘 지내?" 보내기',color:'#E06888',cname:'백일홍 핑크',time:'오후 4시',item:'분홍 구슬',e:'💗'},
    {n:'접시꽃',mean:'단순한 사랑',season:'summer',word:'솔직한 마음이 제일 예뻐',act:'하고 싶은 말 그냥 하기',color:'#E85088',cname:'접시꽃 진분홍',time:'오후 1시',item:'큰 접시',e:'🌺'},
    {n:'마가렛',mean:'진실된 사랑',season:'spring',word:'꾸미지 않아도 진심은 전해져',act:'거짓 없이 하루 보내기',color:'#FFF0D0',cname:'마가렛 흰노랑',time:'오전 11시',item:'흰 꽃잎',e:'🌼'},
    {n:'봉선화',mean:'나를 건드리지 마',season:'summer',word:'가끔은 나만의 공간이 필요해',act:'혼자만의 시간 30분 갖기',color:'#F06080',cname:'봉선화 빨강',time:'오후 5시',item:'빨간 물감',e:'💅'},
    {n:'패랭이꽃',mean:'사랑을 담아',season:'summer',word:'작지만 선명한 색이 눈에 들어와',act:'작은 선물 하나 준비하기',color:'#E84868',cname:'패랭이 분홍',time:'오전 9시',item:'무늬 천',e:'💗'},
    {n:'물망초',mean:'나를 잊지 마',season:'spring',word:'작은 기억 하나가 평생 가기도 해',act:'오늘의 순간 하나 기록하기',color:'#7090E0',cname:'물망초 파랑',time:'오후 3시',item:'파란 구슬',e:'💙'},
    {n:'붓꽃',mean:'좋은 소식',season:'spring',word:'좋은 일은 예고 없이 찾아와',act:'기대하는 마음 갖기',color:'#7050A8',cname:'붓꽃 보라',time:'오전 10시',item:'보라 붓',e:'💜'},
    {n:'산수유',mean:'영원불변',season:'spring',word:'변하지 않는 마음이 있어',act:'변하지 않을 다짐 하나',color:'#F0C830',cname:'산수유 노랑',time:'오전 8시',item:'노란 열매',e:'💛'},
    {n:'개나리',mean:'기대',season:'spring',word:'봄이 오는 첫 신호야',act:'올해 하고 싶은 일 하나 정하기',color:'#F8D040',cname:'개나리 노랑',time:'오전 9시',item:'노란 가지',e:'💛'},
    {n:'진달래',mean:'사랑의 기쁨',season:'spring',word:'산 가득 피어 봄을 알려줘',act:'밖에 나가서 봄바람 느끼기',color:'#E880A0',cname:'진달래 분홍',time:'오전 10시',item:'분홍 꽃잎',e:'🌸'},
    {n:'무궁화',mean:'영원',season:'summer',word:'매일 새로 피는 꽃이야',act:'매일 새로 시작하는 마음 갖기',color:'#D860A0',cname:'무궁화 분홍',time:'오전 7시',item:'무궁화 배지',e:'🌺'},
    {n:'란타나',mean:'엄격',season:'summer',word:'규칙 안에서도 아름다움이 있어',act:'오늘 계획 지켜보기',color:'#F0A030',cname:'란타나 주황',time:'오후 2시',item:'알록달록 구슬',e:'🧡'},
    {n:'수련',mean:'순결',season:'summer',word:'고요한 물 위에서 빛나는 꽃이야',act:'조용히 명상 5분 하기',color:'#F8D0E0',cname:'수련 연분홍',time:'오전 6시',item:'연잎',e:'🪷'},
    {n:'매발톱꽃',mean:'승리',season:'spring',word:'이기는 것보다 끝까지 하는 게 중요해',act:'시작한 일 마무리하기',color:'#5868C8',cname:'매발톱 파랑',time:'오후 1시',item:'파란 종',e:'💙'},
  ],
  rare:[
    {n:'달빛초',mean:'조용한 위로',word:'밤이 길어도 달은 떠 있어',act:'자기 전에 창밖 보기',color:'#C8D8F7',cname:'달빛 은청',time:'밤 10시',item:'은색 클립',e:'🌙',rare:true},
    {n:'소원꽃',mean:'이루어질 마음',word:'말하면 조금씩 가까워져',act:'소원 하나 적어두기',color:'#F7B8D2',cname:'소원 분홍',time:'오후 7시',item:'별 스티커',e:'💫',rare:true},
    {n:'새벽별꽃',mean:'어둠 끝의 빛',word:'제일 캄캄할 때가 새벽 직전이야',act:'내일의 나에게 한 줄 남기기',color:'#8EA8E0',cname:'새벽 남빛',time:'새벽 5시',item:'하늘색 실',e:'🌌',rare:true},
    {n:'구름솜꽃',mean:'포근한 하루',word:'오늘은 폭신하게 지나갈 거야',act:'담요 덮고 5분 쉬기',color:'#EFEDF2',cname:'구름 흰빛',time:'오후 2시',item:'솜인형',e:'☁️',rare:true},
    {n:'유성민들레',mean:'멀리 닿는 소원',word:'후— 불면, 소원이 별처럼 날아가',act:'작은 소원 하나 말해보기',color:'#F2E39E',cname:'유성 금빛',time:'밤 9시',item:'작은 별 배지',e:'',rare:true},
    {n:'은하수국',mean:'끝없는 마음',word:'네 마음은 생각보다 훨씬 넓어',act:'밤하늘 오래 바라보기',color:'#9AB0E8',cname:'은하 청보라',time:'밤 11시',item:'은하 스티커',e:'🌌',rare:true},
    {n:'오로라꽃',mean:'기적',word:'드물게 오는 좋은 날이 오늘일지도',act:'행운을 믿고 하나 도전하기',color:'#8EE0C8',cname:'오로라 민트',time:'새벽 3시',item:'무지개 실',e:'',rare:true},
    {n:'별무리안개꽃',mean:'영원한 약속',word:'작은 별들이 모여 큰 약속이 돼',act:'스스로와 약속 하나 하기',color:'#F0EAF8',cname:'별무리 흰빛',time:'밤 10시',item:'작은 별 다발',e:'✨',rare:true},
    {n:'혜성백합',mean:'단 한 번의 만남',word:'스치는 인연도 다 이유가 있어',act:'오늘 만난 사람 이름 기억하기',color:'#C8D0F0',cname:'혜성 은청',time:'새벽 4시',item:'꼬리별 배지',e:'☄️',rare:true},
    {n:'달무리장미',mean:'포근한 밤',word:'달이 너를 감싸는 밤이야',act:'따뜻하게 이불 덮고 자기',color:'#E8C0D8',cname:'달무리 분홍',time:'밤 11시',item:'달 모양 핀',e:'🌙',rare:true},
    {n:'새벽안개초',mean:'새 출발',word:'안개가 걷히면 길이 보여',act:'내일 계획 한 줄 적기',color:'#DCEAE8',cname:'안개 연회색',time:'새벽 5시',item:'회색 노트',e:'🌫️',rare:true},
  ],
};
const ALLF=FLOWERS.common.concat(FLOWERS.rare);
var B=window.PLANON_UX_BRIDGE;if(!B)return;
function E(){return window.PLANON_MARKET_THEME;}
var PID='meonbyeol-theme';
var BASE={name:'몽글 기본빛',soft:'#F4F2F7',deep:'#DCD8E4',rib:'#B8B0C8'};
var ALLT=[BASE].concat(TINTS_SRC);
var SALON_PRICE=30;
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function S(){return B.state();}
function tk(){return B.todayKey();}
function pad(n){return String(n).padStart(2,'0');}
function st(){var s=S();s.settings=s.settings||{};var m=s.settings.meonbyeol;if(!m||typeof m!=='object')m=s.settings.meonbyeol={};
  if(typeof m.stars!=='number')m.stars=0;if(!Array.isArray(m.tints))m.tints=[0];if(typeof m.tint!=='number')m.tint=0;
  if(!Array.isArray(m.dex))m.dex=[];if(!Array.isArray(m.candies))m.candies=[];if(!m.wake)m.wake={streak:0,last:''};
  if(!m.day||m.day.key!==tk())m.day={key:tk(),todo:[],allDone:false,close:false,wake:false,water:0,tuck:false,snack:0,flower:null,gift:false};
  if(!m.lastVisit)m.lastVisit=tk();return m;}
function isOn(){try{var e=E();if(!e)return false;var ov=e.previewOverride&&e.previewOverride();if(ov&&ov.meonbyeol===PID)return true;var m=e.state(),p=e.product(PID);return !!(m&&m.active&&m.active.meonbyeol===PID&&p&&e.owned(p));}catch(x){return false;}}
function toast(t){try{B.toast(t,2200);}catch(e){}}
function addStars(n,why){var m=st();m.stars+=n;B.save();toast('⭐ +'+n+(why?' · '+why:''));var p=document.getElementById('mb-starpill');if(p)p.textContent='⭐ '+m.stars;}

/* ---------- 소리 ---------- */
var AC=null,AMB={name:null,ivs:[]};
function ac(){try{if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(C)AC=new C();}if(AC&&AC.state!=='running')AC.resume();}catch(e){}return AC;}
document.addEventListener('pointerdown',function(){if(isOn())ac();},{passive:true,capture:true});
function tone(f,t0,dur,vol,type){var a=ac();if(!a)return;var o=a.createOscillator(),g=a.createGain(),t=a.currentTime+t0;o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.05);}
function vocal(f,t0,dur){var a=ac();if(!a)return;var o=a.createOscillator(),g=a.createGain(),fl=a.createBiquadFilter(),t=a.currentTime+t0;fl.type='lowpass';fl.frequency.value=1600;o.type='sawtooth';o.frequency.setValueAtTime(f*.75,t);o.frequency.exponentialRampToValueAtTime(f,t+.07);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.045,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+dur+.08);o.connect(fl);fl.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.12);}
function pop(){tone(784,0,.14,.05,'sine');tone(1175,.08,.22,.045,'sine');tone(1568,.16,.2,.02,'sine');}
function babble(){if(AMB.name)return;var N=[523,587,659,784,880],i=1+Math.floor(Math.random()*3);for(var k=0;k<3;k++){tone(N[i]/2,k*.15,.26,.045,'triangle');tone(N[i],k*.15,.16,.012,'sine');i=Math.max(0,Math.min(4,i+(Math.random()<.5?-1:1)));}}
function chime(){[523,659,784,1046].forEach(function(f,i){tone(f,i*.1,.35,.05,'triangle');});}
function snore(){tone(145,0,.8,.06,'sine');tone(125,.2,.5,.035,'sine');tone(92,.95,1,.05,'sine');}
function sip(){tone(240,0,.2,.04,'sine');tone(420,.1,.2,.03,'sine');}
function stopAmb(){AMB.ivs.forEach(clearInterval);AMB={name:null,ivs:[]};}
function startAmb(name){stopAmb();if(!ac())return;AMB.name=name;
  if(name==='orgel'){var MEL=[784,659,587,523,587,659,784,880,784,659,523,587,659,587,523,0];var bar=function(){if(AMB.name!=='orgel')return;MEL.forEach(function(f,i){if(f){tone(f,i*.36,1.1,.05,'sine');tone(f*3,i*.36,.4,.01,'sine');}});};bar();AMB.ivs.push(setInterval(bar,MEL.length*360));}
  else if(name==='song'){var CH=[[261.6,329.6,392],[220,261.6,329.6],[174.6,220,261.6],[196,246.9,293.7]],VM=[523,587,659,523,587,659,784,659,523,587,494,440,392,440,523,0];var bar2=function(){if(AMB.name!=='song')return;CH.forEach(function(ch,b){ch.forEach(function(f,i){tone(f,b*1.44+i*.04,.9,.03,'triangle');tone(f,b*1.44+.72+i*.04,.6,.024,'triangle');});});VM.forEach(function(f,i){if(f)vocal(f,i*.36,.3);});};bar2();AMB.ivs.push(setInterval(bar2,5760));}
  else if(name==='tea'){sip();AMB.ivs.push(setInterval(sip,2600));setTimeout(function(){if(AMB.name==='tea'){stopAmb();paintHero();}},15000);}
}

/* ---------- 먼별 상태 ---------- */
var UI={happy:false,tucked:false,line:'',snack:null,drink:null,previewTint:null};
function daysAway(){var m=st(),a=B.parseKey(m.lastVisit),b=B.parseKey(tk());return Math.round((b-a)/864e5);}
function curTint(){var m=st(),i=UI.previewTint!=null?UI.previewTint:m.tint;return ALLT[i]||BASE;}
function byeolSVG(id,tint,o){o=o||{};var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 200 200');svg.id=id;try{renderByeol(svg,{tint:tint,acc:'none',eye:o.eye||'line',happy:!!o.happy,tucked:!!o.tucked,dusty:!!o.dusty,dustLevel:o.dustLevel||0,gear:null});}catch(e){}return svg.outerHTML;}
function paintHero(){var box=document.getElementById('mb-byeol');if(!box)return;var away=UI.away||0;box.innerHTML=byeolSVG('mbMain',curTint(),{happy:UI.happy||AMB.name==='song',tucked:UI.tucked,dusty:away>=3,dustLevel:away>=14?7:away>=7?4:away>=3?2:0});
  var ex=document.getElementById('mb-extra');if(ex)ex.innerHTML=UI.snack?candySVG(UI.snack.c,40):UI.drink?cupSVG(UI.drink.c):AMB.name==='song'||AMB.name==='orgel'?'<span class="mb-notes">♪ ♫ ♪</span>':'';
  var b=document.getElementById('mb-bubble');if(b&&UI.line)b.textContent=UI.line;
  var sb=document.getElementById('mb-stopamb');if(sb)sb.style.display=AMB.name?'':'none';}
function say(t){UI.line=t;var b=document.getElementById('mb-bubble');if(b){b.textContent=t;b.classList.remove('mb-pop');void b.offsetWidth;b.classList.add('mb-pop');}babble();}
function hourNow(){return new Date().getHours();}
function dayProgress(){var k=tk(),s=S(),td=(s.todos||[]).filter(function(t){return t.scope==='day'&&t.key===k;});return {n:td.length,d:td.filter(function(t){return t.done;}).length};}
function talkLine(){var h=hourNow(),p=dayProgress(),m=st(),L=[];
  if(h>=5&&h<11)L.push('좋은 아침! 오늘 제일 먼저 할 일 하나만 정해볼까?','하암… 나도 방금 일어났어. 같이 기지개 켜자.');
  else if(h<17)L.push('점심은 먹었어? 배고프면 집중이 안 돼.','지금 이 시간이 제일 졸린 시간이래. 물 한 잔!');
  else if(h<21)L.push('노을 봤어? 오늘 하늘 예뻤대.','저녁엔 조금 느슨해져도 괜찮아.');
  else L.push('오늘도 수고 많았어. 나 재워줄래?','밤하늘에 오늘의 별이 떴을까?');
  if(p.n&&p.d===p.n)L.push('오늘 할 일 다 했잖아!! 복복복~ 대단해.');
  else if(p.n&&p.d)L.push(p.d+'개나 별로 바꿨어. 먼지 '+(p.n-p.d)+'개만 더 털자!');
  else if(p.n)L.push('먼지가 '+p.n+'개 있어… 하나만 복! 해볼래?');
  L.push('뽀롱?','나 오늘 네잎클로버 찾으러 갔다가 도토리만 주웠어.','너랑 있으면 먼지가 반짝반짝해져.','별 '+m.stars+'개 모았네! 미용실 가볼까?');
  return L[Math.floor(Math.random()*L.length)];}

/* ---------- 사탕 선물 ---------- */
var CANDIES=[{n:'번개 레몬사탕',c:'#FFE27A',line:'찌릿! 번개 레몬사탕이야. 먹으면 기운이 번쩍 난대.'},{n:'딸기 별사탕',c:'#F7B6C8',line:'딸기 별사탕 주웠어! 너 줄게.'},{n:'구름 마시멜로',c:'#FFFFFF',line:'구름 조각 같은 마시멜로야. 폭신폭신.'},{n:'포도알 젤리',c:'#C9B2EC',line:'포도알 젤리! 말랑말랑해.'},{n:'민트 캔디',c:'#BDEBD8',line:'화하~ 민트 캔디로 정신 번쩍!'},{n:'꿀 호박사탕',c:'#F6C97A',line:'할머니 가방에 있을 법한 꿀 호박사탕이야.'},{n:'밤하늘 알사탕',c:'#8A86C8',line:'밤하늘을 굴려서 만든 알사탕이래. 쉿, 비밀.'}];
function candySVG(c,sz){sz=sz||44;return '<svg viewBox="0 0 60 40" width="'+sz*1.5+'" height="'+sz+'"><path d="M14 20 L3 11 L5 29 Z" fill="'+c+'" stroke="#C9A98A" stroke-width="1.5" stroke-linejoin="round"/><path d="M46 20 L57 11 L55 29 Z" fill="'+c+'" stroke="#C9A98A" stroke-width="1.5" stroke-linejoin="round"/><circle cx="30" cy="20" r="14" fill="'+c+'" stroke="#C9A98A" stroke-width="1.8"/><path d="M22 14 q6 -5 14 0" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/></svg>';}
function giveCandy(){var m=st(),c=CANDIES[Math.floor(Math.random()*CANDIES.length)];m.candies.push({n:c.n,at:tk()});UI.snack={c:c.c};UI.happy=true;say(c.line);chime();B.save();paintHero();setTimeout(function(){UI.snack=null;UI.happy=false;paintHero();},3500);drawCards();}
function cupSVG(c){return '<svg viewBox="0 0 50 50" width="46" height="46"><path d="M10 16 h26 l-3 24 q-1 4 -5 4 h-10 q-4 0 -5 -4 z" fill="#FFFDF8" stroke="#C9A98A" stroke-width="2"/><path d="M12 22 h22 l-2 16 q-1 3 -4 3 h-10 q-3 0 -4 -3 z" fill="'+c+'"/><path d="M36 22 q8 0 7 7 q-1 6 -8 6" fill="none" stroke="#C9A98A" stroke-width="2"/><path d="M18 10 q-3 -4 0 -7 M26 10 q-3 -4 0 -7" stroke="#D8CFC4" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>';}

/* ---------- 오늘의 꽃 ---------- */
function flowerSVG(color,sz){var p='';for(var i=0;i<6;i++){p+='<ellipse cx="30" cy="16" rx="8" ry="13" fill="'+color+'" stroke="#fff" stroke-width="1.2" opacity=".95" transform="rotate('+(i*60)+' 30 30)"/>';}return '<svg viewBox="0 0 60 80" width="'+(sz||60)+'" height="'+((sz||60)*1.33)+'"><path d="M30 44 Q28 62 30 78" stroke="#8CC48C" stroke-width="3" fill="none"/><path d="M30 62 q-12 -6 -14 -14 q10 2 14 14" fill="#B8DCA0"/>'+p+'<circle cx="30" cy="30" r="7" fill="#FFE9A8" stroke="#E8CD7A" stroke-width="1.5"/></svg>';}
function season(){var mo=new Date().getMonth()+1;return mo>=3&&mo<=5?'spring':mo<=8&&mo>=6?'summer':mo>=9&&mo<=11?'fall':'winter';}
function pickFlower(){var rare=Math.random()<.15,pool=rare?FLOWERS.rare:FLOWERS.common;if(!rare){var se=pool.filter(function(x){return x.season===season();}),yr=pool.filter(function(x){return !x.season;});pool=se.length&&Math.random()<.6?se:(yr.length?yr:pool);}return pool[Math.floor(Math.random()*pool.length)];}
function flowerCardHTML(f){return '<div class="mb-flower'+(f.rare||f.season?' shine':'')+'" style="--fc:'+esc(f.color)+'">'+flowerSVG(f.color,64)+'<div><b>'+esc(f.n)+'</b><small>꽃말 · '+esc(f.mean)+(f.rare?' · 별꽃':f.season?' · 계절의 꽃':'')+'</small><p>"'+esc(f.word)+'"</p><ul><li>행운 행동 · '+esc(f.act)+'</li><li>행운 색 · '+esc(f.cname)+'</li><li>행운 시간 · '+esc(f.time)+'</li><li>오늘의 소품 · '+esc(f.item)+'</li></ul></div></div>';}

/* ---------- N월의 하늘 ---------- */
function rnd(seed){var x=Math.sin(seed)*10000;return x-Math.floor(x);}
function monthSky(){var now=B.parseKey(tk()),y=now.getFullYear(),mo=now.getMonth(),last=new Date(y,mo+1,0).getDate(),s=S(),h=hourNow();
  var phase=(h>=6&&h<17)?'day':(h>=17&&h<20)?'dusk':'night';
  var bg={day:['#A9CFEF','#DCEEFA'],dusk:['#F3B99A','#C9B6E4'],night:['#1E2250','#3B3A78']}[phase];
  var closes={};(s.dayCloses||[]).forEach(function(c){if(c&&c.key)closes[c.key]=1;});
  var pts=[],W=340,H=200;for(var d=1;d<=last;d++){var k=y+'-'+pad(mo+1)+'-'+pad(d),col=(d-1)%8,row=Math.floor((d-1)/8);var x=24+col*40+(rnd(y*100+mo*31+d)*16-8),yy=30+row*42+(rnd(d*7+mo)*18-9);var td=(s.todos||[]).filter(function(t){return t.scope==='day'&&t.key===k&&t.done;}).length;var lit=!!closes[k]||td>0;pts.push({d:d,k:k,x:x,y:yy,lit:lit,big:!!closes[k],today:k===tk()});}
  var lines='',prev=null;pts.forEach(function(p){if(p.lit){if(prev)lines+='<line x1="'+prev.x.toFixed(1)+'" y1="'+prev.y.toFixed(1)+'" x2="'+p.x.toFixed(1)+'" y2="'+p.y.toFixed(1)+'" stroke="'+(phase==='night'?'#FFF3C4':'#FFFFFF')+'" stroke-width="1.2" opacity=".6"/>';prev=p;}});
  var stars=pts.map(function(p){var r=p.big?6:p.lit?4.2:1.8;var fill=p.lit?'#FFE9A8':(phase==='night'?'#8C88B8':'#FFFFFF');return '<g data-mb="skyday" data-d="'+p.d+'" data-lit="'+(p.lit?1:0)+'" style="cursor:pointer"><circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="12" fill="transparent"/>'+(p.lit?'<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="'+(r*2.2)+'" fill="#FFF6D0" opacity=".35"/>':'')+'<path d="'+starPath(p.x,p.y,r)+'" fill="'+fill+'" opacity="'+(p.lit?1:.55)+'"/>'+(p.today?'<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="'+(r+6)+'" fill="none" stroke="#fff" stroke-dasharray="2 3" opacity=".8"/>':'')+'</g>';}).join('');
  var sun=phase==='day'?'<g transform="translate(300 34)"><circle r="16" fill="#FFE08A" stroke="#F2BE4E" stroke-width="3"/>'+[0,45,90,135,180,225,270,315].map(function(a){return '<line x1="0" y1="-22" x2="0" y2="-28" stroke="#F2BE4E" stroke-width="3" stroke-linecap="round" transform="rotate('+a+')"/>';}).join('')+'</g><g opacity=".9"><ellipse cx="80" cy="170" rx="30" ry="11" fill="#fff"/><ellipse cx="96" cy="162" rx="18" ry="12" fill="#fff"/></g>':phase==='dusk'?'<circle cx="300" cy="190" r="26" fill="#FFB27A" opacity=".9"/>':'<path d="M312 22 a16 16 0 1 0 8 30 a13 13 0 1 1 -8 -30z" fill="#FFF3C4"/>';
  var lit=pts.filter(function(p){return p.lit;}).length;
  return '<svg class="mb-sky" viewBox="0 0 '+W+' '+(H+30)+'"><defs><linearGradient id="mbskyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+bg[0]+'"/><stop offset="1" stop-color="'+bg[1]+'"/></linearGradient></defs><rect width="'+W+'" height="'+(H+30)+'" rx="18" fill="url(#mbskyg)"/>'+sun+lines+stars+'</svg><small class="mb-sub">'+(mo+1)+'월 별 '+lit+'/'+last+' · 할 일을 하거나 하루를 마감하면 그날 별이 켜져. 큰 별은 마감한 날.</small>';}
function starPath(x,y,r){var d='',i;for(i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;d+=(i?'L':'M')+(x+Math.cos(a)*rr).toFixed(1)+' '+(y+Math.sin(a)*rr).toFixed(1);}return d+'Z';}

/* ---------- 챌린지 ---------- */
function wakeGoal(){return (S().settings&&S().settings.wakeGoal)||'09:00';}
function toMin(t){var p=String(t).split(':').map(Number);return p[0]*60+(p[1]||0);}
function nowMin(){var n=new Date();return n.getHours()*60+n.getMinutes();}
function wakeState(){var m=st(),T=toMin(wakeGoal()),n=nowMin();if(m.day.wake)return 'done';if(n<T-120)return 'early';if(n>T)return 'late';return 'open';}
function fmtM(x){return pad(Math.floor(x/60))+':'+pad(x%60);}

/* ---------- 뷰 ---------- */
var ICON={
 song:'<svg viewBox="0 0 40 40"><path d="M10 30 q-6 0 -6 -5 q0 -5 6 -5 q4 0 5 2 V6 l14 -3 v18" fill="none" stroke="#B090DC" stroke-width="2.6" stroke-linecap="round"/><circle cx="10" cy="25" r="5" fill="#DCCDF2"/><circle cx="24" cy="22" r="5" fill="#DCCDF2" stroke="#B090DC" stroke-width="2"/></svg>',
 orgel:'<svg viewBox="0 0 40 40"><rect x="6" y="16" width="28" height="18" rx="4" fill="#FCE3C8" stroke="#D8A860" stroke-width="2"/><path d="M6 20 Q20 6 34 20" fill="#F6D6BC" stroke="#D8A860" stroke-width="2"/><circle cx="20" cy="25" r="3" fill="#E8CD7A"/><path d="M34 26 h4" stroke="#D8A860" stroke-width="2.4" stroke-linecap="round"/></svg>',
 tuck:'<svg viewBox="0 0 40 40"><path d="M4 26 q16 -8 32 0 v8 h-32 z" fill="#C8B8E8" stroke="#A894D0" stroke-width="2"/><circle cx="12" cy="20" r="5" fill="#FFFDF8" stroke="#DCD8E4" stroke-width="2"/><text x="26" y="16" font-size="9" fill="#8E7BA8">z z</text></svg>',
 snack:'<svg viewBox="0 0 40 40"><path d="M20 8 q9 1 7 12 q-3 9 -7 9 q-4 0 -7 -9 q-2 -11 7 -12z" fill="#F28AA0" stroke="#DE6B86" stroke-width="2"/><path d="M20 8 q-5 -5 -9 -3 M20 8 q5 -5 9 -3" stroke="#8CC48C" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="17" cy="16" r="1.2" fill="#fff"/><circle cx="23" cy="20" r="1.2" fill="#fff"/></svg>',
 tea:'<svg viewBox="0 0 40 40"><path d="M8 14 h20 l-2 18 q-1 3 -4 3 h-8 q-3 0 -4 -3z" fill="#FFFDF8" stroke="#C9A98A" stroke-width="2"/><path d="M10 19 h16 l-1 12 h-14z" fill="#E8C4A8"/><path d="M28 18 q7 0 6 6 q-1 5 -7 5" fill="none" stroke="#C9A98A" stroke-width="2"/></svg>',
 star:'<svg viewBox="0 0 40 40"><rect x="3" y="3" width="34" height="34" rx="9" fill="#2E2A60"/><path d="'+starPath(20,20,9)+'" fill="#FFE9A8"/><circle cx="9" cy="10" r="1.3" fill="#fff"/><circle cx="31" cy="30" r="1.1" fill="#fff"/><circle cx="30" cy="9" r="1" fill="#fff"/></svg>'
};
function view(){var m=st();UI.away=daysAway();if(UI.away>0&&!UI.greeted){UI.greeted=true;UI.line=UI.away>=14?'왔구나!! 먼지 속에서 손 흔들고 있었어.':UI.away>=7?'으음… 담요 덮고 자고 있었어. 왔구나!':UI.away>=3?'먼지가 살짝 앉았어. 털어줄래?':'왔구나! 보고 싶었어.';}
  if(!UI.line)UI.line=talkLine();
  var h=hourNow(),ph=(h>=6&&h<17)?'day':(h>=17&&h<20)?'dusk':'night';
  return '<div class="mb-wrap">'+
  '<section class="mb-hero mb-'+ph+'"><span class="mb-starpill" id="mb-starpill">⭐ '+m.stars+'</span><div class="mb-bubble" id="mb-bubble">'+esc(UI.line)+'</div><div class="mb-stage"><div id="mb-byeol" data-mb="talk" aria-label="먼별에게 말 걸기"></div><div id="mb-extra"></div></div><div class="mb-hero-acts"><button data-mb="talk">말 걸기</button><button data-mb="dust">'+(UI.away>=3?'먼지 털기':'복복 쓰다듬기')+'</button><button data-mb="gift"'+(m.day.gift?' disabled':'')+'>'+(m.day.gift?'오늘 선물 받음':'먼별의 선물')+'</button><button id="mb-stopamb" data-mb="stop" style="display:none">소리 끄기</button></div></section>'+
  '<div id="mb-cards"></div></div>';}
function drawCards(){var box=document.getElementById('mb-cards');if(!box)return;var m=st(),ws=wakeState(),T=toMin(wakeGoal());
  var wakeBtn=ws==='done'?'<button class="mb-big on" disabled>기상 인증 완료 · 연속 '+m.wake.streak+'일</button>':ws==='open'?'<button class="mb-big" data-mb="wake">일어났어! 기상 인증하기</button>':ws==='early'?'<button class="mb-big" disabled>'+fmtM(T-120)+'부터 열려</button>':'<button class="mb-big" disabled>오늘 인증 시간은 지났어 · 내일 아침에!</button>';
  var f=m.day.flower;
  var owned=m.tints;
  box.innerHTML=
  '<section class="mb-card"><h3>먼별 챌린지</h3><p class="mb-sub">기상 목표 '+esc(wakeGoal())+' · 목표 2시간 전부터 목표 시각까지 인증할 수 있어. 목표 시간은 설정의 기상 목표에서 바꿔.</p>'+wakeBtn+
  '<div class="mb-row"><button data-mb="water"'+(m.day.water>=3?' disabled':'')+'>물 마시기 '+m.day.water+'/3</button><button data-mb="tuckinfo">'+(m.day.tuck?'취침 인증 ✓':'취침 인증')+'</button></div><small class="mb-sub">기상 ⭐3 · 물 3잔 ⭐1 · 재워주면 취침 인증 ⭐1 · 안 해도 벌은 없어</small></section>'+
  '<section class="mb-card"><h3>먼별이랑 힐링하기</h3><div class="mb-heal">'+
   [['song','뽀로옹롱'],['orgel','오르골'],['tuck','재워주기'],['snack','간식 주기'],['tea','차 마시기'],['star','별 보기']].map(function(x){return '<button data-mb="heal" data-v="'+x[0]+'">'+ICON[x[0]]+'<span>'+x[1]+'</span></button>';}).join('')+'</div></section>'+
  '<section class="mb-card"><h3>오늘의 꽃</h3>'+(f?flowerCardHTML(f):'<button class="mb-big" data-mb="flower">먼별이 꽃밭에서 골라올게</button>')+'<small class="mb-sub">꽃 도감 '+m.dex.length+'/'+ALLF.length+' · 사탕 '+m.candies.length+'개 받음</small></section>'+
  '<section class="mb-card"><h3>'+(B.parseKey(tk()).getMonth()+1)+'월의 하늘</h3>'+monthSky()+'</section>'+
  '<section class="mb-card"><h3>먼별 미용실</h3><p class="mb-sub">별을 모아 먼별 색을 바꿀 수 있어. 색 한 번 교환 ⭐'+SALON_PRICE+' · 누르면 미리보기</p><div class="mb-salon">'+
   ALLT.map(function(t,i){var own=owned.indexOf(i)>=0,on=m.tint===i;return '<button class="mb-tint'+(on?' on':'')+'" data-mb="tint" data-i="'+i+'">'+byeolSVG('mbT'+i,t,{})+'<b>'+esc(t.name)+'</b><small>'+(on?'적용 중':own?'보유 · 적용':'⭐'+SALON_PRICE)+'</small></button>';}).join('')+'</div></section>';}
function mount(){paintHero();drawCards();var m=st();if(m.lastVisit!==tk()){m.lastVisit=tk();B.save();}}

/* ---------- 액션 ---------- */
function heal(v){var m=st(),h=hourNow();UI.tucked=false;UI.drink=null;
  if(v==='song'){startAmb('song');UI.happy=true;say('♪ 뽀로옹롱~ 뽀로로옹 뽀롱…');}
  else if(v==='orgel'){startAmb('orgel');say('별밤 오르골이야. 눈 감아봐.');}
  else if(v==='tuck'){if(!(h>=21||h<5)){say('아직 안 졸려~ 밤 9시 넘으면 재워줘.');return;}stopAmb();UI.tucked=true;UI.line='쿨… 쿨…';snore();if(!m.day.tuck){m.day.tuck=true;addStars(1,'취침 인증');}B.save();drawCards();}
  else if(v==='snack'){if(m.day.snack>=2){say('오늘 간식은 두 개나 먹었어. 배불러~ 내일 또 줘.');return;}m.day.snack++;var c=CANDIES[Math.floor(Math.random()*CANDIES.length)];UI.snack={c:c.c};UI.happy=true;say('냠냠… '+c.n+' 맛있다!');B.save();setTimeout(function(){UI.snack=null;UI.happy=false;paintHero();if(Math.random()<.3){say('맛있게 먹었어! 답례로 별 하나 줄게.');addStars(1,'먼별의 답례');}},2600);}
  else if(v==='tea'){var D=[{n:'딸기우유',c:'#F7C4D2'},{n:'코코아',c:'#B98A6A'},{n:'허브티',c:'#CFE3B0'},{n:season()==='fall'?'고구마라떼':season()==='winter'?'유자차':season()==='spring'?'벚꽃라떼':'복숭아 아이스티',c:'#F4C89A'}],d=D[Math.floor(Math.random()*D.length)];UI.drink=d;startAmb('tea');say(d.n+' 한 잔 어때? 후— 호록.');}
  else if(v==='star'){openStarView();return;}
  paintHero();}
function openStarView(){var ov=document.createElement('div');ov.className='mb-starview';var s='';for(var i=0;i<60;i++)s+='<i style="left:'+(Math.random()*100)+'%;top:'+(Math.random()*70)+'%;animation-delay:'+(Math.random()*3).toFixed(2)+'s"></i>';
  ov.innerHTML='<div class="mb-sv-sky">'+s+'</div><div class="mb-sv-byeol">'+byeolSVG('mbSV',curTint(),{})+'</div><p class="mb-sv-txt">별똥별이 지나가면 톡 눌러 소원을 빌어봐</p><button class="mb-sv-close">돌아가기</button>';document.body.appendChild(ov);startAmb('orgel');
  var iv=setInterval(function(){var sh=document.createElement('b');sh.className='mb-shoot';sh.style.left=(10+Math.random()*60)+'%';sh.style.top=(5+Math.random()*30)+'%';sh.onclick=function(){chime();ov.querySelector('.mb-sv-txt').textContent='소원 빌었어. 하늘이 기억할 거래.';sh.remove();};ov.appendChild(sh);setTimeout(function(){sh.remove();},2600);},3800);
  ov.querySelector('.mb-sv-close').onclick=function(){clearInterval(iv);stopAmb();ov.remove();paintHero();};}
function wake(){var m=st();if(wakeState()!=='open')return;var k=tk(),s=S(),n=new Date(),hm=pad(n.getHours())+':'+pad(n.getMinutes());s.logs=s.logs||{};var o=s.logs[k]||{};o.wakeGoal=true;if(!o.wake)o.wake=hm;s.logs[k]=o;
  var y=B.dkey(new Date(B.parseKey(k).getTime()-864e5));m.wake.streak=m.wake.last===y?m.wake.streak+1:1;m.wake.last=k;m.day.wake=true;UI.happy=true;say('일어났구나!! 같이 아침 맞자. 연속 '+m.wake.streak+'일째야!');addStars(3,'기상 인증');chime();drawCards();paintHero();setTimeout(function(){UI.happy=false;paintHero();},3000);}
function tintTap(i){var m=st(),t=ALLT[i];if(!t)return;if(m.tints.indexOf(i)>=0){m.tint=i;UI.previewTint=null;B.save();say(t.name+'으로 바꿨어! 어때?');pop();paintHero();drawCards();return;}
  if(UI.previewTint!==i){UI.previewTint=i;paintHero();say(t.name+' 미리보기야. 한 번 더 누르면 ⭐'+SALON_PRICE+'로 교환해.');pop();var h=document.querySelector('.mb-hero');if(h)h.scrollIntoView({behavior:'smooth',block:'start'});return;}
  if(m.stars<SALON_PRICE){say('별이 '+(SALON_PRICE-m.stars)+'개 모자라. 할 일 하나씩 복! 하면 금방이야.');UI.previewTint=null;paintHero();return;}
  m.stars-=SALON_PRICE;m.tints.push(i);m.tint=i;UI.previewTint=null;B.save();say('짠! '+t.name+' 먼별이 됐어.');chime();paintHero();drawCards();var p=document.getElementById('mb-starpill');if(p)p.textContent='⭐ '+m.stars;}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-mb]');if(!a||!isOn())return;var act=a.dataset.mb,m=st();
  if(act==='talk'){UI.tucked=false;UI.happy=Math.random()<.5;say(talkLine());if(Math.random()<.08&&!m.day.gift){m.day.gift=true;setTimeout(giveCandy,1600);}paintHero();}
  else if(act==='dust'){UI.away=0;UI.happy=true;say(daysAway()>=3?'복복복~ 먼지 다 털었다! 개운해.':'헤헤, 간지러워~');pop();paintHero();setTimeout(function(){UI.happy=false;paintHero();},2000);}
  else if(act==='gift'){if(m.day.gift)return;m.day.gift=true;giveCandy();}
  else if(act==='stop'){stopAmb();UI.happy=false;UI.drink=null;paintHero();}
  else if(act==='heal')heal(a.dataset.v);
  else if(act==='wake')wake();
  else if(act==='water'){if(m.day.water>=3)return;m.day.water++;tone(660,0,.15,.04,'triangle');say(['꿀꺽~ 물 한 잔! 잘했어.','꿀꺽꿀꺽~ 두 잔째!','세 잔 완료!! 몸이 좋아할 거야.'][m.day.water-1]);if(m.day.water===3)addStars(1,'물 3잔');B.save();drawCards();}
  else if(act==='tuckinfo')say(m.day.tuck?'오늘 취침 인증 완료! 포근했지.':'밤 9시 넘어서 힐링하기의 재워주기를 하면 자동으로 체크돼!');
  else if(act==='flower'){if(m.day.flower)return;say('꽃밭에서 고르는 중…');setTimeout(function(){var f=pickFlower();m.day.flower=f;if(m.dex.indexOf(f.n)<0)m.dex.push(f.n);B.save();drawCards();say(f.rare?'별꽃이야…! 흔치 않은 거야.':f.word);chime();},1200);}
  else if(act==='tint')tintTap(Number(a.dataset.i));
  else if(act==='skyday'){var d=a.dataset.d;say(a.dataset.lit==='1'?d+'일의 별이야. 그날도 반짝였어.':d+'일은 아직 흐린 별이야. 사라지진 않아.');}
});

/* ---------- 할 일: 먼지 → 별사탕 ---------- */
document.addEventListener('click',function(e){if(!isOn())return;var a=e.target.closest&&e.target.closest('[data-act="toggle"],[data-act="toggle-rt"]');if(!a)return;var id=a.dataset.id,rt=a.dataset.act==='toggle-rt',date=a.dataset.date,was=!!(a.closest('.todo')&&a.closest('.todo').classList.contains('done'));
  setTimeout(function(){var sel=rt?'[data-act="toggle-rt"][data-id="'+id+'"][data-date="'+date+'"]':'[data-act="toggle"][data-id="'+id+'"]';var b=document.querySelector(sel);if(was||!b)return;b.classList.add('mb-burst');pop();burstAt(b);
    var m=st(),key=id+(rt?'@'+date:'');if(m.day.todo.indexOf(key)<0&&m.day.todo.length<5){m.day.todo.push(key);addStars(1,'먼지가 별사탕이 됐어');}
    var p=dayProgress();if(p.n>=2&&p.d===p.n&&!m.day.allDone){m.day.allDone=true;addStars(2,'오늘 할 일 전부 복!');}B.save();},60);},false);
function burstAt(el){var r=el.getBoundingClientRect();for(var i=0;i<8;i++){var s=document.createElement('i');s.className='mb-spark';s.style.left=(r.left+r.width/2)+'px';s.style.top=(r.top+r.height/2)+'px';var a=i/8*Math.PI*2;s.style.setProperty('--dx',(Math.cos(a)*28)+'px');s.style.setProperty('--dy',(Math.sin(a)*28)+'px');document.body.appendChild(s);setTimeout(function(x){return function(){x.remove();};}(s),700);}}
/* 하루 마감 보상 */
function checkClose(){if(!isOn())return;var m=st();if(m.day.close)return;var has=(S().dayCloses||[]).some(function(c){return c&&c.key===tk();});if(has){m.day.close=true;addStars(3,'하루 마감');B.save();}}

/* ---------- 내비 아이콘 ---------- */
var NAVI={
 month:'<svg viewBox="0 0 32 32"><rect x="5" y="7" width="22" height="20" rx="5" fill="#FCE3EC" stroke="#E79ABA" stroke-width="2"/><path d="M5 13h22" stroke="#E79ABA" stroke-width="2"/><path d="'+starPath(16,20,4.5)+'" fill="#F2C94C"/></svg>',
 week:'<svg viewBox="0 0 32 32"><rect x="4" y="8" width="24" height="18" rx="5" fill="#E4F2FB" stroke="#86AFD6" stroke-width="2"/><path d="M10 13v8M14 13v8M18 13v8M22 13v8" stroke="#86AFD6" stroke-width="2" stroke-linecap="round"/></svg>',
 day:'<svg viewBox="0 0 32 32"><rect x="6" y="4" width="17" height="23" rx="3" fill="#F3EEE4" stroke="#C9B89A" stroke-width="2"/><path d="M10 11h9M10 15h9M10 19h6" stroke="#C9B0E0" stroke-width="2" stroke-linecap="round"/><path d="M20 26 l8 -9 3 3 -8 9 -4 1z" fill="#F2C06A" stroke="#D89A3A" stroke-width="1.6"/></svg>',
 todo:'<svg viewBox="0 0 32 32"><path d="'+starPath(16,16,12)+'" fill="#FFF1C2" stroke="#E8C66A" stroke-width="2" stroke-linejoin="round"/><path d="M11 16l3.5 3.5L21 13" stroke="#D89A3A" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>',
 ttable:'<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="11" fill="#E6F5EE" stroke="#8CC4AC" stroke-width="2"/><path d="M16 10v6l4 3" stroke="#6AA88E" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>',
 friends:'<svg viewBox="0 0 32 32"><circle cx="20" cy="12" r="7" fill="#FCE3EC" stroke="#E79ABA" stroke-width="2"/><circle cx="12" cy="18" r="8" fill="#E9E0F7" stroke="#B8A0DC" stroke-width="2"/><circle cx="9.5" cy="18" r="1.2" fill="#5E5468"/><circle cx="14.5" cy="18" r="1.2" fill="#5E5468"/><path d="M10.5 21q1.5 1.2 3 0" stroke="#5E5468" stroke-width="1.3" fill="none"/><circle cx="18" cy="11" r="1" fill="#5E5468"/><circle cx="22" cy="11" r="1" fill="#5E5468"/></svg>',
 meonbyeol:'<svg viewBox="0 0 32 32"><path d="'+(typeof cloudPath==='function'?cloudPath(16,17,11,9):'')+'" fill="#FFFDFC" stroke="#DCCDF2" stroke-width="2"/><path d="M11 17q2-1.6 4 0M17 17q2-1.6 4 0" stroke="#5E5468" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse cx="9.5" cy="20" rx="2" ry="1.2" fill="#F7C8D8"/><ellipse cx="22.5" cy="20" rx="2" ry="1.2" fill="#F7C8D8"/><path d="'+starPath(26,6,4)+'" fill="#F2C94C"/></svg>'
};
function navHTML(tabs,cur,pending){var t=tabs.slice();t.splice(3,0,['meonbyeol','먼별']);return t.map(function(x){var dot=x[0]==='friends'&&pending>0?'<i class="navdot"></i>':'';return '<button data-act="tab" data-tab="'+x[0]+'" class="mb-nav'+(cur===x[0]?' on':'')+'">'+(NAVI[x[0]]||'')+'<span>'+x[1]+'</span>'+dot+'</button>';}).join('');}

/* ---------- Market 미리보기 데모 ---------- */
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-market-preview="'+PID+'"]');if(!a)return;e.preventDefault();e.stopImmediatePropagation();
  var ov=document.createElement('div');ov.className='mb-demo';ov.innerHTML='<div class="mb-demo-card"><div class="mb-demo-byeol">'+byeolSVG('mbDemo',BASE,{happy:true})+'</div><p>먼별이 플래너에 이사 와요</p><ul class="mb-demo-list"><li><button class="chk mb-demo-chk">✓</button><span>과제 제출하기</span></li><li><button class="chk mb-demo-chk">✓</button><span>영단어 30개</span></li></ul><small>회색 먼지를 눌러봐. 별사탕으로 변해!</small><button class="mb-demo-close">닫기</button></div>';document.body.appendChild(ov);ov.classList.add('mbon');
  ov.querySelectorAll('.mb-demo-chk').forEach(function(b){b.onclick=function(){if(b.parentNode.classList.contains('done'))return;b.parentNode.classList.add('done');b.classList.add('mb-burst');pop();burstAt(b);};});ov.querySelector('.mb-demo-close').onclick=function(){ov.remove();};setTimeout(pop,300);},true);
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-market-deactivate]');if(!a)return;e.preventDefault();var ty=a.dataset.marketDeactivate;if(E()&&E().deactivate)E().deactivate(ty);var u=B.ui();if(ty==='meonbyeol'&&u&&u.tab==='meonbyeol')u.tab='day';stopAmb();toast('적용을 해제했어요');try{window.PLANON_SHOP.openProduct(a.dataset.pid);}catch(x){}try{B.render(true);}catch(x){}},true);

/* ---------- 적용 반영 ---------- */
function sync(){var on=isOn();document.documentElement.classList.toggle('mbon',on);var u=B.ui();if(!on&&u&&u.tab==='meonbyeol'){u.tab='day';try{B.render(true);}catch(e){}}if(on){checkClose();if(document.getElementById('mb-byeol')&&!document.getElementById('mb-byeol').firstChild)mount();}}
window.addEventListener('planon-market-change',function(){sync();try{var nav=document.getElementById('nav');if(nav)B.render();}catch(e){}});
var mainEl=document.getElementById('main');if(mainEl)new MutationObserver(function(){setTimeout(sync,0);}).observe(mainEl,{childList:true});
window.PLANON_MEONBYEOL={on:isOn,view:function(){setTimeout(mount,0);return view();},nav:navHTML};
setTimeout(function(){sync();if(isOn())try{B.render();}catch(e){}},50);
})();
