import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  BookOpen,
  Brain,
  BarChart3,
  Clipboard,
  Sparkles,
  Quote,
} from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import CircularMeter from "../components/CircularMeter";
import Loader from "../components/Loader";
import ForensicCertificate from "../components/ForensicCertificate";
import { useToast } from "../context/ToastContext";
import { analyzeText, TextAnalysisResponse } from "../api/client";
import { useScanHistory } from "../hooks/useScanHistory";

const riskConfig = {
  Credible: {
    label: "Credible & Factual",
    color: "green" as const,
    icon: ShieldCheck,
    borderColor: "border-emerald-500/50",
    bgColor: "bg-emerald-500/20",
    textColor: "text-emerald-300",
  },
  Questionable: {
    label: "Questionable Credibility",
    color: "yellow" as const,
    icon: AlertTriangle,
    borderColor: "border-amber-500/50",
    bgColor: "bg-amber-500/20",
    textColor: "text-amber-300",
  },
  "Likely Misinformation": {
    label: "Synthetic Misinformation",
    color: "red" as const,
    icon: XCircle,
    borderColor: "border-red-500/50",
    bgColor: "bg-red-500/20",
    textColor: "text-red-300",
  },
};

const sampleTexts = [
  {
    label: "Sample 1: Fabricated 5G Health Conspiracy",
    type: "fake",
    text: "SHOCKING BOMBSHELL! Leaked documents PROVE secret 5G weather alteration towers are causing global magnetic storms! Scientists are STUNNED and corrupt elites are terrified this discovery is going viral! Act now before this censorship wipeout takes it down!!!",
  },
  {
    label: "Sample 2: Peer-Reviewed Scientific Journal",
    type: "credible",
    text: "According to a peer-reviewed investigation published in the IEEE Transactions on Information Forensics and Security, researchers analyzed spatial-frequency Fourier roll-off anomalies across 25,000 synthesized video frames. The experimental findings demonstrate that high-band spectral filtering combined with temporal optical flow tracking achieved a 99.4% cross-validation detection rate.",
  },
  {
    label: "Sample 3: Clickbait Financial Miracle",
    type: "questionable",
    text: "This 1 weird trick banks don't want you to know about will erase all debt overnight! Top Wall Street insiders are FURIOUS about this simple loophole that pays you thousands per week while you sleep.",
  },
];

