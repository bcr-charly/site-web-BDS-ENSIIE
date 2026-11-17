import type { Metadata } from "next";
import { Suspense } from "react";
import { MockCheckout } from "@/components/mock-checkout";

export const metadata: Metadata = {
  title: "Paiement (simulation)",
};

export default function MockPaiementPage() {
  return (
    <Suspense>
      <MockCheckout />
    </Suspense>
  );
}
