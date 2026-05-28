"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LawyerProfileRow } from "@/lib/db/lawyers";

const STATUS_INFO: Record<string, { label: string; color: string; description: string }> = {
  submitted:         { label: "Awaiting Review",   color: "text-sky-700 bg-sky-50 border-sky-200",     description: "Your claim is in the lawyer's queue." },
  in_review:         { label: "Under Review",      color: "text-yellow-700 bg-yellow-50 border-yellow-200", description: "The lawyer is actively reviewing your draft." },
  changes_requested: { label: "Changes Requested", color: "text-orange-700 bg-orange-50 border-orange-200", description: "The lawyer has requested edits before approval." },
  approved:          { label: "Approved",           color: "text-emerald-700 bg-emerald-50 border-emerald-200", description: "Your claim has been approved for filing." },
  filed:             { label: "Filed",              color: "text-green-700 bg-green-50 border-green-200",  description: "Your claim has been filed with the court." },
  tracking:          { label: "Tracking",           color: "text-teal-700 bg-teal-50 border-teal-200",    description: "Your matter is active and being tracked." },
};

const STEP_FLOW = [
  { key: "drafted",          label: "Draft saved" },
  { key: "submitted",        label: "Sent to lawyer" },
  { key: "in_review",        label: "Under review" },
  { key: "approved",         label: "Approved" },
  { key: "filed",            label: "Filed" },
];

function StepFlow({ currentStatus }: { currentStatus: string }) {
  const currentIdx = STEP_FLOW.findIndex((s) => s.key === currentStatus);
  return (
    <ol className="flex items-center gap-0 overflow-x-auto">
      {STEP_FLOW.map((step, i) => {
        const done   = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold border
                ${active
                  ? "bg-blue-600 border-blue-600 text-white"
                  : done
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "bg-white border-slate-300 text-slate-400"}`}>
                {done ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : i + 1}
              </span>
              <span className={`text-[10px] font-medium whitespace-nowrap hidden sm:block
                ${active ? "text-blue-700 font-semibold" : done ? "text-emerald-600" : "text-slate-400"}`}>
                {step.label}
              </span>
            </div>
            {i < STEP_FLOW.length - 1 && (
              <div className={`mx-2 h-px w-8 sm:w-12 ${done ? "bg-emerald-400" : "bg-slate-200"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function SubmitTrack({
  caseId,
  currentStatus,
  connectedLawyers,
}: {
  caseId: string;
  currentStatus: string;
  connectedLawyers: LawyerProfileRow[];
}) {
  const router  = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const isDraft     = currentStatus === "drafted" || currentStatus === "changes_requested";
  const isSubmitted = !isDraft;
  const statusInfo  = STATUS_INFO[currentStatus];

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/cases/${caseId}/submit`, { method: "POST" });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to submit");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress flow */}
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
          Review Progress
        </p>
        <StepFlow currentStatus={currentStatus} />
      </div>

      {/* Status banner */}
      {statusInfo && (
        <div className={`rounded-xl border px-5 py-4 ${statusInfo.color}`}>
          <p className="text-sm font-bold">{statusInfo.label}</p>
          <p className="text-xs mt-0.5 opacity-80">{statusInfo.description}</p>
        </div>
      )}

      {/* Connected lawyers */}
      {connectedLawyers.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Sent To
            </p>
          </div>
          <ul className="divide-y divide-slate-100">
            {connectedLawyers.map((l) => (
              <li key={l.lawyer_id} className="flex items-center gap-3 px-5 py-3">
                {l.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.image_url} alt={l.full_name} className="h-8 w-8 rounded-full object-cover border border-slate-100" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {l.full_name.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="text-sm font-medium text-slate-800">{l.full_name}</p>
                  {l.title && <p className="text-xs text-slate-400">{l.title}</p>}
                </div>
                <span className="ml-auto rounded-full bg-sky-50 border border-sky-200 px-2.5 py-0.5 text-[10px] font-bold text-sky-700">
                  Notified
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit / re-submit button */}
      {isDraft ? (
        <div className="space-y-3">
          {connectedLawyers.length === 0 && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              No lawyer connected yet. You can still submit — a lawyer will be assigned from the directory.
            </p>
          )}
          {error && (
            <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-wait"
          >
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Submitting…
              </>
            ) : (
              <>
                Submit for Lawyer Review
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      ) : (
        <p className="text-center text-xs text-slate-400">
          {currentStatus === "approved" || currentStatus === "filed"
            ? "No further action required from you at this stage."
            : "Your claim is with the lawyer. You'll be notified when there's an update."}
        </p>
      )}
    </div>
  );
}
