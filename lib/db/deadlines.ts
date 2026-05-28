import "server-only";
import { query } from "./index";

export interface DeadlineRow {
  id: string;
  case_id: string;
  client_name: string;
  case_status: string;
  title: string;
  rule_anchor: string | null;
  due_date: string;
  urgency: string;
  status: string;
  notified: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export async function getDeadlinesForLawyer(lawyerId: string): Promise<DeadlineRow[]> {
  return query<DeadlineRow>(
    `SELECT
       d.id, d.case_id, cl.full_name AS client_name, c.status AS case_status,
       d.title, d.rule_anchor, d.due_date::text, d.urgency, d.status,
       d.notified, d.notes, d.created_at, d.updated_at
     FROM deadlines d
     JOIN cases c ON c.id = d.case_id
     JOIN clients cl ON cl.id = c.client_id
     WHERE d.lawyer_id = $1
       AND d.status IN ('pending', 'overdue', 'snoozed')
     ORDER BY
       CASE d.status WHEN 'overdue' THEN 0 ELSE 1 END,
       d.due_date ASC`,
    [lawyerId]
  );
}

export async function getDeadlinesForCase(caseId: string): Promise<DeadlineRow[]> {
  return query<DeadlineRow>(
    `SELECT
       d.id, d.case_id, cl.full_name AS client_name, c.status AS case_status,
       d.title, d.rule_anchor, d.due_date::text, d.urgency, d.status,
       d.notified, d.notes, d.created_at, d.updated_at
     FROM deadlines d
     JOIN cases c ON c.id = d.case_id
     JOIN clients cl ON cl.id = c.client_id
     WHERE d.case_id = $1
     ORDER BY d.due_date ASC`,
    [caseId]
  );
}

export async function createDeadline(
  caseId: string,
  lawyerId: string,
  title: string,
  dueDate: string,
  urgency: string,
  ruleAnchor?: string,
  notes?: string
): Promise<{ id: string }> {
  const rows = await query<{ id: string }>(
    `INSERT INTO deadlines (case_id, lawyer_id, title, due_date, urgency, rule_anchor, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [caseId, lawyerId, title, dueDate, urgency, ruleAnchor ?? null, notes ?? null]
  );
  return rows[0];
}

export async function updateDeadlineStatus(
  id: string,
  status: string
): Promise<void> {
  await query(
    `UPDATE deadlines SET status = $1, updated_at = now() WHERE id = $2`,
    [status, id]
  );
}
