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
