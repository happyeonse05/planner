function recipeBookHTML(){
  var rows=(S.settings.recipes||[]).slice().sort(function(a,b){return Number(!!b.favorite)-Number(!!a.favorite)||(b.updatedAt||0)-(a.updatedAt||0);});
  var list=rows.length?'<div class="recipe-list">'+rows.map(function(r){
    var ing=String(r.ingredients||'').split(/\n+/).map(function(x){return x.trim();}).filter(Boolean),preview=(r.steps||r.memo||r.ingredients||'').replace(/\s+/g,' ').trim();
    return '<button class="recipe-card" data-act="recipe-open" data-id="'+esc(r.id)+'"><b>'+(r.favorite?'★ ':'')+esc(r.title)+'</b><small>'+(preview?esc(preview.slice(0,72))+(preview.length>72?'…':''):'아직 내용이 없어요')+'</small><div class="recipe-meta"><span>준비물 '+ing.length+'개</span>'+(r.steps?'<span>만드는 법 있음</span>':'')+(r.memo?'<span>메모 있음</span>':'')+'</div></button>';
  }).join('')+'</div>':'<div class="recipe-empty">아직 저장한 레시피가 없어요.<br>초코우유, 간단한 간식, 자주 쓰는 조합을 적어두면 편해요.</div>';
  return '<section class="card"><div class="recipe-head"><div><h3>레시피 노트</h3><small style="color:var(--sub)">준비물 · 만드는 법 · 내 메모를 모아둬요</small></div><button class="tbtn" data-act="recipe-add">+ 레시피</button></div>'+list+'</section>';
}
function openRecipe(id){
  var r=(S.settings.recipes||[]).find(function(x){return x.id===id;})||{id:'',title:'',ingredients:'',steps:'',memo:'',favorite:false};
  M={type:'recipe',id:r.id||null,recipeFavorite:!!r.favorite};
  openModal('<h3>'+(r.id?'레시피 수정':'새 레시피')+'</h3>'+
    '<div class="setrow" style="padding:0 0 8px;border:0"><span>즐겨찾기<small>자주 보는 레시피를 맨 위에 고정해요</small></span><button class="tbtn'+(r.favorite?' on':'')+'" id="f-recipe-fav" data-act="recipe-fav-toggle">'+(r.favorite?'★ 저장됨':'☆ 추가')+'</button></div>'+
    '<span class="lbl">이름</span><input class="fld" id="f-recipe-title" maxlength="50" placeholder="예: 초코우유 맛있게 타기" value="'+esc(r.title)+'">'+
    '<span class="lbl">준비물</span><textarea class="recipe-ta" id="f-recipe-ingredients" maxlength="4000" placeholder="한 줄에 하나씩 적어도 좋아요\n예: 우유 200ml\n초코가루 2스푼">'+esc(r.ingredients)+'</textarea>'+
    '<div class="recipe-help">재료뿐 아니라 컵, 얼음, 전자레인지처럼 필요한 것도 같이 적어둘 수 있어요.</div>'+
    '<span class="lbl">만드는 법</span><textarea class="recipe-ta" id="f-recipe-steps" maxlength="6000" placeholder="예: 1. 컵에 초코가루를 넣기\n2. 따뜻한 우유 조금으로 먼저 풀기\n3. 나머지 우유를 넣고 섞기">'+esc(r.steps)+'</textarea>'+
    '<span class="lbl">내 메모 <em>(선택)</em></span><textarea class="recipe-ta" id="f-recipe-memo" maxlength="3000" style="min-height:86px" placeholder="예: 얼음 3개 넣으면 제일 맛있음">'+esc(r.memo)+'</textarea>'+
    '<div class="acts">'+(r.id?'<button class="b-del" data-act="recipe-delete">삭제</button>':'')+'<button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="recipe-save">저장</button></div>');
  setTimeout(function(){var f=$('#f-recipe-title');if(f&&!r.id)f.focus();},50);
}
function saveRecipe(){
  var t=$('#f-recipe-title'),title=t?t.value.trim():'';
  if(!title){bad('#f-recipe-title');return;}
  var now=Date.now(),arr=S.settings.recipes||(S.settings.recipes=[]),r=M.id&&arr.find(function(x){return x.id===M.id;});
  var data={title:title.slice(0,50),ingredients:($('#f-recipe-ingredients')?$('#f-recipe-ingredients').value:'').slice(0,4000),steps:($('#f-recipe-steps')?$('#f-recipe-steps').value:'').slice(0,6000),memo:($('#f-recipe-memo')?$('#f-recipe-memo').value:'').slice(0,3000),favorite:!!(M.recipeFavorite),updatedAt:now};
  if(r)Object.assign(r,data);else arr.push(Object.assign({id:uid(),createdAt:now},data));
  save();closeModal();U.settingsPage='recipes';render();inAppToast('레시피를 저장했어요');
}
function deleteRecipe(btn){
  if(!M.id)return;
  if(!armed(btn))return;
  S.settings.recipes=(S.settings.recipes||[]).filter(function(r){return r.id!==M.id;});
  save();closeModal();U.settingsPage='recipes';render();inAppToast('레시피를 삭제했어요');
}
