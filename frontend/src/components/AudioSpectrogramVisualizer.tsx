import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Activity, Volume2, ShieldAlert, Sparkles, Play, Pause } from "lucide-react";

interface AudioVisualizerProps {
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  scamProbability?: number;
  audioName?: string;
}

export default function AudioSpectrogramVisualizer({
  isPlaying = true,
  onTogglePlay,
  scamProbability = 24.5,
  audioName = "sample_audio.wav",
}: AudioVisualizerProps) {
  const [bars, setBars] = useState<number[]>(Array(36).fill(20));
  const [playing, setPlaying] = useState(isPlaying);

  // Generate realistic frequency fluctuations
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setBars(
        Array.from({ length: 36 }, (_, i) => {
          // Add harmonic peaks around center speech frequencies
          const harmonic = Math.sin((i / 36) * Math.PI) * 55;
          const noise = Math.random() * 35;
          return Math.max(12, Math.min(95, Math.floor(harmonic + noise)));
        })
      );
    }, 110);
    return () => clearInterval(interval);
  }, [playing]);

  const toggle = () => {
    setPlaying(!playing);
    onTogglePlay?.();
  };

  const isScam = scamProbability >= 50;

  return (
    <div className="rounded-2xl border border-violet-500/30 bg-slate-950/85 p-5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-violet-500/15 text-violet-400 border border-violet-500/30">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-slate-100 text-sm md:text-base flex items-center gap-2">
              Acoustic Spectral & Formant Analyzer
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isScam
                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                  : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              }`}>
                {isScam ? "AI Synthetic Pitch Detected" : "Natural Human Phonemes"}
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Track: {audioName} • Sample Rate: 16.0 kHz Mono • 36 Frequency Bins
            </p>
          </div>
        </div>

        <button
          onClick={toggle}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-500 hover:bg-violet-400 text-white shadow-lg shadow-violet-500/25 transition-all"
        >
          {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {playing ? "Pause Stream" : "Play Stream"}
        </button>
      </div>

      {/* Real-time Frequency Spectrum Visualizer Bars */}
      <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 shadow-inner">
        <div className="flex items-end justify-between gap-1 h-32 w-full pt-4 px-2">
          {bars.map((height, i) => {
            const isMidSpeechBand = i >= 10 && i <= 24;
            const barColor = isScam && isMidSpeechBand
              ? "bg-gradient-to-t from-red-600 via-amber-500 to-yellow-300"
              : "bg-gradient-to-t from-violet-600 via-indigo-400 to-cyan-300";

            return (
              <motion.div
                key={i}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
                className={`flex-1 rounded-t-sm ${barColor} shadow-sm min-w-[3px]`}
              />
            );
          })}
        </div>

        {/* Spectrum Scale Labels */}
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-3 border-t border-slate-800/80 mt-2">
          <span>65 Hz (Sub-bass)</span>
          <span>500 Hz (Formants)</span>
          <span>1.5 kHz (Vowels)</span>
          <span>4 kHz (Fricatives)</span>
          <span>8 kHz (Harmonics)</span>
        </div>
      </div>

      {/* Forensic Voice Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-[11px] text-slate-400 uppercase font-mono">F0 Pitch Variance</p>
          <p className="text-sm font-semibold text-cyan-400 mt-0.5">
            {isScam ? "± 3.2 Hz (Monotone AI)" : "± 19.8 Hz (Natural)"}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-[11px] text-slate-400 uppercase font-mono">Robotic Cadence Index</p>
          <p className={`text-sm font-semibold mt-0.5 ${isScam ? "text-red-400" : "text-emerald-400"}`}>
            {isScam ? "High Periodic Jitter" : "Natural Micro-Breaths"}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-[11px] text-slate-400 uppercase font-mono">Spectral Roll-Off</p>
          <p className="text-sm font-semibold text-violet-400 mt-0.5">
            {isScam ? "Synthetic High Cutoff" : "Natural 3.4 kHz Decay"}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-[11px] text-slate-400 uppercase font-mono">Clone Probability</p>
          <p className={`text-sm font-semibold mt-0.5 flex items-center gap-1.5 ${
            isScam ? "text-red-400" : "text-emerald-400"
          }`}>
            <span className={`w-2 h-2 rounded-full ${isScam ? "bg-red-500" : "bg-emerald-500"} animate-pulse`} />
            {scamProbability.toFixed(1)}% {isScam ? "Clone" : "Human"}
          </p>
        </div>
      </div>
    </div>
  );
}
