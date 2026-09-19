import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export interface Employee {
  id: string;
  name: string;
  email: string;
  birth_month: number;
  birth_day: number;
  created_at: string;
  updated_at: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "employees.json");

function ensureFile(): void {
  const dir = path.dirname(DATA_FILE);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
  }
}

function readEmployees(): Employee[] {
  ensureFile();

  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8").trim();

    if (!raw) {
      fs.writeFileSync(DATA_FILE, "[]", "utf-8");
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      fs.writeFileSync(DATA_FILE, "[]", "utf-8");
      return [];
    }

    return parsed as Employee[];
  } catch {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
    return [];
  }
}

export function getAllEmployees(): Employee[] {
  return readEmployees();
}

export function saveAllEmployees(employees: Employee[]): void {
  ensureFile();
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(employees, null, 2),
    "utf-8"
  );
}

export function upsertEmployee(data: {
  name: string;
  email: string;
  birth_month: number;
  birth_day: number;
}): Employee {
  const employees = readEmployees();

  const email = data.email.trim().toLowerCase();

  const existingIndex = employees.findIndex(
    (e) => e.email.toLowerCase() === email
  );

  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    employees[existingIndex] = {
      ...employees[existingIndex],
      name: data.name.trim(),
      birth_month: data.birth_month,
      birth_day: data.birth_day,
      updated_at: now,
    };

    saveAllEmployees(employees);
    return employees[existingIndex];
  }

  const newEmployee: Employee = {
    id: uuidv4(),
    name: data.name.trim(),
    email,
    birth_month: data.birth_month,
    birth_day: data.birth_day,
    created_at: now,
    updated_at: now,
  };

  employees.push(newEmployee);
  saveAllEmployees(employees);

  return newEmployee;
}

export function getTodaysBirthdays(): Employee[] {
  const today = new Date();

  const month = today.getMonth() + 1;
  const day = today.getDate();

  return readEmployees().filter(
    (e) => e.birth_month === month && e.birth_day === day
  );
}

export function deleteEmployee(id: string): boolean {
  const employees = readEmployees();
  const filtered = employees.filter((e) => e.id !== id);
  if (filtered.length === employees.length) {
    return false;
  }
  saveAllEmployees(filtered);
  return true;
}

export function updateEmployee(
  id: string,
  data: {
    name: string;
    email: string;
    birth_month: number;
    birth_day: number;
  }
): Employee | null {
  const employees = readEmployees();
  const index = employees.findIndex((e) => e.id === id);
  if (index < 0) return null;

  const now = new Date().toISOString();
  employees[index] = {
    ...employees[index],
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    birth_month: data.birth_month,
    birth_day: data.birth_day,
    updated_at: now,
  };

  saveAllEmployees(employees);
  return employees[index];
}

