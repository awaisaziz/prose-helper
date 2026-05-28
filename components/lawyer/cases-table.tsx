import Link from "next/link";
import { AiStrengthBadge } from "@/components/lawyer/ai-strength-badge";
import { DeadlineRiskBadge } from "@/components/lawyer/deadline-risk-badge";
import { StatusBadge } from "@/components/lawyer/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatClaimAmount,
  type LawyerCase,
} from "@/lib/lawyer/mock";

export function CasesTable({ cases }: { cases: LawyerCase[] }) {
  if (cases.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No matters in the queue.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Client</TableHead>
          <TableHead className="text-right">Claim amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>AI strength</TableHead>
          <TableHead>Deadline risk</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cases.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-medium">{c.clientName}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatClaimAmount(c.claimAmount)}
            </TableCell>
            <TableCell>
              <StatusBadge status={c.status} />
            </TableCell>
            <TableCell>
              <AiStrengthBadge strength={c.aiStrength} />
            </TableCell>
            <TableCell>
              <DeadlineRiskBadge risk={c.deadlineRisk} />
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                render={<Link href={`/lawyer/case/${c.id}`} />}
              >
                Review
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
