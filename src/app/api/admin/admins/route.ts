import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, getAllAdmins, addAdmin, removeAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/logger";

function unauthorized() {
  return NextResponse.json({ error: "Admin access required" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return unauthorized();

  const admins = getAllAdmins();
  return NextResponse.json(admins);
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return unauthorized();

  try {
    const body = await request.json().catch(() => ({}));
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const newAdmin = addAdmin(username, password);
    logActivity(
      "ADMIN_ADDED",
      `Admin "${session.username}" added new admin "${username}"`,
      session.username
    );
    return NextResponse.json({ success: true, admin: newAdmin });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to add admin" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Admin ID required" }, { status: 400 });
    }

    const removed = removeAdmin(id);
    if (!removed) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    logActivity(
      "ADMIN_REMOVED",
      `Admin "${session.username}" removed admin ID: ${id}`,
      session.username
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to remove admin" },
      { status: 400 }
    );
  }
}
