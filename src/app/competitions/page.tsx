import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { CompetitionCard } from "@/components/competition-card";
import { getCompetitions } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Compétitions",
  description: "Championnats, tournois et événements organisés par le BDS ENSIIE, avec inscription en ligne.",
};

export default async function CompetitionsPage() {
  const all = await getCompetitions();
  const now = new Date();
  const upcoming = all.filter((c) => c.date >= now);
  const past = all.filter((c) => c.date < now).reverse();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        title="Compétitions"
        subtitle="Inscris-toi en ligne. Les compétitions payantes sont réglées par carte via HelloAsso et validées automatiquement."
      />
      {all.length === 0 ? (
        <p className="text-white/60">Les compétitions de la saison seront affichées ici.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...upcoming, ...past].map((c) => (
              <CompetitionCard key={c.id} competition={c} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
