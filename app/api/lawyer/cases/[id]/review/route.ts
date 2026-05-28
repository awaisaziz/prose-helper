import { NextRequest, NextResponse } from "next/server";
import { createReview } from "@/lib/db/reviews";

const DEMO_LAWYER_ID = "00000000-0000-0000-0000-000000000001";

// POST /api/lawyer/cases/[id]/review — lawyer reviews a case
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { decision, notes } = await req.json() as {
      decision: string;
      notes?: string;
    };

    if (!decision) {
      return NextResponse.json({ error: "Missing decision" }, { status: 400 });
    }
    if (decision === "changes_requested" && !notes?.trim()) {
      return NextResponse.json(
        { error: "Notes are required when requesting changes" },
        { status: 400 }
      );
    }

    await createReview(id, DEMO_LAWYER_ID, decision, notes);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/lawyer/cases/[id]/review", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
