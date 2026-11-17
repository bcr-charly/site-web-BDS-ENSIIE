import { NextResponse } from "next/server";
import { TeamRole } from "@prisma/client";
import { adminAuth } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const auth = await adminAuth(req, "SPORT_MGR");
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const sport = await prisma.sport.findUnique({ where: { id } });
  if (!sport) return NextResponse.json({ error: "Sport introuvable." }, { status: 404 });
  if (auth.user.role === "SPORT_MGR" && sport.captainId !== auth.user.id) {
    return NextResponse.json({ error: "Un respo sport ne modifie que ses propres sports." }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const userId = String(body?.userId ?? "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  const role = String(body?.role ?? "PLAYER");
  if (!Object.values(TeamRole).includes(role as TeamRole)) {
    return NextResponse.json({ error: "Rôle invalide (PLAYER/CAPTAIN/COACH)." }, { status: 400 });
  }
  const member = await prisma.teamMember.upsert({
    where: { userId_sportId: { userId, sportId: sport.id } },
    update: { role: role as TeamRole, jerseyNumber: body?.jerseyNumber !== undefined ? Number(body.jerseyNumber) || null : undefined },
    create: { userId, sportId: sport.id, role: role as TeamRole, jerseyNumber: body?.jerseyNumber ? Number(body.jerseyNumber) : null },
  });
  return NextResponse.json({ member }, { status: 201 });
}
