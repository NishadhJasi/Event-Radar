import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/ui/Button";
import { eventsAPI } from "../services/api";

const INITIAL_FORM = {
  title: "",
  description: "",
  date: "",
  location: "",
  category: "",
  image: "",
};

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
  "w-full px-4 py-3.5 rounded-xl glass-light text-white placeholder:text-slate-500 border border-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300";

const labelClass = "block text-sm font-medium text-slate-300 mb-2";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await eventsAPI.create(formData);
      alert(response.data.message || "Event created successfully!");
      setFormData(INITIAL_FORM);
      navigate("/manage-events");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create event. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full glass text-indigo-300 border border-indigo-500/30">
            Organizer
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Create an <span className="text-gradient">Event</span>
          </h1>
          <p className="text-slate-400">Publish your event to thousands of students.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6"
        >
          <div>
            <label htmlFor="title" className={labelClass}>Event Title</label>
            <input id="title" name="title" value={formData.title} onChange={handleChange} required className={inputClass} placeholder="CodeStorm Hackathon 2026" />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} className={`${inputClass} resize-none`} placeholder="Describe your event..." />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className={labelClass}>Date</label>
              <input id="date" type="date" name="date" value={formData.date} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label htmlFor="category" className={labelClass}>Category</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange} required className={`${inputClass} cursor-pointer`}>
                <option value="" className="bg-slate-900">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="location" className={labelClass}>Location</label>
            <input id="location" name="location" value={formData.location} onChange={handleChange} required className={inputClass} placeholder="Main Auditorium, IIT Delhi" />
          </div>

          <div>
            <label htmlFor="image" className={labelClass}>Event Image URL</label>
            <input id="image" type="url" name="image" value={formData.image} onChange={handleChange} className={inputClass} placeholder="https://images.unsplash.com/..." />
            {formData.image && (
              <div className="mt-4 rounded-xl overflow-hidden border border-white/10 h-40">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" variant="primary" size="lg" className="flex-1" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </Button>
            <Button to="/organizer-dashboard" variant="secondary" size="lg" className="flex-1">
              Cancel
            </Button>
          </div>
        </motion.form>
      </div>
    </PageLayout>
  );
}
