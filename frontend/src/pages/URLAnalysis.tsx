import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  Search,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clipboard,
  ExternalLink,
  Sparkles,
  Server,
  Key,
} from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import CircularMeter from "../components/CircularMeter";
import Loader from "../components/Loader";
import ForensicCertificate from "../components/ForensicCertificate";
import { useToast } from "../context/ToastContext";
import { analyzeURL, URLAnalysisResponse } from "../api/client";
import { useScanHistory } from "../hooks/useScanHistory";

const riskConfig = {
  Safe: {
    label: "Safe & Validated",
    color: "green" as const,
    icon: ShieldCheck,
    borderColor: "border-emerald-500/50",
    bgColor: "bg-emerald-500/20",
    textColor: "text-emerald-300",
  },
  Suspicious: {
    label: "Suspicious Domain",
    color: "yellow" as const,
    icon: ShieldAlert,
    borderColor: "border-amber-500/50",
    bgColor: "bg-amber-500/20",
    textColor: "text-amber-300",
  },
  Dangerous: {
    label: "Critical Phishing Threat",
    color: "red" as const,
    icon: ShieldOff,
    borderColor: "border-red-500/50",
    bgColor: "bg-red-500/20",
    textColor: "text-red-300",
  },
};

const severityColors: Record<string, string> = {
  critical: "text-red-400 bg-red-500/10 border-red-500/30",
  high: "text-red-400 bg-red-500/10 border-red-500/30",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  low: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
};

