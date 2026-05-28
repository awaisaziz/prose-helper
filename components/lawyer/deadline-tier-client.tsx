"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Moon, Loader2 } from "lucide-react";
import type { DeadlineRow } from "@/lib/db/deadlines";

const URGENCY_CHIP: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high:     "bg-amber-100 text-amber-700",
  normal:   "bg-blue-100 text-blue-700",
  low:      "bg-slate-100 text-slate-500",
};

function formatDue(dateStr: string, status: string) {
  const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
  if (status === "overdue" || days < 0) return `Overdue · ${Math.abs(days)}d ago`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return new Date(dateStr).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
}

export function DeadlineTierClient({
  deadlines: initial,
}: {
  deadlines: DeadlineRow[];
}) {
  const [deadlines, setDeadlines] = useState(initial);
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      await fetch(`/api/lawyer/deadlines/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setDeadlines((prev) => prev.filter((d) => d.id !== id));
    } finally {
      setUpdating(null);
    }
  }

  if (deadlines.length === 0) return null;

  return (
    <ul className="divide-y divide-slate-50">
      {deadlines.map((d) => (
        <li key={d.id} className="flex items-center gap-4 px-5 py-4">
          {/* Left: client + case link */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <Link
                href={`/lawyer/case/${d.case_id}`}
                className="text-sm font-semibold text-indigo-700 hover:underline"
              >
                {d.client_name}&apos;s Claim
              </Link>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${URGENCY_CHIP[d.urgency] ?? ""}`}>
                {d.urgency}
              </span>
            </div>
            <p className="text-sm text-slate-800 font-medium truncate">{d.title}</p>
            {d.rule_anchor && (
              <p className="text-[10px] text-slate-400 mt-0.5">{d.rule_anchor}</p>
            )}
          </div>

          {/* Right: due date + actions */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-semibold text-slate-500 text-right whitespace-nowrap">
              {formatDue(d.due_date, d.status)}
            </span>
            <button
              onClick={() => updateStatus(d.id, "done")}
              disabled={updating === d.id}
              title="Mark done"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
            >
              {updating === d.id
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Check className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => updateStatus(d.id, "snoozed")}
              disabled={updating === d.id}
              title="Snooze"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
