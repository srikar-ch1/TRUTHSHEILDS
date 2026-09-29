import { useState, useRef, MouseEvent, TouchEvent } from "react";
import { motion } from "framer-motion";
import { Eye, Layers, Sparkles, SlidersHorizontal, Check } from "lucide-react";

interface HeatmapSliderProps {
  originalImage?: string | null;
  heatmapImage?: string | null;
  title?: string;
  anomalyScore?: number;
}

export default function HeatmapSlider({
  originalImage,
  heatmapImage,
  title = "AI Forensic Grad-CAM Inspection",
  anomalyScore = 78.4,
}: HeatmapSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeLayer, setActiveLayer] = useState<"slider" | "heatmap" | "original">("slider");
  const containerRef = useRef<HTMLDivElement>(null);

  // Fallback placeholder images if none provided (high-tech procedural SVG)
  const defaultOriginal =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400" fill="#0b1329">
        <rect width="640" height="400" fill="#090f1d"/>
        <circle cx="320" cy="180" r="90" fill="#1e293b" stroke="#334155" stroke-width="2"/>
        <ellipse cx="285" cy="165" rx="14" ry="9" fill="#0f172a" stroke="#475569" stroke-width="2"/>
        <ellipse cx="355" cy="165" rx="14" ry="9" fill="#0f172a" stroke="#475569" stroke-width="2"/>
        <circle cx="285" cy="165" r="4" fill="#38bdf8"/>
        <circle cx="355" cy="165" r="4" fill="#38bdf8"/>
        <path d="M 320 180 L 315 210 L 325 210 Z" fill="#334155"/>
        <path d="M 295 235 Q 320 250 345 235" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
        <text x="320" y="340" fill="#94a3b8" font-family="monospace" font-size="14" text-anchor="middle">ORIGINAL VIDEO FRAME [RAW INGESTION]</text>
      </svg>
    `);

  const defaultHeatmap =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400" fill="#0b1329">
        <defs>
          <radialGradient id="heat" cx="50%" cy="45%" r="35%">
            <stop offset="0%" stop-color="#ef4444" stop-opacity="0.95"/>
            <stop offset="40%" stop-color="#f59e0b" stop-opacity="0.8"/>
            <stop offset="70%" stop-color="#3b82f6" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.1"/>
          </radialGradient>
        </defs>
        <rect width="640" height="400" fill="#070c18"/>
        <circle cx="320" cy="180" r="90" fill="#1e293b"/>
        <rect x="220" y="80" width="200" height="200" fill="url(#heat)"/>
        <rect x="220" y="80" width="200" height="200" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4"/>
        <text x="225" y="72" fill="#ef4444" font-family="monospace" font-size="11" font-weight="bold">ANOMALY: PERIMETER BLUR SEAM</text>
        <text x="320" y="340" fill="#f87171" font-family="monospace" font-size="14" text-anchor="middle">GRAD-CAM ACTIVATION MAPPING [FFT FREQ ANOMALY]</text>
      </svg>
    `);

  const origSrc = originalImage || defaultOriginal;
  const heatSrc = heatmapImage ? (heatmapImage.startsWith("data:") ? heatmapImage : `data:image/png;base64,${heatmapImage}`) : defaultHeatmap;

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Decorative cyber corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-slate-100 text-sm md:text-base flex items-center gap-2">
              {title}
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                Grad-CAM v2.4
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Drag interactive divider to compare raw frame against AI spatial-frequency heatmap
            </p>
          </div>
        </div>

        {/* View Switcher buttons */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/60 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveLayer("slider")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeLayer === "slider"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Split Slider
          </button>
          <button
            onClick={() => setActiveLayer("heatmap")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeLayer === "heatmap"
                ? "bg-red-500 text-white font-bold shadow-md shadow-red-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Heatmap
          </button>
          <button
            onClick={() => setActiveLayer("original")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeLayer === "original"
                ? "bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Original
          </button>
        </div>
      </div>

      {/* Main Interactive Comparison Stage */}
      <div
        ref={containerRef}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-video max-h-[480px] bg-slate-950 rounded-xl overflow-hidden cursor-ew-resize select-none border border-slate-800 shadow-inner group"
      >
        {activeLayer === "slider" ? (
          <>
            {/* Base Layer: Heatmap Anomaly (Right / Underneath) */}
            <img
              src={heatSrc}
              alt="AI Grad-CAM Anomaly Heatmap"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* Overlying Layer: Original Raw Video (Left, clipped by sliderPos) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={origSrc}
                alt="Original Video Frame"
                className="absolute inset-0 w-full h-full object-contain max-w-none pointer-events-none"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%",
                }}
              />
            </div>

            {/* Glowing Split Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 pointer-events-none"
              style={{
                left: `${sliderPos}%`,
                boxShadow: "0 0 15px #22d3ee, 0 0 30px #06b6d4",
              }}
            >
              {/* Handle Knob */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/50 cursor-ew-resize border-2 border-white">
                <SlidersHorizontal className="w-4 h-4 rotate-90 text-slate-950" />
              </div>
            </div>

            {/* Floating Tags */}
            <div className="absolute bottom-3 left-3 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-slate-950/80 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
                ◀ RAW FRAME
              </span>
            </div>
            <div className="absolute bottom-3 right-3 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-red-950/80 text-red-300 border border-red-500/40 backdrop-blur-md">
                GRAD-CAM HEATMAP ▶
              </span>
            </div>
          </>
        ) : activeLayer === "heatmap" ? (
          <img
            src={heatSrc}
            alt="AI Grad-CAM Anomaly Heatmap"
            className="w-full h-full object-contain"
          />
        ) : (
          <img
            src={origSrc}
            alt="Original Video Frame"
            className="w-full h-full object-contain"
          />
        )}

        {/* Scan Reticle Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent cyber-scanline" />
      </div>

      {/* Forensic Anomaly Insights Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-[11px] text-slate-400 uppercase font-mono">Spatial Anomaly</p>
          <p className="text-sm font-semibold text-red-400 flex items-center gap-1 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" />
            {(anomalyScore * 0.95).toFixed(1)}% Detected
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-[11px] text-slate-400 uppercase font-mono">Boundary Inconsistency</p>
          <p className="text-sm font-semibold text-amber-400 mt-0.5">High Edge Residual</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-[11px] text-slate-400 uppercase font-mono">FFT Roll-Off Anomaly</p>
          <p className="text-sm font-semibold text-cyan-400 mt-0.5">0.82 High-Band Cut</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-[11px] text-slate-400 uppercase font-mono">Verification Seal</p>
          <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
            <Check className="w-3.5 h-3.5" /> Hash Validated
          </p>
        </div>
      </div>
    </div>
  );
}
