"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function MockCheckout() {
  const router = useRouter();
  const params = useSearchParams();
  const intent = params.get("intent") ?? "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onPay() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/payments/mock/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent }),
    });
    const data = await res.json().catch(() => null);
    setLoading(false);
    if (!res.ok) {
      setError(data?.error ?? "Le paiement simulé a échoué.");
      return;
    }
    setDone(true);
    router.push("/mon-compte/paiements");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-display text-sm font-bold uppercase tracking-widest text-bds-orange">Mode test</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold text-white">Paiement simulé</h1>
      <p className="mt-4 text-white/70">
        Aucun vrai encaissement n'a lieu ici (mode mock, sans identifiants HelloAsso). Clique pour simuler un paiement
        par carte bancaire réussi.
      </p>
      {intent ? (
        <p className="mt-4 break-all rounded-xl border border-white/10 bg-bds-coal px-4 py-3 text-xs text-white/50">
          intent : {intent}
        </p>
      ) : null}
      {error ? <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p> : null}
      {done ? <p className="mt-4 text-bds-orange">Paiement validé, redirection…</p> : null}
      <button
        type="button"
        onClick={onPay}
        disabled={loading || !intent || done}
        className="mt-8 rounded-full bg-bds-orange px-8 py-3 font-semibold text-bds-black transition-colors hover:bg-bds-orangeDark disabled:opacity-50"
      >
        {loading ? "Paiement…" : "Simuler le paiement par CB"}
      </button>
    </div>
  );
}
