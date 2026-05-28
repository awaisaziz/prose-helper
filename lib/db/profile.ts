import "server-only";
import { query } from "./index";

export interface ClientProfile {
  id: string;
  full_name: string;
  created_at: string;
}

export interface CaseStats {
  total: number;
  active: number;    // intake / triaged / analyzed / drafted
  submitted: number; // submitted / in_review / changes_requested
  approved: number;  // approved / filed / tracking
  routed: number;    // routed_to_lawyer
}

export async function getClientProfile(clientId: string): Promise<ClientProfile | null> {
  const rows = await query<ClientProfile>(
    `select id, full_name, created_at from clients where id = $1`,
    [clientId]
  );
  return rows[0] ?? null;
}

export async function getCaseStats(clientId: string): Promise<CaseStats> {
  const rows = await query<{ status: string; cnt: string }>(
    `select status, count(*) as cnt from cases where client_id = $1 group by status`,
    [clientId]
  );

  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.status] = parseInt(r.cnt, 10);

  const active = ["intake", "triaged", "analyzed", "drafted"].reduce(
    (s, k) => s + (counts[k] ?? 0), 0
  );
  const submitted = ["submitted", "in_review", "changes_requested"].reduce(
    (s, k) => s + (counts[k] ?? 0), 0
  );
  const approved = ["approved", "filed", "tracking"].reduce(
    (s, k) => s + (counts[k] ?? 0), 0
  );
  const routed = counts["routed_to_lawyer"] ?? 0;
  const total = Object.values(counts).reduce((s, v) => s + v, 0);

  return { total, active, submitted, approved, routed };
}

export async function updateClientName(clientId: string, name: string): Promise<void> {
  await query(
    `update clients set full_name = $1 where id = $2`,
    [name.trim(), clientId]
  );
}
