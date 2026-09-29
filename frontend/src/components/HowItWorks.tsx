import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Cpu, Layers, BarChart3, Zap, Globe, ShieldCheck, FileText, Search } from "lucide-react";
import Card from "./Card";

export default function HowItWorks({ type = "video" }: { type?: "video" | "audio" | "url" | "text" }) {
  const [isOpen, setIsOpen] = useState(false);

  const videoSteps = [
    {
      icon: Layers,
      title: "Frame Extraction",
      description: "Extracts key frames evenly sampled from the video and resizes them for spatial-frequency evaluation.",
    },
    {
      icon: Cpu,
      title: "CNN-Based Classification",
      description: "Neural network ensemble analyzes each frame for synthetic blending boundaries, frequency roll-off, and facial anomalies.",
    },
    {
      icon: BarChart3,
      title: "Temporal Averaging",
      description: "Individual frame predictions are aggregated across the temporal axis to measure stability and eliminate false positives.",
    },
    {
      icon: Zap,
      title: "Confidence Scoring",
      description: "Scores mapped to confidence tiers with dynamic Grad-CAM activation visualization and verifiable risk rating.",
    },
  ];

  const audioSteps = [
    {
      icon: Layers,
      title: "Spectrogram Conversion",
      description: "Audio converted to mel-spectrogram matrices capturing acoustic harmonics, formant contours, and pitch jitter.",
    },
    {
      icon: Cpu,
      title: "Acoustic Neural Classification",
      description: "Acoustic transformer scans for neural voice cloning artifacts, flat phoneme transitions, and robotic cadence.",
    },
    {
      icon: BarChart3,
      title: "Pitch & Harmonic Analysis",
      description: "Evaluates F0 fundamental frequency variability and respiratory micro-pauses indicative of natural human vocal tracts.",
    },
    {
      icon: Zap,
      title: "Scam Probability",
      description: "Synthesizes acoustic confidence into actionable voice-clone probability and security recommendations.",
    },
  ];

  const urlSteps = [
    {
      icon: Globe,
      title: "DNS & Routing Probe",
      description: "Resolves destination IP addresses, nameserver authority records, and autonomous system numbers (ASN).",
    },
    {
      icon: Search,
      title: "Typosquatting & Levenshtein Check",
      description: "Scans domain permutations against high-risk banking, crypto, and enterprise brand registries for homoglyph mimics.",
    },
    {
      icon: ShieldCheck,
      title: "SSL/TLS Chain Verification",
      description: "Audits certificate authority root of trust, expiration status, and domain encryption legitimacy.",
    },
    {
      icon: Zap,
      title: "Heuristic Threat Index",
      description: "Synthesizes entropy indicators, credential harvesting query parameters, and URL structural anomaly scores.",
    },
  ];

  const textSteps = [
    {
      icon: FileText,
      title: "Linguistic Sensationalism Parsing",
      description: "Detects emotional polarization, clickbait regex triggers, exaggerated syntax, and manipulative rhetoric.",
    },
    {
      icon: Search,
      title: "Source Attribution Verification",
      description: "Identifies peer-reviewed references, academic citations, direct quotes, and verifiable factual claims.",
    },
    {
      icon: BarChart3,
      title: "Readability & Structural Metrics",
      description: "Calculates Flesch-Kincaid readability, sentence syntax variance, and lexical density benchmarks.",
    },
    {
      icon: Zap,
      title: "Credibility Scoring",
      description: "Weighs inflammatory markers against authenticated signals to produce a transparent credibility rating.",
    },
  ];

  const stepMap = {
    video: videoSteps,
    audio: audioSteps,
    url: urlSteps,
    text: textSteps,
  };

  const steps = stepMap[type] || videoSteps;

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
      >
        <h3 className="font-display font-semibold text-slate-100">How Our AI Works</h3>
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
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-200 mb-1">{step.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
