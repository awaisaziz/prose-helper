// Abstraction over the legal data layer. Phase 0 ships a hand-seeded stub;
// Phase 2 wires the real A2AJ corpus + Ontario e-Laws into pgvector behind
// this same interface. No CanLII.

export type LegalSourceType = "decision" | "statute" | "rule";

export interface LegalSource {
  id: string;
  type: LegalSourceType;
  citation: string;
  title: string;
  body: string;
  url?: string;
}

export interface LegalSourceProvider {
  /** Semantic / keyword retrieval of sources relevant to a query. */
  search(query: string, limit?: number): Promise<LegalSource[]>;
  getById(id: string): Promise<LegalSource | null>;
}
