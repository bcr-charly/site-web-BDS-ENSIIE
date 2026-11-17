import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createCheckout } from "@/lib/payments";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  if (!session.user.emailVerified) return NextResponse.json({ error: "Email non vérifié." }, { status: 403 });
  if (!session.user.isMember) {
    return NextResponse.json({ error: "Cotisation BDS requise.", needMembership: true }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const competition = await prisma.competition.findUnique({ where: { id: String(body?.competitionId ?? "") } });
  if (!competition || competition.priceCents <= 0) {
    return NextResponse.json({ error: "Compétition introuvable ou gratuite." }, { status: 400 });
  }
  const registration = await prisma.registration.findUnique({
    where: { userId_competitionId: { userId: session.user.id, competitionId: competition.id } },
  });
  if (!registration || registration.status !== "PENDING") {
    return NextResponse.json({ error: "Aucune inscription en attente de paiement." }, { status: 409 });
  }
  const checkout = await createCheckout({
    userId: session.user.id,
    kind: "COMPETITION",
    amountCents: competition.priceCents,
    label: `${competition.name} — frais d'inscription`,
    relatedId: competition.id,
    payerEmail: session.user.email ?? "",
  });
  return NextResponse.json({ ok: true, url: checkout.url, mock: checkout.mock });
}
