"use client";

import { useState } from "react";
import {
  UserPlus,
  User,
  Mail,
  Calendar,
  Cake,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Heart,
} from "lucide-react";
import { monthNames } from "@/components/types";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    birth_month: new Date().getMonth() + 1,
    birth_day: new Date().getDate(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/birthdays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Could not register celebration date." });
      } else {
        setMessage({ type: "success", text: `🎉 ${form.name}'s birthday registered successfully!` });
        setForm({ name: "", email: "", birth_month: new Date().getMonth() + 1, birth_day: new Date().getDate() });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please check connection." });
    } finally {
      setSubmitting(false);
    }
  }

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-2">
      <div className="w-full max-w-lg flex flex-col gap-6">

        {/* Page heading */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-red-300 text-xs font-semibold mb-3 border border-red-500/25 shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>Admin Birthday Registration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-red-400 bg-clip-text text-transparent pb-1">
            Register New Birthday
          </h2>
          <p className="text-xs text-slate-400 mt-1">Add or update team celebration dates in the local database</p>
        </div>

        {/* Toast */}
        {message && (
          <div className={`p-4 rounded-2xl text-sm font-semibold flex items-center justify-between gap-3 shadow-xl animate-in fade-in duration-200 ${
            message.type === "success"
              ? "bg-emerald-950/85 border border-emerald-500/40 text-emerald-100"
              : "bg-rose-950/85 border border-rose-500/40 text-rose-100"
          }`}>
            <div className="flex items-center gap-2">
              {message.type === "success"
                ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                : <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)} className="p-1 rounded-lg hover:bg-white/10">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form Card */}
        <div className="relative">
          <div className="absolute -inset-[1px] rounded-3xl quote-border-glow opacity-60" />

          <div className="relative rounded-3xl overflow-hidden bg-[#0d111a]/85 backdrop-blur-xl p-6 sm:p-8 border border-white/5">
            <div className="absolute inset-0 quote-shimmer pointer-events-none" />

            <div className="relative z-10 flex items-center gap-3 mb-7">
              <div className="p-3 rounded-2xl bg-red-500/15 border border-red-500/25 shadow-inner">
                <UserPlus className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Employee Details</h3>
                <p className="text-[11px] text-slate-500">Existing email addresses will update saved records</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-red-400 transition-colors" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Sumit Kumar Ram"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl glass-input outline-none placeholder:text-slate-600 min-h-[44px] font-medium"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Work Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-red-400 transition-colors" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. sumit@itorigin.com"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl glass-input outline-none placeholder:text-slate-600 min-h-[44px] font-medium"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Birthday</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />
              </div>

              {/* Month & Day */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Month
                  </label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-red-400 transition-colors pointer-events-none" />
                    <select
                      required
                      value={form.birth_month}
                      onChange={(e) => setForm({ ...form, birth_month: Number(e.target.value) })}
                      className="w-full pl-9 pr-3 py-3 text-sm rounded-xl glass-input outline-none cursor-pointer appearance-none bg-transparent text-white min-h-[44px] font-medium"
                    >
                      {monthNames.map((m, i) => (
                        <option key={i} value={i + 1} className="bg-[#0d111a]">{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Day
                  </label>
                  <div className="relative group">
                    <Cake className="absolute left-3 top-3.5 w-4 h-4 text-slate-500 group-focus-within:text-red-400 transition-colors pointer-events-none" />
                    <select
                      required
                      value={form.birth_day}
                      onChange={(e) => setForm({ ...form, birth_day: Number(e.target.value) })}
                      className="w-full pl-9 pr-3 py-3 text-sm rounded-xl glass-input outline-none cursor-pointer appearance-none bg-transparent text-white min-h-[44px] font-medium"
                    >
                      {days.map((d) => (
                        <option key={d} value={d} className="bg-[#0d111a]">{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="relative w-full mt-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-all shadow-xl shadow-red-600/25 flex items-center justify-center gap-2 disabled:opacity-50 overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-red-600 via-rose-600 to-red-500 group-hover:from-red-500 group-hover:to-rose-500 transition-all duration-300" />
                <span className="relative flex items-center gap-2">
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 text-red-200" />
                      <span>Save Celebration Date</span>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
