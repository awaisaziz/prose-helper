import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/index";
import { draftForm7A } from "@/lib/ai/form7a";
import type { AssessmentResult } from "@/lib/ai/assess";

// POST /api/cases/[id]/prepare — draft Form 7A + evidence checklist
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const rows = await query<{
      dispute_summary: string;
      claim_amount: string;
      matter_type: string;
      assessment: AssessmentResult;
      client_name: string;
    }>(
      `select c.dispute_summary, c.claim_amount, c.matter_type,
              c.assessment, cl.full_name as client_name
       from cases c
       join clients cl on cl.id = c.client_id
       where c.id = $1`,
      [id]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const c = rows[0];
    if (!c.assessment || !Object.keys(c.assessment).length) {
      return NextResponse.json(
        { error: "Case must be assessed before preparing Form 7A. Run /assess first." },
        { status: 400 }
      );
    }

    const result = await draftForm7A(
      c.dispute_summary,
      parseFloat(c.claim_amount),
      c.client_name,
      "The Defendant",   // placeholder — no defendant info yet
      c.assessment
    );

    await query(
      `update cases
       set form7a_draft = $1, evidence_items = $2, status = 'drafted', updated_at = now()
       where id = $3`,
      [JSON.stringify(result.form), JSON.stringify(result.evidence), id]
    );

    await query(
      `insert into case_events (case_id, actor, action, payload)
       values ($1, 'system', 'form7a_drafted', '{}'::jsonb)`,
      [id]
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("POST /api/cases/[id]/prepare", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
