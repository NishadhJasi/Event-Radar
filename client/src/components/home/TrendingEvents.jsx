import { trendingEvents } from "../../data/mockData";
import EventCard from "../events/EventCard";
import SectionHeader from "../ui/SectionHeader";

export default function TrendingEvents({ searchQuery = "" }) {
  const filtered = trendingEvents.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="events" className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Trending Now"
          title="Hot events on campus"
          subtitle="Register for the most popular hackathons, fests, and workshops happening right now."
        />
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 py-16 text-lg">
            No events match your search. Try another keyword.
          </p>
        )}
      </div>
    </section>
  );
}
