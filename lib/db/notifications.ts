import "server-only";
import { query } from "./index";

export interface NotificationRow {
  id: string;
  case_id: string | null;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
}

export async function getNotifications(clientId: string): Promise<NotificationRow[]> {
  return query<NotificationRow>(
    `select id, case_id, type, message, read, created_at
     from notifications
     where client_id = $1
     order by created_at desc
     limit 20`,
    [clientId]
  );
}

export async function markNotificationsRead(clientId: string): Promise<void> {
  await query(
    `update notifications set read = true where client_id = $1 and read = false`,
    [clientId]
  );
}

export async function createNotification(
  clientId: string,
  type: string,
  message: string,
  caseId?: string
): Promise<void> {
  await query(
    `insert into notifications (client_id, case_id, type, message)
     values ($1, $2, $3, $4)`,
    [clientId, caseId ?? null, type, message]
  );
}
