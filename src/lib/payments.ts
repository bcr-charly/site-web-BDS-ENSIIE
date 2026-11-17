import crypto from "node:crypto";
import { PaymentKind } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { formatCents, saisonYear } from "@/lib/site";
import { createHelloAssoCheckout } from "@/lib/helloasso";

export function isMockPayments(): boolean {
  return process.env.PAYMENT_MODE === "mock" || !process.env.HELLOASSO_CLIENT_ID;
}

export async function createCheckout(opts: {
  userId: string;
  kind: PaymentKind;
  amountCents: number;
  label: string;
  relatedId?: string;
  payerEmail: string;
}): Promise<{ paymentId: string; url: string; mock: boolean }> {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  if (isMockPayments()) {
    const intent = `mock_${crypto.randomUUID()}`;
    const payment = await prisma.payment.create({
      data: {
        userId: opts.userId,
        kind: opts.kind,
        helloAssoIntent: intent,
        status: "PENDING",
        amountCents: opts.amountCents,
        relatedId: opts.relatedId ?? null,
      },
    });
    return { paymentId: payment.id, url: `${base}/paiement/mock?intent=${intent}`, mock: true };
  }
  const intent = await createHelloAssoCheckout({
    amountCents: opts.amountCents,
    label: opts.label,
    relatedId: opts.relatedId,
    payerEmail: opts.payerEmail,
  });
  const payment = await prisma.payment.create({
    data: {
      userId: opts.userId,
      kind: opts.kind,
      helloAssoIntent: intent.intentId,
      status: "PENDING",
      amountCents: opts.amountCents,
      relatedId: opts.relatedId ?? null,
    },
  });
  return { paymentId: payment.id, url: intent.checkoutUrl, mock: false };
}

export async function confirmPayment(
  intentId: string,
  meta: { payerName?: string; receiptUrl?: string } = {},
) {
  const payment = await prisma.payment.findUnique({ where: { helloAssoIntent: intentId } });
  if (!payment) return null;
  if (payment.status === "PAID") return payment;
  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "PAID",
      paidAt: new Date(),
      payerName: meta.payerName ?? payment.payerName,
      receiptUrl: meta.receiptUrl ?? payment.receiptUrl,
    },
  });
  const user = await prisma.user.findUnique({ where: { id: payment.userId } });
  if (payment.kind === "COTISATION") {
    const saison = saisonYear();
    await prisma.adhesion.upsert({
      where: { userId_saisonYear: { userId: payment.userId, saisonYear: saison } },
      update: { status: "PAID", paidAt: new Date(), paymentId: payment.id },
      create: { userId: payment.userId, saisonYear: saison, status: "PAID", paidAt: new Date(), paymentId: payment.id },
    });
    await prisma.user.update({ where: { id: payment.userId }, data: { isMember: true } });
    if (user) {
      await sendMail({
        to: user.email,
        subject: "Cotisation BDS ENSIIE reçue",
        text: `Ta cotisation de ${formatCents(payment.amountCents)} est validée. Ton adhésion au BDS est active pour la saison ${saison}-${saison + 1}.`,
      });
    }
  }
  if (payment.kind === "COMPETITION" && payment.relatedId) {
    const registration = await prisma.registration.updateMany({
      where: { userId: payment.userId, competitionId: payment.relatedId },
      data: { status: "CONFIRMED" },
    });
    const competition = await prisma.competition.findUnique({ where: { id: payment.relatedId } });
    if (user && competition && registration.count > 0) {
      await sendMail({
        to: user.email,
        subject: `Inscription confirmée — ${competition.name}`,
        text: `Ton paiement de ${formatCents(payment.amountCents)} est validé : ton inscription à « ${competition.name} » est confirmée.`,
      });
    }
  }
  return updated;
}
