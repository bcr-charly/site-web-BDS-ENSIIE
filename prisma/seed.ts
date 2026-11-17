import { CompetitionType, PrismaClient, Role, TeamRole } from "@prisma/client";

const prisma = new PrismaClient();

const SPORTS: { slug: string; name: string; description: string }[] = [
  {
    slug: "basket",
    name: "Basketball",
    description:
      "Matchs amicaux et championnat FFSU. Entraînements ouverts à tous les niveaux, du débutant au confirmé.",
  },
  {
    slug: "foot",
    name: "Football",
    description:
      "Foot en salle et en extérieur selon la saison. Tournois inter-écoles et championnat FFSU au programme.",
  },
  {
    slug: "volley",
    name: "Volley-ball",
    description:
      "Section historique du BDS : entraînements réguliers et matchs FFSU en salle. Ambiance garantie.",
  },
  {
    slug: "badminton",
    name: "Badminton",
    description: "Volants, smashs et tournois : la section badminton accueille tous les niveaux en gymnase.",
  },
  {
    slug: "muscu-street",
    name: "Muscu / Street workout",
    description: "Renforcement musculaire et street workout, en salle ou en extérieur selon les envies du groupe.",
  },
  {
    slug: "arts-martiaux",
    name: "Arts martiaux / Sparring",
    description: "Boxe, MMA et sparring encadré. Initiation et perfectionnement, dans le respect et la sécurité.",
  },
  {
    slug: "course",
    name: "Course à pied",
    description: "Sorties running autour du campus, footings et courses populaires. Prépare l'Ekiden avec nous.",
  },
  {
    slug: "natation",
    name: "Natation",
    description: "Séances en piscine : endurance, technique et préparation aux compétitions universitaires.",
  },
  {
    slug: "rugby",
    name: "Rugby",
    description: "Touch rugby et rugby à XV selon la saison. Esprit d'équipe et troisième mi-temps au rendez-vous.",
  },
];

const KNOWN_SESSIONS: { sportSlug: string; weekday: number; startTime: string; endTime: string }[] = [
  { sportSlug: "volley", weekday: 1, startTime: "18:15", endTime: "20:15" },
  { sportSlug: "foot", weekday: 1, startTime: "20:30", endTime: "22:00" },
  { sportSlug: "badminton", weekday: 4, startTime: "18:15", endTime: "20:00" },
];

const BUREAU: { poste: string; firstName: string; lastName: string; promoYear: number; role: Role }[] = [
  { poste: "Président", firstName: "Camille", lastName: "Dupont", promoYear: 2027, role: Role.BDS },
  { poste: "Vice-président", firstName: "Hugo", lastName: "Martin", promoYear: 2027, role: Role.BDS },
  { poste: "Trésorier", firstName: "Léa", lastName: "Bernard", promoYear: 2028, role: Role.BDS },
  { poste: "Secrétaire général", firstName: "Louis", lastName: "Petit", promoYear: 2028, role: Role.BDS },
  { poste: "Respo logistique", firstName: "Emma", lastName: "Richard", promoYear: 2027, role: Role.BDS },
  { poste: "Respo compétition", firstName: "Nathan", lastName: "Durand", promoYear: 2026, role: Role.BDS },
  { poste: "Respo communication", firstName: "Chloé", lastName: "Moreau", promoYear: 2027, role: Role.BDS },
  { poste: "Respo innovation", firstName: "Lucas", lastName: "Simon", promoYear: 2028, role: Role.BDS },
  { poste: "Respo relation entreprise", firstName: "Manon", lastName: "Laurent", promoYear: 2026, role: Role.BDS },
  { poste: "Respo DSI", firstName: "Thomas", lastName: "Michel", promoYear: 2026, role: Role.ADMIN },
  { poste: "Respo soirée", firstName: "Sarah", lastName: "Lefebvre", promoYear: 2027, role: Role.BDS },
  { poste: "Chargé de mission", firstName: "Antoine", lastName: "Garcia", promoYear: 2028, role: Role.BDS },
];

const FIRST_NAMES = [
  "Adam", "Inès", "Noah", "Jade", "Raphaël", "Louise", "Gabriel", "Alice", "Louis", "Emma",
  "Hugo", "Chloé", "Nathan", "Léa", "Tom", "Manon", "Lucas", "Sarah", "Enzo", "Clara",
  "Mathis", "Anna", "Théo", "Juliette", "Maxime", "Laura", "Paul", "Nina", "Ethan", "Zoé",
];
const LAST_NAMES = [
  "Martin", "Bernard", "Petit", "Durand", "Richard", "Moreau", "Simon", "Laurent", "Michel", "Lefebvre",
  "Garcia", "David", "Roux", "Fournier", "Morel", "Girard", "André", "Bonnet", "Dupont", "Lambert",
  "Fontaine", "Rousseau", "Vincent", "Muller", "Lefevre", "Fontaine", "Blanchard", "Guerin", "Henry", "Roussel",
];

function slugEmail(firstName: string, lastName: string): string {
  const clean = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  return `${clean(firstName)}.${clean(lastName)}@ensiie.eu`;
}

