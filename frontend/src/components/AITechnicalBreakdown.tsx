import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Activity, Shield, TrendingUp } from "lucide-react";
import Card from "./Card";

interface AITechnicalBreakdownProps {
  threatIndex?: number;
  temporalStability?: number;
  heatmapAvailable?: boolean;
  authenticityScore?: number;
  framesAnalyzed?: number;
  processingTime?: number;
  modelUsed?: string;
}

export default function AITechnicalBreakdown({
  threatIndex,
  temporalStability,
  heatmapAvailable,
  authenticityScore,
  framesAnalyzed,
  processingTime,
  modelUsed,
}: AITechnicalBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
      >
        <h3 className="font-display font-semibold text-slate-100">AI Technical Breakdown</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-200 mb-1">Threat Index</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Composite score: fake_probability × 0.6 + temporal_instability × 0.2 + artifact_score × 0.2.
                    {typeof threatIndex === "number" && (
                      <span className="block mt-1 text-cyan-300">Current: {threatIndex.toFixed(1)}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-200 mb-1">Temporal Stability</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Variance of per-frame predictions. Low variance = high stability (authentic). High variance = suspicious.
                    {typeof temporalStability === "number" && (
                      <span className="block mt-1 text-cyan-300">Score: {temporalStability.toFixed(1)}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-200 mb-1">Activation Heatmap</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {heatmapAvailable
                      ? "Grad-CAM style overlay from last convolution layer highlights regions most activated by the model (red = high activation)."
                      : "Heatmap not available for this run."}
                  </p>
                </div>
              </div>

              {(modelUsed || framesAnalyzed !== undefined || processingTime !== undefined) && (
                <div className="pt-2 border-t border-slate-700/40 text-xs text-slate-400 flex flex-wrap gap-4">
                  {modelUsed && <div><span className="text-slate-500">Model:</span> <span className="text-slate-200 font-mono">{modelUsed}</span></div>}
                  {framesAnalyzed !== undefined && <div><span className="text-slate-500">Frames:</span> <span className="text-slate-200 font-mono">{framesAnalyzed}</span></div>}
                  {processingTime !== undefined && <div><span className="text-slate-500">Latency:</span> <span className="text-cyan-300 font-mono">{processingTime}s</span></div>}
                  {authenticityScore !== undefined && <div><span className="text-slate-500">Authenticity:</span> <span className="text-emerald-400 font-mono">{authenticityScore}%</span></div>}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
