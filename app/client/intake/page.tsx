"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepIndicator } from "@/components/client/step-indicator";

const MATTER_TYPES = [
  { value: "",                    label: "Let AI identify the type" },
  { value: "contractor_deposit",  label: "Contractor deposit not returned" },
  { value: "unpaid_debt",         label: "Unpaid debt / loan" },
  { value: "unpaid_invoice",      label: "Unpaid invoice / services" },
  { value: "defective_goods",     label: "Defective or undelivered goods" },
  { value: "property_damage",     label: "Property damage" },
  { value: "unpaid_wages",        label: "Unpaid wages" },
  { value: "consumer_protection", label: "Consumer protection issue" },
  { value: "other",               label: "Other" },
];

// Demo: use the first seeded client
const DEMO_CLIENT_ID = "00000000-0000-0000-0000-0000000000a1";

export default function IntakePage() {
  const router = useRouter();
  const [summary, setSummary]   = useState("");
  const [amount, setAmount]     = useState("");
  const [matterType, setMatter] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!summary.trim() || !amount) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dispute_summary: summary.trim(),
          claim_amount:    parseFloat(amount),
          matter_type:     matterType || undefined,
          client_id:       DEMO_CLIENT_ID,
        }),
      });

      if (!res.ok) throw new Error("Failed to analyze dispute");

      const { case_id } = await res.json() as { case_id: string };
      router.push(`/client/intake/${case_id}/triage`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <StepIndicator current={1} />

      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
            Step 1 of 5 — Tell us what happened
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Describe your dispute</h1>
          <p className="text-sm text-slate-500 mt-2">
            Write in plain language — no legal knowledge needed. We&apos;ll identify the
            applicable law and assess your position.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dispute description */}
          <div>
            <label htmlFor="summary" className="block text-sm font-semibold text-slate-800 mb-1.5">
              What happened? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="e.g. I paid a contractor $4,500 to renovate my bathroom. He took the deposit, never showed up, and has stopped responding to calls and texts. This happened in March 2024."
              rows={6}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-y transition-colors"
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Include: what was agreed, what went wrong, when it happened, how much money is involved.
            </p>
          </div>

          {/* Claim amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-semibold text-slate-800 mb-1.5">
              How much are you claiming? <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">$</span>
              <input
                id="amount"
                type="number"
                min="1"
                max="50000"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full rounded-xl border border-slate-300 bg-white pl-8 pr-12 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">CAD</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              Ontario Small Claims Court limit is <strong>$50,000</strong>. Claims above this amount are
              heard by the Superior Court of Justice.
            </p>
          </div>

          {/* Matter type (optional) */}
          <div>
            <label htmlFor="matter" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Matter type <span className="text-slate-400 font-normal">(optional — AI will identify if left blank)</span>
            </label>
            <select
              id="matter"
              value={matterType}
              onChange={(e) => setMatter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
            >
              {MATTER_TYPES.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !summary.trim() || !amount}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Identifying your legal framework…
              </>
            ) : (
              <>
                Analyze my dispute
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>
      </main>
    </>
  );
}
