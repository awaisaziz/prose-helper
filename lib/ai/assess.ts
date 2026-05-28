import "server-only";
import { openai, CHAT_MODEL } from "./openai";
import { stubLegalSource } from "@/lib/legal/stub";

export interface LegalCitation {
  citation: string;
  title: string;
  relevance: string;   // 1-2 sentence plain-English explanation
  url: string;
}

export interface LegalFramework {
  statutes:    LegalCitation[];
  rules:       LegalCitation[];
  regulations: LegalCitation[];
  precedents:  LegalCitation[];
}

export type CaseStrength = "STRONG" | "MODERATE" | "WEAK";

export interface RightsRemedies {
  right_violated:       string;
  governing_provision:  string;
  governing_url:        string;
  remedy:               string;
  elements_to_prove:    string[];
}

export interface AssessmentResult {
  legal_framework: LegalFramework;
  case_strength:   CaseStrength;
  reasoning:       string[];   // 3-5 bullet points
  go_no_go:        "proceed" | "caution";
  rights_remedies: RightsRemedies;
}

const SYSTEM = `You are a legal assessment assistant for Ontario Small Claims Court.
Given a dispute and retrieved legal sources, you must:
1. Map the case to the four layers of legal authority: statutes, rules of procedure, regulations, precedents.
2. Give a qualitative case strength assessment (STRONG / MODERATE / WEAK) based on how well the facts align with the retrieved law.
3. Identify the right violated, the remedy available, and the elements the client must prove.

Rules:
- Only cite sources that were actually provided to you. Do not fabricate citations.
- For ontario.ca statutes use URL format: https://www.ontario.ca/laws/statute/<slug>
- For federal statutes use: https://laws-lois.justice.gc.ca/eng/acts/<slug>
- For CanLII decisions use: https://www.canlii.org/en/on/onscj/
- Never guarantee an outcome. Never give a numeric probability.
- Respond ONLY with valid JSON. No markdown, no extra text.

JSON schema:
{
  "legal_framework": {
    "statutes":    [{ "citation": string, "title": string, "relevance": string, "url": string }],
    "rules":       [{ "citation": string, "title": string, "relevance": string, "url": string }],
    "regulations": [{ "citation": string, "title": string, "relevance": string, "url": string }],
    "precedents":  [{ "citation": string, "title": string, "relevance": string, "url": string }]
  },
  "case_strength": "STRONG" | "MODERATE" | "WEAK",
  "reasoning": [string, ...],
  "go_no_go": "proceed" | "caution",
  "rights_remedies": {
    "right_violated":      string,
    "governing_provision": string,
    "governing_url":       string,
    "remedy":              string,
    "elements_to_prove":   [string, ...]
  }
}`;

export async function assessCase(
  dispute_summary: string,
  matter_type: string,
  claim_amount: number
): Promise<AssessmentResult> {
  // Retrieve relevant legal sources from the stub (Phase 2: real pgvector)
  const sources = await stubLegalSource.search(
    `${matter_type} ${dispute_summary}`,
    6
  );

  const sourcesText = sources
    .map((s) => `[${s.type.toUpperCase()}] ${s.citation}\n${s.body}${s.url ? `\nURL: ${s.url}` : ""}`)
    .join("\n\n");

  const userMsg = `Dispute: "${dispute_summary}"
Matter type: ${matter_type}
Claim amount: $${claim_amount.toLocaleString()} CAD

Retrieved legal sources:
${sourcesText}`;

  const res = await openai.chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user",   content: userMsg },
    ],
  });

  const raw = res.choices[0].message.content ?? "{}";
  return JSON.parse(raw) as AssessmentResult;
}
