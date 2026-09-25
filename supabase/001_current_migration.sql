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
create policy cheers_insert_friend on public.planner_friend_cheers for insert to authenticated with check(auth.uid()=from_user and public.planner_are_friends(auth.uid(),to_user) and deliver_date=current_date+1);
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
  comment text check(comment is null or char_length(comment)<=40),
  visibility text not null default 'private' check(visibility in ('friends','private')),
  created_at timestamptz not null default now(),
  unique(user_id,date)
);

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
      and public.planner_has_closed_day(viewer,c.date)
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
    and public.planner_has_closed_day(auth.uid(),date)
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
