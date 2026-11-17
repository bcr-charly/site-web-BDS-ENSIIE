import type { CompetitionStatus } from "@/lib/data";

const STYLES: Record<CompetitionStatus, string> = {
  OUVERTE: "bg-bds-orange text-bds-black",
  PLEINE: "bg-white/20 text-white",
  PASSEE: "bg-white/10 text-white/60",
  CLOTUREE: "bg-red-500/80 text-white",
};

export function StatusBadge({ status }: { status: CompetitionStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${STYLES[status]}`}>
      {status === "PASSEE" ? "Passée" : status === "CLOTUREE" ? "Clôturée" : status}
    </span>
  );
}
