import type { Metadata } from "next";

export const metadata: Metadata = { title: "Licence FFSU" };

export default function LicencePage() {
  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl font-bold text-white">Licence FFSU</h2>
      <div className="mt-6 rounded-2xl border border-white/10 bg-bds-coal p-6">
        <p className="inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-bold uppercase text-white/70">À venir</p>
        <p className="mt-4 text-white/70">
          Le paiement de la licence FFSU (18 €) et le suivi de ton numéro de licence seront disponibles dans une
          prochaine version du site.
        </p>
      </div>
    </div>
  );
}
