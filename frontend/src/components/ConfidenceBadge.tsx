import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, TrendingUp } from "lucide-react";

interface ConfidenceBadgeProps {
  level: "High Confidence" | "Moderate Confidence" | "Low Confidence";
  riskLevel?: "Real" | "Suspicious" | "Fake";
}

export default function ConfidenceBadge({ level, riskLevel }: ConfidenceBadgeProps) {
  const config = {
    "High Confidence": {
      color: "emerald",
      icon: CheckCircle,
      bg: "bg-emerald-500/20",
      border: "border-emerald-500/50",
      text: "text-emerald-300",
    },
    "Moderate Confidence": {
      color: "amber",
      icon: AlertTriangle,
      bg: "bg-amber-500/20",
      border: "border-amber-500/50",
      text: "text-amber-300",
    },
    "Low Confidence": {
      color: "red",
      icon: XCircle,
      bg: "bg-red-500/20",
      border: "border-red-500/50",
      text: "text-red-300",
    },
  };

  const { icon: Icon, bg, border, text } = config[level];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${bg} ${border} ${text}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-xs font-semibold">{level}</span>
    </motion.div>
  );
}
