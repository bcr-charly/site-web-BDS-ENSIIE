import { NextResponse } from "next/server";
import { TeamRole } from "@prisma/client";
import { adminAuth } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await adminAuth(req, "SPORT_MGR");
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const member = await prisma.teamMember.findUnique({ where: { id }, include: { sport: true } });
  if (!member) return NextResponse.json({ error: "Membre introuvable." }, { status: 404 });
  if (auth.user.role === "SPORT_MGR" && member.sport.captainId !== auth.user.id) {
    return NextResponse.json({ error: "Un respo sport ne modifie que son équipe." }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const data: Record<string, unknown> = {};
  if (body?.role !== undefined) {
    if (!Object.values(TeamRole).includes(body.role as TeamRole)) {
      return NextResponse.json({ error: "Rôle invalide." }, { status: 400 });
    }
    data.role = body.role;
  }
  if (body?.jerseyNumber !== undefined) data.jerseyNumber = body.jerseyNumber ? Number(body.jerseyNumber) : null;
  const updated = await prisma.teamMember.update({ where: { id }, data });
  return NextResponse.json({ member: updated });
}

export async function DELETE(req: Request, ctx: Ctx) {
  const auth = await adminAuth(req, "SPORT_MGR");
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const member = await prisma.teamMember.findUnique({ where: { id }, include: { sport: true } });
  if (!member) return NextResponse.json({ error: "Membre introuvable." }, { status: 404 });
  if (auth.user.role === "SPORT_MGR" && member.sport.captainId !== auth.user.id) {
    return NextResponse.json({ error: "Un respo sport ne modifie que son équipe." }, { status: 403 });
  }
  await prisma.teamMember.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
