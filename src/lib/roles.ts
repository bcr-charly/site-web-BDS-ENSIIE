import type { Role } from "@prisma/client";

const ORDER: Role[] = ["STUDENT", "SPORT_MGR", "BDS", "ADMIN"];

export function roleAtLeast(role: Role, min: Role): boolean {
  return ORDER.indexOf(role) >= ORDER.indexOf(min);
}
