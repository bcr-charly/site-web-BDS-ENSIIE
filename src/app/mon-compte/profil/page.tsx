import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfilForm } from "@/components/profil-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Mon profil" };

export default async function ProfilPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return null;
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-white">Mes informations</h2>
      <p className="mt-1 text-sm text-white/60">Ton email ({user.email}) n'est pas modifiable.</p>
      <div className="mt-6">
        <ProfilForm
          initial={{
            firstName: user.firstName,
            lastName: user.lastName,
            promoYear: user.promoYear,
            phone: user.phone,
            birthDate: user.birthDate ? user.birthDate.toISOString().slice(0, 10) : null,
          }}
        />
      </div>
    </div>
  );
}
