import { Badge } from "@/components/ui/badge";
import type { AiStrength } from "@/lib/lawyer/mock";
import { cn } from "@/lib/utils";

const LABELS: Record<AiStrength, string> = {
  weak: "Weak",
  moderate: "Moderate",
  strong: "Strong",
};

const STYLES: Record<AiStrength, string> = {
  weak: "bg-red-500/15 text-red-300 border-red-500/30",
  moderate: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  strong: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

export function AiStrengthBadge({ strength }: { strength: AiStrength }) {
  return (
    <Badge
      variant="outline"
      className={cn("capitalize border", STYLES[strength])}
    >
      {LABELS[strength]}
    </Badge>
  );
}
