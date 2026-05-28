"use client";

import { useState } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import type { Form7AFields } from "@/lib/ai/form7a";

interface Props {
  caseId: string;
  form: Form7AFields;
  onSaved?: (updated: Form7AFields) => void;
}

export function Form7AEditor({ caseId, form, onSaved }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState<Form7AFields>(form);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  function startEdit() {
    setDraft(form);
    setEditing(true);
    setError(null);
  }

  function cancelEdit() {
    setDraft(form);
    setEditing(false);
    setError(null);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/cases/${caseId}/draft`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form7a_draft: draft }),
      });
      if (!res.ok) throw new Error("Save failed");
      setEditing(false);
      onSaved?.(draft);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function updateParagraph(i: number, text: string) {
    setDraft((prev) => {
      const reasons = [...prev.reasons_for_claim];
      reasons[i] = { ...reasons[i], text };
      return { ...prev, reasons_for_claim: reasons };
    });
  }

  function updateRelief(i: number, val: string) {
    setDraft((prev) => {
      const relief = [...prev.relief_sought];
      relief[i] = val;
      return { ...prev, relief_sought: relief };
    });
  }

  // ── Shared doc header ──
  const DocHeader = () => (
    <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
        Ontario Small Claims Court
      </p>
      <h2 className="text-base font-bold mt-0.5">Plaintiff&apos;s Claim</h2>
      <p className="text-xs text-slate-500 mt-0.5">Form 7A — O. Reg. 258/98</p>
    </div>
  );

  // ── View mode ──
  if (!editing) {
    return (
      <div className="relative rounded-xl border border-slate-300 bg-white shadow-sm overflow-hidden font-serif text-slate-900">
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={startEdit}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:border-blue-300 hover:text-blue-700 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>

        <DocHeader />

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
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Court Location</p>
              <p>{form.court_location}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Amount Claimed</p>
              <p className="font-bold text-base">${Number(form.amount_claimed).toLocaleString("en-CA")} CAD</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Reasons for Claim and Details</p>
            <div className="space-y-3 text-sm leading-relaxed text-slate-800">
              {form.reasons_for_claim.map((para, i) => (
                <p key={i}>
                  {para.text}
                  {para.citation && (
                    <>
                      {" "}
                      <a href={para.source_url ?? "#"} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-blue-600 font-medium text-xs hover:underline">
                        [{para.citation}]
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </>
                  )}
                </p>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Relief Sought</p>
            <ol className="space-y-1">
              {form.relief_sought.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-slate-400">{i + 1}.</span>
                  {r}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3">
          <p className="text-[10px] text-slate-400 italic">
            Draft generated by Pro Se Helper. Review all citations with your lawyer before filing.
          </p>
        </div>
      </div>
    );
  }

  // ── Edit mode ──
  return (
    <div className="rounded-xl border-2 border-blue-400 bg-white shadow-md overflow-hidden font-serif text-slate-900">
      {/* Edit toolbar */}
      <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-5 py-3">
        <div className="flex items-center gap-2">
          <Pencil className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800">Editing Form 7A</span>
          <span className="text-xs text-blue-500">(changes save to your draft)</span>
        </div>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            onClick={cancelEdit}
            disabled={saving}
          >
            <X className="w-3 h-3" />
            Cancel
          </button>
          <button
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            onClick={save}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
            Save
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-b border-red-100 px-5 py-2 text-sm text-red-600">{error}</div>
      )}

      <div className="px-6 py-5 space-y-5 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Plaintiff</p>
            <input
              value={draft.plaintiff_name}
              onChange={(e) => setDraft((p) => ({ ...p, plaintiff_name: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Defendant</p>
            <input
              value={draft.defendant_name}
              onChange={(e) => setDraft((p) => ({ ...p, defendant_name: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Defendant name"
            />
            <input
              value={draft.defendant_address}
              onChange={(e) => setDraft((p) => ({ ...p, defendant_address: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Address"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Court Location</p>
            <input
              value={draft.court_location}
              onChange={(e) => setDraft((p) => ({ ...p, court_location: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Amount Claimed (CAD)</p>
            <input
              type="number"
              value={draft.amount_claimed}
              onChange={(e) => setDraft((p) => ({ ...p, amount_claimed: parseFloat(e.target.value) || 0 }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Reasons for Claim and Details
            <span className="ml-1 text-slate-300 font-normal normal-case text-[9px]">(citations preserved)</span>
          </p>
          <div className="space-y-2">
            {draft.reasons_for_claim.map((para, i) => (
              <div key={i}>
                {para.citation && (
                  <p className="text-[10px] text-blue-500 mb-0.5">Citation: [{para.citation}]</p>
                )}
                <textarea
                  value={para.text}
                  onChange={(e) => updateParagraph(i, e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Relief Sought</p>
          <div className="space-y-2">
            {draft.relief_sought.map((r, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-slate-400 text-sm shrink-0">{i + 1}.</span>
                <input
                  value={r}
                  onChange={(e) => updateRelief(i, e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex justify-end gap-2">
        <button
          onClick={cancelEdit}
          disabled={saving}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Save changes
        </button>
      </div>
    </div>
  );
}
