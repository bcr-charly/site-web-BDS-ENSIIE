import { NextResponse } from "next/server";
import { CompetitionType } from "@prisma/client";
import { adminAuth } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/site";

export async function GET(req: Request) {
  const auth = await adminAuth(req, "BDS");
  if ("error" in auth) return auth.error;
  const competitions = await prisma.competition.findMany({
    orderBy: { date: "asc" },
    include: { _count: { select: { registrations: true } } },
  });
  return NextResponse.json({ competitions });
}

export async function POST(req: Request) {
  const auth = await adminAuth(req, "BDS");
  if ("error" in auth) return auth.error;
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Nom requis." }, { status: 400 });
  const type = String(body?.type ?? "COMPETITION");
  if (!Object.values(CompetitionType).includes(type as CompetitionType)) {
    return NextResponse.json({ error: "Type invalide (CHAMPIONNAT/COMPETITION/EVENEMENT)." }, { status: 400 });
  }
  const slug = String(body?.slug ?? "").trim() || slugify(name);
  if (await prisma.competition.findUnique({ where: { slug } })) {
    return NextResponse.json({ error: "Slug déjà utilisé." }, { status: 409 });
  }
  const date = new Date(String(body?.date ?? ""));
  if (Number.isNaN(date.getTime())) return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  const competition = await prisma.competition.create({
    data: {
      name,
      slug,
      type: type as CompetitionType,
      description: body?.description ? String(body.description) : null,
      date,
      location: body?.location ? String(body.location) : null,
      priceCents: Number(body?.priceCents ?? 0) || 0,
      deadline: body?.deadline ? new Date(String(body.deadline)) : null,
      maxSlots: body?.maxSlots ? Number(body.maxSlots) : null,
      imageUrl: body?.imageUrl ? String(body.imageUrl) : null,
      isOpen: body?.isOpen !== undefined ? Boolean(body.isOpen) : true,
    },
  });
  return NextResponse.json({ competition }, { status: 201 });
}
