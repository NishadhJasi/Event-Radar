import { motion } from "framer-motion";

export default function SectionHeader({ badge, title, subtitle, id }) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-2xl mx-auto mb-14"
    >
      {badge && (
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full glass text-indigo-300 border border-indigo-500/30">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-400 text-lg leading-relaxed">{subtitle}</p>
      )}
    </motion.div>
  );
}
