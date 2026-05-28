-- Pro Se Helper — Phase 7: per-case lawyer ↔ client messaging

CREATE TABLE IF NOT EXISTS case_messages (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id          uuid        NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  sender           text        NOT NULL CHECK (sender IN ('lawyer', 'client')),
  sender_id        uuid        NOT NULL,
  body             text        NOT NULL CHECK (char_length(body) > 0),
  read_by_client   boolean     NOT NULL DEFAULT false,
  read_by_lawyer   boolean     NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_case ON case_messages(case_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_messages_unread_client ON case_messages(case_id, read_by_client) WHERE sender = 'lawyer';
CREATE INDEX IF NOT EXISTS idx_messages_unread_lawyer ON case_messages(case_id, read_by_lawyer) WHERE sender = 'client';
