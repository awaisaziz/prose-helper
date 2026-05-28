"use client";
import { useState } from "react";
import type { LegalFramework, LegalCitation } from "@/lib/ai/assess";
import { LegalSourceLink } from "./legal-source-link";

const SECTIONS: {
  key: keyof LegalFramework;
  label: string;
  accent: string;
  borderColor: string;
  bgColor: string;
}[] = [
  { key: "statutes",    label: "Statutes",            accent: "text-blue-700",   borderColor: "border-blue-400",   bgColor: "bg-blue-50" },
  { key: "rules",       label: "Rules of Procedure",  accent: "text-indigo-700", borderColor: "border-indigo-400", bgColor: "bg-indigo-50" },
  { key: "regulations", label: "Regulations",         accent: "text-violet-700", borderColor: "border-violet-400", bgColor: "bg-violet-50" },
  { key: "precedents",  label: "Precedents",          accent: "text-slate-700",  borderColor: "border-slate-400",  bgColor: "bg-slate-50" },
];

function CitationRow({ c, accent, borderColor }: { c: LegalCitation; accent: string; borderColor: string }) {
  return (
    <div className={`border-l-2 pl-3 py-1 ${borderColor}`}>
      <LegalSourceLink citation={c.citation} url={c.url} className={`text-sm ${accent}`} />
      {c.title && <p className="text-xs text-slate-500 mt-0.5">{c.title}</p>}
      <p className="mt-1 text-sm text-slate-700 leading-relaxed">{c.relevance}</p>
    </div>
  );
}

export function LegalFrameworkPanel({ framework }: { framework: LegalFramework }) {
  const [open, setOpen] = useState<Set<string>>(new Set(["statutes", "rules"]));

  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  return (
    <div className="space-y-2">
      {SECTIONS.map((s) => {
        const items: LegalCitation[] = framework[s.key] ?? [];
        const isOpen = open.has(s.key);
        return (
          <div key={s.key} className="rounded-xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => toggle(s.key)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left ${s.bgColor} hover:brightness-95 transition-all`}
            >
              <span className={`text-sm font-semibold ${s.accent}`}>{s.label}</span>
              <span className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{items.length} source{items.length !== 1 ? "s" : ""}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="px-4 py-3 space-y-3 bg-white">
                {items.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No sources identified for this layer.</p>
                ) : (
                  items.map((c, i) => (
                    <CitationRow key={i} c={c} accent={s.accent} borderColor={s.borderColor} />
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
