/**
 * db:seed — re-runs seed.sql against the local Supabase Postgres WITHOUT wiping data.
 * All inserts use ON CONFLICT DO NOTHING, so existing rows are preserved.
 * Safe to run any number of times.
 */
import { readFileSync } from "fs";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const require = createRequire(import.meta.url);
const { Pool }  = require("pg");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath   = path.join(__dirname, "..", "supabase", "seed.sql");
const sql       = readFileSync(sqlPath, "utf8");

// Default local Supabase connection — override with DATABASE_URL env var
const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

const pool = new Pool({ connectionString });

try {
  await pool.query(sql);
  console.log("✅  Seed applied (existing rows preserved).");
} catch (err) {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
} finally {
  await pool.end();
}
