"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Globe,
  Menu,
  X,
  LayoutDashboard,
  Users,
  UserPlus,
  Lock,
  Shield,
  RefreshCw,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// ─── Logo ─────────────────────────────────────────────────────────────────────

function ITOriginLogo() {
  return (
    <div className="inline-flex items-center gap-1 font-extrabold tracking-wider">
      <span className="text-white text-xl sm:text-2xl tracking-tighter">IT</span>
      <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-rose-600 via-red-600 to-red-500 flex items-center justify-center p-0.5 shadow-lg shadow-red-600/40 animate-pulse-glow">
        <Globe className="w-full h-full text-white stroke-[2.2]" />
      </div>
      <span className="text-white text-xl sm:text-2xl tracking-tighter">RIGIN</span>
    </div>
  );
}

// ─── Login Modal ──────────────────────────────────────────────────────────────

function AdminLoginModal({ onClose }: { onClose: () => void }) {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password");
      return;
    }
    setLoading(true);
    setError(null);
    const err = await login(username.trim(), password.trim());
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      onClose();
      router.push("/admin");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-sm glass-panel rounded-3xl border border-red-500/20 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/30">
            <Shield className="w-7 h-7 text-red-400" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-white">Admin Login</h2>
            <p className="text-xs text-slate-400 mt-1">Enter your administrator credentials</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoFocus
              className="glass-input w-full px-4 py-3 rounded-xl text-white text-sm outline-none placeholder:text-slate-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input w-full px-4 py-3 pr-10 rounded-xl text-white text-sm outline-none placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-950/50 border border-rose-500/30 px-3 py-2 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-sm transition shadow-lg shadow-red-600/30 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            <span>{loading ? "Authenticating..." : "Login to Admin Panel"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, session, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/directory", label: "Directory", icon: Users },
  ];

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#06080d]/85 border-b border-white/10 shadow-2xl">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <ITOriginLogo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-300">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                    active
                      ? "bg-red-600/20 text-red-300 border border-red-500/30"
                      : "hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {!loading && (
              isAdmin ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/admin"
                    className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                      pathname === "/admin"
                        ? "bg-red-600/20 text-red-300 border-red-500/30"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-red-400" />
                    <span>Admin Panel</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title={`Logout ${session?.username}`}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  id="admin-login-btn"
                  className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-semibold transition shadow-lg shadow-red-600/30"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              )
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden w-full border-t border-white/10 bg-[#0a0e17] px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                    active
                      ? "bg-red-600/20 text-red-300 border border-red-500/30"
                      : "bg-slate-900/80 hover:bg-red-950/40 text-slate-200"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {isAdmin ? (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600/20 text-red-300 border border-red-500/30"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-900/80 hover:bg-red-950/40 text-slate-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout ({session?.username})</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => { setMobileOpen(false); setLoginOpen(true); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-900/80 hover:bg-red-950/40 text-slate-200"
              >
                <Lock className="w-4 h-4 text-red-400" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* Admin Login Modal */}
      {loginOpen && <AdminLoginModal onClose={() => setLoginOpen(false)} />}
    </>
  );
}
