import type { Metadata } from "next";
import { InscriptionForm } from "@/components/inscription-form";

export const metadata: Metadata = {
  title: "Créer un compte",
};

export default function InscriptionPage() {
  return <InscriptionForm />;
}
