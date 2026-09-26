# PLAN:ON production migration — 2026-09-26

## Run only this file for this release
`PRODUCTION_MIGRATION_20260926.sql` is the deployment SQL source of truth for an **existing** PLAN:ON Supabase project.

1. Back up the production database.
2. Open Supabase SQL Editor for the production project.
3. Run `PRODUCTION_MIGRATION_20260926.sql` once.
4. Confirm the transaction completes without error.
5. In Supabase, verify RLS is enabled on friend, story, cheer, location-permission and together-presence tables.
6. Run the A/B checklist in `RELEASE_E2E_CHECKLIST.md`.

The older SQL files are retained only under `legacy-sql/` for audit/history. Do **not** run them after the production migration.

Important: static inspection cannot prove what is already applied to your live Supabase project. The A/B account checks are required before release.
