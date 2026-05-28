import "server-only";
import { query } from "./index";

export interface CaseRow {
  id: string;
  status: string;
  dispute_summary: string | null;
  claim_amount: string | null;
  in_scope: boolean | null;
  client_name: string;
  lawyer_name: string | null;
  created_at: string;
  unread_messages: number;
}

const SELECT = `
  select c.id, c.status, c.dispute_summary, c.claim_amount, c.in_scope,
         cl.full_name as client_name, lw.full_name as lawyer_name, c.created_at,
         coalesce((
           select count(*) from case_messages m
           where m.case_id = c.id
             and m.sender = 'lawyer'
             and m.read_by_client = false
         ), 0)::int as unread_messages
  from cases c
  join clients cl on cl.id = c.client_id
  left join lawyers lw on lw.id = c.assigned_lawyer_id
`;

export async function getAllCases(): Promise<CaseRow[]> {
  return query<CaseRow>(`${SELECT} order by c.created_at desc`);
}

export async function getCasesForClient(clientId: string): Promise<CaseRow[]> {
  return query<CaseRow>(
    `${SELECT} where c.client_id = $1 order by c.created_at desc`,
    [clientId]
  );
}

export async function getClients(): Promise<{ id: string; full_name: string }[]> {
  return query(`select id, full_name from clients order by full_name`);
}
