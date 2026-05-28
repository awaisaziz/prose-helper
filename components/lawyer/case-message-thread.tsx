"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, Send, MessageSquare } from "lucide-react";
import type { MessageRow } from "@/app/api/cases/[id]/messages/route";

const POLL_MS = 8000;

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-CA", {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function Bubble({ msg }: { msg: MessageRow }) {
  const isMine = msg.sender === "lawyer";
  return (
    <div className={`flex flex-col gap-0.5 ${isMine ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isMine
            ? "rounded-br-sm bg-indigo-600 text-white"
            : "rounded-bl-sm bg-slate-100 text-slate-800"
        }`}
      >
        {msg.body}
      </div>
      <span className="text-[10px] text-slate-400 px-1">
        {isMine ? "You" : msg.sender_name} · {formatTime(msg.created_at)}
        {isMine && (
          <span className="ml-1">
            {msg.read_by_client ? " ✓✓" : " ✓"}
          </span>
        )}
      </span>
    </div>
  );
}

export function CaseMessageThread({ caseId }: { caseId: string }) {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchMessages = useCallback(async (markRead = false) => {
    try {
      const res = await fetch(`/api/cases/${caseId}/messages`);
      if (!res.ok) return;
      const data = await res.json() as { messages: MessageRow[] };
      setMessages(data.messages);
      if (markRead) {
        // Mark client messages as read by lawyer
        fetch(`/api/cases/${caseId}/messages/read`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ as: "lawyer" }),
        }).catch(() => null);
      }
    } catch {
      // silent — poll will retry
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  // Initial load + mark read
  useEffect(() => {
    fetchMessages(true);
  }, [fetchMessages]);

  // Poll for new messages
  useEffect(() => {
    const id = setInterval(() => fetchMessages(true), POLL_MS);
    return () => clearInterval(id);
  }, [fetchMessages]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!body.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/cases/${caseId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim(), sender: "lawyer" }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to send");
      setBody("");
      textareaRef.current?.focus();
      await fetchMessages(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Send failed");
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  }

  const unreadFromClient = messages.filter(
    (m) => m.sender === "client" && !m.read_by_lawyer
  ).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-3.5 w-3.5 text-indigo-500" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Case Messages
          </p>
        </div>
        {unreadFromClient > 0 && (
          <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
            {unreadFromClient} new
          </span>
        )}
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-h-80 min-h-[120px]">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-6">
            No messages yet. Send an update to the client below.
          </p>
        ) : (
          messages.map((msg) => <Bubble key={msg.id} msg={msg} />)
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-slate-100 bg-slate-50 p-3">
        {error && (
          <p className="mb-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
            {error}
          </p>
        )}
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Send an update to the client… (Ctrl+Enter to send)"
            className="flex-1 resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300"
          />
          <button
            onClick={handleSend}
            disabled={!body.trim() || sending}
            className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sending
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Send className="h-4 w-4" />
            }
          </button>
        </div>
        <p className="mt-1.5 text-[10px] text-slate-400">
          Messages are visible to the client in their case portal.
        </p>
      </div>
    </div>
  );
}
