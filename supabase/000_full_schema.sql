-- PLAN:ON canonical full schema for a fresh Supabase project
-- 2026-09-25. Run this ONCE on a new project. Existing projects should use 001_current_migration.sql.
begin;
create extension if not exists pgcrypto;

create table if not exists public.planner (
  user_id uuid primary key references auth.users(id) on delete cascade,
  json text not null default '{}',
  updated_at bigint not null default 0
);
create table if not exists public.planner_snapshots (
  user_id uuid not null references auth.users(id) on delete cascade,
  date text not null,
  json text not null,
  updated_at bigint not null default 0,
  primary key(user_id,date)
);
create table if not exists public.planner_friend_codes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code text not null unique,
  display_name text,
  photo text,
  updated_at timestamptz not null default now()
);
create table if not exists public.planner_friend_invites (
  id uuid primary key default gen_random_uuid(),
  from_user uuid not null references auth.users(id) on delete cascade,
  to_user uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check(status in ('pending','accepted','declined','cancelled')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  unique(from_user,to_user),
  check(from_user<>to_user)
);
create table if not exists public.planner_friendships (
  user_a uuid not null references auth.users(id) on delete cascade,
  user_b uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_a,user_b),
  check(user_a<>user_b)
);
create table if not exists public.planner_friend_busy (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.planner_friend_shares (
  owner_id uuid not null references auth.users(id) on delete cascade,
  friend_id uuid not null references auth.users(id) on delete cascade,
  share_calendar boolean not null default false,
  share_planner boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key(owner_id,friend_id)
);
create table if not exists public.planner_friend_data (
  owner_id uuid not null references auth.users(id) on delete cascade,
  friend_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key(owner_id,friend_id,kind)
);
create table if not exists public.planner_friend_memories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  friend_id uuid not null references auth.users(id) on delete cascade,
  line text,
  station text,
  visited_at date,
  place text,
  what text,
  photo text,
  created_at timestamptz not null default now()
);
create table if not exists public.planner_appointment_requests (
  id uuid primary key default gen_random_uuid(),
  from_user uuid not null references auth.users(id) on delete cascade,
  to_user uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check(status in ('pending','accepted','declined','cancelled')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check(from_user<>to_user)
);
create table if not exists public.planner_shared_appointments (
  request_id uuid primary key references public.planner_appointment_requests(id) on delete cascade,
  user_a uuid not null references auth.users(id) on delete cascade,
  user_b uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.planner_meet_links (
  token uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'open' check(status in ('open','closed')),
  final jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.planner_meet_answers (
  id uuid primary key default gen_random_uuid(),
  token uuid not null references public.planner_meet_links(token) on delete cascade,
  name text not null check(char_length(name) between 1 and 30),
  slots jsonb not null default '[]'::jsonb,
  secret uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.planner_friend_cheers (
  id uuid primary key default gen_random_uuid(),
  from_user uuid not null references auth.users(id) on delete cascade,
  to_user uuid not null references auth.users(id) on delete cascade,
  message text not null check(char_length(message) between 1 and 100),
  deliver_date date not null,
  notified_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  unique(from_user,to_user,deliver_date), check(from_user<>to_user)
);
create table if not exists public.planner_user_blocks (
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(blocker_id,blocked_id), check(blocker_id<>blocked_id)
);
create table if not exists public.planner_user_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reported_id uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  details text,
  created_at timestamptz not null default now(),
  check(reporter_id<>reported_id)
);

create table if not exists public.day_closings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  closed_at timestamptz not null default now(),
  done_count integer not null default 0 check(done_count>=0),
  total_count integer not null default 0 check(total_count>=0),
  core_done integer not null default 0 check(core_done>=0),
  core_total integer not null default 0 check(core_total>=0 and core_total<=3),
  study_minutes integer check(study_minutes is null or study_minutes>=0),
  wake_time text,
  nemo_mood text check(nemo_mood is null or nemo_mood in ('basic','happy','proud','sad','gloomy','angry','sleepy')),
  nemo_color text check(nemo_color is null or nemo_color ~ '^#[0-9A-Fa-f]{6}$'),
  comment text check(comment is null or char_length(comment)<=40),
  visibility text not null default 'private' check(visibility in ('friends','private')),
  created_at timestamptz not null default now(),
  unique(user_id,date)
);

alter table public.day_closings add column if not exists nemo_mood text;
alter table public.day_closings add column if not exists nemo_color text;
create table if not exists public.story_reactions (
  id uuid primary key default gen_random_uuid(),
  closing_id uuid not null references public.day_closings(id) on delete cascade,
  from_user_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null check(emoji in ('basic','happy','proud','sad','gloomy','angry','sleepy')),
  created_at timestamptz not null default now(),
  unique(closing_id,from_user_id)
);

-- Future-ready Market server tables. Current beta app stores test entitlements inside planner JSON;
-- real payment integration can move authoritative entitlements here later without changing catalog data.
create table if not exists public.planon_market_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  amount integer not null default 0,
  currency text not null default 'KRW',
  provider text not null,
  provider_order_id text,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);
create table if not exists public.planon_market_entitlements (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  source text not null default 'purchase',
  granted_at timestamptz not null default now(),
  primary key(user_id,product_id)
);

-- indexes
create index if not exists idx_friend_invites_to on public.planner_friend_invites(to_user,status);
create index if not exists idx_appointments_to on public.planner_appointment_requests(to_user,status);
create index if not exists idx_memories_pair on public.planner_friend_memories(owner_id,friend_id,visited_at);
create index if not exists idx_cheers_due on public.planner_friend_cheers(to_user,deliver_date,notified_at);
create index if not exists idx_day_closings_active on public.day_closings(date,visibility,closed_at desc);
create index if not exists idx_story_reactions_closing on public.story_reactions(closing_id,created_at);

create or replace function public.planner_are_friends(a uuid,b uuid) returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.planner_friendships f where (f.user_a=a and f.user_b=b) or (f.user_a=b and f.user_b=a));$$;
revoke all on function public.planner_are_friends(uuid,uuid) from public; grant execute on function public.planner_are_friends(uuid,uuid) to authenticated;

