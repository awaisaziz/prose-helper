import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientProfile, getCaseStats } from "@/lib/db/profile";
import { getCasesForClient, type CaseRow } from "@/lib/db/cases";
import { EditableName } from "./editable-name";

export const dynamic = "force-dynamic";

const DEMO_CLIENT_ID = "00000000-0000-0000-0000-0000000000a1";

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  intake:            { bg: "bg-slate-100",   text: "text-slate-600",   label: "Intake" },
  triaged:           { bg: "bg-blue-100",    text: "text-blue-700",    label: "Triaged" },
  routed_to_lawyer:  { bg: "bg-amber-100",   text: "text-amber-700",   label: "Routed to Lawyer" },
  analyzed:          { bg: "bg-indigo-100",  text: "text-indigo-700",  label: "Analyzed" },
  drafted:           { bg: "bg-violet-100",  text: "text-violet-700",  label: "Drafted" },
  submitted:         { bg: "bg-sky-100",     text: "text-sky-700",     label: "Submitted" },
  in_review:         { bg: "bg-yellow-100",  text: "text-yellow-700",  label: "In Review" },
  changes_requested: { bg: "bg-orange-100",  text: "text-orange-700",  label: "Changes Requested" },
  approved:          { bg: "bg-emerald-100", text: "text-emerald-700", label: "Approved" },
  filed:             { bg: "bg-green-100",   text: "text-green-700",   label: "Filed" },
  tracking:          { bg: "bg-teal-100",    text: "text-teal-700",    label: "Tracking" },
};

function caseHref(c: CaseRow) {
  if (["drafted", "submitted", "in_review", "changes_requested", "approved", "filed"].includes(c.status))
    return `/client/case/${c.id}/prepare`;
  if (c.status === "analyzed") return `/client/case/${c.id}/assess`;
  if (["triaged", "routed_to_lawyer"].includes(c.status)) return `/client/intake/${c.id}/triage`;
  return `/client/case/${c.id}/assess`;
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default async function ProfilePage() {
  const [profile, stats, cases] = await Promise.all([
    getClientProfile(DEMO_CLIENT_ID),
    getCaseStats(DEMO_CLIENT_ID),
    getCasesForClient(DEMO_CLIENT_ID),
  ]);

  if (!profile) notFound();

  const memberSince = new Date(profile.created_at).toLocaleDateString("en-CA", {
    year: "numeric", month: "long",
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      {/* Back to Dashboard Button */}
      <div className="mb-6">
        <Link
          href="/client/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {/* ── Profile card ── */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          {/* Avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-extrabold text-white shadow-lg shadow-blue-500/20">
            {initials(profile.full_name)}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            {/* Editable name */}
            <EditableName
              clientId={profile.id}
              initialName={profile.full_name}
            />

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {/* Demo badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Demo Account
              </span>

              {/* Member since */}
              <span className="text-xs text-slate-400">
                Member since {memberSince}
              </span>
            </div>

            {/* Role */}
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[11px] font-semibold text-blue-700">
                Self-Represented Litigant
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">Ontario Small Claims Court</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Claims",   value: stats.total,     color: "text-slate-900" },
          { label: "In Progress",    value: stats.active,    color: "text-blue-700" },
          { label: "Under Review",   value: stats.submitted, color: "text-amber-700" },
          { label: "Approved / Filed", value: stats.approved, color: "text-emerald-700" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-center">
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Case history ── */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">Case History</h2>
        <Link href="/client/intake"
          className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors">
          + New Claim
        </Link>
      </div>

      {cases.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-400">
          No claims yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {cases.map((c) => {
            const s = STATUS_STYLE[c.status] ?? { bg: "bg-slate-100", text: "text-slate-600", label: c.status };
            return (
              <li key={c.id}>
                <Link href={caseHref(c)}
                  className="group flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${s.bg} ${s.text}`}>
                        {s.label}
                      </span>
                      {c.claim_amount && (
                        <span className="text-xs font-semibold text-slate-700">
                          ${Number(c.claim_amount).toLocaleString("en-CA")} CAD
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2">{c.dispute_summary}</p>
                    <p className="text-xs text-slate-400 mt-1.5">
                      {new Date(c.created_at).toLocaleDateString("en-CA", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-slate-300 shrink-0 mt-1 group-hover:text-blue-400 transition-colors"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {/* ── Jurisdiction notice ── */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Jurisdiction</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600">
          <span><strong className="text-slate-800">Court:</strong> Ontario Small Claims Court</span>
          <span><strong className="text-slate-800">Claim limit:</strong> $50,000 CAD</span>
          <span><strong className="text-slate-800">Limitation period:</strong> 2 years</span>
          <span>
            <strong className="text-slate-800">Filing form:</strong>{" "}
            <a href="https://www.ontario.ca/laws/regulation/980258" target="_blank" rel="noopener noreferrer"
              className="text-blue-600 hover:underline">
              Form 7A — O. Reg. 258/98
            </a>
          </span>
        </div>
      </div>

    </main>
  );
}
