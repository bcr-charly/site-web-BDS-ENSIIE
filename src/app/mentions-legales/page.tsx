import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl font-extrabold text-white">Mentions légales</h1>
      <p className="mt-6 text-white/70">
        Cette page sera complétée avant la mise en ligne : nom de l'association, président, siège, hébergeur,
        politique de confidentialité et gestion des données personnelles (RGPD).
      </p>
    </div>
  );
}
