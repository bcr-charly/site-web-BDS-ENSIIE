import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MonCompteTabs } from "@/components/mon-compte-tabs";

export const dynamic = "force-dynamic";

export default async function MonCompteLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  if (!session.user.emailVerified) redirect("/inscription/merci");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl font-extrabold text-white">Mon compte</h1>
      <p className="mt-1 text-white/60">
        {session.user.email} —{" "}
        {session.user.isMember ? (
          <span className="font-semibold text-bds-orange">membre cotisant</span>
        ) : (
          <span className="font-semibold text-white/80">cotisation en attente</span>
        )}
      </p>
      <MonCompteTabs />
      <div className="mt-8">{children}</div>
    </div>
  );
}
