"use client";

import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  Users,
  Search,
  Filter,
  Mail,
  Calendar,
  Cake,
  Trash2,
  RefreshCw,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
  Pencil,
  Sparkles,
  List,
  LayoutGrid,
} from "lucide-react";
import { Employee, monthNames, getDaysUntil, getAvatarGradient } from "@/components/types";
import EditEmployeeModal from "@/components/EditEmployeeModal";
import { useAuth } from "@/contexts/AuthContext";

export default function DirectoryPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sendingMailId, setSendingMailId] = useState<string | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number | "ALL">("ALL");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { isAdmin } = useAuth();

  const loadDirectory = useCallback(async () => {
    try {
      const res = await fetch("/api/birthdays");
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: "error", text: "Failed to load employee directory." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDirectory();
  }, [loadDirectory]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}" from celebration directory?`)) {
      return;
    }
    setDeletingId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/birthdays?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to delete employee record." });
      } else {
        setMessage({ type: "success", text: `Employee "${name}" deleted.` });
        setEmployees((prev) => prev.filter((e) => e.id !== id));
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Could not delete record." });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSendMail(employeeId: string, email: string, name: string) {
    setSendingMailId(employeeId);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to send email." });
      } else {
        setMessage({ type: "success", text: `🎉 Birthday Card email sent to ${name}!` });
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch { /* silent */ }
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Could not send email." });
    } finally {
      setSendingMailId(null);
    }
  }

  function handleSaved(updated: Employee) {
    setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setMessage({ type: "success", text: `Updated details for "${updated.name}".` });
  }

  // Filter logic
  const filtered = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = selectedMonth === "ALL" || emp.birth_month === selectedMonth;
    return matchesSearch && matchesMonth;
  });

  return (
    <div className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-red-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ITOrigin Team Roster</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Company Birthday Directory
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1">
              Browse all registered team members in clean list view, filter by celebration month, and manage recognition milestones.
            </p>
          </div>

          <div className="px-4 py-3 rounded-2xl glass-panel border border-red-500/30 text-center flex-shrink-0">
            <span className="block text-2xl font-extrabold text-white">{employees.length}</span>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Registered Team Members</span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
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

      {/* Search & Filter & View Toggle Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm outline-none placeholder:text-slate-500"
          />
        </div>

        {/* Right side: Month Selector + View Mode Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(e.target.value === "ALL" ? "ALL" : Number(e.target.value))
              }
              className="px-4 py-2.5 rounded-xl glass-input text-sm outline-none bg-slate-900 text-slate-200 cursor-pointer"
            >
              <option value="ALL">All Months (12)</option>
              {monthNames.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "list"
                  ? "bg-red-600/30 text-red-200 border border-red-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "grid"
                  ? "bg-red-600/30 text-red-200 border border-red-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Directory Contents */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-red-400" />
          <span className="text-sm font-semibold">Loading company directory...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-400 glass-panel rounded-3xl border border-slate-800 p-8">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Matching Employees</h3>
          <p className="text-xs text-slate-500">Try broadening your search term or month filter.</p>
        </div>
      ) : viewMode === "list" ? (

        /* ─── LIST VIEW FORM ─── */
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="divide-y divide-white/5">
            {filtered.map((emp) => {
              const daysUntil = getDaysUntil(emp.birth_month, emp.birth_day);
              return (
                <div
                  key={emp.id}
                  className="p-4 sm:p-5 hover:bg-slate-900/60 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Employee Info */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${getAvatarGradient(
                        emp.name
                      )} flex items-center justify-center text-white font-extrabold text-base shadow-md flex-shrink-0`}
                    >
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-white text-base truncate">{emp.name}</h3>
                      </div>
                      <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span>{emp.email}</span>
                      </p>
                    </div>
                  </div>

                  {/* Center: Birthday & Countdown Badge */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 min-w-[120px]">
                      <Cake className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span>{monthNames[emp.birth_month - 1]} {emp.birth_day}</span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold min-w-[95px] text-center ${
                        daysUntil === 0
                          ? "bg-red-500/25 text-red-200 border border-red-500/40 animate-pulse"
                          : daysUntil === 1
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {daysUntil === 0 ? "Today! 🎉" : daysUntil === 1 ? "Tomorrow 🌟" : `In ${daysUntil} days`}
                    </span>
                  </div>

                  {/* Right: Admin Actions (Only if logged in as Admin) */}
                  {isAdmin && (
                    <div className="flex items-center gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                      <button
                        onClick={() => handleSendMail(emp.id, emp.email, emp.name)}
                        disabled={sendingMailId === emp.id}
                        className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold transition disabled:opacity-40"
                      >
                        {sendingMailId === emp.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span className="hidden sm:inline">Send Mail</span>
                      </button>

                      <button
                        onClick={() => setEditingEmployee(emp)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
                        title="Edit employee details"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(emp.id, emp.name)}
                        disabled={deletingId === emp.id}
                        className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30 transition disabled:opacity-40"
                        title="Delete employee"
                      >
                        {deletingId === emp.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      ) : (

        /* ─── GRID VIEW FORM ─── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((emp) => {
            const daysUntil = getDaysUntil(emp.birth_month, emp.birth_day);
            return (
              <div
                key={emp.id}
                className="glass-panel-interactive p-5 rounded-3xl border border-white/10 flex flex-col justify-between gap-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${getAvatarGradient(
                        emp.name
                      )} flex items-center justify-center text-white font-extrabold text-lg shadow-lg flex-shrink-0`}
                    >
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-white text-base truncate" title={emp.name}>
                        {emp.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <span>{emp.email}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Birthday Detail & Badge */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <Cake className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>
                      {monthNames[emp.birth_month - 1]} {emp.birth_day}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-bold ${
                      daysUntil === 0
                        ? "bg-red-500/25 text-red-200 border border-red-500/40 animate-pulse"
                        : daysUntil === 1
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {daysUntil === 0 ? "Today! 🎉" : daysUntil === 1 ? "Tomorrow 🌟" : `In ${daysUntil} days`}
                  </span>
                </div>

                {/* Admin Controls */}
                {isAdmin && (
                  <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleSendMail(emp.id, emp.email, emp.name)}
                      disabled={sendingMailId === emp.id}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold transition disabled:opacity-40"
                    >
                      {sendingMailId === emp.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Send Mail</span>
                    </button>

                    <button
                      onClick={() => setEditingEmployee(emp)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
                      title="Edit employee details"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(emp.id, emp.name)}
                      disabled={deletingId === emp.id}
                      className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30 transition disabled:opacity-40"
                      title="Delete employee"
                    >
                      {deletingId === emp.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSaved={handleSaved}
        />
      )}

    </div>
  );
}
