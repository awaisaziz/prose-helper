"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export function EditableName({
  clientId,
  initialName,
}: {
  clientId: string;
  initialName: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName]       = useState(initialName);
  const [saving, setSaving]   = useState(false);
  const inputRef              = useRef<HTMLInputElement>(null);

  function startEdit() {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function save() {
    if (!name.trim() || name.trim() === initialName) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: clientId, full_name: name.trim() }),
      });
      router.refresh();
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter")  save();
    if (e.key === "Escape") { setName(initialName); setEditing(false); }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={save}
          className="text-xl font-bold text-slate-900 border-b-2 border-blue-500 bg-transparent outline-none w-full max-w-xs"
          disabled={saving}
        />
        {saving && (
          <svg className="h-4 w-4 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group/name">
      <h1 className="text-xl font-bold text-slate-900">{name}</h1>
      <button
        onClick={startEdit}
        className="opacity-0 group-hover/name:opacity-100 transition-opacity rounded p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        title="Edit name"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
    </div>
  );
}
