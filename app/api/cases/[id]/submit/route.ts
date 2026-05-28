import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/index";
import { createLawyerNotification } from "@/lib/db/lawyer-notifications";

const DEMO_CLIENT_ID = "00000000-0000-0000-0000-0000000000a1";

// POST /api/cases/[id]/submit — move drafted case to submitted
// Auto-accepts the connection to the chosen lawyer so it appears immediately on their dashboard.
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const rows = await query<{ status: string; client_id: string }>(
      `select status, client_id from cases where id = $1`,
      [id]
    );
    if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { status, client_id } = rows[0];

    // Allow re-submission after changes_requested
    const allowed = ["drafted", "changes_requested"];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { error: `Case is already ${status}` },
        { status: 400 }
      );
    }

    // Get existing connection (lawyer already chosen by client via directory)
    const [existingConn, clientProfile] = await Promise.all([
      query<{ id: string; lawyer_id: string }>(
        `select id, lawyer_id from connections where case_id = $1 limit 1`,
        [id]
      ),
      query<{ default_lawyer_id: string | null }>(
        `select default_lawyer_id from clients where id = $1`,
        [client_id]
      ),
    ]);

    let lawyerId: string | null = null;

    if (existingConn.length > 0) {
      // Connection already exists — accept it immediately (client chose this lawyer)
      lawyerId = existingConn[0].lawyer_id;
      await query(
        `update connections
         set status = 'accepted', accepted_at = coalesce(accepted_at, now())
         where case_id = $1`,
        [id]
      );
    } else if (clientProfile[0]?.default_lawyer_id) {
      // No connection yet — create one accepted immediately using default lawyer
      lawyerId = clientProfile[0].default_lawyer_id;
      await query(
        `insert into connections (case_id, client_id, lawyer_id, status, accepted_at)
         values ($1, $2, $3, 'accepted', now())
         on conflict (case_id, lawyer_id) do update
           set status = 'accepted', accepted_at = coalesce(connections.accepted_at, now())`,
        [id, client_id, lawyerId]
      );
    }

    // Assign the lawyer on the case itself so dashboard queries surface it
    if (lawyerId) {
      await query(
        `update cases
         set status = 'submitted', assigned_lawyer_id = $2, updated_at = now()
         where id = $1`,
        [id, lawyerId]
      );
    } else {
      await query(
        `update cases set status = 'submitted', updated_at = now() where id = $1`,
        [id]
      );
    }

    await query(
      `insert into case_events (case_id, actor, action, payload)
       values ($1, 'client', 'submitted_for_review', '{}'::jsonb)`,
      [id]
    );

    // Notify the lawyer
    if (lawyerId) {
      const notifType = status === "changes_requested" ? "client_resubmitted" : "new_submission";
      const clientRows = await query<{ full_name: string }>(
        `SELECT full_name FROM clients WHERE id = $1`,
        [client_id]
      );
      const clientName = clientRows[0]?.full_name ?? "A client";
      const notifMsg = notifType === "new_submission"
        ? `${clientName} submitted a new claim for your review.`
        : `${clientName} has resubmitted their claim after your requested changes.`;
      await createLawyerNotification(lawyerId, notifType, notifMsg, id);
    }

    // Notify client that submission succeeded
    await query(
      `insert into notifications (client_id, case_id, type, message)
       values ($1, $2, 'info', 'Your claim has been submitted for lawyer review. You''ll be notified when they respond.')
       on conflict do nothing`,
      [client_id, id]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/cases/[id]/submit", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
