import { NextRequest, NextResponse } from "next/server";
import { getNotifications, markNotificationsRead } from "@/lib/db/notifications";

const DEMO_CLIENT_ID = "00000000-0000-0000-0000-0000000000a1";

// GET /api/notifications — fetch for demo client
export async function GET() {
  try {
    const notifications = await getNotifications(DEMO_CLIENT_ID);
    const unread = notifications.filter((n) => !n.read).length;
    return NextResponse.json({ notifications, unread });
  } catch (err) {
    console.error("GET /api/notifications", err);
    return NextResponse.json({ notifications: [], unread: 0 });
  }
}

// PATCH /api/notifications — mark all read
export async function PATCH(_req: NextRequest) {
  try {
    await markNotificationsRead(DEMO_CLIENT_ID);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/notifications", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
