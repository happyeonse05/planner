-- PLAN:ON 스토리 '오늘 한 일 선택' 기능 패치
-- 기존 day_closings / RLS는 그대로 유지하고 컬럼 2개만 추가합니다.
begin;

alter table public.day_closings
  add column if not exists highlight_items jsonb not null default '[]'::jsonb;

alter table public.day_closings
  add column if not exists show_done_count boolean not null default true;

commit;
