# Earn & Learn Pakistan

**Learn Skills. Complete Tasks. Discover Opportunities.**

A React + TypeScript + Tailwind + Supabase MVP for a Pakistani earning/learning
platform: verified opportunities marketplace, a daily-task points system,
a learning center, referrals, a leaderboard, manual-review withdrawals, and a
full admin panel.

> **Important, by design:** the platform never guarantees income, never
> fabricates payment proofs or balances, and every reward (task points,
> referral points, withdrawal "Paid" status) requires either verification or
> manual admin action. See `src/pages/legal/EarningsDisclaimer.tsx`.

---

## 1. Project structure

```
earn-learn-pk/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── .env.example
├── supabase/
│   ├── schema.sql        # full DB schema, RLS policies, RPCs, triggers
│   └── seed.sql          # optional sample content
└── src/
    ├── main.tsx
    ├── App.tsx            # all routes
    ├── index.css          # design tokens / Tailwind layer
    ├── types/index.ts      # shared TypeScript types (mirrors schema.sql)
    ├── lib/supabase.ts     # Supabase client (falls back to demo mode)
    ├── data/demoData.ts    # sample/demo content, clearly labeled
    ├── contexts/AuthContext.tsx
    ├── components/
    │   ├── layout/         # Navbar, Footer, PublicLayout, DashboardLayout, AdminLayout
    │   └── ui/              # Badge, EmptyState, Skeleton, ProgressBar, ConfirmDialog
    └── pages/
        ├── public/          # Home, About, Contact, FAQ, public previews, NotFound
        ├── legal/            # Privacy, Terms, EarningsDisclaimer, CommunityGuidelines
        ├── auth/             # Login, Signup, ForgotPassword
        ├── dashboard/        # Dashboard, Opportunities, DailyTasks, LearnSkills,
        │                     # Rewards, Referrals, Leaderboard, Notifications, Profile, Support
        └── admin/            # AdminOverview, Users, Opportunities, Tasks, Courses,
                               # Withdrawals, Ads, Analytics, Settings
```

**Demo mode:** if `.env` isn't configured, the app runs fully with local
sample data (`src/data/demoData.ts`) so you can review the UI end-to-end
before connecting Supabase. Every integration point that needs a real
Supabase call is marked with a `// INTEGRATION POINT` comment in the code.

---

## 2. Supabase setup instructions

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy the **Project URL** and **anon public key**.
3. Copy `.env.example` to `.env` and fill in both values:
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
   ```
4. In the Supabase **SQL Editor**, run `supabase/schema.sql` (creates all
   tables, enums, RLS policies, triggers, and RPC functions).
5. Optionally run `supabase/seed.sql` to populate sample tasks, opportunities,
   and courses.
6. In **Authentication → Providers**, make sure **Email** is enabled. Under
   **Authentication → URL Configuration**, set your site URL (e.g.
   `http://localhost:5173` for local dev, your production domain later).

## 3. Database SQL

See `supabase/schema.sql` — it defines: `profiles`, `opportunities`, `tasks`,
`task_completions`, `courses`, `lessons`, `quizzes`, `quiz_results`,
`points_transactions`, `withdrawals`, `referrals`, `notifications`,
`advertisements`, `admin_settings`, `support_tickets`, `reports`, plus:

- **Row Level Security** on every table (users only see their own private
  data; only `profiles.is_admin = true` accounts can write admin data).
- A trigger that auto-creates a `profiles` row (with a unique referral code)
  whenever someone signs up, and links a referral if a valid code was supplied.
- A trigger that keeps `profiles.points_balance` in sync with the
  `points_transactions` ledger automatically — so the balance is always a
  derived, auditable value, never edited directly.
- Two RPCs for the two operations that must be atomic and validated
  server-side: `admin_verify_task_completion()` and `request_withdrawal()`.

## 4. Admin setup instructions

There's no separate admin sign-up flow — any user can be promoted:

1. Sign up normally through the app (`/signup`).
2. In the Supabase SQL editor, run:
   ```sql
   update profiles set is_admin = true where email = 'you@example.com';
   ```
3. Log back in — a black **Admin Panel** link now appears in the dashboard
   sidebar, and `/admin` becomes accessible (both enforced by RLS server-side
   and by a client-side redirect for UX).

## 5. Environment variables required

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

No server-side secret keys are needed for the MVP — all access control is
enforced by Postgres Row Level Security, not application code.

## 6. How to run the application

```bash
npm install
cp .env.example .env   # then fill in your Supabase credentials
npm run dev
```

Visit `http://localhost:5173`. Without a configured `.env`, the app still
runs in **demo mode** with sample data (sign-up/login are disabled, but
`/dashboard` and `/admin` [as a non-admin, redirected] can be previewed).

**Quick sanity checklist after `npm install`:**
```bash
npm run build     # TypeScript + Vite build — catches type errors
npm run dev        # local preview at http://localhost:5173
```
Then click through: `/` → `/signup` → `/login` → `/dashboard` → each sidebar
item → `/admin` (should redirect unless you've promoted your account — see
"Admin setup instructions" above) → back to `/admin` as an admin.

## 7. How to deploy it

Any static host works since this is a Vite SPA:

- **Vercel / Netlify**: connect the repo, set the build command
  `npm run build`, output directory `dist`, and add the two `VITE_*`
  environment variables in the host's dashboard.
