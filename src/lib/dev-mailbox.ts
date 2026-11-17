export type DevMail = {
  to: string;
  subject: string;
  text: string;
  link?: string;
  at: string;
};

const g = globalThis as unknown as { devMails?: DevMail[] };

export function recordDevMail(mail: Omit<DevMail, "at">): void {
  if (!g.devMails) g.devMails = [];
  g.devMails.unshift({ ...mail, at: new Date().toISOString() });
  if (g.devMails.length > 100) g.devMails.length = 100;
}

export function listDevMails(): DevMail[] {
  return g.devMails ?? [];
}
