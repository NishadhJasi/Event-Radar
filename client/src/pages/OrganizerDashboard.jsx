import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/ui/Button";
import DynamicEventCard from "../components/events/DynamicEventCard";
import { eventsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "Hackathon",
  "Workshop",
  "Cultural",
  "Sports",
  "Seminar",
  "Competition",
  "Meetup",
  "Other",
];

const inputClass =
  "w-full px-4 py-3 rounded-xl glass-light text-white placeholder:text-slate-500 border border-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 text-sm";

const labelClass = "block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider";

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    upcomingEvents: 0,
    avgParticipants: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Event Modal State
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    organizer: "",
    image: "",
  });

  // Delete Confirmation Modal State
  const [deletingEventId, setDeletingEventId] = useState(null);

  // Custom Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadDashboardData = async () => {
    try {
      const [eventsRes, statsRes] = await Promise.all([
        eventsAPI.getMyEvents(),
        eventsAPI.getOrganizerStats(),
      ]);

      const myEvents = eventsRes.data.events || [];
      setEvents(myEvents);

      const serverStats = statsRes.data.stats || { totalEvents: 0, totalParticipants: 0 };
      const now = new Date();
      const upcomingCount = myEvents.filter((e) => new Date(e.date) >= now).length;
      const avg =
        myEvents.length > 0
          ? Math.round(
              myEvents.reduce((sum, e) => sum + (e.participants?.length || 0), 0) / myEvents.length
            )
          : 0;

      setStats({
        totalEvents: serverStats.totalEvents,
        totalParticipants: serverStats.totalParticipants,
        upcomingEvents: upcomingCount,
        avgParticipants: avg,
      });
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to load dashboard data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Time-based greeting helper
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 17) return "Good afternoon";
    return "Good evening";
  };

  // Edit action
  const handleOpenEdit = (event) => {
    setEditingEvent(event);
    setEditForm({
      title: event.title || "",
      description: event.description || "",
      date: event.date ? event.date.split("T")[0] : "",
      location: event.location || "",
      category: event.category || "",
      organizer: event.organizer || user?.name || "",
      image: event.image || "",
    });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;

    try {
      const { data } = await eventsAPI.update(editingEvent._id, editForm);
      showToast(data.message || "Event updated successfully!", "success");
      setEditingEvent(null);
      loadDashboardData();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update event.", "error");
    }
  };

  // Delete action
  const handleConfirmDelete = (id) => {
    setDeletingEventId(id);
  };

  const handleDeleteEvent = async () => {
    if (!deletingEventId) return;

    try {
      const { data } = await eventsAPI.delete(deletingEventId);
      showToast(data.message || "Event deleted successfully!", "success");
      setDeletingEventId(null);
      loadDashboardData();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to delete event.", "error");
    }
  };

  // Filter events by search
  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero Greeting Section */}
        <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 p-8 sm:p-10 border border-white/10 shadow-2xl">
          <div className="absolute right-0 top-0 -mr-20 -mt-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute left-1/3 bottom-0 -mb-20 h-60 w-60 rounded-full bg-purple-500/10 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
              Organizer Console
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              {getGreeting()},{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300">
                {user?.name || "Organizer"}
              </span>
            </h1>
            <p className="text-slate-300 mt-2 max-w-xl text-sm sm:text-base font-medium">
              Create, inspect, and manage your events efficiently. Real-time metrics are synced down below.
            </p>
          </motion.div>
        </div>

        {/* Analytics Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            {
              title: "Events Created",
              value: loading ? "—" : stats.totalEvents,
              icon: (
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
              color: "border-indigo-500/20 hover:border-indigo-500/40",
            },
            {
              title: "Total Participants",
              value: loading ? "—" : stats.totalParticipants,
              icon: (
                <svg className="w-5 h-5 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ),
              color: "border-fuchsia-500/20 hover:border-fuchsia-500/40",
            },
            {
              title: "Upcoming Events",
              value: loading ? "—" : stats.upcomingEvents,
              icon: (
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              color: "border-emerald-500/20 hover:border-emerald-500/40",
            },
            {
              title: "Avg. Registered",
              value: loading ? "—" : `${stats.avgParticipants} / event`,
              icon: (
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              color: "border-amber-500/20 hover:border-amber-500/40",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`glass rounded-2xl p-5 border ${item.color} shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-between group`}
            >
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{item.title}</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left">
                  {item.value}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-300">
                {item.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Shortcuts & Navigation Panel */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2.5">
            <Button to="/create-event" variant="primary" size="md" className="flex items-center gap-1.5 shadow-lg shadow-indigo-500/20">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Create New Event
            </Button>
            <Button to="/manage-events" variant="secondary" size="md" className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Manage Console
            </Button>
            <Button to="/events" variant="outline" size="md" className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Public Board
            </Button>
          </div>

          {/* Real-time search bar within Organizer Dashboard */}
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="h-4.5 w-4.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search your events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-light border border-white/5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Main Section */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <svg className="w-5.5 h-5.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Created Events
            </h2>
            <span className="text-xs font-semibold text-slate-400 px-3 py-1 rounded-full glass border border-white/5">
              Showing {filteredEvents.length} events
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 glass rounded-3xl border border-white/5">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-400 animate-spin" />
              </div>
              <p className="text-slate-400 font-semibold mt-4 text-sm">Fetching your events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16 px-6 glass rounded-3xl border border-white/5 space-y-4">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-900/50 border border-white/10 flex items-center justify-center text-2xl">
                📂
              </div>
              <h3 className="text-lg font-bold text-white">No Events Found</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                {searchQuery
                  ? "We couldn't find any events matching your search query. Try typing something else!"
                  : "You haven't listed any events yet. Publish one now to kickstart your journey!"}
              </p>
              {!searchQuery && (
                <Button to="/create-event" variant="primary" size="md">
                  Publish Your First Event
                </Button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, i) => (
                <DynamicEventCard
                  key={event._id}
                  event={event}
                  index={i}
                  onEdit={handleOpenEdit}
                  onDelete={handleConfirmDelete}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* RENDER EDIT MODAL OVERLAY */}
      <AnimatePresence>
        {editingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingEvent(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-3xl glass rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Edit Event Details</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Prefilled fields are ready for updating.</p>
                </div>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateEvent} className="space-y-5">
                <div>
                  <label className={labelClass}>Event Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    required
                    className={inputClass}
                    placeholder="E.g. PyCon India 2026"
                  />
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    required
                    rows={4}
                    className={`${inputClass} resize-none`}
                    placeholder="Provide a detailed description of the schedule, criteria, prizes, etc."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Date</label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      required
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="" className="bg-slate-900">Select category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      required
                      className={inputClass}
                      placeholder="E.g. Seminar Hall, campus"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Organizer Name</label>
                    <input
                      type="text"
                      value={editForm.organizer}
                      onChange={(e) => setEditForm({ ...editForm, organizer: e.target.value })}
                      required
                      className={inputClass}
                      placeholder="Your club or organization name"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Event Image URL</label>
                  <input
                    type="url"
                    value={editForm.image}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                    className={inputClass}
                    placeholder="https://images.unsplash.com/..."
                  />
                  {editForm.image && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-white/10 h-36">
                      <img
                        src={editForm.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold shadow-lg shadow-indigo-600/25 transition-all duration-300 text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 font-semibold transition-all duration-300 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RENDER DELETE CONFIRMATION MODAL OVERLAY */}
      <AnimatePresence>
        {deletingEventId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingEventId(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Dialog Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="relative z-10 w-full max-w-md glass rounded-3xl border border-white/10 p-6 shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 text-xl mx-auto mb-2">
                ⚠️
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-extrabold text-white">Delete this Event?</h3>
                <p className="text-slate-400 text-sm">
                  This action is permanent and cannot be undone. All student registrations associated with this event will be deleted as well.
                </p>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleDeleteEvent}
                  className="flex-1 py-3 px-4 bg-rose-500 hover:bg-rose-400 text-white font-semibold rounded-xl text-sm transition-colors duration-300"
                >
                  Yes, Delete Event
                </button>
                <button
                  onClick={() => setDeletingEventId(null)}
                  className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl text-sm transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RENDER TOAST ALERT SYSTEM */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl border text-sm font-semibold shadow-2xl flex items-center gap-3 backdrop-blur-xl max-w-sm w-full"
            style={{
              backgroundColor: toast.type === "success" ? "rgba(16, 185, 129, 0.12)" : "rgba(244, 63, 94, 0.12)",
              borderColor: toast.type === "success" ? "rgba(16, 185, 129, 0.3)" : "rgba(244, 63, 94, 0.3)",
              color: toast.type === "success" ? "#a7f3d0" : "#fecdd3",
            }}
          >
            <div className="text-base shrink-0">
              {toast.type === "success" ? "✅" : "❌"}
            </div>
            <div className="flex-1 leading-snug">{toast.message}</div>
            <button
              onClick={() => setToast(null)}
              className="p-1 hover:bg-white/10 rounded transition-colors text-xs text-slate-400 hover:text-white shrink-0"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
