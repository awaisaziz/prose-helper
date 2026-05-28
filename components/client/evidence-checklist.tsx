"use client";
import { useState } from "react";
import type { EvidenceItem } from "@/lib/ai/form7a";

// Group evidence items by element
function groupByElement(items: EvidenceItem[]): Record<string, EvidenceItem[]> {
  return items.reduce<Record<string, EvidenceItem[]>>((acc, item) => {
    const key = item.element;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export function EvidenceChecklist({ items }: { items: EvidenceItem[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const groups = groupByElement(items);

  const toggle = (idx: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });

  let globalIdx = 0;

  return (
    <div className="space-y-5">
      {Object.entries(groups).map(([element, groupItems]) => (
        <div key={element}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            {element}
          </p>
          <div className="space-y-2">
            {groupItems.map((item) => {
              const idx = globalIdx++;
              const done = checked.has(idx);
              return (
                <label
                  key={idx}
                  className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors
                    ${done ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
                >
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggle(idx)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 accent-blue-600 shrink-0"
                  />
                  <div>
                    <p className={`text-sm font-medium ${done ? "text-emerald-700 line-through" : "text-slate-800"}`}>
                      {item.document}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.guidance}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* Progress */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span>Evidence gathered</span>
          <span className="font-semibold">{checked.size} / {items.length}</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${items.length ? (checked.size / items.length) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