create or replace function public.planon_study_date_kr() returns date language sql stable as $$select ((now() at time zone 'Asia/Seoul') - interval '5 hours')::date;$$;
revoke all on function public.planon_study_date_kr() from public; grant execute on function public.planon_study_date_kr() to authenticated;

create or replace function public.planner_has_closed_day(u uuid,d date) returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.day_closings c where c.user_id=u and c.date=d);$$;
create or replace function public.planner_owns_closing(u uuid,cid uuid) returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.day_closings c where c.id=cid and c.user_id=u);$$;
create or replace function public.planner_can_view_closing(viewer uuid,cid uuid) returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.day_closings c where c.id=cid and c.user_id<>viewer and c.visibility='friends' and c.closed_at>now()-interval '24 hours' and public.planner_are_friends(viewer,c.user_id) and public.planner_has_closed_day(viewer,public.planon_study_date_kr()));$$;
revoke all on function public.planner_has_closed_day(uuid,date) from public; revoke all on function public.planner_owns_closing(uuid,uuid) from public; revoke all on function public.planner_can_view_closing(uuid,uuid) from public;
grant execute on function public.planner_has_closed_day(uuid,date),public.planner_owns_closing(uuid,uuid),public.planner_can_view_closing(uuid,uuid) to authenticated;


-- RLS enable
alter table public.planner enable row level security; alter table public.planner_snapshots enable row level security;
alter table public.planner_friend_codes enable row level security; alter table public.planner_friend_invites enable row level security;
alter table public.planner_friendships enable row level security; alter table public.planner_friend_busy enable row level security;
alter table public.planner_friend_shares enable row level security; alter table public.planner_friend_data enable row level security;
alter table public.planner_friend_memories enable row level security; alter table public.planner_appointment_requests enable row level security;
alter table public.planner_shared_appointments enable row level security; alter table public.planner_meet_links enable row level security;
alter table public.planner_meet_answers enable row level security; alter table public.planner_friend_cheers enable row level security;
alter table public.planner_user_blocks enable row level security; alter table public.planner_user_reports enable row level security;
alter table public.day_closings enable row level security; alter table public.story_reactions enable row level security;
alter table public.planon_market_orders enable row level security; alter table public.planon_market_entitlements enable row level security;

