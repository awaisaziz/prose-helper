import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { query } from "@/lib/db/index";
import { draftForm7A } from "@/lib/ai/form7a";
import { StepIndicator } from "@/components/client/step-indicator";
import { Form7AEditor } from "@/components/client/form7a-editor";
import { EvidenceChecklist } from "@/components/client/evidence-checklist";
import { SubmitTrack } from "@/components/client/submit-track";
import { LegalFrameworkPanel } from "@/components/client/legal-framework-panel";
import { CaseStrengthBadge } from "@/components/client/case-strength-badge";
import { RightsCard } from "@/components/client/rights-card";
import { getLawyerProfiles } from "@/lib/db/lawyers";
import { getConnectionsForCase } from "@/lib/db/connections";
import { CaseMessageThreadClient } from "@/components/client/case-message-thread-client";
import type { AssessmentResult } from "@/lib/ai/assess";
import type { Form7AFields, EvidenceItem } from "@/lib/ai/form7a";
import type { LawyerProfileRow } from "@/lib/db/lawyers";

export const dynamic = "force-dynamic";

interface CaseRow {
  id: string;
  status: string;
  dispute_summary: string;
  claim_amount: string;
  assessment: AssessmentResult | null;
  form7a_draft: Form7AFields | null;
  evidence_items: EvidenceItem[] | null;
  client_name: string;
}

const SUBMITTED_STATUSES = ["submitted", "in_review", "changes_requested", "approved", "filed", "tracking"];

