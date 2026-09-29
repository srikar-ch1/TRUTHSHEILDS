import { motion } from "framer-motion";

interface CircularMeterProps {
  value: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  color?: "green" | "yellow" | "red" | "blue";
}

const colorMap = {
  green: { stroke: "#22c55e", glow: "rgba(34, 197, 94, 0.3)" },
  yellow: { stroke: "#eab308", glow: "rgba(234, 179, 8, 0.3)" },
  red: { stroke: "#ef4444", glow: "rgba(239, 68, 68, 0.3)" },
  blue: { stroke: "#3b82f6", glow: "rgba(59, 130, 246, 0.3)" },
};

export default function CircularMeter({
  value,
  label = "Score",
  size = 180,
  strokeWidth = 12,
  color = "blue",
}: CircularMeterProps) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;
  const { stroke, glow } = colorMap[color];

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
        />
        {/* Glow layer */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={glow}
          strokeWidth={strokeWidth + 8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: "blur(8px)" }}
        />
        {/* Main progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-display font-bold text-white"
        >
          {Math.round(value)}%
        </motion.span>
        {label && (
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
