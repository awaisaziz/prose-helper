import "server-only";
import { query } from "./index";
import type { AssessmentResult } from "@/lib/ai/assess";
import type { Form7AFields, EvidenceItem } from "@/lib/ai/form7a";

export interface DeadlineSummary {
  id: string;
  title: string;
  rule_anchor: string | null;
  due_date: string;
  urgency: string;
  status: string;
  notes: string | null;
}

export interface ReviewRow {
  id: string;
  decision: string;
  notes: string | null;
  created_at: string;
  lawyer_name: string;
}

export interface CaseEventRow {
  id: string;
  actor: string;
  action: string;
  payload: Record<string, unknown>;
  created_at: string;
}

/** Row returned for the priority queue */
export interface LawyerCaseRow {
  id: string;
  client_name: string;
  status: string;
  dispute_summary: string | null;
  claim_amount: string | null;
  matter_type: string | null;
  created_at: string;
  updated_at: string;
  overdue_count: number;
  imminent_count: number;  // due within 3 days
  next_deadline_date: string | null;
  next_deadline_title: string | null;
}

/** Full case detail for the review page */
export interface FullCaseDetail {
  id: string;
  client_id: string;
  client_name: string;
  status: string;
  dispute_summary: string | null;
  claim_amount: string | null;
  matter_type: string | null;
  in_scope: boolean | null;
  assessment: AssessmentResult | null;
  form7a_draft: Form7AFields | null;
  evidence_items: EvidenceItem[] | null;
  legal_framework: AssessmentResult["legal_framework"] | null;
  rights_remedies: AssessmentResult["rights_remedies"] | null;
  created_at: string;
  updated_at: string;
  deadlines: DeadlineSummary[];
  reviews: ReviewRow[];
  events: CaseEventRow[];
  connection_status: "requested" | "accepted" | "declined" | null;
}

/**
 * Status weight for urgency sort — higher = surfaces first.
 * computed in SQL via CASE expression.
 */
const STATUS_WEIGHT_SQL = `
  CASE c.status
    WHEN 'submitted'          THEN 30
    WHEN 'changes_requested'  THEN 40
    WHEN 'in_review'          THEN 20
    WHEN 'approved'           THEN 10
    ELSE 5
  END
`;

export async function getCasesForLawyer(lawyerId: string): Promise<LawyerCaseRow[]> {
  return query<LawyerCaseRow>(
    `SELECT
       c.id,
       cl.full_name               AS client_name,
       c.status,
       c.dispute_summary,
       c.claim_amount,
       c.matter_type,
       c.created_at,
       c.updated_at,
       COALESCE(d.overdue_count,  0) AS overdue_count,
       COALESCE(d.imminent_count, 0) AS imminent_count,
       d.next_deadline_date,
       d.next_deadline_title
     FROM cases c
     JOIN clients cl ON cl.id = c.client_id
     LEFT JOIN (
       SELECT
         case_id,
         COUNT(*) FILTER (WHERE status = 'overdue')                            AS overdue_count,
         COUNT(*) FILTER (WHERE status = 'pending' AND due_date <= CURRENT_DATE + 3) AS imminent_count,
         MIN(due_date) FILTER (WHERE status IN ('pending','overdue'))           AS next_deadline_date,
         MIN(title)    FILTER (WHERE due_date = (
           SELECT MIN(due_date) FROM deadlines d2
           WHERE d2.case_id = deadlines.case_id AND d2.status IN ('pending','overdue')
         ))                                                                     AS next_deadline_title
       FROM deadlines
       WHERE lawyer_id = $1
       GROUP BY case_id
     ) d ON d.case_id = c.id
     WHERE c.assigned_lawyer_id = $1
        OR EXISTS (
          SELECT 1 FROM connections cn
          WHERE cn.case_id = c.id AND cn.lawyer_id = $1
        )
     ORDER BY
       (COALESCE(d.overdue_count, 0) * 100
        + COALESCE(d.imminent_count, 0) * 50
        + ${STATUS_WEIGHT_SQL}) DESC,
       c.updated_at DESC`,
    [lawyerId]
  );
}

export async function getCaseDetail(caseId: string): Promise<FullCaseDetail | null> {
  const rows = await query<Omit<FullCaseDetail, "deadlines" | "reviews" | "events">>(
    `SELECT
       c.id, c.client_id, cl.full_name AS client_name,
       c.status, c.dispute_summary, c.claim_amount, c.matter_type, c.in_scope,
       c.assessment, c.form7a_draft, c.evidence_items,
       c.legal_framework, c.rights_remedies,
       c.created_at, c.updated_at
     FROM cases c
     JOIN clients cl ON cl.id = c.client_id
     WHERE c.id = $1`,
    [caseId]
  );

  if (!rows.length) return null;
  const base = rows[0];

  const [deadlines, reviews, events, connRows] = await Promise.all([
    query<DeadlineSummary>(
      `SELECT id, title, rule_anchor, due_date::text, urgency, status, notes
       FROM deadlines WHERE case_id = $1 ORDER BY due_date ASC`,
      [caseId]
    ),
    query<ReviewRow>(
      `SELECT cr.id, cr.decision, cr.notes, cr.created_at, lw.full_name AS lawyer_name
       FROM case_reviews cr
       JOIN lawyers lw ON lw.id = cr.lawyer_id
       WHERE cr.case_id = $1 ORDER BY cr.created_at DESC`,
      [caseId]
    ),
    query<CaseEventRow>(
      `SELECT id, actor, action, payload, created_at
       FROM case_events WHERE case_id = $1 ORDER BY created_at DESC LIMIT 15`,
      [caseId]
    ),
    query<{ status: string }>(
      `SELECT status FROM connections WHERE case_id = $1 LIMIT 1`,
      [caseId]
    ),
  ]);

  const connection_status = (connRows[0]?.status ?? null) as FullCaseDetail["connection_status"];
  return { ...base, deadlines, reviews, events, connection_status };
}
