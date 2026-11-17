import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCheckout } from "@/lib/payments";
import { SITE, saisonYear } from "@/lib/site";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  if (!session.user.emailVerified) return NextResponse.json({ error: "Email non vérifié." }, { status: 403 });

  const adhesion = await prisma.adhesion.findUnique({
    where: { userId_saisonYear: { userId: session.user.id, saisonYear: saisonYear() } },
  });
  if (adhesion?.status === "PAID" || session.user.isMember) {
    return NextResponse.json({ error: "Cotisation déjà payée pour cette saison." }, { status: 409 });
  }
  const checkout = await createCheckout({
    userId: session.user.id,
    kind: "COTISATION",
    amountCents: SITE.cotisationCents,
    label: `Cotisation BDS ENSIIE ${saisonYear()}-${saisonYear() + 1}`,
    payerEmail: session.user.email ?? "",
  });
  return NextResponse.json({ ok: true, url: checkout.url, mock: checkout.mock, amountCents: SITE.cotisationCents });
}
