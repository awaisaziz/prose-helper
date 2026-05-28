/**
 * db:migrate — applies all pending migrations (files in supabase/migrations/)
 * against the running local Supabase Postgres WITHOUT wiping data.
 *
 * Tracks which files have already been applied in a _migrations table so
 * subsequent runs are idempotent.
 */
import { readdirSync, readFileSync } from "fs";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const require = createRequire(import.meta.url);
const { Pool }  = require("pg");

const __dirname    = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, "..", "supabase", "migrations");

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

const pool = new Pool({ connectionString });
const client = await pool.connect();

try {
  // Create tracking table if needed
  await client.query(`
    create table if not exists _migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    )
  `);

  const { rows: applied } = await client.query("select name from _migrations");
  const appliedSet = new Set(applied.map((r) => r.name));

  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  let count = 0;
  for (const file of files) {
    if (appliedSet.has(file)) {
      console.log(`  ⏭  ${file} (already applied)`);
      continue;
    }
    const sql = readFileSync(path.join(migrationsDir, file), "utf8");
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query("insert into _migrations (name) values ($1)", [file]);
      await client.query("commit");
      console.log(`  ✅  ${file}`);
      count++;
    } catch (err) {
      await client.query("rollback");
      throw new Error(`Migration ${file} failed: ${err.message}`);
    }
  }

  if (count === 0) {
    console.log("✅  All migrations already applied — nothing to do.");
  } else {
    console.log(`✅  Applied ${count} migration(s).`);
  }
} catch (err) {
  console.error("❌  Migration failed:", err.message);
  process.exit(1);
} finally {
  client.release();
  await pool.end();
}
