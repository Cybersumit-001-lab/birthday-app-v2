import { NextRequest, NextResponse } from "next/server";
import { birthdayHonoreeCardHtml, colleagueBirthdayAnnouncementHtml } from "@/lib/mailer";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "honoree"; // "honoree" or "colleague"
  const name = searchParams.get("name") || "Sumit Kumar Ram";
  const email = searchParams.get("email") || "sumit@itorigin.com";

  let html = "";
  if (type === "colleague") {
    html = colleagueBirthdayAnnouncementHtml(name, email);
  } else {
    html = birthdayHonoreeCardHtml(name);
  }

  // Replace CID with web path for browser rendering
  html = html.replace(/cid:birthdayCardArt/g, "/birthday-card-art.jpg");

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
