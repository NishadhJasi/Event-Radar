import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/ui/Button";
import { eventsAPI } from "../services/api";

const inputClass =
  "w-full px-4 py-3 rounded-xl glass-light text-white placeholder:text-slate-500 border border-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 text-sm";

const labelClass = "block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider";

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

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [announcement, setAnnouncement] = useState("");
  const [editForm, setEditForm] = useState(null);

  // Custom Toast State
  const [toast, setToast] = useState(null);
  // Custom Delete Modal State
  const [deletingId, setDeletingId] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data } = await eventsAPI.getMyEvents();
      setEvents(data.events || []);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to load events.", "error");
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
      title: event.title || "",
      description: event.description || "",
      date: event.date ? event.date.split("T")[0] : "",
      location: event.location || "",
      category: event.category || "",
      organizer: event.organizer || "",
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
      const { data } = await eventsAPI.update(selected._id, editForm);
      showToast(data.message || "Event updated successfully!", "success");
      setSelected(null);
      setEditForm(null);
      loadEvents();
    } catch (error) {
      showToast(error.response?.data?.message || "Update failed.", "error");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const { data } = await eventsAPI.delete(deletingId);
      showToast(data.message || "Event deleted successfully!", "success");
      setSelected(null);
      setEditForm(null);
      setDeletingId(null);
      loadEvents();
    } catch (error) {
      showToast(error.response?.data?.message || "Delete failed.", "error");
    }
  };

  const handleAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcement.trim()) return;
    try {
      await eventsAPI.addAnnouncement(selected._id, announcement);
      showToast("Announcement posted successfully!", "success");
      setAnnouncement("");
      const { data } = await eventsAPI.getById(selected._id);
      setSelected(data.event);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to post announcement.", "error");
    }
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white">
              Manage <span className="text-gradient">Events</span>
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              Publish announcements, update descriptions, and track participants in real-time.
            </p>
          </div>
          <Button to="/create-event" variant="primary" size="md" className="flex items-center gap-1.5 shadow-lg shadow-indigo-500/20">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Create New Event
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 glass rounded-3xl border border-white/5">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-400 animate-spin" />
            </div>
            <p className="text-slate-400 font-semibold mt-4 text-sm">Loading events console...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 px-6 glass rounded-3xl border border-white/5 space-y-4">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-900/50 border border-white/10 flex items-center justify-center text-2xl">
              📂
            </div>
            <h3 className="text-lg font-bold text-white">No Events Listed</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              You haven't listed any events. Get started by publishing your very first event today!
            </p>
            <Button to="/create-event" variant="primary" size="md">
              Create First Event
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Events Sidebar list */}
            <div className="lg:col-span-5 space-y-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Select an Event</h3>
              {events.map((event) => {
                const isSelected = selected?._id === event._id;
                return (
                  <motion.div
                    key={event._id}
                    whileHover={{ x: 4 }}
                    className={`glass rounded-2xl p-5 cursor-pointer transition-all duration-300 border text-left ${
                      isSelected
                        ? "border-indigo-500/60 bg-indigo-500/5 shadow-lg shadow-indigo-500/5"
                        : "border-white/5 hover:border-white/15"
                    }`}
                    onClick={() => openManage(event)}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {event.title}
                      </h3>
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full glass-light text-indigo-300 border border-indigo-500/20">
                        {event.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
                      📅 {new Date(event.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                      <span className="text-xs text-slate-400 font-medium">
                        👥 {event.participants?.length || 0} Registered
                      </span>
                      <Link
                        to={`/events/${event._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
                      >
                        Public page
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Event Management Panel */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {selected && editForm ? (
                  <motion.div
                    key={selected._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-8 shadow-2xl"
                  >
                    <div>
                      <h2 className="text-2xl font-extrabold text-white">Management Desk</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Event: <span className="text-indigo-300 font-semibold">{selected.title}</span></p>
                    </div>

                    {/* Edit Form */}
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">
                        Edit Metadata
                      </h3>

                      <div>
                        <label className={labelClass}>Event Title</label>
                        <input
                          name="title"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className={inputClass}
                          placeholder="Title"
                          required
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Description</label>
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className={`${inputClass} resize-none`}
                          rows={4}
                          placeholder="Describe the event details..."
                          required
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Date</label>
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            className={inputClass}
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Category</label>
                          <select
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className={`${inputClass} cursor-pointer`}
                            required
                          >
                            <option value="" className="bg-slate-900">Select category</option>
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Location</label>
                          <input
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            className={inputClass}
                            placeholder="Location"
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Organizer Name</label>
                          <input
                            value={editForm.organizer}
                            onChange={(e) => setEditForm({ ...editForm, organizer: e.target.value })}
                            className={inputClass}
                            placeholder="Organizer Name"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Event Image URL</label>
                        <input
                          value={editForm.image}
                          onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                          className={inputClass}
                          placeholder="Image URL"
                        />
                        {editForm.image && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-white/10 h-32">
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

                      <div className="flex gap-3 pt-4 border-t border-white/5">
                        <button
                          type="submit"
                          className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all duration-300 shadow-lg shadow-indigo-600/20"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(selected._id)}
                          className="py-3 px-5 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 text-rose-300 font-semibold rounded-xl text-sm transition-all duration-300"
                        >
                          Delete Event
                        </button>
                      </div>
                    </form>

                    {/* Participants section */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">
                        Registered Students ({participants.length})
                      </h3>
                      <div className="glass-light rounded-2xl p-4 border border-white/5">
                        {participants.length === 0 ? (
                          <p className="text-slate-500 text-sm text-center py-4">No registrations yet.</p>
                        ) : (
                          <ul className="max-h-40 overflow-y-auto space-y-2.5 text-sm text-slate-300 custom-scrollbar pr-1">
                            {participants.map((p, idx) => (
                              <li key={p._id || idx} className="flex justify-between items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                                <div>
                                  <p className="font-bold text-white">{p.name}</p>
                                  <p className="text-xs text-slate-400">{p.email}</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                                  Student
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Post Announcement */}
                    <form onSubmit={handleAnnouncement} className="space-y-3">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">
                        Broadcast Announcement
                      </h3>
                      <textarea
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                        className={`${inputClass} resize-none`}
                        rows={2.5}
                        placeholder="Type a broadcast message (e.g. schedules, changes, requirements) to student notifications board..."
                        required
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl text-sm transition-all duration-300 text-center"
                      >
                        Send Broadcast Notice
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <div className="glass rounded-3xl p-12 text-center border border-white/5 text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="text-4xl mb-4">👈</div>
                    <h3 className="text-lg font-bold text-white mb-2">Select an Event</h3>
                    <p className="text-sm text-slate-400 max-w-xs mx-auto">
                      Choose an event from the sidebar left-pane to edit its properties, view registrations, and broadcast live announcements.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* RENDER DELETE CONFIRMATION OVERLAY */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Dialog */}
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
                <h3 className="text-lg font-extrabold text-white">Permanently Delete?</h3>
                <p className="text-slate-400 text-sm">
                  This event and all its registrations, analytics, and broadcasted announcements will be permanently removed.
                </p>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 px-4 bg-rose-500 hover:bg-rose-400 text-white font-semibold rounded-xl text-sm transition-all duration-300"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setDeletingId(null)}
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
