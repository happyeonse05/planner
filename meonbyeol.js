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
function renderByeolBase(svg,o){
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
      specks+=`<circle cx="${(100+Math.cos(a)*rr).toFixed(1)}" cy="${(102+Math.sin(a)*rr*.85).toFixed(1)}" r="${(0.8+Math.random()*1.5).toFixed(1)}" fill="${Math.random()>.45?'#CDBFE6':'#E6DDF3'}" opacity="${(.35+Math.random()*.25).toFixed(2)}"/>`;
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
  ${baby||hidden||o.plain?'':`
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
  ${baby||hidden||o.plain?'':`
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
  ${hidden||o.expr?'':(eating||happy)?`
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
  ${hidden||o.expr?'':`
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
/* ---------- 표정 (사용자가 준 byeol_mondol_faces_v3 최종본 그대로 · 본체/비율 유지) ---------- */
var EXPRS=[['normal','기본'],['smile','활짝'],['focus','집중+안경'],['sleepy','졸림'],['surprised','깜짝'],['sad','시무룩'],['angry','화남'],['upset','속상'],['proud','뿌듯'],['shy','수줍']];
var EXACT_BYEOL_FACES={"normal":"<line x1=\"74\" y1=\"102\" x2=\"88\" y2=\"102\" stroke=\"#5E5468\" stroke-width=\"4.5\" stroke-linecap=\"round\"/> <line x1=\"112\" y1=\"102\" x2=\"126\" y2=\"102\" stroke=\"#5E5468\" stroke-width=\"4.5\" stroke-linecap=\"round\"/> <path d=\"M95 113 Q100 117 105 113\" stroke=\"#5E5468\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/> <ellipse cx=\"69\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/><ellipse cx=\"131\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/>","smile":"<path d=\"M74 100 q7 -5.5 14 0\" stroke=\"#5E5468\" stroke-width=\"4\" fill=\"none\" stroke-linecap=\"round\"/> <path d=\"M112 100 q7 -5.5 14 0\" stroke=\"#5E5468\" stroke-width=\"4\" fill=\"none\" stroke-linecap=\"round\"/> <path d=\"M92 111 Q100 120 108 111\" stroke=\"#5E5468\" stroke-width=\"3.2\" fill=\"none\" stroke-linecap=\"round\"/> <ellipse cx=\"69\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/><ellipse cx=\"131\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/>","focus":"<ellipse cx=\"81\" cy=\"102\" rx=\"4.2\" ry=\"5.4\" fill=\"#5E5468\"/><ellipse cx=\"119\" cy=\"102\" rx=\"4.2\" ry=\"5.4\" fill=\"#5E5468\"/> <circle cx=\"82.4\" cy=\"100.7\" r=\"1.1\" fill=\"#fff\"/><circle cx=\"120.4\" cy=\"100.7\" r=\"1.1\" fill=\"#fff\"/> <path d=\"M73 94 L88 98 M127 94 L112 98\" stroke=\"#5E5468\" stroke-width=\"2.2\" stroke-linecap=\"round\" opacity=\".8\"/> <path d=\"M95 114 Q100 116 105 114\" stroke=\"#5E5468\" stroke-width=\"2.8\" fill=\"none\" stroke-linecap=\"round\"/> <g><circle cx=\"81\" cy=\"102\" r=\"9.5\" fill=\"none\" stroke=\"#6B5E77\" stroke-width=\"2.6\"/><circle cx=\"119\" cy=\"102\" r=\"9.5\" fill=\"none\" stroke=\"#6B5E77\" stroke-width=\"2.6\"/><line x1=\"90.5\" y1=\"101\" x2=\"109.5\" y2=\"101\" stroke=\"#6B5E77\" stroke-width=\"2.6\"/></g> <ellipse cx=\"69\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/><ellipse cx=\"131\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/>","sleepy":"<path d=\"M74 102 q7 5 14 0\" stroke=\"#5E5468\" stroke-width=\"4\" fill=\"none\" stroke-linecap=\"round\"/> <path d=\"M112 102 q7 5 14 0\" stroke=\"#5E5468\" stroke-width=\"4\" fill=\"none\" stroke-linecap=\"round\"/> <path d=\"M97 114 q3 2 6 0\" stroke=\"#5E5468\" stroke-width=\"2.8\" fill=\"none\" stroke-linecap=\"round\"/> <text x=\"132\" y=\"95\" font-size=\"18\" font-weight=\"700\" fill=\"#806EA8\" font-family=\"sans-serif\">Z</text> <text x=\"144\" y=\"83\" font-size=\"14\" font-weight=\"700\" fill=\"#8F7DB8\" font-family=\"sans-serif\">z</text> <text x=\"153\" y=\"72\" font-size=\"11\" font-weight=\"700\" fill=\"#A18FC8\" font-family=\"sans-serif\">z</text> <ellipse cx=\"69\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/><ellipse cx=\"131\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/>","surprised":"<circle cx=\"81\" cy=\"101\" r=\"5.5\" fill=\"#5E5468\"/><circle cx=\"119\" cy=\"101\" r=\"5.5\" fill=\"#5E5468\"/> <circle cx=\"83\" cy=\"99\" r=\"1.5\" fill=\"#fff\"/><circle cx=\"121\" cy=\"99\" r=\"1.5\" fill=\"#fff\"/> <path d=\"M72 91 q9 -6 18 0 M110 91 q9 -6 18 0\" stroke=\"#5E5468\" stroke-width=\"2.1\" fill=\"none\" stroke-linecap=\"round\"/> <ellipse cx=\"100\" cy=\"115\" rx=\"4.2\" ry=\"5.2\" fill=\"none\" stroke=\"#5E5468\" stroke-width=\"2.8\"/> <text x=\"140\" y=\"92\" font-size=\"25\" font-weight=\"700\" fill=\"#745F95\" font-family=\"sans-serif\">!</text> <ellipse cx=\"69\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/><ellipse cx=\"131\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/>","sad":"<path d=\"M74 105 l12 -8\" stroke=\"#5E5468\" stroke-width=\"4\" stroke-linecap=\"round\"/> <path d=\"M114 97 l12 8\" stroke=\"#5E5468\" stroke-width=\"4\" stroke-linecap=\"round\"/> <path d=\"M94 119 Q100 114 106 119\" stroke=\"#5E5468\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/> <ellipse cx=\"69\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".62\"/><ellipse cx=\"131\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".62\"/>","angry":"<path d=\"M74 96 l14 8\" stroke=\"#5E5468\" stroke-width=\"4\" stroke-linecap=\"round\"/> <path d=\"M112 104 l14 -8\" stroke=\"#5E5468\" stroke-width=\"4\" stroke-linecap=\"round\"/> <path d=\"M95 119 Q100 115 105 119\" stroke=\"#5E5468\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/> <ellipse cx=\"69\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/><ellipse cx=\"131\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/>","upset":"<path d=\"M70 93 Q79 87 88 93\" stroke=\"#5E5468\" stroke-width=\"2.2\" fill=\"none\" stroke-linecap=\"round\"/> <path d=\"M112 93 Q121 87 130 93\" stroke=\"#5E5468\" stroke-width=\"2.2\" fill=\"none\" stroke-linecap=\"round\"/> <ellipse cx=\"81\" cy=\"103\" rx=\"6.2\" ry=\"7.7\" fill=\"#5E5468\"/><ellipse cx=\"119\" cy=\"103\" rx=\"6.2\" ry=\"7.7\" fill=\"#5E5468\"/> <circle cx=\"83\" cy=\"100\" r=\"2.1\" fill=\"#FFF\"/><circle cx=\"121\" cy=\"100\" r=\"2.1\" fill=\"#FFF\"/> <ellipse cx=\"80\" cy=\"107.5\" rx=\"3.8\" ry=\"1.8\" fill=\"#A7D9F4\"/><ellipse cx=\"118\" cy=\"107.5\" rx=\"3.8\" ry=\"1.8\" fill=\"#A7D9F4\"/> <path d=\"M96 118 q2 -3 4 0 q2 3 4 0\" stroke=\"#5E5468\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/> <path d=\"M72 109 q-6 9 0 15 q7-5 0-15z\" fill=\"#76BFE8\" stroke=\"#5CAAD5\" stroke-width=\"1.1\"/> <path d=\"M128 109 q6 9 0 15 q-7-5 0-15z\" fill=\"#76BFE8\" stroke=\"#5CAAD5\" stroke-width=\"1.1\"/> <ellipse cx=\"69\" cy=\"116\" rx=\"7.2\" ry=\"4.1\" fill=\"#F7C8D8\" opacity=\".35\"/><ellipse cx=\"131\" cy=\"116\" rx=\"7.2\" ry=\"4.1\" fill=\"#F7C8D8\" opacity=\".35\"/>","proud":"<path d=\"M74 100 q7 -4 14 0\" stroke=\"#5E5468\" stroke-width=\"4\" fill=\"none\" stroke-linecap=\"round\"/> <path d=\"M112 100 q7 -4 14 0\" stroke=\"#5E5468\" stroke-width=\"4\" fill=\"none\" stroke-linecap=\"round\"/> <path d=\"M92 111 Q100 119 108 111\" stroke=\"#5E5468\" stroke-width=\"3.1\" fill=\"none\" stroke-linecap=\"round\"/> <path d=\"M141 91 l2 4.6 4.6 2 -4.6 2 -2 4.6 -2-4.6 -4.6-2 4.6-2z\" fill=\"#EBD48F\"/> <ellipse cx=\"69\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/><ellipse cx=\"131\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/>","shy":"<ellipse cx=\"80\" cy=\"102\" rx=\"3.2\" ry=\"4.3\" fill=\"#5E5468\"/><ellipse cx=\"118\" cy=\"102\" rx=\"3.2\" ry=\"4.3\" fill=\"#5E5468\"/> <circle cx=\"79\" cy=\"100.8\" r=\".9\" fill=\"#fff\"/><circle cx=\"117\" cy=\"100.8\" r=\".9\" fill=\"#fff\"/> <path d=\"M96 114 q4 3 8 0\" stroke=\"#5E5468\" stroke-width=\"2.8\" fill=\"none\" stroke-linecap=\"round\"/> <path d=\"M58 113 q8 -6 16 0 M126 113 q8 -6 16 0\" stroke=\"#F2A8C2\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\" opacity=\".9\"/> <ellipse cx=\"69\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".95\"/><ellipse cx=\"131\" cy=\"114\" rx=\"7.5\" ry=\"4.5\" fill=\"#F7C8D8\" opacity=\".95\"/>"};
var EXACT_DOL_FACES={"normal":"<line x1=\"44\" y1=\"58\" x2=\"55\" y2=\"58\" stroke=\"#5E5468\" stroke-width=\"4\" stroke-linecap=\"round\"/><line x1=\"66\" y1=\"58\" x2=\"77\" y2=\"58\" stroke=\"#5E5468\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M56 68 q4 3 8 0\" stroke=\"#5E5468\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/> <circle cx=\"38\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/><circle cx=\"82\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/>","smile":"<path d=\"M43 58 q5 -4 10 0\" stroke=\"#5E5468\" stroke-width=\"3.4\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M67 58 q5 -4 10 0\" stroke=\"#5E5468\" stroke-width=\"3.4\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M54 67 q6 7 12 0\" stroke=\"#5E5468\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/> <circle cx=\"38\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/><circle cx=\"82\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/>","focus":"<ellipse cx=\"49.5\" cy=\"58\" rx=\"3.5\" ry=\"4.8\" fill=\"#5E5468\"/><ellipse cx=\"71.5\" cy=\"58\" rx=\"3.5\" ry=\"4.8\" fill=\"#5E5468\"/><circle cx=\"50.5\" cy=\"56.8\" r=\".9\" fill=\"#fff\"/><circle cx=\"72.5\" cy=\"56.8\" r=\".9\" fill=\"#fff\"/><path d=\"M43 51 l12 2 M77 51 l-12 2\" stroke=\"#5E5468\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M56 69 q4 2 8 0\" stroke=\"#5E5468\" stroke-width=\"2.8\" fill=\"none\" stroke-linecap=\"round\"/><g><circle cx=\"49.5\" cy=\"58\" r=\"8\" fill=\"none\" stroke=\"#5E5468\" stroke-width=\"2.2\"/><circle cx=\"71.5\" cy=\"58\" r=\"8\" fill=\"none\" stroke=\"#5E5468\" stroke-width=\"2.2\"/><line x1=\"57.5\" y1=\"58\" x2=\"63.5\" y2=\"58\" stroke=\"#5E5468\" stroke-width=\"2.2\"/></g> <circle cx=\"38\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/><circle cx=\"82\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/>","sleepy":"<path d=\"M44 58 q5 3 10 0\" stroke=\"#5E5468\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M66 58 q5 3 10 0\" stroke=\"#5E5468\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/> <path d=\"M56 69 q4 2 8 0\" stroke=\"#5E5468\" stroke-width=\"2.7\" fill=\"none\" stroke-linecap=\"round\"/> <text x=\"87\" y=\"34\" font-size=\"15\" font-weight=\"700\" fill=\"#806EA8\" font-family=\"sans-serif\">Z</text> <text x=\"98\" y=\"25\" font-size=\"11\" font-weight=\"700\" fill=\"#8F7DB8\" font-family=\"sans-serif\">z</text> <text x=\"105\" y=\"18\" font-size=\"8\" font-weight=\"700\" fill=\"#A18FC8\" font-family=\"sans-serif\">z</text> <circle cx=\"38\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/><circle cx=\"82\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/>","surprised":"<circle cx=\"49\" cy=\"58\" r=\"4\" fill=\"#5E5468\"/><circle cx=\"71\" cy=\"58\" r=\"4\" fill=\"#5E5468\"/><circle cx=\"50.2\" cy=\"56.8\" r=\"1\" fill=\"#fff\"/><circle cx=\"72.2\" cy=\"56.8\" r=\"1\" fill=\"#fff\"/> <path d=\"M41 49 q6 -5 12 -1 M67 48 q6 -4 12 1\" stroke=\"#5E5468\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/> <circle cx=\"60\" cy=\"69\" r=\"3.6\" fill=\"none\" stroke=\"#5E5468\" stroke-width=\"2.5\"/> <text x=\"91\" y=\"33\" font-size=\"18\" font-weight=\"700\" fill=\"#745F95\" font-family=\"sans-serif\">!</text> <circle cx=\"38\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/><circle cx=\"82\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/>","sad":"<path d=\"M43 62 l10 -7\" stroke=\"#5E5468\" stroke-width=\"3.7\" stroke-linecap=\"round\"/> <path d=\"M67 55 l10 7\" stroke=\"#5E5468\" stroke-width=\"3.7\" stroke-linecap=\"round\"/> <path d=\"M54 72 q6 -5 12 0\" stroke=\"#5E5468\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/> <circle cx=\"38\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".62\"/><circle cx=\"82\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".62\"/>","angry":"<path d=\"M43 55 l11 7\" stroke=\"#5E5468\" stroke-width=\"3.7\" stroke-linecap=\"round\"/> <path d=\"M66 62 l11 -7\" stroke=\"#5E5468\" stroke-width=\"3.7\" stroke-linecap=\"round\"/> <path d=\"M54 72 q6 -4 12 0\" stroke=\"#5E5468\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/> <circle cx=\"38\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/><circle cx=\"82\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/>","upset":"<path d=\"M40 51 Q48 46 55 52\" stroke=\"#5E5468\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M65 52 Q73 46 80 51\" stroke=\"#5E5468\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/> <ellipse cx=\"49\" cy=\"59\" rx=\"4.6\" ry=\"5.7\" fill=\"#5E5468\"/><ellipse cx=\"71\" cy=\"59\" rx=\"4.6\" ry=\"5.7\" fill=\"#5E5468\"/> <circle cx=\"50.5\" cy=\"57\" r=\"1.5\" fill=\"#FFF\"/><circle cx=\"72.5\" cy=\"57\" r=\"1.5\" fill=\"#FFF\"/> <ellipse cx=\"48.5\" cy=\"62.5\" rx=\"2.9\" ry=\"1.3\" fill=\"#A7D9F4\"/><ellipse cx=\"70.5\" cy=\"62.5\" rx=\"2.9\" ry=\"1.3\" fill=\"#A7D9F4\"/> <path d=\"M56 71 q2 -2.5 4 0 q2 2.5 4 0\" stroke=\"#5E5468\" stroke-width=\"2.7\" fill=\"none\" stroke-linecap=\"round\"/> <path d=\"M38 62 q-4 7 0 11 q5-4 0-11z\" fill=\"#76BFE8\" stroke=\"#5CAAD5\" stroke-width=\".8\"/><path d=\"M82 62 q4 7 0 11 q-5-4 0-11z\" fill=\"#76BFE8\" stroke=\"#5CAAD5\" stroke-width=\".8\"/> <circle cx=\"38\" cy=\"68\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".35\"/><circle cx=\"82\" cy=\"68\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".35\"/>","proud":"<path d=\"M43 57 q5 -3.5 10 0\" stroke=\"#5E5468\" stroke-width=\"3.4\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M67 57 q5 -3.5 10 0\" stroke=\"#5E5468\" stroke-width=\"3.4\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M54 67 q6 6 12 0\" stroke=\"#5E5468\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M94 29 l1.5 3.4 3.4 1.5 -3.4 1.5 -1.5 3.4 -1.5-3.4 -3.4-1.5 3.4-1.5z\" fill=\"#EBD48F\"/> <circle cx=\"38\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/><circle cx=\"82\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".7\"/>","shy":"<ellipse cx=\"49\" cy=\"58\" rx=\"2.8\" ry=\"3.8\" fill=\"#5E5468\"/><ellipse cx=\"71\" cy=\"58\" rx=\"2.8\" ry=\"3.8\" fill=\"#5E5468\"/><circle cx=\"48\" cy=\"56.8\" r=\".8\" fill=\"#fff\"/><circle cx=\"70\" cy=\"56.8\" r=\".8\" fill=\"#fff\"/><path d=\"M55 68 q5 4 10 0\" stroke=\"#5E5468\" stroke-width=\"2.7\" fill=\"none\" stroke-linecap=\"round\"/> <circle cx=\"38\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".95\"/><circle cx=\"82\" cy=\"66\" r=\"4.5\" fill=\"#F7C8D8\" opacity=\".95\"/>"};
function byeolFace(expression,opts){
  expression=EXACT_BYEOL_FACES[expression]?expression:'normal';
  return '<g class="monbyeol-face" data-expression="'+expression+'">'+EXACT_BYEOL_FACES[expression]+'</g>';
}
function renderByeol(svg,o){renderByeolBase(svg,o);var add='';if(o.expr)add+=byeolFace(o.expr,{dusty:!!o.dusty});if(o.gearList&&o.gearList.length)add+=o.gearList.map(function(g){return GEAR[g]&&GEAR[g].b||'';}).join('');if(add)svg.innerHTML=svg.innerHTML+add;}

/* ---------- 먼돌이: 최종 표정팩의 얼굴 + 헤드폰 실루엣 고정 ---------- */
var DOLN=0;
function dolFace(ex){ex=EXACT_DOL_FACES[ex]?ex:'normal';return '<g class="mondol-face" data-expression="'+ex+'">'+EXACT_DOL_FACES[ex]+'</g>';}
function dolSVG(o){o=o||{};var ex=EXACT_DOL_FACES[o.expr]?o.expr:'normal';
  var headphone='<path d="M24 42 Q60 0 96 42" stroke="#A894D0" stroke-width="6.5" fill="none" stroke-linecap="round"/><path d="M24 42 Q60 3 96 42" stroke="#C8B8E8" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="13" y="38" width="15" height="22" rx="7.5" fill="#C8B8E8" stroke="#A894D0" stroke-width="2.5"/><rect x="92" y="38" width="15" height="22" rx="7.5" fill="#C8B8E8" stroke="#A894D0" stroke-width="2.5"/><rect x="16.5" y="42" width="8" height="14" rx="4" fill="#E8DFF5"/><rect x="95.5" y="42" width="8" height="14" rx="4" fill="#E8DFF5"/><circle cx="20" cy="45" r="1.5" fill="#FFF" opacity=".8"/>';
  return '<svg class="mb-dol" viewBox="0 0 120 110" aria-hidden="true">'+
  '<path d="M60 16 q34 0 40 34 q4 30 -18 40 q-22 10 -44 0 q-22 -10 -18 -40 q6 -34 40 -34 z" fill="#D8D2E2" stroke="#A79BB4" stroke-width="4" stroke-linejoin="round"/><ellipse cx="44" cy="34" rx="9" ry="5" fill="#EAE6F0" opacity=".9"/>'+dolFace(ex)+headphone+
  ((o.gearList||[]).map(function(g){return GEAR[g]&&GEAR[g].d||'';}).join(''))+'<ellipse cx="60" cy="98" rx="34" ry="6" fill="#D9CBEE" opacity=".5"/></svg>';}

/* ---------- 옷장 (b=먼별 200 좌표, d=먼돌 120 좌표) ---------- */
var GEAR={
 flowerpin:{n:'꽃핀',slot:'head',cost:{star:30},b:'<g transform="translate(138 52)"><circle r="6" cx="-7" cy="0" fill="#F7B8D2"/><circle r="6" cx="7" cy="0" fill="#F7B8D2"/><circle r="6" cx="0" cy="-7" fill="#F7B8D2"/><circle r="6" cx="0" cy="7" fill="#F7B8D2"/><circle r="4.5" fill="#FFE08A" stroke="#E8B84A" stroke-width="1.2"/></g>',d:'<g transform="translate(84 24)"><circle r="4" cx="-5" fill="#F7B8D2"/><circle r="4" cx="5" fill="#F7B8D2"/><circle r="4" cy="-5" fill="#F7B8D2"/><circle r="4" cy="5" fill="#F7B8D2"/><circle r="3" fill="#FFE08A"/></g>'},
 ribbon:{n:'리본',slot:'head',cost:{lemon:10},b:'<g transform="translate(100 40)"><path d="M0 0 L-22 -12 Q-28 0 -22 12 Z" fill="#F4A6C0" stroke="#D9799C" stroke-width="2" stroke-linejoin="round"/><path d="M0 0 L22 -12 Q28 0 22 12 Z" fill="#F4A6C0" stroke="#D9799C" stroke-width="2" stroke-linejoin="round"/><circle r="5.5" fill="#E88AAE" stroke="#D9799C" stroke-width="1.6"/></g>',d:'<g transform="translate(60 16)"><path d="M0 0 L-15 -8 Q-19 0 -15 8 Z" fill="#F4A6C0" stroke="#D9799C" stroke-width="1.6"/><path d="M0 0 L15 -8 Q19 0 15 8 Z" fill="#F4A6C0" stroke="#D9799C" stroke-width="1.6"/><circle r="4" fill="#E88AAE"/></g>'},
 nightcap:{n:'수면모자',slot:'head',pid:'mb-wear-nightcap',b:'<g><path d="M58 58 Q70 12 132 22 Q150 26 158 44 Q128 30 112 36 Q144 50 142 60 Q100 44 58 58Z" fill="#8E9AD8" stroke="#6E7AB8" stroke-width="2.4" stroke-linejoin="round"/><path d="M56 58 Q100 42 144 60" stroke="#FFFDF8" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="160" cy="46" r="7" fill="#FFFDF8" stroke="#D8D2E8" stroke-width="1.6"/><path d="M92 34 l1.6 3.4 3.6.5 -2.6 2.5.6 3.6 -3.2-1.7 -3.2 1.7.6-3.6 -2.6-2.5 3.6-.5z" fill="#FFE9A8"/></g>',d:'<g><path d="M30 30 Q40 2 84 8 Q98 12 102 24 Q82 16 72 20 Q94 28 92 34 Q60 22 30 30Z" fill="#8E9AD8" stroke="#6E7AB8" stroke-width="2"/><path d="M28 30 Q60 18 92 34" stroke="#FFFDF8" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="103" cy="26" r="5" fill="#FFFDF8"/></g>'},
 crown:{n:'별 왕관',slot:'head',pid:'mb-wear-crown',b:'<g transform="translate(100 36)"><path d="M-24 10 L-26 -10 L-13 0 L0 -16 L13 0 L26 -10 L24 10 Z" fill="#FFE08A" stroke="#E0B040" stroke-width="2.4" stroke-linejoin="round"/><circle cx="0" cy="-16" r="3.4" fill="#F7B8D2"/><circle cx="-26" cy="-10" r="2.6" fill="#C9B2EC"/><circle cx="26" cy="-10" r="2.6" fill="#BDEBD8"/></g>',d:'<g transform="translate(60 14)"><path d="M-17 7 L-18 -7 L-9 0 L0 -11 L9 0 L18 -7 L17 7 Z" fill="#FFE08A" stroke="#E0B040" stroke-width="1.8" stroke-linejoin="round"/><circle cy="-11" r="2.4" fill="#F7B8D2"/></g>'},
 bunny:{n:'토끼 귀',slot:'head',pid:'mb-wear-bunny',b:'<g><ellipse cx="78" cy="28" rx="10" ry="26" fill="#FFFDF8" stroke="#E4D6EC" stroke-width="2.4" transform="rotate(-12 78 40)"/><ellipse cx="78" cy="30" rx="4.5" ry="17" fill="#F7C8D8" transform="rotate(-12 78 40)"/><ellipse cx="122" cy="28" rx="10" ry="26" fill="#FFFDF8" stroke="#E4D6EC" stroke-width="2.4" transform="rotate(12 122 40)"/><ellipse cx="122" cy="30" rx="4.5" ry="17" fill="#F7C8D8" transform="rotate(12 122 40)"/></g>',d:'<g><ellipse cx="46" cy="8" rx="7" ry="18" fill="#FFFDF8" stroke="#E4D6EC" stroke-width="2" transform="rotate(-12 46 18)"/><ellipse cx="46" cy="10" rx="3" ry="11" fill="#F7C8D8" transform="rotate(-12 46 18)"/><ellipse cx="74" cy="8" rx="7" ry="18" fill="#FFFDF8" stroke="#E4D6EC" stroke-width="2" transform="rotate(12 74 18)"/><ellipse cx="74" cy="10" rx="3" ry="11" fill="#F7C8D8" transform="rotate(12 74 18)"/></g>'},
 berryhat:{n:'딸기 모자',slot:'head',pid:'mb-wear-berry',b:'<g transform="translate(100 38)"><path d="M-30 12 Q-30 -22 0 -24 Q30 -22 30 12 Z" fill="#F28AA0" stroke="#DE6B86" stroke-width="2.4"/><path d="M-12 -24 Q0 -34 12 -24 Q6 -20 0 -22 Q-6 -20 -12 -24Z" fill="#8CC48C" stroke="#6AAE5E" stroke-width="1.6"/><circle cx="-14" cy="-4" r="1.8" fill="#FFF6E0"/><circle cx="8" cy="-10" r="1.8" fill="#FFF6E0"/><circle cx="16" cy="4" r="1.8" fill="#FFF6E0"/><circle cx="-4" cy="6" r="1.8" fill="#FFF6E0"/></g>',d:'<g transform="translate(60 22)"><path d="M-22 8 Q-22 -16 0 -18 Q22 -16 22 8 Z" fill="#F28AA0" stroke="#DE6B86" stroke-width="2"/><path d="M-8 -18 Q0 -25 8 -18Z" fill="#8CC48C"/><circle cx="-9" cy="-4" r="1.4" fill="#FFF6E0"/><circle cx="7" cy="-7" r="1.4" fill="#FFF6E0"/><circle cx="11" cy="3" r="1.4" fill="#FFF6E0"/></g>'},
 scarf:{n:'목도리',slot:'neck',pid:'mb-wear-scarf',b:'<g><path d="M48 132 Q100 150 152 132 Q154 142 150 148 Q100 164 50 148 Q46 142 48 132Z" fill="#F4C27A" stroke="#D89A3A" stroke-width="2.4" stroke-linejoin="round"/><path d="M128 146 Q134 166 128 180 L114 178 Q118 162 114 150Z" fill="#F4C27A" stroke="#D89A3A" stroke-width="2.4" stroke-linejoin="round"/><path d="M70 146 v6 M86 150 v6 M102 151 v6" stroke="#FFF1C2" stroke-width="2.4" stroke-linecap="round"/></g>',d:'<g><path d="M24 76 Q60 90 96 76 Q98 84 95 88 Q60 100 25 88 Q22 84 24 76Z" fill="#F4C27A" stroke="#D89A3A" stroke-width="2"/><path d="M78 86 Q82 98 78 104 L69 103 Q72 94 69 88Z" fill="#F4C27A" stroke="#D89A3A" stroke-width="2"/></g>'}
};

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
    {n:'수국',mean:'진심',word:'차분한 마음이 오늘을 지켜줄 거야',act:'하늘 한 번 올려다보기',color:'#8EA8E0',cname:'✿',time:'✿',item:'파란 펜',e:'✿'},
    {n:'빈카',mean:'즐거운 추억',word:'작게 웃었던 순간을 놓치지 마',act:'사진 한 장 남기기',color:'#B8A0E8',cname:'✿',time:'✿',item:'작은 리본',e:'✿'},
    {n:'라벤더',mean:'기다림',word:'서두르지 않아도 도착할 거야',act:'따뜻한 차 한 잔 마시기',color:'#B0A0D8',cname:'✿',time:'✿',item:'포근한 담요',e:'✿'},
    {n:'벚꽃',mean:'설렘',season:'spring',word:'짧아서 더 소중한 순간이 있어',act:'평소보다 천천히 걷기',color:'#F7C8D8',cname:'✿',time:'✿',item:'분홍 머리핀',e:'✿'},
    {n:'튤립',mean:'사랑의 고백',season:'spring',word:'마음을 표현해도 괜찮은 날이야',act:'좋아하는 사람에게 한마디 하기',color:'#E85A78',cname:'✿',time:'✿',item:'빨간 리본',e:'✿'},
    {n:'프리지아',mean:'새로운 시작',season:'spring',word:'오늘부터 다시 시작해도 늦지 않아',act:'미뤄둔 일 하나 시작하기',color:'#F5D06B',cname:'✿',time:'✿',item:'노란 클립',e:'✿'},
    {n:'해바라기',mean:'당신만 바라봐',season:'summer',word:'오늘은 네 편이 많은 날이야',act:'고마운 사람에게 인사하기',color:'#F5C86B',cname:'✿',time:'✿',item:'노란 머리끈',e:'✿'},
    {n:'나팔꽃',mean:'기쁜 소식',season:'summer',word:'아침에 온 소식이 하루를 바꿀지도',act:'미뤄둔 답장 하나 하기',color:'#7E9AD8',cname:'✿',time:'✿',item:'하늘색 포스트잇',e:'✿'},
    {n:'능소화',mean:'그리움',season:'summer',word:'담장 너머로도 마음은 닿아',act:'보고 싶은 사람에게 안부 한 줄 보내기',color:'#F0965A',cname:'✿',time:'✿',item:'주황 리본',e:'✿'},
    {n:'코스모스',mean:'소녀의 순정',season:'fall',word:'바람에 흔들려도 뿌리는 그대로야',act:'산책하며 하늘 사진 찍기',color:'#F0A8B8',cname:'✿',time:'✿',item:'코스모스 압화',e:'✿'},
    {n:'국화',mean:'고결한 마음',season:'fall',word:'차분히 정리해도 괜찮은 계절이야',act:'방 한 켠 정리하기',color:'#F0DCA6',cname:'✿',time:'✿',item:'아이보리 리본',e:'✿'},
    {n:'동백',mean:'그대를 누구보다 사랑합니다',season:'winter',word:'추울수록 마음은 더 진해져',act:'따뜻한 곳에서 좋아하는 사람 생각하기',color:'#E85A6A',cname:'✿',time:'✿',item:'빨간 장갑',e:'✿'},
    {n:'설강화',mean:'희망',season:'winter',word:'가장 추운 날에도 피는 꽃이 있어',act:'오늘 하루 버틴 나 칭찬하기',color:'#DFF0FB',cname:'✿',time:'✿',item:'하얀 리본',e:'✿'},
    {n:'개나리',mean:'희망찬 봄',season:'spring',word:'노란 봄이 골목마다 번지고 있어',act:'창문 활짝 열어 환기하기',color:'#F5D84E',cname:'✿',time:'✿',item:'노란 손수건',e:'✿'},
    {n:'목련',mean:'고귀함',season:'spring',word:'천천히 피어도 결국 가장 크게 피어',act:'거울 보며 나에게 칭찬 한마디',color:'#F7EFE8',cname:'✿',time:'✿',item:'하얀 손거울',e:'✿'},
    {n:'라일락',mean:'첫사랑의 추억',season:'spring',word:'향기처럼 은은히 남는 마음이 있어',act:'좋아하는 향 맡아보기',color:'#C8A8E0',cname:'✿',time:'✿',item:'보라 향주머니',e:'✿'},
    {n:'수선화',mean:'자기애',season:'spring',word:'나를 아끼는 것부터가 시작이야',act:'나에게 작은 선물 하기',color:'#F5E06B',cname:'✿',time:'✿',item:'노란 거울',e:'✿'},
    {n:'장미',mean:'열정',season:'summer',word:'하고 싶은 게 있다면 오늘 시작해',act:'미뤄둔 도전 하나 적기',color:'#E0405A',cname:'✿',time:'✿',item:'빨간 노트',e:'✿'},
    {n:'수련',mean:'맑은 마음',season:'summer',word:'흐린 물 위에도 맑게 피는 꽃이 있어',act:'물 한 잔 천천히 마시기',color:'#F0B8D0',cname:'✿',time:'✿',item:'유리컵',e:'✿'},
    {n:'라넌큘러스',mean:'매력',season:'spring',word:'너만의 결이 제일 예뻐',act:'좋아하는 옷 입기',color:'#F5A0B8',cname:'✿',time:'✿',item:'분홍 브로치',e:'✿'},
    {n:'무궁화',mean:'끈기',season:'summer',word:'피고 지고 또 피는 게 진짜 강함이야',act:'포기하려던 것 한 번 더 시도',color:'#D888B8',cname:'✿',time:'✿',item:'분홍 배지',e:'✿'},
    {n:'맨드라미',mean:'변치 않는 사랑',season:'summer',word:'뜨거운 여름에도 곁을 지키는 마음',act:'오래된 친구에게 안부 전하기',color:'#D0405A',cname:'✿',time:'✿',item:'빨간 실',e:'✿'},
    {n:'단풍(꽃잎)',mean:'소중한 추억',season:'fall',word:'물드는 건 시간을 잘 보냈다는 증거야',act:'낙엽 하나 주워 책갈피 하기',color:'#E07A4E',cname:'✿',time:'✿',item:'단풍 압화',e:'✿'},
    {n:'억새',mean:'평온',season:'fall',word:'바람에 몸을 맡기면 편해지는 것도 있어',act:'바람 부는 곳에서 눈 감기',color:'#E8DCC0',cname:'✿',time:'✿',item:'마른 갈대',e:'✿'},
    {n:'구절초',mean:'순수',season:'fall',word:'꾸미지 않아도 충분히 예뻐',act:'민낯으로 산책하기',color:'#FBFAF6',cname:'✿',time:'✿',item:'흰 손수건',e:'✿'},
    {n:'단풍제비꽃',mean:'성실',season:'fall',word:'작은 걸 꾸준히 한 사람이 멀리 가',act:'오늘 할 일 하나 끝까지',color:'#9868C0',cname:'✿',time:'✿',item:'보라 클립',e:'✿'},
    {n:'포인세티아',mean:'축복',season:'winter',word:'네가 있는 이 계절이 누군가껜 선물이야',act:'고마운 사람에게 카드 쓰기',color:'#D0304A',cname:'✿',time:'✿',item:'빨간 봉투',e:'✿'},
    {n:'수정목',mean:'맑은 겨울',season:'winter',word:'얼어붙은 날에도 반짝이는 게 있어',act:'유리창 닦고 밖 보기',color:'#CFE8F0',cname:'✿',time:'✿',item:'유리구슬',e:'✿'},
    {n:'시클라멘',mean:'수줍음',season:'winter',word:'조용한 마음도 분명히 전해져',act:'좋아하는 사람 몰래 챙기기',color:'#E06A98',cname:'✿',time:'✿',item:'분홍 편지지',e:'✿'},
    {n:'납매',mean:'자애',season:'winter',word:'추위 속 가장 먼저 향을 내는 꽃이야',act:'따뜻한 말 한마디 건네기',color:'#F5D86B',cname:'✿',time:'✿',item:'노란 향초',e:'✿'},
    {n:'목련',mean:'고귀',season:'spring',word:'높은 곳에서 먼저 피는 용기가 있어',act:'하고 싶은 걸 먼저 시작하기',color:'#FCEEF8',cname:'✿',time:'✿',item:'큰 꽃잎',e:'✿'},
    {n:'매화',mean:'인내',season:'winter',word:'추위를 견딘 꽃이 제일 먼저 피어',act:'어려운 일 하나 해치우기',color:'#F0A0B8',cname:'✿',time:'✿',item:'매화 가지',e:'✿'},
    {n:'작약',mean:'수줍음',season:'spring',word:'부끄러워도 괜찮아, 천천히 피면 돼',act:'오늘 한 가지 솔직해지기',color:'#F0B8C8',cname:'✿',time:'✿',item:'분홍 리본',e:'✿'},
    {n:'모란',mean:'부귀',season:'spring',word:'네 안에 숨은 화려함을 믿어',act:'평소 안 입는 색 도전하기',color:'#D8487A',cname:'✿',time:'✿',item:'비단 조각',e:'✿'},
    {n:'달리아',mean:'감사',season:'summer',word:'고마운 건 말로 하면 더 따뜻해',act:'감사 인사 한 번 더 하기',color:'#E86040',cname:'✿',time:'✿',item:'주황 봉투',e:'✿'},
    {n:'팬지',mean:'나를 생각해',season:'spring',word:'누군가 지금 널 떠올리고 있어',act:'오랜 친구에게 연락하기',color:'#6850A0',cname:'✿',time:'✿',item:'보라 편지',e:'✿'},
    {n:'금잔화',mean:'이별의 슬픔',season:'summer',word:'끝이 있어야 새 시작도 와',act:'놓아줄 것 하나 정하기',color:'#F0A840',cname:'✿',time:'✿',item:'금빛 잎',e:'✿'},
    {n:'안개꽃',mean:'영원한 사랑',season:'spring',word:'작은 것들이 모여 큰 감동이 돼',act:'소소한 일 하나 즐기기',color:'#FAFAFE',cname:'✿',time:'✿',item:'흰 안개',e:'✿'},
    {n:'리시안셔스',mean:'우아',season:'summer',word:'우아함은 마음에서 나와',act:'천천히 차 한 잔 마시기',color:'#D0A8E8',cname:'✿',time:'✿',item:'라벤더 향',e:'✿'},
    {n:'카네이션',mean:'사랑',season:'spring',word:'가장 가까운 사람에게 마음을 전해봐',act:'부모님께 안부 전하기',color:'#E85070',cname:'✿',time:'✿',item:'빨간 카네이션',e:'✿'},
    {n:'가시나무꽃',mean:'견고한 사랑',season:'summer',word:'가시가 있어도 아름다운 꽃이야',act:'힘든 일도 긍정적으로 보기',color:'#90C860',cname:'✿',time:'✿',item:'작은 가시',e:'✿'},
    {n:'자스민',mean:'사랑스러움',season:'summer',word:'향기로 마음을 전하는 꽃이야',act:'좋아하는 향수 뿌리기',color:'#FFF8E0',cname:'✿',time:'✿',item:'향기 주머니',e:'✿'},
    {n:'클레마티스',mean:'아름다운 마음',season:'spring',word:'덩굴처럼 조금씩 뻗어가면 돼',act:'새로운 취미 탐색하기',color:'#7868C0',cname:'✿',time:'✿',item:'보라 줄',e:'✿'},
    {n:'동백나무',mean:'겸손',season:'winter',word:'조용히 피어도 모두가 알아봐',act:'묵묵히 할 일 하기',color:'#D83050',cname:'✿',time:'✿',item:'동백 잎',e:'✿'},
    {n:'데이지',mean:'희망',season:'spring',word:'작은 꽃 하나가 들판을 밝혀',act:'오늘의 좋았던 것 하나 적기',color:'#FFF8E0',cname:'✿',time:'✿',item:'노란 단추',e:'✿'},
    {n:'백일홍',mean:'우정',season:'summer',word:'오래 함께할 친구 같은 꽃이야',act:'친구에게 "잘 지내?" 보내기',color:'#E06888',cname:'✿',time:'✿',item:'분홍 구슬',e:'✿'},
    {n:'접시꽃',mean:'단순한 사랑',season:'summer',word:'솔직한 마음이 제일 예뻐',act:'하고 싶은 말 그냥 하기',color:'#E85088',cname:'✿',time:'✿',item:'큰 접시',e:'✿'},
    {n:'마가렛',mean:'진실된 사랑',season:'spring',word:'꾸미지 않아도 진심은 전해져',act:'거짓 없이 하루 보내기',color:'#FFF0D0',cname:'✿',time:'✿',item:'흰 꽃잎',e:'✿'},
    {n:'봉선화',mean:'나를 건드리지 마',season:'summer',word:'가끔은 나만의 공간이 필요해',act:'혼자만의 시간 30분 갖기',color:'#F06080',cname:'✿',time:'✿',item:'빨간 물감',e:'✿'},
    {n:'패랭이꽃',mean:'사랑을 담아',season:'summer',word:'작지만 선명한 색이 눈에 들어와',act:'작은 선물 하나 준비하기',color:'#E84868',cname:'✿',time:'✿',item:'무늬 천',e:'✿'},
    {n:'물망초',mean:'나를 잊지 마',season:'spring',word:'작은 기억 하나가 평생 가기도 해',act:'오늘의 순간 하나 기록하기',color:'#7090E0',cname:'✿',time:'✿',item:'파란 구슬',e:'✿'},
    {n:'붓꽃',mean:'좋은 소식',season:'spring',word:'좋은 일은 예고 없이 찾아와',act:'기대하는 마음 갖기',color:'#7050A8',cname:'✿',time:'✿',item:'보라 붓',e:'✿'},
    {n:'산수유',mean:'영원불변',season:'spring',word:'변하지 않는 마음이 있어',act:'변하지 않을 다짐 하나',color:'#F0C830',cname:'✿',time:'✿',item:'노란 열매',e:'✿'},
    {n:'개나리',mean:'기대',season:'spring',word:'봄이 오는 첫 신호야',act:'올해 하고 싶은 일 하나 정하기',color:'#F8D040',cname:'✿',time:'✿',item:'노란 가지',e:'✿'},
    {n:'진달래',mean:'사랑의 기쁨',season:'spring',word:'산 가득 피어 봄을 알려줘',act:'밖에 나가서 봄바람 느끼기',color:'#E880A0',cname:'✿',time:'✿',item:'분홍 꽃잎',e:'✿'},
    {n:'무궁화',mean:'영원',season:'summer',word:'매일 새로 피는 꽃이야',act:'매일 새로 시작하는 마음 갖기',color:'#D860A0',cname:'✿',time:'✿',item:'무궁화 배지',e:'✿'},
    {n:'란타나',mean:'엄격',season:'summer',word:'규칙 안에서도 아름다움이 있어',act:'오늘 계획 지켜보기',color:'#F0A030',cname:'✿',time:'✿',item:'알록달록 구슬',e:'✿'},
    {n:'수련',mean:'순결',season:'summer',word:'고요한 물 위에서 빛나는 꽃이야',act:'조용히 명상 5분 하기',color:'#F8D0E0',cname:'✿',time:'✿',item:'연잎',e:'✿'},
    {n:'매발톱꽃',mean:'승리',season:'spring',word:'이기는 것보다 끝까지 하는 게 중요해',act:'시작한 일 마무리하기',color:'#5868C8',cname:'✿',time:'✿',item:'파란 종',e:'✿'},
  ],
  rare:[
    {n:'달빛초',mean:'조용한 위로',word:'밤이 길어도 달은 떠 있어',act:'자기 전에 창밖 보기',color:'#C8D8F7',cname:'✧',time:'✧',item:'은색 클립',e:'✧',rare:true},
    {n:'소원꽃',mean:'이루어질 마음',word:'말하면 조금씩 가까워져',act:'소원 하나 적어두기',color:'#F7B8D2',cname:'✧',time:'✧',item:'별 스티커',e:'✧',rare:true},
    {n:'새벽별꽃',mean:'어둠 끝의 빛',word:'제일 캄캄할 때가 새벽 직전이야',act:'내일의 나에게 한 줄 남기기',color:'#8EA8E0',cname:'✧',time:'✧',item:'하늘색 실',e:'✧',rare:true},
    {n:'구름솜꽃',mean:'포근한 하루',word:'오늘은 폭신하게 지나갈 거야',act:'담요 덮고 5분 쉬기',color:'#EFEDF2',cname:'✧',time:'✧',item:'솜인형',e:'✧',rare:true},
    {n:'유성민들레',mean:'멀리 닿는 소원',word:'후— 불면, 소원이 별처럼 날아가',act:'작은 소원 하나 말해보기',color:'#F2E39E',cname:'유성 금빛',time:'밤 9시',item:'작은 별 배지',e:'',rare:true},
    {n:'은하수국',mean:'끝없는 마음',word:'네 마음은 생각보다 훨씬 넓어',act:'밤하늘 오래 바라보기',color:'#9AB0E8',cname:'✧',time:'✧',item:'은하 스티커',e:'✧',rare:true},
    {n:'오로라꽃',mean:'기적',word:'드물게 오는 좋은 날이 오늘일지도',act:'행운을 믿고 하나 도전하기',color:'#8EE0C8',cname:'오로라 민트',time:'새벽 3시',item:'무지개 실',e:'',rare:true},
    {n:'별무리안개꽃',mean:'영원한 약속',word:'작은 별들이 모여 큰 약속이 돼',act:'스스로와 약속 하나 하기',color:'#F0EAF8',cname:'✧',time:'✧',item:'작은 별 다발',e:'✧',rare:true},
    {n:'혜성백합',mean:'단 한 번의 만남',word:'스치는 인연도 다 이유가 있어',act:'오늘 만난 사람 이름 기억하기',color:'#C8D0F0',cname:'✧',time:'✧',item:'꼬리별 배지',e:'✧',rare:true},
    {n:'달무리장미',mean:'포근한 밤',word:'달이 너를 감싸는 밤이야',act:'따뜻하게 이불 덮고 자기',color:'#E8C0D8',cname:'✧',time:'✧',item:'달 모양 핀',e:'✧',rare:true},
    {n:'새벽안개초',mean:'새 출발',word:'안개가 걷히면 길이 보여',act:'내일 계획 한 줄 적기',color:'#DCEAE8',cname:'✧',time:'✧',item:'회색 노트',e:'✧',rare:true},
  ],
};
const ALLF=FLOWERS.common.concat(FLOWERS.rare);
var B=window.PLANON_UX_BRIDGE;if(!B)return;
function E(){return window.PLANON_MARKET_THEME;}
var PID='meonbyeol-theme';
var BASE={name:'몽글 기본빛',soft:'#F4F2F7',deep:'#DCD8E4',rib:'#B8B0C8'};
var ALLT=[BASE].concat(TINTS_SRC);
var SALON_PRICE=30,SALON_LEMON=10;
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function S(){return B.state();}
function tk(){return B.todayKey();}
function pad(n){return String(n).padStart(2,'0');}
function st(){var s=S();s.settings=s.settings||{};var m=s.settings.meonbyeol;if(!m||typeof m!=='object')m=s.settings.meonbyeol={};
  if(typeof m.stars!=='number')m.stars=0;if(!Array.isArray(m.tints))m.tints=[0];if(typeof m.tint!=='number')m.tint=0;
  if(!Array.isArray(m.dex))m.dex=[];if(!Array.isArray(m.candies))m.candies=[];if(!m.wake)m.wake={streak:0,last:''};if(typeof m.todoTheme!=='boolean')m.todoTheme=true;
  if(typeof m.lemons!=='number')m.lemons=0;if(!Array.isArray(m.pouch))m.pouch=[];if(!Array.isArray(m.album))m.album=[];if(!m.pack||typeof m.pack!=='object')m.pack={};if(typeof m.avatar!=='boolean')m.avatar=true;if(m.pokaChar!=='dol')m.pokaChar='byeol';if(!Array.isArray(m.byeols))m.byeols=[];if(typeof m.cur!=='number')m.cur=0;if(typeof m.eggs!=='number')m.eggs=0;if(!m.wear||typeof m.wear!=='object')m.wear={on:{},got:[]};
  if(!m.hatched&&!m.byeols.length&&(m.tints.length>1||m.tint>0)){m.tints.filter(function(i){return i>0;}).forEach(function(i){m.byeols.push({id:'legacy'+i,tint:i,at:m.lastVisit||''});});if(!m.byeols.length)m.byeols.push({id:'legacy0',tint:m.tint,at:''});m.cur=Math.max(0,m.byeols.findIndex(function(b){return b.tint===m.tint;}));m.hatched=true;}
  if(m.byeols.length&&m.byeols[m.cur])m.tint=m.byeols[m.cur].tint;
  if(!m.daily||typeof m.daily!=='object'||Array.isArray(m.daily))m.daily={};
  if(m.day&&m.day.key&&m.day.key!==tk())m.daily[m.day.key]={water:Number(m.day.water||0),wake:!!m.day.wake,tuck:!!m.day.tuck,allDone:!!m.day.allDone,close:!!m.day.close};
  if(!m.day||m.day.key!==tk())m.day={key:tk(),todo:[],allDone:false,close:false,wake:false,water:0,tuck:false,snack:0,flower:null,lemon:0,rub:0};
  if(typeof m.day.lemon!=='number')m.day.lemon=0;
  if(!m.lastVisit)m.lastVisit=tk();return m;}
function isOn(){try{var e=E();if(!e)return false;var ov=e.previewOverride&&e.previewOverride();if(ov&&(ov.meonbyeol===PID||ov.meonbyeol==='meondol-theme'))return true;var m=e.state(),a=m&&m.active&&m.active.meonbyeol;if(a!==PID&&a!=='meondol-theme')return false;var p=e.product(a);return !!(p&&(e.owned(p)||(e.trialActive&&e.trialActive(a==='meondol-theme'?'meondol':'meonbyeol'))));}catch(x){return false;}}
function toast(t){try{B.toast(t,2200);}catch(e){}}
function addStars(n,why){var m=st();m.stars+=n;B.save();toast('별 +'+n+(why?' · '+why:''));refreshPills();}

/* ---------- 캐릭터 테마: 먼별 테마 <-> 먼돌 테마 (한 번에 하나) ---------- */
var DOL_PID='meondol-theme';
function activeId(){try{var e=E();var ov=e.previewOverride&&e.previewOverride();if(ov&&ov.meonbyeol)return ov.meonbyeol;var m=e.state();return m&&m.active&&m.active.meonbyeol||'';}catch(x){return '';}}
function charType(){return activeId()===DOL_PID?'dol':'byeol';}
function charName(){return charType()==='dol'?'먼돌이':'먼별이';}
function charShort(){return charType()==='dol'?'먼돌':'먼별';}
function trialKeyOf(id){return id===DOL_PID?'meondol':'meonbyeol';}
/* ---------- 표정: 자동 / 직접 선택 ---------- */
var FLASH={e:'',until:0};
function flash(e,ms){FLASH={e:e,until:Date.now()+(ms||6000)};try{paintHero();refreshFaces();}catch(x){}}
function faceCfg(){var m=st();if(!m.face||typeof m.face!=='object')m.face={mode:'auto',manual:'normal'};return m.face;}
function autoExpr(){if(FLASH.until>Date.now())return FLASH.e;var h=hourNow(),p=dayProgress(),s=S(),k=tk();
  var over=(s.todos||[]).filter(function(t){return t&&!t.done&&t.scope==='day'&&t.key<k;}).length;
  var closed=(s.dayCloses||[]).some(function(c){return c&&(c.key||c.date)===k;});
  if(closed||(p.n>=1&&p.d===p.n))return 'proud';
  /* 밤 10시부터는 먼별/먼돌 모두 하루 진행률보다 '졸림'을 우선해요. */
  if(h>=22||h<5)return 'sleepy';
  if(over>=3||(p.n>=4&&p.d===0&&h>=18))return 'sad';
  return 'normal';}
function curExpr(){var f=faceCfg();return f.mode==='manual'?(f.manual||'normal'):autoExpr();}
/* 집중 화면: 시작·진행=집중+안경 / 멈춤·휴식=졸림 / 완주=뿌듯 / 짧게 끝=활짝 */
function exprFor(ctx,phase){var f=faceCfg();if(f.mode==='manual')return f.manual||'normal';
  if(ctx==='focus')return phase==='work'?'focus':(phase==='paused'||phase==='brk')?'sleepy':phase==='done'?'proud':phase==='short'?'smile':'normal';
  if(ctx==='story')return 'shy';if(ctx==='gift')return 'surprised';return autoExpr();}
function wearing(){var m=st(),w=m.wear||{};var on=w.on||{};return Object.keys(on).map(function(k){return on[k];}).filter(function(g){return GEAR[g]&&gearOwned(g);});}
function charSVG(expr,o){o=o||{};var gl=o.noGear?[]:wearing();if(charType()==='dol')return dolSVG({expr:expr||curExpr(),headphone:!!o.headphone,gearList:gl});return byeolSVG(o.id||'mbc',curTint(),{plain:true,expr:expr||curExpr(),scene:o.scene||null,dusty:!!o.dusty,dustLevel:o.dustLevel||0,tucked:!!o.tucked,gearList:gl});}
function refreshFaces(){var hs=document.querySelectorAll('.mbx-char[data-auto="1"]');hs.forEach(function(el){el.innerHTML=charSVG(curExpr());});}

/* ---------- 옷장 ---------- */
function gearOwned(g){var x=GEAR[g];if(!x)return false;if(x.pid){try{var e=E();return !!e.owned(e.product(x.pid));}catch(er){return false;}}var m=st();return (m.wear&&m.wear.got||[]).indexOf(g)>=0;}
function wardrobeHTML(){var m=st();m.wear=m.wear||{on:{},got:[]};var on=m.wear.on||{};
  return '<div class="mb-wardrobe">'+Object.keys(GEAR).map(function(g){var x=GEAR[g],own=gearOwned(g),wear=on[x.slot]===g;
    var price=x.pid?(function(){try{return '₩'+Number(E().product(x.pid).price).toLocaleString('ko-KR');}catch(e){return '';}})():x.cost.star?icoStar(11)+x.cost.star:icoLemon(11)+x.cost.lemon;
    var prev=charType()==='dol'?dolSVG({expr:'normal',gearList:[g]}):byeolSVG('mbW'+g,curTint(),{plain:true,expr:'normal',gearList:[g]});
    return '<button class="mb-gear'+(wear?' on':'')+(own?'':' locked')+'" data-mb="gear" data-g="'+g+'">'+prev+'<b>'+esc(x.n)+'</b><small>'+(wear?'입는 중':own?'입기':price)+'</small></button>';}).join('')+'</div>';}
function gearTap(g){var m=st(),x=GEAR[g];if(!x)return;m.wear=m.wear||{on:{},got:[]};m.wear.on=m.wear.on||{};m.wear.got=m.wear.got||[];
  if(gearOwned(g)){if(m.wear.on[x.slot]===g){delete m.wear.on[x.slot];say(x.n+' 벗었어.');}else{m.wear.on[x.slot]=g;say(x.n+' 어때? 잘 어울려?');flash('shy',3500);}B.save();pop();paintHero();drawCards();return;}
  if(x.pid){try{window.PLANON_SHOP.openProduct(x.pid);}catch(e){}return;}
  if(x.cost.star){if(m.stars<x.cost.star){say('별이 '+(x.cost.star-m.stars)+'개 모자라. 할 일 하나씩 반짝! 하면 금방이야.');return;}m.stars-=x.cost.star;}
  else if(x.cost.lemon){if(m.lemons<x.cost.lemon){say('레몬사탕이 '+(x.cost.lemon-m.lemons)+'개 모자라. 하루 세 개씩 모아보자!');return;}m.lemons-=x.cost.lemon;}
  m.wear.got.push(g);m.wear.on[x.slot]=g;B.save();chime();flash('surprised',2500);say(x.n+' 받았다! 바로 입어볼게.');paintHero();drawCards();}

/* ---------- 알에서 태어나기 (20문항) ---------- */
var QUIZ_QS=[
  ['갑자기 두 시간이 비었어.',['미뤄둔 걸 하나 끝낸다','일단 쉬고 본다','친구한테 연락한다','새로운 걸 찾아본다']],
  ['할 일이 산더미면?',['쉬운 것부터','계획부터 정리','냅다 하나 시작','누가 같이하면 잘함']],
  ['칭찬을 들으면?',['티 안 내고 좋아함','엄청 신남','왜 잘했는지 분석','친구한테 바로 말함']],
  ['집중이 깨졌을 때?',['다시 바로 시작','잠깐 쉬고 복귀','장소를 바꿈','다른 일부터 처리']],
  ['좋아하는 하루는?',['계획대로 된 날','뜻밖의 일이 있던 날','친구와 많이 웃은 날','혼자 푹 몰입한 날']],
  ['새 앱을 켜면?',['기능부터 눌러봄','디자인부터 봄','설정부터 맞춤','친구 기능부터 봄']],
  ['마감이 멀면?',['미리 조금씩','마지막에 몰입','중간중간 생각날 때','친구랑 약속 잡고']],
  ['실수했을 때?',['바로 고침','웃고 넘김','원인부터 봄','누군가에게 말함']],
  ['선물 받는다면?',['실용적인 것','귀여운 것','희귀한 것','함께 하는 경험']],
  ['밤 11시, 할 일 하나 남음.',['끝내고 잔다','내일 한다','10분만 해본다','친구에게 같이 하자 함']],
  ['여행 스타일은?',['동선 완벽','발길 가는 대로','사진 많이','한 곳 오래']],
  ['방 정리는?',['매일 조금씩','몰아서','필요할 때만','예쁘게 꾸미며']],
  ['친구 스토리가 궁금하면?',['내 일부터 끝냄','한 개만 하고 봄','참기 힘듦','답장할 생각부터']],
  ['수집할 때 끌리는 건?',['완성도','희귀도','추억','귀여움']],
  ['비 오는 날엔?',['할 일 하기 좋은 날','창밖 멍때리기','빗소리 틀고 공부','우산 쓰고 친구 만나기']],
  ['필기할 때 나는?',['깔끔하게 정리','스티커로 꾸미기','요약만 핵심','친구랑 나눠 쓰기']],
  ['아침에 일어나면?',['오늘 할 일 확인','이불 속 5분 더','날씨부터 봄','메시지 답장']],
  ['제일 좋아하는 간식은?',['든든한 김밥','달콤한 푸딩','상큼한 레몬사탕','나눠 먹는 과자']],
  ['힘든 날 나를 달래는 법?',['할 일 하나 끝내기','노래 듣기','일기 쓰기','친구랑 수다']],
  ['오늘의 나에게 한마디.',['하나씩 하자','재밌게 하자','괜찮아','일단 시작!']]
];
var TINT_CLUSTERS=[['버터쿠키빛','코코아빛','고구마빛','옥수수빛','단풍라떼빛'],['솜사탕빛','포도우유빛','우유푸딩빛','딸기라떼빛','귤빛'],['민트초코빛','녹차라떼빛','박하사탕빛','눈사람빛'],['사이다빛','복숭아우유빛','캔디케인빛','수박빛','체리빛']];
function tintFromScore(sc){var top=0,i;for(i=1;i<4;i++)if(sc[i]>sc[top])top=i;var cl=TINT_CLUSTERS[top],sec=-1,mx=-1;for(i=0;i<4;i++){if(i===top)continue;if(sc[i]>mx){mx=sc[i];sec=i;}}var name=cl[(Math.max(0,sec)+sc[top])%cl.length];for(i=0;i<ALLT.length;i++)if(ALLT[i].name===name)return i;return 1;}
function eggSVG(cls){var sp='';return '<svg class="mb-egg '+(cls||'')+'" viewBox="0 0 120 150" aria-hidden="true"><ellipse cx="60" cy="140" rx="36" ry="6" fill="#DCCDF2" opacity=".55"/><path d="M60 8 C92 8 108 62 108 90 C108 120 86 138 60 138 C34 138 12 120 12 90 C12 62 28 8 60 8Z" fill="#FFFDF8" stroke="#DCCDF2" stroke-width="3"/><path d="M26 74 q10 -8 20 0 t20 0 t20 0 t20 0" stroke="#F7C8D8" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/><path d="'+starPath(44,48,6)+'" fill="#FFE9A8"/><path d="'+starPath(80,100,5)+'" fill="#DCCDF2"/><path d="'+starPath(72,36,3.5)+'" fill="#F7C8D8"/><ellipse cx="42" cy="36" rx="8" ry="13" fill="#fff" opacity=".7" transform="rotate(20 42 36)"/><path class="mb-crack" d="M22 86 l12 -8 8 10 10 -12 9 11 10 -10 9 9 12 -8" stroke="#B8A0DC" stroke-width="2.6" fill="none" stroke-linejoin="round" stroke-linecap="round"/></svg>';}
function eggView(){var m=st(),first=!m.hatched;return '<div class="mb-wrap"><section class="mb-hero mb-egghero"><p class="mb-egg-t">'+(first?'먼별이 알이 도착했어':'새 알이 도착했어')+'</p>'+eggSVG('wob')+'<p class="mb-egg-s">질문 20개에 답해주면<br>너랑 닮은 빛깔의 먼별이가 태어나.</p><button class="mb-big mb-egg-btn" data-mb="quiz">알 따뜻하게 품기</button><small class="mb-egg-note">한 번 태어난 먼별이의 빛깔은 바꿀 수 없어. 다른 빛깔 먼별을 만나려면 새 알(₩9,900)이 필요해.</small></section></div>';}
function openQuiz(){var ans=[],qi=0,ov=document.createElement('div');ov.className='mb-sheet-ov mb-quiz-ov';document.body.appendChild(ov);
  function paint(){var q=QUIZ_QS[qi];ov.innerHTML='<div class="mb-sheet mb-quiz"><div class="mb-quiz-top"><button data-q="back"'+(qi?'':' disabled')+' aria-label="이전">‹</button><span>'+(qi+1)+' / '+QUIZ_QS.length+'</span><button data-q="x" aria-label="닫기">✕</button></div><div class="mb-quiz-bar"><i style="width:'+((qi)/QUIZ_QS.length*100)+'%"></i></div>'+eggSVG('mini'+(qi%2?' wob':''))+'<h3>'+esc(q[0])+'</h3><div class="mb-quiz-opts">'+q[1].map(function(o,i){return '<button data-q="a" data-i="'+i+'" class="'+(ans[qi]===i?'on':'')+'">'+esc(o)+'</button>';}).join('')+'</div></div>';}
  paint();ov.addEventListener('click',function(e){var b=e.target.closest('[data-q]');if(!b)return;var k=b.dataset.q;
    if(k==='x'){if(confirm('지금 그만두면 처음부터 다시 답해야 해. 그만둘까?'))ov.remove();return;}
    if(k==='back'&&qi>0){qi--;paint();return;}
    if(k==='a'){ans[qi]=Number(b.dataset.i);tone(620+qi*18,0,.08,.03,'triangle');if(qi<QUIZ_QS.length-1){qi++;setTimeout(paint,120);}else{ov.remove();hatch(ans);}}});}
function hatch(ans){var m=st(),sc=[0,0,0,0];ans.forEach(function(a){if(a>=0&&a<4)sc[a]++;});var ti=tintFromScore(sc),t=ALLT[ti];
  var ov=document.createElement('div');ov.className='mb-sheet-ov mb-hatch-ov';ov.innerHTML='<div class="mb-sheet mb-hatch"><p class="mb-draw-t">톡… 톡톡…</p><div class="mb-hatch-stage" id="mb-hatch-stage">'+eggSVG('shake')+'</div><p class="mb-draw-name" id="mb-hatch-name">&nbsp;</p><button class="mb-big" id="mb-hatch-ok" disabled>잠깐만…</button></div>';document.body.appendChild(ov);
  [0,500,1000,1500].forEach(function(t0,i){setTimeout(function(){tone(420+i*80,0,.1,.04,'triangle');},t0);});
  setTimeout(function(){var stg=document.getElementById('mb-hatch-stage');if(stg){stg.innerHTML=byeolSVG('mbHatch',t,{plain:true,expr:'surprised'})+'<i class="mb-shell l"></i><i class="mb-shell r"></i>';stg.classList.add('mb-reveal');}chime();
    var id='b'+Date.now().toString(36);m.byeols.push({id:id,tint:ti,at:tk(),quiz:sc});m.cur=m.byeols.length-1;m.tint=ti;if(m.tints.indexOf(ti)<0)m.tints.push(ti);if(m.hatched)m.eggs=Math.max(0,(m.eggs||0)-1);m.hatched=true;B.save();
    var nm=document.getElementById('mb-hatch-name');if(nm)nm.innerHTML='<b>'+esc(t.name)+'</b> 먼별이가 태어났어!';var ok=document.getElementById('mb-hatch-ok');if(ok){ok.disabled=false;ok.textContent='안녕, 반가워!';ok.onclick=function(){ov.remove();UI.line='';say('안녕! 나는 '+t.name+' 먼별이야. 너랑 닮았대!');flash('smile',5000);try{B.render(true);}catch(x){}};}
    setTimeout(function(){var s2=document.getElementById('mb-hatch-stage');if(s2){s2.firstChild&&(s2.querySelector('svg').outerHTML=byeolSVG('mbHatch',t,{plain:true,expr:'smile'}));}},1400);},2000);}
function familyHTML(){var m=st();if(m.byeols.length<2)return '';return '<section class="mb-card"><h3>우리 집 먼별들</h3><p class="mb-sub">알에서 태어난 먼별이들이야. 빛깔은 바꿀 수 없지만, 같이 지낼 먼별이는 고를 수 있어.</p><div class="mb-family">'+m.byeols.map(function(b,i){var t=ALLT[b.tint]||BASE;return '<button class="mb-tint'+(m.cur===i?' on':'')+'" data-mb="family" data-i="'+i+'">'+byeolSVG('mbF'+i,t,{plain:true,expr:m.cur===i?'smile':'normal'})+'<b>'+esc(t.name)+'</b><small>'+(m.cur===i?'함께 있는 중':'불러오기')+'</small></button>';}).join('')+'</div></section>';}
function facesHTML(){var f=faceCfg();return '<div class="mb-faces"><div class="mb-seg"><button data-mb="facemode" data-v="auto" class="'+(f.mode!=='manual'?'on':'')+'">자동</button><button data-mb="facemode" data-v="manual" class="'+(f.mode==='manual'?'on':'')+'">직접 선택</button></div>'+(f.mode==='manual'?'<div class="mb-facechips">'+EXPRS.map(function(x){return '<button data-mb="face" data-v="'+x[0]+'" class="'+(f.manual===x[0]?'on':'')+'">'+x[1]+'</button>';}).join('')+'</div>':'<small class="mb-face-auto">지금은 <b>'+(EXPRS.find(function(x){return x[0]===autoExpr();})||['','기본'])[1]+'</b> · 할 일·마감·시간에 따라 바뀌어</small>')+'</div>';}

/* ---------- 소리 ---------- */
var AC=null,AMB={name:null,ivs:[]};
function ac(){try{if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(C)AC=new C();}if(AC&&AC.state!=='running')AC.resume();}catch(e){}return AC;}
document.addEventListener('pointerdown',function(){if(isOn())ac();},{passive:true,capture:true});
function tone(f,t0,dur,vol,type){if(typeof AMB==='undefined'||(AMB.name!=='song'&&AMB.name!=='orgel'))return;var a=ac();if(!a)return;var o=a.createOscillator(),g=a.createGain(),t=a.currentTime+t0;o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.05);}
function vocal(f,t0,dur){if(typeof AMB==='undefined'||AMB.name!=='song')return;var a=ac();if(!a)return;var o=a.createOscillator(),g=a.createGain(),fl=a.createBiquadFilter(),t=a.currentTime+t0;fl.type='lowpass';fl.frequency.value=1600;o.type='sawtooth';o.frequency.setValueAtTime(f*.75,t);o.frequency.exponentialRampToValueAtTime(f,t+.07);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.045,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+dur+.08);o.connect(fl);fl.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.12);}
function pop(){}
function babble(){}
function chime(){}
function snore(){}
function sip(){}
function stopAmb(){AMB.ivs.forEach(clearInterval);AMB={name:null,ivs:[]};}
function startAmb(name){stopAmb();AMB.name=name;
  if(name==='tea'){var teaTimer=setTimeout(function(){if(AMB.name==='tea'){stopAmb();paintHero();}},15000);AMB.ivs.push(teaTimer);return;}
  if(name!=='orgel'&&name!=='song'){return;}
  if(!ac()){AMB.name=null;return;}
  if(name==='orgel'){var MEL=[784,659,587,523,587,659,784,880,784,659,523,587,659,587,523,0];var bar=function(){if(AMB.name!=='orgel')return;MEL.forEach(function(f,i){if(f){tone(f,i*.36,1.1,.05,'sine');tone(f*3,i*.36,.4,.01,'sine');}});};bar();AMB.ivs.push(setInterval(bar,MEL.length*360));}
  else if(name==='song'){var CH=[[261.6,329.6,392],[220,261.6,329.6],[174.6,220,261.6],[196,246.9,293.7]],VM=[523,587,659,523,587,659,784,659,523,587,494,440,392,440,523,0];var bar2=function(){if(AMB.name!=='song')return;CH.forEach(function(ch,b){ch.forEach(function(f,i){tone(f,b*1.44+i*.04,.9,.03,'triangle');tone(f,b*1.44+.72+i*.04,.6,.024,'triangle');});});VM.forEach(function(f,i){if(f)vocal(f,i*.36,.3);});};bar2();AMB.ivs.push(setInterval(bar2,5760));}
}

