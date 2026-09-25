-- PLAN:ON production security verification (read-only inspection)

select c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public'
  and c.relname in (
    'planner_friendships','planner_friend_invites','planner_friend_busy',
    'planner_appointment_requests','planner_friend_cheers','day_closings','story_reactions'
  )
order by c.relname;

select tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname='public'
  and tablename in (
    'planner_friendships','planner_friend_invites','planner_friend_busy',
    'planner_appointment_requests','planner_friend_cheers','day_closings','story_reactions'
  )
order by tablename, policyname;

select policyname, with_check
from pg_policies
where schemaname='public'
  and tablename='planner_friend_cheers'
  and cmd='INSERT';

select indexname, indexdef
from pg_indexes
where schemaname='public' and tablename='planner_friend_cheers'
order by indexname;


-- Required tables/functions for current app + future market
select to_regclass('public.planner') as planner, to_regclass('public.planner_snapshots') as snapshots, to_regclass('public.planner_friend_codes') as friend_codes, to_regclass('public.planner_friendships') as friendships, to_regclass('public.planner_friend_invites') as invites, to_regclass('public.planner_friend_busy') as busy, to_regclass('public.planner_friend_shares') as shares, to_regclass('public.planner_friend_data') as friend_data, to_regclass('public.planner_friend_memories') as memories, to_regclass('public.planner_appointment_requests') as appointment_requests, to_regclass('public.planner_shared_appointments') as shared_appointments, to_regclass('public.planner_meet_links') as meet_links, to_regclass('public.planner_meet_answers') as meet_answers, to_regclass('public.planner_friend_cheers') as cheers, to_regclass('public.planner_user_blocks') as blocks, to_regclass('public.planner_user_reports') as reports;
select p.proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname in ('planner_delete_my_account','planner_meet_get','planner_meet_answer','planner_are_friends') order by p.proname;


-- Day closing / story verification
select to_regclass('public.day_closings') as day_closings, to_regclass('public.story_reactions') as story_reactions;
select p.proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname in ('planner_has_closed_day','planner_owns_closing','planner_can_view_closing') order by p.proname;
select tablename,policyname,cmd from pg_policies where schemaname='public' and tablename in ('day_closings','story_reactions') order by tablename,policyname;
