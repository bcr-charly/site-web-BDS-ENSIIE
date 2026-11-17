import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") ?? "";
  const email = (searchParams.get("email") ?? "").trim().toLowerCase();
  const base = process.env.APP_URL ?? new URL(req.url).origin;

  const record = await prisma.verificationToken.findFirst({ where: { identifier: email, token } });
  if (!record || record.expires < new Date()) {
    return NextResponse.redirect(new URL("/connexion?error=lien_invalide", base));
  }
  await prisma.user.update({ where: { email }, data: { emailVerified: new Date() } });
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  return NextResponse.redirect(new URL("/connexion?verified=1", base));
}
