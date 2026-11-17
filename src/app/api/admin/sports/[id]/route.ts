import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

async function loadOwnedSport(id: string, userId: string, role: string) {
  const sport = await prisma.sport.findUnique({ where: { id } });
  if (!sport) return { error: NextResponse.json({ error: "Sport introuvable." }, { status: 404 }) };
  if (role === "SPORT_MGR" && sport.captainId !== userId) {
    return { error: NextResponse.json({ error: "Un respo sport ne modifie que ses propres sports." }, { status: 403 }) };
  }
  return { sport };
}

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await adminAuth(req, "SPORT_MGR");
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const loaded = await loadOwnedSport(id, auth.user.id, auth.user.role);
  if ("error" in loaded) return loaded.error;
  const body = await req.json().catch(() => null);
  const data: Record<string, unknown> = {};
  if (body?.name !== undefined) data.name = String(body.name);
  if (body?.description !== undefined) data.description = body.description ? String(body.description) : null;
  if (body?.imageUrl !== undefined) data.imageUrl = body.imageUrl ? String(body.imageUrl) : null;
  if (body?.captainId !== undefined) data.captainId = body.captainId ? String(body.captainId) : null;
  const sport = await prisma.sport.update({ where: { id }, data });
  return NextResponse.json({ sport });
}

export async function DELETE(req: Request, ctx: Ctx) {
  const auth = await adminAuth(req, "BDS");
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  await prisma.sport.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