/* ---------- 먼별 상태 ---------- */
var UI={happy:false,tucked:false,line:'',lastLine:'',snack:null,drink:null,find:null,previewTint:null,act:''};
var SVGN=0;
function daysAway(){var m=st(),a=B.parseKey(m.lastVisit),b=B.parseKey(tk());return Math.round((b-a)/864e5);}
function curTint(){var m=st(),i=UI.previewTint!=null?UI.previewTint:m.tint;return ALLT[i]||BASE;}
function byeolSVG(id,tint,o){o=o||{};var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 200 200');svg.id=(id||'mb')+'_'+(++SVGN);try{renderByeol(svg,{tint:tint||BASE,acc:'none',eye:o.eye||'line',happy:!!o.happy,tucked:!!o.tucked,dusty:!!o.dusty,dustLevel:o.dustLevel||0,gear:null,plain:!!o.plain,baby:!!o.baby,scene:o.scene||null,expr:o.expr||'',gearList:o.gearList||null});}catch(e){}return svg.outerHTML;}
function icoStar(sz){sz=sz||14;return '<svg class="mb-ico" viewBox="0 0 20 20" width="'+sz+'" height="'+sz+'" aria-hidden="true"><path d="'+starPath(10,10.6,8.6)+'" fill="#FFE08A" stroke="#E8B84A" stroke-width="1.4" stroke-linejoin="round"/></svg>';}
function icoLemon(sz){sz=sz||14;return '<svg class="mb-ico" viewBox="0 0 20 20" width="'+sz+'" height="'+sz+'" aria-hidden="true"><ellipse cx="10" cy="11" rx="7.4" ry="5.8" fill="#FFE97A" stroke="#E0C23C" stroke-width="1.4" transform="rotate(-20 10 11)"/><path d="M13 5.2q3-3 5.2-1" stroke="#8CC48C" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M6.2 10q2-3 5-3" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".85"/></svg>';}
function pills(){var m=st();return icoStar(15)+'<b>'+m.stars+'</b><i></i>'+icoLemon(15)+'<b>'+m.lemons+'</b>';}
function refreshPills(){var p=document.getElementById('mb-starpill');if(p)p.innerHTML=pills();}
function mbAct(cls,ms){var el=document.getElementById('mb-byeol');if(!el)return;UI.act=cls;el.className='';void el.offsetWidth;if(cls)el.classList.add(cls);if(ms)setTimeout(function(){if(UI.act===cls){UI.act='';var e2=document.getElementById('mb-byeol');if(e2)e2.className='';}},ms);}
function paintHero(){var box=document.getElementById('mb-byeol');if(!box)return;var away=UI.away||0;var man=faceCfg().mode==='manual',ex=man?curExpr():UI.find?'surprised':(UI.snack||UI.happy||AMB.name==='song')?'smile':curExpr();if(UI.tucked&&charType()==='byeol'&&!man)box.innerHTML=byeolSVG('mbMain',curTint(),{plain:true,tucked:true,gearList:wearing()});else box.innerHTML=charSVG(UI.tucked&&!man?'sleepy':ex,{id:'mbMain',dusty:away>=3,dustLevel:away>=14?7:away>=7?4:away>=3?2:0});if(UI.act&&!box.classList.contains(UI.act))box.classList.add(UI.act);
  var ex=document.getElementById('mb-extra');if(ex)ex.innerHTML=UI.find?findSVG(UI.find,46):UI.snack?candySVG(UI.snack.c,40):UI.drink?cupSVG(UI.drink.c):AMB.name==='song'||AMB.name==='orgel'?'<span class="mb-notes"><svg viewBox="0 0 40 24" width="46" height="28"><path d="M6 18q-4 0-4-3t4-3q2 0 3 1V3l9-2v12" fill="none" stroke="#B090DC" stroke-width="2.2" stroke-linecap="round"/><circle cx="6" cy="15" r="3" fill="#DCCDF2"/><path d="M26 20q-3 0-3-2.5t3-2.5q1.5 0 2.3.8V6l8-1.6v10" fill="none" stroke="#E79ABA" stroke-width="2" stroke-linecap="round"/></svg></span>':'';
  var b=document.getElementById('mb-bubble');if(b&&UI.line)b.textContent=UI.line;
  var sb=document.getElementById('mb-stopamb');if(sb)sb.style.display=AMB.name?'':'none';}
function say(t){UI.line=t;UI.lastLine=t;var b=document.getElementById('mb-bubble');if(b){b.textContent=t;b.classList.remove('mb-pop');void b.offsetWidth;b.classList.add('mb-pop');}babble();}
function hourNow(){return new Date().getHours();}
function dayProgress(){var k=tk(),s=S(),td=(s.todos||[]).filter(function(t){return t.scope==='day'&&t.key===k;});return {n:td.length,d:td.filter(function(t){return t.done;}).length};}
function focusToday(){var s=S();return Number(s.focus&&s.focus[tk()]||0);}
function talkLine(){var h=hourNow(),p=dayProgress(),m=st(),fm=focusToday(),L=[];
  if(h>=5&&h<11)L.push('좋은 아침! 오늘 제일 먼저 할 일 하나만 정해볼까?','하암… 나도 방금 일어났어. 같이 기지개 켜자.','아침 햇살에 별가루가 반짝반짝해.');
  else if(h<17)L.push('점심은 먹었어? 배고프면 집중이 안 돼.','지금 이 시간이 제일 졸린 시간이래. 물 한 잔!','구름이 느릿느릿 가네. 우리도 천천히 가자.');
  else if(h<21)L.push('노을 봤어? 오늘 하늘 예뻤대.','저녁엔 조금 느슨해져도 괜찮아.','오늘 하루 어땠어? 한 줄만 들려줘.');
  else L.push('오늘도 수고 많았어. 나 재워줄래?','밤하늘에 오늘의 별이 떴을까?','이불 속이 제일 포근한 시간이야.');
  if(p.n&&p.d===p.n)L.push('오늘 할 일 다 했잖아!! 복복복~ 대단해.','별사탕이 '+p.d+'개나 반짝여. 오늘 하늘 부자다!');
  else if(p.n&&p.d)L.push(p.d+'개나 별사탕으로 반짝였어. '+(p.n-p.d)+'개만 더 빛내보자!');
  else if(p.n)L.push('아직 흐린 별사탕이 '+p.n+'개 있어… 하나만 톡! 해볼래?');
  else L.push('오늘 할 일은 아직 없네. 작은 거 하나 적어볼까?');
  if(m.day.wake)L.push('오늘 기상 인증했지! 아침의 너, 멋졌어.');
  if(fm>=60)L.push('오늘 벌써 '+Math.floor(fm/60)+'시간 넘게 집중했어. 어깨 한 번 쭉!');else if(fm>0)L.push('오늘 '+fm+'분 집중했네. 나도 옆에서 봤어.');
  if(m.day.flower)L.push('오늘의 꽃은 '+m.day.flower.n+'. 꽃말은 "'+m.day.flower.mean+'"래.');
  if(m.lemons>=10)L.push('레몬사탕 '+m.lemons+'개! 미용실에서 빛깔 바꿀 수 있겠다.');
  L.push('뽀롱?','나 오늘 네잎클로버 찾으러 갔다가 도토리만 주웠어.','너랑 있으면 별가루가 반짝반짝해져.','별 '+m.stars+'개 모았네! 미용실 가볼까?','나를 살살 문질러주면 기분이 몽글몽글해져.');
  var pool=L.filter(function(x){return x!==UI.lastLine;});return pool[Math.floor(Math.random()*pool.length)]||L[0];}

/* ---------- 레몬사탕(하루 3개) · 주운 것 ---------- */
var FINDS=[
 {n:'노랑말랑 꼬치',k:'skewer',c:['#FFE27A','#FFE27A','#FFE27A'],line:'노랑말랑 꼬치 발견! 노랗고 말랑해.',w:5},
 {n:'떡꼬치',k:'skewer',c:['#F4A98A','#F4A98A','#F4A98A'],line:'떡꼬치가 하나 남아 있었어! 달콤짭짤.',w:6},
 {n:'별사탕 꼬치',k:'skewer',c:['#F7B6C8','#C9B2EC','#BDEBD8'],line:'별사탕 꼬치 주웠어! 먹기 아까워.',w:5},
 {n:'세잎클로버',k:'clover3',line:'평범한 세잎클로버지만… 귀엽잖아.',w:6},
 {n:'네잎클로버',k:'clover4',line:'네잎클로버…!! 오늘 운 좋은 날이다.',w:1},
 {n:'도토리',k:'acorn',line:'반들반들한 도토리 주웠어. 너 가질래?',w:5},
 {n:'별가루',k:'dust',line:'길에서 반짝이는 별가루를 주웠어!',w:4,stars:2}
];
function findSVG(f,sz){sz=sz||40;var k=f.k,body='';
  if(k==='skewer'){var c=f.c||['#FFE27A','#FFE27A','#FFE27A'];body='<path d="M8 36 L34 6" stroke="#C9A87E" stroke-width="2.4" stroke-linecap="round"/>'+[[14,29],[20,22],[26,15]].map(function(p,i){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5.6" fill="'+c[i]+'" stroke="#C9A98A" stroke-width="1.3"/><circle cx="'+(p[0]-1.8)+'" cy="'+(p[1]-1.8)+'" r="1.4" fill="#fff" opacity=".8"/>';}).join('');}
  else if(k==='clover3'||k==='clover4'){var n=k==='clover4'?4:3;for(var i=0;i<n;i++){body+='<ellipse cx="20" cy="12" rx="6" ry="7.5" fill="#9AD08C" stroke="#6AAE5E" stroke-width="1.3" transform="rotate('+(i*360/n)+' 20 19)"/>';}body+='<path d="M20 20q2 10 -3 16" stroke="#6AAE5E" stroke-width="2" fill="none" stroke-linecap="round"/>';}
  else if(k==='acorn'){body='<ellipse cx="20" cy="24" rx="9" ry="10" fill="#D9A46A" stroke="#B07A44" stroke-width="1.5"/><path d="M10 18q10-10 20 0z" fill="#9C7048" stroke="#7E5634" stroke-width="1.4"/><path d="M20 10v-4" stroke="#7E5634" stroke-width="2" stroke-linecap="round"/><ellipse cx="16" cy="23" rx="2" ry="3.5" fill="#fff" opacity=".35"/>';}
  else{body='<path d="'+starPath(14,16,8)+'" fill="#FFE08A" stroke="#E8B84A" stroke-width="1.2"/><path d="'+starPath(28,26,6)+'" fill="#FFF1C2" stroke="#E8C66A" stroke-width="1.1"/><circle cx="30" cy="11" r="1.6" fill="#FFE9A8"/><circle cx="10" cy="31" r="1.3" fill="#FFE9A8"/>';}
  return '<svg viewBox="0 0 40 40" width="'+sz+'" height="'+sz+'" aria-hidden="true">'+body+'</svg>';}
function findItem(){flash('surprised',3500);var tot=FINDS.reduce(function(a,f){return a+f.w;},0),r=Math.random()*tot,f=FINDS[0];for(var i=0;i<FINDS.length;i++){r-=FINDS[i].w;if(r<=0){f=FINDS[i];break;}}
  var m=st();UI.find=f;UI.happy=true;say(f.line);chime();
  if(f.stars){addStars(f.stars,'주운 별가루');}else{m.pouch.push({n:f.n,at:tk()});if(m.pouch.length>60)m.pouch=m.pouch.slice(-60);B.save();}
  paintHero();setTimeout(function(){UI.find=null;UI.happy=false;paintHero();},3200);drawCards();}
function giveLemon(){var m=st();if(m.day.lemon>=3){say('오늘 레몬사탕은 세 개 다 줬어! 내일 또 줄게.');return;}
  flash('surprised',2600);m.day.lemon++;m.lemons++;UI.snack={c:'#FFE27A'};UI.happy=true;say(['찌릿! 번개 레몬사탕이야. 기운이 번쩍 난대.','새콤달콤 레몬사탕 하나 더! 오늘 두 개째야.','마지막 레몬사탕! 오늘 세 개 다 모았다.'][m.day.lemon-1]);chime();B.save();refreshPills();paintHero();
  setTimeout(function(){UI.snack=null;UI.happy=false;paintHero();if(Math.random()<.3)setTimeout(findItem,300);},2600);drawCards();}
function candySVG(c,sz){sz=sz||44;return '<svg viewBox="0 0 60 40" width="'+sz*1.5+'" height="'+sz+'"><path d="M14 20 L3 11 L5 29 Z" fill="'+c+'" stroke="#C9A98A" stroke-width="1.5" stroke-linejoin="round"/><path d="M46 20 L57 11 L55 29 Z" fill="'+c+'" stroke="#C9A98A" stroke-width="1.5" stroke-linejoin="round"/><circle cx="30" cy="20" r="14" fill="'+c+'" stroke="#C9A98A" stroke-width="1.8"/><path d="M22 14 q6 -5 14 0" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/></svg>';}
function cupSVG(c){return '<svg viewBox="0 0 50 50" width="46" height="46"><path d="M10 16 h26 l-3 24 q-1 4 -5 4 h-10 q-4 0 -5 -4 z" fill="#FFFDF8" stroke="#C9A98A" stroke-width="2"/><path d="M12 22 h22 l-2 16 q-1 3 -4 3 h-10 q-3 0 -4 -3 z" fill="'+c+'"/><path d="M36 22 q8 0 7 7 q-1 6 -8 6" fill="none" stroke="#C9A98A" stroke-width="2"/><path d="M18 10 q-3 -4 0 -7 M26 10 q-3 -4 0 -7" stroke="#D8CFC4" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>';}

/* ---------- 오늘의 꽃 = 포토카드 ---------- */
function pokaCharSVG(c){return charSVG('smile');}

function flowerSVG(color,sz){var p='';for(var i=0;i<6;i++){p+='<ellipse cx="30" cy="16" rx="8" ry="13" fill="'+color+'" stroke="#fff" stroke-width="1.2" opacity=".95" transform="rotate('+(i*60)+' 30 30)"/>';}return '<svg viewBox="0 0 60 80" width="'+(sz||60)+'" height="'+((sz||60)*1.33)+'"><path d="M30 44 Q28 62 30 78" stroke="#8CC48C" stroke-width="3" fill="none"/><path d="M30 62 q-12 -6 -14 -14 q10 2 14 14" fill="#B8DCA0"/>'+p+'<circle cx="30" cy="30" r="7" fill="#FFE9A8" stroke="#E8CD7A" stroke-width="1.5"/></svg>';}
function season(){var mo=new Date().getMonth()+1;return mo>=3&&mo<=5?'spring':mo<=8&&mo>=6?'summer':mo>=9&&mo<=11?'fall':'winter';}
function pickFlower(){var rare=Math.random()<.15,pool=rare?FLOWERS.rare:FLOWERS.common;if(!rare){var se=pool.filter(function(x){return x.season===season();}),yr=pool.filter(function(x){return !x.season;});pool=se.length&&Math.random()<.6?se:(yr.length?yr:pool);}return pool[Math.floor(Math.random()*pool.length)];}
function flowerByName(n){for(var i=0;i<ALLF.length;i++)if(ALLF[i].n===n)return ALLF[i];return null;}
function mdLabel(k){var d=B.parseKey(k);return (d.getMonth()+1)+'.'+pad(d.getDate());}
function pokaHTML(f,k,no,mini,ch){ch=charType();var tag=f.rare?'별꽃':f.season?'계절의 꽃':'';var sp='';for(var i=0;i<(mini?3:7);i++){var x=(rnd(no*31+i*7)*84+6).toFixed(0),y=(rnd(no*17+i*11)*60+6).toFixed(0);sp+='<i style="left:'+x+'%;top:'+y+'%;animation-delay:'+(i*.4).toFixed(1)+'s"></i>';}
  var front='<div class="mb-poka-face mb-poka-front"><div class="mb-poka-photo">'+sp+flowerSVG(f.color,mini?34:90)+'<span class="mb-poka-char c-'+ch+'">'+pokaCharSVG(ch)+'</span></div><div class="mb-poka-cap"><b>'+esc(f.n)+'</b><small>'+esc(f.mean)+'</small></div><span class="mb-poka-no">No.'+pad(no)+'</span><span class="mb-poka-date">'+esc(mdLabel(k))+'</span>'+(tag?'<span class="mb-poka-tag">'+tag+'</span>':'')+'</div>';
  if(mini)return '<div class="mb-poka mini'+(f.rare?' rare':'')+'" style="--fc:'+esc(f.color)+'" data-mb="pokaview" data-k="'+esc(k)+'" data-n="'+esc(f.n)+'" data-no="'+no+'">'+front+'</div>';
  var back='<div class="mb-poka-face mb-poka-back"><b>오늘의 한 줄</b><p>"'+esc(f.word)+'"</p><ul><li><span>행운 행동</span>'+esc(f.act)+'</li><li><span>행운 색</span>'+esc(f.cname)+'</li><li><span>행운 시간</span>'+esc(f.time)+'</li><li><span>오늘의 소품</span>'+esc(f.item)+'</li></ul><div class="mb-poka-stamp">'+pokaCharSVG(ch)+'<small>'+(ch==='dol'?'먼돌이랑 찍은 꽃':'먼별이 골라온 꽃')+'</small></div></div>';
  return '<div class="mb-poka-wrap"><div class="mb-poka'+(f.rare?' rare':f.season?' season':'')+'" style="--fc:'+esc(f.color)+'" data-mb="flip">'+front+back+'</div><small class="mb-poka-hint">카드를 톡 누르면 뒷면이 보여</small></div>';}
function albumHTML(){var m=st(),a=m.album.slice().reverse();if(!a.length)return '';return '<div class="mb-album"><div class="mb-album-h"><b>포카 앨범</b><small>'+m.album.length+'장 · 도감 '+m.dex.length+'/'+ALLF.length+'</small></div><div class="mb-album-strip">'+a.slice(0,14).map(function(x,i){var f=flowerByName(x.n);return f?pokaHTML(f,x.k,m.album.length-i,true,x.c):'';}).join('')+'</div></div>';}
function openPoka(n,k,no){var f=flowerByName(n);if(!f)return;var ov=document.createElement('div');ov.className='mb-sheet-ov';ov.innerHTML='<div class="mb-sheet mb-poka-sheet">'+pokaHTML(f,k,Number(no)||1,false,(st().album.find(function(x){return x.k===k&&x.n===n;})||{}).c)+'<button class="mb-sheet-close" data-mb-close>닫기</button></div>';document.body.appendChild(ov);ov.addEventListener('click',function(e){if(e.target===ov||e.target.closest('[data-mb-close]'))ov.remove();var c=e.target.closest('.mb-poka');if(c&&!e.target.closest('[data-mb-close]'))c.classList.toggle('flip');});}

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

var ICON={
 song:'<svg viewBox="0 0 40 40"><path d="M10 30 q-6 0 -6 -5 q0 -5 6 -5 q4 0 5 2 V6 l14 -3 v18" fill="none" stroke="#B090DC" stroke-width="2.6" stroke-linecap="round"/><circle cx="10" cy="25" r="5" fill="#DCCDF2"/><circle cx="24" cy="22" r="5" fill="#DCCDF2" stroke="#B090DC" stroke-width="2"/></svg>',
 orgel:'<svg viewBox="0 0 40 40"><rect x="6" y="16" width="28" height="18" rx="4" fill="#FCE3C8" stroke="#D8A860" stroke-width="2"/><path d="M6 20 Q20 6 34 20" fill="#F6D6BC" stroke="#D8A860" stroke-width="2"/><circle cx="20" cy="25" r="3" fill="#E8CD7A"/><path d="M34 26 h4" stroke="#D8A860" stroke-width="2.4" stroke-linecap="round"/></svg>',
 tuck:'<svg viewBox="0 0 40 40"><path d="M4 26 q16 -8 32 0 v8 h-32 z" fill="#C8B8E8" stroke="#A894D0" stroke-width="2"/><circle cx="12" cy="20" r="5" fill="#FFFDF8" stroke="#DCD8E4" stroke-width="2"/><text x="26" y="16" font-size="9" fill="#8E7BA8">z z</text></svg>',
 snack:'<svg viewBox="0 0 40 40"><path d="M20 8 q9 1 7 12 q-3 9 -7 9 q-4 0 -7 -9 q-2 -11 7 -12z" fill="#F28AA0" stroke="#DE6B86" stroke-width="2"/><path d="M20 8 q-5 -5 -9 -3 M20 8 q5 -5 9 -3" stroke="#8CC48C" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="17" cy="16" r="1.2" fill="#fff"/><circle cx="23" cy="20" r="1.2" fill="#fff"/></svg>',
 tea:'<svg viewBox="0 0 40 40"><path d="M8 14 h20 l-2 18 q-1 3 -4 3 h-8 q-3 0 -4 -3z" fill="#FFFDF8" stroke="#C9A98A" stroke-width="2"/><path d="M10 19 h16 l-1 12 h-14z" fill="#E8C4A8"/><path d="M28 18 q7 0 6 6 q-1 5 -7 5" fill="none" stroke="#C9A98A" stroke-width="2"/></svg>',
 star:'<svg viewBox="0 0 40 40"><rect x="3" y="3" width="34" height="34" rx="9" fill="#2E2A60"/><path d="'+starPath(20,20,9)+'" fill="#FFE9A8"/><circle cx="9" cy="10" r="1.3" fill="#fff"/><circle cx="31" cy="30" r="1.1" fill="#fff"/><circle cx="30" cy="9" r="1" fill="#fff"/></svg>'
};
/* ---------- 뷰 ---------- */
function trialBar(){var e=E();if(!e||!e.trialActive||!e.trialActive('meonbyeol'))return '';var p=e.product(PID);if(e.owned(p))return '';var t=e.trialInfo('meonbyeol'),ms=Number(t.end)-Date.now(),h=Math.max(1,Math.ceil(ms/36e5));return '<div class="mb-trialbar"><span>무료체험 '+(h>=24?Math.floor(h/24)+'일 '+(h%24)+'시간':h+'시간')+' 남음 · 데려오면 모은 별·꽃이 그대로 이어져</span><button data-mb="adopt">데려오기</button></div>';}
function view(){var m=st();if(charType()==='byeol'&&!m.hatched)return eggView();if(charType()==='dol'&&!m.dolMet){m.dolMet=true;B.save();UI.line='안녕! 나는 먼돌이야. 데굴데굴 굴러왔어. 같이 지내자.';}UI.away=daysAway();if(UI.away>0&&!UI.greeted){UI.greeted=true;UI.line=UI.away>=14?'왔구나!! 별가루 속에서 손 흔들고 있었어.':UI.away>=7?'으음… 담요 덮고 자고 있었어. 왔구나!':UI.away>=3?'별가루가 좀 흐려졌어. 살살 문질러 줄래?':'왔구나! 보고 싶었어.';}
  if(!UI.line)UI.line=talkLine();
  var h=hourNow(),ph=(h>=6&&h<17)?'day':(h>=17&&h<20)?'dusk':'night';
  return '<div class="mb-wrap">'+trialBar()+
  '<section class="mb-hero mb-'+ph+'"><span class="mb-starpill" id="mb-starpill">'+pills()+'</span><div class="mb-bubble" id="mb-bubble">'+esc(UI.line)+'</div><div class="mb-stage"><div id="mb-byeol" data-mb="talk" aria-label="먼별이 · 누르면 말 걸기, 문지르면 쓰다듬기"></div><div id="mb-extra"></div></div><p class="mb-rubhint" id="mb-rubhint">'+charName()+'를 손가락으로 살살 문질러 봐</p><div class="mb-hero-acts"><button data-mb="talk">말 걸기</button><button data-mb="gift"'+(m.day.lemon>=3?' disabled':'')+'>'+icoLemon(14)+' 레몬사탕 '+m.day.lemon+'/3</button><button id="mb-stopamb" data-mb="stop" style="display:none">소리 끄기</button></div><div id="mb-faces">'+facesHTML()+'</div></section>'+
  '<div id="mb-cards"></div></div>';}
function packCardHTML(){var m=st(),pk=m.pack,h='';
  if(pk.drawPending)h+='<section class="mb-card mb-pack"><div class="mb-pack-pouch">'+pouchSVG()+'</div><div><h3>먼별 하나 뽑기</h3><p class="mb-sub">별사탕 주머니 속에서 먼별이 한 명이 기다리고 있어. 어떤 빛깔일까?</p><button class="mb-big" data-mb="draw">주머니 열어보기</button></div></section>';
  if(pk.picksLeft>0)h+='<section class="mb-card mb-pack"><div class="mb-pack-pouch">'+pouchSVG(true)+'</div><div><h3>빛깔 골라 데려오기</h3><p class="mb-sub">원하는 먼별 빛깔을 '+pk.picksLeft+'가지 더 고를 수 있어.</p><button class="mb-big" data-mb="pick">빛깔 고르러 가기</button></div></section>';
  return h;}
function pouchSVG(open){return '<svg viewBox="0 0 60 60" width="56" height="56" aria-hidden="true"><path d="M14 26q-4 26 16 28q20-2 16-28z" fill="#EDE4F6" stroke="#B8A0DC" stroke-width="2"/><path d="M14 26q16 '+(open?'-10':'6')+' 32 0" fill="none" stroke="#B8A0DC" stroke-width="2"/><path d="M22 22q8-6 16 0" stroke="#E79ABA" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="'+starPath(30,40,6)+'" fill="#FFE08A" stroke="#E8B84A" stroke-width="1.2"/>'+(open?'<path d="'+starPath(22,12,3.5)+'" fill="#FFF1C2"/><path d="'+starPath(40,10,3)+'" fill="#FFF1C2"/>':'')+'</svg>';}
function salonBar(){var m=st(),i=UI.previewTint;if(i==null||m.tints.indexOf(i)>=0)return '';var t=ALLT[i];return '<div class="mb-salon-bar"><span><b>'+esc(t.name)+'</b> 미리보는 중</span><div><button data-mb="buytint" data-pay="star"'+(m.stars<SALON_PRICE?' disabled':'')+'>'+icoStar(13)+' '+SALON_PRICE+'개로 교환</button><button data-mb="buytint" data-pay="lemon"'+(m.lemons<SALON_LEMON?' disabled':'')+'>'+icoLemon(13)+' '+SALON_LEMON+'개로 교환</button><button data-mb="tintcancel">그만 보기</button></div></div>';}
function pouchHTML(){var m=st();if(!m.pouch.length)return '<small class="mb-sub">아직 주운 게 없어. 레몬사탕을 받거나 말을 걸다 보면 먼별이가 뭔가 주워 와.</small>';var cnt={};m.pouch.forEach(function(x){cnt[x.n]=(cnt[x.n]||0)+1;});return '<div class="mb-pouch">'+Object.keys(cnt).map(function(n){var f=FINDS.find(function(x){return x.n===n;});return f?'<span>'+findSVG(f,30)+'<b>'+esc(n)+'</b><small>×'+cnt[n]+'</small></span>':'';}).join('')+'</div>';}
var GACHA_COST=5;
var GACHA_PRIZES=[
  {n:'민트초코 조각',k:'민트 조각'},{n:'반딧불 숲',k:'배경 조각'},{n:'달 호수',k:'배경 조각'},
  {n:'오로라꽃',k:'희귀 꽃'},{n:'별가루 병',k:'방 소품'},{n:'작은 오르골',k:'소리 조각'},
  {n:'기억 포카',k:'포카 조각'},{n:'구름 쿠션',k:'방 소품'}
];
function gachaHTML(){
  var m=st();if(!Array.isArray(m.gachaItems))m.gachaItems=[];
  var recent=m.gachaItems.slice(-6).reverse();
  return '<div class="mb-pack mb-gacha"><div class="mb-pack-pouch">'+pouchSVG(true)+'</div><div><p class="mb-sub">별을 넣으면 투명 캡슐 하나가 톡 나와. 배경 조각·포카·소품 같은 복복복 수집품이 들어 있어.</p><button class="mb-big" data-mb="gacha"'+(m.stars<GACHA_COST?' disabled':'')+'>'+icoStar(13)+' '+GACHA_COST+'개로 한 번 뽑기</button></div></div>'+
    (recent.length?'<div class="mb-pouch">'+recent.map(function(x){return '<span><b>'+esc(x.n)+'</b><small>'+esc(x.k||'수집품')+'</small></span>';}).join('')+'</div>':'<small class="mb-sub">아직 뽑은 캡슐이 없어. 별을 모아서 첫 캡슐을 열어봐.</small>');
}
function drawGacha(){
  var m=st();if(m.stars<GACHA_COST){say('별이 '+(GACHA_COST-m.stars)+'개 모자라. 할 일을 하나씩 반짝이면 금방 모여!');return;}
  m.stars-=GACHA_COST;if(!Array.isArray(m.gachaItems))m.gachaItems=[];
  var p=GACHA_PRIZES[Math.floor(Math.random()*GACHA_PRIZES.length)];
  m.gachaItems.push({n:p.n,k:p.k,at:tk()});if(m.gachaItems.length>120)m.gachaItems=m.gachaItems.slice(-120);
  B.save();flash('surprised',3000);chime();say('캡슐에서 '+p.n+' 나왔어! 표본함에 넣어둘게.');paintHero();drawCards();
}

function drawCards(){var box=document.getElementById('mb-cards');if(!box)return;var m=st(),ws=wakeState(),T=toMin(wakeGoal());
  var wakeBtn=ws==='done'?'<button class="mb-big on" disabled>기상 인증 완료 · 연속 '+m.wake.streak+'일</button>':ws==='open'?'<button class="mb-big" data-mb="wake">일어났어! 기상 인증하기</button>':ws==='early'?'<button class="mb-big" disabled>'+fmtM((T-120+1440)%1440)+'부터 인증할 수 있어</button>':'<button class="mb-big" disabled>오늘 인증 시간은 지났어 · 내일 아침에!</button>';
  var f=m.day.flower,grid=(window.PLANON_FOCUS_MATE&&window.PLANON_FOCUS_MATE.weekGridHTML)?window.PLANON_FOCUS_MATE.weekGridHTML():'';
  box.innerHTML=(charType()==='byeol'&&m.eggs>0?'<section class="mb-card mb-pack"><div class="mb-pack-pouch">'+eggSVG('mini wob')+'</div><div><h3>새 알이 도착했어</h3><p class="mb-sub">질문 20개에 답하면 새 먼별이가 태어나. 지금 먼별이도 계속 같이 지낼 수 있어.</p><button class="mb-big" data-mb="quiz">알 품기</button></div></section>':'')+
  '<section class="mb-card"><h3>'+charShort()+' 챌린지</h3><p class="mb-sub">기상 목표 '+esc(wakeGoal())+' · 목표 2시간 전('+fmtM((T-120+1440)%1440)+')부터 목표 시각까지 인증할 수 있어. 목표 시간은 설정의 기상 목표에서 바꿔.</p>'+wakeBtn+
  '<div class="mb-row"><button data-mb="water"'+(m.day.water>=3?' disabled':'')+'>물 마시기 '+m.day.water+'/3</button><button data-mb="tuckinfo">'+(m.day.tuck?'취침 인증 완료':'취침 인증')+'</button></div><small class="mb-sub">기상 '+icoStar(11)+'3 · 물 3잔 '+icoStar(11)+'1 · 재워주면 취침 인증 '+icoStar(11)+'1 · 안 해도 벌은 없어</small></section>'+
  '<section class="mb-card"><h3>'+charName()+'랑 힐링하기</h3><div class="mb-heal">'+
   [['song','뽀롱옹롱'],['orgel','오르골'],['tuck','재워주기'],['snack','간식 주기'],['tea','차 마시기'],['star','별 보기']].map(function(x){return '<button data-mb="heal" data-v="'+x[0]+'">'+ICON[x[0]]+'<span>'+x[1]+'</span></button>';}).join('')+'</div><small class="mb-sub">쓰다듬기는 버튼 대신 위에서 '+charName()+'를 직접 문질러 줘.</small></section>'+
  '<section class="mb-card"><h3>오늘의 꽃</h3>'+(f?pokaHTML(f,m.day.key,m.album.length||1,false):'<button class="mb-big" data-mb="flower">'+charName()+'가 꽃밭에서 골라올게</button>')+albumHTML()+'</section>'+
  (grid?'<section class="mb-card"><h3>이번 주 집중</h3>'+grid+'</section>':'')+
  '<section class="mb-card"><h3>복복복 별가챠</h3>'+gachaHTML()+'</section>'+
  familyHTML()+'<section class="mb-card"><h3>'+charName()+' 옷장</h3><p class="mb-sub">꽃핀은 별, 리본은 레몬사탕으로 받을 수 있어. 나머지는 Flan:on Shop 옷장 상품이야. 누르면 입고 벗어.</p>'+wardrobeHTML()+'</section>'+
  '<section class="mb-card"><h3>'+charName()+' 주머니</h3>'+pouchHTML()+'</section>';
  refreshPills();}
function mount(){paintHero();drawCards();var m=st();if(m.lastVisit!==tk()){m.lastVisit=tk();B.save();}}

/* ---------- 힐링 ---------- */
var SNACKS=[{n:'딸기',c:'#F28AA0'},{n:'버터쿠키',c:'#F0D48A'},{n:'푸딩',c:'#F6D27A'},{n:'구름 마시멜로',c:'#FFFFFF'},{n:'포도알 젤리',c:'#C9B2EC'},{n:'꿀 호박사탕',c:'#F6C97A'}];
function teaList(){var se=season();return [{n:'딸기우유',c:'#F7C4D2',line:'딸기우유는 차는 아니지만… 오늘은 특별히!'},{n:'코코아',c:'#B98A6A',line:'마시멜로 동동 코코아. 후— 호록.'},{n:'캐모마일',c:'#F3E3A0',line:'캐모마일은 마음을 말랑하게 해준대.'},{n:'보리차',c:'#D9B27A',line:'구수한 보리차. 할머니 집 냄새 나.'},{n:'유자차',c:'#FFD27A',line:'유자차 한 모금이면 목이 사르르 녹아.'},se==='fall'?{n:'고구마라떼',c:'#E9B98E',line:'가을엔 역시 고구마라떼지. 달큰해.'}:se==='winter'?{n:'밀크티',c:'#D8B89A',line:'눈 오는 날엔 밀크티. 손이 따뜻해져.'}:se==='spring'?{n:'벚꽃라떼',c:'#F6CAD6',line:'벚꽃라떼! 한 모금에 봄이 퐁.'}:{n:'복숭아 아이스티',c:'#F4C89A',line:'복숭아 아이스티. 얼음 달그락.'}];}
function openTea(){var ov=document.createElement('div');ov.className='mb-sheet-ov';ov.innerHTML='<div class="mb-sheet"><h3>어떤 차 마실까?</h3><div class="mb-teas">'+teaList().map(function(t,i){return '<button data-tea="'+i+'">'+cupSVG(t.c)+'<span>'+esc(t.n)+'</span></button>';}).join('')+'</div><button class="mb-sheet-close" data-mb-close>다음에</button></div>';document.body.appendChild(ov);
  ov.addEventListener('click',function(e){if(e.target===ov||e.target.closest('[data-mb-close]')){ov.remove();return;}var b=e.target.closest('[data-tea]');if(!b)return;var t=teaList()[Number(b.dataset.tea)];ov.remove();UI.tucked=false;UI.drink=t;startAmb('tea');mbAct('mb-sip',15000);say(t.line);paintHero();});}
function heal(v){var m=st(),h=hourNow();UI.tucked=false;if(v!=='tea')UI.drink=null;
  if(v==='song'){startAmb('song');UI.happy=true;mbAct('mb-sway');say('♪ 뽀롱옹롱~ 뽀로로옹 뽀롱…');}
  else if(v==='orgel'){startAmb('orgel');mbAct('mb-sway-slow');say('별밤 오르골이야. 눈 감고 세 번만 숨 쉬어봐.');}
  else if(v==='tuck'){if(!(h>=21||h<5)){say('아직 안 졸려~ 밤 9시 넘으면 재워줘.');mbAct('mb-shake',600);return;}stopAmb();UI.tucked=true;mbAct('mb-sleep');UI.line='쿨… 쿨… (오늘도 고마웠어)';snore();if(!m.day.tuck){m.day.tuck=true;addStars(1,'취침 인증');}B.save();drawCards();}
  else if(v==='snack'){if(m.day.snack>=2){say('오늘 간식은 두 개나 먹었어. 배불러~ 내일 또 줘.');return;}m.day.snack++;var c=SNACKS[Math.floor(Math.random()*SNACKS.length)];UI.snack={c:c.c};UI.happy=true;mbAct('mb-nom',2600);say('냠냠… '+c.n+' 맛있다!');B.save();setTimeout(function(){UI.snack=null;UI.happy=false;paintHero();if(Math.random()<.3){say('맛있게 먹었어! 답례로 별 하나 줄게.');addStars(1,'먼별의 답례');}},2600);}
  else if(v==='tea'){openTea();return;}
  else if(v==='star'){openStarView();return;}
  paintHero();}
function openStarView(){var ov=document.createElement('div');ov.className='mb-starview';var s='';for(var i=0;i<60;i++)s+='<i style="left:'+(Math.random()*100)+'%;top:'+(Math.random()*70)+'%;animation-delay:'+(Math.random()*3).toFixed(2)+'s"></i>';
  ov.innerHTML='<div class="mb-sv-sky">'+s+'</div><div class="mb-sv-byeol">'+charSVG('shy')+'</div><p class="mb-sv-txt">별똥별이 지나가면 톡 눌러 소원을 빌어봐</p><button class="mb-sv-close">돌아가기</button>';document.body.appendChild(ov);
  var iv=setInterval(function(){var sh=document.createElement('b');sh.className='mb-shoot';sh.style.left=(10+Math.random()*60)+'%';sh.style.top=(5+Math.random()*30)+'%';sh.onclick=function(){chime();ov.querySelector('.mb-sv-txt').textContent='소원 빌었어. 하늘이 기억할 거래.';sh.remove();};ov.appendChild(sh);setTimeout(function(){sh.remove();},2600);},3800);
  ov.querySelector('.mb-sv-close').onclick=function(){clearInterval(iv);stopAmb();ov.remove();paintHero();};}
function wake(){var m=st();if(wakeState()!=='open')return;var k=tk(),s=S(),n=new Date(),hm=pad(n.getHours())+':'+pad(n.getMinutes());s.logs=s.logs||{};var o=s.logs[k]||{};o.wakeGoal=true;if(!o.wake)o.wake=hm;s.logs[k]=o;
  var y=B.dkey(new Date(B.parseKey(k).getTime()-864e5));m.wake.streak=m.wake.last===y?m.wake.streak+1:1;m.wake.last=k;m.day.wake=true;m.daily=m.daily||{};m.daily[k]={water:Number(m.day.water||0),wake:true,tuck:!!m.day.tuck,allDone:!!m.day.allDone,close:!!m.day.close};UI.happy=true;say('일어났구나!! 같이 아침 맞자. 연속 '+m.wake.streak+'일째야!');addStars(3,'기상 인증');chime();drawCards();paintHero();setTimeout(function(){UI.happy=false;paintHero();},3000);}
function tintTap(i){var m=st(),t=ALLT[i];if(!t)return;
  if(m.tints.indexOf(i)>=0){m.tint=i;UI.previewTint=null;B.save();say(t.name+'으로 바꿨어! 어때?');pop();paintHero();drawCards();return;}
  UI.previewTint=i;paintHero();drawCards();say(t.name+' 미리보기야. 마음에 들면 아래에서 교환해.');pop();var hh=document.querySelector('.mb-hero');if(hh)hh.scrollIntoView({behavior:'smooth',block:'start'});}
function buyTint(pay){var m=st(),i=UI.previewTint;if(i==null)return;var t=ALLT[i];if(!t||m.tints.indexOf(i)>=0)return;
  if(pay==='lemon'){if(m.lemons<SALON_LEMON){say('레몬사탕이 '+(SALON_LEMON-m.lemons)+'개 모자라. 하루 세 개씩 모아보자!');return;}m.lemons-=SALON_LEMON;}
  else{if(m.stars<SALON_PRICE){say('별이 '+(SALON_PRICE-m.stars)+'개 모자라. 할 일 하나씩 반짝! 하면 금방이야.');return;}m.stars-=SALON_PRICE;}
  m.tints.push(i);m.tint=i;UI.previewTint=null;B.save();say('짠! '+t.name+' 먼별이 됐어.');chime();paintHero();drawCards();}

/* ---------- 쓰다듬기: 버튼이 아니라 문지르기 ---------- */
var RUB={on:false};
function rubReward(){flash('smile',3000);var m=st(),away=UI.away||0;UI.away=0;UI.happy=true;UI.tucked=false;m.day.rub=(m.day.rub||0)+1;
  var L=away>=3?['복복복~ 흐린 별가루 다 털었다! 반짝반짝해졌어.']:['헤헤, 간지러워~ 복복복!','거기 거기! 조금만 더…','몽글몽글해졌어. 고마워.','너 손 따뜻하다~','뽀롱… 기분 좋아.'];
  say(L[Math.floor(Math.random()*L.length)]);pop();var el=document.getElementById('mb-byeol');if(el)burstAt(el,'mb-heart');mbAct('mb-wiggle',900);paintHero();
  if(m.day.rub===1){addStars(1,'복복 쓰다듬기');}B.save();setTimeout(function(){UI.happy=false;paintHero();},2200);}
document.addEventListener('pointerdown',function(e){var el=e.target.closest&&e.target.closest('#mb-byeol');if(!el||!isOn())return;RUB={on:true,x:e.clientX,y:e.clientY,dist:0,flips:0,dir:0,moved:false,done:false,spark:0,id:e.pointerId};try{el.setPointerCapture(e.pointerId);}catch(x){}},{passive:true});
document.addEventListener('pointermove',function(e){if(!RUB.on||e.pointerId!==RUB.id)return;var dx=e.clientX-RUB.x,dy=e.clientY-RUB.y,d=Math.sqrt(dx*dx+dy*dy);if(d<2)return;RUB.dist+=d;RUB.spark+=d;RUB.x=e.clientX;RUB.y=e.clientY;
  var ax=Math.abs(dx)>=Math.abs(dy)?dx:dy,dir=ax>0?1:-1;if(Math.abs(ax)>2){if(RUB.dir&&dir!==RUB.dir)RUB.flips++;RUB.dir=dir;}
  if(!RUB.moved&&RUB.dist>14){RUB.moved=true;var el=document.getElementById('mb-byeol');if(el)el.classList.add('mb-rubbing');var hn=document.getElementById('mb-rubhint');if(hn)hn.textContent='복복복… 조금만 더!';}
  if(RUB.spark>70){RUB.spark=0;spawnAt(e.clientX,e.clientY);}
  if(!RUB.done&&(RUB.flips>=5||RUB.dist>650)){RUB.done=true;rubReward();}},{passive:true});
function rubEnd(){if(!RUB.on)return;var el=document.getElementById('mb-byeol');if(el)el.classList.remove('mb-rubbing');if(RUB.moved){RUB.suppress=Date.now();var hn=document.getElementById('mb-rubhint');if(hn)hn.textContent=RUB.done?'또 문질러 줘도 좋아':'조금 더 오래 문질러 봐';}RUB.on=false;}
document.addEventListener('pointerup',rubEnd,{passive:true});document.addEventListener('pointercancel',rubEnd,{passive:true});
function spawnAt(x,y){var s=document.createElement('i');s.className='mb-spark mb-heart';s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--dx',((Math.random()-.5)*40)+'px');s.style.setProperty('--dy',(-20-Math.random()*30)+'px');document.body.appendChild(s);setTimeout(function(){s.remove();},700);}

/* ---------- 먼별 데려오기: 하나 뽑기 · 골라 데려오기 ---------- */
function rawOwn(id){try{return !!(E()&&E().rawOwn&&E().rawOwn(id));}catch(e){return false;}}
function reconcilePack(){var m=st(),pk=m.pack,ch=false;
  if(rawOwn('meonbyeol-random')&&!pk.randomGranted){pk.randomGranted=true;pk.drawPending=true;ch=true;}
  if(rawOwn('meonbyeol-pick')&&!pk.pickGranted){pk.pickGranted=true;pk.picksLeft=(pk.picksLeft||0)+3;ch=true;}
  /* 예전(2,900원 시절)에 먼별 테마를 산 사람: 재결제 없이 무료 뽑기 1회 선물 */
  if(rawOwn('meonbyeol-theme')&&!pk.legacyGranted&&!pk.randomGranted&&!pk.pickGranted){pk.legacyGranted=true;pk.drawPending=true;ch=true;}
  if(ch)B.save();}
function unownedTints(){var m=st(),a=[];for(var i=1;i<ALLT.length;i++)if(m.tints.indexOf(i)<0)a.push(i);return a;}
function openDraw(){var m=st();if(!m.pack.drawPending)return;var pool=unownedTints();if(!pool.length){for(var q=1;q<ALLT.length;q++)pool.push(q);}var pick=pool[Math.floor(Math.random()*pool.length)];
  var ov=document.createElement('div');ov.className='mb-sheet-ov mb-draw-ov';ov.innerHTML='<div class="mb-sheet mb-draw"><p class="mb-draw-t">두근두근… 누가 나올까?</p><div class="mb-draw-stage" id="mb-draw-stage">'+byeolSVG('mbDraw',BASE,{plain:true})+'</div><p class="mb-draw-name" id="mb-draw-name">&nbsp;</p><button class="mb-big" id="mb-draw-ok" disabled>잠깐만…</button></div>';document.body.appendChild(ov);
  var n=0,iv=setInterval(function(){var st2=document.getElementById('mb-draw-stage');if(!st2){clearInterval(iv);return;}var r=pool[Math.floor(Math.random()*pool.length)];st2.innerHTML=byeolSVG('mbDraw',ALLT[r],{plain:true});tone(520+(n%5)*90,0,.08,.03,'triangle');if(++n>=16){clearInterval(iv);reveal();}},110);
  function reveal(){var t=ALLT[pick];if(m.tints.indexOf(pick)<0)m.tints.push(pick);m.tint=pick;m.pack.drawPending=false;m.pack.drawn=(m.pack.drawn||0)+1;B.save();var st2=document.getElementById('mb-draw-stage');if(st2){st2.innerHTML=byeolSVG('mbDraw',t,{happy:true,plain:true});st2.classList.add('mb-reveal');}var nm=document.getElementById('mb-draw-name');if(nm)nm.innerHTML='<b>'+esc(t.name)+'</b> 먼별이 나왔어!';chime();var ok=document.getElementById('mb-draw-ok');if(ok){ok.disabled=false;ok.textContent='같이 살자!';ok.onclick=function(){ov.remove();UI.previewTint=null;say('안녕! 나는 '+t.name+' 먼별이야. 잘 부탁해.');paintHero();drawCards();};}}}
function openPick(){var m=st(),left=m.pack.picksLeft||0;if(left<=0)return;var sel=[];var ov=document.createElement('div');ov.className='mb-sheet-ov';
  function paint(){ov.innerHTML='<div class="mb-sheet mb-pick"><h3>데려올 빛깔 고르기</h3><p class="mb-sub">'+left+'가지까지 고를 수 있어 · '+sel.length+'/'+left+'</p><div class="mb-salon">'+ALLT.map(function(t,i){if(i===0)return '';var own=m.tints.indexOf(i)>=0,on=sel.indexOf(i)>=0;return '<button class="mb-tint'+(on?' on':'')+'" data-pk="'+i+'"'+(own?' disabled':'')+'>'+byeolSVG('mbP'+i,t,{plain:true})+'<b>'+esc(t.name)+'</b><small>'+(own?'이미 있어':on?'골랐어':'고르기')+'</small></button>';}).join('')+'</div><div class="mb-sheet-acts"><button class="mb-sheet-close" data-mb-close>나중에</button><button class="mb-big" data-pk-ok'+(sel.length?'':' disabled')+'>'+sel.length+'가지 데려오기</button></div></div>';}
  paint();document.body.appendChild(ov);
  ov.addEventListener('click',function(e){if(e.target===ov||e.target.closest('[data-mb-close]')){ov.remove();return;}var b=e.target.closest('[data-pk]');if(b&&!b.disabled){var i=Number(b.dataset.pk),k=sel.indexOf(i);if(k>=0)sel.splice(k,1);else if(sel.length<left)sel.push(i);pop();paint();return;}
    if(e.target.closest('[data-pk-ok]')&&sel.length){sel.forEach(function(i){if(m.tints.indexOf(i)<0)m.tints.push(i);});m.tint=sel[0];m.pack.picksLeft=Math.max(0,left-sel.length);B.save();ov.remove();chime();say(ALLT[sel[0]].name+' 먼별이 왔어! 미용실에서 언제든 바꿔 입을 수 있어.');paintHero();drawCards();}});}
window.addEventListener('planon-meonbyeol-adopt',function(ev){var d=ev.detail||{};setTimeout(function(){var m=st();if(d.pack==='egg'){m.eggs=(m.eggs||0)+1;B.save();try{B.render(true);}catch(x){}flash('surprised',4000);return;}if(!isOn())return;try{B.render(true);}catch(x){}if(charType()==='byeol'&&!m.hatched)return;say(charType()==='dol'?'안녕! 먼돌이야. 3일 동안 같이 지내보자.':'다시 만나서 반가워!');},250);});

/* ---------- 3일 무료체험 끝 ---------- */
function trialCheck(){var e=E();if(!e||!e.trialInfo)return;var ms=e.state();var a=ms&&ms.active&&ms.active.meonbyeol;if(a!==PID&&a!==DOL_PID)return;var p=e.product(a);if(!p||e.owned(p)||e.trialActive(trialKeyOf(a)))return;
  delete ms.active.meonbyeol;var t=e.trialInfo('meonbyeol'),show=t&&!t.endNoticed;if(t)t.endNoticed=true;B.save();stopAmb();document.documentElement.classList.remove('mbon');try{window.dispatchEvent(new Event('planon-market-change'));}catch(x){}
  if(!show)return;var m=st(),ov=document.createElement('div');ov.className='mb-sheet-ov';ov.innerHTML='<div class="mb-sheet mb-trial-end">'+byeolSVG('mbBye',curTint(),{happy:true,plain:true})+'<h3>3일 동안 같이 있어서 좋았어</h3><p>모은 별 '+m.stars+'개, 꽃 포카 '+m.album.length+'장은 내가 잘 보관하고 있을게. 데려와 주면 그대로 이어서 지낼 수 있어.</p><div class="mb-sheet-acts col"><button class="mb-big" data-go="meonbyeol-random">하나 뽑기로 데려오기</button><button class="mb-big alt" data-go="meonbyeol-pick">골라 데려오기</button><button class="mb-sheet-close" data-mb-close>다음에</button></div></div>';document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){var g=ev.target.closest('[data-go]');if(g){ov.remove();try{window.PLANON_SHOP.openProduct(g.dataset.go);}catch(x){}return;}if(ev.target===ov||ev.target.closest('[data-mb-close]'))ov.remove();});}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-mb]');if(!a||!isOn())return;var act=a.dataset.mb,m=st();
  if(act==='talk'){if(a.id==='mb-byeol'&&RUB.suppress&&Date.now()-RUB.suppress<500)return;UI.tucked=false;UI.happy=Math.random()<.5;say(talkLine());if(Math.random()<.08)setTimeout(findItem,1600);paintHero();}
  else if(act==='dust')rubReward();
  else if(act==='gift')giveLemon();
  else if(act==='stop'){stopAmb();UI.happy=false;UI.drink=null;mbAct('');paintHero();}
  else if(act==='heal')heal(a.dataset.v);
  else if(act==='wake')wake();
  else if(act==='water'){if(m.day.water>=3)return;m.day.water++;m.daily=m.daily||{};m.daily[tk()]={water:Number(m.day.water||0),wake:!!m.day.wake,tuck:!!m.day.tuck,allDone:!!m.day.allDone,close:!!m.day.close};tone(660,0,.15,.04,'triangle');mbAct('mb-sip',900);say(['꿀꺽~ 물 한 잔! 잘했어.','꿀꺽꿀꺽~ 두 잔째!','세 잔 완료!! 몸이 좋아할 거야.'][m.day.water-1]);if(m.day.water===3)addStars(1,'물 3잔');B.save();drawCards();}
  else if(act==='gacha')drawGacha();
  else if(act==='tuckinfo')say(m.day.tuck?'오늘 취침 인증 완료! 포근했지.':'밤 9시 넘어서 힐링하기의 재워주기를 하면 자동으로 체크돼!');
  else if(act==='flower'){if(m.day.flower)return;say('꽃밭에서 고르는 중…');mbAct('mb-wiggle',1200);setTimeout(function(){var f=pickFlower();m.day.flower=f;if(m.dex.indexOf(f.n)<0)m.dex.push(f.n);m.album.push({n:f.n,k:tk(),c:charType()});if(m.album.length>400)m.album=m.album.slice(-400);B.save();drawCards();say(f.rare?'별꽃이야…! 흔치 않은 거야. 포카로 남겨뒀어.':f.word);chime();},1200);}
  else if(act==='pokachar'){m.pokaChar=a.dataset.v==='dol'?'dol':'byeol';var ta=m.album.find(function(x){return x.k===tk();});if(ta)ta.c=m.pokaChar;B.save();pop();drawCards();say(m.pokaChar==='dol'?'먼돌이가 포카에 들어갔어. 헤헤, 수줍어해.':'내가 포카에 들어갈게!');}
  else if(act==='flip'){a.classList.toggle('flip');tone(880,0,.08,.02,'sine');}
  else if(act==='pokaview')openPoka(a.dataset.n,a.dataset.k,a.dataset.no);
  else if(act==='tint')tintTap(Number(a.dataset.i));
  else if(act==='buytint')buyTint(a.dataset.pay);
  else if(act==='tintcancel'){UI.previewTint=null;paintHero();drawCards();say('원래 빛깔로 돌아왔어.');}
  else if(act==='quiz')openQuiz();
  else if(act==='family'){var fi=Number(a.dataset.i);if(m.byeols[fi]){m.cur=fi;m.tint=m.byeols[fi].tint;B.save();say((ALLT[m.tint]||BASE).name+' 먼별이 왔어!');flash('smile',3000);paintHero();drawCards();}}
  else if(act==='gear')gearTap(a.dataset.g);
  else if(act==='facemode'){faceCfg().mode=a.dataset.v==='manual'?'manual':'auto';B.save();var fb=document.getElementById('mb-faces');if(fb)fb.innerHTML=facesHTML();paintHero();}
  else if(act==='face'){var fc=faceCfg();fc.mode='manual';fc.manual=a.dataset.v;B.save();var fb2=document.getElementById('mb-faces');if(fb2)fb2.innerHTML=facesHTML();paintHero();pop();}
  else if(act==='draw')openDraw();
  else if(act==='pick')openPick();
  else if(act==='adopt'){try{window.PLANON_SHOP.openProduct(activeId()||PID);}catch(x){}}
  else if(act==='skyday'){var d=a.dataset.d;say(a.dataset.lit==='1'?d+'일의 별이야. 그날도 반짝였어.':d+'일은 아직 흐린 별이야. 사라지진 않아.');}
});

