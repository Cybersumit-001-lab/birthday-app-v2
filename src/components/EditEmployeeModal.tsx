"use client";

import { useState, useEffect } from "react";
import { X, User, Mail, Calendar, Cake, RefreshCw, Save } from "lucide-react";
import { Employee, monthNames } from "./types";

interface EditEmployeeModalProps {
  employee: Employee;
  onClose: () => void;
  onSaved: (updated: Employee) => void;
}

export default function EditEmployeeModal({
  employee,
  onClose,
  onSaved,
}: EditEmployeeModalProps) {
  const [form, setForm] = useState({
    name: employee.name,
    email: employee.email,
    birth_month: employee.birth_month,
    birth_day: employee.birth_day,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync if employee prop changes
  useEffect(() => {
    setForm({
      name: employee.name,
      email: employee.email,
      birth_month: employee.birth_month,
      birth_day: employee.birth_day,
    });
  }, [employee]);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/birthdays", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: employee.id, ...form }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update employee.");
      } else {
        onSaved(data.employee as Employee);
        onClose();
      }
    } catch {
      setError("Network error. Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md bg-[#0c101a] border border-red-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Edit Employee Details</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Updating record for{" "}
              <span className="text-red-300 font-semibold">{employee.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl glass-input outline-none placeholder:text-slate-500 min-h-[44px]"
                placeholder="Full name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl glass-input outline-none placeholder:text-slate-500 min-h-[44px]"
                placeholder="email@itorigin.com"
              />
            </div>
          </div>

          {/* Month & Day */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Birth Month
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  required
                  value={form.birth_month}
                  onChange={(e) =>
                    setForm({ ...form, birth_month: Number(e.target.value) })
                  }
                  className="w-full pl-9 pr-3 py-3 text-sm rounded-xl glass-input outline-none cursor-pointer appearance-none bg-slate-900 text-white min-h-[44px]"
                >
                  {monthNames.map((m, i) => (
                    <option key={i} value={i + 1} className="bg-slate-900 text-white">
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Birth Day
              </label>
              <div className="relative">
                <Cake className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  required
                  value={form.birth_day}
                  onChange={(e) =>
                    setForm({ ...form, birth_day: Number(e.target.value) })
                  }
                  className="w-full pl-9 pr-3 py-3 text-sm rounded-xl glass-input outline-none cursor-pointer appearance-none bg-slate-900 text-white min-h-[44px]"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d} className="bg-slate-900 text-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-semibold transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
