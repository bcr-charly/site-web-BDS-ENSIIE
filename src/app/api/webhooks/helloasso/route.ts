import { NextResponse } from "next/server";
import { confirmPayment, isMockPayments } from "@/lib/payments";
import { verifyWebhookSignature } from "@/lib/helloasso";

export async function POST(req: Request) {
  if (isMockPayments()) return NextResponse.json({ error: "Webhook inactif en mode mock." }, { status: 400 });
  const raw = await req.text();
  const signature = req.headers.get("x-helloasso-signature");
  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Signature invalide." }, { status: 401 });
  }
  const body = JSON.parse(raw) as {
    eventType?: string;
    data?: { id?: number | string; checkoutIntentId?: number | string; paymentReceiptUrl?: string; payerName?: string };
  };
  const isPaymentValidated = body.eventType === "Payment" || body.eventType === "Order";
  if (!isPaymentValidated) return NextResponse.json({ received: true });
  const intentId = String(body.data?.checkoutIntentId ?? body.data?.id ?? "");
  if (!intentId) return NextResponse.json({ error: "Intent manquant." }, { status: 400 });
  const payment = await confirmPayment(intentId, {
    payerName: body.data?.payerName,
    receiptUrl: body.data?.paymentReceiptUrl,
  });
  if (!payment) return NextResponse.json({ error: "Intent inconnu côté site." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
