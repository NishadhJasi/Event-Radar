import { motion } from "framer-motion";
import Button from "../ui/Button";

export default function Hero({ searchQuery = "", onSearchChange }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[92vh] flex items-center pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-slate-950 to-fuchsia-950/40 animate-gradient"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #0f172a 50%, #4c1d95 75%, #0f172a 100%)",
        }}
      />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%236366f1\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60" />

      <div className="relative max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass text-sm text-indigo-300 border border-indigo-500/20"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            2,400+ live campus events
          </motion.span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Discover{" "}
            <span className="text-gradient">campus events</span>
            <br />
            before anyone else
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-xl mb-8 leading-relaxed">
            Hackathons, fests, workshops & competitions from India&apos;s top colleges — curated, searchable, and one tap away.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8 max-w-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search hackathons, colleges, workshops..."
              className="flex-1 px-5 py-4 rounded-2xl glass text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <Button type="submit" variant="primary" size="lg" className="shrink-0">
              Search
            </Button>
          </form>

          <div className="flex flex-wrap gap-4">
            <Button to="/signup" variant="primary" size="lg">
              Get Started Free
            </Button>
            <Button to="/events" variant="secondary" size="lg">
              Explore Events
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/30 via-fuchsia-500/20 to-cyan-500/30 rounded-3xl blur-3xl animate-pulse-glow" />
          <div className="relative glass rounded-3xl p-6 border border-white/10 shadow-2xl animate-float">
            <div className="grid grid-cols-2 gap-4">
              <HeroCard
                title="Hackathons"
                count="340+"
                gradient="from-indigo-500 to-violet-600"
                delay={0}
              />
              <HeroCard
                title="Workshops"
                count="520+"
                gradient="from-fuchsia-500 to-pink-600"
                delay={0.1}
              />
              <HeroCard
                title="Cultural Fests"
                count="180+"
                gradient="from-cyan-500 to-blue-600"
                delay={0.2}
              />
              <HeroCard
                title="Competitions"
                count="290+"
                gradient="from-violet-500 to-indigo-600"
                delay={0.3}
              />
            </div>
            <div className="mt-4 p-4 rounded-2xl glass-light flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-500 flex items-center justify-center text-white font-bold shrink-0">
                ✓
              </div>
              <div>
                <p className="text-white font-semibold">Live registrations</p>
                <p className="text-slate-400 text-sm">1,240 students joined today</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroCard({ title, count, gradient, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + delay }}
      className={`p-5 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}
    >
      <p className="text-white/80 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-white mt-1">{count}</p>
    </motion.div>
  );
}
