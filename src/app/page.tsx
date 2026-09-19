"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Cake,
  Calendar,
  PartyPopper,
  Users,
  Gift,
  RefreshCw,
  Award,
  BellRing,
  ShieldCheck,
  Send,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Star,
} from "lucide-react";
import { Employee, monthNames, getDaysUntil, getAvatarGradient } from "@/components/types";
import { useAuth } from "@/contexts/AuthContext";

// ─── Birthday Quotes ──────────────────────────────────────────────────────────

const BIRTHDAY_QUOTES = [
  "Another year in, and you're still the one making the office a little less boring. Happy Birthday!",
  "Here's to the person who somehow makes Monday meetings feel worth attending. Cheers! 🥂",
  "Getting older is mandatory. Getting cooler? That one's all you. 🎂",
  "Birthdays are just life's excuse to eat cake without guilt. Go for it — you've earned it.",
  "You've survived another year. That alone deserves a celebration. 🎉",
  "The team just wouldn't be the same without you. Hope your day is as great as you make ours.",
  "Not everyone gets better with time. You're one of the rare ones who does. 🌟",
  "Today we celebrate the person we'd all call first if things went sideways. Happy Birthday!",
  "Another trip around the sun, and you're still the best thing in this orbit. 🚀",
  "Age is just a number. Yours happens to look really good on you.",
  "Still the same legend, just with one more year of experience under the belt. 🎈",
  "Some people bring snacks. You bring the energy. Thanks for showing up every day.",
  "Hope your birthday is as solid as your work ethic — and twice as fun. 🎁",
  "They say fine things improve with age. Clearly they were talking about you.",
  "If today's a mess, take the day off. You've definitely put in the hours. Happy Birthday! 🥳",
];

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMailId, setSendingMailId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { isAdmin } = useAuth();

  // Pick a random quote client-side only (after mount) to avoid SSR hydration mismatch
  const [quote, setQuote] = useState("");
  useEffect(() => {
    setQuote(BIRTHDAY_QUOTES[Math.floor(Math.random() * BIRTHDAY_QUOTES.length)]);
  }, []);

  const launchConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.55 },
        colors: ["#ef4444", "#f43f5e", "#3b82f6", "#eab308"],
      });
    } catch { /* silent */ }
  }, []);

  async function loadEmployees() {
    try {
      const res = await fetch("/api/birthdays");
      const data = await res.json();
      const list: Employee[] = Array.isArray(data) ? data : [];
      setEmployees(list);

      const today = new Date();
      const m = today.getMonth() + 1;
      const d = today.getDate();
      if (list.some((e) => e.birth_month === m && e.birth_day === d)) {
        setTimeout(() => launchConfetti(), 400);
      }
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  async function handleSendMail(employeeId?: string, email?: string, name?: string) {
    const key = employeeId || email || "global";
    setSendingMailId(key);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ employeeId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to send birthday email." });
      } else {
        setMessage({ type: "success", text: data.message || `Birthday Card sent to ${name || "colleague"}! 🎉` });
        launchConfetti();
      }
    } catch {
      setMessage({ type: "error", text: "Network error while triggering email dispatch." });
    } finally {
      setSendingMailId(null);
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const enriched = employees.map((emp) => ({
    ...emp,
    daysUntil: getDaysUntil(emp.birth_month, emp.birth_day),
  }));

  const todayHonorees = enriched.filter((e) => e.daysUntil === 0);
  const upcoming30 = enriched.filter((e) => e.daysUntil <= 30).sort((a, b) => a.daysUntil - b.daysUntil);
  const thisMonth = enriched.filter((e) => e.birth_month === today.getMonth() + 1);
  const nextUp = [...enriched].sort((a, b) => a.daysUntil - b.daysUntil)[0];

  return (
    <div className="relative w-full flex-1 flex flex-col overflow-x-hidden cyber-grid">
      {/* Ambient Glow Blobs */}
      <div className="ambient-glow -top-24 -left-24 w-96 h-96 bg-red-600/20 pointer-events-none" />
      <div className="ambient-glow top-1/3 -right-24 w-[32rem] h-[32rem] bg-rose-600/15 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col gap-8">

        {/* Hero */}
        <header className="text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-red-300 text-xs sm:text-sm font-semibold mb-4 border border-red-500/25 shadow-xl animate-float">
            <ShieldCheck className="w-4 h-4 text-red-400" />
            <span>ITOrigin — Employee Celebrations Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-red-400 bg-clip-text text-transparent mb-6 leading-tight pb-2">
            ITOrigin Birthday Hub
          </h1>

          {/* Compact Quote Strip */}
          {quote && (
            <div className="relative max-w-2xl w-full animate-fade-up">
              {/* Animated border glow */}
              <div className="absolute -inset-[1px] rounded-xl quote-border-glow opacity-60" />
              {/* Card body */}
              <div className="relative rounded-xl overflow-hidden bg-[#0d111a]/80 backdrop-blur-xl px-4 sm:px-5 py-3 flex items-center gap-3">
                {/* Shimmer */}
                <div className="absolute inset-0 quote-shimmer pointer-events-none" />
                {/* Left accent bar */}
                <div className="flex-shrink-0 w-0.5 h-8 rounded-full bg-gradient-to-b from-red-500 to-rose-600 shadow-sm shadow-red-500/50" />
                {/* Icon */}
                <Sparkles className="relative z-10 w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                {/* Quote text */}
                <p className="relative z-10 text-slate-200 text-base sm:text-lg leading-snug text-left flex-1 min-w-0 font-[family-name:var(--font-display)] italic">
                  <span className="text-red-400 not-italic mr-0.5">&ldquo;</span>
                  {quote}
                  <span className="text-red-400 not-italic ml-0.5">&rdquo;</span>
                </p>
                {/* Right star */}
                <Star className="relative z-10 w-3 h-3 text-red-500/40 fill-red-500/20 flex-shrink-0" />
              </div>
            </div>
          )}
        </header>

        {/* Toast */}
        {message && (
          <div className={`p-4 rounded-2xl text-sm font-semibold flex items-center justify-between gap-3 shadow-xl backdrop-blur-xl animate-in fade-in duration-200 ${
            message.type === "success"
              ? "bg-emerald-950/85 border border-emerald-500/40 text-emerald-100"
              : "bg-rose-950/85 border border-rose-500/40 text-rose-100"
          }`}>
            <div className="flex items-center gap-3">
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)} className="p-1 rounded-lg hover:bg-white/10">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Today's Birthday Banner */}
        {todayHonorees.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/95 via-rose-950/90 to-slate-950/95 border border-red-500/40 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <PartyPopper className="w-48 h-48 text-red-300" />
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center shadow-xl shadow-red-600/40 flex-shrink-0 animate-bounce">
                  <Cake className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-red-500/30 text-red-200 border border-red-400/40">
                      TODAY&apos;S HONOREE
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Happy Birthday, {todayHonorees.map((h) => h.name).join(" & ")}! 🎂
                  </h2>
                  <p className="text-sm text-red-100/80 mt-1">
                    Wishing you an amazing day filled with joy and celebration!
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-center">
                {isAdmin && (
                  <button
                    onClick={() => handleSendMail(todayHonorees[0]?.id, todayHonorees[0]?.email, todayHonorees[0]?.name)}
                    disabled={sendingMailId === todayHonorees[0]?.id}
                    className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition shadow-lg shadow-red-600/40 flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-50"
                  >
                    {sendingMailId === todayHonorees[0]?.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Send Birthday Card Now 🚀</span>
                  </button>
                )}
                <button
                  onClick={launchConfetti}
                  className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <PartyPopper className="w-4 h-4 text-red-300" />
                  <span>Confetti 🎉</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-red-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-red-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Team</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-white">{employees.length}</div>
            <p className="text-xs text-slate-400 mt-1">ITOrigin members</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-rose-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-rose-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">This Month</span>
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-white">{thisMonth.length}</div>
            <p className="text-xs text-slate-400 mt-1">In {monthNames[today.getMonth()]}</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Next 30 Days</span>
              <BellRing className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-white">{upcoming30.length}</div>
            <p className="text-xs text-slate-400 mt-1">Upcoming milestones</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Next Honoree</span>
              <Gift className="w-4 h-4" />
            </div>
            <div className="text-base sm:text-xl font-bold text-white truncate">
              {nextUp ? nextUp.name : "None"}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {nextUp
                ? nextUp.daysUntil === 0 ? "Celebrating today!" : `In ${nextUp.daysUntil} days`
                : "No upcoming dates"}
            </p>
          </div>
        </div>

        {/* Upcoming 30 Days Feed */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-red-500/20 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-red-500/20 text-red-300 border border-red-500/30">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Upcoming Celebrations</h2>
                <p className="text-xs text-slate-400">Team birthdays in the next 30 days</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
              {upcoming30.length} Upcoming
            </span>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center gap-3 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin text-red-400" />
              <span className="text-xs">Loading celebrations calendar...</span>
            </div>
          ) : upcoming30.length === 0 ? (
            <div className="py-12 text-center text-slate-400 border border-dashed border-slate-700/60 rounded-2xl">
              <Cake className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              {isAdmin && (
                <Link href="/admin" className="mt-3 inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition">
                  <span>Register a birthday in Admin</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming30.map((emp) => (
                <div key={emp.id} className="glass-panel-interactive p-4 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${getAvatarGradient(emp.name)} flex items-center justify-center text-white font-bold text-base shadow-md flex-shrink-0`}>
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-100 text-sm truncate">{emp.name}</p>
                      <p className="text-xs text-slate-400">{monthNames[emp.birth_month - 1]} {emp.birth_day}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                      emp.daysUntil === 0
                        ? "bg-red-500/25 text-red-200 border border-red-500/40 animate-pulse"
                        : emp.daysUntil === 1
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}>
                      {emp.daysUntil === 0 ? "Today! 🎉" : emp.daysUntil === 1 ? "Tomorrow 🌟" : `In ${emp.daysUntil} days`}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => handleSendMail(emp.id, emp.email, emp.name)}
                        disabled={sendingMailId === emp.id}
                        title="Send birthday mail"
                        className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 transition flex items-center gap-1 text-xs font-semibold disabled:opacity-40"
                      >
                        {sendingMailId === emp.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span className="hidden sm:inline">Send Mail</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && upcoming30.length > 0 && (
            <div className="mt-6 flex justify-center gap-4 flex-wrap">
              <Link
                href="/directory"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-red-500/40 text-sm font-semibold transition"
              >
                <span>View Full Directory</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 text-sm font-semibold transition"
                >
                  <span>Admin Settings</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
