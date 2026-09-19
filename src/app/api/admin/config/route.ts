import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { logActivity } from "@/lib/logger";
import { readConfig, updateConfig, checkAndRunScheduledJob, runBirthdayJob } from "@/lib/cronService";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  }

  const config = readConfig();
  const now = new Date();
  const currentHH = String(now.getHours()).padStart(2, "0");
  const currentMM = String(now.getMinutes()).padStart(2, "0");
  const currentSS = String(now.getSeconds()).padStart(2, "0");

  return NextResponse.json({
    ...config,
    serverTime: `${currentHH}:${currentMM}:${currentSS}`,
    serverTimestamp: now.toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Admin access required" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { cronTime, triggerNow } = body;

    // If admin requested an immediate trigger/test run of the daily birthday checker
    if (triggerNow) {
      const result = await runBirthdayJob(`Admin Manual Trigger (${session.username})`);
      return NextResponse.json({
        success: true,
        message: result.message,
        count: result.count,
        results: result.results,
        config: readConfig(),
      });
    }

    if (!cronTime || !/^\d{2}:\d{2}$/.test(cronTime)) {
      return NextResponse.json(
        { error: "cronTime must be in HH:MM format (e.g. 21:30)" },
        { status: 400 }
      );
    }

    const updated = updateConfig({ cronTime });

    logActivity(
      "CRON_CONFIG_UPDATED",
      `Cron schedule updated to ${cronTime} by "${session.username}"`,
      session.username
    );

    // Run a check right away in case they set it to the current minute
    checkAndRunScheduledJob().catch((e) => console.error("Immediate check error:", e));

    return NextResponse.json({ success: true, config: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update config" },
      { status: 500 }
    );
  }
}
