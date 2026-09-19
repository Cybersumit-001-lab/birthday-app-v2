import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";
import { getSessionFromRequest } from "@/lib/auth";
import { logActivity } from "@/lib/logger";

export async function POST(request: Request) {
  const session = await getSessionFromRequest(request);
  if (session) {
    logActivity("ADMIN_LOGOUT", `Admin "${session.username}" logged out`, session.username);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