-- own planner/backups
create policy planner_own_all on public.planner for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy snapshots_own_all on public.planner_snapshots for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
-- friend codes are discoverable by authenticated users; only owner can write
create policy friend_codes_read on public.planner_friend_codes for select to authenticated using(true);
create policy friend_codes_write on public.planner_friend_codes for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
-- invites
create policy invites_read on public.planner_friend_invites for select to authenticated using(auth.uid() in (from_user,to_user));
create policy invites_insert on public.planner_friend_invites for insert to authenticated with check(from_user=auth.uid() and to_user<>auth.uid() and status='pending');
create policy invites_update_recipient on public.planner_friend_invites for update to authenticated using(to_user=auth.uid() and status='pending') with check(to_user=auth.uid() and status in ('accepted','declined'));
create policy invites_update_sender on public.planner_friend_invites for update to authenticated using(from_user=auth.uid() and status in ('pending','cancelled','declined')) with check(from_user=auth.uid() and status in ('pending','cancelled'));
-- friendships
create policy friendships_read on public.planner_friendships for select to authenticated using(auth.uid() in (user_a,user_b));
create policy friendships_insert on public.planner_friendships for insert to authenticated with check(auth.uid() in (user_a,user_b) and user_a<>user_b and exists(select 1 from public.planner_friend_invites i where i.status='pending' and i.to_user=auth.uid() and i.from_user=case when user_a=auth.uid() then user_b else user_a end));
create policy friendships_delete on public.planner_friendships for delete to authenticated using(auth.uid() in (user_a,user_b));
-- busy
create policy busy_read on public.planner_friend_busy for select to authenticated using(user_id=auth.uid() or public.planner_are_friends(auth.uid(),user_id));
create policy busy_write on public.planner_friend_busy for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
-- shares/data
create policy shares_read on public.planner_friend_shares for select to authenticated using(owner_id=auth.uid() or friend_id=auth.uid());
create policy shares_write on public.planner_friend_shares for all to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid() and public.planner_are_friends(owner_id,friend_id));
create policy friend_data_read on public.planner_friend_data for select to authenticated using(owner_id=auth.uid() or (friend_id=auth.uid() and public.planner_are_friends(owner_id,friend_id)));
create policy friend_data_write on public.planner_friend_data for all to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid() and public.planner_are_friends(owner_id,friend_id));
-- memories
create policy memories_read on public.planner_friend_memories for select to authenticated using(auth.uid() in (owner_id,friend_id));
create policy memories_write on public.planner_friend_memories for all to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid() and public.planner_are_friends(owner_id,friend_id));
-- appointment requests/shared
create policy appointment_read on public.planner_appointment_requests for select to authenticated using(auth.uid() in (from_user,to_user));
create policy appointment_insert on public.planner_appointment_requests for insert to authenticated with check(from_user=auth.uid() and to_user<>auth.uid() and status='pending');
create policy appointment_update on public.planner_appointment_requests for update to authenticated using(auth.uid() in (from_user,to_user)) with check(auth.uid() in (from_user,to_user));
create policy shared_read on public.planner_shared_appointments for select to authenticated using(auth.uid() in (user_a,user_b));
create policy shared_write on public.planner_shared_appointments for all to authenticated using(auth.uid() in (user_a,user_b)) with check(auth.uid() in (user_a,user_b));
-- meet links/answers owner only direct table access; guests use RPCs
create policy meet_links_owner on public.planner_meet_links for all to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid());
create policy meet_answers_owner_read on public.planner_meet_answers for select to authenticated using(exists(select 1 from public.planner_meet_links l where l.token=planner_meet_answers.token and l.owner_id=auth.uid()));
-- cheers
create policy cheers_insert_friend on public.planner_friend_cheers for insert to authenticated with check(auth.uid()=from_user and public.planner_are_friends(auth.uid(),to_user) and deliver_date=public.planon_study_date_kr()+1);
create policy cheers_select_receiver on public.planner_friend_cheers for select to authenticated using(auth.uid()=to_user);
create policy cheers_update_receiver on public.planner_friend_cheers for update to authenticated using(auth.uid()=to_user) with check(auth.uid()=to_user);
-- safety
create policy blocks_own on public.planner_user_blocks for all to authenticated using(blocker_id=auth.uid()) with check(blocker_id=auth.uid());
create policy reports_insert on public.planner_user_reports for insert to authenticated with check(reporter_id=auth.uid());
create policy reports_read_own on public.planner_user_reports for select to authenticated using(reporter_id=auth.uid());
-- day closing stories
create policy day_closings_owner_select on public.day_closings for select to authenticated using(user_id=auth.uid());
create policy day_closings_owner_insert on public.day_closings for insert to authenticated with check(user_id=auth.uid());
create policy day_closings_friend_select on public.day_closings for select to authenticated using(user_id<>auth.uid() and visibility='friends' and closed_at>now()-interval '24 hours' and public.planner_are_friends(auth.uid(),user_id) and public.planner_has_closed_day(auth.uid(),public.planon_study_date_kr()));
create policy story_reactions_select on public.story_reactions for select to authenticated using(from_user_id=auth.uid() or public.planner_owns_closing(auth.uid(),closing_id));
create policy story_reactions_insert on public.story_reactions for insert to authenticated with check(from_user_id=auth.uid() and public.planner_can_view_closing(auth.uid(),closing_id));

