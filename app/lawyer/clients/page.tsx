import Link from "next/link";
import { query } from "@/lib/db/index";

export const dynamic = "force-dynamic";

const DEMO_LAWYER_ID = "00000000-0000-0000-0000-000000000001";

interface ClientRow {
  id:            string;
  full_name:     string;
  email?:         string | null;
  case_count:    number;
  open_cases:    number;
  last_activity: string | null;
  latest_status: string | null;
  latest_case_id: string | null;
}

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  submitted:         { bg: "bg-sky-100",     text: "text-sky-700",     label: "Submitted" },
  in_review:         { bg: "bg-yellow-100",  text: "text-yellow-700",  label: "In Review" },
  changes_requested: { bg: "bg-orange-100",  text: "text-orange-700",  label: "Changes Req." },
  approved:          { bg: "bg-emerald-100", text: "text-emerald-700", label: "Approved" },
  filed:             { bg: "bg-green-100",   text: "text-green-700",   label: "Filed" },
  drafted:           { bg: "bg-violet-100",  text: "text-violet-700",  label: "Drafted" },
  triaged:           { bg: "bg-blue-100",    text: "text-blue-700",    label: "Triaged" },
};

export default async function ClientsPage() {
  const clients = await query<ClientRow>(
    `select
       cl.id,
       cl.full_name,
       count(distinct c.id)::int                                           as case_count,
       count(distinct c.id) filter (
         where c.status not in ('approved','filed','tracking')
       )::int                                                              as open_cases,
       max(c.updated_at)                                                   as last_activity,
       (array_agg(c.status order by c.updated_at desc))[1]                as latest_status,
       (array_agg(c.id     order by c.updated_at desc))[1]::text          as latest_case_id
     from connections cn
     join clients cl on cl.id = cn.client_id
     left join cases c on c.client_id = cl.id
     where cn.lawyer_id = $1
     group by cl.id, cl.full_name
     order by max(c.updated_at) desc nulls last`,
    [DEMO_LAWYER_ID]
  );

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
          Lawyer Console
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
        <p className="text-sm text-slate-500 mt-1">
          All clients connected to your matters.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 flex gap-4">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-center shadow-sm min-w-[120px]">
          <p className="text-3xl font-extrabold text-slate-900">{clients.length}</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Total Clients</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-center shadow-sm min-w-[120px]">
          <p className="text-3xl font-extrabold text-sky-700">
            {clients.filter((c) => c.open_cases > 0).length}
          </p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Active Matters</p>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <p className="text-sm text-slate-400">No clients connected yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">Client</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">Cases</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">Latest Status</th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">Last Activity</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((cl) => {
                const s = cl.latest_status ? (STATUS_STYLE[cl.latest_status] ?? { bg: "bg-slate-100", text: "text-slate-600", label: cl.latest_status }) : null;
                const initials = cl.full_name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
                return (
                  <tr key={cl.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[11px] font-extrabold text-white">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{cl.full_name}</p>
                          {cl.email && <p className="text-xs text-slate-400">{cl.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-700">{cl.case_count}</span>
                      {cl.open_cases > 0 && (
                        <span className="ml-2 text-xs text-sky-600 font-medium">({cl.open_cases} open)</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {s ? (
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${s.bg} ${s.text}`}>
                          {s.label}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {cl.last_activity
                        ? new Date(cl.last_activity).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {cl.latest_case_id && (
                        <Link
                          href={`/lawyer/case/${cl.latest_case_id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
                        >
                          View Case
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
