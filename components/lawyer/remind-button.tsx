"use client";

import { useState } from "react";
import { Bell, Loader2, Check } from "lucide-react";

export function RemindButton({ caseId }: { caseId: string }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [message, setMessage] = useState("");
  const [showInput, setShowInput] = useState(false);

  async function send() {
    setSending(true);
    try {
      await fetch(`/api/lawyer/remind/${caseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() || undefined }),
      });
      setSent(true);
      setShowInput(false);
      setTimeout(() => setSent(false), 3000);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
        <Check className="w-4 h-4" />
        Reminder sent to client
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {showInput && (
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          placeholder="Custom message (optional — leave blank for auto-generated)"
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
      )}
      <div className="flex gap-2">
        <button
          onClick={() => (showInput ? send() : setShowInput(true))}
          disabled={sending}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors disabled:opacity-50"
        >
          {sending
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
            : <><Bell className="w-4 h-4" /> Send Client Reminder</>
          }
        </button>
        {showInput && (
          <button
            onClick={() => setShowInput(false)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
