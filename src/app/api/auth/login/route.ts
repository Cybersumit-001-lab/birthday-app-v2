import { NextRequest, NextResponse } from "next/server";
import {
  verifyCredentials,
  createToken,
  COOKIE_NAME,
  COOKIE_MAX_AGE,
} from "@/lib/auth";
import { logActivity } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const session = await verifyCredentials(username, password);
    if (!session) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = await createToken(session);

    logActivity("ADMIN_LOGIN", `Admin "${session.username}" logged in`, session.username);

    const response = NextResponse.json({ success: true, session });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("[auth/login]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
