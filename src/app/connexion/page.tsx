import type { Metadata } from "next";
import { Suspense } from "react";
import { ConnexionForm } from "@/components/connexion-form";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function ConnexionPage() {
  return (
    <Suspense>
      <ConnexionForm />
    </Suspense>
  );
}
