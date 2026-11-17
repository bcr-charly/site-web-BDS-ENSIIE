import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  if (!session.user.emailVerified) return NextResponse.json({ error: "Email non vérifié." }, { status: 403 });

  const body = await req.json().catch(() => null);
  const data: Record<string, unknown> = {};
  for (const key of ["firstName", "lastName", "phone"] as const) {
    if (typeof body?.[key] === "string") data[key] = body[key].trim();
  }
  const promoYear = Number(body?.promoYear);
  if (Number.isFinite(promoYear) && promoYear > 0) data.promoYear = promoYear;
  if (typeof body?.birthDate === "string" && body.birthDate) data.birthDate = new Date(body.birthDate);

  const user = await prisma.user.update({ where: { id: session.user.id }, data });
  return NextResponse.json({
    ok: true,
    user: { firstName: user.firstName, lastName: user.lastName, promoYear: user.promoYear, phone: user.phone, birthDate: user.birthDate },
  });
}
