import { motion } from "framer-motion";
import { upcomingPrograms } from "../../data/mockData";
import SectionHeader from "../ui/SectionHeader";
import Button from "../ui/Button";

export default function UpcomingHackathons() {
  return (
    <section id="programs" className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Coming Soon"
          title="Hackathons & workshops"
          subtitle="Level up your skills with intensive programs from top organizers."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {upcomingPrograms.map((program, i) => (
            <motion.article
              key={program.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group glass rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={program.img}
                  alt={program.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                <span className="absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full bg-indigo-600/90 text-white">
                  {program.type}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1 gap-3">
                <h3 className="text-lg font-bold text-white">{program.title}</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg glass-light text-slate-300">{program.date}</span>
                  <span className="px-2.5 py-1 rounded-lg glass-light text-slate-300">{program.mode}</span>
                  <span className="px-2.5 py-1 rounded-lg bg-fuchsia-500/20 text-fuchsia-300">{program.prize}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-auto">
                  View Program
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
