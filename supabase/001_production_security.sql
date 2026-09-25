-- PLAN:ON PRODUCTION SECURITY MIGRATION
-- Canonical migration as of 2026-09-25.
-- Replaces old friend-sharing-schema*.sql and planon-cheers.sql for production use.
-- Apply this file in Supabase SQL Editor. Do not re-run older policy files afterward.
--
-- Includes:
-- 1) hardened RLS for friend invites / friendships / busy time / appointment requests
-- 2) delayed cheer v2: deliver_date must be exactly tomorrow

begin;

-- 플래너 친구 기능 RLS 보안 강화
-- 대상: planner_friendships, planner_friend_invites, planner_friend_busy, planner_appointment_requests
-- Supabase SQL Editor에서 한 번 실행하세요.
-- 주의: 아래 4개 테이블의 기존 RLS policy를 모두 지우고, 앱 현재 동작에 맞는 policy로 다시 만듭니다.

begin;

-- ------------------------------------------------------------
-- 0) RLS 활성화 + authenticated 기본 권한
-- ------------------------------------------------------------
alter table public.planner_friendships enable row level security;
alter table public.planner_friend_invites enable row level security;
alter table public.planner_friend_busy enable row level security;
alter table public.planner_appointment_requests enable row level security;

grant select, insert, update, delete on table public.planner_friendships to authenticated;
grant select, insert, update, delete on table public.planner_friend_invites to authenticated;
grant select, insert, update, delete on table public.planner_friend_busy to authenticated;
grant select, insert, update, delete on table public.planner_appointment_requests to authenticated;

-- 기존 permissive policy가 하나라도 남으면 새 policy와 OR로 합쳐질 수 있으므로
-- 이 4개 테이블만 기존 policy를 모두 제거한 뒤 아래에서 완전히 재정의합니다.
do $$
declare r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname='public'
      and tablename in (
        'planner_friendships',
        'planner_friend_invites',
        'planner_friend_busy',
        'planner_appointment_requests'
      )
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

-- ------------------------------------------------------------
-- 1) 친구 요청 planner_friend_invites
-- ------------------------------------------------------------
-- 본인과 관련된 요청만 조회
create policy planner_friend_invites_select_participant
on public.planner_friend_invites
for select
to authenticated
using (auth.uid() = from_user or auth.uid() = to_user);

-- 요청 생성은 반드시 "내가 보낸 pending 요청"만
create policy planner_friend_invites_insert_self
on public.planner_friend_invites
for insert
to authenticated
with check (
  from_user = auth.uid()
  and to_user <> auth.uid()
  and status = 'pending'
);

-- 받은 사람만 pending 요청을 accepted / declined로 바꿀 수 있음
create policy planner_friend_invites_update_recipient
on public.planner_friend_invites
for update
to authenticated
using (
  to_user = auth.uid()
  and status = 'pending'
)
with check (
  to_user = auth.uid()
  and status in ('accepted','declined')
);

-- 보낸 사람은 pending 요청 취소 가능.
-- 과거 cancelled/declined 요청은 같은 상대에게 다시 pending으로 보낼 수 있게 허용.
create policy planner_friend_invites_update_sender
on public.planner_friend_invites
for update
to authenticated
using (
  from_user = auth.uid()
  and status in ('pending','cancelled','declined')
)
with check (
  from_user = auth.uid()
  and status in ('pending','cancelled')
);

-- from_user / to_user를 UPDATE로 바꿔치기하지 못하게 막음
create or replace function public.planner_guard_friend_invite_identity()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.from_user is distinct from old.from_user
     or new.to_user is distinct from old.to_user then
    raise exception 'friend invite participants cannot be changed';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_planner_guard_friend_invite_identity on public.planner_friend_invites;
create trigger trg_planner_guard_friend_invite_identity
before update on public.planner_friend_invites
for each row execute function public.planner_guard_friend_invite_identity();

-- ------------------------------------------------------------
-- 2) 친구 관계 planner_friendships
-- ------------------------------------------------------------
-- 관계 당사자만 조회
create policy planner_friendships_select_participant
on public.planner_friendships
for select
to authenticated
using (auth.uid() = user_a or auth.uid() = user_b);

-- 핵심 보안:
-- 친구 행 생성은 "내가 받은 pending 초대"가 실제로 존재할 때만 허용.
-- 즉 임의의 user id를 알아도 친구 관계를 직접 만들 수 없음.
create policy planner_friendships_insert_after_received_invite
on public.planner_friendships
for insert
to authenticated
with check (
  auth.uid() in (user_a, user_b)
  and user_a <> user_b
  and exists (
    select 1
    from public.planner_friend_invites i
    where i.status = 'pending'
      and i.to_user = auth.uid()
      and i.from_user = case
        when user_a = auth.uid() then user_b
        else user_a
      end
  )
);

-- 둘 중 누구든 친구 연결 해제 가능
create policy planner_friendships_delete_participant
on public.planner_friendships
for delete
to authenticated
using (auth.uid() = user_a or auth.uid() = user_b);

-- UPDATE policy는 의도적으로 없음: 친구 pair 자체 수정 금지.

