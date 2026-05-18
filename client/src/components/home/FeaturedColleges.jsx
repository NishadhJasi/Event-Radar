import { motion } from "framer-motion";
import { featuredColleges } from "../../data/mockData";
import SectionHeader from "../ui/SectionHeader";

export default function FeaturedColleges() {
  return (
    <section id="colleges" className="py-24 px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        <SectionHeader
          badge="Partner Colleges"
          title="Featured colleges"
          subtitle="Explore events from India's leading institutions."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {featuredColleges.map((college, i) => (
            <motion.div
              key={college.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group glass rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer transition-shadow hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <div
                className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${college.color} flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                {college.logo}
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{college.name}</h3>
              <p className="text-xs text-slate-500">{college.events} events</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
