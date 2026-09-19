import fs from "fs";
import path from "path";

const SENT_LOG_FILE = path.join(process.cwd(), "data", "sent_log.json");

interface SentRecord {
  email: string;
  date: string; // "YYYY-MM-DD"
  sentAt: string; // ISO string
}

function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Checks if the specified email has already received a birthday email today.
 * Guarantees zero duplicate emails to the same person on the same day.
 */
export function hasReceivedBirthdayEmailToday(email: string): boolean {
  try {
    if (!fs.existsSync(SENT_LOG_FILE)) return false;
    const raw = fs.readFileSync(SENT_LOG_FILE, "utf-8").trim();
    if (!raw) return false;
    const list: SentRecord[] = JSON.parse(raw);
    const today = getTodayDateString();
    return list.some(
      (r) => r.email.toLowerCase() === email.trim().toLowerCase() && r.date === today
    );
  } catch {
    return false;
  }
}

/**
 * Records that an email was sent to the specified recipient today.
 */
export function markBirthdayEmailSentToday(email: string): void {
  try {
    const dir = path.dirname(SENT_LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let list: SentRecord[] = [];
    if (fs.existsSync(SENT_LOG_FILE)) {
      const raw = fs.readFileSync(SENT_LOG_FILE, "utf-8").trim();
      if (raw) list = JSON.parse(raw);
    }

    const today = getTodayDateString();
    // Only push if not already recorded
    if (!list.some((r) => r.email.toLowerCase() === email.trim().toLowerCase() && r.date === today)) {
      list.push({
        email: email.trim().toLowerCase(),
        date: today,
        sentAt: new Date().toISOString(),
      });
      // Keep only last 1000 records to prevent file growth
      if (list.length > 1000) list = list.slice(list.length - 1000);
      fs.writeFileSync(SENT_LOG_FILE, JSON.stringify(list, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("[sentHistory] Failed to write sent record:", err);
  }
}
