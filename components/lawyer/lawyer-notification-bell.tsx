"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Bell, X, MessageSquare, FileText, RefreshCw, UserPlus } from "lucide-react";

interface LawyerNotif {
  id: string;
  case_id: string | null;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  new_submission:    <FileText  className="h-3.5 w-3.5 text-sky-500"    />,
  client_resubmitted:<RefreshCw className="h-3.5 w-3.5 text-orange-500" />,
  client_message:    <MessageSquare className="h-3.5 w-3.5 text-indigo-500" />,
  connection_request:<UserPlus  className="h-3.5 w-3.5 text-emerald-500" />,
};

const TYPE_COLOR: Record<string, string> = {
  new_submission:     "border-sky-200 bg-sky-50",
  client_resubmitted: "border-orange-200 bg-orange-50",
  client_message:     "border-indigo-200 bg-indigo-50",
  connection_request: "border-emerald-200 bg-emerald-50",
};

function timeAgo(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60)  return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

const POLL_MS = 10_000;

export function LawyerNotificationBell() {
  const [open, setOpen]         = useState(false);
  const [notifs, setNotifs]     = useState<LawyerNotif[]>([]);
  const [unread, setUnread]     = useState(0);
  const panelRef                = useRef<HTMLDivElement>(null);

  const fetchNotifs = useCallback(async () => {
    try {
      const res = await fetch("/api/lawyer/notifications");
      if (!res.ok) return;
      const data = await res.json() as { notifications: LawyerNotif[]; unread: number };
      setNotifs(data.notifications);
      setUnread(data.unread);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchNotifs(); }, [fetchNotifs]);
  useEffect(() => {
    const id = setInterval(fetchNotifs, POLL_MS);
    return () => clearInterval(id);
  }, [fetchNotifs]);

  // Close panel on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleOpen() {
    setOpen((v) => !v);
    if (!open && unread > 0) {
      // Mark as read on open
      await fetch("/api/lawyer/notifications", { method: "PATCH" });
      setUnread(0);
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }

  return (
    <div ref={panelRef} className="relative">
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white leading-none ring-2 ring-slate-900">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute bottom-12 left-0 z-50 w-80 rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Notifications
            </p>
            <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-700/50">
            {notifs.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-slate-500">
                No notifications yet.
              </p>
            ) : (
              notifs.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 transition-colors hover:bg-slate-700/40 ${!n.read ? "bg-slate-700/20" : ""}`}
                >
                  {n.case_id ? (
                    <Link href={`/lawyer/case/${n.case_id}`} onClick={() => setOpen(false)} className="block">
                      <NotifContent notif={n} />
                    </Link>
                  ) : (
                    <NotifContent notif={n} />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifs.length > 0 && (
            <div className="border-t border-slate-700 px-4 py-2.5">
              <Link
                href="/lawyer/triage"
                onClick={() => setOpen(false)}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View triage inbox →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NotifContent({ notif }: { notif: LawyerNotif }) {
  const icon = TYPE_ICON[notif.type] ?? <Bell className="h-3.5 w-3.5 text-slate-400" />;
  return (
    <div className="flex items-start gap-2.5">
      <span className={`mt-0.5 shrink-0 flex h-6 w-6 items-center justify-center rounded-full border ${TYPE_COLOR[notif.type] ?? "border-slate-200 bg-slate-50"}`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-200 leading-snug">{notif.message}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">{timeAgo(notif.created_at)}</p>
      </div>
      {!notif.read && (
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
      )}
    </div>
  );
}
