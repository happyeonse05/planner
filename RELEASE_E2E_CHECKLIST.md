# PLAN:ON release E2E checklist

These require the real production Supabase project and real browser/device sessions; they are intentionally not marked as passed by static QA.

- [ ] A sign up → login → create todo/event → refresh → data remains
- [ ] A logout → login → logout backup/vault/remote restore keeps data
- [ ] Device A create → Device B login → edit/delete → Device A reconnect; deleted item does not resurrect
- [ ] Backup → edit → restore → force sync; server does not overwrite restored state unexpectedly
- [ ] A friend request → B accept → both reload
- [ ] A/B scheduling shows only available/unavailable slots; no title/content leakage
- [ ] A cheer today → after B's configured time next study day → B opens PLANON → delivered once
- [ ] A removes B → both reload → friend-only reads fail
- [ ] Together presence: A can read B only while friendship exists; unrelated C cannot read A/B
- [ ] iPhone Safari/PWA: keyboard does not cover save/apply; offline/online transition; 360/390px layout
