# Pro Se Helper

AI co-counsel web app for self-represented litigants in **Ontario Small Claims
Court** — debt & money disputes up to $50,000. Two surfaces: a guided **client**
journey and a **lawyer** console (review + Deadline Guardian).

> Not legal advice. Drafting and information assistance only; nothing is filed
> until a licensed lawyer signs off.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Supabase local (Docker): Postgres + pgvector + Inbucket — used as a local DB
  and dev mail catcher. **No auth, no RLS** (demo product).
- OpenAI API (chat + embeddings) — the only external call.
- Legal data behind a `LegalSource` interface (A2AJ corpus + Ontario e-Laws in
  Phase 2). No CanLII.

## Prerequisites

- Node 18+ and npm
- Docker Desktop (running) for the local Supabase stack

## Setup

```bash
npm install
cp .env.example .env.local   # set OPENAI_API_KEY (needed from Phase 1 on)
npm run db:start             # starts local Supabase (Docker)
npm run db:reset             # applies migrations + seed data
npm run dev                  # http://localhost:3000
```

`npm run dev:full` starts Supabase and the dev server together.

Supabase Studio: http://localhost:54323 · Inbucket (email): http://localhost:54324

## Scripts

| Script | Purpose |
| --- | --- |
| `dev` | Next dev server |
| `dev:full` | `supabase start` then dev server |
| `db:start` / `db:stop` | Start / stop local Supabase |
| `db:reset` | Re-apply migrations + seed |

## Seed data

- Lawyer: **Jordan Avery, LL.B.**
- Clients: **Sam Patel**, **Riley Chen**
- One sample submitted case (contractor deposit dispute)

## Status

**Phase 0** complete: scaffold, schema, two-card landing → client / lawyer
dashboards reading seed data. See the plan for phases 1–6.
