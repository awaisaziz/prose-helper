#!/usr/bin/env node
/**
 * Dev helper — fires the deadline cron endpoint against localhost.
 * Usage: npm run cron:deadlines
 */
const BASE = process.env.APP_URL ?? "http://localhost:3000";

async function main() {
  console.log(`[cron] Calling ${BASE}/api/cron/deadlines …`);
  const res = await fetch(`${BASE}/api/cron/deadlines`);
  if (!res.ok) {
    console.error("[cron] HTTP", res.status, await res.text());
    process.exit(1);
  }
  const data = await res.json();
  console.log("[cron] Done:", JSON.stringify(data, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
