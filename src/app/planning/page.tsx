import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { PlanningWeek } from "@/components/planning-week";
import { getAllSessions } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Planning",
  description: "Planning hebdomadaire des entraînements du BDS ENSIIE, par sport et par jour.",
};

export default async function PlanningPage() {
  const sessions = await getAllSessions();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        title="Planning de la semaine"
        subtitle="Tous les créneaux d'entraînement. Les lieux sont confirmés au fur et à mesure par le bureau."
      />
      <PlanningWeek sessions={sessions} />
    </div>
  );
}
