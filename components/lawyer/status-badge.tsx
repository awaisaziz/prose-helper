import { Badge } from "@/components/ui/badge";
import { formatStatus, type CaseStatus } from "@/lib/lawyer/mock";
import { cn } from "@/lib/utils";

const VARIANT: Partial<Record<CaseStatus, string>> = {
  submitted: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  in_review: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  changes_requested: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  filed: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  draft: "bg-slate-500/10 text-slate-400 border-slate-600/30",
};

export function StatusBadge({ status }: { status: CaseStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("border", VARIANT[status] ?? VARIANT.draft)}
    >
      {formatStatus(status)}
    </Badge>
  );
}
