import { NextRequest, NextResponse } from "next/server";
import { getCaseDetail } from "@/lib/db/lawyer-cases";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const detail = await getCaseDetail(id);
    if (!detail) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ case: detail });
  } catch (err) {
    console.error("GET /api/lawyer/cases/[id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
