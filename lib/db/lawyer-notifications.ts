import "server-only";
import { query } from "./index";

export interface LawyerNotificationRow {
  id: string;
  case_id: string | null;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
}

export async function getLawyerNotifications(lawyerId: string): Promise<LawyerNotificationRow[]> {
  return query<LawyerNotificationRow>(
    `SELECT id, case_id, type, message, read, created_at
     FROM lawyer_notifications
     WHERE lawyer_id = $1
     ORDER BY created_at DESC
     LIMIT 30`,
    [lawyerId]
  );
}

export async function markLawyerNotificationsRead(lawyerId: string): Promise<void> {
  await query(
    `UPDATE lawyer_notifications SET read = true WHERE lawyer_id = $1 AND read = false`,
    [lawyerId]
  );
}

export async function createLawyerNotification(
  lawyerId: string,
  type: string,
  message: string,
  caseId?: string
): Promise<void> {
  await query(
    `INSERT INTO lawyer_notifications (lawyer_id, case_id, type, message)
     VALUES ($1, $2, $3, $4)`,
    [lawyerId, caseId ?? null, type, message]
  );
}
