-- Pro Se Helper — Phase 1b: default lawyer preference + notifications

-- Default lawyer preference per client
ALTER TABLE clients ADD COLUMN IF NOT EXISTS default_lawyer_id uuid REFERENCES lawyers(id) ON DELETE SET NULL;

-- Client notification inbox
CREATE TABLE IF NOT EXISTS notifications (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   uuid        NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  case_id     uuid        REFERENCES cases(id) ON DELETE CASCADE,
  type        text        NOT NULL,   -- lawyer_accepted | changes_requested | approved | filed | info
  message     text        NOT NULL,
  read        boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_client ON notifications(client_id, read, created_at DESC);
