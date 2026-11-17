"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function InscriptionForm() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", promoYear: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, promoYear: Number(form.promoYear) || null }),
    });
    const data = await res.json().catch(() => null);
    setLoading(false);
    if (!res.ok) {
      setError(data?.error ?? "Une erreur est survenue.");
      return;
    }
    router.push("/inscription/merci");
  }

  const inputClass =
    "w-full rounded-xl border border-white/15 bg-bds-coal px-4 py-3 text-white placeholder:text-white/30 focus:border-bds-orange focus:outline-none";

  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <h1 className="font-display text-4xl font-extrabold text-white">Adhérer au BDS</h1>
      <p className="mt-2 text-white/70">
        Crée ton compte avec ton adresse <span className="font-semibold text-bds-orange">@ensiie.eu</span>. Un email de
        vérification te sera envoyé, puis la cotisation sera demandée.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-white/80">Prénom</label>
            <input id="firstName" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-white/80">Nom</label>
            <input id="lastName" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="promoYear" className="mb-1 block text-sm font-medium text-white/80">Promo (ex. 2027)</label>
          <input id="promoYear" type="number" min="2020" max="2035" value={form.promoYear} onChange={(e) => setForm({ ...form, promoYear: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-white/80">Email ENSIIE</label>
          <input id="email" type="email" required placeholder="prenom.nom@ensiie.eu" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-white/80">Mot de passe (8 caractères min.)</label>
          <input id="password" type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} />
        </div>
        {error ? <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-bds-orange px-6 py-3 font-semibold text-bds-black transition-colors hover:bg-bds-orangeDark disabled:opacity-50"
        >
          {loading ? "Création…" : "Créer mon compte"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-white/60">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-semibold text-bds-orange hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
