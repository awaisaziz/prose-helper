import { CasesTable } from "@/components/lawyer/cases-table";
import { LawyerShell } from "@/components/lawyer/lawyer-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLawyerCases } from "@/lib/lawyer/mock";
import { Briefcase, Clock, FileWarning } from "lucide-react";

export default async function LawyerDashboardPage() {
  const cases = await getLawyerCases();

  const reviewQueue = cases.filter((c) =>
    ["submitted", "in_review", "changes_requested"].includes(c.status)
  );
  const urgent = cases.filter((c) => c.deadlineRisk === "red").length;
  const strongCases = cases.filter((c) => c.aiStrength === "strong").length;

  return (
    <LawyerShell
      title="Dashboard"
      description="Review queue and matter overview. All data is mock for Phase 0."
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Briefcase className="size-3.5" aria-hidden />
              Review queue
            </CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {reviewQueue.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Awaiting lawyer review or revision
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <FileWarning className="size-3.5" aria-hidden />
              Urgent deadlines
            </CardDescription>
            <CardTitle className="text-3xl tabular-nums text-red-400">
              {urgent}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Matters with red deadline risk
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="size-3.5" aria-hidden />
              Strong AI assessment
            </CardDescription>
            <CardTitle className="text-3xl tabular-nums text-emerald-400">
              {strongCases}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Cases rated strong by co-counsel AI
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All matters</CardTitle>
          <CardDescription>
            {cases.length} active Small Claims matters assigned to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CasesTable cases={cases} />
        </CardContent>
      </Card>
    </LawyerShell>
  );
}
