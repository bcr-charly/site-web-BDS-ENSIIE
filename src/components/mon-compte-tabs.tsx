"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/mon-compte", label: "Tableau de bord" },
  { href: "/mon-compte/profil", label: "Profil" },
  { href: "/mon-compte/cotisation", label: "Cotisation" },
  { href: "/mon-compte/inscriptions", label: "Inscriptions" },
  { href: "/mon-compte/paiements", label: "Paiements" },
  { href: "/mon-compte/licence", label: "Licence FFSU" },
] as const;

export function MonCompteTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Espace membre" className="mt-6 flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const active = tab.href === "/mon-compte" ? pathname === "/mon-compte" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active ? "bg-bds-orange text-bds-black" : "border border-white/15 text-white hover:bg-white/10"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
