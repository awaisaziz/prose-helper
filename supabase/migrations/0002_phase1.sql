-- Pro Se Helper — Phase 1: intake + assessment columns, lawyer profiles, connections

-- Extend cases with structured AI output (all jsonb — no extra joins needed)
ALTER TABLE cases ADD COLUMN IF NOT EXISTS matter_type      text;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS intake_data      jsonb DEFAULT '{}'::jsonb;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS legal_framework  jsonb DEFAULT '{}'::jsonb;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS assessment       jsonb DEFAULT '{}'::jsonb;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS rights_remedies  jsonb DEFAULT '{}'::jsonb;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS form7a_draft     jsonb DEFAULT '{}'::jsonb;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS evidence_items   jsonb DEFAULT '[]'::jsonb;

-- Lawyer public profiles (shown in the directory)
CREATE TABLE IF NOT EXISTS lawyer_profiles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id    uuid REFERENCES lawyers(id) ON DELETE CASCADE,
  title        text,
  bio          text,
  specialties  text[]          DEFAULT '{}',
  image_url    text,
  hourly_rate  integer,        -- CAD, "from" value
  years_exp    integer,
  active       boolean         NOT NULL DEFAULT true,
  created_at   timestamptz     NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_active ON lawyer_profiles(active);

-- Client → lawyer connection requests
CREATE TABLE IF NOT EXISTS connections (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id      uuid        NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  client_id    uuid        NOT NULL REFERENCES clients(id),
  lawyer_id    uuid        NOT NULL REFERENCES lawyers(id),
  status       text        NOT NULL DEFAULT 'requested',  -- requested | accepted | declined
  requested_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (case_id, lawyer_id)
);

CREATE INDEX IF NOT EXISTS idx_connections_case    ON connections(case_id);
CREATE INDEX IF NOT EXISTS idx_connections_lawyer  ON connections(lawyer_id);
