import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { SportCard } from "@/components/sport-card";
import { getSports } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nos sports",
  description: "Les 9 sections sportives du BDS ENSIIE : basket, foot, volley, badminton, muscu, arts martiaux, course, natation, rugby.",
};

export default async function SportsPage() {
  const sports = await getSports();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        title="Nos sports"
        subtitle={`${sports.length} sections, des entraînements chaque semaine. Choisis un sport pour voir ses créneaux, son équipe et t'inscrire.`}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sports.map((sport) => (
          <SportCard key={sport.id} sport={sport} />
        ))}
      </div>
    </div>
  );
}
