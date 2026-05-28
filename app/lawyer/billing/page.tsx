import { query } from "@/lib/db/index";
import { getLawyerProfile } from "@/lib/db/lawyers";

export const dynamic = "force-dynamic";

const DEMO_LAWYER_ID = "00000000-0000-0000-0000-000000000001";

interface MatterRow {
  case_id:     string;
  client_name: string;
  status:      string;
  matter_type: string | null;
  claim_amount: string | null;
  created_at:  string;
  reviews:     number;
}

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  submitted:         { bg: "bg-sky-100",     text: "text-sky-700",     label: "Submitted" },
  in_review:         { bg: "bg-yellow-100",  text: "text-yellow-700",  label: "In Review" },
  changes_requested: { bg: "bg-orange-100",  text: "text-orange-700",  label: "Changes Req." },
  approved:          { bg: "bg-emerald-100", text: "text-emerald-700", label: "Approved" },
  filed:             { bg: "bg-green-100",   text: "text-green-700",   label: "Filed" },
  drafted:           { bg: "bg-violet-100",  text: "text-violet-700",  label: "Drafted" },
};

const BILLABLE_STATUSES = ["in_review", "changes_requested", "approved", "filed"];

export default async function BillingPage() {
  const [profile, matters] = await Promise.all([
    getLawyerProfile(DEMO_LAWYER_ID),
    query<MatterRow>(
      `select
         c.id as case_id,
         cl.full_name as client_name,
         c.status,
         c.matter_type,
         c.claim_amount::text,
         c.created_at,
         count(cr.id)::int as reviews
       from cases c
       join clients cl on cl.id = c.client_id
       left join case_reviews cr on cr.case_id = c.id and cr.lawyer_id = $1
       where c.assigned_lawyer_id = $1
          or exists (select 1 from connections cn where cn.case_id = c.id and cn.lawyer_id = $1)
       group by c.id, cl.full_name, c.status, c.matter_type, c.claim_amount, c.created_at
       order by c.updated_at desc`,
      [DEMO_LAWYER_ID]
    ),
  ]);

  const rate = profile?.hourly_rate ?? 150;
  // Estimate: 1hr per review action + 0.5hr per matter flat
  const billableMatters = matters.filter((m) => BILLABLE_STATUSES.includes(m.status) || m.reviews > 0);
  const estimatedHours = billableMatters.reduce((sum, m) => sum + 0.5 + m.reviews * 1, 0);
  const estimatedRevenue = Math.round(estimatedHours * rate);

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
          Lawyer Console
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
        <p className="text-sm text-slate-500 mt-1">
          Unbundled review matters and estimated fees at your ${rate}/hr rate.
        </p>
      </div>

      {/* Revenue summary */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Matters",     value: matters.length,                 color: "text-slate-900" },
          { label: "Billable Matters",  value: billableMatters.length,         color: "text-sky-700" },
          { label: "Est. Hours",        value: estimatedHours.toFixed(1),      color: "text-indigo-700" },
          { label: "Est. Revenue",      value: `$${estimatedRevenue.toLocaleString()}`, color: "text-emerald-700" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-center shadow-sm">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 mb-4 italic">
        * Estimates only — 0.5 hr flat + 1 hr per review action per matter. Not a formal invoice.
      </p>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">Client</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">Matter Type</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">Status</th>
              <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-400">Reviews</th>
              <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-400">Est. Fee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {matters.map((m) => {
              const s = STATUS_STYLE[m.status] ?? { bg: "bg-slate-100", text: "text-slate-600", label: m.status };
              const hrs = 0.5 + m.reviews * 1;
              const fee = Math.round(hrs * rate);
              const billable = BILLABLE_STATUSES.includes(m.status) || m.reviews > 0;
              return (
                <tr key={m.case_id} className={`transition-colors ${billable ? "hover:bg-slate-50" : "opacity-50"}`}>
                  <td className="px-5 py-4 font-medium text-slate-900">{m.client_name}</td>
                  <td className="px-5 py-4 text-slate-500 capitalize">{m.matter_type?.replace(/_/g, " ") ?? "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${s.bg} ${s.text}`}>
                      {s.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-slate-600">{m.reviews}</td>
                  <td className={`px-5 py-4 text-right font-semibold ${billable ? "text-emerald-700" : "text-slate-300"}`}>
                    {billable ? `$${fee}` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {billableMatters.length > 0 && (
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50">
                <td colSpan={4} className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 text-right">
                  Total Estimate
                </td>
                <td className="px-5 py-3 text-right text-sm font-extrabold text-emerald-700">
                  ${estimatedRevenue.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </main>
  );
}
