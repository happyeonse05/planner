-- PLAN:ON 05:00 study-day server patch (safe to re-run)
-- 00:00~04:59 KST belongs to the previous study day.
begin;

create or replace function public.planon_study_date_kr()
returns date
language sql
stable
as $$
  select ((now() at time zone 'Asia/Seoul') - interval '5 hours')::date;
$$;
revoke all on function public.planon_study_date_kr() from public;
grant execute on function public.planon_study_date_kr() to authenticated;

-- Delayed cheer: tomorrow means next study day, not next midnight date.
drop policy if exists cheers_insert_friend on public.planner_friend_cheers;
create policy cheers_insert_friend on public.planner_friend_cheers
for insert to authenticated
with check(
  auth.uid()=from_user
  and public.planner_are_friends(auth.uid(),to_user)
  and deliver_date=public.planon_study_date_kr()+1
);

-- Story access: viewer must have closed the CURRENT study day.
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
revoke all on function public.planner_can_view_closing(uuid,uuid) from public;
grant execute on function public.planner_can_view_closing(uuid,uuid) to authenticated;

drop policy if exists day_closings_friend_select on public.day_closings;
create policy day_closings_friend_select on public.day_closings
for select to authenticated using(
  user_id<>auth.uid()
  and visibility='friends'
  and closed_at>now()-interval '24 hours'
  and public.planner_are_friends(auth.uid(),user_id)
  and public.planner_has_closed_day(auth.uid(),public.planon_study_date_kr())
);

commit;
