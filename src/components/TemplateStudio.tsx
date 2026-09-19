"use client";

import { useState } from "react";
import {
  Mail,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
  Copy,
  Check,
  User,
  AtSign,
  Gift,
  Users,
  Eye,
  Shield,
  Send,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function TemplateStudio() {
  const { isAdmin, session } = useAuth();
  const [templateType, setTemplateType] = useState<"honoree" | "colleague">("honoree");
  const [name, setName] = useState("Rahul Sharma");
  const [email, setEmail] = useState("rahul@itorigin.com");
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [copied, setCopied] = useState(false);

  const previewUrl = `/api/preview-card?type=${templateType}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;

  const getViewportWidth = () => {
    switch (viewport) {
      case "mobile":
        return "max-w-[400px]";
      case "tablet":
        return "max-w-[680px]";
      default:
        return "max-w-full";
    }
  };

  async function handleCopyHtml() {
    try {
      const res = await fetch(previewUrl);
      const htmlText = await res.text();
      await navigator.clipboard.writeText(htmlText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy HTML code.");
    }
  }

  return (
    <div className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-red-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Template Studio</span>
              </div>
              {isAdmin && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Mode Active ({session?.username})</span>
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Birthday Email Template Preview
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-1">
              Preview live sample email templates featuring the newly integrated cake artwork, complete with dynamic employee name and email parameters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyHtml}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? "HTML Copied!" : "Copy HTML"}</span>
            </button>

            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-semibold transition shadow-lg shadow-red-600/30"
            >
              <span>Open Raw</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Options Panel */}
        <div className="lg:col-span-1 glass-panel rounded-3xl border border-white/10 p-6 flex flex-col gap-6">
          
          {/* Template Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
              1. Select Email Template
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => setTemplateType("honoree")}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition ${
                  templateType === "honoree"
                    ? "bg-red-600/20 border-red-500/50 text-white shadow-lg shadow-red-600/10"
                    : "bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <div className={`p-2 rounded-xl mt-0.5 ${templateType === "honoree" ? "bg-red-500/20 text-red-400" : "bg-slate-800 text-slate-400"}`}>
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold">Honoree Birthday Card</div>
                  <div className="text-xs opacity-75 mt-0.5">Sent directly to the employee on their birthday (Zero CC).</div>
                </div>
              </button>

              <button
                onClick={() => setTemplateType("colleague")}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition ${
                  templateType === "colleague"
                    ? "bg-red-600/20 border-red-500/50 text-white shadow-lg shadow-red-600/10"
                    : "bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <div className={`p-2 rounded-xl mt-0.5 ${templateType === "colleague" ? "bg-red-500/20 text-red-400" : "bg-slate-800 text-slate-400"}`}>
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold">Colleague Announcement</div>
                  <div className="text-xs opacity-75 mt-0.5">Sent to all team members notifying them to send birthday wishes.</div>
                </div>
              </button>
            </div>
          </div>

          {/* Sample Parameters */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              2. Sample Parameters
            </label>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Employee Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="glass-input w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <AtSign className="w-3.5 h-3.5 text-slate-400" />
                <span>Employee Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@itorigin.com"
                className="glass-input w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
              />
            </div>
          </div>

          {/* Device Viewport Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
              3. Viewport Mode
            </label>
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setViewport("desktop")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition ${
                  viewport === "desktop" ? "bg-red-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setViewport("tablet")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition ${
                  viewport === "tablet" ? "bg-red-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setViewport("mobile")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition ${
                  viewport === "mobile" ? "bg-red-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Iframe Live Preview Panel */}
        <div className="lg:col-span-2 glass-panel rounded-3xl border border-white/10 p-4 sm:p-6 flex flex-col items-center min-h-[650px] bg-[#05070c]">
          
          {/* Top Frame Bar */}
          <div className="w-full flex items-center justify-between pb-4 border-b border-white/10 mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400 hidden sm:inline">
                {templateType === "honoree" ? "honoree_birthday_card.html" : "team_announcement_card.html"}
              </span>
            </div>
            
            <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-red-400" />
              <span>Live Render</span>
            </div>
          </div>

          {/* Iframe Container */}
          <div className={`w-full ${getViewportWidth()} transition-all duration-300 flex-1 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#04060a]`}>
            <iframe
              src={previewUrl}
              title="Email Template Preview"
              className="w-full h-full min-h-[600px] border-0"
            />
          </div>

        </div>

      </div>

    </div>
  );
}
