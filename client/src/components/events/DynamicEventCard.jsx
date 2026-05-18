import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../ui/Button";

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80";

export default function DynamicEventCard({ event, index = 0, showRegister = false, onRegister }) {
  const dateStr = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className="group glass rounded-2xl overflow-hidden flex flex-col h-full border border-white/5 hover:border-indigo-500/30 transition-all duration-300"
    >
      <Link to={`/events/${event._id}`} className="block relative h-44 overflow-hidden">
        <img
          src={event.image || DEFAULT_IMG}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full glass text-indigo-200">
          {event.category}
        </span>
      </Link>

      <div className="p-5 flex flex-col flex-1 gap-2">
        <Link to={`/events/${event._id}`}>
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition line-clamp-2">
            {event.title}
          </h3>
        </Link>
        <p className="text-sm text-slate-400">{dateStr}</p>
        <p className="text-sm text-slate-500 line-clamp-1">{event.location}</p>
        <p className="text-xs text-indigo-300/80">by {event.organizer}</p>

        <div className="flex gap-2 mt-auto pt-3">
          <Button to={`/events/${event._id}`} variant="secondary" size="sm" className="flex-1">
            Details
          </Button>
          {showRegister && onRegister && (
            <Button variant="primary" size="sm" className="flex-1" onClick={() => onRegister(event._id)}>
              Register
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
