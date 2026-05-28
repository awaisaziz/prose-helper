import { NextResponse } from "next/server";
import { getLawyerProfiles } from "@/lib/db/lawyers";

export async function GET() {
  try {
    const lawyers = await getLawyerProfiles();
    return NextResponse.json({ lawyers });
  } catch (err) {
    console.error("GET /api/lawyers", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
