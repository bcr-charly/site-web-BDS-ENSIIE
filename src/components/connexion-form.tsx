"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export function ConnexionForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    params.get("error") === "lien_invalide" ? "Lien de vérification invalide ou expiré." : null,
  );
  const [loading, setLoading] = useState(false);

  const verified = params.get("verified") === "1";
  const callbackUrl = params.get("callbackUrl") ?? "/mon-compte";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <h1 className="font-display text-4xl font-extrabold text-white">Connexion</h1>
      <p className="mt-2 text-white/70">
        Espace membre réservé aux comptes <span className="font-semibold text-bds-orange">@ensiie.eu</span> vérifiés.
      </p>
      {verified ? (
        <p className="mt-4 rounded-xl border border-bds-orange/40 bg-bds-orange/10 px-4 py-3 text-sm text-bds-orange">
          Ton email est vérifié, tu peux te connecter. La cotisation sera demandée à la première connexion.
        </p>
      ) : null}
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-white/80">Email ENSIIE</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="prenom.nom@ensiie.eu"
            className="w-full rounded-xl border border-white/15 bg-bds-coal px-4 py-3 text-white placeholder:text-white/30 focus:border-bds-orange focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-white/80">Mot de passe</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-bds-coal px-4 py-3 text-white focus:border-bds-orange focus:outline-none"
          />
        </div>
        {error ? <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-bds-orange px-6 py-3 font-semibold text-bds-black transition-colors hover:bg-bds-orangeDark disabled:opacity-50"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-white/60">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-semibold text-bds-orange hover:underline">
          Adhérer au BDS
        </Link>
      </p>
    </div>
  );
}