export default function TextAnalysis() {
  const [searchParams] = useSearchParams();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TextAnalysisResponse | null>(null);
  const { addToast } = useToast();
  const { addScan } = useScanHistory();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const runAnalysisWithText = async (targetText: string) => {
    setText(targetText);
    abortRef.current = new AbortController();
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeText(targetText, abortRef.current.signal);
      setResult(data);
      addScan({
        type: "text",
        score: data.credibility_score,
        riskLevel: data.risk_level,
        name: targetText.slice(0, 50) + (targetText.length > 50 ? "..." : ""),
        details: {
          Credibility: `${data.credibility_score}%`,
          Readability: data.readability.level,
          "Word Count": data.readability.word_count,
          Bias: data.bias.level,
          Emotional: data.emotional_language.level,
          Time: `${data.processing_time}s`,
        },
      });
      addToast("Text credibility analysis complete", "success");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      addToast((err as Error).message || "Analysis failed", "error");
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  useEffect(() => {
    const sampleParam = searchParams.get("sample");
    if (sampleParam === "health-miracle") {
      runAnalysisWithText(sampleTexts[0].text);
    }
  }, [searchParams]);

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      setText(clipText.trim());
    } catch {
      addToast("Unable to read clipboard", "error");
    }
  };

  const handleAnalyze = () => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 20) {
      addToast("Please enter at least 20 characters for meaningful analysis", "error");
      return;
    }
    runAnalysisWithText(trimmed);
  };

  const badge = result ? riskConfig[result.risk_level] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
          <FileText className="w-4 h-4" />
          <span>NATURAL LANGUAGE PROCESSING • MISINFORMATION & BIAS AUDITOR</span>
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-100 mb-2">
          Text Misinformation Analyzer
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Evaluate editorial text, social posts, and claims for emotional manipulation intensity, clickbait headline patterns, readability, and missing source citations.
        </p>
      </div>

      {/* Fast Demo Sample Chips for Judges */}
      <div className="mb-8 p-4 rounded-2xl bg-slate-900/70 border border-amber-500/20 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>FAST DEMO EVALUATION (1-CLICK TEST SAMPLES):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleTexts.map((s, idx) => (
            <button
              key={idx}
              onClick={() => runAnalysisWithText(s.text)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                s.type === "fake"
                  ? "bg-red-500/15 hover:bg-red-500/25 text-red-300 border-red-500/40"
                  : s.type === "credible"
                  ? "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/40"
                  : "bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  s.type === "fake"
                    ? "bg-red-400 animate-pulse"
                    : s.type === "credible"
                    ? "bg-emerald-400"
                    : "bg-amber-400"
                }`}
              />
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Input & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Input */}
        <Card glow className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-slate-300">
              Input Article / Post Text
            </label>
            <button
              onClick={handlePaste}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Paste Clipboard</span>
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Paste text excerpt or article content to inspect for synthetic disinformation markers..."
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700/60 text-slate-100 placeholder-slate-500 text-sm focus:border-amber-400 transition-colors leading-relaxed font-sans"
            id="text-input"
          />

          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>Character Count: {text.length}</span>
            <span>Words: {text.trim() ? text.trim().split(/\s+/).length : 0}</span>
          </div>

          <Button
            onClick={handleAnalyze}
            loading={loading}
            disabled={!text.trim() || text.trim().length < 20}
            className="w-full bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-500/25"
            size="lg"
          >
            <Search className="w-5 h-5" />
            <span>Execute NLP Misinformation Audit</span>
          </Button>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {loading && (
            <Card className="min-h-[350px] flex items-center justify-center">
              <Loader type="text" />
            </Card>
          )}

          {!result && !loading && (
            <Card className="min-h-[350px] flex flex-col items-center justify-center text-center p-8 border-dashed border-slate-700">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-display font-semibold text-slate-200 text-base mb-1">
                Awaiting Text Ingestion
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Paste article content or select a fast demo sample above to view linguistic readability, clickbait detection, and bias indices.
              </p>
            </Card>
          )}

          {result && !loading && (
            <>
              {/* Credibility Score Meter */}
              <Card glow className="flex flex-col items-center py-6">
                <CircularMeter
                  value={result.credibility_score}
                  label="Credibility"
                  color={badge?.color ?? "blue"}
                />
                <div className="mt-4 flex flex-col items-center gap-2">
                  {badge && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-bold uppercase tracking-wider ${badge.borderColor} ${badge.bgColor} ${badge.textColor}`}
                    >
                      <badge.icon className="w-4 h-4" />
                      <span>{badge.label}</span>
                    </motion.div>
                  )}
                </div>
              </Card>

              {/* Explanation Summary */}
              <Card className="bg-slate-900/70 border-slate-800">
                <h4 className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
                  NLP Linguistic Audit Verdict
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {result.explanation}
                </p>
              </Card>

              {/* 4 Multi-Signal Linguistic Indicators */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase block">
                    Readability Grade
                  </span>
                  <p className="text-sm font-bold text-cyan-300 mt-0.5">
                    Grade {result.readability.grade_level.toFixed(1)} ({result.readability.level})
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase block">
                    Emotional Intensity
                  </span>
                  <p
                    className={`text-sm font-bold mt-0.5 ${
                      result.emotional_language.level === "High"
                        ? "text-red-400"
                        : result.emotional_language.level === "Moderate"
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {result.emotional_language.level} Sensationalism
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase block">
                    Clickbait Patterns
                  </span>
                  <p
                    className={`text-sm font-bold mt-0.5 ${
                      result.clickbait.detected ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {result.clickbait.detected ? "Sensational Triggers Found" : "Clean Syntax"}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase block">
                    Source Citations
                  </span>
                  <p
                    className={`text-sm font-bold mt-0.5 ${
                      result.credibility_signals.source_citations > 0
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {result.credibility_signals.source_citations} Citations Verified
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cryptographic Trust Certificate */}
      {result && !loading && (
        <div className="mb-10">
          <ForensicCertificate
            assetName={text.slice(0, 40) + "..."}
            assetType="Text"
            authenticityScore={result.credibility_score}
            riskLevel={result.risk_level === "Credible" ? "Credible" : "Likely Misinformation"}
            modelUsed="TruthShield NLP Misinformation Engine"
          />
        </div>
      )}
    </motion.div>
  );
}
