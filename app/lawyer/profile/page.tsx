"use client";
import { useState, useEffect } from "react";

const TRIAGE_OPTIONS = [
  { key: "overdue_deadline",    label: "Overdue Deadlines",      desc: "Deadlines already past due" },
  { key: "new_submission",      label: "New Client Submissions",  desc: "Forms newly submitted for review" },
  { key: "resubmission",        label: "Client Resubmissions",    desc: "Edits after changes requested" },
  { key: "imminent_deadline",   label: "Imminent Deadlines",      desc: "Deadlines within 3 days" },
  { key: "connection_request",  label: "Connection Requests",     desc: "Clients requesting to connect" },
];

interface Profile {
  full_name:    string;
  email:        string;
  title:        string;
  bio:          string;
  specialties:  string[];
  hourly_rate:  number | null;
  years_exp:    number | null;
  phone:        string;
  booking_url:  string;
  triage_prefs: string[];
}

const EMPTY: Profile = {
  full_name: "", email: "", title: "", bio: "", specialties: [],
  hourly_rate: null, years_exp: null, phone: "", booking_url: "",
  triage_prefs: TRIAGE_OPTIONS.map((o) => o.key),
};

export default function LawyerProfilePage() {
  const [profile, setProfile] = useState<Profile>(EMPTY);
  const [specialtiesInput, setSpecialtiesInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/lawyer/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile({
          full_name:    data.full_name    ?? "",
          email:        data.email        ?? "",
          title:        data.title        ?? "",
          bio:          data.bio          ?? "",
          specialties:  data.specialties  ?? [],
          hourly_rate:  data.hourly_rate  ?? null,
          years_exp:    data.years_exp    ?? null,
          phone:        data.phone        ?? "",
          booking_url:  data.booking_url  ?? "",
          triage_prefs: data.triage_prefs?.length ? data.triage_prefs : TRIAGE_OPTIONS.map((o) => o.key),
        });
        setSpecialtiesInput((data.specialties ?? []).join(", "));
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    const specialties = specialtiesInput.split(",").map((s) => s.trim()).filter(Boolean);
    try {
      await fetch("/api/lawyer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, specialties }),
      });
      setProfile((p) => ({ ...p, specialties }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  function toggleTriagePref(key: string) {
    setProfile((p) => ({
      ...p,
      triage_prefs: p.triage_prefs.includes(key)
        ? p.triage_prefs.filter((k) => k !== key)
        : [...p.triage_prefs, key],
    }));
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-8 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-4 bg-slate-100 rounded w-72" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-8 py-10">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
          Lawyer Console
        </p>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Your public profile shown to clients, plus triage inbox preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Identity */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-5">Identity</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name</label>
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={profile.full_name}
                onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Professional Title</label>
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="e.g. LL.B., Civil Litigator"
                value={profile.title}
                onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Years of Experience</label>
              <input
                type="number"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={profile.years_exp ?? ""}
                onChange={(e) => setProfile((p) => ({ ...p, years_exp: e.target.value ? Number(e.target.value) : null }))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Hourly Rate (CAD)</label>
              <input
                type="number"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={profile.hourly_rate ?? ""}
                onChange={(e) => setProfile((p) => ({ ...p, hourly_rate: e.target.value ? Number(e.target.value) : null }))}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Bio</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              value={profile.bio}
              onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Specialties <span className="font-normal text-slate-400">(comma-separated)</span>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Small Claims, Contracts, Consumer Protection"
              value={specialtiesInput}
              onChange={(e) => setSpecialtiesInput(e.target.value)}
            />
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Contact Info</h2>
          <p className="text-xs text-slate-500 mb-5">Shown to clients on your profile card so they can reach you.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Phone</label>
              <input
                type="tel"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="+1 (416) 555-0100"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Booking / Calendar URL <span className="font-normal text-slate-400">(Calendly, Cal.com, etc.)</span>
              </label>
              <input
                type="url"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="https://cal.com/your-name"
                value={profile.booking_url}
                onChange={(e) => setProfile((p) => ({ ...p, booking_url: e.target.value }))}
              />
            </div>
          </div>
        </section>

        {/* Triage preferences */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Triage Inbox Preferences</h2>
          <p className="text-xs text-slate-500 mb-5">
            Choose which item types surface in your Triage Inbox. All checked items appear grouped by priority.
          </p>
          <div className="space-y-3">
            {TRIAGE_OPTIONS.map((opt) => {
              const enabled = profile.triage_prefs.includes(opt.key);
              return (
                <label key={opt.key} className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-0.5">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => toggleTriagePref(opt.key)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${enabled ? "text-slate-900" : "text-slate-400"}`}>{opt.label}</p>
                    <p className="text-xs text-slate-400">{opt.desc}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        {/* Save */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-wait"
          >
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </div>
      </div>
    </main>
  );
}
