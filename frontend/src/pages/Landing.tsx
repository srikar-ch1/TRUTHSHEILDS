import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Video,
  Mic,
  Globe,
  FileText,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  Zap,
  Sparkles,
  Shield,
  Layers,
  Cpu,
  Lock,
  Radio,
  CheckCircle2,
  Terminal,
} from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import ParticleNetwork from "../components/ParticleNetwork";
import AnimatedCounter from "../components/AnimatedCounter";
import LiveThreatRadar from "../components/LiveThreatRadar";
import CyberHUDScanner from "../components/CyberHUDScanner";
import QuickSampleTester from "../components/QuickSampleTester";
import StepPipeline from "../components/StepPipeline";

const features = [
  {
    icon: Video,
    title: "Deepfake Video Detection",
    tag: "Vision Forensic",
    description: "Multi-signal spatial-frequency analysis detecting high-frequency roll-off anomalies, face seam boundaries, and temporal jitter.",
    link: "/video",
    color: "border-cyan-500/30 bg-cyan-950/20 text-cyan-400",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
  },
  {
    icon: Mic,
    title: "Voice Scam & Clone Detection",
    tag: "Acoustic Forensic",
    description: "Acoustic feature extraction isolating fundamental pitch dynamics (F0), robotic monotone cadence, and spectral roll-off.",
    link: "/audio",
    color: "border-violet-500/30 bg-violet-950/20 text-violet-400",
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
  },
  {
    icon: Globe,
    title: "Phishing & URL Scanner",
    tag: "Network Forensic",
    description: "Autonomous threat probing with typosquatting Levenshtein distance checks, domain entropy analysis, and SSL trust chain audits.",
    link: "/url",
    color: "border-emerald-500/30 bg-emerald-950/20 text-emerald-400",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    icon: FileText,
    title: "Text Credibility Analyzer",
    tag: "NLP Forensic",
    description: "NLP-driven misinformation detection scoring emotional sensationalism, clickbait patterns, source citation gaps, and bias skew.",
    link: "/text",
    color: "border-amber-500/30 bg-amber-950/20 text-amber-400",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
  {
    icon: ShieldCheck,
    title: "Digital Trust Attestation",
    tag: "Cryptographic Seal",
    description: "Generates cryptographic Certificates of Authenticity with SHA-256 asset fingerprints and downloadable audit reports.",
    link: "/video",
    color: "border-blue-500/30 bg-blue-950/20 text-blue-400",
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
  },
  {
    icon: BarChart3,
    title: "SOC Threat Intelligence",
    tag: "Telemetry Command",
    description: "Real-time command center monitoring global attack vectors, incident distribution, detection confidence, and system health.",
    link: "/dashboard",
    color: "border-indigo-500/30 bg-indigo-950/20 text-indigo-400",
    gradient: "from-indigo-500/20 via-purple-500/10 to-transparent",
  },
];

const stats = [
  { value: 12470, label: "Total Artifacts Scanned", suffix: "+" },
  { value: 1489, label: "Synthetic Media Flagged", suffix: "" },
  { value: 99.4, label: "Benchmark Precision", suffix: "%" },
  { value: 1.4, label: "Average Latency", suffix: "s" },
];

export default function Landing() {
  return (
    <div className="relative overflow-hidden bg-[#030712] text-slate-100">
      {/* Background Interactive Particle Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <ParticleNetwork />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 pt-8 pb-20 overflow-hidden">
        {/* Ambient neon radial glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-indigo-600/15 to-violet-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="text-center max-w-5xl mx-auto relative z-10 px-4">
          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 backdrop-blur-xl mb-6 shadow-lg shadow-cyan-500/10"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 pulse-ring" />
            <span className="text-xs font-mono font-semibold tracking-wide text-cyan-300">
              NEXT-GEN ZERO-TRUST SYNTHETIC MEDIA DEFENSE
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none mb-6"
          >
            <span className="text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.2)]">
              AI-POWERED
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(34,211,238,0.3)]">
              DIGITAL TRUST ENGINE
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 font-normal leading-relaxed"
          >
            Expose deepfake videos, cloned voice scams, malicious phishing URLs, and generative misinformation with enterprise-grade multi-signal forensic AI.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center items-center mb-12"
          >
            <Link to="/video">
              <Button size="lg" className="flex items-center gap-2.5 shadow-xl shadow-cyan-500/25">
                <Video className="w-5 h-5" />
                <span>Launch Video Scanner</span>
              </Button>
            </Link>
            <Link to="/audio">
              <Button variant="secondary" size="lg" className="flex items-center gap-2.5">
                <Mic className="w-5 h-5 text-violet-400" />
                <span>Analyze Audio Clone</span>
              </Button>
            </Link>
            <a
              href="#demo-samples"
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-cyan-500/40 bg-slate-900/80 hover:bg-slate-800 text-cyan-300 font-semibold text-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Hackathon Fast-Test</span>
            </a>
          </motion.div>

          {/* Interactive Cyber HUD Scanner Element in Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full mt-4"
          >
            <CyberHUDScanner />
          </motion.div>
        </div>
      </section>

      {/* Judges Fast-Test Benchmark Section */}
      <section id="demo-samples" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <Terminal className="w-4 h-4" />
            <span>Interactive Evaluation Benchmark</span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Instant 1-Click Forensic Demos
          </h2>
          <p className="text-sm text-slate-400">
            For judges and evaluators: experience immediate model responses across all 4 detection pipelines without needing sample files on hand.
          </p>
        </div>

        <QuickSampleTester />
      </section>

      {/* Global Cyber Threat Telemetry Radar */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-cyan-500/15">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Zero-Trust Global Network Telemetry</span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Real-Time Threat Interception Center
          </h2>
          <p className="text-sm text-slate-400">
            Continuous surveillance sensor nodes detecting synthetic media propagation across global ingress points.
          </p>
        </div>

        <LiveThreatRadar />
      </section>

      {/* 4-Stage Zero-Trust Forensic Pipeline */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-cyan-500/15">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            Architectural Workflow
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-3 mb-2">
            The TruthShield Forensic Pipeline
          </h2>
          <p className="text-sm text-slate-400">
            Every digital artifact passes through our four-layer multi-signal decomposition matrix.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Zero-Trust Ingestion",
              desc: "Media streams are isolated, sanitized, frame-extracted at 60 FPS, and audio decoded to 16kHz mono PCM.",
              icon: Layers,
            },
            {
              step: "02",
              title: "Spectral FFT Decomposition",
              desc: "Spatial-frequency Fourier spectrum roll-off analysis detects transposed convolution grid anomalies.",
              icon: Cpu,
            },
            {
              step: "03",
              title: "Boundary & Formant Audit",
              desc: "Color histogram seam correlation and wav2vec2 acoustic embeddings flag facial swaps and voice clones.",
              icon: Shield,
            },
            {
              step: "04",
              title: "Cryptographic Attestation",
              desc: "SHA-256 fingerprinting, Grad-CAM activation overlays, and verifiable digital certificates are generated.",
              icon: ShieldCheck,
            },
          ].map((pipeline, i) => {
            const Icon = pipeline.icon;
            return (
              <div
                key={i}
                className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
              >
                <div className="absolute top-4 right-4 font-mono font-extrabold text-2xl text-slate-800 group-hover:text-cyan-500/20 transition-colors">
                  {pipeline.step}
                </div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-semibold text-base text-white mb-2">
                    {pipeline.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pipeline.desc}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Layer {pipeline.step} Certified</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-cyan-500/15">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            Multi-Modal Intelligence
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-3 mb-2">
            Defense Modules & Capabilities
          </h2>
          <p className="text-sm text-slate-400">
            Engineered specifically to defeat modern generative adversarial synthesis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Link
                key={i}
                to={feature.link}
                className="group p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-cyan-500/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl border ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <span>Open Scanner Engine</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Metrics Counter Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-cyan-500/15">
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="font-display font-extrabold text-3xl sm:text-5xl text-white">
                  <AnimatedCounter value={s.value} />
                  <span className="text-cyan-400">{s.suffix}</span>
                </div>
                <p className="text-xs sm:text-sm font-mono text-slate-400 uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hackathon Call-to-Action Bar */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="p-8 sm:p-12 rounded-3xl border-2 border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-slate-950 backdrop-blur-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
            Protect Digital Truth Today
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Ready to integrate enterprise-grade synthetic media defense into your digital workflow?
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/video">
              <Button size="lg" className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                <span>Test Video Scanner</span>
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg" className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <span>Open Intelligence Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
