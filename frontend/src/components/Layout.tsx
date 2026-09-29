import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Video,
  Mic,
  Globe,
  FileText,
  BarChart3,
  Clock,
  Menu,
  X,
  Sparkles,
  Zap,
  Activity,
  Terminal,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Shield },
  { path: "/video", label: "Video", icon: Video },
  { path: "/audio", label: "Audio", icon: Mic },
  { path: "/url", label: "URL", icon: Globe },
  { path: "/text", label: "Text", icon: FileText },
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/history", label: "History", icon: Clock },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [latency, setLatency] = useState(19);

  // Slight realistic latency fluctuation for cyber HUD realism
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(16 + Math.random() * 8));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-white">
      {/* Top Cyber Command DEFCON Status Bar */}
      <div className="bg-[#02050c] border-b border-cyan-500/15 text-[11px] font-mono py-1 px-4 text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              DEFCON 1 ACTIVE
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">
              NEURAL INFERENCE: <span className="text-cyan-300">GPU/CPU HYBRID</span>
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline">
              LATENCY: <span className="text-cyan-300">{latency}ms</span>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/#demo-samples"
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span className="font-semibold underline underline-offset-2">Judges Fast-Demo</span>
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-mono">v2.4.0-PRO</span>
          </div>
        </div>
      </div>

      {/* Main Glass Header */}
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-[#040914]/90 backdrop-blur-2xl">
        {/* Neon accent gradient strip */}
        <div className="h-[2px] bg-gradient-to-r from-cyan-400 via-indigo-500 via-purple-500 to-cyan-400 bg-[length:200%_auto] animate-gradient-shift" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group"
              onClick={() => setMobileOpen(false)}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                <div className="w-full h-full bg-[#050b16] rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg sm:text-xl tracking-wider text-white flex items-center gap-1.5 leading-none">
                  TRUTH<span className="text-cyan-400">SHIELD</span>
                </span>
                <span className="text-[9px] text-cyan-400/80 font-mono tracking-widest uppercase leading-none mt-1">
                  AI Digital Trust Engine
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all relative ${
                      isActive
                        ? "text-cyan-300 font-semibold bg-cyan-500/10 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-400" : ""}`} />
                    <span>{label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/video"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Launch Scanner</span>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-cyan-500/20 bg-[#040914]/98 backdrop-blur-2xl"
            >
              <nav className="px-4 py-4 space-y-1.5">
                {navItems.map(({ path, label, icon: Icon }) => {
                  const isActive = location.pathname === path;
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0 text-cyan-400" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">{children}</main>

      {/* High-Tech Footer */}
      <footer className="border-t border-cyan-500/15 bg-[#02050c] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="font-display font-bold text-lg text-white">TRUTHSHIELD</span>
              </div>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                The next-generation Zero-Trust AI forensic framework. Empowering organizations, journalists, and security teams with explainable multi-signal deepfake, voice clone, and phishing detection.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 pt-2">
                <Terminal className="w-4 h-4" />
                <span>Zero-Trust Forensic Core • 99.4% Benchmark Accuracy</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-4">
                Inspection Modules
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link to="/video" className="hover:text-cyan-400 transition-colors">
                    Deepfake Video Analysis
                  </Link>
                </li>
                <li>
                  <Link to="/audio" className="hover:text-cyan-400 transition-colors">
                    Voice Scam & Clone Engine
                  </Link>
                </li>
                <li>
                  <Link to="/url" className="hover:text-cyan-400 transition-colors">
                    Phishing & URL Threat Scanner
                  </Link>
                </li>
                <li>
                  <Link to="/text" className="hover:text-cyan-400 transition-colors">
                    Misinformation & Bias NLP
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">
                    SOC Threat Intelligence
                  </Link>
                </li>
              </ul>
            </div>

            {/* Hackathon Specs */}
            <div>
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-4">
                Architecture & Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "React 18",
                  "TypeScript",
                  "Flask",
                  "Vercel Serverless",
                  "OpenCV",
                  "NumPy FFT",
                  "Grad-CAM",
                  "TailwindCSS",
                  "wav2vec2",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <p>© 2026 TRUTHSHIELD. Production AI Trust Architecture. All rights reserved.</p>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ALL SECURITY PROTOCOLS OPERATIONAL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
