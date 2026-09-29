import { useToast } from "../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const styles = {
  success: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
  error: "border-red-500/50 bg-red-500/10 text-red-300",
  info: "border-blue-500/50 bg-blue-500/10 text-blue-300",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <div className="flex flex-col gap-2 pointer-events-auto">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100 }}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-xl backdrop-blur ${styles[t.type]}`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium flex-1">{t.message}</p>
                <button
                  onClick={() => removeToast(t.id)}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
