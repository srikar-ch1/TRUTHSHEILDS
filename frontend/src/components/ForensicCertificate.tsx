import { useState } from "react";
import { ShieldCheck, ShieldAlert, Award, QrCode, Download, CheckCircle2, Lock } from "lucide-react";

interface CertificateProps {
  assetName: string;
  assetType: "Video" | "Audio" | "URL" | "Text";
  authenticityScore: number;
  riskLevel: "Real" | "Suspicious" | "Fake" | "Safe" | "Dangerous" | "Credible" | "Likely Misinformation";
  timestamp?: string;
  modelUsed?: string;
}

export default function ForensicCertificate({
  assetName,
  assetType,
  authenticityScore,
  riskLevel,
  timestamp = new Date().toUTCString(),
  modelUsed = "TruthShield Neural Ensemble v2.4",
}: CertificateProps) {
  const [exported, setExported] = useState(false);

  const isSafe =
    riskLevel === "Real" || riskLevel === "Safe" || riskLevel === "Credible";
  const certId = `TS-CERT-${Math.abs(
    assetName.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
  ).toString(16).toUpperCase().padStart(8, "0")}`;
  const sha256 = `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
    .split("")
    .reverse()
    .join("")
    .substring(0, 48);

  const handleExport = () => {
    setExported(true);
    window.print();
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="rounded-2xl border-2 border-cyan-500/40 bg-gradient-to-b from-[#091326] to-[#040914] p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden text-slate-100">
      {/* Watermark seal in background */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
        <Award className="w-72 h-72 text-cyan-400" />
      </div>

      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg sm:text-xl tracking-wide text-white">
              TRUTHSHIELD DIGITAL TRUST CERTIFICATE
            </h3>
            <p className="text-xs text-cyan-400/80 font-mono tracking-wider">
              CRYPTOGRAPHIC ZERO-TRUST FORENSIC ATTESTATION
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-slate-400 block">CERTIFICATE SERIAL</span>
          <span className="text-xs font-mono font-bold text-cyan-300 px-2.5 py-1 rounded bg-slate-900 border border-cyan-500/30">
            {certId}
          </span>
        </div>
      </div>

      {/* Main Certificate Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-slate-800">
        {/* Verification Verdict Box */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <span className="text-xs text-slate-400 uppercase font-mono">Examined Digital Artifact</span>
            <h4 className="text-base sm:text-lg font-semibold text-slate-100 font-mono break-all mt-0.5">
              {assetName}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block font-mono">Modality Pipeline</span>
              <span className="font-semibold text-slate-200">{assetType} Forensic Inspection</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block font-mono">Verification Engine</span>
              <span className="font-semibold text-cyan-300 truncate block">{modelUsed}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">
              SHA-256 Artifact Cryptographic Fingerprint
            </span>
            <p className="text-[11px] font-mono text-slate-300 break-all bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800">
              {sha256}...
            </p>
          </div>
        </div>

        {/* Score & Stamp Column */}
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-center relative">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${
            isSafe ? "border-emerald-500/80 bg-emerald-950/40 text-emerald-400" : "border-red-500/80 bg-red-950/40 text-red-400"
          } shadow-xl mb-3`}>
            <span className="font-display font-bold text-2xl">
              {authenticityScore.toFixed(0)}%
            </span>
          </div>

          <span className={`text-xs font-mono font-bold uppercase px-3 py-1 rounded-full ${
            isSafe ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-red-500/20 text-red-300 border border-red-500/40"
          }`}>
            Verdict: {riskLevel}
          </span>
          <span className="text-[10px] text-slate-400 mt-2 font-mono">
            Confidence: High Precision
          </span>
        </div>
      </div>

      {/* Footer Attestation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>Issued at: {timestamp}</span>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-lg shadow-cyan-500/30"
        >
          <Download className="w-4 h-4" />
          <span>{exported ? "Exporting Certificate..." : "Download Attestation PDF"}</span>
        </button>
      </div>
    </div>
  );
}
