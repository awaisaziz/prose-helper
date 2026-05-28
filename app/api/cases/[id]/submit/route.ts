import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/index";

const DEMO_CLIENT_ID = "00000000-0000-0000-0000-0000000000a1";

// POST /api/cases/[id]/submit — move drafted case to submitted
// Auto-connects the client's default lawyer if no connection exists yet.
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

    // Auto-connect default lawyer if no connection exists yet
    const [existingConn, clientProfile] = await Promise.all([
      query<{ id: string }>(
        `select id from connections where case_id = $1 limit 1`,
        [id]
      ),
      query<{ default_lawyer_id: string | null }>(
        `select default_lawyer_id from clients where id = $1`,
        [client_id]
      ),
    ]);

    if (existingConn.length === 0 && clientProfile[0]?.default_lawyer_id) {
      const defaultLawyerId = clientProfile[0].default_lawyer_id;
      await query(
        `insert into connections (case_id, client_id, lawyer_id, status)
         values ($1, $2, $3, 'requested')
         on conflict (case_id, lawyer_id) do nothing`,
        [id, client_id, defaultLawyerId]
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
