import Link from "next/link";
import { AppImage } from "@/components/app-image";
import { StatusBadge } from "@/components/status-badge";
import { competitionStatus, placesRestantes, type CompetitionWithCount } from "@/lib/data";
import { formatCents, formatDateFR } from "@/lib/site";

const TYPE_LABELS: Record<string, string> = {
  CHAMPIONNAT: "Championnat",
  COMPETITION: "Compétition",
  EVENEMENT: "Événement",
};

export function CompetitionCard({ competition }: { competition: CompetitionWithCount }) {
  const status = competitionStatus(competition);
  const places = placesRestantes(competition);
  return (
    <Link
      href={`/competitions/${competition.slug}`}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-bds-coal transition-colors hover:border-bds-orange"
    >
      <div className="relative aspect-[16/9]">
        <AppImage
          src={competition.imageUrl}
          alt={`Illustration ${competition.name}`}
          label={competition.name.charAt(0)}
          className="h-full w-full"
        />
        <div className="absolute left-3 top-3">
          <StatusBadge status={status} />
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{TYPE_LABELS[competition.type]}</p>
        <h3 className="mt-1 font-display text-lg font-bold text-white group-hover:text-bds-orange">{competition.name}</h3>
        <p className="mt-1 text-sm text-white/70">{formatDateFR(competition.date)}</p>
        {competition.location ? <p className="text-sm text-white/70">{competition.location}</p> : null}
        <p className="mt-2 text-sm font-semibold text-bds-orange">
          {competition.priceCents > 0 ? formatCents(competition.priceCents) : "Gratuit"}
          {places !== null ? ` — ${places} place${places > 1 ? "s" : ""} restante${places > 1 ? "s" : ""}` : ""}
        </p>
      </div>
    </Link>
  );
}
