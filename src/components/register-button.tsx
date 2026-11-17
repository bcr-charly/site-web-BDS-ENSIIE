"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CompetitionStatus } from "@/lib/data";
import { formatCents } from "@/lib/site";

type Props = {
  competitionId: string;
  status: CompetitionStatus;
  priceCents: number;
  loggedIn: boolean;
  isMember: boolean;
  alreadyRegistered: boolean;
  callbackUrl: string;
};

export function RegisterButton({ competitionId, status, priceCents, loggedIn, isMember, alreadyRegistered, callbackUrl }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    if (!loggedIn) {
      router.push(`/connexion?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }
    if (!isMember) {
      router.push("/mon-compte/cotisation");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ competitionId }),
    });
    const data = await res.json().catch(() => null);
    setLoading(false);
    if (!res.ok) {
      if (data?.needMembership) {
        router.push("/mon-compte/cotisation");
        return;
      }
      setError(data?.error ?? "Inscription impossible.");
      return;
    }
    if (data?.paymentUrl) {
      window.location.href = data.paymentUrl;
      return;
    }
    setMessage("Inscription enregistrée, en attente de validation par le BDS.");
    router.refresh();
  }

  if (alreadyRegistered) {
    return (
      <p className="mt-8 rounded-xl border border-bds-orange/40 bg-bds-orange/10 px-4 py-3 text-bds-orange">
        Tu es déjà inscrit à cette compétition (voir ton espace membre).
      </p>
    );
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={onClick}
        disabled={loading || status !== "OUVERTE"}
        className="rounded-full bg-bds-orange px-8 py-3 font-display text-lg font-bold uppercase tracking-wide text-bds-black transition-colors hover:bg-bds-orangeDark disabled:opacity-50"
      >
        {loading ? "…" : priceCents > 0 ? `S'inscrire — payer ${formatCents(priceCents)}` : "S'inscrire"}
      </button>
      {message ? <p className="mt-3 rounded-xl border border-bds-orange/40 bg-bds-orange/10 px-4 py-3 text-sm text-bds-orange">{message}</p> : null}
      {error ? <p className="mt-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
