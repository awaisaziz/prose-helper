"use client";
import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import type { LawyerProfileRow } from "@/lib/db/lawyers";

const DEMO_CLIENT_ID = "00000000-0000-0000-0000-0000000000a1";

export function LawyerCard({
  lawyer,
  caseId,
  clientId,
  initialConnected = false,
  isDefault = false,
}: {
  lawyer: LawyerProfileRow;
  caseId: string;
  clientId: string;
  initialConnected?: boolean;
  isDefault?: boolean;
}) {
  const [connected, setConnected]   = useState(initialConnected);
  const [loading, setLoading]       = useState(false);
  const [defaultSet, setDefaultSet] = useState(isDefault);
  const [settingDefault, setSettingDefault] = useState(false);

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

  async function handleSetDefault() {
    setSettingDefault(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: DEMO_CLIENT_ID,
          default_lawyer_id: defaultSet ? null : lawyer.lawyer_id,
        }),
      });
      setDefaultSet((v) => !v);
    } catch {
      // fail silently
    } finally {
      setSettingDefault(false);
    }
  }

  return (
    <div className={`flex flex-col rounded-2xl border bg-white p-6 transition-shadow hover:shadow-md
      ${defaultSet ? "border-blue-300 ring-1 ring-blue-200" : "border-slate-200"}`}>

      {/* Default badge */}
      {defaultSet && (
        <div className="flex items-center gap-1 mb-3 text-[10px] font-bold uppercase tracking-wider text-blue-700">
          <Star className="w-3 h-3 fill-blue-500 text-blue-500" />
          Default Lawyer
        </div>
      )}

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

      {/* Set as default */}
      <button
        onClick={handleSetDefault}
        disabled={settingDefault}
        className={`mt-2 flex items-center justify-center gap-1.5 w-full rounded-xl border px-4 py-2 text-xs font-medium transition-colors
          ${defaultSet
            ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
            : "border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-600"}`}
      >
        <Star className={`w-3 h-3 ${defaultSet ? "fill-blue-500 text-blue-500" : "text-slate-400"}`} />
        {settingDefault
          ? "Updating…"
          : defaultSet
          ? "Remove as default"
          : "Set as default lawyer"}
      </button>

      {connected && (
        <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 space-y-2">
          <p className="text-xs font-semibold text-emerald-800">
            {lawyer.full_name.split(" ")[0]} will review your draft and be in touch.
          </p>
          <div className="space-y-1.5">
            {lawyer.email && (
              <a
                href={`mailto:${lawyer.email}`}
                className="flex items-center gap-2 text-xs text-slate-600 hover:text-indigo-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {lawyer.email}
              </a>
            )}
            {(lawyer as { phone?: string | null }).phone && (
              <a
                href={`tel:${(lawyer as { phone?: string | null }).phone}`}
                className="flex items-center gap-2 text-xs text-slate-600 hover:text-indigo-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {(lawyer as { phone?: string | null }).phone}
              </a>
            )}
            {(lawyer as { booking_url?: string | null }).booking_url && (
              <a
                href={(lawyer as { booking_url?: string | null }).booking_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book a consultation →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
