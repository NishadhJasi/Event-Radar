import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import SectionHeader from "../components/ui/SectionHeader";
import DynamicEventCard from "../components/events/DynamicEventCard";
import { eventsAPI } from "../services/api";

export default function MyRegistrationsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await eventsAPI.getMyRegistrations();
        setEvents(data.events || []);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Your events"
          title="My registrations"
          subtitle="Events you have registered for."
        />
        {loading ? (
          <p className="text-center text-slate-400 py-20">Loading...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-slate-500 glass rounded-xl p-12">
            You haven&apos;t registered for any events yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <DynamicEventCard key={event._id} event={event} index={i} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
