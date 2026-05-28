const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres' });

const sql = `
CREATE TABLE IF NOT EXISTS lawyer_notifications (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id  uuid        NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
  case_id    uuid        REFERENCES cases(id) ON DELETE CASCADE,
  type       text        NOT NULL,
  message    text        NOT NULL,
  read       boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lawyer_notifs_lawyer ON lawyer_notifications(lawyer_id, read, created_at DESC);
`;

pool.query(sql)
  .then(() => { console.log('Migration 0007 applied — lawyer_notifications table created.'); pool.end(); })
  .catch(e => { console.error(e.message); pool.end(); });
