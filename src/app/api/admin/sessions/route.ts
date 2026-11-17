import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const auth = await adminAuth(req, "SPORT_MGR");
  if ("error" in auth) return auth.error;
  const sessions = await prisma.session.findMany({
    orderBy: [{ weekday: "asc" }, { startTime: "asc" }],
    include: { sport: { select: { id: true, name: true, slug: true } }, coach: { select: { id: true, firstName: true, lastName: true } } },
  });
  return NextResponse.json({ sessions });
}

export async function POST(req: Request) {
  const auth = await adminAuth(req, "SPORT_MGR");
  if ("error" in auth) return auth.error;
  const body = await req.json().catch(() => null);
  const weekday = Number(body?.weekday);
  const startTime = String(body?.startTime ?? "");
  const endTime = String(body?.endTime ?? "");
  const sport = await prisma.sport.findUnique({ where: { id: String(body?.sportId ?? "") } });
  if (!sport) return NextResponse.json({ error: "Sport introuvable." }, { status: 404 });
  if (auth.user.role === "SPORT_MGR" && sport.captainId !== auth.user.id) {
    return NextResponse.json({ error: "Un respo sport ne modifie que ses propres sports." }, { status: 403 });
  }
  if (!Number.isInteger(weekday) || weekday < 1 || weekday > 7) {
    return NextResponse.json({ error: "Jour invalide (1=lundi … 7=dimanche)." }, { status: 400 });
  }
  if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
    return NextResponse.json({ error: "Horaires au format HH:MM." }, { status: 400 });
  }
  const session = await prisma.session.create({
    data: {
      sportId: sport.id,
      weekday,
      startTime,
      endTime,
      location: body?.location ? String(body.location) : null,
      coachId: body?.coachId ? String(body.coachId) : null,
    },
  });
  return NextResponse.json({ session }, { status: 201 });
}
