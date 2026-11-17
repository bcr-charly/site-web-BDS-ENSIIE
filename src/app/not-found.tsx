import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-bds-orange">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-white">Page introuvable</h1>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-bds-orange px-6 py-3 font-semibold text-bds-black transition-colors hover:bg-bds-orangeDark"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
