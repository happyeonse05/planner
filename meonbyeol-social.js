/* 먼별 × 친구/프로필
   원칙: 내가 산 테마는 '내 모습'에만. 친구 화면에는 친구가 직접 고른 모습만 보여요.
   - 내 프로필: 먼별 테마를 켜면 프로필 사진 자리에 내 먼별이 (설정에서 사진으로 되돌리기 가능)
   - 친구에게 공유: profile payload(JSON)에 내 먼별 빛깔만 추가 → SQL 불필요
   - 친구 아바타/스토리: 친구가 먼별을 켜둔 경우에만 친구의 먼별, 아니면 친구 원래 네모/사진
   - 약속 스토리 카드(둘이 함께): 나는 내 먼별, 친구는 친구의 먼별(없으면 친구 네모) */
(function(){'use strict';
var B=window.PLANON_UX_BRIDGE;if(!B)return;
function MB(){return window.PLANON_MEONBYEOL;}
function mbOn(){try{return !!(MB()&&MB().on());}catch(e){return false;}}
function myUid(){try{return B.account().uid||'';}catch(e){return '';}}
function trialOnly(){try{var e=window.PLANON_MARKET_THEME,p=e.product('meonbyeol-theme');return !e.owned(p);}catch(x){return false;}}
function cleanHex(c){return /^#[0-9a-fA-F]{6}$/.test(String(c||''))?c:'';}
function myAvatarOn(){if(!mbOn())return false;try{return MB().state().avatar!==false;}catch(e){return false;}}
function myThemeKey(){if(!mbOn())return 'default';try{return MB().charType()==='dol'?'meondol':'meonbyeol';}catch(e){return 'default';}}
function todoThemeOn(){if(!mbOn())return false;try{return MB().state().todoTheme!==false;}catch(e){return true;}}
function friendThemeKey(fid){var f=friendMB(fid);return !f?'default':(f.type==='dol'?'meondol':'meonbyeol');}
function themeKey(uid,own){return own||(uid&&uid===myUid())?myThemeKey():friendThemeKey(uid);}

/* 친구에게 보낼 내 먼별 정보 (색 정보만, 개인 기록 없음) */
function sharePayload(){if(!mbOn())return null;try{var t=MB().myTint();return {v:2,type:MB().charType(),avatar:myAvatarOn(),tint:{name:String(t.name||'').slice(0,20),soft:cleanHex(t.soft),deep:cleanHex(t.deep),rib:cleanHex(t.rib)}};}catch(e){return null;}}
function friendMB(fid){if(!fid)return null;try{var fs=B.friendState()||{},row=(fs.incoming||[]).find(function(x){return x&&x.owner_id===fid&&x.kind==='profile';}),p=row&&row.payload&&row.payload.meonbyeol;if(!p||!p.tint||!cleanHex(p.tint.soft)||!cleanHex(p.tint.deep))return null;return {type:p.type==='dol'?'dol':'byeol',avatar:p.avatar!==false,tint:{name:String(p.tint.name||''),soft:p.tint.soft,deep:p.tint.deep,rib:cleanHex(p.tint.rib)||p.tint.deep}};}catch(e){return null;}}
function svgFor(tint,o,type){var mb=MB();if(!mb)return '';o=o||{};if(tint===null&&mb.charSVG)return mb.charSVG(o.expr||'normal');if(type==='dol')return mb.dolSVG({expr:o.expr||'normal'});return mb.svg?mb.svg('mbs',tint,Object.assign({plain:true,expr:o.expr||'normal'},o)):'';}

/* app-core friendAvatar 훅: 친구가 먼별을 프로필로 쓰는 경우에만 */
function friendAvatarHTML(fid){var f=friendMB(fid);return f&&f.avatar?svgFor(f.tint,{},f.type):'';}
/* day-story 스토리 동그라미 훅 */
function avatarFace(id,own){if(own||(id&&id===myUid()))return myAvatarOn()?svgFor(null,{expr:'shy'}):'';var f=friendMB(id);return f&&f.avatar?svgFor(f.tint,{expr:'shy'},f.type):'';}
/* 약속 스토리 카드의 두 얼굴 */
function pairFace(uid,expr){if(!uid)return '';expr=expr||'shy';if(uid===myUid())return mbOn()?svgFor(null,{expr:expr}):'';var f=friendMB(uid);return f?svgFor(f.tint,{expr:expr},f.type):'';}

/* 설정 > 프로필 카드: 사진 자리에 내 먼별 + 전환 스위치 */
function decorateProfile(){var ph=document.querySelector('#main .profile-photo');if(!ph)return;var row=ph.closest('.profile-photo-row');if(!row)return;
  var tog=row.parentNode.querySelector('.mb-prof-toggle');
  if(!mbOn()){if(tog)tog.remove();if(ph.dataset.mb==='1'){delete ph.dataset.mb;ph.classList.remove('mb-prof');}return;}
  var st=MB().state(),use=st.avatar!==false;
  if(use&&ph.dataset.mb!=='1'){ph.dataset.orig=ph.innerHTML;ph.innerHTML=svgFor(null,{expr:'smile'});ph.dataset.mb='1';ph.classList.add('mb-prof');}
  if(!use&&ph.dataset.mb==='1'){ph.innerHTML=ph.dataset.orig||'';delete ph.dataset.mb;ph.classList.remove('mb-prof');}
  if(!tog){tog=document.createElement('div');tog.className='setrow mb-prof-toggle';row.after(tog);}
  tog.innerHTML='<span>프로필을 '+MB().charName()+'로<small>'+(trialOnly()?'무료체험 중에도 친구에게 내 먼별이 보여요. ':'')+'친구 화면에는 내 먼별 모습만 보이고, 친구 화면 꾸밈은 바뀌지 않아요.</small></span><button class="tbtn'+(use?' on':'')+'" data-mbs="avatar">'+(use?'켜짐':'꺼짐')+'</button>';}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-mbs="avatar"]');if(!a)return;e.preventDefault();var st=MB().state();st.avatar=!(st.avatar!==false);B.save();var ph=document.querySelector('#main .profile-photo');if(ph&&ph.dataset.mb==='1'&&!st.avatar){ph.innerHTML=ph.dataset.orig||'';delete ph.dataset.mb;ph.classList.remove('mb-prof');}decorateProfile();try{B.toast(st.avatar?'프로필이 '+MB().charName()+'로 바뀌었어요':'프로필 사진으로 돌아왔어요');}catch(x){}});
var main=document.getElementById('main');if(main)new MutationObserver(function(){setTimeout(decorateProfile,0);}).observe(main,{childList:true});
window.addEventListener('planon-market-change',function(){setTimeout(function(){decorateProfile();decorateTodoThemeSetting();},30);});

/* 캐릭터 테마 ON: 내 화면의 네모를 먼별/먼돌로 (친구 스토리 속 네모는 그대로) */
var MOOD2EXPR={basic:'normal',happy:'smile',proud:'proud',sad:'sad',gloomy:'sad',angry:'surprised',sleepy:'sleepy'};
function stateAccessory(state,type){var stone=type==='dol',stroke=stone?'#7E7488':'#8E7BA8',soft=stone?'#E2DCE7':'#FFF2C8',deep=stone?'#B9AFC3':'#E5B75C';
  if(state==='exam')return '<svg class="mbx-state-acc" viewBox="0 0 70 48" aria-hidden="true"><path d="M4 12q16-7 31 2v29Q20 34 4 40Z" fill="'+soft+'" stroke="'+stroke+'" stroke-width="2.4"/><path d="M66 12q-16-7-31 2v29q15-9 31-3Z" fill="'+soft+'" stroke="'+stroke+'" stroke-width="2.4"/><path d="M35 14v29" stroke="'+stroke+'" stroke-width="2.2"/></svg>';
  if(state==='diary')return '<svg class="mbx-state-acc" viewBox="0 0 42 70" aria-hidden="true"><g transform="rotate(-15 21 35)"><rect x="15" y="5" width="12" height="49" rx="5" fill="'+deep+'" stroke="'+stroke+'" stroke-width="2.5"/><path d="M15 54h12l-6 12Z" fill="#F8E5C4" stroke="'+stroke+'" stroke-width="2.5"/></g></svg>';
  if(state==='appointment')return '<svg class="mbx-state-acc" viewBox="0 0 56 58" aria-hidden="true"><rect x="7" y="20" width="42" height="31" rx="7" fill="'+soft+'" stroke="'+stroke+'" stroke-width="2.5"/><path d="M17 20v-6q0-8 11-8t11 8v6" fill="none" stroke="'+stroke+'" stroke-width="2.6"/><path d="M14 31h28" stroke="'+stroke+'" stroke-width="2" opacity=".55"/></svg>';
  if(state==='rest')return '<svg class="mbx-state-acc" viewBox="0 0 80 38" aria-hidden="true"><path d="M5 20q25-15 54-2l14 9v8H5Z" fill="'+soft+'" stroke="'+stroke+'" stroke-width="2.4"/><path d="M13 21q20-10 39-3" fill="none" stroke="'+deep+'" stroke-width="2.2" opacity=".65"/></svg>';
  return '';
}
function charFace(mood,cls,state){var mb=MB();cls=String(cls||'');state=state||'basic';var auto=/nemo-home-char/.test(cls),ex=auto?mb.curExpr():/closed-nemo/.test(cls)?mb.exprFor('home'):(state==='focus'?'focus':MOOD2EXPR[mood]||'normal');if(/closed-nemo/.test(cls)&&mb.state().face&&mb.state().face.mode!=='manual')ex='proud';
  var type=mb.charType(),base='<span class="nemo-char mbx-char '+cls.replace(/"/g,'')+'"'+(auto?' data-auto="1"':'')+' aria-hidden="true">'+mb.charSVG(ex)+'</span>',acc=stateAccessory(state,type);
  return state!=='basic'?'<span class="mbx-state mbx-state-'+state+' mbx-'+type+'">'+base+acc+'</span>':base;}
function isRemoteContext(cls){cls=String(cls||'');return /(?:^|[-_])(story|memory-pair|friend|fav|remote)(?:[-_]|$)/.test(cls);}
function wrapNemo(){if(window.__mbNemoWrapped||typeof window.nemoSVG!=='function')return;window.__mbNemoWrapped=true;var o1=window.nemoSVG,o2=window.nemoStateSVG;
  window.nemoSVG=function(mood,cls){try{if(mbOn()&&!isRemoteContext(cls))return charFace(mood,cls);}catch(e){}return o1.apply(this,arguments);};
  if(typeof o2==='function')window.nemoStateSVG=function(state,mood,cls){try{if(mbOn()&&!isRemoteContext(cls))return charFace(mood,cls,state);}catch(e){}return o2.apply(this,arguments);};}
wrapNemo();
function renameNemo(){if(!mbOn())return;var nm=MB().charName();document.querySelectorAll('#main .nemo-copy, #main .closed-hero-copy, #main .nemo-settings-preview b').forEach(function(el){if(el.dataset.mbName===nm)return;var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),n;while((n=w.nextNode()))if(/네모/.test(n.nodeValue))n.nodeValue=n.nodeValue.replace(/네모/g,nm);el.dataset.mbName=nm;});}
if(main)new MutationObserver(function(){setTimeout(renameNemo,0);}).observe(main,{childList:true});
function decorateTodoThemeSetting(){var u=B.ui&&B.ui();if(!u||u.tab!=='settings'||u.settingsPage!=='screen')return;var main=document.getElementById('main');if(!main||main.querySelector('[data-mbs="todo-theme"]'))return;var body=main.querySelector('.settings-group-body');if(!body)return;var row=document.createElement('div');row.className='setrow mb-todo-theme-setting';row.innerHTML='<span>할 일 캐릭터 테마<small>끄면 할 일 체크만 기본 플래논으로 보여요. 홈·집중·마감·스토리 테마는 그대로예요.</small></span><button class="tbtn'+(todoThemeOn()?' on':'')+'" data-mbs="todo-theme">'+(todoThemeOn()?'켜짐':'꺼짐')+'</button>';body.insertBefore(row,body.firstChild);}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-mbs="todo-theme"]');if(!a)return;e.preventDefault();if(!mbOn())return;var st=MB().state();st.todoTheme=st.todoTheme===false;B.save();document.documentElement.classList.toggle('mb-todo-off',st.todoTheme===false);decorateTodoThemeSetting();try{B.render(false);}catch(x){}try{B.toast(st.todoTheme===false?'할 일은 기본 플래논으로 보여요':'할 일에도 캐릭터 테마를 보여요');}catch(x){}});
if(main)new MutationObserver(function(){setTimeout(decorateTodoThemeSetting,0);}).observe(main,{childList:true,subtree:false});
window.PLANON_MB_SOCIAL={sharePayload:sharePayload,friendMB:friendMB,friendAvatarHTML:friendAvatarHTML,avatarFace:avatarFace,pairFace:pairFace,themeKey:themeKey,myThemeKey:myThemeKey,friendThemeKey:friendThemeKey,todoThemeOn:todoThemeOn};
})();
