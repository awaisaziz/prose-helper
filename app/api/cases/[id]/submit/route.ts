import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/index";

// POST /api/cases/[id]/submit — move drafted case to submitted
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const rows = await query<{ status: string }>(
      `select status from cases where id = $1`,
      [id]
    );
    if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { status } = rows[0];
    // Allow re-submission after changes_requested
    const allowed = ["drafted", "changes_requested"];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { error: `Case is already ${status}` },
        { status: 400 }
      );
    }

    await query(
      `update cases set status = 'submitted', updated_at = now() where id = $1`,
      [id]
    );

    await query(
      `insert into case_events (case_id, actor, action, payload)
       values ($1, 'client', 'submitted_for_review', '{}'::jsonb)`,
      [id]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/cases/[id]/submit", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
