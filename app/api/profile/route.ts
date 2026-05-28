import { NextRequest, NextResponse } from "next/server";
import { updateClientName, updateDefaultLawyer } from "@/lib/db/profile";

// PATCH /api/profile — update demo client name and/or default lawyer
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json() as {
      client_id: string;
      full_name?: string;
      default_lawyer_id?: string | null;
    };

    const { client_id, full_name, default_lawyer_id } = body;

    if (!client_id) {
      return NextResponse.json({ error: "Missing client_id" }, { status: 400 });
    }

    if (full_name !== undefined) {
      if (!full_name.trim()) {
        return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
      }
      await updateClientName(client_id, full_name);
    }

    if (default_lawyer_id !== undefined) {
      await updateDefaultLawyer(client_id, default_lawyer_id);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/profile", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
