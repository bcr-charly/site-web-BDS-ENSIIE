import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Boutique",
  description: "La boutique du BDS ENSIIE arrive bientôt.",
};

export default function BoutiquePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center">
      <p className="font-display text-sm font-bold uppercase tracking-widest text-bds-orange">Boutique</p>
      <h1 className="mt-4 font-display text-5xl font-extrabold text-white md:text-6xl">Bientôt disponible</h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
        Le merch officiel du BDS (hoodies, tees, accessoires) sera bientôt en vente ici, avec paiement en ligne via
        HelloAsso. En attendant, crée ton compte pour être prêt au lancement.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/inscription"
          className="rounded-full bg-bds-orange px-6 py-3 font-semibold text-bds-black transition-colors hover:bg-bds-orangeDark"
        >
          Créer un compte
        </Link>
        <Link
          href="/"
          className="rounded-full border border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-bds-black"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
