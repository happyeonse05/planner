(function(){
'use strict';
var B=window.PLANON_UX_BRIDGE;if(!B)return;
var ST={loading:false,loaded:false,stories:[],reactions:[],ownReactions:[],lastLoad:0,viewIndex:0,error:''};
function S(){return B.state();}function U(){return B.ui();}function DB(){return B.db&&B.db();}function FS(){return B.friendState&&B.friendState()||{friends:[]};}function AC(){return B.account&&B.account()||{};}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function fmtDate(k){var d=B.parseKey(k);return (d.getMonth()+1)+'월 '+d.getDate()+'일';}
function trimWake(v){v=String(v||'');return /^\d\d:\d\d/.test(v)?v.slice(0,5):v;}
function friendOf(id){return (FS().friends||[]).find(function(f){return f.id===id;})||null;}
function friendName(id){var f=friendOf(id);return f&&((f.name&&f.name.trim())||f.code)||'친구';}
function validMood(m){return ['basic','happy','proud','sad','gloomy','angry','sleepy'].indexOf(m)>=0;}
function computedMood(total,done,at){var d=at?new Date(at):new Date(),h=isNaN(d)?new Date().getHours():d.getHours();if(typeof window.nemoMoodForToday==='function')return window.nemoMoodForToday(Number(total||0),Number(done||0),h);return Number(total||0)>0&&Number(done||0)>=Number(total||0)?'happy':'basic';}
function liveOwnMood(){var k=B.todayKey(),manual='';try{if(typeof window.diaryMoodForDate==='function')manual=window.diaryMoodForDate(k)||'';}catch(e){}if(validMood(manual))return manual;var st=B.dayCloseStats(k);return computedMood(st.total,st.done,Date.now());}
function closingMood(c){if(c&&validMood(c.nemoMood))return c.nemoMood;return computedMood(c&&(c.totalCount!=null?c.totalCount:c.total),c&&(c.doneCount!=null?c.doneCount:c.done),c&&(c.closedAt||c.finishedAt));}
function storyNemoHTML(mood,cls){return typeof window.nemoSVG==='function'?window.nemoSVG(validMood(mood)?mood:'basic','story-nemo '+(cls||'')):'<span class="story-nemo-fallback">□</span>';}
function avatarHTML(id,own,mood){return '<span class="story-avatar story-avatar-nemo">'+storyNemoHTML(validMood(mood)?mood:(own?liveOwnMood():'basic'),'')+'</span>';}
function allClosesFor(k){return (S().dayCloses||[]).filter(function(x){return x&&(x.key||x.date)===k;});}
function isStoryCard(x){return !!(x&&Number(x.cardVersion||0)>=2&&x.closedAt);}
function closeFor(k){var rows=allClosesFor(k).filter(isStoryCard);return rows.length?rows[rows.length-1]:null;}
function legacyCloseFor(k){var rows=allClosesFor(k).filter(function(x){return !isStoryCard(x);});return rows.length?rows[rows.length-1]:null;}
function coreStats(k){var a=(S().todos||[]).filter(function(t){return t.scope==='day'&&t.key===k&&t.isCore===true;});return {total:a.length,done:a.filter(function(t){return t.done;}).length};}
function snap(k){var st=B.dayCloseStats(k),cs=coreStats(k),showStudy=B.logItemOn('study'),showWake=B.logItemOn('wake'),sv=B.logVal(k,'study'),wv=B.logVal(k,'wake'),mood=(k===B.todayKey()?liveOwnMood():computedMood(st.total,st.done,Date.now()));return {id:'dayclose-'+k,key:k,date:k,finishedAt:Date.now(),closedAt:new Date().toISOString(),done:st.done,total:st.total,doneCount:st.done,totalCount:st.total,classes:st.classes,focus:st.focus,coreDone:cs.done,coreTotal:cs.total,studyMinutes:showStudy&&sv!=null?Number(sv):null,wakeTime:showWake&&wv?trimWake(wv):null,nemoMood:mood,comment:'',visibility:'private',cardVersion:2,storySync:'local',serverId:''};}
function fromServer(r){var c={id:'dayclose-'+r.date,key:r.date,date:r.date,finishedAt:new Date(r.closed_at).getTime(),closedAt:r.closed_at,done:Number(r.done_count||0),total:Number(r.total_count||0),doneCount:Number(r.done_count||0),totalCount:Number(r.total_count||0),coreDone:Number(r.core_done||0),coreTotal:Number(r.core_total||0),studyMinutes:r.study_minutes==null?null:Number(r.study_minutes),wakeTime:trimWake(r.wake_time),nemoMood:validMood(r.nemo_mood)?r.nemo_mood:'',comment:r.comment||'',visibility:r.visibility||'private',cardVersion:2,storySync:'synced',serverId:r.id,userId:r.user_id};if(!c.nemoMood)c.nemoMood=closingMood(c);return c;}
function cardHTML(c){var parts='';parts+='<div class="story-card-stat"><b>'+Number(c.doneCount!=null?c.doneCount:c.done||0)+' / '+Number(c.totalCount!=null?c.totalCount:c.total||0)+'</b><small>완료한 할 일</small></div>';parts+='<div class="story-card-stat"><b>★ '+Number(c.coreDone||0)+' / '+Number(c.coreTotal||0)+'</b><small>오늘의 핵심</small></div>';if(c.studyMinutes!=null)parts+='<div class="story-card-stat"><b>'+Number(c.studyMinutes||0)+'분</b><small>공부 시간</small></div>';if(c.wakeTime)parts+='<div class="story-card-stat"><b>'+esc(trimWake(c.wakeTime))+'</b><small>기상 시각</small></div>';var mine=!c.userId||(AC()&&AC().uid&&c.userId===AC().uid),owner='<div class="story-card-owner">'+avatarHTML(c.userId,mine,closingMood(c))+'<span>'+esc(mine?(String(S().settings.profileName||'').trim()||'나'):friendName(c.userId))+'</span></div>';return '<article class="story-card">'+owner+'<div class="story-card-date">'+esc(fmtDate(c.key||c.date))+'</div><div class="story-card-title">오늘의 요약</div><div class="story-card-stats">'+parts+'</div><div class="story-card-comment'+(c.comment?'':' empty')+'">'+esc(c.comment||'오늘의 한 줄을 남기지 않았어요')+'</div><div class="story-card-foot">PLAN:ON</div></article>';}
function closeLayer(){var x=document.getElementById('planon-story-layer');if(x)x.remove();}
function nemo(m){return typeof window.nemoSVG==='function'?window.nemoSVG(m,'story-reaction-nemo'):'<span class="story-reaction-fallback">□</span>';}
function ownReactionListHTML(){if(!ST.ownReactions.length)return '<p class="story-reaction-empty">아직 받은 반응이 없어</p>';return '<div class="story-reaction-list">'+ST.ownReactions.map(function(r){return '<div>'+nemo(r.emoji)+'<span>'+esc(friendName(r.from_user_id))+'</span></div>';}).join('')+'</div>';}
function sentReaction(closingId){var uid=AC().uid;return ST.reactions.find(function(r){return r.closing_id===closingId&&r.from_user_id===uid;})||null;}
function reactionPickerHTML(c){var sent=sentReaction(c.serverId),moods=[['happy','행복'],['proud','뿌듯'],['basic','응원'],['sad','토닥'],['sleepy','쉬어']];return '<div class="story-reaction-box"><b>'+(sent?'반응을 보냈어':'네모로 반응하기')+'</b><div class="story-reaction-picks">'+moods.map(function(x){return '<button data-story-act="react" data-closing="'+esc(c.serverId)+'" data-mood="'+x[0]+'"'+(sent?' disabled':'')+' class="'+(sent&&sent.emoji===x[0]?'on':'')+'">'+nemo(x[0])+'<small>'+x[1]+'</small></button>';}).join('')+'</div></div>';}
function layerBase(title,body,nav){closeLayer();var el=document.createElement('div');el.id='planon-story-layer';el.className='planon-story-layer';el.innerHTML='<div class="story-view-head"><b>'+title+'</b><button data-story-act="close-layer" aria-label="닫기">×</button></div><div class="story-view-body">'+(nav||'')+body+'</div>';document.body.appendChild(el);}
function viewOwn(c){if(!c)return;var status=c.visibility==='friends'?'친구에게 공개':'나만 보기';var body='<div class="story-view-scroll">'+cardHTML(c)+'<div class="story-own-meta">'+esc(status)+'</div><div id="story-own-reactions">'+(c.serverId?'<p class="story-reaction-empty">반응 불러오는 중…</p>':(c.storySync==='pending'?'<p class="story-reaction-empty">연결되면 자동으로 저장할게.</p>':'<p class="story-reaction-empty">이 카드는 나만 볼 수 있어.</p>'))+'</div></div>';layerBase(avatarHTML(AC()&&AC().uid,true,closingMood(c))+'<span>내 마감 카드</span>',body,'');if(c.serverId)loadOwnReactions(c.serverId);}
function drawFriendViewer(){var c=ST.stories[ST.viewIndex];if(!c){closeLayer();return;}var f=friendOf(c.userId),nm=friendName(c.userId),nav='<button class="story-side prev" data-story-act="story-prev" aria-label="이전 스토리"'+(ST.viewIndex<=0?' disabled':'')+'></button><button class="story-side next" data-story-act="story-next" aria-label="다음 스토리"'+(ST.viewIndex>=ST.stories.length-1?' disabled':'')+'></button>';var body='<div class="story-view-scroll"><div class="story-person">'+avatarHTML(c.userId,false,closingMood(c))+'<div><b>'+esc(nm)+'</b><small>'+esc(fmtDate(c.date))+'</small></div></div>'+cardHTML(c)+reactionPickerHTML(c)+'</div>';layerBase(avatarHTML(c.userId,false,closingMood(c))+'<span>'+esc(nm)+'</span>',body,nav);}
function viewFriend(id){var i=ST.stories.findIndex(function(x){return x.userId===id;});if(i<0)return;ST.viewIndex=i;var c=ST.stories[i],db=DB();showFriendSkeleton(id);if(!db||!c.serverId){setTimeout(drawFriendViewer,80);return;}db.from('day_closings').select('*').eq('id',c.serverId).maybeSingle().then(function(r){if(r&&r.data)ST.stories[i]=fromServer(r.data);drawFriendViewer();}).catch(function(){drawFriendViewer();});}
function rowForUpload(c){return {user_id:AC().uid,date:c.date||c.key,closed_at:c.closedAt||new Date(c.finishedAt||Date.now()).toISOString(),done_count:Number(c.doneCount!=null?c.doneCount:c.done||0),total_count:Number(c.totalCount!=null?c.totalCount:c.total||0),core_done:Number(c.coreDone||0),core_total:Number(c.coreTotal||0),study_minutes:c.studyMinutes==null?null:Number(c.studyMinutes),wake_time:c.wakeTime||null,nemo_mood:validMood(c.nemoMood)?c.nemoMood:closingMood(c),comment:(c.comment||'').slice(0,40)||null,visibility:c.visibility==='friends'?'friends':'private'};}
function pendingCards(){return (S().dayCloses||[]).filter(function(c){return isStoryCard(c)&&c.storySync==='pending';});}
function syncBanner(){var old=document.getElementById('story-sync-banner');if(old)old.remove();if(!pendingCards().length)return;var x=document.createElement('div');x.id='story-sync-banner';x.className='story-sync-banner';x.textContent='연결되면 자동으로 올릴게';document.body.appendChild(x);}
function adoptOwnServer(r){if(!r)return null;var c=closeFor(r.date);if(c){if(!c.serverId)c.serverId=r.id;c.storySync='synced';return c;}var fresh=fromServer(r),legacy=legacyCloseFor(r.date),arr=S().dayCloses||(S().dayCloses=[]);if(legacy){Object.assign(legacy,fresh);c=legacy;}else{arr.push(fresh);c=fresh;}B.save();B.render();return c;}
function pullOwnToday(){var db=DB(),a=AC();if(!db||!a.uid)return Promise.resolve(null);return db.from('day_closings').select('*').eq('user_id',a.uid).eq('date',B.todayKey()).maybeSingle().then(function(r){if(r.error)throw r.error;if(r.data){var c=adoptOwnServer(r.data);B.save();return c;}return null;}).catch(function(){return null;});}
function retryPending(){var rows=pendingCards();if(!rows.length){syncBanner();return Promise.resolve();}if(!DB()||!AC().uid){syncBanner();return Promise.resolve();}return rows.reduce(function(pr,c){return pr.then(function(){return uploadClosing(c);});},Promise.resolve()).then(function(){syncBanner();loadStories(true);});}
function storySkeletonHTML(){return '<div class="story-card story-card-skeleton"><i class="sk-line w1"></i><i class="sk-line w2"></i><div class="sk-grid"><i></i><i></i><i></i><i></i></div><i class="sk-comment"></i></div>';}
function showFriendSkeleton(id){var nm=friendName(id);layerBase(avatarHTML(id,false,'basic')+'<span>'+esc(nm)+'</span>','<div class="story-view-scroll">'+storySkeletonHTML()+'</div>','');}
function uploadClosing(c){var db=DB(),a=AC();if(!db||!a.uid){c.storySync='pending';B.save();syncBanner();return Promise.resolve(false);}var row=rowForUpload(c);function insertRow(x){return db.from('day_closings').insert(x).select('*').single();}return insertRow(row).then(function(r){if(r.error)throw r.error;c.serverId=r.data.id;c.storySync='synced';if(r.data&&validMood(r.data.nemo_mood))c.nemoMood=r.data.nemo_mood;B.save();syncBanner();return true;}).catch(function(e){var msg=String(e&&e.message||e||'');if(/nemo_mood|schema cache|PGRST204|42703/i.test(msg)){var legacy=Object.assign({},row);delete legacy.nemo_mood;return insertRow(legacy).then(function(r){if(r.error)throw r.error;c.serverId=r.data.id;c.storySync='synced';B.save();syncBanner();return true;});}if(/duplicate|23505/i.test(msg)){return db.from('day_closings').select('id').eq('user_id',a.uid).eq('date',c.date||c.key).maybeSingle().then(function(r){if(r&&r.data){c.serverId=r.data.id;c.storySync='synced';B.save();syncBanner();return true;}c.storySync='pending';B.save();syncBanner();return false;});}c.storySync='pending';B.save();syncBanner();if(B.toast)B.toast('카드는 이 기기에 저장했어요');return false;});}

function loadOwnReactions(cid){var db=DB();if(!db)return;db.from('story_reactions').select('closing_id,from_user_id,emoji,created_at').eq('closing_id',cid).order('created_at',{ascending:true}).then(function(r){if(r.error)throw r.error;ST.ownReactions=r.data||[];var box=document.getElementById('story-own-reactions');if(box)box.innerHTML=ownReactionListHTML();}).catch(function(){var box=document.getElementById('story-own-reactions');if(box)box.innerHTML='<p class="story-reaction-empty">반응을 불러오지 못했어요.</p>';});}
function loadStories(force){var db=DB(),a=AC(),mine=closeFor(B.todayKey());if(!mine||!db||!a.uid){ST.loading=false;ST.loaded=true;ST.stories=[];ST.error='';decorate();return Promise.resolve([]);}if(!force&&ST.loading)return Promise.resolve(ST.stories);ST.loading=true;decorate();var cut=new Date(Date.now()-86400000).toISOString();return db.from('day_closings').select('*').eq('date',B.todayKey()).eq('visibility','friends').gte('closed_at',cut).neq('user_id',a.uid).order('closed_at',{ascending:false}).then(function(r){if(r.error)throw r.error;var friendIds=(FS().friends||[]).map(function(f){return f.id;}),rows=(r.data||[]).filter(function(x){return friendIds.indexOf(x.user_id)>=0;});ST.stories=rows.map(fromServer);ST.loaded=true;ST.loading=false;ST.error='';ST.lastLoad=Date.now();var ids=ST.stories.map(function(x){return x.serverId;});if(!ids.length){ST.reactions=[];decorate();return ST.stories;}return db.from('story_reactions').select('closing_id,from_user_id,emoji,created_at').in('closing_id',ids).then(function(q){if(!q.error)ST.reactions=q.data||[];decorate();return ST.stories;});}).catch(function(){ST.loading=false;ST.loaded=true;ST.error='network';ST.stories=[];decorate();return [];});}
function sendReaction(cid,mood){var db=DB(),a=AC();if(!db||!a.uid)return;if(sentReaction(cid)){if(B.toast)B.toast('이 스토리에는 이미 반응했어');return;}db.from('story_reactions').insert({closing_id:cid,from_user_id:a.uid,emoji:mood}).select('closing_id,from_user_id,emoji,created_at').single().then(function(r){if(r.error)throw r.error;ST.reactions.push(r.data);if(B.toast)B.toast('반응을 보냈어');drawFriendViewer();}).catch(function(e){var m=String(e&&e.message||e||'');if(/duplicate|23505/i.test(m)){if(B.toast)B.toast('이 스토리에는 이미 반응했어');loadStories(true).then(drawFriendViewer);}else if(B.toast)B.toast('반응을 보내지 못했어요');});}
function composer(){var k=B.todayKey(),old=closeFor(k);if(old){viewOwn(old);return;}var st=B.dayCloseStats(k);if(st.done===0&&!window.confirm('아직 완료한 게 없어. 그래도 마감할래?'))return;var d=snap(k);window.__planonCloseDraft=d;B.openModal('<h3>오늘 마감하기</h3><p class="hint">지금 상태로 카드 숫자가 저장돼요. 이후 기록을 바꿔도 이 카드는 바뀌지 않아요.</p><div class="story-compose-preview" id="story-compose-preview">'+cardHTML(d)+'</div><div class="story-compose-note"><input id="f-story-comment" maxlength="40" placeholder="오늘의 한 줄 · 선택"></div><div class="story-visibility-actions"><button class="private" data-story-act="finish-private">나만 보기</button><button class="friends" data-story-act="finish-friends">친구에게 올리기</button></div>');}
function finish(vis){var d=window.__planonCloseDraft;if(!d)return;var f=document.getElementById('f-story-comment');d.comment=(f&&f.value||'').trim().slice(0,40);d.visibility=vis;var arr=S().dayCloses||(S().dayCloses=[]),existing=closeFor(d.key);if(existing){B.closeModal();viewOwn(existing);return;}var legacy=legacyCloseFor(d.key);if(legacy){Object.assign(legacy,d);d=legacy;}else arr.push(d);B.save();B.closeModal();try{U().dayFullView='';}catch(e){}B.render();uploadClosing(d).then(function(){if(vis==='friends')loadStories(true);});viewOwn(d);if(B.toast)B.toast(vis==='friends'?'오늘 마감했어요 · 친구에게 올렸어요':'오늘 마감했어요 · 나만 보기로 저장했어요');}
function lockPrompt(){B.openModal('<h3>친구 스토리는 오늘 마감 후에</h3><p class="hint">오늘 마감하면 친구들 하루를 볼 수 있어.</p><div class="acts"><button class="b-ghost" data-act="close">나중에</button><button class="b-save" data-story-act="close-from-lock">오늘 마감하기</button></div>');}
function goFriends(){var u=U();u.tab='friends';u.friendsPage='';u.settingsPage='';B.closeModal();B.render(true);}
function ownStoryRowHTML(mine){var mood=mine?closingMood(mine):liveOwnMood(),act=mine?'view-own':'close-day',name=(String((S().settings&&S().settings.profileName)||'').trim()||'나'),sub=mine?'오늘 마감 완료 · 카드 보기':'오늘 마감하면 스토리가 저장돼';return '<div class="story-my-block"><div class="story-strip-head"><b>내 스토리</b><small>오늘의 내 네모</small></div><button class="story-my-button" data-story-act="'+act+'"><span class="story-avatar story-avatar-nemo story-avatar-large">'+storyNemoHTML(mood,'')+'</span><span class="story-my-copy"><b>'+esc(name)+'</b><small>'+esc(sub)+'</small></span><em>'+(mine?'카드 보기':'오늘 마감하기')+'</em></button></div>';}
function lockedFriendHTML(f){return '<button data-story-act="locked-story">'+avatarHTML(f.id,false,'basic')+'<span>'+esc(friendName(f.id))+'</span></button>';}
function friendStoryHTML(c){return '<button data-story-act="view-friend-story" data-id="'+esc(c.userId)+'">'+avatarHTML(c.userId,false,closingMood(c))+'<span>'+esc(friendName(c.userId))+'</span></button>';}
function stripHTML(){var mine=closeFor(B.todayKey()),friends=FS().friends||[],own=ownStoryRowHTML(mine),head='<div class="story-strip-head"><b>친구 스토리</b>';if(!friends.length)return '<section class="card friend-story-strip">'+own+'<div class="story-friends-block">'+head+'</div><div class="story-zero"><span>초대코드로 친구를 연결해봐</span><button data-story-act="go-friends">친구 연결</button></div></div></section>';if(!mine)return '<section class="card friend-story-strip">'+own+'<div class="story-friends-block">'+head+'<small>오늘 마감 후 열림</small></div><div class="story-circles locked">'+friends.slice(0,8).map(lockedFriendHTML).join('')+'</div><p class="story-lock-copy">오늘 마감하면 친구들의 하루를 볼 수 있어</p></div></section>';if(ST.loading)return '<section class="card friend-story-strip">'+own+'<div class="story-friends-block">'+head+'</div><div class="story-strip-skeleton"><i></i><i></i><i></i><i></i></div></div></section>';if(ST.error)return '<section class="card friend-story-strip">'+own+'<div class="story-friends-block">'+head+'</div><div class="story-zero"><span>스토리를 불러오지 못했어요</span><button data-story-act="reload-stories">다시 시도</button></div></div></section>';if(!ST.stories.length)return '<section class="card friend-story-strip">'+own+'<div class="story-friends-block">'+head+'</div><p class="story-none">아직 오늘 마감한 친구가 없어</p></div></section>';return '<section class="card friend-story-strip">'+own+'<div class="story-friends-block">'+head+'<small>'+ST.stories.length+'명</small></div><div class="story-circles">'+ST.stories.map(friendStoryHTML).join('')+'</div></div></section>';}

function decorate(){syncBanner();var main=document.getElementById('main'),u=U();if(!main||!u)return;var old=document.getElementById('planon-day-close-fixed');if(old)old.remove();var strip=main.querySelector('.friend-story-strip');if(strip)strip.remove();var hist=main.querySelector('.day-close-history');if(hist)hist.remove();document.body.classList.remove('planon-day-close-visible');

  /* 스토리 UI는 친구 탭의 부가 기능으로만 보여줘요. */
  if(u.tab==='friends'&&!u.friendsPage){
    var wrap=document.createElement('div');
    wrap.innerHTML=stripHTML();
    var storyEl=wrap.firstElementChild;
    if(storyEl)main.insertBefore(storyEl,main.firstChild);
    if(closeFor(B.todayKey())&&!ST.loaded&&!ST.loading)setTimeout(function(){loadStories(false);},60);
    return;
  }

  /* 일간 화면은 기존 플래너 UI를 유지하고 하단의 '오늘 마감하기'만 제공해요. */
  if(u.tab!=='day')return;
  var k=B.dkey(u.date),tk=B.todayKey(),c=closeFor(k),closedView=!!main.querySelector('.closed-day');
  if(k===tk){
    var bar=document.createElement('div');
    bar.id='planon-day-close-fixed';
    bar.className='day-close-fixed';
    bar.innerHTML='<button '+(c?'class="done" data-story-act="view-own"':'data-story-act="close-day"')+'>'+(c?'오늘 마감 완료 ✓ 카드 보기':'오늘 마감하기')+'</button>';
    main.appendChild(bar);
    document.body.classList.add('planon-day-close-visible');
  }else if(c&&!closedView){
    var btn=document.createElement('button');
    btn.className='day-close-history';
    btn.dataset.storyAct='view-date';
    btn.dataset.date=k;
    btn.textContent='이날 마감 카드 보기';
    var dg2=main.querySelector('.dayg');
    if(dg2)main.insertBefore(btn,dg2);else main.prepend(btn);
  }
}
var q=false,storyObserver=null,storyWatchTimer=null;function watchStory(){var main=document.getElementById('main');if(main&&storyObserver)storyObserver.observe(main,{childList:true,subtree:true});}function decorateSafe(){if(storyObserver)storyObserver.disconnect();decorate();clearTimeout(storyWatchTimer);storyWatchTimer=setTimeout(watchStory,0);}function queue(){if(q)return;q=true;setTimeout(function(){q=false;decorateSafe();},35);}var main=document.getElementById('main');if(main){storyObserver=new MutationObserver(queue);watchStory();}
document.addEventListener('input',function(e){if(e.target&&e.target.id==='f-story-comment'&&window.__planonCloseDraft){window.__planonCloseDraft.comment=(e.target.value||'').slice(0,40);var p=document.getElementById('story-compose-preview');if(p)p.innerHTML=cardHTML(window.__planonCloseDraft);}});
var fixedStoryTapAt=0;
function handleStoryAction(a){
  if(!a)return;
  var x=a.dataset.storyAct;
  if(x==='close-day')composer();
  else if(x==='finish-private')finish('private');
  else if(x==='finish-friends')finish('friends');
  else if(x==='view-own')viewOwn(closeFor(B.todayKey()));
  else if(x==='view-date')viewOwn(closeFor(a.dataset.date));
  else if(x==='locked-story')lockPrompt();
  else if(x==='close-from-lock'){B.closeModal();composer();}
  else if(x==='go-friends')goFriends();
  else if(x==='reload-stories')loadStories(true);
  else if(x==='view-friend-story')viewFriend(a.dataset.id);
  else if(x==='story-prev'){if(ST.viewIndex>0){ST.viewIndex--;drawFriendViewer();}}
  else if(x==='story-next'){if(ST.viewIndex<ST.stories.length-1){ST.viewIndex++;drawFriendViewer();}}
  else if(x==='react')sendReaction(a.dataset.closing,a.dataset.mood);
  else if(x==='close-layer')closeLayer();
}
/* iPhone Safari에서 fixed 하단 버튼이 click까지 못 가는 경우가 있어 pointerup에서 먼저 처리해요. */
document.addEventListener('pointerup',function(e){
  var a=e.target.closest&&e.target.closest('#planon-day-close-fixed [data-story-act]');
  if(!a)return;
  fixedStoryTapAt=Date.now();
  e.preventDefault();
  e.stopPropagation();
  handleStoryAction(a);
},true);
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('[data-story-act]');if(!a)return;
  if(a.closest&&a.closest('#planon-day-close-fixed')&&Date.now()-fixedStoryTapAt<700){e.preventDefault();return;}
  e.preventDefault();
  handleStoryAction(a);
});
window.addEventListener('planon:studydaychange',function(){
  ST.loading=false;ST.loaded=false;ST.stories=[];ST.reactions=[];ST.ownReactions=[];ST.error='';ST.lastLoad=0;
  closeLayer();decorateSafe();
  pullOwnToday().then(function(){return retryPending();}).then(function(){if(closeFor(B.todayKey()))return loadStories(true);});
});
window.addEventListener('online',function(){retryPending();});
document.addEventListener('visibilitychange',function(){if(!document.hidden)retryPending();});
setInterval(function(){if(navigator.onLine!==false)retryPending();},30000);
setTimeout(function(){pullOwnToday().then(function(){return retryPending();}).then(function(){if(closeFor(B.todayKey()))return loadStories(false);});},1800);
window.PLANON_DAY_STORY={cardHTML:cardHTML,openClose:composer,view:viewOwn,closeFor:closeFor,load:loadStories,upload:uploadClosing,retry:retryPending,decorate:decorateSafe};decorateSafe();syncBanner();
})();