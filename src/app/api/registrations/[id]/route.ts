import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  const { id } = await context.params;
  const registration = await prisma.registration.findUnique({ where: { id } });
  if (!registration || registration.userId !== session.user.id) {
    return NextResponse.json({ error: "Inscription introuvable." }, { status: 404 });
  }
  if (registration.status !== "PENDING") {
    return NextResponse.json({ error: "Seule une inscription en attente peut être annulée." }, { status: 400 });
  }
  await prisma.registration.update({ where: { id }, data: { status: "CANCELLED" } });
  return NextResponse.json({ ok: true });
}
