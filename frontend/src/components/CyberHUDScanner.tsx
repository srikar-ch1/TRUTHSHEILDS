import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Mic, Globe, FileText, Sparkles, Play, ShieldAlert, CheckCircle, Activity, Crosshair, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

type Modality = "video" | "audio" | "url" | "text";

export default function CyberHUDScanner() {
  const [activeTab, setActiveTab] = useState<Modality>("video");
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const triggerScan = () => {
    setScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          return 100;
        }
        return prev + 15;
      });
    }, 120);
  };

  useEffect(() => {
    // Initial scan animation
    triggerScan();
  }, [activeTab]);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-cyan-500/30 bg-[#060c1a]/90 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_0_60px_rgba(6,182,212,0.18)] relative overflow-hidden">
      {/* Reticle corner accents */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

      {/* Top HUD status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Crosshair className="w-4 h-4 animate-spin text-cyan-400" style={{ animationDuration: "12s" }} />
          <span className="tracking-widest font-semibold uppercase">HUD SENSOR ARRAY: ONLINE</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            CORE v2.4 ACTIVATED
          </span>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {[
            { id: "video", label: "Video Vision", icon: Video },
            { id: "audio", label: "Voice Acoustic", icon: Mic },
            { id: "url", label: "URL Phish", icon: Globe },
            { id: "text", label: "Misinfo NLP", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Modality)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main HUD Canvas Area */}
      <div className="relative rounded-2xl bg-[#030712] border border-cyan-500/20 p-5 overflow-hidden">
        {/* Animated Scan Line */}
        {scanning && (
          <div
            className="absolute top-0 bottom-0 w-1 bg-cyan-400 pointer-events-none z-30"
            style={{
              left: `${scanProgress}%`,
              boxShadow: "0 0 20px #22d3ee, 0 0 40px #06b6d4",
            }}
          />
        )}

        <AnimatePresence mode="wait">
          {activeTab === "video" && (
            <motion.div
              key="video"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
            >
              {/* Visual Frame Simulation */}
              <div className="md:col-span-6 relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                {/* SVG Mock of Face Tracking */}
                <svg className="w-full h-full" viewBox="0 0 320 200">
                  <defs>
                    <linearGradient id="cybergrid" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <rect width="320" height="200" fill="url(#cybergrid)" />
                  {/* Face Mesh outline */}
                  <circle cx="160" cy="95" r="50" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3,3" />
                  <rect x="95" y="35" width="130" height="120" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6,3" />
                  <text x="100" y="30" fill="#ef4444" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    DETECTED: SYNTHETIC BOUNDARY SEAM
                  </text>
                  <circle cx="140" cy="85" r="3" fill="#22d3ee" />
                  <circle cx="180" cy="85" r="3" fill="#22d3ee" />
                  <path d="M 160 90 L 160 108 L 153 108" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
                  <path d="M 145 125 Q 160 135 175 125" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
                </svg>

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                  FRAME 0142 • 60 FPS • 4K UPSCALE
                </div>
              </div>

              {/* Forensic Metrics */}
              <div className="md:col-span-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">TARGET: SPEECH_DEEPFAKE_01.MP4</span>
                  <span className="text-xs font-mono font-bold text-red-400 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30">
                    92.4% DEEPFAKE
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">FFT High-Frequency Anomaly</span>
                      <span className="text-red-400 font-bold">0.89 (Severe)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: "89%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">Boundary Seam Inconsistency</span>
                      <span className="text-amber-400 font-bold">78.2% Discrepancy</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">Temporal Eye Saccade Stability</span>
                      <span className="text-cyan-400 font-bold">34.1% (Unnatural)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: "34%" }} />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={triggerScan}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono hover:bg-cyan-500/30 transition-all"
                  >
                    <Play className="w-3 h-3" />
                    <span>Re-Run AI Inference</span>
                  </button>

                  <Link
                    to="/video"
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                  >
                    Open Full Video Engine →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "audio" && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
            >
              <div className="md:col-span-6 relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-4 flex flex-col justify-center">
                {/* Acoustic bars */}
                <div className="flex items-end justify-between gap-1 h-28">
                  {Array.from({ length: 28 }).map((_, i) => {
                    const h = Math.sin((i / 28) * Math.PI) * 75 + Math.random() * 20;
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-violet-600 via-indigo-400 to-cyan-300 rounded-t-sm"
                        style={{ height: `${Math.max(15, Math.min(100, h))}%` }}
                      />
                    );
                  })}
                </div>
                <div className="text-[10px] font-mono text-violet-300 mt-2 text-center">
                  VOICE CLONE HARMONIC INVERSION DETECTED (wav2vec2)
                </div>
              </div>

              <div className="md:col-span-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">TARGET: WIRE_SCAM_CALL.WAV</span>
                  <span className="text-xs font-mono font-bold text-red-400 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30">
                    96.1% VOICE CLONE
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">Pitch Dynamics (F0 Variance)</span>
                      <span className="text-red-400 font-bold">±2.4 Hz (Rigid AI)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: "94%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">Spectral Roll-Off Sharpness</span>
                      <span className="text-amber-400 font-bold">Synthetic Cutoff</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: "86%" }} />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={triggerScan}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/40 text-xs font-mono hover:bg-violet-500/30 transition-all"
                  >
                    <Play className="w-3 h-3" />
                    <span>Re-Analyze Formants</span>
                  </button>
                  <Link
                    to="/audio"
                    className="text-xs font-mono text-violet-400 hover:text-violet-300 underline underline-offset-4"
                  >
                    Open Voice Engine →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "url" && (
            <motion.div
              key="url"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
            >
              <div className="md:col-span-6 relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-4 flex flex-col justify-center space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-red-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="truncate">https://paypa1-security-update.com/login</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Typosquat Target:</span>
                    <span className="text-red-400 font-bold">PayPal (Distance 1)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SSL Certificate:</span>
                    <span className="text-amber-400">Untrusted Self-Signed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domain Entropy:</span>
                    <span className="text-red-400 font-bold">4.89 (High Randomness)</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">THREAT LEVEL</span>
                  <span className="text-xs font-mono font-bold text-red-400 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30">
                    CRITICAL PHISHING
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Homograph domain impersonating PayPal authentication gateway. Immediate credential harvest risk detected.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={triggerScan}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono"
                  >
                    <Play className="w-3 h-3" />
                    <span>Inspect DNS Records</span>
                  </button>
                  <Link
                    to="/url"
                    className="text-xs font-mono text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
                  >
                    Open URL Scanner →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "text" && (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
            >
              <div className="md:col-span-6 relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-4 flex flex-col justify-center">
                <p className="text-xs font-serif text-slate-300 italic border-l-2 border-red-500 pl-3 py-1 mb-2 bg-slate-950/60 rounded-r">
                  "SHOCKING: Leaked documents PROVE secret 5G weather alteration..."
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                    Clickbait Pattern Detected
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Zero Source Citations
                  </span>
                </div>
              </div>

              <div className="md:col-span-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">CREDIBILITY SCORE</span>
                  <span className="text-xs font-mono font-bold text-red-400 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30">
                    18 / 100 (Fabricated)
                  </span>
                </div>
                <div className="space-y-1.5 text-xs font-mono text-slate-300">
                  <div className="flex justify-between">
                    <span>Emotional Sensation Skew:</span>
                    <span className="text-red-400">92% Extreme</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flesch-Kincaid Ease:</span>
                    <span className="text-cyan-400">42 (Manipulative Syntax)</span>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={triggerScan}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono"
                  >
                    <Play className="w-3 h-3" />
                    <span>Re-Analyze NLP</span>
                  </button>
                  <Link
                    to="/text"
                    className="text-xs font-mono text-amber-400 hover:text-amber-300 underline underline-offset-4"
                  >
                    Open Text Engine →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
