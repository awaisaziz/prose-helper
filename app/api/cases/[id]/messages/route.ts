import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/index";
import { createLawyerNotification } from "@/lib/db/lawyer-notifications";

const DEMO_LAWYER_ID = "00000000-0000-0000-0000-000000000001";
const DEMO_CLIENT_ID = "00000000-0000-0000-0000-0000000000a1";

export interface MessageRow {
  id: string;
  case_id: string;
  sender: "lawyer" | "client";
  sender_name: string;
  body: string;
  read_by_client: boolean;
  read_by_lawyer: boolean;
  created_at: string;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: caseId } = await params;
    const rows = await query<MessageRow>(
      `SELECT
         m.id, m.case_id, m.sender, m.body,
         m.read_by_client, m.read_by_lawyer, m.created_at,
         CASE m.sender
           WHEN 'lawyer' THEN lw.full_name
           WHEN 'client' THEN cl.full_name
         END AS sender_name
       FROM case_messages m
       LEFT JOIN lawyers lw ON lw.id = m.sender_id AND m.sender = 'lawyer'
       LEFT JOIN clients cl ON cl.id = m.sender_id AND m.sender = 'client'
       WHERE m.case_id = $1
       ORDER BY m.created_at ASC`,
      [caseId]
    );
    return NextResponse.json({ messages: rows });
  } catch (err) {
    console.error("GET /api/cases/[id]/messages", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: caseId } = await params;
    const { body, sender } = await req.json() as {
      body: string;
      sender: "lawyer" | "client";
    };

    if (!body?.trim()) {
      return NextResponse.json({ error: "Message body is required" }, { status: 400 });
    }
    if (!["lawyer", "client"].includes(sender)) {
      return NextResponse.json({ error: "Invalid sender" }, { status: 400 });
    }

    const senderId = sender === "lawyer" ? DEMO_LAWYER_ID : DEMO_CLIENT_ID;

    const rows = await query<{ id: string }>(
      `INSERT INTO case_messages (case_id, sender, sender_id, body)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [caseId, sender, senderId, body.trim()]
    );

    // Fire notification for the receiving party
    if (sender === "lawyer") {
      await query(
        `INSERT INTO notifications (client_id, case_id, type, message)
         VALUES ($1, $2, 'lawyer_message', $3)`,
        [DEMO_CLIENT_ID, caseId, `Your lawyer sent you a message: "${body.trim().slice(0, 80)}${body.length > 80 ? "\u2026" : ""}"`]
      );
    } else {
      // Client sent message — notify lawyer
      const lawyerRows = await query<{ assigned_lawyer_id: string | null }>(
        `SELECT assigned_lawyer_id FROM cases WHERE id = $1`,
        [caseId]
      );
      const lawyerId = lawyerRows[0]?.assigned_lawyer_id ?? DEMO_LAWYER_ID;
      await createLawyerNotification(
        lawyerId,
        "client_message",
        `Client sent you a message: "${body.trim().slice(0, 80)}${body.length > 80 ? "\u2026" : ""}"`
        , caseId
      );
    }

    return NextResponse.json({ id: rows[0].id });
  } catch (err) {
    console.error("POST /api/cases/[id]/messages", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
