import "server-only";
import { query } from "./index";
import { createNotification } from "./notifications";

const DECISION_STATUS: Record<string, string> = {
  in_review:          "in_review",
  changes_requested:  "changes_requested",
  approved:           "approved",
};

const DECISION_NOTIFICATION: Record<string, string> = {
  in_review:
    "Your lawyer is actively reviewing your claim. You'll be notified when they reach a decision.",
  changes_requested:
    "Your lawyer has requested edits before approving. Open your claim to review their feedback and re-submit.",
  approved:
    "🎉 Your claim has been approved! Your lawyer will be in touch to arrange filing with the court.",
};

export async function createReview(
  caseId: string,
  lawyerId: string,
  decision: string,
  notes?: string
): Promise<void> {
  const newStatus = DECISION_STATUS[decision];
  if (!newStatus) throw new Error(`Unknown review decision: ${decision}`);

  // 1. Persist review record
  await query(
    `INSERT INTO case_reviews (case_id, lawyer_id, decision, notes)
     VALUES ($1, $2, $3, $4)`,
    [caseId, lawyerId, decision, notes ?? null]
  );

  // 2. Update case status
  await query(
    `UPDATE cases SET status = $1, updated_at = now() WHERE id = $2`,
    [newStatus, caseId]
  );

  // 3. Mark connection accepted (first time lawyer takes an action)
  if (decision === "in_review") {
    await query(
      `UPDATE connections SET status = 'accepted', accepted_at = now()
       WHERE case_id = $1 AND lawyer_id = $2 AND accepted_at IS NULL`,
      [caseId, lawyerId]
    );
  }

  // 4. Audit event
  await query(
    `INSERT INTO case_events (case_id, actor, action, payload)
     VALUES ($1, 'lawyer', $2, $3::jsonb)`,
    [caseId, decision, JSON.stringify({ notes: notes ?? null })]
  );

  // 5. Client notification — look up client_id from case
  const caseRows = await query<{ client_id: string }>(
    `SELECT client_id FROM cases WHERE id = $1`,
    [caseId]
  );
  if (caseRows.length) {
    const { client_id } = caseRows[0];
    const message = DECISION_NOTIFICATION[decision];
    await createNotification(client_id, decision, message, caseId);
  }
}
