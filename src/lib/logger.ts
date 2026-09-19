import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActivityAction =
  | "ADMIN_LOGIN"
  | "ADMIN_LOGOUT"
  | "ADMIN_ADDED"
  | "ADMIN_REMOVED"
  | "EMPLOYEE_ADDED"
  | "EMPLOYEE_UPDATED"
  | "EMPLOYEE_DELETED"
  | "MAIL_SENT"
  | "MAIL_FAILED"
  | "CRON_RUN"
  | "CRON_CONFIG_UPDATED";

export interface ActivityLog {
  id: string;
  action: ActivityAction;
  actor: string; // "system" or admin username
  detail: string;
  timestamp: string;
}

// ─── File path ────────────────────────────────────────────────────────────────

const LOG_FILE = path.join(process.cwd(), "data", "activity.json");
const MAX_LOGS = 500; // keep only latest 500 logs

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readLogs(): ActivityLog[] {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      fs.writeFileSync(LOG_FILE, "[]", "utf-8");
      return [];
    }
    const raw = fs.readFileSync(LOG_FILE, "utf-8").trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLogs(logs: ActivityLog[]): void {
  const dir = path.dirname(LOG_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), "utf-8");
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function logActivity(
  action: ActivityAction,
  detail: string,
  actor: string = "system"
): void {
  try {
    const logs = readLogs();
    const entry: ActivityLog = {
      id: uuidv4(),
      action,
      actor,
      detail,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(entry); // newest first
    // Trim to max
    if (logs.length > MAX_LOGS) logs.splice(MAX_LOGS);
    writeLogs(logs);
  } catch {
    // Logging failures should never crash the app
    console.error("[logger] Failed to write activity log");
  }
}

export function getLogs(limit = 100, offset = 0): ActivityLog[] {
  const logs = readLogs();
  return logs.slice(offset, offset + limit);
}

export function getLogsCount(): number {
  return readLogs().length;
}
