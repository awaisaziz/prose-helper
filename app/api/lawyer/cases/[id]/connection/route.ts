import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/index";

const DEMO_LAWYER_ID = "00000000-0000-0000-0000-000000000001";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: caseId } = await params;
    const { action } = await req.json() as { action: "accept" | "decline" };

    if (!["accept", "decline"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const newStatus = action === "accept" ? "accepted" : "declined";

    // Update connection status
    await query(
      `UPDATE connections
       SET status = $1, accepted_at = CASE WHEN $1 = 'accepted' THEN now() ELSE accepted_at END
       WHERE case_id = $2 AND lawyer_id = $3`,
      [newStatus, caseId, DEMO_LAWYER_ID]
    );

    // If accepting, mark case as in_review and log event
    if (action === "accept") {
      await query(
        `UPDATE cases SET status = 'in_review', updated_at = now()
         WHERE id = $1 AND status IN ('submitted', 'routed_to_lawyer', 'drafted')`,
        [caseId]
      );

      // Get client_id for the notification
      const rows = await query<{ client_id: string }>(
        `SELECT client_id FROM connections WHERE case_id = $1 AND lawyer_id = $2`,
        [caseId, DEMO_LAWYER_ID]
      );
      const clientId = rows[0]?.client_id;

      if (clientId) {
        // Fire notification to client
        await query(
          `INSERT INTO notifications (client_id, case_id, type, message)
           VALUES ($1, $2, 'lawyer_accepted', 'Your lawyer has accepted your case and is now reviewing it.')`,
          [clientId, caseId]
        );
      }

      // Log event
      await query(
        `INSERT INTO case_events (case_id, actor, action, payload)
         VALUES ($1, 'lawyer', 'in_review', '{}')`,
        [caseId]
      );
    }

    return NextResponse.json({ status: newStatus });
  } catch (err) {
    console.error("PATCH /api/lawyer/cases/[id]/connection", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
