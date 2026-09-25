-- Planon friend story Nemo color patch
-- Safe to run more than once.
begin;

alter table public.day_closings
  add column if not exists nemo_color text;

-- Keep only a simple #RRGGBB snapshot. Existing rows may remain null.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'day_closings_nemo_color_hex_check'
      and conrelid = 'public.day_closings'::regclass
  ) then
    alter table public.day_closings
      add constraint day_closings_nemo_color_hex_check
      check (nemo_color is null or nemo_color ~ '^#[0-9A-Fa-f]{6}$');
  end if;
end $$;

commit;
