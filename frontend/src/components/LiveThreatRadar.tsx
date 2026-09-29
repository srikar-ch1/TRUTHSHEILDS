import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, ShieldAlert, Globe2, AlertCircle, CheckCircle2 } from "lucide-react";

interface Incident {
  id: string;
  type: "Deepfake Video" | "Voice Scam" | "Phishing Campaign" | "AI Disinformation";
  city: string;
  country: string;
  threatLevel: "CRITICAL" | "HIGH" | "ELEVATED";
  score: number;
  time: string;
}

const INITIAL_INCIDENTS: Incident[] = [
  { id: "1", type: "Deepfake Video", city: "Frankfurt", country: "DE", threatLevel: "CRITICAL", score: 94.2, time: "Just now" },
  { id: "2", type: "Voice Scam", city: "London", country: "UK", threatLevel: "CRITICAL", score: 91.8, time: "12s ago" },
  { id: "3", type: "Phishing Campaign", city: "San Francisco", country: "US", threatLevel: "HIGH", score: 86.4, time: "28s ago" },
  { id: "4", type: "AI Disinformation", city: "Singapore", country: "SG", threatLevel: "ELEVATED", score: 79.1, time: "45s ago" },
  { id: "5", type: "Deepfake Video", city: "Tokyo", country: "JP", threatLevel: "CRITICAL", score: 95.7, time: "1m ago" },
];

export default function LiveThreatRadar() {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [activeBlips, setActiveBlips] = useState([
    { x: 35, y: 40, size: 8, color: "bg-red-500", label: "Frankfurt (94.2%)" },
    { x: 68, y: 32, size: 7, color: "bg-red-400", label: "Tokyo (95.7%)" },
    { x: 22, y: 55, size: 6, color: "bg-amber-400", label: "San Francisco (86.4%)" },
    { x: 74, y: 62, size: 7, color: "bg-red-500", label: "Singapore (79.1%)" },
    { x: 38, y: 34, size: 8, color: "bg-red-500", label: "London (91.8%)" },
  ]);

  // Periodically simulate incoming threat incidents
  useEffect(() => {
    const pool: Incident[] = [
      { id: "6", type: "Deepfake Video", city: "Seoul", country: "KR", threatLevel: "CRITICAL", score: 96.1, time: "Just now" },
      { id: "7", type: "Voice Scam", city: "Zurich", country: "CH", threatLevel: "HIGH", score: 88.5, time: "Just now" },
      { id: "8", type: "Phishing Campaign", city: "Sydney", country: "AU", threatLevel: "CRITICAL", score: 92.0, time: "Just now" },
      { id: "9", type: "AI Disinformation", city: "New York", country: "US", threatLevel: "ELEVATED", score: 74.3, time: "Just now" },
      { id: "10", type: "Voice Scam", city: "Toronto", country: "CA", threatLevel: "CRITICAL", score: 90.4, time: "Just now" },
    ];

    let idx = 0;
    const interval = setInterval(() => {
      const next = pool[idx % pool.length];
      idx++;
      setIncidents((prev) => [
        { ...next, id: String(Date.now()), time: "Just now" },
        ...prev.slice(0, 4),
      ]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-cyan-500/25 bg-slate-950/80 p-5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-slate-100 text-sm md:text-base flex items-center gap-2">
              Global Synthetic Threat Radar
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-ring" />
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Live Sensor Intercepts • DEFCON 1 • Global Nodes: 1,420
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Active Attacks: High</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Circular Sweep Screen (5 Cols) */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-cyan-500/30 bg-[#050e1f] flex items-center justify-center overflow-hidden shadow-[0_0_35px_rgba(6,182,212,0.15)]">
            {/* Concentric distance rings */}
            <div className="absolute w-3/4 h-3/4 rounded-full border border-cyan-500/20 border-dashed" />
            <div className="absolute w-1/2 h-1/2 rounded-full border border-cyan-500/25" />
            <div className="absolute w-1/4 h-1/4 rounded-full border border-cyan-500/30" />

            {/* Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-[1px] bg-cyan-500/20" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-full w-[1px] bg-cyan-500/20" />
            </div>

            {/* Rotating Radar Sweep Cone */}
            <div
              className="absolute inset-0 radar-sweep pointer-events-none"
              style={{
                background:
                  "conic-gradient(from 0deg at 50% 50%, rgba(34, 211, 238, 0.4) 0deg, rgba(34, 211, 238, 0.05) 45deg, transparent 60deg)",
              }}
            />

            {/* Threat Blips */}
            {activeBlips.map((blip, i) => (
              <div
                key={i}
                className="absolute group cursor-pointer"
                style={{ left: `${blip.x}%`, top: `${blip.y}%` }}
              >
                <div className={`w-3 h-3 rounded-full ${blip.color} animate-ping absolute -inset-0.5 opacity-75`} />
                <div className={`w-2.5 h-2.5 rounded-full ${blip.color} relative border border-white/60 shadow-md`} />
                {/* Tooltip */}
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-950 text-[10px] text-cyan-300 font-mono whitespace-nowrap border border-cyan-500/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                  {blip.label}
                </span>
              </div>
            ))}

            {/* Center origin node */}
            <div className="w-3 h-3 rounded-full bg-cyan-400 z-10 shadow-[0_0_12px_#22d3ee]" />
          </div>
        </div>

        {/* Live Attack Intercept Log Stream (7 Cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1 border-b border-slate-800">
            <span>LIVE INTERCEPT STREAM</span>
            <span>THREAT CLASSIFICATION</span>
          </div>

          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {incidents.map((inc) => (
                <motion.div
                  key={inc.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      inc.threatLevel === "CRITICAL" ? "bg-red-500 animate-pulse" : "bg-amber-400"
                    }`} />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1.5">
                        {inc.type}
                        <span className="text-[10px] text-slate-400 font-normal">
                          via {inc.city}, {inc.country}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">{inc.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono font-bold text-red-400">
                      {inc.score}% Risk
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                      inc.threatLevel === "CRITICAL"
                        ? "bg-red-500/20 text-red-300 border border-red-500/40"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}>
                      {inc.threatLevel}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
