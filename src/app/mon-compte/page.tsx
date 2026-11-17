import Link from "next/link";
import { auth } from "@/auth";
import { getUserAdhesion, getUserPayments, getUserRegistrations } from "@/lib/data";
import { formatCents, saisonYear } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function MonComptePage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const [adhesion, registrations, payments] = await Promise.all([
    getUserAdhesion(session.user.id),
    getUserRegistrations(session.user.id),
    getUserPayments(session.user.id),
  ]);
  const saison = saisonYear();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-bds-coal p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Cotisation {saison}-{saison + 1}</p>
        <p className={`mt-2 font-display text-2xl font-extrabold ${adhesion?.status === "PAID" ? "text-bds-orange" : "text-white"}`}>
          {adhesion?.status === "PAID" ? "Payée" : "Non payée"}
        </p>
        <p className="mt-1 text-sm text-white/60">
          {adhesion?.status === "PAID"
            ? `Montant : ${formatCents(adhesion.payment?.amountCents ?? 0)} — payée le ${adhesion.paidAt?.toLocaleDateString("fr-FR")}.`
            : "Obligatoire pour t'inscrire à un sport ou à une compétition."}
        </p>
        <Link href="/mon-compte/cotisation" className="mt-3 inline-block text-sm font-semibold text-bds-orange hover:underline">
          Voir ma cotisation
        </Link>
      </div>
      <div className="rounded-2xl border border-white/10 bg-bds-coal p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Mes inscriptions</p>
        <p className="mt-2 font-display text-2xl font-extrabold text-white">{registrations.length}</p>
        <p className="mt-1 text-sm text-white/60">
          {registrations.filter((r) => r.status === "CONFIRMED").length} confirmée(s),{" "}
          {registrations.filter((r) => r.status === "PENDING").length} en attente.
        </p>
        <Link href="/mon-compte/inscriptions" className="mt-3 inline-block text-sm font-semibold text-bds-orange hover:underline">
          Voir mes inscriptions
        </Link>
      </div>
      <div className="rounded-2xl border border-white/10 bg-bds-coal p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Mes paiements</p>
        <p className="mt-2 font-display text-2xl font-extrabold text-white">{payments.length}</p>
        <p className="mt-1 text-sm text-white/60">
          Total encaissé : {formatCents(payments.filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.amountCents, 0))}
        </p>
        <Link href="/mon-compte/paiements" className="mt-3 inline-block text-sm font-semibold text-bds-orange hover:underline">
          Voir mes paiements
        </Link>
      </div>
    </div>
  );
}
