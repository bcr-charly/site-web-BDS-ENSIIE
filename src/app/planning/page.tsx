import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { PlanningWeek } from "@/components/planning-week";
import { getSessionsFiltered, getSports } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Planning",
  description: "Planning hebdomadaire des entraînements du BDS ENSIIE, par sport et par jour.",
};

export default async function PlanningPage({ searchParams }: { searchParams: Promise<{ sport?: string }> }) {
  const { sport: sportSlug } = await searchParams;
  const [sessions, sports] = await Promise.all([getSessionsFiltered(sportSlug), getSports()]);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        title="Planning de la semaine"
        subtitle="Tous les créneaux d'entraînement. Les lieux sont confirmés au fur et à mesure par le bureau."
      />
      <form method="get" className="mb-6 flex flex-wrap items-center gap-2">
        <label htmlFor="sport" className="text-sm text-white/60">Filtrer par sport</label>
        <select
          id="sport"
          name="sport"
          defaultValue={sportSlug ?? ""}
          className="rounded-xl border border-white/15 bg-bds-coal px-4 py-2 text-sm text-white focus:border-bds-orange focus:outline-none"
        >
          <option value="">Tous les sports</option>
          {sports.map((s) => (
            <option key={s.id} value={s.slug}>{s.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-bds-orange px-4 py-2 text-sm font-semibold text-bds-black transition-colors hover:bg-bds-orangeDark"
        >
          Filtrer
        </button>
      </form>
      <PlanningWeek sessions={sessions} />
    </div>
  );
}
