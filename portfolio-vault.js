(function(){
'use strict';

var B=window.PLANON_UX_BRIDGE;
if(!B)return;

var draft=null;

function S(){return B.state&&B.state();}
function U(){return B.ui&&B.ui();}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function uid(){try{return crypto.randomUUID();}catch(e){return 'pf-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10);}}
function clone(o){return JSON.parse(JSON.stringify(o));}
function cleanUrl(v){
  v=String(v||'').trim();
  if(!v)return '';
  if(!/^https?:\/\//i.test(v))v='https://'+v;
  try{var u=new URL(v);return /^https?:$/.test(u.protocol)?u.href:'';}catch(e){return '';}
}
function vault(){
  var s=S();if(!s||!s.settings)return [];
  if(!Array.isArray(s.settings.portfolioVault))s.settings.portfolioVault=[];
  return s.settings.portfolioVault;
}
function dateText(x){
  var a=x.start||'',b=x.end||'';
  if(a&&b)return a===b?a:a+' ~ '+b;
  return a||b||'기간 미입력';
}
function short(s,n){s=String(s||'').trim();return s.length>n?s.slice(0,n-1)+'…':s;}
function getById(id){return vault().find(function(x){return x.id===id;})||null;}

function injectSettings(){
  var u=U(),main=document.getElementById('main');
  if(!main||!u||u.tab!=='settings'||u.settingsPage)return;
  if(main.querySelector('[data-portfolio-vault-card]'))return;

  var card=document.createElement('section');
  card.className='card portfolio-vault-card';
  card.setAttribute('data-portfolio-vault-card','1');
  var count=vault().length;
  card.innerHTML='<button class="setrow chatrow" data-pf-act="home"><span>포트폴리오 재료함<small>활동 · 역할 · 한 일 · 성과 · 링크 · 증빙'+(count?' · '+count+'개':'')+'</small></span><span class="chev">›</span></button>';
  var cards=main.querySelectorAll(':scope > section.card');
  if(cards.length)cards[cards.length-1].before(card);else main.appendChild(card);
}

function homeHTML(){
  var items=vault().slice().sort(function(a,b){return Number(b.updatedAt||b.createdAt||0)-Number(a.updatedAt||a.createdAt||0);});
  var rows=items.map(function(x){
    var visual=x.photo?'<img class="portfolio-item-thumb" src="'+esc(x.photo)+'" alt="">':'<span class="portfolio-item-icon">▣</span>';
    var meta=[dateText(x),x.role||''].filter(Boolean).join(' · ');
    var desc=x.result||x.work||'';
    return '<button class="portfolio-item" data-pf-act="detail" data-id="'+esc(x.id)+'">'+visual+
      '<span class="portfolio-item-copy"><b>'+esc(x.title||'이름 없는 활동')+'</b><small>'+esc(meta)+'</small>'+
      (desc?'<p>'+esc(short(desc,95))+'</p>':'')+'</span><span class="chev">›</span></button>';
  }).join('');
  return '<h3>포트폴리오 재료함</h3>'+
    '<p class="hint">완성본을 만드는 곳이 아니라, 나중에 자소서·포트폴리오에 쓸 활동 기록을 안 잊게 모아두는 곳이에요.</p>'+
    '<button class="portfolio-add-main" data-pf-act="new">+ 활동 추가</button>'+
    '<div class="portfolio-vault-list">'+(rows||'<div class="portfolio-empty">아직 저장한 활동이 없어요.</div>')+'</div>'+
    '<div class="acts"><button class="b-save" data-pf-act="close">닫기</button></div>';
}
function openHome(){draft=null;B.openModal(homeHTML());}

function blank(){
  return {id:'',title:'',start:'',end:'',role:'',work:'',result:'',link:'',photo:'',createdAt:0,updatedAt:0};
}
function editorHTML(x){
  return '<h3>'+(x.id?'활동 수정':'활동 추가')+'</h3>'+
    '<div class="portfolio-editor">'+
      '<label class="pf-field"><span>활동 / 프로젝트명 *</span><input id="pf-title" maxlength="80" value="'+esc(x.title)+'" placeholder="예: 의료 AX 프로젝트"></label>'+
      '<div class="pf-grid">'+
        '<label class="pf-field"><span>시작</span><input id="pf-start" type="date" value="'+esc(x.start)+'"></label>'+
        '<label class="pf-field"><span>종료</span><input id="pf-end" type="date" value="'+esc(x.end)+'"></label>'+
      '</div>'+
      '<label class="pf-field"><span>내 역할</span><input id="pf-role" maxlength="100" value="'+esc(x.role)+'" placeholder="예: 서비스 기획 · UI/UX"></label>'+
      '<label class="pf-field"><span>내가 한 일</span><textarea id="pf-work" maxlength="1200" placeholder="구체적으로 내가 맡아서 한 일을 적어둬요.">'+esc(x.work)+'</textarea></label>'+
      '<label class="pf-field"><span>결과 / 성과</span><textarea id="pf-result" maxlength="800" placeholder="예: 금상 · 설문 65명 · MVP 구현">'+esc(x.result)+'</textarea></label>'+
      '<label class="pf-field"><span>링크</span><input id="pf-link" type="url" inputmode="url" value="'+esc(x.link)+'" placeholder="GitHub · 배포 링크 · 기사 등"></label>'+
      '<div class="pf-field"><span>증빙 사진 1장</span><div class="portfolio-photo-box">'+
        (x.photo?'<img src="'+esc(x.photo)+'" alt="증빙 사진">':'<div class="portfolio-photo-placeholder">사진<br>없음</div>')+
        '<div class="portfolio-photo-actions"><label>사진 선택<input id="pf-photo" type="file" accept="image/*"></label>'+
        (x.photo?'<button data-pf-act="photo-remove">사진 삭제</button>':'')+
        '<small class="hint">저장 공간 때문에 자동으로 작게 압축해요.</small></div></div></div>'+
    '</div>'+
    '<div class="acts"><button class="b-ghost" data-pf-act="home">취소</button><button class="b-save" data-pf-act="save">저장</button></div>';
}
function openEditor(id){
  var x=id?getById(id):null;
  draft=clone(x||blank());
  B.openModal(editorHTML(draft));
}
function readForm(){
  if(!draft)draft=blank();
  draft.title=(document.getElementById('pf-title')||{}).value||'';
  draft.start=(document.getElementById('pf-start')||{}).value||'';
  draft.end=(document.getElementById('pf-end')||{}).value||'';
  draft.role=(document.getElementById('pf-role')||{}).value||'';
  draft.work=(document.getElementById('pf-work')||{}).value||'';
  draft.result=(document.getElementById('pf-result')||{}).value||'';
  draft.link=(document.getElementById('pf-link')||{}).value||'';
  return draft;
}
function saveItem(){
  var x=readForm();
  x.title=String(x.title||'').trim();
  if(!x.title){B.toast('활동명을 적어주세요');var el=document.getElementById('pf-title');if(el)el.focus();return;}
  x.role=String(x.role||'').trim();
  x.work=String(x.work||'').trim();
  x.result=String(x.result||'').trim();
  x.link=cleanUrl(x.link);
  if(x.start&&x.end&&x.end<x.start){B.toast('종료일이 시작일보다 빨라요');return;}
  var now=Date.now(),list=vault();
  if(x.id){
    var i=list.findIndex(function(v){return v.id===x.id;});
    x.updatedAt=now;
    if(i>=0)list[i]=clone(x);else list.push(clone(x));
  }else{
    x.id=uid();x.createdAt=now;x.updatedAt=now;list.push(clone(x));
  }
  B.save();draft=null;B.toast('포트폴리오 재료를 저장했어요');openHome();
}
function detailHTML(x){
  var visual=x.photo?'<img src="'+esc(x.photo)+'" alt="증빙 사진">':'<div class="noimg">▣</div>';
  return '<div class="portfolio-detail-head">'+visual+'<div class="portfolio-detail-title"><h3>'+esc(x.title||'이름 없는 활동')+'</h3>'+
    '<small>'+esc(dateText(x)+(x.role?' · '+x.role:''))+'</small></div></div>'+
    (x.work?'<div class="portfolio-section"><b>내가 한 일</b><p>'+esc(x.work)+'</p></div>':'')+
    (x.result?'<div class="portfolio-section"><b>결과 / 성과</b><p>'+esc(x.result)+'</p></div>':'')+
    (x.link?'<div class="portfolio-section"><b>링크</b><a class="portfolio-link" href="'+esc(x.link)+'" target="_blank" rel="noopener">'+esc(x.link)+'</a></div>':'')+
    '<div class="acts"><button class="b-ghost" data-pf-act="delete" data-id="'+esc(x.id)+'">삭제</button><button class="b-ghost" data-pf-act="edit" data-id="'+esc(x.id)+'">수정</button><button class="b-save" data-pf-act="home">목록</button></div>';
}
function openDetail(id){
  var x=getById(id);if(!x){B.toast('활동을 찾지 못했어요');openHome();return;}
  draft=null;B.openModal(detailHTML(x));
}
function deleteItem(id){
  var x=getById(id);if(!x)return;
  if(!confirm('“'+(x.title||'이 활동')+'”을 삭제할까요?'))return;
  var s=S();s.settings.portfolioVault=vault().filter(function(v){return v.id!==id;});
  B.save();B.toast('삭제했어요');openHome();
}
function compressImage(file){
  return new Promise(function(resolve,reject){
    if(!file||!/^image\//.test(file.type||'')){reject(new Error('image'));return;}
    var reader=new FileReader();
    reader.onerror=function(){reject(new Error('read'));};
    reader.onload=function(){
      var img=new Image();
      img.onerror=function(){reject(new Error('decode'));};
      img.onload=function(){
        var max=1100,w=img.width,h=img.height,scale=Math.min(1,max/Math.max(w,h));
        var cw=Math.max(1,Math.round(w*scale)),ch=Math.max(1,Math.round(h*scale));
        var c=document.createElement('canvas');c.width=cw;c.height=ch;
        c.getContext('2d').drawImage(img,0,0,cw,ch);
        var data=c.toDataURL('image/jpeg',0.72);
        if(data.length>900000){reject(new Error('large'));return;}
        resolve(data);
      };
      img.src=reader.result;
    };
    reader.readAsDataURL(file);
  });
}
function photoChanged(input){
  if(!draft)draft=blank();
  var file=input&&input.files&&input.files[0];if(!file)return;
  readForm();
  B.toast('사진을 정리하는 중…');
  compressImage(file).then(function(data){
    draft.photo=data;B.openModal(editorHTML(draft));
  }).catch(function(e){
    B.toast(e&&e.message==='large'?'사진이 너무 커요. 다른 사진을 골라주세요':'사진을 읽지 못했어요');
  });
}
function removePhoto(){
  if(!draft)return;
  readForm();draft.photo='';B.openModal(editorHTML(draft));
}
function click(e){
  var a=e.target.closest&&e.target.closest('[data-pf-act]');
  if(!a)return;
  var act=a.dataset.pfAct,id=a.dataset.id||'';
  if(act==='home')return openHome();
  if(act==='close')return B.closeModal();
  if(act==='new')return openEditor('');
  if(act==='detail')return openDetail(id);
  if(act==='edit')return openEditor(id);
  if(act==='save')return saveItem();
  if(act==='delete')return deleteItem(id);
  if(act==='photo-remove')return removePhoto();
}
function change(e){
  if(e.target&&e.target.id==='pf-photo')photoChanged(e.target);
}
document.addEventListener('click',click);
document.addEventListener('change',change);

var main=document.getElementById('main');
if(main){
  var queued=false;
  new MutationObserver(function(){
    if(queued)return;queued=true;
    setTimeout(function(){queued=false;injectSettings();},35);
  }).observe(main,{childList:true});
}

window.PLANON_PORTFOLIO={afterRender:injectSettings,open:openHome};
injectSettings();
})();