/**
 * POST /api/estimate  —  same-origin proxy for the native fee-estimator form.
 *
 * Why this exists: the form posts here (same origin — no CORS needed) and
 * this function forwards to the CRM's public estimator API server-side.
 * The CRM does all pricing, lead capture, and emailing; its response
 * carries no dollar figures (the range is email-gated).
 *
 * Defence layers, in order (the CRM applies its own honeypot + rate limit
 * again — these are just a cheap first line):
 *   1. Honeypot   — hidden field bots tend to fill. If set, drop the
 *                   submission but return a fake success.
 *   2. Rate limit — best-effort per-IP throttle (per edge isolate).
 *
 * Server env (optional):
 *   CRM_ESTIMATE_URL   defaults to the production CRM endpoint
 */

export const config = { runtime: "edge" };

const CRM_URL =
  process.env.CRM_ESTIMATE_URL ??
  "https://crm.sprinklerdesign.co.nz/api/estimate";

/* ---- best-effort per-IP rate limit (per warm isolate) ---- */
const RATE_LIMIT = 5; // submissions
const RATE_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405);
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  // 1. Honeypot — silently accept-and-drop so bots get a 200.
  if (str(body.company_website) || str(body.hp)) {
    return json({ ok: true, outcome: "range" });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // 2. Rate limit.
  if (rateLimited(ip)) {
    return json(
      { ok: false, error: "Too many requests — please try again shortly." },
      429,
    );
  }

  // Forward only the fields the CRM expects; pass the client IP through so
  // the CRM's own rate limiter sees the real visitor, not this proxy.
  const payload = {
    disciplines: Array.isArray(body.disciplines) ? body.disciplines : [],
    sections: Array.isArray(body.sections) ? body.sections : [],
    projectName: str(body.projectName),
    projectLocation: str(body.projectLocation),
    name: str(body.name),
    company: str(body.company),
    email: str(body.email),
    phone: str(body.phone),
    company_website: "",
    // Ad attribution (utm_* / li_fat_id / referrer) — the CRM allow-lists
    // and length-caps the keys server-side, so pass through as-is.
    ...(body.attribution &&
    typeof body.attribution === "object" &&
    !Array.isArray(body.attribution)
      ? { attribution: body.attribution }
      : {}),
  };

  try {
    const crmRes = await fetch(CRM_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": ip,
      },
      body: JSON.stringify(payload),
    });
    const data = (await crmRes.json().catch(() => null)) as
      | { ok?: boolean; outcome?: string; emailed?: boolean; error?: string }
      | null;
    if (!data) {
      return json({ ok: false, error: "Could not reach the estimator." }, 502);
    }
    // Pass the CRM's answer through verbatim (it never contains figures).
    return json(data, crmRes.status);
  } catch {
    return json({ ok: false, error: "Could not reach the estimator." }, 502);
  }
}
