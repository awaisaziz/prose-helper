import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";
import { getAllCases, type CaseRow } from "@/lib/db/cases";

export const dynamic = "force-dynamic";

export default async function LawyerDashboard() {
  let cases: CaseRow[] = [];
  let dbError: string | null = null;
  try {
    cases = await getAllCases();
  } catch {
    dbError = "Database not reachable. Run `npm run db:start` then reload.";
  }

  const queue = cases.filter((c) =>
    ["submitted", "in_review", "changes_requested"].includes(c.status)
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Home
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Lawyer Console</h1>
      <p className="text-sm text-gray-600">
        Review queue and active matters. Deadline Guardian arrives in Phase 6.
      </p>

      {dbError ? (
        <p className="mt-6 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {dbError}
        </p>
      ) : (
        <>
          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Review Queue ({queue.length})
          </h2>
          <ul className="mt-3 space-y-3">
            {queue.map((c) => (
              <li key={c.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{c.client_name}</span>
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-xs uppercase tracking-wide text-amber-800">
                    {c.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{c.dispute_summary}</p>
              </li>
            ))}
            {queue.length === 0 && (
              <li className="text-sm text-gray-500">Nothing awaiting review.</li>
            )}
          </ul>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-gray-500">
            All Matters ({cases.length})
          </h2>
          <ul className="mt-3 space-y-2">
            {cases.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded border border-gray-100 px-3 py-2 text-sm"
              >
                <span>{c.client_name}</span>
                <span className="text-gray-500">{c.status}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-8">
        <Disclaimer />
      </div>
    </main>
  );
}