export default function URLAnalysis() {
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<URLAnalysisResponse | null>(null);
  const { addToast } = useToast();
  const { addScan } = useScanHistory();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const runAnalysisWithURL = async (targetUrl: string) => {
    setUrl(targetUrl);
    abortRef.current = new AbortController();
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeURL(targetUrl, abortRef.current.signal);
      setResult(data);
      addScan({
        type: "url",
        score: 100 - data.threat_score,
        riskLevel: data.risk_level,
        name: data.domain || targetUrl,
        details: {
          "Threat Score": `${data.threat_score}%`,
          Protocol: data.protocol,
          Domain: data.domain,
          SSL: data.ssl.valid ? "Valid" : "Invalid",
          "Flags Found": data.flags.length,
          Time: `${data.processing_time}s`,
        },
      });
      addToast("URL threat analysis complete", "success");
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
    if (sampleParam === "paypal-phish") {
      runAnalysisWithURL("https://paypa1-security-verification.com/login");
    }
  }, [searchParams]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text.trim());
    } catch {
      addToast("Unable to read clipboard", "error");
    }
  };

  const handleAnalyze = () => {
    const trimmed = url.trim();
    if (!trimmed) {
      addToast("Please enter a URL to analyze", "error");
      return;
    }
    runAnalysisWithURL(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) handleAnalyze();
  };

  const badge = result ? riskConfig[result.risk_level] : null;
  const safetyScore = result ? Math.max(0, 100 - result.threat_score) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
          <Globe className="w-4 h-4" />
          <span>NETWORK THREAT INTELLIGENCE • DNS & HOMOGRAPH PROBING</span>
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-100 mb-2">
          Phishing & URL Threat Scanner
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Probe domains for brand typosquatting, zero-day phishing payloads, deceptive punycode characters, and SSL trust chain flaws.
        </p>
      </div>

      {/* Fast Demo Sample Chips for Judges */}
      <div className="mb-8 p-4 rounded-2xl bg-slate-900/70 border border-emerald-500/20 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>FAST DEMO EVALUATION (1-CLICK TEST SAMPLES):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => runAnalysisWithURL("https://paypa1-security-verification.com/login")}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/40 transition-all flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span>Sample 1: PayPal Phishing Spoof (Dangerous)</span>
          </button>
          <button
            onClick={() => runAnalysisWithURL("https://github.com/enterprise")}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 transition-all flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Sample 2: GitHub Enterprise (Safe)</span>
          </button>
          <button
            onClick={() => runAnalysisWithURL("https://amaz0n-prime-security.xyz")}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 transition-all flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Sample 3: Amazon Typosquat Homograph</span>
          </button>
        </div>
      </div>

      {/* Grid: Input & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Input */}
        <Card glow className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase text-slate-300">
              Input URL / Domain Target
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="https://paypa1-security.com/login"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700/60 text-slate-100 placeholder-slate-500 text-sm focus:border-emerald-400 transition-colors font-mono"
                  id="url-input"
                />
              </div>
              <button
                onClick={handlePaste}
                className="px-3.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-100 hover:border-emerald-500 transition-all"
                title="Paste from clipboard"
              >
                <Clipboard className="w-4 h-4" />
              </button>
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            loading={loading}
            disabled={!url.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            <Search className="w-5 h-5" />
            <span>Run Deep URL Threat Probe</span>
          </Button>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {loading && (
            <Card className="min-h-[350px] flex items-center justify-center">
              <Loader type="url" />
            </Card>
          )}

          {!result && !loading && (
            <Card className="min-h-[350px] flex flex-col items-center justify-center text-center p-8 border-dashed border-slate-700">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="font-display font-semibold text-slate-200 text-base mb-1">
                Awaiting Target URL
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Enter an endpoint or click a Fast-Demo button above to verify DNS records, SSL encryption, and Levenshtein spoofing.
              </p>
            </Card>
          )}

          {result && !loading && (
            <>
              {/* Safety Score Meter */}
              <Card glow className="flex flex-col items-center py-6">
                <CircularMeter
                  value={safetyScore}
                  label="Trust Score"
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

              {/* Threat Level Bar */}
              <Card>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Risk Probability:</span>
                    <span className="text-red-400 font-bold">{result.threat_score}% Threat</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700 p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, result.threat_score)}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full bg-red-500 shadow-[0_0_12px_#ef4444]"
                    />
                  </div>
                </div>
              </Card>

              {/* Security Flags */}
              {result.flags.length > 0 && (
                <Card className="space-y-2">
                  <h4 className="text-xs font-mono text-red-400 uppercase tracking-wider mb-2">
                    Threat Indicators Detected ({result.flags.length})
                  </h4>
                  <div className="space-y-2">
                    {result.flags.map((flag, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border text-xs ${
                          severityColors[flag.severity.toLowerCase()] || "text-slate-300 border-slate-700"
                        }`}
                      >
                        <span className="font-bold">{flag.flag}:</span> {flag.detail}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      {/* SSL & DNS Network Infrastructure Cards */}
      {result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Key className="w-4 h-4" />
              <span>SSL / TLS ENCRYPTION CERTIFICATE</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono text-slate-300">
              <div className="flex justify-between pb-1 border-b border-slate-800">
                <span className="text-slate-400">Validity:</span>
                <span className={result.ssl.valid ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                  {result.ssl.valid ? "Valid Trusted Certificate" : "Invalid / Untrusted Root"}
                </span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-800">
                <span className="text-slate-400">Issuer CA:</span>
                <span>{result.ssl.issuer || "Self-Signed or Unknown"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Expiration Date:</span>
                <span>{result.ssl.expires || "N/A"}</span>
              </div>
            </div>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Server className="w-4 h-4" />
              <span>DNS RESOLUTION & HOMOGRAPH PROBE</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono text-slate-300">
              <div className="flex justify-between pb-1 border-b border-slate-800">
                <span className="text-slate-400">Host IP:</span>
                <span>{result.dns.ip || "Unresolved DNS"}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-800">
                <span className="text-slate-400">Typosquat Spoof Target:</span>
                <span className={result.typosquatting.detected ? "text-red-400 font-bold" : "text-emerald-400"}>
                  {result.typosquatting.detected
                    ? `${result.typosquatting.target} (Dist: ${result.typosquatting.distance})`
                    : "No Spoof Detected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Audit Protocol:</span>
                <span className="uppercase">{result.protocol}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Cryptographic Trust Certificate */}
      {result && !loading && (
        <div className="mb-10">
          <ForensicCertificate
            assetName={result.domain || url}
            assetType="URL"
            authenticityScore={safetyScore}
            riskLevel={result.risk_level}
            modelUsed="TruthShield Network Security Engine"
          />
        </div>
      )}
    </motion.div>
  );
}
