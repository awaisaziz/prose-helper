"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type Priority = "CRITICAL" | "HIGH" | "NORMAL" | "LOW";

export interface TriageItem {
  id: string;
  priority: Priority;
  category: string;
  title: string;
  subtitle: string;
  caseId: string;
  href: string;
  updatedAt: string;
}

const PRIORITY_STYLE: Record<Priority, { bg: string; text: string; border: string; dot: string }> = {
  CRITICAL: { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    dot: "bg-red-500"    },
  HIGH:     { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500"  },
  NORMAL:   { bg: "bg-sky-50",    text: "text-sky-700",    border: "border-sky-200",    dot: "bg-sky-500"    },
  LOW:      { bg: "bg-slate-50",  text: "text-slate-600",  border: "border-slate-200",  dot: "bg-slate-400"  },
};

// Tab definitions
const TABS = [
  { id: "all",          label: "All" },
  { id: "new",          label: "New Applications" },
  { id: "deadlines",    label: "Deadlines" },
  { id: "connections",  label: "Connection Requests" },
  { id: "review",       label: "In Review" },
  { id: "approved",     label: "Ready to File" },
] as const;
type TabId = typeof TABS[number]["id"];

const TAB_CATEGORIES: Record<TabId, string[]> = {
  all:         [],   // empty = all
  new:         ["New Submission", "Client Resubmitted"],
  deadlines:   ["Overdue Deadline", "Imminent Deadline"],
  connections: ["Connection Request"],
  review:      ["Set Filing Deadline"],
  approved:    ["Ready to File"],
};

function ItemRow({ item }: { item: TriageItem }) {
  const s = PRIORITY_STYLE[item.priority];
  return (
    <Link
      href={item.href}
      className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:border-indigo-300 hover:shadow-sm transition-all group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${s.bg} ${s.border} ${s.text}`}>
            {item.category}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${s.bg} ${s.border} ${s.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {item.priority}
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-900 truncate">{item.title}</p>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{item.subtitle}</p>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-slate-400 mt-1 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export function TriageInbox({ items: allItems }: { items: TriageItem[] }) {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [search, setSearch] = useState("");

  // Compute per-tab counts
  const tabCounts = useMemo<Record<TabId, number>>(() => {
    const counts = {} as Record<TabId, number>;
    for (const tab of TABS) {
      const cats = TAB_CATEGORIES[tab.id];
      counts[tab.id] = cats.length === 0
        ? allItems.length
        : allItems.filter((i) => cats.includes(i.category)).length;
    }
    return counts;
  }, [allItems]);

  // Filter by tab + search
  const filtered = useMemo(() => {
    const cats = TAB_CATEGORIES[activeTab];
    let items = cats.length === 0
      ? allItems
      : allItems.filter((i) => cats.includes(i.category));

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.subtitle.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }
    return items;
  }, [allItems, activeTab, search]);

  // Group filtered items by priority
  const PRIORITY_ORDER: Priority[] = ["CRITICAL", "HIGH", "NORMAL", "LOW"];
  const grouped = PRIORITY_ORDER.map((p) => ({
    priority: p,
    items: filtered.filter((i) => i.priority === p),
  })).filter((g) => g.items.length > 0);

  const SECTION_LABELS: Record<Priority, string> = {
    CRITICAL: "Critical — Requires Immediate Action",
    HIGH:     "High Priority",
    NORMAL:   "Normal",
    LOW:      "Low — When You Have Time",
  };

  return (
    <>
      {/* Tab bar + search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 flex-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = tabCounts[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative shrink-0 w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search triage…"
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300"
          />
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          {search ? (
            <>
              <p className="text-sm font-semibold text-slate-500">No results for &ldquo;{search}&rdquo;</p>
              <button onClick={() => setSearch("")} className="mt-2 text-xs text-indigo-600 hover:underline">Clear search</button>
            </>
          ) : (
            <>
              <p className="text-2xl mb-2">✓</p>
              <p className="text-sm font-semibold text-slate-500">Nothing here — all caught up!</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ priority, items: groupItems }) => {
            const s = PRIORITY_STYLE[priority];
            return (
              <section key={priority}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                  <h2 className={`text-xs font-bold uppercase tracking-widest ${s.text}`}>
                    {SECTION_LABELS[priority]}
                  </h2>
                  <span className={`ml-auto rounded-full border px-2 py-0.5 text-[10px] font-bold ${s.bg} ${s.border} ${s.text}`}>
                    {groupItems.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {groupItems.map((item) => <ItemRow key={item.id} item={item} />)}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
