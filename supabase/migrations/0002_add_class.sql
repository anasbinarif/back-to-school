-- ============================================================================
-- Migration 0002 — add class/grade to children
-- Run this in the Supabase SQL Editor. Safe to run multiple times.
-- ============================================================================

alter table public.children
  add column if not exists class_name text;
