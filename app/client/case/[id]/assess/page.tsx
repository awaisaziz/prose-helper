import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { query } from "@/lib/db/index";
import { assessCase } from "@/lib/ai/assess";
import { StepIndicator } from "@/components/client/step-indicator";
import { LegalFrameworkPanel } from "@/components/client/legal-framework-panel";
import { CaseStrengthBadge } from "@/components/client/case-strength-badge";
import { RightsCard } from "@/components/client/rights-card";
import type { AssessmentResult } from "@/lib/ai/assess";

export const dynamic = "force-dynamic";

interface CaseRow {
  id: string;
  status: string;
  in_scope: boolean;
  dispute_summary: string;
  claim_amount: string;
  matter_type: string;
  assessment: AssessmentResult | null;
  rights_remedies: AssessmentResult["rights_remedies"] | null;
  legal_framework: AssessmentResult["legal_framework"] | null;
}

export default async function AssessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const rows = await query<CaseRow>(
    `select id, status, in_scope, dispute_summary, claim_amount,
            matter_type, assessment, rights_remedies, legal_framework
     from cases where id = $1`,
    [id]
  );

  if (!rows.length) notFound();
  const c = rows[0];

  if (!c.in_scope) {
    redirect(`/client/intake/${id}/triage`);
  }

  // Run assessment if not yet done (idempotent — saves to DB)
  let assessment = c.assessment;
  if (!assessment || !assessment.case_strength) {
    assessment = await assessCase(
      c.dispute_summary,
      c.matter_type ?? "other",
      parseFloat(c.claim_amount)
    );
    // Persist via the API route logic inline (server component can call DB directly)
    await query(
      `update cases
       set assessment = $1, rights_remedies = $2, legal_framework = $3,
           status = 'analyzed', updated_at = now()
       where id = $4`,
      [
        JSON.stringify(assessment),
        JSON.stringify(assessment.rights_remedies),
        JSON.stringify(assessment.legal_framework),
        id,
      ]
    );
  }

  const framework  = assessment.legal_framework;
  const rr         = assessment.rights_remedies;

  return (
    <>
      <StepIndicator current={3} />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
            Step 3 of 5 — Legal Assessment
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Your Legal Framework</h1>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
            {c.dispute_summary}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left — Legal Framework */}
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Applicable Law — 4 Layers
              </h2>
              <LegalFrameworkPanel framework={framework} />
            </div>

            {/* Rights & Remedies */}
            <RightsCard rr={rr} />
          </div>

          {/* Right — Strength + Actions */}
          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">Case Strength</h2>
              <CaseStrengthBadge
                strength={assessment.case_strength}
                reasoning={assessment.reasoning}
                go_no_go={assessment.go_no_go}
                governing_provision={rr.governing_provision}
                governing_url={rr.governing_url}
              />
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-2">
              <Link
                href={`/client/case/${id}/prepare`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Prepare my claim
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href={`/client/case/${id}/lawyers`}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
              >
                Speak with a lawyer first
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
