import { NextResponse } from "next/server";
import { listDevMails } from "@/lib/dev-mailbox";

export async function GET() {
  if (process.env.NODE_ENV === "production" || process.env.DEV_MAILBOX !== "true") {
    return NextResponse.json({ error: "Dev mailbox désactivée." }, { status: 404 });
  }
  return NextResponse.json({ mails: listDevMails() });
}
