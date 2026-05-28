"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export type DashTab = "all" | "inprogress" | "submitted" | "approved";

const TABS: { id: DashTab; label: string; dot?: string }[] = [
  { id: "all",        label: "All" },
  { id: "inprogress", label: "In Progress",      dot: "bg-blue-500" },
  { id: "submitted",  label: "Sent to Lawyer",   dot: "bg-amber-500" },
  { id: "approved",   label: "Approved & Filed", dot: "bg-emerald-500" },
];

export function DashboardTabs({
  counts,
}: {
  counts: Record<DashTab, number>;
}) {
  const sp = useSearchParams();
  const active = (sp.get("tab") ?? "all") as DashTab;

  return (
    <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
      {TABS.map((t) => {
        const isActive = t.id === active;
        const n = counts[t.id];
        return (
          <Link
            key={t.id}
            href={`?tab=${t.id}`}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all
              ${isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
          >
            {t.dot && (
              <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white/70" : t.dot}`} />
            )}
            {t.label}
            {n > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none
                ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                {n}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
