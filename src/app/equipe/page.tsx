import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { MemberCard } from "@/components/member-card";
import { getBureauMembers } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "L'équipe BDS",
  description: "Les membres du bureau des sports de l'ENSIIE.",
};

export default async function EquipePage() {
  const bureau = await getBureauMembers();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        title="Le bureau du BDS"
        subtitle="L'équipe qui organise les entraînements, les compétitions et les événements de l'ENSIIE."
      />
      {bureau.length === 0 ? (
        <p className="text-white/60">Les membres du bureau seront bientôt affichés.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bureau.map((m) => (
            <MemberCard
              key={m.id}
              firstName={m.user.firstName}
              lastName={m.user.lastName}
              poste={m.poste}
              promoYear={m.user.promoYear}
              avatarUrl={m.user.avatarUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
