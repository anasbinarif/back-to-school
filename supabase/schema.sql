-- ============================================================================
-- Back to School — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- ============================================================================

-- Enable UUID generation (pgcrypto provides gen_random_uuid()).
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enum for payment type
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'payment_type') then
    create type payment_type as enum ('monthly_fee', 'one_time');
  end if;
end$$;

-- ----------------------------------------------------------------------------
-- children
-- ----------------------------------------------------------------------------
create table if not exists public.children (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  age              int,
  city             text,
  school_name      text,
  class_name       text,          -- class / grade, e.g. "5", "KG", "Matric"
  monthly_fee      numeric not null default 0,
  reason           text,          -- why the family cannot afford schooling
  books_cost       numeric not null default 0,
  clothes_cost     numeric not null default 0,
  transport_cost   numeric not null default 0,
  guardian_contact text,          -- guardian phone number (admin-only)
  responsible      text,          -- person responsible for this child (admin-only)
  notes            text,          -- internal admin notes (admin-only)
  created_at       timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- payments
-- ----------------------------------------------------------------------------
create table if not exists public.payments (
  id                uuid primary key default gen_random_uuid(),
  child_id          uuid not null references public.children(id) on delete cascade,
  amount            numeric not null,
  payment_type      payment_type not null,
  one_time_category text,
  payment_date      date not null,
  notes             text,
  created_at        timestamptz not null default now()
);

create index if not exists payments_child_id_idx on public.payments(child_id);

-- ----------------------------------------------------------------------------
-- donations
-- ----------------------------------------------------------------------------
create table if not exists public.donations (
  id            uuid primary key default gen_random_uuid(),
  donor_name    text,
  amount        numeric not null,
  donation_date date not null,
  notes         text,
  created_at    timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security
-- ----------------------------------------------------------------------------
-- The public site reads data with the anon key, so we allow anonymous SELECT.
-- All writes require an authenticated user (the single admin). The service is
-- a single-admin app, so any authenticated session is treated as the admin.
-- ============================================================================
alter table public.children  enable row level security;
alter table public.payments  enable row level security;
alter table public.donations enable row level security;

-- Public read access
drop policy if exists "Public read children"  on public.children;
drop policy if exists "Public read payments"  on public.payments;
drop policy if exists "Public read donations" on public.donations;

create policy "Public read children"  on public.children  for select using (true);
create policy "Public read payments"  on public.payments  for select using (true);
create policy "Public read donations" on public.donations for select using (true);

-- Authenticated write access (insert / update / delete)
drop policy if exists "Admin write children"  on public.children;
drop policy if exists "Admin write payments"  on public.payments;
drop policy if exists "Admin write donations" on public.donations;

create policy "Admin write children"  on public.children
  for all to authenticated using (true) with check (true);
create policy "Admin write payments"  on public.payments
  for all to authenticated using (true) with check (true);
create policy "Admin write donations" on public.donations
  for all to authenticated using (true) with check (true);
