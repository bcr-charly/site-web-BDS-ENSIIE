import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/site";

export async function GET(req: Request) {
  const auth = await adminAuth(req, "SPORT_MGR");
  if ("error" in auth) return auth.error;
  const sports = await prisma.sport.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { sessions: true, teamMembers: true } },
      captain: { select: { id: true, firstName: true, lastName: true } },
    },
  });
  return NextResponse.json({ sports });
}

export async function POST(req: Request) {
  const auth = await adminAuth(req, "BDS");
  if ("error" in auth) return auth.error;
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Nom requis." }, { status: 400 });
  const slug = String(body?.slug ?? "").trim() || slugify(name);
  const existing = await prisma.sport.findUnique({ where: { slug } });
  if (existing) return NextResponse.json({ error: "Slug déjà utilisé." }, { status: 409 });
  const sport = await prisma.sport.create({
    data: {
      name,
      slug,
      description: body?.description ? String(body.description) : null,
      imageUrl: body?.imageUrl ? String(body.imageUrl) : null,
      captainId: body?.captainId ? String(body.captainId) : null,
    },
  });
  return NextResponse.json({ sport }, { status: 201 });
}
