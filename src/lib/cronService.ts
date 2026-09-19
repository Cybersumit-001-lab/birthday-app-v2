import fs from "fs";
import path from "path";
import { getTodaysBirthdays, getAllEmployees, Employee } from "@/lib/db";
import { sendBirthdayEmail } from "@/lib/mailer";
import { logActivity } from "@/lib/logger";
import { hasReceivedBirthdayEmailToday, markBirthdayEmailSentToday } from "@/lib/sentHistory";

const CONFIG_FILE = path.join(process.cwd(), "data", "config.json");

export interface CronConfig {
  cronTime: string;
  lastRunTimestamp?: string;
  lastRunStatus?: string;
  lastRunCount?: number;
  lastScheduledRunKey?: string;
}

export function readConfig(): CronConfig {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return { cronTime: "00:00" };
    }
    const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      cronTime: typeof parsed.cronTime === "string" ? parsed.cronTime : "00:00",
      lastRunTimestamp: parsed.lastRunTimestamp,
      lastRunStatus: parsed.lastRunStatus,
      lastRunCount: parsed.lastRunCount,
      lastScheduledRunKey: parsed.lastScheduledRunKey,
    };
  } catch {
    return { cronTime: "00:00" };
  }
}

export function updateConfig(updates: Partial<CronConfig>): CronConfig {
  const current = readConfig();
  const next = { ...current, ...updates };
  const dir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(next, null, 2), "utf-8");
  return next;
}

// In-process mutex
let isJobRunning = false;

/**
 * Executes the birthday email dispatch for all employees who have birthdays today.
 * Strictly guarantees that each recipient receives AT MOST 1 email per day.
 */
export async function runBirthdayJob(triggeredBy: string = "Automated Scheduler") {
  if (isJobRunning) {
    console.log(`[Cron Service] ⚠️ Job is already running. Skipping concurrent trigger from ${triggeredBy}.`);
    return { success: false, count: 0, message: "Job already running" };
  }

  isJobRunning = true;
  const startTime = new Date().toISOString();
  console.log(`\n[Cron Service] 🚀 Running birthday job (Trigger: ${triggeredBy}) at ${new Date().toLocaleTimeString()}...`);

  try {
    const todayBirthdays = getTodaysBirthdays();
    const allEmployees = getAllEmployees();

    console.log(`[Cron Service] Found ${todayBirthdays.length} birthday(s) today.`);

    if (todayBirthdays.length === 0) {
      const status = `No birthdays found for today (${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })})`;
      updateConfig({
        lastRunTimestamp: startTime,
        lastRunStatus: status,
        lastRunCount: 0,
      });

      logActivity(
        "CRON_RUN",
        `[${triggeredBy}] Ran birthday check: no birthdays found for today`,
        triggeredBy
      );

      return {
        success: true,
        count: 0,
        message: status,
        results: [],
      };
    }

    const results: Array<{ name: string; email: string; status: "sent" | "failed" | "skipped"; error?: string }> = [];
    let sentCount = 0;

    for (const person of todayBirthdays) {
      // Check if recipient has ALREADY received an email today
      if (hasReceivedBirthdayEmailToday(person.email)) {
        console.log(`[Cron Service] ℹ️ Skipping ${person.name} (${person.email}) — already received birthday email today.`);
        results.push({ name: person.name, email: person.email, status: "skipped", error: "Already received email today" });
        continue;
      }

      // Mark immediately before send to prevent race conditions
      markBirthdayEmailSentToday(person.email);

      try {
        const mailResult = await sendBirthdayEmail(person, allEmployees);
        sentCount++;
        results.push({ name: person.name, email: person.email, status: "sent" });

        logActivity(
          "MAIL_SENT",
          `[${triggeredBy}] Automated Birthday Card sent to "${person.name}" (${person.email})`,
          triggeredBy
        );

        console.log(`[Cron Service] ✅ Email sent to ${person.name} (${person.email}), CC: ${mailResult.ccCount}`);
      } catch (err: any) {
        console.error(`[Cron Service] ❌ Failed to send to ${person.name}:`, err?.message);
        results.push({
          name: person.name,
          email: person.email,
          status: "failed",
          error: err?.message || String(err),
        });

        logActivity(
          "MAIL_FAILED",
          `[${triggeredBy}] Failed sending to "${person.name}": ${err?.message || "Unknown error"}`,
          triggeredBy
        );
      }
    }

    const statusMessage = sentCount > 0 
      ? `Sent ${sentCount} birthday card(s)`
      : `0 emails sent (${todayBirthdays.length} recipient(s) already received today's card)`;

    updateConfig({
      lastRunTimestamp: startTime,
      lastRunStatus: statusMessage,
      lastRunCount: sentCount,
    });

    logActivity(
      "CRON_RUN",
      `[${triggeredBy}] Completed birthday job: ${statusMessage}`,
      triggeredBy
    );

    return {
      success: true,
      count: sentCount,
      total: todayBirthdays.length,
      message: `🎉 ${statusMessage}!`,
      results,
    };
  } catch (err: any) {
    console.error("[Cron Service] ❌ Fatal error during birthday job:", err);
    updateConfig({
      lastRunTimestamp: startTime,
      lastRunStatus: `Failed: ${err?.message || "Unknown error"}`,
      lastRunCount: 0,
    });

    logActivity(
      "CRON_RUN",
      `[${triggeredBy}] Error running birthday job: ${err?.message || "Internal error"}`,
      triggeredBy
    );

    throw err;
  } finally {
    isJobRunning = false;
  }
}

/**
 * Checks if the current local system time matches the scheduled time in config.json.
 */
export async function checkAndRunScheduledJob() {
  try {
    const config = readConfig();
    const scheduledTime = config.cronTime; // e.g. "21:30"
    if (!scheduledTime) return;

    const now = new Date();
    const currentHH = String(now.getHours()).padStart(2, "0");
    const currentMM = String(now.getMinutes()).padStart(2, "0");
    const currentMinute = `${currentHH}:${currentMM}`;
    const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${currentMinute}`;

    // Check if the current time matches the scheduled time
    if (currentMinute === scheduledTime) {
      if (config.lastScheduledRunKey === dateKey) {
        return;
      }

      // Atomically claim the lock on disk
      updateConfig({ lastScheduledRunKey: dateKey });

      console.log(`\n[Cron Service] ⏰ MATCH! Local time ${currentMinute} == Scheduled ${scheduledTime}. Triggering single automated run...`);
      await runBirthdayJob(`Auto Scheduler (${scheduledTime})`);
    }
  } catch (err: any) {
    console.error("[Cron Service] Check error:", err?.message);
  }
}
