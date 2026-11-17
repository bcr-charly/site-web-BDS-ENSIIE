import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/bricolage-grotesque/700.css";
import "@fontsource/bricolage-grotesque/800.css";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — Bureau des sports`,
    template: `%s — ${SITE.name}`,
  },
  description:
    "Bureau des sports de l'ENSIIE : 9 sections sportives, planning des entraînements, compétitions FFSU et adhésion en ligne.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-bds-black font-sans text-bds-white antialiased">
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
