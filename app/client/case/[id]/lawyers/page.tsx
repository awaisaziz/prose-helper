import { notFound } from "next/navigation";
import { query } from "@/lib/db/index";
import { getLawyerProfiles } from "@/lib/db/lawyers";
import { getConnectionsForCase } from "@/lib/db/connections";
import { StepIndicator } from "@/components/client/step-indicator";
import { LawyerCard } from "@/components/client/lawyer-card";
import { Disclaimer } from "@/components/disclaimer";

export const dynamic = "force-dynamic";

// Demo client id — in a real app this comes from session
const DEMO_CLIENT_ID = "00000000-0000-0000-0000-0000000000a1";

export default async function LawyersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Verify case exists
  const caseRows = await query<{ id: string; dispute_summary: string }>(
    `select id, dispute_summary from cases where id = $1`,
    [id]
  );
  if (!caseRows.length) notFound();

  const [lawyers, connections] = await Promise.all([
    getLawyerProfiles(),
    getConnectionsForCase(id),
  ]);

  const connectedIds = new Set(connections.map((c) => c.lawyer_id));

  return (
    <>
      <StepIndicator current={5} />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
            Step 5 of 5 — Connect with a Lawyer
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Choose a lawyer to review your claim</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-xl">
            Connect for <strong>unbundled review only</strong> — the lawyer checks your citations,
            confirms the law is correctly applied, and signs off on the draft. Not full representation.
          </p>
        </div>

        {/* Case context strip */}
        <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
            Your Claim
          </p>
          <p className="text-sm text-slate-700 line-clamp-2">{caseRows[0].dispute_summary}</p>
        </div>

        {lawyers.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            No lawyers available in the directory right now.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lawyers.map((lawyer) => (
              <LawyerCard
                key={lawyer.lawyer_id}
                lawyer={lawyer}
                caseId={id}
                clientId={DEMO_CLIENT_ID}
                initialConnected={connectedIds.has(lawyer.lawyer_id)}
              />
            ))}
          </div>
        )}

        <div className="mt-10 max-w-xl">
          <Disclaimer />
        </div>
      </main>
    </>
  );
}
