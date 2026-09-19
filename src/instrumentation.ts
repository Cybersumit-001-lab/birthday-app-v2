/**
 * Next.js Server Instrumentation Hook
 * Boots when the Next.js server starts.
 * Uses a global singleton check to guarantee only ONE timer runs across worker processes.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Prevent duplicate timers if register() is invoked multiple times by Next.js
    if ((globalThis as any).__BIRTHDAY_SCHEDULER_ACTIVE__) {
      return;
    }
    (globalThis as any).__BIRTHDAY_SCHEDULER_ACTIVE__ = true;

    const { checkAndRunScheduledJob, readConfig } = await import("@/lib/cronService");

    const config = readConfig();
    console.log(`\n[Cron Scheduler] 🟢 Single active background scheduler initialized. Target: ${config.cronTime}\n`);

    // Check every 5 seconds
    setInterval(async () => {
      try {
        await checkAndRunScheduledJob();
      } catch (err: any) {
        console.error("[Cron Scheduler] Interval error:", err?.message);
      }
    }, 5000);
  }
}
