-- PLAN:ON location permission preference
-- Run this ONCE in Supabase SQL Editor after deploying this build.
-- Stores only the user's app-level consent flag. GPS coordinates are NOT stored.

begin;

create table if not exists public.planner_location_permissions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.planner_location_permissions enable row level security;

grant select, insert, update, delete on table public.planner_location_permissions to authenticated;

drop policy if exists planner_location_permissions_select_self on public.planner_location_permissions;
drop policy if exists planner_location_permissions_insert_self on public.planner_location_permissions;
drop policy if exists planner_location_permissions_update_self on public.planner_location_permissions;
drop policy if exists planner_location_permissions_delete_self on public.planner_location_permissions;

create policy planner_location_permissions_select_self
on public.planner_location_permissions
for select to authenticated
using (user_id = auth.uid());

create policy planner_location_permissions_insert_self
on public.planner_location_permissions
for insert to authenticated
with check (user_id = auth.uid());

create policy planner_location_permissions_update_self
on public.planner_location_permissions
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy planner_location_permissions_delete_self
on public.planner_location_permissions
for delete to authenticated
using (user_id = auth.uid());

commit;
