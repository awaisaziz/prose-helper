"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, Moon, Loader2 } from "lucide-react";
import type { DeadlineSummary } from "@/lib/db/lawyer-cases";

const URGENCY_OPTS = [
  { value: "critical", label: "Critical" },
  { value: "high",     label: "High" },
  { value: "normal",   label: "Normal" },
  { value: "low",      label: "Low" },
];

const STATUS_CHIP: Record<string, string> = {
  pending: "bg-blue-50 border-blue-200 text-blue-700",
  overdue: "bg-red-50 border-red-200 text-red-700",
  snoozed: "bg-slate-50 border-slate-200 text-slate-500",
  done:    "bg-emerald-50 border-emerald-200 text-emerald-700",
};

const URGENCY_CHIP: Record<string, string> = {
  critical: "bg-red-50 text-red-700",
  high:     "bg-amber-50 text-amber-700",
  normal:   "bg-blue-50 text-blue-700",
  low:      "bg-slate-50 text-slate-500",
};

function formatDueDate(dateStr: string, status: string) {
  const d   = new Date(dateStr);
  const days = Math.ceil((d.getTime() - Date.now()) / 86_400_000);
  if (status === "overdue") return `Overdue · ${Math.abs(days)}d ago`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days < 0)  return `${Math.abs(days)}d overdue`;
  return d.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
}

export function DeadlineManager({
  caseId,
  initialDeadlines,
}: {
  caseId: string;
  initialDeadlines: DeadlineSummary[];
}) {
  const router = useRouter();
  const [deadlines, setDeadlines] = useState(initialDeadlines);
  const [showForm, setShowForm]   = useState(false);
  const [updating, setUpdating]   = useState<string | null>(null);

  // New deadline form state
  const [title, setTitle]         = useState("");
  const [dueDate, setDueDate]     = useState("");
  const [urgency, setUrgency]     = useState("normal");
  const [ruleAnchor, setRuleAnchor] = useState("");
  const [saving, setSaving]       = useState(false);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      await fetch(`/api/lawyer/deadlines/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setDeadlines((prev) =>
        prev.map((d) => d.id === id ? { ...d, status } : d)
      );
    } finally {
      setUpdating(null);
    }
  }

  async function addDeadline() {
    if (!title.trim() || !dueDate) return;
    setSaving(true);
    try {
      const res = await fetch("/api/lawyer/deadlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          case_id: caseId,
          title: title.trim(),
          due_date: dueDate,
          urgency,
          rule_anchor: ruleAnchor.trim() || undefined,
        }),
      });
      const { id } = await res.json() as { id: string };
      setDeadlines((prev) => [
        ...prev,
        {
          id,
          title: title.trim(),
          rule_anchor: ruleAnchor.trim() || null,
          due_date: dueDate,
          urgency,
          status: "pending",
          notes: null,
        },
      ]);
      setTitle(""); setDueDate(""); setUrgency("normal"); setRuleAnchor("");
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

  const active = deadlines.filter((d) => d.status !== "done");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Deadlines</p>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="border-b border-slate-100 bg-indigo-50/40 px-5 py-4 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Deadline title *"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Due date *</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {URGENCY_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <input
            value={ruleAnchor}
            onChange={(e) => setRuleAnchor(e.target.value)}
            placeholder="Rule anchor (e.g. r.7.01 Small Claims Rules)"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="flex gap-2">
            <button
              onClick={addDeadline}
              disabled={saving || !title.trim() || !dueDate}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Save Deadline
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Deadline list */}
      <ul className="divide-y divide-slate-50">
        {active.length === 0 ? (
          <li className="px-5 py-4 text-sm text-slate-400 text-center">No active deadlines</li>
        ) : (
          active.map((d) => (
            <li key={d.id} className="px-5 py-3.5">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{d.title}</p>
                  {d.rule_anchor && (
                    <p className="text-[10px] text-slate-400 mt-0.5">{d.rule_anchor}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_CHIP[d.status] ?? STATUS_CHIP.pending}`}>
                      {formatDueDate(d.due_date, d.status)}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${URGENCY_CHIP[d.urgency] ?? ""}`}>
                      {d.urgency}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => updateStatus(d.id, "done")}
                    disabled={updating === d.id}
                    title="Mark done"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                  >
                    {updating === d.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => updateStatus(d.id, "snoozed")}
                    disabled={updating === d.id}
                    title="Snooze"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
