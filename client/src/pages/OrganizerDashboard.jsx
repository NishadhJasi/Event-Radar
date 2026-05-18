import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/ui/Button";
import DynamicEventCard from "../components/events/DynamicEventCard";
import { eventsAPI } from "../services/api";

export default function OrganizerDashboard() {
  const [stats, setStats] = useState({ totalEvents: 0, totalParticipants: 0 });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, eventsRes] = await Promise.all([
          eventsAPI.getOrganizerStats(),
          eventsAPI.getMyEvents(),
        ]);
        setStats(statsRes.data.stats);
        setEvents(eventsRes.data.events || []);
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Organizer <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-slate-400">Manage your events and track participants.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="glass rounded-2xl p-6">
            <p className="text-3xl font-bold text-gradient">{loading ? "—" : stats.totalEvents}</p>
            <p className="text-slate-400 text-sm mt-1">Events created</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="text-3xl font-bold text-gradient">{loading ? "—" : stats.totalParticipants}</p>
            <p className="text-slate-400 text-sm mt-1">Total participants</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <Button to="/create-event" variant="primary" size="md">
            + Create event
          </Button>
          <Button to="/manage-events" variant="secondary" size="md">
            Manage events
          </Button>
          <Button to="/events" variant="outline" size="md">
            Browse all events
          </Button>
        </div>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Your recent events</h2>
          {events.length === 0 ? (
            <p className="text-slate-500 glass rounded-xl p-8 text-center">
              No events yet. Create your first event!
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map((event, i) => (
                <DynamicEventCard key={event._id} event={event} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
