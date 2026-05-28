import Link from "next/link";
import { notFound } from "next/navigation";
import { AiStrengthBadge } from "@/components/lawyer/ai-strength-badge";
import { DeadlineRiskBadge } from "@/components/lawyer/deadline-risk-badge";
import { LawyerShell } from "@/components/lawyer/lawyer-shell";
import { StatusBadge } from "@/components/lawyer/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatClaimAmount,
  getLawyerCaseById,
} from "@/lib/lawyer/mock";
import { ArrowLeft, FileText, Scale, ShieldCheck } from "lucide-react";

export default async function LawyerCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caseRecord = await getLawyerCaseById(id);

  if (!caseRecord) {
    notFound();
  }

  return (
    <LawyerShell
      title={caseRecord.clientName}
      description="Case review workspace — scaffold only."
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 text-muted-foreground"
          render={<Link href="/lawyer/dashboard" />}
        >
          <ArrowLeft className="size-4" data-icon="inline-start" />
          Back to dashboard
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <StatusBadge status={caseRecord.status} />
        <AiStrengthBadge strength={caseRecord.aiStrength} />
        <DeadlineRiskBadge risk={caseRecord.deadlineRisk} />
        <span className="text-sm text-muted-foreground">
          Claim:{" "}
          <span className="font-medium text-foreground tabular-nums">
            {formatClaimAmount(caseRecord.claimAmount)}
          </span>
        </span>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Dispute summary</CardTitle>
          <CardDescription>
            Assigned to {caseRecord.assignedLawyer}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {caseRecord.disputeSummary}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Scale className="size-4 text-violet-400" aria-hidden />
              Rights & remedies
            </CardTitle>
            <CardDescription>Coming in Phase 2</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            AI-generated legal analysis with Ontario e-Laws citations will appear
            here.
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-4 text-violet-400" aria-hidden />
              Plaintiff&apos;s Claim
            </CardTitle>
            <CardDescription>Coming in Phase 4</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Form 7A draft builder and revision history will appear here.
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="size-4 text-violet-400" aria-hidden />
              Lawyer sign-off
            </CardTitle>
            <CardDescription>Coming in Phase 5</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Approve, request changes, or reject with notes before filing.
          </CardContent>
        </Card>
      </div>
    </LawyerShell>
  );
}
