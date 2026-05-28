import Link from "next/link";
import { getCasesForLawyer } from "@/lib/db/lawyer-cases";
import { getDeadlinesForLawyer } from "@/lib/db/deadlines";
import { getNextAction, PRIORITY_STYLE } from "@/lib/lawyer/next-action";

export const dynamic = "force-dynamic";

const DEMO_LAWYER_ID = "00000000-0000-0000-0000-000000000001";

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  intake:            { bg: "bg-slate-100",   text: "text-slate-600",   label: "Intake" },
  triaged:           { bg: "bg-blue-100",    text: "text-blue-700",    label: "Triaged" },
  routed_to_lawyer:  { bg: "bg-amber-100",   text: "text-amber-700",   label: "Routed" },
  analyzed:          { bg: "bg-indigo-100",  text: "text-indigo-700",  label: "Analyzed" },
  drafted:           { bg: "bg-violet-100",  text: "text-violet-700",  label: "Drafted" },
  submitted:         { bg: "bg-sky-100",     text: "text-sky-700",     label: "Submitted" },
  in_review:         { bg: "bg-yellow-100",  text: "text-yellow-700",  label: "In Review" },
  changes_requested: { bg: "bg-orange-100",  text: "text-orange-700",  label: "Changes Requested" },
  approved:          { bg: "bg-emerald-100", text: "text-emerald-700", label: "Approved" },
  filed:             { bg: "bg-green-100",   text: "text-green-700",   label: "Filed" },
  tracking:          { bg: "bg-teal-100",    text: "text-teal-700",    label: "Tracking" },
};

function DeadlineBadge({ date, overdue }: { date: string | null; overdue: boolean }) {
  if (!date) return null;
  const d = new Date(date);
  const daysOut = Math.ceil((d.getTime() - Date.now()) / 86_400_000);
  const label =
    overdue
      ? `Overdue · ${Math.abs(daysOut)}d ago`
      : daysOut === 0
      ? "Due today"
      : daysOut === 1
      ? "Due tomorrow"
      : `Due ${d.toLocaleDateString("en-CA", { month: "short", day: "numeric" })}`;

  const cls = overdue
    ? "bg-red-50 border-red-200 text-red-700"
    : daysOut <= 3
    ? "bg-amber-50 border-amber-200 text-amber-700"
    : "bg-slate-50 border-slate-200 text-slate-600";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${cls}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {label}
    </span>
  );
}

export default async function LawyerDashboard() {
  const [cases, deadlines] = await Promise.all([
    getCasesForLawyer(DEMO_LAWYER_ID),
    getDeadlinesForLawyer(DEMO_LAWYER_ID),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const todayDeadlines = deadlines.filter((d) => d.due_date.slice(0, 10) === today && d.status === "pending");
  const newSubmissions = cases.filter((c) => c.status === "submitted");
  const nextNewCase    = newSubmissions[0] ?? null;

  const stats = {
    total:       cases.length,
    needsReview: cases.filter((c) => ["submitted", "changes_requested"].includes(c.status)).length,
    overdue:     cases.filter((c) => c.overdue_count > 0).length,
    approved:    cases.filter((c) => ["approved", "filed", "tracking"].includes(c.status)).length,
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
            Lawyer Console
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Priority Queue</h1>
          <p className="text-sm text-slate-500 mt-1">
            Matters sorted by urgency — overdue deadlines and new submissions surface first.
          </p>
        </div>
        <Link
          href="/lawyer/triage"
          className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
          </svg>
          Triage Inbox
        </Link>
      </div>

      {/* Stats strip */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Matters",     value: stats.total,       color: "text-slate-900" },
          { label: "Needs Review",      value: stats.needsReview, color: "text-sky-700" },
          { label: "Overdue Deadlines", value: stats.overdue,     color: "text-red-700" },
          { label: "Approved / Filed",  value: stats.approved,    color: "text-emerald-700" },
        ].map((s) => (
          <div key={s.label}
            className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-center shadow-sm">
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* New Applications widget */}
      {newSubmissions.length > 0 && (
        <div className="mb-6 rounded-2xl border-2 border-sky-200 bg-sky-50 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-widest text-sky-700">
                  New Applications
                </p>
              </div>
              <p className="text-lg font-extrabold text-slate-900">
                {newSubmissions.length} new submission{newSubmissions.length > 1 ? "s" : ""} awaiting review
              </p>
              {nextNewCase && (
                <p className="text-sm text-slate-600 mt-1">
                  Next up: <strong>{nextNewCase.client_name}</strong>
                  {nextNewCase.claim_amount && ` — $${Number(nextNewCase.claim_amount).toLocaleString()} CAD`}
                </p>
              )}
            </div>
            {nextNewCase && (
              <Link
                href={`/lawyer/case/${nextNewCase.id}`}
                className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
              >
                Review Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Today's Schedule */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-sm font-bold text-slate-900">Today&#39;s Schedule</h2>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </div>
          <Link href="/lawyer/deadlines" className="text-xs font-semibold text-indigo-600 hover:underline">
            All deadlines →
          </Link>
        </div>
        {todayDeadlines.length === 0 ? (
          <p className="text-sm text-slate-400">No deadlines due today.</p>
        ) : (
          <div className="space-y-2">
            {todayDeadlines.map((d) => (
              <Link
                key={d.id}
                href={`/lawyer/case/${d.case_id}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 hover:border-amber-400 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{d.title}</p>
                  <p className="text-xs text-slate-500">{d.client_name}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase
                  ${d.urgency === "critical" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                  {d.urgency}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Priority queue */}
      {cases.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-sm text-slate-400">No matters assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cases.map((c) => {
            const action = getNextAction(c);
            const style  = PRIORITY_STYLE[action.priority];
            const status = STATUS_STYLE[c.status] ?? { bg: "bg-slate-100", text: "text-slate-600", label: c.status };

            return (
              <div key={c.id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-4">
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {/* Priority badge */}
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${style.bg} ${style.border} ${style.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {action.priority}
                      </span>
                      {/* Status chip */}
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                      {/* Deadline */}
                      <DeadlineBadge
                        date={c.next_deadline_date}
                        overdue={c.overdue_count > 0}
                      />
                    </div>

                    <div className="flex items-baseline gap-2 mb-1">
                      <p className="text-sm font-bold text-slate-900">{c.client_name}</p>
                      {c.claim_amount && (
                        <span className="text-xs font-semibold text-slate-500">
                          ${Number(c.claim_amount).toLocaleString("en-CA")} CAD
                        </span>
                      )}
                    </div>

                    {c.dispute_summary && (
                      <p className="text-sm text-slate-600 line-clamp-2">{c.dispute_summary}</p>
                    )}

                    <p className={`mt-2 text-xs font-semibold ${style.text}`}>
                      → {action.label}
                    </p>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/lawyer/case/${c.id}`}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
                  >
                    Review
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
