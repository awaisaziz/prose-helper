import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/index";
import { triageCase } from "@/lib/ai/triage";

// POST /api/cases — create a case and run triage synchronously
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dispute_summary, claim_amount, matter_type, client_id } = body as {
      dispute_summary: string;
      claim_amount: number;
      matter_type?: string;
      client_id: string;
    };

    if (!dispute_summary || !claim_amount || !client_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Run triage
    const triage = await triageCase(dispute_summary, claim_amount);

    // Derive initial status
    const status = triage.in_scope ? "triaged" : "routed_to_lawyer";

    // Insert case
    const rows = await query<{ id: string }>(
      `insert into cases
         (client_id, status, dispute_summary, claim_amount, in_scope, matter_type, intake_data)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning id`,
      [
        client_id,
        status,
        dispute_summary,
        claim_amount,
        triage.in_scope,
        triage.matter_type,
        JSON.stringify(triage),
      ]
    );

    const case_id = rows[0].id;

    // Audit trail
    await query(
      `insert into case_events (case_id, actor, action, payload)
       values ($1, 'client', 'case_created', $2)`,
      [case_id, JSON.stringify({ triage })]
    );

    return NextResponse.json({ case_id, triage });
  } catch (err) {
    console.error("POST /api/cases", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
