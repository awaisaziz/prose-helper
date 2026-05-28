const { Pool } = require('pg');

const pool = new Pool({ connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres' });

async function run() {
  const r = await pool.query(
    "UPDATE connections SET status = 'accepted', accepted_at = now() WHERE case_id = '00000000-0000-0000-0000-0000000000c1' AND lawyer_id = '00000000-0000-0000-0000-000000000001'"
  );
  console.log('Connection updated to accepted, rows affected:', r.rowCount);
  await pool.end();
}

run().catch(e => { console.error(e.message); pool.end(); });

