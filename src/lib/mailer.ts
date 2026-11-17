import nodemailer from "nodemailer";
import { recordDevMail } from "@/lib/dev-mailbox";

export type Mail = {
  to: string;
  subject: string;
  text: string;
  link?: string;
};

export async function sendMail(mail: Mail): Promise<void> {
  const host = process.env.SMTP_HOST;
  if (host) {
    const port = Number(process.env.SMTP_PORT ?? 587);
    const transport = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD ?? "" } : undefined,
    });
    await transport.sendMail({
      from: process.env.SMTP_FROM ?? "BDS ENSIIE <no-reply@bds.iiens.net>",
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
    });
    return;
  }
  recordDevMail(mail);
  console.log(`[mail-dev] to=${mail.to} subject=${mail.subject} link=${mail.link ?? "-"}`);
}
