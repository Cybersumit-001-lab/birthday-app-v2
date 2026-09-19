export interface Employee {
  id: string;
  name: string;
  email: string;
  birth_month: number;
  birth_day: number;
  created_at?: string;
  updated_at?: string;
}

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getAvatarGradient(name: string): string {
  const gradients = [
    "from-red-600 to-rose-700",
    "from-rose-600 to-pink-700",
    "from-red-500 to-amber-600",
    "from-indigo-600 to-purple-700",
    "from-blue-600 to-cyan-700",
  ];
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
}

export function getDaysUntil(birth_month: number, birth_day: number): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thisYear = new Date(today.getFullYear(), birth_month - 1, birth_day);
  const nextYear = new Date(today.getFullYear() + 1, birth_month - 1, birth_day);
  const target = thisYear < today ? nextYear : thisYear;
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
