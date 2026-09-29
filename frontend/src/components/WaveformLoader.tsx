import { motion } from "framer-motion";

const bars = 12;

export default function WaveformLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="flex items-end gap-1 h-12">
        {Array.from({ length: bars }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 rounded-full bg-gradient-to-t from-blue-500 to-purple-500"
            animate={{
              height: [8, 24, 8],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.05,
            }}
          />
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-slate-400"
      >
        Analyzing voice…
      </motion.p>
    </div>
  );
}
