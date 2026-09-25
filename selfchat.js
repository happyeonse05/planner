function chatPhotoSrc(p){return typeof p==='string'?p:p&&p.src||'';}
function chatPhotosOf(m){return Array.isArray(m.photos)?m.photos:(m.photo?[m.photo]:[]);}
function chatRoomData(includeHidden){
  var hidden=S.settings.chatHidden||{},names=S.settings.chatRoomNames||{},rooms=[{id:'general',label:'나와의 채팅',kind:'general'}];
  courseNames().forEach(function(n){var id='course:'+n;if(includeHidden||!hidden[id])rooms.push({id:id,label:names[id]||n,kind:'course',hidden:!!hidden[id]});});
  (S.settings.chatRooms||[]).forEach(function(r){if(r&&r.id&&(includeHidden||!hidden[r.id]))rooms.push({id:r.id,label:r.name||'프로젝트',kind:'custom',hidden:!!hidden[r.id]});});
  return rooms;
}
function chatRoomLabel(room){var found=chatRoomData(true).find(function(r){return r.id===room;});return found?found.label:(room==='general'?'나와의 채팅':room.indexOf('course:')===0?room.slice(7):'프로젝트');}
function chatRoomsHTML(){
  var rooms=chatRoomData(false),archived=chatRoomData(true).filter(function(r){return r.id!=='general'&&r.hidden;});
  if(!rooms.some(function(r){return r.id===U.chatRoom;}))U.chatRoom='general';
  return '<div class="chatrooms" aria-label="프로젝트창 목록">'+rooms.map(function(r){return '<button class="chatroom'+(U.chatRoom===r.id?' on':'')+'" data-act="chat-room" data-room="'+esc(r.id)+'" title="'+esc(r.label)+'">'+esc(r.label)+'</button>';}).join('')+'<button class="chatroom addroom" data-act="chat-add-room" aria-label="채팅방 추가">＋</button></div>'+
    (archived.length?'<div class="chat-archive"><div class="chat-archive-title">보관된 프로젝트창</div><div class="chat-archive-list">'+archived.map(function(r){return '<button data-act="chat-restore-room" data-room="'+esc(r.id)+'">'+esc(r.label)+' 다시 열기</button>';}).join('')+'</div></div>':'');
}
function chatListHTML(){
  var q=(U.chatQuery||'').trim().toLowerCase(),room=U.chatRoom||'general',last='',html='';
  var isMemo=room==='general';
  S.selfchat.slice().sort(function(a,b){return a.at-b.at;}).filter(function(m){
    if((m.room||'general')!==room)return false;
    if(!q)return true;
    return (m.text||'').toLowerCase().indexOf(q)>=0||new Date(m.at).toLocaleDateString('ko-KR').indexOf(q)>=0;
  }).forEach(function(m){
    var d=new Date(m.at),k=dkey(d);
    if(k!==last){html+='<div class="cdate">'+mdTxt(d)+' '+DAYS[dow(d)]+'요일</div>';last=k;}
    var sel=U.chatSel===m.id,photos=chatPhotosOf(m);
    if(isMemo){
      var ph=photos.length?'<div class="selfnote-photos">'+photos.map(function(p,i){return '<button class="selfnote-photo" data-act="chat-photo" data-id="'+m.id+'" data-pi="'+i+'"><img src="'+chatPhotoSrc(p)+'" alt="메모 사진"></button>';}).join('')+'</div>':'';
      var tx=m.text?'<button class="selfnote-text" data-act="chat-sel" data-id="'+m.id+'">'+esc(m.text)+'</button>':'';
      html+='<article class="selfnote'+(sel?' sel':'')+'"><div class="selfnote-head"><span class="selfnote-time">'+pad(d.getHours())+':'+pad(d.getMinutes())+(m.editedAt?' · 수정됨':'')+'</span><button class="selfnote-more" data-act="chat-sel" data-id="'+m.id+'" aria-label="메모 메뉴">⋯</button></div>'+tx+ph+'</article>'+
        (sel?'<div class="selfnote-actions">'+(m.text?'<button class="tbtn" data-act="chat-edit" data-id="'+m.id+'">수정</button><button class="tbtn" data-act="chat-copy" data-id="'+m.id+'">복사</button>':'')+'<button class="tbtn cdel" data-act="chat-del" data-id="'+m.id+'">삭제</button></div>':'');
    }else{
      var cph=photos.length?'<div class="cphotos">'+photos.map(function(p,i){return '<button class="cphoto" data-act="chat-photo" data-id="'+m.id+'" data-pi="'+i+'"><img src="'+chatPhotoSrc(p)+'" alt="채팅 사진"></button>';}).join('')+'</div>':'';
      var ctx=m.text?'<button class="cbub" data-act="chat-sel" data-id="'+m.id+'">'+esc(m.text)+'</button>':'';
      html+='<div class="cmsg'+(sel?' sel':'')+'"><span class="ctime">'+pad(d.getHours())+':'+pad(d.getMinutes())+'</span>'+cph+ctx+'<button class="chat-more" data-act="chat-sel" data-id="'+m.id+'" aria-label="메시지 메뉴">⋯</button></div>'+
        (sel?'<div class="cops">'+(m.text?'<button class="tbtn" data-act="chat-copy" data-id="'+m.id+'">복사</button>':'')+'<button class="tbtn cdel" data-act="chat-del" data-id="'+m.id+'">삭제</button></div>':'');
    }
  });
  return html||'<div class="empty" style="text-align:center;margin:auto">'+(q?'검색 결과가 없어요':isMemo?'생각나는 걸 메모처럼 남겨봐요':'생각나는 걸 편하게 보내봐요')+'</div>';
}
function openSelfChatEdit(id){
  var m=S.selfchat.find(function(x){return x.id===id;});
  if(!m)return;
  M={type:'chat-edit',id:id};
  openModal('<h3>메모 수정</h3><textarea class="recipe-ta" id="f-chat-edit" maxlength="10000" style="min-height:180px" placeholder="메모를 입력하세요">'+esc(m.text||'')+'</textarea><div class="acts"><button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="chat-edit-save">저장</button></div>');
  setTimeout(function(){var f=$('#f-chat-edit');if(f){f.focus();f.setSelectionRange(f.value.length,f.value.length);}},40);
}
function saveSelfChatEdit(){
  var m=S.selfchat.find(function(x){return x.id===M.id;});
  if(!m)return;
  var f=$('#f-chat-edit'),v=f?f.value.trim():'';
  if(!v&&chatPhotosOf(m).length===0){bad('#f-chat-edit');return;}
  m.text=v.slice(0,10000);m.editedAt=Date.now();
  save();closeModal();U.chatSel=null;drawChat();inAppToast('메모를 수정했어요');
}
function pendingChatPhotosHTML(){
  var ps=U.chatPhotos||[];
  return ps.length?'<div class="chat-pending">'+ps.map(function(p){return '<img src="'+p+'" alt="보낼 사진">';}).join('')+'</div>':'';
}

