import { motion } from "framer-motion";
import { Upload, Cpu, ShieldAlert, FileCheck } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Drop your file, paste a URL, or enter text",
  },
  {
    icon: Cpu,
    title: "AI Analysis",
    description: "Neural networks process your content in real-time",
  },
  {
    icon: ShieldAlert,
    title: "Threat Assessment",
    description: "Multi-signal scoring with confidence levels",
  },
  {
    icon: FileCheck,
    title: "Report",
    description: "Detailed results with explainable AI insights",
  },
];

export default function StepPipeline() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 relative">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="relative flex flex-col items-center text-center px-4"
          >
            {/* Connecting line (hidden on mobile) */}
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] h-[2px]">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3, duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-cyan-500/40 to-indigo-500/40 origin-left"
                />
              </div>
            )}

            {/* Step number + icon */}
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-indigo-500/15 border border-cyan-500/30 flex items-center justify-center group-hover:from-cyan-500/25 group-hover:to-indigo-500/25 transition-colors">
                <Icon className="w-7 h-7 text-cyan-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-[11px] font-bold text-slate-950">
                {i + 1}
              </div>
            </div>

            <h4 className="font-display font-semibold text-slate-100 mb-1.5">{step.title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed max-w-[200px]">{step.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
