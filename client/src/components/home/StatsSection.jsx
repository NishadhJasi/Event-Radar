import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { platformStats } from "../../data/mockData";
import SectionHeader from "../ui/SectionHeader";

function AnimatedStat({ value, suffix, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  const formatted =
    value >= 1000 && count >= 1000
      ? `${Math.round(count / 1000)}k`
      : count.toLocaleString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-8 text-center group hover:border-indigo-500/30 transition-all duration-300"
    >
      <p className="text-4xl md:text-5xl font-extrabold text-gradient mb-2">
        {inView ? formatted : "0"}
        {suffix}
      </p>
      <p className="text-slate-400 font-medium">{label}</p>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="By the numbers"
          title="Trusted by students nationwide"
          subtitle="Join thousands discovering their next big opportunity."
        />
        <div className="grid sm:grid-cols-3 gap-6">
          {platformStats.map((stat) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
