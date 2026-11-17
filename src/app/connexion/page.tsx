import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function ConnexionPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-extrabold text-white">Connexion</h1>
      <p className="mt-4 text-white/70">
        L'espace membre (connexion par adresse <span className="font-semibold text-bds-orange">@ensiie.eu</span> ou
        Google) sera disponible dans la prochaine phase du projet.
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
