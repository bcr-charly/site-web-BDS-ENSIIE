import { NextResponse } from "next/server";
import { RegistrationStatus } from "@prisma/client";
import { adminAuth } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await adminAuth(req, "BDS");
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const status = String(body?.status ?? "");
  if (status !== "CONFIRMED" && status !== "CANCELLED") {
    return NextResponse.json({ error: "Statut invalide (CONFIRMED/CANCELLED)." }, { status: 400 });
  }
  const registration = await prisma.registration.findUnique({
    where: { id },
    include: { user: true, competition: true },
  });
  if (!registration) return NextResponse.json({ error: "Inscription introuvable." }, { status: 404 });
  const updated = await prisma.registration.update({
    where: { id },
    data: { status: status as RegistrationStatus },
  });
  await sendMail({
    to: registration.user.email,
    subject: `Inscription ${status === "CONFIRMED" ? "validée" : "refusée"} — ${registration.competition.name}`,
    text:
      status === "CONFIRMED"
        ? `Ton inscription à « ${registration.competition.name} » est validée par le BDS.`
        : `Ton inscription à « ${registration.competition.name} » a été refusée par le BDS. Contacte le bureau pour en savoir plus.`,
  });
  return NextResponse.json({ registration: updated });
}