/* ---------- 할 일: 먼지 → 별사탕 ---------- */
document.addEventListener('click',function(e){if(!isOn())return;var a=e.target.closest&&e.target.closest('[data-act="toggle"],[data-act="toggle-rt"]');if(!a)return;var id=a.dataset.id,rt=a.dataset.act==='toggle-rt',date=a.dataset.date,was=!!(a.closest('.todo')&&a.closest('.todo').classList.contains('done'));
  setTimeout(function(){var sel=rt?'[data-act="toggle-rt"][data-id="'+id+'"][data-date="'+date+'"]':'[data-act="toggle"][data-id="'+id+'"]';var b=document.querySelector(sel);if(was||!b)return;b.classList.add('mb-burst');pop();burstAt(b);
    var m=st(),key=id+(rt?'@'+date:'');flash('smile',5000);if(m.day.todo.indexOf(key)<0&&m.day.todo.length<5){m.day.todo.push(key);addStars(1,'별사탕이 반짝 빛났어');}
    var p=dayProgress();if(p.n>=2&&p.d===p.n&&!m.day.allDone){m.day.allDone=true;flash('proud',8000);addStars(2,'오늘 할 일 전부 복!');}B.save();},60);},false);
function burstAt(el,cls){var r=el.getBoundingClientRect();for(var i=0;i<8;i++){var s=document.createElement('i');s.className='mb-spark'+(cls?' '+cls:'');s.style.left=(r.left+r.width/2)+'px';s.style.top=(r.top+r.height/2)+'px';var a=i/8*Math.PI*2;s.style.setProperty('--dx',(Math.cos(a)*28)+'px');s.style.setProperty('--dy',(Math.sin(a)*28)+'px');document.body.appendChild(s);setTimeout(function(x){return function(){x.remove();};}(s),700);}}
/* 하루 마감 보상 */
function checkClose(){if(!isOn())return;var m=st();if(m.day.close)return;var has=(S().dayCloses||[]).some(function(c){return c&&c.key===tk();});if(has){m.day.close=true;flash('proud',8000);addStars(3,'하루 마감');B.save();}}

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
function navHTML(tabs,cur,pending){var t=tabs.slice();if(!NAVI.__b)NAVI.__b=NAVI.meonbyeol;NAVI.meonbyeol=NAVI.__b;if(charType()==='dol')NAVI.meonbyeol='<svg viewBox="0 0 32 32"><path d="M16 5q9 0 10.5 9q1 8-4.8 10.6q-5.7 2.6-11.4 0Q4.5 22 5.5 14Q7 5 16 5z" fill="#E6E0EE" stroke="#A79BB4" stroke-width="2"/><path d="M11 16h3M18 16h3" stroke="#5E5468" stroke-width="2" stroke-linecap="round"/><circle cx="9.5" cy="19" r="1.5" fill="#F7C8D8"/><circle cx="22.5" cy="19" r="1.5" fill="#F7C8D8"/></svg>';return t.map(function(x){var dot=x[0]==='friends'&&pending>0?'<i class="navdot"></i>':'';return '<button data-act="tab" data-tab="'+x[0]+'" class="mb-nav'+(cur===x[0]?' on':'')+'">'+(NAVI[x[0]]||'')+'<span>'+x[1]+'</span>'+dot+'</button>';}).join('');}

