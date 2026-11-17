import type { Metadata } from "next";
import { auth } from "@/auth";
import { getUserPayments } from "@/lib/data";
import { formatCents, formatDateFR, formatTimeFR } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Mes paiements" };

const KIND_LABELS: Record<string, string> = {
  COTISATION: "Cotisation BDS",
  COMPETITION: "Frais de compétition",
  LICENCE_FFSU: "Licence FFSU",
  ORDER: "Boutique",
};

export default async function PaiementsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const payments = await getUserPayments(session.user.id);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-white">Mes paiements et reçus</h2>
      {payments.length === 0 ? (
        <p className="mt-4 text-white/60">Aucun paiement pour l'instant.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {payments.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-bds-coal p-4">
              <div>
                <p className="font-semibold text-white">{KIND_LABELS[p.kind] ?? p.kind}</p>
                <p className="text-sm text-white/60">
                  {formatDateFR(p.createdAt)} à {formatTimeFR(p.createdAt)}
                  {p.payerName ? ` — payeur : ${p.payerName}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${p.status === "PAID" ? "bg-bds-orange text-bds-black" : p.status === "CANCELLED" ? "bg-white/10 text-white/50" : "bg-white/15 text-white"}`}>
                  {p.status === "PAID" ? "Payé" : p.status === "CANCELLED" ? "Annulé" : "En attente"}
                </span>
                <span className="font-display text-lg font-bold text-white">{formatCents(p.amountCents)}</span>
                {p.receiptUrl ? (
                  <a href={p.receiptUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-bds-orange hover:underline">
                    Reçu
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
