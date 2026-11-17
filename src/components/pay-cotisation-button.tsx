"use client";

import { useState } from "react";
import { formatCents } from "@/lib/site";

export function PayCotisationButton({ amountCents }: { amountCents: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/payments/cotisation", { method: "POST" });
    const data = await res.json().catch(() => null);
    setLoading(false);
    if (!res.ok) {
      setError(data?.error ?? "Impossible de démarrer le paiement.");
      return;
    }
    window.location.href = data.url;
  }

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="rounded-full bg-bds-orange px-6 py-3 font-semibold text-bds-black transition-colors hover:bg-bds-orangeDark disabled:opacity-50"
      >
        {loading ? "Redirection…" : `Payer la cotisation (${formatCents(amountCents)})`}
      </button>
      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