- **Manual**: `npm run build` then upload the `dist/` folder to any static
  host (S3 + CloudFront, Cloudflare Pages, GitHub Pages, etc). Since this is
  a client-side router, configure your host to rewrite all routes to
  `index.html` (SPA fallback).

Supabase itself needs no separate deployment — it's already hosted.

## 8. How to connect advertising

The admin panel's **Advertising** page (`/admin/ads`) manages ad placements
stored in the `advertisements` table (`home_hero`, `dashboard_sidebar`,
`opportunities_inline`).

1. Get an ad network snippet (e.g. Google AdSense/Ad Manager unit code).
2. In `/admin/ads`, add a placement and paste the snippet into `ad_code`.
3. **Integration point:** render `ad_code` inside the corresponding page
   location (e.g. the Home hero section, the dashboard sidebar) using an
   HTML injection component, and wire real `impressions`/`clicks` counters
   to the ad network's callback events — never simulate these numbers.
4. Toggle the placement on/off from the same page.

## 9. How to add affiliate opportunities

Affiliate opportunities are just `opportunities` rows with
`category = 'affiliate_marketing'`:

1. In `/admin/opportunities`, click **Add opportunity**.
2. Set `external_url` to your affiliate tracking link (e.g. an Impact,
   PartnerStack, or direct affiliate link with your referral parameter).
3. Leave it as `pending` if you want a second admin to review it, or approve
   it directly.
4. **Integration point:** wire `click_count` to increment via a Supabase RPC
   or edge function when a user clicks **View Opportunity**, so affiliate
   click-through data is real and auditable — see the `onClick` comment in
   `src/pages/dashboard/Opportunities.tsx`.

Other legitimate monetization paths already scaffolded:
- **Featured listings** — the `is_featured` flag/star toggle in
  `/admin/opportunities` (charge partners for featured placement).
- **Premium courses** — the `is_premium` flag in `/admin/courses` and the
  Free/Premium filter in `/dashboard/learn`.
- **Sponsored tasks** — the `sponsored` task type in the `tasks` table.
- **Business sponsorships** — use the `admin_announcement` field in
  `admin_settings` for sponsored platform banners.

---

## Notes on what's stubbed vs. wired

**Fully wired to Supabase (falls back to demo data/local state when `.env` isn't set):**
- Auth: sign-up, login, logout, password reset, session restore, profile fetch.
- User dashboard: Opportunities (list + click tracking via RPC), Daily Tasks
  (list + start/submit), Rewards (settings + history + `request_withdrawal`
  RPC), Referrals (list + counts via a disambiguated FK join), Notifications
  (list + mark read), Learn Skills (course list), Profile (edit + save).
- Admin panel — **all nine pages** are now wired: Overview and Analytics
  (live aggregate queries: user counts, verified tasks, points issued,
  pending/paid withdrawals, referral sign-ups, opportunity clicks), Users
  (list + suspend/activate), Opportunities (list + create/approve/reject/
  feature/delete), Tasks (list + create/delete + verify via
  `admin_verify_task_completion` RPC), Courses (list + create/delete),
  Withdrawals (list + approve/reject/mark paid), Advertising (list + create/
  toggle/delete), Settings (real `admin_settings` singleton row).

**Intentionally out of scope for this pass** (schema is ready, UI is not):
- A lesson/quiz authoring UI inside Courses (`lessons`, `quizzes`,
  `quiz_results` tables exist and are RLS-protected, but "Manage lessons"
  is currently a placeholder).
- Per-course progress tracking for logged-in users (shows 0% until lesson
  completion is tracked).
- `support_tickets` and `reports` tables exist but have no UI yet.
- Real ad-network impression/click callbacks (the `advertisements` table and
  admin CRUD are wired; wiring the actual AdSense/Ad Manager event pixels is
  the next step — see "How to connect advertising" above).

Every mutation that must be atomic or admin-gated (points, withdrawals,
click counts, task verification) goes through a Postgres RPC rather than a
raw client insert/update, so the server — not just the UI — enforces the
business rules even if a request bypasses the frontend.

## Verification performed on this codebase

This project was built and audited in a sandboxed environment without
package-registry network access, so `npm install` / `npm run build` could
not be executed here. In its place, the following was checked directly
against the source files:

- Every `@/...` import resolves to a real exported symbol.
- Every `supabase.from('table')` call targets a table that exists in
  `supabase/schema.sql`.
- Every `supabase.rpc('fn')` call targets a function defined in
  `supabase/schema.sql`.
- Every embedded relationship query (e.g. `profiles(full_name)`) was checked
  for foreign-key ambiguity — `task_completions`, `withdrawals`, and
  `referrals` each have two FKs into `profiles`, so those queries explicitly
  name the constraint (e.g. `profiles!withdrawals_user_id_fkey(full_name)`)
  to avoid a PostgREST "ambiguous relationship" error.
- All edited files have balanced braces/parens (a lightweight parse check).
- `AdminLayout` redirects non-admins to `/dashboard`, and every admin-only
  table write is separately enforced server-side by an `is_admin()` RLS
  policy — so the protection holds even if the client check is bypassed.
- Before wiring, running the app in demo mode never produces a blank
  screen: `AuthProvider` always resolves `loading` to `false` and supplies a
  demo profile when Supabase isn't configured, so every route renders.

Before deploying, run `npm install && npm run build` yourself (or `npm run
dev` locally) to catch any TypeScript/bundler issues a static review can't —
this project has not had a compiler pass run against it.

