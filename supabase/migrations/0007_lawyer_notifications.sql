-- Pro Se Helper — Phase 8: lawyer notifications

CREATE TABLE IF NOT EXISTS lawyer_notifications (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id  uuid        NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
  case_id    uuid        REFERENCES cases(id) ON DELETE CASCADE,
  type       text        NOT NULL,  -- new_submission | client_message | client_resubmitted | connection_request
  message    text        NOT NULL,
  read       boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lawyer_notifs_lawyer ON lawyer_notifications(lawyer_id, read, created_at DESC);
