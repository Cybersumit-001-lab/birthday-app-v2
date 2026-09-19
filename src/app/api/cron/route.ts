import { NextRequest, NextResponse } from "next/server";
import { runBirthdayJob } from "@/lib/cronService";

export async function GET(request: NextRequest) {
  // Simple protection
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET || "birthday-secret";
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runBirthdayJob("External HTTP /api/cron");
    return NextResponse.json({
      success: true,
      message: result.message,
      count: result.count,
      results: result.results,
    });
  } catch (err: any) {
    console.error("[api/cron] Error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}