function drawChat(){
  M={type:'chat'};
  var isMemoRoom=(U.chatRoom||'general')==='general';
  openModal('<div class="chatpage'+(isMemoRoom?' selfmemo-page':'')+'"><div class="ftop"><button class="ibtn" data-act="close" aria-label="닫기">‹</button><span>'+esc(chatRoomLabel(U.chatRoom||'general'))+'</span>'+(U.chatRoom!=='general'?'<button class="chat-menu" data-act="chat-room-menu" aria-label="채팅방 설정">⋯</button>':'')+'</div>'+chatRoomsHTML()+
    '<input class="chat-search" id="f-chat-search" placeholder="'+(isMemoRoom?'메모 검색':'대화 검색')+'" value="'+esc(U.chatQuery||'')+'">'+
    '<div class="clist'+(isMemoRoom?' selfmemo-list':'')+'" id="clist">'+chatListHTML()+'</div>'+
    pendingChatPhotosHTML()+
    '<div class="cinput"><label class="chat-addphoto" aria-label="사진 첨부">＋<input type="file" accept="image/*" multiple data-chatphoto hidden></label><textarea id="f-chat" rows="1" placeholder="'+(isMemoRoom?'메모 입력':'메시지 입력')+'" enterkeyhint="send">'+esc(U.chatDraft||'')+'</textarea><button class="csend" data-act="chat-send" aria-label="보내기"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button></div></div>');
  $('#modal').classList.add('full');
  var cl=$('#clist');if(cl)cl.scrollTop=cl.scrollHeight;
}
function addChatPhotos(files){
  var list=Array.prototype.slice.call(files||[]),left=list.length;
  if(!left)return;
  list.forEach(function(file){
    shrinkImage(file,function(url){
      if(url)U.chatPhotos.push(url);
      left--;
      if(left===0){drawChat();setTimeout(function(){var t=$('#f-chat');if(t)t.focus();},30);}
    });
  });
}
function sendChat(){
  var ta=$('#f-chat');if(!ta)return;var v=ta.value.trim(),photos=(U.chatPhotos||[]).slice();
  if(!v&&!photos.length)return;
  S.selfchat.push({id:uid(),text:v.slice(0,2000),photos:photos,room:U.chatRoom||'general',at:Date.now()});
  U.chatDraft='';U.chatPhotos=[];U.chatSel=null;save();drawChat();
  setTimeout(function(){var t=$('#f-chat');if(t)t.focus();},30);
}
function openChatRoomAdd(){
  M={type:'chat-add-room',fromChat:true};
  openModal('<h3>채팅방 추가</h3><p class="hint">수업, 프로젝트, 동아리처럼 따로 기록할 공간을 만들어요. 나간 방도 프로젝트창으로 보존돼요.</p><input class="fld" id="f-chatroom" placeholder="수업 이름이나 프로젝트 이름" maxlength="30"><div class="acts"><button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="save-chat-room">추가</button></div>');
  setTimeout(function(){var f=$('#f-chatroom');if(f)f.focus();},50);
}
function openChatRoomMenu(){
  if(!U.chatRoom||U.chatRoom==='general')return;
  M={type:'chat-room-menu',room:U.chatRoom,fromChat:true};
  openModal('<h3>'+esc(chatRoomLabel(U.chatRoom))+'</h3><p class="hint">프로젝트창은 보존돼요. 이름을 바꾸거나 목록에서 나갈 수 있어요.</p><div class="acts" style="flex-direction:column"><button class="b-ghost" data-act="chat-room-rename">이름 바꾸기</button><button class="b-ghost" data-act="chat-room-leave">나가기</button><button class="b-del" data-act="chat-room-delete">채팅방 삭제</button><button class="b-ghost" data-act="chat-room-menu-close">닫기</button></div>');
}
function openChatRoomRename(){
  var room=U.chatRoom;if(!room||room==='general')return;
  M={type:'chat-room-rename',room:room,fromChat:true};
  openModal('<h3>채팅창 이름 바꾸기</h3><input class="fld" id="f-chatroom-name" maxlength="30" value="'+esc(chatRoomLabel(room))+'"><div class="acts"><button class="b-ghost" data-act="close">취소</button><button class="b-save" data-act="save-chat-room-name">저장</button></div>');
  setTimeout(function(){var f=$('#f-chatroom-name');if(f){f.focus();f.select();}},50);
}
function saveChatRoom(){
  var name=$('#f-chatroom').value.trim();
  if(!name){bad('#f-chatroom');return;}
  var exists=chatRoomData().some(function(r){return r.label===name;});
  if(exists){bad('#f-chatroom');return;}
  var id='room:'+uid();
  S.settings.chatRooms.push({id:id,name:name});
  delete S.settings.chatHidden[id];
  U.chatRoom=id;U.chatQuery='';U.chatSel=null;save();closeModal();drawChat();
}
function saveChatRoomName(){
  var name=$('#f-chatroom-name').value.trim(),room=M.room;
  if(!name||!room||room==='general'){bad('#f-chatroom-name');return;}
  var exists=chatRoomData(true).some(function(r){return r.id!==room&&r.label===name;});
  if(exists){bad('#f-chatroom-name');return;}
  var custom=(S.settings.chatRooms||[]).find(function(r){return r&&r.id===room;});
  if(custom)custom.name=name;
  else S.settings.chatRoomNames[room]=name;
  save();closeModal();drawChat();
}
function leaveChatRoom(){
  var id=U.chatRoom;if(!id||id==='general')return;
  S.settings.chatHidden[id]=true;U.chatRoom='general';U.chatQuery='';U.chatSel=null;save();closeModal();drawChat();
}
function deleteChatRoom(){
  var id=U.chatRoom;if(!id||id==='general')return;
  S.selfchat=S.selfchat.filter(function(m){return (m.room||'general')!==id;});
  var custom=(S.settings.chatRooms||[]).some(function(r){return r.id===id;});
  if(custom)S.settings.chatRooms=(S.settings.chatRooms||[]).filter(function(r){return r.id!==id;});
  else S.settings.chatHidden[id]=true;
  delete S.settings.chatRoomNames[id];U.chatRoom='general';U.chatQuery='';U.chatSel=null;save();closeModal();drawChat();
}
function restoreChatRoom(id){
  if(!id)return;
  var room=chatRoomData(true).find(function(r){return r.id===id;});
  if(!room)return;
  delete S.settings.chatHidden[id];U.chatRoom=id;U.chatQuery='';U.chatSel=null;save();closeModal();drawChat();
}
