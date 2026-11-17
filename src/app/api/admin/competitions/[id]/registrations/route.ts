import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

function toCsv(rows: Record<string, unknown>[]): string {
  const header = ["prenom", "nom", "email", "promo", "statut", "message", "inscrit_le"];
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [header.join(",")];
  for (const r of rows) lines.push(header.map((h) => escape(r[h])).join(","));
  return lines.join("\n");
}

export async function GET(req: Request, ctx: Ctx) {
  const auth = await adminAuth(req, "BDS");
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const competition = await prisma.competition.findUnique({ where: { id } });
  if (!competition) return NextResponse.json({ error: "Compétition introuvable." }, { status: 404 });
  const registrations = await prisma.registration.findMany({
    where: { competitionId: id },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { firstName: true, lastName: true, email: true, promoYear: true } } },
  });
  if (new URL(req.url).searchParams.get("export") === "csv") {
    const rows = registrations.map((r) => ({
      prenom: r.user.firstName,
      nom: r.user.lastName,
      email: r.user.email,
      promo: r.user.promoYear ?? "",
      statut: r.status,
      message: r.message ?? "",
      inscrit_le: r.createdAt.toISOString(),
    }));
    return new NextResponse(toCsv(rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="inscrits-${competition.slug}.csv"`,
      },
    });
  }
  return NextResponse.json({ competition, registrations });
}
