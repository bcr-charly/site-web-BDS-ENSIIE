import { NextResponse } from "next/server";
import { CompetitionType } from "@prisma/client";
import { adminAuth } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await adminAuth(req, "BDS");
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const data: Record<string, unknown> = {};
  if (body?.name !== undefined) data.name = String(body.name);
  if (body?.type !== undefined) {
    if (!Object.values(CompetitionType).includes(body.type as CompetitionType)) {
      return NextResponse.json({ error: "Type invalide." }, { status: 400 });
    }
    data.type = body.type;
  }
  if (body?.description !== undefined) data.description = body.description ? String(body.description) : null;
  if (body?.date !== undefined) data.date = new Date(String(body.date));
  if (body?.location !== undefined) data.location = body.location ? String(body.location) : null;
  if (body?.priceCents !== undefined) data.priceCents = Number(body.priceCents) || 0;
  if (body?.deadline !== undefined) data.deadline = body.deadline ? new Date(String(body.deadline)) : null;
  if (body?.maxSlots !== undefined) data.maxSlots = body.maxSlots ? Number(body.maxSlots) : null;
  if (body?.imageUrl !== undefined) data.imageUrl = body.imageUrl ? String(body.imageUrl) : null;
  if (body?.isOpen !== undefined) data.isOpen = Boolean(body.isOpen);
  const competition = await prisma.competition.update({ where: { id }, data });
  return NextResponse.json({ competition });
}

export async function DELETE(req: Request, ctx: Ctx) {
  const auth = await adminAuth(req, "BDS");
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  await prisma.competition.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
