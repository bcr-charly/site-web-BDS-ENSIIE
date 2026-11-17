import Image from "next/image";
import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";

export function Hero() {
  const hasPhoto = existsSync(path.join(process.cwd(), "public", "hero.jpg"));
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-bds-black">
      {hasPhoto ? (
        <Image src="/hero.jpg" alt="Membres du BDS ENSIIE" fill priority className="object-cover opacity-40" />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#FFA500_0%,#000000_55%)] opacity-60"
        />
      )}
      <div className="relative mx-auto w-full max-w-6xl px-4 py-24">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-bds-orange">
          Bureau des sports de l'ENSIIE
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight text-white md:text-6xl">
          « Dans la vie, il y a deux types de personnes : les chasseurs et les cueilleurs. »
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/70">
          Neuf sections, des entraînements chaque semaine, des compétitions entre écoles et des événements dans la
          bonne humeur. Débutant confirmé ou compétiteur, il y a une place pour toi.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/inscription"
            className="rounded-full bg-bds-orange px-6 py-3 font-semibold text-bds-black transition-colors hover:bg-bds-orangeDark"
          >
            Adhérer
          </Link>
          <Link
            href="/sports"
            className="rounded-full border border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-bds-black"
          >
            Nos sports
          </Link>
        </div>
      </div>
    </section>
  );
}
