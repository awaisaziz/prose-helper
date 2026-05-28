import { NextRequest, NextResponse } from "next/server";
import { updateDeadlineStatus } from "@/lib/db/deadlines";

// PATCH /api/lawyer/deadlines/[id] — mark done, snoozed, etc.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json() as { status: string };

    if (!status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    await updateDeadlineStatus(id, status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/lawyer/deadlines/[id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
