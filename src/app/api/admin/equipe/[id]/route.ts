import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await adminAuth(req, "BDS");
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const data: Record<string, unknown> = {};
  if (body?.poste !== undefined) data.poste = String(body.poste);
  if (body?.displayOrder !== undefined) data.displayOrder = Number(body.displayOrder);
  const member = await prisma.bdsMember.update({ where: { id }, data });
  return NextResponse.json({ member });
}

export async function DELETE(req: Request, ctx: Ctx) {
  const auth = await adminAuth(req, "BDS");
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  await prisma.bdsMember.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
