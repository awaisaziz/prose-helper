import "server-only";
import { Pool } from "pg";

// Single shared pool for the app's server-side DB access.
// No auth / no RLS — this connects directly to the local Supabase Postgres.
const globalForPool = globalThis as unknown as { pgPool?: Pool };

export const pool =
  globalForPool.pgPool ??
  new Pool({
    connectionString:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
  });

if (process.env.NODE_ENV !== "production") globalForPool.pgPool = pool;

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const res = await pool.query(text, params as never[]);
  return res.rows as T[];
}
