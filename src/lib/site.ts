export const SITE = {
  name: "BDS ENSIIE",
  baseline: "Bureau des sports de l'ENSIIE",
  url: process.env.APP_URL ?? "http://localhost:3000",
  publicDomain: "bds.iiens.net",
  contactEmail: process.env.BDS_CONTACT_EMAIL ?? "bds@ensiie.eu",
  cotisationCents: Number(process.env.BDS_COTISATION_CENTS ?? 2000),
};

export const NAV_ITEMS = [
  { href: "/", label: "Accueil" },
  { href: "/sports", label: "Sports" },
  { href: "/planning", label: "Planning" },
  { href: "/equipe", label: "Équipe" },
  { href: "/competitions", label: "Compétitions" },
  { href: "/boutique", label: "Boutique", badge: "Bientôt" },
] as const;

export const WEEKDAYS = [
  "",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
] as const;

export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export function formatDateFR(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(date);
}

export function formatTimeFR(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(date);
}

export function saisonYear(now = new Date()): number {
  return now.getMonth() >= 7 ? now.getFullYear() + 1 : now.getFullYear();
}
