import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Video, Mic, Globe, FileText, Trash2, Download, Filter, ChevronDown, ShieldCheck, AlertTriangle, XCircle } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { useScanHistory, ScanRecord } from "../hooks/useScanHistory";
import { useToast } from "../context/ToastContext";

const typeConfig: Record<string, { icon: typeof Video; label: string; color: string; bgColor: string }> = {
  video: { icon: Video, label: "Video", color: "text-blue-400", bgColor: "bg-blue-500/10" },
  audio: { icon: Mic, label: "Audio", color: "text-violet-400", bgColor: "bg-violet-500/10" },
  url: { icon: Globe, label: "URL", color: "text-cyan-400", bgColor: "bg-cyan-500/10" },
  text: { icon: FileText, label: "Text", color: "text-amber-400", bgColor: "bg-amber-500/10" },
};

function getRiskIcon(riskLevel: string) {
  const level = riskLevel.toLowerCase();
  if (level.includes("safe") || level.includes("real") || level.includes("authentic") || level.includes("credible")) {
    return { icon: ShieldCheck, color: "text-emerald-400", bgColor: "bg-emerald-500/10" };
  }
  if (level.includes("suspicious") || level.includes("questionable") || level.includes("moderate")) {
    return { icon: AlertTriangle, color: "text-amber-400", bgColor: "bg-amber-500/10" };
  }
  return { icon: XCircle, color: "text-red-400", bgColor: "bg-red-500/10" };
}

function formatTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function History() {
  const { history, clearHistory, getStats, exportHistory } = useScanHistory();
  const { addToast } = useToast();
  const [filter, setFilter] = useState<"all" | "video" | "audio" | "url" | "text">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const stats = getStats();
  const filtered = filter === "all" ? history : history.filter((r) => r.type === filter);

  const handleExport = () => {
    const json = exportHistory();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `truthshield_history_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("History exported successfully", "success");
  };

  const handleClear = () => {
    clearHistory();
    addToast("Scan history cleared", "success");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="mb-10 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-100 mb-2">
            Scan History
          </h1>
          <p className="text-slate-400">
            View and manage your past analysis results.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleExport} disabled={history.length === 0}>
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="danger" size="sm" onClick={handleClear} disabled={history.length === 0}>
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="text-center py-4">
          <p className="text-2xl font-display font-bold text-slate-100">{stats.total}</p>
          <p className="text-xs text-slate-400 mt-1">Total Scans</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-2xl font-display font-bold text-red-400">{stats.threatsDetected}</p>
          <p className="text-xs text-slate-400 mt-1">Threats Found</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-2xl font-display font-bold text-cyan-400">{stats.avgScore}%</p>
          <p className="text-xs text-slate-400 mt-1">Avg. Score</p>
        </Card>
        <Card className="text-center py-4">
          <div className="flex justify-center gap-3">
            {(["video", "audio", "url", "text"] as const).map((t) => {
              const cfg = typeConfig[t];
              return (
                <div key={t} className="text-center">
                  <p className={`text-lg font-bold ${cfg.color}`}>{stats.byType[t]}</p>
                  <p className="text-[10px] text-slate-500">{cfg.label}</p>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-1">By Type</p>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-slate-500" />
        <span className="text-xs text-slate-500 mr-2">Filter:</span>
        {(["all", "video", "audio", "url", "text"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f
                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 border border-slate-700/30 hover:text-slate-200 hover:border-slate-600/50"
            }`}
          >
            {f === "all" ? "All" : typeConfig[f].label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <Clock className="w-16 h-16 text-slate-600 mb-4" />
          <p className="text-slate-400">
            {history.length === 0
              ? "No scans yet. Run an analysis to see results here."
              : "No scans match the selected filter."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((scan, i) => {
              const cfg = typeConfig[scan.type];
              const risk = getRiskIcon(scan.riskLevel);
              const Icon = cfg.icon;
              const RiskIcon = risk.icon;
              const isExpanded = expandedId === scan.id;

              return (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <div
                    className={`rounded-xl border bg-slate-800/40 backdrop-blur-xl overflow-hidden transition-all ${
                      isExpanded ? "border-cyan-500/30 shadow-lg shadow-cyan-500/5" : "border-slate-600/30"
                    }`}
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : scan.id)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-slate-800/60 transition-colors text-left"
                    >
                      <div className={`w-10 h-10 rounded-lg ${cfg.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{scan.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{formatTimeAgo(scan.timestamp)}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${risk.bgColor}`}>
                          <RiskIcon className={`w-3.5 h-3.5 ${risk.color}`} />
                          <span className={`text-xs font-medium ${risk.color}`}>{scan.riskLevel}</span>
                        </div>
                        <span className="text-lg font-display font-bold text-slate-200 w-14 text-right">
                          {Math.round(scan.score)}%
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0 border-t border-slate-700/30">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                              {Object.entries(scan.details).map(([key, value]) => (
                                <div key={key} className="text-sm">
                                  <span className="text-slate-500 text-xs">{key}</span>
                                  <p className="text-slate-300 font-medium">{String(value)}</p>
                                </div>
                              ))}
                            </div>
                            <p className="text-[11px] text-slate-600 mt-3">
                              {new Date(scan.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
