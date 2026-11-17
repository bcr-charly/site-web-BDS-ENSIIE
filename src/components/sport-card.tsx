import Link from "next/link";
import type { Sport } from "@prisma/client";
import { AppImage } from "@/components/app-image";

type SportCardProps = {
  sport: Sport & { _count?: { sessions: number } };
};

export function SportCard({ sport }: SportCardProps) {
  return (
    <Link
      href={`/sports/${sport.slug}`}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-bds-coal transition-colors hover:border-bds-orange"
    >
      <div className="relative aspect-[4/3]">
        <AppImage src={sport.imageUrl} alt={`Photo ${sport.name}`} label={sport.name.charAt(0)} className="h-full w-full" />
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-bold text-white group-hover:text-bds-orange">{sport.name}</h3>
        {sport.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-white/60">{sport.description}</p>
        ) : null}
        {sport._count ? (
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-bds-orange">
            {sport._count.sessions} créneau{sport._count.sessions > 1 ? "x" : ""} / semaine
          </p>
        ) : null}
      </div>
    </Link>
  );
}
