import crypto from "node:crypto";

const API_BASE = process.env.HELLOASSO_API_BASE ?? "https://api.helloasso.com/v5";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) return cachedToken.value;
  const res = await fetch(`${API_BASE}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.HELLOASSO_CLIENT_ID ?? "",
      client_secret: process.env.HELLOASSO_CLIENT_SECRET ?? "",
    }),
  });
  if (!res.ok) throw new Error(`HelloAsso token: HTTP ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

export async function createHelloAssoCheckout(opts: {
  amountCents: number;
  label: string;
  relatedId?: string;
  payerEmail: string;
}): Promise<{ intentId: string; checkoutUrl: string }> {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}/organizations/${process.env.HELLOASSO_ORG_SLUG}/checkout-intents`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      totalAmount: opts.amountCents,
      itemName: opts.label,
      backUrl: `${base}/mon-compte/paiements`,
      errorUrl: `${base}/mon-compte/paiements?erreur=1`,
      returnUrl: `${base}/mon-compte/paiements?ok=1`,
      containsDonation: false,
      payer: { email: opts.payerEmail },
      metadata: opts.relatedId ? { relatedId: opts.relatedId } : undefined,
    }),
  });
  if (!res.ok) throw new Error(`HelloAsso checkout-intents: HTTP ${res.status}`);
  const data = (await res.json()) as { id: number; checkoutUrl?: string };
  return { intentId: String(data.id), checkoutUrl: data.checkoutUrl ?? "" };
}

export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.HELLOASSO_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
