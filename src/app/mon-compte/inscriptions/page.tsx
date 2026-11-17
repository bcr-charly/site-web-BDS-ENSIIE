import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { getUserRegistrations } from "@/lib/data";
import { RegistrationActions } from "@/components/registration-actions";
import { formatCents, formatDateFR } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Mes inscriptions" };

export default async function InscriptionsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const registrations = await getUserRegistrations(session.user.id);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-white">Mes inscriptions</h2>
      {registrations.length === 0 ? (
        <p className="mt-4 text-white/60">
          Aucune inscription pour l'instant.{" "}
          <Link href="/competitions" className="font-semibold text-bds-orange hover:underline">
            Voir les compétitions
          </Link>
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {registrations.map((r) => (
            <li key={r.id} className="rounded-2xl border border-white/10 bg-bds-coal p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={`/competitions/${r.competition.slug}`} className="font-display text-lg font-bold text-white hover:text-bds-orange">
                    {r.competition.name}
                  </Link>
                  <p className="text-sm text-white/60">
                    {formatDateFR(r.competition.date)} — {r.competition.priceCents > 0 ? formatCents(r.competition.priceCents) : "Gratuit"}
                  </p>
                  {r.message ? <p className="mt-1 text-sm text-white/50">« {r.message} »</p> : null}
                </div>
                <RegistrationActions
                  registrationId={r.id}
                  competitionId={r.competitionId}
                  status={r.status}
                  priceCents={r.competition.priceCents}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