export default async function PreparePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const sp     = await searchParams;

  const rows = await query<CaseRow & { lawyer_notes: string | null }>(
    `select c.id, c.status, c.dispute_summary, c.claim_amount, c.assessment,
            c.form7a_draft, c.evidence_items, cl.full_name as client_name,
            (select cr.notes from case_reviews cr
             where cr.case_id = c.id
             order by cr.created_at desc limit 1) as lawyer_notes
     from cases c
     join clients cl on cl.id = c.client_id
     where c.id = $1`,
    [id]
  );

  if (!rows.length) notFound();
  const c = rows[0];
  const lawyerNotes: string | null = c.lawyer_notes ?? null;

  // Default tab: submit if already submitted, else prepare
  const defaultTab = SUBMITTED_STATUSES.includes(c.status) ? "submit" : "prepare";
  const activeTab  = sp.tab ?? defaultTab;

  // Run Form 7A draft if not yet done
  let form     = c.form7a_draft;
  let evidence = c.evidence_items ?? [];

  if (!form || !form.reasons_for_claim?.length) {
    if (!c.assessment?.case_strength) {
      return (
        <>
          <StepIndicator current={4} />
          <main className="mx-auto max-w-2xl px-6 py-10 text-center">
            <p className="text-slate-600 mb-4">Your case hasn&apos;t been assessed yet.</p>
            <Link href={`/client/case/${id}/assess`}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              Run assessment first →
            </Link>
          </main>
        </>
      );
    }

    const result = await draftForm7A(
      c.dispute_summary,
      parseFloat(c.claim_amount),
      c.client_name,
      "The Defendant",
      c.assessment
    );
    form     = result.form;
    evidence = result.evidence;

    await query(
      `update cases
       set form7a_draft = $1, evidence_items = $2, status = 'drafted', updated_at = now()
       where id = $3`,
      [JSON.stringify(form), JSON.stringify(evidence), id]
    );
    c.status = "drafted";
  }

  // Load connections + lawyer profiles
  const [allLawyers, connections] = await Promise.all([
    getLawyerProfiles(),
    getConnectionsForCase(id),
  ]);
  const connectedIds     = new Set(connections.map((cn) => cn.lawyer_id));
  const connectedLawyers: LawyerProfileRow[] = allLawyers.filter((l) => connectedIds.has(l.lawyer_id));

  const assessment = c.assessment!;

  // Tab definitions
  const tabs = [
    {
      id: "assessment",
      label: "Assessment",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: "prepare",
      label: "Prepare",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: "submit",
      label: "Submit for Review",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <StepIndicator current={4} />

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Breadcrumb */}
        <div className="mb-5">
          <Link
            href="/client/dashboard"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
        </div>

        {/* Page header */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
            Step 4 of 5 — Prepare &amp; Submit
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Plaintiff&apos;s Claim (Form 7A)</h1>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{c.dispute_summary}</p>
        </div>

        {/* ── Three-tab bar ── */}
        <div className="mb-8 flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 w-fit">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`?tab=${tab.id}`}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all
                  ${isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
              >
                {tab.icon}
                {tab.label}
                {tab.id === "submit" && SUBMITTED_STATUSES.includes(c.status) && (
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white/70" : "bg-amber-500"}`} />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── ASSESSMENT TAB ── */}
        {activeTab === "assessment" && (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              {/* Summary */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">What happened</p>
                <p className="text-sm text-slate-700 leading-relaxed">{c.dispute_summary}</p>
                {assessment.reasoning[0] && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Summary</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{assessment.reasoning[0]}</p>
                  </div>
                )}
              </div>
              <LegalFrameworkPanel framework={assessment.legal_framework} />
              <RightsCard rr={assessment.rights_remedies} />
            </div>
            <div className="space-y-5">
              <CaseStrengthBadge
                strength={assessment.case_strength}
                reasoning={assessment.reasoning}
                go_no_go={assessment.go_no_go}
                governing_provision={assessment.rights_remedies.governing_provision}
                governing_url={assessment.rights_remedies.governing_url}
              />
              <Link
                href="?tab=prepare"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                View prepared claim →
              </Link>
            </div>
          </div>
        )}

        {/* ── PREPARE TAB ── */}
        {activeTab === "prepare" && (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Left — Form 7A with edit */}
            <div className="space-y-4">
              <Form7AEditor caseId={id} form={form} />
              <div className="flex items-center gap-3">
                <Link href="?tab=assessment"
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
                  ← Back to assessment
                </Link>
                <span className="text-slate-200">|</span>
                <Link href="?tab=submit"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Ready to submit →
                </Link>
              </div>
            </div>

            {/* Right — Evidence Checklist */}
            <div>
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-800">Evidence Checklist</h2>
                  <span className="text-xs text-slate-400">{evidence.length} items</span>
                </div>
                <div className="px-5 py-4">
                  {evidence.length > 0 ? (
                    <EvidenceChecklist items={evidence} />
                  ) : (
                    <p className="text-sm text-slate-400 italic">No evidence items generated.</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <Link href="?tab=submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                  Submit for lawyer review →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── SUBMIT TAB ── */}
        {activeTab === "submit" && (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Left — Form 7A preview with edit toggle */}
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-medium">
                {SUBMITTED_STATUSES.includes(c.status)
                  ? "Submitted draft — edit and re-submit if changes were requested."
                  : "Draft ready for lawyer review — edit before submitting if needed."}
              </p>
              <Form7AEditor caseId={id} form={form} />
              <Link href="?tab=prepare"
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
                ← Back to prepare
              </Link>
            </div>

            {/* Right — Submit track */}
            <div>
              <h2 className="text-sm font-semibold text-slate-700 mb-4">Review Status</h2>
              <SubmitTrack
                caseId={id}
                currentStatus={c.status}
                connectedLawyers={connectedLawyers}
                lawyerNotes={lawyerNotes}
              />

              {connectedLawyers.length === 0 && (
                <Link href={`/client/case/${id}/lawyers`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 hover:border-blue-300 hover:text-blue-700 transition-colors">
                  Choose a lawyer first →
                </Link>
              )}

              {/* Lawyer ↔ Client message thread */}
              <div className="mt-6">
                <CaseMessageThreadClient caseId={id} />
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
