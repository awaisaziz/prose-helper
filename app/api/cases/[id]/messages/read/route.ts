import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/index";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: caseId } = await params;
    const { as } = await req.json() as { as: "lawyer" | "client" };

    if (!["lawyer", "client"].includes(as)) {
      return NextResponse.json({ error: "Invalid 'as' value" }, { status: 400 });
    }

    const col = as === "lawyer" ? "read_by_lawyer" : "read_by_client";
    // Only mark messages sent by the OTHER party as read
    const senderFilter = as === "lawyer" ? "client" : "lawyer";

    await query(
      `UPDATE case_messages
       SET ${col} = true
       WHERE case_id = $1 AND sender = $2 AND ${col} = false`,
      [caseId, senderFilter]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/cases/[id]/messages/read", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
