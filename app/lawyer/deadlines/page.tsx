import Link from "next/link";
import { getDeadlinesForLawyer, type DeadlineRow } from "@/lib/db/deadlines";
import { DeadlineTierClient } from "@/components/lawyer/deadline-tier-client";

export const dynamic = "force-dynamic";

const DEMO_LAWYER_ID = "00000000-0000-0000-0000-000000000001";

const URGENCY_CHIP: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high:     "bg-amber-100 text-amber-700",
  normal:   "bg-blue-100 text-blue-700",
  low:      "bg-slate-100 text-slate-500",
};

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

function formatDue(dateStr: string, status: string) {
  const days = daysUntil(dateStr);
  if (status === "overdue" || days < 0) return `Overdue · ${Math.abs(days)}d ago`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return new Date(dateStr).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
}

function Tier({
  label,
  color,
  deadlines,
}: {
  label: string;
  color: "red" | "amber" | "slate";
  deadlines: DeadlineRow[];
}) {
  if (deadlines.length === 0) return null;

  const headerCls = {
    red:   "bg-red-50 border-red-200 text-red-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    slate: "bg-slate-50 border-slate-200 text-slate-600",
  }[color];

  const dotCls = {
    red:   "bg-red-400",
    amber: "bg-amber-400",
    slate: "bg-slate-400",
  }[color];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className={`flex items-center gap-2 border-b px-5 py-3 ${headerCls}`}>
        <span className={`h-2 w-2 rounded-full ${dotCls}`} />
        <p className="text-xs font-bold uppercase tracking-widest">{label}</p>
        <span className="ml-auto text-xs font-semibold opacity-70">{deadlines.length} item{deadlines.length !== 1 ? "s" : ""}</span>
      </div>
      <DeadlineTierClient deadlines={deadlines} />
    </div>
  );
}

export default async function DeadlineGuardianPage() {
  const all = await getDeadlinesForLawyer(DEMO_LAWYER_ID);

  const overdue   = all.filter((d) => d.status === "overdue" || daysUntil(d.due_date) < 0);
  const thisWeek  = all.filter((d) => d.status !== "overdue" && daysUntil(d.due_date) >= 0 && daysUntil(d.due_date) <= 7);
  const upcoming  = all.filter((d) => d.status !== "overdue" && daysUntil(d.due_date) > 7);

  const totalActive = all.length;
  const criticalCount = all.filter((d) => d.urgency === "critical" || d.status === "overdue").length;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Deadline Guardian</h1>
        <p className="text-sm text-slate-500 mt-1">Auto-prioritised procedural deadlines across all active matters</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-extrabold text-slate-900">{totalActive}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">Active Deadlines</p>
        </div>
        <div className={`rounded-2xl border p-4 text-center ${criticalCount > 0 ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"}`}>
          <p className={`text-2xl font-extrabold ${criticalCount > 0 ? "text-red-700" : "text-slate-900"}`}>{criticalCount}</p>
          <p className={`text-xs font-semibold mt-0.5 uppercase tracking-wide ${criticalCount > 0 ? "text-red-500" : "text-slate-500"}`}>Critical / Overdue</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-extrabold text-amber-600">{thisWeek.length}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">Due This Week</p>
        </div>
      </div>

      {totalActive === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-2xl mb-2">✅</p>
          <p className="text-sm font-semibold text-slate-600">All clear — no active deadlines</p>
          <p className="text-xs text-slate-400 mt-1">Add deadlines from individual case pages</p>
        </div>
      ) : (
        <div className="space-y-6">
          <Tier label="⚠ Overdue — Action Required" color="red"   deadlines={overdue} />
          <Tier label="📅 Due This Week"              color="amber" deadlines={thisWeek} />
          <Tier label="🗓 Upcoming"                   color="slate" deadlines={upcoming} />
        </div>
      )}
    </main>
  );
}
