import { NextRequest, NextResponse } from "next/server";
import { getDeadlinesForLawyer, createDeadline } from "@/lib/db/deadlines";

const DEMO_LAWYER_ID = "00000000-0000-0000-0000-000000000001";

export async function GET() {
  try {
    const deadlines = await getDeadlinesForLawyer(DEMO_LAWYER_ID);
    return NextResponse.json({ deadlines });
  } catch (err) {
    console.error("GET /api/lawyer/deadlines", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { case_id, title, due_date, urgency, rule_anchor, notes } =
      await req.json() as {
        case_id: string;
        title: string;
        due_date: string;
        urgency?: string;
        rule_anchor?: string;
        notes?: string;
      };

    if (!case_id || !title || !due_date) {
      return NextResponse.json(
        { error: "case_id, title, and due_date are required" },
        { status: 400 }
      );
    }

    const result = await createDeadline(
      case_id,
      DEMO_LAWYER_ID,
      title,
      due_date,
      urgency ?? "normal",
      rule_anchor,
      notes
    );
    return NextResponse.json({ id: result.id });
  } catch (err) {
    console.error("POST /api/lawyer/deadlines", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
