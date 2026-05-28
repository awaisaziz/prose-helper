import Link from "next/link";
import { Suspense } from "react";
import { getAllCases, type CaseRow } from "@/lib/db/cases";
import { DashboardTabs, type DashTab } from "@/components/client/dashboard-tabs";

export const dynamic = "force-dynamic";

// ── Status config ────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  intake:             { bg: "bg-slate-100",   text: "text-slate-600",   label: "Intake" },
  triaged:            { bg: "bg-blue-100",    text: "text-blue-700",    label: "Triaged" },
  routed_to_lawyer:   { bg: "bg-amber-100",   text: "text-amber-700",   label: "Routed to Lawyer" },
  analyzed:           { bg: "bg-indigo-100",  text: "text-indigo-700",  label: "Analyzed" },
  drafted:            { bg: "bg-violet-100",  text: "text-violet-700",  label: "Drafted" },
  submitted:          { bg: "bg-sky-100",     text: "text-sky-700",     label: "Submitted" },
  in_review:          { bg: "bg-yellow-100",  text: "text-yellow-700",  label: "In Review" },
  changes_requested:  { bg: "bg-orange-100",  text: "text-orange-700",  label: "Changes Requested" },
  approved:           { bg: "bg-emerald-100", text: "text-emerald-700", label: "Approved" },
  filed:              { bg: "bg-green-100",   text: "text-green-700",   label: "Filed" },
  tracking:           { bg: "bg-teal-100",    text: "text-teal-700",    label: "Tracking" },
};

// Tab → statuses mapping
const TAB_GROUPS: Record<DashTab, string[]> = {
  all:        [],   // empty = all
  inprogress: ["intake", "triaged", "analyzed", "drafted"],
  submitted:  ["submitted", "in_review", "changes_requested", "routed_to_lawyer"],
  approved:   ["approved", "filed", "tracking"],
};

function caseHref(c: CaseRow) {
  if (["drafted"].includes(c.status))
    return `/client/case/${c.id}/prepare`;
  if (["submitted", "in_review", "changes_requested", "approved", "filed", "tracking"].includes(c.status))
    return `/client/case/${c.id}/prepare?tab=submit`;
  if (c.status === "analyzed") return `/client/case/${c.id}/assess`;
  if (["triaged", "routed_to_lawyer"].includes(c.status)) return `/client/intake/${c.id}/triage`;
  return `/client/case/${c.id}/assess`;
}

function StatusChip({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { bg: "bg-slate-100", text: "text-slate-600", label: status };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ tab }: { tab: DashTab }) {
  const messages: Record<DashTab, string> = {
    all:        "No claims yet. Start your first claim to get guided through the process.",
    inprogress: "No claims currently in progress.",
    submitted:  "No claims have been sent to a lawyer yet.",
    approved:   "No claims have been approved or filed yet.",
  };
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center px-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-sm text-slate-500 mb-5 max-w-xs">{messages[tab]}</p>
      {tab === "all" && (
        <Link href="/client/intake"
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          Start a Claim →
        </Link>
      )}
    </div>
  );
}

// ── Case card ─────────────────────────────────────────────────────────────────
function CaseCard({ c }: { c: CaseRow }) {
  // Which track CTA label to show
  const isSubmitted = ["submitted", "in_review", "changes_requested"].includes(c.status);
  const isApproved  = ["approved", "filed", "tracking"].includes(c.status);
  const ctaLabel    = isApproved ? "View" : isSubmitted ? "Track →" : "Continue →";

  return (
    <Link href={caseHref(c)}
      className="group flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition-all">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <StatusChip status={c.status} />
          {c.claim_amount && (
            <span className="text-xs font-semibold text-slate-700">
              ${Number(c.claim_amount).toLocaleString("en-CA")} CAD
            </span>
          )}
          {c.lawyer_name && (
            <span className="text-xs text-slate-400">· {c.lawyer_name}</span>
          )}
        </div>
        <p className="text-sm text-slate-700 line-clamp-2">{c.dispute_summary}</p>
        <p className="text-xs text-slate-400 mt-1.5">
          {new Date(c.created_at).toLocaleDateString("en-CA", {
            year: "numeric", month: "short", day: "numeric",
          })}
        </p>
      </div>
      <span className="shrink-0 text-xs font-semibold text-blue-600 mt-1 group-hover:text-blue-700 transition-colors whitespace-nowrap">
        {ctaLabel}
      </span>
    </Link>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function ClientDashboard({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const sp  = await searchParams;
  const tab = (sp.tab ?? "all") as DashTab;

  let cases: CaseRow[] = [];
  let dbError: string | null = null;
  try {
    cases = await getAllCases();
  } catch {
    dbError = "Database not reachable — run `npm run db:start` then reload.";
  }

  // Compute per-tab counts
  const counts: Record<DashTab, number> = {
    all:        cases.length,
    inprogress: cases.filter((c) => TAB_GROUPS.inprogress.includes(c.status)).length,
    submitted:  cases.filter((c) => TAB_GROUPS.submitted.includes(c.status)).length,
    approved:   cases.filter((c) => TAB_GROUPS.approved.includes(c.status)).length,
  };

  // Filter by active tab
  const visible = tab === "all"
    ? cases
    : cases.filter((c) => TAB_GROUPS[tab].includes(c.status));

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Cases</h1>
          <p className="text-sm text-slate-500 mt-1">
            Ontario Small Claims · up to $50,000
          </p>
        </div>
        <Link href="/client/intake"
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors whitespace-nowrap">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Claim
        </Link>
      </div>

      {/* Tab bar */}
      {!dbError && (
        <div className="mb-6">
          <Suspense>
            <DashboardTabs counts={counts} />
          </Suspense>
        </div>
      )}

      {/* Content */}
      {dbError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{dbError}</div>
      ) : visible.length === 0 ? (
        <EmptyState tab={tab} />
      ) : (
        <ul className="space-y-3">
          {visible.map((c) => <li key={c.id}><CaseCard c={c} /></li>)}
        </ul>
      )}
    </div>
  );
}
