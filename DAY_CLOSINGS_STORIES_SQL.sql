-- PLAN:ON day closing + friend story schema
-- Safe to re-run on the existing skku-planner project.
begin;
create extension if not exists pgcrypto;

create or replace function public.planon_study_date_kr()
returns date language sql stable as $$
  select ((now() at time zone 'Asia/Seoul') - interval '5 hours')::date;
$$;
revoke all on function public.planon_study_date_kr() from public;
grant execute on function public.planon_study_date_kr() to authenticated;

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

-- Keep account deletion complete after adding story tables.
create or replace function public.planner_delete_my_account() returns void
language plpgsql security definer set search_path=public as $$
declare u uuid:=auth.uid();
begin
  if u is null then raise exception 'not authenticated'; end if;
  delete from public.story_reactions where from_user_id=u or closing_id in (select id from public.day_closings where user_id=u);
  delete from public.day_closings where user_id=u;
  delete from public.planner_user_reports where reporter_id=u or reported_id=u;
  delete from public.planner_user_blocks where blocker_id=u or blocked_id=u;
  delete from public.planner_friend_cheers where from_user=u or to_user=u;
  delete from public.planner_meet_links where owner_id=u;
  delete from public.planner_shared_appointments where user_a=u or user_b=u;
  delete from public.planner_appointment_requests where from_user=u or to_user=u;
  delete from public.planner_friend_memories where owner_id=u or friend_id=u;
  delete from public.planner_friend_data where owner_id=u or friend_id=u;
  delete from public.planner_friend_shares where owner_id=u or friend_id=u;
  delete from public.planner_friend_busy where user_id=u;
  delete from public.planner_friendships where user_a=u or user_b=u;
  delete from public.planner_friend_invites where from_user=u or to_user=u;
  delete from public.planner_friend_codes where user_id=u;
  delete from public.planner_snapshots where user_id=u;
  delete from public.planner where user_id=u;
  delete from public.planon_market_orders where user_id=u;
  delete from public.planon_market_entitlements where user_id=u;
  delete from auth.users where id=u;
end;$$;
revoke all on function public.planner_delete_my_account() from public;
grant execute on function public.planner_delete_my_account() to authenticated;
commit;
