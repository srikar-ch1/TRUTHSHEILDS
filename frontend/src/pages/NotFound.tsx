import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import Button from "../components/Button";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center"
    >
      <ShieldAlert className="w-20 h-20 text-slate-500 mb-6" />
      <h1 className="font-display font-bold text-3xl text-slate-100 mb-2">Page not found</h1>
      <p className="text-slate-400 mb-8 max-w-md">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </motion.div>
  );
}
