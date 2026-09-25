-- PLAN:ON 공부 하루 05:00 경계 적용 (재실행 가능)
-- 한국시간 기준 00:00~04:59는 전날 공부일로 봅니다.
begin;
create or replace function public.planon_study_date_kr()
returns date
language sql
stable
as $$
  select ((now() at time zone 'Asia/Seoul') - interval '5 hours')::date;
$$;

drop policy if exists cheers_insert_friend on public.planner_friend_cheers;
create policy cheers_insert_friend on public.planner_friend_cheers
for insert to authenticated
with check(
  auth.uid()=from_user
  and public.planner_are_friends(auth.uid(),to_user)
  and deliver_date=public.planon_study_date_kr()+1
);
commit;
