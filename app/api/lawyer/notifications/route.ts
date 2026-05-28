import { NextRequest, NextResponse } from "next/server";
import { getLawyerNotifications, markLawyerNotificationsRead } from "@/lib/db/lawyer-notifications";

const DEMO_LAWYER_ID = "00000000-0000-0000-0000-000000000001";

// GET /api/lawyer/notifications
export async function GET() {
  try {
    const notifications = await getLawyerNotifications(DEMO_LAWYER_ID);
    const unread = notifications.filter((n) => !n.read).length;
    return NextResponse.json({ notifications, unread });
  } catch (err) {
    console.error("GET /api/lawyer/notifications", err);
    return NextResponse.json({ notifications: [], unread: 0 });
  }
}

// PATCH /api/lawyer/notifications — mark all read
export async function PATCH(_req: NextRequest) {
  try {
    await markLawyerNotificationsRead(DEMO_LAWYER_ID);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/lawyer/notifications", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
