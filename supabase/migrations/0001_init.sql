-- Pro Se Helper — Phase 0 schema
-- Local Postgres + pgvector. No auth, no RLS (demo product).

create extension if not exists vector;

-- Case lifecycle state machine
do $$ begin
  create type case_status as enum (
    'intake',
    'triaged',
    'routed_to_lawyer',
    'analyzed',
    'drafted',
    'submitted',
    'in_review',
    'changes_requested',
    'approved',
    'filed',
    'tracking'
  );
exception when duplicate_object then null; end $$;

-- Demo identities (no auth)
create table if not exists clients (
  id         uuid primary key default gen_random_uuid(),
  full_name  text not null,
  created_at timestamptz not null default now()
);

create table if not exists lawyers (
  id         uuid primary key default gen_random_uuid(),
  full_name  text not null,
  email      text,
  created_at timestamptz not null default now()
);

create table if not exists cases (
  id                 uuid primary key default gen_random_uuid(),
  client_id          uuid not null references clients(id) on delete cascade,
  assigned_lawyer_id uuid references lawyers(id) on delete set null,
  status             case_status not null default 'intake',
  dispute_summary    text,
  claim_amount       numeric(10,2),
  in_scope           boolean,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Append-only diligence / audit trail
create table if not exists case_events (
  id         bigint generated always as identity primary key,
  case_id    uuid not null references cases(id) on delete cascade,
  actor      text not null,          -- e.g. 'client', 'lawyer', 'system'
  action     text not null,
  payload    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_cases_client on cases(client_id);
create index if not exists idx_cases_status on cases(status);
create index if not exists idx_case_events_case on case_events(case_id);
