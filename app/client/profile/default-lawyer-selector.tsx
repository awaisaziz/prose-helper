"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Check, Loader2 } from "lucide-react";
import type { LawyerProfileRow } from "@/lib/db/lawyers";

export function DefaultLawyerSelector({
  clientId,
  lawyers,
  currentDefaultId,
}: {
  clientId: string;
  lawyers: LawyerProfileRow[];
  currentDefaultId: string | null;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(currentDefaultId);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  async function save(lawyerId: string | null) {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: clientId, default_lawyer_id: lawyerId }),
      });
      setSelectedId(lawyerId);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  const currentLawyer = lawyers.find((l) => l.lawyer_id === selectedId);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-blue-500 fill-blue-100" />
            <h2 className="text-sm font-bold text-slate-800">Default Lawyer</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            When you submit a claim, it&apos;s automatically sent to this lawyer.
          </p>
        </div>
        {saved && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
        {saving && (
          <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
        )}
      </div>

      {currentLawyer && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
          {currentLawyer.image_url ? (
            <div className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden border border-blue-100">
              <Image src={currentLawyer.image_url} alt={currentLawyer.full_name} fill className="object-cover" unoptimized />
            </div>
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-800">
              {currentLawyer.full_name.charAt(0)}
            </span>
          )}
          <div>
            <p className="text-sm font-semibold text-blue-900">{currentLawyer.full_name}</p>
            {currentLawyer.title && <p className="text-xs text-blue-600">{currentLawyer.title}</p>}
          </div>
          <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
            Default
          </span>
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-3">
        {lawyers.map((l) => {
          const isSelected = l.lawyer_id === selectedId;
          return (
            <button
              key={l.lawyer_id}
              onClick={() => save(isSelected ? null : l.lawyer_id)}
              disabled={saving}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all
                ${isSelected
                  ? "border-blue-300 bg-blue-50 ring-1 ring-blue-200"
                  : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/50"}`}
            >
              {l.image_url ? (
                <div className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden border border-slate-100">
                  <Image src={l.image_url} alt={l.full_name} fill className="object-cover" unoptimized />
                </div>
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                  {l.full_name.charAt(0)}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold truncate ${isSelected ? "text-blue-800" : "text-slate-800"}`}>
                  {l.full_name}
                </p>
                {l.hourly_rate && (
                  <p className="text-[10px] text-slate-400">${l.hourly_rate}/hr</p>
                )}
              </div>
              {isSelected && (
                <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {selectedId && (
        <button
          onClick={() => save(null)}
          disabled={saving}
          className="mt-3 text-xs text-slate-400 hover:text-red-500 transition-colors"
        >
          Clear default
        </button>
      )}
    </div>
  );
}
