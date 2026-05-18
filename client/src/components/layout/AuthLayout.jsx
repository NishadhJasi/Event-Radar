import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import GlowBackground from "../ui/GlowBackground";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative">
      <GlowBackground />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white font-bold shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            ER
          </span>
          <span className="font-bold text-xl text-white">
            Event <span className="text-gradient">Radar</span>
          </span>
        </Link>

        <div className="glass rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/30 border border-white/10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">{title}</h1>
          {subtitle && (
            <p className="text-slate-400 text-center text-sm mb-8">{subtitle}</p>
          )}
          {children}
        </div>
      </motion.div>
    </div>
  );
}
