import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getCaseDetail } from "@/lib/db/lawyer-cases";
import { ReviewPanel } from "@/components/lawyer/review-panel";
import { DeadlineManager } from "@/components/lawyer/deadline-manager";
import { RemindButton } from "@/components/lawyer/remind-button";
import { AcceptConnectionButton } from "@/components/lawyer/accept-connection-button";
import { CaseMessageThread } from "@/components/lawyer/case-message-thread";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  submitted:         { bg: "bg-sky-100",     text: "text-sky-700",     label: "Submitted" },
  in_review:         { bg: "bg-yellow-100",  text: "text-yellow-700",  label: "In Review" },
  changes_requested: { bg: "bg-orange-100",  text: "text-orange-700",  label: "Changes Requested" },
  approved:          { bg: "bg-emerald-100", text: "text-emerald-700", label: "Approved" },
  filed:             { bg: "bg-green-100",   text: "text-green-700",   label: "Filed" },
  drafted:           { bg: "bg-violet-100",  text: "text-violet-700",  label: "Drafted" },
  analyzed:          { bg: "bg-indigo-100",  text: "text-indigo-700",  label: "Analyzed" },
};

const STRENGTH_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  STRONG:   { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  MODERATE: { bg: "bg-amber-50",   text: "text-amber-800",   border: "border-amber-200" },
  WEAK:     { bg: "bg-red-50",     text: "text-red-800",     border: "border-red-200" },
};

const ACTION_LABELS: Record<string, string> = {
  case_created:         "Case created by client",
  submitted_for_review: "Submitted for lawyer review",
  case_assessed:        "AI assessment completed",
  form7a_drafted:       "Form 7A draft generated",
  draft_edited:         "Draft edited by client",
  in_review:            "Lawyer marked as In Review",
  changes_requested:    "Lawyer requested changes",
  approved:             "Lawyer approved",
  reminder_sent:        "Reminder sent to client",
};

