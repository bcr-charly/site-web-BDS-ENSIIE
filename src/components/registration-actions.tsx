"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCents } from "@/lib/site";

type Props = {
  registrationId: string;
  competitionId: string;
  status: string;
  priceCents: number;
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  CANCELLED: "Annulée",
};

export function RegistrationActions({ registrationId, competitionId, status, priceCents }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/payments/competition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ competitionId }),
    });
    const data = await res.json().catch(() => null);
    setLoading(false);
    if (!res.ok) {
      setError(data?.error ?? "Paiement impossible.");
      return;
    }
    window.location.href = data.url;
  }

  async function cancel() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/registrations/${registrationId}`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Annulation impossible.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${status === "CONFIRMED" ? "bg-bds-orange text-bds-black" : status === "CANCELLED" ? "bg-white/10 text-white/50" : "bg-white/15 text-white"}`}>
        {STATUS_LABELS[status] ?? status}
      </span>
      {status === "PENDING" && priceCents > 0 ? (
        <button
          type="button"
          onClick={pay}
          disabled={loading}
          className="rounded-full bg-bds-orange px-4 py-1.5 text-xs font-semibold text-bds-black hover:bg-bds-orangeDark disabled:opacity-50"
        >
          Payer {formatCents(priceCents)}
        </button>
      ) : null}
      {status === "PENDING" ? (
        <button
          type="button"
          onClick={cancel}
          disabled={loading}
          className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 disabled:opacity-50"
        >
          Annuler
        </button>
      ) : null}
      {error ? <p className="w-full text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
