"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield,
  Clock,
  Send,
  Users,
  ScrollText,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  ChevronRight,
  Calendar,
  LogOut,
  UserPlus,
  Settings,
  Zap,
  Activity,
  Sparkles,
  Eye,
} from "lucide-react";
import TemplateStudio from "@/components/TemplateStudio";
import RegisterForm from "@/components/RegisterForm";
import { Employee, monthNames } from "@/components/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminInfo {
  id: string;
  username: string;
  createdAt: string;
}

interface LogEntry {
  id: string;
  action: string;
  actor: string;
  detail: string;
  timestamp: string;
}

// ─── Action badge colors ──────────────────────────────────────────────────────

const ACTION_STYLES: Record<string, string> = {
  ADMIN_LOGIN: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  ADMIN_LOGOUT: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  ADMIN_ADDED: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  ADMIN_REMOVED: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  EMPLOYEE_ADDED: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  EMPLOYEE_UPDATED: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  EMPLOYEE_DELETED: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  MAIL_SENT: "bg-red-500/15 text-red-300 border-red-500/30",
  MAIL_FAILED: "bg-rose-900/30 text-rose-300 border-rose-500/30",
  CRON_RUN: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  CRON_CONFIG_UPDATED: "bg-violet-500/15 text-violet-300 border-violet-500/30",
};

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({
  message,
  onClose,
}: {
  message: { type: "success" | "error"; text: string } | null;
  onClose: () => void;
}) {
  if (!message) return null;
  return (
    <div
      className={`p-4 rounded-2xl text-sm font-semibold flex items-center justify-between gap-3 shadow-xl animate-in fade-in duration-200 ${
        message.type === "success"
          ? "bg-emerald-950/85 border border-emerald-500/40 text-emerald-100"
          : "bg-rose-950/85 border border-rose-500/40 text-rose-100"
      }`}
    >
      <div className="flex items-center gap-3">
        {message.type === "success" ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
        )}
        <span>{message.text}</span>
      </div>
      <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { isAdmin, session, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"templates" | "register" | "cron" | "mail" | "admins" | "logs">("templates");

  // Redirect if not admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/");
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-red-400 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const tabs = [
    { id: "templates", label: "Email Templates", icon: Eye },
    { id: "register", label: "Register Birthday", icon: UserPlus },
    { id: "cron", label: "Cron Schedule", icon: Clock },
    { id: "mail", label: "Send Mail", icon: Send },
    { id: "admins", label: "Manage Admins", icon: Users },
    { id: "logs", label: "Activity Logs", icon: ScrollText },
  ] as const;

  return (
    <div className="relative w-full flex-1 flex flex-col overflow-x-hidden cyber-grid">
      <div className="ambient-glow -top-24 -left-24 w-96 h-96 bg-red-600/15 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/30">
                <Shield className="w-5 h-5 text-red-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Admin Panel</h1>
            </div>
            <p className="text-slate-400 text-sm ml-[52px]">
              Logged in as <span className="text-red-300 font-semibold">{session?.username}</span>
            </p>
          </div>
          <button
            onClick={async () => { await logout(); router.push("/"); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-sm font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 flex-wrap glass-panel p-2 rounded-2xl border border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition flex-1 sm:flex-initial justify-center sm:justify-start ${
                activeTab === tab.id
                  ? "bg-red-600/25 text-red-300 border border-red-500/40"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "templates" && <TemplateStudio />}
          {activeTab === "register" && <RegisterForm />}
          {activeTab === "cron" && <CronTab />}
          {activeTab === "mail" && <MailTab />}
          {activeTab === "admins" && <AdminsTab currentId={session?.id || ""} />}
          {activeTab === "logs" && <LogsTab />}
        </div>
      </div>
    </div>
  );
}

// ─── Cron Schedule Tab ────────────────────────────────────────────────────────

function CronTab() {
  const [cronTime, setCronTime] = useState("00:00");
  const [lastRun, setLastRun] = useState<{ timestamp?: string; status?: string; count?: number } | null>(null);
  const [serverTime, setServerTime] = useState<string>("");
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [saving, setSaving] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load config & server time
  const loadConfig = useCallback(() => {
    fetch("/api/admin/config", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.cronTime) setCronTime(d.cronTime);
        setLastRun({
          timestamp: d.lastRunTimestamp,
          status: d.lastRunStatus,
          count: d.lastRunCount,
        });
        if (d.serverTime) setServerTime(d.serverTime);
      })
      .catch(() => {})
      .finally(() => setLoadingConfig(false));
  }, []);

  useEffect(() => {
    loadConfig();
    // Live server clock ticker
    const timer = setInterval(() => {
      const d = new Date();
      setServerTime(d.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, [loadConfig]);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cronTime }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: `✅ Cron schedule active! Birthday emails will send daily at ${cronTime}` });
        loadConfig();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleTriggerNow() {
    setTriggering(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ triggerNow: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message || "Birthday check completed!" });
        loadConfig();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to trigger cron" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error triggering cron check" });
    } finally {
      setTriggering(false);
    }
  }

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30">
            <Clock className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Automated Birthday Scheduler</h2>
            <p className="text-xs text-slate-400">Emails are automatically dispatched daily at your configured time</p>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Background Engine Active</span>
        </div>
      </div>

      <Toast message={message} onClose={() => setMessage(null)} />

      {loadingConfig ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Loading scheduler configuration...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status & Clock Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                <span>Current Server Time</span>
              </div>
              <p className="text-2xl font-mono font-bold text-white tracking-wider">
                {serverTime || "--:--:--"}
              </p>
              <p className="text-[11px] text-slate-500">Scheduler checks every 5 seconds</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                <span>Next Scheduled Dispatch</span>
              </div>
              <p className="text-2xl font-mono font-bold text-red-400 tracking-wider">
                {cronTime}
              </p>
              <p className="text-[11px] text-slate-500">Daily automated trigger</p>
            </div>
          </div>

          {/* Schedule Form */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-400" />
                Set Daily Send Time (24-hour format)
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="time"
                  value={cronTime}
                  onChange={(e) => setCronTime(e.target.value)}
                  className="glass-input px-4 py-3 rounded-xl text-white text-lg font-mono outline-none w-44"
                />
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-sm transition shadow-lg shadow-red-600/30 disabled:opacity-50 min-h-[46px]"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Save Schedule</span>
                </button>
              </div>
            </div>
          </div>

          {/* Last Run Info */}
          {lastRun?.timestamp && (
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400 font-semibold">
                <span>Last Automated Execution</span>
                <span className="text-slate-300">{new Date(lastRun.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-slate-300 font-medium">Status: {lastRun.status || "Completed"}</p>
            </div>
          )}

          {/* Test Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-800/80">
            <div>
              <p className="text-xs font-semibold text-slate-300">Need to test right now?</p>
              <p className="text-[11px] text-slate-500">Run the daily birthday checker immediately to dispatch emails for today&apos;s birthdays</p>
            </div>
            <button
              onClick={handleTriggerNow}
              disabled={triggering}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/40 text-xs font-semibold transition disabled:opacity-50"
            >
              {triggering ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-indigo-400" />}
              <span>Test Trigger Now ⚡</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Manual Send Mail Tab ─────────────────────────────────────────────────────

function MailTab() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingEmp, setLoadingEmp] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/birthdays", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) { setEmployees(d); if (d.length > 0) setSelectedId(d[0].id); } })
      .catch(() => {})
      .finally(() => setLoadingEmp(false));
  }, []);

  async function handleSend() {
    if (!selectedId) return;
    setSending(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ employeeId: selectedId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message || "Birthday card sent! 🎉" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to send" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setSending(false);
    }
  }

  const selectedEmployee = employees.find((e) => e.id === selectedId);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/30">
          <Send className="w-6 h-6 text-red-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Manual Birthday Mail</h2>
          <p className="text-xs text-slate-400">Manually trigger a birthday card email for any team member</p>
        </div>
      </div>

      <Toast message={message} onClose={() => setMessage(null)} />

      {loadingEmp ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Loading employees...</span>
        </div>
      ) : employees.length === 0 ? (
        <p className="text-slate-400 text-sm">No employees registered yet.</p>
      ) : (
        <>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Select Employee</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="glass-input px-4 py-3 rounded-xl text-white outline-none cursor-pointer w-full sm:w-96 bg-slate-900"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} — {monthNames[emp.birth_month - 1]} {emp.birth_day}
                </option>
              ))}
            </select>
          </div>

          {selectedEmployee && (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700 text-sm space-y-1">
              <p className="text-slate-300 font-semibold">{selectedEmployee.name}</p>
              <p className="text-slate-400">{selectedEmployee.email}</p>
              <p className="text-slate-400">
                Birthday: {monthNames[selectedEmployee.birth_month - 1]} {selectedEmployee.birth_day}
              </p>
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={sending || !selectedId}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-sm transition shadow-lg shadow-red-600/30 disabled:opacity-50"
          >
            {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Send Birthday Card 🎉</span>
          </button>
        </>
      )}
    </div>
  );
}

// ─── Manage Admins Tab ────────────────────────────────────────────────────────

function AdminsTab({ currentId }: { currentId: string }) {
  const [admins, setAdmins] = useState<AdminInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadAdmins = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/admins", { credentials: "include" });
      const data = await res.json();
      if (Array.isArray(data)) setAdmins(data);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadAdmins(); }, [loadAdmins]);

  async function handleAdd() {
    if (!newUsername.trim() || !newPassword.trim()) {
      setMessage({ type: "error", text: "Username and password are required" });
      return;
    }
    setAdding(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: newUsername.trim(), password: newPassword.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: `Admin "${newUsername}" added successfully!` });
        setNewUsername("");
        setNewPassword("");
        loadAdmins();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to add admin" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(id: string, username: string) {
    if (!confirm(`Remove admin "${username}"? This cannot be undone.`)) return;
    setRemovingId(id);
    try {
      const res = await fetch(`/api/admin/admins?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: `Admin "${username}" removed.` });
        setAdmins((prev) => prev.filter((a) => a.id !== id));
      } else {
        setMessage({ type: "error", text: data.error || "Failed to remove" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/30">
          <Users className="w-6 h-6 text-blue-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Manage Admins</h2>
          <p className="text-xs text-slate-400">Add or remove administrator accounts</p>
        </div>
      </div>

      <Toast message={message} onClose={() => setMessage(null)} />

      {/* Add admin form */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-blue-400" />
          Add New Admin
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Username"
            className="glass-input px-4 py-2.5 rounded-xl text-white text-sm outline-none placeholder:text-slate-500"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Password"
            className="glass-input px-4 py-2.5 rounded-xl text-white text-sm outline-none placeholder:text-slate-500"
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={adding}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-semibold text-sm transition disabled:opacity-50"
        >
          {adding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>Add Admin</span>
        </button>
      </div>

      {/* Admin list */}
      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Loading admins...</span>
        </div>
      ) : (
        <div className="space-y-2">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm">
                  {admin.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-100 text-sm">
                    {admin.username}
                    {admin.id === currentId && (
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        You
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500">
                    Added {new Date(admin.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {admin.id !== currentId && (
                <button
                  onClick={() => handleRemove(admin.id, admin.username)}
                  disabled={removingId === admin.id}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition disabled:opacity-40"
                  title="Remove admin"
                >
                  {removingId === admin.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Activity Logs Tab ────────────────────────────────────────────────────────

function LogsTab() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 50;

  const loadLogs = useCallback(async (off: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/logs?limit=${LIMIT}&offset=${off}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
        setTotal(data.total);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadLogs(offset); }, [loadLogs, offset]);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-violet-500/20 border border-violet-500/30">
            <ScrollText className="w-6 h-6 text-violet-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Activity Logs</h2>
            <p className="text-xs text-slate-400">{total} total events recorded</p>
          </div>
        </div>
        <button
          onClick={() => loadLogs(offset)}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          title="Refresh logs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading && logs.length === 0 ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Loading logs...</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="py-12 text-center text-slate-500 border border-dashed border-slate-700 rounded-2xl">
          <ScrollText className="w-10 h-10 mx-auto mb-2 text-slate-700" />
          <p className="text-sm">No activity recorded yet.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-sm"
              >
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      ACTION_STYLES[log.action] ||
                      "bg-slate-700/40 text-slate-300 border-slate-600"
                    }`}
                  >
                    {log.action.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-xs leading-relaxed">{log.detail}</p>
                  <p className="text-slate-500 text-[11px] mt-1">
                    by <span className="text-slate-400">{log.actor}</span>
                    {" · "}
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing {offset + 1}–{Math.min(offset + LIMIT, total)} of {total}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                disabled={offset === 0}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-30 transition flex items-center gap-1"
              >
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                Prev
              </button>
              <button
                onClick={() => setOffset(offset + LIMIT)}
                disabled={offset + LIMIT >= total}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-30 transition flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
