import { NextResponse } from "next/server";
import { query } from "@/lib/db/index";
import { createNotification } from "@/lib/db/notifications";

/**
 * GET /api/cron/deadlines
 *
 * Worker that:
 * 1. Flags deadlines past their due_date as 'overdue'
 * 2. Sends proximity notifications to clients for deadlines due within 3 days
 *
 * Safe to run repeatedly — notified=true guards against duplicate notifications.
 * Call via: npm run cron:deadlines  (or Vercel Cron)
 */
export async function GET() {
  try {
    // 1. Flag overdue
    const overdueResult = await query<{ id: string }>(
      `UPDATE deadlines
       SET status = 'overdue', updated_at = now()
       WHERE due_date < CURRENT_DATE AND status = 'pending'
       RETURNING id`
    );

    // 2. Proximity alerts (≤3 days out, not yet notified)
    const upcoming = await query<{
      id: string;
      case_id: string;
      client_id: string;
      title: string;
      due_date: string;
    }>(
      `SELECT d.id, d.case_id, c.client_id, d.title, d.due_date::text
       FROM deadlines d
       JOIN cases c ON c.id = d.case_id
       WHERE d.status = 'pending'
         AND d.notified = false
         AND d.due_date <= CURRENT_DATE + INTERVAL '3 days'`
    );

    let notified = 0;
    for (const row of upcoming) {
      const daysOut = Math.ceil(
        (new Date(row.due_date).getTime() - Date.now()) / 86_400_000
      );
      const when =
        daysOut <= 0
          ? "today"
          : daysOut === 1
          ? "tomorrow"
          : `in ${daysOut} days`;

      const message =
        `Reminder: "${row.title}" is due ${when} (${row.due_date}). ` +
        `Your lawyer is preparing the necessary documents.`;

      await createNotification(row.client_id, "deadline_approaching", message, row.case_id);

      await query(
        `UPDATE deadlines SET notified = true, updated_at = now() WHERE id = $1`,
        [row.id]
      );
      notified++;
    }

    return NextResponse.json({
      ok: true,
      flagged_overdue: overdueResult.length,
      notifications_sent: notified,
    });
  } catch (err) {
    console.error("GET /api/cron/deadlines", err);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
