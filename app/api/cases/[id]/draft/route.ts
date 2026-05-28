import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/index";
import type { Form7AFields } from "@/lib/ai/form7a";

// PATCH /api/cases/[id]/draft — save edited Form 7A fields
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { form7a_draft } = await req.json() as { form7a_draft: Form7AFields };

    if (!form7a_draft) {
      return NextResponse.json({ error: "Missing form7a_draft" }, { status: 400 });
    }

    await query(
      `update cases set form7a_draft = $1, updated_at = now() where id = $2`,
      [JSON.stringify(form7a_draft), id]
    );

    await query(
      `insert into case_events (case_id, actor, action, payload)
       values ($1, 'client', 'draft_edited', '{}'::jsonb)`,
      [id]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/cases/[id]/draft", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
