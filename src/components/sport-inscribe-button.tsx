"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  slug: string;
  sportName: string;
  loggedIn: boolean;
  isMember: boolean;
  alreadyMember: boolean;
};

export function SportInscribeButton({ slug, sportName, loggedIn, isMember, alreadyMember }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    if (!loggedIn) {
      router.push(`/connexion?callbackUrl=${encodeURIComponent(`/sports/${slug}`)}`);
      return;
    }
    if (!isMember) {
      router.push("/mon-compte/cotisation");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    const res = await fetch(`/api/sports/${slug}/inscribe`, { method: "POST" });
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
    setMessage(`Inscription à la section ${sportName} enregistrée !`);
    router.refresh();
  }

  if (alreadyMember) {
    return (
      <p className="mt-8 inline-block rounded-full border border-bds-orange/40 bg-bds-orange/10 px-6 py-3 font-semibold text-bds-orange">
        Tu fais déjà partie de cette équipe
      </p>
    );
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="rounded-full bg-bds-orange px-8 py-3 font-display text-lg font-bold uppercase tracking-wide text-bds-black transition-colors hover:bg-bds-orangeDark disabled:opacity-50"
      >
        {loading ? "…" : "S'inscrire"}
      </button>
      {!loggedIn || !isMember ? (
        <p className="mt-3 text-sm text-white/50">Connexion requise{!isMember ? " + cotisation BDS" : ""} pour s'inscrire.</p>
      ) : null}
      {message ? <p className="mt-3 rounded-xl border border-bds-orange/40 bg-bds-orange/10 px-4 py-3 text-sm text-bds-orange">{message}</p> : null}
      {error ? <p className="mt-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
