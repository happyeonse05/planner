-- PLAN:ON production security verification (read-only inspection)

select c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public'
  and c.relname in (
    'planner_friendships','planner_friend_invites','planner_friend_busy',
    'planner_appointment_requests','planner_friend_cheers'
  )
order by c.relname;

select tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname='public'
  and tablename in (
    'planner_friendships','planner_friend_invites','planner_friend_busy',
    'planner_appointment_requests','planner_friend_cheers'
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
