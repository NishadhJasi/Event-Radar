const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  getMyEvents,
  updateEvent,
  deleteEvent,
  getParticipants,
  addAnnouncement,
  getOrganizerStats,
} = require("../controllers/eventController");
const {
  registerForEvent,
  getMyRegistrations,
  getStudentStats,
} = require("../controllers/registrationController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

// Public
router.get("/", getEvents);

// Protected — static paths first (before /:id)
router.get("/my-registrations", protect, authorize("student", "organizer"), getMyRegistrations);
router.get("/student-stats", protect, authorize("student", "organizer"), getStudentStats);
router.get("/organizer-stats", protect, authorize("organizer"), getOrganizerStats);
router.get("/my-events", protect, authorize("organizer"), getMyEvents);

router.post("/", protect, authorize("organizer"), createEvent);

// Dynamic id routes
router.get("/:id/participants", protect, authorize("organizer"), getParticipants);
router.post("/:id/register", protect, authorize("student", "organizer"), registerForEvent);
router.post("/:id/announcements", protect, authorize("organizer"), addAnnouncement);
router.put("/:id", protect, authorize("organizer"), updateEvent);
router.delete("/:id", protect, authorize("organizer"), deleteEvent);
router.get("/:id", getEventById);

module.exports = router;
