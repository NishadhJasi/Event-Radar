import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/ui/Button";
import { eventsAPI } from "../services/api";

const inputClass =
  "w-full px-4 py-3 rounded-xl glass-light text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition text-sm";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [announcement, setAnnouncement] = useState("");
  const [editForm, setEditForm] = useState(null);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data } = await eventsAPI.getMyEvents();
      setEvents(data.events || []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openManage = async (event) => {
    setSelected(event);
    setEditForm({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      location: event.location,
      category: event.category,
      image: event.image || "",
    });
    try {
      const { data } = await eventsAPI.getParticipants(event._id);
      setParticipants(data.participants || []);
    } catch {
      setParticipants([]);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await eventsAPI.update(selected._id, editForm);
      alert("Event updated!");
      setSelected(null);
      loadEvents();
    } catch (error) {
      alert(error.response?.data?.message || "Update failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await eventsAPI.delete(id);
      alert("Event deleted.");
      setSelected(null);
      loadEvents();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed.");
    }
  };

  const handleAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcement.trim()) return;
    try {
      await eventsAPI.addAnnouncement(selected._id, announcement);
      alert("Announcement posted!");
      setAnnouncement("");
      const { data } = await eventsAPI.getById(selected._id);
      setSelected(data.event);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to post announcement.");
    }
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Manage <span className="text-gradient">Events</span>
            </h1>
            <p className="text-slate-400 mt-1">Edit, delete, and manage participants.</p>
          </div>
          <Button to="/create-event" variant="primary" size="md">
            + Create event
          </Button>
        </div>

        {loading ? (
          <p className="text-slate-400 text-center py-16">Loading...</p>
        ) : events.length === 0 ? (
          <p className="text-slate-500 glass rounded-xl p-12 text-center">No events created yet.</p>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event._id}
                  className={`glass rounded-2xl p-5 cursor-pointer transition border ${
                    selected?._id === event._id
                      ? "border-indigo-500/50"
                      : "border-white/5 hover:border-white/10"
                  }`}
                  onClick={() => openManage(event)}
                >
                  <h3 className="font-bold text-white">{event.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {new Date(event.date).toLocaleDateString()} · {event.participants?.length || 0} participants
                  </p>
                  <Link
                    to={`/events/${event._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-indigo-400 text-sm mt-2 inline-block hover:underline"
                  >
                    View public page →
                  </Link>
                </div>
              ))}
            </div>

            {selected && editForm && (
              <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
                <h2 className="text-xl font-bold text-white">Edit event</h2>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <input
                    name="title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className={inputClass}
                    placeholder="Title"
                    required
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className={`${inputClass} resize-none`}
                    rows={3}
                    required
                  />
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className={inputClass}
                    required
                  />
                  <input
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className={inputClass}
                    placeholder="Location"
                    required
                  />
                  <input
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className={inputClass}
                    placeholder="Category"
                    required
                  />
                  <input
                    value={editForm.image}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                    className={inputClass}
                    placeholder="Image URL"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" variant="primary" size="sm" className="flex-1">
                      Save changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(selected._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </form>

                <div>
                  <h3 className="font-semibold text-white mb-2">
                    Participants ({participants.length})
                  </h3>
                  <ul className="max-h-32 overflow-y-auto space-y-1 text-sm text-slate-400">
                    {participants.length === 0 ? (
                      <li>No registrations yet.</li>
                    ) : (
                      participants.map((p) => (
                        <li key={p._id}>
                          {p.name} — {p.email}
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <form onSubmit={handleAnnouncement} className="space-y-2">
                  <h3 className="font-semibold text-white">Post announcement</h3>
                  <textarea
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    className={`${inputClass} resize-none`}
                    rows={2}
                    placeholder="Share an update with participants..."
                  />
                  <Button type="submit" variant="secondary" size="sm">
                    Post
                  </Button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
