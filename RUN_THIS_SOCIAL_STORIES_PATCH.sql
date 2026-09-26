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
