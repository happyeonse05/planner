-- PLAN:ON PRODUCTION MIGRATION — 2026-09-26
-- Existing production DB only. Single source of truth for this release.
-- Review MIGRATION_README.md, take a Supabase backup, then run this file ONCE in SQL Editor.
-- This file intentionally consolidates the current migration + final additive story/location/together patches.

begin;

-- PLAN:ON CURRENT PRODUCTION MIGRATION (2026-09-25)
-- Existing DB: adds missing columns/tables/functions and fixes current policies/messages.
begin;
create extension if not exists pgcrypto;

-- Ensure optional columns used by current app exist.
alter table if exists public.planner_friend_codes add column if not exists display_name text;
alter table if exists public.planner_friend_codes add column if not exists photo text;
alter table if exists public.planner_friend_codes add column if not exists updated_at timestamptz not null default now();
alter table if exists public.planner_friend_memories add column if not exists photo text;
alter table if exists public.planner_appointment_requests add column if not exists responded_at timestamptz;
alter table if exists public.planner_shared_appointments add column if not exists updated_at timestamptz not null default now();
alter table if exists public.planner_meet_links add column if not exists updated_at timestamptz not null default now();

create table if not exists public.planner_user_blocks(blocker_id uuid not null references auth.users(id) on delete cascade,blocked_id uuid not null references auth.users(id) on delete cascade,created_at timestamptz not null default now(),primary key(blocker_id,blocked_id),check(blocker_id<>blocked_id));
create table if not exists public.planner_user_reports(id uuid primary key default gen_random_uuid(),reporter_id uuid not null references auth.users(id) on delete cascade,reported_id uuid not null references auth.users(id) on delete cascade,reason text not null,details text,created_at timestamptz not null default now(),check(reporter_id<>reported_id));
create table if not exists public.planner_friend_cheers(id uuid primary key default gen_random_uuid(),from_user uuid not null references auth.users(id) on delete cascade,to_user uuid not null references auth.users(id) on delete cascade,message text not null check(char_length(message) between 1 and 100),deliver_date date not null,notified_at timestamptz,read_at timestamptz,created_at timestamptz not null default now(),unique(from_user,to_user,deliver_date),check(from_user<>to_user));
create table if not exists public.planon_market_orders(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,product_id text not null,amount integer not null default 0,currency text not null default 'KRW',provider text not null,provider_order_id text,status text not null default 'paid',created_at timestamptz not null default now());
create table if not exists public.planon_market_entitlements(user_id uuid not null references auth.users(id) on delete cascade,product_id text not null,source text not null default 'purchase',granted_at timestamptz not null default now(),primary key(user_id,product_id));

create or replace function public.planner_are_friends(a uuid,b uuid) returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.planner_friendships f where (f.user_a=a and f.user_b=b) or (f.user_a=b and f.user_b=a));$$;
revoke all on function public.planner_are_friends(uuid,uuid) from public; grant execute on function public.planner_are_friends(uuid,uuid) to authenticated;

create or replace function public.planon_study_date_kr() returns date language sql stable as $$select ((now() at time zone 'Asia/Seoul') - interval '5 hours')::date;$$;
revoke all on function public.planon_study_date_kr() from public; grant execute on function public.planon_study_date_kr() to authenticated;

-- Remove old permissive policies from the high-risk friendship/request tables before recreating canonical ones.
do $$declare r record; begin for r in select schemaname,tablename,policyname from pg_policies where schemaname='public' and tablename in ('planner_friendships','planner_friend_invites','planner_friend_busy','planner_appointment_requests','planner_friend_cheers','planner_user_blocks','planner_user_reports') loop execute format('drop policy if exists %I on %I.%I',r.policyname,r.schemaname,r.tablename); end loop; end $$;

