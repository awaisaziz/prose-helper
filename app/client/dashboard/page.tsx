import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";
import { getAllCases, type CaseRow } from "@/lib/db/cases";

export const dynamic = "force-dynamic";

export default async function ClientDashboard() {
  let cases: CaseRow[] = [];
  let dbError: string | null = null;
  try {
    cases = await getAllCases();
  } catch {
    dbError = "Database not reachable. Run `npm run db:start` then reload.";
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Home
          </Link>
          <h1 className="mt-2 text-2xl font-bold">Client Dashboard</h1>
          <p className="text-sm text-gray-600">Your Small Claims matters.</p>
        </div>
      </div>

      {dbError ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {dbError}
        </p>
      ) : (
        <ul className="space-y-3">
          {cases.map((c) => (
            <li key={c.id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{c.client_name}</span>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs uppercase tracking-wide text-gray-700">
                  {c.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{c.dispute_summary}</p>
              {c.claim_amount && (
                <p className="mt-1 text-sm font-semibold">
                  Claim: ${Number(c.claim_amount).toLocaleString()}
                </p>
              )}
            </li>
          ))}
          {cases.length === 0 && (
            <li className="text-sm text-gray-500">No cases yet.</li>
          )}
        </ul>
      )}

      <div className="mt-8">
        <Disclaimer />
      </div>
    </main>
  );
}
