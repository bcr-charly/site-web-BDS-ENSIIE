import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { createCheckout } from "@/lib/payments";
import { formatCents } from "@/lib/site";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  if (!session.user.emailVerified) return NextResponse.json({ error: "Email non vérifié." }, { status: 403 });

  const body = await req.json().catch(() => null);
  const competitionId = String(body?.competitionId ?? "");
  const message = typeof body?.message === "string" ? body.message.slice(0, 500) : null;

  const competition = await prisma.competition.findUnique({ where: { id: competitionId } });
  if (!competition || !competition.isOpen || competition.date < new Date()) {
    return NextResponse.json({ error: "Inscriptions fermées pour cette compétition." }, { status: 400 });
  }
  if (competition.deadline && competition.deadline < new Date()) {
    return NextResponse.json({ error: "La date limite d'inscription est dépassée." }, { status: 400 });
  }
  if (!session.user.isMember) {
    return NextResponse.json({ error: "Cotisation BDS requise avant toute inscription.", needMembership: true }, { status: 403 });
  }
  const existing = await prisma.registration.findUnique({
    where: { userId_competitionId: { userId: session.user.id, competitionId } },
  });
  if (existing) return NextResponse.json({ error: "Tu es déjà inscrit à cette compétition." }, { status: 409 });
  const confirmedCount = await prisma.registration.count({
    where: { competitionId, status: "CONFIRMED" },
  });
  if (competition.maxSlots !== null && confirmedCount >= competition.maxSlots) {
    return NextResponse.json({ error: "La compétition est pleine." }, { status: 409 });
  }

  await prisma.registration.create({
    data: { userId: session.user.id, competitionId, message, status: "PENDING" },
  });

  if (competition.priceCents > 0) {
    const checkout = await createCheckout({
      userId: session.user.id,
      kind: "COMPETITION",
      amountCents: competition.priceCents,
      label: `${competition.name} — frais d'inscription`,
      relatedId: competitionId,
      payerEmail: session.user.email ?? "",
    });
    return NextResponse.json({ ok: true, paymentUrl: checkout.url, mock: checkout.mock });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user) {
    await sendMail({
      to: user.email,
      subject: `Inscription enregistrée — ${competition.name}`,
      text: `Ton inscription à « ${competition.name} » (gratuite) est enregistrée, en attente de validation par le BDS. Montant : ${formatCents(0)}.`,
    });
  }
  return NextResponse.json({ ok: true, status: "PENDING" });
}
