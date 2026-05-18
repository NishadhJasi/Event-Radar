const Event = require("../models/event");
const Registration = require("../models/registration");

exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const alreadyRegistered = event.participants.some(
      (p) => p.userId.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ success: false, message: "You are already registered for this event." });
    }

    event.participants.push({
      userId: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
    await event.save();

    await Registration.findOneAndUpdate(
      { userId: req.user._id, eventId: event._id },
      { userId: req.user._id, eventId: event._id },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: "Successfully registered for event",
      event,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Already registered." });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id }).populate("eventId");
    const events = registrations
      .map((r) => r.eventId)
      .filter(Boolean);

    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentStats = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id }).populate("eventId");
    const registeredEvents = registrations.map((r) => r.eventId).filter(Boolean);
    const now = new Date();

    const upcoming = registeredEvents.filter((e) => new Date(e.date) >= now);
    const allEvents = await Event.find({ date: { $gte: now } }).sort({ date: 1 }).limit(6);

    res.status(200).json({
      success: true,
      stats: {
        registeredCount: registeredEvents.length,
        upcomingCount: upcoming.length,
      },
      registeredEvents,
      recommendedEvents: allEvents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
