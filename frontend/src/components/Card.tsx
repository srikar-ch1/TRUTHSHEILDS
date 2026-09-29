import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export default function Card({ children, className = "", glow = false }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border border-slate-600/30 bg-slate-800/40 backdrop-blur-xl p-6 ${
        glow ? "shadow-[0_0_30px_rgba(34,211,238,0.06)] border-cyan-500/20" : "shadow-xl shadow-black/30"
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
