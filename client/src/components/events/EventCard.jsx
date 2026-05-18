import { motion } from "framer-motion";
import Button from "../ui/Button";

export default function EventCard({ event, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      className="group glass rounded-2xl overflow-hidden flex flex-col h-full transition-shadow duration-300 hover:shadow-2xl hover:shadow-indigo-500/10"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.img}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full glass text-indigo-200">
          {event.category}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
          {event.title}
        </h3>
        <div className="space-y-1.5 text-sm text-slate-400">
          <p className="flex items-center gap-2">
            <CalendarIcon />
            {event.date}
          </p>
          <p className="flex items-center gap-2">
            <CollegeIcon />
            {event.college}
          </p>
        </div>
        <p className="text-xs text-slate-500">{event.spots} spots left</p>
        <Button variant="primary" size="sm" className="w-full mt-auto">
          Register Now
        </Button>
      </div>
    </motion.article>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function CollegeIcon() {
  return (
    <svg className="w-4 h-4 text-fuchsia-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
