import { NextRequest, NextResponse } from "next/server";
import { updateClientName } from "@/lib/db/profile";

// PATCH /api/profile — update demo client name
export async function PATCH(req: NextRequest) {
  try {
    const { client_id, full_name } = await req.json() as {
      client_id: string;
      full_name: string;
    };

    if (!client_id || !full_name?.trim()) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await updateClientName(client_id, full_name);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/profile", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
