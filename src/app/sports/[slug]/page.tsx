import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppImage } from "@/components/app-image";
import { MemberCard } from "@/components/member-card";
import { getSportBySlug } from "@/lib/data";
import { WEEKDAYS } from "@/lib/site";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sport = await getSportBySlug(slug);
  return { title: sport ? sport.name : "Sport introuvable" };
}

const ROLE_LABELS: Record<string, string> = {
  CAPTAIN: "Capitaine",
  COACH: "Coach",
  PLAYER: "Joueur",
};

export default async function SportPage({ params }: PageProps) {
  const { slug } = await params;
  const sport = await getSportBySlug(slug);
  if (!sport) notFound();

  const coach = sport.teamMembers.find((m) => m.role === "COACH");
  const captain = sport.teamMembers.find((m) => m.role === "CAPTAIN") ?? null;
  const players = sport.teamMembers.filter((m) => m.role === "PLAYER");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav aria-label="Fil d'Ariane" className="text-sm text-white/50">
        <Link href="/sports" className="hover:text-bds-orange">Sports</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{sport.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl">{sport.name}</h1>
          {sport.description ? <p className="mt-4 text-lg text-white/70">{sport.description}</p> : null}

          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
            <AppImage src={sport.imageUrl} alt={`Photo ${sport.name}`} label={sport.name.charAt(0)} className="h-full w-full" />
          </div>

          <h2 className="mt-8 font-display text-2xl font-bold text-white">Créneaux</h2>
          {sport.sessions.length === 0 ? (
            <p className="mt-2 text-white/60">Les créneaux de cette section seront bientôt affichés.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {sport.sessions.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-bds-coal px-4 py-3">
                  <span className="font-display font-bold text-bds-orange">{WEEKDAYS[s.weekday]}</span>
                  <span className="text-white">
                    {s.startTime} – {s.endTime}
                  </span>
                  <span className="text-white/50">{s.location ?? "Lieu à confirmer"}</span>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/inscription"
            className="mt-8 inline-block rounded-full bg-bds-orange px-8 py-3 font-display text-lg font-bold uppercase tracking-wide text-bds-black transition-colors hover:bg-bds-orangeDark"
          >
            S'inscrire
          </Link>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-white">L'équipe</h2>
          {sport.teamMembers.length === 0 ? (
            <p className="mt-2 text-white/60">L'équipe de cette section sera bientôt affichée.</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {captain ? (
                <MemberCard
                  firstName={captain.user.firstName}
                  lastName={captain.user.lastName}
                  roleLabel="Capitaine"
                  promoYear={captain.user.promoYear}
                  avatarUrl={captain.user.avatarUrl}
                  jerseyNumber={captain.jerseyNumber}
                />
              ) : null}
              {coach ? (
                <MemberCard
                  firstName={coach.user.firstName}
                  lastName={coach.user.lastName}
                  roleLabel="Coach"
                  promoYear={coach.user.promoYear}
                  avatarUrl={coach.user.avatarUrl}
                />
              ) : null}
              {players.map((m) => (
                <MemberCard
                  key={m.id}
                  firstName={m.user.firstName}
                  lastName={m.user.lastName}
                  roleLabel={ROLE_LABELS[m.role] ?? "Joueur"}
                  promoYear={m.user.promoYear}
                  avatarUrl={m.user.avatarUrl}
                  jerseyNumber={m.jerseyNumber}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