export default async function CaseReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await getCaseDetail(id);
  if (!c) notFound();

  const status  = STATUS_STYLE[c.status] ?? { bg: "bg-slate-100", text: "text-slate-600", label: c.status };
  const assess  = c.assessment;
  const form    = c.form7a_draft;
  const strength = assess?.case_strength ? STRENGTH_STYLE[assess.case_strength] : null;

  const canReview = ["submitted", "in_review", "changes_requested", "drafted"].includes(c.status);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="mb-5">
        <Link href="/lawyer/dashboard"
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to Queue
        </Link>
      </div>

      {/* Case header */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wide ${status.bg} ${status.text}`}>
                {status.label}
              </span>
              {c.matter_type && (
                <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-600 capitalize">
                  {c.matter_type.replace(/_/g, " ")}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-900">{c.client_name}&apos;s Claim</h1>
            <p className="text-sm text-slate-500 mt-1">
              Submitted {new Date(c.created_at).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          {c.claim_amount && (
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Claim Amount</p>
              <p className="text-2xl font-extrabold text-slate-900">
                ${Number(c.claim_amount).toLocaleString("en-CA")}
                <span className="text-sm font-semibold text-slate-400 ml-1">CAD</span>
              </p>
            </div>
          )}
        </div>

        {c.dispute_summary && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Dispute Summary</p>
            <p className="text-sm text-slate-700 leading-relaxed">{c.dispute_summary}</p>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* ── LEFT PANEL ── */}
        <div className="space-y-6">

          {/* AI Assessment */}
          {assess && (
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">AI Assessment</p>
              </div>
              <div className="p-5 space-y-4">
                {strength && (
                  <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold ${strength.bg} ${strength.border} ${strength.text}`}>
                    Case Strength: {assess.case_strength}
                  </div>
                )}
                {assess.reasoning?.length > 0 && (
                  <ul className="space-y-1.5">
                    {assess.reasoning.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
                {assess.rights_remedies && (
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 mb-1">Right Violated</p>
                    <p className="text-sm text-slate-700">{assess.rights_remedies.right_violated}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-2 mb-1">Remedy</p>
                    <p className="text-sm text-slate-700">{assess.rights_remedies.remedy}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form 7A (read-only) */}
          {form && (
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden font-serif">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ontario Small Claims Court</p>
                <h2 className="text-base font-bold mt-0.5">Plaintiff&apos;s Claim</h2>
                <p className="text-xs text-slate-500 mt-0.5">Form 7A — O. Reg. 258/98 · Client Draft</p>
              </div>
              <div className="px-6 py-5 space-y-5 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Plaintiff</p>
                    <p className="font-medium">{form.plaintiff_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Defendant</p>
                    <p className="font-medium">{form.defendant_name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{form.defendant_address}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Court</p>
                    <p>{form.court_location}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Amount</p>
                    <p className="font-bold">${Number(form.amount_claimed).toLocaleString("en-CA")} CAD</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Reasons for Claim</p>
                  <div className="space-y-2 text-slate-800 leading-relaxed">
                    {(form.reasons_for_claim ?? []).map((p, i) => (
                      <p key={i}>
                        {p.text}
                        {p.citation && (
                          <> <a href={p.source_url ?? "#"} target="_blank" rel="noopener noreferrer"
                            className="text-blue-600 text-xs hover:underline">[{p.citation}]</a></>
                        )}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Relief Sought</p>
                  <ol className="space-y-1">
                    {(form.relief_sought ?? []).map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-400">{i+1}.</span>{r}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <div className="border-t border-slate-100 bg-slate-50 px-6 py-3">
                <p className="text-[10px] text-slate-400 italic">
                  Client draft — review before approving for filing.
                </p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Case Timeline</p>
            </div>
            <ul className="px-5 py-4 space-y-3">
              {c.events.map((ev) => (
                <li key={ev.id} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-indigo-300 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {ACTION_LABELS[ev.action] ?? ev.action}
                    </p>
                    {(ev.payload as { notes?: string })?.notes && (
                      <p className="text-xs text-slate-500 mt-0.5 italic">
                        &ldquo;{(ev.payload as { notes: string }).notes}&rdquo;
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5">
                      {ev.actor} · {new Date(ev.created_at).toLocaleString("en-CA", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                </li>
              ))}
              {c.events.length === 0 && (
                <li className="text-sm text-slate-400">No events yet.</li>
              )}
            </ul>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="space-y-5">
          {/* Connection request card — shown before review actions */}
          {c.connection_status && (
            <AcceptConnectionButton
              caseId={id}
              initialStatus={c.connection_status}
            />
          )}

          {/* Review action card */}
          {canReview ? (
            <ReviewPanel caseId={id} />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-sm font-semibold text-slate-600">
                Status: <span className={`${status.text}`}>{status.label}</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">No review action required at this stage.</p>
            </div>
          )}

          {/* Deadline manager */}
          <DeadlineManager caseId={id} initialDeadlines={c.deadlines} />

          {/* Send reminder */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Client Reminder</p>
            <RemindButton caseId={id} />
            <p className="text-[10px] text-slate-400">
              Sends a plain-English update notification to the client&apos;s bell.
            </p>
          </div>

          {/* Prior reviews */}
          {c.reviews.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Review History</p>
              </div>
              <ul className="divide-y divide-slate-50">
                {c.reviews.map((r) => (
                  <li key={r.id} className="px-5 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide
                        ${r.decision === "approved" ? "bg-emerald-100 text-emerald-700"
                          : r.decision === "changes_requested" ? "bg-orange-100 text-orange-700"
                          : "bg-yellow-100 text-yellow-700"}`}>
                        {r.decision.replace("_", " ")}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(r.created_at).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    {r.notes && <p className="text-xs text-slate-600 italic">&ldquo;{r.notes}&rdquo;</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Case messaging thread */}
          <CaseMessageThread caseId={id} />
        </div>
      </div>
    </main>
  );
}
