import "server-only";
import { openai, CHAT_MODEL } from "./openai";
import type { AssessmentResult } from "./assess";

export interface CitedText {
  text: string;
  citation?: string;
  source_url?: string;
}

export interface Form7AFields {
  plaintiff_name:         string;
  defendant_name:         string;
  defendant_address:      string;
  court_location:         string;
  amount_claimed:         number;
  reasons_for_claim:      CitedText[];   // paragraphs, each may have a citation
  relief_sought:          string[];      // list of relief items
}

export interface EvidenceItem {
  element:     string;   // legal element it supports
  document:    string;   // what to gather
  guidance:    string;   // one-line how-to
}

export interface Form7AResult {
  form:     Form7AFields;
  evidence: EvidenceItem[];
}

const SYSTEM = `You are a legal drafting assistant for Ontario Small Claims Court.
Using the case facts and legal assessment provided, draft:
1. A completed Plaintiff's Claim (Form 7A) with proper legal language, citing specific statutory provisions.
2. An evidence checklist grouped by legal element the client must prove.

Rules:
- Use clear, professional legal language appropriate for Small Claims Court.
- Each paragraph in reasons_for_claim should cite the specific statute/rule that applies.
- The evidence checklist must directly map to the elements_to_prove from the assessment.
- Defendant address: use "[Defendant's address — to be inserted]" as a placeholder.
- Court location: "Toronto Small Claims Court" (demo default).
- Respond ONLY with valid JSON. No markdown.

JSON schema:
{
  "form": {
    "plaintiff_name":    string,
    "defendant_name":    string,
    "defendant_address": string,
    "court_location":    string,
    "amount_claimed":    number,
    "reasons_for_claim": [
      { "text": string, "citation": string | null, "source_url": string | null }
    ],
    "relief_sought": [string, ...]
  },
  "evidence": [
    { "element": string, "document": string, "guidance": string }
  ]
}`;

export async function draftForm7A(
  dispute_summary: string,
  claim_amount: number,
  plaintiff_name: string,
  defendant_name: string,
  assessment: AssessmentResult
): Promise<Form7AResult> {
  const userMsg = `Plaintiff: ${plaintiff_name}
Defendant: ${defendant_name}
Claim amount: $${claim_amount.toLocaleString()} CAD
Dispute: "${dispute_summary}"

Legal assessment:
Case strength: ${assessment.case_strength}
Rights & Remedies:
  Right violated: ${assessment.rights_remedies.right_violated}
  Governing provision: ${assessment.rights_remedies.governing_provision}
  Remedy: ${assessment.rights_remedies.remedy}
  Elements to prove: ${assessment.rights_remedies.elements_to_prove.join("; ")}

Key statutes:
${assessment.legal_framework.statutes.map((s) => `- ${s.citation}: ${s.relevance}`).join("\n")}
${assessment.legal_framework.rules.map((s) => `- ${s.citation}: ${s.relevance}`).join("\n")}`;

  const res = await openai.chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user",   content: userMsg },
    ],
  });

  const raw = res.choices[0].message.content ?? "{}";
  return JSON.parse(raw) as Form7AResult;
}
