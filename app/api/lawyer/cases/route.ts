import { NextResponse } from "next/server";
import { getCasesForLawyer } from "@/lib/db/lawyer-cases";

const DEMO_LAWYER_ID = "00000000-0000-0000-0000-000000000001";

export async function GET() {
  try {
    const cases = await getCasesForLawyer(DEMO_LAWYER_ID);
    return NextResponse.json({ cases });
  } catch (err) {
    console.error("GET /api/lawyer/cases", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
