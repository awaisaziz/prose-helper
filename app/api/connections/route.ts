import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db/connections";

export async function POST(req: NextRequest) {
  try {
    const { case_id, client_id, lawyer_id } = await req.json() as {
      case_id: string;
      client_id: string;
      lawyer_id: string;
    };

    if (!case_id || !client_id || !lawyer_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { id } = await createConnection(case_id, client_id, lawyer_id);
    return NextResponse.json({ id, status: "requested" });
  } catch (err) {
    console.error("POST /api/connections", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
