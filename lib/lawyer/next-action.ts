import type { LawyerCaseRow } from "@/lib/db/lawyer-cases";

export type ActionPriority = "CRITICAL" | "HIGH" | "NORMAL" | "LOW";

export interface NextAction {
  label: string;
  priority: ActionPriority;
}

export function getNextAction(c: LawyerCaseRow): NextAction {
  if (c.overdue_count > 0) {
    return { label: "Deadline overdue — take action now", priority: "CRITICAL" };
  }
  if (c.imminent_count > 0) {
    const daysOut = c.next_deadline_date
      ? Math.ceil((new Date(c.next_deadline_date).getTime() - Date.now()) / 86_400_000)
      : 0;
    const when = daysOut <= 0 ? "today" : daysOut === 1 ? "tomorrow" : `in ${daysOut}d`;
    return {
      label: `Deadline ${when} — prepare filing`,
      priority: "HIGH",
    };
  }
  if (c.status === "submitted") {
    return { label: "New submission — review Form 7A draft", priority: "HIGH" };
  }
  if (c.status === "changes_requested") {
    return { label: "Client has resubmitted — review edits", priority: "HIGH" };
  }
  if (c.status === "in_review") {
    return { label: "Set a filing deadline", priority: "NORMAL" };
  }
  if (c.status === "approved") {
    return { label: "File with the clerk", priority: "NORMAL" };
  }
  return { label: "Review case file", priority: "LOW" };
}

export const PRIORITY_STYLE: Record<ActionPriority, { dot: string; text: string; bg: string; border: string }> = {
  CRITICAL: { dot: "bg-red-500",    text: "text-red-700",    bg: "bg-red-50",    border: "border-red-200" },
  HIGH:     { dot: "bg-amber-500",  text: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200" },
  NORMAL:   { dot: "bg-blue-500",   text: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
  LOW:      { dot: "bg-slate-400",  text: "text-slate-600",  bg: "bg-slate-50",  border: "border-slate-200" },
};
