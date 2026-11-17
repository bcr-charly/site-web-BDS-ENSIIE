import { AppImage } from "@/components/app-image";

type MemberCardProps = {
  firstName: string;
  lastName: string;
  poste?: string;
  promoYear?: number | null;
  avatarUrl?: string | null;
  roleLabel?: string;
  jerseyNumber?: number | null;
};

export function MemberCard({ firstName, lastName, poste, promoYear, avatarUrl, roleLabel, jerseyNumber }: MemberCardProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-bds-coal p-4 text-center">
      <div className="relative mx-auto aspect-square w-full max-w-40 overflow-hidden rounded-full">
        <AppImage src={avatarUrl ?? null} alt={`Photo de ${firstName} ${lastName}`} label={initials} className="h-full w-full rounded-full" />
      </div>
      <p className="mt-3 font-display text-base font-bold text-white">
        {firstName} {lastName}
      </p>
      {poste ? <p className="text-sm font-semibold text-bds-orange">{poste}</p> : null}
      {roleLabel ? <p className="text-sm text-white/70">{roleLabel}</p> : null}
      <p className="mt-1 text-xs text-white/50">
        {[promoYear ? `Promo ${promoYear}` : null, jerseyNumber !== null && jerseyNumber !== undefined ? `#${jerseyNumber}` : null]
          .filter(Boolean)
          .join(" — ")}
      </p>
    </div>
  );
}
