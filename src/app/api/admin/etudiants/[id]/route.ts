import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { adminAuth } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await adminAuth(req, "ADMIN");
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const data: Record<string, unknown> = {};
  if (body?.role !== undefined) {
    if (!Object.values(Role).includes(body.role as Role)) {
      return NextResponse.json({ error: "Rôle invalide (STUDENT/SPORT_MGR/BDS/ADMIN)." }, { status: 400 });
    }
    data.role = body.role;
  }
  if (body?.isMember !== undefined) data.isMember = Boolean(body.isMember);
  const user = await prisma.user.update({ where: { id }, data });
  return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role, isMember: user.isMember } });
}
