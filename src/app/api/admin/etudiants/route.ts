import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const auth = await adminAuth(req, "BDS");
  if ("error" in auth) return auth.error;
  const q = new URL(req.url).searchParams.get("q")?.trim().toLowerCase() ?? "";
  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { lastName: "asc" },
    take: 50,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      promoYear: true,
      phone: true,
      role: true,
      isMember: true,
      emailVerified: true,
      avatarUrl: true,
      adhesions: { select: { saisonYear: true, status: true, paidAt: true } },
      _count: { select: { registrations: true, payments: true } },
    },
  });
  return NextResponse.json({ users });
}