-- ------------------------------------------------------------
-- 3) 바쁜 시간 planner_friend_busy
-- ------------------------------------------------------------
-- 내 데이터 또는 실제 친구 데이터만 조회 가능
create policy planner_friend_busy_select_self_or_friend
on public.planner_friend_busy
for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.planner_friendships f
    where (f.user_a = auth.uid() and f.user_b = planner_friend_busy.user_id)
       or (f.user_b = auth.uid() and f.user_a = planner_friend_busy.user_id)
  )
);

-- 본인 바쁜 시간만 생성/수정/삭제
create policy planner_friend_busy_insert_self
on public.planner_friend_busy
for insert
to authenticated
with check (user_id = auth.uid());

create policy planner_friend_busy_update_self
on public.planner_friend_busy
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy planner_friend_busy_delete_self
on public.planner_friend_busy
for delete
to authenticated
using (user_id = auth.uid());

-- ------------------------------------------------------------
-- 4) 약속 요청 planner_appointment_requests
-- ------------------------------------------------------------
-- 당사자만 조회
create policy planner_appointment_requests_select_participant
on public.planner_appointment_requests
for select
to authenticated
using (auth.uid() = from_user or auth.uid() = to_user);

-- 요청 생성은 항상 내가 보낸 pending 요청만
create policy planner_appointment_requests_insert_self
on public.planner_appointment_requests
for insert
to authenticated
with check (
  from_user = auth.uid()
  and to_user <> auth.uid()
  and status = 'pending'
);

-- 받은 사람만 pending -> accepted/declined
create policy planner_appointment_requests_update_recipient
on public.planner_appointment_requests
for update
to authenticated
using (
  to_user = auth.uid()
  and status = 'pending'
)
with check (
  to_user = auth.uid()
  and status in ('accepted','declined')
);

-- 보낸 사람은 pending 요청을 취소할 수 있고,
-- 이미 accepted 된 공유 약속은 양쪽 당사자 중 누구든 cancelled 처리 가능.
create policy planner_appointment_requests_cancel_participant
on public.planner_appointment_requests
for update
to authenticated
using (
  (from_user = auth.uid() and status = 'pending')
  or ((from_user = auth.uid() or to_user = auth.uid()) and status = 'accepted')
)
with check (
  (from_user = auth.uid() or to_user = auth.uid())
  and status = 'cancelled'
);

-- 요청의 당사자와 payload 자체는 응답 과정에서 바꿀 수 없게 고정.
-- 앱 현재 구현은 status/responded_at만 UPDATE하므로 정상 동작합니다.
create or replace function public.planner_guard_appointment_request_immutable()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.from_user is distinct from old.from_user
     or new.to_user is distinct from old.to_user
     or new.payload is distinct from old.payload then
    raise exception 'appointment request participants/payload cannot be changed';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_planner_guard_appointment_request_immutable on public.planner_appointment_requests;
create trigger trg_planner_guard_appointment_request_immutable
before update on public.planner_appointment_requests
for each row execute function public.planner_guard_appointment_request_immutable();

-- ------------------------------------------------------------
-- 5) delayed cheer note v2
-- ------------------------------------------------------------
create extension if not exists pgcrypto;

create table if not exists public.planner_friend_cheers (
  id uuid primary key default gen_random_uuid(),
  from_user uuid not null references auth.users(id) on delete cascade,
  to_user uuid not null references auth.users(id) on delete cascade,
  message text not null check (char_length(message) between 1 and 100),
  deliver_date date not null,
  notified_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint planner_friend_cheers_not_self check (from_user <> to_user),
  constraint planner_friend_cheers_once_per_day unique (from_user, to_user, deliver_date)
);

create index if not exists planner_friend_cheers_to_due_idx
  on public.planner_friend_cheers (to_user, deliver_date, notified_at);

alter table public.planner_friend_cheers enable row level security;

create or replace function public.planner_are_friends(a uuid, b uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.planner_friendships f
    where (f.user_a = a and f.user_b = b)
       or (f.user_a = b and f.user_b = a)
  );
$$;

revoke all on function public.planner_are_friends(uuid, uuid) from public;
grant execute on function public.planner_are_friends(uuid, uuid) to authenticated;

drop policy if exists cheers_insert_friend on public.planner_friend_cheers;
create policy cheers_insert_friend
on public.planner_friend_cheers
for insert
to authenticated
with check (
  auth.uid() = from_user
  and public.planner_are_friends(auth.uid(), to_user)
  and deliver_date = current_date + 1
);

drop policy if exists cheers_select_receiver on public.planner_friend_cheers;
create policy cheers_select_receiver
on public.planner_friend_cheers
for select
to authenticated
using (auth.uid() = to_user);

drop policy if exists cheers_update_receiver on public.planner_friend_cheers;
create policy cheers_update_receiver
on public.planner_friend_cheers
for update
to authenticated
using (auth.uid() = to_user)
with check (auth.uid() = to_user);

revoke all on table public.planner_friend_cheers from anon;
revoke all on table public.planner_friend_cheers from authenticated;
grant select, insert on table public.planner_friend_cheers to authenticated;
grant update (notified_at, read_at) on table public.planner_friend_cheers to authenticated;

commit;

-- Verify active policies.
select schemaname, tablename, policyname, cmd
from pg_policies
where schemaname='public'
  and tablename in (
    'planner_friendships',
    'planner_friend_invites',
    'planner_friend_busy',
    'planner_appointment_requests',
    'planner_friend_cheers'
  )
order by tablename, policyname;
