-- Planon story card detail snapshot patch
-- Safe to run more than once. Existing RLS policies are unchanged.
begin;

alter table public.day_closings
  add column if not exists card_details jsonb not null default '{}'::jsonb;

commit;
