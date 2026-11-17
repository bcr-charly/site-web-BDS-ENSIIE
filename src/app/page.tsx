import Link from "next/link";
import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import { SportCard } from "@/components/sport-card";
import { MemberCard } from "@/components/member-card";
import { CompetitionCard } from "@/components/competition-card";
import { PlanningWeek } from "@/components/planning-week";
import {
  getAllSessions,
  getBureauMembers,
  getMajorEvent,
  getSports,
  getUpcomingCompetitions,
} from "@/lib/data";
import { formatDateFR, SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [sports, sessions, bureau, competitions, event] = await Promise.all([
    getSports(),
    getAllSessions(),
    getBureauMembers(),
    getUpcomingCompetitions(3),
    getMajorEvent(),
  ]);

  return (
    <>
      <Hero />

      <div className="bg-bds-orange py-4 text-center">
        <p className="font-display text-lg font-extrabold uppercase tracking-wide text-bds-black md:text-xl">
          Le BDS est de retour — {sports.length} sports, des sessions chaque semaine
        </p>
      </div>

      <section className="bg-bds-white py-16 text-bds-black">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            dark
            title="Nos sports"
            subtitle="Neuf sections, de la muscu au rugby. Clique sur un sport pour voir ses créneaux et son équipe."
            linkHref="/sports"
            linkLabel="Tous les sports"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sports.slice(0, 6).map((sport) => (
              <SportCard key={sport.id} sport={sport} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bds-black py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            title="Planning de la semaine"
            subtitle="Tous les créneaux d'entraînement du BDS."
            linkHref="/planning"
            linkLabel="Voir le planning"
          />
          <PlanningWeek sessions={sessions} />
        </div>
      </section>

      <section className="bg-bds-white py-16 text-bds-black">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            dark
            title="L'équipe BDS"
            subtitle="Le bureau qui fait vivre le sport à l'ENSIIE."
            linkHref="/equipe"
            linkLabel="Tout le bureau"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bureau.slice(0, 8).map((m) => (
              <MemberCard
                key={m.id}
                firstName={m.user.firstName}
                lastName={m.user.lastName}
                poste={m.poste}
                promoYear={m.user.promoYear}
                avatarUrl={m.user.avatarUrl}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bds-black py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            title="Compétitions à venir"
            subtitle="Inscris-toi en ligne depuis la page de la compétition."
            linkHref="/competitions"
            linkLabel="Toutes les compétitions"
          />
          {competitions.length === 0 ? (
            <p className="text-white/60">Les compétitions de la saison seront affichées ici.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {competitions.map((c) => (
                <CompetitionCard key={c.id} competition={c} />
              ))}
            </div>
          )}
        </div>
      </section>

      {event ? (
        <section className="bg-bds-orange py-16 text-bds-black">
          <div className="mx-auto max-w-6xl px-4">
            <p className="font-display text-sm font-bold uppercase tracking-widest">L'événement majeur</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold md:text-5xl">{event.name}</h2>
            <p className="mt-2 text-lg">{formatDateFR(event.date)}</p>
            {event.location ? <p className="text-lg">{event.location}</p> : null}
            <Link
              href={`/competitions/${event.slug}`}
              className="mt-6 inline-block rounded-full bg-bds-black px-6 py-3 font-semibold text-white transition-colors hover:bg-bds-smoke"
            >
              S'inscrire
            </Link>
          </div>
        </section>
      ) : null}

      <section className="bg-bds-black py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl">La boutique arrive bientôt</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Le merch du BDS (hoodies, tees, gourdes) sera en vente ici très prochainement. Crée déjà ton compte pour
            être prêt.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/boutique"
              className="rounded-full border border-bds-orange px-6 py-3 font-semibold text-bds-orange transition-colors hover:bg-bds-orange hover:text-bds-black"
            >
              Voir la boutique
            </Link>
            <Link
              href="/inscription"
              className="rounded-full bg-bds-orange px-6 py-3 font-semibold text-bds-black transition-colors hover:bg-bds-orangeDark"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </section>

      <p className="sr-only">{SITE.name}</p>
    </>
  );
}
