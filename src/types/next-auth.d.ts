import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role: Role;
      isMember: boolean;
      emailVerified: Date | null;
    };
  }

  interface User {
    role?: Role;
    isMember?: boolean;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    isMember?: boolean;
    emailVerified?: Date | null;
  }
}
