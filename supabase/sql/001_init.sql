-- Supabase schema for FakeNewsZeiTon
create extension if not exists "pgcrypto";

create table profiles (
  id uuid primary key,
  email text,
  created_at timestamptz default now(),
  notify_enabled boolean default false,
  notify_frequency text default 'daily'
);

create table analyses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  owner_id uuid references profiles(id),
  input_type text,
  input_summary text,
  scores jsonb,
  verdict text,
  report_markdown text,
  claims jsonb,
  fingerprint text,
  is_flagged boolean default false
);

create table trending_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  title text,
  reason text,
  fingerprint text,
  sample_claims jsonb,
  score_fake_probability int,
  occurrences int default 1,
  last_seen timestamptz default now()
);

-- RLS and policies
-- profiles: a user can read/write own profile (auth.users.id)
-- analyses: allow insert for anyone, allow select for owner, service role for aggregates

-- Note: You need to run recommended Supabase auth setup and link profile IDs with auth.users.id
