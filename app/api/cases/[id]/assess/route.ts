import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/index";
import { assessCase } from "@/lib/ai/assess";

// POST /api/cases/[id]/assess — run legal framework + case-strength analysis
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Load case
    const rows = await query<{
      dispute_summary: string;
      claim_amount: string;
      matter_type: string;
      in_scope: boolean;
    }>(
      `select dispute_summary, claim_amount, matter_type, in_scope from cases where id = $1`,
      [id]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const c = rows[0];
    if (!c.in_scope) {
      return NextResponse.json({ error: "Case is out of scope" }, { status: 400 });
    }

    const assessment = await assessCase(
      c.dispute_summary,
      c.matter_type ?? "other",
      parseFloat(c.claim_amount)
    );

    // Persist
    await query(
      `update cases
       set assessment = $1, rights_remedies = $2, legal_framework = $3, status = 'analyzed', updated_at = now()
       where id = $4`,
      [
        JSON.stringify(assessment),
        JSON.stringify(assessment.rights_remedies),
        JSON.stringify(assessment.legal_framework),
        id,
      ]
    );

    await query(
      `insert into case_events (case_id, actor, action, payload)
       values ($1, 'system', 'case_assessed', $2)`,
      [id, JSON.stringify({ case_strength: assessment.case_strength })]
    );

    return NextResponse.json({ assessment });
  } catch (err) {
    console.error("POST /api/cases/[id]/assess", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
