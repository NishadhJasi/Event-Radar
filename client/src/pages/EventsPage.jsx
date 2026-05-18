import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import SectionHeader from "../components/ui/SectionHeader";
import DynamicEventCard from "../components/events/DynamicEventCard";
import { eventsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["All", "Hackathon", "Workshop", "Cultural", "Sports", "Seminar", "Competition", "Meetup", "Other"];

const inputClass =
  "w-full px-4 py-3 rounded-xl glass-light text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition";

export default function EventsPage() {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== "All") params.category = category;
      const { data } = await eventsAPI.getAll(params);
      setEvents(data.events || []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleRegister = async (eventId) => {
    if (!isAuthenticated) {
      alert("Please log in to register for events.");
      return;
    }
    try {
      await eventsAPI.register(eventId);
      alert("Successfully registered!");
      fetchEvents();
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Discover"
          title="All campus events"
          subtitle="Search, filter, and register for events across colleges."
        />

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8 max-w-3xl mx-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, locations, organizers..."
            className={`${inputClass} flex-1`}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputClass} sm:w-48`}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-slate-900">
                {c}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-semibold hover:opacity-90 transition"
          >
            Search
          </button>
        </form>

        {loading ? (
          <p className="text-center text-slate-400 py-20">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-slate-500 py-20 text-lg">No events found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event, i) => (
              <DynamicEventCard
                key={event._id}
                event={event}
                index={i}
                showRegister={isAuthenticated}
                onRegister={handleRegister}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
