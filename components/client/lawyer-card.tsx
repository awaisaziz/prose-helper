"use client";
import { useState } from "react";
import Image from "next/image";
import type { LawyerProfileRow } from "@/lib/db/lawyers";

export function LawyerCard({
  lawyer,
  caseId,
  clientId,
  initialConnected = false,
}: {
  lawyer: LawyerProfileRow;
  caseId: string;
  clientId: string;
  initialConnected?: boolean;
}) {
  const [connected, setConnected] = useState(initialConnected);
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    try {
      await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          case_id: caseId,
          client_id: clientId,
          lawyer_id: lawyer.lawyer_id,
        }),
      });
      setConnected(true);
    } catch {
      // fail silently for demo
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md">
      {/* Avatar + name */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-slate-100 shrink-0 bg-slate-100">
          {lawyer.image_url ? (
            <Image
              src={lawyer.image_url}
              alt={lawyer.full_name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xl font-bold text-slate-400">
              {lawyer.full_name.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <p className="font-bold text-slate-900">{lawyer.full_name}</p>
          {lawyer.title && (
            <p className="text-xs text-slate-500 mt-0.5">{lawyer.title}</p>
          )}
        </div>
      </div>

      {/* Specialties */}
      {lawyer.specialties?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {lawyer.specialties.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Bio */}
      {lawyer.bio && (
        <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">{lawyer.bio}</p>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-5">
        {lawyer.years_exp != null && (
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {lawyer.years_exp} yrs experience
          </span>
        )}
        {lawyer.hourly_rate != null && (
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            from ${lawyer.hourly_rate}/hr
          </span>
        )}
      </div>

      {/* Connect button */}
      {connected ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Request Sent
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95 disabled:opacity-60 disabled:cursor-wait"
        >
          {loading ? "Sending…" : "Connect →"}
        </button>
      )}
      {connected && (
        <p className="mt-2 text-center text-xs text-slate-500">
          {lawyer.full_name.split(" ")[0]} will review your draft and be in touch.
        </p>
      )}
    </div>
  );
}
