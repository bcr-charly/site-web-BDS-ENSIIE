import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppImage } from "@/components/app-image";
import { StatusBadge } from "@/components/status-badge";
import { competitionStatus, getCompetitionBySlug, placesRestantes } from "@/lib/data";
import { formatCents, formatDateFR, formatTimeFR } from "@/lib/site";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

const TYPE_LABELS: Record<string, string> = {
  CHAMPIONNAT: "Championnat",
  COMPETITION: "Compétition",
  EVENEMENT: "Événement",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const competition = await getCompetitionBySlug(slug);
  return {
    title: competition ? competition.name : "Compétition introuvable",
    description: competition?.description ?? undefined,
  };
}

export default async function CompetitionPage({ params }: PageProps) {
  const { slug } = await params;
  const competition = await getCompetitionBySlug(slug);
  if (!competition) notFound();

  const status = competitionStatus(competition);
  const places = placesRestantes(competition);
  const inscriptionsOuvertes = status === "OUVERTE" && (!competition.deadline || competition.deadline >= new Date());

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav aria-label="Fil d'Ariane" className="text-sm text-white/50">
        <Link href="/competitions" className="hover:text-bds-orange">Compétitions</Link>
        <span className="mx-2">/</span>
        <span className="text-white">{competition.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
          <AppImage
            src={competition.imageUrl}
            alt={`Illustration ${competition.name}`}
            label={competition.name.charAt(0)}
            className="h-full w-full"
          />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white/80">
              {TYPE_LABELS[competition.type]}
            </span>
            <StatusBadge status={status} />
          </div>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-white">{competition.name}</h1>
          {competition.description ? <p className="mt-4 text-white/70">{competition.description}</p> : null}

          <dl className="mt-6 space-y-2 text-white/80">
            <div className="flex gap-2">
              <dt className="w-32 text-white/50">Date</dt>
              <dd>
                {formatDateFR(competition.date)} à {formatTimeFR(competition.date)}
              </dd>
            </div>
            {competition.location ? (
              <div className="flex gap-2">
                <dt className="w-32 text-white/50">Lieu</dt>
                <dd>{competition.location}</dd>
              </div>
            ) : null}
            <div className="flex gap-2">
              <dt className="w-32 text-white/50">Frais</dt>
              <dd className="font-semibold text-bds-orange">
                {competition.priceCents > 0 ? formatCents(competition.priceCents) : "Gratuit"}
              </dd>
            </div>
            {places !== null ? (
              <div className="flex gap-2">
                <dt className="w-32 text-white/50">Places</dt>
                <dd>
                  {places} restante{places > 1 ? "s" : ""} sur {competition.maxSlots}
                </dd>
              </div>
            ) : null}
            {competition.deadline ? (
              <div className="flex gap-2">
                <dt className="w-32 text-white/50">Inscriptions jusqu'au</dt>
                <dd>{formatDateFR(competition.deadline)}</dd>
              </div>
            ) : null}
          </dl>

          {inscriptionsOuvertes ? (
            <Link
              href="/connexion"
              className="mt-8 inline-block rounded-full bg-bds-orange px-8 py-3 font-display text-lg font-bold uppercase tracking-wide text-bds-black transition-colors hover:bg-bds-orangeDark"
            >
              S'inscrire
            </Link>
          ) : (
            <p className="mt-8 rounded-xl border border-white/10 bg-bds-coal px-4 py-3 text-white/70">
              {status === "PASSEE"
                ? "Cette compétition est passée."
                : status === "PLEINE"
                  ? "La compétition est pleine."
                  : "Les inscriptions sont clôturées."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