-- market future tables (current client does not write them)
create policy market_orders_own_read on public.planon_market_orders for select to authenticated using(user_id=auth.uid());
create policy market_entitlements_own_read on public.planon_market_entitlements for select to authenticated using(user_id=auth.uid());

-- Guest meet-link RPCs
create or replace function public.planner_meet_get(t uuid) returns jsonb language plpgsql security definer set search_path=public as $$declare l public.planner_meet_links; a jsonb; begin select * into l from public.planner_meet_links where token=t; if not found then return null; end if; select coalesce(jsonb_agg(jsonb_build_object('id',id,'token',token,'name',name,'slots',slots,'created_at',created_at)),'[]'::jsonb) into a from public.planner_meet_answers where token=t; return jsonb_build_object('token',l.token,'payload',l.payload,'status',l.status,'final',l.final,'created_at',l.created_at,'answers',a); end;$$;
create or replace function public.planner_meet_answer(t uuid,n text,s jsonb,aid uuid default null,sec uuid default null) returns jsonb language plpgsql security definer set search_path=public as $$declare l public.planner_meet_links; rid uuid; rsec uuid; begin select * into l from public.planner_meet_links where token=t; if not found then raise exception 'not found'; end if; if l.status<>'open' then raise exception 'closed'; end if; if aid is not null then update public.planner_meet_answers set name=left(n,30),slots=s,updated_at=now() where id=aid and token=t and secret=sec returning id,secret into rid,rsec; if rid is null then raise exception 'invalid answer secret'; end if; else insert into public.planner_meet_answers(token,name,slots) values(t,left(n,30),s) returning id,secret into rid,rsec; end if; return jsonb_build_object('id',rid,'secret',rsec); end;$$;
revoke all on function public.planner_meet_get(uuid) from public; grant execute on function public.planner_meet_get(uuid) to anon,authenticated;
revoke all on function public.planner_meet_answer(uuid,text,jsonb,uuid,uuid) from public; grant execute on function public.planner_meet_answer(uuid,text,jsonb,uuid,uuid) to anon,authenticated;

-- Account deletion RPC: deletes app rows, then auth account itself.
create or replace function public.planner_delete_my_account() returns void language plpgsql security definer set search_path=public as $$declare u uuid:=auth.uid(); begin if u is null then raise exception 'not authenticated'; end if; delete from public.story_reactions where from_user_id=u or closing_id in (select id from public.day_closings where user_id=u); delete from public.day_closings where user_id=u; delete from public.planner_user_reports where reporter_id=u or reported_id=u; delete from public.planner_user_blocks where blocker_id=u or blocked_id=u; delete from public.planner_friend_cheers where from_user=u or to_user=u; delete from public.planner_meet_links where owner_id=u; delete from public.planner_shared_appointments where user_a=u or user_b=u; delete from public.planner_appointment_requests where from_user=u or to_user=u; delete from public.planner_friend_memories where owner_id=u or friend_id=u; delete from public.planner_friend_data where owner_id=u or friend_id=u; delete from public.planner_friend_shares where owner_id=u or friend_id=u; delete from public.planner_friend_busy where user_id=u; delete from public.planner_friendships where user_a=u or user_b=u; delete from public.planner_friend_invites where from_user=u or to_user=u; delete from public.planner_friend_codes where user_id=u; delete from public.planner_snapshots where user_id=u; delete from public.planner where user_id=u; delete from public.planon_market_orders where user_id=u; delete from public.planon_market_entitlements where user_id=u; delete from auth.users where id=u; end;$$;
revoke all on function public.planner_delete_my_account() from public; grant execute on function public.planner_delete_my_account() to authenticated;

