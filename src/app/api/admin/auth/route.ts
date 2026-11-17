import { NextResponse } from "next/server";
import { checkServiceToken } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { roleAtLeast } from "@/lib/roles";

export async function POST(req: Request) {
  const tokenError = checkServiceToken(req);
  if (tokenError) return NextResponse.json({ error: tokenError }, { status: 401 });
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Identifiants invalides." }, { status: 401 });
  }
  if (!user.emailVerified || !roleAtLeast(user.role, "BDS")) {
    return NextResponse.json({ error: "Compte vérifié et grade BDS minimum requis pour l'app admin." }, { status: 403 });
  }
  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
  });
}
