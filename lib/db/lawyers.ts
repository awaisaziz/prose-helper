import "server-only";
import { query } from "./index";

export interface LawyerProfileRow {
  lawyer_id:   string;
  full_name:   string;
  email:       string | null;
  title:       string | null;
  bio:         string | null;
  specialties: string[];
  image_url:   string | null;
  hourly_rate: number | null;
  years_exp:   number | null;
}

export async function getLawyerProfiles(): Promise<LawyerProfileRow[]> {
  return query<LawyerProfileRow>(`
    select
      l.id        as lawyer_id,
      l.full_name,
      l.email,
      lp.title,
      lp.bio,
      coalesce(lp.specialties, '{}') as specialties,
      lp.image_url,
      lp.hourly_rate,
      lp.years_exp
    from lawyers l
    left join lawyer_profiles lp on lp.lawyer_id = l.id
    where coalesce(lp.active, true) = true
    order by lp.years_exp desc nulls last
  `);
}
