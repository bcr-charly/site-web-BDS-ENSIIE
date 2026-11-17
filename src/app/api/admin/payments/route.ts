import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const auth = await adminAuth(req, "BDS");
  if ("error" in auth) return auth.error;
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
  });
  return NextResponse.json({ payments });
}
