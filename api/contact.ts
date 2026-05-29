/**
 * POST /api/contact  —  same-origin proxy for the website contact form.
 *
 * Why this exists: the CRM webhook secret must NOT ship in the browser
 * bundle. The form posts here (same origin, no secret); this function
 * runs server-side on Vercel, verifies the request is human, then
 * forwards it to the CRM with the secret attached.
 *
 * Defence layers, in order:
 *   1. Honeypot   — a hidden field bots tend to fill. If set, we drop
 *                   the submission but return 200 so the bot can't tell.
 *   2. Turnstile  — Cloudflare's free bot challenge, verified server-side
 *                   against TURNSTILE_SECRET_KEY. Fails closed.
 *   3. Rate limit — best-effort per-IP throttle (per edge isolate).
 *
 * Server env (set in Vercel — NOT prefixed VITE_, so never exposed):
 *   TURNSTILE_SECRET_KEY      Cloudflare Turnstile secret key (required)
 *   CRM_FORM_WEBHOOK_SECRET   must match WEBSITE_FORM_WEBHOOK_SECRET in CRM
 *   CRM_FORM_WEBHOOK_URL      defaults to the production CRM endpoint
 */

export const config = { runtime: "edge" };

const CRM_URL =
  process.env.CRM_FORM_WEBHOOK_URL ??
  "https://crm.sprinklerdesign.co.nz/api/webhooks/website-form";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

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

interface ContactPayload {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
  turnstileToken?: unknown;
  // Honeypot — must stay empty for real users.
  company_website?: unknown;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  // 1. Honeypot — silently accept-and-drop so bots get a 200.
  if (str(body.company_website)) {
    return json({ ok: true });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // 3. Rate limit (cheap pre-check before hitting Cloudflare).
  if (rateLimited(ip)) {
    return json({ error: "Too many requests. Please try again later." }, 429);
  }

  // 2. Turnstile — fail closed if not configured or token missing/invalid.
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (!turnstileSecret) {
    return json({ error: "Form temporarily unavailable." }, 503);
  }
  const token = str(body.turnstileToken);
  if (!token) {
    return json({ error: "Bot verification missing. Please retry." }, 400);
  }

  try {
    const form = new URLSearchParams();
    form.set("secret", turnstileSecret);
    form.set("response", token);
    if (ip !== "unknown") form.set("remoteip", ip);
    const verifyRes = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form,
    });
    const verify = (await verifyRes.json()) as { success?: boolean };
    if (!verify.success) {
      return json({ error: "Bot verification failed. Please retry." }, 400);
    }
  } catch {
    return json({ error: "Could not verify request. Please retry." }, 502);
  }

  // Verified human — forward only the real fields to the CRM.
  const crmSecret = process.env.CRM_FORM_WEBHOOK_SECRET;
  if (!crmSecret) {
    return json({ error: "Form temporarily unavailable." }, 503);
  }

  const payload = {
    firstName: str(body.firstName),
    lastName: str(body.lastName),
    email: str(body.email),
    phone: str(body.phone),
    subject: str(body.subject),
    message: str(body.message),
  };

  try {
    const crmRes = await fetch(CRM_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-webhook-secret": crmSecret,
      },
      body: JSON.stringify(payload),
    });
    if (!crmRes.ok) {
      return json({ error: "Could not deliver your message." }, 502);
    }
  } catch {
    return json({ error: "Could not deliver your message." }, 502);
  }

  return json({ ok: true });
}
