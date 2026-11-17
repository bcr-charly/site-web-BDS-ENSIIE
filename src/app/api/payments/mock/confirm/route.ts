import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { confirmPayment, isMockPayments } from "@/lib/payments";
import { formatCents } from "@/lib/site";

export async function POST(req: Request) {
  if (!isMockPayments()) return NextResponse.json({ error: "Mode paiement réel : pas de confirmation mock." }, { status: 400 });
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  const body = await req.json().catch(() => null);
  const intent = String(body?.intent ?? "");
  const payment = await prisma.payment.findUnique({ where: { helloAssoIntent: intent } });
  if (!payment || payment.userId !== session.user.id) {
    return NextResponse.json({ error: "Intent inconnu." }, { status: 404 });
  }
  const updated = await confirmPayment(intent, { payerName: `${session.user.name ?? "Simulation"} (CB simulée)` });
  if (!updated) return NextResponse.json({ error: "Confirmation impossible." }, { status: 400 });
  return NextResponse.json({ ok: true, amountCents: updated.amountCents, message: `Paiement simulé de ${formatCents(updated.amountCents)} validé.` });
}
