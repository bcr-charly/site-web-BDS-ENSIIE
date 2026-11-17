import { NextResponse } from "next/server";
import type { Role, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { roleAtLeast } from "@/lib/roles";

const RATE_LIMIT = 60;
const WINDOW_MS = 60_000;
const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkServiceToken(req: Request): string | null {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) return "ADMIN_API_TOKEN non configuré sur le serveur.";
  const header = req.headers.get("authorization") ?? "";
  if (header !== `Bearer ${token}`) return "Jeton de service invalide.";
  return null;
}

function rateLimited(): boolean {
  const now = Date.now();
  let bucket = buckets.get("global");
  if (!bucket || bucket.resetAt < now) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set("global", bucket);
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
}

export type AdminAuth = { user: User } | { error: NextResponse };

export async function adminAuth(req: Request, minRole: Role = "BDS"): Promise<AdminAuth> {
  const tokenError = checkServiceToken(req);
  if (tokenError) return { error: NextResponse.json({ error: tokenError }, { status: tokenError.includes("non configuré") ? 503 : 401 }) };
  if (rateLimited()) return { error: NextResponse.json({ error: "Rate limit dépassé (60 req/min)." }, { status: 429 }) };
  const userId = req.headers.get("x-user-id");
  if (!userId) return { error: NextResponse.json({ error: "En-tête x-user-id requis (contexte utilisateur)." }, { status: 401 }) };
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.emailVerified) {
    return { error: NextResponse.json({ error: "Utilisateur inconnu ou email non vérifié." }, { status: 401 }) };
  }
  if (!roleAtLeast(user.role, minRole)) {
    return { error: NextResponse.json({ error: `Grade insuffisant (requis : ${minRole}).` }, { status: 403 }) };
  }
  return { user };
}
