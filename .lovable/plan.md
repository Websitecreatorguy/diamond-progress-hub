# Diamond Development — Platform Overhaul Plan

This is a large, multi-phase build. I'll break it into shippable phases so we make steady progress and you can steer between phases. Below is the scope with what I'll do in each phase, in order.

## Phase 1 — Branding, Homepage, SEO foundation

- Add your uploaded radar logo as a Lovable Asset. Use it in navbar, auth page, dashboard header, footer, and as the favicon (and OG image).
- Rebuild the marketing homepage at `/` (currently just redirects). Sections: Hero, Features, Dashboard Preview, Team, Coach, Parent, Progress Tracking, FAQ, Footer. Use baseball equipment/field imagery + UI mockup screenshots — no fake people.
- Public marketing nav: Home, Features, Teams, Leaderboards, Blog, Sign In.
- SEO system:
  - `src/routes/sitemap[.]xml.ts` server route driven by route registry + blog slugs.
  - `public/robots.txt`.
  - Per-route `head()` with title, description, canonical, og:*, twitter:*, JSON-LD.
- Blog/Resources hub at `/resources` + individual SEO pages (MDX-free, TSX content modules) for the 21 topics you listed. Each includes H1/H2/H3, internal links, FAQ, and Article/FAQPage JSON-LD.

## Phase 2 — Auth fixes

- Signup: email + password + confirm password, show/hide toggle, zod validation, clear error messages, email verification copy.
- Forgot password flow + `/reset-password` route.
- Fix Google OAuth redirect: use `window.location.origin` (public) as `redirect_uri`, store intended path in sessionStorage, land users on `/dashboard` after session hydrates. Add `/auth/callback` public route to resolve the 404.
- Multi-device: audit session handling — the current `useSession` hook + Supabase client already isolate per-user; verify no shared storage keys or hard-coded IDs and add regression around `onAuthStateChange`.

## Phase 3 — Database expansion

One migration adding:

- `teams`, `team_members` (role: coach/assistant/player, status: pending/approved), `team_invites` (code).
- `announcements` (team-scoped).
- `goals` (metric, target, deadline, progress).
- `achievements` + `player_achievements` (auto-awarded).
- `stat_entries` (typed metric values with `verified_by`, `verified_at` → powers Verified Stats + PRs + leaderboards).
- `timeline_events` (joined team, PR, verified, workout, goal, badge).
- `player_profiles_public` fields (bio, photo_url, positions, grad_year, public_slug).
- `parent_links` (parent user → child player).
- Full RLS + GRANTs per project rules.

## Phase 4 — Player features

- Enhanced dashboard: line charts for all 10 metrics, monthly delta %, PR highlights, XP/level bar.
- Personal Records page.
- Goals page with progress bars.
- Achievements page.
- Timeline page.
- Player comparison (self-over-time, teammates, age peers, national averages baseline).
- Public profile at `/p/[slug]` (opt-in) + recruiting profile at `/r/[slug]` with print-friendly view.

## Phase 5 — Teams, Coach, Parent

- Team pages: create/join with invite code, roster, announcements, leaderboards (per metric, all vs verified-only), stats.
- Coach dashboard: approve players, verify stats (adds badge), assign workouts, announcements, attendance, CSV export.
- Parent dashboard: link children, switch active player.

## Phase 6 — Polish, performance, QA

- Image lazy loading, route-level code splitting review, Query cache tuning.
- Full pass for 404s, responsive breakpoints, a11y (labels, focus states, contrast).
- Lighthouse pass targeting 95+.

## Technical notes

- Stack: TanStack Start + Supabase (Lovable Cloud). Marketing/blog/SEO routes public (top-level), app routes under `_authenticated/`.
- Charts: existing `recharts` v2.
- All SEO content pages are TSX with a shared `<ArticleLayout>` component so the design stays consistent and Lighthouse-friendly.
- I'll use the uploaded logo via `lovable-assets` (no binary in repo).

## Delivery

I'll deliver **Phase 1 first** in the next turn (branding, homepage, SEO foundation, first batch of blog/SEO pages). After you see it, I'll continue through Phases 2→6. Each phase is a self-contained shippable increment.

Reply "go" to proceed with Phase 1, or tell me to reorder/drop anything.
