import Link from "next/link";
import { WEEKDAYS } from "@/lib/site";

export type SessionWithSport = {
  id: string;
  weekday: number;
  startTime: string;
  endTime: string;
  location: string | null;
  sport: { name: string; slug: string };
};

export function PlanningWeek({ sessions }: { sessions: SessionWithSport[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
      {WEEKDAYS.slice(1).map((day, index) => {
        const daySessions = sessions.filter((s) => s.weekday === index + 1);
        return (
          <div key={day} className="rounded-2xl border border-white/10 bg-bds-coal p-3">
            <p className="font-display text-sm font-bold uppercase tracking-wide text-bds-orange">{day}</p>
            {daySessions.length === 0 ? (
              <p className="mt-3 text-xs text-white/40">Pas de séance</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {daySessions.map((s) => (
                  <li key={s.id}>
                    <Link href={`/sports/${s.sport.slug}`} className="block rounded-lg bg-white/5 p-2 transition-colors hover:bg-white/10">
                      <p className="text-sm font-semibold text-white">{s.sport.name}</p>
                      <p className="text-xs text-white/60">
                        {s.startTime} – {s.endTime}
                      </p>
                      <p className="text-xs text-white/40">{s.location ?? "Lieu à confirmer"}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
