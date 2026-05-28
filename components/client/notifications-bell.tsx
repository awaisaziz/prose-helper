"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, X, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  case_id: string | null;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json() as { notifications: Notification[]; unread: number };
      setNotifications(data.notifications);
      setUnread(data.unread);
    } catch {
      // silent
    }
  }

  async function markAllRead() {
    setLoading(true);
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnread(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void fetchNotifications(); }, []);
  useEffect(() => { if (open) void fetchNotifications(); }, [open]);

  // close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const typeIcon: Record<string, string> = {
    lawyer_accepted: "✅",
    info: "ℹ️",
    changes_requested: "✏️",
    approved: "🎉",
  };

  function relativeTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <span className="text-sm font-semibold text-slate-800">Notifications</span>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  onClick={markAllRead}
                  disabled={loading}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <ul className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-slate-400">
                No notifications yet
              </li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "px-4 py-3 flex gap-3 text-sm transition-colors",
                    !n.read ? "bg-blue-50/60" : "bg-white hover:bg-slate-50"
                  )}
                >
                  <span className="text-base mt-0.5 shrink-0">
                    {typeIcon[n.type] ?? "🔔"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-slate-700 leading-snug", !n.read && "font-medium")}>
                      {n.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{relativeTime(n.created_at)}</p>
                  </div>
                  {!n.read && (
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                </li>
              ))
            )}
          </ul>

          {notifications.length > 0 && (
            <div className="border-t border-slate-100 px-4 py-2.5 text-center">
              <span className="text-xs text-slate-400">Showing last {notifications.length} notifications</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
