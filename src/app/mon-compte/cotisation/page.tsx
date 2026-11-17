import type { Metadata } from "next";
import { auth } from "@/auth";
import { getUserAdhesion } from "@/lib/data";
import { PayCotisationButton } from "@/components/pay-cotisation-button";
import { formatCents, saisonYear, SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Ma cotisation" };

export default async function CotisationPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const adhesion = await getUserAdhesion(session.user.id);
  const saison = saisonYear();
  const paid = adhesion?.status === "PAID";

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl font-bold text-white">Cotisation BDS — saison {saison}-{saison + 1}</h2>
      <div className="mt-6 rounded-2xl border border-white/10 bg-bds-coal p-6">
        <p className="text-sm text-white/60">Montant</p>
        <p className="font-display text-3xl font-extrabold text-white">{formatCents(SITE.cotisationCents)}</p>
        <p className="mt-4 text-sm text-white/60">Statut</p>
        {paid ? (
          <p className="mt-1 inline-block rounded-full bg-bds-orange px-3 py-1 text-sm font-bold uppercase text-bds-black">
            Payée{adhesion.paidAt ? ` le ${adhesion.paidAt.toLocaleDateString("fr-FR")}` : ""}
          </p>
        ) : (
          <>
            <p className="mt-1 inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-bold uppercase text-white/80">
              En attente
            </p>
            <div className="mt-4">
              <PayCotisationButton amountCents={SITE.cotisationCents} />
            </div>
            <p className="mt-3 text-xs text-white/40">
              Paiement encaissé par HelloAsso (aucune donnée bancaire ne transite par le site).
            </p>
          </>
        )}
      </div>
    </div>
  );
}