alter table public.planner_friendships enable row level security; alter table public.planner_friend_invites enable row level security; alter table public.planner_friend_busy enable row level security; alter table public.planner_appointment_requests enable row level security; alter table public.planner_friend_cheers enable row level security; alter table public.planner_user_blocks enable row level security; alter table public.planner_user_reports enable row level security;
create policy invites_read on public.planner_friend_invites for select to authenticated using(auth.uid() in (from_user,to_user));
create policy invites_insert on public.planner_friend_invites for insert to authenticated with check(from_user=auth.uid() and to_user<>auth.uid() and status='pending');
create policy invites_update_recipient on public.planner_friend_invites for update to authenticated using(to_user=auth.uid() and status='pending') with check(to_user=auth.uid() and status in ('accepted','declined'));
create policy invites_update_sender on public.planner_friend_invites for update to authenticated using(from_user=auth.uid() and status in ('pending','cancelled','declined')) with check(from_user=auth.uid() and status in ('pending','cancelled'));
create policy friendships_read on public.planner_friendships for select to authenticated using(auth.uid() in (user_a,user_b));
create policy friendships_insert on public.planner_friendships for insert to authenticated with check(auth.uid() in (user_a,user_b) and user_a<>user_b and exists(select 1 from public.planner_friend_invites i where i.status='pending' and i.to_user=auth.uid() and i.from_user=case when user_a=auth.uid() then user_b else user_a end));
create policy friendships_delete on public.planner_friendships for delete to authenticated using(auth.uid() in (user_a,user_b));
create policy busy_read on public.planner_friend_busy for select to authenticated using(user_id=auth.uid() or public.planner_are_friends(auth.uid(),user_id));
create policy busy_write on public.planner_friend_busy for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy appointment_read on public.planner_appointment_requests for select to authenticated using(auth.uid() in (from_user,to_user));
create policy appointment_insert on public.planner_appointment_requests for insert to authenticated with check(from_user=auth.uid() and to_user<>auth.uid() and status='pending');
create policy appointment_update on public.planner_appointment_requests for update to authenticated using(auth.uid() in (from_user,to_user)) with check(auth.uid() in (from_user,to_user));
create policy cheers_insert_friend on public.planner_friend_cheers for insert to authenticated with check(auth.uid()=from_user and public.planner_are_friends(auth.uid(),to_user) and deliver_date=public.planon_study_date_kr()+1);
create policy cheers_select_receiver on public.planner_friend_cheers for select to authenticated using(auth.uid()=to_user);
create policy cheers_update_receiver on public.planner_friend_cheers for update to authenticated using(auth.uid()=to_user) with check(auth.uid()=to_user);
create policy blocks_own on public.planner_user_blocks for all to authenticated using(blocker_id=auth.uid()) with check(blocker_id=auth.uid());
create policy reports_insert on public.planner_user_reports for insert to authenticated with check(reporter_id=auth.uid());
create policy reports_read_own on public.planner_user_reports for select to authenticated using(reporter_id=auth.uid());

-- Day closing / story tables and RLS
create extension if not exists pgcrypto;

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

create index if not exists idx_day_closings_active on public.day_closings(date,visibility,closed_at desc);
create index if not exists idx_story_reactions_closing on public.story_reactions(closing_id,created_at);

