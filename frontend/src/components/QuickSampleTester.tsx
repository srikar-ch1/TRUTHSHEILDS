import { Video, Mic, Globe, FileText, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface DemoSample {
  id: string;
  category: "video" | "audio" | "url" | "text";
  title: string;
  badge: string;
  verdict: "Fake" | "Real" | "Dangerous" | "Misinformation";
  threatScore: number;
  description: string;
  route: string;
}

export const DEMO_SAMPLES: DemoSample[] = [
  {
    id: "sample-video-fake",
    category: "video",
    title: "Executive Face-Swap Deepfake",
    badge: "Synthetic Media",
    verdict: "Fake",
    threatScore: 92.4,
    description: "FFT spectrum anomaly roll-off with blurred facial boundary blending seams.",
    route: "/video?sample=face-swap",
  },
  {
    id: "sample-audio-clone",
    category: "audio",
    title: "CEO Wire Transfer Voice Clone",
    badge: "Audio Deepfake",
    verdict: "Fake",
    threatScore: 96.1,
    description: "Robotic pitch monotony and flat fundamental frequency (F0) dynamics.",
    route: "/audio?sample=ceo-clone",
  },
  {
    id: "sample-url-phish",
    category: "url",
    title: "paypa1-security-verification.com",
    badge: "Phishing Threat",
    verdict: "Dangerous",
    threatScore: 98.7,
    description: "Typosquatting punycode spoof targeting PayPal with untrusted self-signed SSL.",
    route: "/url?sample=paypal-phish",
  },
  {
    id: "sample-text-misinfo",
    category: "text",
    title: "Viral Fabricated Health Miracle",
    badge: "Misinformation",
    verdict: "Misinformation",
    threatScore: 89.0,
    description: "Extreme emotional language density, missing citations, clickbait patterns.",
    route: "/text?sample=health-miracle",
  },
];

interface QuickSampleTesterProps {
  onSelectSample?: (sample: DemoSample) => void;
}

export default function QuickSampleTester({ onSelectSample }: QuickSampleTesterProps) {
  const getIcon = (cat: DemoSample["category"]) => {
    switch (cat) {
      case "video":
        return <Video className="w-4 h-4 text-cyan-400" />;
      case "audio":
        return <Mic className="w-4 h-4 text-violet-400" />;
      case "url":
        return <Globe className="w-4 h-4 text-emerald-400" />;
      case "text":
        return <FileText className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-display font-semibold text-slate-100 text-sm flex items-center gap-2">
              Hackathon Fast-Test Benchmark Samples
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                1-Click Inspection
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              No files required. Test complete multi-signal forensic models instantly.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DEMO_SAMPLES.map((sample) => (
          <Link
            key={sample.id}
            to={sample.route}
            onClick={() => onSelectSample?.(sample)}
            className="group p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  {getIcon(sample.category)}
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-red-500/15 text-red-400 border border-red-500/30">
                  {sample.threatScore}% Threat
                </span>
              </div>

              <h5 className="font-semibold text-slate-200 text-xs sm:text-sm group-hover:text-cyan-300 transition-colors mb-1 truncate">
                {sample.title}
              </h5>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {sample.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] font-medium text-cyan-400 group-hover:text-cyan-300">
              <span>Run AI Forensics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
