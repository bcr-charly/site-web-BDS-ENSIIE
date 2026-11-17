import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { formatCents } from "@/lib/site";

export const metadata: Metadata = {
  title: "Créer un compte",
};

export default function InscriptionPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-extrabold text-white">Adhérer au BDS</h1>
      <p className="mt-4 text-white/70">
        La création de compte (adresse <span className="font-semibold text-bds-orange">@ensiie.eu</span> avec
        vérification par email, puis paiement de la cotisation de{" "}
        <span className="font-semibold text-bds-orange">{formatCents(SITE.cotisationCents)}</span> via HelloAsso) sera
        disponible dans la prochaine phase du projet.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-bds-orange px-6 py-3 font-semibold text-bds-black transition-colors hover:bg-bds-orangeDark"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
