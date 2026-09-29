import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const loadingMessages = [
  "Analyzing frames...",
  "Running neural inference...",
  "Processing results...",
];

export default function Loader({ type = "video" }: { type?: "video" | "audio" | "url" | "text" }) {
  const [messageIndex, setMessageIndex] = useState(0);

  const messageMap = {
    video: ["Extracting frames...", "Running neural inference...", "Analyzing temporal patterns..."],
    audio: ["Converting to spectrogram...", "Running acoustic inference...", "Analyzing spectral patterns..."],
    url: ["Resolving DNS routes...", "Auditing SSL & typosquatting...", "Synthesizing threat intelligence..."],
    text: ["Parsing linguistic sensationalism...", "Verifying citations & sources...", "Calculating credibility index..."],
  };

  const messages = messageMap[type] || messageMap.video;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <motion.div
        className="w-14 h-14 rounded-full border-2 border-cyan-500/30 border-t-cyan-400"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        key={messageIndex}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        className="text-sm text-slate-400 font-medium"
      >
        {messages[messageIndex]}
      </motion.p>
    </div>
  );
}
