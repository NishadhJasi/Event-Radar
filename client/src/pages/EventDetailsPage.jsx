import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/ui/Button";
import { eventsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80";

export default function EventDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await eventsAPI.getById(id);
        setEvent(data.event);
      } catch {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      alert("Please log in to register.");
      return;
    }
    try {
      const { data } = await eventsAPI.register(id);
      setEvent(data.event);
      alert("Successfully registered!");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.");
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <p className="text-center text-slate-400 py-20">Loading...</p>
      </PageLayout>
    );
  }

  if (!event) {
    return (
      <PageLayout>
        <div className="max-w-lg mx-auto text-center glass rounded-2xl p-10">
          <h2 className="text-xl font-bold text-white mb-4">Event not found</h2>
          <Button to="/events" variant="primary">
            Back to events
          </Button>
        </div>
      </PageLayout>
    );
  }

  const dateStr = new Date(event.date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <Link to="/events" className="text-indigo-400 text-sm hover:text-indigo-300 mb-6 inline-block">
          ← Back to events
        </Link>

        <div className="glass rounded-3xl overflow-hidden border border-white/10">
          <div className="h-56 sm:h-72 overflow-hidden">
            <img
              src={event.image || DEFAULT_IMG}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 sm:p-10">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300">
              {event.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-2">{event.title}</h1>
            <p className="text-slate-400 mb-6">Organized by {event.organizer}</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8 text-sm">
              <div className="glass-light rounded-xl p-4">
                <p className="text-slate-500 mb-1">Date</p>
                <p className="text-white font-medium">{dateStr}</p>
              </div>
              <div className="glass-light rounded-xl p-4">
                <p className="text-slate-500 mb-1">Location</p>
                <p className="text-white font-medium">{event.location}</p>
              </div>
              <div className="glass-light rounded-xl p-4 sm:col-span-2">
                <p className="text-slate-500 mb-1">Participants</p>
                <p className="text-white font-medium">{event.participants?.length || 0} registered</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-white mb-2">About</h2>
            <p className="text-slate-400 leading-relaxed mb-8">{event.description}</p>

            {event.announcements?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-3">Announcements</h2>
                <ul className="space-y-2">
                  {event.announcements.map((a) => (
                    <li key={a._id} className="glass-light rounded-xl p-4 text-slate-300 text-sm">
                      {a.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {isAuthenticated ? (
              <Button variant="primary" size="lg" onClick={handleRegister}>
                Register for this event
              </Button>
            ) : (
              <Button to="/login" variant="primary" size="lg">
                Log in to register
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
