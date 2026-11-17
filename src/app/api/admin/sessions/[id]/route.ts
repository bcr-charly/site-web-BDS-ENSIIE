import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await adminAuth(req, "SPORT_MGR");
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const session = await prisma.session.findUnique({ where: { id }, include: { sport: true } });
  if (!session) return NextResponse.json({ error: "Créneau introuvable." }, { status: 404 });
  if (auth.user.role === "SPORT_MGR" && session.sport.captainId !== auth.user.id) {
    return NextResponse.json({ error: "Un respo sport ne modifie que ses propres sports." }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const data: Record<string, unknown> = {};
  if (body?.weekday !== undefined) data.weekday = Number(body.weekday);
  if (body?.startTime !== undefined) data.startTime = String(body.startTime);
  if (body?.endTime !== undefined) data.endTime = String(body.endTime);
  if (body?.location !== undefined) data.location = body.location ? String(body.location) : null;
  if (body?.coachId !== undefined) data.coachId = body.coachId ? String(body.coachId) : null;
  const updated = await prisma.session.update({ where: { id }, data });
  return NextResponse.json({ session: updated });
}

export async function DELETE(req: Request, ctx: Ctx) {
  const auth = await adminAuth(req, "SPORT_MGR");
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const session = await prisma.session.findUnique({ where: { id }, include: { sport: true } });
  if (!session) return NextResponse.json({ error: "Créneau introuvable." }, { status: 404 });
  if (auth.user.role === "SPORT_MGR" && session.sport.captainId !== auth.user.id) {
    return NextResponse.json({ error: "Un respo sport ne modifie que ses propres sports." }, { status: 403 });
  }
  await prisma.session.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
