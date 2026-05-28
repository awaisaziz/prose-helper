"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, MessageSquare, Eye } from "lucide-react";

export function ReviewPanel({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [decision, setDecision] = useState<string | null>(null);
  const [notes, setNotes]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const decisions = [
    {
      id:    "in_review",
      label: "Mark In Review",
      desc:  "Acknowledge receipt and start your review",
      icon:  <Eye className="w-4 h-4" />,
      cls:   "border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100",
      active:"border-yellow-500 bg-yellow-100 ring-2 ring-yellow-300",
    },
    {
      id:    "changes_requested",
      label: "Request Changes",
      desc:  "Ask client to revise before you approve",
      icon:  <MessageSquare className="w-4 h-4" />,
      cls:   "border-orange-300 bg-orange-50 text-orange-800 hover:bg-orange-100",
      active:"border-orange-500 bg-orange-100 ring-2 ring-orange-300",
    },
    {
      id:    "approved",
      label: "Approve",
      desc:  "Approve the draft for filing",
      icon:  <CheckCircle2 className="w-4 h-4" />,
      cls:   "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
      active:"border-emerald-500 bg-emerald-100 ring-2 ring-emerald-300",
    },
  ];

  async function handleSubmit() {
    if (!decision) return;
    if (decision === "changes_requested" && !notes.trim()) {
      setError("Please add notes explaining what changes are needed.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/lawyer/cases/${caseId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, notes: notes.trim() || undefined }),
      });
      if (!res.ok) {
        const j = await res.json() as { error?: string };
        throw new Error(j.error ?? "Failed to submit review");
      }
      router.push("/lawyer/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Review Decision</p>
      </div>
      <div className="p-5 space-y-4">
        {/* Decision buttons */}
        <div className="space-y-2">
          {decisions.map((d) => (
            <button
              key={d.id}
              onClick={() => setDecision(d.id)}
              className={`w-full flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all
                ${decision === d.id ? d.active : d.cls}`}
            >
              <span className="mt-0.5 shrink-0">{d.icon}</span>
              <div>
                <p className="text-sm font-semibold">{d.label}</p>
                <p className="text-xs opacity-70 mt-0.5">{d.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Notes
            {decision === "changes_requested" && <span className="text-red-500 ml-1">*</span>}
            <span className="font-normal text-slate-400 ml-1">
              (sent to client as notification)
            </span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="e.g. Please clarify the defendant's address and the exact payment date…"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300 resize-none"
          />
        </div>

        {error && (
          <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!decision || submitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
          ) : (
            "Submit Review →"
          )}
        </button>
      </div>
    </div>
  );
}
