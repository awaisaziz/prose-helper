import Link from "next/link";
import { DeadlineRiskBadge } from "@/components/lawyer/deadline-risk-badge";
import { LawyerShell } from "@/components/lawyer/lawyer-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLawyerDeadlines } from "@/lib/lawyer/mock";
import { CalendarClock } from "lucide-react";

function formatDueDate(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
  }).format(new Date(iso + "T12:00:00"));
}

export default async function LawyerDeadlinesPage() {
  const deadlines = await getLawyerDeadlines();
  const urgentCount = deadlines.filter((d) => d.risk === "red").length;

  return (
    <LawyerShell
      title="Deadline Guardian"
      description="Procedural deadlines across all matters. Mock data — full guardian in Phase 6."
    >
      <Card className="mb-6 max-w-sm">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <CalendarClock className="size-3.5" aria-hidden />
            Urgent this week
          </CardDescription>
          <CardTitle className="text-3xl tabular-nums text-red-400">
            {urgentCount}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Deadlines flagged as urgent (red risk)
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming deadlines</CardTitle>
          <CardDescription>
            Sorted by due date. Click a matter to open case review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Client</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="text-right">Matter</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deadlines.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.clientName}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {d.label}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatDueDate(d.dueDate)}
                  </TableCell>
                  <TableCell>
                    <DeadlineRiskBadge risk={d.risk} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      render={<Link href={`/lawyer/case/${d.caseId}`} />}
                    >
                      Open
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </LawyerShell>
  );
}
