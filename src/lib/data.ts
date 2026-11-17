import { prisma } from "@/lib/prisma";
import { saisonYear } from "@/lib/site";
import type { Competition, Session, Sport } from "@prisma/client";

export type CompetitionWithCount = Competition & {
  _count: { registrations: number };
};

export type SportWithRelations = Sport & {
  sessions: Session[];
  teamMembers: {
    id: string;
    role: string;
    jerseyNumber: number | null;
    user: { id: string; firstName: string; lastName: string; promoYear: number | null; avatarUrl: string | null };
  }[];
  captain: { id: string; firstName: string; lastName: string } | null;
};

export async function getSports() {
  return prisma.sport.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { sessions: true } } },
  });
}

export async function getSportBySlug(slug: string): Promise<SportWithRelations | null> {
  return prisma.sport.findUnique({
    where: { slug },
    include: {
      sessions: { orderBy: [{ weekday: "asc" }, { startTime: "asc" }] },
      captain: { select: { id: true, firstName: true, lastName: true } },
      teamMembers: {
        orderBy: [{ role: "asc" }, { jerseyNumber: "asc" }],
        include: {
          user: { select: { id: true, firstName: true, lastName: true, promoYear: true, avatarUrl: true } },
        },
      },
    },
  }) as Promise<SportWithRelations | null>;
}

export async function getAllSessions() {
  return prisma.session.findMany({
    orderBy: [{ weekday: "asc" }, { startTime: "asc" }],
    include: { sport: { select: { id: true, name: true, slug: true } } },
  });
}

export async function getBureauMembers() {
  return prisma.bdsMember.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, promoYear: true, avatarUrl: true } },
    },
  });
}

export async function getCompetitions(): Promise<CompetitionWithCount[]> {
  return prisma.competition.findMany({
    orderBy: { date: "asc" },
    include: { _count: { select: { registrations: { where: { status: "CONFIRMED" } } } } },
  }) as Promise<CompetitionWithCount[]>;
}

export async function getUpcomingCompetitions(limit = 3): Promise<CompetitionWithCount[]> {
  const all = await getCompetitions();
  return all.filter((c) => c.date >= new Date()).slice(0, limit);
}

export async function getMajorEvent(): Promise<CompetitionWithCount | null> {
  const all = await getCompetitions();
  return all.find((c) => c.type === "EVENEMENT" && c.date >= new Date() && c.isOpen) ?? null;
}

export async function getCompetitionBySlug(slug: string): Promise<CompetitionWithCount | null> {
  return prisma.competition.findUnique({
    where: { slug },
    include: { _count: { select: { registrations: { where: { status: "CONFIRMED" } } } } },
  }) as Promise<CompetitionWithCount | null>;
}

export type CompetitionStatus = "OUVERTE" | "PLEINE" | "PASSEE" | "CLOTUREE";

export function competitionStatus(c: CompetitionWithCount, now = new Date()): CompetitionStatus {
  if (c.date < now) return "PASSEE";
  if (!c.isOpen) return "CLOTUREE";
  if (c.maxSlots !== null && c._count.registrations >= c.maxSlots) return "PLEINE";
  return "OUVERTE";
}

export function placesRestantes(c: CompetitionWithCount): number | null {
  if (c.maxSlots === null) return null;
  return Math.max(0, c.maxSlots - c._count.registrations);
}

export async function getSessionsFiltered(sportSlug?: string) {
  return prisma.session.findMany({
    where: sportSlug ? { sport: { slug: sportSlug } } : undefined,
    orderBy: [{ weekday: "asc" }, { startTime: "asc" }],
    include: { sport: { select: { id: true, name: true, slug: true } } },
  });
}

export async function getUserAdhesion(userId: string) {
  return prisma.adhesion.findUnique({
    where: { userId_saisonYear: { userId, saisonYear: saisonYear() } },
    include: { payment: true },
  });
}

export async function getUserRegistrations(userId: string) {
  return prisma.registration.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { competition: true },
  });
}

export async function getUserPayments(userId: string) {
  return prisma.payment.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function getRegistration(userId: string, competitionId: string) {
  return prisma.registration.findUnique({ where: { userId_competitionId: { userId, competitionId } } });
}

export async function getTeamMembership(userId: string, sportId: string) {
  return prisma.teamMember.findUnique({ where: { userId_sportId: { userId, sportId } } });
}
