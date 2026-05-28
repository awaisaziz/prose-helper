import type { LegalSource, LegalSourceProvider } from "./types";

// Hand-seeded Ontario Small Claims sources for Phase 0/1 development.
// Replaced by a pgvector-backed provider in Phase 2.
const SOURCES: LegalSource[] = [
  {
    id: "reg-258-98-s7",
    type: "rule",
    citation: "O. Reg. 258/98, r. 7",
    title: "Rules of the Small Claims Court — Commencement of Proceedings",
    body: "A proceeding shall be commenced by filing a plaintiff's claim (Form 7A) with the court. The claim must contain the full particulars of the claim and the relief sought.",
    url: "https://www.ontario.ca/laws/regulation/980258",
  },
  {
    id: "cja-s23",
    type: "statute",
    citation: "Courts of Justice Act, R.S.O. 1990, c. C.43, s. 23",
    title: "Jurisdiction of the Small Claims Court",
    body: "The Small Claims Court has jurisdiction in any action for the payment of money where the amount claimed does not exceed the prescribed amount ($50,000), and in any action for the recovery of possession of personal property where the value does not exceed that amount.",
    url: "https://www.ontario.ca/laws/statute/90c43",
  },
  {
    id: "sample-decision-deposit",
    type: "decision",
    citation: "Sample v. Contractor, 2023 CanLII 00000 (ON SCSM)",
    title: "Recovery of deposit for work not performed",
    body: "Where a contractor accepts a deposit and fails to perform any of the contracted work, the plaintiff is entitled to restitution of the deposit. The plaintiff must prove the payment, the agreement, and the failure to perform.",
  },
];

export const stubLegalSource: LegalSourceProvider = {
  async search(query: string, limit = 5): Promise<LegalSource[]> {
    const q = query.toLowerCase();
    const ranked = SOURCES.map((s) => ({
      s,
      score:
        (s.title.toLowerCase().includes(q) ? 2 : 0) +
        (s.body.toLowerCase().includes(q) ? 1 : 0),
    }));
    const hits = ranked.filter((r) => r.score > 0).sort((a, b) => b.score - a.score);
    return (hits.length ? hits.map((r) => r.s) : SOURCES).slice(0, limit);
  },
  async getById(id: string): Promise<LegalSource | null> {
    return SOURCES.find((s) => s.id === id) ?? null;
  },
};
