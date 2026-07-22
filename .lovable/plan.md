The request spans design unification, auth hardening, and SEO. Here's the scoped plan I'll execute in one pass.

## 1. Shared design system (public + authenticated)

Keep two shells (marketing has top nav + footer; authenticated needs bottom-tab mobile nav) but unify branding.
- Refresh `src/components/app-shell.tsx`: same sticky header treatment as `MarketingLayout` (backdrop blur, matching height/logo, `bg-gradient-primary shadow-glow` accents). Add a subtle top border-glow.
- Ensure typography, spacing, radii, buttons, and card styling from `styles.css` are used consistently (no ad-hoc colors).
- Audit dashboard/training/progress/charts/profile pages and swap any hardcoded spacing/color for tokenized `Card`, `Button`, and gradient utilities matching the marketing look.

## 2. Auth fixes (`src/routes/auth.tsx` + new `/reset-password`)

- Add **Confirm password** field on signup with client-side match validation.
- Add **Forgot password?** link → calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: origin + '/reset-password' })`.
- Create `src/routes/reset-password.tsx` (public, `ssr:false`) that detects the recovery token and calls `supabase.auth.updateUser({ password })`.
- Google OAuth: change `redirect_uri` from `window.location.origin` (lands on `/`) to `${origin}/auth/callback`, and create a small `src/routes/auth.callback.tsx` that waits for the session and navigates to `/dashboard`. Preserves multi-device sessions via Supabase's default persistent storage (already enabled by the generated client).
- Replace the `useEffect + getSession` bounce with an `onAuthStateChange` subscription so logged-in users on multiple devices don't get stuck on `/auth`.

## 3. SEO — top-level article routes + `/blog`

The user wants specific URLs like `/average-exit-velocity-by-age` (not nested under `/resources/`). Existing article content in `src/lib/resources.ts` already covers most topics. I will:
- Add thin top-level routes that render the existing `ArticleView` component for these slugs:
  `/average-exit-velocity-by-age`, `/pitching-velocity-by-age`, `/average-bat-speed-by-age`, `/average-pop-time-by-age`, `/baseball-workout-plans`, `/baseball-strength-training`, `/baseball-nutrition`, `/how-to-increase-exit-velocity` (new article), `/how-to-throw-harder` (new article).
- Each is a real route with unique `head()` (title, description, og:*), self-referencing canonical, Article JSON-LD.
- Create `/blog` as an alias index of the Guides + Training categories with its own `head()`.
- Update `src/routes/sitemap[.]xml.ts` and internal nav links to point at the new canonical URLs.

## 4. Content additions in `src/lib/resources.ts`

Add two new articles with real, useful content:
- `how-to-increase-exit-velocity` (Training)
- `how-to-throw-harder` (Training)

## Technical notes

- No schema/backend changes.
- New routes are file-based; TanStack Router regenerates the tree.
- Reset-password and OAuth-callback routes are public (not under `_authenticated`).
- Design changes are token-driven; no new colors added.
- All new SEO routes get canonical + og tags + Article JSON-LD; sitemap updated so Google indexes the new URLs.

Approve and I'll implement in a single pass.