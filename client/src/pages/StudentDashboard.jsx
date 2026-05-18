import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/ui/Button";
import DynamicEventCard from "../components/events/DynamicEventCard";
import { eventsAPI } from "../services/api";

export default function StudentDashboard() {
  const [stats, setStats] = useState({ registeredCount: 0, upcomingCount: 0 });
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await eventsAPI.getStudentStats();
        setStats(data.stats);
        setRegisteredEvents(data.registeredEvents || []);
        setRecommended(data.recommendedEvents || []);
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const upcoming = registeredEvents.filter((e) => new Date(e.date) >= new Date());

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Student <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-slate-400">Track your registrations and discover new events.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Registered Events", value: stats.registeredCount },
            { label: "Upcoming", value: stats.upcomingCount },
            { label: "Explore", value: "→", link: "/events" },
          ].map((item) => (
            <div key={item.label} className="glass rounded-2xl p-6 text-center">
              {item.link ? (
                <Link to={item.link} className="text-3xl font-bold text-gradient block">
                  {item.value}
                </Link>
              ) : (
                <p className="text-3xl font-bold text-gradient">{loading ? "—" : item.value}</p>
              )}
              <p className="text-slate-400 text-sm mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <Button to="/events" variant="primary" size="md">
            Browse all events
          </Button>
          <Button to="/my-registrations" variant="secondary" size="md">
            My registrations
          </Button>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Your upcoming events</h2>
          {upcoming.length === 0 ? (
            <p className="text-slate-500 glass rounded-xl p-8 text-center">No upcoming registrations yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.slice(0, 3).map((event, i) => (
                <DynamicEventCard key={event._id} event={event} index={i} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Recommended for you</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.slice(0, 3).map((event, i) => (
              <DynamicEventCard key={event._id} event={event} index={i} />
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
