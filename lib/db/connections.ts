import "server-only";
import { query } from "./index";

export async function createConnection(
  case_id: string,
  client_id: string,
  lawyer_id: string
): Promise<{ id: string }> {
  const rows = await query<{ id: string }>(
    `insert into connections (case_id, client_id, lawyer_id)
     values ($1, $2, $3)
     on conflict (case_id, lawyer_id) do update set status = 'requested'
     returning id`,
    [case_id, client_id, lawyer_id]
  );
  return rows[0];
}

export async function getConnectionsForCase(case_id: string) {
  return query<{ lawyer_id: string; status: string }>(
    `select lawyer_id, status from connections where case_id = $1`,
    [case_id]
  );
}
