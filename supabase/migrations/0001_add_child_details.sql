-- ============================================================================
-- Migration 0001 — add extra detail fields to children
-- Run this in the Supabase SQL Editor if you created the `children` table
-- before these columns existed. Safe to run multiple times.
-- ============================================================================

alter table public.children
  add column if not exists reason           text,
  add column if not exists books_cost       numeric not null default 0,
  add column if not exists clothes_cost     numeric not null default 0,
  add column if not exists transport_cost   numeric not null default 0,
  add column if not exists guardian_contact text,
  add column if not exists notes            text;
