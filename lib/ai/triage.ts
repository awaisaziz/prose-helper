import "server-only";
import { openai, CHAT_MODEL } from "./openai";

export interface TriageResult {
  in_scope: boolean;
  matter_type: string;          // e.g. "contractor_deposit" | "unpaid_debt" | "family_law"
  matter_label: string;         // human-readable, e.g. "Contractor Deposit Dispute"
  reason: string;               // plain-English explanation
  governing_statute?: string;   // if out-of-scope, the correct forum's statute
  governing_statute_url?: string;
  jurisdiction: string;         // "Ontario Small Claims" | "Superior Court" | etc.
}

const MATTER_TYPES = [
  "contractor_deposit",
  "unpaid_debt",
  "unpaid_invoice",
  "defective_goods",
  "property_damage",
  "unpaid_wages",
  "consumer_protection",
  "landlord_tenant",
  "family_law",
  "criminal",
  "immigration",
  "personal_injury",
  "other",
] as const;

const SYSTEM = `You are a triage assistant for Ontario Small Claims Court.
Your job is to decide whether a dispute falls within the court's jurisdiction and, if so, classify it.

Ontario Small Claims Court hears:
- Money/debt claims ≤ $50,000 CAD
- Personal property recovery ≤ $50,000 CAD
- Breach of contract, unpaid invoices, contractor deposits, defective goods, property damage, some employment wage claims

It does NOT hear:
- Claims > $50,000 (→ Superior Court of Justice)
- Family law (→ Family Court / Superior Court, Family Law Act)
- Criminal matters (→ criminal courts)
- Immigration (→ Immigration and Refugee Board)
- Land title / real-property ownership disputes (→ Superior Court)
- Human rights / discrimination (→ Human Rights Tribunal of Ontario)
- Landlord-tenant possession disputes (→ Landlord and Tenant Board)
- Personal injury / negligence (→ Superior Court)

Respond ONLY with valid JSON matching this exact schema (no extra keys, no markdown):
{
  "in_scope": boolean,
  "matter_type": one of ${JSON.stringify(MATTER_TYPES)},
  "matter_label": string,
  "reason": string (1-2 sentences, plain English, no jargon),
  "governing_statute": string | null,
  "governing_statute_url": string | null,
  "jurisdiction": string
}`;

export async function triageCase(
  dispute_summary: string,
  claim_amount: number
): Promise<TriageResult> {
  const userMsg = `Dispute: "${dispute_summary}"\nClaim amount: $${claim_amount.toLocaleString()} CAD`;

  const res = await openai.chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user",   content: userMsg },
    ],
  });

  const raw = res.choices[0].message.content ?? "{}";
  const parsed = JSON.parse(raw) as TriageResult;
  return parsed;
}
