"use client";

import { useState } from "react";

type Initial = {
  firstName: string;
  lastName: string;
  promoYear: number | null;
  phone: string | null;
  birthDate: string | null;
};

export function ProfilForm({ initial }: { initial: Initial }) {
  const [form, setForm] = useState({
    firstName: initial.firstName,
    lastName: initial.lastName,
    promoYear: initial.promoYear?.toString() ?? "",
    phone: initial.phone ?? "",
    birthDate: initial.birthDate ?? "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    const res = await fetch("/api/mon-compte/profil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        promoYear: Number(form.promoYear) || null,
        phone: form.phone || null,
        birthDate: form.birthDate || null,
      }),
    });
    const data = await res.json().catch(() => null);
    setLoading(false);
    if (!res.ok) {
      setError(data?.error ?? "Erreur lors de l'enregistrement.");
      return;
    }
    setMessage("Profil mis à jour.");
  }

  const inputClass =
    "w-full rounded-xl border border-white/15 bg-bds-coal px-4 py-3 text-white placeholder:text-white/30 focus:border-bds-orange focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4">
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="promoYear" className="mb-1 block text-sm font-medium text-white/80">Promo</label>
          <input id="promoYear" type="number" min="2020" max="2035" value={form.promoYear} onChange={(e) => setForm({ ...form, promoYear: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-white/80">Téléphone (groupes WhatsApp)</label>
          <input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor="birthDate" className="mb-1 block text-sm font-medium text-white/80">Date de naissance</label>
        <input id="birthDate" type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} className={inputClass} />
      </div>
      {error ? <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p> : null}
      {message ? <p className="rounded-xl border border-bds-orange/40 bg-bds-orange/10 px-4 py-3 text-sm text-bds-orange">{message}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-bds-orange px-6 py-3 font-semibold text-bds-black transition-colors hover:bg-bds-orangeDark disabled:opacity-50"
      >
        {loading ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
