import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { v4 as uuidv4 } from "uuid";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Admin {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

export interface AdminSession {
  id: string;
  username: string;
}

// ─── File paths ───────────────────────────────────────────────────────────────

const ADMINS_FILE = path.join(process.cwd(), "data", "admins.json");

// ─── JWT secret ───────────────────────────────────────────────────────────────

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "itorigin-birthday-pulse-secret-key-2025"
);

const COOKIE_NAME = "admin_token";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

// ─── File helpers ─────────────────────────────────────────────────────────────

function readAdmins(): Admin[] {
  try {
    if (!fs.existsSync(ADMINS_FILE)) {
      fs.writeFileSync(ADMINS_FILE, "[]", "utf-8");
      return [];
    }
    const raw = fs.readFileSync(ADMINS_FILE, "utf-8").trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAdmins(admins: Admin[]): void {
  const dir = path.dirname(ADMINS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2), "utf-8");
}

// ─── Seed default admin on first run ─────────────────────────────────────────

export function ensureDefaultAdmin(): void {
  const admins = readAdmins();
  if (admins.length === 0) {
    const passwordHash = bcrypt.hashSync("admin123", 10);
    const defaultAdmin: Admin = {
      id: uuidv4(),
      username: "admin",
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    writeAdmins([defaultAdmin]);
  }
}

// ─── Admin CRUD ───────────────────────────────────────────────────────────────

export function getAllAdmins(): Omit<Admin, "passwordHash">[] {
  ensureDefaultAdmin();
  return readAdmins().map(({ id, username, createdAt }) => ({
    id,
    username,
    createdAt,
  }));
}

export function addAdmin(username: string, password: string): Omit<Admin, "passwordHash"> {
  ensureDefaultAdmin();
  const admins = readAdmins();
  if (admins.some((a) => a.username.toLowerCase() === username.toLowerCase())) {
    throw new Error("Username already exists");
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  const newAdmin: Admin = {
    id: uuidv4(),
    username: username.trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  admins.push(newAdmin);
  writeAdmins(admins);
  return { id: newAdmin.id, username: newAdmin.username, createdAt: newAdmin.createdAt };
}

export function removeAdmin(id: string): boolean {
  const admins = readAdmins();
  if (admins.length <= 1) throw new Error("Cannot remove the last admin");
  const filtered = admins.filter((a) => a.id !== id);
  if (filtered.length === admins.length) return false;
  writeAdmins(filtered);
  return true;
}

// ─── Authentication ───────────────────────────────────────────────────────────

export async function verifyCredentials(
  username: string,
  password: string
): Promise<AdminSession | null> {
  ensureDefaultAdmin();
  const admins = readAdmins();
  const admin = admins.find(
    (a) => a.username.toLowerCase() === username.toLowerCase()
  );
  if (!admin) return null;
  const valid = bcrypt.compareSync(password, admin.passwordHash);
  if (!valid) return null;
  return { id: admin.id, username: admin.username };
}

// ─── JWT Token ────────────────────────────────────────────────────────────────

export async function createToken(session: AdminSession): Promise<string> {
  return new SignJWT({ id: session.id, username: session.username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.id && payload.username) {
      return { id: payload.id as string, username: payload.username as string };
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Cookie helpers (for use in route handlers) ───────────────────────────────

export { COOKIE_NAME, COOKIE_MAX_AGE };

// ─── Session from request cookies ─────────────────────────────────────────────

export async function getSessionFromRequest(
  request: Request
): Promise<AdminSession | null> {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("="))];
    })
  );
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  return verifyToken(token);
}