-- SECURITY DEFINER helpers avoid recursive RLS when a policy needs to check another closing row.
create or replace function public.planner_has_closed_day(u uuid,d date)
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.day_closings c where c.user_id=u and c.date=d);
$$;
create or replace function public.planner_owns_closing(u uuid,cid uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.day_closings c where c.id=cid and c.user_id=u);
$$;
create or replace function public.planner_can_view_closing(viewer uuid,cid uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select exists(
    select 1 from public.day_closings c
    where c.id=cid
      and c.user_id<>viewer
      and c.visibility='friends'
      and c.closed_at>now()-interval '24 hours'
      and public.planner_are_friends(viewer,c.user_id)
      and public.planner_has_closed_day(viewer,public.planon_study_date_kr())
  );
$$;
revoke all on function public.planner_has_closed_day(uuid,date) from public;
revoke all on function public.planner_owns_closing(uuid,uuid) from public;
revoke all on function public.planner_can_view_closing(uuid,uuid) from public;
grant execute on function public.planner_has_closed_day(uuid,date),public.planner_owns_closing(uuid,uuid),public.planner_can_view_closing(uuid,uuid) to authenticated;

alter table public.day_closings enable row level security;
alter table public.story_reactions enable row level security;

drop policy if exists day_closings_owner_select on public.day_closings;
drop policy if exists day_closings_owner_insert on public.day_closings;
drop policy if exists day_closings_friend_select on public.day_closings;
create policy day_closings_owner_select on public.day_closings
  for select to authenticated using(user_id=auth.uid());
create policy day_closings_owner_insert on public.day_closings
  for insert to authenticated with check(user_id=auth.uid());
create policy day_closings_friend_select on public.day_closings
  for select to authenticated using(
    user_id<>auth.uid()
    and visibility='friends'
    and closed_at>now()-interval '24 hours'
    and public.planner_are_friends(auth.uid(),user_id)
    and public.planner_has_closed_day(auth.uid(),public.planon_study_date_kr())
  );
-- Intentionally no UPDATE/DELETE policy: posted cards are immutable.

drop policy if exists story_reactions_select on public.story_reactions;
drop policy if exists story_reactions_insert on public.story_reactions;
create policy story_reactions_select on public.story_reactions
  for select to authenticated using(
    from_user_id=auth.uid() or public.planner_owns_closing(auth.uid(),closing_id)
  );
create policy story_reactions_insert on public.story_reactions
  for insert to authenticated with check(
    from_user_id=auth.uid() and public.planner_can_view_closing(auth.uid(),closing_id)
  );
-- Intentionally no UPDATE/DELETE policy: one reaction per story is immutable.

grant select,insert on public.day_closings,public.story_reactions to authenticated;

create or replace function public.planner_delete_my_account() returns void language plpgsql security definer set search_path=public as $$declare u uuid:=auth.uid(); begin if u is null then raise exception 'not authenticated'; end if; delete from public.story_reactions where from_user_id=u or closing_id in (select id from public.day_closings where user_id=u); delete from public.day_closings where user_id=u; delete from public.planner_user_reports where reporter_id=u or reported_id=u; delete from public.planner_user_blocks where blocker_id=u or blocked_id=u; delete from public.planner_friend_cheers where from_user=u or to_user=u; delete from public.planner_meet_links where owner_id=u; delete from public.planner_shared_appointments where user_a=u or user_b=u; delete from public.planner_appointment_requests where from_user=u or to_user=u; delete from public.planner_friend_memories where owner_id=u or friend_id=u; delete from public.planner_friend_data where owner_id=u or friend_id=u; delete from public.planner_friend_shares where owner_id=u or friend_id=u; delete from public.planner_friend_busy where user_id=u; delete from public.planner_friendships where user_a=u or user_b=u; delete from public.planner_friend_invites where from_user=u or to_user=u; delete from public.planner_friend_codes where user_id=u; delete from public.planner_snapshots where user_id=u; delete from public.planner where user_id=u; delete from public.planon_market_orders where user_id=u; delete from public.planon_market_entitlements where user_id=u; delete from auth.users where id=u; end;$$;
revoke all on function public.planner_delete_my_account() from public; grant execute on function public.planner_delete_my_account() to authenticated;

grant select,insert,update,delete on public.planner_friend_cheers,public.planner_user_blocks,public.planner_user_reports to authenticated;
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

-- App-level current-location consent (coordinates are never stored)
create table if not exists public.planner_location_permissions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.planner_location_permissions enable row level security;
grant select,insert,update,delete on public.planner_location_permissions to authenticated;
drop policy if exists planner_location_permissions_select_self on public.planner_location_permissions;
drop policy if exists planner_location_permissions_insert_self on public.planner_location_permissions;
drop policy if exists planner_location_permissions_update_self on public.planner_location_permissions;
drop policy if exists planner_location_permissions_delete_self on public.planner_location_permissions;
create policy planner_location_permissions_select_self on public.planner_location_permissions for select to authenticated using(user_id=auth.uid());
create policy planner_location_permissions_insert_self on public.planner_location_permissions for insert to authenticated with check(user_id=auth.uid());
create policy planner_location_permissions_update_self on public.planner_location_permissions for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy planner_location_permissions_delete_self on public.planner_location_permissions for delete to authenticated using(user_id=auth.uid());

-- ===== NEXT CONSOLIDATED SECTION =====

-- PLAN:ON 스토리 '오늘 한 일 선택' 기능 패치
-- 기존 day_closings / RLS는 그대로 유지하고 컬럼 2개만 추가합니다.
begin;

alter table public.day_closings
  add column if not exists highlight_items jsonb not null default '[]'::jsonb;

alter table public.day_closings
  add column if not exists show_done_count boolean not null default true;

-- ===== NEXT CONSOLIDATED SECTION =====

-- Planon story card detail snapshot patch
-- Safe to run more than once. Existing RLS policies are unchanged.
begin;

alter table public.day_closings
  add column if not exists card_details jsonb not null default '{}'::jsonb;

-- ===== NEXT CONSOLIDATED SECTION =====

-- Planon friend story Nemo color patch
-- Safe to run more than once.
begin;

alter table public.day_closings
  add column if not exists nemo_color text;

-- Keep only a simple #RRGGBB snapshot. Existing rows may remain null.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'day_closings_nemo_color_hex_check'
      and conrelid = 'public.day_closings'::regclass
  ) then
    alter table public.day_closings
      add constraint day_closings_nemo_color_hex_check
      check (nemo_color is null or nemo_color ~ '^#[0-9A-Fa-f]{6}$');
  end if;
