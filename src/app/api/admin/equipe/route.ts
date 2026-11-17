import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const auth = await adminAuth(req, "BDS");
  if ("error" in auth) return auth.error;
  const members = await prisma.bdsMember.findMany({
    orderBy: { displayOrder: "asc" },
    include: { user: { select: { id: true, email: true, firstName: true, lastName: true, promoYear: true, avatarUrl: true } } },
  });
  return NextResponse.json({ members });
}

export async function POST(req: Request) {
  const auth = await adminAuth(req, "BDS");
  if ("error" in auth) return auth.error;
  const body = await req.json().catch(() => null);
  const userId = String(body?.userId ?? "");
  const poste = String(body?.poste ?? "").trim();
  if (!poste) return NextResponse.json({ error: "Poste requis." }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  const existing = await prisma.bdsMember.findUnique({ where: { userId } });
  if (existing) return NextResponse.json({ error: "Cet utilisateur est déjà au bureau." }, { status: 409 });
  const maxOrder = await prisma.bdsMember.aggregate({ _max: { displayOrder: true } });
  const member = await prisma.bdsMember.create({
    data: { userId, poste, displayOrder: body?.displayOrder !== undefined ? Number(body.displayOrder) : (maxOrder._max.displayOrder ?? -1) + 1 },
  });
  return NextResponse.json({ member }, { status: 201 });
}
