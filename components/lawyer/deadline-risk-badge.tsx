import { Badge } from "@/components/ui/badge";
import type { DeadlineRisk } from "@/lib/lawyer/mock";
import { cn } from "@/lib/utils";

const LABELS: Record<DeadlineRisk, string> = {
  green: "On track",
  yellow: "Attention",
  red: "Urgent",
};

const STYLES: Record<DeadlineRisk, string> = {
  green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  yellow: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  red: "bg-red-500/15 text-red-300 border-red-500/30",
};

export function DeadlineRiskBadge({ risk }: { risk: DeadlineRisk }) {
  return (
    <Badge
      variant="outline"
      className={cn("border", STYLES[risk])}
    >
      <span
        aria-hidden
        className={cn(
          "mr-1.5 inline-block size-1.5 rounded-full",
          risk === "green" && "bg-emerald-400",
          risk === "yellow" && "bg-amber-400",
          risk === "red" && "bg-red-400"
        )}
      />
      {LABELS[risk]}
    </Badge>
  );
}
