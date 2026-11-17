import Link from "next/link";
import { NAV_ITEMS, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bds-black text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-extrabold text-bds-orange">{SITE.name}</p>
          <p className="mt-2 text-sm text-white/70">{SITE.baseline}</p>
          <p className="mt-1 text-sm text-white/70">9 sections, des entraînements chaque semaine.</p>
        </div>
        <nav aria-label="Pied de page">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Navigation</p>
          <ul className="mt-3 space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-white/80 hover:text-bds-orange">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>
              <a href={`mailto:${SITE.contactEmail}`} className="hover:text-bds-orange">
                {SITE.contactEmail}
              </a>
            </li>
            <li>
              <Link href="/mentions-legales" className="hover:text-bds-orange">
                Mentions légales
              </Link>
            </li>
            <li className="text-white/50">Réseaux sociaux : à renseigner</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {SITE.name} — {SITE.publicDomain}
      </div>
    </footer>
  );
}
