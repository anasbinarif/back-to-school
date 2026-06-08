# Back to School — Sponsorship Tracker

A clean, data-focused web app for transparently tracking school sponsorship
payments for children in Pakistan. A public page shows where every rupee goes;
a password-protected admin panel manages children, payments and donations.

- **Public page (`/`)** — no login. Summary bar (total donated, total spent,
  balance remaining) and per-child cards with full payment history.
- **Admin panel (`/admin`)** — Supabase-authenticated single admin. Add/edit/
  delete children, log payments and donations, and review the full logs.

All currency is in **PKR**. All dates display as **DD/MM/YYYY**.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router, Server Components + Server Actions)
- [Supabase](https://supabase.com/) (Postgres + Auth)
- [Tailwind CSS](https://tailwindcss.com/)
- TypeScript — deploy-ready on [Vercel](https://vercel.com/)

---

## 1. Supabase setup

1. Create a project at [app.supabase.com](https://app.supabase.com).
2. Open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the
   `children`, `payments` and `donations` tables, the `payment_type` enum, and
   Row Level Security policies (public read, authenticated write).
3. Grab your API credentials from **Project Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Create the admin user

This app has **no signup flow** — you create the single admin by hand:

1. Go to **Authentication → Users → Add user → Create new user**.
2. Enter the admin email and a strong password.
3. Tick **Auto Confirm User** (so no email confirmation is required).
4. Save. These are the credentials you'll use at `/admin/login`.

> Optional: under **Authentication → Providers → Email**, you may disable
> "Enable Sign Ups" to ensure no one can self-register.

---

## 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Both variables are required for the app to read and write data.

---

## 3. Run locally

```bash
npm install
npm run dev
```

- Public page: <http://localhost:3000>
- Admin panel: <http://localhost:3000/admin> (redirects to login when signed out)

---

## 4. Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in **Project Settings → Environment Variables**.
4. Deploy. No further configuration is needed.

---

## Project structure

```
app/
  page.tsx                 Public summary + per-child cards
  admin/
    layout.tsx             Auth-gated chrome (nav + sign out)
    page.tsx               Dashboard overview
    login/page.tsx         Email + password login
    children/              Add / edit / delete children
    payments/              Log + delete payments
    donations/             Log + delete donations
    auth-actions.ts        Sign-out server action
components/                Shared UI (cards, forms, nav)
lib/
  supabase/                Browser, server & middleware clients (@supabase/ssr)
  format.ts                PKR currency + DD/MM/YYYY date helpers
  types.ts                 Shared TypeScript types
middleware.ts              Refreshes session, guards /admin routes
supabase/schema.sql        Database schema + RLS policies
```

## Notes on auth & security

- All `/admin` routes are protected by `middleware.ts`. Unauthenticated
  visitors are redirected to `/admin/login`.
- Public routes have **zero** auth requirements and read data with the anon key.
- Row Level Security allows anonymous `SELECT` but restricts all writes to
  authenticated sessions — so even the public anon key cannot modify data.