/* ---------- Shop: 미리보기 제거 · 3일 무료체험만 사용 ---------- */
function sync(){trialCheck();var on=isOn(),dol=on&&charType()==='dol',todoOn=on&&st().todoTheme!==false;document.documentElement.classList.toggle('mbon',on);document.documentElement.classList.toggle('mb-dol',dol);document.documentElement.classList.toggle('mb-byeol',on&&!dol);document.documentElement.classList.toggle('mb-todo-off',on&&!todoOn);var u=B.ui();if(!on&&u&&u.tab==='meonbyeol'){u.tab='day';try{B.render(true);}catch(e){}}if(on){checkClose();if(document.getElementById('mb-byeol')&&!document.getElementById('mb-byeol').firstChild)mount();}}
window.addEventListener('planon-market-change',function(){sync();try{var nav=document.getElementById('nav');if(nav)B.render();}catch(e){}});
var mainEl=document.getElementById('main');if(mainEl)new MutationObserver(function(){setTimeout(sync,0);}).observe(mainEl,{childList:true});
window.PLANON_MEONBYEOL={on:isOn,view:function(){setTimeout(mount,0);return view();},nav:navHTML,
  svg:function(id,tint,o){return byeolSVG(id||'mbx',tint||(isOn()?curTint():BASE),o||{});},
  myTint:function(){return curTint();},baseTint:function(){return BASE;},
  state:function(){return st();},say:say,addStars:addStars,icoStar:icoStar,icoLemon:icoLemon,
  openDraw:openDraw,openPick:openPick,starPath:starPath,dolSVG:dolSVG,charSVG:charSVG,charType:charType,charName:charName,exprFor:exprFor,curExpr:curExpr,flash:flash,EXPRS:EXPRS,isHatched:function(){return !!st().hatched;},rubBurst:function(x,y){spawnAt(x,y);},pop:pop,chime:chime};
setTimeout(function(){sync();if(isOn())try{B.render();}catch(e){}},50);
})();
