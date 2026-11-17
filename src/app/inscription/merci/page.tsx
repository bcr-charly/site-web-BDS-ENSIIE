import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vérifie ta boîte mail",
};

export default function MerciPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-extrabold text-white">Vérifie ta boîte mail</h1>
      <p className="mt-4 text-white/70">
        Un lien de vérification vient d'être envoyé à ton adresse{" "}
        <span className="font-semibold text-bds-orange">@ensiie.eu</span>. Clique dessus pour activer ton compte, puis
        la cotisation BDS te sera demandée.
      </p>
      <p className="mt-4 text-sm text-white/50">
        En développement (sans SMTP configuré), les liens sont visibles sur{" "}
        <Link href="/api/dev/mailbox" className="text-bds-orange hover:underline">
          /api/dev/mailbox
        </Link>
        .
      </p>
      <Link
        href="/connexion"
        className="mt-8 inline-block rounded-full bg-bds-orange px-6 py-3 font-semibold text-bds-black transition-colors hover:bg-bds-orangeDark"
      >
        Aller à la connexion
      </Link>
    </div>
  );
}
