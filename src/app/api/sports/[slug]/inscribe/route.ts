import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";

type RouteContext = { params: Promise<{ slug: string }> };

export async function POST(_req: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  if (!session.user.emailVerified) return NextResponse.json({ error: "Email non vérifié." }, { status: 403 });
  if (!session.user.isMember) {
    return NextResponse.json({ error: "Cotisation BDS requise pour s'inscrire à un sport.", needMembership: true }, { status: 403 });
  }
  const { slug } = await context.params;
  const sport = await prisma.sport.findUnique({ where: { slug } });
  if (!sport) return NextResponse.json({ error: "Sport introuvable." }, { status: 404 });

  const existing = await prisma.teamMember.findFirst({ where: { userId: session.user.id, sportId: sport.id } });
  if (existing) return NextResponse.json({ error: "Tu fais déjà partie de cette équipe." }, { status: 409 });

  await prisma.teamMember.create({
    data: { userId: session.user.id, sportId: sport.id, role: "PLAYER" },
  });
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user) {
    await sendMail({
      to: user.email,
      subject: `Inscription à la section ${sport.name}`,
      text: `Tu es bien inscrit à la section ${sport.name}. Rendez-vous aux prochains créneaux !`,
    });
  }
  return NextResponse.json({ ok: true });
}
