import { NextRequest, NextResponse } from "next/server";
import { getLawyerProfile, updateLawyerProfile } from "@/lib/db/lawyers";

const DEMO_LAWYER_ID = "00000000-0000-0000-0000-000000000001";

export async function GET() {
  const profile = await getLawyerProfile(DEMO_LAWYER_ID);
  return NextResponse.json(profile ?? {});
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  await updateLawyerProfile(DEMO_LAWYER_ID, body);
  const updated = await getLawyerProfile(DEMO_LAWYER_ID);
  return NextResponse.json(updated ?? {});
}
