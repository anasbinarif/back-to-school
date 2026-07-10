-- ============================================================================
-- Migration 0003 — add responsible person to children
-- Run this in the Supabase SQL Editor. Safe to run multiple times.
-- ============================================================================

alter table public.children
  add column if not exists responsible text;
