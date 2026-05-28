import "server-only";
import { query } from "./index";

export interface LawyerProfileRow {
  lawyer_id:    string;
  full_name:    string;
  email:        string | null;
  title:        string | null;
  bio:          string | null;
  specialties:  string[];
  image_url:    string | null;
  hourly_rate:  number | null;
  years_exp:    number | null;
  phone:        string | null;
  booking_url:  string | null;
  triage_prefs: string[];
}

const PROFILE_SELECT = `
  select
    l.id        as lawyer_id,
    l.full_name,
    l.email,
    lp.title,
    lp.bio,
    coalesce(lp.specialties, '{}')     as specialties,
    lp.image_url,
    lp.hourly_rate,
    lp.years_exp,
    lp.phone,
    lp.booking_url,
    coalesce(lp.triage_prefs,
      '["overdue_deadline","new_submission","resubmission","imminent_deadline","connection_request"]'::jsonb
    ) as triage_prefs
  from lawyers l
  left join lawyer_profiles lp on lp.lawyer_id = l.id
`;

export async function getLawyerProfiles(): Promise<LawyerProfileRow[]> {
  return query<LawyerProfileRow>(`
    ${PROFILE_SELECT}
    where coalesce(lp.active, true) = true
    order by lp.years_exp desc nulls last
  `);
}

export async function getLawyerProfile(lawyerId: string): Promise<LawyerProfileRow | null> {
  const rows = await query<LawyerProfileRow>(`${PROFILE_SELECT} where l.id = $1`, [lawyerId]);
  return rows[0] ?? null;
}

export async function updateLawyerProfile(
  lawyerId: string,
  fields: Partial<{
    full_name:    string;
    email:        string;
    title:        string;
    bio:          string;
    specialties:  string[];
    hourly_rate:  number;
    years_exp:    number;
    phone:        string;
    booking_url:  string;
    triage_prefs: string[];
  }>
): Promise<void> {
  // Upsert lawyer_profiles row
  const profileFields: Record<string, unknown> = {};
  for (const k of ["title","bio","specialties","hourly_rate","years_exp","phone","booking_url","triage_prefs"] as const) {
    if (k in fields) profileFields[k] = fields[k as keyof typeof fields];
  }
  if (Object.keys(profileFields).length > 0) {
    const keys = Object.keys(profileFields);
    const vals = Object.values(profileFields);
    const setClauses = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
    await query(
      `insert into lawyer_profiles (lawyer_id, ${keys.join(", ")})
       values ($1, ${keys.map((_, i) => `$${i + 2}`).join(", ")})
       on conflict (lawyer_id) do update set ${setClauses}`,
      [lawyerId, ...vals]
    );
  }
  // Update lawyers table fields
  if (fields.full_name !== undefined || fields.email !== undefined) {
    const lFields: Record<string, unknown> = {};
    if (fields.full_name !== undefined) lFields.full_name = fields.full_name;
    if (fields.email     !== undefined) lFields.email     = fields.email;
    const keys = Object.keys(lFields);
    const vals = Object.values(lFields);
    const setClauses = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
    await query(`update lawyers set ${setClauses} where id = $1`, [lawyerId, ...vals]);
  }
}
