-- Phase 6 — Deadline Guardian & Lawyer Review

-- ── Deadlines ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deadlines (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id     uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  lawyer_id   uuid NOT NULL REFERENCES lawyers(id),
  title       text NOT NULL,
  rule_anchor text,              -- e.g. "Rules of Small Claims Court r.7.01"
  due_date    date NOT NULL,
  urgency     text NOT NULL DEFAULT 'normal',   -- critical | high | normal | low
  status      text NOT NULL DEFAULT 'pending',  -- pending | done | overdue | snoozed
  notified    boolean NOT NULL DEFAULT false,   -- prevent duplicate client proximity alerts
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_deadlines_case   ON deadlines(case_id);
CREATE INDEX IF NOT EXISTS idx_deadlines_lawyer ON deadlines(lawyer_id, status, due_date);

-- ── Lawyer review decisions ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS case_reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id     uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  lawyer_id   uuid NOT NULL REFERENCES lawyers(id),
  decision    text NOT NULL,   -- in_review | changes_requested | approved
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reviews_case ON case_reviews(case_id);

-- ── Track when connection was accepted ───────────────────────────────────────
ALTER TABLE connections ADD COLUMN IF NOT EXISTS accepted_at timestamptz;
