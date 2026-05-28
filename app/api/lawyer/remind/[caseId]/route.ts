import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/index";
import { createNotification } from "@/lib/db/notifications";

const DEMO_LAWYER_ID = "00000000-0000-0000-0000-000000000001";

// POST /api/lawyer/remind/[caseId] — send a plain-English status reminder to client
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const body = await req.json() as { message?: string };

    const rows = await query<{ client_id: string; dispute_summary: string | null; status: string }>(
      `SELECT client_id, dispute_summary, status FROM cases WHERE id = $1`,
      [caseId]
    );
    if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { client_id, dispute_summary, status } = rows[0];

    // Build default plain-English message if none provided
    const defaultMessage = body.message?.trim() ||
      `Your lawyer is working on your ${status === "in_review" ? "claim review" : "matter"}. ` +
      `We'll notify you as soon as there's an update. ` +
      `${dispute_summary ? `(Re: ${dispute_summary.slice(0, 80)}${dispute_summary.length > 80 ? "…" : ""})` : ""}`;

    await createNotification(client_id, "info", defaultMessage, caseId);

    // Audit event
    await query(
      `INSERT INTO case_events (case_id, actor, action, payload)
       VALUES ($1, 'lawyer', 'reminder_sent', '{}'::jsonb)`,
      [caseId]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/lawyer/remind/[caseId]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
