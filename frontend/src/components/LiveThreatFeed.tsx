import { Video, Mic, Globe, FileText, ShieldCheck, AlertTriangle, XCircle } from "lucide-react";

const threats = [
  { type: "video", icon: Video, name: "board_meeting_final.mp4", result: "Deepfake Detected", color: "text-red-400", bgColor: "bg-red-500/10", time: "2s ago" },
  { type: "audio", icon: Mic, name: "customer_call_047.wav", result: "Authentic Voice", color: "text-emerald-400", bgColor: "bg-emerald-500/10", time: "5s ago" },
  { type: "url", icon: Globe, name: "paypa1-secure.click/login", result: "Phishing Detected", color: "text-red-400", bgColor: "bg-red-500/10", time: "8s ago" },
  { type: "text", icon: FileText, name: "Breaking: CEO announces...", result: "Clickbait Detected", color: "text-amber-400", bgColor: "bg-amber-500/10", time: "12s ago" },
  { type: "video", icon: Video, name: "interview_clip_hd.mp4", result: "Authentic", color: "text-emerald-400", bgColor: "bg-emerald-500/10", time: "15s ago" },
  { type: "audio", icon: Mic, name: "voicemail_urgent.mp3", result: "Voice Clone Detected", color: "text-red-400", bgColor: "bg-red-500/10", time: "18s ago" },
  { type: "url", icon: Globe, name: "github.com/truthshield", result: "Safe", color: "text-emerald-400", bgColor: "bg-emerald-500/10", time: "22s ago" },
  { type: "text", icon: FileText, name: "Scientists discover new...", result: "Credible", color: "text-emerald-400", bgColor: "bg-emerald-500/10", time: "25s ago" },
  { type: "video", icon: Video, name: "news_broadcast_v2.mov", result: "Suspicious", color: "text-amber-400", bgColor: "bg-amber-500/10", time: "30s ago" },
  { type: "url", icon: Globe, name: "amaz0n-deals.xyz/offer", result: "Malware Risk", color: "text-red-400", bgColor: "bg-red-500/10", time: "33s ago" },
];

const ResultIcon = ({ result }: { result: string }) => {
  if (result.includes("Authentic") || result === "Safe" || result === "Credible") {
    return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
  }
  if (result.includes("Suspicious") || result.includes("Clickbait")) {
    return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
  }
  return <XCircle className="w-3.5 h-3.5 text-red-400" />;
};

export default function LiveThreatFeed() {
  // Duplicate items for seamless scrolling
  const items = [...threats, ...threats];

  return (
    <div className="w-full overflow-hidden border-y border-slate-700/30 bg-slate-900/30 backdrop-blur-sm">
      <div className="flex items-center">
        <div className="flex-shrink-0 px-4 py-3 border-r border-slate-700/30 bg-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-ring" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider whitespace-nowrap">
              Live Feed
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="threat-feed-scroll flex items-center gap-8 px-4 py-3" style={{ width: "max-content" }}>
            {items.map((t, i) => {
              const Icon = t.icon;
              return (
                <div key={i} className="flex items-center gap-3 whitespace-nowrap">
                  <div className={`w-7 h-7 rounded-md ${t.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${t.color}`} />
                  </div>
                  <span className="text-xs text-slate-400 max-w-[140px] truncate">{t.name}</span>
                  <div className="flex items-center gap-1">
                    <ResultIcon result={t.result} />
                    <span className={`text-xs font-medium ${t.color}`}>{t.result}</span>
                  </div>
                  <span className="text-[10px] text-slate-600">{t.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
