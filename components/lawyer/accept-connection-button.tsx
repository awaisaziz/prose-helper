"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserCheck, UserX } from "lucide-react";

export function AcceptConnectionButton({
  caseId,
  initialStatus,
}: {
  caseId: string;
  initialStatus: "requested" | "accepted" | "declined";
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState<"accept" | "decline" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(action: "accept" | "decline") {
    setLoading(action);
    setError(null);
    try {
      const res = await fetch(`/api/lawyer/cases/${caseId}/connection`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const j = await res.json() as { error?: string };
        throw new Error(j.error ?? "Failed");
      }
      setStatus(action === "accept" ? "accepted" : "declined");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(null);
    }
  }

  if (status === "accepted") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <UserCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">Connection accepted</p>
          <p className="text-xs text-emerald-600">Client has been notified you are reviewing their case.</p>
        </div>
      </div>
    );
  }

  if (status === "declined") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <UserX className="h-4 w-4 text-slate-400 shrink-0" />
        <p className="text-sm text-slate-500">Connection declined.</p>
      </div>
    );
  }

  // status === "requested"
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 overflow-hidden">
      <div className="border-b border-amber-200 bg-amber-100 px-5 py-3">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
          ⚡ Pending Connection Request
        </p>
      </div>
      <div className="p-5 space-y-3">
        <p className="text-sm text-amber-900">
          This client is requesting you as their lawyer. Accept to begin your review and notify them.
        </p>
        {error && (
          <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => act("accept")}
            disabled={loading !== null}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {loading === "accept" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
            Accept
          </button>
          <button
            onClick={() => act("decline")}
            disabled={loading !== null}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {loading === "decline" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