-- grants
grant select,insert,update,delete on public.planner,public.planner_snapshots,public.planner_friend_codes,public.planner_friend_invites,public.planner_friendships,public.planner_friend_busy,public.planner_friend_shares,public.planner_friend_data,public.planner_friend_memories,public.planner_appointment_requests,public.planner_shared_appointments,public.planner_meet_links,public.planner_meet_answers,public.planner_friend_cheers,public.planner_user_blocks,public.planner_user_reports to authenticated;
grant select,insert on public.day_closings,public.story_reactions to authenticated;
grant select on public.planon_market_orders,public.planon_market_entitlements to authenticated;
commit;


-- PLAN:ON Social Stories patch (20260926-0855)
-- 여러 번 실행해도 안전합니다.
begin;

create or replace function public.planon_publish_my_day_closing(p_id uuid)
returns public.day_closings
language plpgsql
security definer
set search_path = public
as $$
declare r public.day_closings;
begin
  update public.day_closings set visibility='friends'
   where id=p_id and user_id=auth.uid() and visibility='private'
     and date=public.planon_study_date_kr()
  returning * into r;
  if r.id is null then
    select * into r from public.day_closings
     where id=p_id and user_id=auth.uid() and visibility='friends' limit 1;
  end if;
  if r.id is null then raise exception 'closing_not_publishable'; end if;
  return r;
end;
$$;
revoke all on function public.planon_publish_my_day_closing(uuid) from public;
grant execute on function public.planon_publish_my_day_closing(uuid) to authenticated;

create table if not exists public.appointment_stories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  friend_id uuid not null references auth.users(id) on delete cascade,
  source_key text not null,
  event_date date not null,
  start_time text,
  end_time text,
  place text,
  what text,
  pose text not null default 'basic' check(pose in ('basic','cafe','study','walk')),
  owner_name text,
  friend_name text,
  owner_color text check(owner_color is null or owner_color ~ '^#[0-9A-Fa-f]{6}$'),
  friend_color text check(friend_color is null or friend_color ~ '^#[0-9A-Fa-f]{6}$'),
  created_at timestamptz not null default now(),
  unique(owner_id,source_key),
  check(owner_id<>friend_id)
);

create table if not exists public.appointment_story_reactions (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.appointment_stories(id) on delete cascade,
  from_user_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null check(emoji in ('heart','clap','sparkle')),
  created_at timestamptz not null default now(),
  unique(story_id,from_user_id)
);

create index if not exists idx_appointment_stories_recent on public.appointment_stories(created_at desc,owner_id);
create index if not exists idx_appointment_story_reactions_story on public.appointment_story_reactions(story_id,created_at);

alter table public.appointment_stories enable row level security;
alter table public.appointment_story_reactions enable row level security;

drop policy if exists appointment_stories_owner_select on public.appointment_stories;
drop policy if exists appointment_stories_friend_select on public.appointment_stories;
drop policy if exists appointment_stories_owner_insert on public.appointment_stories;
drop policy if exists appointment_stories_owner_delete on public.appointment_stories;
create policy appointment_stories_owner_select on public.appointment_stories for select to authenticated using(owner_id=auth.uid());
create policy appointment_stories_friend_select on public.appointment_stories for select to authenticated using(owner_id<>auth.uid() and created_at>now()-interval '24 hours' and public.planner_are_friends(auth.uid(),owner_id) and public.planner_has_closed_day(auth.uid(),public.planon_study_date_kr()));
create policy appointment_stories_owner_insert on public.appointment_stories for insert to authenticated with check(owner_id=auth.uid() and public.planner_are_friends(owner_id,friend_id));
create policy appointment_stories_owner_delete on public.appointment_stories for delete to authenticated using(owner_id=auth.uid());

drop policy if exists appointment_story_reactions_select on public.appointment_story_reactions;
drop policy if exists appointment_story_reactions_insert on public.appointment_story_reactions;
create policy appointment_story_reactions_select on public.appointment_story_reactions for select to authenticated using(from_user_id=auth.uid() or exists(select 1 from public.appointment_stories s where s.id=story_id and s.owner_id=auth.uid()));
create policy appointment_story_reactions_insert on public.appointment_story_reactions for insert to authenticated with check(from_user_id=auth.uid() and exists(select 1 from public.appointment_stories s where s.id=story_id and s.owner_id<>auth.uid() and s.created_at>now()-interval '24 hours' and public.planner_are_friends(auth.uid(),s.owner_id) and public.planner_has_closed_day(auth.uid(),public.planon_study_date_kr())));

grant select,insert,delete on public.appointment_stories to authenticated;
grant select,insert on public.appointment_story_reactions to authenticated;

commit;
