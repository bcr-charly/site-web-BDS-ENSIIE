"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { NAV_ITEMS } from "@/lib/site";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const loggedIn = status === "authenticated";

  const accountLink = (
    <Link
      href={loggedIn ? "/mon-compte" : "/connexion"}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        loggedIn
          ? "bg-bds-orange text-bds-black hover:bg-bds-orangeDark"
          : "border border-bds-orange text-bds-orange hover:bg-bds-orange hover:text-bds-black"
      }`}
    >
      {loggedIn ? "Mon compte" : "Connexion"}
    </Link>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-bds-black/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image src="/logo.svg" alt="Logo BDS ENSIIE" width={132} height={26} priority />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-bds-orange text-bds-black" : "text-white hover:bg-white/10"
                }`}
              >
                {item.label}
                {"badge" in item && item.badge ? (
                  <span className="rounded-full bg-bds-orange px-1.5 py-0.5 text-[10px] font-bold uppercase text-bds-black">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
          <span className="ml-2">{accountLink}</span>
        </div>

        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 md:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-bds-black px-4 py-3 md:hidden">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium ${
                  active ? "bg-bds-orange text-bds-black" : "text-white hover:bg-white/10"
                }`}
              >
                {item.label}
                {"badge" in item && item.badge ? (
                  <span className="rounded-full bg-bds-orange px-1.5 py-0.5 text-[10px] font-bold uppercase text-bds-black">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
          <div className="mt-2">{accountLink}</div>
        </div>
      ) : null}
    </header>
  );
}