const inDays = (n: number) => new Date(Date.now() + n * 86400000);

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.competition.deleteMany();
  await prisma.adhesion.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.session.deleteMany();
  await prisma.bdsMember.deleteMany();
  await prisma.sport.deleteMany();
  await prisma.user.deleteMany();

  let nameIndex = 0;
  const nextName = () => {
    const firstName = FIRST_NAMES[nameIndex % FIRST_NAMES.length];
    const lastName = LAST_NAMES[Math.floor(nameIndex / FIRST_NAMES.length) % LAST_NAMES.length];
    nameIndex += 1;
    return { firstName, lastName };
  };

  const bureauUsers = [];
  for (const [index, member] of BUREAU.entries()) {
    const user = await prisma.user.create({
      data: {
        email: slugEmail(member.firstName, member.lastName),
        firstName: member.firstName,
        lastName: member.lastName,
        promoYear: member.promoYear,
        role: member.role,
        passwordHash: "SEED_PLACEHOLDER_NOT_A_REAL_HASH",
        bdsProfile: { create: { poste: member.poste, displayOrder: index } },
      },
    });
    bureauUsers.push(user);
  }

  const sportRecords = new Map<string, { id: string; captainId: string | null }>();
  for (const sport of SPORTS) {
    const captainName = nextName();
    const captain = await prisma.user.create({
      data: {
        email: slugEmail(captainName.firstName, captainName.lastName),
        firstName: captainName.firstName,
        lastName: captainName.lastName,
        promoYear: 2026,
        passwordHash: "SEED_PLACEHOLDER_NOT_A_REAL_HASH",
      },
    });
    const created = await prisma.sport.create({
      data: {
        name: sport.name,
        slug: sport.slug,
        description: sport.description,
        captainId: captain.id,
      },
    });
    await prisma.teamMember.create({
      data: { userId: captain.id, sportId: created.id, role: TeamRole.CAPTAIN, jerseyNumber: 1 },
    });
    for (let i = 0; i < 2; i += 1) {
      const p = nextName();
      const player = await prisma.user.create({
        data: {
          email: slugEmail(p.firstName, p.lastName),
          firstName: p.firstName,
          lastName: p.lastName,
          promoYear: 2027 + (i % 2),
          passwordHash: "SEED_PLACEHOLDER_NOT_A_REAL_HASH",
        },
      });
      await prisma.teamMember.create({
        data: { userId: player.id, sportId: created.id, role: TeamRole.PLAYER, jerseyNumber: 5 + i * 3 + SPORTS.indexOf(sport) },
      });
    }
    sportRecords.set(sport.slug, { id: created.id, captainId: captain.id });
  }

  for (const session of KNOWN_SESSIONS) {
    const sport = sportRecords.get(session.sportSlug);
    if (!sport) continue;
    await prisma.session.create({
      data: {
        sportId: sport.id,
        weekday: session.weekday,
        startTime: session.startTime,
        endTime: session.endTime,
      },
    });
  }

  await prisma.competition.createMany({
    data: [
      {
        name: "Ekiden de l'ENSIIE",
        slug: "ekiden-ensiie",
        type: CompetitionType.EVENEMENT,
        description:
          "La course relais de l'ENSIIE : équipes de 6 coureurs, 42 km au total, suivis d'un barbecue sur le campus.",
        date: inDays(45),
        location: "Campus de l'ENSIIE",
        priceCents: 500,
        maxSlots: 120,
        isOpen: true,
      },
      {
        name: "Championnat FFSU — Football",
        slug: "championnat-ffsu-foot",
        type: CompetitionType.CHAMPIONNAT,
        description: "Matchs de championnat universitaire FFSU. Effectif limité, inscription par le capitaine.",
        date: inDays(20),
        location: "Stade à confirmer",
        priceCents: 1000,
        deadline: inDays(13),
        maxSlots: 18,
        isOpen: true,
      },
      {
        name: "Tournoi inter-écoles — Volley-ball",
        slug: "tournoi-inter-ecoles-volley",
        type: CompetitionType.COMPETITION,
        description: "Tournoi amical entre écoles d'ingénieurs. Équipes de 6, inscriptions ouvertes à tous les membres.",
        date: inDays(30),
        location: "Gymnase à confirmer",
        priceCents: 0,
        maxSlots: 8,
        isOpen: true,
      },
      {
        name: "Tournoi de rentrée — Badminton",
        slug: "tournoi-rentree-badminton",
        type: CompetitionType.COMPETITION,
        description: "Tournoi de rentrée en double. Consolante et tableau principal.",
        date: inDays(-20),
        location: "Gymnase à confirmer",
        priceCents: 300,
        maxSlots: 16,
        isOpen: false,
      },
    ],
  });

  const counts = {
    users: await prisma.user.count(),
    sports: await prisma.sport.count(),
    sessions: await prisma.session.count(),
    teamMembers: await prisma.teamMember.count(),
    bdsMembers: await prisma.bdsMember.count(),
    competitions: await prisma.competition.count(),
  };
  console.log("Seed terminé :", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
