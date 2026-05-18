import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

export const eventsAPI = {
  getAll: (params) => api.get("/events", { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post("/events", data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getMyEvents: () => api.get("/events/my-events"),
  register: (id) => api.post(`/events/${id}/register`),
  getMyRegistrations: () => api.get("/events/my-registrations"),
  getStudentStats: () => api.get("/events/student-stats"),
  getOrganizerStats: () => api.get("/events/organizer-stats"),
  getParticipants: (id) => api.get(`/events/${id}/participants`),
  addAnnouncement: (id, message) => api.post(`/events/${id}/announcements`, { message }),
};

export default api;
