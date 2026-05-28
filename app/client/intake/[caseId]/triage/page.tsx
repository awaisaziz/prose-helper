import Link from "next/link";
import { notFound } from "next/navigation";
import { query } from "@/lib/db/index";
import { StepIndicator } from "@/components/client/step-indicator";
import { LegalSourceLink } from "@/components/client/legal-source-link";
import type { TriageResult } from "@/lib/ai/triage";

export const dynamic = "force-dynamic";

interface CaseTriageRow {
  id: string;
  status: string;
  in_scope: boolean;
  intake_data: TriageResult;
  claim_amount: string;
}

export default async function TriagePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;

  const rows = await query<CaseTriageRow>(
    `select id, status, in_scope, intake_data, claim_amount from cases where id = $1`,
    [caseId]
  );

  if (!rows.length) notFound();

  const c = rows[0];
  const triage = c.intake_data as TriageResult;

  return (
    <>
      <StepIndicator current={2} />

      <main className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-6">
          Step 2 of 5 — Triage Result
        </p>

        {c.in_scope ? (
          /* ── IN SCOPE ── */
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-emerald-900 mb-1">
                    Your matter qualifies for Ontario Small Claims Court
                  </h1>
                  {triage.matter_label && (
                    <span className="inline-block rounded-full bg-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-800 mb-3">
                      {triage.matter_label}
                    </span>
                  )}
                  <p className="text-sm text-emerald-800 leading-relaxed">{triage.reason}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Jurisdiction</p>
              <p className="text-sm font-medium text-slate-700">{triage.jurisdiction}</p>
              {triage.governing_statute && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">Primary authority</p>
                  <LegalSourceLink citation={triage.governing_statute} url={triage.governing_statute_url} />
                </div>
              )}
              <div>
                <p className="text-xs text-slate-400 mb-1">Claim amount</p>
                <p className="text-sm font-semibold text-slate-800">
                  ${Number(c.claim_amount).toLocaleString("en-CA")} CAD
                </p>
              </div>
            </div>

            <Link
              href={`/client/case/${caseId}/assess`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              View my legal framework
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        ) : (
          /* ── OUT OF SCOPE ── */
          <div className="space-y-6">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-amber-900 mb-1">
                    This matter falls outside Ontario Small Claims Court
                  </h1>
                  {triage.matter_label && (
                    <span className="inline-block rounded-full bg-amber-200 px-3 py-0.5 text-xs font-bold text-amber-800 mb-3">
                      {triage.matter_label}
                    </span>
                  )}
                  <p className="text-sm text-amber-800 leading-relaxed">{triage.reason}</p>
                </div>
              </div>
            </div>

            {triage.governing_statute && (
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Correct Forum
                </p>
                <p className="text-sm text-slate-700 mb-2">{triage.jurisdiction}</p>
                <p className="text-xs text-slate-400 mb-1">Governing authority</p>
                <LegalSourceLink citation={triage.governing_statute} url={triage.governing_statute_url} />
              </div>
            )}

            <Link
              href={`/client/case/${caseId}/lawyers`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Connect with a lawyer
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link href="/client/intake"
              className="block text-center text-sm text-slate-500 hover:text-slate-800 transition-colors">
              ← Start a new claim
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