end $$;

-- ===== NEXT CONSOLIDATED SECTION =====

-- PLANON 친구랑 함께: 실시간 집중 상태/클리어 이벤트
create table if not exists public.planner_together_presence (
  user_id uuid primary key references auth.users(id) on delete cascade,
  friend_id uuid, running boolean not null default false, focus_seconds integer not null default 0,
  current_label text, last_clear_text text, last_clear_at timestamptz, updated_at timestamptz not null default now()
);
alter table public.planner_together_presence enable row level security;
drop policy if exists together_self_write on public.planner_together_presence;
create policy together_self_write on public.planner_together_presence for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
-- 읽기는 앱의 기존 친구관계 테이블과 연결한 정책을 배포 환경에 맞춰 추가하세요. 임의 전체 공개 금지.
grant select,insert,update,delete on public.planner_together_presence to authenticated;
drop policy if exists together_friend_read on public.planner_together_presence;
create policy together_friend_read on public.planner_together_presence for select to authenticated
using (auth.uid()=user_id or public.planner_are_friends(auth.uid(),user_id));


commit;


-- PLAN:ON Friend ID + stronger blocking (2026-09-27)
-- Safe to run repeatedly.
begin;

-- Live beta projects created before the safety tables existed are upgraded here too.
create table if not exists public.planner_user_blocks (
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(blocker_id,blocked_id),
  check(blocker_id<>blocked_id)
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
alter table public.planner_user_blocks enable row level security;
alter table public.planner_user_reports enable row level security;
drop policy if exists blocks_own on public.planner_user_blocks;
create policy blocks_own on public.planner_user_blocks for all to authenticated using(blocker_id=auth.uid()) with check(blocker_id=auth.uid());
drop policy if exists reports_insert on public.planner_user_reports;
create policy reports_insert on public.planner_user_reports for insert to authenticated with check(reporter_id=auth.uid());
drop policy if exists reports_read_own on public.planner_user_reports;
create policy reports_read_own on public.planner_user_reports for select to authenticated using(reporter_id=auth.uid());
grant select,insert,update,delete on public.planner_user_blocks to authenticated;
grant select,insert on public.planner_user_reports to authenticated;

create table if not exists public.planner_user_ids (
  user_id uuid primary key references auth.users(id) on delete cascade,
  handle text not null unique,
  updated_at timestamptz not null default now(),
  check (handle ~ '^[a-z0-9][a-z0-9._]{2,14}[a-z0-9]$'),
  check (char_length(handle) between 4 and 16)
);

create table if not exists public.planner_user_id_changes (
  id bigint generated by default as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  old_handle text not null,
  new_handle text not null,
  changed_at timestamptz not null default now()
);
create index if not exists idx_planner_user_id_changes_user_time on public.planner_user_id_changes(user_id,changed_at desc);
create index if not exists idx_planner_user_id_changes_old_time on public.planner_user_id_changes(old_handle,changed_at desc);

alter table public.planner_user_ids enable row level security;
alter table public.planner_user_id_changes enable row level security;

drop policy if exists planner_user_ids_own_read on public.planner_user_ids;
create policy planner_user_ids_own_read on public.planner_user_ids for select to authenticated using(user_id=auth.uid());
drop policy if exists planner_user_id_changes_own_read on public.planner_user_id_changes;
create policy planner_user_id_changes_own_read on public.planner_user_id_changes for select to authenticated using(user_id=auth.uid());

create or replace function public.planner_users_blocked(a uuid,b uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.planner_user_blocks x
    where (x.blocker_id=a and x.blocked_id=b) or (x.blocker_id=b and x.blocked_id=a));
$$;
revoke all on function public.planner_users_blocked(uuid,uuid) from public;
grant execute on function public.planner_users_blocked(uuid,uuid) to authenticated;

create or replace function public.planner_my_user_id_info()
returns jsonb language plpgsql security definer set search_path=public as $$
declare u uuid:=auth.uid(); h text; n int:=0; first_change timestamptz;
begin
  if u is null then raise exception 'not_authenticated'; end if;
  select handle into h from public.planner_user_ids where user_id=u;
  select count(*),min(changed_at) into n,first_change from public.planner_user_id_changes where user_id=u and changed_at>now()-interval '14 days';
  return jsonb_build_object('handle',coalesce(h,''),'changes_left',greatest(0,2-n),'reset_at',case when first_change is null then null else first_change+interval '14 days' end);
end;
$$;

create or replace function public.planner_set_user_id(h text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare u uuid:=auth.uid(); v text:=lower(trim(coalesce(h,''))); old text; n int:=0; first_change timestamptz;
begin
  if u is null then raise exception 'not_authenticated'; end if;
  if char_length(v)<4 or char_length(v)>16 or v !~ '^[a-z0-9][a-z0-9._]{2,14}[a-z0-9]$' then raise exception 'invalid_handle'; end if;
  if v in ('admin','administrator','planon','plan.on','support','official','help','root','system') then raise exception 'handle_reserved'; end if;
  select handle into old from public.planner_user_ids where user_id=u for update;
  if old=v then return public.planner_my_user_id_info(); end if;
  if exists(select 1 from public.planner_user_ids where handle=v and user_id<>u) then raise exception 'handle_taken'; end if;
  if exists(select 1 from public.planner_user_id_changes where old_handle=v and user_id<>u and changed_at>now()-interval '30 days') then raise exception 'handle_reserved'; end if;
  if old is not null then
    select count(*),min(changed_at) into n,first_change from public.planner_user_id_changes where user_id=u and changed_at>now()-interval '14 days';
    if n>=2 then raise exception 'handle_change_limit'; end if;
    insert into public.planner_user_id_changes(user_id,old_handle,new_handle) values(u,old,v);
  end if;
  insert into public.planner_user_ids(user_id,handle,updated_at) values(u,v,now())
    on conflict(user_id) do update set handle=excluded.handle,updated_at=excluded.updated_at;
  return public.planner_my_user_id_info();
exception when unique_violation then raise exception 'handle_taken';
end;
$$;

create or replace function public.planner_resolve_user_id(h text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare u uuid:=auth.uid(); v text:=lower(trim(coalesce(h,''))); target uuid;
begin
  if u is null then raise exception 'not_authenticated'; end if;
  select user_id into target from public.planner_user_ids where handle=v;
  if target is null or target=u or public.planner_users_blocked(u,target) then return null; end if;
  return jsonb_build_object('user_id',target,'handle',v);
end;
$$;

revoke all on function public.planner_my_user_id_info() from public;
revoke all on function public.planner_set_user_id(text) from public;
revoke all on function public.planner_resolve_user_id(text) from public;
grant execute on function public.planner_my_user_id_info(),public.planner_set_user_id(text),public.planner_resolve_user_id(text) to authenticated;
grant select on public.planner_user_ids,public.planner_user_id_changes to authenticated;

-- Blocking must prevent reconnecting or sending a new appointment request.
drop policy if exists invites_insert on public.planner_friend_invites;
create policy invites_insert on public.planner_friend_invites for insert to authenticated
  with check(from_user=auth.uid() and to_user<>auth.uid() and status='pending' and not public.planner_users_blocked(from_user,to_user));
drop policy if exists appointment_insert on public.planner_appointment_requests;
create policy appointment_insert on public.planner_appointment_requests for insert to authenticated
  with check(from_user=auth.uid() and to_user<>auth.uid() and status='pending' and not public.planner_users_blocked(from_user,to_user));

commit;
