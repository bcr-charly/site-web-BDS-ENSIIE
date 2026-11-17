import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  const firstName = String(body?.firstName ?? "").trim();
  const lastName = String(body?.lastName ?? "").trim();
  const promoYear = Number(body?.promoYear ?? 0) || null;

  if (!email.endsWith("@ensiie.eu")) {
    return NextResponse.json({ error: "Seules les adresses @ensiie.eu peuvent créer un compte." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Le mot de passe doit faire au moins 8 caractères." }, { status: 400 });
  }
  if (!firstName || !lastName) {
    return NextResponse.json({ error: "Prénom et nom sont requis." }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Un compte existe déjà avec cette adresse." }, { status: 409 });
  }

  await prisma.user.create({
    data: { email, firstName, lastName, promoYear, passwordHash: await hashPassword(password) },
  });
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: { identifier: email, token, expires: new Date(Date.now() + 24 * 3600_000) },
  });
  const base = process.env.APP_URL ?? "http://localhost:3000";
  const link = `${base}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
  await sendMail({
    to: email,
    subject: "Vérifie ton compte BDS ENSIIE",
    text: `Bienvenue au BDS ENSIIE ! Confirme ton adresse en cliquant sur ce lien : ${link}`,
    link,
  });
  return NextResponse.json({ ok: true });
}
